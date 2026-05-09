-- Phase 16.J · L57 · S23-quater — Platform-default tenant_id su prediction/report
--
-- Closes #1 residue (prediction_actions/factors + report_executions/schedules).
-- 4 tabelle senza FK chiari → adottano P10 Platform-default idiom:
--   - tenant_id NULLABLE
--   - RLS policy: USING (tenant_id IS NULL OR tenant_id = current_setting...)
--   - rows esistenti rimangono NULL (Platform-scope visibili a SUPERUSER)
--
-- Razionale: prediction_* e report_* sono ML metadata + audit/scheduling
-- con tenant context implicito ma NON facilmente derivabile da FK schema.
-- Future writes possono settare tenant_id se determinabile dal context;
-- letture funzionano via RLS via NULL OR match pattern (idiom 12 tabelle
-- Platform-default già usate, vedi audit § 2.2).
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

DO $$
DECLARE
  tbl text;
  pd_tables text[] := ARRAY[
    'prediction_actions', 'prediction_factors',
    'report_executions', 'report_schedules'
  ];
BEGIN
  FOREACH tbl IN ARRAY pd_tables LOOP
    -- Add tenant_id NULLABLE
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id UUID', tbl);

    -- FK to tenants (NULLABLE allowed)
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS fk_%s_tenant', tbl, tbl);
    EXECUTE format(
      'ALTER TABLE %I ADD CONSTRAINT fk_%s_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE',
      tbl, tbl
    );
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_tenant ON %I(tenant_id)', tbl, tbl);

    -- Enable RLS with Platform-default idiom (NULL allowed)
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_%s ON %I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%s ON %I USING ((tenant_id IS NULL) OR (tenant_id = (current_setting(''app.current_tenant_id'', true))::uuid)) WITH CHECK ((tenant_id IS NULL) OR (tenant_id = (current_setting(''app.current_tenant_id'', true))::uuid))',
      tbl, tbl
    );
    RAISE NOTICE 'Platform-default %: done', tbl;
  END LOOP;
END $$;

-- ============================================================
-- Verification
-- ============================================================
DO $$
DECLARE
  rls_count int;
  fk_count int;
BEGIN
  SELECT count(*) INTO rls_count FROM pg_policies
  WHERE policyname IN (
    'tenant_isolation_prediction_actions','tenant_isolation_prediction_factors',
    'tenant_isolation_report_executions','tenant_isolation_report_schedules'
  );
  IF rls_count <> 4 THEN
    RAISE EXCEPTION 'phase16j assert FAIL: only %/4 RLS policies', rls_count;
  END IF;

  SELECT count(*) INTO fk_count FROM pg_constraint
  WHERE conname IN (
    'fk_prediction_actions_tenant','fk_prediction_factors_tenant',
    'fk_report_executions_tenant','fk_report_schedules_tenant'
  );
  IF fk_count <> 4 THEN
    RAISE EXCEPTION 'phase16j assert FAIL: only %/4 FK created', fk_count;
  END IF;

  RAISE NOTICE 'phase16j OK: 4/4 tables Platform-default tenant_id + RLS active';
END $$;

COMMIT;
