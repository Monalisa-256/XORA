#!/usr/bin/env python3
"""Read-only structural validation for normalized archives and source repositories.

Never executes scripts from untrusted archives, install steps, or app code.
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import sys
import zipfile
from zip_guard import MANIFEST, GuardError, PROJECT_MARKERS, digest, safe_path, validate_zip_file


def validate_project_files(files: dict[str, bytes]) -> dict:
    errors: list[str] = []
    warnings: list[str] = []
    normalized = set()
    for p in files:
        safe_path(p)
        key = p.casefold()
        if key in normalized:
            errors.append(f'Duplicate case-insensitive path: {p}')
        normalized.add(key)
        if p.lower().endswith('.zip'):
            errors.append(f'Unexpanded nested ZIP: {p}')
    # Support an app at the root or inside a documentation bundle, without
    # assuming that all projects use Node.js.
    pkg_paths = [p for p in files if p == 'package.json' or p.endswith('/package.json')]
    pkg_count = 0
    for pkg_path in sorted(pkg_paths):
        # Ignore node_modules because the extractor must never emit it.
        prefix = pkg_path[:-len('package.json')]
        if prefix.count('/') > 5:
            continue
        try:
            pkg = json.loads(files[pkg_path])
        except (ValueError, UnicodeDecodeError) as e:
            errors.append(f'Invalid JSON: {pkg_path} ({e})')
            continue
        if not isinstance(pkg, dict):
            errors.append(f'Not a JSON object: {pkg_path}')
            continue
        pkg_count += 1
        if 'scripts' in pkg and (not isinstance(pkg['scripts'], dict) or not all(isinstance(v, str) for v in pkg['scripts'].values())):
            errors.append(f'package.json scripts must map to strings: {pkg_path}')
        deps = dict(pkg.get('dependencies') or {})
        if 'next' in deps and not any((prefix + route) in files for route in
                                      ('src/app/page.tsx', 'src/app/page.jsx', 'src/app/page.js',
                                       'app/page.tsx', 'app/page.jsx', 'app/page.js',
                                       'pages/index.tsx', 'pages/index.jsx', 'pages/index.js',
                                       'src/pages/index.tsx', 'src/pages/index.jsx', 'src/pages/index.js')):
            errors.append(f'Next.js project has no homepage entrypoint under {prefix or "root"}')
        for lockname in ('package-lock.json', 'npm-shrinkwrap.json'):
            lock = prefix + lockname
            if lock in files:
                try:
                    val = json.loads(files[lock])
                    if isinstance(val, dict) and val.get('name') and pkg.get('name') and val['name'] != pkg['name']:
                        warnings.append(f'Package-lock name differs from package name: {lock}')
                except (UnicodeError, ValueError) as e:
                    errors.append(f'Invalid JSON: {lock}: {e}')
        tsconfig = prefix + 'tsconfig.json'
        if tsconfig in files:
            try:
                json.loads(files[tsconfig])
            except (UnicodeError, ValueError) as e:
                errors.append(f'Invalid JSON: {tsconfig}: {e}')
    if not any(Path(n).name in PROJECT_MARKERS for n in files):
        warnings.append('No recognized code project marker; archive may be documentation or design assets')
    return {'file_count': len(files), 'package_json_files_checked': pkg_count, 'errors': errors, 'warnings': warnings}


def verify_repo_layout(files: dict[str, bytes]) -> list[str]:
    required = (
        'package.json', 'README.md', 'src/app/page.tsx',
        'scripts/zip_guard.py', 'scripts/verify_repo.py', 'tests/test_zip_guard.py',
        '.github/workflows/zip-extract-validate-update.yml',
    )
    errors = [f'Missing repository root file: {f}' for f in required if f not in files]
    for name in files:
        if name.startswith(('XORA_APP/', 'XORA_ZIP_WORKFLOW/')):
            errors.append(f'Redundant repository wrapper: {name}')
    return errors


def verify_distinct_contents(files: dict[str, bytes]) -> list[str]:
    seen: dict[str, str] = {}
    errors = []
    for name, content in sorted(files.items()):
        sha = digest(content)
        if sha in seen:
            errors.append(f'Repeated identical file content: {name} duplicates {seen[sha]}')
        else:
            seen[sha] = name
    return errors


def validate_archive(path: Path, *, require_root_layout: bool = False, no_duplicate_content: bool = False) -> dict:
    manifest = validate_zip_file(path)
    with zipfile.ZipFile(path) as z:
        files = {n: z.read(n) for n in z.namelist() if n != MANIFEST and not n.endswith('/')}
    result = validate_project_files(files)
    if require_root_layout and manifest['repository_sync']['status'] in ('synchronized', 'source_only'):
        result['errors'].extend(verify_repo_layout(files))
    if no_duplicate_content:
        result['errors'].extend(verify_distinct_contents(files))
    result['archive'] = str(path)
    result['sha256'] = digest(path.read_bytes())
    result['manifest_file_count'] = manifest['file_count']
    result['repository_sync'] = manifest['repository_sync']['status']
    return result


def main(argv=None):
    p = argparse.ArgumentParser(description='Validate generated ZIP manifests and source project structure')
    p.add_argument('--archive-dir', default='dist/normalized')
    p.add_argument('--report', default='dist/reports/repository-validation.json')
    p.add_argument('--require-sync', action='store_true', help='Fail if all archives lack repo synchronization')
    p.add_argument('--require-root-layout', action='store_true', help='Validate canonical repository structure for synchronized app archives')
    p.add_argument('--no-duplicate-content', action='store_true', help='Reject equal SHA-256 payloads at different paths')
    args = p.parse_args(argv)
    root = Path(args.archive_dir)
    archives = sorted(root.glob('*.validated.zip'))
    if not archives:
        print(f'ERROR: No validated archives in {root}', file=sys.stderr)
        return 1
    outcomes = []
    for a in archives:
        try:
            outcome = validate_archive(a, require_root_layout=args.require_root_layout, no_duplicate_content=args.no_duplicate_content)
        except (GuardError, OSError, zipfile.BadZipFile, ValueError) as err:
            outcome = {'archive': str(a), 'errors': [str(err)], 'warnings': []}
        outcomes.append(outcome)
        if outcome['errors']:
            print(f'FAIL {a}: {outcome["errors"]}', file=sys.stderr)
        else:
            print(f'PASS {a}: {outcome.get("file_count")} files; {outcome.get("package_json_files_checked")} package definitions')
        for w in outcome['warnings']:
            print(f'WARN {a}: {w}')
    errors = any(o['errors'] for o in outcomes)
    if args.require_sync and not any(o.get('repository_sync') in ('source_only', 'synchronized') for o in outcomes):
        errors = True
        print('ERROR: No archives were synchronized to checked-out repository source', file=sys.stderr)
    result_file = Path(args.report)
    result_file.parent.mkdir(parents=True, exist_ok=True)
    result_file.write_text(json.dumps({'archives': outcomes, 'passed': not errors}, indent=2) + '\n')
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
