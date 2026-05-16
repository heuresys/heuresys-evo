# Dominio INDOOR — Industry-NACE-Domain-Org-OrgUnit-Roles

> Industry-driven cascade (industry → workforce baseline → org → roles)

**Tabelle in questo dominio**: 13

## Tabelle

| Tabella                                                                     | Rows | Tenant | RLS | FK out | Cols |
| --------------------------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`benchmark_configs`](#benchmarkconfigs)                                    | 8    | ✓      | ✓   | 1      | 13   |
| [`benchmark_reports`](#benchmarkreports)                                    | 4    | ✓      | ✓   | 3      | 21   |
| [`blueprint_results`](#blueprintresults)                                    | 484  | —      | ✓   | 2      | 13   |
| [`blueprint_runs`](#blueprintruns)                                          | 7    | ✓      | ✓   | 3      | 12   |
| [`blueprint_templates`](#blueprinttemplates)                                | 3    | —      | ✓   | 2      | 10   |
| [`industry_ccnl_mapping`](#industryccnlmapping)                             | 14   | —      | —   | 1      | 7    |
| [`industry_classifications`](#industryclassifications)                      | 3276 | —      | —   | 1      | 18   |
| [`industry_occupation_mapping`](#industryoccupationmapping)                 | 15   | —      | —   | 0      | 10   |
| [`industry_profiles`](#industryprofiles)                                    | 8    | —      | —   | 2      | 18   |
| [`market_benchmarks`](#marketbenchmarks)                                    | 32   | ✓      | ✓   | 1      | 10   |
| [`market_salary_data`](#marketsalarydata)                                   | 84   | ✓      | ✓   | 1      | 15   |
| [`occupation_industry_classifications`](#occupationindustryclassifications) | 4565 | —      | —   | 2      | 6    |
| [`tenant_industry_classifications`](#tenantindustryclassifications)         | 4    | ✓      | ✓   | 2      | 6    |

---

### `benchmark_configs`

- **Tenant scoped**: yes
- **Row estimate**: 8
- **Domains**: INDOOR
- **Prisma model**: `benchmark_configs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default             | Notes |
| --- | ------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                   |       |
| 3   | `config_name`       | varchar(255) | NO   | —                   |       |
| 4   | `benchmark_type`    | varchar(50)  | NO   | —                   |       |
| 5   | `industries`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 6   | `countries`         | jsonb        | YES  | `'[]'::jsonb`       |       |
| 7   | `regions`           | jsonb        | YES  | `'[]'::jsonb`       |       |
| 8   | `company_sizes`     | jsonb        | YES  | `'[]'::jsonb`       |       |
| 9   | `experience_levels` | jsonb        | YES  | `'[]'::jsonb`       |       |
| 10  | `isco_codes`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 11  | `is_default`        | bool         | YES  | `false`             |       |
| 12  | `created_at`        | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`        | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `benchmark_configs_pkey` [PRIMARY] · (`id`)
- `idx_benchmark_config_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **benchmark_config_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

#### Inverse relations (referenced by)

- `benchmark_reports` via (`config_id`)

---

### `benchmark_reports`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: INDOOR
- **Prisma model**: `benchmark_reports`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `config_id`              | uuid         | YES  | —                   |       |
| 4   | `report_name`            | varchar(255) | NO   | —                   |       |
| 5   | `report_type`            | varchar(50)  | NO   | —                   |       |
| 6   | `report_date`            | date         | YES  | `CURRENT_DATE`      |       |
| 7   | `salary_benchmarks`      | jsonb        | YES  | `'{}'::jsonb`       |       |
| 8   | `salary_percentiles`     | jsonb        | YES  | `'{}'::jsonb`       |       |
| 9   | `salary_trends`          | jsonb        | YES  | `'[]'::jsonb`       |       |
| 10  | `trending_skills`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 11  | `declining_skills`       | jsonb        | YES  | `'[]'::jsonb`       |       |
| 12  | `emerging_skills`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 13  | `skill_demand_scores`    | jsonb        | YES  | `'{}'::jsonb`       |       |
| 14  | `talent_supply`          | jsonb        | YES  | `'{}'::jsonb`       |       |
| 15  | `competition_index`      | jsonb        | YES  | `'{}'::jsonb`       |       |
| 16  | `time_to_hire_estimates` | jsonb        | YES  | `'{}'::jsonb`       |       |
| 17  | `internal_vs_market`     | jsonb        | YES  | `'{}'::jsonb`       |       |
| 18  | `recommendations`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 19  | `created_by`             | uuid         | YES  | —                   |       |
| 20  | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 21  | `created_by_employee_id` | uuid         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References              | ON UPDATE | ON DELETE | Notes |
| ------------------------ | ----------------------- | --------- | --------- | ----- |
| `config_id`              | `benchmark_configs(id)` | NO ACTION | CASCADE   |       |
| `created_by_employee_id` | `employees_core(id)`    | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`           | NO ACTION | CASCADE   |       |

#### Indexes

- `benchmark_reports_pkey` [PRIMARY] · (`id`)
- `idx_benchmark_report_date` [INDEX] · (`report_date`)
- `idx_benchmark_report_tenant` [INDEX] · (`tenant_id`)
- `idx_benchmark_report_type` [INDEX] · (`report_type`)
- `idx_benchmark_reports_config_id` [INDEX] · (`config_id`)
- `idx_benchmark_reports_created_by_employee_id` [INDEX] · (`created_by_employee_id`)

#### RLS Policies

- **benchmark_report_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `blueprint_results`

- **Tenant scoped**: no
- **Row estimate**: 484
- **Domains**: INDOOR
- **Prisma model**: `blueprint_results`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `run_id`           | uuid         | NO   | —                   |       |
| 3   | `result_type`      | varchar(50)  | NO   | —                   |       |
| 4   | `entity_type`      | varchar(100) | YES  | —                   |       |
| 5   | `entity_id`        | uuid         | YES  | —                   |       |
| 6   | `severity`         | varchar(20)  | YES  | —                   |       |
| 7   | `title`            | varchar(500) | NO   | —                   |       |
| 8   | `description`      | text         | YES  | —                   |       |
| 9   | `suggested_action` | jsonb        | YES  | —                   |       |
| 10  | `is_applied`       | bool         | YES  | `false`             |       |
| 11  | `applied_at`       | timestamptz  | YES  | —                   |       |
| 12  | `applied_by`       | uuid         | YES  | —                   |       |
| 13  | `created_at`       | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References           | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------------- | --------- | --------- | ----- |
| `applied_by` | `users(id)`          | NO ACTION | SET NULL  |       |
| `run_id`     | `blueprint_runs(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `blueprint_results_pkey` [PRIMARY] · (`id`)
- `idx_blueprint_results_applied_by` [INDEX] · (`applied_by`)
- `idx_blueprint_results_run_id` [INDEX] · (`run_id`)

#### RLS Policies

- **blueprint_results_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM blueprint_runs br
WHERE ((br.id = blueprint_results.run_id) AND (br.tenant_id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM blueprint_runs br
WHERE ((br.id = blueprint_results.run_id) AND (br.tenant_id = current_tenant_id()))))`

---

### `blueprint_runs`

- **Tenant scoped**: yes
- **Row estimate**: 7
- **Domains**: INDOOR
- **Prisma model**: `blueprint_runs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default                        | Notes |
| --- | --------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`     | uuid        | NO   | —                              |       |
| 3   | `template_id`   | uuid        | NO   | —                              |       |
| 4   | `run_mode`      | varchar(20) | NO   | —                              |       |
| 5   | `status`        | varchar(30) | NO   | `'pending'::character varying` |       |
| 6   | `input_config`  | jsonb       | YES  | `'{}'::jsonb`                  |       |
| 7   | `started_at`    | timestamptz | YES  | —                              |       |
| 8   | `completed_at`  | timestamptz | YES  | —                              |       |
| 9   | `created_by`    | uuid        | YES  | —                              |       |
| 10  | `error_message` | text        | YES  | —                              |       |
| 11  | `created_at`    | timestamptz | YES  | `now()`                        |       |
| 12  | `updated_at`    | timestamptz | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References                | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------- | --------- | --------- | ----- |
| `created_by`  | `users(id)`               | NO ACTION | SET NULL  |       |
| `template_id` | `blueprint_templates(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `blueprint_runs_pkey` [PRIMARY] · (`id`)
- `idx_blueprint_runs_created_by` [INDEX] · (`created_by`)
- `idx_blueprint_runs_template_id` [INDEX] · (`template_id`)
- `idx_blueprint_runs_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **blueprint_runs_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `blueprint_results` via (`run_id`)

---

### `blueprint_templates`

- **Tenant scoped**: no
- **Row estimate**: 3
- **Domains**: INDOOR
- **Prisma model**: `blueprint_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                    | Notes |
| --- | ------------------ | ------------ | ---- | -------------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`        | PK    |
| 2   | `profile_id`       | uuid         | NO   | —                          |       |
| 3   | `template_name`    | varchar(255) | NO   | —                          |       |
| 4   | `template_version` | varchar(20)  | NO   | `'1.0'::character varying` |       |
| 5   | `description`      | text         | YES  | —                          |       |
| 6   | `template_config`  | jsonb        | NO   | `'{}'::jsonb`              |       |
| 7   | `is_active`        | bool         | YES  | `true`                     |       |
| 8   | `created_by`       | uuid         | YES  | —                          |       |
| 9   | `created_at`       | timestamptz  | YES  | `now()`                    |       |
| 10  | `updated_at`       | timestamptz  | YES  | `now()`                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References              | ON UPDATE | ON DELETE | Notes |
| ------------ | ----------------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`             | NO ACTION | SET NULL  |       |
| `profile_id` | `industry_profiles(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `blueprint_templates_pkey` [PRIMARY] · (`id`)
- `blueprint_templates_profile_id_template_name_template_versi_key` [UNIQUE] · (`profile_id`, `template_name`, `template_version`)
- `idx_blueprint_templates_created_by` [INDEX] · (`created_by`)

#### RLS Policies

- **blueprint_templates_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM tenants
WHERE ((tenants.id = current_tenant_id()) AND (tenants.industry_profile_id = blueprint_templates.profile_id))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM tenants
WHERE ((tenants.id = current_tenant_id()) AND (tenants.industry_profile_id = blueprint_templates.profile_id))))`

#### Inverse relations (referenced by)

- `blueprint_runs` via (`template_id`)

---

### `industry_ccnl_mapping`

- **Tenant scoped**: no
- **Row estimate**: 14
- **Domains**: INDOOR · ITLAB
- **Prisma model**: `industry_ccnl_mapping`

#### Columns

| #   | Column          | Type        | Null | Default             | Notes |
| --- | --------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `industry_code` | varchar(10) | NO   | —                   |       |
| 3   | `ccnl_code`     | varchar(50) | NO   | —                   |       |
| 4   | `is_primary`    | bool        | NO   | `true`              |       |
| 5   | `notes`         | text        | YES  | —                   |       |
| 6   | `created_at`    | timestamptz | NO   | `now()`             |       |
| 7   | `updated_at`    | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References             | ON UPDATE | ON DELETE | Notes |
| ----------- | ---------------------- | --------- | --------- | ----- |
| `ccnl_code` | `ccnl_contracts(code)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_industry_ccnl_code` [INDEX] · (`ccnl_code`)
- `industry_ccnl_mapping_pkey` [PRIMARY] · (`id`)
- `uq_industry_ccnl_primary` [UNIQUE] · (`industry_code`)

---

### `industry_classifications`

- **Tenant scoped**: no
- **Row estimate**: 3276
- **Domains**: INDOOR
- **Prisma model**: `industry_classifications`

#### Columns

| #   | Column                   | Type         | Null | Default                     | Notes |
| --- | ------------------------ | ------------ | ---- | --------------------------- | ----- |
| 1   | `code`                   | varchar(10)  | NO   | —                           | PK    |
| 2   | `parent_code`            | varchar(10)  | YES  | —                           |       |
| 3   | `level`                  | int2(16)     | NO   | —                           |       |
| 4   | `classification_system`  | varchar(10)  | NO   | `'NACE'::character varying` |       |
| 5   | `name_it`                | varchar(500) | NO   | —                           |       |
| 6   | `name_en`                | varchar(500) | YES  | —                           |       |
| 7   | `description_it`         | text         | YES  | —                           |       |
| 8   | `description_en`         | text         | YES  | —                           |       |
| 9   | `icon`                   | varchar(50)  | YES  | —                           |       |
| 10  | `color`                  | varchar(7)   | YES  | —                           |       |
| 11  | `is_active`              | bool         | NO   | `true`                      |       |
| 12  | `embedding_it`           | vector       | YES  | —                           |       |
| 13  | `embedding_en`           | vector       | YES  | —                           |       |
| 14  | `embedding_model`        | varchar(50)  | YES  | —                           |       |
| 15  | `embedding_generated_at` | timestamptz  | YES  | —                           |       |
| 16  | `created_at`             | timestamptz  | NO   | `now()`                     |       |
| 17  | `updated_at`             | timestamptz  | NO   | `now()`                     |       |
| 18  | `deleted_at`             | timestamptz  | YES  | —                           |       |

#### Primary Key

`(`code`)`

#### Foreign Keys

| Columns       | References                       | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------------------- | --------- | --------- | ----- |
| `parent_code` | `industry_classifications(code)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_ic_active` [INDEX] · (`is_active`)
- `idx_ic_level` [INDEX] · (`level`)
- `idx_ic_name_en_trgm` [INDEX] · (`name_en`)
- `idx_ic_name_it_trgm` [INDEX] · (`name_it`)
- `idx_ic_parent` [INDEX] · (`parent_code`)
- `idx_ic_system` [INDEX] · (`classification_system`)
- `industry_classifications_pkey` [PRIMARY] · (`code`)

#### Inverse relations (referenced by)

- `industry_classifications` via (`parent_code`)
- `industry_profiles` via (`nace_class_code`)
- `occupation_industry_classifications` via (`classification_code`)
- `tenant_industry_classifications` via (`classification_code`)

---

### `industry_occupation_mapping`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: INDOOR
- **Prisma model**: `industry_occupation_mapping`

#### Columns

| #   | Column                  | Type         | Null | Default                         | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `nace_division_code`    | varchar(10)  | NO   | —                               |       |
| 3   | `esco_occupation_uri`   | varchar(255) | NO   | —                               |       |
| 4   | `relevance_score`       | numeric(3,2) | YES  | `1.0`                           |       |
| 5   | `is_core_occupation`    | bool         | YES  | `false`                         |       |
| 6   | `typical_headcount_pct` | numeric(5,2) | YES  | —                               |       |
| 7   | `min_company_size`      | int4(32)     | YES  | —                               |       |
| 8   | `source`                | varchar(50)  | YES  | `'inferred'::character varying` |       |
| 9   | `created_at`            | timestamptz  | YES  | `now()`                         |       |
| 10  | `updated_at`            | timestamptz  | YES  | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_iom_core` [INDEX] · (`is_core_occupation`)
- `idx_iom_nace` [INDEX] · (`nace_division_code`)
- `idx_iom_occupation` [INDEX] · (`esco_occupation_uri`)
- `industry_occupation_mapping_pkey` [PRIMARY] · (`id`)
- `uk_industry_occupation` [UNIQUE] · (`nace_division_code`, `esco_occupation_uri`)

---

### `industry_profiles`

- **Tenant scoped**: no
- **Row estimate**: 8
- **Domains**: INDOOR
- **Prisma model**: `industry_profiles`

#### Columns

| #   | Column                    | Type         | Null | Default             | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `code`                    | varchar(50)  | NO   | —                   |       |
| 3   | `name`                    | varchar(200) | NO   | —                   |       |
| 4   | `description`             | text         | YES  | —                   |       |
| 5   | `nace_class_code`         | varchar(10)  | NO   | —                   |       |
| 6   | `company_size_code`       | varchar(20)  | NO   | —                   |       |
| 7   | `typical_hierarchy`       | jsonb        | YES  | —                   |       |
| 8   | `typical_roles`           | \_text       | YES  | —                   |       |
| 9   | `typical_departments`     | \_text       | YES  | —                   |       |
| 10  | `typical_span_of_control` | jsonb        | YES  | —                   |       |
| 11  | `department_templates`    | jsonb        | YES  | —                   |       |
| 12  | `esco_occupation_codes`   | \_text       | YES  | —                   |       |
| 13  | `esco_skill_uris`         | \_text       | YES  | —                   |       |
| 14  | `min_employees`           | int4(32)     | YES  | —                   |       |
| 15  | `max_employees`           | int4(32)     | YES  | —                   |       |
| 16  | `is_active`               | bool         | NO   | `true`              |       |
| 17  | `created_at`              | timestamptz  | NO   | `now()`             |       |
| 18  | `updated_at`              | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References                       | ON UPDATE | ON DELETE | Notes |
| ------------------- | -------------------------------- | --------- | --------- | ----- |
| `company_size_code` | `company_sizes(code)`            | NO ACTION | RESTRICT  |       |
| `nace_class_code`   | `industry_classifications(code)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `industry_profiles_code_key` [UNIQUE] · (`code`)
- `industry_profiles_pkey` [PRIMARY] · (`id`)
- `uq_profile_nace_size` [UNIQUE] · (`nace_class_code`, `company_size_code`)

#### Inverse relations (referenced by)

- `blueprint_templates` via (`profile_id`)
- `business_processes` via (`profile_id`)
- `tenants` via (`industry_profile_id`)

---

### `market_benchmarks`

- **Tenant scoped**: yes
- **Row estimate**: 32
- **Domains**: INDOOR
- **Prisma model**: `market_benchmarks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                   |       |
| 3   | `benchmark_type`   | varchar(50)  | NO   | —                   |       |
| 4   | `segment`          | jsonb        | NO   | `'{}'::jsonb`       |       |
| 5   | `period_start`     | date         | NO   | —                   |       |
| 6   | `period_end`       | date         | NO   | —                   |       |
| 7   | `metrics`          | jsonb        | NO   | `'{}'::jsonb`       |       |
| 8   | `sample_size`      | int4(32)     | YES  | `0`                 |       |
| 9   | `confidence_level` | numeric(3,2) | YES  | —                   |       |
| 10  | `created_at`       | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_market_benchmarks_period` [INDEX] · (`period_start`, `period_end`)
- `idx_market_benchmarks_tenant` [INDEX] · (`tenant_id`)
- `idx_market_benchmarks_type` [INDEX] · (`benchmark_type`)
- `market_benchmarks_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `market_salary_data`

- **Tenant scoped**: yes
- **Row estimate**: 84
- **Domains**: INDOOR
- **Prisma model**: `market_salary_data`
- **RLS**: enabled (forced)

#### Columns

| #   | Column        | Type          | Null | Default                    | Notes |
| --- | ------------- | ------------- | ---- | -------------------------- | ----- |
| 1   | `id`          | uuid          | NO   | `gen_random_uuid()`        | PK    |
| 2   | `tenant_id`   | uuid          | NO   | —                          |       |
| 3   | `job_title`   | varchar(200)  | NO   | —                          |       |
| 4   | `job_family`  | varchar(100)  | YES  | —                          |       |
| 5   | `job_level`   | varchar(50)   | YES  | —                          |       |
| 6   | `geo_region`  | varchar(100)  | YES  | —                          |       |
| 7   | `source`      | varchar(100)  | YES  | —                          |       |
| 8   | `survey_year` | int4(32)      | YES  | —                          |       |
| 9   | `p25_salary`  | numeric(12,2) | YES  | —                          |       |
| 10  | `p50_salary`  | numeric(12,2) | YES  | —                          |       |
| 11  | `p75_salary`  | numeric(12,2) | YES  | —                          |       |
| 12  | `p90_salary`  | numeric(12,2) | YES  | —                          |       |
| 13  | `currency`    | varchar(3)    | YES  | `'EUR'::character varying` |       |
| 14  | `created_at`  | timestamp     | YES  | `now()`                    |       |
| 15  | `updated_at`  | timestamp     | YES  | `now()`                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_market_salary_data_job` [INDEX] · (`job_title`, `geo_region`)
- `idx_market_salary_data_tenant_id` [INDEX] · (`tenant_id`)
- `market_salary_data_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `occupation_industry_classifications`

- **Tenant scoped**: no
- **Row estimate**: 4565
- **Domains**: INDOOR
- **Prisma model**: `occupation_industry_classifications`

#### Columns

| #   | Column                | Type         | Null | Default                     | Notes |
| --- | --------------------- | ------------ | ---- | --------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`         | PK    |
| 2   | `occupation_id`       | uuid         | NO   | —                           |       |
| 3   | `classification_code` | varchar(10)  | NO   | —                           |       |
| 4   | `source`              | varchar(20)  | NO   | `'ESCO'::character varying` |       |
| 5   | `relevance_score`     | numeric(3,2) | YES  | `1.00`                      |       |
| 6   | `created_at`          | timestamptz  | YES  | `now()`                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References                       | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------------------- | --------- | --------- | ----- |
| `classification_code` | `industry_classifications(code)` | NO ACTION | CASCADE   |       |
| `occupation_id`       | `esco_occupations(id)`           | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_oic_classification` [INDEX] · (`classification_code`)
- `idx_oic_occupation` [INDEX] · (`occupation_id`)
- `idx_oic_source` [INDEX] · (`source`)
- `occupation_industry_classific_occupation_id_classification__key` [UNIQUE] · (`occupation_id`, `classification_code`)
- `occupation_industry_classifications_pkey` [PRIMARY] · (`id`)

---

### `tenant_industry_classifications`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: INDOOR
- **Prisma model**: `tenant_industry_classifications`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type        | Null | Default                        | Notes |
| --- | --------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                  | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`           | uuid        | NO   | —                              |       |
| 3   | `classification_code` | varchar(10) | NO   | —                              |       |
| 4   | `classification_role` | varchar(20) | NO   | `'PRIMARY'::character varying` |       |
| 5   | `is_active`           | bool        | NO   | `true`                         |       |
| 6   | `created_at`          | timestamptz | NO   | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References                       | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------------------- | --------- | --------- | ----- |
| `classification_code` | `industry_classifications(code)` | NO ACTION | RESTRICT  |       |
| `tenant_id`           | `tenants(id)`                    | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tic_classification` [INDEX] · (`classification_code`)
- `idx_tic_tenant` [INDEX] · (`tenant_id`)
- `tenant_industry_classifications_pkey` [PRIMARY] · (`id`)
- `uq_tenant_primary` [UNIQUE] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---
