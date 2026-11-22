# XORA — Safe Neon Connection Setup (for the developer)

1. Open [XORA Neon project](https://console.neon.tech/app/projects/sweet-meadow-04731447), verify project name `xora-platform` and ID `sweet-meadow-04731447`.
2. Select **staging**, not `main`, for ongoing app development. Database name: `xora`.
3. Use the Neon console to create a dedicated login/credential for the application with only the approved `xora_runtime` grants. Its current NOLOGIN role does not itself accept connections. Do not use the project owner for runtime.
4. Store the resulting server-only connection string in approved deployment secret storage or a local untracked `.env.local` file. Use TLS (`sslmode=require`) and a separate, strictly controlled migration credential.
5. Never copy a database password, signed storage URL or storage access key into source files, Git history, screenshots, client JavaScript, documentation or chat.
6. Verify permissions with read-only SQL, including `has_table_privilege('xora_runtime','accounts','DELETE') = false` and `has_table_privilege('xora_runtime','staff_role_grants','INSERT') = false`.
7. Protect the `main` branch and configure review/approval gates. Assess longer recovery retention and regularly rehearsed backups for production.
8. Set no production web app until identity, privacy, safety, deployment, security, restore, and payment compliance gates pass.

**NOTE:** This guide does not create a credential or deploy a server. Current configured resources are empty foundation storage, schema and isolated test fixtures.
