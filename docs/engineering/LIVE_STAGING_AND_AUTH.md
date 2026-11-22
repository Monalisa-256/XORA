# XORA — Phase 2 live implementation evidence

**Recorded:** 22 November 2026  
**Scope:** XORA-only Neon project and new, protected Vercel staging app.  
**Status:** **Partially implemented and verified; not signed off for live member onboarding**.

## 1. Real infrastructure created

| Item | Observed state |
|---|---|
| Neon project | `xora-platform`, `sweet-meadow-04731447`, Frankfurt (`aws-eu-central-1`), PostgreSQL 18 |
| Neon main | `br-young-hill-bgijo9jk` — 14 tables, 2 migrations, no real user data |
| Neon staging | `br-proud-base-bgx1lcns` — 20 tables, 7 migrations, no Better Auth users, 2 fictional XORA accounts |
| Staging DB app login | `xora_web_staging`, constrained privileges inherited from `xora_runtime` |
| Private storage | Profile, eligibility and receipt buckets remain private; a separate private synthetic-fixture bucket exists in staging |
| Vercel project | `xora-secure-staging`, `prj_CHJUd01GsHX6Nnq5B5mkPcz3ucL2` |
| Deployed full source | `dpl_H87VYYz1ErybkQPZUn158HHtQNU6`, `READY` |
| Deployment URL | https://xora-secure-staging-cjrzwn71o-kabuusumohammed182-7875s-projects.vercel.app |
| Deployment protection | Vercel Authentication: **all** deployments |
| Source release | Closed staging, **not** a customer-facing launch |

**No existing Neon or Vercel project was modified.** No real personal information, customer registrations, or payment transactions were enabled.

## 2. Automated evidence

- **73 of 73 Node policy and correctness unit tests passed** locally on the updated app source.
- Source boundary checks passed across **33 TypeScript/TSX files**, detecting no hardcoded credentials or client-owned role decisions.
- **Full Vercel Next.js production build** and TypeScript checks succeeded (Next.js 16.4.6).
- HTTP smoke tests (through protected Vercel access): public landing route 200; liveness 200; anonymous member route denied (401); anonymous staff health denied (403); auth endpoint returned 503 while feature is off; readiness returns 404 without monitor credential.
- Neon staging verified role cannot grant staff access or erase audit trails, and duplicate outbox/job requests produce one stored record.
- Snapshot from XORA main restored into isolated `phase2-recovery-test-20261122` (`br-icy-snow-bgvff9rb`) without swapping branches; verified 14 tables, 2 migrations, no accounts.
- Auth table alignment verified on staging: 6 Better Auth tables, expected case-sensitive columns, 0 authentication users. **Full vendor authentication schema compatibility and session issuance have not been verified after the renaming.**

## 3. Authentication schema history and important compatibility fix

- `0005`: Better Auth 1.7.27 (generated with Drizzle dialect) created tables `user`, `session`, `account`, `verification`, `rate_limit`, `two_factor` on **staging only**.
- `0006`: granted auth-table privileges to constrained runtime role.
- **Found incompatibility:** Better Auth's configured Kysely/PostgreSQL runtime adapter expects camelCase identifiers; generated Drizzle SQL used snake_case. A vendor schema check initially **failed** because of this difference.
- `0007`: renamed **empty** staging auth tables/columns non-destructively to runtime-shaped names, verified expected metadata and permissions. This was not run on main.
- `0005_better_auth_generated.sql`, `0006_auth_privileges.sql`, `0007_better_auth_kysely_names.sql` in `XORA_APP/migrations/` are provided as a **reviewable replay/reference history**, not an approval to rerun on an initialized branch. Always check migration registry and retest installed Better Auth version.
- **Important remaining gate:** repeat the vendor `auth check schema` against XORA staging after the rename, then prove email verification, login/session revocation, 2FA enrollment/challenge and staff MFA in real integration tests. Do not enable auth/signups before these pass.

## 4. Release gates still open (not complete)

1. Approved real email delivery and recovery channels; sign-up currently off.
2. Full Better Auth vendor schema recheck and real authenticated session/2FA tests, with properly scoped test accounts.
3. Profile/identity eligibility and moderation implementation, private media malware scanning, retention and signed-URL E2E checks.
4. Worker runtime, alerting, recurring schedule, integration/concurrency tests and security review.
5. Restricted CI/Git repository, dependency lockfile, reviewed patches, accessibility and real-device UX review.
6. A documented retention/restore policy beyond the successful root-branch restore smoke test.
7. Uganda legality, PDPO/privacy, name clearance, and explicit payment-provider permission for the actual business before real money or member content.
8. The **rest of the XORA marketplace** (profiles, Date/Casual matching, messaging, Connect Passes, receipt verification/admin approvals) is not yet live; these are separate later phases.

## 5. Isolation and safety

- XORA project IDs and branch IDs are explicit in deployment configuration.
- `DATABASE_URL` and monitor token are stored as server-only sensitive variables, **not included** in this report or archives.
- The main XORA database remains empty of member accounts. Existing Neon projects were never targeted.
- Feature flags remain `XORA_AUTH_ENABLED=false`, `XORA_SIGNUP_ENABLED=false`, `XORA_PUBLIC_LAUNCH=false`, `XORA_MOMO_PAYMENTS=false`, `XORA_TEST_ENDPOINTS=false`.
- Synthetic staging fixtures may be used only to validate backend behavior; do not upload real identity documents or pay via this deployment.

## 6. Explicit result

**Phase 2 has reached a real, protected full-source staging build and live Neon schema validation. It is not yet a production-ready dating platform and is not fully signed off.** No automatic payment gateway, consumer-facing manual payment workflow or live account access has been activated.
