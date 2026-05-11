-- Phase 18g DOWN — rollback F-008 Audience: persona_label rename
-- Restore previous mock identities per dashboard_presets

BEGIN;

UPDATE dashboard_presets SET persona_label = 'SUPERUSER · G6', updated_at = now()
  WHERE code = 'cross_tenant_overview_v2';

UPDATE dashboard_presets SET persona_label = 'TENANT_OWNER · G6', updated_at = now()
  WHERE code = 'tenant_owner_overview_v2';

UPDATE dashboard_presets SET persona_label = 'IT Admin · G6 smoke', updated_at = now()
  WHERE code = 'org_systems_v2';

UPDATE dashboard_presets SET persona_label = 'HR Director · G6 smoke', updated_at = now()
  WHERE code = 'hr_director_overview_v2';

UPDATE dashboard_presets SET persona_label = 'HR_MANAGER · G6', updated_at = now()
  WHERE code = 'skills_heatmap_v2';

UPDATE dashboard_presets SET persona_label = 'DEPT_HEAD · G6', updated_at = now()
  WHERE code = 'capability_graph_v2';

UPDATE dashboard_presets SET persona_label = 'LINE_MANAGER + EMPLOYEE · G6', updated_at = now()
  WHERE code = 'employee_journey_v2';

UPDATE dashboard_presets SET persona_label = 'Recruiter', updated_at = now()
  WHERE code = 'process_recruiting_funnel';

UPDATE dashboard_presets SET persona_label = 'Ops Manager', updated_at = now()
  WHERE code = 'process_onboarding_flow';

UPDATE dashboard_presets SET persona_label = 'Line Manager', updated_at = now()
  WHERE code = 'process_performance_cycle';

UPDATE dashboard_presets SET persona_label = 'L&D + EMP', updated_at = now()
  WHERE code = 'process_learning_paths';

DELETE FROM schema_migrations WHERE version = 'phase18g_audience_persona_label';

COMMIT;
