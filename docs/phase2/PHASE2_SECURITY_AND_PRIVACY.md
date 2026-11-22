# XORA — Phase 2 Security, Privacy, Identity and Authorization Design

**Version 1.0 — proposed controls, not a completed security audit.** Read with `PHASE2_ENGINEERING_BLUEPRINT.md`, `DATABASE_SCHEMA.md` and `API_SPECIFICATION.md`.

## 1. Security objectives and assumptions

XORA users may later disclose relationship intentions, broad location, communication preferences and personal photos. Staff may handle age-assurance outcomes, restricted evidence, complaint records and manual payment claims. These are sensitive even where not formally designated as a particular statutory data category. The trust boundary is therefore stricter than for an ordinary marketing website. Security must be demonstrated **before** real user data is accepted.

**Phase 2 data posture:** all testing uses fictional adults, generated emails in a sandbox namespace, opaque test photos and dummy receipts. No actual national IDs, phone numbers, Mobile Money statements, real member profiles or authentic personal images. Production is a disabled placeholder unless the separate go/no-go gates are satisfied.

**Protect, in priority order:** (1) consent and adult eligibility; (2) member privacy and interpersonal safety; (3) separation of staff privileges; (4) finance integrity; (5) service availability and incident recovery; (6) ability to reconstruct privileged changes without invasive surveillance.

## 2. Threat model

| Threat | Attack / mistake example | Primary control | Verification evidence |
|---|---|---|---|
| Privilege escalation | Member sends `is_admin:true` in signup JSON | Deny unknown fields; server-managed roles; DB permissions | Member staff-route `403`; role cannot change |
| Broken object authorization | User A edits `/files/B` or queries another member's data | Resource ownership re-check per endpoint | Two-account cross-access test |
| Stolen staff session | Session replay after logout/revocation | MFA, secure cookies, short staff lifetime, forced revocation | Expired/revoked session denied |
| Credential stuffing | Mass login attempts | Rate limits, account alerts, throttled password flows | Flood test hits `429` without enumeration |
| CSRF/cookie abuse | Cross-site form attempts staff mutation | Same-origin validation + framework-appropriate CSRF defense | Cross-site write rejected |
| Sensitive URL exposure | Receipt/ID public bucket URL copied to social platform | Private bucket, per-request auth, short signed URLs | Anonymous and expired link denied |
| Client-side trust | Browser asserts `adult_verified:true` or `payment_approved:true` | Server authority + deny invalid/unknown state changes | Tampered body has no effect |
| Audit tampering | Reviewer erases record of an action | Append-only/restricted audit, segregated writer/reader | Forced edit/delete denied; trails preserved |
| Secret leakage | Email keys or DB password bundled into JS | Server-only config, static secret scan, no debug dumps | Bundle scan and CI failure |
| SSRF/upload abuse | SVG/HTML used as receipt, dangerous metadata | Allowlisted media, content sniffing, capped size, processed derivatives | EICAR-like harmless test/malformed file rejected |
| Queue message duplication | Two workers send duplicate notice | Lease, idempotent consumer, dedupe key | Competing worker test |
| DB loss / corruption | Accidental destructive migration | Reviewed SQL, backups, restore rehearsal, least privilege | Recorded clean restore + smoke |
| Unapproved live use | Public join and payee details appear on demo | Feature flags, staging access gate, no production secrets | E2E confirms disabled capabilities |
| Insider misuse | Support staff opens age evidence or exports all data | Need-to-know permissions, purpose/case linkage, audit | Permission matrix tests |
| Inference via metadata | Publicly exposed private intent/availability in cache/log | no-store, redaction, coarse status; no public profile indexing | Headers/log inspection |

Treat OWASP ASVS 5.0 as the control checklist, but use XORA's own business authorization tests too. The goal is evidence-based verification, not checking a generic security box.

## 3. Identity and account separation

### Distinct concepts

- **Auth identity:** password/credential, verified email, sessions; owned by the chosen maintained auth library.
- **XORA account:** account status (e.g. `active`, `restricted`), user-safe public identifier; not the password table.
- **Adult eligibility:** a *separate* decision obtained in Phase 3. Verified email alone is not age verification.
- **Profile approval:** a separate moderation decision, not implied by login or payment.
- **Staff grant:** manually provisioned permission to use the admin workspace, not inferred from member type.
- **Paid entitlement:** future server-side right, unrelated to identity/verification authority.

The service should therefore never have a single generic `verified` boolean that conflates all of these states. Staff may also be a member, but the staff permission is an additional role with stronger authentication, not a second unsecured account or client-side toggle.

### Staff sign-in design

Provision staff by a founder/authorized admin via a separately audited action. Staff MFA is mandatory before privileged routes, including read-only finance or evidence screens. Prefer phishing-resistant methods if the selected library/provider supports them; otherwise properly enforced TOTP and single-use recovery codes. A staff password reset must not silently disable MFA or restore a suspended staff grant. MFA recovery requires identity checks, separately authorized approval and a log entry.

**Session restriction:** revoke all staff sessions on account disable, suspected compromise, recovery-code reset or role removal; reevaluate permissions from server-side storage on every request (possibly through a short cache with immediate invalidation). Cookies are Secure, HttpOnly, appropriately SameSite and scoped; never put session credentials into localStorage.

## 4. Permission architecture: deny by default

Use *roles → permissions → resource constraints*. A role doesn't automatically grant access to every record. The canonical permission names must be stored and versioned; clients only use them to hide unavailable controls for UX, while the server independently enforces every check.

| Permission | Member | Support | Finance | Safety | Owner/security |
|---|---:|---:|---:|---:|---:|
| `member.read_self` | Own | Own | Own | Own | Own |
| `staff.dashboard.read` | — | ✓ if granted | ✓ if granted | ✓ if granted | ✓ if granted |
| `staff.accounts.review` | — | — | — | ✓ if granted | ✓ if granted |
| `staff.finances.review` | — | — | ✓ | — | ✓ if granted |
| `staff.finances.approve` | — | — | Explicit separate grant | — | Explicit separate grant |
| `staff.audit.read` | — | — | — | Limited cases only | ✓ if granted |
| `staff.roles.manage` | — | — | — | — | Explicit dual-control grant |
| `private_file.read_owned` | Own object | — | — | — | No blanket override |
| `verification_evidence.read_case` | — | — | — | Case- and purpose-bound | Need-to-know, audited |

The Phase 2 demo implements enough permissions to prove allow/deny logic. Later staff privileges must be approved by a named owner with least privilege. Specifically, finance reviewer cannot alter age verification; content moderator cannot approve payment; support cannot override member entitlements; owner cannot bypass auditing.

### Decision algorithm (conceptual)

1. Reject missing, invalid or revoked session.
2. Reject restricted account or staff lacking completed MFA.
3. Resolve target resource on server; never trust a user-provided `owner_id`.
4. Evaluate permission and resource relationship, including case purpose where relevant.
5. Apply rate limits and request validation; require sensitive action reason and idempotency/version.
6. Log allow/deny for appropriate security events with minimal metadata; return a safe `401`/`403`/`404`.

### Role tests that must pass

- Guest → member `/api/v1/me`: unauthorized.
- Member A → member B's demo private file: forbidden/not found (without leaking existence).
- Member → admin routes: forbidden even with forged cookie claims or JSON role fields.
- Finance staff → evidence vault: forbidden.
- Support staff → staff-role management: forbidden.
- Staff without MFA → admin routes: denied.
- Staff with MFA then role revoked → next request denied.
- Owner accesses redacted audit → permitted only with audit grant; raw passwords/IDs never included.

## 5. Environment secrets and encryption

Use a managed secret store/environment variables on the hosting platform, not `.env` files shared in chat. Local `.env.local` must be gitignored and contain only disposable credentials. Keep separate credentials for DB runtime vs migrations, test email vs approved live sender, staging vs production, app vs worker. Avoid `NEXT_PUBLIC_` for any private value. Rotate and invalidate secrets after exposure, staff offboarding or suspected compromise.

| Secret category | Used by | Never available to |
|---|---|---|
| Auth signing/session key | Server app only | Browser, logs, public bundle |
| DB runtime URL | App and scoped worker | Client, unrelated deployment, CI on untrusted PR |
| DB migration credential | Protected migration job | Running web app and PR preview |
| Object storage key | Storage adapter (narrow scope) | Member browser, public client code |
| Email service credential | Worker/approved server sender | UI, staging demos of real email |
| Monitoring token | Server-side exporter | Users, untrusted build steps |

TLS between browser and app and between app and dependencies; encrypted DB backups and encrypted private buckets. Avoid writing key material in migration output. Regularly scan Git history and generated bundles for secrets, not just working tree. Do not log email magic links, verification tokens, MFA codes or cookies.

## 6. Privacy and collection design

### Data collected in Phase 2

Only synthetic account names, sandbox emails, generated random IDs and test records. No real DOB, face, relationship intent, real MoMo number, real evidence, chat contents or location. Therefore legal data-retention agreements for future live data can be evaluated without prematurely processing it.

### Future privacy boundaries prepared now

- Separate approval tables for age eligibility and content moderation; store outcomes rather than raw identity data whenever lawful and adequate.
- A distinct restricted evidence storage area; object access logged with purpose, actor, case and expiry.
- Consent events are versioned, not hidden within a general `user.updated_at`.
- Users get transparent purpose-bound data handling and eventual export/deletion routes; legal hold rules are separately controlled.
- Profiles are discoverable only to eligible approved users; no public member search pages or SEO caches.
- Sensitive member preferences, precise activity events, conversations, evidence and raw payment references never go to routine analytics or crash trackers.
- Adopt data minimization and retention schedules approved by Ugandan privacy/legal reviewers before using real records. Cross-border hosting/data transfers require review rather than default assumption.

## 7. Security headers, caching and web risks

- `Cache-Control: no-store` for authenticated pages and API responses containing private user data.
- CDN/public caches limited to static brand assets and nonpersonal marketing material.
- Strict HTTPS, HSTS after HTTPS/domain readiness, X-Content-Type-Options, carefully tested CSP, Referrer-Policy, Permissions-Policy and scoped cookie policy.
- Rate-limit unauthenticated login/reset, email verification requests, all uploads and staff endpoints; never disclose whether a reset email exists.
- Avoid wildcard CORS with session cookies. The browser application should use same-origin APIs by default.
- Email verify/reset links are one-time, time-limited and invalidated on use; verify redirect destinations with an allowlist to avoid open redirect.
- Make signed object URLs short-lived, scoped and not shareable in logs; re-check authorization at issue time and limit maximum validity.
- Apply resource ownership both for list queries and single-resource endpoints; never depend on frontend hiding objects.

## 8. Required audit trail

Audit only security-relevant events and privileged changes, for example: staff login/MFA success or denial, role grants/revokes, member restriction, file access to protected evidence, private storage policy change, environment configuration change, migration, idempotent protected operation and later real finance decisions. Include timestamp UTC, actor ID, action, resource kind + opaque ID, outcome, reason code, request ID and minimal safe contextual metadata. **Never** include password, credentials, raw receipt/ID, chat content or full sensitive personal fields. Restrict audit readers, retain based on approved policy and detect attempted modification.

## 9. Incident and operational response design

### Severity examples

- **SEV-1:** age-gate bypass, cross-account sensitive record exposure, real payment approval without settled funds, widespread admin compromise, critical data breach. Block launch/transactions; notify security/legal leadership, preserve evidence and follow applicable notification rules.
- **SEV-2:** suspected staff session hijack, private file URL leak, significant auth outage, migration failure, persistent job loss. Disable affected path, rotate/revoke and restore from safe state.
- **SEV-3:** isolated form error, delayed generic email, test dashboard issue without sensitive-data exposure. Ticket and fix before affected release as appropriate.

Record incident owner, detection time, containment, affected systems, safe communications, evidence preserved without unnecessary copying, recovery, follow-up and postmortem. Phase 2 must rehearse staff revocation, accidental staging secret exposure, backup restore and worker outage using synthetic fixtures.

## 10. Security exit evidence

- [ ] Threat-model walkthrough signed by engineer + privacy/safety reviewer.
- [ ] Access-control decision tests passed for all initial roles and objects.
- [ ] Staging staff MFA proven and session revocation demonstrated.
- [ ] CSP, HTTPS, security and cache headers checked.
- [ ] Secrets scan includes repo, CI logs and built frontend artifacts.
- [ ] Unauthorized private-file retrieval tested and logged safely.
- [ ] No production receiving-account info, live person photos or identity evidence in staging.
- [ ] Database runtime cannot write schema; migration credential isn't in app runtime.
- [ ] Backup restore works on a clean disposable environment.
- [ ] All critical auth/storage defects resolved before Phase 3 handoff.

## 11. References

- OWASP ASVS: https://asvs.owasp.org/
- Next.js App Router authentication/authorization: https://nextjs.org/docs/app/guides/authentication
- Better Auth 2FA: https://better-auth.com/docs/plugins/2fa
- XORA source documents: `PRD.md` §privacy/safety; `TECH_STACK.md` §§7,13; `DATABASE_SCHEMA.md` §§8–10; `API_SPECIFICATION.md` §§2,8,12.
