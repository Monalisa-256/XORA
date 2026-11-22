-- XORA migration 0005: generated layout from Better Auth 1.7.27 + twoFactor
-- (Drizzle dialect). Staging was provisioned using this schema before 0007
-- aligned names to the runtime PostgreSQL adapter. This is the reproducible
-- pre-alignment baseline. Schema is version-specific; regenerate and review
-- before upgrading Better Auth. Never apply to the main branch without gate approval.
BEGIN;
CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "email_verified" boolean DEFAULT false NOT NULL,
  "image" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "two_factor_enabled" boolean DEFAULT false
);
CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expires_at" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp NOT NULL
);
CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "rate_limit" (
  "id" text PRIMARY KEY NOT NULL,
  "key" text NOT NULL UNIQUE,
  "count" integer NOT NULL,
  "last_request" bigint NOT NULL
);
CREATE TABLE "two_factor" (
  "id" text PRIMARY KEY NOT NULL,
  "secret" text NOT NULL,
  "backup_codes" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "verified" boolean DEFAULT true,
  "failed_verification_count" integer DEFAULT 0,
  "locked_until" timestamp
);
CREATE INDEX "session_userId_idx" ON "session" ("user_id");
CREATE INDEX "account_userId_idx" ON "account" ("user_id");
CREATE INDEX "twoFactor_secret_idx" ON "two_factor" ("secret");
CREATE INDEX "twoFactor_userId_idx" ON "two_factor" ("user_id");
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
INSERT INTO app_schema_migrations(version,description)
 VALUES ('0005','Generated Better Auth 1.7.27 core and 2FA schema; staging only');
COMMIT;
