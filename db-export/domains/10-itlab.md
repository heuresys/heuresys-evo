# Dominio ITLAB — Italian Labor (CCNL-INPS-Sindacati-Holidays IT)

> Italian labor context governance

**Tabelle in questo dominio**: 10

## Tabelle

| Tabella                                           | Rows | Tenant | RLS | FK out | Cols |
| ------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`ccnl_contracts`](#ccnlcontracts)                | 7    | —      | —   | 0      | 19   |
| [`ccnl_executive_bands`](#ccnlexecutivebands)     | 10   | —      | —   | 0      | 10   |
| [`ccnl_job_title_mapping`](#ccnljobtitlemapping)  | 91   | —      | —   | 1      | 9    |
| [`ccnl_levels`](#ccnllevels)                      | 27   | —      | —   | 1      | 14   |
| [`ccnl_seniority_rules`](#ccnlseniorityrules)     | 0    | —      | —   | 1      | 11   |
| [`holidays`](#holidays)                           | 144  | ✓      | ✓   | 1      | 13   |
| [`industry_ccnl_mapping`](#industryccnlmapping)   | 14   | —      | —   | 1      | 7    |
| [`sindacati`](#sindacati)                         | -1   | —      | —   | 1      | 13   |
| [`sindacato_tenant_links`](#sindacatotenantlinks) | -1   | ✓      | ✓   | 2      | 9    |
| [`tenant_ccnl_links`](#tenantccnllinks)           | -1   | ✓      | ✓   | 2      | 9    |

---

### `ccnl_contracts`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: ITLAB
- **Prisma model**: `ccnl_contracts`

#### Columns

| #   | Column                  | Type         | Null | Default             | Notes                                                    |
| --- | ----------------------- | ------------ | ---- | ------------------- | -------------------------------------------------------- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()` | PK                                                       |
| 2   | `code`                  | varchar(50)  | NO   | —                   |                                                          |
| 3   | `name`                  | varchar(200) | NO   | —                   |                                                          |
| 4   | `name_en`               | varchar(200) | YES  | —                   |                                                          |
| 5   | `sector`                | varchar(100) | YES  | —                   |                                                          |
| 6   | `effective_date`        | date         | YES  | —                   |                                                          |
| 7   | `expiry_date`           | date         | YES  | —                   |                                                          |
| 8   | `min_notice_days`       | jsonb        | YES  | —                   |                                                          |
| 9   | `probation_period_days` | jsonb        | YES  | —                   |                                                          |
| 10  | `annual_leave_days`     | int4(32)     | YES  | `26`                |                                                          |
| 11  | `sick_leave_rules`      | jsonb        | YES  | —                   |                                                          |
| 12  | `overtime_rates`        | jsonb        | YES  | —                   |                                                          |
| 13  | `full_text`             | text         | YES  | —                   |                                                          |
| 14  | `full_text_version`     | varchar(50)  | YES  | —                   |                                                          |
| 15  | `is_active`             | bool         | YES  | `true`              |                                                          |
| 16  | `created_at`            | timestamp    | YES  | `now()`             |                                                          |
| 17  | `updated_at`            | timestamp    | YES  | `now()`             |                                                          |
| 18  | `deleted_at`            | timestamptz  | YES  | —                   |                                                          |
| 19  | `name_it`               | varchar(255) | YES  | —                   | Italian contract name (Slice 2 i18n — see migration 206) |

#### Primary Key

`(`id`)`

#### Indexes

- `ccnl_contracts_code_key` [UNIQUE] · (`code`)
- `ccnl_contracts_pkey` [PRIMARY] · (`id`)
- `idx_ccnl_active` [INDEX] · (`is_active`)
- `idx_ccnl_contracts_active` [INDEX] · (`id`)
- `idx_ccnl_sector` [INDEX] · (`sector`)

#### Inverse relations (referenced by)

- `ccnl_job_title_mapping` via (`ccnl_code`)
- `ccnl_levels` via (`ccnl_code`)
- `ccnl_seniority_rules` via (`ccnl_code`)
- `industry_ccnl_mapping` via (`ccnl_code`)
- `tenant_ccnl_links` via (`ccnl_code`)

---

### `ccnl_executive_bands`

- **Tenant scoped**: no
- **Row estimate**: 10
- **Domains**: ITLAB
- **Prisma model**: `ccnl_executive_bands`

#### Columns

| #   | Column              | Type          | Null | Default                      | Notes |
| --- | ------------------- | ------------- | ---- | ---------------------------- | ----- |
| 1   | `id`                | uuid          | NO   | `gen_random_uuid()`          | PK    |
| 2   | `ccnl_code`         | varchar(50)   | NO   | —                            |       |
| 3   | `job_title_pattern` | text          | NO   | —                            |       |
| 4   | `match_type`        | varchar(10)   | NO   | `'ilike'::character varying` |       |
| 5   | `min_annual`        | numeric(12,2) | NO   | —                            |       |
| 6   | `max_annual`        | numeric(12,2) | NO   | —                            |       |
| 7   | `priority`          | int2(16)      | NO   | `100`                        |       |
| 8   | `notes`             | text          | YES  | —                            |       |
| 9   | `source_url`        | text          | YES  | —                            |       |
| 10  | `created_at`        | timestamptz   | NO   | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Indexes

- `ccnl_executive_bands_pkey` [PRIMARY] · (`id`)
- `idx_ccnl_exec_bands_lookup` [INDEX] · (`ccnl_code`, `priority`)
- `uq_ccnl_exec_bands` [UNIQUE] · (`ccnl_code`, `job_title_pattern`)

---

### `ccnl_job_title_mapping`

- **Tenant scoped**: no
- **Row estimate**: 91
- **Domains**: ITLAB
- **Prisma model**: `ccnl_job_title_mapping`

#### Columns

| #   | Column              | Type        | Null | Default                      | Notes |
| --- | ------------------- | ----------- | ---- | ---------------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`          | PK    |
| 2   | `ccnl_code`         | varchar(50) | NO   | —                            |       |
| 3   | `job_title_pattern` | text        | NO   | —                            |       |
| 4   | `match_type`        | varchar(10) | NO   | `'ilike'::character varying` |       |
| 5   | `base_level_code`   | varchar(20) | NO   | —                            |       |
| 6   | `is_management`     | bool        | NO   | `false`                      |       |
| 7   | `priority`          | int2(16)    | NO   | `100`                        |       |
| 8   | `notes`             | text        | YES  | —                            |       |
| 9   | `created_at`        | timestamptz | NO   | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References             | ON UPDATE | ON DELETE | Notes |
| ----------- | ---------------------- | --------- | --------- | ----- |
| `ccnl_code` | `ccnl_contracts(code)` | NO ACTION | CASCADE   |       |

#### Indexes

- `ccnl_job_title_mapping_pkey` [PRIMARY] · (`id`)
- `idx_ccnl_jtm_lookup` [INDEX] · (`ccnl_code`, `priority`)
- `uq_ccnl_jtm` [UNIQUE] · (`ccnl_code`, `job_title_pattern`)

---

### `ccnl_levels`

- **Tenant scoped**: no
- **Row estimate**: 27
- **Domains**: ITLAB
- **Prisma model**: `ccnl_levels`

#### Columns

| #   | Column                 | Type          | Null | Default             | Notes |
| --- | ---------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `ccnl_code`            | varchar(50)   | NO   | —                   |       |
| 3   | `level_code`           | varchar(20)   | NO   | —                   |       |
| 4   | `level_name`           | varchar(200)  | NO   | —                   |       |
| 5   | `level_order`          | int2(16)      | NO   | —                   |       |
| 6   | `category`             | varchar(30)   | NO   | —                   |       |
| 7   | `monthly_salary`       | numeric(10,2) | NO   | —                   |       |
| 8   | `num_monthly_payments` | int2(16)      | NO   | `13`                |       |
| 9   | `effective_date`       | date          | NO   | —                   |       |
| 10  | `expiry_date`          | date          | YES  | —                   |       |
| 11  | `is_current`           | bool          | NO   | `true`              |       |
| 12  | `source_url`           | text          | YES  | —                   |       |
| 13  | `created_at`           | timestamptz   | NO   | `now()`             |       |
| 14  | `updated_at`           | timestamptz   | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References             | ON UPDATE | ON DELETE | Notes |
| ----------- | ---------------------- | --------- | --------- | ----- |
| `ccnl_code` | `ccnl_contracts(code)` | CASCADE   | CASCADE   |       |

#### Indexes

- `ccnl_levels_pkey` [PRIMARY] · (`id`)
- `idx_ccnl_levels_current` [INDEX] · (`ccnl_code`, `is_current`)
- `idx_ccnl_levels_lookup` [INDEX] · (`ccnl_code`, `level_code`)
- `uq_ccnl_levels_code_effdate` [UNIQUE] · (`ccnl_code`, `level_code`, `effective_date`)

---

### `ccnl_seniority_rules`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: ITLAB
- **Prisma model**: `ccnl_seniority_rules`

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `ccnl_code`           | varchar(50)  | NO   | —                   |       |
| 3   | `from_level_code`     | varchar(20)  | NO   | —                   |       |
| 4   | `min_years_service`   | numeric(4,1) | NO   | —                   |       |
| 5   | `max_years_service`   | numeric(4,1) | YES  | —                   |       |
| 6   | `requires_reports`    | bool         | NO   | `false`             |       |
| 7   | `requires_management` | bool         | NO   | `false`             |       |
| 8   | `target_level_code`   | varchar(20)  | NO   | —                   |       |
| 9   | `priority`            | int2(16)     | NO   | `100`               |       |
| 10  | `notes`               | text         | YES  | —                   |       |
| 11  | `created_at`          | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References             | ON UPDATE | ON DELETE | Notes |
| ----------- | ---------------------- | --------- | --------- | ----- |
| `ccnl_code` | `ccnl_contracts(code)` | NO ACTION | CASCADE   |       |

#### Indexes

- `ccnl_seniority_rules_pkey` [PRIMARY] · (`id`)
- `idx_ccnl_sr_lookup` [INDEX] · (`ccnl_code`, `from_level_code`, `priority`)

---

### `holidays`

- **Tenant scoped**: yes
- **Row estimate**: 144
- **Domains**: ITLAB
- **Prisma model**: `holidays`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type         | Null | Default                         | Notes                                                   |
| --- | -------------- | ------------ | ---- | ------------------------------- | ------------------------------------------------------- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()`             | PK                                                      |
| 2   | `tenant_id`    | uuid         | NO   | —                               |                                                         |
| 3   | `date`         | date         | NO   | —                               |                                                         |
| 4   | `name`         | varchar(100) | NO   | —                               |                                                         |
| 5   | `name_en`      | varchar(100) | YES  | —                               |                                                         |
| 6   | `holiday_type` | varchar(50)  | YES  | `'national'::character varying` |                                                         |
| 7   | `country_code` | varchar(3)   | YES  | `'ITA'::character varying`      |                                                         |
| 8   | `region_code`  | varchar(10)  | YES  | —                               |                                                         |
| 9   | `is_recurring` | bool         | YES  | `true`                          |                                                         |
| 10  | `is_active`    | bool         | YES  | `true`                          |                                                         |
| 11  | `created_at`   | timestamp    | YES  | `now()`                         |                                                         |
| 12  | `deleted_at`   | timestamptz  | YES  | —                               |                                                         |
| 13  | `name_it`      | varchar(255) | YES  | —                               | Italian holiday name (Slice 2 i18n — see migration 206) |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `holidays_pkey` [PRIMARY] · (`id`)
- `idx_holidays_active` [INDEX] · (`id`)
- `idx_holidays_date` [INDEX] · (`date`)
- `idx_holidays_tenant` [INDEX] · (`tenant_id`)
- `idx_holidays_unique` [UNIQUE] · (`tenant_id`, `date`, `holiday_type`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

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

### `sindacati`

> S35.1 (ITLAB): catalogo nazionale italiano sindacati (confederazioni CGIL/CISL/UIL/UGL + federazioni di categoria).

- **Tenant scoped**: no
- **Row estimate**: -1
- **Domains**: ITLAB
- **Prisma model**: `sindacati`

#### Columns

| #   | Column                 | Type         | Null | Default             | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `code`                 | varchar(32)  | NO   | —                   |       |
| 3   | `name`                 | varchar(255) | NO   | —                   |       |
| 4   | `name_en`              | varchar(255) | YES  | —                   |       |
| 5   | `full_name`            | varchar(512) | YES  | —                   |       |
| 6   | `sector`               | varchar(64)  | YES  | —                   |       |
| 7   | `federation_parent_id` | uuid         | YES  | —                   |       |
| 8   | `website`              | varchar(255) | YES  | —                   |       |
| 9   | `is_confederation`     | bool         | NO   | `false`             |       |
| 10  | `is_active`            | bool         | NO   | `true`              |       |
| 11  | `notes`                | text         | YES  | —                   |       |
| 12  | `created_at`           | timestamptz  | NO   | `now()`             |       |
| 13  | `updated_at`           | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References      | ON UPDATE | ON DELETE | Notes |
| ---------------------- | --------------- | --------- | --------- | ----- |
| `federation_parent_id` | `sindacati(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_sindacati_confederation` [INDEX] · (`is_confederation`)
- `idx_sindacati_federation_parent` [INDEX] · (`federation_parent_id`)
- `idx_sindacati_sector` [INDEX] · (`sector`)
- `sindacati_code_key` [UNIQUE] · (`code`)
- `sindacati_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `sindacati` via (`federation_parent_id`)
- `sindacato_tenant_links` via (`sindacato_id`)

---

### `sindacato_tenant_links`

> S35.1 (ITLAB): sindacati attivi presso il tenant (RSU/RSA presenti). is_active flag per stato corrente.

- **Tenant scoped**: yes
- **Row estimate**: -1
- **Domains**: ITLAB
- **Prisma model**: `sindacato_tenant_links`
- **RLS**: enabled

#### Columns

| #   | Column         | Type        | Null | Default             | Notes |
| --- | -------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`           | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`    | uuid        | NO   | —                   |       |
| 3   | `sindacato_id` | uuid        | NO   | —                   |       |
| 4   | `signed_at`    | date        | YES  | —                   |       |
| 5   | `is_active`    | bool        | NO   | `true`              |       |
| 6   | `rsu_count`    | int4(32)    | YES  | —                   |       |
| 7   | `notes`        | text        | YES  | —                   |       |
| 8   | `created_at`   | timestamptz | NO   | `now()`             |       |
| 9   | `updated_at`   | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References      | ON UPDATE | ON DELETE | Notes |
| -------------- | --------------- | --------- | --------- | ----- |
| `sindacato_id` | `sindacati(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`    | `tenants(id)`   | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sindacato_tenant_links_sindacato` [INDEX] · (`sindacato_id`)
- `idx_sindacato_tenant_links_tenant` [INDEX] · (`tenant_id`)
- `sindacato_tenant_links_pkey` [PRIMARY] · (`id`)
- `sindacato_tenant_links_tenant_id_sindacato_id_key` [UNIQUE] · (`tenant_id`, `sindacato_id`)

#### RLS Policies

- **sindacato_tenant_links_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)`

---

### `tenant_ccnl_links`

> S35.1 (ITLAB): associazione tenant ↔ CCNL applicato (storico via effective_from/to). is_primary flag per CCNL principale.

- **Tenant scoped**: yes
- **Row estimate**: -1
- **Domains**: ITLAB
- **Prisma model**: `tenant_ccnl_links`
- **RLS**: enabled

#### Columns

| #   | Column           | Type        | Null | Default             | Notes |
| --- | ---------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`             | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`      | uuid        | NO   | —                   |       |
| 3   | `ccnl_code`      | varchar(64) | NO   | —                   |       |
| 4   | `is_primary`     | bool        | NO   | `true`              |       |
| 5   | `effective_from` | date        | NO   | `CURRENT_DATE`      |       |
| 6   | `effective_to`   | date        | YES  | —                   |       |
| 7   | `notes`          | text        | YES  | —                   |       |
| 8   | `created_at`     | timestamptz | NO   | `now()`             |       |
| 9   | `updated_at`     | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References             | ON UPDATE | ON DELETE | Notes |
| ----------- | ---------------------- | --------- | --------- | ----- |
| `ccnl_code` | `ccnl_contracts(code)` | NO ACTION | RESTRICT  |       |
| `tenant_id` | `tenants(id)`          | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_ccnl_links_primary` [INDEX] · (`tenant_id`)
- `idx_tenant_ccnl_links_tenant` [INDEX] · (`tenant_id`)
- `tenant_ccnl_links_pkey` [PRIMARY] · (`id`)
- `tenant_ccnl_links_tenant_id_ccnl_code_effective_from_key` [UNIQUE] · (`tenant_id`, `ccnl_code`, `effective_from`)

#### RLS Policies

- **tenant_ccnl_links_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)`

---
