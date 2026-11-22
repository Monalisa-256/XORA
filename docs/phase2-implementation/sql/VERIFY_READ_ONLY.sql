-- Read-only verification against the XORA database.
SELECT current_database() AS database, current_schema() AS schema, current_setting('server_version') AS postgres_version;
SELECT version, description, applied_at FROM app_schema_migrations ORDER BY version;
SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name;
SELECT code, description, enabled FROM roles ORDER BY code;
SELECT code FROM permissions ORDER BY code;
SELECT COUNT(*) AS role_permission_mappings FROM role_permissions;
SELECT COUNT(*) AS accounts FROM accounts;
SELECT COUNT(*) AS active_staff_grants FROM staff_role_grants WHERE revoked_at IS NULL;
SELECT COUNT(*) AS background_jobs FROM background_jobs;
SELECT indexname, tablename FROM pg_indexes WHERE schemaname='public' ORDER BY tablename,indexname;
