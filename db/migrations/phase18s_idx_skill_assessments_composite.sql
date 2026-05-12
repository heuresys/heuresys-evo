-- Phase 18s (S46) — Composite index on employee_skill_assessments
--
-- Goal: speed up the /dashboard/skills_heatmap matrix JOIN that groups
-- by (department × skill_name) across 270 employees × 12 top skills.
--
-- Query pattern:
--   FROM employee_skill_assessments esca
--   JOIN employees e ON e.id = esca.employee_id
--   WHERE e.tenant_id = ? AND e.department = ANY(?) AND esca.skill_name = ANY(?)
--   GROUP BY e.department, esca.skill_name
--
-- Without composite index: planner falls back to seq scan on esca + hash join.
-- With (employee_id, skill_name): index-only scan path + smaller hash buckets.
--
-- Target: /dashboard/skills_heatmap P95 627ms → ≤ 500ms (-150-200ms est).
-- Idempotent: IF NOT EXISTS.

BEGIN;

CREATE INDEX IF NOT EXISTS idx_emp_skills_emp_skillname
ON employee_skill_assessments (employee_id, skill_name);

-- ANALYZE updates planner stats for new index
ANALYZE employee_skill_assessments;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18s_idx_skill_assessments_composite', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_size text;
BEGIN
  SELECT pg_size_pretty(pg_relation_size('idx_emp_skills_emp_skillname'::regclass)) INTO v_size;
  RAISE NOTICE 'phase18s: idx_emp_skills_emp_skillname size = %', v_size;
END$$;

COMMIT;
