-- XORA staging-only migration 0007, applied 2026-11-22.
-- Non-destructive alignment of Better Auth's generated Drizzle snake_case
-- schema with the Kysely/PostgreSQL adapter naming conventions.
-- NEVER apply to a branch that has not installed migration 0005.
-- Do not run blindly: check app_schema_migrations first.
BEGIN;
ALTER TABLE "rate_limit" RENAME TO "rateLimit";
ALTER TABLE "two_factor" RENAME TO "twoFactor";
ALTER TABLE "rateLimit" RENAME COLUMN "last_request" TO "lastRequest";
ALTER TABLE "twoFactor" RENAME COLUMN "backup_codes" TO "backupCodes";
ALTER TABLE "twoFactor" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "twoFactor" RENAME COLUMN "failed_verification_count" TO "failedVerificationCount";
ALTER TABLE "twoFactor" RENAME COLUMN "locked_until" TO "lockedUntil";
ALTER TABLE "user" RENAME COLUMN "email_verified" TO "emailVerified";
ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "user" RENAME COLUMN "updated_at" TO "updatedAt";
ALTER TABLE "user" RENAME COLUMN "two_factor_enabled" TO "twoFactorEnabled";
ALTER TABLE "session" RENAME COLUMN "expires_at" TO "expiresAt";
ALTER TABLE "session" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "session" RENAME COLUMN "updated_at" TO "updatedAt";
ALTER TABLE "session" RENAME COLUMN "ip_address" TO "ipAddress";
ALTER TABLE "session" RENAME COLUMN "user_agent" TO "userAgent";
ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "account" RENAME COLUMN "account_id" TO "accountId";
ALTER TABLE "account" RENAME COLUMN "provider_id" TO "providerId";
ALTER TABLE "account" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "account" RENAME COLUMN "access_token" TO "accessToken";
ALTER TABLE "account" RENAME COLUMN "refresh_token" TO "refreshToken";
ALTER TABLE "account" RENAME COLUMN "id_token" TO "idToken";
ALTER TABLE "account" RENAME COLUMN "access_token_expires_at" TO "accessTokenExpiresAt";
ALTER TABLE "account" RENAME COLUMN "refresh_token_expires_at" TO "refreshTokenExpiresAt";
ALTER TABLE "account" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "account" RENAME COLUMN "updated_at" TO "updatedAt";
ALTER TABLE "verification" RENAME COLUMN "expires_at" TO "expiresAt";
ALTER TABLE "verification" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "verification" RENAME COLUMN "updated_at" TO "updatedAt";
INSERT INTO app_schema_migrations(version,description)
 VALUES ('0007','Align staging Better Auth schema names to Kysely/PostgreSQL runtime adapter');
COMMIT;
