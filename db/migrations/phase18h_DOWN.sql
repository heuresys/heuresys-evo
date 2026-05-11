-- Phase 18h DOWN — rollback SmartFood enrichment (M9 + M11 + M13)
BEGIN;

-- M13 KG edges + nodes SF
DELETE FROM kg_edges WHERE tenant_id=(SELECT id FROM tenants WHERE code='smartfood');
DELETE FROM kg_nodes WHERE tenant_id=(SELECT id FROM tenants WHERE code='smartfood');

-- M11b succession_candidates added by phase18h
-- Heuristic: delete all SF candidates except the original 2 pre-S35.4 (by created_at)
DELETE FROM succession_candidates sc
WHERE sc.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND sc.created_at >= '2026-05-11T19:00:00Z'::timestamptz;

-- M11a perf_box revert (set NULL)
UPDATE performance_reviews pr
SET performance_box=NULL, potential_box=NULL, potential_rating=NULL, updated_at=now()
FROM employees e
WHERE pr.employee_id=e.id
  AND e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND pr.updated_at >= '2026-05-11T19:00:00Z'::timestamptz;

-- M9 new assessments (created post-S35.4): delete by created_at
DELETE FROM employee_skill_assessments esa
USING employees e
WHERE esa.employee_id=e.id
  AND e.tenant_id=(SELECT id FROM tenants WHERE code='smartfood')
  AND esa.created_at >= '2026-05-11T19:00:00Z'::timestamptz;

DELETE FROM schema_migrations WHERE version='phase18h_smartfood_enrichment';

COMMIT;
