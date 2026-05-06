-- =============================================================================
-- Seed: Phase 14.A — Live data binding (PoC: KpiRing in hr_director_overview)
-- Date: 2026-05-07
-- =============================================================================
-- Populates dashboard_elements.config_overrides.data_source for the first
-- KpiRing in hr_director_overview, demonstrating end-to-end live data binding
-- via the new dashboard-engine prefetch pipeline (data-fetcher → adapters →
-- registry KpiRing Live wrapper).
--
-- Sprint 1 follow-up (14.A.4): replicate the pattern across the 8 remaining
-- KpiRing instances (capability_graph, skills_heatmap, employee_journey,
-- org_systems, 4 PROCESS) plus the 7 other widget codes once their adapters
-- land (SuccessionCard, CareerArc, etc.).
--
-- Idempotent: UPDATE-by-key, safe to re-run. Pattern: nested JSONB writes
-- only the data_source key, preserving any other config_overrides.
--
-- Plan ref: ~/.claude/plans/phase14-sprint1-foundation.md § 14.A
-- =============================================================================

BEGIN;

-- hr_director_overview · KpiRing · position 1
-- Query returns a single row with {value, label, sublabel, unit} matching the
-- KpiRing adapter contract in services/app/src/lib/dashboard-engine/adapters.ts.
-- RLS will scope counts to the current tenant via app.current_tenant_id GUC.
UPDATE dashboard_elements
   SET config_overrides = jsonb_set(
       COALESCE(config_overrides, '{}'::jsonb),
       '{data_source}',
       jsonb_build_object(
         'type',  'sql',
         'query', $$SELECT count(*)::int AS value,
                          'Active employees' AS label,
                          'tenant-scoped · live' AS sublabel
                     FROM employees
                    WHERE is_active = true$$,
         'ttl',   60
       ),
       true
     )
 WHERE dashboard_preset_id = (SELECT id FROM dashboard_presets WHERE code = 'hr_director_overview')
   AND widget_code = 'KpiRing'
   AND position = 1
   AND tenant_id IS NULL;

-- Verification: surface the updated rows for the operator
SELECT dp.code AS preset, de.position, de.widget_code,
       de.config_overrides->'data_source'->>'type' AS source_type,
       length(de.config_overrides->'data_source'->>'query') AS query_len,
       (de.config_overrides->'data_source'->>'ttl')::int AS ttl_s
  FROM dashboard_elements de
  JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
 WHERE dp.code = 'hr_director_overview'
   AND de.widget_code = 'KpiRing'
   AND de.position = 1;

COMMIT;
