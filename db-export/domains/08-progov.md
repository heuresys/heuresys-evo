# Dominio PROGOV — Process Governance (Workflow-Approval-Audit-Compliance)

> Process-driven governance + audit trail

**Tabelle in questo dominio**: 16

## Tabelle

| Tabella                                                               | Rows | Tenant | RLS | FK out | Cols |
| --------------------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`business_processes`](#businessprocesses)                            | 23   | —      | ✓   | 1      | 11   |
| [`compliance_training_requirements`](#compliancetrainingrequirements) | 20   | ✓      | ✓   | 2      | 14   |
| [`process_cost_centers`](#processcostcenters)                         | 9    | —      | ✓   | 1      | 8    |
| [`process_kpis`](#processkpis)                                        | 69   | —      | ✓   | 2      | 13   |
| [`process_phases`](#processphases)                                    | 63   | —      | ✓   | 1      | 10   |
| [`process_roles`](#processroles)                                      | 61   | —      | ✓   | 3      | 11   |
| [`process_skill_requirements`](#processskillrequirements)             | 92   | —      | ✓   | 3      | 9    |
| [`regulatory_frameworks`](#regulatoryframeworks)                      | -1   | —      | —   | 0      | 15   |
| [`signature_recipients`](#signaturerecipients)                        | 72   | ✓      | ✓   | 3      | 16   |
| [`signature_requests`](#signaturerequests)                            | 24   | ✓      | ✓   | 2      | 14   |
| [`whistleblowing_attachments`](#whistleblowingattachments)            | 7    | ✓      | ✓   | 3      | 15   |
| [`whistleblowing_audit_log`](#whistleblowingauditlog)                 | 20   | ✓      | ✓   | 4      | 11   |
| [`whistleblowing_handlers`](#whistleblowinghandlers)                  | 15   | ✓      | ✓   | 3      | 13   |
| [`whistleblowing_messages`](#whistleblowingmessages)                  | 16   | ✓      | ✓   | 2      | 12   |
| [`whistleblowing_reports`](#whistleblowingreports)                    | 4    | ✓      | ✓   | 2      | 37   |
| [`whistleblowing_settings`](#whistleblowingsettings)                  | 4    | ✓      | ✓   | 1      | 16   |

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

### `compliance_training_requirements`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: PROGOV
- **Prisma model**: `compliance_training_requirements`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default             | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                | uuid         | NO   | —                   |       |
| 3   | `name`                     | varchar(255) | NO   | —                   |       |
| 4   | `description`              | text         | YES  | —                   |       |
| 5   | `course_id`                | uuid         | YES  | —                   |       |
| 6   | `applies_to_all`           | bool         | YES  | `false`             |       |
| 7   | `applies_to_departments`   | \_text       | YES  | —                   |       |
| 8   | `applies_to_job_templates` | \_uuid       | YES  | —                   |       |
| 9   | `applies_to_locations`     | \_uuid       | YES  | —                   |       |
| 10  | `recurrence_months`        | int4(32)     | YES  | —                   |       |
| 11  | `grace_period_days`        | int4(32)     | YES  | `30`                |       |
| 12  | `is_active`                | bool         | YES  | `true`              |       |
| 13  | `created_at`               | timestamptz  | YES  | `now()`             |       |
| 14  | `deleted_at`               | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |
| `course_id` | `courses(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `compliance_training_requirements_pkey` [PRIMARY] · (`id`)
- `idx_compliance_training_requirements_active` [INDEX] · (`id`)
- `idx_compliance_training_requirements_course_id` [INDEX] · (`course_id`)
- `idx_compliance_training_requirements_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `process_cost_centers`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: PROGOV
- **Prisma model**: `process_cost_centers`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default              | Notes                                                                                 |
| --- | ------------------ | ------------ | ---- | -------------------- | ------------------------------------------------------------------------------------- |
| 1   | `id`               | uuid         | NO   | `uuid_generate_v4()` | PK                                                                                    |
| 2   | `process_id`       | uuid         | NO   | —                    |                                                                                       |
| 3   | `cost_center_code` | varchar(20)  | NO   | —                    |                                                                                       |
| 4   | `cost_center_name` | varchar(100) | NO   | —                    |                                                                                       |
| 5   | `cost_type`        | varchar(50)  | NO   | —                    | direct: production costs \| indirect: support costs \| overhead: administrative costs |
| 6   | `description`      | text         | YES  | —                    |                                                                                       |
| 7   | `created_at`       | timestamptz  | YES  | `now()`              |                                                                                       |
| 8   | `updated_at`       | timestamptz  | YES  | `now()`              |                                                                                       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References               | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------------ | --------- | --------- | ----- |
| `process_id` | `business_processes(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_process_cost_centers_process` [INDEX] · (`process_id`)
- `idx_process_cost_centers_type` [INDEX] · (`cost_type`)
- `process_cost_centers_pkey` [PRIMARY] · (`id`)
- `process_cost_centers_process_id_cost_center_code_key` [UNIQUE] · (`process_id`, `cost_center_code`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_cost_centers.process_id) AND (t.id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_cost_centers.process_id) AND (t.id = current_tenant_id()))))`

#### Inverse relations (referenced by)

- `org_unit_process_mapping` via (`cost_center_id`)

---

### `process_kpis`

- **Tenant scoped**: no
- **Row estimate**: 69
- **Domains**: PROGOV
- **Prisma model**: `process_kpis`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `process_id`       | uuid         | NO   | —                   |       |
| 3   | `phase_id`         | uuid         | YES  | —                   |       |
| 4   | `kpi_code`         | varchar(50)  | NO   | —                   |       |
| 5   | `kpi_name`         | varchar(255) | NO   | —                   |       |
| 6   | `measurement_unit` | varchar(100) | YES  | —                   |       |
| 7   | `target_direction` | varchar(20)  | YES  | —                   |       |
| 8   | `benchmark_value`  | numeric      | YES  | —                   |       |
| 9   | `benchmark_min`    | numeric      | YES  | —                   |       |
| 10  | `benchmark_max`    | numeric      | YES  | —                   |       |
| 11  | `description`      | text         | YES  | —                   |       |
| 12  | `created_at`       | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`       | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References               | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------------ | --------- | --------- | ----- |
| `phase_id`   | `process_phases(id)`     | NO ACTION | SET NULL  |       |
| `process_id` | `business_processes(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_process_kpis_phase_id` [INDEX] · (`phase_id`)
- `process_kpis_pkey` [PRIMARY] · (`id`)
- `process_kpis_process_id_kpi_code_key` [UNIQUE] · (`process_id`, `kpi_code`)

#### RLS Policies

- **process_kpis_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_kpis.process_id) AND (t.id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_kpis.process_id) AND (t.id = current_tenant_id()))))`

---

### `process_phases`

- **Tenant scoped**: no
- **Row estimate**: 63
- **Domains**: PROGOV
- **Prisma model**: `process_phases`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default             | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `process_id`              | uuid         | NO   | —                   |       |
| 3   | `phase_code`              | varchar(50)  | NO   | —                   |       |
| 4   | `phase_name`              | varchar(255) | NO   | —                   |       |
| 5   | `phase_order`             | int4(32)     | NO   | —                   |       |
| 6   | `description`             | text         | YES  | —                   |       |
| 7   | `estimated_duration_days` | int4(32)     | YES  | —                   |       |
| 8   | `is_optional`             | bool         | YES  | `false`             |       |
| 9   | `created_at`              | timestamptz  | YES  | `now()`             |       |
| 10  | `updated_at`              | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References               | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------------ | --------- | --------- | ----- |
| `process_id` | `business_processes(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `process_phases_pkey` [PRIMARY] · (`id`)
- `process_phases_process_id_phase_code_key` [UNIQUE] · (`process_id`, `phase_code`)

#### RLS Policies

- **process_phases_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_phases.process_id) AND (t.id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_phases.process_id) AND (t.id = current_tenant_id()))))`

#### Inverse relations (referenced by)

- `process_kpis` via (`phase_id`)
- `process_roles` via (`phase_id`)
- `process_skill_requirements` via (`phase_id`)

---

### `process_roles`

- **Tenant scoped**: no
- **Row estimate**: 61
- **Domains**: PROGOV
- **Prisma model**: `process_roles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `process_id`         | uuid         | NO   | —                   |       |
| 3   | `phase_id`           | uuid         | YES  | —                   |       |
| 4   | `role_name`          | varchar(255) | NO   | —                   |       |
| 5   | `role_type`          | varchar(50)  | NO   | —                   |       |
| 6   | `esco_occupation_id` | uuid         | YES  | —                   |       |
| 7   | `min_headcount`      | int4(32)     | YES  | `1`                 |       |
| 8   | `max_headcount`      | int4(32)     | YES  | —                   |       |
| 9   | `description`        | text         | YES  | —                   |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()`             |       |
| 11  | `updated_at`         | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References               | ON UPDATE | ON DELETE | Notes |
| -------------------- | ------------------------ | --------- | --------- | ----- |
| `esco_occupation_id` | `esco_occupations(id)`   | NO ACTION | RESTRICT  |       |
| `phase_id`           | `process_phases(id)`     | NO ACTION | SET NULL  |       |
| `process_id`         | `business_processes(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_process_roles_esco_occupation_id` [INDEX] · (`esco_occupation_id`)
- `idx_process_roles_phase_id` [INDEX] · (`phase_id`)
- `idx_process_roles_process_id` [INDEX] · (`process_id`)
- `process_roles_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **process_roles_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_roles.process_id) AND (t.id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_roles.process_id) AND (t.id = current_tenant_id()))))`

---

### `process_skill_requirements`

- **Tenant scoped**: no
- **Row estimate**: 92
- **Domains**: PROGOV
- **Prisma model**: `process_skill_requirements`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default             | Notes |
| --- | ------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `process_id`        | uuid        | NO   | —                   |       |
| 3   | `phase_id`          | uuid        | YES  | —                   |       |
| 4   | `esco_skill_id`     | uuid        | NO   | —                   |       |
| 5   | `proficiency_level` | int4(32)    | NO   | —                   |       |
| 6   | `is_mandatory`      | bool        | YES  | `true`              |       |
| 7   | `description`       | text        | YES  | —                   |       |
| 8   | `created_at`        | timestamptz | YES  | `now()`             |       |
| 9   | `updated_at`        | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References               | ON UPDATE | ON DELETE | Notes |
| --------------- | ------------------------ | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)`        | NO ACTION | RESTRICT  |       |
| `phase_id`      | `process_phases(id)`     | NO ACTION | SET NULL  |       |
| `process_id`    | `business_processes(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_process_skill_requirements_esco_skill_id` [INDEX] · (`esco_skill_id`)
- `idx_process_skill_requirements_phase_id` [INDEX] · (`phase_id`)
- `process_skill_requirements_pkey` [PRIMARY] · (`id`)
- `process_skill_requirements_process_id_phase_id_esco_skill_i_key` [UNIQUE] · (`process_id`, `phase_id`, `esco_skill_id`)

#### RLS Policies

- **process_skill_requirements_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_skill_requirements.process_id) AND (t.id = current_tenant_id()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1
 FROM (business_processes bp
   JOIN tenants t ON ((t.industry_profile_id = bp.profile_id)))
WHERE ((bp.id = process_skill_requirements.process_id) AND (t.id = current_tenant_id()))))`

---

### `regulatory_frameworks`

> S35.3 M7 (PROGOV phase18e): catalog regulatory frameworks (PSD2/MiFID II/AML5/Basel III/GDPR/BdI/TUB/DORA). Platform-default catalog (no tenant_id).

- **Tenant scoped**: no
- **Row estimate**: -1
- **Domains**: PROGOV
- **Prisma model**: `regulatory_frameworks`

#### Columns

| #   | Column           | Type         | Null | Default             | Notes |
| --- | ---------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `code`           | varchar(64)  | NO   | —                   |       |
| 3   | `name`           | varchar(255) | NO   | —                   |       |
| 4   | `name_en`        | varchar(255) | YES  | —                   |       |
| 5   | `full_reference` | varchar(512) | YES  | —                   |       |
| 6   | `scope`          | text         | YES  | —                   |       |
| 7   | `regulator`      | varchar(255) | YES  | —                   |       |
| 8   | `jurisdiction`   | varchar(64)  | YES  | —                   |       |
| 9   | `category`       | varchar(64)  | YES  | —                   |       |
| 10  | `effective_from` | date         | YES  | —                   |       |
| 11  | `is_active`      | bool         | NO   | `true`              |       |
| 12  | `reference_url`  | varchar(512) | YES  | —                   |       |
| 13  | `notes`          | text         | YES  | —                   |       |
| 14  | `created_at`     | timestamptz  | NO   | `now()`             |       |
| 15  | `updated_at`     | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_regulatory_frameworks_category` [INDEX] · (`category`)
- `idx_regulatory_frameworks_jurisdiction` [INDEX] · (`jurisdiction`)
- `regulatory_frameworks_code_key` [UNIQUE] · (`code`)
- `regulatory_frameworks_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `tenant_regulatory_compliance` via (`framework_code`)

---

### `signature_recipients`

- **Tenant scoped**: yes
- **Row estimate**: 72
- **Domains**: PROGOV
- **Prisma model**: `signature_recipients`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                        | Notes |
| --- | ---------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `request_id`     | uuid         | YES  | —                              |       |
| 3   | `employee_id`    | uuid         | YES  | —                              |       |
| 4   | `email`          | varchar(200) | NO   | —                              |       |
| 5   | `name`           | varchar(200) | YES  | —                              |       |
| 6   | `sign_order`     | int4(32)     | YES  | `1`                            |       |
| 7   | `status`         | varchar(30)  | YES  | `'pending'::character varying` |       |
| 8   | `sent_at`        | timestamp    | YES  | —                              |       |
| 9   | `viewed_at`      | timestamp    | YES  | —                              |       |
| 10  | `signed_at`      | timestamp    | YES  | —                              |       |
| 11  | `declined_at`    | timestamp    | YES  | —                              |       |
| 12  | `decline_reason` | text         | YES  | —                              |       |
| 13  | `signature_data` | text         | YES  | —                              |       |
| 14  | `ip_address`     | varchar(50)  | YES  | —                              |       |
| 15  | `created_at`     | timestamp    | YES  | `now()`                        |       |
| 16  | `tenant_id`      | uuid         | NO   | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References               | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------ | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`            | NO ACTION | CASCADE   |       |
| `employee_id` | `employees_core(id)`     | NO ACTION | SET NULL  |       |
| `request_id`  | `signature_requests(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_signature_recipients_emp` [INDEX] · (`employee_id`)
- `idx_signature_recipients_request` [INDEX] · (`request_id`)
- `idx_signature_recipients_tenant` [INDEX] · (`tenant_id`)
- `signature_recipients_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_signature_recipients** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `signature_requests`

- **Tenant scoped**: yes
- **Row estimate**: 24
- **Domains**: PROGOV
- **Prisma model**: `signature_requests`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                         | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                               |       |
| 3   | `document_name`          | varchar(300) | NO   | —                               |       |
| 4   | `document_type`          | varchar(100) | YES  | —                               |       |
| 5   | `document_url`           | text         | NO   | —                               |       |
| 6   | `status`                 | varchar(30)  | YES  | `'pending'::character varying`  |       |
| 7   | `external_id`            | varchar(200) | YES  | —                               |       |
| 8   | `provider`               | varchar(50)  | YES  | `'internal'::character varying` |       |
| 9   | `created_by`             | uuid         | YES  | —                               |       |
| 10  | `expires_at`             | timestamp    | YES  | —                               |       |
| 11  | `completed_at`           | timestamp    | YES  | —                               |       |
| 12  | `created_at`             | timestamp    | YES  | `now()`                         |       |
| 13  | `updated_at`             | timestamp    | YES  | `now()`                         |       |
| 14  | `created_by_employee_id` | uuid         | YES  | —                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_signature_requests_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_signature_requests_status` [INDEX] · (`status`)
- `idx_signature_requests_tenant` [INDEX] · (`tenant_id`)
- `signature_requests_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `signature_recipients` via (`request_id`)

---

### `whistleblowing_attachments`

- **Tenant scoped**: yes
- **Row estimate**: 7
- **Domains**: PROGOV
- **Prisma model**: `whistleblowing_attachments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type          | Null | Default             | Notes |
| --- | --------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `report_id`           | uuid          | YES  | —                   |       |
| 3   | `message_id`          | uuid          | YES  | —                   |       |
| 4   | `file_name`           | varchar(500)  | NO   | —                   |       |
| 5   | `file_path`           | varchar(1000) | NO   | —                   |       |
| 6   | `file_size`           | int4(32)      | YES  | —                   |       |
| 7   | `mime_type`           | varchar(100)  | YES  | —                   |       |
| 8   | `file_hash`           | varchar(128)  | YES  | —                   |       |
| 9   | `uploaded_by_type`    | varchar(20)   | YES  | —                   |       |
| 10  | `uploaded_by_id`      | uuid          | YES  | —                   |       |
| 11  | `encrypted`           | bool          | YES  | `true`              |       |
| 12  | `scanned_for_malware` | bool          | YES  | `false`             |       |
| 13  | `scan_result`         | varchar(50)   | YES  | —                   |       |
| 14  | `created_at`          | timestamp     | YES  | `now()`             |       |
| 15  | `tenant_id`           | uuid          | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References                    | ON UPDATE | ON DELETE | Notes |
| ------------ | ----------------------------- | --------- | --------- | ----- |
| `tenant_id`  | `tenants(id)`                 | NO ACTION | CASCADE   |       |
| `message_id` | `whistleblowing_messages(id)` | NO ACTION | SET NULL  |       |
| `report_id`  | `whistleblowing_reports(id)`  | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_whistleblowing_attachments_message_id` [INDEX] · (`message_id`)
- `idx_whistleblowing_attachments_report_id` [INDEX] · (`report_id`)
- `idx_whistleblowing_attachments_tenant` [INDEX] · (`tenant_id`)
- `whistleblowing_attachments_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_whistleblowing_attachments** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `whistleblowing_audit_log`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: PROGOV
- **Prisma model**: `whistleblowing_audit_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type        | Null | Default             | Notes |
| --- | --------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `report_id`           | uuid        | YES  | —                   |       |
| 3   | `action`              | varchar(50) | NO   | —                   |       |
| 4   | `old_value`           | text        | YES  | —                   |       |
| 5   | `new_value`           | text        | YES  | —                   |       |
| 6   | `user_id`             | uuid        | YES  | —                   |       |
| 7   | `user_role`           | varchar(50) | YES  | —                   |       |
| 8   | `ip_address_hash`     | varchar(64) | YES  | —                   |       |
| 9   | `created_at`          | timestamp   | YES  | `now()`             |       |
| 10  | `user_id_employee_id` | uuid        | YES  | —                   |       |
| 11  | `tenant_id`           | uuid        | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References                   | ON UPDATE | ON DELETE | Notes |
| --------------------- | ---------------------------- | --------- | --------- | ----- |
| `user_id`             | `users(id)`                  | NO ACTION | SET NULL  |       |
| `tenant_id`           | `tenants(id)`                | NO ACTION | CASCADE   |       |
| `report_id`           | `whistleblowing_reports(id)` | NO ACTION | SET NULL  |       |
| `user_id_employee_id` | `employees_core(id)`         | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_wb_audit_report` [INDEX] · (`report_id`)
- `idx_whistleblowing_audit_log_tenant` [INDEX] · (`tenant_id`)
- `idx_whistleblowing_audit_log_user_id` [INDEX] · (`user_id`)
- `idx_whistleblowing_audit_log_user_id_employee_id` [INDEX] · (`user_id_employee_id`)
- `whistleblowing_audit_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_whistleblowing_audit_log** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `whistleblowing_handlers`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: PROGOV
- **Prisma model**: `whistleblowing_handlers`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                             | Type        | Null | Default                        | Notes |
| --- | ---------------------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                               | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`                        | uuid        | NO   | —                              |       |
| 3   | `user_id`                          | uuid        | YES  | —                              |       |
| 4   | `role`                             | varchar(50) | YES  | `'handler'::character varying` |       |
| 5   | `categories`                       | \_text      | YES  | —                              |       |
| 6   | `is_active`                        | bool        | YES  | `true`                         |       |
| 7   | `conflict_of_interest_declaration` | bool        | YES  | `false`                        |       |
| 8   | `training_completed`               | bool        | YES  | `false`                        |       |
| 9   | `training_date`                    | date        | YES  | —                              |       |
| 10  | `created_at`                       | timestamp   | YES  | `now()`                        |       |
| 11  | `updated_at`                       | timestamp   | YES  | `now()`                        |       |
| 12  | `user_id_employee_id`              | uuid        | YES  | —                              |       |
| 13  | `deleted_at`                       | timestamptz | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `user_id`             | `users(id)`          | NO ACTION | SET NULL  |       |
| `tenant_id`           | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `user_id_employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wb_handlers_tenant` [INDEX] · (`tenant_id`)
- `idx_whistleblowing_handlers_active` [INDEX] · (`id`)
- `idx_whistleblowing_handlers_user_id` [INDEX] · (`user_id`)
- `idx_whistleblowing_handlers_user_id_employee_id` [INDEX] · (`user_id_employee_id`)
- `whistleblowing_handlers_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `whistleblowing_messages`

- **Tenant scoped**: yes
- **Row estimate**: 16
- **Domains**: PROGOV
- **Prisma model**: `whistleblowing_messages`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                        | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `report_id`        | uuid         | YES  | —                              |       |
| 3   | `sender_type`      | varchar(20)  | NO   | —                              |       |
| 4   | `sender_id`        | uuid         | YES  | —                              |       |
| 5   | `sender_name`      | varchar(200) | YES  | —                              |       |
| 6   | `message_type`     | varchar(20)  | YES  | `'message'::character varying` |       |
| 7   | `content`          | text         | NO   | —                              |       |
| 8   | `has_attachments`  | bool         | YES  | `false`                        |       |
| 9   | `read_by_reporter` | bool         | YES  | `false`                        |       |
| 10  | `read_by_handler`  | bool         | YES  | `false`                        |       |
| 11  | `created_at`       | timestamp    | YES  | `now()`                        |       |
| 12  | `tenant_id`        | uuid         | NO   | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References                   | ON UPDATE | ON DELETE | Notes |
| ----------- | ---------------------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)`                | NO ACTION | CASCADE   |       |
| `report_id` | `whistleblowing_reports(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wb_messages_report` [INDEX] · (`report_id`)
- `idx_whistleblowing_messages_tenant` [INDEX] · (`tenant_id`)
- `whistleblowing_messages_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_whistleblowing_messages** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `whistleblowing_attachments` via (`message_id`)

---

### `whistleblowing_reports`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: PROGOV
- **Prisma model**: `whistleblowing_reports`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                          | Notes |
| --- | ------------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                                |       |
| 3   | `case_number`             | varchar(50)  | NO   | —                                |       |
| 4   | `anonymous_token`         | varchar(255) | YES  | —                                |       |
| 5   | `reporter_type`           | varchar(20)  | YES  | `'anonymous'::character varying` |       |
| 6   | `reporter_name`           | varchar(200) | YES  | —                                |       |
| 7   | `reporter_email`          | varchar(255) | YES  | —                                |       |
| 8   | `reporter_phone`          | varchar(50)  | YES  | —                                |       |
| 9   | `reporter_employee_id`    | uuid         | YES  | —                                |       |
| 10  | `reporter_role`           | varchar(100) | YES  | —                                |       |
| 11  | `category`                | varchar(50)  | NO   | —                                |       |
| 12  | `severity`                | varchar(20)  | YES  | `'medium'::character varying`    |       |
| 13  | `title`                   | varchar(300) | NO   | —                                |       |
| 14  | `description`             | text         | NO   | —                                |       |
| 15  | `incident_date`           | date         | YES  | —                                |       |
| 16  | `incident_location`       | varchar(300) | YES  | —                                |       |
| 17  | `involved_persons`        | text         | YES  | —                                |       |
| 18  | `witnesses`               | text         | YES  | —                                |       |
| 19  | `status`                  | varchar(30)  | YES  | `'submitted'::character varying` |       |
| 20  | `priority`                | varchar(20)  | YES  | `'normal'::character varying`    |       |
| 21  | `assigned_to`             | uuid         | YES  | —                                |       |
| 22  | `assigned_team`           | varchar(100) | YES  | —                                |       |
| 23  | `acknowledgement_sent`    | bool         | YES  | `false`                          |       |
| 24  | `acknowledgement_date`    | timestamp    | YES  | —                                |       |
| 25  | `feedback_provided`       | bool         | YES  | `false`                          |       |
| 26  | `feedback_date`           | timestamp    | YES  | —                                |       |
| 27  | `resolution_type`         | varchar(50)  | YES  | —                                |       |
| 28  | `resolution_summary`      | text         | YES  | —                                |       |
| 29  | `consent_data_processing` | bool         | YES  | `true`                           |       |
| 30  | `retention_end_date`      | date         | YES  | —                                |       |
| 31  | `anonymized`              | bool         | YES  | `false`                          |       |
| 32  | `source`                  | varchar(50)  | YES  | `'web_form'::character varying`  |       |
| 33  | `ip_hash`                 | varchar(64)  | YES  | —                                |       |
| 34  | `user_agent_hash`         | varchar(64)  | YES  | —                                |       |
| 35  | `created_at`              | timestamp    | YES  | `now()`                          |       |
| 36  | `updated_at`              | timestamp    | YES  | `now()`                          |       |
| 37  | `assigned_to_employee_id` | uuid         | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `assigned_to_employee_id` | `employees_core(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wb_reports_assigned` [INDEX] · (`assigned_to`)
- `idx_wb_reports_case` [INDEX] · (`case_number`)
- `idx_wb_reports_status` [INDEX] · (`status`)
- `idx_wb_reports_tenant` [INDEX] · (`tenant_id`)
- `idx_whistleblowing_reports_assigned_to_employee_id` [INDEX] · (`assigned_to_employee_id`)
- `whistleblowing_reports_anonymous_token_key` [UNIQUE] · (`anonymous_token`)
- `whistleblowing_reports_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `whistleblowing_attachments` via (`report_id`)
- `whistleblowing_audit_log` via (`report_id`)
- `whistleblowing_messages` via (`report_id`)

---

### `whistleblowing_settings`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: PROGOV
- **Prisma model**: `whistleblowing_settings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                          | Type      | Null | Default             | Notes |
| --- | ------------------------------- | --------- | ---- | ------------------- | ----- |
| 1   | `id`                            | uuid      | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                     | uuid      | NO   | —                   |       |
| 3   | `enabled`                       | bool      | YES  | `true`              |       |
| 4   | `allow_anonymous`               | bool      | YES  | `true`              |       |
| 5   | `require_consent`               | bool      | YES  | `true`              |       |
| 6   | `acknowledgement_deadline_days` | int4(32)  | YES  | `7`                 |       |
| 7   | `feedback_deadline_days`        | int4(32)  | YES  | `90`                |       |
| 8   | `retention_period_months`       | int4(32)  | YES  | `24`                |       |
| 9   | `auto_anonymize`                | bool      | YES  | `true`              |       |
| 10  | `notify_handlers_immediately`   | bool      | YES  | `true`              |       |
| 11  | `escalation_after_days`         | int4(32)  | YES  | `14`                |       |
| 12  | `intro_text`                    | text      | YES  | —                   |       |
| 13  | `categories_enabled`            | \_text    | YES  | —                   |       |
| 14  | `custom_fields`                 | text      | YES  | —                   |       |
| 15  | `created_at`                    | timestamp | YES  | `now()`             |       |
| 16  | `updated_at`                    | timestamp | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `whistleblowing_settings_pkey` [PRIMARY] · (`id`)
- `whistleblowing_settings_tenant_id_key` [UNIQUE] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---
