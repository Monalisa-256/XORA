# XORA — Complete Project Documentation Bundle

**Bundle version:** 1.2 (documentation collection; not software release)  
**Updated:** 22 November 2026  
**Status:** Approved product concept is still subject to founder decisions, legal/privacy/merchant/provider clearance, implementation and testing.  
**Product:** Browser-based, responsive adult Date / Casual / Both dating service, one identity and one admin workspace.

## Included files

| File | What it answers | Version |
|---|---|---|
| `PRD.md` | **What & why** — business concept, audience, user/admin journeys, pricing, safety, policy and page behavior | 1.2 |
| `ARCHITECTURE.md` | **How systems fit** — modules, data flow, runtime, security, end-to-end state and PRD alignment | 1.0 |
| `DATABASE_SCHEMA.md` | **What data exists** — PostgreSQL tables, relationships, constraints, transactions and data governance | 1.0 |
| `API_SPECIFICATION.md` | **How client/server talk** — endpoints, permissions, request/response examples, admin controls and API tests | 1.0 |
| `TECH_STACK.md` | **Which technology & why** — framework, database, authentication, media, background work, vendor criteria, testing and alternatives | 1.0 |
| `PHASES.md` | **What to build & when** — phases 0–10, dependencies, acceptance criteria, staffing, risk, tests and launch gates | 1.0 |
| `XORA_architecture.png` | Presentation-friendly visual architecture overview | 1.0 |
| `XORA_architecture.svg` | Scalable vector of architecture overview | 1.0 |
| `XORA_architecture.dot` | Editable Graphviz source | 1.0 |

## Recommended reading order

**Founder/product review:** `PRD.md` → `PHASES.md` → `TECH_STACK.md` → architecture overview PNG → `ARCHITECTURE.md`.

**Engineering handoff:** `PRD.md` → `ARCHITECTURE.md` → `TECH_STACK.md` → `DATABASE_SCHEMA.md` → `API_SPECIFICATION.md` → `PHASES.md`.

**Finance and operations:** `PRD.md` §§7,14,17,20 → `PHASES.md` Phases 0,6–10 → `ARCHITECTURE.md` §§12–17 → `API_SPECIFICATION.md` §§6–10.

## Canonical proposed product rules

- One web app; Date, Casual or Both are preferences, **not** separate accounts or platforms.
- Free account and standard profile after appropriate adult verification/approval.
- One **first accepted outgoing introduction** free; rejected/expired free requests do not consume it.
- Incoming invitations and ongoing conversations remain free even after paid membership expiry, subject to safety/consent.
- Renewable Connect Week **UGX 10,000 / 7 days**, Connect Month **UGX 25,000 / 30 days**, Connect Quarter **UGX 60,000 / 90 days**.
- Optional visibility packages: VIP Week **UGX 20,000 / 7 days**; Spotlight Month **UGX 50,000 / 30 days**; VIP Month **UGX 80,000 / 30 days**.
- No lifetime plan, no auto-renewal, no internal wallet, no gateway at MVP.
- A member sends funds externally to an **approved** receiving account and supplies a transaction reference/optional proof. Finance independently verifies real settled money and approves the order; only then does XORA grant rights once.
- This is not an escort booking or paid-sex arrangement service. Verification and safety are never for sale; promoted placement is clearly labeled and cannot override consent.

## Important boundaries

- `DATABASE_SCHEMA.md` includes **reference SQL patterns**, not finished runnable migrations.
- `API_SPECIFICATION.md` is a **proposed REST contract**, not deployed endpoints or a complete OpenAPI 3.1 YAML file.
- `TECH_STACK.md` recommends particular libraries and uses information available on 22 November 2026; pin compatible patched versions at kickoff.
- `PHASES.md` lists project gates, not a guaranteed timeline or budget. Do not use live payment instructions in synthetic/staging testing.
- The existing PNG/SVG/DOT files show the original architecture v1.0 and remain compatible with the selected stack; they are not detailed infrastructure deployments.

## Before real-world launch

1. Confirm Uganda legal scope, local privacy duties/PDPO requirements, brand clearance and appropriate adult-verification procedures.
2. Obtain explicit permission for the actual business and receiving/payment account from relevant providers; manually checking receipts does not override acceptable-use requirements.
3. Approve staff roles, financial reconciliation, refunds, security incident handling, media/verification retention and backup procedures.
4. Create real reviewed migrations, API implementation/OpenAPI, automated acceptance tests and working web app.
5. Complete security, accessibility, privacy and disaster recovery verification and then a small authorized pilot.

## Version and ownership notes

When a business decision changes, update `PRD.md` first; propagate effects through architecture, database schema, API specification, stack decisions and phase acceptance tests. Track decisions in an ADR/decision log. Do not silently override the one-free-accepted-introduction rule or paid-entitlement start dates in implementation.

---

## Phase 1 UI/UX Design Handoff — 22 November 2026

The project now contains the `XORA_PHASE1/` design handoff folder with an interactive **fictional-data, local-only** responsive web prototype, detailed design system, complete screen inventory, 12 member/admin experience journeys, manual-payment UI blueprint, 14 admin UX workflows, UX copy and states, design decisions, acceptance evidence and four SVG/PNG illustration boards.

**To review:** extract ZIP, open `XORA_PHASE1/prototype/index.html` in a modern browser. See `XORA_PHASE1/README.md` and `XORA_PHASE1/PHASE1_ACCEPTANCE.md` for exact coverage and limitations.

**Status:** Design artifacts prepared and static logic tests passed; **formal Phase 1 gate remains pending** founder sign-off, real user/phone usability tests, accessibility validation and Phase 0 legality/payment-provider decisions. The prototype is not a working payment or identity verification service and must never receive real personal or financial information.

---

## Phase 2 Deep Engineering Design — 22 November 2026

A complete **design-only** `XORA_PHASE2/` package has been added. It defines the secure engineering foundation, detailed module interfaces, identity/MFA and RBAC, private test storage, PostgreSQL and migrations, CI/CD, staging isolation, backup/restore procedures, observability and risk controls. It contains **53 implementation tickets**, **52 acceptance tests**, diagrams and a formal decision/sign-off register.

**Read:** `XORA_PHASE2/README.md` → `PHASE2_ENGINEERING_BLUEPRINT.md` → `PHASE2_EXECUTION_BACKLOG.md` and `PHASE2_ACCEPTANCE_TEST_PLAN.md`. The Phase 2 documentation is implementation guidance **not a functioning/deployed app**. Phase 0/1 approvals, actual build/security checks and real payment-provider permission remain outstanding.

## New: Phase 2 Neon implementation milestone (2026-11-22)

`XORA_PHASE2_IMPLEMENTATION/` contains deployed Neon project facts, migration SQL, a restricted runtime-role policy, private-storage setup, synthetic verification evidence, environment placeholders and a safe connection guide. The newly created Neon project is `xora-platform` (`sweet-meadow-04731447`). No other project was modified; no real account/payment data exists. This is a **partial Phase 2 implementation**, not completion of application code or security release gates.

## Phase 2 code update (22 November 2026)

- `XORA_APP/` — new Next.js/TypeScript source tree (closed staging foundation).
- `XORA_APP_CODE_STATUS.md` — verified test results, Neon branch/role isolation and honest blockers.
- `XORA_PHASE2_Code_Implementation.zip` — standalone application source handoff.
- The complete project archive now includes the new code, README, automated tests, migration record, source-security checks and runbooks.
- Code is not yet installed/built/deployed; Phase 2 acceptance and provider approvals are still required.

## New: XORA full-source protected Vercel staging and Neon auth schema (22 November 2026)

A dedicated **protected** Vercel project `xora-secure-staging` (`prj_CHJUd01GsHX6Nnq5B5mkPcz3ucL2`) now runs the full XORA Phase 2 Next.js foundation; deployment `dpl_H87VYYz1ErybkQPZUn158HHtQNU6` passed production compilation/TypeScript. The staging database has 20 tables and 7 migrations; main remains isolated and empty. 73 policy tests pass. A root-branch snapshot restored successfully into an isolated test branch. Auth remains disabled pending a repeat vendor schema check, real email/2FA integration and security review. **No public signup, matching or manual payments enabled.**

See `XORA_PHASE2_IMPLEMENTATION/PHASE2_LIVE_STAGING_AND_AUTH.md` and `XORA_APP_CODE_STATUS.md` for evidence, scope, unresolved gates and safe operation. This replaces earlier notes saying the Next.js source had never been built/deployed.

### 22 November 2026: Phase 2 staff-auth security increment

See `XORA_PHASE2_IMPLEMENTATION/PHASE2_AUTH_SECURITY_UPDATE.md` and `XORA_APP/migrations/0008_staff_mfa_step_up.sql` through `0010_file_insert_column_guards.sql`. Neon staging has 22 tables and 10 migrations, including an encrypted TOTP staff-MFA foundation and column-level restrictions preventing uninspected uploads from becoming confirmed by the web role. The updated source has 102 locally passing unit tests. This new code has **not** yet been installed/built with full dependencies or redeployed. Email verification, live sessions/MFA tests, approved sender, scanner and release sign-off remain pending.
