# XORA Phase 2 — Authentication, staff MFA and private-file hardening

**Date:** 22 November 2026  
**Scope:** only XORA's Neon project `sweet-meadow-04731447`, branch `staging` (`br-proud-base-bgx1lcns`), and XORA source repository.  
**Release decision:** **NOT APPROVED** for public signup, payment or verified-adult onboarding.

## What was implemented in source

1. Staff TOTP security with 20-byte random secrets, standards-compatible six-digit authenticator codes (30-second steps), AES-256-GCM encryption and a Vercel server-only encryption key; a user-created string/header cannot prove MFA.
2. Staff enrollment requires a verified email, active application account, active provisioned staff membership, and a login session established within 10 minutes. Enrollment secret can be issued once; confirmation requires a valid TOTP code.
3. MFA verification enforces one-time TOTP step usage, five-attempt lockout, and ten-minute **session-bound** step-up assertion. An assertion is hashed/HMAC-bound to the server-authenticated Better Auth session and must be re-proven after it expires.
4. Admin authorization now evaluates both active granted permissions and a fresh database-backed MFA assertion. All staff operations remain denied if authentication, MFA key, or records are missing.
5. MFA enrollment, success/failed-attempt updates, and audit records are committed transactionally. Codes, plaintext secrets and session-binding keys are not logged.
6. A strict transactional email adapter exists for verified-email and password-reset messages. It rejects wrong-origin URLs, non-HTTPS links, invalid senders and destinations outside the staging domain allowlist. It sends **nothing** until verified sender credentials and explicit environment settings are supplied.
7. Owner-only private download endpoint added for confirmed, non-sensitive files, with strict purpose/path checks, short signed-URL lifetime, and access audit. Verification documents and payment proofs are explicitly denied via this endpoint.
8. Synthetic upload flow remains test-token gated and is not a live member upload system. No malware scanner has been connected, so real files cannot be marked as confirmed by the web-app database role.

## Live Neon actions and evidence

- **0008**: `staff_mfa_credentials`, `staff_mfa_assertions`, and indexes + scoped runtime grants.
- **0009**: revoked `UPDATE` on `file_objects` from the app's roles.
- **0010**: revoked broad `INSERT` on `file_objects` and granted column-scoped creation of pending metadata only.
- Live staging: **22 application/auth tables, 10 recorded migrations, 2 fictional account fixtures, 0 MFA enrollments, 0 MFA assertions**.
- Verified with Neon as `xora_web_staging`: cannot insert `state='confirmed'` for a new file (**SQLSTATE 42501**). Invalid MFA assertion digest also fails (**SQLSTATE 23514**).
- XORA `main` remains at **14 tables, 2 migrations, 0 accounts**. All non-XORA projects untouched.
- A 32-byte random MFA encryption key was generated server-side and stored as a **sensitive Vercel Preview environment variable**; its value is not in any source file or archive.

## Automated verification this turn

- **102 / 102 local policy/logic tests passed**, including RFC 6238 TOTP vector, encryption round-trip, tamper detection, replay blocking, recipient allowlist and private-key ownership.
- **42 TS/TSX files** passed TypeScript parsing/transpilation syntax check.
- **42 TS/TSX files** passed static boundary check for embedded secrets and client-owned roles.
- **Not yet passed:** full dependency-installed TypeScript check, Better Auth vendor schema/real-session integration tests, enrollment/OTP via a real staff login, signed S3 download E2E, scanner results, full browser/device QA or CI pipeline. No claim of these tests is made.

## Deployment status — important distinction

The existing `xora-secure-staging` Vercel project still has protection for **all** deployments and the previous full-source build `dpl_H87VYYz1ErybkQPZUn158HHtQNU6` marked ready. **The new MFA/email/file code has not yet been deployed.** It is available in the updated source archive for dependency installation, review, and a future protected preview deploy. The staging site therefore still runs the previous closed version.

## Why authentication stays off

- No approved/verified XORA transactional sending domain or real email-delivery credentials are available.
- Better Auth 1.7.27 staging schema names are present, but schema compatibility must be rechecked with the pinned actual package, then email verification, password reset, session creation/revocation, MFA enrollment, login and recovery must pass real E2E tests.
- No verified adult eligibility, privacy/consent procedures, independent security audit or Uganda legal sign-off exists yet.
- Public registration, matching, chat, member billing, receipt approvals and payment processing are outside this Phase 2 foundation and remain disabled.

## Exact engineering handoff steps

1. Install pinned dependencies on a network-enabled build runner. Generate and commit lockfile, then run `npm ci`, `npm run typecheck`, `npm run build`, `npm test`, and source boundary checks.
2. Re-run Better Auth CLI schema check on **XORA staging only**; compare case-sensitive columns, indexes and account flows to the pinned installed version. Never reset auth tables blindly.
3. Obtain a verified sender (XORA-owned domain) and configure encrypted server email secrets, exact origin and staging email allowlist. Test delivery to approved internal testers only.
4. Deploy the new source as a **protected Vercel preview**, with `XORA_AUTH_ENABLED=false`, `XORA_SIGNUP_ENABLED=false`, `XORA_MOMO_PAYMENTS=false`, and `XORA_PUBLIC_LAUNCH=false` still set. Run smoke tests before any auth flag change.
5. Invite only designated test staff through a reviewed trusted bootstrap process. Prove verified email, password-reset, session expiration/revocation and server-confirmed TOTP enrollment, step-up, lockout, time expiry, role revocation and audit trace.
6. Connect a real private-object inspector (antimalware, MIME verification, EXIF policy, retention/deletion), using a separate privileged processing role rather than giving the web login permission to mark files safe. Validate signed URL expiry and cross-account denial.
7. Complete remaining Phase 2 acceptance suite, restore/incident runbook, monitored worker and founder/engineering sign-off. Do not enable real onboarding or payments before wider compliance gates are cleared.

**Security rule:** A locally passing test is not equivalent to a completed real session/MFA integration, and a protected staging site is not a public launch.
