# XORA application status — 22 November 2026

**Overall: Phase 2 security implementation in progress. Not launch-ready.**

**Live Neon staging:** XORA-only database `sweet-meadow-04731447` / `br-proud-base-bgx1lcns`, 22 tables and 10 migrations; 2 synthetic account fixtures; 0 MFA accounts. `main` has 14 tables, 2 migrations, zero accounts. Web role cannot make uninspected files confirmed.

**Updated local source:** server-held staff TOTP verification, AES-GCM encrypted secrets, 10-minute session proof, replay/lockout protection, role checks, private file-download authorization and short-lived URLs, safe email adapter requiring verified sender and allowlist. 102/102 pure Node tests passed, 42 TS/TSX files syntax checked, 42 files passed security boundary scan.

**Vercel:** `xora-secure-staging` remains protected, previous deployment `dpl_H87VYYz1ErybkQPZUn158HHtQNU6` is ready. **The new authentication and file-security code has not been redeployed**, and live sign-in/2FA has not been demonstrated.

**Blocking gates:** real transactional email sending domain, Better Auth vendor/runtime session tests and staff MFA E2E, authenticated staging preview build, file scan/retention policy, worker release/alerting, full Phase 2 acceptance tests and Uganda privacy/legal reviews. Signup, member features and payments remain OFF.

Full implementation details: `XORA_PHASE2_IMPLEMENTATION/PHASE2_AUTH_SECURITY_UPDATE.md`.

## Phase 3 protected production increment (27 November 2026)

See [Phase 3 implementation and verification](phase3/PHASE3_IMPLEMENTATION.md). The empty authentication and member schema was installed on the XORA production Neon branch; runtime write activation is not applied. Source awaits successful GitHub import/build and both production deployments. Live signup and real-user evidence remain closed pending the documented release gates.
