# Repository structure and de-duplication audit

This is a **single-level Git repository ZIP**. Root `package.json` is the application. Documentation lives under `docs/` and design examples under `design/`. The ZIP does not contain archives inside archives or a duplicate application folder.

- The latest available `/mnt/data/XORA_APP/` files were used as authoritative app source.
- Workflow extractor/validator and their Python tests are included directly in the repo.
- Repeated identical files are dropped (the first canonical copy wins); conflicting path contents fail assembly.
- Project-specific application source directories such as `src/`, `tests/`, and `.github/` are intentionally preserved.
- No database credentials are included and no existing Neon/Vercel project is modified by this bundle.

Known limitations: directory layout and checksum tests are not substitutes for a full dependency-installed build, security test, live login verification, or real-device tests.
