-- =============================================================================
-- Seed: Phase 14.A follow-up — Composite widgets via static data_source
-- Date: 2026-05-07
-- =============================================================================
-- Populates dashboard_elements.config_overrides.data_source for the composite
-- widgets (SuccessionCard, CareerArc, KgMiniGraph, SkillHeatmap,
-- CapabilityRadar, RbacMatrix) using `static` data_source with inline JSON
-- values. This unblocks the Live wrapper end-to-end for all 8 widget codes
-- without requiring composite SQL queries (deferred — schema knowledge for
-- talents/skills/org joins).
--
-- Coverage:
--   hr_director_overview · pos 2 SuccessionCard
--   capability_graph     · pos 1 KgMiniGraph
--   skills_heatmap       · pos 2 SkillHeatmap
--   employee_journey     · pos 2 CareerArc
--   employee_journey     · pos 3 CapabilityRadar
--   employee_journey     · pos 4 KgMiniGraph
--   org_systems          · pos 2 RbacMatrix
--   process_recruiting_funnel · pos 2 CareerArc
--   process_recruiting_funnel · pos 3 SkillHeatmap
--
-- Idempotent. Phase 14.A.4 SQL counts (KpiRing + IntegrationHealthPill) are
-- preserved (this script targets different widget codes / positions).
-- =============================================================================

BEGIN;

-- hr_director_overview · SuccessionCard · pos 2
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'candidateName', 'Stefania Bianchi',
           'currentRole', 'Head Credit Risk',
           'targetRole', 'Director Risk & Analytics',
           'readinessPercent', 88,
           'readiness', 'ready-now',
           'risk', 'low',
           'readyBy', '2026 Q3'
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'hr_director_overview'
   AND de.widget_code = 'SuccessionCard' AND de.position = 2 AND de.tenant_id IS NULL;

-- capability_graph · KgMiniGraph · pos 1
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'nodes', jsonb_build_array(
             jsonb_build_object('id', 'finance', 'label', 'Finance', 'group', 'domain'),
             jsonb_build_object('id', 'risk', 'label', 'Risk', 'group', 'domain'),
             jsonb_build_object('id', 'compliance', 'label', 'Compliance', 'group', 'domain'),
             jsonb_build_object('id', 'sql', 'label', 'SQL', 'group', 'tech'),
             jsonb_build_object('id', 'python', 'label', 'Python', 'group', 'tech'),
             jsonb_build_object('id', 'leadership', 'label', 'Leadership', 'group', 'soft'),
             jsonb_build_object('id', 'comms', 'label', 'Comms', 'group', 'soft')
           ),
           'edges', jsonb_build_array(
             jsonb_build_object('id', 'e1', 'source', 'finance', 'target', 'risk'),
             jsonb_build_object('id', 'e2', 'source', 'risk', 'target', 'compliance'),
             jsonb_build_object('id', 'e3', 'source', 'finance', 'target', 'sql'),
             jsonb_build_object('id', 'e4', 'source', 'risk', 'target', 'python'),
             jsonb_build_object('id', 'e5', 'source', 'finance', 'target', 'leadership'),
             jsonb_build_object('id', 'e6', 'source', 'leadership', 'target', 'comms')
           ),
           'legend', jsonb_build_array(
             jsonb_build_object('group', 'domain', 'label', 'Domain', 'color', '#3b82f6'),
             jsonb_build_object('group', 'tech', 'label', 'Tech', 'color', '#a855f7'),
             jsonb_build_object('group', 'soft', 'label', 'Soft', 'color', '#5fb87a')
           )
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'capability_graph'
   AND de.widget_code = 'KgMiniGraph' AND de.position = 1 AND de.tenant_id IS NULL;

-- skills_heatmap · SkillHeatmap · pos 2
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'rows', jsonb_build_array(
             jsonb_build_object('id', 'finance', 'label', 'Finance'),
             jsonb_build_object('id', 'risk', 'label', 'Risk'),
             jsonb_build_object('id', 'eng', 'label', 'Engineering'),
             jsonb_build_object('id', 'hr', 'label', 'HR')
           ),
           'cols', jsonb_build_array(
             jsonb_build_object('id', 'sql', 'label', 'SQL'),
             jsonb_build_object('id', 'python', 'label', 'Python'),
             jsonb_build_object('id', 'lead', 'label', 'Leadership'),
             jsonb_build_object('id', 'comms', 'label', 'Comms')
           ),
           'cells', jsonb_build_array(
             jsonb_build_object('rowId', 'finance', 'colId', 'sql', 'value', 78),
             jsonb_build_object('rowId', 'finance', 'colId', 'python', 'value', 62),
             jsonb_build_object('rowId', 'finance', 'colId', 'lead', 'value', 71),
             jsonb_build_object('rowId', 'finance', 'colId', 'comms', 'value', 83),
             jsonb_build_object('rowId', 'risk', 'colId', 'sql', 'value', 91),
             jsonb_build_object('rowId', 'risk', 'colId', 'python', 'value', 85),
             jsonb_build_object('rowId', 'risk', 'colId', 'lead', 'value', 67),
             jsonb_build_object('rowId', 'risk', 'colId', 'comms', 'value', 75),
             jsonb_build_object('rowId', 'eng', 'colId', 'sql', 'value', 96),
             jsonb_build_object('rowId', 'eng', 'colId', 'python', 'value', 98),
             jsonb_build_object('rowId', 'eng', 'colId', 'lead', 'value', 58),
             jsonb_build_object('rowId', 'eng', 'colId', 'comms', 'value', 64),
             jsonb_build_object('rowId', 'hr', 'colId', 'sql', 'value', 32),
             jsonb_build_object('rowId', 'hr', 'colId', 'python', 'value', 28),
             jsonb_build_object('rowId', 'hr', 'colId', 'lead', 'value', 87),
             jsonb_build_object('rowId', 'hr', 'colId', 'comms', 'value', 93)
           ),
           'caption', 'Department × Skill coverage'
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'skills_heatmap'
   AND de.widget_code = 'SkillHeatmap' AND de.position = 2 AND de.tenant_id IS NULL;

-- employee_journey · CareerArc · pos 2
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'currentIndex', 2,
           'stages', jsonb_build_array(
             jsonb_build_object('id', '1', 'label', 'Junior Analyst', 'year', '2018'),
             jsonb_build_object('id', '2', 'label', 'Analyst', 'year', '2020'),
             jsonb_build_object('id', '3', 'label', 'Senior Analyst', 'year', '2023'),
             jsonb_build_object('id', '4', 'label', 'Lead', 'year', '2026 →'),
             jsonb_build_object('id', '5', 'label', 'Head of', 'year', '2029+')
           )
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'employee_journey'
   AND de.widget_code = 'CareerArc' AND de.position = 2 AND de.tenant_id IS NULL;

-- employee_journey · CapabilityRadar · pos 3
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'axes', jsonb_build_array(
             jsonb_build_object('id', 'tech', 'label', 'Tech'),
             jsonb_build_object('id', 'fin', 'label', 'Finance'),
             jsonb_build_object('id', 'lead', 'label', 'Lead'),
             jsonb_build_object('id', 'comm', 'label', 'Comms'),
             jsonb_build_object('id', 'risk', 'label', 'Risk')
           ),
           'series', jsonb_build_array(
             jsonb_build_object('id', 'cur', 'label', 'Current', 'values', jsonb_build_array(82, 70, 35, 60, 75)),
             jsonb_build_object('id', 'tgt', 'label', 'Target', 'values', jsonb_build_array(75, 80, 70, 80, 85))
           ),
           'max', 100
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'employee_journey'
   AND de.widget_code = 'CapabilityRadar' AND de.position = 3 AND de.tenant_id IS NULL;

-- employee_journey · KgMiniGraph · pos 4
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'nodes', jsonb_build_array(
             jsonb_build_object('id', 'self', 'label', 'You', 'group', 'self'),
             jsonb_build_object('id', 'fin', 'label', 'Finance', 'group', 'domain'),
             jsonb_build_object('id', 'risk', 'label', 'Risk', 'group', 'domain'),
             jsonb_build_object('id', 'sql', 'label', 'SQL', 'group', 'tech'),
             jsonb_build_object('id', 'lead', 'label', 'Lead', 'group', 'soft')
           ),
           'edges', jsonb_build_array(
             jsonb_build_object('id', 'e1', 'source', 'self', 'target', 'fin'),
             jsonb_build_object('id', 'e2', 'source', 'self', 'target', 'risk'),
             jsonb_build_object('id', 'e3', 'source', 'self', 'target', 'sql'),
             jsonb_build_object('id', 'e4', 'source', 'fin', 'target', 'risk'),
             jsonb_build_object('id', 'e5', 'source', 'lead', 'target', 'self')
           )
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'employee_journey'
   AND de.widget_code = 'KgMiniGraph' AND de.position = 4 AND de.tenant_id IS NULL;

-- org_systems · RbacMatrix · pos 2
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'roles', jsonb_build_array(
             jsonb_build_object('id', 'su', 'label', 'SUPERUSER', 'level', -1),
             jsonb_build_object('id', 'to', 'label', 'TENANT_OWNER', 'level', 0),
             jsonb_build_object('id', 'it', 'label', 'IT_ADMIN', 'level', 1),
             jsonb_build_object('id', 'hrd', 'label', 'HR_DIRECTOR', 'level', 2),
             jsonb_build_object('id', 'emp', 'label', 'EMPLOYEE', 'level', 6)
           ),
           'areas', jsonb_build_array(
             jsonb_build_object('id', 'employees', 'label', 'Employees'),
             jsonb_build_object('id', 'audit', 'label', 'Audit'),
             jsonb_build_object('id', 'rbp', 'label', 'RBP'),
             jsonb_build_object('id', 'dashboards', 'label', 'Dashboards')
           ),
           'assignments', jsonb_build_array(
             jsonb_build_object('roleId', 'su', 'areaId', 'employees', 'level', 'owner'),
             jsonb_build_object('roleId', 'su', 'areaId', 'audit', 'level', 'owner'),
             jsonb_build_object('roleId', 'su', 'areaId', 'rbp', 'level', 'owner'),
             jsonb_build_object('roleId', 'su', 'areaId', 'dashboards', 'level', 'owner'),
             jsonb_build_object('roleId', 'to', 'areaId', 'employees', 'level', 'admin'),
             jsonb_build_object('roleId', 'to', 'areaId', 'audit', 'level', 'admin'),
             jsonb_build_object('roleId', 'to', 'areaId', 'rbp', 'level', 'admin'),
             jsonb_build_object('roleId', 'to', 'areaId', 'dashboards', 'level', 'admin'),
             jsonb_build_object('roleId', 'it', 'areaId', 'employees', 'level', 'read'),
             jsonb_build_object('roleId', 'it', 'areaId', 'audit', 'level', 'read'),
             jsonb_build_object('roleId', 'it', 'areaId', 'rbp', 'level', 'admin'),
             jsonb_build_object('roleId', 'it', 'areaId', 'dashboards', 'level', 'admin'),
             jsonb_build_object('roleId', 'hrd', 'areaId', 'employees', 'level', 'admin'),
             jsonb_build_object('roleId', 'hrd', 'areaId', 'audit', 'level', 'read'),
             jsonb_build_object('roleId', 'hrd', 'areaId', 'rbp', 'level', 'read'),
             jsonb_build_object('roleId', 'hrd', 'areaId', 'dashboards', 'level', 'write'),
             jsonb_build_object('roleId', 'emp', 'areaId', 'employees', 'level', 'read'),
             jsonb_build_object('roleId', 'emp', 'areaId', 'audit', 'level', 'none'),
             jsonb_build_object('roleId', 'emp', 'areaId', 'rbp', 'level', 'none'),
             jsonb_build_object('roleId', 'emp', 'areaId', 'dashboards', 'level', 'read')
           ),
           'readonly', true
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'org_systems'
   AND de.widget_code = 'RbacMatrix' AND de.position = 2 AND de.tenant_id IS NULL;

-- process_recruiting_funnel · CareerArc · pos 2
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'currentIndex', 2,
           'stages', jsonb_build_array(
             jsonb_build_object('id', '1', 'label', 'Sourced', 'year', '12'),
             jsonb_build_object('id', '2', 'label', 'Screened', 'year', '8'),
             jsonb_build_object('id', '3', 'label', 'Interviewed', 'year', '5'),
             jsonb_build_object('id', '4', 'label', 'Offer', 'year', '2'),
             jsonb_build_object('id', '5', 'label', 'Hired', 'year', '1')
           )
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'process_recruiting_funnel'
   AND de.widget_code = 'CareerArc' AND de.position = 2 AND de.tenant_id IS NULL;

-- process_recruiting_funnel · SkillHeatmap · pos 3
UPDATE dashboard_elements de
   SET config_overrides = jsonb_set(
       COALESCE(de.config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object(
           'rows', jsonb_build_array(
             jsonb_build_object('id', 'q1', 'label', 'Q1'),
             jsonb_build_object('id', 'q2', 'label', 'Q2'),
             jsonb_build_object('id', 'q3', 'label', 'Q3'),
             jsonb_build_object('id', 'q4', 'label', 'Q4')
           ),
           'cols', jsonb_build_array(
             jsonb_build_object('id', 'eng', 'label', 'Engineering'),
             jsonb_build_object('id', 'sales', 'label', 'Sales'),
             jsonb_build_object('id', 'fin', 'label', 'Finance'),
             jsonb_build_object('id', 'ops', 'label', 'Ops')
           ),
           'cells', jsonb_build_array(
             jsonb_build_object('rowId', 'q1', 'colId', 'eng', 'value', 8),
             jsonb_build_object('rowId', 'q1', 'colId', 'sales', 'value', 12),
             jsonb_build_object('rowId', 'q1', 'colId', 'fin', 'value', 3),
             jsonb_build_object('rowId', 'q1', 'colId', 'ops', 'value', 6),
             jsonb_build_object('rowId', 'q2', 'colId', 'eng', 'value', 14),
             jsonb_build_object('rowId', 'q2', 'colId', 'sales', 'value', 18),
             jsonb_build_object('rowId', 'q2', 'colId', 'fin', 'value', 5),
             jsonb_build_object('rowId', 'q2', 'colId', 'ops', 'value', 9),
             jsonb_build_object('rowId', 'q3', 'colId', 'eng', 'value', 21),
             jsonb_build_object('rowId', 'q3', 'colId', 'sales', 'value', 24),
             jsonb_build_object('rowId', 'q3', 'colId', 'fin', 'value', 7),
             jsonb_build_object('rowId', 'q3', 'colId', 'ops', 'value', 11),
             jsonb_build_object('rowId', 'q4', 'colId', 'eng', 'value', 28),
             jsonb_build_object('rowId', 'q4', 'colId', 'sales', 'value', 30),
             jsonb_build_object('rowId', 'q4', 'colId', 'fin', 'value', 9),
             jsonb_build_object('rowId', 'q4', 'colId', 'ops', 'value', 14)
           ),
           'caption', 'Hires per quarter × department'
         ))),
       true)
  FROM dashboard_presets dp
 WHERE dp.id = de.dashboard_preset_id
   AND dp.code = 'process_recruiting_funnel'
   AND de.widget_code = 'SkillHeatmap' AND de.position = 3 AND de.tenant_id IS NULL;

-- ============================================================================
-- Verification report — count of elements with data_source by widget_code
-- ============================================================================
SELECT de.widget_code,
       count(*) AS instances,
       count(*) FILTER (WHERE de.config_overrides ? 'data_source') AS with_data_source,
       count(DISTINCT (de.config_overrides->'data_source'->>'type')) FILTER (WHERE de.config_overrides ? 'data_source') AS distinct_source_types
  FROM dashboard_elements de
 WHERE de.tenant_id IS NULL
 GROUP BY de.widget_code
 ORDER BY de.widget_code;

COMMIT;
