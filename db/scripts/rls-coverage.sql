-- RTGB B2.3 — RLS coverage script.
--
-- Enumerates every public-schema table that has a `tenant_id uuid` column
-- and reports whether RLS is enabled, FORCE ROW LEVEL SECURITY is set,
-- and at least one policy references current_setting('app.current_tenant_id').
--
-- Pass criteria (per ADR-0010):
--   * has_tenant_id      = true   (always true by selection)
--   * rls_enabled        = true
--   * force_rls          = true
--   * policy_count       >= 1
--   * has_tenant_setting = true
--
-- Usage:
--   psql "$DATABASE_URL" -f db/scripts/rls-coverage.sql
--
-- Exit code semantics: psql doesn't fail on data; wrap in bash and grep the
-- "FAIL" rows for CI gating (see B10).

WITH tenant_aware AS (
  SELECT c.relname AS table_name, c.oid AS table_oid
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_attribute a ON a.attrelid = c.oid
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND a.attname = 'tenant_id'
    AND a.atttypid = 'uuid'::regtype
    AND a.attnum > 0
    AND NOT a.attisdropped
),
flags AS (
  SELECT
    ta.table_name,
    c.relrowsecurity      AS rls_enabled,
    c.relforcerowsecurity AS force_rls,
    (
      SELECT COUNT(*)
      FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = ta.table_name
    ) AS policy_count,
    (
      SELECT COUNT(*) > 0
      FROM pg_policies p
      WHERE p.schemaname = 'public'
        AND p.tablename = ta.table_name
        AND (p.qual ILIKE '%current_setting%app.current_tenant_id%'
          OR p.with_check ILIKE '%current_setting%app.current_tenant_id%')
    ) AS has_tenant_setting
  FROM tenant_aware ta
  JOIN pg_class c ON c.oid = ta.table_oid
)
SELECT
  table_name,
  rls_enabled,
  force_rls,
  policy_count,
  has_tenant_setting,
  CASE
    WHEN rls_enabled AND force_rls AND policy_count >= 1 AND has_tenant_setting
      THEN 'PASS'
    ELSE 'FAIL'
  END AS status
FROM flags
ORDER BY status DESC, table_name;
