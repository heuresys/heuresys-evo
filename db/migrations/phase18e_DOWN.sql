-- Phase 18e DOWN — rollback regulatory frameworks
BEGIN;
DROP TABLE IF EXISTS tenant_regulatory_compliance CASCADE;
DROP TABLE IF EXISTS regulatory_frameworks CASCADE;
DELETE FROM schema_migrations WHERE version = 'phase18e_regulatory_frameworks';
COMMIT;
