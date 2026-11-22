-- XORA only: READ-ONLY verification for Neon staging.
-- project sweet-meadow-04731447 / branch br-proud-base-bgx1lcns / database xora.
SELECT current_database() AS database_name, current_user AS queried_as;
SELECT version, description, applied_at FROM app_schema_migrations ORDER BY version;
SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name;
SELECT rolname,rolcanlogin FROM pg_roles WHERE rolname IN ('xora_runtime','xora_app_staging');
SELECT has_table_privilege('xora_app_staging','accounts','DELETE') AS can_delete_accounts,
       has_table_privilege('xora_app_staging','audit_events','DELETE') AS can_erase_audit,
       has_table_privilege('xora_app_staging','staff_role_grants','INSERT') AS can_create_staff_grants;
