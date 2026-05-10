-- Phase 16.O · S26 · L60 — employees vertical-split Phase 2 (VIEW + INSTEAD OF triggers)
-- =============================================================================
-- ⚠️  STATUS: DRAFT — DEFERRED to S27+
-- ⚠️  Apply attempt 2026-05-10 ~06:50Z FAILED at Stage 4 (DROP COLUMN) due to
-- ⚠️  65 view + 4 mat view dependencies on employees columns NOT documented in
-- ⚠️  the canonical plan. Transaction rolled back, DB integrity preserved.
-- ⚠️
-- ⚠️  To complete Phase 2 a future session needs:
-- ⚠️    1. Audit each of the 65 dependent views (purpose · usage · droppable status)
-- ⚠️    2. Save view definitions via pg_get_viewdef
-- ⚠️    3. DROP CASCADE the 65 views
-- ⚠️    4. Apply this migration (employees → VIEW + INSTEAD OF triggers)
-- ⚠️    5. Recreate the views, refactored to query the new VIEW employees
-- ⚠️       (instead of the old employees TABLE which is now employees_core)
-- ⚠️    6. Verify mat view refresh (systemd timer S24)
-- ⚠️    7. Verify all 12 hot views still return same shape (used by app code)
-- ⚠️
-- ⚠️  Estimated effort revised: 15-25h FTE (vs 9-14h original estimate).
-- ⚠️  See decision: .ux-design/DECISIONS-LOG.md L60.
-- ⚠️  Backup pre-attempt: /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump
-- ⚠️    sha256: dba5a08b0fba34b61fa2ed5b6152d31ea0d1ab58ad27519487956e356a1157b1
-- =============================================================================
-- ADDRESS Phase 1 follow-up: complete vertical split by converting employees
-- TABLE → VIEW backed by employees_core (18 col) + 3 satellites (PII/HR/Payroll).
--
-- Strategy chosen (Option B): zero app refactor required.
--   - employees TABLE renamed → employees_core, drops 77 redundant cols (kept in satellites)
--   - employees becomes a VIEW (LEFT JOIN core + pii + hr + payroll)
--   - INSTEAD OF triggers route INSERT/UPDATE/DELETE to base tables
--   - 210 FK targeting employees(id) follow oid → continue working post-rename
--   - Existing RLS policy `tenant_isolation` persists on employees_core (oid-based)
--   - Cascade delete from employees_core auto-cleans satellites (FK ON DELETE CASCADE from Phase 1)
--   - Prisma client unchanged (treats VIEW as table for SELECT, INSTEAD OF handles writes)
--
-- Pre-flight requirement: zero drift between employees and satellites
-- (validated 2026-05-10 ~06:30Z, all 270 rows match exactly).
--
-- Refs:
--   - .handoff/STATE.md priority [ARCH-S26]
--   - phase16n_employees_vertical_split_phase1.sql (additive scaffold)
--   - .ux-design/DECISIONS-LOG.md L60 (this commit)
-- =============================================================================

BEGIN;

-- =============================================================================
-- 0. PRE-FLIGHT ASSERTS (will rollback transaction if any fail)
-- =============================================================================

DO $$
DECLARE
  v_count integer;
BEGIN
  -- Assert satellites populated for all employees
  SELECT count(*) INTO v_count
  FROM public.employees e
  LEFT JOIN public.employees_pii p ON p.employee_id = e.id
  WHERE p.employee_id IS NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'phase16o pre-flight failed: % employees missing PII satellite row', v_count;
  END IF;

  SELECT count(*) INTO v_count
  FROM public.employees e
  LEFT JOIN public.employees_hr h ON h.employee_id = e.id
  WHERE h.employee_id IS NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'phase16o pre-flight failed: % employees missing HR satellite row', v_count;
  END IF;

  SELECT count(*) INTO v_count
  FROM public.employees e
  LEFT JOIN public.employees_payroll pa ON pa.employee_id = e.id
  WHERE pa.employee_id IS NULL;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'phase16o pre-flight failed: % employees missing Payroll satellite row', v_count;
  END IF;

  -- Assert no drift on key fields
  SELECT count(*) INTO v_count
  FROM public.employees e
  JOIN public.employees_pii p ON p.employee_id = e.id
  WHERE e.first_name IS DISTINCT FROM p.first_name
     OR e.last_name IS DISTINCT FROM p.last_name
     OR e.email IS DISTINCT FROM p.email;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'phase16o pre-flight failed: % rows drift between employees and employees_pii', v_count;
  END IF;

  RAISE NOTICE 'phase16o pre-flight: zero drift, all 270 satellites populated';
END;
$$;

-- =============================================================================
-- 1. DROP sync trigger + function (no longer needed; INSTEAD OF will handle writes)
-- =============================================================================

DROP TRIGGER IF EXISTS trg_sync_employees_to_satellites ON public.employees;
DROP FUNCTION IF EXISTS public.fn_sync_employees_to_satellites();

-- =============================================================================
-- 2. DROP view employees_full (will be replaced by VIEW employees with same JOIN shape)
-- =============================================================================

DROP VIEW IF EXISTS public.employees_full;

-- =============================================================================
-- 3. RENAME TABLE employees → employees_core
--    (210 FK + RLS policy + indexes follow oid, persist transparently)
-- =============================================================================

ALTER TABLE public.employees RENAME TO employees_core;

-- =============================================================================
-- 4. DROP 77 redundant columns from employees_core
--    (kept only the 18 "core" cols: keys, lifecycle, embedding, consent)
-- =============================================================================

ALTER TABLE public.employees_core
  -- 38 PII cols (now in employees_pii)
  DROP COLUMN first_name,
  DROP COLUMN last_name,
  DROP COLUMN middle_name,
  DROP COLUMN email,
  DROP COLUMN personal_email,
  DROP COLUMN birth_date,
  DROP COLUMN birth_place,
  DROP COLUMN gender,
  DROP COLUMN nationality,
  DROP COLUMN marital_status,
  DROP COLUMN address_street,
  DROP COLUMN address_city,
  DROP COLUMN address_postal_code,
  DROP COLUMN address_country,
  DROP COLUMN address_region,
  DROP COLUMN temp_address_street,
  DROP COLUMN temp_address_city,
  DROP COLUMN temp_address_postal_code,
  DROP COLUMN temp_address_country,
  DROP COLUMN phone_mobile,
  DROP COLUMN phone_work,
  DROP COLUMN phone_home,
  DROP COLUMN tax_id,
  DROP COLUMN national_id,
  DROP COLUMN national_id_expiry,
  DROP COLUMN passport_number,
  DROP COLUMN passport_expiry,
  DROP COLUMN driver_license,
  DROP COLUMN driver_license_expiry,
  DROP COLUMN emergency_contact_name,
  DROP COLUMN emergency_contact_phone,
  DROP COLUMN emergency_contact_relationship,
  DROP COLUMN family_members,
  DROP COLUMN education_history,
  DROP COLUMN highest_education_level,
  DROP COLUMN highest_education_institution,
  DROP COLUMN highest_education_field,
  DROP COLUMN highest_education_year,
  -- 28 HR cols (now in employees_hr)
  DROP COLUMN job_title,
  DROP COLUMN department,
  DROP COLUMN location,
  DROP COLUMN manager_id,
  DROP COLUMN hire_date,
  DROP COLUMN performance_rating,
  DROP COLUMN potential,
  DROP COLUMN legacy_org_unit_code,
  DROP COLUMN cost_center,
  DROP COLUMN cost_center_id,
  DROP COLUMN org_unit_id,
  DROP COLUMN location_id,
  DROP COLUMN position_id,
  DROP COLUMN employee_group,
  DROP COLUMN employee_subgroup,
  DROP COLUMN company_code,
  DROP COLUMN personnel_area,
  DROP COLUMN personnel_subarea,
  DROP COLUMN probation_end_date,
  DROP COLUMN seniority_date,
  DROP COLUMN contract_end_date,
  DROP COLUMN work_schedule_percentage,
  DROP COLUMN auth_username,
  DROP COLUMN auth_password_hash,
  DROP COLUMN auth_role,
  DROP COLUMN auth_permissions,
  DROP COLUMN auth_last_login,
  DROP COLUMN auth_username_candidate,
  -- 11 Payroll cols (now in employees_payroll)
  DROP COLUMN salary,
  DROP COLUMN currency,
  DROP COLUMN pay_scale_area,
  DROP COLUMN pay_scale_type,
  DROP COLUMN pay_scale_group,
  DROP COLUMN pay_scale_level,
  DROP COLUMN pay_periods_per_year,
  DROP COLUMN iban,
  DROP COLUMN swift_bic,
  DROP COLUMN bank_name,
  DROP COLUMN bank_account_number;

-- Verify employees_core has exactly 18 cols left
DO $$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='employees_core';
  IF v_count != 18 THEN
    RAISE EXCEPTION 'phase16o stage 4 failed: employees_core has % cols, expected 18', v_count;
  END IF;
  RAISE NOTICE 'phase16o stage 4: employees_core has 18 cols (95 - 77 dropped)';
END;
$$;

-- =============================================================================
-- 5. CREATE VIEW employees with original 95-col shape (column order preserved)
-- =============================================================================

CREATE VIEW public.employees AS
SELECT
  -- core (chiavi)
  e.id,
  e.tenant_id,
  -- pii (3 hot cols at top)
  p.first_name,
  p.last_name,
  p.email,
  -- hr (org chunk)
  h.job_title,
  h.department,
  h.location,
  h.manager_id,
  h.hire_date,
  -- core (skills)
  e.skills,
  -- hr (perf)
  h.performance_rating,
  h.potential,
  -- core (active flag)
  e.is_active,
  -- core (timestamps)
  e.created_at,
  e.updated_at,
  -- core (HR identifier)
  e.pernr,
  -- pii (more)
  p.birth_date,
  p.gender,
  p.nationality,
  -- payroll
  pa.salary,
  pa.currency,
  -- hr (cost/group)
  h.cost_center,
  h.employee_group,
  h.employee_subgroup,
  h.position_id,
  h.legacy_org_unit_code,
  h.cost_center_id,
  h.org_unit_id,
  -- pii (name extras)
  p.middle_name,
  p.birth_place,
  p.marital_status,
  -- pii (addresses)
  p.address_street,
  p.address_city,
  p.address_postal_code,
  p.address_country,
  p.address_region,
  p.temp_address_street,
  p.temp_address_city,
  p.temp_address_postal_code,
  p.temp_address_country,
  -- payroll (pay_scale_*)
  pa.pay_scale_area,
  pa.pay_scale_type,
  pa.pay_scale_group,
  pa.pay_scale_level,
  pa.pay_periods_per_year,
  -- hr (work schedule)
  h.work_schedule_percentage,
  -- payroll (banking)
  pa.iban,
  pa.swift_bic,
  pa.bank_name,
  pa.bank_account_number,
  -- pii (phones + emails)
  p.phone_mobile,
  p.phone_work,
  p.phone_home,
  p.personal_email,
  -- pii (identity docs)
  p.tax_id,
  p.national_id,
  p.national_id_expiry,
  p.passport_number,
  p.passport_expiry,
  p.driver_license,
  p.driver_license_expiry,
  -- hr (contract dates)
  h.probation_end_date,
  h.seniority_date,
  h.contract_end_date,
  -- pii (emergency + family + education)
  p.emergency_contact_name,
  p.emergency_contact_phone,
  p.emergency_contact_relationship,
  p.family_members,
  p.education_history,
  p.highest_education_level,
  p.highest_education_institution,
  p.highest_education_field,
  p.highest_education_year,
  -- hr (company structure)
  h.company_code,
  h.personnel_area,
  h.personnel_subarea,
  -- core (lifecycle)
  e.employment_status,
  e.termination_date,
  e.termination_reason,
  -- hr (auth)
  h.auth_username,
  h.auth_password_hash,
  h.auth_role,
  h.auth_permissions,
  h.auth_last_login,
  h.auth_username_candidate,
  -- hr (location_id, lookup)
  h.location_id,
  -- core (embedding)
  e.profile_embedding,
  e.embedding_text_hash,
  e.embedding_model,
  e.embedding_generated_at,
  -- core (soft delete)
  e.deleted_at,
  -- core (consent)
  e.enrichment_consent,
  e.enrichment_consent_at,
  e.enrichment_consent_scope
FROM public.employees_core e
LEFT JOIN public.employees_pii p ON p.employee_id = e.id
LEFT JOIN public.employees_hr h ON h.employee_id = e.id
LEFT JOIN public.employees_payroll pa ON pa.employee_id = e.id;

COMMENT ON VIEW public.employees IS
  'Phase 16.O VIEW: backward-compat shape (95 cols) over employees_core (18) + 3 satellites. INSERT/UPDATE/DELETE routed via INSTEAD OF triggers.';

-- Verify VIEW returns 270 rows (preserve count)
DO $$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count FROM public.employees;
  IF v_count != 270 THEN
    RAISE EXCEPTION 'phase16o stage 5 failed: VIEW employees returns % rows, expected 270', v_count;
  END IF;
  RAISE NOTICE 'phase16o stage 5: VIEW employees returns 270 rows';
END;
$$;

-- =============================================================================
-- 6. INSTEAD OF triggers — route INSERT/UPDATE/DELETE to base tables
-- =============================================================================

-- 6.1 INSERT trigger: split NEW into 4 INSERTs (core + 3 satellites)
CREATE OR REPLACE FUNCTION public.fn_employees_view_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- core (18 col)
  INSERT INTO public.employees_core (
    id, tenant_id, skills, is_active, created_at, updated_at, pernr,
    employment_status, termination_date, termination_reason,
    profile_embedding, embedding_text_hash, embedding_model, embedding_generated_at,
    deleted_at, enrichment_consent, enrichment_consent_at, enrichment_consent_scope
  ) VALUES (
    COALESCE(NEW.id, uuid_generate_v4()), NEW.tenant_id, NEW.skills,
    COALESCE(NEW.is_active, true), COALESCE(NEW.created_at, now()), COALESCE(NEW.updated_at, now()),
    NEW.pernr, NEW.employment_status, NEW.termination_date, NEW.termination_reason,
    NEW.profile_embedding, NEW.embedding_text_hash, NEW.embedding_model, NEW.embedding_generated_at,
    NEW.deleted_at, COALESCE(NEW.enrichment_consent, false), NEW.enrichment_consent_at, NEW.enrichment_consent_scope
  );

  -- pii (38 col)
  INSERT INTO public.employees_pii (
    employee_id, tenant_id,
    first_name, last_name, middle_name, email, personal_email,
    birth_date, birth_place, gender, nationality, marital_status,
    address_street, address_city, address_postal_code, address_country, address_region,
    temp_address_street, temp_address_city, temp_address_postal_code, temp_address_country,
    phone_mobile, phone_work, phone_home,
    tax_id, national_id, national_id_expiry,
    passport_number, passport_expiry, driver_license, driver_license_expiry,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    family_members, education_history,
    highest_education_level, highest_education_institution, highest_education_field, highest_education_year
  ) VALUES (
    COALESCE(NEW.id, (SELECT id FROM public.employees_core WHERE id = NEW.id)),
    NEW.tenant_id,
    NEW.first_name, NEW.last_name, NEW.middle_name, NEW.email, NEW.personal_email,
    NEW.birth_date, NEW.birth_place, NEW.gender, NEW.nationality, NEW.marital_status,
    NEW.address_street, NEW.address_city, NEW.address_postal_code, NEW.address_country, NEW.address_region,
    NEW.temp_address_street, NEW.temp_address_city, NEW.temp_address_postal_code, NEW.temp_address_country,
    NEW.phone_mobile, NEW.phone_work, NEW.phone_home,
    NEW.tax_id, NEW.national_id, NEW.national_id_expiry,
    NEW.passport_number, NEW.passport_expiry, NEW.driver_license, NEW.driver_license_expiry,
    NEW.emergency_contact_name, NEW.emergency_contact_phone, NEW.emergency_contact_relationship,
    NEW.family_members, NEW.education_history,
    NEW.highest_education_level, NEW.highest_education_institution, NEW.highest_education_field, NEW.highest_education_year
  );

  -- hr (28 col)
  INSERT INTO public.employees_hr (
    employee_id, tenant_id,
    job_title, department, location, manager_id, hire_date,
    performance_rating, potential, legacy_org_unit_code,
    cost_center, cost_center_id, org_unit_id, location_id, position_id,
    employee_group, employee_subgroup, company_code, personnel_area, personnel_subarea,
    probation_end_date, seniority_date, contract_end_date, work_schedule_percentage,
    auth_username, auth_password_hash, auth_role, auth_permissions, auth_last_login, auth_username_candidate
  ) VALUES (
    COALESCE(NEW.id, (SELECT id FROM public.employees_core WHERE id = NEW.id)),
    NEW.tenant_id,
    NEW.job_title, NEW.department, NEW.location, NEW.manager_id, NEW.hire_date,
    NEW.performance_rating, NEW.potential, NEW.legacy_org_unit_code,
    NEW.cost_center, NEW.cost_center_id, NEW.org_unit_id, NEW.location_id, NEW.position_id,
    NEW.employee_group, NEW.employee_subgroup, NEW.company_code, NEW.personnel_area, NEW.personnel_subarea,
    NEW.probation_end_date, NEW.seniority_date, NEW.contract_end_date, NEW.work_schedule_percentage,
    NEW.auth_username, NEW.auth_password_hash, NEW.auth_role, NEW.auth_permissions, NEW.auth_last_login, NEW.auth_username_candidate
  );

  -- payroll (11 col)
  INSERT INTO public.employees_payroll (
    employee_id, tenant_id,
    salary, currency,
    pay_scale_area, pay_scale_type, pay_scale_group, pay_scale_level, pay_periods_per_year,
    iban, swift_bic, bank_name, bank_account_number
  ) VALUES (
    COALESCE(NEW.id, (SELECT id FROM public.employees_core WHERE id = NEW.id)),
    NEW.tenant_id,
    NEW.salary, NEW.currency,
    NEW.pay_scale_area, NEW.pay_scale_type, NEW.pay_scale_group, NEW.pay_scale_level, NEW.pay_periods_per_year,
    NEW.iban, NEW.swift_bic, NEW.bank_name, NEW.bank_account_number
  );

  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_employees_view_insert
INSTEAD OF INSERT ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.fn_employees_view_insert();

-- 6.2 UPDATE trigger: route changes to all 4 base tables
CREATE OR REPLACE FUNCTION public.fn_employees_view_update()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- core
  UPDATE public.employees_core SET
    tenant_id = NEW.tenant_id,
    skills = NEW.skills,
    is_active = NEW.is_active,
    updated_at = COALESCE(NEW.updated_at, now()),
    pernr = NEW.pernr,
    employment_status = NEW.employment_status,
    termination_date = NEW.termination_date,
    termination_reason = NEW.termination_reason,
    profile_embedding = NEW.profile_embedding,
    embedding_text_hash = NEW.embedding_text_hash,
    embedding_model = NEW.embedding_model,
    embedding_generated_at = NEW.embedding_generated_at,
    deleted_at = NEW.deleted_at,
    enrichment_consent = NEW.enrichment_consent,
    enrichment_consent_at = NEW.enrichment_consent_at,
    enrichment_consent_scope = NEW.enrichment_consent_scope
  WHERE id = OLD.id;

  -- pii
  UPDATE public.employees_pii SET
    tenant_id = NEW.tenant_id,
    first_name = NEW.first_name, last_name = NEW.last_name, middle_name = NEW.middle_name,
    email = NEW.email, personal_email = NEW.personal_email,
    birth_date = NEW.birth_date, birth_place = NEW.birth_place,
    gender = NEW.gender, nationality = NEW.nationality, marital_status = NEW.marital_status,
    address_street = NEW.address_street, address_city = NEW.address_city,
    address_postal_code = NEW.address_postal_code, address_country = NEW.address_country, address_region = NEW.address_region,
    temp_address_street = NEW.temp_address_street, temp_address_city = NEW.temp_address_city,
    temp_address_postal_code = NEW.temp_address_postal_code, temp_address_country = NEW.temp_address_country,
    phone_mobile = NEW.phone_mobile, phone_work = NEW.phone_work, phone_home = NEW.phone_home,
    tax_id = NEW.tax_id, national_id = NEW.national_id, national_id_expiry = NEW.national_id_expiry,
    passport_number = NEW.passport_number, passport_expiry = NEW.passport_expiry,
    driver_license = NEW.driver_license, driver_license_expiry = NEW.driver_license_expiry,
    emergency_contact_name = NEW.emergency_contact_name,
    emergency_contact_phone = NEW.emergency_contact_phone,
    emergency_contact_relationship = NEW.emergency_contact_relationship,
    family_members = NEW.family_members, education_history = NEW.education_history,
    highest_education_level = NEW.highest_education_level,
    highest_education_institution = NEW.highest_education_institution,
    highest_education_field = NEW.highest_education_field,
    highest_education_year = NEW.highest_education_year,
    updated_at = now()
  WHERE employee_id = OLD.id;

  -- hr
  UPDATE public.employees_hr SET
    tenant_id = NEW.tenant_id,
    job_title = NEW.job_title, department = NEW.department, location = NEW.location,
    manager_id = NEW.manager_id, hire_date = NEW.hire_date,
    performance_rating = NEW.performance_rating, potential = NEW.potential,
    legacy_org_unit_code = NEW.legacy_org_unit_code,
    cost_center = NEW.cost_center, cost_center_id = NEW.cost_center_id,
    org_unit_id = NEW.org_unit_id, location_id = NEW.location_id, position_id = NEW.position_id,
    employee_group = NEW.employee_group, employee_subgroup = NEW.employee_subgroup,
    company_code = NEW.company_code, personnel_area = NEW.personnel_area, personnel_subarea = NEW.personnel_subarea,
    probation_end_date = NEW.probation_end_date, seniority_date = NEW.seniority_date,
    contract_end_date = NEW.contract_end_date, work_schedule_percentage = NEW.work_schedule_percentage,
    auth_username = NEW.auth_username, auth_password_hash = NEW.auth_password_hash,
    auth_role = NEW.auth_role, auth_permissions = NEW.auth_permissions,
    auth_last_login = NEW.auth_last_login, auth_username_candidate = NEW.auth_username_candidate,
    updated_at = now()
  WHERE employee_id = OLD.id;

  -- payroll
  UPDATE public.employees_payroll SET
    tenant_id = NEW.tenant_id,
    salary = NEW.salary, currency = NEW.currency,
    pay_scale_area = NEW.pay_scale_area, pay_scale_type = NEW.pay_scale_type,
    pay_scale_group = NEW.pay_scale_group, pay_scale_level = NEW.pay_scale_level,
    pay_periods_per_year = NEW.pay_periods_per_year,
    iban = NEW.iban, swift_bic = NEW.swift_bic,
    bank_name = NEW.bank_name, bank_account_number = NEW.bank_account_number,
    updated_at = now()
  WHERE employee_id = OLD.id;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_employees_view_update
INSTEAD OF UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.fn_employees_view_update();

-- 6.3 DELETE trigger: drop from employees_core (FK CASCADE handles satellites)
CREATE OR REPLACE FUNCTION public.fn_employees_view_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM public.employees_core WHERE id = OLD.id;
  RETURN OLD;
END;
$function$;

CREATE TRIGGER trg_employees_view_delete
INSTEAD OF DELETE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.fn_employees_view_delete();

-- =============================================================================
-- 7. Verification asserts (final)
-- =============================================================================

DO $$
DECLARE
  v_view_rows integer;
  v_core_rows integer;
  v_fk_count integer;
  v_trg_count integer;
BEGIN
  SELECT count(*) INTO v_view_rows FROM public.employees;
  SELECT count(*) INTO v_core_rows FROM public.employees_core;
  IF v_view_rows != 270 OR v_core_rows != 270 THEN
    RAISE EXCEPTION 'phase16o final assert failed: view=% core=%, expected 270 each', v_view_rows, v_core_rows;
  END IF;

  SELECT count(*) INTO v_fk_count
  FROM pg_constraint
  WHERE confrelid = 'public.employees_core'::regclass AND contype = 'f';
  IF v_fk_count < 200 THEN
    RAISE EXCEPTION 'phase16o final assert failed: only % FK target employees_core, expected ~210', v_fk_count;
  END IF;

  SELECT count(*) INTO v_trg_count
  FROM pg_trigger
  WHERE tgrelid = 'public.employees'::regclass AND NOT tgisinternal;
  IF v_trg_count != 3 THEN
    RAISE EXCEPTION 'phase16o final assert failed: % triggers on view employees, expected 3 (insert/update/delete)', v_trg_count;
  END IF;

  RAISE NOTICE 'phase16o final asserts: view=% rows · core=% rows · FK=% target employees_core · INSTEAD OF triggers=%', v_view_rows, v_core_rows, v_fk_count, v_trg_count;
END;
$$;

COMMIT;

-- =============================================================================
-- POST-COMMIT NOTES
-- =============================================================================
--
-- 1. Run npm test --workspaces (target: 865 green, no regression)
-- 2. Run apply-canonical-users.mjs (target: 8/8 PASS bcrypt match)
-- 3. Optional: prisma db pull on services/app + services/api-gateway to verify
--    schema introspect treats employees as VIEW (no breaking change to model)
-- 4. Backup pre-apply: /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-*.dump
--    Restore: pg_restore -d heuresys_platform --clean -1 <dump>
