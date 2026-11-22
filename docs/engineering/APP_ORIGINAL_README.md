# XORA Web — Phase 2 source implementation

**One brand. Two intentions: Date and Casual. One closed staging web app.**

This repository is the first implementation of XORA's Phase 2 engineering foundations. It does not operate an adult hookup marketplace, accept money, verify ages, or make live connections. It must remain closed until legal, privacy, identity, moderation and payment-provider gates are met.

## Running locally after dependencies are available

```bash
cp .env.example .env.local
# Configure only the isolated XORA Neon STAGING branch and an appropriately scoped runtime LOGIN role.
npm install
npm run typecheck
npm test
npm run verify:boundaries
npm run build
npm run dev
```

No valid database credentials are packaged. `XORA_AUTH_ENABLED`, `XORA_SIGNUP_ENABLED`, `XORA_PUBLIC_LAUNCH`, `XORA_MOMO_PAYMENTS`, and `XORA_TEST_ENDPOINTS` all default to `false`. `/api/health/live` doesn't require database credentials; `/api/health/ready` is private and requires a configured long monitor token.

For full status and blockers, read `docs/IMPLEMENTATION_STATUS.md` and `docs/SECURITY_AND_RELEASE_GATES.md`.

## Design and architecture

- Responsive landing page and development overview at `/` and `/staging`.
- Server-only Postgres pool, with exact staging host/database/project identity plus low-privilege username validation.
- Better Auth code behind an explicit disabled switch. Its database schema MUST be generated from the final installed package release and applied via a reviewed migration on staging.
- Canonical application account lookup keyed by authentication-user ID.
- Permission checks requiring active verified account + active staff membership + server-verified MFA + permission. The final proof-of-MFA integration is intentionally not yet enabled.
- Redacted staff audit lists behind deny-by-default policy.
- Staging-only synthetic idempotency and outbox API handlers, disabled unless flags and a long test token are explicitly configured.
- Test-only synthetic job processor with transactional database updates.

## Live Neon isolation

Project: `sweet-meadow-04731447` (`xora-platform`). Database: `xora`.

| Branch | Branch ID | Purpose |
|---|---|---|
| `main` | `br-young-hill-bgijo9jk` | Empty main foundation, no member accounts |
| `staging` | `br-proud-base-bgx1lcns` | Synthetic fixtures and integration testing |

The existing `xora_runtime` role cannot log in. The `xora_app_staging` role also cannot log in yet. Its constrained privileges were tested; creating login credentials safely is a distinct release gate. The source rejects database URLs not matching the specific XORA staging host/role.

## Verification

The dependency-free Node tests check the pure authorization/anti-fraud logic and do not require `npm install`:

```bash
npm test
npm run verify:boundaries
```

**Important limitation:** No CI-connected npm registry was available in the current environment. Do not treat the source as compiled or deployed until CI has installed the actual dependencies and run typecheck/build/security scans.

## Full-source protected staging deployment (22 November 2026)

XORA's Phase 2 source now passes a Next.js 16.4.6 production build/TypeScript check on Vercel and is deployed at:

https://xora-secure-staging-cjrzwn71o-kabuusumohammed182-7875s-projects.vercel.app

Vercel project: `xora-secure-staging` (`prj_CHJUd01GsHX6Nnq5B5mkPcz3ucL2`), deployment `dpl_H87VYYz1ErybkQPZUn158HHtQNU6`; project-level Vercel Authentication protects all deployments. Neon staging (`br-proud-base-bgx1lcns`) now has 20 tables and seven migrations. No real signup, authentication, messaging or payments are enabled. All 73 local policy unit tests pass. Vendor authentication runtime and real email/2FA tests still require completion. The repo does not contain actual database URLs, API secrets or payment instructions.

See `docs/LIVE_STAGING_AND_AUTH.md` for detailed verification and unresolved release gates. **Do not enable feature flags to activate auth/public launch until vendor schema and identity checks pass.**
