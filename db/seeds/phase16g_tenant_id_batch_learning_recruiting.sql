-- Phase 16.G · L56 · S23-tris — Learning + recruiting indirect-FK batch
--
-- Estende phase16f. 7 tabelle, ~5075 rows backfilled.
--
-- Ordine ALTER critico (parent-first per chained FK):
--   1) course_modules     (parent of module_completions)
--   2) Dependent batches (employee-scoped + path/feedback)
--
-- Out-of-scope (S24+):
--   - interviews / interview_feedback: 8/128 interviews orphan (application_id
--     senza matching applications row, pre-existing dirty data). Necessita
--     decisione cleanup (DELETE orphans vs skip). → S24.
--   - report_executions, report_schedules: parent `reports` non ha tenant_id
--   - prediction_actions, prediction_factors: no FK chiari (ML metadata)
--   - module_completions via enrollments: enrollments NON ha tenant_id
--     → backfill alternativo via module_id → course_modules.tenant_id
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

SET LOCAL session_replication_role = replica;

-- ============================================================
-- 1) course_modules via course_id → courses.tenant_id
-- ============================================================
ALTER TABLE course_modules ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE course_modules cm SET tenant_id = c.tenant_id
FROM courses c WHERE cm.course_id = c.id AND cm.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='course_modules' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE course_modules ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE course_modules
  DROP CONSTRAINT IF EXISTS fk_course_modules_tenant,
  ADD CONSTRAINT fk_course_modules_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_course_modules_tenant ON course_modules(tenant_id);
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_course_modules ON course_modules;
CREATE POLICY tenant_isolation_course_modules ON course_modules
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 2) Batch via employee_id (3 learning tables)
-- ============================================================
DO $$
DECLARE
  tbl text;
  emp_tables text[] := ARRAY[
    'learning_bookmarks', 'learning_ratings', 'learning_recommendations'
  ];
BEGIN
  FOREACH tbl IN ARRAY emp_tables LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id UUID', tbl);
    EXECUTE format(
      'UPDATE %I t SET tenant_id = e.tenant_id FROM employees e WHERE t.employee_id = e.id AND t.tenant_id IS NULL',
      tbl
    );
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = tbl AND column_name = 'tenant_id' AND is_nullable = 'YES'
    ) THEN
      EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL', tbl);
    END IF;
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS fk_%s_tenant', tbl, tbl);
    EXECUTE format(
      'ALTER TABLE %I ADD CONSTRAINT fk_%s_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE',
      tbl, tbl
    );
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I(tenant_id)', tbl, tbl);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_%s ON %I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%s ON %I USING (tenant_id = (current_setting(''app.current_tenant_id'', true))::uuid) WITH CHECK (tenant_id = (current_setting(''app.current_tenant_id'', true))::uuid)',
      tbl, tbl
    );
    RAISE NOTICE 'Batch G3: % done', tbl;
  END LOOP;
END $$;

-- ============================================================
-- 4) learning_path_courses via learning_path_id → learning_paths.tenant_id
-- ============================================================
ALTER TABLE learning_path_courses ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE learning_path_courses lpc SET tenant_id = lp.tenant_id
FROM learning_paths lp WHERE lpc.learning_path_id = lp.id AND lpc.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='learning_path_courses' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE learning_path_courses ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE learning_path_courses
  DROP CONSTRAINT IF EXISTS fk_learning_path_courses_tenant,
  ADD CONSTRAINT fk_learning_path_courses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_tenant ON learning_path_courses(tenant_id);
ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_courses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_learning_path_courses ON learning_path_courses;
CREATE POLICY tenant_isolation_learning_path_courses ON learning_path_courses
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- 5) module_completions via module_id → course_modules.tenant_id (post-step1)
-- ============================================================
ALTER TABLE module_completions ADD COLUMN IF NOT EXISTS tenant_id UUID;
UPDATE module_completions mc SET tenant_id = cm.tenant_id
FROM course_modules cm WHERE mc.module_id = cm.id AND mc.tenant_id IS NULL;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='module_completions' AND column_name='tenant_id' AND is_nullable='YES') THEN
    ALTER TABLE module_completions ALTER COLUMN tenant_id SET NOT NULL;
  END IF;
END $$;
ALTER TABLE module_completions
  DROP CONSTRAINT IF EXISTS fk_module_completions_tenant,
  ADD CONSTRAINT fk_module_completions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_module_completions_tenant ON module_completions(tenant_id);
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_module_completions ON module_completions;
CREATE POLICY tenant_isolation_module_completions ON module_completions
  USING (tenant_id = (current_setting('app.current_tenant_id', true))::uuid)
  WITH CHECK (tenant_id = (current_setting('app.current_tenant_id', true))::uuid);

-- ============================================================
-- (skipped) feedback_responses: 4 rows orphan (request_id senza match
-- in feedback_requests). Pre-existing dirty data → S24 cleanup.
-- ============================================================

-- ============================================================
-- Verification
-- ============================================================
DO $$
DECLARE
  unprotected text;
  rls_count int;
  expected_tables text[] := ARRAY[
    'course_modules','learning_bookmarks','learning_ratings',
    'learning_recommendations','learning_path_courses','module_completions'
  ];
BEGIN
  SELECT string_agg(table_name, ',') INTO unprotected
  FROM information_schema.columns
  WHERE table_name = ANY(expected_tables)
    AND column_name = 'tenant_id'
    AND is_nullable = 'YES';
  IF unprotected IS NOT NULL THEN
    RAISE EXCEPTION 'phase16g assert FAIL: NULLABLE tenant_id: %', unprotected;
  END IF;

  SELECT count(*) INTO rls_count FROM pg_policies WHERE policyname IN (
    'tenant_isolation_course_modules',
    'tenant_isolation_learning_bookmarks','tenant_isolation_learning_ratings',
    'tenant_isolation_learning_recommendations','tenant_isolation_learning_path_courses',
    'tenant_isolation_module_completions'
  );
  IF rls_count <> 6 THEN
    RAISE EXCEPTION 'phase16g assert FAIL: only %/6 RLS policies', rls_count;
  END IF;

  RAISE NOTICE 'phase16g OK: 6/6 tables tenant_id NOT NULL · 6 RLS policies active';
END $$;

COMMIT;
