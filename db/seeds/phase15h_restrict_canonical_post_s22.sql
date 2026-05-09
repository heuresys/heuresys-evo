-- Phase 15.H · L49 · S22 cleanup — Restrict canonical demo users to tests/.test-env.
--
-- SoT: tests/.test-env (8 entries — 1 SUPERUSER + 7 RTL Bank roles).
--
-- Soft-deactivates 3 cross-tenant TENANT_OWNERs that were previously canonical
-- but are now out-of-test-matrix:
--   - admin            (Heuresys System TENANT_OWNER)
--   - smartfood-admin  (SmartFood TENANT_OWNER)
--   - econova-admin    (EcoNova TENANT_OWNER)
--
-- Idempotent: UPDATE only when still active. Re-running is a no-op.
-- The matching code-side change is in scripts/db/apply-canonical-users.mjs +
-- db/scripts/sql/apply_canonical_users.sql (LEGACY_TO_DEACTIVATE list extended).
--
-- The accounts remain in the DB (soft-delete) so audit trails / FK references
-- remain valid; they are simply non-loginable. To reactivate any single one,
-- UPDATE users SET is_active=true, deleted_at=NULL WHERE username=...

\set ON_ERROR_STOP on
BEGIN;

UPDATE users
SET is_active = false,
    deleted_at = NOW(),
    updated_at = NOW()
WHERE username IN ('admin', 'smartfood-admin', 'econova-admin')
  AND is_active = true
  AND deleted_at IS NULL;

-- Verification: post-update, none of the 3 should be active.
DO $$
DECLARE
  active_count INT;
BEGIN
  SELECT COUNT(*) INTO active_count
  FROM users
  WHERE username IN ('admin', 'smartfood-admin', 'econova-admin')
    AND is_active = true
    AND deleted_at IS NULL;
  IF active_count > 0 THEN
    RAISE EXCEPTION 'Restrict failed: % cross-tenant TO still active', active_count;
  END IF;
END $$;

-- Show final state for the 11+5 audit set (8 canonical active + 5 deactivated).
SELECT username, role, is_active, deleted_at IS NOT NULL AS is_soft_deleted
FROM users
WHERE username IN (
    'sysadmin',
    'rtl-bank.federica.marchetti',
    'rtl-bank.marco.desantis',
    'rtl-bank.valentina.conti',
    'rtl-bank.maria.colombo',
    'rtl-bank.paolo.caputo',
    'rtl-bank.giuseppe.ferri',
    'rtl-bank.francesca.gallo',
    'rtl-bank.alice.esposito',
    'rtl-bank.alberto.colombo',
    'admin',
    'smartfood-admin',
    'econova-admin'
  )
ORDER BY is_active DESC, username;

COMMIT;
