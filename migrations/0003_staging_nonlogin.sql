-- Recorded migration already applied to XORA STAGING ONLY, 2026-11-22.
-- Neon project: sweet-meadow-04731447 / branch br-proud-base-bgx1lcns / database xora.
-- DO NOT re-run on an existing XORA staging branch, and NEVER run against other projects.
BEGIN;
CREATE ROLE xora_app_staging NOLOGIN INHERIT;
GRANT xora_runtime TO xora_app_staging;
INSERT INTO app_schema_migrations(version,description)
  VALUES ('0003','Dedicated staging application role scaffold without login credentials');
COMMIT;
