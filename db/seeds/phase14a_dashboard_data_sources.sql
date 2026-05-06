-- =============================================================================
-- Seed: Phase 14.A — Live data binding (KpiRing + IntegrationHealthPill across all 9 presets)
-- Date: 2026-05-07
-- =============================================================================
-- Populates dashboard_elements.config_overrides.data_source for the simple-shape
-- widgets (KpiRing, IntegrationHealthPill). Composite widgets (SuccessionCard,
-- CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar, RbacMatrix) keep their
-- Demo fallback until Sprint 1 follow-up adds their real SQL queries.
--
-- Coverage:
--   - 8 KpiRing instances across hr_director_overview, capability_graph,
--     skills_heatmap, employee_journey, org_systems (×2), 4 PROCESS preset
--   - 4 IntegrationHealthPill instances (one per non-PROCESS preset that has it)
--
-- All queries SELECT only (allowlist enforced in data-fetcher). RLS via
-- withTenant() scopes counts to the calling user's tenant.
--
-- Idempotent: nested jsonb_set preserves any other config_overrides keys.
--
-- Plan ref: ~/.claude/plans/phase14-sprint1-foundation.md § 14.A
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Helper macro: UPDATE config_overrides.data_source for a (preset_code, widget_code, position) triplet.
-- Implemented inline below — Postgres has no PL/pgSQL DO macros simpler than this.
-- -----------------------------------------------------------------------------

-- ============================================================================
-- KpiRing — live count queries (8 instances across all preset)
-- ============================================================================

-- 1. hr_director_overview · KpiRing · pos 1 → active employees
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 60,
         'query', $$SELECT count(*)::int AS value,
                          'Active employees' AS label,
                          'tenant-scoped · live' AS sublabel
                     FROM employees WHERE is_active = true$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'hr_director_overview')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- 2. capability_graph · KpiRing · pos 3 → ESCO skills count
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 300,
         'query', $$SELECT count(*)::int AS value,
                          'ESCO skills' AS label,
                          'platform catalog' AS sublabel
                     FROM esco_skills$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'capability_graph')
   AND widget_code = 'KpiRing' AND position = 3 AND tenant_id IS NULL;

-- 3. skills_heatmap · KpiRing · pos 1 → distinct skill assignments
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 120,
         'query', $$SELECT count(*)::int AS value,
                          'Skill assignments' AS label,
                          'all employees' AS sublabel
                     FROM employee_skills$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'skills_heatmap')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- 4. employee_journey · KpiRing · pos 1 → personal stub (count assignments per current user not feasible without user_id; fallback to tenant employees)
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 60,
         'query', $$SELECT count(*)::int AS value,
                          'Tenant headcount' AS label,
                          'all employees' AS sublabel
                     FROM employees$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'employee_journey')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- 5. org_systems · KpiRing · pos 1 → tenant count (platform-wide, IT_ADMIN+ visibility already enforced in preset)
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 600,
         'query', $$SELECT count(*)::int AS value,
                          'Active tenants' AS label,
                          'platform-wide' AS sublabel
                     FROM tenants WHERE deleted_at IS NULL$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'org_systems')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- 6. org_systems · KpiRing · pos 4 → audit log entries today
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 60,
         'query', $$SELECT count(*)::int AS value,
                          'Audit events 24h' AS label,
                          'platform activity' AS sublabel
                     FROM audit_logs WHERE created_at > now() - interval '24 hours'$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'org_systems')
   AND widget_code = 'KpiRing' AND position = 4 AND tenant_id IS NULL;

-- 7. process_recruiting_funnel · KpiRing · pos 1 → open requisitions (if table exists)
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 120,
         'query', $$SELECT count(*)::int AS value,
                          'Open requisitions' AS label,
                          'recruiting pipeline' AS sublabel
                     FROM requisitions WHERE status = 'open'$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_recruiting_funnel')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- 8. process_onboarding_flow · KpiRing · pos 1 → new hires (last 90d) — placeholder using employees
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'sql', 'ttl', 300,
         'query', $$SELECT count(*)::int AS value,
                          'New hires 90d' AS label,
                          'onboarding cohort' AS sublabel
                     FROM employees WHERE hire_date > current_date - interval '90 days'$$),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'process_onboarding_flow')
   AND widget_code = 'KpiRing' AND position = 1 AND tenant_id IS NULL;

-- ============================================================================
-- IntegrationHealthPill — static tone (until real telemetry endpoint lands · Sprint 2 · F)
-- ============================================================================

-- hr_director_overview · IntegrationHealthPill · pos 4
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object('tone', 'ok', 'label', 'HR API'))),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'hr_director_overview')
   AND widget_code = 'IntegrationHealthPill' AND position = 4 AND tenant_id IS NULL;

-- capability_graph · IntegrationHealthPill · pos 2
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object('tone', 'info', 'label', 'ESCO sync'))),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'capability_graph')
   AND widget_code = 'IntegrationHealthPill' AND position = 2 AND tenant_id IS NULL;

-- skills_heatmap · IntegrationHealthPill · pos 3
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object('tone', 'warn', 'label', 'Gap alert', 'pulse', true))),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'skills_heatmap')
   AND widget_code = 'IntegrationHealthPill' AND position = 3 AND tenant_id IS NULL;

-- org_systems · IntegrationHealthPill · pos 3
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb), '{data_source}',
       jsonb_build_object('type', 'static',
         'value', jsonb_build_array(jsonb_build_object('tone', 'ok', 'label', 'All systems'))),
       true)
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'org_systems')
   AND widget_code = 'IntegrationHealthPill' AND position = 3 AND tenant_id IS NULL;

-- ============================================================================
-- Verification report
-- ============================================================================
SELECT dp.code AS preset, de.position, de.widget_code,
       de.config_overrides->'data_source'->>'type' AS source_type,
       (de.config_overrides->'data_source'->>'ttl')::int AS ttl_s,
       length(de.config_overrides->'data_source'->>'query') AS query_len
  FROM dashboard_elements de
  JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
 WHERE de.config_overrides ? 'data_source'
 ORDER BY dp.sort_order, de.position;

COMMIT;
