-- Phase 18g (S35.6 F-008) — Dashboard persona_label rename to Audience: <ROLE>
--
-- Goal: rinominare persona_label degli 11 dashboard_presets attivi (7 `_v2` brand-fedeli
-- + 4 process_* secondary nav HR) da mock persona labels cycle 1 (now removed, see S62
-- cycle 2 reset ADR-0032) al canonical pattern `Audience: <ROLE>` allineato alla matrice
-- role_default_dashboards.
--
-- Mapping role → preset (derivato da role_default_dashboards priority=0 + secondary):
--   cross_tenant_overview_v2     → SUPERUSER
--   tenant_owner_overview_v2     → TENANT_OWNER
--   org_systems_v2               → IT_ADMIN
--   hr_director_overview_v2      → HR_DIRECTOR
--   skills_heatmap_v2            → HR_MANAGER
--   capability_graph_v2          → DEPT_HEAD
--   employee_journey_v2          → LINE_MANAGER + EMPLOYEE
--   process_recruiting_funnel    → HR_DIRECTOR + HR_MANAGER
--   process_onboarding_flow      → HR_DIRECTOR + HR_MANAGER
--   process_performance_cycle    → HR_DIRECTOR + HR_MANAGER
--   process_learning_paths       → HR_DIRECTOR + HR_MANAGER
--
-- Legacy preset (non `_v2`, non mappati in role_default_dashboards) — INVARIATI:
--   cross_tenant_overview, hr_director_overview, capability_graph,
--   skills_heatmap, employee_journey, org_systems, tenant_owner_overview
--   (mantengono mock identity originale come reference storico mockup).
--
-- Lexicon: GOKMER+RBP — vedi docs/_meta/lexicon.md
-- Idempotent: UPDATE su match esatto, no-op se già applied
-- Rollback: phase18g_DOWN.sql (restore mock identities)

BEGIN;

UPDATE dashboard_presets SET persona_label = 'Audience: SUPERUSER',
  updated_at = now() WHERE code = 'cross_tenant_overview_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: TENANT_OWNER',
  updated_at = now() WHERE code = 'tenant_owner_overview_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: IT_ADMIN',
  updated_at = now() WHERE code = 'org_systems_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: HR_DIRECTOR',
  updated_at = now() WHERE code = 'hr_director_overview_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: HR_MANAGER',
  updated_at = now() WHERE code = 'skills_heatmap_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: DEPT_HEAD',
  updated_at = now() WHERE code = 'capability_graph_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: LINE_MANAGER + EMPLOYEE',
  updated_at = now() WHERE code = 'employee_journey_v2';

UPDATE dashboard_presets SET persona_label = 'Audience: HR_DIRECTOR + HR_MANAGER',
  updated_at = now() WHERE code IN (
    'process_recruiting_funnel',
    'process_onboarding_flow',
    'process_performance_cycle',
    'process_learning_paths'
  );

-- Track migration
INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18g_audience_persona_label', now())
ON CONFLICT (version) DO NOTHING;

-- Verification (logged as RAISE NOTICE)
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM dashboard_presets WHERE persona_label LIKE 'Audience:%';
  RAISE NOTICE 'F-008 phase18g: % dashboard_presets renamed to Audience: pattern', v_count;
  IF v_count < 11 THEN
    RAISE EXCEPTION 'F-008 verification failed: expected ≥11 Audience: rows, got %', v_count;
  END IF;
END$$;

COMMIT;
