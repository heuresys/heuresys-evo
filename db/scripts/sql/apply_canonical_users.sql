-- Apply canonical demo users — REFERENCE (operational form: scripts/db/apply-canonical-users.mjs)
--
-- This file documents the canonical state for the canonical_demo_users registry
-- and the password-stabilization step on canonical users. The executable form is
-- the Node script `scripts/db/apply-canonical-users.mjs` (uses Prisma + bcryptjs;
-- generates hash at runtime from a unified password and applies idempotent UPDATEs).
--
-- SoT (post-S22): tests/.test-env (8 entries — 1 SUPERUSER + 7 RTL Bank roles).
--
-- The .mjs script extends this SoT with:
--   * legacy $2a$ duplicate soft-delete (rtl-bank.alice.esposito, rtl-bank.alberto.colombo)
--   * post-S22 cross-tenant TENANT_OWNER soft-delete (admin, smartfood-admin, econova-admin)
--     — restricted out of the test matrix; were canonical until S22 cleanup.
--   * runtime bcrypt verification for every canonical
--
-- This .sql file is preserved for psql/CI-driven flows that pre-date the .mjs
-- and is idempotent on its own (re-runs are no-ops when DB is aligned).

\set ON_ERROR_STOP on

BEGIN;

-- Ensure registry table exists (also created by migration 196).
CREATE TABLE IF NOT EXISTS canonical_demo_users (
  role        VARCHAR(50) PRIMARY KEY,
  username    VARCHAR(100) NOT NULL UNIQUE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 0. Refresh registry from .env values.
TRUNCATE canonical_demo_users;
INSERT INTO canonical_demo_users(role, username) VALUES
  ('SUPERUSER',    :'u_superuser'),
  ('TENANT_OWNER', :'u_tenant_owner'),
  ('IT_ADMIN',     :'u_it_admin'),
  ('HR_DIRECTOR',  :'u_hr_director'),
  ('HR_MANAGER',   :'u_hr_manager'),
  ('DEPT_HEAD',    :'u_dept_head'),
  ('LINE_MANAGER', :'u_line_manager'),
  ('EMPLOYEE',     :'u_employee');

-- 1. Consolidate legacy anonymous users if present.
--    rtl-admin (if bound to Federica Marchetti) → soft-delete
UPDATE users
SET is_active = false, deleted_at = NOW()
WHERE username = 'rtl-admin' AND deleted_at IS NULL
  AND employee_id IN (SELECT id FROM employees WHERE first_name='Federica' AND last_name='Marchetti');

--    rtl-hr → rename to canonical HR_DIRECTOR username from .env
UPDATE users
SET username = :'u_hr_director'
WHERE username = 'rtl-hr'
  AND NOT EXISTS (SELECT 1 FROM users u2 WHERE u2.username = :'u_hr_director');

-- 2. Promote TENANT_OWNER canonical user if not already.
UPDATE users
SET role = 'TENANT_OWNER'
WHERE username = :'u_tenant_owner' AND role <> 'TENANT_OWNER';

-- 3. Stabilize hash / is_active / deleted_at on all canonical users.
UPDATE users
SET password_hash = :'hash',
    is_active = true,
    deleted_at = NULL
WHERE username IN (SELECT username FROM canonical_demo_users)
  AND (
    password_hash IS DISTINCT FROM :'hash'
    OR is_active IS DISTINCT FROM true
    OR deleted_at IS NOT NULL
  );

-- 4. Soft-delete legacy duplicates and post-S22 retired cross-tenant TENANT_OWNERs.
--    2026-05-07: alice.esposito + alberto.colombo ($2a$ legacy duplicates of paolo.caputo + francesca.gallo).
--    2026-05-09 (S22): admin / smartfood-admin / econova-admin retired from canonical when test matrix
--    was restricted to tests/.test-env (8 entries).
UPDATE users
SET is_active = false, deleted_at = NOW()
WHERE username IN (
    'rtl-bank.alice.esposito',
    'rtl-bank.alberto.colombo',
    'admin',
    'smartfood-admin',
    'econova-admin'
  )
  AND is_active = true
  AND deleted_at IS NULL;

-- 5. Assert: every canonical user exists with the expected role.
DO $$
DECLARE
  r RECORD;
  actual_role VARCHAR;
BEGIN
  FOR r IN SELECT role, username FROM canonical_demo_users LOOP
    SELECT role INTO actual_role FROM users WHERE username = r.username;
    IF actual_role IS NULL THEN
      RAISE EXCEPTION 'Canonical user % (role %) not found', r.username, r.role;
    END IF;
    IF actual_role <> r.role THEN
      RAISE EXCEPTION 'Canonical user % has role % but expected %',
        r.username, actual_role, r.role;
    END IF;
  END LOOP;
END $$;

COMMIT;
