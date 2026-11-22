# XORA — Phase 1 Design System

**Version:** 1.0 (design proposal)  
**Design target:** Responsive mobile-first XORA web app, one account covering Date/Casual/Both  
**Status:** Design and interactive demo assets are ready for founder review. Not an approved public brand or a production implementation.  
**References:** `PRD.md` §§6, 9–24; `PHASES.md` §5; `TECH_STACK.md` §6.

## 1. Brand experience

- **Promise:** “Meet people. On your terms.”
- **Personality:** warm, confident, discreet, mature, inclusive, straightforward.
- **Anti-patterns:** explicit sexual imagery, manipulative urgency, fake activity indicators, privacy theater, payment-as-proof-of-trust, celebrity/user photos without consent, misleading VIP ranking.
- **Voice:** concise, calm and respectful. Avoid shame, sensational language, gender assumptions and promises of matches or sex.
- **Product identity:** XORA is a dating and consensual casual-connections **web app** for adults, not a paid-sex booking, escrow or escort directory.
- **Trademark:** XORA is a working brand until name/legal clearance.

## 2. Logo direction

**Primary wordmark:** uppercase “XORA”, generous letter spacing, warm-gold accent “X” emblem in a rounded-square tile. The emblem should be legible at 32px and on a favicon. **Do not use the logo as a verification badge.**

### Approved design foundations (proposed)

| Token | Hex | Role | Usage constraint |
|---|---|---|---|
| `--bg` | `#11101B` | App background | Never use alone to encode status |
| `--bg2` | `#181626` | Raised navigation | Surface hierarchy |
| `--panel` | `#1F1C2F` | Cards | Most content groups |
| `--panel2` | `#28243A` | Nested cards/filters | Avoid excessive nesting |
| `--line` | `#443D52` | Borders | Supplement with spacing |
| `--text` | `#F7F3F0` | Primary body text | Text over dark backgrounds |
| `--muted` | `#ADA7BD` | Secondary text | Validate small-text contrast in final QA |
| `--gold` | `#EEC78B` | Primary CTAs and highlights | Do not confuse with paid or “verified” |
| `--gold2` | `#F9D9A6` | Highlight text | Always pair with dark surface |
| `--purple` | `#AC98EC` | Focus/secondary accent | Used sparingly |
| `--rose` | `#E7A6B9` | Warm expressive accent | Decoration only |
| `--success` | `#87D7B4` | Success status | Include text/icon |
| `--warn` | `#F4CF86` | Review/pending | Include text/icon |
| `--danger` | `#F5A6AE` | Error/critical action | Include explanation and noncolor cue |
| `--focus` | Gold alpha outline | Keyboard focus | Visible on every interactive control |

**Dark theme is the single MVP theme.** A light theme is optional later. Do not advertise a light/dark toggle or save theme preferences until both are designed and tested. User OS reduced-motion preference is respected.

## 3. Typography

- Preferred production: self-hosted, licensed **Inter** or another system-compatible, widely readable sans family; the prototype uses **system fallback only** (no font asset or external requests).
- Scale: hero 44–80px; primary page heading 29–42px; section heading 22–28px; card heading 17–21px; body 15–16px; help text 13–14px; small metadata 12px only when contrast/legibility remain adequate.
- Weight: 400 body, 600 labels and navigation, 750 call-to-action, 850 display/important metrics.
- Body line height: 1.5–1.6; headings: 1.08–1.25.
- Use sentence case for interfaces. Uppercase is reserved for short eyebrow labels and compact wordmark.
- No entire paragraphs in all caps; never shrink legal/payment explanations into tiny text.

## 4. Space, dimensions and responsive rules

| Type | Proposed value |
|---|---|
| Base spacing unit | 4px |
| Spacing steps | 4, 8, 12, 16, 20, 24, 32, 40, 56, 72px |
| Page max width | 1,200px |
| Desktop page padding | 22–30px |
| Phone page padding | 14–16px |
| Card radius | 18px |
| Modal/dialog radius | 18px |
| Control radius | 11px |
| Pill radius | 999px |
| Field min-height | 46px |
| Major touch targets | 44×44px minimum; avoid tiny icon-only targets |
| Main desktop columns | 2–4 depending on density |
| Tablet | 2 columns on most member grids |
| Phone discovery cards | Two only when readable; one column under ~390px |
| Mobile nav | 5 fixed destinations with safe-area inset |
| Admin layout | Full sidebar desktop; horizontally scrollable nav on narrow devices |

**Breakpoints proposed:** <=390px compact phones; 391–760px standard phones; 761–1020px tablet/small laptop; >1020px desktop. Test actual 320px, 360px, 390px, 768px, 1024px and 1440px widths before approval.

## 5. Component library (Phase 1 contract)

| Component | Core properties/states | Use |
|---|---|---|
| Button | primary, secondary, outline, danger; idle, hover, focus, disabled, busy | One primary CTA per important decision |
| Input | required/optional labels, hint, error, success, disabled | Never use placeholder as the only label |
| Password field | masked, visible-on-request, error/strength guidance | Signup and recovery (prototype not credentialed) |
| Radio card | unselected/selected/disabled | Intention and plan choices |
| Segmented control | `aria-pressed`; Date/Casual/Both | In-place discovery mode switch |
| Select/filter | clear option, empty-result recovery | Broad-area discovery |
| Profile card | fictional image, display name, broad area, intention, content-review meaning | No public directory outside membership |
| Membership tile | price, exact days, what is included, renewal caveat | No fake discount/urgency |
| Order summary | immutable plan, amount, no-automatic-renewal, recipient policy | Before member is asked to pay |
| Order status timeline | created, submitted, needs details, matched/approved, dispute/refund | Trustworthy manual checkout |
| Receipt | plan, order ref, actual approved duration, EAT timezone | After independent confirmation |
| Notification | neutral, warning, critical, success | In-app authoritative record |
| Empty state | clear reason, next useful action | No invented profiles/receipts |
| Error state | exact problem, recovery and contact path | Do not erase user input |
| Confirmation dialog | high-impact actions + explicit consequence | Approval, block, deletion and refunds |
| Admin table | filtering, masked identifiers, column labels, responsive detail view | Finance and review queues |
| Admin verification checklist | explicit independent funds checks | Disabled approval until all prerequisites |
| Safety panel | report, block, stop contact, case number | Always reachable from profile/conversation |

## 6. Profile imagery and content

- Every real photo must be owned or licensed by the member, consented to, age-appropriate and reviewed before publication.
- Public web marketing pages: only synthetic/consented campaign assets, never member profile images or personal identities.
- Member cards: recommended portrait aspect ratio 3:4 with high-contrast name overlay or separated text; always expose a display name in HTML.
- Image processing, alt text, safe cropping, private storage and review are later engineering work.
- **Phase 1 prototype deliberately uses abstract gradient portraits with initials and “FICTIONAL DEMO” labels.** No real persons appear.
- Never load profile photos from a third-party tracking image host in private views.

## 7. Information hierarchy and top-level navigation

### Public

Wordmark | How it works | Pricing | Safety | Join free | Explore demo

### Member desktop

Wordmark | Discover | Invitations | Messages | Membership | Profile | Help | Notifications

### Member phone (bottom navigation)

Discover | Invites | Messages | Plans | Profile. Help, notifications and privacy remain accessible through internal links/header menus. Avoid a different mobile information architecture from desktop.

### Admin

Overview | Payments | Profile reviews | Safety/support | Members | Settings/audit in Phase 1 preview. Full IA is in `SCREEN_INVENTORY.md`; staff actions require separate production authorization later.

## 8. Interaction and motion

- Prefer instant route transitions with updated content heading and persistent bottom nav.
- Modal or toast is never the sole place an important payment decision can be found; order status lives in Membership.
- Max animation time ~150–250ms and disabled for `prefers-reduced-motion: reduce`.
- No autoplay audio/video; no forced notifications; no random “someone likes you now!” messages.
- Back and browser history should work in production; Phase 1 demo hash links are **not** production routing.
- Protect unsaved drafts in signup, onboarding and checkout on connection loss; Phase 1 indicates behavior, Phase 2+ implements server persistence.

## 9. Accessibility acceptance direction

Target **WCAG 2.2 AA** in production, subject to actual audit.

- Keyboard-accessible navigation and every core workflow; logical tab order.
- Visible focus; form labels; helpful error messages next to the relevant field.
- Buttons identified by words, not icons alone; statuses always combine copy and visual treatment.
- Avoid low contrast, essential color-only information, gesture-only interactions and inaccessible offscreen modals.
- VoiceOver/TalkBack, 200% zoom, 320px CSS width and reduced motion must be tested on real devices before sign-off.
- Admin tables need accessible names, human-readable timestamps and mobile detail alternatives.
- Confirmation and destructive actions must clearly describe their consequences.

## 10. Payment-specific copy and visual rules

- **Order summary is authoritative:** exact UGX amount, package, 7/30/90-day duration, no automatic renewal, activation rule, refund policy link and a unique reference.
- **Receiving details must be verified in the live product.** Never show a recipient number in the Phase 1 demo.
- “Submitted for review” is **not** “Paid”, “Received”, “Verified” or “Active”.
- “Admin approved” is only shown after an independent official settled-funds check; receipt screenshots alone cannot unlock access.
- Mask sender data on staff list views. Request correction on the existing order; do not pressure members to pay twice.
- Payment flows must display staffed review hours when they are approved. No ungrounded minutes-to-approval promises.
- Use **Africa/Kampala / EAT** for activation, expiry, queue windows and receipts.
- Promotions are labeled as promotion/featured placement. They never alter member eligibility or consent.

## 11. Usability review protocol

Conduct tests on 360px Android Chrome, 390px iPhone Safari (or equivalent), 768px tablet and desktop; simulate slow connections and an interruption during manual checkout. Ask representative consenting adults to complete five tasks without coaching:

1. Explain whether joining and receiving an invitation costs money.
2. Choose Date vs Casual vs Both and find a compatible profile.
3. Send one outgoing invitation, then explain exactly when it uses the free allowance.
4. Select a 30-day Connect Pass, locate the payee verification warning, and explain “pending” vs “active”.
5. Find a block/report option and understand how to pause a profile.

For staff, simulate: mismatched reference, duplicate transfer, approving a correct order once, requesting correction, and checking if a reviewer can view identity evidence they do not need. Record task completion, time, wrong clicks, major misunderstandings and user quotes. **No real user testing has occurred in this delivery**.

## 12. Design tokens as CSS

The interactive demo's source of truth is `prototype/styles.css`. Engineering should promote design tokens into shared typed constants during Phase 2, with automated contrast and visual regression tests. The prototype is not an authorization, billing or verification implementation.
