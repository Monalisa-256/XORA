# XORA — Web application and validated repository

**Single repository root**: this archive contains the XORA Next.js app at the root (not inside `XORA_APP/`). No nested ZIPs, repeated files, dependency output, generated logs or secrets are included.

> Status: closed staging engineering build, not a live marketplace. Public signup, payments, user matching and member onboarding are disabled pending compliance, age-verification, staff security and provider approval. Nothing here should be interpreted as payment-provider authorization.

## Layout

- `src/` — Next.js web routes, core policies, services
- `migrations/` — XORA-only PostgreSQL migrations (never auto-run by archive workflow)
- `scripts/zip_guard.py` — safely discovers, unpacks, normalizes and updates any named ZIP
- `scripts/verify_repo.py` — verifies ZIP contents, manifests, checksums and project structure
- `scripts/check-boundaries.mjs` — application security boundary check
- `tests/` — Python extractor tests and Node.js application security tests
- `.github/workflows/zip-extract-validate-update.yml` — repository ZIP validation CI
- `docs/` — PRD, architecture, API, data model, tech stack, phases, implementation records
- `design/phase1/` — UI visual references and static interactive prototype

## Validate without app dependencies

```bash
python3 -m unittest discover -s tests -p 'test_zip_guard.py' -v
node --experimental-strip-types --test tests/*.test.mjs
node scripts/check-boundaries.mjs
python3 scripts/zip_guard.py --repo . --source-root . --strict-repo-sync --output-dir dist/normalized --report-dir dist/reports --extract-dir dist/extracted
python3 scripts/verify_repo.py --archive-dir dist/normalized --report dist/reports/verification.json --require-root-layout --no-duplicate-content
```

When `npm` dependencies are installed in an appropriately isolated environment, run `npm test`, `npm run verify:boundaries`, `npm run typecheck`, `npm run build` before deployment. This package does **not** contain a verified npm lockfile; establish one using a trusted install/review process before using `npm ci` in CI.

## Any ZIP filename

The workflow auto-discovers `.zip` and `.ZIP` of arbitrary names including spaces. Or invoke:

```bash
python3 scripts/zip_guard.py --repo . --archive 'some-folder/anything (v3).ZIP' --source-root . --strict-repo-sync
```

The ZIP guard verifies input safety before synchronizing files from the checkout. For same-project ZIPs, prefer the checked-out repository source as authoritative so stale archive contents do not replace current files. It never runs code contained in untrusted ZIPs.

## Privacy and isolation

Do not commit `.env.local` or database credentials. This repo references only XORA Neon resources; do not direct its migrations at other projects. See `docs/phase2-implementation/` for the current limitations and evidence.
