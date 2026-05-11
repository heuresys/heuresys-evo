-- Phase 18k DOWN — rollback Heuresys succession scaffold
BEGIN;

DELETE FROM succession_candidates
WHERE tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
  AND created_at >= '2026-05-11T20:00:00Z'::timestamptz;

DELETE FROM succession_plans
WHERE tenant_id=(SELECT id FROM tenants WHERE code='heuresys')
  AND created_at >= '2026-05-11T20:00:00Z'::timestamptz;

DELETE FROM schema_migrations WHERE version='phase18k_heuresys_succession_scaffold';

COMMIT;
