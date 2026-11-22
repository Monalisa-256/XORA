# XORA — Phase 1 Exit Gate, Evidence & Test Results

**Date:** 22 November 2026  
**Phase:** 1 — Finalize product UX and complete the design system  
**Source of gate:** `PHASES.md` §5  
**Document status:** **Design handoff prepared; formal Phase 1 exit NOT YET APPROVED.**  
**Why:** Founder sign-off, real-device/usability observation, legal/vendor feasibility and unresolved product decisions cannot be invented by a document or a simulated prototype.

## 1. Deliverable completion against PHASES.md

| Phase 1 deliverable | Status | Evidence |
|---|---|---|
| Public/member/admin page inventory and route map | Prepared | `SCREEN_INVENTORY.md` sections A–C |
| Information architecture and navigation rules | Prepared | `SCREEN_INVENTORY.md` + `DESIGN_SYSTEM.md` §7 |
| Admin route map incl. finance, profile, safety and audit | Prepared | `ADMIN_UX_WORKFLOWS.md` |
| Brand tokens and responsive components | Prepared | `DESIGN_SYSTEM.md`; `prototype/styles.css` |
| Mobile-first first visit → signup → profile → introduction → chat → pass journey | Simulated | `prototype/index.html`, `UX_JOURNEYS.md` §§1–4 |
| Manual checkout screens for all critical states | Simulated + specified | `MANUAL_PAYMENT_UX.md`; prototype order/status/admin paths |
| Admin finance independent settlement checklist | Simulated + specified | `prototype/#admin-finance`, `#admin-payment-detail`, `ADMIN_UX_WORKFLOWS.md` |
| Safety, verification, rejection, appeals, pause/delete | Specified; core sample screens simulated | `UX_COPY_AND_STATES.md`, `ADMIN_UX_WORKFLOWS.md`, `/safety`, `/support`, `/settings`, `/review` |
| Empty/loading/offline/failed/restricted states | Design-state gallery + state matrix | `prototype/#state-gallery`, `SCREEN_INVENTORY.md` §E |
| High-fidelity visual presentation across screens | Four editable SVG boards + PNG exports | `visuals/` |
| Founder reviews paid/rights-sensitive copy | **Pending human approval** | Decision register + review checklist below |
| Observed low-end mobile usability walkthrough | **Not performed** | User-study test scripts defined in `UX_JOURNEYS.md` and `DESIGN_SYSTEM.md` |
| Actual accessibility/contrast and assistive-tech audit | **Not performed** | WCAG 2.2 AA target defined; audit scheduled before sign-off |
| Engineering handoff and open questions | Prepared | All design docs, linked PRD / Architecture / API / DB / Tech stack |

### Important scope distinction

An interactive **UX prototype is not a running backend**. The ability to switch from “member” to “staff” without authentication is a deliberate demo shortcut and would be a severe security defect in production. All payment, approval, age-check and chat actions are fictitious/local only. Phase 2+ must implement authentication, real authorization, private media, server-side transaction safety, messages, reconciliation, moderation and deployment infrastructure.

## 2. Automated checks executed on the design prototype

**Method:** JavaScript parsed with Node v22 (`node --check`). The code was loaded in a restricted Node VM with mock browser interfaces and checked for rendering errors and fundamental state transitions. No network or payment processor is accessed.

| Check | Outcome |
|---|---|
| Public landing renders | PASS |
| All 18 member/public views render in VM | PASS |
| Seven staff views render in VM | PASS |
| Eligible approved member discovery renders | PASS |
| Free outgoing invitation stays unconsumed while pending | PASS |
| Acceptance consumes one free outgoing introduction | PASS |
| Second outgoing invitation without pass navigates to membership | PASS |
| Simulated finance approval activates one pass | PASS |
| Re-approving same order does not create another pass | PASS |
| Early same-kind renewal queues after existing paid period | PASS |
| Prototype imports no external URLs, images or scripts | PASS |
| CSS, HTML and visual SVG/PNG assets exist | PASS |

**Browser QA limitation:** The managed Chromium environment blocked local `file://`, `http://127.0.0.1` and even `data:` navigations with `ERR_BLOCKED_BY_ADMINISTRATOR`; therefore **the interactive prototype has not been validated in a real graphical browser or on a physical phone** in this execution. Do not describe the visual boards as captured browser screenshots. They are separate mockup illustrations created to align with the same design direction.

## 3. Manual review / user research that must still happen

- [ ] Founder approves brand and dark-theme direction, after trademark review.
- [ ] Founder signs off all paid-rights copy, promotion definitions, no-auto-renewal, expiry behavior and free-invitation rules.
- [ ] Ugandan legal reviewer validates actual permitted service scope and policies (Phase 0 gate).
- [ ] Authorized merchant receiving-account/provider availability is confirmed (Phase 0 gate).
- [ ] Named safety lead and finance reviewer validate admin queue design.
- [ ] Conduct at least five moderated, consented **fictional-data usability walkthroughs** with adult target-market participants on low-cost Android and narrow bandwidth.
- [ ] Include at least two participants who are not comfortable with technology; capture wrong-clicks and misunderstandings.
- [ ] Conduct admin simulation with finance and safety operators; challenge them with a suspicious proof and a duplicate transaction.
- [ ] Test 320px, 360px, 390px, 768px, 1024px and 1440px layouts in actual browsers.
- [ ] Test keyboard navigation, accessible form errors, screen reader flows, zoom and reduced motion.
- [ ] Verify color contrast with a reliable checker and fix any failures.
- [ ] Resolve or explicitly defer the high-priority items in `PHASE1_DECISIONS_AND_RISKS.md`.
- [ ] Capture final review signature: approver, date, artifact version and exceptions.

## 4. Functional prototype walkthrough

**Start:** unzip and open `XORA_PHASE1/prototype/index.html` in a modern desktop or phone browser. No network is required. Everything resets on refresh (no saved member database).

### Happy path A: free introduction

1. Home → **Explore member preview**.
2. Change Date/Casual/Both and broad-area filters.
3. Open a fictional profile → **Say Hello**.
4. Invitations → **Simulate acceptance**.
5. Messages → send a fictitious local message.
6. Return to Discover → open another profile → Say Hello. Membership screen appears because the free outgoing introduction was consumed.

### Happy path B: manual Connect payment / finance

1. From Membership choose **Connect Month**.
2. Read plan summary and check acceptance → **Create order**.
3. Check recipient instructions (no real payee) → continue to simulated transfer form.
4. Enter a made-up transaction reference → Submit.
5. Payment Status shows “Under manual verification” and no entitlement.
6. Open **Admin demo** → Payment reviews → select the newly created demo order.
7. Inspect five independent-check requirements; tick them as **fictional exercise only** → Confirm and activate once.
8. Return to member → Membership: active pass with exact expiry.
9. You can deliberately send a new invitation. Repeated approval is rejected.

### Happy path C: signup and profile moderation

1. Home → Join free; **invent** an email/password and DOB for demo purposes; no real credentials.
2. Complete profile wizard and submit.
3. Profile review shows waiting state.
4. Switch to Admin demo → Profile reviews → approve the fictional profile content.
5. Return to member → Discover. **Production adult verification is deliberately absent** and must be implemented separately.

## 5. Product consistency and non-negotiable constraints

- One account, Date/Casual/Both; no separate app accounts.
- Free registration and ordinary visibility, subject to eligibility.
- One accepted outgoing introduction free once per account; incoming/replies remain free.
- Timed Connect plans: 10k/7d, 25k/30d, 60k/90d.
- Timed promotions: 20k/7d, 50k/30d, 80k/30d.
- No lifetime subscription, auto-billing, gateway, tokens or wallet.
- No real accepting/payee account, actual settlement evidence or real user profiles in Phase 1.
- No paid-sex arrangement, services booking, deposits or consent purchase.
- No production deployment before legal, merchant, privacy and safety requirements pass.

## 6. Founder sign-off template

```text
XORA Phase 1 UX Design Review
Approved version: __________________
Approver: ___________________________
Date/time (EAT): ____________________
Decision: APPROVE / APPROVE WITH CONDITIONS / REVISE
Conditions / unresolved items: ______
Payment language accepted: YES / NO
Date/Casual/Both behavior accepted: YES / NO
Admin controls accepted: YES / NO
Visual identity accepted: YES / NO
Research and accessibility evidence attached: YES / NO
```

**Do not mark this phase formally complete until this gate is signed off and required human testing is documented.** The prepared assets are suitable for stakeholder review and Phase 2 scoping using synthetic data only.
