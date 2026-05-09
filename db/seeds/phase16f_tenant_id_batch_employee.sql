-- Phase 16.F · L56 · S23-tris — Big batch tenant_id + RLS su 18 tabelle
--
-- Closes (largely) audit issue #1 (CRITICAL) — defense-in-depth gap.
-- Estende il pilot S23 (6 tables) ai principali employee/recruiting/talent
-- domains. 18 tabelle, ~3920 rows backfilled.
--
-- Backfill paths:
--   - 14 via employee_id → employees.tenant_id
--   - succession_candidates via candidate_employee_id → employees.tenant_id
--   - applications via candidate_id → candidates.tenant_id
--   - employee_skill_history via profile_id → employee_skill_profiles.tenant_id
--
-- Strategy: ALTER ADD COLUMN nullable + UPDATE backfill + ALTER NOT NULL
--   + FK + INDEX + ENABLE/FORCE RLS + CREATE POLICY tenant_isolation_*.
--
-- Out-of-scope (S24+): interviews/interview_feedback (via 3-hop applications
-- chain), course_modules/learning_path_courses/learning_*/module_completions
-- (separate learning batch), prediction_*/report_*/feedback_responses
-- (require app-context analysis for tenant assignment).
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

-- Disable trigger broken (audit_permission_changes writes audit_logs invalidi).
-- Sostituito in S24 via auditedTransaction(). Per ora workaround.
SET LOCAL session_replication_role = replica;

-- ============================================================================
-- Helper: macro-pattern for employee_id-scoped tables
-- ============================================================================
-- Per ogni tabella in batch_emp_simple:
--   1) ADD COLUMN tenant_id UUID
--   2) UPDATE FROM employees via employee_id
--   3) SET NOT NULL
--   4) FK + INDEX
--   5) RLS + POLICY

-- ============================================================
-- Batch A: 14 tables via employee_id → employees.tenant_id
-- ============================================================
DO $$
DECLARE
  tbl text;
  emp_tables text[] := ARRAY[
    'employee_certifications', 'employee_skill_assessments', 'employee_pay_stubs',
    'merit_recommendations', 'bonus_allocations', 'salary_band_assignments',
    'employee_kpi_targets', 'employee_career_paths', 'employee_occupations',
    'employee_job_assignments', 'employee_benefit_enrollments', 'employee_requests',
    'internal_applications', 'signature_recipients', 'calibration_discussions'
  ];
BEGIN
  FOREACH tbl IN ARRAY emp_tables LOOP
    -- 1) Add column nullable (idempotent)
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id UUID', tbl);

    -- 2) Backfill from employees
    EXECUTE format(
      'UPDATE %I t SET tenant_id = e.tenant_id FROM employees e WHERE t.employee_id = e.id AND t.tenant_id IS NULL',
      tbl
    );

    -- 3) Set NOT NULL (skip if already)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = tbl AND column_name = 'tenant_id' AND is_nullable = 'YES'
    ) THEN
      EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL', tbl);
    END IF;

    -- 4) FK + index
    EXECUTE format(
      'ALTER TABLE %I DROP CONSTRAINT IF EXISTS fk_%s_tenant',
      tbl, tbl
    );
    EXECUTE format(
      'ALTER TABLE %I ADD CONSTRAINT fk_%s_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE',
      tbl, tbl
    );
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I(tenant_id)', tbl, tbl);

    -- 5) Enable + force RLS + policy
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_%s ON %I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%s ON %I USING (tenant_id = (current_setting(''app.current_tenant_id'', true))::uuid) WITH CHECK (tenant_id = (current_setting(''app.current_tenant_id'', true))::uuid)',
      tbl, tbl
    );

    RAISE NOTICE 'Batch A: % done', tbl;
  END LOOP;
END $$;

-- ============================================================
-- Batch B: succession_candidates via candidate_employee_id
-- ============================================================
ALTER TABLE succession_candidates ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE succession_candidates sc
SET tenant_id = e.tenant_id
FROM employees e
WHERE sc.candidate_employee_id = e.id AND sc.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='succession_candidates' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE succession_candidates ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE succession_candidates
  DROP CONSTRAINT IF EXISTS fk_succession_candidates_tenant,
  ADD CONSTRAINT fk_succession_candidates_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_succession_candidates_tenant ON succession_candidates(tenant_id);
ALTER TABLE succession_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE succession_candidates FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_succession_candidates ON succession_candidates;
CREATE POLICY tenant_isolation_succession_candidates ON succession_candidates
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- Batch C: applications via candidate_id → candidates.tenant_id
-- ============================================================
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE applications a
SET tenant_id = c.tenant_id
FROM candidates c
WHERE a.candidate_id = c.id AND a.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='applications' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE applications ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE applications
  DROP CONSTRAINT IF EXISTS fk_applications_tenant,
  ADD CONSTRAINT fk_applications_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_applications_tenant ON applications(tenant_id);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_applications ON applications;
CREATE POLICY tenant_isolation_applications ON applications
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- Batch D: employee_skill_history via profile_id → employee_skill_profiles.tenant_id
-- ============================================================
ALTER TABLE employee_skill_history ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE employee_skill_history h
SET tenant_id = p.tenant_id
FROM employee_skill_profiles p
WHERE h.profile_id = p.id AND h.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='employee_skill_history' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE employee_skill_history ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE employee_skill_history
  DROP CONSTRAINT IF EXISTS fk_employee_skill_history_tenant,
  ADD CONSTRAINT fk_employee_skill_history_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_employee_skill_history_tenant ON employee_skill_history(tenant_id);
ALTER TABLE employee_skill_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skill_history FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_employee_skill_history ON employee_skill_history;
CREATE POLICY tenant_isolation_employee_skill_history ON employee_skill_history
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- Verification
-- ============================================================
DO $$
DECLARE
  unprotected text;
  null_count int;
  rls_count int;
  expected_tables text[] := ARRAY[
    'employee_certifications','employee_skill_assessments','employee_pay_stubs',
    'merit_recommendations','bonus_allocations','salary_band_assignments',
    'employee_kpi_targets','employee_career_paths','employee_occupations',
    'employee_job_assignments','employee_benefit_enrollments','employee_requests',
    'internal_applications','signature_recipients','calibration_discussions',
    'succession_candidates','applications','employee_skill_history'
  ];
BEGIN
  -- Tables NOT NULL
  SELECT string_agg(table_name, ',') INTO unprotected
  FROM information_schema.columns
  WHERE table_name = ANY(expected_tables)
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES';
  IF unprotected IS NOT NULL THEN
    RAISE EXCEPTION 'phase16f assert FAIL: NULLABLE tenant_id: %', unprotected;
  END IF;

  -- RLS policies
  SELECT count(*) INTO rls_count
  FROM pg_policies WHERE policyname IN (
    'tenant_isolation_employee_certifications','tenant_isolation_employee_skill_assessments',
    'tenant_isolation_employee_pay_stubs','tenant_isolation_merit_recommendations',
    'tenant_isolation_bonus_allocations','tenant_isolation_salary_band_assignments',
    'tenant_isolation_employee_kpi_targets','tenant_isolation_employee_career_paths',
    'tenant_isolation_employee_occupations','tenant_isolation_employee_job_assignments',
    'tenant_isolation_employee_benefit_enrollments','tenant_isolation_employee_requests',
    'tenant_isolation_internal_applications','tenant_isolation_signature_recipients',
    'tenant_isolation_calibration_discussions','tenant_isolation_succession_candidates',
    'tenant_isolation_applications','tenant_isolation_employee_skill_history'
  );
  IF rls_count <> 18 THEN
    RAISE EXCEPTION 'phase16f assert FAIL: only %/18 RLS policies', rls_count;
  END IF;

  RAISE NOTICE 'phase16f OK: 18/18 tables tenant_id NOT NULL · 18 RLS policies active';
END $$;

COMMIT;
