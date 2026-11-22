# XORA — Page Inventory, Routes & Wireframe Requirements

**Version:** Phase 1 / 22 November 2026  
**Purpose:** Give design and engineering an unambiguous inventory of public, member and staff experiences without pretending all pages are production-built.  
**Source:** `PRD.md` §23, `ARCHITECTURE.md` §7.  
**Legend:** **Interactive** = implemented as a demonstrable screen in the self-contained prototype; **Specified** = complete content/state/layout contract for later engineering, represented by a shared screen/pattern or design documentation; **Blocked** = requires live policy/operational input.

## A. Public information architecture

| Proposed web route | Screen | Status | Page anatomy / exit |
|---|---|---|---|
| `/` | Homepage | Interactive | Hero, Date/Casual split, trust, clear first-introduction rule, Join free |
| `/how-it-works` | How it works | Interactive | Six-step explanation, privacy, pricing, join |
| `/date` | Date explainer | Specified | Relationship mode, respectful expectations, suitability; Join free |
| `/casual` | Casual explainer | Specified | Casual consenting adults, boundaries, no paid arrangements; Join free |
| `/pricing` | Connect & VIP pricing | Interactive | Free promise, 3 Connect tiers, 3 optional promotions, limits and no auto-renewal |
| `/payment-help` | Payment support | Specified | Independent verification, order IDs, correction, review hours, refunds |
| `/safety` | Safety & privacy overview | Interactive | Adults-only, consent, blocking, reports, no private indexing |
| `/about` | About XORA | Specified / blocked | Real operator info after business registration/brand review |
| `/contact` | Contact | Specified / blocked | Approved support contacts and actual staffed hours |
| `/legal/terms` | Terms | Specified / blocked | Counsel-reviewed terms, account access, prohibited conduct |
| `/legal/privacy` | Privacy notice | Specified / blocked | Data categories, controller details, retention, access/deletion procedures |
| `/legal/community` | Community standards | Specified / blocked | No minors, impersonation, exploitation, solicitation, harassment |
| `/legal/refunds` | Refunds | Specified / blocked | Duplicate/mistaken payments, ineligible accounts, exception policies |
| `/faq` | FAQ | Specified | Account, free invite, plans, manual review, safety |
| `/auth/sign-in` | Sign in | Specified | Verified credentials, errors, recovery, no sensitive hints |
| `/auth/register` | Register | Interactive | Email, password+confirm, adulthood and essential consent, optional marketing |
| `/auth/recover` | Recovery | Specified | Safe non-enumerating confirmation, limited resends |

**Layout rule:** Public routes may be indexed, but they must contain no private member profiles or personal information.

## B. Members-only information architecture

| Proposed web route | Screen | Status | Primary action and must-have states |
|---|---|---|---|
| `/welcome` | Member welcome | Specified | Intro, continue setup; draft state |
| `/verify-email` | Email confirmation | Specified | Confirmation link, resend, expiry/error, help |
| `/setup` | Profile wizard | Interactive | 5 prototype steps covering all PRD R2 fields; save and preview |
| `/status` | Review state | Interactive | Pending, approved; correction/restriction variants specified |
| `/discover` | Discovery | Interactive | Date/Casual/Both selector; broad area filters; no-result recovery |
| `/members/:id` | Private profile detail | Interactive | Approx area, intention, bio, interests, Say Hello, Save, Report |
| `/saved` | Saved profiles | Specified | Save/remove, deleted/restricted profile state |
| `/likes` | Likes | Specified | Private interest, separate from invitation/acceptance |
| `/invitations` | Incoming/outgoing | Interactive | Accept, decline, withdraw, simulate free accepted invitation |
| `/connections` | Connections | Specified via Messages | Open accepted conversations; unmatched/unavailable cases |
| `/messages` | Conversations | Interactive | Mutual-chat creation, send local messages, end/report |
| `/membership` | Membership overview | Interactive | Free allowance, active pass, queued renewal, receipts |
| `/promotions` | Optional promotion plans | Interactive | 3 paid placement packages, no guarantee language |
| `/promotions/calendar` | Promotion calendar | Specified | Queued/active/paused/expired campaign with dates |
| `/orders/new` | Order review | Interactive | Plan, UGX, duration, no auto-billing, assent |
| `/orders/:id/instructions` | Recipient instructions | Interactive (safe demo) | Unique order, **no real payee in demo**, anti-fraud copy |
| `/orders/:id/submit` | Submit transfer details | Interactive | Channel, reference, payer hint, optional receipt, correction |
| `/orders/:id` | Payment status | Interactive | created, submitted, needs details, approved; timeline |
| `/orders` | History and receipts | Interactive via Membership | Order list, open own status, exact dates on approval |
| `/me` | Profile summary | Interactive | Public/private field separation, change intention |
| `/me/privacy` | Privacy controls | Interactive via My Profile | Pause discoverability, activity control, help |
| `/me/security` | Account security | Specified | Sessions, password reset, MFA option, device list |
| `/me/notifications` | Preferences | Specified | Granular channels and optional marketing |
| `/support` | Support inbox | Interactive | Submit fictional ticket, view open status |
| `/reports/new` | Safety report | Interactive via Support | Type, evidence guidance, case ticket, block link |
| `/appeal` | Appeal | Specified | Case number, reason, outcome, permitted next steps |
| `/me/delete` | Close account | Specified via Privacy help | Identity confirmation, retention exceptions, consequence |
| `/ux-states` | State gallery | Interactive | empty/loading/offline/validation/blocked/pending/correction/success |

**Privacy gate:** Every private route needs login and eligibility review in production. The Phase 1 demo intentionally has no real authentication or authorization; do not publish it as a service.

## C. Staff-only IA

| Proposed route | Screen | Status | Main controls and constraints |
|---|---|---|---|
| `/admin/login` | Staff sign in | Specified | Named account, MFA, lockout and secure recovery |
| `/admin` | Overview | Interactive | Critical safety, payments, profiles, support, campaigns |
| `/admin/members` | Member list/detail | Interactive (summary) | Masked account, free allowance, access, restrictions |
| `/admin/profiles` | Content review | Interactive | Approve/request changes; separate age review |
| `/admin/verification` | Identity evidence review | Specified / restricted | Reason-bound, controlled media, evidence audit |
| `/admin/discovery` | Discovery health | Specified | Eligibility filters, coverage and privacy-safe aggregates |
| `/admin/invitations` | Connection exceptions | Specified | Free credit disputes, abuse flags, audited restoration |
| `/admin/payments` | Payment queue | Interactive | Expected amount, method, masked reference, review state |
| `/admin/payments/:id` | Detailed review | Interactive | Independent matched-funds checklist, no duplicate approval |
| `/admin/unmatched` | Unmatched received funds | Specified | Official statement line, owner, aging, correction/refund |
| `/admin/refunds` | Refund cases | Specified | Separate authorization, execution proof, retention |
| `/admin/entitlements` | Connect passes | Specified | Activation, queue, expiry, correction audit |
| `/admin/promotions` | Placement calendar | Specified | Label, dates, eligibility, overlap rules, pause |
| `/admin/safety` | Critical reports | Interactive (summary) | Priority queue, risk level, immediate protective action |
| `/admin/support` | Tickets | Interactive via Safety | Assigned status, no unnecessary chat access |
| `/admin/appeals` | Appeals | Specified | Reason and reviewer separation, response SLA |
| `/admin/analytics` | Operational analytics | Specified | Settled revenue only, counts, no sensitive tracking |
| `/admin/content` | Public copy and policies | Specified | Approved changes, versioned records |
| `/admin/channels` | Authorized payment details | Specified / blocked | Dual-control payee changes, account authentication |
| `/admin/staff` | Roles and team | Specified / blocked | Named staff MFA, least privilege, offboarding |
| `/admin/audit` | Audit trail | Interactive (sample events) | Immutable actor, reason, timestamp, identifiers |
| `/admin/incidents` | Incident/handover | Specified | Outstanding exceptions, owner, due date, recovery |

## D. Core screen-level wireframe contracts

### Public home
1. Compact wordmark/header with Join Free prominent; small trust link.
2. Hero with promise, one primary CTA, optional secondary preview CTA.
3. Two intention explanations, not two separate accounts.
4. How XORA works and privacy differentiators.
5. Transparent first-accepted-introduction rule and no-auto-renewal pricing teaser.
6. Footer with policies, support, operator details once cleared.

### Discover
1. Top: page heading, current account status/notifications.
2. Date/Casual/Both is an explicit 3-state selector.
3. Broad-area and compatibility filters.
4. Profile cards with permitted media, display name, age band/allowed displayed age, area, intention and honest review meaning.
5. Empty state with clear filter reset.
6. Mobile bottom navigation; no exact GPS/maps of a member.

### Manual checkout
1. Immutable order summary before payee details.
2. Member confirms duration, price, delayed review and refund terms.
3. Unique XORA order reference; actual authorized recipient only after vetted configuration.
4. Method/reference form with optional evidence and privacy notice.
5. Status timeline; no misleading "payment successful" before settled-funds check.
6. Correction on the same order, support link, never "pay again" by default.
7. Approved receipt with exact start and end time in EAT.

### Admin finance review
1. Summary of original order and expected amount.
2. Masked member submission, not authoritative.
3. Separate independent settlement record/statement matching.
4. Explicit duplicate, reversal, recipient, amount and eligibility checks.
5. Only then enable "Confirm and activate once".
6. Corrective actions: needs details, hold/escalate, refund review.
7. Staff audit/history below the action; permissions are enforced server-side later.

### Safety/reporting
1. Report and block are available from profiles and conversations.
2. Member can block immediately even if a staff case is pending.
3. Serious report confirmation includes case number and privacy-preserving response.
4. Staff queue triages by severity, not revenue.
5. Appeals and retention follow documented policy.

## E. State coverage matrix

| Context | Loading | Empty | Offline | Validation | Under review | Success | Restricted | Error recovery |
|---|---|---|---|---|---|---|---|---|
| Signup/onboarding | ✓ | Resume draft | ✓ | ✓ | Pending review | Account draft | Underage/ineligible | Correct & resubmit |
| Discovery | Skeleton | Filter reset | Cached shell only | Filter error | Member blocked | Cards | Access denied | Retry |
| Invitations | Loading list | No requests | Retain drafts | Anti-spam | Waiting response | Accepted chat | Blocked member | Withdraw/help |
| Chat | Loading | No conversations | Retry send | Empty-message | Report processing | Sent | Ended/unmatched | Error + retry |
| Checkout | Loading order | No order | Preserve order | Bad reference | Submitted | Approved/receipt | Ineligible | Same-order correction |
| Admin finance | Loading queue | Cleared queue | Freeze approval | Missing checks | Submitted | Exactly one grant | Denied role | Reconcile/escalate |
| Safety/support | Loading tickets | No tickets | Draft retained | Missing report | Triage | Case issued | Staff-only evidence | Retry/contact |

The `prototype/#state-gallery` view displays text-and-layout examples for common global states. Production implementations must cover row-specific states and automated tests.

## F. Acceptance boundaries

This inventory is a complete route/screen **design specification**, not a claim that every page is implemented as production UI. Interactive examples validate layout and copy for the highest-risk journeys. Detailed staff procedures, actual consent verification, legal policy text and user study evidence remain future dependencies. See `PHASE1_ACCEPTANCE.md`.
