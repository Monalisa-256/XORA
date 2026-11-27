# XORA | Production infrastructure foundation

The application source lives at the repository root. This delivery updates infrastructure safeguards and the source import pipeline, not the product launch. Production hosting does not imply that public signup, payments or other member features are approved. All existing launch gates remain closed.

## Production targets

| Component | Target |
| --- | --- |
| GitHub | `Monalisa-256/XORA`, `main` |
| Render | `xora-production`, Frankfurt, service `srv-dc1fh74s728c73ca7sng` |
| Vercel | `xora-production`, project `prj_CHJUd01GsHX6Nnq5B5mkPcz3ucL2` |
| Neon | `xora-platform`, project `sweet-meadow-04731447`, protected branch `main` (`br-young-hill-bgijo9jk`) |

Read [the production runbook](docs/engineering/PRODUCTION_RUNBOOK.md) before applying changes. Earlier design and engineering documents are historical records; their staging instructions do not supersede the production runbook.

## Repository import

Install the separately supplied `zip-extract-validate-update.yml` at `.github/workflows/zip-extract-validate-update.yml`. Upload the new source ZIP at the root of `main`. Prefer a single commit containing both. The workflow detects ZIPs irrespective of filename, validates imported source and builds without production credentials, then commits the validated source and removes processed archives in a separate write job. The source ZIP deliberately omits the workflow, which is supplied independently. For a standalone checkout, copy the workflow into the path above.

The import is an overlay, not an unrestricted directory mirror. Existing source outside the archive is preserved unless explicitly removed by the narrow generated-artifact cleanup. Do not upload arbitrary unreviewed source or secrets. Never run migrations as an archive-import side effect.

## Local validation

```sh
python3 -m unittest discover -s tests -p 'test_*.py' -v
npm test
npm run verify:boundaries
npm install --include=dev
npm run verify:syntax
npm run build
npm run typecheck
```

No verified npm lockfile was supplied in the original repository. Generate and review one with a trusted network-enabled npm install; commit it before switching exclusively to `npm ci`. Do not confuse syntax checks with a full build or dependency audit.

The health endpoint `/api/health/live` is intentionally shallow. `/api/health/ready` requires the existing server-side monitor token and checks the expected database and role. `npm run verify:production` requires that token in the environment (and authorized Vercel access if protection is active); it exits unsuccessfully if readiness cannot be verified. Do not share tokens or turn off deployment protection merely to obtain a green check.

## Production connectivity

See [Production topology and release verification](docs/engineering/PRODUCTION_TOPOLOGY.md) for the authenticated Vercel-to-Render check and release gates.
