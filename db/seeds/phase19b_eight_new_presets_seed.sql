-- =====================================================================
-- phase19b_eight_new_presets_seed.sql
-- =====================================================================
-- Cycle 2 Phase 4 — create + seed 8 nuovi preset _v2 per route non-dashboard.
--
-- Insert idempotente con `ON CONFLICT (code) DO UPDATE` su preset + DELETE
-- dashboard_elements prima del re-seed per ogni preset.
--
-- Reference: ~/.claude/plans/c-stata-una-continua-indexed-cocke.md §2.1 §4
-- =====================================================================

BEGIN;

-- =====================================================================
-- Create 8 preset rows (idempotent via ON CONFLICT)
-- =====================================================================

INSERT INTO dashboard_presets (code, name_it, name_en, description_it, description_en, perspective_code, persona_label, is_published, sort_order)
VALUES
  ('employees_directory_v2', 'Talenti||registry', 'Talents||registry',
    'Registry talenti con vista grid + filter + skill chips + flight-risk',
    'Talent registry: grid + filter + skill chips + flight-risk', 'TALENT',
    'Audience: HR_DIRECTOR', true, 10),
  ('reviews_cycle_v2', 'Performance||review', 'Performance||review',
    'Cycle review live: kanban + calibration + outlier detection',
    'Live review cycle: kanban + calibration + outliers', 'TALENT',
    'Audience: HR_DIRECTOR + HR_MANAGER', true, 20),
  ('goals_cascade_v2', 'OKR||cascade', 'OKR||cascade',
    'OKR cascade tree: tenant → dept → team → individual + progress',
    'OKR cascade: tenant → dept → team → individual + progress', 'TALENT',
    'Audience: HR_DIRECTOR + HR_MANAGER + DEPT_HEAD', true, 30),
  ('learning_paths_overview_v2', 'Learning||overview', 'Learning||overview',
    'Learning paths overview + enrollment progress + skill coverage',
    'Learning paths overview + enrollment + skill coverage', 'PROCESS',
    'Audience: HR_DIRECTOR + HR_MANAGER + DEPT_HEAD + LINE_MANAGER', true, 40),
  ('compensation_overview_v2', 'Compensation||overview', 'Compensation||overview',
    'Salary stats + histogram + bonus plans + total comp aggregato',
    'Salary stats + histogram + bonus plans + total comp', 'ENTERPRISE',
    'Audience: HR_DIRECTOR + HR_MANAGER (scoped)', true, 50),
  ('workforce_analytics_v2', 'Workforce||analytics', 'Workforce||analytics',
    'Headcount trend + attrition + hiring funnel + forecasting',
    'Headcount trend + attrition + hiring funnel + forecast', 'ENTERPRISE',
    'Audience: HR_DIRECTOR + HR_MANAGER', true, 60),
  ('admin_audit_v2', 'Audit||trail', 'Audit||trail',
    'Audit log cross-tenant filterable + category aggregator',
    'Audit log filterable + category aggregator', 'ENTERPRISE',
    'Audience: SUPERUSER + TENANT_OWNER + IT_ADMIN + HR_DIRECTOR', true, 70),
  ('admin_rbac_v2', 'RBAC||matrix', 'RBAC||matrix',
    'Role × area × permission matrix cross-cutting',
    'Role × area × permission matrix', 'ENTERPRISE',
    'Audience: SUPERUSER + TENANT_OWNER + IT_ADMIN + HR_DIRECTOR', true, 80)
ON CONFLICT (code) DO UPDATE SET
  name_it = EXCLUDED.name_it,
  name_en = EXCLUDED.name_en,
  description_it = EXCLUDED.description_it,
  description_en = EXCLUDED.description_en,
  perspective_code = EXCLUDED.perspective_code,
  persona_label = EXCLUDED.persona_label,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order;

-- =====================================================================
-- employees_directory_v2 — 9 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'employees_directory_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 2, 'TALENT', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 3, 1, 1, 2, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''HEADCOUNT''::text AS label, COALESCE((SELECT COUNT(*)::int FROM employees WHERE tenant_id = current_tenant_id() AND is_active = true), 0) AS value, ''active''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 4, 3, 1, 1, 2, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''NEW HIRES 90d''::text AS label, COALESCE((SELECT COUNT(*)::int FROM employees WHERE tenant_id = current_tenant_id() AND is_active = true AND hired_at > NOW() - INTERVAL ''90 days''), 0) AS value, ''last 90 days''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 7, 3, 1, 1, 2, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH t AS (SELECT EXTRACT(EPOCH FROM (NOW() - hired_at)) / (30.44 * 86400) AS months FROM employees WHERE tenant_id = current_tenant_id() AND is_active = true AND hired_at IS NOT NULL) SELECT ''AVG TENURE''::text AS label, COALESCE(ROUND(AVG(months))::int, 0) AS value, ''months''::text AS unit, ''avg active''::text AS sublabel FROM t"}}'::jsonb),
    (_preset_id, 'KpiRing', 4, 10, 3, 1, 1, 2, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''ORG UNITS''::text AS label, COALESCE((SELECT COUNT(DISTINCT org_unit_id)::int FROM employees WHERE tenant_id = current_tenant_id() AND org_unit_id IS NOT NULL AND is_active = true), 0) AS value, ''departments''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'SkillHeatmap', 2, 1, 12, 1, 1, 2, 'TALENT', NULL,
     '{"title":"Skill coverage by department","data_source":{"type":"static","value":{"unavailable":true,"reason":"Skill heatmap pivot needs Phase 2 module integration"}}}'::jsonb),
    (_preset_id, 'ActivityFeed', 3, 1, 12, 1, 1, 2, 'TALENT', NULL,
     '{"title":"Recent employee activity","data_source":{"type":"sql","ttl":60,"query":"SELECT id::text AS id, ''talent''::text AS category, action || '' '' || COALESCE(resource_type, '''') AS title, created_at AS \"timestamp\" FROM audit_logs WHERE tenant_id = current_tenant_id() AND resource_type IN (''employee'',''employees'',''user'') ORDER BY created_at DESC LIMIT 10"}}'::jsonb);
END $$;

-- =====================================================================
-- reviews_cycle_v2 — 5 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'reviews_cycle_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'TALENT', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 4, 1, 1, 3, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH c AS (SELECT COUNT(*) FILTER (WHERE status = ''completed'')::int AS done, COUNT(*)::int AS total FROM review_cycle_participants WHERE tenant_id = current_tenant_id()) SELECT ''CYCLE PROGRESS''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''completion''::text AS sublabel FROM c"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 5, 4, 1, 1, 3, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''AVG RATING''::text AS label, COALESCE(ROUND(AVG(overall_rating)::numeric, 1)::float, 0) AS value, ''of 5''::text AS sublabel FROM performance_reviews WHERE tenant_id = current_tenant_id() AND overall_rating IS NOT NULL"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 9, 4, 1, 1, 3, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH r AS (SELECT COUNT(*) FILTER (WHERE calibrated_at IS NOT NULL)::int AS done, COUNT(*)::int AS total FROM performance_reviews WHERE tenant_id = current_tenant_id()) SELECT ''CALIBRATION''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''calibrated''::text AS sublabel FROM r"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 2, 1, 12, 1, 1, 3, 'TALENT', NULL,
     '{"title":"Reviews by status","data_source":{"type":"sql","ttl":60,"query":"SELECT status AS label, COUNT(*)::int AS value FROM review_cycle_participants WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status"}}'::jsonb);
END $$;

-- =====================================================================
-- goals_cascade_v2 — 5 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'goals_cascade_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 4, 'TALENT', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 4, 1, 1, 4, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''GOALS ACTIVE''::text AS label, COALESCE((SELECT COUNT(*)::int FROM goals WHERE tenant_id = current_tenant_id() AND status NOT IN (''completed'',''cancelled'',''archived'')), 0) AS value, ''active OKR''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 5, 4, 1, 1, 4, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH g AS (SELECT COUNT(*) FILTER (WHERE status = ''on_track'')::int AS ok_n, COUNT(*)::int AS total FROM goals WHERE tenant_id = current_tenant_id()) SELECT ''ON-TRACK''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * ok_n / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''on track''::text AS sublabel FROM g"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 9, 4, 1, 1, 4, 'TALENT', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''AT RISK''::text AS label, COALESCE((SELECT COUNT(*)::int FROM goals WHERE tenant_id = current_tenant_id() AND status = ''at_risk''), 0) AS value, ''at risk''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 2, 1, 12, 1, 1, 4, 'TALENT', NULL,
     '{"title":"Goals by status","data_source":{"type":"sql","ttl":60,"query":"SELECT status AS label, COUNT(*)::int AS value FROM goals WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status"}}'::jsonb);
END $$;

-- =====================================================================
-- learning_paths_overview_v2 — 5 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'learning_paths_overview_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 5, 'PROCESS', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 4, 1, 1, 5, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''ACTIVE PATHS''::text AS label, COALESCE((SELECT COUNT(*)::int FROM learning_paths WHERE tenant_id = current_tenant_id() AND is_active = true), 0) AS value, ''available''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 5, 4, 1, 1, 5, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''ENROLLMENTS''::text AS label, COALESCE((SELECT COUNT(*)::int FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() AND status NOT IN (''completed'',''cancelled'')), 0) AS value, ''active''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 9, 4, 1, 1, 5, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH e AS (SELECT COUNT(*) FILTER (WHERE status = ''completed'')::int AS done, COUNT(*)::int AS total FROM learning_path_enrollments WHERE tenant_id = current_tenant_id()) SELECT ''COMPLETION''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''rate''::text AS sublabel FROM e"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 2, 1, 12, 1, 1, 5, 'PROCESS', NULL,
     '{"title":"Enrollments by status","data_source":{"type":"sql","ttl":60,"query":"SELECT status AS label, COUNT(*)::int AS value FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status"}}'::jsonb);
END $$;

-- =====================================================================
-- compensation_overview_v2 — 5 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'compensation_overview_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'ENTERPRISE', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 4, 1, 1, 3, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''AVG SALARY''::text AS label, COALESCE((SELECT ROUND(AVG(current_salary))::int FROM salary_band_assignments WHERE tenant_id = current_tenant_id() AND current_salary IS NOT NULL), 0) AS value, ''€''::text AS unit, ''mean''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 5, 4, 1, 1, 3, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''MEDIAN''::text AS label, COALESCE((SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY current_salary))::int FROM salary_band_assignments WHERE tenant_id = current_tenant_id() AND current_salary IS NOT NULL), 0) AS value, ''€''::text AS unit, ''P50''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 9, 4, 1, 1, 3, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''TOTAL PAYROLL''::text AS label, COALESCE((SELECT ROUND(SUM(current_salary))::int FROM salary_band_assignments WHERE tenant_id = current_tenant_id() AND current_salary IS NOT NULL), 0) AS value, ''€''::text AS unit, ''annual run-rate''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 2, 1, 12, 1, 1, 3, 'ENTERPRISE', NULL,
     '{"title":"Salary distribution (€10k buckets)","data_source":{"type":"sql","ttl":60,"query":"SELECT (FLOOR(current_salary / 10000) * 10000)::text || ''–'' || ((FLOOR(current_salary / 10000) + 1) * 10000)::text AS label, COUNT(*)::int AS value FROM salary_band_assignments WHERE tenant_id = current_tenant_id() AND current_salary IS NOT NULL GROUP BY FLOOR(current_salary / 10000) ORDER BY FLOOR(current_salary / 10000)"}}'::jsonb);
END $$;

-- =====================================================================
-- workforce_analytics_v2 — 5 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'workforce_analytics_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'ENTERPRISE', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 4, 1, 1, 3, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''HEADCOUNT''::text AS label, COALESCE((SELECT COUNT(*)::int FROM employees WHERE tenant_id = current_tenant_id() AND is_active = true), 0) AS value, ''active employees''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 5, 4, 1, 1, 3, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH a AS (SELECT COUNT(*) FILTER (WHERE is_active = false AND deleted_at > NOW() - INTERVAL ''12 months'')::int AS leavers, COUNT(*) FILTER (WHERE is_active = true)::int AS active FROM employees WHERE tenant_id = current_tenant_id()) SELECT ''ATTRITION 12m''::text AS label, CASE WHEN active > 0 THEN ROUND(100.0 * leavers / active, 1)::float ELSE 0 END AS value, ''%''::text AS unit, ''12m rolling''::text AS sublabel FROM a"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 9, 4, 1, 1, 3, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''OPEN REQ''::text AS label, COALESCE((SELECT COUNT(*)::int FROM recruiting_requisitions WHERE tenant_id = current_tenant_id() AND status IN (''open'',''in_progress'')), 0) AS value, ''active requisitions''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 2, 1, 12, 1, 1, 3, 'ENTERPRISE', NULL,
     '{"title":"Employees by org_unit (top 15)","data_source":{"type":"sql","ttl":60,"query":"SELECT COALESCE(ou.name_it, ou.name_en, ou.code, ''(no dept)'') AS label, COUNT(e.id)::int AS value FROM employees e LEFT JOIN org_units ou ON ou.id = e.org_unit_id WHERE e.tenant_id = current_tenant_id() AND e.is_active = true GROUP BY ou.name_it, ou.name_en, ou.code ORDER BY value DESC LIMIT 15"}}'::jsonb);
END $$;

-- =====================================================================
-- admin_audit_v2 — 5 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'admin_audit_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 2, 'ENTERPRISE', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 4, 1, 1, 2, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''EVENTS 24h''::text AS label, COALESCE((SELECT COUNT(*)::int FROM audit_logs WHERE tenant_id = current_tenant_id() AND created_at > NOW() - INTERVAL ''24 hours''), 0) AS value, ''last 24 hours''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 5, 4, 1, 1, 2, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''EVENTS 30d''::text AS label, COALESCE((SELECT COUNT(*)::int FROM audit_logs WHERE tenant_id = current_tenant_id() AND created_at > NOW() - INTERVAL ''30 days''), 0) AS value, ''last 30 days''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 9, 4, 1, 1, 2, 'ENTERPRISE', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''CATEGORIES''::text AS label, COALESCE((SELECT COUNT(DISTINCT category)::int FROM audit_logs WHERE tenant_id = current_tenant_id() AND created_at > NOW() - INTERVAL ''30 days''), 0) AS value, ''active 30d''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'ActivityFeed', 2, 1, 12, 1, 1, 2, 'ENTERPRISE', NULL,
     '{"title":"Audit log live","data_source":{"type":"sql","ttl":30,"query":"SELECT id::text AS id, COALESCE(category, ''(uncategorized)'')::text AS category, action || COALESCE('' '' || resource_type, '''') AS title, created_at AS \"timestamp\" FROM audit_logs WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 50"}}'::jsonb);
END $$;

-- =====================================================================
-- admin_rbac_v2 — 3 elements
-- =====================================================================
DO $$
DECLARE
  _preset_id BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'admin_rbac_v2';
  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'RbacMatrix', 1, 1, 12, 1, 1, 2, 'ENTERPRISE', NULL,
     '{"title":"Role × area permission matrix","data_source":{"type":"static","value":{"unavailable":true,"reason":"RBAC matrix widget consumes API endpoint not yet wired to data-fetcher"}}}'::jsonb),
    (_preset_id, 'Histogram', 2, 1, 6, 1, 1, 2, 'ENTERPRISE', NULL,
     '{"title":"Permissions allowed per role","data_source":{"type":"sql","ttl":60,"query":"SELECT r.code AS label, COUNT(*) FILTER (WHERE rap.allowed = true)::int AS value FROM rbp_roles r LEFT JOIN rbp_role_area_permissions rap ON rap.role_id = r.id GROUP BY r.code, r.level ORDER BY r.level"}}'::jsonb),
    (_preset_id, 'Histogram', 3, 7, 6, 1, 1, 2, 'ENTERPRISE', NULL,
     '{"title":"Active areas (functional)","data_source":{"type":"sql","ttl":60,"query":"SELECT a.code AS label, COUNT(*) FILTER (WHERE rap.allowed = true)::int AS value FROM rbp_functional_areas a LEFT JOIN rbp_role_area_permissions rap ON rap.functional_area_id = a.id GROUP BY a.code ORDER BY value DESC LIMIT 15"}}'::jsonb);
END $$;

-- =====================================================================
-- Verification
-- =====================================================================

DO $$
DECLARE
  _presets INTEGER;
  _elements INTEGER;
BEGIN
  SELECT COUNT(*) INTO _presets FROM dashboard_presets WHERE code IN (
    'employees_directory_v2','reviews_cycle_v2','goals_cascade_v2',
    'learning_paths_overview_v2','compensation_overview_v2','workforce_analytics_v2',
    'admin_audit_v2','admin_rbac_v2'
  );
  SELECT COUNT(*) INTO _elements FROM dashboard_elements WHERE dashboard_preset_id IN (
    SELECT id FROM dashboard_presets WHERE code IN (
      'employees_directory_v2','reviews_cycle_v2','goals_cascade_v2',
      'learning_paths_overview_v2','compensation_overview_v2','workforce_analytics_v2',
      'admin_audit_v2','admin_rbac_v2'
    )
  );
  RAISE NOTICE 'phase19b complete: % presets created/updated, % dashboard_elements seeded', _presets, _elements;
  IF _presets <> 8 THEN
    RAISE EXCEPTION 'phase19b verification failed: expected 8 presets, got %', _presets;
  END IF;
END $$;

COMMIT;
