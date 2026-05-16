# Dominio OPOURSKA — Organization-Process-OrgUnit-Role-Skill-KPI-Assessment

> Ontologia core 7-layer canonical (base attiva)

**Tabelle in questo dominio**: 41

## Tabelle

| Tabella                                                        | Rows   | Tenant | RLS | FK out | Cols |
| -------------------------------------------------------------- | ------ | ------ | --- | ------ | ---- |
| [`business_processes`](#businessprocesses)                     | 23     | —      | ✓   | 1      | 11   |
| [`company_profiles`](#companyprofiles)                         | 9      | —      | —   | 0      | 12   |
| [`company_sizes`](#companysizes)                               | 5      | —      | —   | 0      | 10   |
| [`cost_centers`](#costcenters)                                 | 30     | ✓      | ✓   | 1      | 25   |
| [`esco_skills`](#escoskills)                                   | 14.011 | —      | —   | 0      | 29   |
| [`job_template_skills`](#jobtemplateskills)                    | 28.983 | ✓      | ✓   | 4      | 10   |
| [`job_templates`](#jobtemplates)                               | 140    | ✓      | ✓   | 1      | 34   |
| [`locations`](#locations)                                      | 34     | ✓      | ✓   | 1      | 34   |
| [`org_areas`](#orgareas)                                       | 8      | —      | —   | 0      | 11   |
| [`org_chart_generation_sessions`](#orgchartgenerationsessions) | 3      | ✓      | ✓   | 1      | 23   |
| [`org_chart_snapshots`](#orgchartsnapshots)                    | 3      | ✓      | ✓   | 2      | 14   |
| [`org_chart_templates`](#orgcharttemplates)                    | 9      | —      | —   | 0      | 18   |
| [`org_levels`](#orglevels)                                     | 7      | —      | —   | 0      | 10   |
| [`org_prototype_rules`](#orgprototyperules)                    | 4      | —      | —   | 0      | 12   |
| [`org_prototype_templates`](#orgprototypetemplates)            | 36     | —      | —   | 1      | 9    |
| [`org_scenarios`](#orgscenarios)                               | 2      | ✓      | ✓   | 3      | 18   |
| [`org_templates`](#orgtemplates)                               | 7      | —      | —   | 0      | 11   |
| [`org_unit_kpis`](#orgunitkpis)                                | 100    | —      | —   | 1      | 14   |
| [`org_unit_process_mapping`](#orgunitprocessmapping)           | 12     | —      | ✓   | 3      | 7    |
| [`org_unit_tasks`](#orgunittasks)                              | 100    | —      | —   | 1      | 11   |
| [`org_unit_templates`](#orgunittemplates)                      | 225    | —      | —   | 0      | 24   |
| [`org_units`](#orgunits)                                       | 76     | ✓      | ✓   | 2      | 37   |
| [`performance_reviews`](#performancereviews)                   | 292    | ✓      | ✓   | 7      | 52   |
| [`rbp_roles`](#rbproles)                                       | 8      | —      | —   | 2      | 14   |
| [`role_default_dashboards`](#roledefaultdashboards)            | 8      | ✓      | ✓   | 2      | 7    |
| [`tenant_custom_skills`](#tenantcustomskills)                  | 25     | ✓      | ✓   | 4      | 22   |
| [`tenant_job_kpis`](#tenantjobkpis)                            | 80     | —      | —   | 1      | 17   |
| [`tenant_job_skills`](#tenantjobskills)                        | 160    | —      | —   | 1      | 13   |
| [`tenant_job_tasks`](#tenantjobtasks)                          | 100    | —      | —   | 1      | 11   |
| [`tenant_jobs`](#tenantjobs)                                   | 20     | ✓      | ✓   | 2      | 25   |
| [`tenant_onboarding_profiles`](#tenantonboardingprofiles)      | 4      | ✓      | ✓   | 1      | 10   |
| [`tenant_org_charts`](#tenantorgcharts)                        | 4      | ✓      | ✓   | 1      | 12   |
| [`tenant_org_units`](#tenantorgunits)                          | 47     | —      | —   | 2      | 24   |
| [`tenant_regulatory_compliance`](#tenantregulatorycompliance)  | -1     | ✓      | ✓   | 2      | 11   |
| [`tenant_retirement_rules`](#tenantretirementrules)            | 4      | ✓      | ✓   | 1      | 10   |
| [`tenant_revenue_periods`](#tenantrevenueperiods)              | 0      | ✓      | ✓   | 1      | 9    |
| [`tenant_sap_mapping`](#tenantsapmapping)                      | 9      | —      | —   | 0      | 8    |
| [`tenant_schema_version`](#tenantschemaversion)                | 4      | ✓      | ✓   | 2      | 6    |
| [`tenant_skill_dimensions`](#tenantskilldimensions)            | 75     | —      | —   | 1      | 11   |
| [`tenants`](#tenants)                                          | 4      | —      | ✓   | 1      | 32   |
| [`tenants_books`](#tenantsbooks)                               | 4      | ✓      | ✓   | 2      | 23   |

---

### `business_processes`

- **Tenant scoped**: no
- **Row estimate**: 23
- **Domains**: OPOURSKA · PROGOV
- **Prisma model**: `business_processes`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default              | Notes                                                                                                                        |
| --- | ---------------------- | ------------ | ---- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | `id`                   | uuid         | NO   | `uuid_generate_v4()` | PK                                                                                                                           |
| 2   | `process_code`         | varchar(20)  | NO   | —                    |                                                                                                                              |
| 3   | `process_name`         | varchar(100) | NO   | —                    |                                                                                                                              |
| 4   | `process_category`     | varchar(50)  | NO   | —                    | primary: inbound logistics, operations, outbound, marketing, service \| support: procurement, technology, HR, infrastructure |
| 5   | `value_chain_position` | int4(32)     | NO   | —                    | 1-5 for primary activities, 6-9 for support activities                                                                       |
| 6   | `description`          | text         | YES  | —                    |                                                                                                                              |
| 7   | `typical_inputs`       | \_text       | YES  | `'{}'::text[]`       |                                                                                                                              |
| 8   | `typical_outputs`      | \_text       | YES  | `'{}'::text[]`       |                                                                                                                              |
| 9   | `created_at`           | timestamptz  | YES  | `now()`              |                                                                                                                              |
| 10  | `updated_at`           | timestamptz  | YES  | `now()`              |                                                                                                                              |
| 11  | `profile_id`           | uuid         | YES  | —                    |                                                                                                                              |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References              | ON UPDATE | ON DELETE | Notes |
| ------------ | ----------------------- | --------- | --------- | ----- |
| `profile_id` | `industry_profiles(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `business_processes_pkey` [PRIMARY] · (`id`)
- `idx_business_processes_category` [INDEX] · (`process_category`)
- `idx_business_processes_position` [INDEX] · (`value_chain_position`)
- `idx_business_processes_profile_id` [INDEX] · (`profile_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM tenants
WHERE ((tenants.id = current_tenant_id()) AND (tenants.industry_profile_id = business_processes.profile_id))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM tenants
WHERE ((tenants.id = current_tenant_id()) AND (tenants.industry_profile_id = business_processes.profile_id))))`

#### Inverse relations (referenced by)

- `org_unit_process_mapping` via (`process_id`)
- `process_cost_centers` via (`process_id`)
- `process_kpis` via (`process_id`)
- `process_phases` via (`process_id`)
- `process_roles` via (`process_id`)
- `process_skill_requirements` via (`process_id`)

---

### `company_profiles`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: OPOURSKA
- **Prisma model**: `company_profiles`

#### Columns

| #   | Column          | Type         | Null | Default             | Notes                                                           |
| --- | --------------- | ------------ | ---- | ------------------- | --------------------------------------------------------------- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK                                                              |
| 2   | `profile_code`  | varchar(10)  | NO   | —                   | Codice profilo formato: [Section][Division].[GroupSuffix][Size] |
| 3   | `section_code`  | bpchar(1)    | NO   | —                   |                                                                 |
| 4   | `division_code` | varchar(2)   | NO   | —                   |                                                                 |
| 5   | `group_code`    | varchar(5)   | NO   | —                   |                                                                 |
| 6   | `size_code`     | varchar(2)   | NO   | —                   |                                                                 |
| 7   | `full_name_it`  | varchar(500) | YES  | —                   |                                                                 |
| 8   | `full_name_en`  | varchar(500) | YES  | —                   |                                                                 |
| 9   | `is_active`     | bool         | YES  | `true`              |                                                                 |
| 10  | `created_at`    | timestamptz  | YES  | `now()`             |                                                                 |
| 11  | `updated_at`    | timestamptz  | YES  | `now()`             |                                                                 |
| 12  | `deleted_at`    | timestamptz  | YES  | —                   |                                                                 |

#### Primary Key

`(`id`)`

#### Indexes

- `company_profiles_pkey` [PRIMARY] · (`id`)
- `idx_company_profiles_active` [INDEX] · (`id`)
- `idx_profiles_active` [INDEX] · (`is_active`)
- `idx_profiles_code` [INDEX] · (`profile_code`)
- `idx_profiles_division` [INDEX] · (`division_code`)
- `idx_profiles_group` [INDEX] · (`group_code`)
- `idx_profiles_section` [INDEX] · (`section_code`)
- `idx_profiles_size` [INDEX] · (`size_code`)

---

### `company_sizes`

- **Tenant scoped**: no
- **Row estimate**: 5
- **Domains**: OPOURSKA
- **Prisma model**: `company_sizes`

#### Columns

| #   | Column            | Type         | Null | Default | Notes |
| --- | ----------------- | ------------ | ---- | ------- | ----- |
| 1   | `code`            | varchar(20)  | NO   | —       | PK    |
| 2   | `name_it`         | varchar(100) | NO   | —       |       |
| 3   | `name_en`         | varchar(100) | NO   | —       |       |
| 4   | `min_employees`   | int4(32)     | NO   | `0`     |       |
| 5   | `max_employees`   | int4(32)     | YES  | —       |       |
| 6   | `max_revenue_eur` | int8(64)     | YES  | —       |       |
| 7   | `max_balance_eur` | int8(64)     | YES  | —       |       |
| 8   | `sort_order`      | int2(16)     | NO   | `0`     |       |
| 9   | `is_active`       | bool         | NO   | `true`  |       |
| 10  | `created_at`      | timestamptz  | NO   | `now()` |       |

#### Primary Key

`(`code`)`

#### Indexes

- `company_sizes_pkey1` [PRIMARY] · (`code`)

#### Inverse relations (referenced by)

- `industry_profiles` via (`company_size_code`)

---

### `cost_centers`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: OPOURSKA
- **Prisma model**: `cost_centers`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type          | Null | Default             | Notes                                                             |
| --- | ------------------- | ------------- | ---- | ------------------- | ----------------------------------------------------------------- |
| 1   | `id`                | uuid          | NO   | `gen_random_uuid()` | PK                                                                |
| 2   | `tenant_id`         | uuid          | NO   | —                   |                                                                   |
| 3   | `code`              | varchar(20)   | NO   | —                   |                                                                   |
| 4   | `name`              | varchar(100)  | NO   | —                   |                                                                   |
| 5   | `name_en`           | varchar(100)  | YES  | —                   |                                                                   |
| 6   | `parent_id`         | uuid          | YES  | —                   |                                                                   |
| 7   | `cost_center_type`  | varchar(20)   | YES  | —                   | Type: operational, overhead, project, investment, shared_services |
| 8   | `responsible_id`    | uuid          | YES  | —                   |                                                                   |
| 9   | `org_unit_id`       | uuid          | YES  | —                   |                                                                   |
| 10  | `budget_annual_eur` | numeric(15,2) | YES  | —                   |                                                                   |
| 11  | `budget_headcount`  | int4(32)      | YES  | —                   |                                                                   |
| 12  | `gl_account`        | varchar(20)   | YES  | —                   |                                                                   |
| 13  | `is_active`         | bool          | YES  | `true`              |                                                                   |
| 14  | `valid_from`        | date          | YES  | `CURRENT_DATE`      |                                                                   |
| 15  | `valid_to`          | date          | YES  | —                   |                                                                   |
| 16  | `created_at`        | timestamptz   | YES  | `now()`             |                                                                   |
| 17  | `updated_at`        | timestamptz   | YES  | `now()`             |                                                                   |
| 18  | `sap_kostl`         | varchar(20)   | YES  | —                   | SAP Cost Center code from CSKS                                    |
| 19  | `sap_bukrs`         | varchar(10)   | YES  | —                   | SAP Company Code                                                  |
| 20  | `sap_kokrs`         | varchar(10)   | YES  | —                   | SAP Controlling Area                                              |
| 21  | `sap_ktext`         | varchar(100)  | YES  | —                   | SAP Cost Center description                                       |
| 22  | `sap_verak`         | varchar(50)   | YES  | —                   | SAP Cost Center manager                                           |
| 23  | `sap_sync_date`     | timestamp     | YES  | —                   |                                                                   |
| 24  | `deleted_at`        | timestamptz   | YES  | —                   |                                                                   |
| 25  | `name_it`           | varchar(255)  | YES  | —                   | Italian cost center name (Slice 2 i18n — see migration 206)       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `cost_centers_pkey` [PRIMARY] · (`id`)
- `idx_cost_centers_active` [INDEX] · (`id`)
- `idx_cost_centers_org_unit` [INDEX] · (`org_unit_id`)
- `idx_cost_centers_parent` [INDEX] · (`parent_id`)
- `idx_cost_centers_sap_kostl` [INDEX] · (`sap_kostl`)
- `idx_cost_centers_tenant` [INDEX] · (`tenant_id`)
- `idx_cost_centers_type` [INDEX] · (`cost_center_type`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `contracts` via (`cost_center_id`)

---

### `esco_skills`

- **Tenant scoped**: no
- **Row estimate**: 14.011
- **Domains**: OPOURSKA · ESKAP
- **Prisma model**: `esco_skills`

#### Columns

| #   | Column                   | Type         | Null | Default              | Notes                                                |
| --- | ------------------------ | ------------ | ---- | -------------------- | ---------------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `uuid_generate_v4()` | PK                                                   |
| 2   | `uri`                    | varchar(255) | NO   | —                    |                                                      |
| 3   | `preferred_label`        | varchar(500) | NO   | —                    |                                                      |
| 4   | `description`            | text         | YES  | —                    |                                                      |
| 5   | `skill_type`             | varchar(50)  | NO   | —                    |                                                      |
| 6   | `reuse_level`            | varchar(50)  | YES  | —                    |                                                      |
| 7   | `is_digital`             | bool         | YES  | `false`              |                                                      |
| 8   | `is_green`               | bool         | YES  | `false`              |                                                      |
| 9   | `created_at`             | timestamp    | YES  | `now()`              |                                                      |
| 10  | `alt_labels`             | jsonb        | YES  | `'[]'::jsonb`        |                                                      |
| 11  | `broader_uri`            | varchar(500) | YES  | —                    |                                                      |
| 12  | `narrower_uris`          | jsonb        | YES  | `'[]'::jsonb`        |                                                      |
| 13  | `related_uris`           | jsonb        | YES  | `'[]'::jsonb`        |                                                      |
| 14  | `isco_groups`            | jsonb        | YES  | `'[]'::jsonb`        |                                                      |
| 15  | `updated_at`             | timestamptz  | YES  | `now()`              |                                                      |
| 16  | `primary_category`       | varchar(20)  | YES  | —                    |                                                      |
| 17  | `cognitive_level`        | int4(32)     | YES  | —                    |                                                      |
| 18  | `is_classified`          | bool         | YES  | `false`              |                                                      |
| 19  | `embedding_en`           | vector       | YES  | —                    | OpenAI ada-002 compatible embedding for English text |
| 20  | `embedding_it`           | vector       | YES  | —                    | OpenAI ada-002 compatible embedding for Italian text |
| 21  | `embedding_model`        | varchar(100) | YES  | —                    | Model version used to generate embedding             |
| 22  | `embedding_generated_at` | timestamptz  | YES  | —                    | Timestamp when embedding was last generated          |
| 23  | `skill_group_uri`        | varchar(500) | YES  | —                    |                                                      |
| 24  | `preferred_label_en`     | varchar(500) | YES  | —                    |                                                      |
| 25  | `preferred_label_it`     | varchar(500) | YES  | —                    |                                                      |
| 26  | `is_transversal`         | bool         | YES  | `false`              |                                                      |
| 27  | `description_en`         | text         | YES  | —                    |                                                      |
| 28  | `description_it`         | text         | YES  | —                    |                                                      |
| 29  | `alt_labels_it`          | text         | YES  | —                    |                                                      |

#### Primary Key

`(`id`)`

#### Indexes

- `esco_skills_pkey` [PRIMARY] · (`id`)
- `esco_skills_uri_key` [UNIQUE] · (`uri`)
- `idx_esco_skills_alt_labels` [INDEX] · (`alt_labels`)
- `idx_esco_skills_broader` [INDEX] · (`broader_uri`)
- `idx_esco_skills_embedding_en` [INDEX] · (`embedding_en`)
- `idx_esco_skills_embedding_it` [INDEX] · (`embedding_it`)
- `idx_esco_skills_label` [INDEX] · (`preferred_label`)
- `idx_esco_skills_label_trgm` [INDEX] · (`preferred_label`)
- `idx_esco_skills_reuse` [INDEX] · (`reuse_level`)
- `idx_esco_skills_type` [INDEX] · (`skill_type`)

#### Inverse relations (referenced by)

- `career_path_level_skills` via (`skill_id`)
- `career_skills` via (`skill_id`)
- `employee_skill_mappings` via (`esco_skill_id`)
- `employee_skill_profiles` via (`skill_id`)
- `employee_skills` via (`esco_skill_id`)
- `esco_occupation_skills` via (`skill_id`)
- `esco_skill_relations` via (`source_skill_id` · `target_skill_id`)
- `extracted_skills` via (`esco_skill_id`)
- `import_skill_links` via (`esco_skill_id`)
- `job_template_skills` via (`skill_id`)
- `mentor_match_scores` via (`skill_id`)
- `onet_esco_mappings` via (`esco_skill_id`)
- `onet_skills` via (`esco_skill_id` · `mapped_esco_skill_id`)
- `ontology_skill_dimensions` via (`esco_skill_id`)
- `ontology_skill_relations` via (`source_skill_id` · `target_skill_id`)
- `performance_skill_links` via (`linked_skill_id`)
- `position_skill_requirements` via (`esco_skill_id`)
- `process_skill_requirements` via (`esco_skill_id`)
- `role_skill_requirements` via (`skill_id`)
- `skill_adjacencies` via (`adjacent_skill_id` · `skill_id`)
- `skill_aliases` via (`esco_skill_id`)
- `skill_classifications` via (`esco_skill_id`)
- `skill_demand_metrics` via (`esco_skill_id`)
- `skill_pair_usage` via (`skill_id_1` · `skill_id_2`)
- `skill_relationships` via (`source_skill_id` · `target_skill_id`)
- `skill_requirements_templates` via (`skill_id`)
- `skill_supply_metrics` via (`esco_skill_id`)
- `skill_synonyms` via (`esco_skill_id`)
- `skill_taxonomy_extensions` via (`skill_id`)
- `tenant_custom_skills` via (`base_esco_skill_id`)
- `unknown_skills` via (`mapped_to_esco_id` · `suggested_esco_id`)

---

### `job_template_skills`

- **Tenant scoped**: yes
- **Row estimate**: 28.983
- **Domains**: OPOURSKA
- **Prisma model**: `job_template_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type        | Null | Default                              | Notes |
| --- | ---------------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                   | uuid        | NO   | `gen_random_uuid()`                  | PK    |
| 2   | `tenant_id`            | uuid        | NO   | —                                    |       |
| 3   | `job_template_id`      | uuid        | NO   | —                                    |       |
| 4   | `skill_id`             | uuid        | YES  | —                                    |       |
| 5   | `custom_skill_id`      | uuid        | YES  | —                                    |       |
| 6   | `required_proficiency` | int2(16)    | NO   | `3`                                  |       |
| 7   | `importance`           | varchar(20) | NO   | `'core'::character varying`          |       |
| 8   | `source`               | varchar(20) | NO   | `'esco_inferred'::character varying` |       |
| 9   | `rationale`            | text        | YES  | —                                    |       |
| 10  | `created_at`           | timestamptz | NO   | `now()`                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References                 | ON UPDATE | ON DELETE | Notes |
| ----------------- | -------------------------- | --------- | --------- | ----- |
| `custom_skill_id` | `tenant_custom_skills(id)` | NO ACTION | CASCADE   |       |
| `job_template_id` | `job_templates(id)`        | NO ACTION | CASCADE   |       |
| `skill_id`        | `esco_skills(id)`          | NO ACTION | RESTRICT  |       |
| `tenant_id`       | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_job_template_skills_tenant_id` [INDEX] · (`tenant_id`)
- `idx_jts_skill` [INDEX] · (`skill_id`)
- `idx_jts_template` [INDEX] · (`job_template_id`)
- `job_template_skills_pkey` [PRIMARY] · (`id`)
- `uq_jts_template_skill` [UNIQUE] · (`job_template_id`, `skill_id`, `custom_skill_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `job_templates`

- **Tenant scoped**: yes
- **Row estimate**: 140
- **Domains**: OPOURSKA
- **Prisma model**: `job_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type          | Null | Default                          | Notes                                         |
| --- | ------------------------ | ------------- | ---- | -------------------------------- | --------------------------------------------- |
| 1   | `id`                     | uuid          | NO   | `gen_random_uuid()`              | PK                                            |
| 2   | `org_unit_template_id`   | uuid          | YES  | —                                |                                               |
| 3   | `profile_id`             | uuid          | YES  | —                                |                                               |
| 4   | `job_code`               | varchar(20)   | NO   | —                                |                                               |
| 5   | `title_it`               | varchar(255)  | NO   | —                                |                                               |
| 6   | `title_en`               | varchar(255)  | YES  | —                                |                                               |
| 7   | `description`            | text          | YES  | —                                |                                               |
| 8   | `summary`                | text          | YES  | —                                |                                               |
| 9   | `org_level`              | int4(32)      | YES  | —                                |                                               |
| 10  | `is_management`          | bool          | YES  | `false`                          |                                               |
| 11  | `employment_type`        | varchar(20)   | YES  | `'full_time'::character varying` |                                               |
| 12  | `esco_occupation_uri`    | varchar(255)  | YES  | —                                |                                               |
| 13  | `esco_occupation_code`   | varchar(20)   | YES  | —                                |                                               |
| 14  | `esco_occupation_title`  | varchar(255)  | YES  | —                                |                                               |
| 15  | `salary_band_code`       | varchar(20)   | YES  | —                                |                                               |
| 16  | `salary_min`             | numeric(12,2) | YES  | —                                |                                               |
| 17  | `salary_max`             | numeric(12,2) | YES  | —                                |                                               |
| 18  | `currency`               | varchar(3)    | YES  | `'EUR'::character varying`       |                                               |
| 19  | `source_type`            | varchar(50)   | YES  | —                                |                                               |
| 20  | `source_reference`       | text          | YES  | —                                |                                               |
| 21  | `is_active`              | bool          | YES  | `true`                           |                                               |
| 22  | `created_at`             | timestamptz   | YES  | `now()`                          |                                               |
| 23  | `updated_at`             | timestamptz   | YES  | `now()`                          |                                               |
| 24  | `sap_stell`              | varchar(20)   | YES  | —                                | SAP Job code from T513                        |
| 25  | `sap_stext`              | varchar(100)  | YES  | —                                | SAP Job description                           |
| 26  | `sap_persk`              | varchar(10)   | YES  | —                                | SAP Employee subgroup                         |
| 27  | `sap_sync_date`          | timestamp     | YES  | —                                |                                               |
| 28  | `embedding_en`           | vector        | YES  | —                                | Vector embedding of job description (English) |
| 29  | `embedding_it`           | vector        | YES  | —                                | Vector embedding of job description (Italian) |
| 30  | `embedding_model`        | varchar(100)  | YES  | —                                |                                               |
| 31  | `embedding_generated_at` | timestamptz   | YES  | —                                |                                               |
| 32  | `deleted_at`             | timestamptz   | YES  | —                                |                                               |
| 33  | `is_prototype_generated` | bool          | YES  | `false`                          |                                               |
| 34  | `tenant_id`              | uuid          | NO   | —                                |                                               |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_job_code_per_profile` [UNIQUE] · (`profile_id`, `job_code`)
- `idx_job_templates_active` [INDEX] · (`is_active`)
- `idx_job_templates_embedding_en` [INDEX] · (`embedding_en`)
- `idx_job_templates_embedding_it` [INDEX] · (`embedding_it`)
- `idx_job_templates_esco` [INDEX] · (`esco_occupation_code`)
- `idx_job_templates_level` [INDEX] · (`org_level`)
- `idx_job_templates_not_deleted` [INDEX] · (`id`)
- `idx_job_templates_profile` [INDEX] · (`profile_id`)
- `idx_job_templates_prototype` [INDEX] · (`tenant_id`)
- `idx_job_templates_tenant` [INDEX] · (`tenant_id`)
- `idx_job_templates_unit` [INDEX] · (`org_unit_template_id`)
- `job_templates_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_job_templates** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `job_kpi_distribution` via (`job_template_id`)
- `job_task_distribution` via (`job_template_id`)
- `job_template_skills` via (`job_template_id`)
- `position_skill_requirements` via (`position_id`)
- `role_skill_requirements` via (`role_id`)

---

### `locations`

- **Tenant scoped**: yes
- **Row estimate**: 34
- **Domains**: OPOURSKA
- **Prisma model**: `locations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type          | Null | Default                    | Notes                                                                            |
| --- | ------------------------ | ------------- | ---- | -------------------------- | -------------------------------------------------------------------------------- |
| 1   | `id`                     | uuid          | NO   | `gen_random_uuid()`        | PK                                                                               |
| 2   | `tenant_id`              | uuid          | NO   | —                          |                                                                                  |
| 3   | `code`                   | varchar(20)   | NO   | —                          |                                                                                  |
| 4   | `name`                   | varchar(100)  | NO   | —                          |                                                                                  |
| 5   | `location_type`          | varchar(30)   | YES  | —                          | Type: headquarters, branch, office, warehouse, factory, store, remote, coworking |
| 6   | `address`                | varchar(255)  | YES  | —                          |                                                                                  |
| 7   | `city`                   | varchar(100)  | YES  | —                          |                                                                                  |
| 8   | `province`               | varchar(50)   | YES  | —                          |                                                                                  |
| 9   | `postal_code`            | varchar(10)   | YES  | —                          |                                                                                  |
| 10  | `country`                | varchar(3)    | YES  | `'ITA'::character varying` |                                                                                  |
| 11  | `latitude`               | numeric(10,8) | YES  | —                          |                                                                                  |
| 12  | `longitude`              | numeric(11,8) | YES  | —                          |                                                                                  |
| 13  | `phone`                  | varchar(30)   | YES  | —                          |                                                                                  |
| 14  | `email`                  | varchar(100)  | YES  | —                          |                                                                                  |
| 15  | `is_active`              | bool          | YES  | `true`                     |                                                                                  |
| 16  | `capacity_headcount`     | int4(32)      | YES  | —                          |                                                                                  |
| 17  | `square_meters`          | numeric(10,2) | YES  | —                          |                                                                                  |
| 18  | `opening_date`           | date          | YES  | —                          |                                                                                  |
| 19  | `closing_date`           | date          | YES  | —                          |                                                                                  |
| 20  | `created_at`             | timestamptz   | YES  | `now()`                    |                                                                                  |
| 21  | `updated_at`             | timestamptz   | YES  | `now()`                    |                                                                                  |
| 22  | `sap_werks`              | varchar(10)   | YES  | —                          | SAP Personnel Area from T001P                                                    |
| 23  | `sap_btrtl`              | varchar(10)   | YES  | —                          | SAP Personnel Subarea                                                            |
| 24  | `sap_name1`              | varchar(100)  | YES  | —                          | SAP Location name                                                                |
| 25  | `sap_stras`              | varchar(100)  | YES  | —                          | SAP Street address                                                               |
| 26  | `sap_ort01`              | varchar(50)   | YES  | —                          |                                                                                  |
| 27  | `sap_pstlz`              | varchar(20)   | YES  | —                          |                                                                                  |
| 28  | `sap_land1`              | varchar(5)    | YES  | —                          |                                                                                  |
| 29  | `sap_sync_date`          | timestamp     | YES  | —                          |                                                                                  |
| 30  | `embedding`              | vector        | YES  | —                          | Semantic embedding of location name and address                                  |
| 31  | `embedding_text_hash`    | varchar(64)   | YES  | —                          |                                                                                  |
| 32  | `embedding_model`        | varchar(100)  | YES  | —                          |                                                                                  |
| 33  | `embedding_generated_at` | timestamptz   | YES  | —                          |                                                                                  |
| 34  | `deleted_at`             | timestamptz   | YES  | —                          |                                                                                  |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_locations_active` [INDEX] · (`id`)
- `idx_locations_city` [INDEX] · (`city`)
- `idx_locations_embedding` [INDEX] · (`embedding`)
- `idx_locations_sap_werks` [INDEX] · (`sap_werks`)
- `idx_locations_tenant` [INDEX] · (`tenant_id`)
- `idx_locations_type` [INDEX] · (`location_type`)
- `locations_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `contracts` via (`location_id`)
- `internal_mobility_postings` via (`location_id`)

---

### `org_areas`

- **Tenant scoped**: no
- **Row estimate**: 8
- **Domains**: OPOURSKA
- **Prisma model**: `org_areas`

#### Columns

| #   | Column               | Type         | Null | Default | Notes |
| --- | -------------------- | ------------ | ---- | ------- | ----- |
| 1   | `code`               | varchar(10)  | NO   | —       | PK    |
| 2   | `cost_center_series` | varchar(4)   | NO   | —       |       |
| 3   | `name_it`            | varchar(100) | NO   | —       |       |
| 4   | `name_en`            | varchar(100) | NO   | —       |       |
| 5   | `description`        | text         | YES  | —       |       |
| 6   | `icon`               | varchar(50)  | YES  | —       |       |
| 7   | `color`              | varchar(7)   | YES  | —       |       |
| 8   | `sort_order`         | int4(32)     | YES  | —       |       |
| 9   | `is_active`          | bool         | YES  | `true`  |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()` |       |
| 11  | `deleted_at`         | timestamptz  | YES  | —       |       |

#### Primary Key

`(`code`)`

#### Indexes

- `idx_org_areas_active` [INDEX] · (`code`)
- `org_areas_pkey` [PRIMARY] · (`code`)

---

### `org_chart_generation_sessions`

- **Tenant scoped**: yes
- **Row estimate**: 3
- **Domains**: OPOURSKA
- **Prisma model**: `org_chart_generation_sessions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                         | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                               |       |
| 3   | `session_name`        | varchar(255) | NO   | —                               |       |
| 4   | `session_description` | text         | YES  | —                               |       |
| 5   | `generation_method`   | varchar(50)  | NO   | `'combined'::character varying` |       |
| 6   | `nace_section`        | bpchar(1)    | YES  | —                               |       |
| 7   | `nace_division`       | varchar(2)   | YES  | —                               |       |
| 8   | `nace_group`          | varchar(4)   | YES  | —                               |       |
| 9   | `nace_code`           | varchar(10)  | YES  | —                               |       |
| 10  | `industry_name`       | varchar(255) | YES  | —                               |       |
| 11  | `company_size`        | varchar(20)  | YES  | `'medium'::character varying`   |       |
| 12  | `ai_provider`         | varchar(50)  | YES  | —                               |       |
| 13  | `ai_model`            | varchar(100) | YES  | —                               |       |
| 14  | `ai_prompt`           | text         | YES  | —                               |       |
| 15  | `ai_response`         | jsonb        | YES  | —                               |       |
| 16  | `generated_structure` | jsonb        | YES  | —                               |       |
| 17  | `tenant_context`      | jsonb        | YES  | —                               |       |
| 18  | `status`              | varchar(20)  | NO   | `'pending'::character varying`  |       |
| 19  | `error_message`       | text         | YES  | —                               |       |
| 20  | `created_at`          | timestamptz  | YES  | `now()`                         |       |
| 21  | `started_at`          | timestamptz  | YES  | —                               |       |
| 22  | `completed_at`        | timestamptz  | YES  | —                               |       |
| 23  | `updated_at`          | timestamptz  | YES  | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ocgs_created` [INDEX] · (`created_at`)
- `idx_ocgs_nace` [INDEX] · (`nace_code`)
- `idx_ocgs_status` [INDEX] · (`status`)
- `idx_ocgs_tenant` [INDEX] · (`tenant_id`)
- `org_chart_generation_sessions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `employees_staging` via (`session_id`)
- `org_chart_snapshots` via (`session_id`)

---

### `org_chart_snapshots`

- **Tenant scoped**: yes
- **Row estimate**: 3
- **Domains**: OPOURSKA
- **Prisma model**: `org_chart_snapshots`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                      | Notes                                                                          |
| --- | ------------------- | ------------ | ---- | ---------------------------- | ------------------------------------------------------------------------------ |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`          | PK                                                                             |
| 2   | `session_id`        | uuid         | NO   | —                            |                                                                                |
| 3   | `tenant_id`         | uuid         | NO   | —                            |                                                                                |
| 4   | `snapshot_name`     | varchar(255) | NO   | —                            |                                                                                |
| 5   | `snapshot_type`     | varchar(30)  | NO   | —                            |                                                                                |
| 6   | `snapshot_version`  | varchar(20)  | YES  | `'1.0.0'::character varying` |                                                                                |
| 7   | `tree_structure`    | jsonb        | YES  | —                            | JSONB BY DESIGN: point-in-time snapshot of org hierarchy. Not a live relation. |
| 8   | `excalidraw_format` | jsonb        | YES  | —                            | JSONB BY DESIGN: rendering format for visual org chart.                        |
| 9   | `employees_map`     | jsonb        | YES  | —                            | JSONB BY DESIGN: snapshot of employee positions at a point in time.            |
| 10  | `statistics`        | jsonb        | YES  | —                            | JSONB BY DESIGN: computed statistics snapshot.                                 |
| 11  | `is_active`         | bool         | YES  | `true`                       |                                                                                |
| 12  | `created_at`        | timestamptz  | YES  | `now()`                      |                                                                                |
| 13  | `updated_at`        | timestamptz  | YES  | `now()`                      |                                                                                |
| 14  | `deleted_at`        | timestamptz  | YES  | —                            |                                                                                |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References                          | ON UPDATE | ON DELETE | Notes |
| ------------ | ----------------------------------- | --------- | --------- | ----- |
| `session_id` | `org_chart_generation_sessions(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`                       | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ocs_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_ocs_session` [INDEX] · (`session_id`)
- `idx_ocs_tenant` [INDEX] · (`tenant_id`)
- `idx_ocs_type` [INDEX] · (`snapshot_type`)
- `idx_org_chart_snapshots_active` [INDEX] · (`id`)
- `org_chart_snapshots_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `org_chart_templates`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: OPOURSKA
- **Prisma model**: `org_chart_templates`

#### Columns

| #   | Column                 | Type         | Null | Default                      | Notes |
| --- | ---------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `profile_id`           | uuid         | NO   | —                            |       |
| 3   | `name`                 | varchar(255) | NO   | —                            |       |
| 4   | `description`          | text         | YES  | —                            |       |
| 5   | `version`              | varchar(20)  | YES  | `'1.0.0'::character varying` |       |
| 6   | `is_default`           | bool         | YES  | `false`                      |       |
| 7   | `source_type`          | varchar(50)  | YES  | —                            |       |
| 8   | `source_reference`     | text         | YES  | —                            |       |
| 9   | `is_active`            | bool         | YES  | `true`                       |       |
| 10  | `created_at`           | timestamptz  | YES  | `now()`                      |       |
| 11  | `updated_at`           | timestamptz  | YES  | `now()`                      |       |
| 12  | `template_structure`   | jsonb        | YES  | —                            |       |
| 13  | `position_definitions` | jsonb        | YES  | —                            |       |
| 14  | `nace_section`         | bpchar(1)    | YES  | —                            |       |
| 15  | `nace_division`        | varchar(2)   | YES  | —                            |       |
| 16  | `size_class`           | varchar(20)  | YES  | —                            |       |
| 17  | `level_count`          | int4(32)     | YES  | `7`                          |       |
| 18  | `deleted_at`           | timestamptz  | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_org_chart_templates_active` [INDEX] · (`id`)
- `idx_org_templates_active` [INDEX] · (`is_active`)
- `idx_org_templates_profile` [INDEX] · (`profile_id`)
- `org_chart_templates_pkey` [PRIMARY] · (`id`)

---

### `org_levels`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: OPOURSKA
- **Prisma model**: `org_levels`

#### Columns

| #   | Column                    | Type         | Null | Default | Notes |
| --- | ------------------------- | ------------ | ---- | ------- | ----- |
| 1   | `level`                   | int4(32)     | NO   | —       | PK    |
| 2   | `name_it`                 | varchar(50)  | NO   | —       |       |
| 3   | `name_en`                 | varchar(50)  | NO   | —       |       |
| 4   | `nature`                  | varchar(20)  | NO   | —       |       |
| 5   | `is_management`           | bool         | YES  | `false` |       |
| 6   | `min_salary_multiplier`   | numeric(4,2) | YES  | —       |       |
| 7   | `max_salary_multiplier`   | numeric(4,2) | YES  | —       |       |
| 8   | `typical_span_of_control` | int4(32)     | YES  | —       |       |
| 9   | `sort_order`              | int4(32)     | YES  | —       |       |
| 10  | `created_at`              | timestamptz  | YES  | `now()` |       |

#### Primary Key

`(`level`)`

#### Indexes

- `org_levels_pkey` [PRIMARY] · (`level`)

---

### `org_prototype_rules`

- **Tenant scoped**: no
- **Row estimate**: 4
- **Domains**: OPOURSKA
- **Prisma model**: `org_prototype_rules`

#### Columns

| #   | Column                       | Type        | Null | Default              | Notes |
| --- | ---------------------------- | ----------- | ---- | -------------------- | ----- |
| 1   | `id`                         | uuid        | NO   | `uuid_generate_v4()` | PK    |
| 2   | `company_size`               | varchar(10) | NO   | —                    |       |
| 3   | `nace_section`               | varchar(5)  | YES  | —                    |       |
| 4   | `max_hierarchy_levels`       | int4(32)    | NO   | —                    |       |
| 5   | `min_departments`            | int4(32)    | NO   | —                    |       |
| 6   | `max_departments`            | int4(32)    | NO   | —                    |       |
| 7   | `role_specialization_factor` | float8(53)  | NO   | —                    |       |
| 8   | `merge_support_functions`    | bool        | YES  | `false`              |       |
| 9   | `department_merge_rules`     | jsonb       | YES  | `'{}'::jsonb`        |       |
| 10  | `mandatory_departments`      | jsonb       | YES  | `'[]'::jsonb`        |       |
| 11  | `optional_departments`       | jsonb       | YES  | `'[]'::jsonb`        |       |
| 12  | `created_at`                 | timestamptz | YES  | `now()`              |       |

#### Primary Key

`(`id`)`

#### Indexes

- `org_prototype_rules_company_size_nace_section_key` [UNIQUE] · (`company_size`, `nace_section`)
- `org_prototype_rules_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `org_prototype_templates` via (`rule_id`)

---

### `org_prototype_templates`

- **Tenant scoped**: no
- **Row estimate**: 36
- **Domains**: OPOURSKA
- **Prisma model**: `org_prototype_templates`

#### Columns

| #   | Column                  | Type         | Null | Default              | Notes |
| --- | ----------------------- | ------------ | ---- | -------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `rule_id`               | uuid         | YES  | —                    |       |
| 3   | `isco_major_group`      | varchar(2)   | NO   | —                    |       |
| 4   | `department_name_en`    | varchar(100) | NO   | —                    |       |
| 5   | `department_name_it`    | varchar(100) | YES  | —                    |       |
| 6   | `function_type`         | varchar(20)  | YES  | —                    |       |
| 7   | `default_headcount_pct` | int4(32)     | YES  | —                    |       |
| 8   | `typical_positions`     | jsonb        | YES  | `'[]'::jsonb`        |       |
| 9   | `created_at`            | timestamptz  | YES  | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns   | References                | ON UPDATE | ON DELETE | Notes |
| --------- | ------------------------- | --------- | --------- | ----- |
| `rule_id` | `org_prototype_rules(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_org_prototype_templates_rule` [INDEX] · (`rule_id`)
- `org_prototype_templates_pkey` [PRIMARY] · (`id`)

---

### `org_scenarios`

- **Tenant scoped**: yes
- **Row estimate**: 2
- **Domains**: OPOURSKA
- **Prisma model**: `org_scenarios`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type          | Null | Default                              | Notes |
| --- | ------------------- | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | uuid          | NO   | `uuid_generate_v4()`                 | PK    |
| 2   | `tenant_id`         | uuid          | NO   | —                                    |       |
| 3   | `name`              | varchar(255)  | NO   | —                                    |       |
| 4   | `description`       | text          | YES  | —                                    |       |
| 5   | `scenario_type`     | varchar(50)   | NO   | `'restructuring'::character varying` |       |
| 6   | `status`            | varchar(50)   | NO   | `'draft'::character varying`         |       |
| 7   | `is_baseline`       | bool          | YES  | `false`                              |       |
| 8   | `base_org_unit_id`  | uuid          | YES  | —                                    |       |
| 9   | `changes`           | jsonb         | YES  | `'[]'::jsonb`                        |       |
| 10  | `impact_analysis`   | jsonb         | YES  | `'{}'::jsonb`                        |       |
| 11  | `headcount`         | int4(32)      | YES  | —                                    |       |
| 12  | `departments_count` | int4(32)      | YES  | —                                    |       |
| 13  | `total_cost`        | numeric(15,2) | YES  | —                                    |       |
| 14  | `span_of_control`   | numeric(5,2)  | YES  | —                                    |       |
| 15  | `created_by`        | uuid          | YES  | —                                    |       |
| 16  | `created_at`        | timestamp     | YES  | `now()`                              |       |
| 17  | `updated_at`        | timestamp     | YES  | `now()`                              |       |
| 18  | `deleted_at`        | timestamp     | YES  | —                                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns            | References      | ON UPDATE | ON DELETE | Notes |
| ------------------ | --------------- | --------- | --------- | ----- |
| `base_org_unit_id` | `org_units(id)` | NO ACTION | CASCADE   |       |
| `created_by`       | `users(id)`     | NO ACTION | SET NULL  |       |
| `tenant_id`        | `tenants(id)`   | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_org_scenarios_base_org_unit_id` [INDEX] · (`base_org_unit_id`)
- `idx_org_scenarios_created_by` [INDEX] · (`created_by`)
- `idx_org_scenarios_deleted` [INDEX] · (`deleted_at`)
- `idx_org_scenarios_status` [INDEX] · (`tenant_id`, `status`)
- `idx_org_scenarios_tenant` [INDEX] · (`tenant_id`)
- `org_scenarios_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **org_scenarios_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `org_templates`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: OPOURSKA
- **Prisma model**: `org_templates`

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `nace_section_code`  | bpchar(1)    | NO   | —                   |       |
| 3   | `nace_division_code` | varchar(10)  | YES  | —                   |       |
| 4   | `company_size_min`   | int4(32)     | NO   | —                   |       |
| 5   | `company_size_max`   | int4(32)     | NO   | —                   |       |
| 6   | `template_name`      | varchar(200) | NO   | —                   |       |
| 7   | `description`        | text         | YES  | —                   |       |
| 8   | `org_structure`      | jsonb        | NO   | —                   |       |
| 9   | `recommended_roles`  | jsonb        | NO   | —                   |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()`             |       |
| 11  | `updated_at`         | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_org_templates_nace` [INDEX] · (`nace_section_code`, `nace_division_code`)
- `idx_org_templates_size` [INDEX] · (`company_size_min`, `company_size_max`)
- `org_templates_pkey` [PRIMARY] · (`id`)

---

### `org_unit_kpis`

- **Tenant scoped**: no
- **Row estimate**: 100
- **Domains**: OPOURSKA
- **Prisma model**: `org_unit_kpis`

#### Columns

| #   | Column                 | Type          | Null | Default              | Notes                                                                                               |
| --- | ---------------------- | ------------- | ---- | -------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | `id`                   | uuid          | NO   | `uuid_generate_v4()` | PK                                                                                                  |
| 2   | `org_unit_template_id` | uuid          | NO   | —                    |                                                                                                     |
| 3   | `kpi_code`             | varchar(20)   | NO   | —                    |                                                                                                     |
| 4   | `kpi_name`             | varchar(200)  | NO   | —                    |                                                                                                     |
| 5   | `kpi_description`      | text          | YES  | —                    |                                                                                                     |
| 6   | `measurement_unit`     | varchar(50)   | NO   | —                    |                                                                                                     |
| 7   | `target_direction`     | varchar(20)   | NO   | —                    | increase: higher is better \| decrease: lower is better \| maintain: stable \| range: within bounds |
| 8   | `benchmark_value`      | numeric(15,2) | YES  | —                    |                                                                                                     |
| 9   | `benchmark_min`        | numeric(15,2) | YES  | —                    |                                                                                                     |
| 10  | `benchmark_max`        | numeric(15,2) | YES  | —                    |                                                                                                     |
| 11  | `data_source`          | varchar(100)  | YES  | —                    |                                                                                                     |
| 12  | `calculation_formula`  | text          | YES  | —                    |                                                                                                     |
| 13  | `created_at`           | timestamptz   | YES  | `now()`              |                                                                                                     |
| 14  | `updated_at`           | timestamptz   | YES  | `now()`              |                                                                                                     |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References               | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ------------------------ | --------- | --------- | ----- |
| `org_unit_template_id` | `org_unit_templates(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_org_unit_kpis_direction` [INDEX] · (`target_direction`)
- `idx_org_unit_kpis_unit` [INDEX] · (`org_unit_template_id`)
- `org_unit_kpis_org_unit_template_id_kpi_code_key` [UNIQUE] · (`org_unit_template_id`, `kpi_code`)
- `org_unit_kpis_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `job_kpi_distribution` via (`org_unit_kpi_id`)

---

### `org_unit_process_mapping`

- **Tenant scoped**: no
- **Row estimate**: 12
- **Domains**: OPOURSKA
- **Prisma model**: `org_unit_process_mapping`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type        | Null | Default              | Notes                                                                                 |
| --- | ---------------------- | ----------- | ---- | -------------------- | ------------------------------------------------------------------------------------- |
| 1   | `id`                   | uuid        | NO   | `uuid_generate_v4()` | PK                                                                                    |
| 2   | `org_unit_template_id` | uuid        | NO   | —                    |                                                                                       |
| 3   | `process_id`           | uuid        | NO   | —                    |                                                                                       |
| 4   | `cost_center_id`       | uuid        | YES  | —                    |                                                                                       |
| 5   | `responsibility_level` | varchar(20) | NO   | —                    | primary: main owner \| secondary: shared responsibility \| support: contributing role |
| 6   | `created_at`           | timestamptz | YES  | `now()`              |                                                                                       |
| 7   | `updated_at`           | timestamptz | YES  | `now()`              |                                                                                       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References                 | ON UPDATE | ON DELETE | Notes |
| ---------------------- | -------------------------- | --------- | --------- | ----- |
| `cost_center_id`       | `process_cost_centers(id)` | NO ACTION | SET NULL  |       |
| `org_unit_template_id` | `org_unit_templates(id)`   | NO ACTION | CASCADE   |       |
| `process_id`           | `business_processes(id)`   | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_org_unit_process_mapping_cost_center` [INDEX] · (`cost_center_id`)
- `idx_org_unit_process_mapping_process` [INDEX] · (`process_id`)
- `idx_org_unit_process_mapping_unit` [INDEX] · (`org_unit_template_id`)
- `org_unit_process_mapping_org_unit_template_id_process_id_key` [UNIQUE] · (`org_unit_template_id`, `process_id`)
- `org_unit_process_mapping_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = org_unit_process_mapping.process_id) AND (t.id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = org_unit_process_mapping.process_id) AND (t.id = current_tenant_id()))))`

---

### `org_unit_tasks`

- **Tenant scoped**: no
- **Row estimate**: 100
- **Domains**: OPOURSKA
- **Prisma model**: `org_unit_tasks`

#### Columns

| #   | Column                 | Type         | Null | Default              | Notes                                                             |
| --- | ---------------------- | ------------ | ---- | -------------------- | ----------------------------------------------------------------- |
| 1   | `id`                   | uuid         | NO   | `uuid_generate_v4()` | PK                                                                |
| 2   | `org_unit_template_id` | uuid         | NO   | —                    |                                                                   |
| 3   | `task_code`            | varchar(20)  | NO   | —                    |                                                                   |
| 4   | `task_name`            | varchar(200) | NO   | —                    |                                                                   |
| 5   | `task_description`     | text         | YES  | —                    |                                                                   |
| 6   | `frequency`            | varchar(50)  | NO   | —                    |                                                                   |
| 7   | `complexity_level`     | int4(32)     | NO   | —                    | 1: simple, 2: routine, 3: moderate, 4: complex, 5: highly complex |
| 8   | `estimated_hours`      | numeric(6,2) | YES  | —                    |                                                                   |
| 9   | `requires_approval`    | bool         | YES  | `false`              |                                                                   |
| 10  | `created_at`           | timestamptz  | YES  | `now()`              |                                                                   |
| 11  | `updated_at`           | timestamptz  | YES  | `now()`              |                                                                   |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References               | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ------------------------ | --------- | --------- | ----- |
| `org_unit_template_id` | `org_unit_templates(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_org_unit_tasks_complexity` [INDEX] · (`complexity_level`)
- `idx_org_unit_tasks_frequency` [INDEX] · (`frequency`)
- `idx_org_unit_tasks_unit` [INDEX] · (`org_unit_template_id`)
- `org_unit_tasks_org_unit_template_id_task_code_key` [UNIQUE] · (`org_unit_template_id`, `task_code`)
- `org_unit_tasks_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `job_task_distribution` via (`org_unit_task_id`)

---

### `org_unit_templates`

- **Tenant scoped**: no
- **Row estimate**: 225
- **Domains**: OPOURSKA
- **Prisma model**: `org_unit_templates`

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `template_id`      | uuid         | NO   | —                   |       |
| 3   | `parent_id`        | uuid         | YES  | —                   |       |
| 4   | `path`             | ltree        | YES  | —                   |       |
| 5   | `depth`            | int4(32)     | NO   | `0`                 |       |
| 6   | `sort_order`       | int4(32)     | YES  | `0`                 |       |
| 7   | `code`             | varchar(20)  | NO   | —                   |       |
| 8   | `cost_center`      | varchar(10)  | YES  | —                   |       |
| 9   | `name_it`          | varchar(255) | NO   | —                   |       |
| 10  | `name_en`          | varchar(255) | YES  | —                   |       |
| 11  | `short_name`       | varchar(50)  | YES  | —                   |       |
| 12  | `area_code`        | varchar(10)  | YES  | —                   |       |
| 13  | `level`            | int4(32)     | YES  | —                   |       |
| 14  | `level_name`       | varchar(50)  | YES  | —                   |       |
| 15  | `nature`           | varchar(20)  | YES  | —                   |       |
| 16  | `is_line`          | bool         | YES  | `true`              |       |
| 17  | `is_management`    | bool         | YES  | `false`             |       |
| 18  | `headcount_min`    | int4(32)     | YES  | —                   |       |
| 19  | `headcount_max`    | int4(32)     | YES  | —                   |       |
| 20  | `typical_span`     | int4(32)     | YES  | —                   |       |
| 21  | `description`      | text         | YES  | —                   |       |
| 22  | `responsibilities` | \_text       | YES  | —                   |       |
| 23  | `created_at`       | timestamptz  | YES  | `now()`             |       |
| 24  | `updated_at`       | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_org_units_area` [INDEX] · (`area_code`)
- `idx_org_units_level` [INDEX] · (`level`)
- `idx_org_units_parent` [INDEX] · (`parent_id`)
- `idx_org_units_path` [INDEX] · (`path`)
- `idx_org_units_template` [INDEX] · (`template_id`)
- `org_unit_templates_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `org_unit_kpis` via (`org_unit_template_id`)
- `org_unit_process_mapping` via (`org_unit_template_id`)
- `org_unit_tasks` via (`org_unit_template_id`)

---

### `org_units`

- **Tenant scoped**: yes
- **Row estimate**: 76
- **Domains**: OPOURSKA
- **Prisma model**: `org_units`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                   | Notes                                                                               |
| --- | ------------------------ | ------------ | ---- | ------------------------- | ----------------------------------------------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`       | PK                                                                                  |
| 2   | `tenant_id`              | uuid         | NO   | —                         |                                                                                     |
| 3   | `code`                   | varchar(30)  | NO   | —                         |                                                                                     |
| 4   | `name`                   | varchar(150) | NO   | —                         |                                                                                     |
| 5   | `name_en`                | varchar(150) | YES  | —                         |                                                                                     |
| 6   | `parent_id`              | uuid         | YES  | —                         |                                                                                     |
| 7   | `org_level`              | int4(32)     | NO   | `1`                       | Hierarchy level: 1=Company, 2=Division, 3=Direction, 4=Department, 5=Office, 6=Team |
| 8   | `org_type`               | varchar(30)  | YES  | —                         | Type: company, division, direction, department, office, unit, team, group           |
| 9   | `legacy_department_id`   | uuid         | YES  | —                         |                                                                                     |
| 10  | `default_location_id`    | uuid         | YES  | —                         |                                                                                     |
| 11  | `manager_id`             | uuid         | YES  | —                         |                                                                                     |
| 12  | `deputy_manager_id`      | uuid         | YES  | —                         |                                                                                     |
| 13  | `headcount_budget`       | int4(32)     | YES  | —                         |                                                                                     |
| 14  | `is_active`              | bool         | YES  | `true`                    |                                                                                     |
| 15  | `valid_from`             | date         | YES  | `CURRENT_DATE`            |                                                                                     |
| 16  | `valid_to`               | date         | YES  | —                         |                                                                                     |
| 17  | `sort_order`             | int4(32)     | YES  | `0`                       |                                                                                     |
| 18  | `created_at`             | timestamptz  | YES  | `now()`                   |                                                                                     |
| 19  | `updated_at`             | timestamptz  | YES  | `now()`                   |                                                                                     |
| 20  | `sap_objid`              | varchar(20)  | YES  | —                         | SAP Object ID from HRP1000.objid                                                    |
| 21  | `sap_short`              | varchar(20)  | YES  | —                         | SAP Short text from HRP1000.short                                                   |
| 22  | `sap_stext`              | varchar(100) | YES  | —                         | SAP Long text from HRP1000.stext                                                    |
| 23  | `sap_istat`              | varchar(5)   | YES  | —                         | SAP Status from HRP1000.istat (1=active)                                            |
| 24  | `sap_plvar`              | varchar(5)   | YES  | `'01'::character varying` |                                                                                     |
| 25  | `sap_sync_date`          | timestamp    | YES  | —                         |                                                                                     |
| 26  | `embedding`              | vector       | YES  | —                         | Semantic embedding of org unit name and hierarchical context                        |
| 27  | `embedding_text_hash`    | varchar(64)  | YES  | —                         |                                                                                     |
| 28  | `embedding_model`        | varchar(100) | YES  | —                         |                                                                                     |
| 29  | `embedding_generated_at` | timestamptz  | YES  | —                         |                                                                                     |
| 30  | `deleted_at`             | timestamptz  | YES  | —                         |                                                                                     |
| 31  | `description`            | text         | YES  | —                         |                                                                                     |
| 32  | `color`                  | varchar(50)  | YES  | —                         |                                                                                     |
| 33  | `icon`                   | varchar(100) | YES  | —                         |                                                                                     |
| 34  | `sap_kostl`              | varchar(50)  | YES  | —                         |                                                                                     |
| 35  | `name_it`                | varchar(255) | YES  | —                         | Italian display name (Slice 2 i18n — see migration 206)                             |
| 36  | `description_it`         | text         | YES  | —                         | Italian description (Slice 2 i18n — see migration 206)                              |
| 37  | `description_en`         | text         | YES  | —                         | English description (Slice 2 i18n — see migration 206)                              |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References           | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------------- | --------- | --------- | ----- |
| `manager_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_org_units_active` [INDEX] · (`id`)
- `idx_org_units_department` [INDEX] · (`legacy_department_id`)
- `idx_org_units_embedding` [INDEX] · (`embedding`)
- `idx_org_units_manager_id` [INDEX] · (`manager_id`)
- `idx_org_units_sap_objid` [INDEX] · (`sap_objid`)
- `idx_org_units_tenant` [INDEX] · (`tenant_id`)
- `idx_org_units_tenant_code_unique` [UNIQUE] · (`tenant_id`, `code`)
- `idx_org_units_type` [INDEX] · (`org_type`)
- `org_units_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `calibration_sessions` via (`org_unit_id`)
- `contracts` via (`org_unit_id`)
- `goal_templates` via (`org_unit_id`)
- `internal_mobility_postings` via (`org_unit_id`)
- `job_analysis` via (`org_unit_id`)
- `job_postings` via (`org_unit_id`)
- `org_scenarios` via (`base_org_unit_id`)
- `skill_requirements_templates` via (`org_unit_id`)
- `workforce_plan_actions` via (`target_org_unit_id`)

---

### `performance_reviews`

- **Tenant scoped**: yes
- **Row estimate**: 292
- **Domains**: OPOURSKA · GOKMER
- **Prisma model**: `performance_reviews`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                       | Type         | Null | Default                            | Notes                                                                       |
| --- | ---------------------------- | ------------ | ---- | ---------------------------------- | --------------------------------------------------------------------------- |
| 1   | `id`                         | uuid         | NO   | `gen_random_uuid()`                | PK                                                                          |
| 2   | `tenant_id`                  | uuid         | NO   | —                                  |                                                                             |
| 3   | `employee_id`                | uuid         | YES  | —                                  |                                                                             |
| 4   | `reviewer_id`                | uuid         | YES  | —                                  |                                                                             |
| 5   | `review_period_start`        | date         | NO   | —                                  |                                                                             |
| 6   | `review_period_end`          | date         | NO   | —                                  |                                                                             |
| 7   | `review_type`                | varchar(50)  | YES  | `'annual'::character varying`      |                                                                             |
| 8   | `overall_rating`             | numeric(3,2) | YES  | —                                  |                                                                             |
| 9   | `goal_achievement_rating`    | numeric(3,2) | YES  | —                                  |                                                                             |
| 10  | `competency_rating`          | numeric(3,2) | YES  | —                                  |                                                                             |
| 11  | `potential_rating`           | varchar(20)  | YES  | —                                  |                                                                             |
| 12  | `strengths`                  | text         | YES  | —                                  |                                                                             |
| 13  | `areas_for_improvement`      | text         | YES  | —                                  |                                                                             |
| 14  | `manager_comments`           | text         | YES  | —                                  |                                                                             |
| 15  | `employee_comments`          | text         | YES  | —                                  |                                                                             |
| 16  | `status`                     | varchar(50)  | YES  | `'draft'::character varying`       |                                                                             |
| 17  | `submitted_at`               | timestamp    | YES  | —                                  |                                                                             |
| 18  | `acknowledged_at`            | timestamp    | YES  | —                                  |                                                                             |
| 19  | `created_at`                 | timestamp    | YES  | `now()`                            |                                                                             |
| 20  | `updated_at`                 | timestamp    | YES  | `now()`                            |                                                                             |
| 21  | `review_cycle_id`            | uuid         | YES  | —                                  |                                                                             |
| 22  | `competency_ratings`         | jsonb        | YES  | `'[]'::jsonb`                      | JSONB BY DESIGN: embedded competency scores, tightly coupled to the review. |
| 23  | `goal_ratings`               | jsonb        | YES  | `'[]'::jsonb`                      | JSONB BY DESIGN: embedded goal achievement scores.                          |
| 24  | `development_plan`           | text         | YES  | —                                  |                                                                             |
| 25  | `career_aspirations`         | text         | YES  | —                                  |                                                                             |
| 26  | `recommended_actions`        | jsonb        | YES  | `'[]'::jsonb`                      | JSONB BY DESIGN: free-form development recommendations.                     |
| 27  | `performance_box`            | int4(32)     | YES  | —                                  |                                                                             |
| 28  | `potential_box`              | int4(32)     | YES  | —                                  |                                                                             |
| 29  | `pre_calibration_rating`     | numeric(3,1) | YES  | —                                  |                                                                             |
| 30  | `calibration_notes`          | text         | YES  | —                                  |                                                                             |
| 31  | `self_review_completed_at`   | timestamptz  | YES  | —                                  |                                                                             |
| 32  | `calibrated_at`              | timestamptz  | YES  | —                                  |                                                                             |
| 33  | `shared_at`                  | timestamptz  | YES  | —                                  |                                                                             |
| 34  | `content_embedding`          | vector       | YES  | —                                  | Semantic embedding of review narrative (strengths, improvements, comments)  |
| 35  | `embedding_text_hash`        | varchar(64)  | YES  | —                                  |                                                                             |
| 36  | `embedding_model`            | varchar(100) | YES  | —                                  |                                                                             |
| 37  | `embedding_generated_at`     | timestamptz  | YES  | —                                  |                                                                             |
| 38  | `template_id`                | uuid         | YES  | —                                  |                                                                             |
| 39  | `self_rating`                | numeric(3,2) | YES  | —                                  |                                                                             |
| 40  | `self_comments`              | text         | YES  | —                                  |                                                                             |
| 41  | `self_submitted_at`          | timestamptz  | YES  | —                                  |                                                                             |
| 42  | `manager_submitted_at`       | timestamptz  | YES  | —                                  |                                                                             |
| 43  | `calibrated_rating`          | numeric(3,2) | YES  | —                                  |                                                                             |
| 44  | `calibrated_by`              | uuid         | YES  | —                                  |                                                                             |
| 45  | `finalized_at`               | timestamptz  | YES  | —                                  |                                                                             |
| 46  | `finalized_by`               | uuid         | YES  | —                                  |                                                                             |
| 47  | `section_ratings`            | jsonb        | YES  | —                                  | JSONB BY DESIGN: per-section rating breakdown.                              |
| 48  | `self_assessment_status`     | varchar(20)  | YES  | `'not_started'::character varying` |                                                                             |
| 49  | `self_assessment_started_at` | timestamptz  | YES  | —                                  |                                                                             |
| 50  | `goals_auto_populated`       | bool         | YES  | `false`                            |                                                                             |
| 51  | `goals_count`                | int4(32)     | YES  | `0`                                |                                                                             |
| 52  | `competencies_count`         | int4(32)     | YES  | `0`                                |                                                                             |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References                         | ON UPDATE | ON DELETE | Notes |
| ----------------- | ---------------------------------- | --------- | --------- | ----- |
| `employee_id`     | `employees_core(id)`               | NO ACTION | CASCADE   |       |
| `reviewer_id`     | `employees_core(id)`               | NO ACTION | SET NULL  |       |
| `calibrated_by`   | `employees_core(id)`               | NO ACTION | SET NULL  |       |
| `finalized_by`    | `employees_core(id)`               | NO ACTION | SET NULL  |       |
| `review_cycle_id` | `review_cycles(id)`                | NO ACTION | SET NULL  |       |
| `template_id`     | `performance_review_templates(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`       | `tenants(id)`                      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_performance_reviews_calibrated_by` [INDEX] · (`calibrated_by`)
- `idx_performance_reviews_cycle` [INDEX] · (`review_cycle_id`)
- `idx_performance_reviews_embedding` [INDEX] · (`content_embedding`)
- `idx_performance_reviews_employee` [INDEX] · (`tenant_id`, `employee_id`)
- `idx_performance_reviews_finalized_by` [INDEX] · (`finalized_by`)
- `idx_performance_reviews_period` [INDEX] · (`review_period_start`, `review_period_end`)
- `idx_performance_reviews_reviewer` [INDEX] · (`reviewer_id`)
- `idx_performance_reviews_status` [INDEX] · (`tenant_id`, `status`)
- `idx_performance_reviews_template` [INDEX] · (`template_id`)
- `idx_performance_reviews_tenant` [INDEX] · (`tenant_id`)
- `idx_reviews_employee` [INDEX] · (`employee_id`)
- `idx_reviews_tenant_cycle` [INDEX] · (`tenant_id`, `review_cycle_id`)
- `performance_reviews_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `calibration_results` via (`performance_review_id`)
- `competency_review_ratings` via (`performance_review_id`)
- `continuous_feedback` via (`performance_review_id`)
- `feedback_360` via (`performance_review_id`)
- `feedback_requests` via (`performance_review_id`)
- `goal_review_ratings` via (`performance_review_id`)
- `performance_skill_links` via (`performance_review_id`)
- `self_assessment_evidence` via (`performance_review_id`)
- `self_reviews` via (`performance_review_id`)

---

### `rbp_roles`

- **Tenant scoped**: no
- **Row estimate**: 8
- **Domains**: OPOURSKA · RBP
- **Prisma model**: `rbp_roles`

#### Columns

| #   | Column                   | Type         | Null | Default                                 | Notes |
| --- | ------------------------ | ------------ | ---- | --------------------------------------- | ----- |
| 1   | `id`                     | int4(32)     | NO   | `nextval('rbp_roles_id_seq'::regclass)` | PK    |
| 2   | `code`                   | varchar(50)  | NO   | —                                       |       |
| 3   | `name`                   | varchar(100) | NO   | —                                       |       |
| 4   | `description`            | text         | YES  | —                                       |       |
| 5   | `hierarchy_level`        | int4(32)     | NO   | —                                       |       |
| 6   | `is_system_role`         | bool         | NO   | `true`                                  |       |
| 7   | `is_assignable`          | bool         | NO   | `true`                                  |       |
| 8   | `inherits_from`          | varchar(50)  | YES  | —                                       |       |
| 9   | `metadata`               | jsonb        | YES  | `'{}'::jsonb`                           |       |
| 10  | `created_at`             | timestamptz  | NO   | `now()`                                 |       |
| 11  | `updated_at`             | timestamptz  | NO   | `now()`                                 |       |
| 12  | `default_dashboard_code` | varchar(50)  | YES  | —                                       |       |
| 13  | `description_it`         | text         | YES  | —                                       |       |
| 14  | `description_en`         | text         | YES  | —                                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References             | ON UPDATE | ON DELETE | Notes |
| ------------------------ | ---------------------- | --------- | --------- | ----- |
| `default_dashboard_code` | `rbp_dashboards(code)` | NO ACTION | RESTRICT  |       |
| `inherits_from`          | `rbp_roles(code)`      | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_rbp_roles_default_dashboard_code` [INDEX] · (`default_dashboard_code`)
- `idx_rbp_roles_inherits_from` [INDEX] · (`inherits_from`)
- `rbp_roles_code_key` [UNIQUE] · (`code`)
- `rbp_roles_hierarchy_level_unique` [UNIQUE] · (`hierarchy_level`)
- `rbp_roles_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `rbp_field_policies` via (`role_id`)
- `rbp_role_dashboards` via (`role_id`)
- `rbp_role_permissions` via (`role_id`)
- `rbp_roles` via (`inherits_from`)
- `rbp_scope_rules` via (`role_id`)
- `users` via (`role`)
- `workspace_templates` via (`target_role_id`)

---

### `role_default_dashboards`

> S35.0 (audit issue #5 closure): role_default_dashboards Prisma model. Maps RBP role to default dashboard_presets.code per tenant (NULL = platform default · non-NULL = tenant override P10). DB has partial unique indexes (uniq_role_default_platform WHERE tenant_id IS NULL, uniq_role_default_tenant WHERE tenant_id IS NOT NULL) — Prisma 5 does not model partial uniques; constraints remain DB-enforced.

- **Tenant scoped**: yes
- **Row estimate**: 8
- **Domains**: OPOURSKA · RBP
- **Prisma model**: `role_default_dashboards`
- **RLS**: enabled

#### Columns

| #   | Column        | Type        | Null | Default             | Notes |
| --- | ------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`          | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `role`        | text        | NO   | —                   |       |
| 3   | `preset_code` | text        | NO   | —                   |       |
| 4   | `tenant_id`   | uuid        | YES  | —                   |       |
| 5   | `priority`    | int4(32)    | NO   | `0`                 |       |
| 6   | `created_at`  | timestamptz | NO   | `now()`             |       |
| 7   | `updated_at`  | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References                | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------- | --------- | --------- | ----- |
| `preset_code` | `dashboard_presets(code)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `role_default_dashboards_pkey` [PRIMARY] · (`id`)
- `uniq_role_default_platform` [UNIQUE] · (`role`, `preset_code`)
- `uniq_role_default_tenant` [UNIQUE] · (`role`, `preset_code`, `tenant_id`)

#### RLS Policies

- **rdd_admin_write** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(current_setting('app.current_role'::text, true) = ANY (ARRAY['SUPERUSER'::text, 'TENANT_OWNER'::text, 'IT_ADMIN'::text]))`
- **rdd_select** (SELECT · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR ((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)))`

---

### `tenant_custom_skills`

- **Tenant scoped**: yes
- **Row estimate**: 25
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_custom_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `code`                   | varchar(100) | NO   | —                   |       |
| 4   | `name_en`                | varchar(255) | NO   | —                   |       |
| 5   | `name_it`                | varchar(255) | YES  | —                   |       |
| 6   | `skill_type`             | varchar(50)  | NO   | —                   |       |
| 7   | `description_en`         | text         | YES  | —                   |       |
| 8   | `description_it`         | text         | YES  | —                   |       |
| 9   | `base_esco_skill_id`     | uuid         | YES  | —                   |       |
| 10  | `category_id`            | uuid         | YES  | —                   |       |
| 11  | `embedding_en`           | vector       | YES  | —                   |       |
| 12  | `embedding_it`           | vector       | YES  | —                   |       |
| 13  | `embedding_model`        | varchar(100) | YES  | —                   |       |
| 14  | `embedding_generated_at` | timestamptz  | YES  | —                   |       |
| 15  | `version`                | int4(32)     | YES  | `1`                 |       |
| 16  | `is_active`              | bool         | YES  | `true`              |       |
| 17  | `superseded_by`          | uuid         | YES  | —                   |       |
| 18  | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 19  | `updated_at`             | timestamptz  | YES  | `now()`             |       |
| 20  | `created_by`             | uuid         | YES  | —                   |       |
| 21  | `updated_by`             | uuid         | YES  | —                   |       |
| 22  | `deleted_at`             | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References                 | ON UPDATE | ON DELETE | Notes |
| -------------------- | -------------------------- | --------- | --------- | ----- |
| `base_esco_skill_id` | `esco_skills(id)`          | NO ACTION | RESTRICT  |       |
| `category_id`        | `ontology_categories(id)`  | NO ACTION | CASCADE   |       |
| `superseded_by`      | `tenant_custom_skills(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`          | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_custom_skills_active` [INDEX] · (`id`)
- `idx_tenant_custom_skills_superseded_by` [INDEX] · (`superseded_by`)
- `idx_tenant_skills_active` [INDEX] · (`is_active`)
- `idx_tenant_skills_base` [INDEX] · (`base_esco_skill_id`)
- `idx_tenant_skills_category` [INDEX] · (`category_id`)
- `idx_tenant_skills_embedding_en` [INDEX] · (`embedding_en`)
- `idx_tenant_skills_embedding_it` [INDEX] · (`embedding_it`)
- `idx_tenant_skills_tenant` [INDEX] · (`tenant_id`)
- `tenant_custom_skills_pkey` [PRIMARY] · (`id`)
- `tenant_skills_code_unique` [UNIQUE] · (`tenant_id`, `code`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `job_template_skills` via (`custom_skill_id`)
- `tenant_custom_skills` via (`superseded_by`)
- `tenant_skill_dimensions` via (`tenant_skill_id`)

---

### `tenant_job_kpis`

- **Tenant scoped**: no
- **Row estimate**: 80
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_job_kpis`

#### Columns

| #   | Column             | Type          | Null | Default             | Notes |
| --- | ------------------ | ------------- | ---- | ------------------- | ----- |
| 1   | `id`               | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_job_id`    | uuid          | NO   | —                   |       |
| 3   | `source_kpi_id`    | uuid          | YES  | —                   |       |
| 4   | `kpi_code`         | varchar(20)   | NO   | —                   |       |
| 5   | `name_it`          | varchar(255)  | NO   | —                   |       |
| 6   | `name_en`          | varchar(255)  | YES  | —                   |       |
| 7   | `description`      | text          | YES  | —                   |       |
| 8   | `measurement_type` | varchar(20)   | YES  | —                   |       |
| 9   | `unit`             | varchar(20)   | YES  | —                   |       |
| 10  | `target_value`     | numeric(12,2) | YES  | —                   |       |
| 11  | `min_acceptable`   | numeric(12,2) | YES  | —                   |       |
| 12  | `stretch_target`   | numeric(12,2) | YES  | —                   |       |
| 13  | `kpi_category`     | varchar(50)   | YES  | —                   |       |
| 14  | `frequency`        | varchar(20)   | YES  | —                   |       |
| 15  | `weight`           | numeric(5,2)  | YES  | —                   |       |
| 16  | `is_custom`        | bool          | YES  | `false`             |       |
| 17  | `created_at`       | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `tenant_job_id` | `tenant_jobs(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_kpis_category` [INDEX] · (`kpi_category`)
- `idx_tenant_kpis_job` [INDEX] · (`tenant_job_id`)
- `idx_tenant_kpis_source` [INDEX] · (`source_kpi_id`)
- `tenant_job_kpis_pkey` [PRIMARY] · (`id`)
- `uq_tenant_kpi_per_job` [UNIQUE] · (`tenant_job_id`, `kpi_code`)

#### Inverse relations (referenced by)

- `employee_kpi_targets` via (`tenant_job_kpi_id`)

---

### `tenant_job_skills`

- **Tenant scoped**: no
- **Row estimate**: 160
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_job_skills`

#### Columns

| #   | Column            | Type         | Null | Default             | Notes |
| --- | ----------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_job_id`   | uuid         | NO   | —                   |       |
| 3   | `source_skill_id` | uuid         | YES  | —                   |       |
| 4   | `skill_name_it`   | varchar(255) | NO   | —                   |       |
| 5   | `skill_name_en`   | varchar(255) | YES  | —                   |       |
| 6   | `esco_skill_uri`  | varchar(255) | YES  | —                   |       |
| 7   | `esco_skill_code` | varchar(50)  | YES  | —                   |       |
| 8   | `required_level`  | int4(32)     | YES  | —                   |       |
| 9   | `is_required`     | bool         | YES  | `true`              |       |
| 10  | `importance`      | varchar(20)  | YES  | —                   |       |
| 11  | `skill_category`  | varchar(50)  | YES  | —                   |       |
| 12  | `is_custom`       | bool         | YES  | `false`             |       |
| 13  | `created_at`      | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `tenant_job_id` | `tenant_jobs(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_skills_esco` [INDEX] · (`esco_skill_uri`)
- `idx_tenant_skills_job` [INDEX] · (`tenant_job_id`)
- `idx_tenant_skills_source` [INDEX] · (`source_skill_id`)
- `tenant_job_skills_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `employee_skill_assessments` via (`tenant_job_skill_id`)

---

### `tenant_job_tasks`

- **Tenant scoped**: no
- **Row estimate**: 100
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_job_tasks`

#### Columns

| #   | Column                    | Type        | Null | Default             | Notes |
| --- | ------------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_job_id`           | uuid        | NO   | —                   |       |
| 3   | `source_task_id`          | uuid        | YES  | —                   |       |
| 4   | `task_order`              | int4(32)    | NO   | —                   |       |
| 5   | `description_it`          | text        | NO   | —                   |       |
| 6   | `description_en`          | text        | YES  | —                   |       |
| 7   | `frequency`               | varchar(20) | YES  | —                   |       |
| 8   | `importance`              | varchar(20) | YES  | —                   |       |
| 9   | `time_allocation_percent` | int4(32)    | YES  | —                   |       |
| 10  | `is_custom`               | bool        | YES  | `false`             |       |
| 11  | `created_at`              | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `tenant_job_id` | `tenant_jobs(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_tasks_job` [INDEX] · (`tenant_job_id`)
- `idx_tenant_tasks_source` [INDEX] · (`source_task_id`)
- `tenant_job_tasks_pkey` [PRIMARY] · (`id`)

---

### `tenant_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type          | Null | Default                          | Notes |
| --- | ---------------------- | ------------- | ---- | -------------------------------- | ----- |
| 1   | `id`                   | uuid          | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`            | uuid          | NO   | —                                |       |
| 3   | `source_template_id`   | uuid          | YES  | —                                |       |
| 4   | `tenant_org_unit_id`   | uuid          | YES  | —                                |       |
| 5   | `job_code`             | varchar(20)   | NO   | —                                |       |
| 6   | `title_it`             | varchar(255)  | NO   | —                                |       |
| 7   | `title_en`             | varchar(255)  | YES  | —                                |       |
| 8   | `description`          | text          | YES  | —                                |       |
| 9   | `summary`              | text          | YES  | —                                |       |
| 10  | `org_level`            | int4(32)      | YES  | —                                |       |
| 11  | `is_management`        | bool          | YES  | `false`                          |       |
| 12  | `employment_type`      | varchar(20)   | YES  | `'full_time'::character varying` |       |
| 13  | `esco_occupation_uri`  | varchar(255)  | YES  | —                                |       |
| 14  | `esco_occupation_code` | varchar(20)   | YES  | —                                |       |
| 15  | `salary_band_code`     | varchar(20)   | YES  | —                                |       |
| 16  | `salary_min`           | numeric(12,2) | YES  | —                                |       |
| 17  | `salary_max`           | numeric(12,2) | YES  | —                                |       |
| 18  | `currency`             | varchar(3)    | YES  | `'EUR'::character varying`       |       |
| 19  | `budgeted_positions`   | int4(32)      | YES  | `1`                              |       |
| 20  | `filled_positions`     | int4(32)      | YES  | `0`                              |       |
| 21  | `custom_fields`        | jsonb         | YES  | —                                |       |
| 22  | `is_active`            | bool          | YES  | `true`                           |       |
| 23  | `created_at`           | timestamptz   | YES  | `now()`                          |       |
| 24  | `updated_at`           | timestamptz   | YES  | `now()`                          |       |
| 25  | `deleted_at`           | timestamptz   | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References             | ON UPDATE | ON DELETE | Notes |
| -------------------- | ---------------------- | --------- | --------- | ----- |
| `tenant_id`          | `tenants(id)`          | NO ACTION | CASCADE   |       |
| `tenant_org_unit_id` | `tenant_org_units(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_jobs_active` [INDEX] · (`is_active`)
- `idx_tenant_jobs_esco` [INDEX] · (`esco_occupation_code`)
- `idx_tenant_jobs_level` [INDEX] · (`org_level`)
- `idx_tenant_jobs_not_deleted` [INDEX] · (`id`)
- `idx_tenant_jobs_source` [INDEX] · (`source_template_id`)
- `idx_tenant_jobs_tenant` [INDEX] · (`tenant_id`)
- `idx_tenant_jobs_unit` [INDEX] · (`tenant_org_unit_id`)
- `tenant_jobs_pkey` [PRIMARY] · (`id`)
- `uq_job_code_per_tenant` [UNIQUE] · (`tenant_id`, `job_code`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `career_path_levels` via (`target_job_id`)
- `career_simulations` via (`target_job_id`)
- `employee_job_assignments` via (`tenant_job_id`)
- `tenant_job_kpis` via (`tenant_job_id`)
- `tenant_job_skills` via (`tenant_job_id`)
- `tenant_job_tasks` via (`tenant_job_id`)

---

### `tenant_onboarding_profiles`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_onboarding_profiles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                         | Type        | Null | Default                    | Notes |
| --- | ------------------------------ | ----------- | ---- | -------------------------- | ----- |
| 1   | `id`                           | uuid        | NO   | `uuid_generate_v4()`       | PK    |
| 2   | `tenant_id`                    | uuid        | NO   | —                          |       |
| 3   | `nace_occupations_snapshot`    | jsonb       | YES  | —                          |       |
| 4   | `size_modifiers`               | jsonb       | YES  | —                          |       |
| 5   | `prototype_config`             | jsonb       | YES  | —                          |       |
| 6   | `departments_generated`        | int4(32)    | YES  | `0`                        |       |
| 7   | `positions_generated`          | int4(32)    | YES  | `0`                        |       |
| 8   | `skill_requirements_generated` | int4(32)    | YES  | `0`                        |       |
| 9   | `generated_at`                 | timestamptz | YES  | `now()`                    |       |
| 10  | `generator_version`            | varchar(20) | YES  | `'1.0'::character varying` |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_onboarding_profiles_tenant` [INDEX] · (`tenant_id`)
- `tenant_onboarding_profiles_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_tenant_onboarding_profiles** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `tenant_org_charts`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_org_charts`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                      | Notes |
| --- | -------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                            |       |
| 3   | `source_template_id` | uuid         | YES  | —                            |       |
| 4   | `name`               | varchar(255) | NO   | —                            |       |
| 5   | `description`        | text         | YES  | —                            |       |
| 6   | `version`            | varchar(20)  | YES  | `'1.0.0'::character varying` |       |
| 7   | `status`             | varchar(20)  | YES  | `'draft'::character varying` |       |
| 8   | `effective_date`     | date         | YES  | —                            |       |
| 9   | `is_active`          | bool         | YES  | `true`                       |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()`                      |       |
| 11  | `updated_at`         | timestamptz  | YES  | `now()`                      |       |
| 12  | `deleted_at`         | timestamptz  | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_charts_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_tenant_charts_active_per_tenant` [UNIQUE] · (`tenant_id`)
- `idx_tenant_charts_source` [INDEX] · (`source_template_id`)
- `idx_tenant_org_charts_active` [INDEX] · (`id`)
- `tenant_org_charts_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `tenant_org_units` via (`chart_id`)

---

### `tenant_org_units`

- **Tenant scoped**: no
- **Row estimate**: 47
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_org_units`

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `chart_id`            | uuid         | NO   | —                   |       |
| 3   | `source_unit_id`      | uuid         | YES  | —                   |       |
| 4   | `parent_id`           | uuid         | YES  | —                   |       |
| 5   | `path`                | ltree        | YES  | —                   |       |
| 6   | `depth`               | int4(32)     | NO   | `0`                 |       |
| 7   | `sort_order`          | int4(32)     | YES  | `0`                 |       |
| 8   | `code`                | varchar(20)  | NO   | —                   |       |
| 9   | `cost_center`         | varchar(10)  | YES  | —                   |       |
| 10  | `name_it`             | varchar(255) | NO   | —                   |       |
| 11  | `name_en`             | varchar(255) | YES  | —                   |       |
| 12  | `short_name`          | varchar(50)  | YES  | —                   |       |
| 13  | `area_code`           | varchar(10)  | YES  | —                   |       |
| 14  | `level`               | int4(32)     | YES  | —                   |       |
| 15  | `is_line`             | bool         | YES  | `true`              |       |
| 16  | `is_management`       | bool         | YES  | `false`             |       |
| 17  | `headcount_budget`    | int4(32)     | YES  | —                   |       |
| 18  | `headcount_actual`    | int4(32)     | YES  | `0`                 |       |
| 19  | `custom_fields`       | jsonb        | YES  | —                   |       |
| 20  | `manager_employee_id` | uuid         | YES  | —                   |       |
| 21  | `is_active`           | bool         | YES  | `true`              |       |
| 22  | `created_at`          | timestamptz  | YES  | `now()`             |       |
| 23  | `updated_at`          | timestamptz  | YES  | `now()`             |       |
| 24  | `deleted_at`          | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References              | ON UPDATE | ON DELETE | Notes |
| ----------- | ----------------------- | --------- | --------- | ----- |
| `chart_id`  | `tenant_org_charts(id)` | NO ACTION | CASCADE   |       |
| `parent_id` | `tenant_org_units(id)`  | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_org_units_active` [INDEX] · (`id`)
- `idx_tenant_units_area` [INDEX] · (`area_code`)
- `idx_tenant_units_chart` [INDEX] · (`chart_id`)
- `idx_tenant_units_level` [INDEX] · (`level`)
- `idx_tenant_units_manager` [INDEX] · (`manager_employee_id`)
- `idx_tenant_units_parent` [INDEX] · (`parent_id`)
- `idx_tenant_units_path` [INDEX] · (`path`)
- `tenant_org_units_pkey` [PRIMARY] · (`id`)
- `uq_unit_code_per_chart` [UNIQUE] · (`chart_id`, `code`)

#### Inverse relations (referenced by)

- `tenant_jobs` via (`tenant_org_unit_id`)
- `tenant_org_units` via (`parent_id`)

---

### `tenant_regulatory_compliance`

> S35.3 M7 (PROGOV phase18e): tenant ↔ regulatory framework applicability + compliance status + certification cycle.

- **Tenant scoped**: yes
- **Row estimate**: -1
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_regulatory_compliance`
- **RLS**: enabled

#### Columns

| #   | Column               | Type        | Null | Default                         | Notes |
| --- | -------------------- | ----------- | ---- | ------------------------------- | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`          | uuid        | NO   | —                               |       |
| 3   | `framework_code`     | varchar(64) | NO   | —                               |       |
| 4   | `compliance_status`  | varchar(32) | NO   | `'in_scope'::character varying` |       |
| 5   | `applicable_from`    | date        | NO   | `CURRENT_DATE`                  |       |
| 6   | `certification_date` | date        | YES  | —                               |       |
| 7   | `next_review_date`   | date        | YES  | —                               |       |
| 8   | `responsible_role`   | varchar(64) | YES  | —                               |       |
| 9   | `notes`              | text        | YES  | —                               |       |
| 10  | `created_at`         | timestamptz | NO   | `now()`                         |       |
| 11  | `updated_at`         | timestamptz | NO   | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References                    | ON UPDATE | ON DELETE | Notes |
| ---------------- | ----------------------------- | --------- | --------- | ----- |
| `framework_code` | `regulatory_frameworks(code)` | NO ACTION | RESTRICT  |       |
| `tenant_id`      | `tenants(id)`                 | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_regulatory_compliance_status` [INDEX] · (`compliance_status`)
- `idx_tenant_regulatory_compliance_tenant` [INDEX] · (`tenant_id`)
- `tenant_regulatory_compliance_pkey` [PRIMARY] · (`id`)
- `tenant_regulatory_compliance_tenant_id_framework_code_key` [UNIQUE] · (`tenant_id`, `framework_code`)

#### RLS Policies

- **tenant_regulatory_compliance_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)`

---

### `tenant_retirement_rules`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_retirement_rules`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                                | Type         | Null | Default                   | Notes |
| --- | ------------------------------------- | ------------ | ---- | ------------------------- | ----- |
| 1   | `id`                                  | uuid         | NO   | `uuid_generate_v4()`      | PK    |
| 2   | `tenant_id`                           | uuid         | NO   | —                         |       |
| 3   | `country_code`                        | varchar(3)   | NO   | `'IT'::character varying` |       |
| 4   | `old_age_retirement_years`            | int4(32)     | NO   | `67`                      |       |
| 5   | `old_age_min_contribution_years`      | int4(32)     | NO   | `20`                      |       |
| 6   | `early_retirement_contribution_years` | numeric(5,2) | NO   | `42.83`                   |       |
| 7   | `effective_from`                      | date         | NO   | `CURRENT_DATE`            |       |
| 8   | `notes`                               | text         | YES  | —                         |       |
| 9   | `created_at`                          | timestamptz  | YES  | `now()`                   |       |
| 10  | `updated_at`                          | timestamptz  | YES  | `now()`                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_retirement_rules_tenant` [INDEX] · (`tenant_id`, `effective_from`)
- `tenant_retirement_rules_pkey` [PRIMARY] · (`id`)
- `tenant_retirement_rules_tenant_id_country_code_effective_fr_key` [UNIQUE] · (`tenant_id`, `country_code`, `effective_from`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `tenant_revenue_periods`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: OPOURSKA
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type          | Null | Default             | Notes |
| --- | ---------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`             | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`      | uuid          | NO   | —                   |       |
| 3   | `period_start`   | date          | NO   | —                   |       |
| 4   | `period_end`     | date          | NO   | —                   |       |
| 5   | `currency`       | bpchar(3)     | NO   | `'EUR'::bpchar`     |       |
| 6   | `revenue_amount` | numeric(18,2) | NO   | —                   |       |
| 7   | `source`         | text          | YES  | —                   |       |
| 8   | `created_at`     | timestamptz   | YES  | `now()`             |       |
| 9   | `updated_at`     | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_revenue_periods_tenant_period` [INDEX] · (`tenant_id`, `period_end`)
- `tenant_revenue_period_unique` [UNIQUE] · (`tenant_id`, `period_start`, `period_end`)
- `tenant_revenue_periods_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `tenant_sap_mapping`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: OPOURSKA · DGOV
- **Prisma model**: `tenant_sap_mapping`

#### Columns

| #   | Column        | Type        | Null | Default                                          | Notes |
| --- | ------------- | ----------- | ---- | ------------------------------------------------ | ----- |
| 1   | `id`          | int4(32)    | NO   | `nextval('tenant_sap_mapping_id_seq'::regclass)` | PK    |
| 2   | `tenant_uuid` | uuid        | NO   | —                                                |       |
| 3   | `tenant_name` | varchar(50) | NO   | —                                                |       |
| 4   | `sap_bukrs`   | varchar(4)  | NO   | —                                                |       |
| 5   | `emp_prefix`  | varchar(20) | NO   | —                                                |       |
| 6   | `is_active`   | bool        | YES  | `true`                                           |       |
| 7   | `created_at`  | timestamp   | YES  | `now()`                                          |       |
| 8   | `deleted_at`  | timestamptz | YES  | —                                                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_tenant_sap_mapping_active` [INDEX] · (`id`)
- `tenant_sap_mapping_pkey` [PRIMARY] · (`id`)
- `tenant_sap_mapping_sap_bukrs_key` [UNIQUE] · (`sap_bukrs`)
- `tenant_sap_mapping_tenant_uuid_key` [UNIQUE] · (`tenant_uuid`)

---

### `tenant_schema_version`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: OPOURSKA · DGOV
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default             | Notes |
| --- | ------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`  | uuid        | NO   | —                   |       |
| 3   | `version`    | int4(32)    | NO   | —                   |       |
| 4   | `applied_at` | timestamptz | NO   | `now()`             |       |
| 5   | `applied_by` | uuid        | YES  | —                   |       |
| 6   | `notes`      | text        | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `applied_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_schema_version_applied_by` [INDEX] · (`applied_by`)
- `idx_tenant_schema_version_tenant` [INDEX] · (`tenant_id`, `version`)
- `tenant_schema_version_pkey` [PRIMARY] · (`id`)
- `tenant_schema_version_tenant_id_version_key` [UNIQUE] · (`tenant_id`, `version`)

#### RLS Policies

- **tenant_isolation_tenant_schema_version** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `tenant_skill_dimensions`

- **Tenant scoped**: no
- **Row estimate**: 75
- **Domains**: OPOURSKA
- **Prisma model**: `tenant_skill_dimensions`

#### Columns

| #   | Column            | Type        | Null | Default                                | Notes |
| --- | ----------------- | ----------- | ---- | -------------------------------------- | ----- |
| 1   | `id`              | uuid        | NO   | `gen_random_uuid()`                    | PK    |
| 2   | `tenant_skill_id` | uuid        | NO   | —                                      |       |
| 3   | `dimension_type`  | varchar(20) | NO   | —                                      |       |
| 4   | `description_en`  | text        | YES  | —                                      |       |
| 5   | `description_it`  | text        | YES  | —                                      |       |
| 6   | `level_scale`     | varchar(50) | YES  | `'basic_to_expert'::character varying` |       |
| 7   | `min_level`       | int4(32)    | YES  | `1`                                    |       |
| 8   | `max_level`       | int4(32)    | YES  | `5`                                    |       |
| 9   | `embedding`       | vector      | YES  | —                                      |       |
| 10  | `is_primary`      | bool        | YES  | `false`                                |       |
| 11  | `created_at`      | timestamptz | YES  | `now()`                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References                 | ON UPDATE | ON DELETE | Notes |
| ----------------- | -------------------------- | --------- | --------- | ----- |
| `tenant_skill_id` | `tenant_custom_skills(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_dimensions_skill` [INDEX] · (`tenant_skill_id`)
- `tenant_dimensions_unique` [UNIQUE] · (`tenant_skill_id`, `dimension_type`)
- `tenant_skill_dimensions_pkey` [PRIMARY] · (`id`)

---

### `tenants`

- **Tenant scoped**: no
- **Row estimate**: 4
- **Domains**: OPOURSKA
- **Prisma model**: `tenants`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default                            | Notes                                                                                                                                                                                                          |
| --- | -------------------------- | ------------ | ---- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `id`                       | uuid         | NO   | `uuid_generate_v4()`               | PK                                                                                                                                                                                                             |
| 2   | `code`                     | varchar(20)  | NO   | —                                  |                                                                                                                                                                                                                |
| 3   | `name`                     | varchar(255) | NO   | —                                  |                                                                                                                                                                                                                |
| 4   | `description`              | text         | YES  | —                                  |                                                                                                                                                                                                                |
| 5   | `region`                   | varchar(100) | YES  | —                                  |                                                                                                                                                                                                                |
| 6   | `status`                   | varchar(50)  | YES  | `'configuring'::character varying` |                                                                                                                                                                                                                |
| 7   | `employee_count`           | int4(32)     | YES  | `0`                                |                                                                                                                                                                                                                |
| 8   | `subscription_plan`        | varchar(50)  | YES  | `'starter'::character varying`     |                                                                                                                                                                                                                |
| 9   | `created_at`               | timestamp    | YES  | `now()`                            |                                                                                                                                                                                                                |
| 10  | `updated_at`               | timestamp    | YES  | `now()`                            |                                                                                                                                                                                                                |
| 11  | `sap_company_code`         | varchar(4)   | YES  | —                                  |                                                                                                                                                                                                                |
| 12  | `industry_type`            | varchar(100) | YES  | —                                  |                                                                                                                                                                                                                |
| 13  | `profile_id`               | uuid         | YES  | —                                  |                                                                                                                                                                                                                |
| 14  | `annual_revenue_eur`       | int8(64)     | YES  | —                                  |                                                                                                                                                                                                                |
| 15  | `settings`                 | jsonb        | YES  | `'{}'::jsonb`                      | JSONB configuration including CCNL, fiscal year, leave rules, SSO settings                                                                                                                                     |
| 16  | `tax_id`                   | varchar(20)  | YES  | —                                  | Italian Partita IVA (VAT number)                                                                                                                                                                               |
| 17  | `contact_email`            | varchar(255) | YES  | —                                  |                                                                                                                                                                                                                |
| 18  | `contact_phone`            | varchar(50)  | YES  | —                                  |                                                                                                                                                                                                                |
| 19  | `address_street`           | varchar(255) | YES  | —                                  |                                                                                                                                                                                                                |
| 20  | `address_city`             | varchar(100) | YES  | —                                  |                                                                                                                                                                                                                |
| 21  | `address_postal_code`      | varchar(20)  | YES  | —                                  |                                                                                                                                                                                                                |
| 22  | `address_country`          | varchar(3)   | YES  | `'ITA'::character varying`         |                                                                                                                                                                                                                |
| 23  | `setup_completed`          | bool         | YES  | `false`                            | Whether the tenant has completed the setup wizard                                                                                                                                                              |
| 24  | `setup_completed_at`       | timestamp    | YES  | —                                  |                                                                                                                                                                                                                |
| 25  | `setup_step`               | int4(32)     | YES  | `0`                                | Current step in setup wizard (0=not started, 1=company info, 2=ccnl, 3=fiscal)                                                                                                                                 |
| 26  | `company_size`             | varchar(10)  | YES  | —                                  |                                                                                                                                                                                                                |
| 27  | `employee_count_range_min` | int4(32)     | YES  | —                                  |                                                                                                                                                                                                                |
| 28  | `employee_count_range_max` | int4(32)     | YES  | —                                  |                                                                                                                                                                                                                |
| 29  | `onboarding_completed_at`  | timestamptz  | YES  | —                                  |                                                                                                                                                                                                                |
| 30  | `industry_profile_id`      | uuid         | YES  | —                                  |                                                                                                                                                                                                                |
| 31  | `verified_website`         | varchar(255) | YES  | —                                  | SEE Fase 7.5 — canonical domain (lowercase, no scheme, no www) used by the enrichment source verification gate. Set during onboarding. NULL blocks all official_website source classification for this tenant. |
| 32  | `domain`                   | text         | NO   | —                                  |                                                                                                                                                                                                                |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References              | ON UPDATE | ON DELETE | Notes |
| --------------------- | ----------------------- | --------- | --------- | ----- |
| `industry_profile_id` | `industry_profiles(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_tenants_industry_profile_id` [INDEX] · (`industry_profile_id`)
- `idx_tenants_profile` [INDEX] · (`profile_id`)
- `idx_tenants_sap_company_code` [INDEX] · (`sap_company_code`)
- `idx_tenants_settings` [INDEX] · (`settings`)
- `idx_tenants_status` [INDEX] · (`status`)
- `idx_tenants_verified_website` [INDEX] · (`verified_website`)
- `tenants_code_key` [UNIQUE] · (`code`)
- `tenants_pkey` [PRIMARY] · (`id`)
- `uniq_tenants_domain` [UNIQUE] · (`domain`)

#### RLS Policies

- **tenant_lookup_when_no_context** (SELECT · PERMISSIVE) · roles: `public`
  - USING: `(current_tenant_id() IS NULL)`
- **tenant_self_access** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(id = current_tenant_id())`
  - WITH CHECK: `(id = current_tenant_id())`

#### Inverse relations (referenced by)

- `admin_component_registry` via (`tenant_id`)
- `ai_analytics_daily` via (`tenant_id`)
- `ai_escalation_queue` via (`tenant_id`)
- `ai_prompt_templates` via (`tenant_id`)
- `ai_query_audit` via (`tenant_id`)
- `ai_tenant_config` via (`tenant_id`)
- `ai_usage_log` via (`tenant_id`)
- `analysis_sessions` via (`tenant_id`)
- `analytics_aggregations` via (`tenant_id`)
- `analytics_events` via (`tenant_id`)
- `api_keys` via (`tenant_id`)
- `applications` via (`tenant_id`)
- `benchmark_configs` via (`tenant_id`)
- `benchmark_reports` via (`tenant_id`)
- `blueprint_runs` via (`tenant_id`)
- `bonus_allocations` via (`tenant_id`)
- `bonus_plans` via (`tenant_id`)
- `burnout_assessments` via (`tenant_id`)
- `calibration_adjustments` via (`tenant_id`)
- `calibration_audit_log` via (`tenant_id`)
- `calibration_discussions` via (`tenant_id`)
- `calibration_participants` via (`tenant_id`)
- `calibration_results` via (`tenant_id`)
- `calibration_sessions` via (`tenant_id`)
- `candidates` via (`tenant_id`)
- `career_conversations` via (`tenant_id`)
- `career_goal_milestones` via (`tenant_id`)
- `career_goals` via (`tenant_id`)
- `career_path_level_skills` via (`tenant_id`)
- `career_path_recommendations` via (`tenant_id`)
- `career_path_templates` via (`tenant_id`)
- `career_paths` via (`tenant_id`)
- `career_profiles` via (`tenant_id`)
- `career_recommendations` via (`tenant_id`)
- `career_simulations` via (`tenant_id`)
- `career_skills` via (`tenant_id`)
- `certifications` via (`tenant_id`)
- `check_ins` via (`tenant_id`)
- `competencies` via (`tenant_id`)
- `competency_frameworks` via (`tenant_id`)
- `competency_review_ratings` via (`tenant_id`)
- `compliance_training_requirements` via (`tenant_id`)
- `continuous_feedback` via (`tenant_id`)
- `contract_amendments` via (`tenant_id`)
- `contracts` via (`tenant_id`)
- `cost_centers` via (`tenant_id`)
- `course_enrollments` via (`tenant_id`)
- `course_enrollments_semantic` via (`tenant_id`)
- `course_modules` via (`tenant_id`)
- `courses` via (`tenant_id,tenant_id,tenant_id,tenant_id`)
- `crawl_runs` via (`tenant_id`)
- `crawler_configs` via (`tenant_id`)
- `critical_roles` via (`tenant_id`)
- `cross_entity_relations` via (`tenant_id`)
- `cross_entity_searches` via (`tenant_id`)
- `dashboard_elements` via (`tenant_id`)
- `dashboard_widgets` via (`tenant_id`)
- `dashboards` via (`tenant_id`)
- `data_subject_requests` via (`tenant_id`)
- `document_acknowledgments` via (`tenant_id`)
- `document_requests` via (`tenant_id`)
- `embedding_queue` via (`tenant_id`)
- `employee_addresses` via (`tenant_id`)
- `employee_attendance` via (`tenant_id`)
- `employee_bank_details` via (`tenant_id`)
- `employee_benefit_enrollments` via (`tenant_id`)
- `employee_benefits` via (`tenant_id`)
- `employee_career_paths` via (`tenant_id`)
- `employee_career_progress` via (`tenant_id`)
- `employee_certifications` via (`tenant_id`)
- `employee_clubs` via (`tenant_id`)
- `employee_contract_amendments` via (`tenant_id`)
- `employee_contracts` via (`tenant_id`)
- `employee_documents` via (`tenant_id`)
- `employee_emergency_contacts` via (`tenant_id`)
- `employee_job_assignments` via (`tenant_id`)
- `employee_kpi_targets` via (`tenant_id`)
- `employee_occupations` via (`tenant_id`)
- `employee_overtime` via (`tenant_id`)
- `employee_pay_stubs` via (`tenant_id`)
- `employee_permission_overrides` via (`tenant_id`)
- `employee_requests` via (`tenant_id`)
- `employee_skill_assessments` via (`tenant_id`)
- `employee_skill_history` via (`tenant_id`)
- `employee_skill_mappings` via (`tenant_id`)
- `employee_skill_profiles` via (`tenant_id`)
- `employee_skills` via (`tenant_id`)
- `employee_time_off_balances` via (`tenant_id`)
- `employee_time_off_requests` via (`tenant_id`)
- `employee_timeline` via (`tenant_id`)
- `employee_training_records` via (`tenant_id`)
- `employees_core` via (`tenant_id`)
- `employees_hr` via (`tenant_id`)
- `employees_payroll` via (`tenant_id`)
- `employees_pii` via (`tenant_id`)
- `employees_staging` via (`tenant_id`)
- `engagement_action_plans` via (`tenant_id`)
- `engagement_feedback` via (`tenant_id`)
- `engagement_pulse_configs` via (`tenant_id`)
- `engagement_survey_responses` via (`tenant_id`)
- `engagement_survey_templates` via (`tenant_id`)
- `engagement_surveys` via (`tenant_id`)
- `enrichment_candidates` via (`tenant_id`)
- `enrichment_entity_descriptors` via (`tenant_id`)
- `enrichment_extraction_schemas` via (`tenant_id`)
- `enrichment_job_events` via (`tenant_id`)
- `enrichment_jobs` via (`tenant_id`)
- `enrichment_lineage` via (`tenant_id`)
- `enrichment_matches` via (`tenant_id`)
- `enrichment_merge_policies` via (`tenant_id`)
- `enrichment_merges` via (`tenant_id`)
- `enrichment_observations` via (`tenant_id`)
- `enrichment_source_snapshots` via (`tenant_id`)
- `enrichment_sources` via (`tenant_id`)
- `enrichment_trust_rules` via (`tenant_id`)
- `enrichment_writes` via (`tenant_id`)
- `equity_grants` via (`tenant_id`)
- `error_analytics_hourly` via (`tenant_id`)
- `error_logs` via (`tenant_id`)
- `export_configurations` via (`tenant_id`)
- `export_jobs` via (`tenant_id`)
- `ext_hrp1007` via (`tenant_id`)
- `ext_pa0002` via (`tenant_id`)
- `ext_pb0002` via (`tenant_id`)
- `extracted_skills` via (`tenant_id`)
- `feedback_360` via (`tenant_id`)
- `feedback_360_peer_suggestions` via (`tenant_id`)
- `feedback_360_questionnaires` via (`tenant_id`)
- `feedback_360_questions` via (`tenant_id`)
- `feedback_categories` via (`tenant_id`)
- `feedback_requests` via (`tenant_id`)
- `feedback_responses` via (`tenant_id`)
- `goal_alignments` via (`tenant_id`)
- `goal_check_ins` via (`tenant_id`)
- `goal_comments` via (`tenant_id`)
- `goal_milestones` via (`tenant_id`)
- `goal_review_ratings` via (`tenant_id`)
- `goal_templates` via (`tenant_id`)
- `goal_updates` via (`tenant_id`)
- `goals` via (`tenant_id`)
- `holidays` via (`tenant_id`)
- `import_jobs` via (`tenant_id`)
- `import_skill_links` via (`tenant_id`)
- `integration_sync_logs` via (`tenant_id`)
- `integrations` via (`tenant_id`)
- `internal_applications` via (`tenant_id`)
- `internal_job_postings` via (`tenant_id`)
- `internal_mobility_postings` via (`tenant_id`)
- `internal_mobility_requests` via (`tenant_id`)
- `interview_feedback` via (`tenant_id`)
- `interviews` via (`tenant_id`)
- `job_analysis` via (`tenant_id`)
- `job_evaluations` via (`tenant_id`)
- `job_families` via (`tenant_id`)
- `job_postings` via (`tenant_id`)
- `job_postings_raw` via (`tenant_id`)
- `job_template_skills` via (`tenant_id`)
- `job_templates` via (`tenant_id`)
- `job_title_courses` via (`tenant_id`)
- `job_title_learning_paths` via (`tenant_id`)
- `key_results` via (`tenant_id`)
- `learning_bookmarks` via (`tenant_id`)
- `learning_content_providers` via (`tenant_id`)
- `learning_path_courses` via (`tenant_id`)
- `learning_path_enrollments` via (`tenant_id`)
- `learning_paths` via (`tenant_id,tenant_id,tenant_id,tenant_id`)
- `learning_ratings` via (`tenant_id`)
- `learning_recommendations` via (`tenant_id`)
- `leave_accrual_rules` via (`tenant_id`)
- `leave_approval_steps` via (`tenant_id`)
- `leave_balance_transactions` via (`tenant_id`)
- `locations` via (`tenant_id`)
- `market_benchmarks` via (`tenant_id`)
- `market_salary_data` via (`tenant_id`)
- `medical_certificates` via (`tenant_id`)
- `mentor_match_scores` via (`tenant_id`)
- `mentorship_programs` via (`tenant_id`)
- `mentorship_sessions` via (`tenant_id`)
- `mentorships` via (`tenant_id`)
- `merit_cycles` via (`tenant_id`)
- `merit_recommendations` via (`tenant_id`)
- `model_predictions` via (`tenant_id`)
- `module_completions` via (`tenant_id`)
- `news_articles` via (`tenant_id`)
- `news_bookmarks` via (`tenant_id`)
- `news_categories` via (`tenant_id`)
- `news_comments` via (`tenant_id`)
- `news_reactions` via (`tenant_id`)
- `news_reads` via (`tenant_id`)
- `news_tags` via (`tenant_id`)
- `notifications` via (`tenant_id`)
- `okr_check_ins` via (`tenant_id`)
- `okr_checkins` via (`tenant_id`)
- `okrs` via (`tenant_id`)
- `onboarding_instances` via (`tenant_id`)
- `onboarding_templates` via (`tenant_id`)
- `ontology_embedding_jobs` via (`tenant_id`)
- `ontology_feedback` via (`tenant_id`)
- `ontology_inference_jobs` via (`tenant_id`)
- `ontology_source_mappings` via (`tenant_id`)
- `org_chart_generation_sessions` via (`tenant_id`)
- `org_chart_snapshots` via (`tenant_id`)
- `org_scenarios` via (`tenant_id`)
- `org_units` via (`tenant_id`)
- `payroll_anomaly_patterns` via (`tenant_id`)
- `payroll_export_employees` via (`tenant_id`)
- `payroll_export_files` via (`tenant_id`)
- `payroll_export_jobs` via (`tenant_id`)
- `payroll_field_mappings` via (`tenant_id`)
- `payroll_integrations` via (`tenant_id`)
- `payroll_transmission_log` via (`tenant_id`)
- `payroll_validation_rules` via (`tenant_id`)
- `performance_predictions` via (`tenant_id`)
- `performance_review_templates` via (`tenant_id`)
- `performance_reviews` via (`tenant_id`)
- `performance_skill_links` via (`tenant_id`)
- `performance_trends` via (`tenant_id`)
- `permission_overrides` via (`tenant_id`)
- `plugin_api_keys` via (`tenant_id`)
- `plugin_configurations` via (`tenant_id`)
- `plugin_hook_executions` via (`tenant_id`)
- `plugin_installations` via (`tenant_id`)
- `plugin_reviews` via (`tenant_id`)
- `plugin_webhooks` via (`tenant_id`)
- `plugins` via (`publisher_tenant_id`)
- `position_skill_requirements` via (`tenant_id`)
- `preboarding_sessions` via (`tenant_id`)
- `preboarding_templates` via (`tenant_id`)
- `preboarding_welcome_content` via (`tenant_id`)
- `prediction_actions` via (`tenant_id`)
- `prediction_factors` via (`tenant_id`)
- `prediction_model_accuracy` via (`tenant_id`)
- `predictive_models` via (`tenant_id`)
- `pulse_checks` via (`tenant_id`)
- `rag_document_chunks` via (`tenant_id`)
- `rag_documents` via (`tenant_id`)
- `rag_knowledge_bases` via (`tenant_id`)
- `rag_provider_keys` via (`tenant_id`)
- `rag_sessions` via (`tenant_id`)
- `rag_usage_stats` via (`tenant_id`)
- `rating_scales` via (`tenant_id`)
- `rbp_field_classifications` via (`tenant_id`)
- `rbp_section_translations` via (`tenant_id`)
- `rbp_sections` via (`tenant_id`)
- `rbp_teams` via (`tenant_id`)
- `recognition` via (`tenant_id`)
- `recruiting_candidates` via (`tenant_id`)
- `recruiting_interview_templates` via (`tenant_id`)
- `recruiting_interviewer_availability` via (`tenant_id`)
- `recruiting_interviews` via (`tenant_id`)
- `recruiting_offers` via (`tenant_id`)
- `recruiting_requisitions` via (`tenant_id`)
- `report_definitions` via (`tenant_id`)
- `report_delivery_log` via (`tenant_id`)
- `report_executions` via (`tenant_id`)
- `report_schedules` via (`tenant_id`)
- `report_subscriptions` via (`tenant_id`)
- `requisitions` via (`tenant_id`)
- `review_cycle_notifications` via (`tenant_id`)
- `review_cycle_participants` via (`tenant_id`)
- `review_cycle_phases` via (`tenant_id`)
- `review_cycles` via (`tenant_id`)
- `role_default_dashboards` via (`tenant_id`)
- `role_permissions` via (`tenant_id`)
- `role_skill_requirements` via (`tenant_id`)
- `salary_band_assignments` via (`tenant_id`)
- `salary_bands` via (`tenant_id`)
- `salary_history` via (`tenant_id`)
- `sap_delta_sync_log` via (`tenant_id`)
- `sap_employee_mapping` via (`tenant_id`)
- `sap_infotype_mappings` via (`tenant_id`)
- `sap_migration_jobs` via (`tenant_id`)
- `sap_migration_rollback_log` via (`tenant_id`)
- `sap_staged_data` via (`tenant_id`)
- `saved_jobs` via (`tenant_id`)
- `self_assessment_evidence` via (`tenant_id`)
- `self_reviews` via (`tenant_id`)
- `semantic_entity_index` via (`tenant_id`)
- `semantic_entity_relations` via (`tenant_id`)
- `semantic_search_log` via (`tenant_id`)
- `signature_recipients` via (`tenant_id`)
- `signature_requests` via (`tenant_id`)
- `sindacato_tenant_links` via (`tenant_id`)
- `skill_demand_metrics` via (`tenant_id`)
- `skill_extraction_jobs` via (`tenant_id`)
- `skill_gap_analyses` via (`tenant_id`)
- `skill_gap_snapshots` via (`tenant_id`)
- `skill_matrices` via (`tenant_id`)
- `skill_migration_jobs` via (`tenant_id`)
- `skill_pair_usage` via (`tenant_id`)
- `skill_requirements_templates` via (`tenant_id`)
- `skill_supply_metrics` via (`tenant_id`)
- `skill_taxonomy_extensions` via (`tenant_id`)
- `social_posts` via (`tenant_id`)
- `sso_configurations` via (`tenant_id`)
- `succession_candidates` via (`tenant_id`)
- `succession_plans` via (`tenant_id`)
- `survey_questions` via (`tenant_id`)
- `survey_responses` via (`tenant_id`)
- `survey_templates` via (`tenant_id`)
- `surveys` via (`tenant_id`)
- `sync_log` via (`tenant_id`)
- `sync_queue` via (`tenant_id`)
- `talent_pool_members` via (`tenant_id`)
- `talent_pools` via (`tenant_id`)
- `tenant_ccnl_links` via (`tenant_id`)
- `tenant_custom_skills` via (`tenant_id`)
- `tenant_industry_classifications` via (`tenant_id`)
- `tenant_jobs` via (`tenant_id`)
- `tenant_onboarding_profiles` via (`tenant_id`)
- `tenant_org_charts` via (`tenant_id`)
- `tenant_regulatory_compliance` via (`tenant_id`)
- `tenant_retirement_rules` via (`tenant_id`)
- `tenant_revenue_periods` via (`tenant_id`)
- `tenant_schema_version` via (`tenant_id`)
- `tenants_books` via (`tenant_id`)
- `turnover_risk_scores` via (`tenant_id`)
- `unknown_skills` via (`tenant_id`)
- `user_workspaces` via (`tenant_id`)
- `webhook_deliveries` via (`tenant_id`)
- `webhooks` via (`tenant_id`)
- `wellbeing_checkins` via (`tenant_id`)
- `wellbeing_goals` via (`tenant_id`)
- `wellbeing_program_enrollments` via (`tenant_id`)
- `wellbeing_resources` via (`tenant_id`)
- `whistleblowing_attachments` via (`tenant_id`)
- `whistleblowing_audit_log` via (`tenant_id`)
- `whistleblowing_handlers` via (`tenant_id`)
- `whistleblowing_messages` via (`tenant_id`)
- `whistleblowing_reports` via (`tenant_id`)
- `whistleblowing_settings` via (`tenant_id`)
- `widget_templates` via (`tenant_id`)
- `workforce_plan_actions` via (`tenant_id`)
- `workforce_plan_scenarios` via (`tenant_id`)
- `workforce_plans` via (`tenant_id`)
- `workspace_templates` via (`tenant_id`)

---

### `tenants_books`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: OPOURSKA
- **Prisma model**: `tenants_books`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type          | Null | Default             | Notes |
| --- | ------------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`               | uuid          | NO   | —                   |       |
| 3   | `company_legal_name`      | varchar(255)  | NO   | —                   |       |
| 4   | `incorporation_date`      | date          | YES  | —                   |       |
| 5   | `legal_address`           | text          | YES  | —                   |       |
| 6   | `corporate_purpose`       | text          | YES  | —                   |       |
| 7   | `business_description`    | varchar(2000) | YES  | —                   |       |
| 8   | `nace_section_code`       | varchar(10)   | YES  | —                   |       |
| 9   | `nace_division_code`      | varchar(10)   | YES  | —                   |       |
| 10  | `nace_group_code`         | varchar(10)   | YES  | —                   |       |
| 11  | `size_code`               | varchar(10)   | YES  | —                   |       |
| 12  | `branches_info`           | jsonb         | YES  | `'[]'::jsonb`       |       |
| 13  | `org_structure_prototype` | jsonb         | YES  | —                   |       |
| 14  | `org_structure_actual`    | jsonb         | YES  | —                   |       |
| 15  | `historical_profile`      | text          | YES  | —                   |       |
| 16  | `version`                 | int4(32)      | YES  | `1`                 |       |
| 17  | `last_updated_at`         | timestamptz   | YES  | `now()`             |       |
| 18  | `approved`                | bool          | YES  | `false`             |       |
| 19  | `approved_by`             | uuid          | YES  | —                   |       |
| 20  | `approved_at`             | timestamptz   | YES  | —                   |       |
| 21  | `created_at`              | timestamptz   | YES  | `now()`             |       |
| 22  | `updated_at`              | timestamptz   | YES  | `now()`             |       |
| 23  | `approved_by_employee_id` | uuid          | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `approved_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenants_books_approved_by_employee_id` [INDEX] · (`approved_by_employee_id`)
- `idx_tenants_books_nace` [INDEX] · (`nace_section_code`, `nace_division_code`)
- `tenants_books_pkey` [PRIMARY] · (`id`)
- `uq_tenant_book` [UNIQUE] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---
