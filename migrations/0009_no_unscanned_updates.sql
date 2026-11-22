-- XORA staging-only migration 0009. Already applied to XORA Neon staging.
-- Do not rerun an initialized branch without checking app_schema_migrations.
BEGIN;
REVOKE UPDATE ON file_objects FROM xora_runtime;
REVOKE UPDATE ON file_objects FROM xora_web_staging;
INSERT INTO app_schema_migrations(version,description)
 VALUES('0009','Disallow web-role file state promotion without reviewed scanner');
COMMIT;
