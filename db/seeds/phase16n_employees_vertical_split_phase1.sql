-- Phase 16.N · S24 · L59 — employees vertical-split Phase 1 (additive scaffold)
-- =============================================================================
-- ADDRESS audit § 1.2: employees has 95 columns / 19 indexes. Vertical-split
-- decouples PII / HR / Payroll into satellite 1:1 tables for:
--   - column-level access control (PII queries can be GRANTed restrictively)
--   - query plan optimization (most reads need only core+HR, not PII+payroll)
--   - audit/compliance separation (PII access logged separately)
--   - reduced row width on hot path (employees core stays slim)
--
-- Phase 1 (THIS migration — additive, no breaking changes):
--   1. Create 3 satellite tables (employees_pii, employees_hr, employees_payroll)
--      with FK 1:1 to employees(id) + tenant_id NOT NULL + RLS attivo FORCE
--   2. Populate from existing employees (270 row × 3 = 810 satellite rows)
--   3. Trigger AFTER INSERT/UPDATE on employees → propagate to satellites (sync)
--   4. View employees_full for JOIN read backward-compat
--   5. Indexes on satellite tables (mirror what existed on employees for those cols)
--
-- Phase 2 (DEFERRED to S26+, requires parallel app refactor):
--   - Migrate ~100+ Prisma + raw SQL queries to read from satellite tables
--   - Once all reads migrated, DROP COLUMN from employees for the migrated cols
--   - Drop sync trigger (writes go directly to satellites)
--   - Update Prisma schema for true vertical model
--
-- Refs:
--   - docs/_audit/2026-05-09-forensic-db-audit.md § 1.2
--   - .ux-design/DECISIONS-LOG.md L59
-- =============================================================================

BEGIN;

-- 1. employees_pii ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees_pii (
  employee_id                    uuid PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
  tenant_id                      uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  first_name                     varchar,
  last_name                      varchar,
  middle_name                    varchar,
  email                          varchar,
  personal_email                 varchar,
  birth_date                     date,
  birth_place                    varchar,
  gender                         varchar,
  nationality                    varchar,
  marital_status                 varchar,
  address_street                 varchar,
  address_city                   varchar,
  address_postal_code            varchar,
  address_country                varchar,
  address_region                 varchar,
  temp_address_street            varchar,
  temp_address_city              varchar,
  temp_address_postal_code       varchar,
  temp_address_country           varchar,
  phone_mobile                   varchar,
  phone_work                     varchar,
  phone_home                     varchar,
  tax_id                         varchar,
  national_id                    varchar,
  national_id_expiry             date,
  passport_number                varchar,
  passport_expiry                date,
  driver_license                 varchar,
  driver_license_expiry          date,
  emergency_contact_name         varchar,
  emergency_contact_phone        varchar,
  emergency_contact_relationship varchar,
  family_members                 jsonb,
  education_history              jsonb,
  highest_education_level        varchar,
  highest_education_institution  varchar,
  highest_education_field        varchar,
  highest_education_year         integer,
  created_at                     timestamptz NOT NULL DEFAULT now(),
  updated_at                     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_pii_tenant ON public.employees_pii(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_pii_email ON public.employees_pii(email);
CREATE INDEX IF NOT EXISTS idx_employees_pii_lastname ON public.employees_pii(last_name);

ALTER TABLE public.employees_pii ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees_pii FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS employees_pii_isolation ON public.employees_pii;
CREATE POLICY employees_pii_isolation ON public.employees_pii
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 2. employees_hr -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees_hr (
  employee_id                  uuid PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
  tenant_id                    uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  job_title                    varchar,
  department                   varchar,
  location                     varchar,
  manager_id                   uuid,
  hire_date                    date,
  performance_rating           numeric,
  potential                    varchar,
  legacy_org_unit_code         varchar,
  cost_center                  varchar,
  cost_center_id               uuid,
  org_unit_id                  uuid,
  location_id                  uuid,
  position_id                  varchar,
  employee_group               varchar,
  employee_subgroup            varchar,
  company_code                 varchar,
  personnel_area               varchar,
  personnel_subarea            varchar,
  probation_end_date           date,
  seniority_date               date,
  contract_end_date            date,
  work_schedule_percentage     numeric,
  auth_username                varchar,
  auth_password_hash           varchar,
  auth_role                    varchar,
  auth_permissions             text[],
  auth_last_login              timestamp,
  auth_username_candidate      varchar,
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_hr_tenant ON public.employees_hr(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_hr_manager ON public.employees_hr(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_hr_dept ON public.employees_hr(department);
CREATE INDEX IF NOT EXISTS idx_employees_hr_perf ON public.employees_hr(performance_rating DESC);

ALTER TABLE public.employees_hr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees_hr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS employees_hr_isolation ON public.employees_hr;
CREATE POLICY employees_hr_isolation ON public.employees_hr
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 3. employees_payroll --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees_payroll (
  employee_id            uuid PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
  tenant_id              uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  salary                 numeric,
  currency               varchar,
  pay_scale_area         varchar,
  pay_scale_type         varchar,
  pay_scale_group        varchar,
  pay_scale_level        varchar,
  pay_periods_per_year   integer,
  iban                   varchar,
  swift_bic              varchar,
  bank_name              varchar,
  bank_account_number    varchar,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_payroll_tenant ON public.employees_payroll(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_payroll_salary ON public.employees_payroll(salary);

ALTER TABLE public.employees_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees_payroll FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS employees_payroll_isolation ON public.employees_payroll;
CREATE POLICY employees_payroll_isolation ON public.employees_payroll
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 4. Initial population (run once, idempotent via ON CONFLICT) ---------------

INSERT INTO public.employees_pii (
  employee_id, tenant_id, first_name, last_name, middle_name, email, personal_email,
  birth_date, birth_place, gender, nationality, marital_status,
  address_street, address_city, address_postal_code, address_country, address_region,
  temp_address_street, temp_address_city, temp_address_postal_code, temp_address_country,
  phone_mobile, phone_work, phone_home,
  tax_id, national_id, national_id_expiry, passport_number, passport_expiry,
  driver_license, driver_license_expiry,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
  family_members, education_history,
  highest_education_level, highest_education_institution, highest_education_field, highest_education_year
)
SELECT
  id, tenant_id, first_name, last_name, middle_name, email, personal_email,
  birth_date, birth_place, gender, nationality, marital_status,
  address_street, address_city, address_postal_code, address_country, address_region,
  temp_address_street, temp_address_city, temp_address_postal_code, temp_address_country,
  phone_mobile, phone_work, phone_home,
  tax_id, national_id, national_id_expiry, passport_number, passport_expiry,
  driver_license, driver_license_expiry,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
  family_members, education_history,
  highest_education_level, highest_education_institution, highest_education_field, highest_education_year
FROM public.employees
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO public.employees_hr (
  employee_id, tenant_id, job_title, department, location, manager_id, hire_date,
  performance_rating, potential, legacy_org_unit_code, cost_center, cost_center_id, org_unit_id, location_id,
  position_id, employee_group, employee_subgroup, company_code, personnel_area, personnel_subarea,
  probation_end_date, seniority_date, contract_end_date, work_schedule_percentage,
  auth_username, auth_password_hash, auth_role, auth_permissions, auth_last_login, auth_username_candidate
)
SELECT
  id, tenant_id, job_title, department, location, manager_id, hire_date,
  performance_rating, potential, legacy_org_unit_code, cost_center, cost_center_id, org_unit_id, location_id,
  position_id, employee_group, employee_subgroup, company_code, personnel_area, personnel_subarea,
  probation_end_date, seniority_date, contract_end_date, work_schedule_percentage,
  auth_username, auth_password_hash, auth_role, auth_permissions, auth_last_login, auth_username_candidate
FROM public.employees
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO public.employees_payroll (
  employee_id, tenant_id, salary, currency,
  pay_scale_area, pay_scale_type, pay_scale_group, pay_scale_level, pay_periods_per_year,
  iban, swift_bic, bank_name, bank_account_number
)
SELECT
  id, tenant_id, salary, currency,
  pay_scale_area, pay_scale_type, pay_scale_group, pay_scale_level, pay_periods_per_year,
  iban, swift_bic, bank_name, bank_account_number
FROM public.employees
ON CONFLICT (employee_id) DO NOTHING;

-- 5. Sync trigger: AFTER INSERT/UPDATE on employees → propagate to satellites
-- (Phase 1 backward compat: writes still target employees, satellites stay in sync.)

CREATE OR REPLACE FUNCTION public.fn_sync_employees_to_satellites()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.employees_pii (employee_id, tenant_id, first_name, last_name, middle_name, email, personal_email, birth_date, birth_place, gender, nationality, marital_status, address_street, address_city, address_postal_code, address_country, address_region, temp_address_street, temp_address_city, temp_address_postal_code, temp_address_country, phone_mobile, phone_work, phone_home, tax_id, national_id, national_id_expiry, passport_number, passport_expiry, driver_license, driver_license_expiry, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, family_members, education_history, highest_education_level, highest_education_institution, highest_education_field, highest_education_year)
    VALUES (NEW.id, NEW.tenant_id, NEW.first_name, NEW.last_name, NEW.middle_name, NEW.email, NEW.personal_email, NEW.birth_date, NEW.birth_place, NEW.gender, NEW.nationality, NEW.marital_status, NEW.address_street, NEW.address_city, NEW.address_postal_code, NEW.address_country, NEW.address_region, NEW.temp_address_street, NEW.temp_address_city, NEW.temp_address_postal_code, NEW.temp_address_country, NEW.phone_mobile, NEW.phone_work, NEW.phone_home, NEW.tax_id, NEW.national_id, NEW.national_id_expiry, NEW.passport_number, NEW.passport_expiry, NEW.driver_license, NEW.driver_license_expiry, NEW.emergency_contact_name, NEW.emergency_contact_phone, NEW.emergency_contact_relationship, NEW.family_members, NEW.education_history, NEW.highest_education_level, NEW.highest_education_institution, NEW.highest_education_field, NEW.highest_education_year)
    ON CONFLICT (employee_id) DO NOTHING;

    INSERT INTO public.employees_hr (employee_id, tenant_id, job_title, department, location, manager_id, hire_date, performance_rating, potential, legacy_org_unit_code, cost_center, cost_center_id, org_unit_id, location_id, position_id, employee_group, employee_subgroup, company_code, personnel_area, personnel_subarea, probation_end_date, seniority_date, contract_end_date, work_schedule_percentage, auth_username, auth_password_hash, auth_role, auth_permissions, auth_last_login, auth_username_candidate)
    VALUES (NEW.id, NEW.tenant_id, NEW.job_title, NEW.department, NEW.location, NEW.manager_id, NEW.hire_date, NEW.performance_rating, NEW.potential, NEW.legacy_org_unit_code, NEW.cost_center, NEW.cost_center_id, NEW.org_unit_id, NEW.location_id, NEW.position_id, NEW.employee_group, NEW.employee_subgroup, NEW.company_code, NEW.personnel_area, NEW.personnel_subarea, NEW.probation_end_date, NEW.seniority_date, NEW.contract_end_date, NEW.work_schedule_percentage, NEW.auth_username, NEW.auth_password_hash, NEW.auth_role, NEW.auth_permissions, NEW.auth_last_login, NEW.auth_username_candidate)
    ON CONFLICT (employee_id) DO NOTHING;

    INSERT INTO public.employees_payroll (employee_id, tenant_id, salary, currency, pay_scale_area, pay_scale_type, pay_scale_group, pay_scale_level, pay_periods_per_year, iban, swift_bic, bank_name, bank_account_number)
    VALUES (NEW.id, NEW.tenant_id, NEW.salary, NEW.currency, NEW.pay_scale_area, NEW.pay_scale_type, NEW.pay_scale_group, NEW.pay_scale_level, NEW.pay_periods_per_year, NEW.iban, NEW.swift_bic, NEW.bank_name, NEW.bank_account_number)
    ON CONFLICT (employee_id) DO NOTHING;

  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE public.employees_pii SET
      tenant_id = NEW.tenant_id, first_name = NEW.first_name, last_name = NEW.last_name, middle_name = NEW.middle_name,
      email = NEW.email, personal_email = NEW.personal_email, birth_date = NEW.birth_date, birth_place = NEW.birth_place,
      gender = NEW.gender, nationality = NEW.nationality, marital_status = NEW.marital_status,
      address_street = NEW.address_street, address_city = NEW.address_city, address_postal_code = NEW.address_postal_code,
      address_country = NEW.address_country, address_region = NEW.address_region,
      temp_address_street = NEW.temp_address_street, temp_address_city = NEW.temp_address_city,
      temp_address_postal_code = NEW.temp_address_postal_code, temp_address_country = NEW.temp_address_country,
      phone_mobile = NEW.phone_mobile, phone_work = NEW.phone_work, phone_home = NEW.phone_home,
      tax_id = NEW.tax_id, national_id = NEW.national_id, national_id_expiry = NEW.national_id_expiry,
      passport_number = NEW.passport_number, passport_expiry = NEW.passport_expiry,
      driver_license = NEW.driver_license, driver_license_expiry = NEW.driver_license_expiry,
      emergency_contact_name = NEW.emergency_contact_name, emergency_contact_phone = NEW.emergency_contact_phone,
      emergency_contact_relationship = NEW.emergency_contact_relationship,
      family_members = NEW.family_members, education_history = NEW.education_history,
      highest_education_level = NEW.highest_education_level,
      highest_education_institution = NEW.highest_education_institution,
      highest_education_field = NEW.highest_education_field, highest_education_year = NEW.highest_education_year,
      updated_at = now()
    WHERE employee_id = NEW.id;

    UPDATE public.employees_hr SET
      tenant_id = NEW.tenant_id, job_title = NEW.job_title, department = NEW.department, location = NEW.location,
      manager_id = NEW.manager_id, hire_date = NEW.hire_date, performance_rating = NEW.performance_rating,
      potential = NEW.potential, legacy_org_unit_code = NEW.legacy_org_unit_code, cost_center = NEW.cost_center,
      cost_center_id = NEW.cost_center_id, org_unit_id = NEW.org_unit_id, location_id = NEW.location_id,
      position_id = NEW.position_id, employee_group = NEW.employee_group, employee_subgroup = NEW.employee_subgroup,
      company_code = NEW.company_code, personnel_area = NEW.personnel_area, personnel_subarea = NEW.personnel_subarea,
      probation_end_date = NEW.probation_end_date, seniority_date = NEW.seniority_date,
      contract_end_date = NEW.contract_end_date, work_schedule_percentage = NEW.work_schedule_percentage,
      auth_username = NEW.auth_username, auth_password_hash = NEW.auth_password_hash, auth_role = NEW.auth_role,
      auth_permissions = NEW.auth_permissions, auth_last_login = NEW.auth_last_login,
      auth_username_candidate = NEW.auth_username_candidate,
      updated_at = now()
    WHERE employee_id = NEW.id;

    UPDATE public.employees_payroll SET
      tenant_id = NEW.tenant_id, salary = NEW.salary, currency = NEW.currency,
      pay_scale_area = NEW.pay_scale_area, pay_scale_type = NEW.pay_scale_type,
      pay_scale_group = NEW.pay_scale_group, pay_scale_level = NEW.pay_scale_level,
      pay_periods_per_year = NEW.pay_periods_per_year,
      iban = NEW.iban, swift_bic = NEW.swift_bic, bank_name = NEW.bank_name, bank_account_number = NEW.bank_account_number,
      updated_at = now()
    WHERE employee_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_employees_to_satellites ON public.employees;
CREATE TRIGGER trg_sync_employees_to_satellites
  AFTER INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_sync_employees_to_satellites();

-- 6. Backward-compat view: employees_full = employees ⋈ satellites -----------

CREATE OR REPLACE VIEW public.employees_full AS
SELECT
  e.*,
  pii.first_name AS pii_first_name, pii.last_name AS pii_last_name,
  hr.job_title AS hr_job_title, hr.department AS hr_department,
  pay.salary AS pay_salary, pay.currency AS pay_currency
FROM public.employees e
  LEFT JOIN public.employees_pii pii ON pii.employee_id = e.id
  LEFT JOIN public.employees_hr hr ON hr.employee_id = e.id
  LEFT JOIN public.employees_payroll pay ON pay.employee_id = e.id;

-- 7. Asserzioni ---------------------------------------------------------------

DO $$
DECLARE
  v_emp_count INT;
  v_pii_count INT;
  v_hr_count INT;
  v_pay_count INT;
BEGIN
  SELECT count(*) INTO v_emp_count FROM public.employees;
  SELECT count(*) INTO v_pii_count FROM public.employees_pii;
  SELECT count(*) INTO v_hr_count FROM public.employees_hr;
  SELECT count(*) INTO v_pay_count FROM public.employees_payroll;

  IF v_pii_count != v_emp_count THEN
    RAISE EXCEPTION 'phase16n: PII satellite count % != employees count %', v_pii_count, v_emp_count;
  END IF;
  IF v_hr_count != v_emp_count THEN
    RAISE EXCEPTION 'phase16n: HR satellite count % != employees count %', v_hr_count, v_emp_count;
  END IF;
  IF v_pay_count != v_emp_count THEN
    RAISE EXCEPTION 'phase16n: Payroll satellite count % != employees count %', v_pay_count, v_emp_count;
  END IF;

  RAISE NOTICE 'phase16n: vertical-split Phase 1 complete. % employees + % PII + % HR + % Payroll satellite rows. Trigger sync active. View employees_full available.', v_emp_count, v_pii_count, v_hr_count, v_pay_count;
END $$;

COMMIT;
