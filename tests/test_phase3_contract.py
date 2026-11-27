import re, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Phase3Contract(unittest.TestCase):
 def read(self,p): return (ROOT/p).read_text()
 def test_no_discovery_payment_or_invite_routes(self):
  route=self.read('src/app/api/v1/[...phase3]/route.ts')
  self.assertNotRegex(route,r"p==='(?:discovery|invitations|payments|profiles/)")
 def test_source_migrations_require_owner_and_xora(self):
  for name in ['0011_production_auth.sql','0012_phase3.sql']:
   s=self.read('migrations/'+name);self.assertIn("current_database() <> 'xora'",s);self.assertIn("current_user <> 'xora_owner'",s);self.assertNotRegex(s,r'(?im)^\s*(DROP|TRUNCATE|DELETE)\b');self.assertIn('BEGIN;',s);self.assertIn('COMMIT;',s)
 def test_private_separate_case_tables_and_consent(self):
  s=self.read('migrations/0012_phase3.sql')
  for table in ['registration_agreements','member_consents','profiles','discovery_preferences','verification_cases','profile_reviews','profile_media','privacy_requests']:self.assertIn('CREATE TABLE '+table,s)
  self.assertNotIn('date_of_birth',s);self.assertNotIn('national_id',s)
 def test_only_owner_private_media(self):
  s=self.read('src/lib/phase3-db.ts');self.assertIn('WHERE id=$1 AND account_id=$2 AND deleted_at IS NULL',s);self.assertIn('WHERE id=$1 AND "userId"=$2',s)
 def test_claim_required_and_case_audit(self):
  s=self.read('src/lib/phase3-db.ts');self.assertIn('assigned_to=$2 AND status=\'pending\'',s);self.assertIn('review.evidence_access',s);self.assertIn('review.photo_access',s);self.assertIn('account_id<>$2',s)
 def test_origin_checked_and_signup_bypass_closed(self):
  s=self.read('src/app/api/v1/[...phase3]/route.ts');self.assertIn('sameOrigin',s);auth=self.read('src/app/api/auth/[...all]/route.ts');self.assertNotIn("'sign-up/email'",auth);self.assertIn('sameOrigin',auth)
 def test_deletion_restricts_account_and_revokes_sessions(self):
  s=self.read('src/lib/phase3-db.ts');self.assertIn('RECENT_LOGIN_REQUIRED',s);self.assertIn("UPDATE accounts SET status='restricted'",s);self.assertIn('DELETE FROM "session" WHERE "userId"=$1',s)
 def test_transformation_and_storage_boundary(self):
  s=self.read('src/lib/phase3-media.ts');image=self.read('src/core/phase3-image.ts');self.assertIn('limitInputPixels',image);self.assertIn('.rotate().resize(',image);self.assertIn('.webp(',image);self.assertIn('br-young-hill-bgijo9jk.storage',s);self.assertIn('MEDIA_INTEGRITY_FAILURE',s);self.assertNotIn('public-read',s)
 def test_gates_closed_in_template(self):
  s=self.read('.env.example');self.assertIn('XORA_PHASE3_ONBOARDING_APPROVED=false',s);self.assertIn('XORA_SIGNUP_ENABLED=false',s);self.assertIn('XORA_MOMO_PAYMENTS=false',s);self.assertIn('XORA_PUBLIC_LAUNCH=false',s)
if __name__=='__main__':unittest.main()
