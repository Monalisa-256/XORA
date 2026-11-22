-- Apply only to XORA Neon staging branch br-proud-base-bgx1lcns.
-- Requires migrations 0001, 0002 and a runtime role mapped to xora_web_staging.
BEGIN;
CREATE TABLE staff_mfa_credentials (
 account_id uuid PRIMARY KEY REFERENCES accounts(id) ON DELETE RESTRICT,
 encrypted_secret text NOT NULL,
 confirmed_at timestamptz,
 last_accepted_step bigint NOT NULL DEFAULT -1,
 failed_attempts integer NOT NULL DEFAULT 0 CHECK(failed_attempts BETWEEN 0 AND 10000),
 locked_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE staff_mfa_assertions (
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
 session_digest text NOT NULL CHECK(session_digest ~ '^[0-9a-f]{64}$'),
 verified_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL,
 PRIMARY KEY(account_id,session_digest),
 CHECK(expires_at > verified_at)
);
CREATE INDEX staff_mfa_assertions_expires ON staff_mfa_assertions(expires_at);
GRANT SELECT,INSERT,UPDATE ON staff_mfa_credentials,staff_mfa_assertions TO xora_runtime;
INSERT INTO app_schema_migrations(version,description) VALUES ('0008','Server-held staff TOTP secrets and session-bound MFA evidence');
COMMIT;
