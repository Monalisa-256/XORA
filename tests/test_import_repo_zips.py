import io
import json
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from import_repo_zips import ArchiveReader, ImportErrorSafe, prepare, apply, safe_destination, git_tracked_zip_paths


def makezip(items):
    b=io.BytesIO()
    with zipfile.ZipFile(b,'w',zipfile.ZIP_DEFLATED) as z:
        for n,content in items:
            z.writestr(n,content)
    return b.getvalue()

class ImporterTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        subprocess.run(['git','init','-q','-b','main',str(self.root)],check=True)
        subprocess.run(['git','-C',str(self.root),'config','user.email','fixture@example.invalid'],check=True)
        subprocess.run(['git','-C',str(self.root),'config','user.name','Fixture'],check=True)
    def archive(self,entries,name='any (new) FILE.ZIP'):
        p=self.root/name;p.parent.mkdir(parents=True,exist_ok=True)
        p.write_bytes(makezip(entries))
        subprocess.run(['git','-C',str(self.root),'add','--',name],check=True)
        subprocess.run(['git','-C',str(self.root),'commit','-qm','fixture upload'],check=True)
        return p
    def run_prepare(self):
        return prepare(self.root,self.root/'.xora-import')
    def test_any_filename_spaces_uppercase(self):
        self.archive([('src/app/page.tsx',b'hi')])
        m=self.run_prepare()
        self.assertEqual(m['file_count'],1)
        self.assertEqual((self.root/'src/app/page.tsx').read_bytes(),b'hi')
    def test_strip_outer_wrappers(self):
        self.archive([('outer/inner/tests/test_zip_guard.py',b'1'),('outer/inner/scripts/zip_guard.py',b'2')])
        m=self.run_prepare()
        self.assertIn('tests/test_zip_guard.py',[x['path'] for x in m['files']])
        self.assertTrue((self.root/'scripts/zip_guard.py').is_file())
    def test_expand_nested_zip(self):
        inside=makezip([('wrapped/src/app/page.tsx',b'x')])
        self.archive([('bundle.zip',inside)])
        m=self.run_prepare()
        self.assertEqual(m['nested_archives_expanded'],1)
        self.assertFalse((self.root/'bundle.zip').exists())
        self.assertTrue((self.root/'src/app/page.tsx').exists())
    def test_duplicate_exact_path_is_deduped(self):
        self.archive([('x.txt',b'one'),('x.txt',b'one')])
        m=self.run_prepare()
        self.assertEqual(m['duplicates_discarded'],1)
    def test_conflicting_same_zip_fails_before_copy(self):
        self.archive([('x.txt',b'one'),('x.txt',b'two')])
        with self.assertRaisesRegex(ImportErrorSafe,'Conflicting duplicate'):
            self.run_prepare()
        self.assertFalse((self.root/'x.txt').exists())
    def test_cross_archive_latest_commit_wins(self):
        self.archive([('src/app/page.tsx',b'old')],name='what.zip')
        self.archive([('src/app/page.tsx',b'new')],name='arbitrary name.ZIP')
        m=self.run_prepare()
        self.assertEqual((self.root/'src/app/page.tsx').read_bytes(),b'new')
        self.assertEqual(len(m['older_archive_conflicts_resolved']),1)
    def test_collision_mixed_case_rejected(self):
        self.archive([('abc.txt',b'1'),('ABC.txt',b'2')])
        with self.assertRaisesRegex(ImportErrorSafe,'Case-conflicting'):
            self.run_prepare()
    def test_traversal_rejected(self):
        self.archive([('../evil.txt',b'bad')])
        with self.assertRaisesRegex(ImportErrorSafe,'Unsafe'):
            self.run_prepare()
    def test_absolute_path_rejected(self):
        self.archive([('/absolute.txt',b'bad')])
        with self.assertRaisesRegex(ImportErrorSafe,'Invalid'):
            self.run_prepare()
    def test_no_secrets(self):
        self.archive([('.env.production',b'DATABASE_URL=secret')])
        with self.assertRaisesRegex(ImportErrorSafe,'Secret'):
            self.run_prepare()
    def test_archive_symlink_rejected(self):
        info=zipfile.ZipInfo('link');info.create_system=3;info.external_attr=(0o120777<<16)
        self.archive([(info,b'/private')])
        with self.assertRaisesRegex(ImportErrorSafe,'Symlink'):
            self.run_prepare()
    def test_repo_symlink_destination_rejected(self):
        (self.root/'src').symlink_to('/tmp')
        self.archive([('src/page.tsx',b'bad')])
        with self.assertRaisesRegex(ImportErrorSafe,'Symlink destination'):
            self.run_prepare()
    def test_protect_running_workflow(self):
        workflow=self.root/'.github/workflows/zip-extract-validate-update.yml'
        workflow.parent.mkdir(parents=True)
        workflow.write_text('new workflow')
        self.archive([('.github/workflows/zip-extract-validate-update.yml',b'old workflow'),('tests/test_a.py',b'new')])
        m=self.run_prepare()
        self.assertEqual(workflow.read_text(),'new workflow')
        self.assertEqual(m['protected_workflows_preserved'],['.github/workflows/zip-extract-validate-update.yml'])
    def test_apply_stages_git_rm_only_after_verify(self):
        a=self.archive([('tests/test_a.py',b'new')])
        m=self.run_prepare();self.assertTrue(a.exists())
        result=apply(self.root,self.root/'.xora-import')
        self.assertFalse(a.exists());self.assertEqual(result['file_count'],1)
        status=subprocess.check_output(['git','-C',str(self.root),'diff','--cached','--name-status'],text=True)
        self.assertIn('D\tany (new) FILE.ZIP',status)
        self.assertIn('A\ttests/test_a.py',status)
    def test_tampered_stage_blocks_deletion(self):
        a=self.archive([('tests/test_a.py',b'new')]);self.run_prepare()
        (self.root/'.xora-import/files/tests/test_a.py').write_text('tampered')
        with self.assertRaisesRegex(ImportErrorSafe,'tampered'):
            apply(self.root,self.root/'.xora-import')
        self.assertTrue(a.exists())
    def test_identical_content_distinct_paths_rejected(self):
        self.archive([('a.py',b'same'),('b.py',b'same')])
        with self.assertRaisesRegex(ImportErrorSafe,'Repeated identical'):
            self.run_prepare()
    def test_skip_generated_but_not_tests(self):
        self.archive([('node_modules/p/x.js',b'x'),('.next/build/m.js',b'y'),('tests/t.py',b'keep')])
        m=self.run_prepare()
        self.assertEqual(m['file_count'],1)
        self.assertTrue((self.root/'tests/t.py').exists())
    def test_patch_readme_is_preserved_as_note(self):
        (self.root/'README.md').write_text('XORA root readme')
        self.archive([('README.md',b'patch instructions'),('scripts/patch.py',b'x')])
        m=self.run_prepare()
        self.assertEqual((self.root/'README.md').read_text(),'XORA root readme')
        self.assertEqual((self.root/'docs/zip-import-notes/any-new-FILE.md').read_bytes(),b'patch instructions')
        self.assertEqual(len(m['relocated_patch_readmes']),1)

    def test_no_archive_is_noop(self):
        m=self.run_prepare()
        self.assertEqual(m['archives'],[])
        self.assertEqual(m['file_count'],0)

    def test_other_workflow_cannot_be_imported(self):
        self.archive([('.github/workflows/evil.yml', b'unsafe'), ('src/new.ts', b'ok')])
        m=self.run_prepare()
        self.assertEqual(m['file_count'],1)
        self.assertFalse((self.root/'.github/workflows/evil.yml').exists())
    def test_archive_changed_after_prepare_fails(self):
        a=self.archive([('src/new.ts', b'ok')]); self.run_prepare()
        a.write_bytes(makezip([('src/new.ts', b'changed')]))
        with self.assertRaisesRegex(ImportErrorSafe,'missing or corrupt'):
            apply(self.root,self.root/'.xora-import')
        self.assertTrue(a.exists())
    def test_legacy_generated_cleanup_is_narrow(self):
        p=self.root/'dist/reports/summary.json';p.parent.mkdir(parents=True);p.write_text('old')
        keep=self.root/'dist/keep.txt';keep.write_text('preserve')
        subprocess.run(['git','-C',str(self.root),'add','dist'],check=True)
        subprocess.run(['git','-C',str(self.root),'commit','-qm','old generated files'],check=True)
        self.archive([('src/new.ts',b'ok')]);m=self.run_prepare()
        self.assertEqual(m['legacy_generated_cleanup'],['dist/reports/summary.json'])
        apply(self.root,self.root/'.xora-import')
        self.assertFalse(p.exists());self.assertTrue(keep.exists())

if __name__=='__main__':unittest.main()
