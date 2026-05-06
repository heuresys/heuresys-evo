-- =============================================================================
-- Seed: Phase 13.B — dashboard_presets + dashboard_elements
-- Date: 2026-05-06
-- =============================================================================
-- Inserts 9 Tier 1 dashboard preset:
--   - 5 existing TALENT/ENTERPRISE (Phase 9 mockup, published=TRUE)
--   - 4 PROCESS placeholder (pending Phase 13.D mockup, published=FALSE)
-- Plus minimal dashboard_elements binding per preset (3-5 widgets each)
-- referencing the 8 atomic component family TIER 17 (Phase 13.A) by widget_code.
--
-- Idempotent: ON CONFLICT (code) DO UPDATE for presets; element re-seed wipes
-- platform defaults (tenant_id IS NULL) per preset before re-insert.
--
-- Plan ref: ~/.claude/plans/credo-che-se-tu-jazzy-key.md § Phase 13.B
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- dashboard_presets — 9 Tier 1 entries
-- -----------------------------------------------------------------------------
INSERT INTO dashboard_presets
  (code, name_it, name_en, description_it, description_en, perspective_code,
   source_mockup_path, persona_label, is_published, sort_order)
VALUES
  -- 5 existing (Phase 9 mockup, published)
  ('hr_director_overview',
   'Vista Direzione HR',
   'HR Director Overview',
   'Vista CHRO con KPI capability + skill gap matrix + activity feed live + succession ready.',
   'CHRO view with capability KPI + skill gap matrix + live activity feed + succession ready.',
   'TALENT',
   '.ux-design/06-mockups/dashboards/hr-director-overview.html',
   'Maria CHRO · RTL Bank',
   TRUE, 10),

  ('capability_graph',
   'Knowledge Graph Capability',
   'Capability Graph',
   'Topologia KG ESCO + ontology breakdown + top entities by edge density + ESCO sync status.',
   'ESCO KG topology + ontology breakdown + top entities by edge density + ESCO sync status.',
   'ENTERPRISE',
   '.ux-design/06-mockups/dashboards/capability-graph.html',
   'Davide IT · RTL Bank',
   TRUE, 20),

  ('skills_heatmap',
   'Mappa di calore Competenze',
   'Skills Heatmap',
   'Matrice 8 dipartimenti × 12 skill con filtri + distribuzione + lista critica.',
   '8 dept × 12 skill matrix with filters + distribution histogram + critical list.',
   'TALENT',
   '.ux-design/06-mockups/dashboards/skills-heatmap.html',
   'Maria CHRO · RTL Bank',
   TRUE, 30),

  ('employee_journey',
   'Percorso Dipendente',
   'Employee Journey',
   'Profile hero + career arc 5-stage + skill evolution 4q + capability radar + bridging suggestions.',
   'Profile hero + 5-stage career arc + 4q skill evolution + capability radar + bridging suggestions.',
   'TALENT',
   '.ux-design/06-mockups/dashboards/employee-journey.html',
   'Andrea EMP · RTL Bank',
   TRUE, 40),

  ('org_systems',
   'Organizzazione e Sistemi',
   'Organization & Systems',
   '4 tenant fleet + RBAC matrix + integration health + audit log live + system metrics.',
   '4 tenant fleet + RBAC matrix + integration health + live audit log + system metrics.',
   'ENTERPRISE',
   '.ux-design/06-mockups/dashboards/org-systems.html',
   'Davide IT · Heuresys System',
   TRUE, 50),

  -- 4 PROCESS placeholder (Phase 13.D pending, NOT published)
  ('process_recruiting_funnel',
   'Funnel Recruiting',
   'Recruiting Funnel',
   'Funnel 5-stage + ageing + bottleneck identification.',
   '5-stage funnel + ageing + bottleneck identification.',
   'PROCESS',
   '.ux-design/06-mockups/dashboards/process-recruiting-funnel.html',
   'Recruiter',
   FALSE, 60),

  ('process_onboarding_flow',
   'Flusso Onboarding',
   'Onboarding Flow',
   'Kanban + first-90-day milestones + checklist completion.',
   'Kanban + first-90-day milestones + checklist completion.',
   'PROCESS',
   '.ux-design/06-mockups/dashboards/process-onboarding-flow.html',
   'Ops Manager',
   FALSE, 70),

  ('process_performance_cycle',
   'Ciclo Performance',
   'Performance Cycle',
   'OKR radial + 360 status + calibration heatmap.',
   'OKR radial + 360 status + calibration heatmap.',
   'PROCESS',
   '.ux-design/06-mockups/dashboards/process-performance-cycle.html',
   'Line Manager',
   FALSE, 80),

  ('process_learning_paths',
   'Percorsi Apprendimento',
   'Learning Paths',
   'Enrollment funnel + completion + skill-uplift bridge.',
   'Enrollment funnel + completion + skill-uplift bridge.',
   'PROCESS',
   '.ux-design/06-mockups/dashboards/process-learning-paths.html',
   'L&D + EMP',
   FALSE, 90)

ON CONFLICT (code) DO UPDATE SET
  name_it            = EXCLUDED.name_it,
  name_en            = EXCLUDED.name_en,
  description_it     = EXCLUDED.description_it,
  description_en     = EXCLUDED.description_en,
  perspective_code   = EXCLUDED.perspective_code,
  source_mockup_path = EXCLUDED.source_mockup_path,
  persona_label      = EXCLUDED.persona_label,
  is_published       = EXCLUDED.is_published,
  sort_order         = EXCLUDED.sort_order,
  updated_at         = now();

-- -----------------------------------------------------------------------------
-- dashboard_elements — minimal platform defaults (tenant_id IS NULL)
-- Idempotent: wipe platform-default elements per preset, re-insert.
-- -----------------------------------------------------------------------------
DELETE FROM dashboard_elements
 WHERE tenant_id IS NULL
   AND dashboard_preset_id IN (
     SELECT id FROM dashboard_presets
      WHERE code IN (
        'hr_director_overview', 'capability_graph', 'skills_heatmap',
        'employee_journey', 'org_systems',
        'process_recruiting_funnel', 'process_onboarding_flow',
        'process_performance_cycle', 'process_learning_paths'
      )
   );

-- 5 + 4 preset elements (3-5 widgets each), reusing TIER 17 atomic component widget_code

-- hr_director_overview (4 widgets)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'TALENT', 6
  FROM dashboard_presets, (VALUES
    ('KpiRing',          1,  1, 4, 1, 1),
    ('SuccessionCard',   2,  5, 4, 1, 2),
    ('SkillHeatmap',     3,  1, 8, 2, 2),
    ('IntegrationHealthPill', 4, 9, 4, 1, 1)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'hr_director_overview';

-- capability_graph (3 widgets)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'ENTERPRISE', 1
  FROM dashboard_presets, (VALUES
    ('KgMiniGraph',      1,  1, 8, 1, 3),
    ('IntegrationHealthPill', 2, 9, 4, 1, 1),
    ('KpiRing',          3,  9, 4, 2, 2)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'capability_graph';

-- skills_heatmap (3 widgets)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'TALENT', 3
  FROM dashboard_presets, (VALUES
    ('KpiRing',          1,  1, 3, 1, 1),
    ('SkillHeatmap',     2,  1, 12, 2, 3),
    ('IntegrationHealthPill', 3, 4, 9, 1, 1)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'skills_heatmap';

-- employee_journey (4 widgets)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'TALENT', 6
  FROM dashboard_presets, (VALUES
    ('KpiRing',          1,  1, 4, 1, 1),
    ('CareerArc',        2,  1, 12, 2, 1),
    ('CapabilityRadar',  3,  1, 6, 3, 2),
    ('KgMiniGraph',      4,  7, 6, 3, 2)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'employee_journey';

-- org_systems (4 widgets)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'ENTERPRISE', 1
  FROM dashboard_presets, (VALUES
    ('KpiRing',          1,  1, 4, 1, 1),
    ('RbacMatrix',       2,  1, 8, 2, 3),
    ('IntegrationHealthPill', 3, 9, 4, 1, 2),
    ('KpiRing',          4,  9, 4, 4, 1)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'org_systems';

-- process_recruiting_funnel (3 widgets, placeholder)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'PROCESS', 5
  FROM dashboard_presets, (VALUES
    ('KpiRing',          1,  1, 4, 1, 1),
    ('CareerArc',        2,  1, 12, 2, 1),
    ('SkillHeatmap',     3,  1, 12, 3, 2)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'process_recruiting_funnel';

-- process_onboarding_flow (3 widgets, placeholder)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'PROCESS', 4
  FROM dashboard_presets, (VALUES
    ('CareerArc',        1,  1, 12, 1, 1),
    ('IntegrationHealthPill', 2, 1, 6, 2, 1),
    ('KpiRing',          3,  7, 6, 2, 1)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'process_onboarding_flow';

-- process_performance_cycle (3 widgets, placeholder)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'PROCESS', 5
  FROM dashboard_presets, (VALUES
    ('KpiRing',          1,  1, 4, 1, 1),
    ('CapabilityRadar',  2,  5, 4, 1, 2),
    ('SkillHeatmap',     3,  1, 12, 3, 2)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'process_performance_cycle';

-- process_learning_paths (3 widgets, placeholder)
INSERT INTO dashboard_elements
  (dashboard_preset_id, widget_code, position, grid_col_start, grid_col_span, grid_row_start, grid_row_span, perspective_code, visibility_min_role)
SELECT id, w.widget_code, w.position, w.col_start, w.col_span, w.row_start, w.row_span, 'PROCESS', 6
  FROM dashboard_presets, (VALUES
    ('CareerArc',        1,  1, 12, 1, 1),
    ('SkillHeatmap',     2,  1, 8, 2, 2),
    ('SuccessionCard',   3,  9, 4, 2, 2)
  ) AS w(widget_code, position, col_start, col_span, row_start, row_span)
 WHERE dashboard_presets.code = 'process_learning_paths';

COMMIT;
