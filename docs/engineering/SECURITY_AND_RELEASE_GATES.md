# XORA — Phase 2 security and release gates

**Status:** Build/code foundation + Neon staging tables exist. The app is NOT production-ready and does NOT accept members or payments.

## What has been implemented
- New XORA-only Neon project `sweet-meadow-04731447` with separate `main` and `staging` branches.
- Fourteen phase-2 foundational tables and restrictive role/permission data.
- Private buckets on both branches for profile media, eligibility evidence, and payment proofs.
- `xora_runtime` NOLOGIN privilege template (main + staging).
- `xora_app_staging` NOLOGIN role on staging, a member of `xora_runtime`, with no privileges to delete accounts/audit or issue staff role grants.
- A Next.js TypeScript source repository with safe staging UI and API foundation.
- Better Auth integration source is behind `XORA_AUTH_ENABLED=false` and **has not been migrated, run, or validated**.
- Test-only idempotency/outbox endpoints with explicit staging flags and long shared-token protection; they are always off by default.
- Server-side account lookup and permission decisions; admin routes deliberately deny until trusted MFA confirmation has been implemented.
- No automatic payments, no public profile discovery, and no real member records in Neon `main`.

## Must complete before deploying a test website
1. Install pinned dependencies in a network-enabled CI/staging environment and run `npm ci`, `npm run typecheck`, `npm run build`, `npm test`, and dependency/security audit.
2. Review compatibility of the installed Better Auth release and generate/migrate its actual auth tables on **staging only**. Never guess or manually invent authentication tables.
3. Select an authorized transactional email provider, implement verified emails, password resets, and anti-abuse controls; never enable sign-up before Phase 3 age/eligibility controls.
4. Activate `xora_app_staging` LOGIN **with a randomly generated password in a secure secret store**, not via this repository. Do not deploy with `xora_owner` or any `neon_superuser` role.
5. Confirm the DB URL is on the specific staging branch host `ep-cold-dream-bgawtzwi-pooler.c-9.eu-central-1.aws.neon.tech`, database `/xora`, role `xora_app_staging`. Runtime explicitly enforces all three plus the XORA project ID setting.
6. Configure Vercel/hosting deployment protection before exposing any staging URL. Restricted staging access must be tested with an unauthenticated browser.
7. Implement and test server-verified fresh MFA session evidence for all staff endpoints. A `twoFactorEnabled` user flag or a request header is not evidence. Until then, staff routes return forbidden.
8. Provision and test private object storage upload/download with purpose-bound permissions and audit, short TTL, malware scanning, EXIF metadata removal, retention and deletion. Merely creating private buckets is insufficient.
9. Implement a separately scheduled worker (or secure cron) and lease/retry/dead-letter behaviour. Current route processes synthetic jobs only.
10. Document legal and provider approval for the actual XORA dating/casual service before real user data/payments are accepted.

## Must complete before any public release
- Independent penetration test, CSRF checks, API abuse/rate limiting, property-based authorization tests, email security review, account deletion flow, privacy impact assessment, backup restoration exercise, incident response, content/report moderation, audit separation, and staff training.
- `XORA_PUBLIC_LAUNCH=false` until a recorded human approval. Never use a simulated screenshot receipt to approve payments.

## Explicitly not done
- Next.js production build (npm registry inaccessible here).
- Actual SMTP/email delivery, sign-ins, sessions, or external user onboarding.
- Database credential provisioning to a deployed application.
- Staging deployment and browser end-to-end testing.
- Real background email notifications or payment workflows.
- Full 52-test Phase-2 acceptance plan.

## No cross-project changes
Only `sweet-meadow-04731447` was used for new Neon writes. Existing Neon projects were not targeted.
