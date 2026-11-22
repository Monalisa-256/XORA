# XORA — Phase 1 Decision Register & Risks

## A. Adopted for design (still subject to founder signature)

| ID | Decision | Rationale / constraint |
|---|---|---|
| D01 | One XORA responsive **web app**, not a native app | Matches PRD and phases |
| D02 | One account and one profile; Date/Casual/Both modes | Mode changes do not affect billing |
| D03 | Adult dating and consensual casual connection only | No paid-sex booking or escort arrangements |
| D04 | Ordinary profile and browsing free after approval | Avoid pay-to-list barrier for dating users |
| D05 | First outgoing introduction free if accepted | A pending/declined/expired invite doesn't consume it |
| D06 | One active free outgoing request at a time | Limit invitation spam |
| D07 | Incoming invitations and accepted chats free | Consent and continuity of conversations |
| D08 | Connect Week UGX 10k/7 days; Month UGX 25k/30 days; Quarter UGX 60k/90 days | PRD v1.2, price testing needed |
| D09 | VIP Week 20k/7d; Spotlight 50k/30d; VIP Month 80k/30d | Optional, separate from verified status |
| D10 | No lifetime pass, wallet, gateway or auto-renewal | Manual MoMo account reconciliation only |
| D11 | Clock starts at admin-confirmed activation, EAT | Fair to members awaiting manual review |
| D12 | Identical early renewals queue, preserving days | No loss of paid time |
| D13 | Dark premium styling, warm gold, mobile bottom tabs | Readable, discreet identity |
| D14 | No real photos, ID evidence or payment numbers in prototype | Synthetic-only demonstration safe to share for review |
| D15 | Public marketing has no indexed private member profiles | Privacy and discoverability gate |

## B. Founder/business decisions required before Phase 1 is signed off

| Priority | Decision needed | Default used only for UX demonstration | Owner |
|---|---|---|---|
| Critical | Final lawful service scope; provider/host/payment acceptance | Non-compensated adult dating only | Founder + Ugandan counsel |
| Critical | Name and trademark availability | XORA treated as working brand | Founder + URSB/trademark counsel |
| Critical | Authorized business payment recipient/channels | Demo intentionally shows none | Finance lead |
| Critical | Refund/overpayment/chargeback rules | Support and review only, no auto credit | Finance + counsel |
| Critical | Approved adult age/identity assurance and appeals | Separate content/eligibility reviews; no real IDs | Trust + counsel |
| High | How long an invitation can remain pending | Suggested 7 days | Founder + trust |
| High | Daily outgoing invite/rate limits | Restricted in demo only for free requests | Trust + product |
| High | Profiles' displayed age vs age band, supported gender/preference choices | Demo uses age, gender optional | Product + privacy |
| High | Photo count, size and face visibility/accessibility exceptions | One photo to publish unless exception | Product + trust |
| High | Match ranking and promoted placement fairness | Compatible profiles + labeled featured rotation | Product |
| High | Same-tier vs cross-tier pass upgrade credit rules | Same-kind early renewal queued; cross-tier TBD | Finance + product |
| High | Real staff review hours, support contacts and response SLAs | Not invented | Operations |
| High | Staff roles, MFA, dual approval thresholds | Demo role switch only | Engineering + finance |
| High | Data retention, privacy rights, jurisdiction and export format | Separate privacy workflows, no real storage | Counsel + privacy |
| Medium | Language rollout, areas beyond Kampala | English + broad Ugandan areas | Product |
| Medium | Marketing images, logo trademark checks and legal imprint | Abstract portraits and working wordmark | Brand lead |
| Medium | Whether phone/email recovery needs SMS budget | Email first | Engineering |

## C. Priority risks and mitigations

| Risk | Why it matters | Design mitigation | Remaining gate |
|---|---|---|---|
| Legal/payment service not permitted | Real operation may be prohibited or unbankable | No paid-sex facilitation; demo-only payments | Written legal and merchant approval |
| Underage/impersonation | Severe safety and legal impact | Required eligibility review; block/report | Real age assurance, specialist staff |
| Fake payment screenshots | Unfunded access granted | Only independent settlement check enables approval | Actual receiving-account reconciliation |
| Duplicate approvals | Financial loss / incorrect memberships | One-order/one-grant contract; confirmation checklist | Atomic backend guarantee |
| Privacy of dating intentions | Exposure, stigma, harassment | Member-only profiles; approximate areas; muted notifications | Real access controls, encryption, policy |
| Poor low-end mobile performance | Abandonment during signup or payment | Lean CSS, no external images/fonts in prototype | Real-device tests, perf budgets |
| Manual review delays | Poor conversion and support load | Clear pending status, retain order, staffed hours | Staffing and SLA |
| Overpromised visibility | Deceptive VIP sales | Labeled paid placement, no match guarantee | Transparent ranking and actual analytics |
| Staff misuse | Evidence leaks or improper approval | Least privilege in spec; audit, MFA, dual control | Backend/staff security implementation |
| Hardcoded design decisions | User confusion after policy changes | Explicit decision log, versioned approved copy | Founder sign-off |

## D. Policy on the prototype

The interactive prototype is **not a live beta**. It has no real registration, auth, age verification, encryption, data storage, payment connection, financial ledger, messaging, moderation queue or permission checks. All data is ephemeral in the browser tab. If someone serves it to the public, it still must be labeled a **fictional concept demo**, with no real payees and no personal-data collection. The production implementation belongs in Phases 2–8.
