-- Phase 16.H · L56 · S23-tris — Drop broken P4 audit triggers
--
-- Closes audit issue #3 partial: trigger `audit_permission_changes()`
-- (called by trg_audit_role_permissions + trg_audit_employee_permission_overrides)
-- scrive audit_logs invalidi:
--   - tenant_id NULL (CHECK NOT NULL violation)
--   - action='PERMISSION_UPDATED' (NOT in CHECK list)
--   - category='RBAC' (NOT in CHECK list)
--
-- Sostituito da `auditedTransaction()` helper (services/app/src/lib/audit/)
-- che enforce P4 (actor user_id required) + valori canonical CHECK-conformi.
--
-- Drop triggers + funzione (orphan post-drop).
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

DROP TRIGGER IF EXISTS trg_audit_role_permissions ON role_permissions;
DROP TRIGGER IF EXISTS trg_audit_employee_permission_overrides ON employee_permission_overrides;

-- Drop funzione (orphan post-trigger drop). IF EXISTS per idempotenza.
DROP FUNCTION IF EXISTS audit_permission_changes();

DO $$
DECLARE
  trig_count int;
BEGIN
  SELECT count(*) INTO trig_count FROM pg_trigger t
  WHERE t.tgname IN ('trg_audit_role_permissions', 'trg_audit_employee_permission_overrides')
    AND NOT t.tgisinternal;
  IF trig_count <> 0 THEN
    RAISE EXCEPTION 'phase16h assert FAIL: % broken triggers still present', trig_count;
  END IF;
  RAISE NOTICE 'phase16h OK: 2 broken triggers dropped + audit_permission_changes() function dropped';
END $$;

COMMIT;
