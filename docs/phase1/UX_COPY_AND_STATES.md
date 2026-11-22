# XORA — UX Microcopy, Edge Cases, Status & Recovery Library

**Status:** Proposed text, not final legal terms. Product/operations/legal team should approve wording before real users or payments.

## 1. Language principles

Use plain English (Ugandan English spelling is acceptable). Reference prices in **UGX**, durations in **calendar days**, activation/expiry in **EAT (Africa/Kampala)**, and order references exactly as generated. Never use “subscription” to imply auto-renewal: XORA sells **manually renewed timed passes**. Do not use “verified” for a payment screenshot or VIP profile. Avoid “instant approval,” “guaranteed replies,” “meet tonight,” or any suggestion of paid sexual services.

## 2. Core on-screen copy

| Trigger | Headline | Support copy | Primary action |
|---|---|---|---|
| Public home | Meet people. On your terms. | Date, Casual or Both—one account, private discovery. | Join free |
| Registration | Welcome to XORA | Join for free. Keep your information private. | Create account |
| 18+ confirmation | Adults only | You must be at least 18 to join. | Confirm eligibility |
| Email sent | Check your inbox | Use the confirmation link. It may take a little time. | Resend link |
| Draft saved | Profile saved | Resume whenever you're ready. | Continue setup |
| Profile submitted | Your profile is being reviewed | You cannot appear in discovery until required checks are complete. | View status |
| Profile correction | Update your profile | We need you to change: [specific field and reason]. | Edit and resubmit |
| Profile approved | Your profile is ready | Review privacy settings before meeting new people. | Discover |
| Date selected | Dating intentions | We'll prioritize members open to meaningful dating. | View profiles |
| Casual selected | Casual intentions | We'll prioritize people who also want respectful casual connections. | View profiles |
| Both selected | Open to both | You can focus on either intent in Discover. | View profiles |
| No results | No compatible profiles in this view | Expand your broad area or reset filters. | Reset filters |
| Free outgoing | Your first accepted introduction is free | This request counts only if the other adult accepts. | Say Hello |
| Free pending | Invitation sent | You can have only one active free request at a time. | View invitations |
| Free declined | They didn't accept this time | Your free introduction is still available. | Discover |
| Free accepted | A new conversation is ready | Your one free outgoing introduction has now been used. | Open messages |
| Incoming request | Someone wants to connect | You can accept, decline or report—for free. | View invitation |
| Chat open | Start with a respectful hello | Another person can end the conversation at any time. | Send message |
| Paywall | Unlock additional introductions | Choose a timed Connect Pass. No automatic renewal. | Compare passes |
| Plan review | Review your order | Exact package, price, duration and terms. | Create order |
| Order created | Order ready | Check the official business recipient before paying externally. | View instructions |
| Transfer submitted | Details received, not yet verified | A reviewer will check the transfer against the official receiving account. Don't pay again. | Track order |
| Need details | More information needed | We couldn't match the payment reference. Update this order; do not pay twice. | Correct details |
| Unverified | We couldn't confirm the transfer | Contact support with the order reference. | Get help |
| Approved | Your Connect Pass is active | Active from [EAT start] to [EAT end]. Your receipt is saved. | Discover |
| Renewal queued | Renewal scheduled | Your next pass starts after your active pass ends; no time is lost. | View dates |
| Expired | Your Connect Pass ended | Existing chats and incoming invitations remain available. | Renew manually |
| Promo active | Your profile is featured | Placement is labeled and does not guarantee messages. | View promotion |
| Paused | Profile hidden from discovery | You can restore visibility from Privacy. | Unpause |
| Support created | We've received your request | Keep case [case number] for follow-up. | View support |
| Safety report | Report received | You can block immediately. We prioritize serious safety issues. | Block member |
| Account restricted | Account status needs attention | Some actions are unavailable; review permitted next steps. | View status/appeal |

## 3. Manual payment status dictionary

| Internal status | External label | What it means | Never imply |
|---|---|---|---|
| `created` | Awaiting details | Order exists; no claimed payment details yet | Money received |
| `submitted` | Under manual verification | Claim received; not settled/confirmed | Access activated |
| `needs_details` | More details required | Reference/time doesn't match; update same order | Pay again |
| `on_hold` | Review on hold | Operations need provider/bank clarification | Fraud definitively proven |
| `matched` | Funds independently matched (internal only) | Official settlement verified with evidence | Already activated if not committed |
| `approved` | Approved and activated | One order yielded exactly one entitlement | Guaranteed match or response |
| `unable_to_verify` | Unable to verify | Receipt/ref is insufficient or mismatch unresolved | Automatic forfeiture |
| `refund_review` | Refund under review | Finance case opened | Funds already returned |
| `refunded` | Refund processed | Independently executed refund with reference | Automatic reversal of every entitlement scenario |

## 4. Form and network errors

| Error | Specific copy | Recovery |
|---|---|---|
| Weak password | Use at least 8 characters. | Keep entered email, show requirements |
| Mismatched passwords | Passwords don't match. | Correct confirmation field |
| Missing adult declaration | Please confirm you are 18 or older. | Stop signup until affirmative declaration |
| Underage information | XORA is available only to adults 18+. | Stop access; show safe support path |
| Email already registered | If this email has an account, we'll send recovery instructions. | Prevent account enumeration |
| File too large | This image exceeds the upload limit. | Explain limit and how to reduce size |
| File type not supported | Choose a supported image type. | Show supported formats |
| Unsupported media content | This photo cannot be published. | Explain applicable rule; upload permitted replacement |
| Empty message | Enter a message before sending. | Keep focus in compose field |
| Duplicate free request | You already have one active free outgoing request. | View or withdraw it |
| Member restricted | This member isn't available to connect right now. | Return to discovery |
| Duplicate transfer ref | This reference is linked to another order. | Support review, no second payment |
| Invalid transfer reference | Check the reference exactly as shown by your provider. | Edit same order |
| Request interrupted | We couldn't finish sending. Check order status before retrying. | Retry with same idempotency key |
| Offline | You appear to be offline. We kept this form where possible. | Retry when connection returns |
| Admin permission denied | You do not have access to this record. | Return to permitted queue, log attempt |
| Admin conflict | Another reviewer already updated this order. | Reload latest audited status |

## 5. Confirmations for risky actions

### Account deletion

**Title:** Request to close your XORA account  
**Copy:** “Your profile will no longer appear in discovery. Some records may be retained only where required for lawful safety, financial or dispute reasons. Confirm your identity to proceed.”  
**Actions:** Cancel / Continue with closure request.

### Block

**Title:** Block this member?  
**Copy:** “They won't be able to contact you through XORA. You can still submit a separate safety report.”  
**Actions:** Cancel / Block.

### Admin payment approval

**Title:** Confirm independently verified payment  
**Copy:** “You've checked official settled funds, amount, recipient, uniqueness, reversal and eligibility. Approval will grant exactly one paid period. This is auditable.”  
**Actions:** Back to checks / Confirm and activate.

### Payee change

**Title:** Change official recipient details?  
**Copy:** “This may cause real financial losses. Changes require an authorized second reviewer, documented evidence, staged effective time and member notice.”  
**Actions:** Cancel / Request controlled change.

## 6. Notification privacy

Email subject and browser notifications should avoid showing dating intention, partner names, chat content, member photos, or exact profiles. Example: **“You have a new XORA notification”**, not **“Casual member Amina wants to meet tonight.”** Critical account or payment notices can state order references and generic service categories without revealing another member's personal information.

## 7. Design-state checklist

- Loading: skeleton or explicit progress without layout shift.
- Empty: explain why and offer the next meaningful action; never fake inventory.
- Offline: prevent duplicate purchases/approvals, preserve the user's work where safe.
- Error: field-level explanation; no silent reset; no leaking account existence.
- Pending: status + reference + review hours/support + no access yet.
- Correction: edit existing request, show exactly what is needed.
- Approved: explicit start/end, receipt and next step.
- Expired: preserve free rights and chat history.
- Restricted: show safe appeal/help, no bypass via payment.
- Admin conflict: show current audited record, not stale approval button.
- Privacy request: show receipt, identity check and fair next steps.

## 8. Open copy inputs requiring approvals

The final site must fill in legal entity name, registered contact, authorized payment recipient, supported channels, precise refund procedure, review hours, privacy-controller details, retention schedule, age-assurance mechanism, appeal contact, invitation expiry and platform policies. Do **not** publish placeholder values as facts.
