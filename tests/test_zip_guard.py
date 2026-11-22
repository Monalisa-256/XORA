import importlib.util
import io
import json
import os
from pathlib import Path
import stat
import sys
import tempfile
import unittest
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from zip_guard import (Collector, GuardError, MANIFEST, digest, get_repo_source,
                       process, safe_path, source_files, validate_zip_file, main)
from verify_repo import validate_project_files, validate_archive, verify_repo_layout, verify_distinct_contents


def makezip(entries):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
        for k, v in entries:
            if isinstance(k, zipfile.ZipInfo):
                z.writestr(k, v)
            else:
                z.writestr(k, v)
    return buf.getvalue()


class ZipGuardTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)

    def package(self, entries, name='mystery name (2).ZIP', project=False):
        archive = self.root / name
        archive.write_bytes(makezip(entries))
        if project:
            (self.root / 'package.json').write_text('{"name":"sample","scripts":{}}')
            (self.root / 'src').mkdir(exist_ok=True)
            (self.root / 'src/app').mkdir(exist_ok=True)
            (self.root / 'src/app/page.tsx').write_text('export default function Page(){return null}')
        return archive

    def run_guard(self, archive, project=None, *, extract=True, no_overlay=False):
        dest = self.root / 'out' / (archive.stem + '.validated.zip')
        report = self.root / 'reports' / (archive.stem + '.report.json')
        ext = self.root / 'extracted' / archive.stem if extract else None
        sync = self.root if project else None
        outcome = process(archive, self.root, sync, dest, report, ext, no_overlay)
        return dest, outcome, ext

    def test_arbitrary_zip_filename(self):
        p = self.package([('README.md', b'hello')])
        z, report, _ = self.run_guard(p)
        self.assertTrue(z.exists())
        self.assertEqual(report['manifest']['file_count'], 1)

    def test_outer_wrapper_stripped(self):
        p = self.package([('wrapped/README.md', b'data'), ('wrapped/src/app/page.tsx', b'x')])
        z, r, _ = self.run_guard(p)
        with zipfile.ZipFile(z) as f: self.assertIn('README.md', f.namelist())
        self.assertIn('wrapped', str(r['manifest']['unwrapped_outer_folders']))

    def test_nested_wrappers_stripped(self):
        p = self.package([('ziproot/project/README.md', b'a'), ('ziproot/project/docs/other.md', b'b')])
        z, r, _ = self.run_guard(p)
        with zipfile.ZipFile(z) as f: self.assertIn('README.md', f.namelist())
        self.assertEqual(len(r['manifest']['unwrapped_outer_folders']), 2)

    def test_preserves_actual_source_dirs(self):
        p = self.package([('src/index.ts', b'hello')])
        z, r, _ = self.run_guard(p)
        with zipfile.ZipFile(z) as f: self.assertIn('src/index.ts', f.namelist())

    def test_identical_duplicate_removed(self):
        p = self.package([('src/a.ts', b'same'), ('src/a.ts', b'same')])
        z, r, _ = self.run_guard(p)
        self.assertEqual(r['manifest']['duplicate_members_removed'], 1)
        self.assertEqual(r['manifest']['file_count'], 1)

    def test_conflicting_duplicate_fails(self):
        p = self.package([('src/a.ts', b'first'), ('src/a.ts', b'second')])
        with self.assertRaisesRegex(GuardError, 'Conflicting'): self.run_guard(p)

    def test_mixed_case_collision_fails(self):
        p = self.package([('a/README.md', b'a'), ('a/readme.md', b'a')])
        with self.assertRaisesRegex(GuardError, 'Case-insensitive'): self.run_guard(p)

    def test_traversal_rejected(self):
        p = self.package([('../evil.txt', b'evil')])
        with self.assertRaises(GuardError): self.run_guard(p)
        self.assertFalse((self.root.parent / 'evil.txt').exists())

    def test_absolute_path_rejected(self):
        for s in ('/etc/passwd', 'C:/boot.ini', 'c:secret', 'a//b.txt', 'a/./b', 'a/../b'):
            with self.subTest(name=s):
                with self.assertRaises(GuardError): safe_path(s)

    def test_backslash_rejected(self):
        with self.assertRaises(GuardError): safe_path('a\\..\\target')

    def test_symlink_rejected(self):
        i = zipfile.ZipInfo('linked')
        i.create_system = 3
        i.external_attr = (stat.S_IFLNK | 0o777) << 16
        p = self.package([(i, b'../outside')])
        with self.assertRaisesRegex(GuardError, 'Symlink'): self.run_guard(p)

    def test_secret_rejected(self):
        p = self.package([('.env.production', b'DATABASE_URL=secret')])
        with self.assertRaisesRegex(GuardError, 'secret'): self.run_guard(p)

    def test_safe_env_example_allowed(self):
        p = self.package([('.env.example', b'VAR=placeholder')])
        z, *_ = self.run_guard(p)
        with zipfile.ZipFile(z) as f: self.assertIn('.env.example', f.namelist())

    def test_nested_zip_expanded_and_removed(self):
        inner = makezip([('src/file.ts', b'console.log(1)')])
        p = self.package([('payload.zip', inner), ('README.md', b'readme')])
        z, r, _ = self.run_guard(p)
        with zipfile.ZipFile(z) as f:
            self.assertIn('src/file.ts', f.namelist())
            self.assertNotIn('payload.zip', f.namelist())
        self.assertEqual(r['manifest']['nested_archives_expanded'], 1)

    def test_nested_same_path_dedupe(self):
        inner = makezip([('README.md', b'same')])
        p = self.package([('nested.zip', inner), ('README.md', b'same')])
        z, r, _ = self.run_guard(p)
        self.assertEqual(r['manifest']['file_count'], 1)
        self.assertEqual(r['manifest']['duplicate_members_removed'], 1)

    def test_nested_conflict_rejected(self):
        inner = makezip([('README.md', b'different')])
        p = self.package([('nested.zip', inner), ('README.md', b'same')])
        with self.assertRaises(GuardError): self.run_guard(p)

    def test_invalid_inner_zip_rejected(self):
        p = self.package([('nested.zip', b'not really zip')])
        with self.assertRaisesRegex(GuardError, 'Invalid nested'): self.run_guard(p)

    def test_nested_depth_limit(self):
        inner = makezip([('README.md', b'fine')])
        for _ in range(4): inner = makezip([('another.zip', inner)])
        p = self.package([('nested.zip', inner)])
        with self.assertRaisesRegex(GuardError, 'depth'): self.run_guard(p)

    def test_repo_overrides_outdated_file(self):
        p = self.package([('package.json', b'{"name":"old"}'), ('src/app/page.tsx', b'old')], project=True)
        z, r, ext = self.run_guard(p, project=True)
        with zipfile.ZipFile(z) as f:
            self.assertEqual(f.read('package.json'), (self.root / 'package.json').read_bytes())
            self.assertEqual(f.read('src/app/page.tsx'), (self.root / 'src/app/page.tsx').read_bytes())
        self.assertEqual(r['manifest']['repository_sync']['status'], 'synchronized')
        self.assertGreater(r['manifest']['repository_sync']['updated_files'], 0)
        self.assertTrue((ext / 'src/app/page.tsx').is_file())

    def test_includes_new_repo_files(self):
        p = self.package([('package.json', b'{"name":"old"}')], project=True)
        z, r, _ = self.run_guard(p, project=True)
        with zipfile.ZipFile(z) as f: self.assertIn('src/app/page.tsx', f.namelist())

    def test_docs_zip_not_replaced_by_code(self):
        p = self.package([('PRD.md', b'PRD')], project=True)
        z, r, _ = self.run_guard(p, project=True)
        self.assertEqual(r['manifest']['repository_sync']['status'], 'not_same_project')
        with zipfile.ZipFile(z) as f: self.assertNotIn('package.json', f.namelist())

    def test_sync_nested_xora_app_prefix(self):
        (self.root / 'XORA_APP').mkdir()
        (self.root / 'XORA_APP/package.json').write_text('{"name":"new"}')
        (self.root / 'XORA_APP/src').mkdir()
        (self.root / 'XORA_APP/src/index.ts').write_text('new code')
        p = self.package([('PRD.md', b'a'), ('XORA_APP/package.json', b'{"name":"old"}')])
        root = get_repo_source(self.root, 'auto')
        self.assertEqual(root.name, 'XORA_APP')
        dest = self.root / 'out.zip'
        r = process(p, self.root, root, dest, self.root/'report.json', None, False)
        with zipfile.ZipFile(dest) as f:
            self.assertEqual(f.read('XORA_APP/package.json'), b'{"name":"new"}')
            self.assertIn('XORA_APP/src/index.ts', f.namelist())
        self.assertEqual(r['manifest']['repository_sync']['archive_prefix'], 'XORA_APP/')

    def test_suspicious_compression_ratio(self):
        p = self.package([('big.txt', b'0' * 1_100_000)])
        with self.assertRaisesRegex(GuardError, 'compression ratio'): self.run_guard(p)

    def test_size_limit(self):
        p = self.package([('huge.bin', b'1' * (64 * 1024 * 1024 + 1))])
        with self.assertRaisesRegex(GuardError, 'Oversized'): self.run_guard(p)

    def test_manifest_validated(self):
        p = self.package([('src/file.ts', b'safe')])
        z, report, _ = self.run_guard(p)
        m = validate_zip_file(z)
        self.assertEqual(m['file_count'], 1)
        self.assertEqual(m['files'][0]['sha256'], digest(b'safe'))

    def test_deterministic_repack(self):
        p = self.package([('src/one.ts', b'a'), ('README.md', b'b')])
        z, *_ = self.run_guard(p)
        first = z.read_bytes()
        z, *_ = self.run_guard(p)
        self.assertEqual(first, z.read_bytes())

    def test_stale_extract_removed(self):
        p = self.package([('README.md', b'one')])
        z, _, ext = self.run_guard(p)
        (ext / 'old.txt').write_text('stale')
        self.run_guard(p)
        self.assertFalse((ext / 'old.txt').exists())

    def test_excludes_vendored_build_outputs(self):
        p = self.package([('node_modules/a.js', b'bad'), ('dist/old.zip', b'b'), ('src/a.ts', b'good')])
        z, r, _ = self.run_guard(p)
        with zipfile.ZipFile(z) as f: self.assertEqual(set(f.namelist()), {'src/a.ts', MANIFEST})
        self.assertEqual(r['manifest']['generated_files_skipped'], 2)

    def test_source_only_fallback(self):
        (self.root/'package.json').write_text('{"name":"clean","scripts":{}}')
        status = main(['--repo', str(self.root), '--output-dir', 'dist/normalized', '--report-dir', 'dist/reports'])
        self.assertEqual(status, 0)
        self.assertEqual(len(list((self.root/'dist/normalized').glob('*.zip'))), 1)

    def test_case_insensitive_zip_extensions(self):
        self.package([('readme.md', b'ok')], 'Whatever FILE NAME.ZIP')
        status = main(['--repo', str(self.root), '--output-dir', 'dist/normalized', '--report-dir', 'dist/reports', '--require-archive'])
        self.assertEqual(status, 0)

    def test_auto_detect_arbitrary_named_subfolder(self):
        (self.root/'my-special-project').mkdir()
        (self.root/'my-special-project/pyproject.toml').write_text('[project]\nname="xora"')
        self.assertEqual(get_repo_source(self.root, 'auto').name, 'my-special-project')

    def test_validation_fails_missing_next_app(self):
        val = validate_project_files({'package.json': b'{"name":"app","dependencies":{"next":"16"}}'})
        self.assertTrue(val['errors'])

    def test_validation_good_next_app(self):
        val = validate_project_files({'package.json': b'{"name":"app","dependencies":{"next":"16"}}', 'src/app/page.tsx': b'hi'})
        self.assertFalse(val['errors'])

    def test_validation_rejects_invalid_json(self):
        val = validate_project_files({'package.json': b'invalid'})
        self.assertTrue(val['errors'])

    def test_manifest_matches_file_bytes(self):
        p = self.package([('README.md', b'hello')])
        z, *_ = self.run_guard(p)
        r = validate_archive(z)
        self.assertEqual(r['file_count'], 1)
        self.assertFalse(r['errors'])


if __name__ == '__main__':
    unittest.main()


class RepositoryIntegrationTests(unittest.TestCase):
    def test_verify_detects_exact_content_duplicates(self):
        errors = verify_distinct_contents({'a.md': b'same', 'docs/b.md': b'same'})
        self.assertEqual(len(errors), 1)

    def test_verify_detects_redundant_wrappers(self):
        errors = verify_repo_layout({'package.json': b'{}', 'XORA_APP/src/app/page.tsx': b'x'})
        self.assertTrue(any('wrapper' in err for err in errors))

    def test_strict_sync_refreshes_source_and_removes_stale(self):
        with tempfile.TemporaryDirectory() as path:
            root = Path(path)
            (root / 'package.json').write_text('{"name":"fresh-app"}')
            (root / 'src').mkdir()
            (root / 'src/page.ts').write_text('latest')
            archive = root / 'any zip filename.ZIP'
            archive.write_bytes(makezip([
                ('legacy/package.json', b'{"name":"fresh-app"}'),
                ('legacy/src/page.ts', b'old'),
                ('legacy/src/removed.ts', b'stale'),
            ]))
            target = root / 'output' / 'done.zip'
            r = process(archive, root, root, target, root / 'report.json', None, False, True)
            with zipfile.ZipFile(target) as z:
                self.assertIn('src/page.ts', z.namelist())
                self.assertNotIn('src/removed.ts', z.namelist())
                self.assertNotIn('legacy/src/page.ts', z.namelist())
                self.assertEqual(z.read('src/page.ts'), b'latest')
            self.assertEqual(r['manifest']['repository_sync']['policy'], 'source-of-truth')

    def test_strict_sync_does_not_replace_unrelated_repository(self):
        with tempfile.TemporaryDirectory() as path:
            root = Path(path)
            (root / 'package.json').write_text('{"name":"app-a"}')
            archive = root / 'some-zip.ZIP'
            archive.write_bytes(makezip([('package.json', b'{"name":"app-b"}'), ('README.md', b'docs')]))
            target = root / 'output.zip'
            process(archive, root, root, target, root / 'report.json', None, False, True)
            with zipfile.ZipFile(target) as z:
                self.assertEqual(json.loads(z.read('package.json'))['name'], 'app-b')
