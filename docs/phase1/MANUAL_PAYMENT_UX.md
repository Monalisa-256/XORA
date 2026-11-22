# XORA — Manual Payment UX Blueprint (No Gateway)

**Design-only.** No real payee or transfer instructions are supplied here. This document cannot authorize XORA to use MTN/Airtel or accept payments for activities prohibited by law/provider policy.

## The promise

XORA offers a member-controlled, **non-auto-renewing**, timed purchase. The member pays the **verified business receiving account externally**, submits limited transaction details, waits for staff review, then receives an exact-dated benefit only after independently confirmed settled funds. No wallet, hidden charges, credits, deposits or paid introductions to particular people.

## Products and customer-facing rights

| Pass | Price | Duration | Core unlock |
|---|---:|---:|---|
| Free | UGX 0 | Ongoing | Profile, discovery, one accepted outgoing intro, incoming invites and replies |
| Connect Week | UGX 10,000 | 7 days | Additional outgoing introductions within fair-use policy |
| Connect Month | UGX 25,000 | 30 days | Same |
| Connect Quarter | UGX 60,000 | 90 days | Same |
| VIP Week | UGX 20,000 | 7 days | Clearly labeled profile placement |
| Spotlight Month | UGX 50,000 | 30 days | Featured placement |
| VIP Month | UGX 80,000 | 30 days | Enhanced labeled visibility |

**Promotions are not Connect Passes.** A member may purchase either independently; neither grants verification or a match.

## Wireframe 1 — Plan selection

**Header:** “Choose a Connect Pass” or “Promote your profile”, not “Buy a date”.

Each card: plan name, **UGX exact price**, **7/30/90 consecutive days**, precise feature benefit, no auto-debit, no guarantee of a response. Display current free status or active pass, scheduled renewals and what stays free. **Primary CTA:** “Choose [plan]”.

## Wireframe 2 — Order summary

**Before payment:** immutable product and amount, exact duration; manually reviewed; benefit starts only upon confirmed activation; what happens at expiry; clear refunds/support link; user checkbox acknowledging delayed review. **CTA:** “Create order”.

An order is not evidence of payment. The `XORA-[date/sequence]` order ID is stable and unique. If the browser is interrupted, the same order must be recoverable; retry must not silently create multiple orders.

## Wireframe 3 — Official recipient display

Only after a properly authorized account is configured, show provider, verified business recipient name, masked-and-revealable payment account details, order reference, exact UGX amount, anti-fraud guidance and the provider's external payment steps. The screenshot demonstrator displays **“NOT CONFIGURED / DO NOT TRANSFER”** rather than a fake account number.

**No public FAQ/marketing page may show a staff member's personal number.** Payee changes require staff double-control; existing open orders keep original contractual instructions and a clearly disclosed transition.

## Wireframe 4 — Submission form

Required: payment method, provider transaction reference. Request minimal payer detail and approximate time only when useful; receipt screenshot optional. Mask sensitive information in staff lists. **Never** ask for PIN, OTP, full password, national ID photo or contact list. Provide optional privacy-safe image crop guidance. Validate duplicate reference without accusing the member. **CTA:** “Submit for manual review”.

## Wireframe 5 — Pending tracking

Status heading “Details received, not yet verified”. Show order ID, product/price, entered reference, current review stage, actual staff review hours, a help link, and **“Do not pay again while this order is being checked.”** Access remains locked until approved; pending time does not reduce purchased duration. Allow a correction request on the same order.

## Wireframe 6 — Needs details / unmatched

Show a specific, neutral problem and the missing information; retain all other fields. Choices: “Update reference” / “Contact support”. Never auto-generate a replacement order for a paid-but-unmatched transaction. A wrong recipient is not “money received by XORA”. Staff investigate and provide permitted resolution.

## Wireframe 7 — Verified and activated

Display exact start and end dates/times **EAT**, receipt, plan, approved amount, order ID, provider reference and beneficiary account ID. **Connect** customers return to Discover and must intentionally send their new invitation; approval does not message someone on their behalf. **Promotions** enter a scheduled/active calendar with visible label.

## Wireframe 8 — Renewal/expiry/refund

- On early approval of the same access type, queue the next full period after the previous expiry. Preserve remaining paid time.
- For a different tier or overlap, disclose credits or schedule clearly **before** taking money; owner approval pending.
- At expiry, additional outgoing rights end; incoming invitations and accepted conversations remain free.
- Overpayment, duplicate, reversal, payment received for ineligible account and refund execution have their own finance case. Show **Refund under review** until actual funds have been sent back and reconciled.

## Staff payment queue and detail

**Queue columns:** order reference, member ID (masked), original product/amount, submitted channel/reference (masked), age, flags, reviewer, next action. Filter by new, oldest, needs details, unmatched, duplicate, refund, disputed, approved. **Detail panels:** immutable order, member claim, independently sourced receiving-account settlement, checklist, actions and audit. **Independent check must include:** recipient, settled receipt, amount, unique transaction, reversal and eligibility. All checked is a necessary condition, not automatic evidence itself; real reviewer confirms from separate authoritative records.

## Payment exception matrix

| Situation | Customer sees | Staff action | Never do |
|---|---|---|---|
| Claim entered, not yet matched | Under review | Search official account history | Grant pass from screenshot |
| Screenshot missing | Under review with reference | Verify without image if authoritative record sufficient | Require screenshot for its own sake |
| Reference duplicated | Need details / contact support | Compare source transaction and order links | Grant to both orders |
| Reference typo | Update this order | Reconcile corrected details | Create forced repeat purchase |
| Underpaid | On hold and a clear next step | Approved resolution/refund policy | Invent wallet credit |
| Overpaid | Refund/adjustment review | Finance dual review and actual refund | Hide excess money |
| Transfer received but activation failed | Verified, activation issue | Fix entitlement once with audit | Ask user to pay again |
| Wrong account | Unable to verify receipt by XORA | Provide factual help and escalation | Claim XORA owns those funds |
| Provider settlement outage | Review temporarily paused | Disable approvals; announce delay | Accept screenshots as substitute |
| Account restricted/ineligible | Access blocked; finance case | Hold benefit, resolve fair refund/pauses | Permit payment to override safety |
| Admin approves twice | Already approved | Lock order and show audit | Create second entitlement |
| Refund initiated | Refund under review | Execute independently and reconcile | Mark refunded before transfer |

## Operational trust commitments

- An honest staffed-hours promise, not instant approval.
- Member-accessible payment history and status even if entitlement ends.
- Idempotent backend approval, atomic entitlement, immutable financial audit and separate refunds.
- Elevated confirmation for changing official receiving account and for high-risk refunds.
- Privacy-safe proof access restricted to finance roles, retention schedule applied.
- Release blocked until actual business receiving account, processor policy and Ugandan legal review permit the intended activity.

## Demo caveat

`prototype/index.html` makes purchase/transfer/approval actions look and feel realistic to test comprehension, but the user enters **fictional data** and staff checklist confirmations are **local UI state**, not payment verification. This is the correct boundary for Phase 1.
