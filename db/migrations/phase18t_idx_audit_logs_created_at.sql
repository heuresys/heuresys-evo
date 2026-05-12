-- Phase 18t (S47) — Index on audit_logs(created_at DESC)
--
-- Goal: speed up org_systems_data.fetchOrgSystemsData() audit_logs query:
--   prisma.audit_logs.findMany({ orderBy: { created_at: 'desc' }, take: 6 })
--
-- Existing indexes on audit_logs cover timestamp (DESC), action, category, etc.
-- but NOT created_at. Planner falls back to seq scan → sort for take:6.
--
-- Under 20-conn × 30s load: /org_systems P95 = 2234ms, dominated by this query
-- across the audit table (~thousands of rows post-S35.4 seeding).
--
-- Idempotent: IF NOT EXISTS.

BEGIN;

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc
ON audit_logs (created_at DESC);

ANALYZE audit_logs;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18t_idx_audit_logs_created_at', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_size text; v_rows bigint;
BEGIN
  SELECT pg_size_pretty(pg_relation_size('idx_audit_logs_created_at_desc'::regclass)) INTO v_size;
  SELECT COUNT(*) INTO v_rows FROM audit_logs;
  RAISE NOTICE 'phase18t: idx_audit_logs_created_at_desc size=% · audit_logs rows=%', v_size, v_rows;
END$$;

COMMIT;
