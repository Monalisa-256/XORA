-- ACTIVATION ONLY: DO NOT APPLY with the schema-only migrations.
-- Require approved legal/privacy text, independent adult assurance, approved email and storage,
-- tested Better Auth adapter, reviewer provisioning, actual restricted integration tests and owner authorization.
-- xora_prod_web is NOT a member of xora_runtime. Grant only the Phase 3 operations required.
BEGIN;
DO $$ BEGIN IF current_database() <> 'xora' OR current_user <> 'xora_owner' OR NOT EXISTS (SELECT 1 FROM app_schema_migrations WHERE version='0012') THEN RAISE EXCEPTION 'Wrong target or missing Phase 3 schema'; END IF; END $$;
GRANT SELECT,INSERT,UPDATE,DELETE ON "user","session","account","verification","twoFactor","rateLimit" TO xora_prod_web;
GRANT SELECT,INSERT,UPDATE ON staff_mfa_credentials,staff_mfa_assertions TO xora_prod_web;
GRANT INSERT(auth_user_id,status), UPDATE(status,version,updated_at) ON accounts TO xora_prod_web;
GRANT INSERT(actor_id,action,resource_type,resource_id,outcome,reason_code,request_id,metadata) ON audit_events TO xora_prod_web;
GRANT SELECT,INSERT ON registration_agreements,member_consents TO xora_prod_web;
GRANT SELECT,INSERT,UPDATE ON profiles,discovery_preferences,verification_cases,profile_reviews,profile_media,privacy_requests TO xora_prod_web;
INSERT INTO app_schema_migrations(version,description) VALUES ('0013','Restricted Phase 3 runtime activation grants');
COMMIT;
