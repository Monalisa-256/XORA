#!/usr/bin/env python3
"""Safely import arbitrarily named tracked ZIP archives into a checked-out repository.

Designed for GitHub Actions: prepare and checksum files in a staging directory, then
allow an isolated commit job to apply *only* that tested manifest and remove archives.
No secrets, git credentials, or untrusted archive code are executed by this script.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import re
import stat
import subprocess
import sys
import zipfile
from pathlib import Path
from collections import defaultdict

MAX_MEMBER_BYTES = 64 * 1024 * 1024
MAX_TOTAL_BYTES = 512 * 1024 * 1024
MAX_MEMBERS = 18000
MAX_DEPTH = 4
BUILD_DIRS = {'.git', '.next', '.turbo', 'node_modules', 'dist', 'coverage', '__MACOSX', '__pycache__', '.venv', 'venv', '.xora-import'}
REPO_DIRS = {'.github', 'src', 'app', 'pages', 'public', 'assets', 'docs', 'design', 'tests', 'scripts', 'tools', 'migrations', 'packages', 'apps', 'components', 'lib', 'config', 'styles', 'prisma'}
RESTRICTED_NAMES = {'.env', '.env.local', '.env.production', '.env.development', '.env.staging', 'id_rsa', 'id_ed25519', 'secrets.json', 'credentials.json', 'service-account.json', 'service_account.json'}
RESTRICTED_EXT = ('.pem', '.p12', '.pfx', '.key', '.keystore', '.jks')
PROTECTED_WORKFLOW = '.github/workflows/zip-extract-validate-update.yml'
# Only these known generated artifacts are eligible for tracked cleanup.
LEGACY_GENERATED = {'dist/normalized/XORA_GitHub_Ready_Repository.validated.zip', 'dist/reports/XORA_GitHub_Ready_Repository.report.json', 'dist/reports/repository-validation.json', 'dist/reports/summary.json'}

class ImportErrorSafe(Exception):
    pass

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def pathcheck(raw: str) -> str:
    if (not isinstance(raw, str) or not raw or '\\' in raw or '\x00' in raw or raw.startswith(('/', '~')) or re.match(r'^[a-zA-Z]:', raw)):
        raise ImportErrorSafe(f'Invalid ZIP entry: {raw!r}')
    if len(raw) > 650 or any(ord(c) < 32 or ord(c) == 127 for c in raw):
        raise ImportErrorSafe(f'Invalid ZIP filename: {raw!r}')
    parts = raw.rstrip('/').split('/')
    if len(parts) > 24 or any(x in ('', '.', '..') for x in parts):
        raise ImportErrorSafe(f'Unsafe ZIP entry: {raw!r}')
    if any(x.casefold() in {d.casefold() for d in BUILD_DIRS} for x in parts):
        return ''
    if parts[-1].lower() in RESTRICTED_NAMES or (parts[-1].lower().startswith('.env.') and not parts[-1].lower().endswith('.example')) or parts[-1].lower().endswith(RESTRICTED_EXT):
        raise ImportErrorSafe(f'Secret/credential file in ZIP is not permitted: {raw}')
    return '/'.join(parts)

def strip_wrapper(entries: list[tuple[str, bytes, int]]) -> list[tuple[str, bytes, int]]:
    while entries:
        names = [e[0] for e in entries]
        if any('/' not in name for name in names):
            break
        head = {name.split('/', 1)[0] for name in names}
        if len(head) != 1:
            break
        folder = head.pop()
        if folder in REPO_DIRS or folder.startswith('.'):
            break
        entries = [(name.split('/', 1)[1], contents, mode) for name, contents, mode in entries]
    return entries

class ArchiveReader:
    def __init__(self):
        self.total = 0
        self.entries = 0
        self.nested = 0
        self.duplicates = 0

    def read(self, raw: bytes, label: str, depth: int = 0) -> dict[str, tuple[bytes, int]]:
        if depth > MAX_DEPTH:
            raise ImportErrorSafe(f'Excessive ZIP nesting: {label}')
        try:
            z = zipfile.ZipFile(io.BytesIO(raw))
        except (zipfile.BadZipFile, OSError, ValueError) as e:
            raise ImportErrorSafe(f'Unreadable archive {label}: {e}') from e
        collected: dict[str, tuple[bytes, int]] = {}
        cases: dict[str, str] = {}
        with z:
            local = []
            for member in z.infolist():
                self.entries += 1
                if self.entries > MAX_MEMBERS:
                    raise ImportErrorSafe('Too many ZIP members')
                if member.is_dir():
                    pathcheck(member.filename)
                    continue
                path = pathcheck(member.filename)
                if not path:
                    continue
                mode = member.external_attr >> 16
                if stat.S_IFMT(mode) not in (0, stat.S_IFREG):
                    raise ImportErrorSafe(f'Symlink or special file rejected: {label}:{path}')
                if member.flag_bits & 1:
                    raise ImportErrorSafe(f'Encrypted ZIP entry rejected: {label}:{path}')
                if member.file_size > MAX_MEMBER_BYTES:
                    raise ImportErrorSafe(f'ZIP entry too large: {label}:{path}')
                if member.file_size > 1_000_000 and member.file_size > 300 * max(1, member.compress_size):
                    raise ImportErrorSafe(f'Possible ZIP bomb: {label}:{path}')
                self.total += member.file_size
                if self.total > MAX_TOTAL_BYTES:
                    raise ImportErrorSafe('Expanded archive budget exceeded')
                with z.open(member) as f:
                    contents = f.read(MAX_MEMBER_BYTES + 1)
                    if len(contents) > MAX_MEMBER_BYTES or f.read(1):
                        raise ImportErrorSafe(f'ZIP stream too large: {label}:{path}')
                local.append((path, contents, mode))
            for path, content, mode in strip_wrapper(local):
                path = pathcheck(path)
                if path.lower().endswith('.zip'):
                    self.nested += 1
                    nested = self.read(content, f'{label}!/{path}', depth + 1)
                    for name, item in nested.items():
                        self._add(collected, cases, name, item, label)
                elif path != 'ZIP_GUARD_MANIFEST.json':
                    self._add(collected, cases, path, (content, mode), label)
        return collected

    def _add(self, result, cases, path, item, label):
        key = path.casefold()
        if key in cases and cases[key] != path:
            raise ImportErrorSafe(f'Case-conflicting filenames: {cases[key]} vs {path}')
        cases[key] = path
        if path in result:
            if result[path][0] != item[0]:
                raise ImportErrorSafe(f'Conflicting duplicate inside ZIP {label}: {path}')
            self.duplicates += 1
        else:
            result[path] = item

def tracked_paths(root: Path) -> set[str]:
    return {os.fsdecode(n) for n in subprocess.check_output(['git', '-C', str(root), 'ls-files', '-z']).split(b'\0') if n}

def last_archive_commit(root: Path, relative: str) -> str:
    return subprocess.check_output(['git', '-C', str(root), 'log', '-1', '--format=%H', '--', relative], text=True).strip()

def git_tracked_zip_paths(root: Path) -> list[Path]:
    raw = subprocess.check_output(['git', '-C', str(root), 'ls-files', '-z'])
    paths = []
    for name in raw.split(b'\0'):
        if not name:
            continue
        relative = os.fsdecode(name)
        if relative.lower().endswith('.zip') and not any(x in BUILD_DIRS for x in Path(relative).parts):
            source = root / relative
            if not source.is_file() or source.is_symlink():
                raise ImportErrorSafe(f'Unusable tracked ZIP path: {relative}')
            paths.append(source)
    def git_order(p: Path):
        relative = p.relative_to(root).as_posix()
        commit = last_archive_commit(root, relative)
        depth = subprocess.check_output(['git', '-C', str(root), 'rev-list', '--count', commit], text=True).strip() if commit else '0'
        return (int(depth), relative)
    return sorted(paths, key=git_order)

def safe_destination(root: Path, relative: str) -> Path:
    clean = pathcheck(relative)
    if not clean:
        raise ImportErrorSafe(f'Excluded output path: {relative}')
    dest = root
    for part in clean.split('/'):
        dest = dest / part
        if dest.is_symlink():
            raise ImportErrorSafe(f'Symlink destination rejected: {dest}')
    if not dest.resolve().is_relative_to(root.resolve()):
        raise ImportErrorSafe(f'Archive would escape checkout: {relative}')
    return dest

def prepare(root: Path, stage: Path, *, archive_paths=None) -> dict:
    root = root.resolve()
    archives = archive_paths if archive_paths is not None else git_tracked_zip_paths(root)
    stage = stage.resolve()
    if not stage.is_relative_to(root) or stage == root:
        raise ImportErrorSafe('Invalid staging location')
    stage.mkdir(parents=True, exist_ok=True)
    collector = ArchiveReader()
    chosen: dict[str, tuple[bytes, int, str]] = {}
    canonical: dict[str, str] = {}
    overrides, repeated = [], 0
    relocated_notes = []
    origins = {}
    for archive in archives:
        name = archive.relative_to(root).as_posix()
        items = collector.read(archive.read_bytes(), name)
        if not items:
            raise ImportErrorSafe(f'No importable source files in archive: {name}')
        origins[name] = last_archive_commit(root, name)
        # A change-only ZIP may carry its own README as packaging instructions.
        # Preserve the app's root README and retain that note under docs/.
        if 'package.json' not in items and 'README.md' in items and (root / 'README.md').is_file():
            data, mode = items.pop('README.md')
            note_stem = re.sub(r'[^A-Za-z0-9._-]+', '-', archive.stem).strip('.-') or 'archive'
            note_path = f'docs/zip-import-notes/{note_stem}.md'
            items[note_path] = (data, mode)
            relocated_notes.append({'original':f'{name}:README.md','destination':note_path})
        for path, (data, mode) in items.items():
            key = path.casefold()
            if key in canonical and canonical[key] != path:
                raise ImportErrorSafe(f'Conflicting casing across archives: {canonical[key]} vs {path}')
            canonical[key] = path
            if path in chosen:
                prev = chosen[path]
                if prev[0] == data:
                    repeated += 1
                else:
                    old_commit, new_commit = origins[prev[2]], origins[name]
                    if old_commit == new_commit or (old_commit and new_commit and subprocess.run(['git','-C',str(root),'merge-base','--is-ancestor',old_commit,new_commit],capture_output=True).returncode != 0):
                        raise ImportErrorSafe(f'Ambiguous conflicting archives: {prev[2]} and {name}: {path}; upload newer correction in a separate commit')
                    overrides.append({'path':path, 'older_archive':prev[2], 'newer_archive':name})
            chosen[path] = (data, mode, name)
    # Do not replace the workflow currently running with an old workflow packed in a ZIP.
    protected = []
    for path in list(chosen):
        if path.casefold().startswith('.github/') or path.casefold() in {'.gitmodules', '.gitattributes'}:
            protected.append(path)
            del chosen[path]
    # Detect duplicated identical payloads at different paths (do not silently remove
    # path aliases that might be required imports).
    fingerprints: dict[str, str] = {}
    same_content = []
    for path, (data, _mode, _origin) in sorted(chosen.items()):
        digest = sha256(data)
        if digest in fingerprints:
            same_content.append((fingerprints[digest], path))
        else:
            fingerprints[digest] = path
    if same_content:
        raise ImportErrorSafe('Repeated identical file contents at distinct paths; review before deleting required paths: ' + str(same_content[:8]))
    # Compare every path component against the tracked tree and all incoming files.
    # This catches case-only aliases, file/directory conflicts and accidental wrappers
    # before any source is copied. Legitimate internal directory names are preserved.
    tracked = tracked_paths(root)
    known = {}
    for path in sorted(tracked | set(chosen)):
        parts = path.split('/')
        for i in range(1, len(parts)+1):
            prefix = '/'.join(parts[:i])
            folded = prefix.casefold()
            if folded in known and known[folded] != prefix:
                raise ImportErrorSafe(f'Case-conflicting repository paths: {known[folded]} vs {prefix}')
            known[folded] = prefix
    all_paths = tracked | set(chosen)
    directory_paths = {'/'.join(path.split('/')[:i]) for path in all_paths for i in range(1,len(path.split('/')))}
    for path in chosen:
        parts = path.split('/')
        if any('/'.join(parts[:i]) in all_paths for i in range(1,len(parts))) or path in directory_paths:
            raise ImportErrorSafe(f'File/directory conflict in repository: {path}')
        if parts[0] not in REPO_DIRS and len(parts)>1 and any(x in REPO_DIRS for x in parts[1:]):
            raise ImportErrorSafe(f'Ambiguous mixed repository wrapper: {path}; use one common outer folder')
        if len(parts)>1 and parts[0] in REPO_DIRS and parts[0] == parts[1]:
            raise ImportErrorSafe(f'Repeated top-level repository folder: {path}')
    # Check all destinations before touching the worktree.
    for path in chosen:
        safe_destination(root, path)
        safe_destination(stage / 'files', path)
    files = []
    for path, (data, mode, source) in sorted(chosen.items()):
        dest = stage / 'files' / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        dest.chmod(0o755 if mode & 0o111 else 0o644)
        files.append({'path':path, 'sha256':sha256(data), 'size':len(data), 'source':source, 'mode':0o755 if mode & 0o111 else 0o644})
    cleanup = sorted(LEGACY_GENERATED & tracked) if archives else []
    report = {'format':'xora-repository-zip-import-v2','archives':[p.relative_to(root).as_posix() for p in archives],
              'archive_sha256':{p.relative_to(root).as_posix():sha256(p.read_bytes()) for p in archives}, 'legacy_generated_cleanup':cleanup,
              'file_count':len(files), 'files':files, 'nested_archives_expanded':collector.nested,
              'duplicates_discarded':collector.duplicates+repeated,
              'older_archive_conflicts_resolved':overrides,
              'protected_workflows_preserved':protected,
              'relocated_patch_readmes':relocated_notes,
              'archive_order':'git last-edit time ascending; latest ZIP wins for conflicting paths'}
    (stage / 'manifest.json').write_text(json.dumps(report, indent=2, sort_keys=True)+'\n', encoding='utf-8')
    # Copy into validation worktree, but never delete archives in this job.
    for item in files:
        dest = safe_destination(root, item['path'])
        src = stage / 'files' / item['path']
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(src.read_bytes())
        dest.chmod(item['mode'])
    return report

def apply(root: Path, stage: Path) -> dict:
    root=root.resolve();stage=stage.resolve()
    report=json.loads((stage/'manifest.json').read_text(encoding='utf-8'))
    if report.get('format')!='xora-repository-zip-import-v2':
        raise ImportErrorSafe('Unknown manifest format')
    for item in report['files']:
        src=safe_destination(stage/'files',item['path'])
        if not src.is_file() or sha256(src.read_bytes())!=item['sha256']:
            raise ImportErrorSafe('Staged file tampered or missing: '+item['path'])
        safe_destination(root,item['path'])
    for name in report['archives']:
        zip_path=safe_destination(root,name)
        if not zip_path.exists() or not zipfile.is_zipfile(zip_path) or sha256(zip_path.read_bytes()) != report.get('archive_sha256', {}).get(name):
            raise ImportErrorSafe('Tracked ZIP missing or corrupt before commit: '+name)
    # Never accept a manifest that requests arbitrary deletions.
    cleanup = report.get('legacy_generated_cleanup', [])
    if not set(cleanup) <= LEGACY_GENERATED:
        raise ImportErrorSafe('Invalid legacy artifact cleanup')
    # Changes and ZIP deletions are committed as a single transaction by git.
    for item in report['files']:
        dest=safe_destination(root,item['path']);src=stage/'files'/item['path']
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(src.read_bytes());dest.chmod(item['mode'])
        subprocess.run(['git','-C',str(root),'add','--',item['path']],check=True)
    for name in report['archives'] + cleanup:
        subprocess.run(['git','-C',str(root),'rm','--',name],check=True)
    # Verify the exact staged result, not just the temporary worktree.
    index = tracked_paths(root)
    for item in report['files']:
        path = item['path']
        if path not in index or sha256(subprocess.check_output(['git','-C',str(root),'show',':'+path])) != item['sha256']:
            raise ImportErrorSafe(f'Index content differs from validated bytes: {path}')
    if set(report['archives'] + cleanup) & index:
        raise ImportErrorSafe('Processed archive or obsolete artifact remains in Git index')
    changed = {os.fsdecode(n) for n in subprocess.check_output(['git','-C',str(root),'diff','--cached','--name-only','-z','--no-renames']).split(b'\0') if n}
    allowed = {item['path'] for item in report['files']} | set(report['archives'] + cleanup)
    if not changed <= allowed:
        raise ImportErrorSafe('Unexpected staged changes outside validated manifest')
    return report

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--root',default='.')
    p.add_argument('--stage',default='.xora-import')
    p.add_argument('--apply',action='store_true')
    args=p.parse_args()
    try:
        root=Path(args.root).resolve();stage=(root/args.stage).resolve()
        report=apply(root,stage) if args.apply else prepare(root,stage)
        print(json.dumps({k:report[k] for k in ('archives','file_count','nested_archives_expanded','duplicates_discarded')},indent=2))
    except (ImportErrorSafe, OSError, ValueError, zipfile.BadZipFile, subprocess.CalledProcessError) as e:
        print(f'XORA ZIP IMPORT FAILED: {e}',file=sys.stderr)
        raise SystemExit(1)

if __name__=='__main__':
    main()
