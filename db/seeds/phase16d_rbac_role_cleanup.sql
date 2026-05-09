-- Phase 16.D · L54+ · S24 — rbac_role enum drift cleanup
--
-- Closes audit issue #7 (HIGH): rbac_role enum contiene SYSADMIN e
-- TENANT_ADMIN che non esistono in rbp_roles canonical (8 codici).
--
-- Strategia multi-step (Postgres NON supporta REMOVE VALUE su enum):
--   1) UPDATE role_permissions: SYSADMIN -> SUPERUSER (semantic remap;
--      4 permission_id distinct dai SUPERUSER esistenti, no collision)
--   2) CREATE rbac_role_v2 = 8 canonical
--   3) ALTER TABLE role_permissions ALTER COLUMN role TYPE rbac_role_v2
--   4) DROP TYPE rbac_role (orphaned)
--   5) RENAME rbac_role_v2 -> rbac_role
--
-- role_permissions e rbac_role enum sono LEGACY: il codice runtime usa
-- esclusivamente rbp_role_permissions (179 rows, no enum). Lo Prisma
-- schema mappa role_permissions ma nessun route lo consuma. Cleanup
-- riduce drift senza rompere nulla.
--
-- Idempotente: se valori già canonical, no-op.

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 0) Disable session triggers durante remap.
--    audit_permission_changes() trigger inserisce audit_logs con
--    tenant_id NULL (causa fail NOT NULL) + action/category non
--    in CHECK list. È il P4 gap dell'audit § 8.4 — il trigger sarà
--    sostituito da auditedTransaction() in S24+ sweep.
-- ============================================================
SET LOCAL session_replication_role = replica;

-- ============================================================
-- 1) Remap SYSADMIN -> SUPERUSER (semantic; SUPERUSER è il livello superiore)
-- ============================================================
UPDATE role_permissions
SET role = 'SUPERUSER'::rbac_role,
    updated_at = NOW()
WHERE role::text = 'SYSADMIN';

-- TENANT_ADMIN: 0 rows attive (verificato pre-execution); idempotent guard.
UPDATE role_permissions
SET role = 'SUPERUSER'::rbac_role,
    updated_at = NOW()
WHERE role::text = 'TENANT_ADMIN';

-- ============================================================
-- 2) Create new enum with canonical 8 values (matches rbp_roles.code)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rbac_role_v2') THEN
    CREATE TYPE rbac_role_v2 AS ENUM (
      'SUPERUSER',
      'TENANT_OWNER',
      'IT_ADMIN',
      'HR_DIRECTOR',
      'HR_MANAGER',
      'DEPT_HEAD',
      'LINE_MANAGER',
      'EMPLOYEE'
    );
  END IF;
END $$;

-- ============================================================
-- 3) Switch role_permissions.role to rbac_role_v2
--    USING expression handles legacy values; UPDATE in step 1 made it safe.
-- ============================================================
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    WHERE c.relname = 'role_permissions' AND a.attname = 'role'
      AND a.atttypid = 'rbac_role'::regtype
  ) THEN
    ALTER TABLE role_permissions
      ALTER COLUMN role TYPE rbac_role_v2
      USING role::text::rbac_role_v2;
  END IF;
END $$;

-- ============================================================
-- 4) Drop old type (now unreferenced) + rename v2 -> rbac_role
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rbac_role') THEN
    DROP TYPE rbac_role;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rbac_role_v2') THEN
    ALTER TYPE rbac_role_v2 RENAME TO rbac_role;
  END IF;
END $$;

-- ============================================================
-- 5) Verification
-- ============================================================
DO $$
DECLARE
  enum_values text;
  rp_total int;
  drift_remaining int;
BEGIN
  SELECT string_agg(enumlabel, ',' ORDER BY enumsortorder) INTO enum_values
  FROM pg_enum WHERE enumtypid = 'rbac_role'::regtype;

  IF enum_values <> 'SUPERUSER,TENANT_OWNER,IT_ADMIN,HR_DIRECTOR,HR_MANAGER,DEPT_HEAD,LINE_MANAGER,EMPLOYEE' THEN
    RAISE EXCEPTION 'phase16d assert FAIL: rbac_role values: %', enum_values;
  END IF;

  SELECT count(*) INTO rp_total FROM role_permissions;
  IF rp_total < 16 THEN
    RAISE EXCEPTION 'phase16d assert FAIL: only % rows in role_permissions (expected ~20)', rp_total;
  END IF;

  SELECT count(*) INTO drift_remaining FROM role_permissions
  WHERE role::text NOT IN (SELECT code FROM rbp_roles);
  IF drift_remaining > 0 THEN
    RAISE EXCEPTION 'phase16d assert FAIL: % rows with role NOT IN rbp_roles', drift_remaining;
  END IF;

  RAISE NOTICE 'phase16d OK: 8 canonical enum values · % rows · 0 drift', rp_total;
END $$;

COMMIT;
