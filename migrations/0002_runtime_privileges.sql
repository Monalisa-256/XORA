-- XORA-only follow-up migration applied to main and staging on 2026-11-22.
-- Restrictive non-login database role for a future dedicated app credential.
-- No user credentials are issued here and the role cannot connect itself.
BEGIN;
CREATE ROLE xora_runtime NOLOGIN;
GRANT CONNECT ON DATABASE xora TO xora_runtime;
GRANT USAGE ON SCHEMA public TO xora_runtime;
GRANT SELECT ON app_schema_migrations,roles,permissions,role_permissions,staff_memberships,staff_role_grants TO xora_runtime;
GRANT SELECT,INSERT,UPDATE ON accounts,idempotency_records,file_objects,outbox_events,background_jobs TO xora_runtime;
GRANT SELECT,INSERT ON audit_events,file_access_events,job_attempts TO xora_runtime;
INSERT INTO app_schema_migrations(version,description)
VALUES ('0002','Nonlogin least-privilege runtime database role');
COMMIT;
