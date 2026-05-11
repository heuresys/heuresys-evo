-- Phase 18i DOWN — rollback EcoNova + Heuresys enrichment
BEGIN;

-- KG edges + nodes
DELETE FROM kg_edges WHERE tenant_id IN (SELECT id FROM tenants WHERE code IN ('econova','heuresys'));
DELETE FROM kg_nodes WHERE tenant_id IN (SELECT id FROM tenants WHERE code IN ('econova','heuresys'));

-- Succession candidates (EN only, HS had none)
DELETE FROM succession_candidates
WHERE tenant_id=(SELECT id FROM tenants WHERE code='econova')
  AND created_at >= '2026-05-11T19:30:00Z'::timestamptz;

-- Perf reviews box revert (EN + HS)
UPDATE performance_reviews pr
SET performance_box=NULL, potential_box=NULL, potential_rating=NULL, updated_at=now()
FROM employees e
WHERE pr.employee_id=e.id
  AND e.tenant_id IN (SELECT id FROM tenants WHERE code IN ('econova','heuresys'))
  AND pr.updated_at >= '2026-05-11T19:30:00Z'::timestamptz;

-- Skill assessments (EN + HS)
DELETE FROM employee_skill_assessments esa
USING employees e
WHERE esa.employee_id=e.id
  AND e.tenant_id IN (SELECT id FROM tenants WHERE code IN ('econova','heuresys'))
  AND esa.created_at >= '2026-05-11T19:30:00Z'::timestamptz;

DELETE FROM schema_migrations WHERE version='phase18i_econova_heuresys_enrichment';

COMMIT;
