-- Phase 16.B · L54 · S23 — Pilot tenant_id + RLS su 6 tabelle
--
-- Closes (partial) audit issue #1 (CRITICAL) — defense-in-depth gap.
-- Tabelle scelte come pilot per low-risk, high-sensitivity:
--
--   PARENT                       CHILDREN                         ROWS
--   whistleblowing_reports.te    whistleblowing_messages          16
--                                whistleblowing_attachments       7
--                                whistleblowing_audit_log         20
--   mentorships.tenant_id        mentorship_sessions              355
--   surveys.tenant_id            survey_questions                 31
--                                survey_responses                 4482
--
-- Total ~4900 rows. Backfill safe in single TX.
-- Out-of-scope S23: 24 tabelle restanti (employee 13 · learning 6 ·
-- recruiting 3 · talent 6) → S24 batch migrations.
--
-- Idempotente: re-run no-op (IF NOT EXISTS guards).

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 1) whistleblowing_messages — backfill via report_id
-- ============================================================
ALTER TABLE whistleblowing_messages ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE whistleblowing_messages wm
SET tenant_id = wr.tenant_id
FROM whistleblowing_reports wr
WHERE wm.report_id = wr.id
  AND wm.tenant_id IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='whistleblowing_messages' AND column_name='tenant_id' AND is_nullable='NO') THEN
    ALTER TABLE whistleblowing_messages ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE whistleblowing_messages
  DROP CONSTRAINT IF EXISTS fk_whistleblowing_messages_tenant,
  ADD CONSTRAINT fk_whistleblowing_messages_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_whistleblowing_messages_tenant ON whistleblowing_messages(tenant_id);
ALTER TABLE whistleblowing_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whistleblowing_messages FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_whistleblowing_messages ON whistleblowing_messages;
CREATE POLICY tenant_isolation_whistleblowing_messages ON whistleblowing_messages
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 2) whistleblowing_attachments — backfill via report_id
-- ============================================================
ALTER TABLE whistleblowing_attachments ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE whistleblowing_attachments wa
SET tenant_id = wr.tenant_id
FROM whistleblowing_reports wr
WHERE wa.report_id = wr.id
  AND wa.tenant_id IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='whistleblowing_attachments' AND column_name='tenant_id' AND is_nullable='NO') THEN
    ALTER TABLE whistleblowing_attachments ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE whistleblowing_attachments
  DROP CONSTRAINT IF EXISTS fk_whistleblowing_attachments_tenant,
  ADD CONSTRAINT fk_whistleblowing_attachments_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_whistleblowing_attachments_tenant ON whistleblowing_attachments(tenant_id);
ALTER TABLE whistleblowing_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE whistleblowing_attachments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_whistleblowing_attachments ON whistleblowing_attachments;
CREATE POLICY tenant_isolation_whistleblowing_attachments ON whistleblowing_attachments
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 3) whistleblowing_audit_log — backfill via report_id
-- ============================================================
ALTER TABLE whistleblowing_audit_log ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE whistleblowing_audit_log wal
SET tenant_id = wr.tenant_id
FROM whistleblowing_reports wr
WHERE wal.report_id = wr.id
  AND wal.tenant_id IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='whistleblowing_audit_log' AND column_name='tenant_id' AND is_nullable='NO') THEN
    ALTER TABLE whistleblowing_audit_log ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE whistleblowing_audit_log
  DROP CONSTRAINT IF EXISTS fk_whistleblowing_audit_log_tenant,
  ADD CONSTRAINT fk_whistleblowing_audit_log_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_whistleblowing_audit_log_tenant ON whistleblowing_audit_log(tenant_id);
ALTER TABLE whistleblowing_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE whistleblowing_audit_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_whistleblowing_audit_log ON whistleblowing_audit_log;
CREATE POLICY tenant_isolation_whistleblowing_audit_log ON whistleblowing_audit_log
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 4) mentorship_sessions — backfill via mentorship_id
-- ============================================================
ALTER TABLE mentorship_sessions ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE mentorship_sessions ms
SET tenant_id = m.tenant_id
FROM mentorships m
WHERE ms.mentorship_id = m.id
  AND ms.tenant_id IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='mentorship_sessions' AND column_name='tenant_id' AND is_nullable='NO') THEN
    ALTER TABLE mentorship_sessions ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE mentorship_sessions
  DROP CONSTRAINT IF EXISTS fk_mentorship_sessions_tenant,
  ADD CONSTRAINT fk_mentorship_sessions_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_tenant ON mentorship_sessions(tenant_id);
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_mentorship_sessions ON mentorship_sessions;
CREATE POLICY tenant_isolation_mentorship_sessions ON mentorship_sessions
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 5) survey_questions — backfill via survey_id
-- ============================================================
ALTER TABLE survey_questions ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE survey_questions sq
SET tenant_id = s.tenant_id
FROM surveys s
WHERE sq.survey_id = s.id
  AND sq.tenant_id IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='survey_questions' AND column_name='tenant_id' AND is_nullable='NO') THEN
    ALTER TABLE survey_questions ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE survey_questions
  DROP CONSTRAINT IF EXISTS fk_survey_questions_tenant,
  ADD CONSTRAINT fk_survey_questions_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_survey_questions_tenant ON survey_questions(tenant_id);
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_survey_questions ON survey_questions;
CREATE POLICY tenant_isolation_survey_questions ON survey_questions
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 6) survey_responses — backfill via survey_id
-- ============================================================
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE survey_responses sr
SET tenant_id = s.tenant_id
FROM surveys s
WHERE sr.survey_id = s.id
  AND sr.tenant_id IS NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='survey_responses' AND column_name='tenant_id' AND is_nullable='NO') THEN
    ALTER TABLE survey_responses ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE survey_responses
  DROP CONSTRAINT IF EXISTS fk_survey_responses_tenant,
  ADD CONSTRAINT fk_survey_responses_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_survey_responses_tenant ON survey_responses(tenant_id);
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_survey_responses ON survey_responses;
CREATE POLICY tenant_isolation_survey_responses ON survey_responses
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 7) Verification asserts pre-COMMIT
-- ============================================================
DO $$
DECLARE
  unprotected_tables text;
  null_count int;
  rls_count int;
BEGIN
  -- Assert 1: 6/6 tables have tenant_id NOT NULL
  SELECT string_agg(table_name, ',') INTO unprotected_tables
  FROM information_schema.columns
  WHERE table_name IN (
    'whistleblowing_messages','whistleblowing_attachments','whistleblowing_audit_log',
    'mentorship_sessions','survey_questions','survey_responses'
  )
  AND column_name = 'tenant_id'
  AND is_nullable = 'YES';
  IF unprotected_tables IS NOT NULL THEN
    RAISE EXCEPTION 'phase16b assert FAIL: tables with NULLABLE tenant_id: %', unprotected_tables;
  END IF;

  -- Assert 2: zero rows with NULL tenant_id (would have failed SET NOT NULL anyway, defensive)
  SELECT
    (SELECT count(*) FROM whistleblowing_messages WHERE tenant_id IS NULL)
    + (SELECT count(*) FROM whistleblowing_attachments WHERE tenant_id IS NULL)
    + (SELECT count(*) FROM whistleblowing_audit_log WHERE tenant_id IS NULL)
    + (SELECT count(*) FROM mentorship_sessions WHERE tenant_id IS NULL)
    + (SELECT count(*) FROM survey_questions WHERE tenant_id IS NULL)
    + (SELECT count(*) FROM survey_responses WHERE tenant_id IS NULL)
  INTO null_count;
  IF null_count <> 0 THEN
    RAISE EXCEPTION 'phase16b assert FAIL: % rows with NULL tenant_id', null_count;
  END IF;

  -- Assert 3: 6/6 RLS policies created
  SELECT count(*) INTO rls_count
  FROM pg_policies
  WHERE policyname IN (
    'tenant_isolation_whistleblowing_messages','tenant_isolation_whistleblowing_attachments',
    'tenant_isolation_whistleblowing_audit_log','tenant_isolation_mentorship_sessions',
    'tenant_isolation_survey_questions','tenant_isolation_survey_responses'
  );
  IF rls_count <> 6 THEN
    RAISE EXCEPTION 'phase16b assert FAIL: only %/6 RLS policies created', rls_count;
  END IF;

  RAISE NOTICE 'phase16b OK: 6/6 tables tenant_id NOT NULL · 0 NULL rows · 6 RLS policies active';
END $$;

COMMIT;
