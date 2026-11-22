# XORA — Phase 2 Traceability and Coverage Map

**Status:** Design-to-requirement mapping. **Not** proof of implementation or completed testing.  
**Input scope:** `PHASES.md` §6; `PRD.md` v1.2; `TECH_STACK.md` §§4–15; `DATABASE_SCHEMA.md`; `API_SPECIFICATION.md`; `XORA_PHASE1/PHASE1_ACCEPTANCE.md`.

## 1. Phase 2 exit criteria coverage

| PHASES.md §6 deliverable | Detailed design location | Work tickets | Test cases | Exit artifact |
|---|---|---|---|---|
| Repository/Next.js modular structure | Blueprint §§3–4 | 007–009 | T01–T02 | Protected repo + pinned build |
| Dependency compatibility matrix | Blueprint §§4,14; Decisions ADR-202/204 | 003,016 | T01 | Recorded versions, reproducible install |
| Responsive design-system shell | Blueprint §4; Infrastructure §5 | 010–013 | T47–T49 | Accessible staging shells |
| Isolated environments and config | Blueprint §11; Infrastructure §§2–3,7 | 004,015,044,046 | T03–T05,T50 | Environment inventory, safe flags |
| Managed DB, reviewed migrations, backup | Blueprint §5; Data/API §§2–3,10; Infrastructure §§6,9 | 014–021,047–048 | T06–T10 | Migration history + restore evidence |
| Auth POC, sessions, verified-email, `/api/v1` | Blueprint §6–7; Data/API §§4–6 | 022–028,031 | T11–T24 | Authz/MFA and API HTTP proof |
| Server permission, validation, idempotency | Blueprint §§6–8; Data/API §§5–7; Security §§3–4 | 026,029–033 | T16–T31 | Access matrix, transaction race proof |
| Private file POC | Blueprint §9; Data/API §8; Security §§2,6 | 034–037 | T32–T37 | Cross-user/expired-link denials |
| Worker/outbox generic test email | Blueprint §10; Data/API §9; Infrastructure §§1,8 | 038–041 | T38–T43 | Retry/lease/sandbox proof |
| CI/testing/staging deployment | Blueprint §§11–12; Infrastructure §§4–7 | 044–047,050–053 | T01–T10,T47–T52 | Deploy pipeline and review record |
| Safe logs, health, alerts | Blueprint §11; Infrastructure §8; Security §8 | 042–043 | T42,T44–T45 | Sanitized dashboard + alert test |
| Founder operations view | Blueprint §14; Decisions §§4–6 | 052–053 | T51–T52 | Named owner dashboard + sign-off |

## 2. Core XORA product decisions respected

| Existing requirement | Phase 2 foundation interpretation | Live functionality in Phase 2? |
|---|---|---|
| One browser-based XORA application | One Next.js deployment with public/member/admin shells | Skeleton only |
| Date/Casual/Both under one identity | One canonical app account mapping; no mode-specific auth silos | No actual profile preference storage yet |
| Free membership and first accepted outgoing intro | DB transaction/idempotency seam reserved | No invitations or free-credit consumption yet |
| Incoming requests/replies always free | Future policy boundary never tied to demo staff roles | No actual messages yet |
| Connect 7/30/90 day renewable passes | Monetary/entitlement interfaces reserved in module map | **No** purchases or entitlements yet |
| Optional 7/30-day VIP promotion | Future promotions module disabled | **No** promotion sale/placement |
| Manual MTN/Airtel payments only | General idempotency/audit foundation, distinct staff permissions | **No** real payee, order, receipt or approval |
| Age eligibility independent of payment | Verified-email identity is *not* adult-verified | Real age verification in Phase 3 |
| No public private member profiles | Private routing, storage and no-cache controls | **Yes**, access boundary prototype |
| Admin approval only after independent settled funds | Future finance roles and ledger architecture reserved | **No** finance actions now |
| User data minimization | Synthetic fixtures, restricted evidence design, redacted logs | **Yes**, no real personal information |
| No native app, wallet, gateway, auto-renew | No related components or credentials | Excluded |

## 3. Requirements intentionally deferred

**Phase 3:** real eligibility verification, consent acceptance, profile review, account privacy rights.  
**Phase 4:** Date/Casual discovery, mutual matching, first accepted outgoing invitation once.  
**Phase 5:** persisted conversations, free incoming/replies and notification preferences.  
**Phase 6:** verified manual payments, order lifecycle, settlement uniqueness, membership renewal, finance refunds.  
**Phase 7:** VIP placement and full operational admin/safety workflows.  
**Phase 8:** complete end-to-end privacy, security, financial correctness and launch rehearsal.  
**Phase 9:** controlled approved real-person pilot, only after all regulatory/provider prerequisites.

## 4. Conflict checks and decision priority

| Potential contradiction | Chosen resolution | Approval note |
|---|---|---|
| Phase 1 prototype includes a role-switching admin demo | Replace with real staff MFA/protected routes | Never carry demo switch into production |
| API spec describes complete live finance endpoints | Phase 2 implements only foundation `/api/v1` POC | Finance remains Phase 6 |
| Phase 2 verified-email demo vs adults-only product | Email check is not age assurance | Do not enable discovery until Phase 3 |
| Need to test uploads vs prohibition on collecting identity | Use generated fake assets and private test storage | Real evidence deferred |
| Staging identity vs public web app aspiration | Restrict staging and disable public joining | Release only through explicit gate |
| CI deploy requirement vs legal/provider uncertainty | Deploy synthetic staging only, no public marketplace | Permissible preparatory work subject to vendor terms |
| Auth library API schema changes between versions | Pin compatible release at coding and record migration ownership | No guesswork in SQL |

## 5. Final acceptance logic

A document or a test-plan table gives **design coverage**, not implementation coverage. Formal Phase 2 exit requires traceability evidence stored in each ticket, the 52 defined tests executed with real staging/disposable services, named security and founder approval, validated restore and no unresolved P0 bug. Any Phase 0/1 blockers must be clearly listed and keep real operations switched off.
