# XORA — Phase 2 Actual Execution Evidence

**Run date:** 2026-11-22. **Scope:** Neon project `sweet-meadow-04731447`, database `xora`. Connected database tool confirmed each result below.

## Completed actions

| Check | Evidence | Status |
|---|---|---|
| Project isolation | Created `xora-platform` as new project; existing project IDs `royal-flower-91615135`, `empty-mud-76816448`, `icy-lake-57952361` retained | PASS |
| Database setup | PostgreSQL 18 / Frankfurt, `xora` DB, `main` branch | PASS |
| Initial baseline schema | Atomic SQL transaction: 14 tables, 1 migration record, 5 roles, 10 permissions, 14 role mappings | PASS |
| Empty main | Query returned `accounts = 0` after migration | PASS |
| Staging clone | Branch `br-proud-base-bgx1lcns` created from XORA main, all 14 tables seen | PASS |
| Private buckets | Three buckets on each branch, all returned `access_level = private` | PASS |
| Synthetic staging fixtures | 2 dummy accounts, 1 dummy staff role grant, 1 audit row, 1 file metadata record, 1 background job | PASS |
| Idempotency duplicate simulation | Two identical inserts with `ON CONFLICT DO NOTHING` resulted in 1 persisted row | PASS — elementary uniqueness test only |
| Runtime least privilege | `xora_runtime` is NOLOGIN; can SELECT accounts, cannot DELETE accounts, INSERT role grants, or DELETE audit | PASS |
| Runtime migration | Migration `0002` committed independently on staging and main | PASS |

## Important tests NOT yet executed

- Proper concurrent, multi-process idempotency test (simple uniqueness check is not enough).
- Real authorization (`401`, `403` and staff MFA) because the application is not deployed.
- File upload and signed URL authorization. Buckets are empty.
- Staff approval workflow, user lifecycle, eligibility checks and profile privacy.
- Worker recovery, email sandbox, operational alerts and race-condition tests.
- Main/staging isolation from actual application secrets and deployed processes.
- Backup restore drill, penetration testing, founder security sign-off, production compliance.

**Phase 2 exit status: NOT APPROVED.** Only the listed infrastructure and database checks passed. No real accounts/payments accepted.

## Additional negative-path checks — staging only

| Attempt | Neon SQLSTATE | Result |
|---|---|---|
| Invalid account status (`admin`) | `23514` | Rejected by CHECK constraint |
| Duplicate actor+operation+idempotency key with altered payload | `23505` | Rejected by UNIQUE constraint |
| Duplicate active grant for same staff role | `23505` | Rejected by partial UNIQUE index |

## Final verification snapshot

- XORA `main`: **14 tables, 2 migration rows, 0 accounts, 0 staff grants, 0 jobs**.
- XORA `staging`: **2 migration rows, 2 synthetic accounts, 1 synthetic staff grant, 1 unique idempotency record**.
- `xora_runtime` on main: `rolcanlogin=false`.
- All three XORA private buckets verified on **both** branches; none configured `public_read`.
- These checks establish DB constraints and resource configuration only, **not** working end-user permissions, authentication, file uploads, real payment approval, worker execution or recovery compliance.
