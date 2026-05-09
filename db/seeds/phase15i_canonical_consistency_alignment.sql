-- Phase 15.I · L50 · S22 — DBMS canonical consistency alignment.
--
-- Allinea users ↔ employees ↔ tenants secondo le regole di sviluppo:
--
-- (1) tenants.domain è SoT esplicita per il dominio email del tenant.
--     Nuova colonna NOT NULL UNIQUE; popolata coerentemente con i 4 tenant.
-- (2) employees.email canonical = lower(strip(first) || '.' || strip(last) || '@' || domain)
--     dove strip rimuove space e apostrofo (best-practice email locale).
-- (3) Nessuna omonimia first.last intra-tenant (verificato 0 collisioni).
-- (4) users.username = employees.email (login = work email canonical).
-- (5) Soft-delete employees orphan + duplicate user (rtl-hr per Valentina Conti)
--     + platform user 'evo.dev' (out-of-scope test matrix).
-- (6) password_hash invariato — Heuresys2026! resta valida (login funziona post-rename).
--
-- Idempotente: re-run converge allo stesso stato.

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 1) tenants.domain — nuova colonna SoT
-- ============================================================
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS domain TEXT;

UPDATE tenants SET domain = 'econova.org'   WHERE code = 'econova'   AND (domain IS NULL OR domain <> 'econova.org');
UPDATE tenants SET domain = 'heuresys.com'  WHERE code = 'heuresys'  AND (domain IS NULL OR domain <> 'heuresys.com');
UPDATE tenants SET domain = 'rtl-bank.org'  WHERE code = 'rtl-bank'  AND (domain IS NULL OR domain <> 'rtl-bank.org');
UPDATE tenants SET domain = 'smartfood.org' WHERE code = 'smartfood' AND (domain IS NULL OR domain <> 'smartfood.org');

-- Lock down: NOT NULL + UNIQUE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tenants' AND column_name = 'domain' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE tenants ALTER COLUMN domain SET NOT NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_tenants_domain ON tenants (domain);

-- ============================================================
-- 2) employees.email canonical = lower(strip(first).strip(last)@domain)
-- ============================================================
UPDATE employees e
SET email = lower(
              replace(replace(e.first_name, ' ', ''), '''', '')
              || '.'
              || replace(replace(e.last_name, ' ', ''), '''', '')
              || '@' || t.domain
            ),
    updated_at = NOW()
FROM tenants t
WHERE t.id = e.tenant_id
  AND e.is_active = true
  AND e.deleted_at IS NULL
  AND e.email IS DISTINCT FROM lower(
              replace(replace(e.first_name, ' ', ''), '''', '')
              || '.'
              || replace(replace(e.last_name, ' ', ''), '''', '')
              || '@' || t.domain
            );

-- ============================================================
-- 3) Soft-delete: 5 orphan employees + duplicate user rtl-hr + evo.dev platform user
-- ============================================================
-- Orphan employees: active employee senza active user
UPDATE employees
SET is_active = false, deleted_at = NOW(), updated_at = NOW()
WHERE is_active = true
  AND deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM users u
    WHERE u.employee_id = employees.id
      AND u.is_active = true
      AND u.deleted_at IS NULL
  );

-- Duplicate user rtl-hr (Valentina Conti ha già canonical user attivo) + platform evo.dev.
-- Plus laura.bertolini (econova) — explicit removal per S22 cleanup.
UPDATE users
SET is_active = false, deleted_at = NOW(), updated_at = NOW()
WHERE (username IN ('rtl-hr', 'evo.dev')
       OR username IN ('econova.laura.bertolini', 'laura.bertolini@econova.org', 'laura.bertolini'))
  AND is_active = true
  AND deleted_at IS NULL;

UPDATE employees
SET is_active = false, deleted_at = NOW(), updated_at = NOW()
FROM tenants t
WHERE t.id = employees.tenant_id
  AND lower(employees.first_name) = 'laura'
  AND lower(employees.last_name) = 'bertolini'
  AND t.code = 'econova'
  AND employees.is_active = true
  AND employees.deleted_at IS NULL;

-- ============================================================
-- 4) users.username = employees.email
-- ============================================================
UPDATE users u
SET username = e.email,
    updated_at = NOW()
FROM employees e
WHERE u.employee_id = e.id
  AND u.is_active = true
  AND u.deleted_at IS NULL
  AND e.is_active = true
  AND e.deleted_at IS NULL
  AND u.username IS DISTINCT FROM e.email;

-- ============================================================
-- 5) Refresh canonical_demo_users registry con new emails
-- ============================================================
TRUNCATE canonical_demo_users;
INSERT INTO canonical_demo_users(role, username) VALUES
  ('SUPERUSER',    'sysadmin'),
  ('TENANT_OWNER', 'federica.marchetti@rtl-bank.org'),
  ('IT_ADMIN',     'marco.desantis@rtl-bank.org'),
  ('HR_DIRECTOR',  'valentina.conti@rtl-bank.org'),
  ('HR_MANAGER',   'maria.colombo@rtl-bank.org'),
  ('DEPT_HEAD',    'paolo.caputo@rtl-bank.org'),
  ('LINE_MANAGER', 'giuseppe.ferri@rtl-bank.org'),
  ('EMPLOYEE',     'francesca.gallo@rtl-bank.org');

-- ============================================================
-- 6) Verification asserts
-- ============================================================
DO $$
DECLARE
  domain_null INT;
  email_mismatch INT;
  orphan_emp INT;
  orphan_usr INT;
  username_mismatch INT;
  email_dups INT;
BEGIN
  -- A. Tenants must all have domain
  SELECT COUNT(*) INTO domain_null FROM tenants WHERE domain IS NULL;
  IF domain_null > 0 THEN
    RAISE EXCEPTION 'tenants.domain: % rows still NULL', domain_null;
  END IF;

  -- B. Email format compliant for all active employees
  SELECT COUNT(*) INTO email_mismatch
  FROM employees e JOIN tenants t ON t.id = e.tenant_id
  WHERE e.is_active AND e.deleted_at IS NULL
    AND e.email IS DISTINCT FROM lower(
          replace(replace(e.first_name, ' ', ''), '''', '')
          || '.'
          || replace(replace(e.last_name, ' ', ''), '''', '')
          || '@' || t.domain);
  IF email_mismatch > 0 THEN
    RAISE EXCEPTION 'employees.email: % rows non-canonical', email_mismatch;
  END IF;

  -- C. No orphan employees
  SELECT COUNT(*) INTO orphan_emp
  FROM employees e
  WHERE e.is_active = true AND e.deleted_at IS NULL
    AND NOT EXISTS (SELECT 1 FROM users u WHERE u.employee_id = e.id
                    AND u.is_active AND u.deleted_at IS NULL);
  IF orphan_emp > 0 THEN
    RAISE EXCEPTION 'orphan employees still present: %', orphan_emp;
  END IF;

  -- D. No orphan users (active user without active employee, excluding platform users)
  SELECT COUNT(*) INTO orphan_usr
  FROM users u
  WHERE u.is_active = true AND u.deleted_at IS NULL
    AND u.employee_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM employees e WHERE e.id = u.employee_id
                    AND e.is_active AND e.deleted_at IS NULL);
  IF orphan_usr > 0 THEN
    RAISE EXCEPTION 'orphan users still present: %', orphan_usr;
  END IF;

  -- E. username == email for all tenant users
  SELECT COUNT(*) INTO username_mismatch
  FROM users u JOIN employees e ON e.id = u.employee_id
  WHERE u.is_active AND u.deleted_at IS NULL
    AND e.is_active AND e.deleted_at IS NULL
    AND u.username IS DISTINCT FROM e.email;
  IF username_mismatch > 0 THEN
    RAISE EXCEPTION 'username/email mismatches: %', username_mismatch;
  END IF;

  -- F. No intra-tenant email duplicates
  SELECT COUNT(*) INTO email_dups FROM (
    SELECT t.id, e.email
    FROM employees e JOIN tenants t ON t.id = e.tenant_id
    WHERE e.is_active AND e.deleted_at IS NULL
    GROUP BY t.id, e.email HAVING COUNT(*) > 1
  ) sq;
  IF email_dups > 0 THEN
    RAISE EXCEPTION 'intra-tenant email duplicates: %', email_dups;
  END IF;

  RAISE NOTICE 'All asserts passed (domain set, email canonical, no orphans, username=email, no dups)';
END $$;

-- ============================================================
-- 7) Final summary
-- ============================================================
SELECT
  (SELECT COUNT(*) FROM tenants) AS tenants,
  (SELECT COUNT(*) FROM employees WHERE is_active AND deleted_at IS NULL) AS active_employees,
  (SELECT COUNT(*) FROM users WHERE is_active AND deleted_at IS NULL) AS active_users,
  (SELECT COUNT(*) FROM users WHERE is_active AND deleted_at IS NULL AND employee_id IS NULL) AS platform_users;

COMMIT;
