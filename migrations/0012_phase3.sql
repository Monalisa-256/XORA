-- XORA production main only; additive, no member records or activation.
BEGIN;
DO $$ BEGIN IF current_database() <> 'xora' OR current_user <> 'xora_owner' OR NOT EXISTS (SELECT 1 FROM app_schema_migrations WHERE version='0011') THEN RAISE EXCEPTION 'Wrong target or prerequisite missing'; END IF; END $$;
CREATE TABLE registration_agreements (
 auth_user_id text PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE, terms_version text NOT NULL, privacy_version text NOT NULL,
 marketing boolean NOT NULL DEFAULT false, accepted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT,INSERT ON registration_agreements TO xora_runtime;
CREATE TABLE member_consents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES accounts(id), terms_version text NOT NULL, privacy_version text NOT NULL,
 adult_acknowledged boolean NOT NULL CHECK(adult_acknowledged), marketing boolean NOT NULL DEFAULT false, accepted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX member_consents_latest ON member_consents(account_id,accepted_at DESC,id DESC);
CREATE TABLE profiles (
 account_id uuid PRIMARY KEY REFERENCES accounts(id), display_name text NOT NULL DEFAULT '' CHECK(char_length(display_name)<=40),
 city text NOT NULL DEFAULT '', intent text NOT NULL DEFAULT 'date' CHECK(intent IN ('date','casual','both')),
 bio text NOT NULL DEFAULT '' CHECK(char_length(bio)<=500), interests text[] NOT NULL DEFAULT '{}' CHECK(cardinality(interests)<=5),
 show_intent boolean NOT NULL DEFAULT false, show_area boolean NOT NULL DEFAULT false, show_activity boolean NOT NULL DEFAULT false,
 profile_status text NOT NULL DEFAULT 'draft' CHECK(profile_status IN ('draft','review','changes_requested','approved','active','paused','restricted','rejected')),
 record_version integer NOT NULL DEFAULT 1 CHECK(record_version>0), reason_code text, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE discovery_preferences (account_id uuid PRIMARY KEY REFERENCES accounts(id), preference text NOT NULL DEFAULT 'not_set' CHECK(preference IN ('not_set','women','men','everyone')));
CREATE TABLE verification_cases (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES accounts(id),
 check_kind text NOT NULL DEFAULT 'adult_eligibility' CHECK(check_kind IN ('adult_eligibility','identity')),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','uncertain','underage','rejected')),
 method text NOT NULL CHECK(method IN ('approved_provider','in_person_check')),
 assigned_to uuid REFERENCES accounts(id), reviewed_by uuid REFERENCES accounts(id), reviewed_at timestamptz,
 valid_until timestamptz, evidence_ref uuid, reason_code text, record_version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(), CHECK(status<>'approved' OR (reviewed_by IS NOT NULL AND evidence_ref IS NOT NULL AND valid_until IS NOT NULL AND reviewed_at IS NOT NULL AND valid_until>reviewed_at))
);
CREATE UNIQUE INDEX verification_one_pending ON verification_cases(account_id,check_kind) WHERE status='pending';
CREATE INDEX verification_cases_latest ON verification_cases(account_id,check_kind,created_at DESC,id DESC);
CREATE TABLE profile_reviews (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES profiles(account_id),
 reviewed_profile_version integer NOT NULL, status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','changes_requested','rejected')),
 assigned_to uuid REFERENCES accounts(id), reviewed_by uuid REFERENCES accounts(id), reviewed_at timestamptz, reason_code text, record_version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX profile_one_pending ON profile_reviews(account_id) WHERE status='pending';
CREATE TABLE profile_media (
 id uuid PRIMARY KEY, account_id uuid NOT NULL REFERENCES profiles(account_id), storage_key text NOT NULL UNIQUE,
 content_type text NOT NULL CHECK(content_type='image/webp'), size_bytes integer NOT NULL CHECK(size_bytes BETWEEN 1 AND 1048576),
 sha256 text NOT NULL CHECK(sha256 ~ '^[0-9a-f]{64}$'), review_status text NOT NULL DEFAULT 'pending' CHECK(review_status IN ('pending','approved','rejected')),
 created_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, purged_at timestamptz, reviewed_by uuid REFERENCES accounts(id), CHECK(purged_at IS NULL OR deleted_at IS NOT NULL)
);
CREATE INDEX profile_media_owner ON profile_media(account_id,created_at) WHERE deleted_at IS NULL;
CREATE TABLE privacy_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES accounts(id),
 request_type text NOT NULL CHECK(request_type IN ('export','deletion','correction','appeal','support')),
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','in_review','resolved','rejected')),
 requested_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz
);
CREATE UNIQUE INDEX privacy_one_open ON privacy_requests(account_id,request_type) WHERE status IN ('pending','in_review');
CREATE INDEX verification_queue ON verification_cases(status,created_at);
CREATE INDEX profile_review_queue ON profile_reviews(status,created_at);
-- No discovery view or invitation tables in Phase 3.
INSERT INTO permissions(code,description) VALUES ('phase3.eligibility.review','Review assigned adult eligibility outcome'),('phase3.profile.review','Review assigned profile and transformed photos') ON CONFLICT DO NOTHING;
INSERT INTO role_permissions(role_code,permission_code) VALUES ('safety_reviewer','phase3.eligibility.review'),('safety_reviewer','phase3.profile.review') ON CONFLICT DO NOTHING;
GRANT SELECT,INSERT ON member_consents TO xora_runtime;
GRANT SELECT,INSERT,UPDATE ON profiles,discovery_preferences,verification_cases,profile_reviews,profile_media,privacy_requests TO xora_runtime;
INSERT INTO app_schema_migrations(version,description) VALUES ('0012','Phase 3 private member onboarding, independent reviews and privacy tickets');
COMMIT;
