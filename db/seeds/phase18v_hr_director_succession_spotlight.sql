-- ============================================================================
-- phase18v — HR_DIRECTOR succession spotlight aggregator (P6 W#3 L73)
-- ============================================================================
-- Sostituisce demo placeholder (config_overrides=NULL) per dashboard_elements
-- id 88 (widget_code SuccessionCard standalone, position=3, parent NULL) con
-- SQL aggregator runtime live: top-1 succession_candidate ready_now per
-- HR_DIRECTOR scope, JOIN con succession_plans + employees per nome candidato
-- + targetRole + readinessPercent + risk derivato da criticality_level.
--
-- Schema: data shape allineata a successionCardAdapter
-- ({candidateName, currentRole, targetRole, readinessPercent, readiness, risk, readyBy}).
-- Demo fallback in registry.tsx se query restituisce 0 rows.
--
-- RLS-safe: current_setting('app.current_tenant_id', true).
-- Idempotent: rilascia identico se rieseguito.
-- Cache TTL 60s allineato S46 perf default.
--
-- Refs: DECISIONS-LOG L73 · P6 audit S54 W#3 #88
-- ============================================================================

BEGIN;

UPDATE dashboard_elements
SET config_overrides = jsonb_build_object(
  'data_source', jsonb_build_object(
    'type', 'sql',
    'query', $sql$
SELECT
  (e.first_name || ' ' || e.last_name) AS "candidateName",
  COALESCE(e.job_title, 'Senior contributor') AS "currentRole",
  sp.position_name AS "targetRole",
  CASE sc.readiness_level
    WHEN 'ready_now' THEN 92
    WHEN 'ready_1_year' THEN 78
    WHEN 'ready_2_years' THEN 62
    WHEN 'ready_3_years' THEN 48
    WHEN 'ready_3_plus_years' THEN 35
    WHEN 'development_needed' THEN 25
    ELSE 50
  END AS "readinessPercent",
  CASE
    WHEN sc.readiness_level = 'ready_now' THEN 'ready-now'
    WHEN sc.readiness_level IN ('ready_1_year','ready_2_years') THEN '1-2y'
    ELSE '3-5y'
  END AS readiness,
  CASE sp.criticality_level
    WHEN 'critical' THEN 'critical'
    WHEN 'high' THEN 'high'
    WHEN 'medium' THEN 'medium'
    ELSE 'low'
  END AS risk,
  COALESCE(TO_CHAR(sp.target_date, 'Mon YYYY'), 'TBD') AS "readyBy"
FROM succession_candidates sc
JOIN succession_plans sp ON sp.id = sc.critical_role_id
JOIN employees e ON e.id = sc.candidate_employee_id
WHERE sc.tenant_id = current_setting('app.current_tenant_id', true)::uuid
ORDER BY
  CASE sc.readiness_level
    WHEN 'ready_now' THEN 1
    WHEN 'ready_1_year' THEN 2
    WHEN 'ready_2_years' THEN 3
    WHEN 'ready_3_years' THEN 4
    WHEN 'ready_3_plus_years' THEN 5
    ELSE 6
  END ASC,
  sc.rank_order ASC NULLS LAST,
  CASE sp.criticality_level
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    ELSE 4
  END ASC
LIMIT 1
$sql$,
    'ttl', 60
  )
)
WHERE id = 88;

-- Verifica
SELECT id, position, widget_code, jsonb_pretty(config_overrides->'data_source'->'query') AS query_preview
FROM dashboard_elements WHERE id = 88;

COMMIT;
