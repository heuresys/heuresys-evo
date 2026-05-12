-- Phase 18t DOWN — Drop audit_logs created_at DESC index

BEGIN;

DROP INDEX IF EXISTS idx_audit_logs_created_at_desc;

DELETE FROM schema_migrations
WHERE version = 'phase18t_idx_audit_logs_created_at';

COMMIT;
