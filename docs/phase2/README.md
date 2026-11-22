# XORA — Phase 2 Deep Engineering Design Package

**Version:** 1.0 · **Prepared:** 22 November 2026  
**Status:** **DETAILED DESIGN COMPLETE — BUILD NOT STARTED IN THIS PACKAGE**  
**Scope:** Phase 2 of `PHASES.md` §6: engineering foundation and safe deployment pipeline. The files describe what an implementation must achieve; they are not evidence of a deployed XORA server.

## What this package provides

| File | Why read it |
|---|---|
| [`PHASE2_ENGINEERING_BLUEPRINT.md`](PHASE2_ENGINEERING_BLUEPRINT.md) | Start here: scope, architecture, module layout, auth, DB, storage, jobs, release and acceptance |
| [`PHASE2_DATA_AND_API_FOUNDATION.md`](PHASE2_DATA_AND_API_FOUNDATION.md) | Foundation schema and `/api/v1` proof-of-concept contracts, auth/permission and transaction sequences |
| [`PHASE2_SECURITY_AND_PRIVACY.md`](PHASE2_SECURITY_AND_PRIVACY.md) | Threat model, private data, RBAC, staff MFA, audit, incidents, legal/hosting boundaries |
| [`PHASE2_INFRASTRUCTURE_AND_RELEASE.md`](PHASE2_INFRASTRUCTURE_AND_RELEASE.md) | Environments, infrastructure selection, CI, migration, secrets, backups, recovery and operations |
| [`PHASE2_EXECUTION_BACKLOG.md`](PHASE2_EXECUTION_BACKLOG.md) | **53** sequenced tickets with owners, priorities, dependencies and acceptance evidence |
| [`PHASE2_ACCEPTANCE_TEST_PLAN.md`](PHASE2_ACCEPTANCE_TEST_PLAN.md) | **52** negative, concurrency, recovery, UX and security test cases |
| [`PHASE2_TRACEABILITY.md`](PHASE2_TRACEABILITY.md) | One-to-one `PHASES.md` requirement coverage and intentional later-phase boundaries |
| [`PHASE2_DECISIONS_AND_SIGNOFF.md`](PHASE2_DECISIONS_AND_SIGNOFF.md) | Architecture decisions, unresolved approvals, risks and formal founder/security sign-off |
| [`diagrams/phase2_foundation.png`](diagrams/phase2_foundation.png) | Overview of XORA's private, staged foundation |
| [`diagrams/phase2_foundation.svg`](diagrams/phase2_foundation.svg) | Scalable architecture diagram; `.dot` source included |
| [`diagrams/phase2_delivery.png`](diagrams/phase2_delivery.png) | Evidence-gated Phase 2 execution path; SVG/DOT included |

## What the founder should know

Phase 2 makes the later XORA product **safe to build**. It does not itself provide full dating, real identity verification, matching, chatting, or accepting actual Mobile Money transfers. The intended output of engineering Phase 2 is a restricted **staging skeleton** with verified-email sessions, genuine staff MFA and permission boundaries, private synthetic files, PostgreSQL migrations, safe background notifications, CI/deployment and successful backup restore. Legal/provider/merchant approvals and Phase 1 founder sign-off cannot be silently skipped.

### Unchanged XORA product rules

One browser-based app; Date / Casual / Both on one account; normal registration free; one accepted first outgoing introduction free; incoming and existing replies free. Renewable Connect passes: **UGX 10,000 / 7 days; 25,000 / 30 days; 60,000 / 90 days.** Optional VIP/Spotlight visibility: **20,000 / 7 days; 50,000 / 30 days; 80,000 / 30 days.** Manual transfer verification only; no gateway, wallet, auto-renewal or lifetime plan. Dating/casual adult connections are not compensated sexual services or escort bookings.

### Suggested reading order

- **Founder:** `README.md` → `PHASE2_ENGINEERING_BLUEPRINT.md` §§1–2,11–14 → `PHASE2_DECISIONS_AND_SIGNOFF.md` → diagram.
- **Engineering:** Blueprint → Data/API → Security → Infrastructure → Backlog → Tests.
- **QA/security:** Security → Tests → Data/API → Traceability → Risks/Signoff.

### First actionable engineering ticket

`P2-001`: record Phase 0 and Phase 1 gate decisions and keep all live-member/payment capabilities disabled until approvals; then `P2-003` compatible pinned stack, `P2-007` protected repository and `P2-014` disposable PostgreSQL setup.

### Present status

This package contains documents and diagrams **only**. No real staging deployment, authenticated backend, payment approval, database migrations, CI runs or security tests were executed during this task. Tickets and test matrices are acceptance specifications, not pass reports. Document status: **DESIGNED**.

---

## Live Neon progress update — 22 November 2026

Phase 2 has moved beyond design for its **Neon database and private storage foundation**. See the new sibling directory `XORA_PHASE2_IMPLEMENTATION/` in the updated project bundle, particularly `README.md`, migration SQL and `PHASE2_EXECUTION_EVIDENCE.md`.

Created **only** a new project `xora-platform` (ID `sweet-meadow-04731447`), with `main` and `staging` branches, 14 foundation tables, 2 applied migrations, 5 roles, 10 permissions, a restricted `NOLOGIN` runtime role, and three empty private buckets per branch. Main has no real or demo member accounts; staging contains synthetic fixtures. **No existing Neon projects were changed.**

All Next.js, authentication, deployment, signed-object access, backup-restore and most of the Phase 2 acceptance tests are still **NOT IMPLEMENTED / NOT TESTED**. Do not interpret this infrastructure milestone as Phase 2 sign-off.
