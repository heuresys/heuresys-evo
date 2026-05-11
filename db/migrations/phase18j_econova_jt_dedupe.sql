-- Phase 18j (S36 cleanup) — EcoNova job_templates dedupe (anomaly 454 → 62)
--
-- Context: EcoNova ha 454 job_templates con 62 distinct job_code (avg 7-9 duplicati per code).
-- 61 codes referenced via FK (position_skill_requirements, job_kpi_distribution, job_task_distribution,
--   job_template_skills, role_skill_requirements). 393 row sono orphan duplicate.
-- Cause probabile: migration loop / seed re-run senza ON CONFLICT (pre-CASCADIA era).
--
-- Strategy: per ogni (tenant_id, job_code) tenere 1 row "canonical" (preferenza:
--   row referenced via FK; in caso di tie, MIN(created_at)). DELETE le altre.
--
-- Lexicon: OPOURSKA (Layer 4 Role/JobPosition cleanup)
-- Idempotent: NOT EXISTS (post-run = 62 row, re-run = no-op)
-- Rollback: phase18j_DOWN.sql restore da backup

BEGIN;

-- Snapshot pre-dedupe count
DO $$
DECLARE v_before INT;
BEGIN
  SELECT COUNT(*) INTO v_before FROM job_templates
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova');
  RAISE NOTICE 'phase18j EN job_templates pre-dedupe: %', v_before;
END$$;

-- Build canonical set: per job_code pick referenced row if any, else min(created_at)
WITH
  en_jt AS (
    SELECT id, job_code, created_at,
      EXISTS (SELECT 1 FROM position_skill_requirements WHERE position_id=jt.id) OR
      EXISTS (SELECT 1 FROM job_kpi_distribution WHERE job_template_id=jt.id) OR
      EXISTS (SELECT 1 FROM job_task_distribution WHERE job_template_id=jt.id) OR
      EXISTS (SELECT 1 FROM job_template_skills WHERE job_template_id=jt.id) OR
      EXISTS (SELECT 1 FROM role_skill_requirements WHERE role_id=jt.id) AS is_ref
    FROM job_templates jt
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova')
  ),
  canonical_jt AS (
    SELECT DISTINCT ON (job_code) id, job_code
    FROM en_jt
    ORDER BY job_code, is_ref DESC, created_at ASC
  )
DELETE FROM job_templates jt
WHERE jt.tenant_id=(SELECT id FROM tenants WHERE code='econova')
  AND jt.id NOT IN (SELECT id FROM canonical_jt);

-- Post verification
DO $$
DECLARE v_after INT; v_distinct INT;
BEGIN
  SELECT COUNT(*) INTO v_after FROM job_templates
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova');
  SELECT COUNT(DISTINCT job_code) INTO v_distinct FROM job_templates
    WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova');
  RAISE NOTICE 'phase18j EN job_templates post-dedupe: % (expected 62 = distinct codes %)', v_after, v_distinct;
  IF v_after <> v_distinct THEN
    RAISE EXCEPTION 'phase18j dedupe inconsistent: post=% distinct=%', v_after, v_distinct;
  END IF;
END$$;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18j_econova_jt_dedupe', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;
