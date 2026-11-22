-- Staging only. Only the application role may mutate authentication tables.
BEGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  "user", "session", "account", "verification", "two_factor", "rate_limit"
  TO xora_runtime;
INSERT INTO app_schema_migrations(version,description)
 VALUES ('0006','Staging auth adapter table privileges for restricted web login');
COMMIT;
