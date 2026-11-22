# XORA — Admin UX: All 14 Operational Journeys

**Purpose:** Phase 1 wireframe-level design contract for the single XORA administrator dashboard. This complements the interactive staff demonstration rather than replacing the technical `API_SPECIFICATION.md` and permissions model.

## Universal admin shell

**Desktop:** left vertical staff navigation; top area with staff role, environment label, pending alerts and sign-out; main content includes a list view or detail view. **Phone:** only urgent, explicitly permitted triage tasks; financial confirmation should use a full enough view to compare official records safely. Never allow uncontrolled copy/download of identity evidence.

**Priority order:** critical safety → account eligibility → unresolved real money → ordinary content review → promotions/analytics. Summary cards always display queue **counts and aging**, never unverified screenshot amounts as revenue.

### Global staff record pattern

| Section | Contents |
|---|---|
| Header | Case/order ID, category, assigned reviewer, severity, time opened and current status |
| Facts | Original immutable data and member-provided claim (clearly distinguished) |
| Independent evidence | Official settlement or restricted verification result; who checked it and when |
| Action constraints | Permission, completeness, conflict, dual review and potential consequences |
| Actions | Clear primary action, alternative correction/hold/escalation, cancel/back |
| History | Timeline with actor ID, time, old/new status, reason, evidence IDs and notification events |
| Next steps | Owner, SLA, unresolved exceptions and handover notes |

## ADM1 — Start of day

**Entry:** `/admin` after named-login/MFA. **Layout:** six queue tiles, urgent banner, daily reconciliation status and oldest outstanding records. **Primary task:** open Critical Safety, then age/eligibility, then finance. **Empty:** show “No cases awaiting review” with last refresh. **Provider outage:** show read-only finance mode; disable approvals. **Acceptance:** finance reviewer knows whether actual receiving history is up to date and which queue to work next.

## ADM2 — New profile review

**Entry:** `/admin/profiles` → review detail. **Panels:** previous approved vs proposed profile, media moderation checklist, age eligibility **result only**, member visibility state. **Actions:** Approve content, Needs specific changes, Restrict, Escalate. **Decision:** required reason for correction/restriction; no payout actions. **Edge:** paused profile remains undiscoverable even after content approval. **Acceptance:** approving content does not imply identity/adulthood proof and never publishes an account still ineligible.

## ADM3 — Clean payment approval

**Entry:** `/admin/payments` → order detail. **Panels:** immutable plan/amount/duration, member transfer reference, *separate* independently sourced receiving-account record, duplicate/reversal results, member eligibility, decision audit. **Primary:** Confirm & Activate only after all checks pass. **Confirmation modal:** repeats affected account, price and exact entitlement dates; requires final confirmation. **Success:** immutable receipt and one entitlement. **Concurrent review:** second staff sees “Already reviewed” and a read-only historical result. **Acceptance:** no screenshot-only approval; no duplicate grant.

## ADM4 — “I paid but nothing happened”

**Entry:** `/admin/support` → search by order ID. **Header:** payment lifecycle state independent of entitlement state. **Actions:** Guide member to tracking, request same-order correction, escalate paid-but-not-activated, open finance case. **Copy:** “We have your details, but have not independently confirmed the transfer” when applicable. **Never:** ask for PIN/OTP or direct member to a personal recipient. **Acceptance:** member receives an accurate status and tracked owner.

## ADM5 — Wrong amount, duplicate or late transfer

**Entry:** `/admin/unmatched` or payments exceptions. **Comparison:** amount expected vs actually received, verified transfer reference, possible duplicate orders, active plan dates. **Actions:** Hold, approve documented permitted adjustment, create refund case, request missing details. **Guardrail:** amount mismatch cannot be silently marked exact. **Acceptance:** no money is lost from reconciliation and no phantom wallet balance exists.

## ADM6 — Suspicious screenshot

**Entry:** finance queue risk flag. **UI:** screenshot identified as *member-uploaded and unverified*, duplicate-reference history and official statement match status. **Actions:** Request correction, hold or escalate if evidence of abuse; never publicly accuse. **Acceptance:** fake image cannot activate membership and member gets a neutral resolution path.

## ADM7 — Correct a wrong financial decision

**Entry:** approved order → “Request correction” (finance supervisor role). **UI:** immutable previous decision, evidence reason, proposed adjustment and impact preview on entitlement, member notification/refund obligation. **Actions:** Request dual authorization, apply once, notify. **Acceptance:** old approval remains in history; staff cannot delete the audit record or directly edit arbitrary dates without reason.

## ADM8 — Change authorized receiving details

**Entry:** `/admin/channels` → controlled change request. **UI:** current and proposed recipient names/masked account IDs, provider authorization evidence, effective future timestamp, preview of customer checkout, affected unpaid orders and independent second reviewer. **Actions:** Save draft, request approval, schedule only for **new orders**. **Danger state:** block publish if second review or provider approval missing. **Acceptance:** existing orders keep original instructions and receive transition guidance; change is audited.

## ADM9 — Suspected underage member

**Entry:** safety/verification critical case. **UI:** high-priority restricted record, safe action path and minimum necessary evidence. **Actions:** Temporarily remove discoverability/contact rights, refer to qualified reviewers, follow approved child-protection protocol. **Never:** show age-ID docs on general admin pages or accept payment as eligibility evidence. **Acceptance:** no continued user visibility while eligibility is under review and no sensitive exposure in staff summary.

## ADM10 — Harassment, impersonation or scam

**Entry:** `/admin/safety`. **UI:** reporter's category, case ID, summary, restricted evidence, possible immediate protective action and applicable account history; no unrelated chat access. **Actions:** Triage severity, preserve necessary evidence, restrict where justified, notify with minimal disclosure, support appeal. **Acceptance:** urgent cases appear above standard finance work; reviewer can act proportionately and justify decision.

## ADM11 — VIP campaign lifecycle

**Entry:** `/admin/promotions`. **Calendar:** profile eligibility, paid package, approved start/end timestamps, labeled placement slot, active/queued/paused/expired status. **Actions:** Schedule, pause for ineligibility, correct clock with audit, renew to queue. **Acceptance:** campaign never overrides preferences or safety and free ordinary profile remains afterward.

## ADM12 — Erasure / account deletion request

**Entry:** `/admin/privacy-requests`. **UI:** verified account-owner request, visibility pause status, data-category checklist, legal-retention exceptions, expected action/reply. **Actions:** Assign privacy specialist, fulfill permitted deletions, document lawful exceptions, notify. **Acceptance:** account disappears from discovery promptly; staff does not promise deletion of records legally required for disputes/finance/safety.

## ADM13 — End-of-day finance handover

**Entry:** `/admin/incidents` → Finance handover. **UI:** total actual official incoming transfers, matched to one order, unmatched, disputed, refund/reversal cases, approvals vs entitlements, unresolved queue with named owner. **Actions:** Save signed handover, assign owner/date. **Acceptance:** every real incoming transaction has exactly one reconciled outcome; unresolved items remain visible.

## ADM14 — Weekly founder review

**Entry:** `/admin/analytics`. **Metrics:** eligible profile counts by broad area/intention, successful first accepted introductions, time to acceptance, paid passes sold and renewed, verified settled cash, net margin, promotion outcomes, safety complaints, review time, support case aging. **Guardrails:** no exposure of personally identifiable dating-intention analytics to staff without need, and no claim of “verified revenue” from screenshot uploads. **Actions:** Annotate findings and assign product experiments—not auto-change prices or consent policies. **Acceptance:** founder can decide whether matching value, safety and economics are improving.

## Authorization model presented by UX

| Capability | Member support | Profile moderator | Age verification specialist | Finance reviewer | Finance supervisor | Safety lead | Owner |
|---|---|---|---|---|---|---|---|
| See basic masked account | Yes | Yes | Yes | Only order-related | Only finance-related | Case-related | Need-to-know |
| View ID/adult evidence | No | No | Restricted | No | No | Only if specially authorized | Not by default |
| Approve profile text/photo | No | Yes | No | No | No | Escalation | With authorized role |
| Verify settled funds | No | No | No | Yes | Yes | No | With finance role |
| Refund execution | No | No | No | Request | Approve per policy | No | Dual approval where possible |
| Access unrelated private chats | No | No | No | No | No | No | No |
| Restrict serious abuse | Escalate | Escalate | Age risk | No | No | Yes | With safety role |
| Change official payee | No | No | No | No | Propose/review | No | Controlled dual review |

This matrix is a **UX intent**, not a security implementation. Server-enforced RBAC, MFA, actor audit and dual control are mandatory in later development phases.

## Admin prototype interaction coverage

| Demonstrable | Present in `prototype/index.html` |
|---|---|
| Overview with safety/finance/profile metrics | Yes |
| Finance queue and order detail | Yes |
| Checkboxes that gate a simulated approval | Yes |
| Same-order correction request | Yes |
| Duplicate approval blocked in demo logic | Yes |
| Fictional profile content approval | Yes |
| Critical safety queue and support ticket summary | Yes |
| Staff settings and sample audit view | Yes |
| Real age documents, refunds, true MoMo settlement, MFA | **No; out of Phase 1 and not safe to simulate as real** |

## Staff usability questions before sign-off

Ask an actual finance reviewer (using fake data) to explain where the independent statement comes from, why the screenshot is insufficient, when approval remains disabled, what to do with an unmatched payment, and how to avoid recharging a waiting member. Ask a safety specialist how to triage an underage risk ahead of payment approvals and where private evidence access is controlled. **These observed tests have not been conducted in this artifact.**
