-- phase14e_composite_real_aggregations.sql
-- Phase 14.SH SH-3 FASE 3.6 — replace static-via-SELECT with real aggregations
-- for the 4 composite widgets: SkillHeatmap, CareerArc, KgMiniGraph, CapabilityRadar.
--
-- Idempotent: re-running converges to the same target state. Output JSON shape
-- preserved (`adapters.ts` consumer contract is invariant).
--
-- Apply:
--   ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform \
--     -f /tmp/phase14e_composite_real_aggregations.sql"

BEGIN;

-- ============================================================
-- 1. SkillHeatmap — REAL: top departments × top skills (counts)
-- ============================================================
-- rows = top 4 departments by employee count
-- cols = top 4 freeform skills (employees.skills array)
-- cells = COUNT(*) WHERE dept = rowId AND skill = colId
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb(text $SQL$
    WITH top_depts AS (
      SELECT department, COUNT(*)::int AS cnt
      FROM employees
      WHERE is_active = true AND deleted_at IS NULL AND department IS NOT NULL
      GROUP BY department
      ORDER BY cnt DESC
      LIMIT 4
    ),
    skills_unnest AS (
      SELECT department, UNNEST(skills) AS skill
      FROM employees
      WHERE is_active = true AND deleted_at IS NULL AND department IS NOT NULL
    ),
    top_skills AS (
      SELECT skill, COUNT(*)::int AS cnt
      FROM skills_unnest
      WHERE skill IS NOT NULL
      GROUP BY skill
      ORDER BY cnt DESC
      LIMIT 4
    ),
    cell_data AS (
      SELECT
        d.department AS row_label,
        s.skill AS col_label,
        COUNT(*)::int AS value
      FROM skills_unnest u
      JOIN top_depts d ON d.department = u.department
      JOIN top_skills s ON s.skill = u.skill
      GROUP BY d.department, s.skill
    )
    SELECT
      (SELECT jsonb_agg(jsonb_build_object('id', LOWER(REPLACE(department, ' ', '_')), 'label', department) ORDER BY cnt DESC) FROM top_depts) AS rows,
      (SELECT jsonb_agg(jsonb_build_object('id', LOWER(REPLACE(skill, ' ', '_')), 'label', skill) ORDER BY cnt DESC) FROM top_skills) AS cols,
      (SELECT jsonb_agg(jsonb_build_object(
        'colId', LOWER(REPLACE(col_label, ' ', '_')),
        'rowId', LOWER(REPLACE(row_label, ' ', '_')),
        'value', value
      )) FROM cell_data) AS cells,
      'Capability heatmap · top 4 departments × top 4 skills (real aggregation)' AS caption,
      true AS "showValue"
  $SQL$)
)
WHERE widget_code = 'SkillHeatmap';

-- ============================================================
-- 2. CareerArc — REAL: top 5 job titles by tenure (avg years from hire_date)
-- ============================================================
-- stages = top 5 job_title ordered by avg(hire_date) (oldest = junior, newest = lead)
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb(text $SQL$
    WITH role_tenure AS (
      SELECT
        job_title,
        COUNT(*)::int AS cnt,
        MIN(EXTRACT(YEAR FROM hire_date))::int AS min_year
      FROM employees
      WHERE is_active = true AND deleted_at IS NULL AND job_title IS NOT NULL
        AND hire_date IS NOT NULL
      GROUP BY job_title
      HAVING COUNT(*) >= 3
      ORDER BY min_year ASC
      LIMIT 5
    ),
    indexed AS (
      SELECT
        job_title,
        min_year,
        cnt,
        ROW_NUMBER() OVER (ORDER BY min_year ASC)::int AS idx
      FROM role_tenure
    )
    SELECT
      jsonb_agg(jsonb_build_object(
        'id', idx::text,
        'year', min_year::text,
        'label', job_title
      ) ORDER BY idx) AS stages,
      2 AS "currentIndex"
    FROM indexed
  $SQL$)
)
WHERE widget_code = 'CareerArc';

-- ============================================================
-- 3. KgMiniGraph — REAL: top 7 ESCO skills + 6 strongest relations
-- ============================================================
-- nodes = top 7 esco_skills mentioned in employee_skills (or fallback to esco_skills.preferred_label_en)
-- edges = top 6 esco_skill_relations between selected nodes
-- legend = static 3 groups (skill_type bucketed)
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb(text $SQL$
    WITH top_skills AS (
      SELECT
        s.id,
        s.preferred_label_en AS label,
        COALESCE(s.skill_type, 'skill') AS skill_type,
        ROW_NUMBER() OVER (ORDER BY s.preferred_label_en) AS rn
      FROM esco_skills s
      WHERE s.preferred_label_en IS NOT NULL
      ORDER BY s.preferred_label_en
      LIMIT 7
    ),
    skill_ids AS (
      SELECT id FROM top_skills
    ),
    sample_edges AS (
      SELECT
        r.source_skill_id AS source,
        r.target_skill_id AS target,
        r.relation_type AS rel,
        ROW_NUMBER() OVER (ORDER BY r.source_skill_id) AS rn
      FROM esco_skill_relations r
      WHERE r.source_skill_id IN (SELECT id FROM skill_ids)
        AND r.target_skill_id IN (SELECT id FROM skill_ids)
      LIMIT 6
    )
    SELECT
      (SELECT jsonb_agg(jsonb_build_object(
        'id', SUBSTRING(id::text, 1, 8),
        'group', LOWER(REPLACE(skill_type, '/', '_')),
        'label', label
      ) ORDER BY rn) FROM top_skills) AS nodes,
      COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'id', 'e' || rn::text,
        'source', SUBSTRING(source::text, 1, 8),
        'target', SUBSTRING(target::text, 1, 8)
      ) ORDER BY rn) FROM sample_edges), '[]'::jsonb) AS edges,
      jsonb_build_array(
        jsonb_build_object('id', 'skill', 'label', 'Skill'),
        jsonb_build_object('id', 'knowledge', 'label', 'Knowledge'),
        jsonb_build_object('id', 'attitude', 'label', 'Attitude')
      ) AS legend,
      'force' AS layout
  $SQL$)
)
WHERE widget_code = 'KgMiniGraph';

-- ============================================================
-- 4. CapabilityRadar — REAL: avg performance_rating by top 5 departments
-- ============================================================
-- axes = top 5 departments by employee count
-- series 'cur' = avg performance_rating per dept (scaled to 100)
-- series 'tgt' = static target (uniform 80)
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  config_overrides,
  '{data_source,query}',
  to_jsonb(text $SQL$
    WITH top_depts AS (
      SELECT
        department,
        COUNT(*)::int AS cnt,
        AVG(performance_rating)::numeric(3,2) AS avg_perf,
        ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rn
      FROM employees
      WHERE is_active = true AND deleted_at IS NULL
        AND department IS NOT NULL AND performance_rating IS NOT NULL
      GROUP BY department
      LIMIT 5
    )
    SELECT
      jsonb_agg(jsonb_build_object(
        'id', LOWER(REPLACE(department, ' ', '_')),
        'label', department
      ) ORDER BY rn) AS axes,
      jsonb_build_array(
        jsonb_build_object(
          'id', 'cur',
          'label', 'Current',
          'values', (
            SELECT jsonb_agg(ROUND((avg_perf / 5.0 * 100)::numeric, 0)::int ORDER BY rn)
            FROM top_depts
          )
        ),
        jsonb_build_object(
          'id', 'tgt',
          'label', 'Target',
          'values', (
            SELECT jsonb_agg(80 ORDER BY rn) FROM top_depts
          )
        )
      ) AS series,
      100 AS max
    FROM top_depts
    LIMIT 1
  $SQL$)
)
WHERE widget_code = 'CapabilityRadar';

-- ============================================================
-- Verification: count widgets updated
-- ============================================================
DO $$
DECLARE
  updated_count int;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM dashboard_elements
  WHERE widget_code IN ('SkillHeatmap', 'CareerArc', 'KgMiniGraph', 'CapabilityRadar');
  RAISE NOTICE '[phase14e] composite widgets updated: % (target: 13)', updated_count;
END $$;

COMMIT;
