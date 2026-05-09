-- Phase 16.A · L54 · S23 — Forensic audit quick wins
--
-- Closes audit issue #2 (CRITICAL): 13 RLS policies usano GUC sbagliato
-- `app.current_tenant` invece del corretto `app.current_tenant_id`.
-- L'app chiama `SET LOCAL app.current_tenant_id` via `withTenant()` →
-- queste 13 policies leggono NULL → tenant_id = NULL → ZERO ROWS sempre.
-- Fail-closed silente che maschera feature analytics/reporting.
--
-- Out-of-scope S23 (deferred S24):
--   - rbac_role enum drift (issue #7): richiede ALTER TYPE multi-step
--     perché role_permissions.role usa l'enum con 4 rows SYSADMIN attive.
--   - widget_catalog_id backfill (issue #5): widget_code (17 distinct) NON
--     matcha widget_catalog.code (0/17 match) — naming convention diversa.
--     Drop FK richiede Prisma schema update sincronizzato.
--
-- Idempotente: re-run converge stesso stato (USING clause già corretta).

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 1) Fix 13 RLS policies con GUC typo
-- ============================================================
-- Pattern: USING (tenant_id = (current_setting('app.current_tenant'::text, true))::uuid)
-- Target:  USING (tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid)
-- Postgres NON supporta ALTER POLICY ... USING in alcune versioni quando
-- la clausola contiene cast complessi → uso DROP + CREATE per safety.

DROP POLICY IF EXISTS tenant_isolation_aggregations ON public.analytics_aggregations;
CREATE POLICY tenant_isolation_aggregations ON public.analytics_aggregations
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_analytics_events ON public.analytics_events;
CREATE POLICY tenant_isolation_analytics_events ON public.analytics_events
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_dashboards ON public.dashboards;
CREATE POLICY tenant_isolation_dashboards ON public.dashboards
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_delivery_log ON public.report_delivery_log;
CREATE POLICY tenant_isolation_delivery_log ON public.report_delivery_log
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_export_configs ON public.export_configurations;
CREATE POLICY tenant_isolation_export_configs ON public.export_configurations
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_export_jobs ON public.export_jobs;
CREATE POLICY tenant_isolation_export_jobs ON public.export_jobs
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_perf_predictions ON public.performance_predictions;
CREATE POLICY tenant_isolation_perf_predictions ON public.performance_predictions
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_predictions ON public.model_predictions;
CREATE POLICY tenant_isolation_predictions ON public.model_predictions
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_predictive_models ON public.predictive_models;
CREATE POLICY tenant_isolation_predictive_models ON public.predictive_models
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_subscriptions ON public.report_subscriptions;
CREATE POLICY tenant_isolation_subscriptions ON public.report_subscriptions
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

DROP POLICY IF EXISTS tenant_isolation_turnover_risk ON public.turnover_risk_scores;
CREATE POLICY tenant_isolation_turnover_risk ON public.turnover_risk_scores
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

-- widget_templates ha pattern speciale: tenant_id NULL allowed (Platform-default)
DROP POLICY IF EXISTS tenant_isolation_widget_templates ON public.widget_templates;
CREATE POLICY tenant_isolation_widget_templates ON public.widget_templates
  USING (((tenant_id IS NULL) OR (tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid)));

DROP POLICY IF EXISTS tenant_isolation_widgets ON public.dashboard_widgets;
CREATE POLICY tenant_isolation_widgets ON public.dashboard_widgets
  USING ((tenant_id = (current_setting('app.current_tenant_id'::text, true))::uuid));

-- ============================================================
-- 2) Verification asserts pre-COMMIT
-- ============================================================
DO $$
DECLARE
  typo_count int;
  fixed_count int;
  total_policies int;
BEGIN
  -- Assert 1: zero policies con GUC typo `app.current_tenant'` (no _id)
  SELECT count(*) INTO typo_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND qual ~ '''app\.current_tenant''[^_]'
    AND qual NOT LIKE '%app.current_tenant_id%';
  IF typo_count <> 0 THEN
    RAISE EXCEPTION 'phase16a assert FAIL: % policies still have GUC typo (expected 0)', typo_count;
  END IF;

  -- Assert 2: 13 policies fissate riferiscono il GUC corretto
  SELECT count(*) INTO fixed_count
  FROM pg_policies
  WHERE policyname IN (
    'tenant_isolation_aggregations','tenant_isolation_analytics_events',
    'tenant_isolation_dashboards','tenant_isolation_delivery_log',
    'tenant_isolation_export_configs','tenant_isolation_export_jobs',
    'tenant_isolation_perf_predictions','tenant_isolation_predictions',
    'tenant_isolation_predictive_models','tenant_isolation_subscriptions',
    'tenant_isolation_turnover_risk','tenant_isolation_widget_templates',
    'tenant_isolation_widgets'
  )
  AND qual LIKE '%app.current_tenant_id%';
  IF fixed_count <> 13 THEN
    RAISE EXCEPTION 'phase16a assert FAIL: only %/13 policies have correct GUC', fixed_count;
  END IF;

  -- Assert 3: total RLS policies count >= baseline 330 (no accidental drops)
  SELECT count(*) INTO total_policies FROM pg_policies WHERE schemaname = 'public';
  IF total_policies < 325 THEN
    RAISE EXCEPTION 'phase16a assert FAIL: only % policies remain (baseline ~330)', total_policies;
  END IF;

  RAISE NOTICE 'phase16a OK: 13/13 GUC fixed · 0 typo remaining · % total policies', total_policies;
END $$;

COMMIT;
