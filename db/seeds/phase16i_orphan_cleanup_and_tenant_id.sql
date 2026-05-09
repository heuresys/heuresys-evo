-- Phase 16.I · L57 · S23-quater — Orphan cleanup + tenant_id su 3 tables residue
--
-- Closes #1 residue (interviews/interview_feedback/feedback_responses).
-- 12 orphan rows totali (FK a parent inesistente, pre-existing dirty data):
--   - interviews: 8/128 con application_id senza match in applications
--   - feedback_responses: 4/4 con request_id senza match in feedback_requests
--
-- Strategia: HARD DELETE orphan + apply tenant_id+RLS standard.
-- Razionale: dati orfani non sono recuperabili (parent inesistente),
-- non hanno tenant context determinabile, occupano spazio + bias query.
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 1) DELETE orphan rows pre-existing dirty data
-- ============================================================
DELETE FROM interviews i
WHERE NOT EXISTS (SELECT 1 FROM applications a WHERE a.id = i.application_id);

DELETE FROM feedback_responses fr
WHERE NOT EXISTS (SELECT 1 FROM feedback_requests req WHERE req.id = fr.request_id);

-- interview_feedback: depends on interviews. Re-check post-delete.
DELETE FROM interview_feedback if_
WHERE NOT EXISTS (SELECT 1 FROM interviews i WHERE i.id = if_.interview_id);

-- ============================================================
-- 2) interviews via application_id → applications.tenant_id
-- ============================================================
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE interviews i SET tenant_id = a.tenant_id
FROM applications a WHERE i.application_id = a.id AND i.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='interviews' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE interviews ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE interviews
  DROP CONSTRAINT IF EXISTS fk_interviews_tenant,
  ADD CONSTRAINT fk_interviews_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_interviews_tenant ON interviews(tenant_id);
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_interviews ON interviews;
CREATE POLICY tenant_isolation_interviews ON interviews
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 3) interview_feedback via interview_id → interviews.tenant_id (post-step2)
-- ============================================================
ALTER TABLE interview_feedback ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE interview_feedback if_ SET tenant_id = i.tenant_id
FROM interviews i WHERE if_.interview_id = i.id AND if_.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='interview_feedback' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE interview_feedback ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE interview_feedback
  DROP CONSTRAINT IF EXISTS fk_interview_feedback_tenant,
  ADD CONSTRAINT fk_interview_feedback_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_interview_feedback_tenant ON interview_feedback(tenant_id);
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_interview_feedback ON interview_feedback;
CREATE POLICY tenant_isolation_interview_feedback ON interview_feedback
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 4) feedback_responses via request_id → feedback_requests.tenant_id
-- ============================================================
ALTER TABLE feedback_responses ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE feedback_responses fr SET tenant_id = req.tenant_id
FROM feedback_requests req WHERE fr.request_id = req.id AND fr.tenant_id IS NULL;
DO $$ BEGIN
  -- Tutti i 4 orphan sono stati DELETE in step 1 → table può essere empty,
  -- ma SET NOT NULL richiede no NULL anche su empty table (OK, no rows).
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='feedback_responses' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE feedback_responses ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE feedback_responses
  DROP CONSTRAINT IF EXISTS fk_feedback_responses_tenant,
  ADD CONSTRAINT fk_feedback_responses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_feedback_responses_tenant ON feedback_responses(tenant_id);
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_feedback_responses ON feedback_responses;
CREATE POLICY tenant_isolation_feedback_responses ON feedback_responses
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- Verification
-- ============================================================
DO $$
DECLARE
  unprotected text;
  rls_count int;
BEGIN
  SELECT string_agg(table_name, ',') INTO unprotected
  FROM information_schema.columns
  WHERE table_name IN ('interviews','interview_feedback','feedback_responses')
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES';
  IF unprotected IS NOT NULL THEN
    RAISE EXCEPTION 'phase16i assert FAIL: NULLABLE tenant_id: %', unprotected;
  END IF;

  SELECT count(*) INTO rls_count FROM pg_policies WHERE policyname IN (
    'tenant_isolation_interviews','tenant_isolation_interview_feedback','tenant_isolation_feedback_responses'
  );
  IF rls_count <> 3 THEN
    RAISE EXCEPTION 'phase16i assert FAIL: only %/3 RLS policies', rls_count;
  END IF;

  RAISE NOTICE 'phase16i OK: 3/3 tables tenant_id NOT NULL · 3 RLS policies active · orphans cleaned';
END $$;

COMMIT;
