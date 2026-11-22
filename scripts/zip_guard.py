#!/usr/bin/env python3
"""Validate, safely extract and rebuild arbitrary ZIP files; Python standard library only.

Intentional policy: strip redundant archive *wrappers*, not src/app/docs paths.
The resulting ZIP preserves a working repository's directory layout, but contains
no ZIP-inside-ZIP, unsafe entries, duplicate target paths, or stale repo overlays.
"""
from __future__ import annotations

import argparse
import fnmatch
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import sys
import tempfile
import zipfile

MANIFEST = 'ZIP_GUARD_MANIFEST.json'
BLOCKED_DIRS = {'.git', '.next', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'coverage', '.turbo', '__MACOSX'}
PROJECT_DIRS = {'src', 'app', 'pages', 'public', 'assets', 'docs', 'tests', 'test', 'lib', 'scripts', 'tools', '.github', '.vscode', 'components', 'styles', 'config', 'api', 'prisma', 'db', 'database', 'migrations', 'packages', 'apps', 'examples', 'bin'}
PROJECT_MARKERS = {'package.json', 'pyproject.toml', 'go.mod', 'Cargo.toml', 'composer.json', 'Gemfile', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'requirements.txt'}
SENSITIVE_BASENAMES = {'.env', '.env.local', '.env.production', '.env.development', '.env.staging', 'id_rsa', 'id_ed25519', 'credentials.json', 'service-account.json', 'service_account.json', 'secrets.json'}
SENSITIVE_SUFFIXES = ('.pem', '.p12', '.pfx', '.key', '.jks', '.keystore')
MAX_FILES = 15000
MAX_TOTAL_BYTES = 512 * 1024 * 1024
MAX_FILE_BYTES = 64 * 1024 * 1024
MAX_EXPANSION_RATIO = 300
MAX_NESTED_DEPTH = 3


class GuardError(Exception):
    pass


def digest(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def safe_path(name: str) -> str:
    if not isinstance(name, str) or not name or '\x00' in name or '\\' in name:
        raise GuardError(f'Invalid ZIP member path: {name!r}')
    if name.startswith('/') or name.startswith('~') or re.match(r'^[A-Za-z]:', name):
        raise GuardError(f'Absolute or drive ZIP path rejected: {name!r}')
    if any(ord(c) < 32 or ord(c) == 127 for c in name):
        raise GuardError(f'Control character in member name: {name!r}')
    parts = name.rstrip('/').split('/')
    if any(x in ('', '.', '..') for x in parts):
        raise GuardError(f'Noncanonical or traversal path rejected: {name!r}')
    if len(parts) > 24 or len(name) > 650:
        raise GuardError(f'ZIP path too deep/long: {name!r}')
    if parts[-1].casefold() == MANIFEST.casefold():
        return MANIFEST  # old generated manifests are handled below
    return '/'.join(parts)


def check_member_type(info: zipfile.ZipInfo) -> None:
    mode = (info.external_attr >> 16)
    kind = stat.S_IFMT(mode)
    if kind not in (0, stat.S_IFREG, stat.S_IFDIR):
        raise GuardError(f'Symlink, device, or special archive member rejected: {info.filename}')
    if info.flag_bits & 0x1:
        raise GuardError(f'Encrypted ZIP entry rejected: {info.filename}')
    if info.file_size > MAX_FILE_BYTES:
        raise GuardError(f'Oversized file (>64 MiB): {info.filename}')
    if info.file_size > 1_000_000 and info.file_size / max(info.compress_size, 1) > MAX_EXPANSION_RATIO:
        raise GuardError(f'Suspicious compression ratio: {info.filename}')


def is_sensitive(path: str) -> bool:
    base = PurePosixPath(path).name.lower()
    return (base in SENSITIVE_BASENAMES or base.startswith('.env.') and not base.endswith('.example')
            or base.endswith(SENSITIVE_SUFFIXES) or base == '.npmrc' and False)


def ignored(path: str) -> bool:
    parts = PurePosixPath(path).parts
    return any(p in BLOCKED_DIRS for p in parts[:-1]) or parts[-1] in ('.DS_Store', 'Thumbs.db')


def unwrap_redundant_root(names: list[str]) -> tuple[list[str], list[str]]:
    """Strip shared outer folder(s), but never consume legitimate source folders."""
    stripped = []
    current = list(names)
    while current and all('/' in x for x in current):
        heads = {x.split('/', 1)[0] for x in current}
        if len(heads) != 1:
            break
        head = next(iter(heads))
        if head in PROJECT_DIRS or head in BLOCKED_DIRS or head.startswith('.'):
            break
        current = [x.split('/', 1)[1] for x in current]
        stripped.append(head)
    return current, stripped


class Collector:
    def __init__(self):
        self.files: dict[str, bytes] = {}
        self.mode: dict[str, int] = {}
        self.origin: dict[str, str] = {}
        self.casing: dict[str, str] = {}
        self.duplicates = 0
        self.nested_expanded = 0
        self.skipped_generated = 0
        self.stripped_roots: list[str] = []
        self.total_bytes = 0
        self.processed_entries = 0
        self.declared_uncompressed_bytes = 0

    def add(self, name: str, content: bytes, mode: int, origin: str, *, overlay: bool = False):
        key = name.casefold()
        oldcase = self.casing.get(key)
        if oldcase and oldcase != name:
            raise GuardError(f'Case-insensitive filename collision: {oldcase!r} vs {name!r}')
        if is_sensitive(name):
            raise GuardError(f'Possible secret file rejected: {name}')
        if ignored(name):
            self.skipped_generated += 1
            return
        if name == MANIFEST:
            self.skipped_generated += 1
            return
        if len(content) > MAX_FILE_BYTES:
            raise GuardError(f'File above size limit: {name}')
        existing = self.files.get(name)
        if existing is not None:
            if existing == content:
                self.duplicates += 1
                return
            if not overlay:
                raise GuardError(f'Conflicting repeated path: {name} (from {self.origin[name]} vs {origin})')
            self.total_bytes -= len(existing)
        elif len(self.files) >= MAX_FILES:
            raise GuardError(f'Maximum file count exceeded ({MAX_FILES})')
        self.total_bytes += len(content)
        if self.total_bytes > MAX_TOTAL_BYTES:
            raise GuardError('Maximum total uncompressed bytes exceeded')
        self.files[name] = content
        self.mode[name] = mode & 0o777 or 0o644
        self.origin[name] = origin
        self.casing[key] = name

    def ingest_zip(self, blob: bytes, label: str, depth: int = 0):
        if depth > MAX_NESTED_DEPTH:
            raise GuardError(f'Nested ZIP exceeds permitted depth {MAX_NESTED_DEPTH}: {label}')
        try:
            zf = zipfile.ZipFile(io.BytesIO(blob))
        except (ValueError, zipfile.BadZipFile, OSError) as e:
            raise GuardError(f'Unreadable ZIP {label}: {e}') from e
        with zf:
            infos: list[tuple[zipfile.ZipInfo, str]] = []
            if len(zf.infolist()) > MAX_FILES:
                raise GuardError(f'Too many ZIP members in {label}')
            for info in zf.infolist():
                check_member_type(info)
                self.processed_entries += 1
                self.declared_uncompressed_bytes += info.file_size
                if self.processed_entries > MAX_FILES or self.declared_uncompressed_bytes > MAX_TOTAL_BYTES:
                    raise GuardError('Total nested ZIP member count / declared bytes exceed safety budget')
                name = safe_path(info.filename)
                if info.is_dir():
                    continue
                if is_sensitive(name):
                    raise GuardError(f'Possible secret in archive {label}: {name}')
                if ignored(name):
                    self.skipped_generated += 1
                    continue
                if name == MANIFEST:
                    self.skipped_generated += 1
                    continue
                infos.append((info, name))
            if not infos:
                raise GuardError(f'No acceptable files in ZIP: {label}')
            unwrapped, wrappers = unwrap_redundant_root([name for _, name in infos])
            self.stripped_roots.extend(f'{label}/{w}' for w in wrappers)
            for (info, original_name), name in zip(infos, unwrapped):
                name = safe_path(name)
                if info.file_size > MAX_TOTAL_BYTES - max(self.total_bytes, 0):
                    # An existing name might be replaced/deduped; still fail-closed for bombs.
                    raise GuardError(f'Archive exceeds extraction budget: {label}')
                with zf.open(info) as fd:
                    # Size limited even if dishonest ZIP headers.
                    content = fd.read(MAX_FILE_BYTES + 1)
                    if len(content) > MAX_FILE_BYTES:
                        raise GuardError(f'Oversized decompressed file: {name}')
                    if fd.read(1):
                        raise GuardError(f'Member stream unexpectedly exceeds limit: {name}')
                if name.lower().endswith('.zip'):
                    self.nested_expanded += 1
                    if not zipfile.is_zipfile(io.BytesIO(content)):
                        raise GuardError(f'Invalid nested ZIP at {label}/{original_name}')
                    # Nested files are merged at repository root; parent ZIP file is omitted.
                    self.ingest_zip(content, f'{label}!/{original_name}', depth + 1)
                else:
                    self.add(name, content, info.external_attr >> 16, f'{label}:{original_name}')


def get_repo_source(root: Path, explicit: str) -> Path | None:
    root = root.resolve()
    if explicit and explicit != 'auto':
        p = (root / explicit).resolve()
        if not p.is_relative_to(root) or not p.is_dir():
            raise GuardError('--source-root is outside repository or missing')
        if not any((p / marker).is_file() for marker in PROJECT_MARKERS):
            raise GuardError(f'--source-root has no recognized project marker: {p}')
        return p
    if any((root / m).is_file() for m in PROJECT_MARKERS):
        return root
    candidates = []
    for p in root.iterdir():
        if p.is_dir() and p.name not in BLOCKED_DIRS and any((p / m).is_file() for m in PROJECT_MARKERS):
            candidates.append(p)
    return candidates[0] if len(candidates) == 1 else None


def source_files(root: Path):
    for p in sorted(root.rglob('*')):
        if p.is_symlink():
            raise GuardError(f'Repo source symlink rejected: {p}')
        if not p.is_file():
            continue
        name = p.relative_to(root).as_posix()
        safe_path(name)
        if ignored(name) or name == MANIFEST or name.lower().endswith('.zip'):
            continue
        if is_sensitive(name):
            # Secrets remain local: never copy into artifact.
            continue
        if p.stat().st_size > MAX_FILE_BYTES:
            raise GuardError(f'Repo source file over limit: {name}')
        yield name, p.read_bytes(), stat.S_IMODE(p.stat().st_mode)


def same_named_project(c: Collector, repo_source: Path) -> bool:
    """Match package name, not archive filename or wrapper directory."""
    candidate = repo_source / 'package.json'
    if not candidate.is_file():
        return False
    try:
        expected = json.loads(candidate.read_text(encoding='utf-8')).get('name')
        if not isinstance(expected, str) or not expected:
            return False
        for name, contents in c.files.items():
            if name == 'package.json' or name.endswith('/package.json'):
                if json.loads(contents).get('name') == expected:
                    return True
    except (ValueError, UnicodeError, OSError, AttributeError):
        return False
    return False


def sync_repository(c: Collector, repo_source: Path | None, repo_root: Path, *, strict: bool = False) -> dict:
    if repo_source is None:
        return {'status': 'not_detected', 'updated_files': 0}
    relative = repo_source.relative_to(repo_root).as_posix()
    if strict and same_named_project(c, repo_source):
        # Trust the checked-out repo as canonical, including deletions and renames.
        # The input ZIP was already parsed and vetted before this replacement.
        old_count = len(c.files)
        c.files.clear()
        c.mode.clear()
        c.origin.clear()
        c.casing.clear()
        c.total_bytes = 0
        count = 0
        for name, data, mode in source_files(repo_source):
            c.add(name, data, mode, f'authoritative-repository:{relative}/{name}')
            count += 1
        if not count:
            raise GuardError('Authoritative repository is empty')
        return {'status': 'synchronized', 'policy': 'source-of-truth',
                'source_root': relative, 'archive_prefix': '',
                'checked_files': count, 'replaced_archive_entries': old_count,
                'updated_files': count}
    if strict and not same_named_project(c, repo_source):
        return {'status': 'not_same_project', 'source_root': relative, 'updated_files': 0}
    prefix = ''
    # Only overlay an archive if this is the same project. A documentation-only
    # archive is not converted into an unrelated source archive.
    if not any(m in c.files for m in PROJECT_MARKERS):
        candidate = relative.rstrip('/') + '/'
        if relative != '.' and any(candidate + m in c.files for m in PROJECT_MARKERS):
            prefix = candidate
        else:
            return {'status': 'not_same_project', 'source_root': relative, 'updated_files': 0}
    changed = 0
    overlaid = 0
    for name, data, mode in source_files(repo_source):
        target = prefix + name
        old = c.files.get(target)
        if old != data:
            changed += 1
        c.add(target, data, mode, f'checked-out-repo:{relative}/{name}', overlay=True)
        overlaid += 1
    if not overlaid:
        raise GuardError('Source root is empty after safe exclusions')
    return {'status': 'synchronized', 'source_root': relative, 'archive_prefix': prefix,
            'checked_files': overlaid, 'updated_files': changed}


def build_manifest(c: Collector, label: str, source_digest: str, sync_info: dict):
    return {
        'format': 'zip-guard-v1',
        'source_archive': label,
        'source_sha256': source_digest,
        'repository_sync': sync_info,
        'file_count': len(c.files),
        'duplicate_members_removed': c.duplicates,
        'nested_archives_expanded': c.nested_expanded,
        'generated_files_skipped': c.skipped_generated,
        'unwrapped_outer_folders': c.stripped_roots,
        'files': [{'path': n, 'sha256': digest(c.files[n]), 'size': len(c.files[n])} for n in sorted(c.files)],
    }


def zip_info(name: str, mode: int):
    z = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    z.compress_type = zipfile.ZIP_DEFLATED
    z.create_system = 3
    z.external_attr = (stat.S_IFREG | mode) << 16
    return z


def validate_zip_file(path: Path):
    with zipfile.ZipFile(path) as z:
        names = [x.filename for x in z.infolist() if not x.is_dir()]
        if len(names) != len(set(names)) or len(names) != len({n.casefold() for n in names}):
            raise GuardError('Duplicate paths in generated archive')
        if any(n.lower().endswith('.zip') for n in names):
            raise GuardError('Nested ZIP remains in generated archive')
        if z.testzip() is not None:
            raise GuardError('Generated ZIP CRC validation failed')
        if MANIFEST not in names:
            raise GuardError('Generated ZIP missing manifest')
        manifest = json.loads(z.read(MANIFEST))
        file_names = set(names) - {MANIFEST}
        expected = {f['path']: f for f in manifest['files']}
        if file_names != set(expected):
            raise GuardError('Manifest file list differs from actual ZIP')
        for name in sorted(file_names):
            if digest(z.read(name)) != expected[name]['sha256']:
                raise GuardError(f'Manifest digest mismatch: {name}')
        if len(file_names) != manifest['file_count']:
            raise GuardError('Manifest file count mismatch')
        return manifest


def write_extracted(output_dir: Path, c: Collector):
    output_dir = output_dir.resolve()
    # Remove stale files in the output folder, but only that user-specified folder.
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    for name in sorted(c.files):
        p = (output_dir / name).resolve()
        if not p.is_relative_to(output_dir):
            raise GuardError(f'Unsafe normalized extraction path: {name}')
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(c.files[name])
        p.chmod(c.mode[name])


def process(path: Path | None, repo: Path, source_root: Path | None, target: Path,
            report_path: Path, extract_path: Path | None, no_overlay: bool, strict_repo_sync: bool = False):
    c = Collector()
    if path is None:
        if source_root is None:
            raise GuardError('No ZIP found and no recognized repository source root')
        for n, data, mode in source_files(source_root):
            c.add(n, data, mode, f'repository:{source_root}/{n}')
        if not c.files:
            raise GuardError('No repository files to pack')
        input_label = '(repository-source-only)'
        orig_digest = digest('source-only'.encode())
        sync_info = {'status': 'source_only', 'source_root': source_root.relative_to(repo).as_posix(), 'updated_files': len(c.files)}
    else:
        if not path.is_file() or not zipfile.is_zipfile(path):
            raise GuardError(f'Not a valid ZIP: {path}')
        input_label = path.relative_to(repo).as_posix() if path.is_relative_to(repo) else path.name
        blob = path.read_bytes()
        orig_digest = digest(blob)
        c.ingest_zip(blob, input_label)
        sync_info = {'status': 'disabled', 'updated_files': 0} if no_overlay else sync_repository(c, source_root, repo, strict=strict_repo_sync)
    manifest = build_manifest(c, input_label, orig_digest, sync_info)
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary_name = tempfile.mkstemp(prefix='.zip-guard-', suffix='.tmp', dir=target.parent)
    os.close(fd)
    tmp = Path(temporary_name)
    try:
        with zipfile.ZipFile(tmp, 'w', allowZip64=True) as z:
            for name in sorted(c.files):
                z.writestr(zip_info(name, c.mode[name]), c.files[name], compress_type=zipfile.ZIP_DEFLATED, compresslevel=7)
            z.writestr(zip_info(MANIFEST, 0o644), json.dumps(manifest, indent=2, sort_keys=True).encode('utf-8') + b'\n', compress_type=zipfile.ZIP_DEFLATED)
        validate_zip_file(tmp)
        tmp.replace(target)
    finally:
        tmp.unlink(missing_ok=True)
    if extract_path:
        write_extracted(extract_path, c)
    report = {'input': input_label, 'output': str(target), 'archive_sha256': digest(target.read_bytes()),
              'original_sha256': orig_digest, 'extracted_to': str(extract_path) if extract_path else None,
              'manifest': manifest}
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2, sort_keys=True) + '\n', encoding='utf8')
    return report


def discover(repo: Path, explicit: list[str], include: str):
    matches: list[Path] = []
    if explicit:
        for s in explicit:
            p = (repo / s).resolve() if not Path(s).is_absolute() else Path(s).resolve()
            if not p.exists():
                raise GuardError(f'ZIP path does not exist: {s}')
            if p.is_dir():
                matches += [f for f in p.rglob('*') if f.is_file() and f.suffix.lower() == '.zip' and not ignored(f.relative_to(repo).as_posix() if f.is_relative_to(repo) else f.name)]
            else:
                matches.append(p)
    else:
        matches = [p for p in repo.rglob('*') if p.is_file() and p.suffix.lower() == '.zip' and not ignored(p.relative_to(repo).as_posix())]
    matches = [p for p in matches if fnmatch.fnmatch(p.relative_to(repo).as_posix() if p.is_relative_to(repo) else p.name, include) or fnmatch.fnmatch(p.name, include)]
    return sorted(set(matches))


def main(argv: list[str] | None = None):
    parser = argparse.ArgumentParser(description='Safe ZIP extractor, deduplicator, repository validator and fresh archive rebuilder')
    parser.add_argument('--repo', default='.', help='Checked-out repository root (default: current directory)')
    parser.add_argument('--archive', action='append', default=[], help='ZIP file or folder; repeatable, arbitrary ZIP filenames')
    parser.add_argument('--glob', default='*', help='Filename/glob filter for auto-discovery (default: all .zip files)')
    parser.add_argument('--source-root', default='auto', help='Project source inside repo for freshness overlay; auto, ".", "XORA_APP", etc')
    parser.add_argument('--strict-repo-sync', action='store_true', help='For matching project package name, rebuild from checked-out source only (prunes stale archive files)')
    parser.add_argument('--no-overlay', action='store_true', help='Only normalize ZIP without syncing checked-out source files')
    parser.add_argument('--output-dir', default='dist/normalized', help='Output ZIP directory')
    parser.add_argument('--report-dir', default='dist/reports', help='Output JSON report directory')
    parser.add_argument('--extract-dir', default='', help='Optional directory for extracted files')
    parser.add_argument('--require-archive', action='store_true', help='Fail if no source ZIP exists; otherwise zip source repository')
    args = parser.parse_args(argv)
    try:
        repo = Path(args.repo).resolve()
        if not repo.is_dir():
            raise GuardError(f'Unknown repository root: {repo}')
        root = get_repo_source(repo, args.source_root)
        archives = discover(repo, args.archive, args.glob)
        if not archives and args.require_archive:
            raise GuardError('No ZIP archives found')
        if not archives:
            archives = [None]
        out = (repo / args.output_dir).resolve() if not Path(args.output_dir).is_absolute() else Path(args.output_dir)
        reports = (repo / args.report_dir).resolve() if not Path(args.report_dir).is_absolute() else Path(args.report_dir)
        ext = ((repo / args.extract_dir).resolve() if not Path(args.extract_dir).is_absolute() else Path(args.extract_dir)) if args.extract_dir else None
        if out == repo or reports == repo or ext == repo:
            raise GuardError('Cannot use repository root as generated output directory')
        seen = set()
        results = []
        for archive in archives:
            stem = archive.stem if archive is not None else (root.name if root != repo else repo.name)
            safe_stem = re.sub(r'[^A-Za-z0-9._-]', '-', stem).strip('.-') or 'repository'
            label = safe_stem
            if label.casefold() in seen:
                rel = archive.relative_to(repo).as_posix() if archive and archive.is_relative_to(repo) else str(archive)
                label = safe_stem + '-' + digest(rel.encode())[:10]
            seen.add(label.casefold())
            target = out / (label + '.validated.zip')
            report = reports / (label + '.report.json')
            extracted = ext / label if ext else None
            result = process(archive, repo, root, target, report, extracted, args.no_overlay, args.strict_repo_sync)
            results.append({'archive': result['input'], 'output': str(target), 'sha256': result['archive_sha256'],
                            'files': result['manifest']['file_count'], 'duplicates': result['manifest']['duplicate_members_removed'],
                            'nested_expanded': result['manifest']['nested_archives_expanded'], 'sync': result['manifest']['repository_sync']['status']})
            print(f"PASS {result['input']} -> {target} ({result['manifest']['file_count']} files; {result['manifest']['duplicate_members_removed']} duplicates removed)")
        reports.mkdir(parents=True, exist_ok=True)
        (reports / 'summary.json').write_text(json.dumps(results, indent=2) + '\n', encoding='utf8')
        print('All normalized ZIPs passed manifest integrity, collision, and CRC checks')
        return 0
    except (GuardError, OSError, zipfile.BadZipFile, ValueError) as err:
        print(f'ZIP GUARD FAILED: {err}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
