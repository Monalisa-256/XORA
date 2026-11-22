# XORA Phase 2 — Actual Neon Database Implementation

**Date:** 2026-11-22. **Status:** Neon project and initial DB/storage foundations PROVISIONED and CHECKED; Phase 2 overall is **IN PROGRESS**, not completed.

## Live Neon resources

- **Project:** `xora-platform` (`sweet-meadow-04731447`)
- **Console:** https://console.neon.tech/app/projects/sweet-meadow-04731447
- **Database:** `xora` • **PostgreSQL:** 18 • **Region:** `aws-eu-central-1`
- **Main branch:** `br-young-hill-bgijo9jk` • no member accounts or real financial records
- **Staging branch:** `br-proud-base-bgx1lcns` • synthetic fixtures only
- **Compute:** 0.25–1 CU autoscale and 300-second idle suspend on project defaults; staging explicitly set likewise
- **History window:** initial 24 hours. Reassess backup/recovery settings before production.

## What actually exists

1. Two committed SQL migrations on both XORA branches: `0001_foundation` and `0002_runtime_privileges`.
2. Fourteen initial application tables, with foreign keys, check constraints, uniqueness, and relevant indexes.
3. Five predefined staff roles, ten permissions, fourteen role/permission mappings. **No real staff grants or logins on main.**
4. Dedicated `xora_runtime` **NOLOGIN** PostgreSQL role with limited table permissions and no schema-modification rights. It has no password or application connection.
5. Three **private** storage buckets on each branch: `xora-profile-media`, `xora-eligibility-evidence`, `xora-payment-proofs`.
6. Staging fixtures for two fictional accounts, one staff grant, idempotency demonstration, event/job and private-file metadata. **No actual uploads.**
7. Read-only verification performed on the live connected Neon project. Other account projects were not modified.

## Structure

- `migrations/0001_foundation.sql`: first committed schema. **Do not rerun on existing XORA branches.**
- `migrations/0002_runtime_privileges.sql`: read-limited and narrowly write-permitted NOLOGIN DB role.
- `sql/VERIFY_READ_ONLY.sql`: safe validation queries.
- `.env.example`: placeholders for future server-only credentials. No real credentials anywhere in this pack.
- `NEON_IMPLEMENTATION_AND_OPERATIONS.md`: detailed explanations and next steps.
- `PHASE2_EXECUTION_EVIDENCE.md`: passed validations and unfinished launch gates.

## Important security boundaries

- The project exists separately from `amaalprop-v2-staging`, `lexa-backend`, and `AMAAL ERP`. No other database/project was changed.
- The app must **not** use the database owner credential. A future connection role should inherit only `xora_runtime` after review.
- `roles`, `permissions`, `staff_memberships`, `staff_role_grants` are **not writable by `xora_runtime`**. Staff changes must use a separate controlled and audited privileged path.
- `xora_runtime` cannot delete rows or erase `audit_events`; append-only behavior still needs an application and operations test.
- Authentication credentials, MFA and sessions are **not** implemented. Those tables must be generated from the pinned, reviewed auth adapter rather than hand-written.
- Database access is private to server processes: never put DATABASE_URL into web-client code, logs, screenshots or the ZIP.
- Storage has no public buckets or uploads. Signing, object validation and ownership checks still must be implemented.
- No public signup, live profiles, chat, payment collection, admin portal, or production deployment is ready.

## Intended continuation

Implement the web repo, Drizzle-backed schema/test migration workflow, pinned auth integration, permissions middleware, staging server, private storage service, background worker, monitoring, restore drill and remaining tests T01–T52 in the existing Phase 2 design. Then obtain security/engineering/product sign-off before real adults or payments are onboarded.

## Latest staging build and authentication work

See `PHASE2_LIVE_STAGING_AND_AUTH.md` for the actual deployment ID, passed compilation, live API smoke checks, successful isolated restore, seven staging migrations, corrected Better Auth schema identifiers, 73 local policy tests, and precise remaining release gates. Staging is protected, and production customer accounts/payments remain disabled.
