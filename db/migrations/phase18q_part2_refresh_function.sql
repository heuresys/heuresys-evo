-- Phase 18q (part 2) — Add mv_rbac_matrix to refresh_all_mat_views()
--
-- Extends the existing systemd-timer-driven refresh function to include
-- mv_rbac_matrix in the 4h rotation. Idempotent: CREATE OR REPLACE.

BEGIN;

CREATE OR REPLACE FUNCTION public.refresh_all_mat_views()
RETURNS TABLE(view_name text, duration_ms integer, success boolean, error_msg text)
LANGUAGE plpgsql
AS $function$
DECLARE
  mv text;
  start_ts timestamptz;
  views text[] := ARRAY[
    'mv_cross_tenant_rollup',
    'mv_tenant_owner_rollup',
    'mv_occupation_similarity',
    'mv_talent_signals',
    'mv_employee_performance_context',
    'mv_rbac_matrix'
  ];
BEGIN
  FOREACH mv IN ARRAY views LOOP
    start_ts := clock_timestamp();
    BEGIN
      EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY public.%I', mv);
      RETURN QUERY SELECT mv, extract(milliseconds from clock_timestamp() - start_ts)::int, true, NULL::text;
    EXCEPTION WHEN OTHERS THEN
      BEGIN
        EXECUTE format('REFRESH MATERIALIZED VIEW public.%I', mv);
        RETURN QUERY SELECT mv, extract(milliseconds from clock_timestamp() - start_ts)::int, true, ('non-concurrent fallback: ' || SQLERRM)::text;
      EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT mv, extract(milliseconds from clock_timestamp() - start_ts)::int, false, SQLERRM::text;
      END;
    END;
  END LOOP;
END;
$function$;

-- Smoke test
DO $$
BEGIN
  PERFORM * FROM refresh_all_mat_views();
  RAISE NOTICE 'phase18q part2: refresh_all_mat_views() now includes mv_rbac_matrix';
END$$;

COMMIT;
