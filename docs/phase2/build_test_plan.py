from pathlib import Path
sections=[
('A. Repository, environment and release',[
('T01','P0','Clean install','Fresh checkout/locked install yields same dependency tree and build','P2-003,008,009'),
('T02','P0','Secrets absent','Scan sources, Git history, build assets and CI output; no private credentials','P2-007,045'),
('T03','P0','Staging isolation','Staging app connects only staging DB/bucket/email; cannot contact production','P2-015,044'),
('T04','P0','Production closed','Production placeholder rejects public account and finance actions','P2-046'),
('T05','P0','Untrusted PR isolation','CI from external PR cannot read privileged environment secrets','P2-045'),
('T06','P0','Migration review','Unexpected DROP/ALTER on protected table stops PR/deployment','P2-018,047'),
('T07','P0','Migration replay','Blank→latest and previous→latest both work; second apply idempotent','P2-020'),
('T08','P0','Runtime DB least privilege','App role cannot create/drop tables or assume migration role','P2-021'),
('T09','P0','Backup restore','Backup restored into clean DB; IDs/constraints/checksums and runtime queries pass','P2-048'),
('T10','P1','Deploy rollback','Previous app revision re-deployed safely against compatible schema','P2-047'),
]),
('B. Authentication, account and staff authorization',[
('T11','P0','Anonymous /me denied','No cookie/invalid session returns 401 and no private fields','P2-022,031'),
('T12','P0','Verified email flow','Unverified user cannot start required verified session; valid token activates','P2-022'),
('T13','P0','One-time verify token','Expired/used verification token cannot be replayed','P2-022'),
('T14','P0','Logout and revocation','Logged-out/revoked cookie fails on next protected API call','P2-023'),
('T15','P0','Restricted account gate','Restricted account cannot read protected resources after state change','P2-027'),
('T16','P0','Member cannot self-elevate','Role field injection in signup/update rejected; admin still 403','P2-024,026'),
('T17','P0','Member blocked admin','Member /admin and admin endpoint denied even with direct URL','P2-026,031'),
('T18','P0','Staff MFA required','Staff session without second factor cannot use any staff API','P2-025,026'),
('T19','P0','Revoked staff grant','Remove staff grant while session active; next admin request denied','P2-024,027'),
('T20','P0','Finance/safety separation','Finance cannot review evidence; support cannot change roles; safety cannot approve finance','P2-026'),
('T21','P0','Same-origin mutation guard','Cross-site cookie POST and invalid origin rejected','P2-028'),
('T22','P0','Auth abuse throttling','Rapid login/reset/verification attempts throttled with safe response','P2-028'),
('T23','P1','Password recovery enumeration','Known and unknown email reset requests have nonenumerating public responses','P2-022'),
('T24','P0','No age conflation','Verified email does not turn on adult eligibility or profile discovery','P2-031'),
]),
('C. API, business correctness and storage',[
('T25','P0','Safe errors','Invalid inputs return stable problem codes, request ID and no stack data','P2-029,030'),
('T26','P0','Typed input validation','Unexpected fields, overlong strings and malicious payloads rejected','P2-030'),
('T27','P0','Same-key concurrency','Two concurrent same-key requests produce one DB side effect and one stored result','P2-032,033'),
('T28','P0','Changed-payload conflict','Same actor/operation/key, different body hash → 409 and no second write','P2-032'),
('T29','P0','Cross-actor key isolation','Member A key cannot access/replay B result; B scoped separately','P2-032'),
('T30','P0','Crash before commit','Aborted transaction persists neither domain row nor completed idempotency row','P2-032'),
('T31','P0','Crash after commit','Client retry returns original outcome without duplicate domain write','P2-032'),
('T32','P0','Anon file denial','Private file inaccessible with bare URL or no session','P2-034,036'),
('T33','P0','Other user denial','A cannot retrieve B synthetic file via changed ID or copied URL request','P2-036'),
('T34','P0','Expired temporary link','Object read/upload capability expires and cannot be reused','P2-035,036'),
('T35','P0','File type and size','Oversized file, SVG/HTML/script-like mime, unsupported types rejected','P2-037'),
('T36','P0','No public file index','Search/public asset paths reveal no demo/private file','P2-034,036'),
('T37','P0','Sensitive URL redaction','Signed file URLs, raw object keys and email tokens absent from logs','P2-036,042'),
]),
('D. Background delivery, telemetry and recovery',[
('T38','P0','Outbox atomic commit','Rollback state write rolls back corresponding event; commit writes both','P2-038'),
('T39','P0','Worker exclusive lease','Two concurrent worker processes do not execute one live job in same lease','P2-039'),
('T40','P0','Worker crash recovery','Expired lease makes job eligible again, no permanent invisible loss','P2-039'),
('T41','P0','Email delivery failure','Test sender fails; job retries with backoff, bounded max attempts','P2-040,041'),
('T42','P0','Dead-letter surfaced','Poison event becomes visible failed job with operator alert and reason class','P2-041,043'),
('T43','P0','Discreet generic email','Test email contains no profile intent, payment detail or partner ID','P2-040'),
('T44','P0','Redacted structured log','Request ID/status/timing present; no password/token/receipt/ID/raw preference','P2-042'),
('T45','P0','Readiness and alerts','Synthetic DB/worker outage triggers designated test alert','P2-043'),
('T46','P0','Staff incident kill switch','Revoke compromised dummy staff access and confirm immediate API denial','P2-049'),
]),
('E. UX, launch gates and founder oversight',[
('T47','P1','Responsive shell','320/360/390/768/1024/1440 widths show no critical overflow','P2-010,050'),
('T48','P1','Keyboard and focus','Navigate all proof screens without mouse, visible focus, correct dialogs','P2-012,050'),
('T49','P1','Error and offline states','Friendly recovery messages, no false success or fake paid status','P2-012'),
('T50','P0','No real finance capability','No actual order acceptance, payee number, receipt approval or money grant in Phase2','P2-046'),
('T51','P0','Operations summary','Named founder can see safe health overview without DB credentials','P2-052'),
('T52','P0','Gate packet signed','Reviewers sign tests/risks; no false claim Phase 0/1 complete','P2-053'),
])]
head='''# XORA — Phase 2 Acceptance, QA and Test Design

**Version 1.0 — 52 defined test cases, none executed by this document.** Test IDs are future evidence references. Phase 2 remains **DESIGNED** until the actual repository, staging deployment, real test runs and human approvals exist.

## Testing philosophy

- Prefer genuine **disposable PostgreSQL** for idempotency, authorization and outbox integration; mocks cannot prove database race safety.
- Use fabricated adults and payment screenshots only; staging must not send real money, real email to arbitrary users or accept actual identity evidence.
- Every test records commit SHA, environment, UTC time, command, expected and observed result, sanitized output, reviewer and known risks.
- P0 failures block Phase 2 exit even if all visual screens look good. P1 tests are required for a full formal handoff; phase planning can continue only with documented restrictions.
- Include negative-path, concurrent and failure/recovery tests rather than only happy-path clicks.
- Automated and human accessibility testing complement each other; neither is substituted by a design document.

## Test execution layers

| Layer | Tool or approach | Ownership |
|---|---|---|
| Static/type | TypeScript, lint, format, dependency/secret scan | Engineering/CI |
| Unit | Vitest | Engineering |
| Integration | Real disposable PostgreSQL; private storage test adapter | Backend/QA |
| Contract | HTTP route tests with auth/session contexts | QA/backend |
| End-to-end | Playwright against access-gated staging | QA/frontend |
| Security | OWASP ASVS-inspired auth/object-level tests, file and CSRF probes | Security/QA |
| Recovery | Backup restore and worker crash drills | Ops/engineering |
| Human review | Founder staff UX check, security sign-off and real browser/phone accessibility | Founder/UX/security |

'''
parts=[head]
for title,rows in sections:
 parts.append(f'## {title}\n\n| Test | Priority | Scenario | Required result | Ticket link |\n|---|---|---|---|---|\n')
 for t in rows:
  parts.append('| '+' | '.join(t)+' |\n')
 parts.append('\n')
parts.append('''## Minimum smoke suite before and after every staging deployment

1. HTTPS public holding page displays only non-sensitive copy.
2. Anonymous `/api/v1/me` is denied; signed-in synthetic user gets own safe response.
3. Ordinary member cannot access `/admin` or staff API.
4. Staff requires MFA and correct permission to view redacted staff health.
5. Readiness fails safely if database unavailable; no stack traces sent to browser.
6. Private test file is accessible to owner only; unauthorized URL denied.
7. Worker can process generic test notification in sandbox; retry is observable.
8. Staging cannot show a real payee or grant a paid entitlement.

## Release/exit evidence sheet

| Field | Record when implemented |
|---|---|
| Source commit SHA / tag | Pending |
| Node/Next/Auth/Drizzle/Postgres versions | Pending compatibility spike |
| Environment and deploy URL (restricted) | Pending |
| CI run link, dependency scan and build hash | Pending |
| DB migration IDs/checksum and restore test | Pending |
| Tests T01–T52 pass/fail with evidence links | Not executed |
| High/critical vulnerabilities outstanding | Unknown; assess on code review |
| Staff MFA and permission check approval | Pending |
| Privacy and legal/vendor scope approval | Phase 0 pending unless separately documented |
| Founder/product signoff | Pending |
| Security/engineering signoff | Pending |
| Gate state | DESIGNED |

### Exit decision rubric

**PASS:** All P0 and agreed P1 tests supported by actual evidence, security+engineering review, staging isolation and restore demonstrated; Phase 0/1 conditions explicitly addressed.  
**PASS WITH RESTRICTIONS:** Technical staging foundation validated but external feasibility/founder gates unresolved; no real members or payments.  
**BLOCK:** Any unauthorized staff/member access, public private file, unverified staff MFA, unrepeatable migration, unsound idempotency or untested restore.  
**NOT STARTED/DESIGNED:** Documented tests but no deployed code—**current status**.

## Future phases deliberately not tested here

Real age checks, matchmaking/consent, one-free-introduction consumption, real inbox threads, settlement matching, refund policy, renewal date arithmetic and VIP ranking belong to Phases 3–7, with final end-to-end validation in Phase 8. Phase 2 proves the reusable technical controls but does not falsely certify those later business features.
''')
p=Path('/mnt/data/XORA_PHASE2/PHASE2_ACCEPTANCE_TEST_PLAN.md')
p.write_text(''.join(parts),encoding='utf-8')
print(sum(len(rows) for _,rows in sections),len(p.read_text().split()))
