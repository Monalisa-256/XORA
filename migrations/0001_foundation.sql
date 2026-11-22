-- XORA project only — Neon project sweet-meadow-04731447, database xora.
-- Baseline migration already applied to XORA main on 2026-11-22.
-- Do NOT rerun on existing branches. Use on a new blank XORA database only.
-- No Better Auth schema, users, credentials, payment orders, or live member data.
BEGIN;
CREATE TABLE app_schema_migrations (
  version text PRIMARY KEY,
  description text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending_email' CHECK(status IN ('pending_email','active','restricted','closed')),
  version integer NOT NULL DEFAULT 1 CHECK(version>0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE staff_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','revoked')),
  provisioned_by uuid REFERENCES accounts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  CHECK(status<>'revoked' OR revoked_at IS NOT NULL)
);
CREATE TABLE roles (
  code text PRIMARY KEY,
  description text NOT NULL,
  enabled boolean NOT NULL DEFAULT true
);
CREATE TABLE permissions (
  code text PRIMARY KEY,
  description text NOT NULL
);
CREATE TABLE role_permissions (
  role_code text NOT NULL REFERENCES roles(code) ON DELETE RESTRICT,
  permission_code text NOT NULL REFERENCES permissions(code) ON DELETE RESTRICT,
  PRIMARY KEY(role_code,permission_code)
);
CREATE TABLE staff_role_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_membership_id uuid NOT NULL REFERENCES staff_memberships(id) ON DELETE RESTRICT,
  role_code text NOT NULL REFERENCES roles(code) ON DELETE RESTRICT,
  granted_by uuid REFERENCES accounts(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  CHECK(revoked_at IS NULL OR revoked_at>=granted_at)
);
CREATE UNIQUE INDEX staff_role_grants_one_active
  ON staff_role_grants(staff_membership_id,role_code) WHERE revoked_at IS NULL;
CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  outcome text NOT NULL CHECK(outcome IN ('allowed','denied','error')),
  reason_code text,
  request_id text NOT NULL CHECK(length(request_id) BETWEEN 1 AND 128),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_events_created_at ON audit_events(created_at DESC);
CREATE INDEX audit_events_actor_time ON audit_events(actor_id,created_at DESC);
CREATE TABLE idempotency_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_scope text NOT NULL,
  operation text NOT NULL,
  key_hash text NOT NULL CHECK(key_hash ~ '^[0-9a-f]{64}$'),
  payload_hash text NOT NULL CHECK(payload_hash ~ '^[0-9a-f]{64}$'),
  status text NOT NULL DEFAULT 'reserved' CHECK(status IN ('reserved','committed','failed')),
  result_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE(actor_scope,operation,key_hash),
  CHECK(expires_at>created_at)
);
CREATE INDEX idempotency_expires_idx ON idempotency_records(expires_at);
CREATE TABLE file_objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  purpose text NOT NULL CHECK(purpose IN ('synthetic_test','profile_photo','verification_evidence','payment_proof','support_attachment')),
  object_key text NOT NULL UNIQUE,
  state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','confirmed','quarantined','deleted')),
  content_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK(size_bytes>=0),
  checksum_sha256 text CHECK(checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);
CREATE INDEX file_objects_owner_idx ON file_objects(owner_id,created_at DESC);
CREATE TABLE file_access_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid NOT NULL REFERENCES file_objects(id) ON DELETE RESTRICT,
  actor_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  purpose text NOT NULL,
  outcome text NOT NULL CHECK(outcome IN ('allowed','denied','error')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX file_access_events_file_time ON file_access_events(file_id,created_at DESC);
CREATE TABLE outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  dedupe_key text UNIQUE,
  payload_version smallint NOT NULL DEFAULT 1 CHECK(payload_version>0),
  payload_ref text,
  state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','dispatched','failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX outbox_events_state_created ON outbox_events(state,created_at);
CREATE TABLE background_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES outbox_events(id) ON DELETE RESTRICT,
  state text NOT NULL DEFAULT 'queued' CHECK(state IN ('queued','leased','done','dead')),
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  lease_until timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0),
  max_attempts integer NOT NULL DEFAULT 5 CHECK(max_attempts>0),
  last_error_class text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK(attempts<=max_attempts)
);
CREATE INDEX background_jobs_due ON background_jobs(state,scheduled_at,lease_until);
CREATE TABLE job_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES background_jobs(id) ON DELETE RESTRICT,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  outcome text CHECK(outcome IN ('success','retry','dead')),
  error_class text,
  CHECK(finished_at IS NULL OR finished_at>=started_at)
);
CREATE INDEX job_attempts_job_time ON job_attempts(job_id,started_at DESC);
INSERT INTO roles(code,description) VALUES
 ('owner','Owner and security administrator'),
 ('support','Customer support'),
 ('finance_reviewer','Financial claim reviewer'),
 ('finance_approver','Finance approval with independent settlement checks'),
 ('safety_reviewer','Safety moderation');
INSERT INTO permissions(code,description) VALUES
 ('staff.dashboard.read','Read redacted admin summary'),
 ('staff.accounts.review','Review account safety'),
 ('staff.finances.review','Review payment claims'),
 ('staff.finances.approve','Approve verified financial decisions'),
 ('staff.audit.read','Read redacted audit'),
 ('staff.roles.manage','Manage staff role grants with dual control'),
 ('staff.support.manage','Review support cases'),
 ('staff.safety.manage','Manage safety cases'),
 ('private_file.read_owned','Read authorized owned files'),
 ('verification_evidence.read_case','Read case-scoped evidence');
INSERT INTO role_permissions(role_code,permission_code) VALUES
 ('owner','staff.dashboard.read'),('owner','staff.audit.read'),('owner','staff.roles.manage'),
 ('support','staff.dashboard.read'),('support','staff.support.manage'),
 ('finance_reviewer','staff.dashboard.read'),('finance_reviewer','staff.finances.review'),
 ('finance_approver','staff.dashboard.read'),('finance_approver','staff.finances.review'),('finance_approver','staff.finances.approve'),
 ('safety_reviewer','staff.dashboard.read'),('safety_reviewer','staff.accounts.review'),('safety_reviewer','staff.safety.manage'),('safety_reviewer','verification_evidence.read_case');
INSERT INTO app_schema_migrations(version,description)
 VALUES ('0001','Phase 2 foundational entities and permissions');
COMMIT;
