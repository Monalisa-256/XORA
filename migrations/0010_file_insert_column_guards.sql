-- XORA staging only: prevent web app from claiming unscanned uploads are clean.
BEGIN;
REVOKE INSERT,UPDATE ON file_objects FROM xora_runtime;
REVOKE INSERT,UPDATE ON file_objects FROM xora_web_staging;
GRANT INSERT (owner_id,purpose,object_key,content_type,size_bytes,checksum_sha256) ON file_objects TO xora_runtime;
INSERT INTO app_schema_migrations(version,description) VALUES ('0010','App may create pending file metadata but cannot mark files confirmed');
COMMIT;
