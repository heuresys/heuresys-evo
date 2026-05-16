# Dominio SMERTO — Salary-Merit-Equity-Reward-TOtal

> Compensation Cycle

**Tabelle in questo dominio**: 16

## Tabelle

| Tabella                                               | Rows | Tenant | RLS | FK out | Cols |
| ----------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`bonus_allocations`](#bonusallocations)              | 244  | ✓      | ✓   | 3      | 16   |
| [`bonus_plans`](#bonusplans)                          | 10   | ✓      | ✓   | 2      | 18   |
| [`equity_grants`](#equitygrants)                      | -1   | ✓      | ✓   | 2      | 13   |
| [`merit_cycles`](#meritcycles)                        | 53   | ✓      | ✓   | 2      | 17   |
| [`merit_recommendations`](#meritrecommendations)      | 208  | ✓      | ✓   | 4      | 20   |
| [`payroll_anomaly_patterns`](#payrollanomalypatterns) | 0    | ✓      | ✓   | 1      | 13   |
| [`payroll_export_employees`](#payrollexportemployees) | 0    | ✓      | ✓   | 3      | 27   |
| [`payroll_export_files`](#payrollexportfiles)         | 0    | ✓      | ✓   | 2      | 18   |
| [`payroll_export_jobs`](#payrollexportjobs)           | 1    | ✓      | ✓   | 2      | 51   |
| [`payroll_field_mappings`](#payrollfieldmappings)     | 46   | ✓      | ✓   | 2      | 22   |
| [`payroll_integrations`](#payrollintegrations)        | 1    | ✓      | ✓   | 1      | 42   |
| [`payroll_transmission_log`](#payrolltransmissionlog) | 0    | ✓      | ✓   | 2      | 22   |
| [`payroll_validation_rules`](#payrollvalidationrules) | 11   | ✓      | ✓   | 1      | 16   |
| [`salary_band_assignments`](#salarybandassignments)   | 238  | ✓      | ✓   | 4      | 12   |
| [`salary_bands`](#salarybands)                        | 23   | ✓      | ✓   | 2      | 22   |
| [`salary_history`](#salaryhistory)                    | 317  | ✓      | ✓   | 4      | 15   |

---

### `bonus_allocations`

- **Tenant scoped**: yes
- **Row estimate**: 244
- **Domains**: SMERTO
- **Prisma model**: `bonus_allocations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type          | Null | Default                        | Notes |
| --- | ------------------------- | ------------- | ---- | ------------------------------ | ----- |
| 1   | `id`                      | uuid          | NO   | `gen_random_uuid()`            | PK    |
| 2   | `plan_id`                 | uuid          | YES  | —                              |       |
| 3   | `employee_id`             | uuid          | YES  | —                              |       |
| 4   | `target_amount`           | numeric(12,2) | YES  | —                              |       |
| 5   | `actual_amount`           | numeric(12,2) | YES  | —                              |       |
| 6   | `performance_rating`      | varchar(20)   | YES  | —                              |       |
| 7   | `performance_multiplier`  | numeric(5,2)  | YES  | `1.0`                          |       |
| 8   | `status`                  | varchar(30)   | YES  | `'pending'::character varying` |       |
| 9   | `approved_by`             | uuid          | YES  | —                              |       |
| 10  | `approved_at`             | timestamp     | YES  | —                              |       |
| 11  | `paid_at`                 | timestamp     | YES  | —                              |       |
| 12  | `notes`                   | text          | YES  | —                              |       |
| 13  | `created_at`              | timestamp     | YES  | `now()`                        |       |
| 14  | `updated_at`              | timestamp     | YES  | `now()`                        |       |
| 15  | `approved_by_employee_id` | uuid          | YES  | —                              |       |
| 16  | `tenant_id`               | uuid          | NO   | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `approved_by_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `employee_id`             | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `bonus_allocations_pkey` [PRIMARY] · (`id`)
- `idx_bonus_allocations_approved_by_employee_id` [INDEX] · (`approved_by_employee_id`)
- `idx_bonus_allocations_emp` [INDEX] · (`employee_id`)
- `idx_bonus_allocations_plan` [INDEX] · (`plan_id`)
- `idx_bonus_allocations_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_bonus_allocations** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `bonus_plans`

- **Tenant scoped**: yes
- **Row estimate**: 10
- **Domains**: SMERTO
- **Prisma model**: `bonus_plans`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type          | Null | Default                           | Notes |
| --- | ------------------------- | ------------- | ---- | --------------------------------- | ----- |
| 1   | `id`                      | uuid          | NO   | `gen_random_uuid()`               | PK    |
| 2   | `tenant_id`               | uuid          | NO   | —                                 |       |
| 3   | `name`                    | varchar(200)  | NO   | —                                 |       |
| 4   | `description`             | text          | YES  | —                                 |       |
| 5   | `bonus_type`              | varchar(50)   | NO   | —                                 |       |
| 6   | `period_start`            | date          | YES  | —                                 |       |
| 7   | `period_end`              | date          | YES  | —                                 |       |
| 8   | `payout_date`             | date          | YES  | —                                 |       |
| 9   | `total_budget`            | numeric(15,2) | YES  | —                                 |       |
| 10  | `allocated_amount`        | numeric(15,2) | YES  | `0`                               |       |
| 11  | `calculation_method`      | varchar(50)   | YES  | `'percentage'::character varying` |       |
| 12  | `eligibility_rules`       | jsonb         | YES  | —                                 |       |
| 13  | `performance_multipliers` | jsonb         | YES  | —                                 |       |
| 14  | `status`                  | varchar(30)   | YES  | `'draft'::character varying`      |       |
| 15  | `created_by`              | uuid          | YES  | —                                 |       |
| 16  | `created_at`              | timestamp     | YES  | `now()`                           |       |
| 17  | `updated_at`              | timestamp     | YES  | `now()`                           |       |
| 18  | `created_by_employee_id`  | uuid          | YES  | —                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `bonus_plans_pkey` [PRIMARY] · (`id`)
- `idx_bonus_plans_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_bonus_plans_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `equity_grants`

- **Tenant scoped**: yes
- **Row estimate**: -1
- **Domains**: SMERTO
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type          | Null | Default             | Notes |
| --- | ------------------ | ------------- | ---- | ------------------- | ----- |
| 1   | `id`               | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`        | uuid          | NO   | —                   |       |
| 3   | `employee_id`      | uuid          | NO   | —                   |       |
| 4   | `grant_type`       | text          | NO   | —                   |       |
| 5   | `shares_granted`   | numeric(18,4) | NO   | —                   |       |
| 6   | `strike_price`     | numeric(12,4) | YES  | —                   |       |
| 7   | `fair_value`       | numeric(18,2) | NO   | —                   |       |
| 8   | `currency`         | bpchar(3)     | NO   | `'EUR'::bpchar`     |       |
| 9   | `grant_date`       | date          | NO   | —                   |       |
| 10  | `vesting_schedule` | jsonb         | YES  | —                   |       |
| 11  | `status`           | text          | NO   | `'active'::text`    |       |
| 12  | `created_at`       | timestamptz   | YES  | `now()`             |       |
| 13  | `updated_at`       | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `equity_grants_pkey` [PRIMARY] · (`id`)
- `idx_equity_grants_active` [INDEX] · (`tenant_id`, `status`)
- `idx_equity_grants_tenant_employee` [INDEX] · (`tenant_id`, `employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `merit_cycles`

- **Tenant scoped**: yes
- **Row estimate**: 53
- **Domains**: SMERTO
- **Prisma model**: `merit_cycles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type          | Null | Default                      | Notes |
| --- | ------------------------ | ------------- | ---- | ---------------------------- | ----- |
| 1   | `id`                     | uuid          | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`              | uuid          | NO   | —                            |       |
| 3   | `name`                   | varchar(200)  | NO   | —                            |       |
| 4   | `description`            | text          | YES  | —                            |       |
| 5   | `effective_date`         | date          | NO   | —                            |       |
| 6   | `submission_deadline`    | date          | YES  | —                            |       |
| 7   | `approval_deadline`      | date          | YES  | —                            |       |
| 8   | `total_budget`           | numeric(15,2) | YES  | —                            |       |
| 9   | `budget_spent`           | numeric(15,2) | YES  | `0`                          |       |
| 10  | `min_increase_percent`   | numeric(5,2)  | YES  | `0`                          |       |
| 11  | `max_increase_percent`   | numeric(5,2)  | YES  | `20`                         |       |
| 12  | `guideline_matrix`       | jsonb         | YES  | —                            |       |
| 13  | `status`                 | varchar(30)   | YES  | `'draft'::character varying` |       |
| 14  | `created_by`             | uuid          | YES  | —                            |       |
| 15  | `created_at`             | timestamp     | YES  | `now()`                      |       |
| 16  | `updated_at`             | timestamp     | YES  | `now()`                      |       |
| 17  | `created_by_employee_id` | uuid          | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_merit_cycles_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_merit_cycles_status` [INDEX] · (`status`)
- `idx_merit_cycles_tenant` [INDEX] · (`tenant_id`)
- `merit_cycles_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `merit_recommendations`

- **Tenant scoped**: yes
- **Row estimate**: 208
- **Domains**: SMERTO
- **Prisma model**: `merit_recommendations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                         | Type          | Null | Default                        | Notes |
| --- | ------------------------------ | ------------- | ---- | ------------------------------ | ----- |
| 1   | `id`                           | uuid          | NO   | `gen_random_uuid()`            | PK    |
| 2   | `cycle_id`                     | uuid          | YES  | —                              |       |
| 3   | `employee_id`                  | uuid          | YES  | —                              |       |
| 4   | `current_salary`               | numeric(12,2) | YES  | —                              |       |
| 5   | `current_bonus_target`         | numeric(12,2) | YES  | —                              |       |
| 6   | `recommended_increase_percent` | numeric(5,2)  | YES  | —                              |       |
| 7   | `recommended_increase_amount`  | numeric(12,2) | YES  | —                              |       |
| 8   | `new_salary`                   | numeric(12,2) | YES  | —                              |       |
| 9   | `performance_rating`           | varchar(20)   | YES  | —                              |       |
| 10  | `justification`                | text          | YES  | —                              |       |
| 11  | `status`                       | varchar(30)   | YES  | `'pending'::character varying` |       |
| 12  | `submitted_by`                 | uuid          | YES  | —                              |       |
| 13  | `submitted_at`                 | timestamp     | YES  | —                              |       |
| 14  | `approved_by`                  | uuid          | YES  | —                              |       |
| 15  | `approved_at`                  | timestamp     | YES  | —                              |       |
| 16  | `created_at`                   | timestamp     | YES  | `now()`                        |       |
| 17  | `updated_at`                   | timestamp     | YES  | `now()`                        |       |
| 18  | `approved_by_employee_id`      | uuid          | YES  | —                              |       |
| 19  | `submitted_by_employee_id`     | uuid          | YES  | —                              |       |
| 20  | `tenant_id`                    | uuid          | NO   | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                    | References           | ON UPDATE | ON DELETE | Notes |
| -------------------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`                | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `employee_id`              | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `approved_by_employee_id`  | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `submitted_by_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_merit_recommendations_approved_by_employee_id` [INDEX] · (`approved_by_employee_id`)
- `idx_merit_recommendations_cycle` [INDEX] · (`cycle_id`)
- `idx_merit_recommendations_emp` [INDEX] · (`employee_id`)
- `idx_merit_recommendations_submitted_by_employee_id` [INDEX] · (`submitted_by_employee_id`)
- `idx_merit_recommendations_tenant` [INDEX] · (`tenant_id`)
- `merit_recommendations_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_merit_recommendations** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `payroll_anomaly_patterns`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SMERTO
- **Prisma model**: `payroll_anomaly_patterns`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                        | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                              |       |
| 3   | `pattern_code`        | varchar(50)  | NO   | —                              |       |
| 4   | `pattern_name`        | varchar(200) | NO   | —                              |       |
| 5   | `pattern_description` | text         | YES  | —                              |       |
| 6   | `detection_type`      | varchar(30)  | NO   | —                              |       |
| 7   | `detection_config`    | jsonb        | NO   | —                              |       |
| 8   | `severity`            | varchar(20)  | YES  | `'warning'::character varying` |       |
| 9   | `requires_approval`   | bool         | YES  | `false`                        |       |
| 10  | `is_active`           | bool         | YES  | `true`                         |       |
| 11  | `created_at`          | timestamp    | YES  | `now()`                        |       |
| 12  | `updated_at`          | timestamp    | YES  | `now()`                        |       |
| 13  | `deleted_at`          | timestamptz  | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_anomaly_patterns_active` [INDEX] · (`id`)
- `idx_payroll_anomaly_patterns_tenant_id` [INDEX] · (`tenant_id`)
- `payroll_anomaly_patterns_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_or_system_anomaly_patterns** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `payroll_export_employees`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SMERTO
- **Prisma model**: `payroll_export_employees`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                        | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `job_id`               | uuid         | NO   | —                              |       |
| 3   | `employee_id`          | uuid         | NO   | —                              |       |
| 4   | `tenant_id`            | uuid         | NO   | —                              |       |
| 5   | `employee_code`        | varchar(50)  | YES  | —                              |       |
| 6   | `fiscal_code`          | varchar(20)  | YES  | —                              |       |
| 7   | `status`               | varchar(30)  | YES  | `'pending'::character varying` |       |
| 8   | `sections_included`    | \_text       | YES  | —                              |       |
| 9   | `validation_errors`    | jsonb        | YES  | `'[]'::jsonb`                  |       |
| 10  | `validation_warnings`  | jsonb        | YES  | `'[]'::jsonb`                  |       |
| 11  | `validation_overrides` | jsonb        | YES  | `'[]'::jsonb`                  |       |
| 12  | `anagrafica_data`      | jsonb        | YES  | —                              |       |
| 13  | `presenze_data`        | jsonb        | YES  | —                              |       |
| 14  | `straordinari_data`    | jsonb        | YES  | —                              |       |
| 15  | `variazioni_data`      | jsonb        | YES  | —                              |       |
| 16  | `assenze_data`         | jsonb        | YES  | —                              |       |
| 17  | `days_worked`          | int4(32)     | YES  | —                              |       |
| 18  | `days_absent`          | int4(32)     | YES  | —                              |       |
| 19  | `hours_regular`        | numeric(6,2) | YES  | —                              |       |
| 20  | `hours_overtime`       | numeric(6,2) | YES  | —                              |       |
| 21  | `hours_night`          | numeric(6,2) | YES  | —                              |       |
| 22  | `hours_holiday`        | numeric(6,2) | YES  | —                              |       |
| 23  | `leave_breakdown`      | jsonb        | YES  | —                              |       |
| 24  | `processed_at`         | timestamp    | YES  | —                              |       |
| 25  | `export_line_number`   | int4(32)     | YES  | —                              |       |
| 26  | `created_at`           | timestamp    | YES  | `now()`                        |       |
| 27  | `updated_at`           | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References                | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `job_id`      | `payroll_export_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_export_employees_employee` [INDEX] · (`employee_id`)
- `idx_payroll_export_employees_job` [INDEX] · (`job_id`)
- `idx_payroll_export_employees_status` [INDEX] · (`status`)
- `idx_payroll_export_employees_tenant_id` [INDEX] · (`tenant_id`)
- `payroll_export_employees_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_payroll_export_employees** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `payroll_export_files`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SMERTO
- **Prisma model**: `payroll_export_files`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                      | Notes |
| --- | -------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `job_id`             | uuid         | NO   | —                            |       |
| 3   | `tenant_id`          | uuid         | NO   | —                            |       |
| 4   | `file_type`          | varchar(30)  | NO   | —                            |       |
| 5   | `file_name`          | varchar(255) | NO   | —                            |       |
| 6   | `file_path`          | text         | NO   | —                            |       |
| 7   | `file_size`          | int8(64)     | YES  | —                            |       |
| 8   | `file_hash`          | varchar(64)  | YES  | —                            |       |
| 9   | `mime_type`          | varchar(100) | YES  | —                            |       |
| 10  | `storage_type`       | varchar(30)  | YES  | `'local'::character varying` |       |
| 11  | `storage_reference`  | text         | YES  | —                            |       |
| 12  | `expires_at`         | timestamp    | YES  | —                            |       |
| 13  | `is_archived`        | bool         | YES  | `false`                      |       |
| 14  | `archived_at`        | timestamp    | YES  | —                            |       |
| 15  | `created_at`         | timestamp    | YES  | `now()`                      |       |
| 16  | `downloaded_count`   | int4(32)     | YES  | `0`                          |       |
| 17  | `last_downloaded_at` | timestamp    | YES  | —                            |       |
| 18  | `last_downloaded_by` | uuid         | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References                | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------- | --------- | --------- | ----- |
| `job_id`    | `payroll_export_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_export_files_job` [INDEX] · (`job_id`)
- `idx_payroll_export_files_tenant` [INDEX] · (`tenant_id`)
- `payroll_export_files_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_payroll_export_files** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `payroll_export_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: SMERTO
- **Prisma model**: `payroll_export_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                      | Type         | Null | Default                                                                                 | Notes |
| --- | --------------------------- | ------------ | ---- | --------------------------------------------------------------------------------------- | ----- |
| 1   | `id`                        | uuid         | NO   | `gen_random_uuid()`                                                                     | PK    |
| 2   | `tenant_id`                 | uuid         | NO   | —                                                                                       |       |
| 3   | `integration_id`            | uuid         | YES  | —                                                                                       |       |
| 4   | `job_number`                | varchar(50)  | NO   | —                                                                                       |       |
| 5   | `job_name`                  | varchar(200) | YES  | —                                                                                       |       |
| 6   | `pay_period_year`           | int4(32)     | NO   | —                                                                                       |       |
| 7   | `pay_period_month`          | int4(32)     | NO   | —                                                                                       |       |
| 8   | `period_start_date`         | date         | NO   | —                                                                                       |       |
| 9   | `period_end_date`           | date         | NO   | —                                                                                       |       |
| 10  | `export_type`               | varchar(30)  | NO   | —                                                                                       |       |
| 11  | `export_sections`           | \_text       | YES  | `ARRAY['anagrafica'::text, 'presenze'::text, 'straordinari'::text, 'variazioni'::text]` |       |
| 12  | `status`                    | varchar(30)  | YES  | `'draft'::character varying`                                                            |       |
| 13  | `progress_percent`          | int4(32)     | YES  | `0`                                                                                     |       |
| 14  | `current_phase`             | varchar(50)  | YES  | —                                                                                       |       |
| 15  | `total_employees`           | int4(32)     | YES  | `0`                                                                                     |       |
| 16  | `exported_employees`        | int4(32)     | YES  | `0`                                                                                     |       |
| 17  | `employees_with_errors`     | int4(32)     | YES  | `0`                                                                                     |       |
| 18  | `employees_with_warnings`   | int4(32)     | YES  | `0`                                                                                     |       |
| 19  | `validation_started_at`     | timestamp    | YES  | —                                                                                       |       |
| 20  | `validation_completed_at`   | timestamp    | YES  | —                                                                                       |       |
| 21  | `validation_errors`         | jsonb        | YES  | `'[]'::jsonb`                                                                           |       |
| 22  | `validation_warnings`       | jsonb        | YES  | `'[]'::jsonb`                                                                           |       |
| 23  | `validation_summary`        | jsonb        | YES  | —                                                                                       |       |
| 24  | `export_started_at`         | timestamp    | YES  | —                                                                                       |       |
| 25  | `export_completed_at`       | timestamp    | YES  | —                                                                                       |       |
| 26  | `export_file_path`          | text         | YES  | —                                                                                       |       |
| 27  | `export_file_size`          | int8(64)     | YES  | —                                                                                       |       |
| 28  | `export_file_hash`          | varchar(64)  | YES  | —                                                                                       |       |
| 29  | `export_file_name`          | varchar(255) | YES  | —                                                                                       |       |
| 30  | `transmission_method`       | varchar(20)  | YES  | —                                                                                       |       |
| 31  | `transmission_started_at`   | timestamp    | YES  | —                                                                                       |       |
| 32  | `transmission_completed_at` | timestamp    | YES  | —                                                                                       |       |
| 33  | `transmission_reference`    | varchar(100) | YES  | —                                                                                       |       |
| 34  | `transmission_response`     | jsonb        | YES  | —                                                                                       |       |
| 35  | `acknowledged_at`           | timestamp    | YES  | —                                                                                       |       |
| 36  | `acknowledgment_reference`  | varchar(100) | YES  | —                                                                                       |       |
| 37  | `acknowledgment_details`    | jsonb        | YES  | —                                                                                       |       |
| 38  | `records_accepted`          | int4(32)     | YES  | —                                                                                       |       |
| 39  | `records_rejected`          | int4(32)     | YES  | —                                                                                       |       |
| 40  | `error_code`                | varchar(50)  | YES  | —                                                                                       |       |
| 41  | `error_message`             | text         | YES  | —                                                                                       |       |
| 42  | `error_details`             | jsonb        | YES  | —                                                                                       |       |
| 43  | `retry_count`               | int4(32)     | YES  | `0`                                                                                     |       |
| 44  | `last_retry_at`             | timestamp    | YES  | —                                                                                       |       |
| 45  | `created_at`                | timestamp    | YES  | `now()`                                                                                 |       |
| 46  | `updated_at`                | timestamp    | YES  | `now()`                                                                                 |       |
| 47  | `created_by`                | uuid         | YES  | —                                                                                       |       |
| 48  | `submitted_by`              | uuid         | YES  | —                                                                                       |       |
| 49  | `submitted_at`              | timestamp    | YES  | —                                                                                       |       |
| 50  | `approved_by`               | uuid         | YES  | —                                                                                       |       |
| 51  | `approved_at`               | timestamp    | YES  | —                                                                                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References                 | ON UPDATE | ON DELETE | Notes |
| ---------------- | -------------------------- | --------- | --------- | ----- |
| `integration_id` | `payroll_integrations(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`      | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_export_jobs_integration` [INDEX] · (`integration_id`)
- `idx_payroll_export_jobs_number` [INDEX] · (`job_number`)
- `idx_payroll_export_jobs_period` [INDEX] · (`pay_period_year`, `pay_period_month`)
- `idx_payroll_export_jobs_status` [INDEX] · (`status`)
- `idx_payroll_export_jobs_tenant` [INDEX] · (`tenant_id`)
- `payroll_export_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_payroll_export_jobs** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `employee_overtime` via (`payroll_job_id`)
- `payroll_export_employees` via (`job_id`)
- `payroll_export_files` via (`job_id`)
- `payroll_transmission_log` via (`job_id`)

---

### `payroll_field_mappings`

- **Tenant scoped**: yes
- **Row estimate**: 46
- **Domains**: SMERTO
- **Prisma model**: `payroll_field_mappings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                       | Notes |
| --- | ------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                             |       |
| 3   | `integration_id`    | uuid         | YES  | —                             |       |
| 4   | `section`           | varchar(50)  | NO   | —                             |       |
| 5   | `source_table`      | varchar(100) | NO   | —                             |       |
| 6   | `source_field`      | varchar(100) | NO   | —                             |       |
| 7   | `target_field`      | varchar(100) | NO   | —                             |       |
| 8   | `target_field_name` | varchar(200) | YES  | —                             |       |
| 9   | `target_position`   | int4(32)     | YES  | —                             |       |
| 10  | `target_length`     | int4(32)     | YES  | —                             |       |
| 11  | `transform_type`    | varchar(30)  | YES  | `'direct'::character varying` |       |
| 12  | `transform_config`  | jsonb        | YES  | —                             |       |
| 13  | `format_pattern`    | varchar(100) | YES  | —                             |       |
| 14  | `pad_character`     | varchar(1)   | YES  | —                             |       |
| 15  | `pad_direction`     | varchar(5)   | YES  | —                             |       |
| 16  | `is_required`       | bool         | YES  | `false`                       |       |
| 17  | `default_value`     | text         | YES  | —                             |       |
| 18  | `priority`          | int4(32)     | YES  | `100`                         |       |
| 19  | `is_active`         | bool         | YES  | `true`                        |       |
| 20  | `created_at`        | timestamp    | YES  | `now()`                       |       |
| 21  | `updated_at`        | timestamp    | YES  | `now()`                       |       |
| 22  | `deleted_at`        | timestamptz  | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References                 | ON UPDATE | ON DELETE | Notes |
| ---------------- | -------------------------- | --------- | --------- | ----- |
| `integration_id` | `payroll_integrations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`      | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_field_mappings_active` [INDEX] · (`id`)
- `idx_payroll_field_mappings_integration` [INDEX] · (`integration_id`)
- `idx_payroll_field_mappings_section` [INDEX] · (`section`)
- `idx_payroll_field_mappings_tenant` [INDEX] · (`tenant_id`)
- `payroll_field_mappings_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_or_system_field_mappings** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `payroll_integrations`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: SMERTO
- **Prisma model**: `payroll_integrations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                           | Notes |
| --- | ------------------------- | ------------ | ---- | --------------------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`               | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                                 |       |
| 3   | `provider_name`           | varchar(100) | NO   | —                                 |       |
| 4   | `provider_code`           | varchar(50)  | NO   | —                                 |       |
| 5   | `display_name`            | varchar(200) | YES  | —                                 |       |
| 6   | `integration_type`        | varchar(30)  | NO   | `'file'::character varying`       |       |
| 7   | `api_endpoint`            | text         | YES  | —                                 |       |
| 8   | `api_key_encrypted`       | text         | YES  | —                                 |       |
| 9   | `api_secret_encrypted`    | text         | YES  | —                                 |       |
| 10  | `sftp_host`               | text         | YES  | —                                 |       |
| 11  | `sftp_port`               | int4(32)     | YES  | `22`                              |       |
| 12  | `sftp_username`           | text         | YES  | —                                 |       |
| 13  | `sftp_password_encrypted` | text         | YES  | —                                 |       |
| 14  | `sftp_path`               | text         | YES  | —                                 |       |
| 15  | `company_code`            | varchar(50)  | YES  | —                                 |       |
| 16  | `fiscal_code`             | varchar(20)  | YES  | —                                 |       |
| 17  | `vat_number`              | varchar(20)  | YES  | —                                 |       |
| 18  | `inps_code`               | varchar(20)  | YES  | —                                 |       |
| 19  | `inail_code`              | varchar(20)  | YES  | —                                 |       |
| 20  | `export_format`           | varchar(20)  | YES  | `'csv'::character varying`        |       |
| 21  | `file_encoding`           | varchar(20)  | YES  | `'UTF-8'::character varying`      |       |
| 22  | `date_format`             | varchar(20)  | YES  | `'DD/MM/YYYY'::character varying` |       |
| 23  | `decimal_separator`       | varchar(1)   | YES  | `','::character varying`          |       |
| 24  | `field_delimiter`         | varchar(5)   | YES  | `';'::character varying`          |       |
| 25  | `include_headers`         | bool         | YES  | `true`                            |       |
| 26  | `auto_export_enabled`     | bool         | YES  | `false`                           |       |
| 27  | `export_schedule`         | varchar(100) | YES  | —                                 |       |
| 28  | `export_day_of_month`     | int4(32)     | YES  | —                                 |       |
| 29  | `export_cutoff_day`       | int4(32)     | YES  | —                                 |       |
| 30  | `notification_recipients` | \_text       | YES  | —                                 |       |
| 31  | `last_connection_test`    | timestamp    | YES  | —                                 |       |
| 32  | `connection_status`       | varchar(20)  | YES  | `'unknown'::character varying`    |       |
| 33  | `connection_error`        | text         | YES  | —                                 |       |
| 34  | `is_active`               | bool         | YES  | `true`                            |       |
| 35  | `is_primary`              | bool         | YES  | `false`                           |       |
| 36  | `settings`                | jsonb        | YES  | `'{}'::jsonb`                     |       |
| 37  | `field_mappings`          | jsonb        | YES  | `'{}'::jsonb`                     |       |
| 38  | `created_at`              | timestamp    | YES  | `now()`                           |       |
| 39  | `updated_at`              | timestamp    | YES  | `now()`                           |       |
| 40  | `created_by`              | uuid         | YES  | —                                 |       |
| 41  | `updated_by`              | uuid         | YES  | —                                 |       |
| 42  | `deleted_at`              | timestamptz  | YES  | —                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_integrations_active` [INDEX] · (`is_active`)
- `idx_payroll_integrations_not_deleted` [INDEX] · (`id`)
- `idx_payroll_integrations_provider` [INDEX] · (`provider_code`)
- `idx_payroll_integrations_tenant` [INDEX] · (`tenant_id`)
- `payroll_integrations_pkey` [PRIMARY] · (`id`)
- `payroll_integrations_tenant_id_provider_code_key` [UNIQUE] · (`tenant_id`, `provider_code`)

#### RLS Policies

- **tenant_isolation_payroll_integrations** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `payroll_export_jobs` via (`integration_id`)
- `payroll_field_mappings` via (`integration_id`)

---

### `payroll_transmission_log`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SMERTO
- **Prisma model**: `payroll_transmission_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default             | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `job_id`               | uuid         | NO   | —                   |       |
| 3   | `tenant_id`            | uuid         | NO   | —                   |       |
| 4   | `transmission_type`    | varchar(30)  | NO   | —                   |       |
| 5   | `transmission_attempt` | int4(32)     | YES  | `1`                 |       |
| 6   | `request_timestamp`    | timestamp    | NO   | `now()`             |       |
| 7   | `request_method`       | varchar(20)  | YES  | —                   |       |
| 8   | `request_url`          | text         | YES  | —                   |       |
| 9   | `request_headers`      | jsonb        | YES  | —                   |       |
| 10  | `request_size`         | int8(64)     | YES  | —                   |       |
| 11  | `response_timestamp`   | timestamp    | YES  | —                   |       |
| 12  | `response_status`      | int4(32)     | YES  | —                   |       |
| 13  | `response_headers`     | jsonb        | YES  | —                   |       |
| 14  | `response_body`        | text         | YES  | —                   |       |
| 15  | `response_size`        | int8(64)     | YES  | —                   |       |
| 16  | `success`              | bool         | YES  | —                   |       |
| 17  | `error_code`           | varchar(50)  | YES  | —                   |       |
| 18  | `error_message`        | text         | YES  | —                   |       |
| 19  | `provider_reference`   | varchar(100) | YES  | —                   |       |
| 20  | `provider_message`     | text         | YES  | —                   |       |
| 21  | `created_at`           | timestamp    | YES  | `now()`             |       |
| 22  | `initiated_by`         | uuid         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References                | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------- | --------- | --------- | ----- |
| `job_id`    | `payroll_export_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_transmission_log_job` [INDEX] · (`job_id`)
- `idx_payroll_transmission_log_tenant` [INDEX] · (`tenant_id`)
- `idx_payroll_transmission_log_timestamp` [INDEX] · (`request_timestamp`)
- `payroll_transmission_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_payroll_transmission_log** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `payroll_validation_rules`

> This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.

- **Tenant scoped**: yes
- **Row estimate**: 11
- **Domains**: SMERTO
- **Prisma model**: `payroll_validation_rules`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                        | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                              |       |
| 3   | `rule_code`           | varchar(50)  | NO   | —                              |       |
| 4   | `rule_name`           | varchar(200) | NO   | —                              |       |
| 5   | `rule_description`    | text         | YES  | —                              |       |
| 6   | `category`            | varchar(50)  | NO   | —                              |       |
| 7   | `rule_type`           | varchar(30)  | NO   | —                              |       |
| 8   | `rule_config`         | jsonb        | NO   | —                              |       |
| 9   | `severity`            | varchar(20)  | YES  | `'warning'::character varying` |       |
| 10  | `is_blocking`         | bool         | YES  | `false`                        |       |
| 11  | `applies_to_sections` | \_text       | YES  | —                              |       |
| 12  | `ccnl_types`          | \_text       | YES  | —                              |       |
| 13  | `is_active`           | bool         | YES  | `true`                         |       |
| 14  | `created_at`          | timestamp    | YES  | `now()`                        |       |
| 15  | `updated_at`          | timestamp    | YES  | `now()`                        |       |
| 16  | `deleted_at`          | timestamptz  | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_payroll_validation_rules_active` [INDEX] · (`is_active`)
- `idx_payroll_validation_rules_category` [INDEX] · (`category`)
- `idx_payroll_validation_rules_not_deleted` [INDEX] · (`id`)
- `idx_payroll_validation_rules_tenant` [INDEX] · (`tenant_id`)
- `idx_payroll_validation_rules_unique` [UNIQUE] · (`rule_code`)
- `payroll_validation_rules_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_or_system_validation_rules** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `salary_band_assignments`

- **Tenant scoped**: yes
- **Row estimate**: 238
- **Domains**: SMERTO
- **Prisma model**: `salary_band_assignments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type          | Null | Default             | Notes |
| --- | ------------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `employee_id`             | uuid          | NO   | —                   |       |
| 3   | `band_id`                 | uuid          | NO   | —                   |       |
| 4   | `current_salary`          | numeric(12,2) | YES  | —                   |       |
| 5   | `compa_ratio`             | numeric(5,2)  | YES  | —                   |       |
| 6   | `range_penetration`       | numeric(5,2)  | YES  | —                   |       |
| 7   | `assigned_at`             | timestamp     | YES  | `now()`             |       |
| 8   | `assigned_by`             | uuid          | YES  | —                   |       |
| 9   | `assigned_by_employee_id` | uuid          | YES  | —                   |       |
| 10  | `created_at`              | timestamptz   | YES  | `now()`             |       |
| 11  | `updated_at`              | timestamptz   | YES  | `now()`             |       |
| 12  | `tenant_id`               | uuid          | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `assigned_by_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `band_id`                 | `salary_bands(id)`   | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_salary_band_assignments_assigned_by_employee_id` [INDEX] · (`assigned_by_employee_id`)
- `idx_salary_band_assignments_employee` [INDEX] · (`employee_id`)
- `idx_salary_band_assignments_tenant` [INDEX] · (`tenant_id`)
- `salary_band_assignments_employee_id_band_id_key` [UNIQUE] · (`employee_id`, `band_id`)
- `salary_band_assignments_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_salary_band_assignments** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `salary_bands`

- **Tenant scoped**: yes
- **Row estimate**: 23
- **Domains**: SMERTO
- **Prisma model**: `salary_bands`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type          | Null | Default                    | Notes |
| --- | ------------------------ | ------------- | ---- | -------------------------- | ----- |
| 1   | `id`                     | uuid          | NO   | `gen_random_uuid()`        | PK    |
| 2   | `tenant_id`              | uuid          | NO   | —                          |       |
| 3   | `band_code`              | varchar(20)   | NO   | —                          |       |
| 4   | `band_name`              | varchar(100)  | NO   | —                          |       |
| 5   | `description`            | text          | YES  | —                          |       |
| 6   | `job_level`              | varchar(50)   | YES  | —                          |       |
| 7   | `job_family`             | varchar(100)  | YES  | —                          |       |
| 8   | `currency`               | varchar(3)    | YES  | `'EUR'::character varying` |       |
| 9   | `min_salary`             | numeric(12,2) | NO   | —                          |       |
| 10  | `mid_salary`             | numeric(12,2) | YES  | —                          |       |
| 11  | `max_salary`             | numeric(12,2) | NO   | —                          |       |
| 12  | `range_spread_percent`   | numeric(5,2)  | YES  | —                          |       |
| 13  | `geo_region`             | varchar(100)  | YES  | —                          |       |
| 14  | `geo_adjustment_percent` | numeric(5,2)  | YES  | `0`                        |       |
| 15  | `effective_from`         | date          | NO   | `CURRENT_DATE`             |       |
| 16  | `effective_to`           | date          | YES  | —                          |       |
| 17  | `is_active`              | bool          | YES  | `true`                     |       |
| 18  | `created_at`             | timestamp     | YES  | `now()`                    |       |
| 19  | `updated_at`             | timestamp     | YES  | `now()`                    |       |
| 20  | `created_by`             | uuid          | YES  | —                          |       |
| 21  | `created_by_employee_id` | uuid          | YES  | —                          |       |
| 22  | `deleted_at`             | timestamptz   | YES  | —                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_salary_bands_active` [INDEX] · (`id`)
- `idx_salary_bands_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_salary_bands_job_level` [INDEX] · (`job_level`, `job_family`)
- `idx_salary_bands_tenant` [INDEX] · (`tenant_id`)
- `salary_bands_pkey` [PRIMARY] · (`id`)
- `salary_bands_tenant_id_band_code_effective_from_geo_region_key` [UNIQUE] · (`tenant_id`, `band_code`, `effective_from`, `geo_region`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `salary_band_assignments` via (`band_id`)

---

### `salary_history`

- **Tenant scoped**: yes
- **Row estimate**: 317
- **Domains**: SMERTO
- **Prisma model**: `salary_history`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type          | Null | Default                       | Notes |
| --- | ------------------- | ------------- | ---- | ----------------------------- | ----- |
| 1   | `id`                | uuid          | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`         | uuid          | NO   | —                             |       |
| 3   | `employee_id`       | uuid          | NO   | —                             |       |
| 4   | `effective_date`    | date          | NO   | —                             |       |
| 5   | `salary`            | numeric(12,2) | NO   | —                             |       |
| 6   | `currency`          | varchar(3)    | YES  | `'EUR'::character varying`    |       |
| 7   | `salary_type`       | varchar(20)   | YES  | `'annual'::character varying` |       |
| 8   | `change_reason`     | varchar(100)  | YES  | —                             |       |
| 9   | `previous_salary`   | numeric(12,2) | YES  | —                             |       |
| 10  | `change_percentage` | numeric(5,2)  | YES  | —                             |       |
| 11  | `contract_id`       | uuid          | YES  | —                             |       |
| 12  | `approved_by`       | uuid          | YES  | —                             |       |
| 13  | `notes`             | text          | YES  | —                             |       |
| 14  | `created_at`        | timestamptz   | YES  | `now()`                       |       |
| 15  | `updated_at`        | timestamptz   | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `approved_by` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `contract_id` | `contracts(id)`      | NO ACTION | RESTRICT  |       |
| `employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_salary_history_approved_by` [INDEX] · (`approved_by`)
- `idx_salary_history_contract_id` [INDEX] · (`contract_id`)
- `idx_salary_history_date` [INDEX] · (`effective_date`)
- `idx_salary_history_employee` [INDEX] · (`employee_id`)
- `idx_salary_history_tenant` [INDEX] · (`tenant_id`)
- `salary_history_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_salary_history_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---
