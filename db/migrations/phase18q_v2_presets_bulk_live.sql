-- phase18q — Bulk migration G6 widgets static → live (P11) for 5 remaining presets
-- + fix bug phase18p element 111 (succession_candidates.employee_id → candidate_employee_id).
--
-- Constraint P11: solo dati live da DBMS. Source mancante → unavailable=true (no fake values).
--
-- Preset coverage:
--   skills_heatmap_v2      (113-116 KpiRing, 121 Histogram)  → tenant-scoped live
--   cross_tenant_overview_v2 (90-93 KpiRing, 99 Histogram)   → platform-wide live (SUPERUSER)
--   org_systems_v2         (69-72 KpiRing)                    → platform-wide live (IT_ADMIN/SUPERUSER)
--   capability_graph_v2    (123-126 KpiRing)                  → unavailable (employee/team scope, no employeeId support in fetchSql yet — defer S60+)
--   employee_journey_v2    (135-138 KpiRing)                  → unavailable (same reason)
--
-- hr_director_overview_v2: già live (S58 pre-existing) — NO CHANGES.

BEGIN;

-- ============================================================
-- FIX phase18p element 111 — succession_candidates JOIN column
-- ============================================================
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      WITH top_plan AS (
        SELECT sp.id, sp.position_name, sp.risk_level
        FROM succession_plans sp
        WHERE sp.tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND sp.status = 'active'
        ORDER BY
          CASE sp.criticality_level
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            ELSE 4
          END,
          sp.target_date ASC
        LIMIT 1
      ),
      top_candidate AS (
        SELECT
          sc.readiness_level,
          COALESCE(e.first_name || ' ' || e.last_name, 'Top candidate') AS candidate_name,
          e.job_title AS current_role
        FROM succession_candidates sc
        LEFT JOIN employees e ON e.id = sc.candidate_employee_id
        WHERE sc.critical_role_id = (SELECT id FROM top_plan)
        ORDER BY sc.rank_order ASC NULLS LAST
        LIMIT 1
      )
      SELECT
        COALESCE(tc.candidate_name, '—') AS candidate_name,
        COALESCE(tc.current_role, '—') AS current_role,
        COALESCE(tp.position_name, '—') AS target_role,
        CASE tc.readiness_level
          WHEN 'ready_now' THEN 92
          WHEN 'ready_1_year' THEN 78
          WHEN 'ready_2_years' THEN 62
          WHEN 'ready_3_years' THEN 48
          WHEN 'ready_3_plus_years' THEN 35
          WHEN 'development_needed' THEN 25
          ELSE 0
        END AS readiness_percent,
        CASE tc.readiness_level
          WHEN 'ready_now' THEN 'ready-now'
          WHEN 'ready_1_year' THEN '1-2y'
          WHEN 'ready_2_years' THEN '1-2y'
          WHEN 'ready_3_years' THEN '3-5y'
          WHEN 'ready_3_plus_years' THEN '3-5y'
          ELSE 'not-ready'
        END AS readiness,
        CASE tp.risk_level
          WHEN 'high' THEN 'high'
          WHEN 'critical' THEN 'critical'
          WHEN 'low' THEN 'low'
          ELSE 'medium'
        END AS risk
      FROM top_plan tp
      LEFT JOIN top_candidate tc ON true
    $$
  )
) WHERE id = 111;

-- ============================================================
-- skills_heatmap_v2 (tenant-scoped HR_MANAGER+)
-- ============================================================

-- 113 SKILL COVERAGE %
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      SELECT
        CASE WHEN AVG(CASE WHEN required_level > 0 THEN LEAST(assessed_level::float/required_level::float, 1.0) END) IS NULL
          THEN NULL
          ELSE ROUND(AVG(CASE WHEN required_level > 0 THEN LEAST(assessed_level::float/required_level::float, 1.0) END) * 100)::int
        END AS value,
        AVG(CASE WHEN required_level > 0 THEN LEAST(assessed_level::float/required_level::float, 1.0) END) IS NULL AS unavailable,
        'SKILL COVERAGE' AS label,
        '%' AS unit,
        'company-wide' AS sublabel
      FROM employee_skill_assessments
      WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
        AND assessed_level IS NOT NULL AND required_level IS NOT NULL AND required_level > 0
    $$
  )
) WHERE id = 113;

-- 114 GAP CRITICAL (assessments where assessed < required)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'GAP CRITICAL' AS label,
        'critical gaps' AS sublabel
      FROM employee_skill_assessments
      WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
        AND assessed_level IS NOT NULL AND required_level IS NOT NULL
        AND assessed_level < required_level - 1
    $$
  )
) WHERE id = 114;

-- 115 LEARNING ENROLL % (active enrollments / employees)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      WITH stats AS (
        SELECT
          (SELECT COUNT(DISTINCT ce.employee_id)::float
             FROM course_enrollments ce
             WHERE ce.tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
               AND ce.status IN ('enrolled','in_progress')) AS enrolled,
          (SELECT COUNT(*)::float FROM employees
             WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
               AND deleted_at IS NULL AND is_active = true) AS total
      )
      SELECT
        CASE WHEN total = 0 THEN NULL ELSE ROUND(100 * enrolled / total)::int END AS value,
        total = 0 AS unavailable,
        'LEARNING ENROLL' AS label,
        '%' AS unit,
        'active enrollments' AS sublabel
      FROM stats
    $$
  )
) WHERE id = 115;

-- 116 CERTIFICATIONS — no certification table in schema → unavailable
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        true AS unavailable,
        NULL::int AS value,
        'CERTIFICATIONS' AS label,
        'no certifications table in schema' AS sublabel
    $$
  )
) WHERE id = 116;

-- 121 Histogram (skill assessment buckets)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      WITH buckets AS (
        SELECT
          CASE
            WHEN required_level > 0 AND assessed_level/required_level::float >= 0.9 THEN '90-100'
            WHEN required_level > 0 AND assessed_level/required_level::float >= 0.7 THEN '70-89'
            WHEN required_level > 0 AND assessed_level/required_level::float >= 0.5 THEN '50-69'
            WHEN required_level > 0 THEN '0-49'
            ELSE NULL
          END AS bucket
        FROM employee_skill_assessments
        WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
          AND assessed_level IS NOT NULL AND required_level IS NOT NULL AND required_level > 0
      )
      SELECT json_build_array(
        json_build_object('id','1','tone','ok','label','90-100','value',(SELECT COUNT(*) FROM buckets WHERE bucket='90-100')::int),
        json_build_object('id','2','tone','info','label','70-89','value',(SELECT COUNT(*) FROM buckets WHERE bucket='70-89')::int),
        json_build_object('id','3','tone','warn','label','50-69','value',(SELECT COUNT(*) FROM buckets WHERE bucket='50-69')::int),
        json_build_object('id','4','tone','critical','label','0-49','value',(SELECT COUNT(*) FROM buckets WHERE bucket='0-49')::int)
      ) AS items
    $$
  )
) WHERE id = 121;

-- ============================================================
-- cross_tenant_overview_v2 (SUPERUSER platform-wide)
-- ============================================================

-- 90 TOTAL TENANTS
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'TOTAL TENANTS' AS label,
        'platform-wide' AS sublabel
      FROM tenants
      WHERE deleted_at IS NULL
    $$
  )
) WHERE id = 90;

-- 91 TOTAL EMPLOYEES (cross-tenant)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'TOTAL EMPLOYEES' AS label,
        'across all tenants' AS sublabel
      FROM employees
      WHERE deleted_at IS NULL AND is_active = true
    $$
  )
) WHERE id = 91;

-- 92 INTEGRATIONS — unavailable (no central integrations registry table)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        true AS unavailable,
        NULL::int AS value,
        'INTEGRATIONS' AS label,
        'no central integrations registry' AS sublabel
    $$
  )
) WHERE id = 92;

-- 93 PLATFORM UPTIME — unavailable (no monitoring source)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        true AS unavailable,
        NULL::numeric AS value,
        'PLATFORM UPTIME' AS label,
        '%' AS unit,
        'no monitoring source' AS sublabel
    $$
  )
) WHERE id = 93;

-- 99 Histogram cross-tenant performance buckets
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 300,
    'query', $$
      WITH buckets AS (
        SELECT
          CASE
            WHEN overall_rating >= 4.5 THEN '90-100'
            WHEN overall_rating >= 3.5 THEN '70-89'
            WHEN overall_rating >= 2.5 THEN '50-69'
            ELSE '0-49'
          END AS bucket
        FROM performance_reviews
        WHERE overall_rating IS NOT NULL
      )
      SELECT json_build_array(
        json_build_object('id','1','tone','ok','label','90-100','value',(SELECT COUNT(*) FROM buckets WHERE bucket='90-100')::int),
        json_build_object('id','2','tone','info','label','70-89','value',(SELECT COUNT(*) FROM buckets WHERE bucket='70-89')::int),
        json_build_object('id','3','tone','warn','label','50-69','value',(SELECT COUNT(*) FROM buckets WHERE bucket='50-69')::int),
        json_build_object('id','4','tone','critical','label','0-49','value',(SELECT COUNT(*) FROM buckets WHERE bucket='0-49')::int)
      ) AS items
    $$
  )
) WHERE id = 99;

-- ============================================================
-- org_systems_v2 (IT_ADMIN/SUPERUSER platform-wide)
-- ============================================================

-- 69 ACTIVE TENANTS
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'ACTIVE TENANTS' AS label,
        'platform-wide' AS sublabel
      FROM tenants
      WHERE deleted_at IS NULL
    $$
  )
) WHERE id = 69;

-- 70 RBAC ROLES
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'RBAC ROLES' AS label,
        'canonical hierarchy' AS sublabel
      FROM rbp_roles
    $$
  )
) WHERE id = 70;

-- 71 RLS POLICIES (count from pg_policies)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        COUNT(*)::int AS value,
        false AS unavailable,
        'RLS POLICIES' AS label,
        'DB-level enforcement' AS sublabel
      FROM pg_policies
      WHERE schemaname = 'public'
    $$
  )
) WHERE id = 71;

-- 72 SYSTEM UPTIME — unavailable (no monitoring source)
UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'ttl', 600,
    'query', $$
      SELECT
        true AS unavailable,
        NULL::numeric AS value,
        'SYSTEM UPTIME' AS label,
        '%' AS unit,
        'no monitoring source' AS sublabel
    $$
  )
) WHERE id = 72;

-- ============================================================
-- capability_graph_v2 (DEPT_HEAD/manager team-scope)
-- → unavailable: requires {employeeId} placeholder support in fetchSql (defer S60+)
-- ============================================================

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'TEAM SIZE' AS label, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 123;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'CAPABILITY AVG' AS label, '%' AS unit, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 124;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'GAP COUNT' AS label, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 125;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'ROLE COVERAGE' AS label, '%' AS unit, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 126;

-- ============================================================
-- employee_journey_v2 (EMPLOYEE personal-scope)
-- → unavailable: requires {employeeId} placeholder support in fetchSql (defer S60+)
-- ============================================================

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'CAPABILITY' AS label, '%' AS unit, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 135;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'GOALS Q4' AS label, '/5' AS unit, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 136;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::numeric AS value, 'TENURE' AS label, 'yr' AS unit, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 137;

UPDATE dashboard_elements SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql', 'ttl', 600,
    'query', $$SELECT true AS unavailable, NULL::int AS value, 'NEXT REVIEW' AS label, 'd' AS unit, 'requires employeeId context (S60+)' AS sublabel$$
  )
) WHERE id = 138;

COMMIT;
