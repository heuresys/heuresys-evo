-- =====================================================================
-- phase19a_four_process_v2_reseed.sql
-- =====================================================================
-- Cycle 2 Phase 1 — re-seed 4 process_*_v2 dashboard presets sparse
-- (3 elements ciascuno) con 10 elements widget-rich coerenti al plan §2.2.
--
-- Scope ridotto: SOLO 4 process_*_v2. I 2 preset full
-- (hr_director_overview_v2 + capability_graph_v2) NON toccati — già OK
-- con 11 elements + SQL data_source live (decisione autonoma plan §6).
--
-- Idempotenza: DELETE + INSERT in transazione. Re-run produce stato
-- finale identico (l'ID interno cambia ma il layout è lo stesso).
--
-- Reference: ~/.claude/plans/c-stata-una-continua-indexed-cocke.md
-- Specs: .ux-design/04-promotion/specs/process_*_v2.md
-- =====================================================================

BEGIN;

-- =====================================================================
-- Update preset titles with || multi-word accent split (T0.7 P6 W#1)
-- =====================================================================

UPDATE dashboard_presets SET
  name_it = 'Recruiting||funnel',
  name_en = 'Recruiting||funnel'
WHERE code = 'process_recruiting_funnel_v2';

UPDATE dashboard_presets SET
  name_it = 'Onboarding||flow',
  name_en = 'Onboarding||flow'
WHERE code = 'process_onboarding_flow_v2';

UPDATE dashboard_presets SET
  name_it = 'Performance||cycle',
  name_en = 'Performance||cycle'
WHERE code = 'process_performance_cycle_v2';

UPDATE dashboard_presets SET
  name_it = 'Learning||paths',
  name_en = 'Learning||paths'
WHERE code = 'process_learning_paths_v2';

-- =====================================================================
-- process_recruiting_funnel_v2 — 10 elements
-- =====================================================================

DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
  _layout_split BIGINT;
  _panel_main BIGINT;
  _panel_side BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'process_recruiting_funnel_v2';
  IF _preset_id IS NULL THEN RAISE EXCEPTION 'preset process_recruiting_funnel_v2 not found'; END IF;

  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  -- Hero strip: LayoutKpiRing + 4 KpiRing
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''OPEN REQ''::text AS label, COALESCE((SELECT COUNT(*)::int FROM recruiting_requisitions WHERE tenant_id = current_tenant_id() AND status IN (''open'',''in_progress'')), 0) AS value, ''active requisitions''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 4, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''CANDIDATES''::text AS label, COALESCE((SELECT COUNT(*)::int FROM recruiting_candidates WHERE tenant_id = current_tenant_id() AND stage NOT IN (''hired'',''rejected'',''withdrawn'')), 0) AS value, ''in pipeline''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 7, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH h AS (SELECT EXTRACT(DAY FROM (NOW() - created_at))::int AS days FROM recruiting_candidates WHERE tenant_id = current_tenant_id() AND stage = ''hired'' AND created_at > NOW() - INTERVAL ''180 days'') SELECT ''TIME-TO-HIRE''::text AS label, COALESCE(ROUND(AVG(days))::int, 0) AS value, ''d''::text AS unit, ''avg last 180d''::text AS sublabel FROM h"}}'::jsonb),
    (_preset_id, 'KpiRing', 4, 10, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH o AS (SELECT COUNT(*) FILTER (WHERE stage = ''offer_accepted'')::int AS accepted, COUNT(*) FILTER (WHERE stage IN (''offered'',''offer_accepted'',''offer_rejected''))::int AS total FROM recruiting_candidates WHERE tenant_id = current_tenant_id()) SELECT ''OFFER ACC.''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * accepted / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''acceptance rate''::text AS sublabel FROM o"}}'::jsonb);

  -- Body principal: LayoutMainSplit + 2 panel
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutMainSplit', 2, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 1, 1, 8, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_main;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 2, 9, 4, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_side;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_main,
     '{"title":"Candidates per stage","data_source":{"type":"sql","ttl":60,"query":"SELECT stage AS label, COUNT(*)::int AS value FROM recruiting_candidates WHERE tenant_id = current_tenant_id() GROUP BY stage ORDER BY CASE stage WHEN ''applied'' THEN 1 WHEN ''screened'' THEN 2 WHEN ''interviewed'' THEN 3 WHEN ''offered'' THEN 4 WHEN ''offer_accepted'' THEN 5 WHEN ''hired'' THEN 6 ELSE 99 END"}}'::jsonb),
    (_preset_id, 'ActivityFeed', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_side,
     '{"title":"Recruiting activity","data_source":{"type":"sql","ttl":60,"query":"SELECT id::text AS id, ''recruiting''::text AS category, ''Candidate ''|| first_name || '' '' || last_name || '' moved to '' || stage AS title, created_at AS \"timestamp\" FROM recruiting_candidates WHERE tenant_id = current_tenant_id() ORDER BY created_at DESC LIMIT 10"}}'::jsonb);

  -- Secondary: SkillHeatmap (no parent)
  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'SkillHeatmap', 3, 1, 12, 1, 1, 3, 'PROCESS', NULL,
     '{"title":"Skill coverage candidate pool","data_source":{"type":"static","value":{"unavailable":true,"reason":"Schema candidate_skills mapping not yet wired"}}}'::jsonb);
END $$;

-- =====================================================================
-- process_onboarding_flow_v2 — 10 elements
-- =====================================================================

DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
  _layout_split BIGINT;
  _panel_main BIGINT;
  _panel_side BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'process_onboarding_flow_v2';
  IF _preset_id IS NULL THEN RAISE EXCEPTION 'preset process_onboarding_flow_v2 not found'; END IF;

  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''NEW HIRES 90d''::text AS label, COALESCE((SELECT COUNT(*)::int FROM employees WHERE tenant_id = current_tenant_id() AND hired_at > NOW() - INTERVAL ''90 days''), 0) AS value, ''last 90 days''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 4, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''TASKS OPEN''::text AS label, COALESCE((SELECT COUNT(t.*)::int FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() AND t.status NOT IN (''completed'',''cancelled'')), 0) AS value, ''onboarding tasks open''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 7, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH d AS (SELECT COUNT(*) FILTER (WHERE d.status = ''verified'')::int AS verified_n, COUNT(*)::int AS total_n FROM onboarding_documents d JOIN onboarding_instances i ON i.id = d.instance_id WHERE i.tenant_id = current_tenant_id()) SELECT ''DOCS''::text AS label, CASE WHEN total_n > 0 THEN ROUND(100.0 * verified_n / total_n)::int ELSE 0 END AS value, ''%''::text AS unit, ''documents verified''::text AS sublabel FROM d"}}'::jsonb),
    (_preset_id, 'KpiRing', 4, 10, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''COMPLETION''::text AS label, COALESCE((SELECT ROUND(AVG(progress_percent))::int FROM onboarding_instances WHERE tenant_id = current_tenant_id() AND actual_completion_date IS NULL), 0) AS value, ''%''::text AS unit, ''avg progress active''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutMainSplit', 2, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 1, 1, 8, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_main;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 2, 9, 4, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_side;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_main,
     '{"title":"Onboarding tasks by status","data_source":{"type":"sql","ttl":60,"query":"SELECT t.status AS label, COUNT(t.*)::int AS value FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() GROUP BY t.status ORDER BY t.status"}}'::jsonb),
    (_preset_id, 'IntegrationHealthPill', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_side,
     '{"title":"HRIS sync health","data_source":{"type":"static","value":{"unavailable":true,"reason":"HRIS integration metric not yet wired"}}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'ActivityFeed', 3, 1, 12, 1, 1, 3, 'PROCESS', NULL,
     '{"title":"Recent onboarding activity","data_source":{"type":"sql","ttl":60,"query":"SELECT t.id::text AS id, ''onboarding''::text AS category, ''Task '' || COALESCE(t.title, ''(no title)'') || '' '' || t.status AS title, COALESCE(t.completed_at, t.updated_at, t.created_at) AS \"timestamp\" FROM onboarding_tasks t JOIN onboarding_instances i ON i.id = t.instance_id WHERE i.tenant_id = current_tenant_id() ORDER BY COALESCE(t.completed_at, t.updated_at, t.created_at) DESC NULLS LAST LIMIT 10"}}'::jsonb);
END $$;

-- =====================================================================
-- process_performance_cycle_v2 — 10 elements
-- =====================================================================

DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
  _layout_split BIGINT;
  _panel_main BIGINT;
  _panel_side BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'process_performance_cycle_v2';
  IF _preset_id IS NULL THEN RAISE EXCEPTION 'preset process_performance_cycle_v2 not found'; END IF;

  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH c AS (SELECT COUNT(*) FILTER (WHERE status = ''completed'')::int AS done, COUNT(*)::int AS total FROM review_cycle_participants WHERE tenant_id = current_tenant_id()) SELECT ''CYCLE PROGRESS''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''completion''::text AS sublabel FROM c"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 4, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''AVG RATING''::text AS label, COALESCE(ROUND(AVG(overall_rating)::numeric, 1)::float, 0) AS value, ''out of 5''::text AS sublabel FROM performance_reviews WHERE tenant_id = current_tenant_id() AND overall_rating IS NOT NULL"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 7, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''VARIANCE''::text AS label, COALESCE(ROUND(STDDEV(overall_rating)::numeric, 2)::float, 0) AS value, ''rating stddev''::text AS sublabel FROM performance_reviews WHERE tenant_id = current_tenant_id() AND overall_rating IS NOT NULL"}}'::jsonb),
    (_preset_id, 'KpiRing', 4, 10, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH r AS (SELECT COUNT(*) FILTER (WHERE calibrated_at IS NOT NULL)::int AS done, COUNT(*)::int AS total FROM performance_reviews WHERE tenant_id = current_tenant_id()) SELECT ''CALIBRATION''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''reviews calibrated''::text AS sublabel FROM r"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutMainSplit', 2, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 1, 1, 8, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_main;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 2, 9, 4, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_side;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_main,
     '{"title":"Reviews by status","data_source":{"type":"sql","ttl":60,"query":"SELECT status AS label, COUNT(*)::int AS value FROM review_cycle_participants WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status"}}'::jsonb),
    (_preset_id, 'ActivityFeed', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_side,
     '{"title":"Performance activity","data_source":{"type":"sql","ttl":60,"query":"SELECT id::text AS id, ''performance''::text AS category, ''Review status: '' || status AS title, COALESCE(updated_at, created_at) AS \"timestamp\" FROM review_cycle_participants WHERE tenant_id = current_tenant_id() ORDER BY COALESCE(updated_at, created_at) DESC NULLS LAST LIMIT 10"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'CapabilityRadar', 3, 1, 12, 1, 1, 3, 'PROCESS', NULL,
     '{"title":"Capability radar aggregato cycle","data_source":{"type":"static","value":{"unavailable":true,"reason":"Skill rating per category aggregation needs Phase 2 query module"}}}'::jsonb);
END $$;

-- =====================================================================
-- process_learning_paths_v2 — 10 elements
-- =====================================================================

DO $$
DECLARE
  _preset_id BIGINT;
  _layout_kpi BIGINT;
  _layout_split BIGINT;
  _panel_main BIGINT;
  _panel_side BIGINT;
BEGIN
  SELECT id INTO _preset_id FROM dashboard_presets WHERE code = 'process_learning_paths_v2';
  IF _preset_id IS NULL THEN RAISE EXCEPTION 'preset process_learning_paths_v2 not found'; END IF;

  DELETE FROM dashboard_elements WHERE dashboard_preset_id = _preset_id;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutKpiRing', 1, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_kpi;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'KpiRing', 1, 1, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''ACTIVE PATHS''::text AS label, COALESCE((SELECT COUNT(*)::int FROM learning_paths WHERE tenant_id = current_tenant_id() AND is_active = true), 0) AS value, ''available paths''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 2, 4, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''ENROLLMENTS''::text AS label, COALESCE((SELECT COUNT(*)::int FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() AND status NOT IN (''completed'',''cancelled'')), 0) AS value, ''active enrollments''::text AS sublabel"}}'::jsonb),
    (_preset_id, 'KpiRing', 3, 7, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"WITH e AS (SELECT COUNT(*) FILTER (WHERE status = ''completed'')::int AS done, COUNT(*)::int AS total FROM learning_path_enrollments WHERE tenant_id = current_tenant_id()) SELECT ''COMPLETION''::text AS label, CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE 0 END AS value, ''%''::text AS unit, ''completion rate''::text AS sublabel FROM e"}}'::jsonb),
    (_preset_id, 'KpiRing', 4, 10, 3, 1, 1, 3, 'PROCESS', _layout_kpi,
     '{"data_source":{"type":"sql","ttl":60,"query":"SELECT ''CERTIFICATIONS''::text AS label, COALESCE((SELECT COUNT(*)::int FROM certifications WHERE tenant_id = current_tenant_id() AND is_active = true), 0) AS value, ''active certifications''::text AS sublabel"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutMainSplit', 2, 1, 12, 1, 1, 3, 'PROCESS', NULL)
  RETURNING id INTO _layout_split;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 1, 1, 8, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_main;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id)
  VALUES (_preset_id, 'LayoutPanel', 2, 9, 4, 1, 1, 3, 'PROCESS', _layout_split)
  RETURNING id INTO _panel_side;

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'Histogram', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_main,
     '{"title":"Enrollments by status","data_source":{"type":"sql","ttl":60,"query":"SELECT status AS label, COUNT(*)::int AS value FROM learning_path_enrollments WHERE tenant_id = current_tenant_id() GROUP BY status ORDER BY status"}}'::jsonb),
    (_preset_id, 'ActivityFeed', 1, 1, 12, 1, 1, 3, 'PROCESS', _panel_side,
     '{"title":"Learning activity","data_source":{"type":"sql","ttl":60,"query":"SELECT lpe.id::text AS id, ''learning''::text AS category, ''Enrollment '' || COALESCE(lp.title_it, lp.code, ''(no title)'') || '': '' || lpe.status AS title, COALESCE(lpe.completed_at, lpe.started_at, lpe.created_at) AS \"timestamp\" FROM learning_path_enrollments lpe LEFT JOIN learning_paths lp ON lp.id = lpe.learning_path_id WHERE lpe.tenant_id = current_tenant_id() ORDER BY COALESCE(lpe.completed_at, lpe.started_at, lpe.created_at) DESC NULLS LAST LIMIT 10"}}'::jsonb);

  INSERT INTO dashboard_elements (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, visibility_min_role, perspective_code, parent_element_id, config_overrides)
  VALUES
    (_preset_id, 'SkillHeatmap', 3, 1, 12, 1, 1, 3, 'PROCESS', NULL,
     '{"title":"Skill coverage da training","data_source":{"type":"static","value":{"unavailable":true,"reason":"Skill × dept × training-completion pivot needs Phase 2 query module"}}}'::jsonb);
END $$;

-- =====================================================================
-- Verification
-- =====================================================================

DO $$
DECLARE
  _count INTEGER;
BEGIN
  SELECT COUNT(*) INTO _count FROM dashboard_elements WHERE dashboard_preset_id IN (
    SELECT id FROM dashboard_presets WHERE code IN (
      'process_recruiting_funnel_v2',
      'process_onboarding_flow_v2',
      'process_performance_cycle_v2',
      'process_learning_paths_v2'
    )
  );
  RAISE NOTICE 'phase19a re-seed complete: 4 process_*_v2 presets now have % dashboard_elements (expected 44)', _count;
  IF _count <> 44 THEN
    RAISE EXCEPTION 'phase19a verification failed: expected 44 elements, got %', _count;
  END IF;
END $$;

COMMIT;
