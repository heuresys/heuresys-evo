-- Phase 16.C · L54 · S23 — users.role FK to rbp_roles(code)
--
-- Closes audit issue #4 (HIGH): `users.role` varchar unconstrained.
-- Forensic audit § 8.3 verified zero orphan rows (8/8 active roles match
-- canonical rbp_roles). Safe to add FK now.
--
-- Drop legacy CHECK constraint che includeva valori orfani SYSADMIN.
-- (rbac_role enum drift cleanup separato → S24 carry-forward.)
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 1) Sanity: zero orphan in users.role
-- ============================================================
DO $$
DECLARE
  orphan_count int;
BEGIN
  SELECT count(*) INTO orphan_count
  FROM users u
  WHERE u.deleted_at IS NULL
    AND u.is_active = true
    AND u.role NOT IN (SELECT code FROM rbp_roles);
  IF orphan_count <> 0 THEN
    RAISE EXCEPTION 'phase16c precondition FAIL: % active users have role NOT IN rbp_roles.code', orphan_count;
  END IF;
END $$;

-- ============================================================
-- 2) Drop legacy CHECK constraint
-- ============================================================
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- ============================================================
-- 3) Add FK constraint users.role → rbp_roles(code)
-- ============================================================
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS fk_users_role,
  ADD CONSTRAINT fk_users_role
    FOREIGN KEY (role) REFERENCES rbp_roles(code)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

-- ============================================================
-- 4) Verification asserts pre-COMMIT
-- ============================================================
DO $$
DECLARE
  fk_exists boolean;
  active_users int;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'users'::regclass
      AND conname = 'fk_users_role'
      AND contype = 'f'
  ) INTO fk_exists;
  IF NOT fk_exists THEN
    RAISE EXCEPTION 'phase16c assert FAIL: fk_users_role not created';
  END IF;

  SELECT count(*) INTO active_users
  FROM users WHERE is_active = true AND deleted_at IS NULL;
  IF active_users < 200 THEN
    RAISE EXCEPTION 'phase16c assert FAIL: only % active users (expected ~265)', active_users;
  END IF;

  RAISE NOTICE 'phase16c OK: fk_users_role active · % active users intact', active_users;
END $$;

COMMIT;
