-- Phase 16.K · L57 · S23-quater — Materialized views refresh helper
--
-- Closes (partial) audit issue § 1.8: 5 materialized views senza refresh
-- schedule documentato. pg_cron NON disponibile su questo Postgres
-- (extension non installata e non in pg_available_extensions).
--
-- Strategia fallback: SQL function `public.refresh_all_mat_views()` che
-- esegue REFRESH MATERIALIZED VIEW CONCURRENTLY su tutte le 5 mat views.
-- Schedule esterno via cron/systemd timer (vedi db/README.md sezione
-- "Materialized views refresh schedule").
--
-- Setup futuro pg_cron (S24+ devops):
--   1. apt-get install postgresql-16-cron (Ubuntu)
--   2. shared_preload_libraries='pg_cron' in postgresql.conf
--   3. systemctl restart postgresql
--   4. CREATE EXTENSION pg_cron;
--   5. SELECT cron.schedule('refresh-mat-views', '0 */4 * * *', 'SELECT public.refresh_all_mat_views()');
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

CREATE OR REPLACE FUNCTION public.refresh_all_mat_views()
RETURNS TABLE(view_name text, duration_ms int, success boolean, error_msg text)
LANGUAGE plpgsql
AS $$
DECLARE
  mv text;
  start_ts timestamptz;
  views text[] := ARRAY[
    'mv_cross_tenant_rollup',
    'mv_tenant_owner_rollup',
    'mv_occupation_similarity',
    'mv_talent_signals',
    'mv_employee_performance_context'
  ];
BEGIN
  FOREACH mv IN ARRAY views LOOP
    start_ts := clock_timestamp();
    BEGIN
      EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY public.%I', mv);
      RETURN QUERY SELECT mv, extract(milliseconds from clock_timestamp() - start_ts)::int, true, NULL::text;
    EXCEPTION WHEN OTHERS THEN
      -- CONCURRENTLY richiede unique index; se manca fallback non-concurrente
      BEGIN
        EXECUTE format('REFRESH MATERIALIZED VIEW public.%I', mv);
        RETURN QUERY SELECT mv, extract(milliseconds from clock_timestamp() - start_ts)::int, true, ('non-concurrent fallback: ' || SQLERRM)::text;
      EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT mv, extract(milliseconds from clock_timestamp() - start_ts)::int, false, SQLERRM::text;
      END;
    END;
  END LOOP;
END $$;

-- Grant exec to heuresys role (so app can trigger refresh via Prisma raw query)
GRANT EXECUTE ON FUNCTION public.refresh_all_mat_views() TO heuresys;

-- Verifica
DO $$
DECLARE
  fn_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'refresh_all_mat_views' AND n.nspname = 'public'
  ) INTO fn_exists;
  IF NOT fn_exists THEN
    RAISE EXCEPTION 'phase16k assert FAIL: refresh_all_mat_views not created';
  END IF;
  RAISE NOTICE 'phase16k OK: refresh_all_mat_views() function ready (5 mat views)';
END $$;

COMMIT;
