# XORA — Phase 2 ADRs, Risks, Dependencies and Approval Record

**Version:** 1.0 | **Status:** Draft for founder/engineering review; no approvals asserted.

## 1. Architecture Decision Records (ADRs)

ADRs distinguish **proposed** technology decisions from independently confirmed vendor/operational approvals. A decision becomes `ACCEPTED` only when the named reviewer signs and its proof test passes.

| ADR | Proposed decision | Reason and trade-off | State | Owner / evidence needed |
|---|---|---|---|---|
| ADR-201 | One Next.js App Router modular monolith | Lowest initial operating complexity; strong domain boundaries required | PROPOSED | Engineer proves build/deploy |
| ADR-202 | Strict TypeScript, Zod, locked npm dependency tree | Shared types and input validation; adds review discipline | PROPOSED | Compatibility spike, CI |
| ADR-203 | PostgreSQL with Drizzle-reviewed migrations | Relational integrity for later finance/invitations; SQL reviews mandatory | PROPOSED | Migration rehearsal |
| ADR-204 | Better Auth as initial authentication candidate | Maintained credentials, sessions, verified email and MFA; verify version & adapter | PROPOSED | Auth security spike |
| ADR-205 | Server-side permissions and object-level policy | Needed for privacy/role separation; can add backend complexity | PROPOSED | Matrix approval + denial tests |
| ADR-206 | Staff MFA mandatory before admin APIs | Prevent account takeover; recovery process needs cost and staffing | PROPOSED | MFA/cancel/revoke tests |
| ADR-207 | Private S3-compatible storage with signed, scoped access | Portable and safer for sensitive evidence; additional cost/processing | PROPOSED | Cross-account denial demo |
| ADR-208 | PostgreSQL outbox + small job worker | Avoid Redis initially; require leases/retries/monitoring | PROPOSED | Worker crash test |
| ADR-209 | Staging completely synthetic and access-controlled | Can proceed despite unresolved feasibility; cannot be a real pilot | PROPOSED | Public-path disabled tests |
| ADR-210 | Manual payment pipeline only in Phase 6 | Prevent premature fund handling and legal/vendor bypass | PROPOSED | Founder/finance agreement |
| ADR-211 | Independent migration credentials | Reduces accidental production table changes | PROPOSED | DB privilege check |
| ADR-212 | CI gates plus verified backup restore required | More work upfront; necessary for safe data handling | PROPOSED | Build/restore evidence |
| ADR-213 | Hosting/provider selection after acceptable-use evaluation | Avoids stranded investment or prohibited live operation | UNRESOLVED | Vendor/legal signoff |
| ADR-214 | Phased production placeholder, no real signup | Separate engineering readiness from launch authorization | PROPOSED | Feature flag + route tests |

### ADR template for deviations

```text
ADR-ID:
Date / proposer:
Context and user/business rule affected:
Options considered and cost/security impact:
Chosen decision and reason:
Risks and rejected alternatives:
Affected docs/modules/migrations/APIs/tests:
Approver(s):
Validation evidence:
State: PROPOSED / ACCEPTED / SUPERSEDED / REJECTED
```

## 2. Risks ranked by impact, not appearance

| Risk | Likelihood before validation | Impact | Owner | Mitigation / unblock condition |
|---|---|---|---|---|
| Business/payment provider disallows actual use | Unknown | Critical | Founder/legal | Written legal and actual acceptable-use clearance; stay demo-only |
| XORA brand conflicts | Unknown | High | Founder | URSB/trademark/domain clearance before branded public deployment |
| Age assurance method not adequate | Unknown | Critical | Trust/legal | Phase 3 procedure reviewed; no real member onboarding in Phase 2 |
| Auth library/plugin incompatibility | Medium | High | Engineer | Small integration spike with pinned versions and MFA test |
| Member impersonates staff | Medium | Critical | Security | Server role grants, MFA, negative route tests |
| Access-control bug exposes media | Medium | Critical | Security | Private buckets, authenticated read service, cross-user tests |
| Leaked staging secrets reused in production | Medium | High | DevOps | Isolated secrets/account roles, no shared values, scans and rotation |
| Manual payee details appear on test screens | Medium | High | Finance/engineering | No live payee config; hard-disabled checkout |
| Idempotency race missed by mocks | Medium | High | Backend/QA | Real PostgreSQL concurrent tests |
| Staging becomes unofficial public beta | Medium | Critical | Founder/DevOps | Access-gated staging, no real join and no indexing/public link |
| Backup restores fail | Medium | Critical | DevOps | Timed clean restore drill and checksum evidence |
| Host costs exceed budget | Unknown | Medium | Founder/engineering | Cost categories and alerts before vendor purchase |
| Prior Phase 1 UX unresolved | Known | Medium | Founder/UX | Sign-off and low-end device research; avoid freezing unapproved copy |
| Solo staff cannot enforce independent finance checks | Unknown | High later | Founder/finance | Design two-person options/compensating controls in Phase 6; no live payments now |

## 3. Approvals and missing inputs tracker

| Question | Default for synthetic engineering | Required before real-world operation |
|---|---|---|
| Exactly what services does XORA legally facilitate in Uganda? | Non-compensated adult Date/Casual/Both only | Uganda-qualified counsel written opinion |
| Does chosen host accept actual model? | No provider selected | Written acceptable-use determination |
| Is MTN/Airtel receiving account authorized? | No real payee; payments disabled | Account/provider authorization and finance policy |
| Can sensitive Ugandan personal data be hosted in proposed region? | Synthetic only | Privacy/Data Protection review and vendor agreement |
| What age assurance is sufficient? | Not implemented; no public matching | Safety/legal/verification plan |
| Is 'XORA' available to register and use? | Working project name only | Trademark/business name/domain clearance |
| Which auth version and MFA mechanism? | Better Auth candidate | Passing compatibility/security spike |
| Which cloud provider and backup tier? | Scorecard, no commitment | Price, restore and acceptable-use signoff |
| Who receives security/finance operational alerts? | Test operators only | Named primary/backup staff and on-call hours |
| What retention period applies to identity/receipts? | No real evidence | Written retention/deletion/legal-hold schedule |
| Do we have Phase 1 UX approval? | Design prepared, signature pending | Founder signoff and accessibility/usability results |

## 4. Review agenda for the founder

1. Confirm Phase 2 is foundation only: no public hookup site, no real users and no payments.
2. Approve proposed use of one Next.js app and one PostgreSQL DB, subject to engineering validation.
3. Confirm who pays for domain, hosting, DB, storage, email, backup and legal review, and set a spending cap.
4. Nominate who owns the repository, deployment, secrets, staff grants, privacy, legal/provider contacts and incidents.
5. Approve the staging access policy (who can see it, use sample accounts and test admin views).
6. Sign off Phase 1 visuals and paid membership copy separately; these approvals were pending in the existing handoff.
7. Set acceptable time for a developer to correct P0 vulnerabilities; prioritize evidence over a rushed public launch.
8. Establish written permission workflow for making a future production placeholder or real signup public.

## 5. Founder-friendly milestone reviews

| Review point | What founder should actually see | What that proves | What it does **not** prove |
|---|---|---|---|
| R1 Repo and interface | Protected project and attractive shells | Developer setup/visual consistency | Login is secure |
| R2 Accounts | Fictional login and verified email sandbox | Credentials/session integration | Adulthood verified |
| R3 Staff | Admin sign-in with MFA; ordinary member denied | Server permission boundary | Real finance/admin suite complete |
| R4 Storage | Private synthetic file, unauthorized denial | Permission-controlled storage pattern | Real ID verification safe/legal |
| R5 Worker | Generic email job sends and retries | Durable asynchronous delivery | Real customer notifications ready |
| R6 Release/recovery | CI build, staging URL, restore and alarms | Operational foundation | Public launch authorized |

## 6. Phase 2 sign-off form

```text
XORA PHASE 2 ENGINEERING FOUNDATION REVIEW
Date/time (EAT): ______________________
Source commit SHA/tag: _________________
Deployed staging URL (restricted): ______
Document and tested library versions: __
Phase 0 legal/provider approval: GO / REVISE / UNRESOLVED
Phase 1 UX founder sign-off: YES / NO / CONDITIONAL
P0 test cases passed: ____ / ____
P1 test cases passed: ____ / ____
Security severity-1/critical open issues: ___________
Database restore verified (timestamp / operator): ___
Staff MFA + role denial evidence attached: YES / NO
Private storage denial evidence attached: YES / NO
Synthetic-only and no live payment checks: YES / NO
Owner operations access/alerts confirmed: YES / NO
Engineering approver/signature: _________________
Security/privacy approver/signature: ___________
Founder approver/signature: ___________________
Gate outcome: BLOCKED / DESIGNED / BUILT_NOT_VALIDATED /
              PASS_WITH_RESTRICTIONS / PASS
Conditions and who owns them: __________________
```

**Current documented state:** `DESIGNED`. A design package cannot sign its own gate, and Phase 2 implementation has not been performed or validated in this task.
