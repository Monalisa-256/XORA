# XORA — Phase 1 UX/UI Handoff Package

**Product:** XORA premium adult dating and consensual casual-connections **web app**, one member account with Date/Casual/Both intentions.  
**Package version:** Phase 1 Design v1.0 — 22 November 2026.  
**Status:** Substantial design implementation and interactive demonstration complete; real-device user research, founder signature and Phase 0 legal/provider gates are still pending.  
**Do not publish prototype as a real service.** It has no secure authentication, live payment authorization, actual adult identity verification or backend.

## Quick start — open the interactive prototype

1. Extract this ZIP.
2. Find `XORA_PHASE1/prototype/index.html`.
3. Open `index.html` in a modern browser. It is self-contained with local `styles.css` and `app.js`, and needs no network service.
4. On the landing page click **Explore member preview** to test fictional member journeys, or **Join free** to test the signup/profile wizard.
5. After submitting a fictional transfer reference, choose **Open finance-review demo** to simulate staff review and activation.
6. Reload to reset the demo. Do not enter any real email, ID, personal details or payment evidence.

> The “Admin demo” button is a prototype-only role switch. The real application must have separate staff authentication, MFA and permission checks.

## What Phase 1 produced

| File/folder | What it is |
|---|---|
| `prototype/index.html` | Actual interactive HTML/CSS/JavaScript UI prototype |
| `prototype/styles.css` | Dark responsive XORA visual system and common components |
| `prototype/app.js` | Purely local simulated member/admin journeys |
| `DESIGN_SYSTEM.md` | Brand, palette, typography, spacing, component states, accessibility |
| `SCREEN_INVENTORY.md` | Complete public/member/admin route inventory and screen contracts |
| `UX_JOURNEYS.md` | Mermaid flows, 12 end-to-end journeys and review scripts |
| `MANUAL_PAYMENT_UX.md` | Eight-screen manual-payment blueprint + exception handling |
| `ADMIN_UX_WORKFLOWS.md` | All 14 admin procedures and staff permissions |
| `UX_COPY_AND_STATES.md` | Text for signup, payments, errors, restricted states, help |
| `PHASE1_DECISIONS_AND_RISKS.md` | Adopted design assumptions, high-priority unresolved decisions |
| `PHASE1_ACCEPTANCE.md` | Traceable acceptance checklist, automated checks and pending signoffs |
| `visuals/*.svg` | Four editable, illustrative static composition boards |
| `visuals/*.png` | Four PNG exports of the design boards (not browser screenshots) |
| `static_demo_test.js` | Node VM checks of screen render and key simulated business rules |

## Prototype screens implemented

Public: Home, How it works, Pricing, Safety, Signup.  
Member: Five-step onboarding, Review status, Discover, Profile detail, Invitations, Messages, Membership, Promotions, Order summary, Payment instructions, Submit transfer details, Payment status, Profile/Privacy, Support, UX states gallery.  
Admin: Overview, Finance queue, Payment detail, Profile reviews, Safety/support, Members, Settings/audit.

Not every route specified in `SCREEN_INVENTORY.md` is a fully interactive page. Deferred routes have wireframe/content/state contracts for Phase 2–7, which is the correct boundary for Phase 1. The key risk-bearing journeys are clickable in this package.

## Useful test paths

**Free connection:** Explore member preview → View profile → Say Hello → Invitations → Simulate acceptance → Messages. Try a second outgoing invitation to open Membership.  
**Manual payment:** Membership → Connect Month → Review terms → Create order → Simulate transfer details → Pending → Admin demo → Payment reviews → Check independent reconciliation items → Approve once → Return to Member.  
**Profile review:** Join Free → Wizard → Submit → Admin demo → Profile reviews → Approve fictional content → Return.  
**Error states:** Member demo → UX States.  
**Promotion:** Member demo → Membership → Optional visibility boosts.

## Safety limitations

The local JavaScript prototype does **not** access the internet, send messages, store passwords, receive mobile money, upload media, verify ages, validate any receipt, or enforce production permissions. All profiles are invented and portraits are abstract gradients. Checkout intentionally does not show a real MTN/Airtel receiving account. This is a UX review artifact, **not** a launch-ready product.

## Design review status

Read `PHASE1_ACCEPTANCE.md`. A static VM logic test passed (all documented checks), but Chromium in this execution was restricted by administrator policy and could not render local pages. The static SVG/PNG boards are illustrative compositions, not claimed browser screenshots. Formal Phase 1 sign-off needs founder approvals, user testing and real-device accessibility/low-data checks.

## Next stage

After design and Phase 0 approvals, Phase 2 delivers the secure engineering foundation: Next.js app shell, PostgreSQL migrations, auth/session protections, staff MFA, private storage, environment separation, CI, background jobs and staging security tests. Use the existing `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `API_SPECIFICATION.md`, `TECH_STACK.md`, and `PHASES.md` as companion contracts.
