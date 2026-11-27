-- Production main only; apply once after reviewing adapter compatibility. No users or credentials.
BEGIN;
DO $$ BEGIN IF current_database() <> 'xora' OR current_user <> 'xora_owner' THEN RAISE EXCEPTION 'Wrong XORA migration target'; END IF; END $$;
CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" boolean DEFAULT false NOT NULL,
  "image" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "twoFactorEnabled" boolean DEFAULT false
);
CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope" text,
  "password" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp NOT NULL
);
CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "rateLimit" (
  "id" text PRIMARY KEY NOT NULL,
  "key" text NOT NULL UNIQUE,
  "count" integer NOT NULL,
  "lastRequest" bigint NOT NULL
);
CREATE TABLE "twoFactor" (
  "id" text PRIMARY KEY NOT NULL,
  "secret" text NOT NULL,
  "backupCodes" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "verified" boolean DEFAULT true,
  "failedVerificationCount" integer DEFAULT 0,
  "lockedUntil" timestamp
);
CREATE INDEX "session_userId_idx" ON "session" ("userId");
CREATE INDEX "account_userId_idx" ON "account" ("userId");
CREATE INDEX "twoFactor_secret_idx" ON "twoFactor" ("secret");
CREATE INDEX "twoFactor_userId_idx" ON "twoFactor" ("userId");
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
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
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "user", "session", "account", "verification", "twoFactor", "rateLimit" TO xora_runtime;
INSERT INTO app_schema_migrations(version,description) VALUES ('0011','Production Better Auth and staff MFA schema');
COMMIT;
