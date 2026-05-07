-- Phase 14.C — Composite widget data sources: static → sql binding.
--
-- Migrates 8 dashboard_elements with type='static' composite seed (phase14b)
-- to type='sql' live queries. Result shape is preserved exactly so adapter
-- normalization (services/app/src/lib/dashboard-engine/adapters.ts) keeps
-- working without changes; the data-fetcher try/catch returns null on SQL
-- failure so the client falls back to the demo widget gracefully.
--
-- One element uses a real cross-relational query (RbacMatrix on org_systems —
-- joins rbp_roles × rbp_functional_areas × rbp_role_permissions).
-- The other 7 use "SQL static-via-SELECT" that returns the same shape as the
-- phase14b inline JSON, allowing future incremental replacement with
-- aggregations against employees / esco_* / skill_clusters without further
-- schema or adapter changes.
--
-- Idempotent: re-running converges to the same target state. Reverts are
-- possible by re-applying phase14b_dashboard_composite_static.sql.

BEGIN;

-- 46 — org_systems · RbacMatrix · REAL SQL (rbp_*)
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        (SELECT jsonb_agg(jsonb_build_object('id', code, 'label', name, 'level', hierarchy_level) ORDER BY hierarchy_level)
         FROM rbp_roles
         WHERE hierarchy_level BETWEEN -1 AND 6) AS roles,
        (SELECT jsonb_agg(jsonb_build_object('id', code, 'label', COALESCE(name_en, name)))
         FROM (SELECT code, name, name_en, sort_order FROM rbp_functional_areas WHERE is_active = true ORDER BY sort_order, code LIMIT 8) a) AS areas,
        (SELECT jsonb_agg(jsonb_build_object(
                  'roleId', r.code,
                  'areaId', fa.code,
                  'permission', CASE
                    WHEN rp.can_delete THEN 'admin'
                    WHEN rp.can_edit THEN 'edit'
                    WHEN rp.can_view THEN 'read'
                    ELSE 'none' END))
         FROM rbp_role_permissions rp
         JOIN rbp_roles r ON r.id = rp.role_id
         JOIN rbp_functional_areas fa ON fa.id = rp.functional_area_id
         WHERE r.hierarchy_level BETWEEN -1 AND 6
           AND fa.is_active = true
           AND fa.id IN (SELECT id FROM rbp_functional_areas WHERE is_active = true ORDER BY sort_order, code LIMIT 8)) AS assignments,
        true AS readonly
    $q$
  )
)
WHERE id = 46;

-- 35 — capability_graph · KgMiniGraph · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"finance","group":"domain","label":"Finance"},{"id":"risk","group":"domain","label":"Risk"},{"id":"compliance","group":"domain","label":"Compliance"},{"id":"sql","group":"tech","label":"SQL"},{"id":"python","group":"tech","label":"Python"},{"id":"leadership","group":"soft","label":"Leadership"},{"id":"comms","group":"soft","label":"Comms"}]'::jsonb AS nodes,
        '[{"id":"e1","source":"finance","target":"risk"},{"id":"e2","source":"risk","target":"compliance"},{"id":"e3","source":"finance","target":"sql"},{"id":"e4","source":"risk","target":"python"},{"id":"e5","source":"finance","target":"leadership"},{"id":"e6","source":"leadership","target":"comms"}]'::jsonb AS edges,
        '[{"id":"domain","label":"Domain"},{"id":"tech","label":"Tech"},{"id":"soft","label":"Soft"}]'::jsonb AS legend,
        'force' AS layout
    $q$
  )
)
WHERE id = 35;

-- 42 — employee_journey · CareerArc · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"1","year":"2018","label":"Junior Analyst"},{"id":"2","year":"2020","label":"Analyst"},{"id":"3","year":"2023","label":"Senior Analyst"},{"id":"4","year":"2026 →","label":"Lead"},{"id":"5","year":"2029+","label":"Head of"}]'::jsonb AS stages,
        2 AS "currentIndex"
    $q$
  )
)
WHERE id = 42;

-- 43 — employee_journey · CapabilityRadar · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"tech","label":"Tech"},{"id":"fin","label":"Finance"},{"id":"lead","label":"Lead"},{"id":"comm","label":"Comms"},{"id":"risk","label":"Risk"}]'::jsonb AS axes,
        '[{"id":"cur","label":"Current","values":[82,70,35,60,75]},{"id":"tgt","label":"Target","values":[75,80,70,80,85]}]'::jsonb AS series,
        100 AS max
    $q$
  )
)
WHERE id = 43;

-- 44 — employee_journey · KgMiniGraph (skill graph) · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"self","group":"self","label":"You"},{"id":"fin","group":"domain","label":"Finance"},{"id":"risk","group":"domain","label":"Risk"},{"id":"sql","group":"tech","label":"SQL"},{"id":"lead","group":"soft","label":"Leadership"}]'::jsonb AS nodes,
        '[{"id":"e1","source":"self","target":"fin"},{"id":"e2","source":"self","target":"risk"},{"id":"e3","source":"self","target":"sql"},{"id":"e4","source":"fin","target":"risk"},{"id":"e5","source":"lead","target":"self"}]'::jsonb AS edges,
        '[{"id":"self","label":"You"},{"id":"domain","label":"Domain"},{"id":"tech","label":"Tech"},{"id":"soft","label":"Soft"}]'::jsonb AS legend,
        'radial' AS layout
    $q$
  )
)
WHERE id = 44;

-- 50 — process_recruiting_funnel · CareerArc (funnel stages) · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"1","year":"12","label":"Sourced"},{"id":"2","year":"8","label":"Screened"},{"id":"3","year":"5","label":"Interviewed"},{"id":"4","year":"2","label":"Offer"},{"id":"5","year":"1","label":"Hired"}]'::jsonb AS stages,
        2 AS "currentIndex"
    $q$
  )
)
WHERE id = 50;

-- 51 — process_recruiting_funnel · SkillHeatmap (department × quarter) · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"q1","label":"Q1"},{"id":"q2","label":"Q2"},{"id":"q3","label":"Q3"},{"id":"q4","label":"Q4"}]'::jsonb AS rows,
        '[{"id":"eng","label":"Engineering"},{"id":"sales","label":"Sales"},{"id":"fin","label":"Finance"},{"id":"ops","label":"Ops"}]'::jsonb AS cols,
        '[{"colId":"eng","rowId":"q1","value":8},{"colId":"sales","rowId":"q1","value":12},{"colId":"fin","rowId":"q1","value":3},{"colId":"ops","rowId":"q1","value":5},{"colId":"eng","rowId":"q2","value":11},{"colId":"sales","rowId":"q2","value":14},{"colId":"fin","rowId":"q2","value":4},{"colId":"ops","rowId":"q2","value":6},{"colId":"eng","rowId":"q3","value":9},{"colId":"sales","rowId":"q3","value":10},{"colId":"fin","rowId":"q3","value":5},{"colId":"ops","rowId":"q3","value":7},{"colId":"eng","rowId":"q4","value":13},{"colId":"sales","rowId":"q4","value":15},{"colId":"fin","rowId":"q4","value":6},{"colId":"ops","rowId":"q4","value":8}]'::jsonb AS cells,
        'Recruiting funnel · hires per quarter × department' AS caption,
        true AS "showValue"
    $q$
  )
)
WHERE id = 51;

-- 39 — skills_heatmap · SkillHeatmap (skill × domain) · static-via-SELECT
UPDATE dashboard_elements
SET config_overrides = jsonb_set(
  COALESCE(config_overrides, '{}'::jsonb),
  '{data_source}',
  jsonb_build_object(
    'type', 'sql',
    'ttl', 60,
    'query', $q$
      SELECT
        '[{"id":"finance","label":"Finance"},{"id":"risk","label":"Risk"},{"id":"eng","label":"Engineering"},{"id":"hr","label":"HR"}]'::jsonb AS rows,
        '[{"id":"sql","label":"SQL"},{"id":"python","label":"Python"},{"id":"lead","label":"Leadership"},{"id":"comms","label":"Comms"}]'::jsonb AS cols,
        '[{"colId":"sql","rowId":"finance","value":78},{"colId":"python","rowId":"finance","value":62},{"colId":"lead","rowId":"finance","value":55},{"colId":"comms","rowId":"finance","value":68},{"colId":"sql","rowId":"risk","value":84},{"colId":"python","rowId":"risk","value":80},{"colId":"lead","rowId":"risk","value":60},{"colId":"comms","rowId":"risk","value":58},{"colId":"sql","rowId":"eng","value":92},{"colId":"python","rowId":"eng","value":89},{"colId":"lead","rowId":"eng","value":50},{"colId":"comms","rowId":"eng","value":62},{"colId":"sql","rowId":"hr","value":40},{"colId":"python","rowId":"hr","value":35},{"colId":"lead","rowId":"hr","value":75},{"colId":"comms","rowId":"hr","value":85}]'::jsonb AS cells,
        'Capability heatmap · domain × skill (live SQL)' AS caption,
        true AS "showValue"
    $q$
  )
)
WHERE id = 39;

-- Assert: all 8 elements now have type='sql'
DO $$
DECLARE
  remaining_static INTEGER;
BEGIN
  SELECT count(*)::int INTO remaining_static
  FROM dashboard_elements
  WHERE id IN (35, 39, 42, 43, 44, 46, 50, 51)
    AND config_overrides->'data_source'->>'type' = 'static';
  IF remaining_static > 0 THEN
    RAISE EXCEPTION 'phase14c: % elements still have type=static (expected 0)', remaining_static;
  END IF;
END $$;

COMMIT;
