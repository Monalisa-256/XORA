# XORA — Product Requirements Document (PRD)

**Product:** XORA (working brand, pending name/trademark clearance)  
**Format:** Mobile-first web application (website / web app; **not** a native mobile app)  
**Version:** 1.2 — Renewable membership passes, HEX-inspired profile promotion and manual payments  
**Date:** 22 November 2026  
**Launch market:** Uganda, starting with Kampala and nearby areas  
**Audience:** Founder, designer, business team, moderators, customer support, legal adviser and future development team  
**Document type:** Non-technical product requirements; it defines the experience and business rules, **not** code, database architecture or implementation instructions  
**Status:** Proposed plan; requires founder sign-off, legal review, market validation and operational readiness before public launch

> **What changed in v1.2:** XORA no longer sells lifetime access. It offers **7-day, 30-day and 90-day Connect Passes** for additional outgoing introductions, plus optional 7/30-day paid profile visibility inspired by HEX. All purchases remain manual, non-automatically-renewing and admin-verified. Incoming requests and established chats remain free after a pass expires. This is a non-technical business/product specification.

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Vision, mission and positioning](#2-vision-mission-and-positioning)
3. [Critical scope and legal boundaries](#3-critical-scope-and-legal-boundaries)
4. [Why XORA should exist](#4-why-xora-should-exist)
5. [Who XORA serves](#5-who-xora-serves)
6. [How the platform is organized](#6-how-the-platform-is-organized)
7. [Membership and pricing](#7-membership-and-pricing)
8. [All user and administrative roles](#8-all-user-and-administrative-roles)
9. [The complete visitor journey](#9-the-complete-visitor-journey)
10. [Registration and profile onboarding](#10-registration-and-profile-onboarding)
11. [Profile information and privacy rules](#11-profile-information-and-privacy-rules)
12. [Verification and account eligibility](#12-verification-and-account-eligibility)
13. [Date and Casual discovery](#13-date-and-casual-discovery)
14. [Connections, free access and renewable passes](#14-connections-free-access-and-renewable-passes)
15. [Private messaging and ongoing relationships](#15-private-messaging-and-ongoing-relationships)
16. [Paid profile promotion and VIP visibility](#16-paid-profile-promotion-and-vip-visibility)
17. [Manual payment workflow](#17-manual-payment-workflow)
18. [Customer account and self-service journeys](#18-customer-account-and-self-service-journeys)
19. [Safety, reports and moderation](#19-safety-reports-and-moderation)
20. [The complete admin dashboard](#20-the-complete-admin-dashboard)
21. [Detailed administrator workdays and journeys](#21-detailed-administrator-workdays-and-journeys)
22. [Notifications and communications](#22-notifications-and-communications)
23. [Website pages and navigation](#23-website-pages-and-navigation)
24. [Look, feel and brand experience](#24-look-feel-and-brand-experience)
25. [Mobile web usability and accessibility](#25-mobile-web-usability-and-accessibility)
26. [Privacy and responsible data handling](#26-privacy-and-responsible-data-handling)
27. [Operational policies and customer support](#27-operational-policies-and-customer-support)
28. [Unusual cases and exception handling](#28-unusual-cases-and-exception-handling)
29. [Metrics and business performance](#29-metrics-and-business-performance)
30. [Launch plan and priorities](#30-launch-plan-and-priorities)
31. [Minimum requirements before going live](#31-minimum-requirements-before-going-live)
32. [What is deliberately out of scope](#32-what-is-deliberately-out-of-scope)
33. [Open decisions for the founder](#33-open-decisions-for-the-founder)
34. [Glossary](#34-glossary)
35. [Research and reference links](#35-research-and-reference-links)

---

## 1. Executive summary

**XORA is a premium, privacy-first dating and casual-connection web app for consenting adults.** A member creates one account and may use it to look for **Date** (romance and longer-term relationships), **Casual** (casual dating and mutually desired hookups), or **Both**. These are discovery intentions within the same product, not separate companies, sites, accounts, or payment systems.

XORA is designed to be approachable on ordinary mobile phones using a web browser. It should feel like a well-designed modern dating product rather than a public escort directory. Members see relevant profiles, express mutual interest, communicate privately after a match, control their visibility, and can report bad conduct easily.

**Proposed membership model:** joining, creating a normal profile and browsing are free. Each member has **one free accepted outgoing introduction**; incoming invitations and replies remain free. To send additional new outgoing invitations, they buy a **7-day (UGX 10,000), 30-day (UGX 25,000) or 90-day (UGX 60,000) Connect Pass**, subject to safety limits. Passes expire, do not automatically renew and never lock existing chats.

XORA may also sell **optional** promoted-profile visibility inspired by the listing and VIP model found on HEX. The proposed **UGX 50,000** price becomes **Spotlight Month**, an optional 30-day visibility package—not a compulsory registration charge and not an advertising fee for sexual services. Further weekly and monthly visibility packages are optional. These prices are preliminary business proposals, not market-validated facts.

**Payments are manual at launch:** XORA shows the account holder’s approved merchant code or recipient number and registered business name, plus a unique order number. A member pays externally and submits the provider transaction reference and basic transfer details; a screenshot is optional where the payment can be independently matched. An authorized admin verifies that the funds truly arrived. Only then is the correct membership or promotion activated. There is **no in-app wallet, stored balance, automated checkout or payment gateway** in Version 1.

**Important operational condition:** XORA must be launched only for activities approved by applicable Ugandan law and by the institutions receiving payments. It must not provide escort booking, paid sexual services, prostitution advertising, sexual-service price lists, solicitation or matchmaking for payment-for-sex. Changing the label of a transaction does not make a prohibited activity permitted. Legal and payment-provider clearance are mandatory launch decisions, not optional paperwork.

### At a glance

| Area | XORA Version 1.2 decision |
|---|---|
| Product | Mobile-first web app for adults, accessible through browser |
| Brand | XORA, pending trademark/business-name/domain clearance |
| Geography | Uganda-first; Kampala-focused pilot |
| Minimum age | 18+, with stronger age checks where risk requires |
| User identity | One member account, one public dating profile |
| Discovery modes | Date, Casual, or Both |
| Customer charge | Optional Connect Week UGX 10k/7d; Connect Month UGX 25k/30d; Connect Quarter UGX 60k/90d, after one free accepted outgoing introduction |
| Featured-profile charge | Optional Spotlight Month UGX 50,000/30 days; ordinary registration remains free |
| Other featured plans | Optional weekly/monthly plans; see pricing section |
| Payments | Manual mobile-money transfer + transaction details (optional screenshot) + independent admin reconciliation |
| Messaging | Only after invitation acceptance |
| Trust | Account eligibility checks, reporting, blocks, moderation and appeals |
| Administration | One permission-controlled dashboard for the entire business |
| Public contact details | Never exposed by default |
| Paid sexual services | Not part of this PRD |

---

## 2. Vision, mission and positioning

### Vision

Become a respected Ugandan destination for adults who want clarity about one another's intentions, privacy, and genuine connection without a complicated or intimidating experience.

### Mission

Help adults discover compatible people, choose the kind of connection they want, meet by mutual agreement, and control their personal information—while funding the service through clearly explained memberships and optional profile promotion.

### Customer promise

> **XORA — One platform. Different intentions. Real connections.**

Alternative supporting line: *Date when you want something meaningful. Go Casual when you want something uncomplicated. Choose what feels right for you.*

### Brand personality

- **Premium, not explicit:** tasteful, adult, clean and polished.
- **Discreet, not deceptive:** private by design, but never promise absolute anonymity or guaranteed safety.
- **Welcoming, not pushy:** no manipulation, fake urgency or fabricated activity.
- **Clear, not judgmental:** users state their intentions and can change them.
- **Responsible, not unmoderated:** consent, age eligibility and safety are foundational.

### Product goals

1. Help an adult create a credible profile without confusion.
2. Make it easy to distinguish romantic dating from casual connections.
3. Reduce unwanted messages through mutual consent.
4. Make the first real connection free to demonstrate value.
5. Make paying for more connections clear, affordable and manually verifiable.
6. Give paid promoted profiles fair visibility without selling credibility.
7. Make administration possible with a small team and minimal manual mistakes.
8. Establish privacy and safety expectations before growth.

### Non-goals

XORA does **not** guarantee dates, sex, relationships, replies, meeting outcomes, physical safety or the authenticity of every claim a member makes. It is not an escort-booking agency, hotel-booking tool, transport provider or payment intermediary between members. It does not process payments between users, organize meetings for remuneration or set prices for personal encounters.

---

## 3. Critical scope and legal boundaries

### 3.1 Product boundary

**Allowed product behavior intended for legal review:** consenting adults create social/dating profiles, indicate Date or Casual interest, match mutually, chat, and choose independently whether to meet. XORA sells access to platform features and optional profile promotion only, not access to a particular human being or any guaranteed sexual activity.

**Excluded behavior:** public offers of paid sexual services, explicit price lists for companionship or sex, “incall/outcall” booking systems, location-based dispatch of escorts, commissions from encounters, payments made on behalf of members, any form of sexual exploitation, trafficking, coercion, underage accounts, or posting another person's intimate material without consent.

A member may not use XORA to solicit payment for sexual activity. The reporting and moderation workflows should be able to handle attempted solicitation and exploitation without teaching members how to conceal it.

### 3.2 Why this matters

Uganda's Penal Code and anti-trafficking framework require qualified local advice when designing a product adjacent to escort advertising, paid encounters and sexual exploitation. Dating and casual intimacy may also raise legal and personal-safety risks depending on the activities involved; XORA should receive legal advice appropriate to the planned user base, marketing, content, and features before launch. Do not treat this PRD as a legal opinion.

Payment processing or receiving funds directly into a mobile-money account may also be subject to provider terms and account underwriting. Some Ugandan payment service providers expressly restrict adult-oriented services including dating. **Manual receipts are an operational method, not a way to bypass payment rules.** The operator must confirm its intended business activity is permitted by its selected receiving-account provider and comply with any required permissions.

The business name **XORA** is not cleared. Existing uses and trademark records in other jurisdictions mean a Uganda Registration Services Bureau search, legal review and domain check are required before investing heavily in branding.

### 3.3 Pre-launch decision gates

The founder must obtain, document and retain:

1. Advice from a qualified Ugandan lawyer on the final scope, marketing, terms, content policies and applicable laws.
2. Confirmation that the receiving mobile-money account or business account permits the actual business activities and transactions.
3. Required business registration, trademark/name checks, privacy registration and relevant compliance obligations.
4. A workable adult verification and child-safety procedure.
5. A written moderation, refund, complaint and privacy process, with people assigned to operate them.

If the legal review disallows a contemplated feature, remove it before launch rather than masking it with a different label.

---

## 4. Why XORA should exist

### The user problems

- People using social or dating directories may be unclear about whether someone is looking for commitment or something casual.
- Profiles can be incomplete, fabricated, abandoned or copied from elsewhere.
- Exposed phone numbers invite unwanted contact and circumvention of platform consent controls.
- Users worry about sharing intimate preferences, personal identity and location.
- Services that charge before providing any genuine connection risk low trust.
- Small operators need straightforward member billing and administration, even without a payment gateway.

### The opportunity

A Uganda-focused web app can differentiate through **clarity of intentions**, **meaningful free trial**, **better profile quality**, **privacy defaults**, **simple human-reviewed payments** and **active moderation**. Uganda's broad use of mobile internet and mobile money supports testing a browser-first proposition, but does not establish demand or conversion rates for XORA; these must be validated with actual pilot users.

### What XORA borrows—and changes—from HEX

| Familiar directory idea | XORA adaptation |
|---|---|
| Geographic browsing | Private, intent-aware city/area discovery |
| Paid profile visibility | Optional disclosed Spotlight / VIP placement |
| Standout featured cards | Premium editorial design, never fake popularity |
| Profile galleries | Moderated photos and consent-based privacy |
| Contact links | Mutual-match in-site messaging instead of public phone disclosure |
| Listing renewal | Self-service promotional-plan renewals with manual approval |
| Admin publication | Separate verification, moderation and payment decisions |

XORA should not copy a competitor's logo, photos, code, text or proprietary design. References are for understanding marketplace patterns, not duplication.

---

## 5. Who XORA serves

### Primary audience: people interested in dating

Adults who want romance, companionship and potentially a committed relationship. They care about profile detail, compatible intentions, communication and basic trust.

### Primary audience: people interested in casual connections

Adults who prefer casual dating or no-strings-attached relationships with clear mutual intent. They need discretion, boundaries, respectful communication and control over who can see or approach them.

### Mixed-intention audience

People who are open to both. They should not have to create another account; they select **Both** and can switch the discovery lens at any time.

### Members who buy timed Connect Passes

Members who choose time-limited Connect access for additional outgoing introductions. They buy a clearly dated period, **not a guarantee that another member will reply or meet**. After expiry, they may renew voluntarily without losing established chats.

### Members who buy visibility

Ordinary eligible adult members who voluntarily pay to increase how frequently their approved profile is shown. They do not receive a special legal category, a guaranteed match or permission to advertise paid sexual services.

### Admin and support staff

People who maintain trust, verify submitted payments, review profiles, resolve complaints, manage listings and keep daily operations accountable.

### Launch geography and language

The initial marketing focus should be Kampala and nearby areas such as Kira, Ntinda, Naalya, Muyenga, Makindye and Entebbe, subject to genuine demand. Members should still be able to choose other available Ugandan towns. Start with clear English; support for Luganda or other languages may be added later if properly translated and moderated. Exact GPS coordinates must not be necessary to participate.

---

## 6. How the platform is organized

### 6.1 One identity, three intentions

There is **one XORA account**, one profile and one set of memberships. A user may choose:

- **Date:** prioritize relationship-oriented matches.
- **Casual:** prioritize casual dating or hookups between consenting adults.
- **Both:** appear to eligible people in both categories, with a way to focus search on one intention at a time.

Changing a mode must be simple and must not erase account history, cancel a membership or consume another free outgoing introduction. A clear indication of a member's current intention appears on their profile, subject to the user's privacy selections.

### 6.2 Key product sections

**Discover** is where profiles appear. **Invitations** holds incoming and outgoing requests and accepted introductions; Saved is a separate member page. **Messages** contains conversations. **Membership** shows the free outgoing-introduction status, Connect Pass status, expiry and optional visibility purchases. **My Profile** holds photos, intentions, privacy and safety settings. **Help & Safety** is reachable from every relevant page.

### 6.3 Member privacy by default

Non-members should not browse a searchable directory of sensitive profiles or see members' identities in public search results. Public marketing pages may show only synthetic/example profile designs or approved promotional materials. Member profiles are visible only within the authenticated service to appropriately eligible members; exact contact details and exact location remain private.

### 6.4 No separate dating and casual websites

Date and Casual are filters/modes within XORA. They share onboarding, member records, safety policies, membership, notifications, support, payment records and administration. A user must never be surprised that switching modes changes the price or exposes them to a broader audience without notice.

---

## 7. Membership, renewable access passes and fair value

**Founder proposal, not established market demand:** XORA sells **short, explicitly dated access passes**, not lifetime membership or automatically recurring subscriptions. The familiar HEX idea is to renew 7/30-day visibility; XORA adapts renewal to permitted dating-feature access and optional *clearly labeled* profile promotion. Members must never pay for an actual meeting, sex or another person's consent. All products need verified legal/payment-provider approval before live sale.

### 7.1 Standard member plans: no lifetime membership

| Member plan | Proposed price | Duration | What it unlocks |
|---|---:|---:|---|
| **Free XORA** | **UGX 0** | Ongoing | Eligible profile, Date/Casual/Both discovery, one first accepted outgoing introduction, incoming invitations, replies and established chats |
| **Connect Week** | **UGX 10,000** | **7 consecutive days** | Additional permitted outgoing introductions, subject to disclosed anti-spam rules |
| **Connect Month** | **UGX 25,000** | **30 consecutive days** | Same Connect access for a longer period at a lower effective daily rate |
| **Connect Quarter** | **UGX 60,000** | **90 consecutive days** | Same Connect access for frequent members, with the clearest long-term value |

**Recommended language:** “Join for free. Your first accepted introduction is free. When you want to initiate more introductions, choose a 7-, 30- or 90-day Connect Pass. No automatic renewal. Receiving invitations and continuing conversations always remain free, subject to safety rules.”

**Key pricing logic:** The one free introduction is a **one-time account benefit**, not one per plan, week, device, calendar month or mode. A paid pass grants additional *outgoing* invitations during its valid dates. People may always receive/accept legitimate incoming invitations and continue existing conversations when a pass ends. A pass never guarantees a match, reply, date or intimate encounter.

### 7.2 Optional promoted-profile plans: HEX-inspired, but not escort advertising

Ordinary dating profiles **register and appear in normal discovery for free**. Promotion purchases are optional; no member is called a “provider” solely because they promote a dating profile.

| Visibility plan | Proposed price | Length | Placement |
|---|---:|---:|---|
| **VIP Week** | **UGX 20,000** | 7 consecutive days | Labeled priority rotation among eligible matching profiles |
| **Spotlight Month** | **UGX 50,000** | 30 consecutive days | Featured profile placement for the entire month |
| **VIP Month** | **UGX 80,000** | 30 consecutive days | Enhanced, clearly identified placement and analytics, subject to fair rotation |

These names, prices and exact advantages are test proposals, not copies of HEX contracts. VIP buys visibility—not verified identity, access to another person's private data, guaranteed responses or priority over safety restrictions. XORA will not advertise or facilitate paid sexual services.

### 7.3 Rules for every timed plan

1. **No lifetime purchase** and **no auto-debit**. A member explicitly orders and manually pays for each new period.
2. **Membership clock starts on admin-confirmed activation**, not when the member uploads proof or makes the transfer. Show the exact activation and expiry timestamps in **East Africa Time (EAT)**.
3. **Renewing early does not waste remaining days.** An identical pass approved before expiry is queued to start immediately after the active pass ends. If changing tier, show a documented fair effective-date/credit choice before paying.
4. **Renewal is optional.** Provide member-facing reminders (suggested 3 days and 1 day before expiry, then at expiry) only through appropriately consented channels. No surprise renewal charges.
5. **On expiry**, new outgoing invitations beyond the one-time free allowance are paused; previously accepted chats and incoming invitations continue. Past messages, paid receipts and a profile are not deleted just because a pass ends.
6. **No retroactive expiry.** Time lost while an order waits for admin review does not count against paid duration. Admins must correct clock errors with an audit trail.
7. **A payment order is separate from active access.** A transaction screenshot alone never starts a pass.
8. **One approved order activates exactly one purchased period.** Duplicate approvals or extra transfers cannot silently multiply/shorten access.
9. **No XORA wallet**, gift balance, tokens, user-to-user transfer, meeting deposit, sexual-service commission or escrow.
10. **No pay-to-bypass moderation.** Restriction, verification and consent rules apply to all plans; fair refunds/pauses are handled under published policy.

### 7.4 Manual payment, refunds and display requirements

Only display an authorized business recipient and the transaction amount after the member chooses a plan. Each order has a unique XORA reference; the member pays externally and submits the payment-provider reference, transaction timing and other minimal details. A cropped screenshot is optional supporting evidence. A finance reviewer checks funds against the official receiving-account history before approval.

Display the following clearly before purchase: price, duration, included features, remaining free allowance, exact start-time policy, what expires, what remains free, refund terms, staffed review hours and recipient verification guidance. An approval receipt shows **start, end, product, amount, payment reference and transaction/order IDs**.

Refund procedures must address overpayment, mistaken transfer, duplicate payment, suspended/ineligible accounts, inability to activate or deliver features, plan changes, and reversals. Never claim that a screenshot is money, and never assume that manual MoMo payments are outside provider terms.

### 7.5 Business reasoning and testing

Timed passes can produce repeat purchases, unlike a one-time lifetime sale. The trade-off is friction: members may resent paying again if there are too few genuine profiles or responses. In the Kampala pilot, test **paid-week conversion, month-vs-week mix, repeat renewal rate, time to first accepted introduction, safety reports and complaints about value** before increasing prices. Avoid encouraging spam merely to make members consume subscriptions.

---

## 8. All user and administrative roles

| Role | What the person can do | What they cannot do |
|---|---|---|
| Visitor | Read public marketing pages, pricing, FAQs and policies | Browse private member profiles or message people |
| Free Member | Build profile, discover, send a first outgoing invitation free, accept incoming invitations, report/block | Send a second outgoing invitation after the first is accepted without Connect Pass access |
| Connect Pass Member | Continue connecting, converse with matches, manage profile | Bypass consent, moderation or anti-spam rules |
| Promoted Member | Ordinary member abilities plus approved paid placement | Buy a verification badge or force connections |
| Support Agent | Respond to tickets and see only necessary support details | Approve their own refunds or freely browse private conversations |
| Profile Moderator | Review profiles, reports and safety actions | Approve financial transactions unless separately authorized |
| Payment Reviewer | Reconcile payment evidence and request approval | Read sensitive private messages or change platform policies |
| Finance Lead | Confirm exceptions, refunds, reporting and reconciliations | Ignore dual-approval safeguards for high-value corrections |
| Super Admin / Owner | Configure plans, delegate roles, inspect audits and oversee risk | Delete accountability records or bypass legal obligations |

One staff person may hold multiple roles early on, but every sensitive action must still be recorded. For risky refunds, major account sanctions, or changes to payment details, an independent second review is strongly preferable when practical.

---

## 9. The complete visitor journey

**Journey V1 — Landing on XORA for the first time**

1. A visitor arrives through a direct link, referral or search result.
2. They see a tasteful brand page: XORA name, “Date or Casual” explanation, adult-only notice, trust features and obvious calls to **Join XORA** or **How it works**.
3. They can read membership prices, privacy policy, safety tips and support information **without registering**.
4. They are not shown identifiable member listings or sexual imagery. Do not use stock images pretending to be real XORA members.
5. If the visitor chooses to join, they reach the age-eligibility and signup steps.
6. If they are not old enough or cannot comply with terms, they cannot proceed.

**Journey V2 — Visitor wants to know the cost**

They open Pricing and see that registration and the first accepted outgoing introduction are free; receiving invitations and replying are free too. A timed Connect Pass is clearly described as payable **before sending an additional new outgoing invitation**, not merely for viewing profiles. Optional promoted-profile pricing appears separately. The manual-payment review delay is clearly disclosed; approval is not instant.

**Journey V3 — Visitor is uncomfortable with the privacy implications**

They visit Safety & Privacy, see who can view profiles, the limits of verification, whether profiles appear in search engines (they should not), how to hide a profile, and how to delete an account. The public site provides a real support contact channel.

---

## 10. Registration, account creation and a respectful onboarding experience

### 10.1 Principles: collect enough to connect, not everything you can

XORA must feel adult, private and safe, not intrusive. **Registration is free for everyone.** Build an account first, then a profile; ask sensitive preference questions only after explaining why. Mark each field as **Required**, **Optional**, or **Only if verification needs it**. Do not collect national ID images from every visitor as the first thing they see. Never ask for exact home address, mobile-money PIN, contact lists or private social-media passwords. Adults may use a screen name publicly while XORA separately verifies age and account eligibility.

### 10.2 First-time signup: exact journey (R1)

1. Visitor clicks **Join XORA** and sees a simple 18+ eligibility notice explaining Date, Casual and Both.
2. They choose **Continue with email** for the initial MVP. Phone sign-in is offered only if a properly funded and reliable verification process is available. Do not pretend SMS verification exists if it does not.
3. They enter email address, set a strong password and confirm the password. Avoid unnecessary username requirements at this stage.
4. They confirm the legal age requirement and explicitly accept Terms and the Privacy Notice; optional marketing consent is a separate unchecked choice.
5. XORA sends a confirmation link to prove control of the email. If it is delayed, show resend and troubleshooting options, with rate limits.
6. Once confirmed, the account is marked **Account created — profile incomplete**, and XORA starts a guided profile wizard.
7. A returning signup can resume an unfinished profile rather than register again.
8. Until account eligibility and profile checks are completed, the member cannot appear in discovery or send invitations.

### 10.3 Member profile wizard: progressive steps (R2)

| Step | Details collected | Required? | Audience and reason |
|---|---|---|---|
| 1. Profile identity | Public display name; birth date or legally approved age-evidence alternative; city/approximate area | Display name, adult eligibility, broad region required | Display name and approximate area to eligible members; exact DOB remains private |
| 2. Discovery identity | Self-described gender and adults they wish to discover, only where appropriate and lawful | Only minimum preferences necessary for matching; sensitive options treated carefully | Private matching preference unless user explicitly enables display |
| 3. Intent | **Date, Casual or Both**; optional relationship goals | Intention required | Clear signal to compatible members, with privacy controls |
| 4. Bio and interests | Short introduction; three to five interests; optional non-explicit prompts | Brief biography required | Makes profile believable; no direct public contact details |
| 5. Photos | At least one appropriately clear image, additional photos optional, only photos they own/have rights to upload | One acceptable profile photo to publish, unless founder approves a text-only accessibility exception | Approved members see profile; no public indexing |
| 6. Privacy | Visibility preference, approximate-area display, activity indicator option, notification preferences | Explain all, give protective defaults | Keeps members in control |
| 7. Preview | Precisely what other eligible adults will see | Confirm preview | Avoid surprises |
| 8. Submit | Finish and submit for eligibility/profile review | Required to publish | Shows clear review status |

**Optional later:** occupation category, languages, education if relevant, hobbies, lifestyle prompts, relationship preferences. Never require income, national ID number, exact workplace, sexual history, health status, or other particularly sensitive details for ordinary browsing. No mandatory phone number if email is sufficient for a functioning account and support process.

### 10.4 Profile completion states and messages (R3)

- **Draft:** "Finish your profile when you're ready"; save progress, no discoverability.
- **Submitted:** "Your profile is being checked"; explain what is and isn't available.
- **Needs changes:** name the specific photo/bio issue and offer re-submit, not a generic rejection.
- **Age/identity review required:** direct member to an approved private process; do not reveal verification evidence publicly.
- **Approved but paused:** member controls whether others can see them.
- **Active:** eligible for discovery and invitations.
- **Restricted/suspended:** explain limits as appropriate, support and appeal, never allow payment to override.

### 10.5 First-login guidance after approval (R4)

The member sees a friendly, brief checklist: **Choose your mode → View compatible profiles → Send your free introduction → Start a conversation if accepted**. Their profile preview and privacy controls remain one tap away. Do not show an aggressive premium-payment modal before a new person has experienced the product.

### 10.6 If registration goes wrong (R5)

Offer self-service routes for expired links, mistyped email, lost password, abandoned setup, duplicate account, unsupported browser, missing photo permission, low-data upload failure, and accidentally chosen Date/Casual setting. Preserve drafts without letting an unverified account contact other members. For an underage or doubtful-age case, stop access and use a respectful protective review; never ask a child to prove adulthood by uploading material into a public chat.

### 10.7 Honest onboarding microcopy

- "Your dating intentions can change any time. You can choose Date, Casual or Both."
- "We show your approximate area, not your exact location."
- "Your phone number and date of birth are not displayed on your profile."
- "We review profiles to help prevent abuse. Approval is not a guarantee someone is safe."
- "Your first *accepted outgoing invitation* is free. Accepting an invitation is always free."

---

## 11. Profile information and privacy rules

### 11.1 Public-facing within XORA

A standard member profile may show display name, age, broad city/area, selected intentions, introductory bio, interests, approved photos and selected visible activity/verification indicators.

### 11.2 Hidden account information

Full date of birth, login contact details, verification documents, private identity information, transaction history, receipts, internal moderation notes, exact location (if ever collected) and account security details are never shown to other members.

### 11.3 Profile controls

Members can edit their bio, interests, photos and matching preferences; change Date/Casual/Both; make their account invisible to discovery; hide last-active information; block specific people; adjust who can see optional images; and delete their account.

**Pause profile** must immediately remove the member from new discovery, while allowing them to access existing conversations and account settings where appropriate. Pausing does not cancel an existing paid promotion; the site must warn of any promotional time that will continue to expire while paused.

### 11.4 Photo rules

One face-representative primary photo is preferred, subject to legitimate privacy needs and risk controls. No stolen photos, children in dating profile imagery, explicit sexual content, unwanted third parties, identifying documents or phone numbers placed into images. The image review process should be proportionate and should never imply a person is safe just because their photo passed a check.

### 11.5 Profile activity indicators

Use accurate terms: **Active recently** based on recent actual platform activity and **Verified** only when a specific completed check supports it. Do not display fabricated “online now,” “available tonight,” “responds instantly” or invented popularity metrics. Activity display may be hidden by the member.

---

## 12. Verification, eligibility and trust

### 12.1 Four separate checks, never one misleading badge

1. **Contact verified:** person controls the email or phone they registered with.
2. **Adult eligibility checked:** the business has used an appropriate, proportionate age-assurance process; self-ticking a checkbox alone is not adequate assurance for higher-risk activities.
3. **Profile reviewed:** a moderator has checked that text and imagery meet community standards.
4. **Identity checked, if offered:** an appropriate process was completed, with disclosure of precisely what it means and when it was done.

A paid **Spotlight/VIP** label is not evidence of any of these. Do not say "100% safe", "verified genuine romantic partner" or "guaranteed to be over 18" unless truly demonstrable; even verification cannot eliminate impersonation or real-world risk.

### 12.2 Initial eligibility journey (VFY1)

- Member confirms adulthood and provides the limited age information necessary.
- XORA screens for obvious duplicates, stolen imagery and content violating its published rules as resources permit.
- A trusted review process decides whether additional age/identity evidence is needed; use privacy-preserving checks wherever feasible.
- If an ID document is necessary, restrict access to specifically trained staff or a compliant verification provider; avoid long-term storage of full images without an explicit lawful justification.
- Moderator accepts, requests correction, restricts or rejects the profile with an auditable reason; payment cannot accelerate or bypass a safety block.
- Member can seek review of a mistaken decision through an accessible appeal.

### 12.3 Privacy and safety of verification data

Verification documents and rejected-photo evidence are **not** ordinary media-gallery content. Keep them separate with very limited staff access and strict retention procedures reviewed for Ugandan requirements. Do not let support staff download sensitive files to personal devices or send them across informal messaging groups. No public display of legal name, national ID number, exact birth date or verification document.

### 12.4 Young-looking or possibly underage user

If a report or evidence raises a credible age concern, immediately restrict discovery and new connections while responsible staff review. Follow lawful child-safety and incident escalation procedures. When a member is not eligible, do not return them to discovery even if they paid. Resolve any actual received money fairly under law/policy.

### 12.5 Member trust signals

Show **Profile reviewed**, **Recently active** only if accurately measured and user-permitted, and **Promoted** only for an active campaign. Display a tooltip explaining each label. Never use payment amount to rank trust or give paying members moderation immunity.

---

## 13. Date/Casual discovery, compatibility and search

### 13.1 The first discovery visit (D1)

After profile approval, the member enters a welcoming Discover page with **Date | Casual | Both** controls and a short reminder of their current intention. These are **filters and matching preferences inside the same account**. When someone switches modes, XORA remembers their choice, explains potential audience changes and never resets membership or free invitations.

### 13.2 Compatibility before popularity

Only show people who meet the platform's age, consent, visibility and compatibility eligibility rules. Both parties' stated preferences must be respected; a person who chooses Date-only must not be presented to someone seeking Casual-only purely because a promotional slot was purchased. Never imply XORA has established real-world availability, willingness to meet, exclusivity or willingness to engage in sexual activity.

### 13.3 MVP discovery filters

City/approximate area, Date/Casual/Both intention, preferred adult age range, compatible member preferences, recently active where accurately disclosed, and profile completeness. More filters such as interests can follow after a sufficient local member base exists. Do not use exact GPS coordinates, live map pins or home addresses. Let users broaden radius if results are thin.

### 13.4 Profile card and detail (D2)

Each card shows a tasteful approved photo, display name, age, broad city/area, intention (where permitted), a one-line bio or interests, and clear **View**, **Like** and **Say Hello** actions. The expanded profile includes more approved photos and prompts, privacy-respecting activity indicators, block/report controls and a reminder that messages require accepted invitations. It must be possible to leave a profile without being tracked publicly by other members.

### 13.5 No matching people found (D3)

Do not generate fake profiles. Explain that no compatible profiles are currently available in the chosen area; offer **broaden area**, **change filters**, **save search**, or **come back later**. Allow a member to pause an unavailable search reminder. Never charge for an empty result set.

### 13.6 Switching modes and privacy (D4)

A mode change updates future discovery eligibility, not the past: existing chats remain accessible unless a member blocks/unmatches. A member must never be exposed in Casual mode solely because someone else selected Casual. A user may choose to temporarily disappear from discovery while keeping their account and paid Connect Pass status.

### 13.7 Sponsored placement fairness

Promoted profiles can appear in a few clearly labeled slots **after** compatibility and safety filters. They are subject to rotation and frequency limits. Paying can influence where a consenting, eligible profile appears—not who is eligible, who is messaged or whether someone must respond. Never promise number-one placement or "available now" unless accurately supported.

---

## 14. Invitations, consent, free access and renewable Connect Passes

XORA offers **one first accepted outgoing introduction free**, and optional **Connect Week, Connect Month, or Connect Quarter** to initiate additional introductions. Receiving invitations and replying to an existing matched conversation are free even after a pass expires. The aim is fair access—not payment for access to any specific person.

### 14.1 The four distinct actions

- **Like:** a private expression of interest, not an invitation and not a chat.
- **Invitation:** a request to speak that another eligible adult may accept or ignore.
- **Accepted introduction:** consent to open private messaging; this consumes the sender's one-time free introduction if they have not previously used it.
- **Active Connect Pass:** a prepaid, dated entitlement for further outgoing invitations within fair-use limits. It is not a guarantee of responses.

### 14.2 First free outgoing invitation (C1)

1. An eligible member sees a compatible profile and selects **Say Hello**.
2. The web app shows “Your first accepted introduction is free; it counts only if this person accepts.”
3. The request goes to the recipient without disclosing phone number, payment status or exact location. To prevent free-invitation spam, a free member can have **only one active outgoing free request at a time**; they may withdraw, and an ignored request expires after a disclosed period (proposed 7 days).
4. A declined, withdrawn-before-acceptance or expired request does **not** consume the one-time free introduction.
5. If accepted, a chat opens and **the sender's one free introduction is consumed exactly once**. The recipient's allowance is not affected.
6. Verified fraud/platform errors may be reviewed for a narrowly authorized restoration; ordinary disappointment does not create replacement credits.

### 14.3 Buying a timed pass when requesting a new connection (C2)

1. A member who used the free introduction chooses **Say Hello** on a different eligible profile.
2. If no Connect Pass is active, the screen offers **Connect Week UGX 10,000 / 7 days**, **Connect Month UGX 25,000 / 30 days**, or **Connect Quarter UGX 60,000 / 90 days**, with exact inclusions and no automatic billing.
3. Selecting a pass creates a manual-payment order. No further outgoing invitation is sent while approval is pending.
4. The member pays the official business recipient, enters transaction reference, and monitors status from the website; a screenshot is optional.
5. Admin independently verifies the received funds and confirms the order. The pass starts **at the recorded approval/activation time**, and its exact expiry is immediately shown in EAT.
6. The member returns to Discover and deliberately sends the new invitation. Approval never sends a message on their behalf.

### 14.4 While the pass is active (C3)

- Eligible new outgoing requests may be sent within published limits; safety and recipient preferences always apply.
- The membership page shows plan, activation time, expiry date and renewal options, with **no misleading countdown or false urgency**.
- Changing Date/Casual/Both, browser or device does not reset/restart paid time.
- The member can buy another period early; it is scheduled after the existing Connect period, so no overlapping days disappear.

### 14.5 Expiration and renewal (C4)

1. A reminder is offered before expiry through consented channels, without exposing sensitive dating details in notification previews.
2. On expiry, the member becomes a **Free Member** for *new outgoing invitation rights*. Their approved profile, existing chats and ability to receive/accept incoming invitations remain available.
3. Attempting an additional outgoing invitation opens a calm **Renew Connect** screen; it does not erase drafted messages or create a new transfer automatically.
4. A manually approved renewal activates for its full purchased duration; a queued early renewal begins when the current period ends.
5. If a payment was received but not yet approved, show **Awaiting review** rather than “Active” or “Payment failed.”

### 14.6 Scenarios and safety boundaries

| Scenario | Required response |
|---|---|
| Free first request accepted | Open chat; consume one free allowance once |
| Free request rejected/expired | Preserve free allowance and permit a new request within limits |
| Member already used free allowance; no pass | Show Connect Week/Month/Quarter, do not send new outgoing request |
| Active pass member sends invitation | Permit eligible request within anti-spam limits |
| Pass expires while invitation awaits recipient response | Previously sent eligible request remains valid until its normal expiry; recipient may accept and chat |
| Pass expires during an active conversation | Conversation remains usable; don't demand renewal to reply |
| Member receives invitation while unpaid | May accept/decline and reply free |
| Member renews early | Add purchased time after current plan; no lost days |
| Payment pending across expiry | Existing chats continue; new outgoing starts only after approval |
| Block, report, suspension or underage concern | Safety action takes priority over all paid privileges |
| Member switches Date/Casual/Both | Existing relationships and expiry timestamps stay unchanged |

### 14.7 Ongoing consent and restraint

A connection is consent to converse under platform rules, never consent to meet, share contact details, send sexual material or have sex. Members can unmatch, block or report at any time; VIP and Connect cannot override these rights. Limit the number of simultaneous/persistent invitations and repeated approaches to the same person. Avoid designing the renewal funnel to reward harassment, fake demand or coercive behavior.

---

## 15. Private messaging, boundaries and meeting safely

### 15.1 Conversation opening (M1)

A conversation opens **only after an eligible invitation is accepted**. The recipient may decline silently. The first accepted invitation sent by a Free member consumes that member's one free outgoing introduction; the recipient's allowance is unchanged. Neither person's private email or mobile number is shared through the match process.

### 15.2 MVP messaging

Support reliable text, delivery/sent status where truthful, limited approved photo sharing only if safety capacity exists, conversation mute, report, block, unmatch and easy deletion from a member's view. Do not launch disappearing evidence or video features before the team can deal with harassment and abuse. No unsolicited sexual imagery. Do not show messages in public search engines or notification previews.

### 15.3 Consent and expectations (M2)

Matching and message acceptance do not imply a commitment to meet or share further contact information. Members can change their minds. XORA prohibits harassment, threats, pressure, financial scams, solicitation of paid sexual services, blackmail, coercion and nonconsensual intimate content. Explain all of this at signup and when someone reports a conversation.

### 15.4 Phone numbers, moving to other platforms and scams

Direct contact details are hidden by default. Adults may independently decide to exchange contact information inside an accepted conversation where legally permitted, but XORA should show a safety reminder before the first exchange. Never ask people to move to another app to pay XORA; the only valid membership instructions appear in XORA's payment pages. Staff must never ask for a user's PIN, password or OTP.

### 15.5 Message controls, evidence and privacy

Members can mute notifications, leave a conversation, block someone, report individual messages, and view their own chat history subject to retention policy. Restrict staff access to conversations to legitimate safety cases with logging and necessity controls. When a report arises, preserve only necessary permitted evidence under policy. Do not claim absolute secrecy if safety reports or lawful requests may require limited review.

### 15.6 A silent match or an unmatch (M3)

No reply is not a payment failure and not grounds for a guaranteed free-introduction refund. Users can unmatch without explanation. A documented exception may apply where a promptly proven fake or fraudulent account made a free introduction unusable. If a member is suspended, block new messaging according to safety policy and clearly explain permissible account access.

### 15.7 Offline meeting safety

Provide non-alarmist guidance: meet in public first, arrange independent transport, share plans with a trusted friend, never feel obliged to continue, and report harassment or demands for money. XORA does **not** arrange meetings, verify third-party venues, book sexual services, hold deposits or promise in-person safety.

---

## 16. Optional Spotlight and VIP visibility

### 16.1 What members are buying

Ordinary approved profiles already appear in discovery for free. Spotlight/VIP purchases offer **additional, disclosed placement** within a compatible audience. They do not buy matches, a recipient's attention, trust badges, permission to contact nonconsenting people, or any paid encounter. The product must describe exactly which site areas display placements, the purchase period and the factors that can affect impressions.

### 16.2 Promotion journey (P1)

1. Eligible member opens **My Profile → Promote** and compares simple package cards: Spotlight Month, VIP Week and VIP Month.
2. XORA shows the price, start rule, end rule, promoted label and the user's current active package, if any.
3. Member previews roughly how the promoted card looks, without fabricated view or match numbers.
4. They create a **manual payment order** and pay externally using the verified, provider-permitted receiving account.
5. They submit transaction details and optional receipt; the admin reconciles actual funds.
6. Profile eligibility and payment approval are checked separately. If everything is in order, the campaign becomes **Scheduled** or **Active**.
7. Member sees status, remaining period, actual recorded visits if measured reliably, and the option to schedule renewal.
8. On expiry, promotional placement ends while the ordinary profile remains free and visible if the member chooses.

### 16.3 Renewal, overlap and interruptions (P2)

A member should never lose unused time due to a hidden overlap. The app should default to scheduling a newly purchased package after the active campaign, with a clear alternative for requesting a replacement subject to fair adjustment. If the platform disables promotion because of its own outage or erroneous action, support reviews an appropriate time extension, refund or other lawful remedy. If a profile violates safety rules, paid placement can be suspended without overriding moderation; finance must separately assess any refund obligations.

### 16.4 Promotional labeling and responsible ranking

Use a small, unambiguous **Promoted** label, not "Verified VIP". Cap repeated appearances and preserve discovery diversity. Keep the ability to block/report every promoted profile. If a promotion cannot reach compatible members due to preferences or low regional density, disclose that limitation before purchase; no guaranteed impressions or outcomes.

### 16.5 Not an escort advertising system

Promoted personal profiles cannot include sexual services, prices for encounters, availability for commercial sexual contact, direct booking buttons or paid-sex solicitation. Any proposal to add a professional advertising marketplace requires independent legal review and a separate scope decision, not a label change inside XORA.

---

## 17. Manual payments: a professional no-gateway experience

**Product objective:** make a manual transfer feel clear, reliable and trackable, not like sending money to an anonymous phone and hoping for a reply. No gateway or in-app wallet is required for launch, but **manual payment does not mean free of mobile-money charges, merchant requirements or legal restrictions**. XORA must confirm the proposed receiving method accepts the actual service. Some processors explicitly restrict dating and adult services; never use a false business description or third-party account to avoid underwriting.

### 17.1 Non-negotiable safeguards

1. Only show **one configured, approved business recipient per selected payment channel**, ideally a permitted merchant/business code if available, with registered recipient name. A phone number is acceptable only if explicitly authorized for the business.
2. No payment instructions in personal member chats. Members pay only from the secure **Membership → Payments** page. Never ask for a PIN, password, OTP, SIM access or screenshot of a PIN screen.
3. Every attempted purchase receives a **unique XORA order reference** (example: `XORA-2026-00125`). This is an order identifier for XORA, **not** necessarily a reference field supported by an MTN/Airtel transfer interface. Do not instruct users to enter it in a mobile-money field that does not exist.
4. Keep amounts transparent: product cost, payer transaction charges **if applicable**, recipient name and payment method. Never assume fee-free transfers.
5. An uploaded receipt is **supporting evidence only**. Staff must independently see settled funds in the receiving account's official history/statement.
6. Order review and account-eligibility review are **separate**. Funds received do not override policy or age verification.
7. All monetary corrections, account changes and decisions leave an audit trail.
8. No user-to-user money transfer, escrow, tipping, event deposits or in-app cash balance.

### 17.2 Purchase screen: exact information and layout (PAY0)

The purchase screen must be calm, not pushy. It contains this order:

**A. Product panel** — selected plan name and exact amount (Connect 7/30/90 days: UGX 10,000/25,000/60,000; promotion 7/30 days: UGX 20,000/50,000/80,000), clear duration, estimated activation after admin approval, existing pass expiry/queued start where relevant, what is excluded, and refund link.

**B. Method choice** — only provider-approved, currently active methods such as **MTN Mobile Money** or **Airtel Money**. An unavailable provider appears disabled or does not appear, with explanation, never a broken button.

**C. Verified recipient panel** — business display name, merchant code/recipient number, total transfer amount, optional masked details, copy control and "Check the recipient name shown by your payment app/USSD before confirming." Display an anti-scam banner: "XORA never asks for your mobile-money PIN or OTP."

**D. Your XORA order** — unique XORA reference, purchase date, expiration of current payment instructions, and the staffed review window. Explain that access comes **after manual verification**.

**E. Two actions** — **I've paid — submit details** and **I haven't paid / Pay later**. A person may leave and resume an unpaid order from Payment History; duplicate new orders should not be generated accidentally.

**F. Contact for problems** — Help with payment, including wrong number, wrong amount and forgotten reference. Do not encourage users to send funds twice just because the site is slow.

### 17.3 Connect Pass purchase and renewal: complete member journey (PAY1)

1. An eligible member chooses **Connect Week — UGX 10,000 / 7 days**, **Connect Month — UGX 25,000 / 30 days** or **Connect Quarter — UGX 60,000 / 90 days** from Membership or an outgoing-introduction prompt.
2. A clear summary shows the exact period, **no automatic renewal**, which actions are permitted, whether the period starts after an existing pass, and what remains free on expiry.
3. XORA creates a unique order linked to the locked product, price, member, approved payment channel and timestamp; the official recipient name/number appears only in the checkout flow.
4. Member pays externally through the authorized business receiving method and returns to enter provider transaction ID, approximate transfer time/amount and limited sender details; cropped screenshot evidence is optional.
5. Show a review page, then **Submitted for verification** with order number, staffed review hours, current status and support route. A member can resume this same order after a browser reload; they should not pay again while pending.
6. Finance independently matches actual settled money in the official receiving account against the order, checks duplicates/reversals, and approves, asks for clarification or starts a documented financial resolution.
7. When approved, **activate a full new period from the actual approval time**, or **queue after existing active access** if it is an early renewal. Never count time lost awaiting admin.
8. Member sees **Connect active**, **start date**, **expires on**, receipt, and renewal choices. Invitations are never automatically sent on payment approval.
9. If the pass cannot be activated, the member sees a specific correction/refund pathway; no screenshot alone grants privileges.

**Note on upgrades:** At launch, do not allow changing an already active pass to another tier through ambiguous overlapping orders. Let a member schedule a subsequent period; any upgrade requiring immediate switching must be handled through a clearly documented policy with finance approval and disclosed treatment of unused time.

### 17.4 Promoted profile purchase and calendar (PAY2)

An approved member selects Spotlight Month, VIP Week or VIP Month. The purchase panel explains positioning, duration, campaign start, end and any current active promotion. A member must see if a plan will run **now** or is **scheduled** after an existing promotion. After payment reconciliation, the promotion starts only when the profile is both eligible and within its approved schedule. If review delays the plan, the 7/30-day clock starts at actual activation, **not** when the payment was first submitted, unless a different fair policy is clearly disclosed before purchase.

### 17.5 Payment statuses: external language versus internal control

| Internal state | What member sees | What happens next |
|---|---|---|
| Order created / awaiting transfer | **Awaiting your payment** | Pay externally or cancel; order instructions expire after displayed window |
| Details submitted | **Submitted for verification** | Staff picks up case; no paid access yet |
| Reconciliation in progress | **Being checked** | Staff compares with real receiving-account history |
| Need details | **Action needed** | Show specific safe correction; allow one update on existing order |
| Unmatched / disputed | **Payment not confirmed — support reviewing** | Finance investigates; no assumption of fraud communicated publicly |
| Matched and approved | **Approved — membership active** or **Promotion scheduled/active** | Exactly one entitlement granted; send receipt |
| Rejected after review | **Could not verify this payment** | Reason, support, and appeal path, without sharing staff risk rules |
| Refund under review | **Refund being processed** | Staff handles through approved account procedure |
| Refunded | **Refund completed** | Reference and actual processed date shown |
| Cancelled / expired unpaid | **Order closed** | May start a new order; actual late incoming funds must still be investigated |

**The admin side should separately distinguish:** unmatched funds, multiple possible matches, duplicate receipt/transaction ID, pending/reversed receipt, fraud review, member refund request and completed correction. Do not collapse financial reconciliation into a casual green/red button.

### 17.6 Admin matching rules (PAY3)

A reviewer opens the finance queue, checks the order and compares it to the **official business receiving-account history** using transaction reference, time range, amount, recipient and necessary sender details. The admin dashboard flags known duplicate transaction IDs, a previously used receipt, mismatched amounts and repeated suspicious activity. The reviewer must explicitly confirm:

- **Funds are actually present/settled** in the authorized receiving account—not merely claimed by member evidence.
- **Recipient, currency, amount and payment event** support the selected order.
- **This payment is not already attached** to another approved order and was not reversed.
- **The member is eligible** for the purchased feature, or the payment is documented as awaiting separate eligibility resolution.
- **Evidence was reviewed** and a short factual reconciliation note/reference was saved.

If all conditions hold, choose **Confirm & Activate**. The platform records the authorization and makes the entitlement active **exactly once**. A second click, refresh or two admins reviewing the same order must not generate a duplicate membership or double promotion. If any check fails or the provider account is temporarily unavailable, choose **Hold / Need information**, not Approve.

### 17.7 Refunds and partial payments (PAY4)

| Exception | Required member-friendly response | Internal action |
|---|---|---|
| Wrong transaction reference | "We could not locate it with these details" | Ask for correction; do not assume fraud |
| No receipt screenshot | "Enter your transaction reference and transfer details" | Reconcile directly; support as needed |
| Screenshot looks authentic, money absent | "Payment not confirmed" | Hold, check receipt, monitor for delayed posting |
| Amount lower than price | "We received less than the displayed price" | Offer a clearly documented top-up route **only if lawful and supported**, or refund/resolve under policy; never auto-upgrade |
| Amount higher than price | "We are reviewing an overpayment" | Refund excess through approved process, or another **explicitly consented** outcome—not silent credit |
| Duplicate payment | "We found an additional payment" | Investigate source and process eligible refund; prevent double entitlement |
| Payment to wrong recipient | "We did not receive this transfer" | Explain provider reversal/help routes; do not promise XORA can recover money sent elsewhere |
| Funds received after order expiry | "We received funds for a closed order" | Match and honor equivalent plan or offer appropriate resolution/refund; no disappearance of funds |
| Plan no longer available | "Plan changed while this order was open" | Honor documented valid order if possible or clearly consented alternative/refund |
| Member not eligible or suspended | "Your purchase cannot be activated yet" | Handle case and refund eligibility separately; never buy exemption from policy |
| Mobile-money provider reverses after approval | "We're reviewing a payment dispute" | Finance investigation, fair notice and controlled entitlement correction |
| Proof uploaded to wrong order | "We found a possible mismatch" | Human reconciliation without assigning funds twice |
| Payment submitted on slow/offline connection | "Check Payment History before submitting again" | Resume same request; prevent duplicate orders |
| Business account inaccessible | "Manual checks temporarily delayed" | Publish status; pause approvals and do not guess |
| A staff member changes official receiving number | "Payment details have changed" | Dual review and history; old-order handling and customer notice |

### 17.8 A clear review promise, without false guarantees

Publish actual *staffed review hours* at launch (example planning target: **9 a.m.–8 p.m. East Africa Time**, to be confirmed by staffing) and show an estimated range **only after measuring the pilot**. Suggested internal target: review ordinary submitted cases during the next staffed session; escalate those that age beyond the published service target. The dashboard shows each request's age and flags older cases. Do not claim 5-minute/instant activation without an actual process to deliver it. Urgent fraud and safety incidents use an expedited route.

### 17.9 Protect the business and its customers

- Payment recipient is displayed **only** in the official in-site purchase flow; never use unapproved WhatsApp requests from random support accounts.
- Receiving-account changes require documented ownership, a second person to review if possible, change logging and member-facing effective dates. Old paid orders need resolution, not silent rewrites.
- Restricted proof attachments are visible only to finance staff who need them. Crop/redact irrelevant SMS content, remove unnecessary image metadata and apply a documented deletion period subject to legal retention requirements.
- Members can view **only their own** orders, receipts, refund status and membership history. No public screenshots or transaction reference search.
- Send generic email reminders (where consent and safety allow); do not include sensitive dating preferences or a full receipt in notification previews.
- Keep an independent daily reconciliation list: incoming money, matched orders, unmatched credits, approved entitlements, pending refunds and provider fees.
- Finance and moderation roles are separate where possible. Staff do not grant paid membership on the basis of friendship, cash claims or screenshots.

### 17.10 Example copy for the payment journey

> **Payment not yet verified.** Thank you. Your details for order XORA-2026-00125 have been received. A XORA reviewer will check the transfer against the business account during our listed review hours. You do not need to pay again while this order is under review.

> **Payment approved.** Your XORA Connect Pass is active until [date and time, EAT]. You can initiate additional introductions while the pass is valid, subject to our safety rules. Your receipt is saved in Membership.

> **More information needed.** We couldn't match the transfer using the details submitted. Please check the reference and payment time or contact XORA Support using your order number. Never share your PIN or OTP.

### 17.11 Future improvement path

Start without external gateway fees or integration dependencies, **only if** the business account permits the service. Once the manual workload and revenue justify automation, assess formal merchant integration or statement reconciliation with provider permission. Do not scrape private mobile-money SMS, ask for staff PINs, or automate verification by reading unrelated personal messages. A future automated method still requires fraud controls, disputes and proper accounting.

---

## 18. Member account, privacy and self-service journeys

### 18.1 Membership home (A1)

The Membership page is the member's source of truth. It displays **Free / Connect Week / Connect Month / Connect Quarter**, the exact start and expiry of any active or queued pass, whether the **one accepted outgoing introduction** remains available, and a clear renewal button where appropriate. It shows paid promotion status separately. Purchase history includes order reference, amount, exact plan, payment method, creation date, payment-submission date, current review state, final approval/refund outcome and a secure confirmation receipt. No hidden wallet or balance.

### 18.2 Edit profile and intention (A2)

Members can edit public name, biography, interests, eligible photos, approximate city and intentions without starting over. Material photo/identity changes may require moderation before publication. Switching Date/Casual/Both never affects Connect Pass or free-introduction entitlement. They can see how changes affect visibility before saving.

### 18.3 Account security and recovery (A3)

Allow verified email change, password update, sign-out of other sessions where supported, login activity review, and secure password recovery. Changes to account identity/payment-related contact information may require additional confirmation; do not email a full sensitive profile to the old address. Support never requests a password or PIN.

### 18.4 Pause profile (A4)

A member can pause appearing in discovery while maintaining their login and historical eligible conversations. Clearly distinguish **Pause discovery**, **Mute notifications**, **Unmatch**, **Deactivate account** and **Delete account**. A paid promotion's handling while paused must be described before the person pauses.

### 18.5 Delete account and privacy rights (A5)

Provide a self-service deletion request with clear confirmation, immediate removal from discovery, guidance on what may remain for legal obligations and a stated processing process. Deleting an account does not turn a time-limited Connect Pass purchase into cash or guarantee a new free allowance if a person signs up again. Do not retain intimate preferences forever because a member once paid.

### 18.6 Restricted account (A6)

Show a clear account status, the rules affected where safely disclosable, support/appeal steps and separate financial case status. No purchase can reinstate a restricted person's ability to harass others.

### 18.7 Help, feedback and complaint (A7)

Each member can open a support ticket from any payment, profile, matching or account screen. Prefill their *own* relevant order reference or report ID to avoid repeatedly explaining the problem. Do not expose another member's private case outcome. Provide a reachable support channel, staffed hours and escalation for urgent safety issues.

### 18.8 New user becomes a returning member (A8)

On return, XORA remembers the last chosen discovery mode, displays genuine new invitations and conversation activity, and does not force another onboarding or payment. The home feed should prioritize compatible active profiles and should not use fake urgency or fabricated notification counts. Notification opt-out is respected.

---

## 19. Safety, reports and moderation

### 19.1 Community rules

No underage use; nonconsensual images; harassment, threats, stalking, hate or coercion; impersonation; scams or requests for money from other members; prostitution advertising or solicitation; trafficking or exploitation; explicit pornography; sale of illegal goods; or sharing another person's private information. Members must respect a refusal and an unmatch.

### 19.2 Report journey (S1)

1. Member taps **Report** on a profile or conversation.
2. Choose category: **Underage concern**, **Threats/violence**, **Coercion/exploitation**, **Impersonation**, **Scam/payment request**, **Harassment**, **Explicit/nonconsensual content**, **Prohibited solicitation**, **Privacy violation**, or **Other**.
3. Optionally add a short explanation and securely submit relevant screenshots or message references. Do not require traumatic detail to file a report.
4. Member chooses whether to **Block immediately**.
5. XORA confirms receipt with a case reference and short safety instructions.
6. Moderator triages severity, checks permitted evidence and takes action under policy.
7. Member receives appropriate closure information, without exposing someone else's sensitive account or investigation details.
8. Where policy permits, the affected account holder may appeal an enforcement action.

### 19.3 Immediate block journey (S2)

Blocking should be fast and available from card, profile and chat. The blocked person must not be alerted with “X has blocked you.” The block should stop future contact and hide profiles from one another where feasible. Do not promise absolute invisibility against screenshots, shared accounts or off-platform interactions.

### 19.4 Severity-based action

| Priority | Examples | Expected response |
|---|---|---|
| Critical | Credible minor, trafficking, imminent violence or self-harm threat, serious coercion | Immediate internal escalation, protective account action, preservation of necessary evidence and lawful external referral when appropriate |
| High | Credible impersonation, targeted threats, sextortion, nonconsensual images, active fraud | Prompt human investigation and appropriate temporary restrictions |
| Standard | Repeated unwanted messages, inappropriate profile bio, misleading activity | Normal moderation queue and documented decision |
| Low | Minor profile quality issues, duplicate images, non-urgent corrections | Routine queue and guidance to the member |

Publish actual response commitments only once the team has capacity. Safety reports should not be deprioritized simply because the accused person bought VIP promotion.

### 19.5 Moderation actions

Actions include **approve**, **request edits**, **hide content**, **limit messaging**, **temporarily pause discovery**, **suspend**, **ban**, **restore** or **escalate**. Every action needs a reason, responsible staff identity and timestamp. Staff should follow a consistent written rulebook and avoid arbitrary decisions or misuse of private information.

### 19.6 Appeals (S3)

A member sanctioned for a non-emergency issue can request review from the relevant notice. Ideally a different authorized staff member reviews the appeal. Confirm the outcome and retain only justified records. Appeals do not automatically restore access in high-risk cases.

### 19.7 Safety education

Provide easily accessible guidance: meet first in public, independently verify people, protect your location, don't send money to a match, beware pressure to move off-site, report suspicious behavior, and respect boundaries. The FTC warns about romance scammers moving conversations off dating services and requesting money; XORA should actively educate members about this pattern.

---

## 20. The complete XORA admin dashboard

The admin dashboard is a **staff-only control center** for operating XORA—not merely a place for approving pictures and screenshots. It is one brand and one control center for Date and Casual. It should be usable on a laptop/tablet, with urgent incident actions available safely on mobile. Every consequential action is tied to a named staff account, a time and a reason.

### 20.1 The opening dashboard: what needs attention now?

Show six immediately actionable queues: **Critical Safety**, **Payments to Verify**, **Unmatched Money/Refunds**, **Profiles to Review**, **Support Waiting**, and **Promotions Starting/Expiring**. Each queue shows count, oldest item, assigned person and overdue indicator. A separate summary shows only **verified revenue**, actual refunds, paid entitlements, new eligible profiles, accepted introductions and service availability. Never label an unverified screenshot as cash revenue.

### 20.2 Staff roles and decision rights

| Staff role | May do | Must not do |
|---|---|---|
| Owner / Super Admin | Configure prices, approved receiving channels, team permissions, overall reports | Erase audit history, use personal account as uncontrolled payment destination |
| Finance Reviewer | Inspect private payment details, reconcile account funds, approve straightforward valid orders, flag anomalies | Approve own fabricated orders, see unrelated private conversations, change receiving account alone |
| Finance Supervisor | Review refunds, reversals, mismatches and risky overrides | Approve exceptions without evidence or appropriate record |
| Profile Moderator | Review profile text/photos, request edits, approve eligible content | Confirm payments, see full finance statements |
| Verification Specialist | Complete restricted age/identity review | Show identity documents to other staff or public |
| Safety Lead | Triage serious reports, restrict accounts, preserve justified evidence | Waive rules because someone paid for VIP |
| Support Agent | Explain member status, assist with corrections, escalate tickets | Ask for OTP/PIN, mark funds received, access all member messages |
| Content/Marketing Editor | Update approved website copy and public FAQs | Change live prices, legal terms or payment recipient without sign-off |
| Auditor (if available) | Read authorized action trails and reconciliations | Change transactions or delete records |

One founder may temporarily hold several roles in a small pilot; sensitive changes should still require a documented second check where practical. The dashboard must never create a "master account" exempt from logging.

### 20.3 Navigation map

**Overview**, **Members**, **Profiles**, **Age & Identity Reviews**, **Date/Casual Discovery Health**, **Invitations & Connection Exceptions**, **Safety Reports**, **Payments**, **Unmatched Transfers**, **Refunds**, **Memberships**, **Promotions**, **Support Inbox**, **Announcements**, **Content & Policies**, **Analytics**, **Staff Access**, **Settings**, **Audit Log** and **Incidents**.

### 20.4 Member detail page

Shows account ID, safe display/contact fragments, account creation, eligibility state, public profile preview, intention state, free outgoing invitation status, Connect Pass entitlement, promotion status, prior support tickets and relevant enforcement history. Actions include **request correction**, **pause discovery**, **restrict**, **suspend**, **restore** or **refer to privacy team**. No routine employee access to unreported private conversations.

### 20.5 Profile and identity review queues

The profile queue compares proposed edits with previously approved versions and makes it easy to approve or request a specific fix. The restricted verification queue is separate, with very limited document access and a documented reason if further evidence is requested. An approved photo does not prove a person is safe; do not collapse approval states into one ambiguous green check.

### 20.6 Finance dashboard: the most important operations tool

**List view columns:** XORA order reference, account reference, plan, expected UGX, payment method, submission time, age of request, current review state, assigned reviewer, provider transaction reference (masked), duplicate flag and required next action. Filters: **New**, **Oldest**, **Need details**, **Unmatched**, **Disputed**, **Approved**, **Refunds**, **Potential duplicates** and **Provider outage**.

**Order detail page panels:**

1. **Plan and order facts:** original purchase, current amount, entitlement and date the order was made; these original values cannot be silently edited.
2. **Customer submission:** reference, amount, approximate time, minimal sender details and optional private proof attachment.
3. **Actual receiving-account check:** official matching statement/historical record and who verified it. Do not treat pasted screenshots as equivalent.
4. **Decision checklist:** received, settled, matches amount, matches recipient, not previously used, no reversal, account eligibility, exception notes.
5. **Action row:** **Confirm & Activate**, **Ask for Details**, **Place On Hold**, **Escalate**, **Unable to Verify**, **Start Refund Review**. Require confirmation for the irreversible financial actions.
6. **Audit history:** date/time and author of each change, including correction and refund resolution.

If payment is confirmed, the business action should activate **exactly one** corresponding entitlement, with a recoverable error flow if activation fails. For Connect Passes, it must set exact start/end times: approval time for new/expired passes or the immediately following start after an existing pass expires. It must not start the clock on screenshot upload. When two staff view the same pending order, the dashboard should prevent both from independently approving it. A read-only observer can review outcomes without changing them.

### 20.7 Daily reconciliation and unmatched funds

Maintain a confidential checklist of **all actual incoming funds** in the authorized business payment account during the reviewed period. For each: link to one approved order, mark unresolved with owner and date, or link to refund/reversal case. Reconcile member-reported transfers to the official record. Count mobile-money charges/settlement differences appropriately in reporting. **Unmatched money is still money owed an investigation**, even if no screenshot was submitted. Payments without corresponding funds are *not* revenue.

### 20.8 Membership and free-introduction controls

Show whether a member's **first accepted outgoing invitation** has been consumed, and on what accepted introduction. Show all paid Connect Pass periods, exact activation/expiry timestamps in EAT, pending renewals, paid-plan invoices and any manual extensions. Support may request a documented exceptional restoration for a confirmed fraudulent/error case; an audit-authorized person approves. Connect Pass activation status is never inferred from a person's screenshots or display name. If the member has an **active, unexpired Connect Pass**, they can send eligible additional invitations, subject to anti-spam limits. Admins can view pass type, start/end timestamps, queued renewals, manual corrections, payment link and history.

### 20.9 Promotions and placement management

Calendar/list of active Spotlight and VIP campaigns, amount paid, approved date, actual start/end dates, pause reason, scheduling conflicts, expiry reminders and real (not fabricated) visit counts when available. Disallow multiple active packages for the same profile without an explicit, fair upgrade process. Suppress ineligible/suspended profiles immediately, and route financial resolution to finance.

### 20.10 Safety, complaints and privacy

A separate **Critical Safety** inbox is prioritized ahead of revenue work. Reports show severity, allegations, affected account(s), minimal submitted evidence, assigned reviewer, deadline, action and appeal. Emergency cases must not be hidden behind the general support queue. Privacy/erasure requests are assigned to authorized privacy staff, who track stages and any legitimate retention exception.

### 20.11 Admin-controlled settings

The founder can update languages, supported areas, prices **prospectively**, package descriptions, staffed review hours, moderation rules, community policies, FAQ, branding copy, notification templates, and approved payment channels. Changing a receiving number/account name, granting entitlements, or altering refund rules requires elevated authorization and a visible change log. Existing orders keep their originally stated commercial terms unless a fair, explicit resolution is agreed.

### 20.12 Staff security

Use separate staff logins, strong authentication and multifactor authentication where available. Limit downloads, keep private attachments restricted, revoke departed staff access immediately, track sensitive record views where feasible, back up business-critical records securely, and test access to admin queues before accepting live member payments. No staff member should need to share the main MoMo PIN to do ordinary record reconciliation.

---

## 21. Detailed admin workdays and end-to-end journeys

### ADM1 — A normal business day starts

1. Assigned staff member logs in individually and checks **Critical Safety** before finance.
2. Finance reviewer checks whether the business receiving-account official transaction history is currently available; if not, the dashboard announces verification delay and approvals pause.
3. Profile moderator reviews pending uploads and correction requests.
4. Support reviews overdue member cases, with the payment queue prioritized according to public staffed hours.
5. Owner checks yesterday's verified revenue and unmatched-money list, not only the dashboard's sales count.
6. Each staff member closes or hands over work with case IDs and owners.

### ADM2 — Moderator reviews a new profile

1. Open a pending public profile preview; inspect photos, bio, intentions and obvious impersonation/solicitation risk under published policy.
2. Check **eligibility result**, not full private identity documents unless authorized.
3. Choose **Approve**, **Needs changes**, **Restrict** or **Escalate**; add reason.
4. Member receives clear next steps. An approved but intentionally paused profile stays hidden.

### ADM3 — Finance reviewer confirms a clean manual payment

1. Select order from **Payments → New proof submitted**.
2. Verify original plan, amount, instructions shown and XORA order ID.
3. Independently locate actual settled transfer in the approved receiving account.
4. Compare transaction reference, amount, recipient, plausible time/sender details and duplicate flags.
5. Record the official matching reference and confirm the checklist.
6. Click **Confirm & Activate**; system records approval and grants **one** Connect Pass entitlement or schedules/starts **one** eligible promotion.
7. Check that the entitlement is correct and member notice/receipt is saved.
8. End-of-day reconciliation shows the matching funds assigned exactly once.

### ADM4 — A member says "I paid but nothing happened"

1. Support finds the **XORA order ID**, not the member's password or PIN.
2. Explain accurately whether the case is **Awaiting Transfer**, **Submitted**, **Under Review**, **Needs Details**, **Unmatched**, **Approved** or **Refunding**.
3. If actual funds were confirmed but activation failed, escalate **entitlement correction**; never ask for another payment.
4. If there is no matching transfer, guide corrections and provider checks without accusing the member of fraud.
5. Ticket stays open or assigned until there is a clear financial outcome.

### ADM5 — Wrong amount, duplicate transfer or late payment

1. Finance identifies the incoming transfer independently.
2. Put the order **On Hold** with the exact issue and customer-friendly next step.
3. For underpayment, offer the legally permitted documented resolution; for overpayment or duplication, initiate appropriate refund review.
4. Obtain necessary authorization before any refund or financial exception.
5. Record actual refund/reversal reference; notify the member and reconcile both sides.

### ADM6 — A suspicious screenshot is uploaded

1. Flag possible reuse, altered text or transaction reference mismatch.
2. Do **not** grant access based on an image.
3. Verify receiving-account records; if funds cannot be confirmed, choose **Needs Details** or **Unable to Verify** with support/appeal route.
4. If repeated or deliberate abuse is supported by evidence, refer to the appropriate safety/finance team; don't publish accusations.

### ADM7 — A payment decision needs correcting

1. Staff member opens the original order and correction history.
2. Enter evidence explaining why the prior decision was wrong.
3. Supervisor authorizes correction if necessary; original approval/rejection remains in the trail.
4. Apply adjustment exactly once and assess the member's refund/notification rights.
5. Explain material entitlement changes to the member using plain language.

### ADM8 — Official receiving details must change

1. Owner proposes the new provider-approved receiving account and confirms legal/business ownership.
2. A second authorized reviewer checks the new account details and effective time when staffing permits.
3. Display a preview of what customers will see; never expose unapproved numbers in public FAQs.
4. Publish the change to **new orders only**. Existing open orders display their originally issued details and guidance for resolution during the transition.
5. Notify staff, monitor mismatched transfers, and retain a full audit trail.

### ADM9 — A member is suspected of being underage

1. Safety lead restricts the relevant account from discovery and connections promptly.
2. Authorized reviewers examine only justified age/identity evidence; follow local child-protection procedures.
3. If ineligible, remove access and manage necessary evidence according to law.
4. Finance separately reviews any received payment; paying does not restore account eligibility.
5. Reporter gets an appropriate, privacy-preserving acknowledgment.

### ADM10 — Harassment, impersonation or romance scam reported

1. User files report from a profile or conversation and can block immediately.
2. Safety team triages severity and evidence; urgent cases preempt ordinary service queues.
3. Account can be restricted or content removed proportionately while a case is examined.
4. Review reported financial pressure, impersonation and repeats without reading unrelated chats.
5. Notify parties appropriately; enable appeal where safe and maintain case history.

### ADM11 — A promotion starts, pauses, expires or renews

1. Promotion admin confirms settled payment, eligible published profile and valid schedule.
2. Campaign activates for purchased actual duration and appears only in compatible labeled slots.
3. Admin checks pauses/outages and expiry, honors fair remedy policies, and never sells "guaranteed matches".
4. After expiry, the member's free ordinary profile remains eligible for discovery.

### ADM12 — A member requests account deletion

1. Verify ownership appropriately and hide public discoverability promptly.
2. Assign privacy staff to process permitted erasure and retained legal/safety records.
3. Close paid visibility and membership entitlements according to published terms and applicable law.
4. Explain processing result, lawful exceptions and complaint route.

### ADM13 — End-of-day finance handover

1. Review official incoming business-account transactions for the shift/day.
2. Mark each as matched to one approved order, still-unmatched, disputed or under refund/reversal review.
3. Compare approved entitlements against approved orders; investigate discrepancies and duplicates.
4. Report unresolved funds, late cases, staff exceptions, fees and refunds to the owner.
5. Record assigned next actions. Do not simply "zero out" an unexplained transfer.

### ADM14 — Weekly founder review

Review accepted introductions and user retention, Date/Casual balance, time to first accepted invitation, Connect Pass conversions, promotion renewals, actual cash receipts and net margin. Examine fraud reports and complaint resolution alongside growth. If users cannot find compatible people, do not respond by pushing a more aggressive paywall; improve supply, matching and trust first.

---

## 22. Notifications and communications: useful, discreet and truthful

### 22.1 Channels and user control

**In-app notification center** is the authoritative record for status updates. Verified **email** handles account recovery, important security/payment notices and optional event updates. Do not promise SMS until funded and authorized. Browser push is an optional later feature, always permission-based. External notification previews must not expose Date/Casual mode, other members' photos, messages or private names. A support WhatsApp number, if offered, is only for support and never an alternative personal payment receiver.

### 22.2 Event → message → action

| Event | Member-facing message | Destination / next action |
|---|---|---|
| Account created, email not verified | "Verify your XORA account" | Confirm email/resend |
| Profile draft saved | "Your profile is saved" | Resume setup |
| Profile submitted | "Your profile is being reviewed" | Status screen |
| Profile needs changes | "Please update [approved field]" | Edit exact field |
| Profile approved | "Your profile is ready" | Discover/privacy controls |
| Incoming invitation | "Someone would like to connect" | Accept/decline privately |
| Invitation accepted | "A new XORA conversation is ready" | Private messages |
| First accepted outgoing invitation used | "Your free outgoing introduction has been used" | View Membership |
| Another outgoing invitation attempted | "Unlock more introductions for UGX 10,000 for 7 days / UGX 25,000 for 30 days / UGX 60,000 for 90 days" | Pricing/order page |
| Order created | "Order [ID] is ready" | View verified payment instructions |
| Payment details submitted | "We received your details, not yet verified" | View payment status |
| Payment needs clarification | "Action needed for order [ID]" | Correct details/contact support |
| Connect payment approved | "Your Connect Pass is active until [date/time]" | Plan dates and receipt |
| Payment unverified / disputed | "We couldn't confirm this payment yet" | Review details/help |
| Refund processed | "Your refund was processed" | Refund reference and dates |
| Connect Pass nearing expiry/expired | "Your Connect Pass is ending/has ended. Existing chats stay available." | Renew or remain free |
| Promotion scheduled/started/ending | "Your promotion status changed" | Promo calendar |
| Report received | "Your safety report was received" | Case number |
| Safety restriction | "Review your XORA account status" | Account Status / appeal |
| Password/security change | "Security update on your XORA account" | Secure account center |

### 22.3 Respect quiet, limited messaging

Members may turn off optional discovery/promotional notifications and marketing. Security, payment and essential legal notices stay available in-app and, where appropriate, through the verified account channel. Don't send repeated pressure to upgrade; don't claim someone is "waiting for you right now" unless the system knows that is true. Do not share sensitive profile content in external messages.

---

## 23. Full web-app page inventory and navigation

**XORA is a responsive web app, not a native Android/iPhone app.** The default experience works in common mobile browsers; optional **Add to Home Screen** is a convenience and never mandatory. Members never need an app store account.

### 23.1 Public pages (available without signup)

| Page | Purpose | Required content / action |
|---|---|---|
| Home | Establish trust immediately | Brand, Date/Casual explainer, join-free CTA, what is paid, safety |
| How XORA Works | Explain the service end-to-end | Register → profile → invitation → accepted chat → optional Connect Pass |
| Date | Relationship-intention landing page | Date features, expectation and respectful tone |
| Casual | Casual-intention landing page | Adults-only consent and compatible preferences; non-explicit copy |
| Pricing | Zero surprises | Free outgoing introduction, incoming-free rule, Connect Week/Month/Quarter, Spotlight/VIP prices |
| Payment Help | Explain manual checkout | Supported methods subject to approval, proof options, waiting times, refunds, anti-fraud |
| Safety | Establish boundaries | Reporting, blocking, scams, underage reporting, meeting tips |
| About / Contact | Credible business | Verified operating identity once cleared, support contact, staffed hours |
| Terms, Privacy, Community Rules | Policy transparency | Specific commitments, privacy rights, prohibited paid-sex solicitation |
| Refund Policy / FAQ | Support before payment | Duplicate payments, late orders, eligibility and dispute process |
| Sign In / Register / Recovery | Secure entry | Verified email, account age checks, password reset |

No identifiable member profiles, exact locations, private pictures, payee numbers or sensitive data should be indexed on public pages.

### 23.2 Signed-in member pages

| Page | Main contents | Primary action |
|---|---|---|
| Welcome & Setup | Short adult eligibility and onboarding progress | Continue or save draft |
| Verify Contact | Email verification state | Verify/resend |
| Profile Wizard | Basics, intention, interests, photos, privacy | Save / submit |
| My Review Status | Pending, corrections, approved, restricted | Edit or ask for help |
| Discover | Date/Casual/Both, compatible cards, city/filter | View profile |
| Profile Detail | Photo, bio, interests, broad location, boundaries | Say Hello / Like / Report |
| Saved | Bookmarked compatible profiles | Open/remove |
| Invitations Sent | Waiting/accepted/declined/expired invitations | Withdraw where allowed |
| Invitations Received | Private received invitations | Accept/decline/block |
| Connections | Existing accepted conversations | Open/unmatch |
| Messages | Private chat and moderation actions | Send/report/block |
| Membership | Free outgoing status, Connect Pass, paid benefits | Unlock / view history |
| Promote | Spotlight Month, VIP Week and VIP Month | Select and review plan |
| Order Summary | Exact plan/price, expiry and terms | Choose payment method |
| Payment Instructions | Verified recipient name/code, order ID, amount | Copy / I've Paid |
| Submit Transfer Details | Transaction ID, time, amount, optional proof | Review and submit |
| Payment Status | Readable timeline and next action | Correct / support |
| Payments & Receipts | Historical order records | Open own order |
| Promotion Calendar | Active/scheduled/expired visibility | Renew or manage |
| My Profile | Preview/edit/pause | Save/submit changes |
| Privacy & Account | Security, notification choices, blocked profiles | Update/recover |
| Support Tickets | Private case records and replies | Ask for help |
| Report a Member | Category, optional message evidence | Submit and block |
| Account Status / Appeal | Restrictions and permitted appeal | Request review |
| Delete Account | Clear consequences and ownership check | Submit closure |

### 23.3 Staff-only pages

**Admin sign-in**, **Overview**, **Safety Queue**, **Members**, **Member Detail**, **Profile Reviews**, **Verification Cases**, **Payments**, **Payment Detail**, **Unmatched Funds**, **Refund Cases**, **Entitlements**, **Promotions Calendar**, **Reports**, **Appeals**, **Support Inbox**, **Analytics**, **Content & Policies**, **Team Roles**, **Settings**, **Audit Log**, **Incidents / Handover**.

### 23.4 Navigation rules

On mobile: sticky bottom tabs **Discover**, **Invitations**, **Messages**, **Membership**, **Profile**, plus accessible Notifications/Help and a Date/Casual mode selector on Discover. Keep payment status reachable directly from Membership. On desktop: same logical sections in a clean header/sidebar. In admin: a clear sidebar plus high-priority exception queues, no decorative clutter.

### 23.5 Page-to-page flows that must be testable

1. **Public Home → Join Free → Email Verified → Profile Wizard → Moderation → Discover.**
2. **Discover → Say Hello → Recipient Accepts → First outgoing credit consumed → Messages.**
3. **Recipient receives and accepts an invitation → Messages, no payment required.**
4. **Second outgoing Say Hello → Connect Pass offer → Manual Order → Transfer Details → Status → Admin Approval → Return to Discover → Member confirms sending.**
5. **Promote → Select Plan → Manual Order → Payment Verified → Campaign Scheduled/Active → Expiry.**
6. **Any Profile or Chat → Report → Optional Block → Safety Review → Member Updates.**
7. **Payment Error → Order Status → Help → Finance Resolution / Refund.**
8. **My Profile → Pause / Change Mode / Resume / Delete.**

A screen with no clear next action is unfinished. A status page that only says "Please wait" with no reference, date or support path is unacceptable.

---

## 24. XORA's visual identity, layout and content experience

### 24.1 How the website should feel

A calm, premium members' club rather than a crowded classified-ad directory. Emphasis is on friendly human discovery, consent, privacy and clarity. Avoid explicit photos, fake urgency, blinking banners, intrusive chat popups, pop-under advertising, countdown timers and exaggerated "available now" promises. The brand should work for both meaningful dating and casual connections without looking like a commercial sexual-services marketplace.

### 24.2 Proposed design system (for visual validation)

| Element | Recommended direction |
|---|---|
| Main color | Midnight plum `#171321` |
| Premium accent | Champagne `#E8B96F`—sparingly for membership/brand highlights |
| Connection accent | Dusty rose `#C98499` for gentle human connection cues |
| Light surface | Warm ivory `#F7F3EE` with readable dark text `#282532` |
| Typography | Modern highly readable sans serif; distinctive logo mark but not decorative tiny body text |
| UI cards | Rounded but restrained, readable labels, large fully consented adult imagery |
| Buttons | One strong primary action per panel; secondary plain actions for back/help |
| Image standard | Only adult, owned/consented, non-explicit imagery; no stock photos passed off as active members |
| Dark and light | Light mode default for clarity, with optional premium dark appearance if tested |
| Accessibility | High contrast, keyboard accessible forms, large touch targets, descriptive errors |

### 24.3 Public homepage: scroll narrative

**Header:** XORA mark, How It Works, Date, Casual, Pricing, Safety, Sign In, **Join Free**.

**Hero:** "Meet people who want what you want." Small line: "Choose Date, Casual or Both. Connect privately, at your own pace." Two visible calls to action: **Join XORA Free** and **See How It Works**. No named fake user testimonials.

**Intent selector illustration:** visually distinct but equal-weight cards for Date and Casual, with a "Both" bridge; switching intention is explained as a preference, not a purchase.

**How it works:** Create profile → Explore compatible adults → Send/accept introductions → Chat if accepted → Optional Connect Pass for more outgoing introductions.

**Trust strip:** profile review, private contact details, simple blocking/reporting, payment-review transparency. These are careful claims, not guaranteed safety.

**Prices:** **Free**, **Connect Week UGX 10,000**, **Connect Month UGX 25,000**, **Connect Quarter UGX 60,000**, and **Optional Spotlight**. Link to full details and manual-payment explanation.

**Footer:** support, business identity when cleared, privacy, community rules, refunds, adult eligibility and responsible-use note.

### 24.4 Discover and profile detail

Mobile Discover should lead with Date/Casual/Both toggle, broad city chip, compact filters, then well-spaced member cards. Each card shows public name, age, general area, a short safe bio line and an honest promotion label if relevant. The profile detail presents full approved biography, non-explicit gallery, interests and prompts, with prominent **Say Hello** and obvious **Report / Block**. Use informative empty states and keep old filters when the user returns from a profile.

### 24.5 Messages and invitations

Invite request cards distinguish **Sent**, **Waiting**, **Accepted**, **Declined**, **Expired** without humiliating anyone. Receiving a request is free. Chats resemble a clean private inbox with readable text and clear mute/unmatch/report controls; no noisy casino-like engagement mechanics. Privacy reminders appear at sensible moments, not over every message.

### 24.6 Payment flow: the signature trust experience

Use four clearly labeled stages: **Choose Plan → Pay Externally → Submit Transfer Details → Staff Confirmation**. On the payment instructions screen, amount and **verified recipient identity** are visually prominent; order reference and review hours are next. Offer **Copy** for supported fields. Explain recipient-name confirmation and warn against unsolicited alternative payment numbers. The **I've paid** form asks for transaction reference/amount/time with **optional** proof image; after submitting, show a clear timeline and **Do not pay again while we review**. All status pages contain a support route and order ID.

The **payment status timeline** should always answer: *What did I purchase? What have I done? What is XORA checking? What happens next? Who do I contact if something is wrong?* No celebratory success animation until actual approval.

### 24.7 Admin design

Admin uses practical tables, clear status filters and concise case summaries. Separate **Safety urgent** from **Finance urgent**. Payment detail uses side-by-side **member-submitted data** and **official received-funds evidence**, plus an explicit confirmation checklist. Use color sparingly and never rely on red/green alone. Display who owns the case, case age, decision history and one safe next action.

### 24.8 Words and tone

**Good:** "Your first accepted introduction is free."  
**Good:** "A recipient can accept or decline—no payment required."  
**Good:** "Your transfer details were submitted. Access begins after verification."  
**Good:** "We couldn't match the payment details yet. Please check the reference."  
**Avoid:** "Pay immediately or this person is gone!"  
**Avoid:** "Guaranteed hookup tonight" or "VIP means completely safe."  
**Avoid:** "Payment successful" when a screenshot has only just been uploaded.

---

## 25. Mobile web usability and accessibility

### 25.1 Web-first commitment

Most XORA interactions should work easily in an ordinary mobile browser without installation. The website should adapt gracefully to small phones, tablets and laptops. A saved home-screen shortcut may feel app-like, but the product remains a website. Core access must not depend on Apple App Store or Google Play availability.

### 25.2 Low-data behavior

Compress photos appropriately, use thumbnails before full-size pictures, load only the next group of profile cards, minimize unnecessary animation and let users retry uploads after a weak connection. Keep text readable even before photos finish loading. Never require auto-playing video on the home page.

### 25.3 Accessibility and clarity

Use readable text sizes, sufficient contrast, visible keyboard focus, labeled fields, helpful error messages and large touch targets. Do not make success depend only on colors or icons. Provide text explanations for statuses and do not hide important instructions behind tiny tooltips.

### 25.4 Long-form onboarding on small screens

Break steps into short pages; show progress; clearly mark required/optional fields; save a draft; allow back-navigation without data loss; put privacy details close to sensitive questions. Avoid a long single-screen registration form.

### 25.5 Slow network and interrupted tasks

If the connection drops during signup, profile editing or receipt upload, preserve the user's valid progress where safe and offer **Retry**. Avoid accidental duplicate order creation if a person taps Submit twice or reloads a payment page. Always give a reference number after successful submission.

### 25.6 Shared-device privacy

Use generic external notification content, offer clear sign-out, avoid placing sensitive preferences in browser page titles or public link previews, and warn about shared devices before storing account access. Do not show private member photos or message text in public search previews.

---

## 26. Privacy and responsible data handling

### 26.1 Privacy principles

XORA handles sensitive relationship and identity information. Collect only what is needed, explain why, show it only to people with a legitimate need, let members control the profile, secure evidence uploads, and respect legally applicable data rights. Legal advice and registration obligations under Uganda's data-protection framework must be addressed before launch.

### 26.2 Data categories

**Account:** verified contact, sign-in records, account status. **Dating profile:** display name, age, broad location, bio, photos, interests, stated intentions. **Private activity:** likes, connections, message content and preferences. **Payments:** order, method, amount, transaction reference, receipt and decision history. **Safety:** reports, relevant evidence and moderation outcomes. **Operations:** minimal logs needed for reliability and abuse prevention.

### 26.3 Suggested audience boundaries

| Data | Member | Another eligible member | General staff | Specially authorized staff |
|---|---|---|---|---|
| Public profile details | Yes | Yes when visible/matched as appropriate | For legitimate moderation | When necessary |
| Login email/phone | Yes | No | Limited, masked where possible | Only for justified tasks |
| Full DOB / identity evidence | Own details as permitted | No | No by default | Restricted verification review |
| Chat contents | Parties to chat | Only participants | No routine access | Limited, justified case access |
| Uploaded payment evidence | Payer | No | No by default | Authorized finance/support as needed |
| Abuse case details | Limited own-case updates | No | Assigned case team only | Authorized specialist/lead |
| Audit logs | No | No | Only relevant admin | Owner/compliance as justified |

### 26.4 Consent and sensitive preferences

Marketing consent is separate from essential terms. Discovery preferences should not be unnecessarily exposed or used for advertising. Changes to visibility should be clearly explained. Given local legal risks and potential stigma, avoid collecting unnecessarily detailed sexual behavior or identity information; legal and privacy review must determine the exact user-facing fields and availability in Uganda.

### 26.5 Retention and deletion

Before launch, XORA must publish an actual retention schedule for each category: incomplete accounts, verification evidence, active profile data, old messages, payment receipts, transaction audit records, abuse evidence, support tickets and deleted accounts. Retention must follow law and operational necessity, **not “keep everything forever.”** An illustrative policy might delete stale unsubmitted profile drafts after a defined inactive period and remove unneeded identity-document images soon after verification, while retaining necessary financial records for legally required periods. Exact periods require legal and business sign-off and should not be invented as legal requirements.

### 26.6 Data breaches and access incidents

Have a written response plan: detect, contain, investigate, preserve necessary evidence, evaluate reporting and notification duties, communicate appropriately, correct the cause and document lessons. A dating platform must treat an exposed list of members, intentions or chats as a potentially serious incident, even if financial data was not stolen.

### 26.7 Staff confidentiality

Require confidentiality agreements, training, minimum permissions and prompt access removal when staff leave. Prohibit staff from copying member photos or personal conversations to personal phones or sharing member lists outside work. Audit any access to high-risk evidence where feasible.

### 26.8 Third-party services

Any hosting, messaging, image storage, email or analytics provider must be assessed for data handling, transfers, security and contractual fit. Do not sell sensitive profile/intent data to advertisers. Privacy notices must accurately identify meaningful categories of service providers and how information is used.

---

## 27. Operating policies, customer support and service quality

### 27.1 Policies required before taking real money

Publish legally reviewed **Terms of Use**, **Privacy Notice**, **Community Rules**, **Manual Payment and Verification Policy**, **Pricing and Connect Pass Terms**, **Promotion Terms**, **Refunds/Financial Errors Policy**, **Account Restriction and Appeal Rules**, **Age and Child-Safety Policy**, **Anti-Fraud Guidance**, **Data Rights and Deletion Process**, and **Support Contact/Hours**. Show the applicable policy version alongside each purchase. XORA's owner must ensure the payment receiving arrangement has been approved for the actual service before any live transfers occur.

### 27.2 Support methods and promise

A public **Help Center** and signed-in **Support Tickets** are essential. Add one verified official support email once the business controls it. A business WhatsApp number may be offered for *support* but should not become the payment-order system or substitute for written audit records. Every case gets a XORA reference, category, severity, owner, creation/update date and outcome. Urgent safety requests are immediately elevated above ordinary queues. Publish staffed review hours without promising 24/7 finance approvals.

### 27.3 Payment help without repeat charges

When someone contacts support after paying, ask for **XORA order reference, method, transaction reference and approximate time**—never MoMo PIN, OTP, email password or full phone access. Staff can see submission state and explain it. If real money arrived but the membership did not activate, prioritize *entitlement correction* rather than asking for another transfer. If wrong account received funds, explain provider reversal channels without implying XORA received them. If the member has no screenshot, help using official transfer details and independent business account records.

### 27.4 Standard ticket categories

| Category | Member-facing response | Responsible team |
|---|---|---|
| Unable to verify email | Resend/recovery steps, rate-limited | Support |
| Profile denied/needs edit | Specific policy-based correction or appeal | Moderator |
| Confused by Date/Casual | Explain preferences and visibility | Support |
| Invitation not accepted | Explain no credit charged before acceptance | Support |
| Free outgoing introduction disputed | Show recorded accepted outgoing invitation and exception route | Support + authorized reviewer |
| Money sent, order pending | Show current verification state and staffed hours | Finance |
| Duplicate/wrong amount | Explain correction/refund case with references | Finance supervisor |
| Official receiving details questioned | Direct to approved order page, flag impersonator claim | Finance/Safety |
| VIP didn't start | Check receipt approval and profile eligibility separately | Promotions/Finance |
| Scam/harassment/underage concern | Offer block/report and prompt urgent review | Safety lead |
| Lost account access | Secure recovery only | Support/security |
| Delete or correct sensitive information | Verify ownership and privacy process | Privacy staff |

### 27.5 Owner's minimum operational staffing

Even at low volume, assign named responsibility for (a) payment reconciliation during stated hours, (b) profile approval, (c) safety incidents including escalation outside business hours, (d) support, (e) privacy/deletion requests and (f) financial refunds/corrections. One person may do multiple roles in a pilot, but nobody should be expected to monitor personal WhatsApp chats all day for invisible payment promises. Write a shift handover note for unresolved money and safety cases.

### 27.6 Complaints, disputes, appeals and record-keeping

Document what the member reported, what XORA checked, which policy applied, which staff member made the decision, any refunded amount and what the member was told. Do not delete a case simply because it is embarrassing. Keep access to sensitive details tightly limited. Handle mistakes empathetically, fairly and consistently, with an appeal or escalation path. A purchase is not a waiver of statutory rights or protection from account safety rules.

---

## 28. Exceptional journeys and decision table

The PRD is incomplete unless the following cases have an explicit outcome; each scenario must be tested in the web app and reflected in staff guidance.

| Situation | What the member should experience | XORA staff/policy response |
|---|---|---|
| Underage or uncertain age | No discovery/contact while concern reviewed | Restricted eligibility and child-safety protocol |
| Registration email never arrives | Resend and help, no duplicate member required | Rate limits and safe account recovery |
| Member leaves onboarding midway | Saved profile draft | No public discovery until eligibility approved |
| Member switches Date to Casual | Preview audience implications | Preserve account, chats, free outgoing allowance and Connect Pass |
| Member selects Both, later pauses | Hidden from both feeds | Preserve account and enforce pause |
| Another person copied user's photos | Report and urgent privacy route | Hide contested media, verify and resolve |
| A member sends a like only | No chat, no payment | No credit consumed |
| Outgoing invitation not accepted | Waiting/expired/declined | Keep free outgoing opportunity; no forced paywall |
| First outgoing invitation is accepted | Opens chat | Consume sender's one free accepted outgoing credit once |
| Member accepts incoming invitation after using credit | Free conversation | **No recipient paywall**; outgoing credit unchanged |
| Member attempts second outgoing invitation | Honest Connect Pass offer | Block new outgoing action until approval; old chats remain |
| Pending payment while receiving invitation | Can still accept and reply | No financial status disclosed to counterpart |
| Inviter withdraws before acceptance | Request closed | Retain free outgoing credit |
| Contact blocked/unmatched | Clear privacy-preserving state | Stop inappropriate new messaging |
| Suspected scam account accepted someone's first intro | Support appeal | Consider documented one-time exceptional credit restoration |
| Paid Connect Pass account spams others | Requests restricted, clear status | Safety restrictions override money paid |
| Receipt screenshot looks real, funds absent | "Not confirmed" plus correction route | Do not approve without independent account match |
| Member has no screenshot | Enter transaction ID and transfer details | Finance checks actual incoming record |
| One provider reference claimed by multiple users | Review, not instant accusation | Prevent double assignment; escalate |
| Member sent less/more than price | Clear held status and alternatives | Documented top-up/refund/consented resolution as legally permitted |
| Same transfer accidentally made twice | One entitlement and financial dispute record | Reconcile extra money and arrange eligible refund |
| Money sent to impostor account | No fake confirmation | Provide provider support/reversal guidance and warn others |
| Paid after order expiration | Case remains investigable | Honor valid terms where appropriate or refund/resolve |
| Payment received but profile is under safety restriction | Payment and eligibility shown separately | Hold/resolve membership and refund issue fairly |
| Two admins open one order | One can finalize; other sees change | No duplicate activation or double revenue |
| Admin mistakenly approves wrong order | Audit-visible correction, clear notice | Supervisor review; do not erase decision history |
| Official business wallet unavailable | Transparent delay | Pause approvals until genuine record accessible |
| Payment recipient changed | Clear verified transition notice | Dual review and versioned old/new instructions |
| Customer wants to change plan during campaign | Upfront impact explained | Schedule next term or documented fair upgrade/remedy |
| Profile is suspended while VIP active | No promoted placement | Safety review plus separate financial resolution |
| Promotion ended during business outage | Transparent remedy review | Check purchased period vs actual availability |
| Browser reloads after proof upload | Same order/status, no extra charge | Do not create duplicate order/entitlement |
| Shared phone shows notification | Generic message title | Do not reveal preferences, sensitive photos or chat content |
| Member requests account deletion | Hidden from discovery and clear next steps | Privacy and legal-retention review |
| Member wants refund for no replies | Explain no guaranteed response | Apply fair published terms and law |
| Pass ends while two members are chatting | Keep the accepted chat open | Gate only new outgoing introductions, not established replies |
| Member renews before expiry | Keep unused paid days | Queue the new period directly after the existing one |
| Admin approval occurs days after transfer | Grant full purchased time | Start only on approval or scheduled renewal start |
| Founder shuts down XORA | Advance notice if possible, privacy and entitlement explanation | Lawful closure, refunds where owed, data handling |

---

## 29. Business performance, user value and risk metrics

### 29.1 Success definition

XORA succeeds when eligible adults can confidently express what they want, discover compatible people, send or accept respectful invitations, chat securely and understand prices. Growth without safety and actual human value is not success.

### 29.2 Member and finance dashboard metrics

| Metric | Why it matters |
|---|---|
| Landing visitors → registrations started | Whether the proposition is understandable |
| Contact verification completion | Account-creation usability and spam friction |
| Completed and approved eligible profiles | Supply quality |
| Active profiles by city and Date/Casual/Both preference | Local matching density |
| First outgoing invitations sent and accepted | Initial product value and quality |
| Time to first accepted introduction | Cold-start marketplace health |
| Incoming invitations accepted/declined | Recipient consent and user experience |
| Number of members who used their one free outgoing credit | How much of the base can encounter Connect Pass paywall |
| Connect Week/Month/Quarter orders created / submitted / approved | Conversion with **actual reconciled funds** |
| Paid pass approvals divided by eligible members and repeat renewals per cohort | Price acceptance and renewal value, with cohort context |
| Submitted-to-verified review time (median + overdue) | Manual payment operations |
| Unmatched funds and duplicate proof cases | Fraud/finance risk and unresolved obligations |
| Refund case rate, total refund value and resolution time | Consumer fairness and cost |
| Spotlight/VIP purchase, renewal and complaint rate | Whether extra visibility adds real member value |
| New conversations continuing after 7/30 days | Retention rather than superficial engagement |
| Reports, repeated blocks, urgent-case response time | Trust and safety quality |
| Support age, backlog and reopen rate | Operational capacity |

### 29.3 Economics: verified gross is not profit

Example only: **100 Connect Month purchases × UGX 25,000 = UGX 2,500,000** plus **50 Spotlight Month purchases × UGX 50,000 = UGX 2,500,000**, giving **UGX 5,000,000 gross** before fees, reversals/refunds, staff, hosting, support, age assurance, legal/account compliance, marketing and tax. Passes generate repeat revenue **only if members choose to renew**, and manual payments are completed and independently confirmed. Count **funds actually confirmed**, not screenshots or submitted orders, and do not mistake unsettled transfer requests for sales.

### 29.4 Pilot questions the founder must answer

- Can people in one starting location find enough compatible profiles in **both** modes?
- Do people value the ability to accept incoming invitations for free?
- Does one free *accepted outgoing* introduction provide sufficient confidence to purchase more?
- Is manual approval acceptable during stated staffed hours, and what do users do during delays?
- Do Spotlight packages create measurable appropriate discovery value without degrading unpaid members' experience?
- Can moderation, privacy and finance teams safely handle the real volume?
- Is the business permitted to operate and receive the proposed payments under the relevant rules?

---

## 30. Launch plan: sequence, priorities and exit gates

### Phase 0 — Legal, receiving-account and brand feasibility (MUST BEFORE LIVE FUNDS)

Get Ugandan legal advice on the exact Date/Casual activities, content, marketing and age/privacy obligations. Confirm in writing that a receiving business/mobile-money account permits the actual activity; payment screenshots do not exempt the business from provider terms. Clear business identity, trademark and domain rights for XORA. Confirm the owner can staff safety and payment reviews. **Exit:** documented approvals and a compliant viable operating path; otherwise revise or pause.

### Phase 1 — Prototype and market testing

Test homepage messaging, profile wizard, Date/Casual/Both selection, incoming/outgoing invitation logic, pricing comprehension, payment-instruction pages, order-status screens, admin reconciliation and report/block flows with a small number of consenting adults. Verify that nobody confuses the XORA order reference with an MTN/Airtel transaction reference. **Exit:** people can describe what happens before/after paying and how to report a problem.

### Phase 2 — Build the minimum responsible web app

Public pages and policies; email account/age eligibility approach; member onboarding and profile moderation; discovery and real compatible profiles; outgoing invitation and incoming acceptance logic; private chat; Connect Pass offer; official business-account manual instructions; private payment details form; finance dashboard; order histories; promotions; support and report/block; staff roles and audit log. **Exit:** all core flows work without manual database changes or ad hoc social-chat approvals.

### Phase 3 — Closed pilot in one urban cluster

Enroll a controlled, verified group of eligible adults where the business is permitted to operate. Simulate payment approval and fraud cases before taking real money. Then, where lawful/provider-approved, test real orders at small volume and measure staff review capacity. Test slow internet, wrong amount, a fake screenshot, recipient-change incident, profile suspension and refund. **Exit:** user value, safety and finance controls demonstrated; unresolved critical risks block expansion.

### Phase 4 — Limited public rollout

Publish staffed payment-review hours, support contact and real monitoring of overdue cases. Grow responsibly; do not pay for heavy advertising until verified member supply and finance coverage can handle increased volume. Review actual first-introduction acceptance, Connect Pass conversion and complaint rate weekly.

### Phase 5 — Optimize based on evidence

Improve privacy, member match relevance, verification, support efficiency and payment reconciliation. Consider merchant integration **only after explicit provider approval**, recurring operational need and a justified budget. Native mobile apps, AI matching, video, gifts, wallets and broad new features remain out of scope unless proved necessary and lawful.

### Priorities

**P0 (launch blocker):** legal/payment approval, adult eligibility, safe registration, real profile discovery, consent-based invitations, free outgoing credit, incoming-free messaging, manual payment reconciliation, admin entitlement control, basic promotions if sold, safety reports, privacy, refunds/support and audited actions.

**P1 (post-pilot):** improved search, saved filters, reporting analytics, optional verified-identity signal, promotion calendar, bilingual copy, refined notification choices.

**P2 (later):** richer algorithms, voice/video, web push, home-screen install tips and other non-core conveniences.

---

## 31. Launch acceptance checklist: prove everything works

The founder should **not** mark XORA ready for real payments or public launch until each item below has been demonstrated, not merely described.

### 31.1 Legal and operating readiness

- [ ] Ugandan legal review approves the actual dating/casual service boundaries and user-facing policies.
- [ ] The selected MTN/Airtel/business receiving arrangement explicitly permits XORA's actual business activities; no disguised activity or borrowed personal payment account.
- [ ] XORA brand/domain and relevant registration status checked before launch spending.
- [ ] Applicable personal-data protection registration, governance and privacy-rights processes addressed.
- [ ] Named staff, review hours, urgent safety coverage and refund authority assigned.

### 31.2 Visitor, registration and privacy

- [ ] Public Home/Date/Casual/Pricing/Payment Help/Terms/Privacy/Safety pages are comprehensible on a phone.
- [ ] Adult eligibility and contact verification are genuinely enforced; the site does not rely only on a checkbox.
- [ ] Users can resume drafts, correct a rejected field, pause discovery and request deletion.
- [ ] Public search engines cannot index identifiable member profiles or private account content.
- [ ] Private contact details, DOB, payment details and verification documents remain undisclosed to other members.

### 31.3 Discovery, invitations and conversation

- [ ] Date-only, Casual-only and Both preferences are handled correctly and consent/blocks always take priority.
- [ ] A sent like does **not** consume the free outgoing introduction.
- [ ] An ignored/declined/expired outgoing invitation does **not** consume the free outgoing introduction.
- [ ] A member's first **accepted outgoing invitation** consumes that member's one free outgoing credit **once**.
- [ ] An approved member can **accept incoming invitations and reply without purchasing Connect Pass**, even after using their free outgoing credit.
- [ ] The next outgoing invitation prompts Connect Week/Month/Quarter, without locking older chats or automatically sending on approval.
- [ ] No lifetime product is offered or accidentally advertised; all Connect prices show 7/30/90-day terms and no auto-renewal.
- [ ] Renewal before expiry preserves remaining time; expiry pauses only new outgoing requests, not existing chats or incoming acceptance.
- [ ] Admin verification starts/schedules the purchased term without deducting time for payment review delays.
- [ ] Block, report and unmatch work immediately and safely, including for paid members.

### 31.4 The manual payment checkout

- [ ] The order shows correct plan, **exact UGX amount**, legitimate recipient name/code, charges warning and XORA order reference.
- [ ] Order number is clearly distinguished from the payment provider's transaction ID.
- [ ] Receipt screenshot is optional when reference/transfer details can be checked; no PIN or OTP is requested.
- [ ] Order creation and upload retries do not create duplicate orders or double charge.
- [ ] User sees clear pending/under review/needs details/approved/refunded states and review hours.
- [ ] Admin approval is impossible without independently confirming real incoming funds and checking duplicate use.
- [ ] One approved order grants the right entitlement **exactly once** and saves a confirmation receipt.
- [ ] Partial, extra, duplicate, late, reversed, impostor-destination and unmatched funds all have tested case paths.
- [ ] Receiving-account changes are restricted, auditable and do not silently alter existing payment instructions.
- [ ] Refund processes, legal rights and support contacts are visible before purchase.

### 31.5 Promotions, admin and safety

- [ ] Every Spotlight/VIP plan states price, actual duration and what is/ isn't guaranteed.
- [ ] Paid placement respects preferences, labels sponsorship and does not override profile eligibility.
- [ ] Admin queues separate urgent safety from payment verification and support.
- [ ] Only authorized finance staff can review private receipt evidence; moderators do not need payment access.
- [ ] All consequential staff actions have named author, timestamp, reason and correction history.
- [ ] Suspected minors, impersonation and harassment have urgent protective responses and an appeal policy.
- [ ] Daily finance reconciliation, export controls, secure backup and incident procedures have been tested.
- [ ] Every critical screen has success, pending, empty, slow-network and error states.

---

## 32. What is deliberately out of scope

To keep XORA safe, focused and affordable at launch, Version 1 does **not** include:

- Escort booking, paid sexual-service advertising, rates for encounters or incall/outcall listings.
- Handling or splitting payments between members; no service commissions from meetings.
- An internal cash wallet, coins, recharge balance, escrow or automated gateway integration.
- Separate Android or iOS native app development.
- In-chat explicit image/video sharing, pornography or adult live streaming.
- Automated identity promises, unverified “safe person” badges or guaranteed match claims.
- A public directory of identifiable member profiles indexed by search engines.
- Exact GPS tracking or “find someone at this exact location right now.”
- AI-generated fake members, bot companions pretending to be real people, or fake message notifications.
- Unmoderated public group chats, classified ads or open user-to-user commerce.
- In-person event organization or arranging real-world meetings for people.

Some ideas may be reconsidered later only if lawful, consent-based, commercially justified and operationally supportable. Others—especially exploitation and paid-sex facilitation—remain outside the product boundary.

---

## 33. Founder decisions still to approve

The founder should approve choices explicitly, rather than leaving the developer to guess. Recommendations below are **proposed v1.2 defaults**, not proven user demand or a legal opinion.

| Question | Recommended decision | Who must confirm |
|---|---|---|
| Product category | Adult Date/Casual/Both dating web app; no paid-sex advertising or arrangement | Founder + Ugandan counsel |
| Web app or native app | **Mobile-first browser web app**; no app store dependence | Founder |
| Public registration cost | **Free ordinary member registration** | Founder |
| Free outgoing introduction model | **One free accepted outgoing invitation; incoming invites and replies free** | Founder + pilot users |
| Connect Pass prices | **UGX 10,000 for 7 days / UGX 25,000 for 30 days / UGX 60,000 for 90 days**, for more eligible outgoing invitations | Founder + legal/pricing review |
| Original UGX 50k | **Spotlight Month, 30-day optional profile promotion** | Founder + pilot buyers |
| Other launch promotions | VIP Week UGX 20k/7 days; VIP Month UGX 80k/30 days | Founder + market validation |
| Pay method | Manual only, approved business merchant account/code if feasible | Provider authorization + finance |
| Member payment proof | Transaction details required; screenshot optional and privately stored | Founder + finance/privacy |
| Payment verification | Official receiving-account record required before activation | Finance policy |
| Order validity | Suggested 24-hour instruction validity; late money investigated | Founder + finance |
| Refund routes | Fair published policy, no automatic promise of instant reversal | Ugandan counsel + finance |
| Manual review hours | Publish only actually staffed hours; no instant promise | Owner operations |
| Verification method | Effective, proportionate adult assurance and eligibility review | Counsel + safety/privacy |
| Member privacy | Approximate location, hidden contact info, private sensitive choices | Founder + privacy review |
| Sponsored ranking | Labeled, compatible, rotated, fair | Founder + user testing |
| Safety coverage | Urgent safety escalation independent of office-hour payment review | Owner + safety lead |
| Launch geography | Concentrate on Kampala area before expansion | Pilot research |
| Language | English first; prioritize additional languages from evidence | Founder |
| XORA brand ownership | Verify trademarks, company name and domain; don't assume available | URSB / trademark counsel |
| Success threshold | Accepted introductions + finance accuracy + safety response + retention | Founder |

### Acceptance stories for product and staff

- **As a visitor**, I understand XORA's Date/Casual options and prices before signing up.
- **As a new member**, I can set up a respectful profile without sharing my exact address or phone number publicly.
- **As someone looking for Date only**, I am not pushed into Casual matches merely because another person bought VIP.
- **As the sender**, I do not lose my first free introduction if a request is ignored or declined.
- **As the recipient**, I can accept and reply to a genuine invitation for free without seeing the sender's payment status.
- **As a Connect Pass member**, I can initiate more eligible introductions during my clearly dated paid period without automatic renewal or guarantee-of-match claims, and keep my existing chats after expiry.
- **As a paying member**, I can see verified business payment instructions, submit transfer details and track the order, even without a screenshot.
- **As a member whose money arrived but activation failed**, I can get the entitlement corrected without being asked to pay again.
- **As a Spotlight buyer**, I know exactly what will appear and for how long, without believing it verifies me as safe.
- **As a payment reviewer**, I can match real money, flag duplicate claims and give access only once, with a complete audit trail.
- **As a safety lead**, I can restrict risky behavior immediately, regardless of member VIP status.
- **As the owner**, I can run members, payments, promotions, moderation and support from one controlled dashboard.

---

## 34. Glossary

**Adult member:** A user who has satisfied XORA's minimum age and eligibility rules.  
**Date:** Discovery intention oriented toward dating, romance and possible longer-term relationships.  
**Casual:** Discovery intention oriented toward casual dating or consensual no-strings-attached connection, without paid-sex arrangements.  
**Both:** A member is open to compatible profiles in Date and Casual, subject to preferences.  
**Free outgoing introduction:** One initial invitation a free member sends that is later accepted; an ignored/declined invitation does not use it, and accepting incoming invitations is free.  
**Like / Interest:** A signal of interest that does not by itself open a conversation or consume the free outgoing introduction.  
**Mutual connection:** Two eligible members agree to communicate and access is permitted.  
**Connect Pass member:** A member with a current, manually approved 7-, 30- or 90-day access period for additional outgoing invitations. Existing chats remain available after expiry.  
**Spotlight / Promoted:** Paid increase in eligible profile visibility; not a verification badge.  
**VIP:** An optional higher visibility tier, never a guarantee of safety or responses.  
**Manual payment:** A member pays externally, then submits transaction details and optionally a receipt image for independent staff reconciliation against actual incoming funds.  
**Order:** A record of the member's chosen plan, price and payment review.  
**Entitlement:** An active right to use a particular feature or promotion after confirmed approval.  
**Profile moderation:** Review of content for published community rules and safety requirements.  
**Account verification:** Evidence relating to contact control, adult eligibility or identity; not payment status.  
**Admin audit log:** Traceable history of consequential administrative actions.  
**Web app:** Website providing interactive, app-like functions through a browser, without requiring app-store installation.  
**PWA:** Optional browser-home-screen experience; XORA remains a web application.  
**MVP:** Minimum viable product—the smallest complete, safe and testable version of XORA.  

---

## 35. Research and reference links

These are background sources for the founder and legal/compliance team; the product rules above are **recommendations**, not quotations from these sites. Source availability and laws should be rechecked before public launch. Accessed or researched on **22 November 2026**.

1. **HEX Escorts UG — listing and promotional model reference** (business-model inspiration only; XORA does not reproduce paid-sex booking features): https://www.hexescortsug.com/become-escort
2. **HEX directory structure** (illustrates area/category pages): https://www.hexescortsug.com/directory
3. **Uganda Penal Code Act (consolidated text), Uganda Legal Information Institute:** https://ulii.org/en/akn/ug/act/ord/1950/12/eng@2024-12-23
4. **Uganda Prevention of Trafficking in Persons Act:** https://ulii.org/en/akn/ug/act/2009/7/eng@2024-12-23
5. **Personal Data Protection Office, Uganda — official portal and registration information:** https://pdpo.go.ug/
6. **PDPO Knowledge Center — registration and compliance guidance:** https://pdpo.go.ug/knowledge-center
7. **Uganda Registration Services Bureau — trademark search guidance:** https://ursb.go.ug/trademarks/
8. **Uganda Registration Services Bureau — business registration:** https://ursb.go.ug/services/business-registration/
9. **Uganda Communications Commission — mobile/internet/mobile-money adoption context:** https://www.ucc.co.ug/uganda-communications-commission-a-snapshot-of-gains-impact-and-progress/
10. **YO! Uganda — publicly published restricted/prohibited categories** (example of why the actual receiving-account terms must be checked): https://www.yo.co.ug/?page_id=106
11. **US Federal Trade Commission — romance scam warning and protective advice:** https://consumer.ftc.gov/consumer-alerts/2025/02/looking-love-watch-out-scammers
12. **Example of an additional Uganda dating competitor, luv.ug:** https://luv.ug/
13. **XORA name collision example — existing Xora business usage:** https://xora.vc/terms-of-use
14. **XORA overseas trademark example (not a substitute for Ugandan clearance):** https://ised-isde.canada.ca/cipo/trademark-search/2340310
15. **MTN Uganda MoMoPay / merchant payment and reversal instructions (provider availability, pricing and permissions must be reconfirmed):** https://www.mtn.co.ug/helppersonal/momopay/
16. **MTN Uganda MoMoPay merchant terms and conditions:** https://www.mtn.co.ug/terms-and-conditions/momopay-terms-conditions/
17. **MTN Uganda business-wallet merchant information:** https://www.mtn.co.ug/momo/merchant/
18. **Airtel Uganda merchant payment information (Airtel Money):** https://www.airtel.co.ug/ug/about/driving_financial_inclusion_in_uganda
19. **Yo! Payments acceptable-use policy—example of dating/adult service restrictions; not approval for XORA:** https://paymentsweb.yo.co.ug/acceptable-use-policy/
20. **Uganda government guidance on PDPO registration and annual obligations:** https://doingbusiness.finance.go.ug/licensing/pdpo-data-protection-registration
21. **Uganda Data Protection and Privacy Act at ULII:** https://ulii.org/en/akn/ug/act/2019/9/eng@2023-12-31

### Final definition of the product

**XORA is one premium, mobile-first Ugandan web app that helps consenting adults discover Date or Casual connections through a single private account, agree mutually before messaging, enjoy one free accepted outgoing introduction, and unlock additional outgoing introductions through manually approved 7-, 30- or 90-day Connect Passes. Optional time-limited paid placement helps members promote eligible dating profiles. One admin dashboard controls verification, payments, renewals, promotions, moderation, support and privacy.**

**The product cannot be considered launch-ready until the legal scope, brand use, receiving-account permissions, adult safety procedures and privacy obligations are resolved.**

---

*End of XORA PRD v1.2 — non-technical founder and product-design specification. Supersedes v1.0 for payments and outgoing-introduction rules.*
