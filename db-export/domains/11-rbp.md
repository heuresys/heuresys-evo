# Dominio RBP — Role-Based Permissions matrix

> 8 roles × 34 areas governance

**Tabelle in questo dominio**: 32

## Tabelle

| Tabella                                                 | Rows | Tenant | RLS | FK out | Cols |
| ------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`api_keys`](#apikeys)                                  | 0    | ✓      | ✓   | 1      | 9    |
| [`canonical_demo_users`](#canonicaldemousers)           | -1   | —      | —   | 0      | 3    |
| [`login_attempts`](#loginattempts)                      | 7    | —      | —   | 0      | 7    |
| [`permission_overrides`](#permissionoverrides)          | 10   | ✓      | ✓   | 3      | 12   |
| [`permissions`](#permissions)                           | 184  | —      | —   | 1      | 12   |
| [`plugin_api_keys`](#pluginapikeys)                     | 1    | ✓      | ✓   | 3      | 15   |
| [`rbp_area_perspectives`](#rbpareaperspectives)         | 47   | —      | —   | 2      | 5    |
| [`rbp_dashboard_nav_items`](#rbpdashboardnavitems)      | 279  | —      | —   | 3      | 14   |
| [`rbp_dashboards`](#rbpdashboards)                      | 11   | —      | —   | 0      | 15   |
| [`rbp_data_classifications`](#rbpdataclassifications)   | 5    | —      | —   | 0      | 6    |
| [`rbp_field_classifications`](#rbpfieldclassifications) | 30   | ✓      | ✓   | 1      | 8    |
| [`rbp_field_policies`](#rbpfieldpolicies)               | 40   | —      | —   | 2      | 7    |
| [`rbp_functional_areas`](#rbpfunctionalareas)           | 34   | —      | —   | 0      | 13   |
| [`rbp_pages`](#rbppages)                                | 170  | —      | —   | 1      | 19   |
| [`rbp_perspectives`](#rbpperspectives)                  | 3    | —      | —   | 0      | 11   |
| [`rbp_role_dashboards`](#rbproledashboards)             | 23   | —      | —   | 2      | 5    |
| [`rbp_role_permissions`](#rbprolepermissions)           | 179  | —      | —   | 2      | 13   |
| [`rbp_roles`](#rbproles)                                | 8    | —      | —   | 2      | 14   |
| [`rbp_scope_rules`](#rbpscoperules)                     | 8    | —      | —   | 1      | 7    |
| [`rbp_section_translations`](#rbpsectiontranslations)   | 44   | ✓      | ✓   | 1      | 7    |
| [`rbp_sections`](#rbpsections)                          | 22   | ✓      | ✓   | 1      | 9    |
| [`rbp_team_leaders`](#rbpteamleaders)                   | 4    | —      | ✓   | 2      | 5    |
| [`rbp_team_members`](#rbpteammembers)                   | 11   | —      | ✓   | 2      | 6    |
| [`rbp_teams`](#rbpteams)                                | 7    | ✓      | ✓   | 2      | 10   |
| [`role_default_dashboards`](#roledefaultdashboards)     | 8    | ✓      | ✓   | 2      | 7    |
| [`role_permissions`](#rolepermissions)                  | 20   | ✓      | ✓   | 2      | 11   |
| [`role_skill_requirements`](#roleskillrequirements)     | 90   | ✓      | ✓   | 5      | 19   |
| [`sso_configurations`](#ssoconfigurations)              | 4    | ✓      | ✓   | 2      | 27   |
| [`sso_login_attempts`](#ssologinattempts)               | 48   | —      | —   | 1      | 8    |
| [`user_pernr_mapping`](#userpernrmapping)               | 571  | —      | —   | 1      | 7    |
| [`user_workspaces`](#userworkspaces)                    | 5    | ✓      | ✓   | 3      | 13   |
| [`users`](#users)                                       | 274  | —      | ✓   | 2      | 18   |

---

### `api_keys`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: RBP
- **Prisma model**: `api_keys`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                   |       |
| 3   | `key_hash`            | varchar(128) | NO   | —                   |       |
| 4   | `name`                | varchar(200) | NO   | —                   |       |
| 5   | `is_active`           | bool         | NO   | `true`              |       |
| 6   | `rate_limit_per_hour` | int4(32)     | NO   | `1000`              |       |
| 7   | `last_used_at`        | timestamptz  | YES  | —                   |       |
| 8   | `created_at`          | timestamptz  | NO   | `now()`             |       |
| 9   | `expires_at`          | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `api_keys_pkey` [PRIMARY] · (`id`)
- `idx_api_keys_hash` [UNIQUE] · (`key_hash`)
- `idx_api_keys_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `canonical_demo_users`

- **Tenant scoped**: no
- **Row estimate**: -1
- **Domains**: RBP
- **Prisma model**: `canonical_demo_users`

#### Columns

| #   | Column       | Type         | Null | Default | Notes |
| --- | ------------ | ------------ | ---- | ------- | ----- |
| 1   | `role`       | varchar(50)  | NO   | —       | PK    |
| 2   | `username`   | varchar(100) | NO   | —       |       |
| 3   | `updated_at` | timestamptz  | NO   | `now()` |       |

#### Primary Key

`(`role`)`

#### Indexes

- `canonical_demo_users_pkey` [PRIMARY] · (`role`)
- `canonical_demo_users_username_key` [UNIQUE] · (`username`)

---

### `login_attempts`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: RBP
- **Prisma model**: `login_attempts`

#### Columns

| #   | Column           | Type         | Null | Default             | Notes |
| --- | ---------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `username`       | varchar(255) | NO   | —                   |       |
| 3   | `attempt_count`  | int4(32)     | NO   | `0`                 |       |
| 4   | `last_failed_at` | timestamptz  | YES  | —                   |       |
| 5   | `locked_until`   | timestamptz  | YES  | —                   |       |
| 6   | `created_at`     | timestamptz  | NO   | `now()`             |       |
| 7   | `updated_at`     | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `login_attempts_pkey` [PRIMARY] · (`id`)
- `login_attempts_username_key` [UNIQUE] · (`username`)

---

### `permission_overrides`

- **Tenant scoped**: yes
- **Row estimate**: 10
- **Domains**: RBP
- **Prisma model**: `permission_overrides`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default             | Notes |
| --- | --------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`     | uuid        | NO   | —                   |       |
| 3   | `role`          | varchar(50) | NO   | —                   |       |
| 4   | `permission_id` | uuid        | NO   | —                   |       |
| 5   | `is_granted`    | bool        | NO   | `true`              |       |
| 6   | `conditions`    | jsonb       | YES  | `'{}'::jsonb`       |       |
| 7   | `granted_at`    | timestamptz | YES  | `now()`             |       |
| 8   | `granted_by`    | uuid        | YES  | —                   |       |
| 9   | `expires_at`    | timestamptz | YES  | —                   |       |
| 10  | `reason`        | text        | YES  | —                   |       |
| 11  | `created_at`    | timestamptz | YES  | `now()`             |       |
| 12  | `updated_at`    | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References           | ON UPDATE | ON DELETE | Notes |
| --------------- | -------------------- | --------- | --------- | ----- |
| `granted_by`    | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `permission_id` | `permissions(id)`    | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_permission_overrides_granted_by` [INDEX] · (`granted_by`)
- `idx_permission_overrides_role` [INDEX] · (`role`)
- `idx_permission_overrides_tenant` [INDEX] · (`tenant_id`)
- `permission_overrides_pkey` [PRIMARY] · (`id`)
- `permission_overrides_tenant_id_role_permission_id_key` [UNIQUE] · (`tenant_id`, `role`, `permission_id`)

#### RLS Policies

- **rls_permission_overrides_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `permissions`

- **Tenant scoped**: no
- **Row estimate**: 184
- **Domains**: RBP
- **Prisma model**: `permissions`

#### Columns

| #   | Column          | Type             | Null | Default                   | Notes                                                |
| --- | --------------- | ---------------- | ---- | ------------------------- | ---------------------------------------------------- |
| 1   | `id`            | uuid             | NO   | `gen_random_uuid()`       | PK                                                   |
| 2   | `code`          | varchar(100)     | NO   | —                         | Permission code format: {module}:{operation}:{scope} |
| 3   | `module_id`     | uuid             | YES  | —                         |                                                      |
| 4   | `operation`     | crud_operation   | NO   | —                         |                                                      |
| 5   | `default_scope` | permission_scope | YES  | `'own'::permission_scope` |                                                      |
| 6   | `name`          | varchar(200)     | NO   | —                         |                                                      |
| 7   | `description`   | text             | YES  | —                         |                                                      |
| 8   | `is_sensitive`  | bool             | YES  | `false`                   | If true, requires additional audit logging           |
| 9   | `is_active`     | bool             | YES  | `true`                    |                                                      |
| 10  | `created_at`    | timestamptz      | YES  | `now()`                   |                                                      |
| 11  | `updated_at`    | timestamptz      | YES  | `now()`                   |                                                      |
| 12  | `deleted_at`    | timestamptz      | YES  | —                         |                                                      |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References            | ON UPDATE | ON DELETE | Notes |
| ----------- | --------------------- | --------- | --------- | ----- |
| `module_id` | `feature_modules(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_permissions_active` [INDEX] · (`is_active`)
- `idx_permissions_module` [INDEX] · (`module_id`)
- `idx_permissions_not_deleted` [INDEX] · (`id`)
- `idx_permissions_operation` [INDEX] · (`operation`)
- `permissions_pkey` [PRIMARY] · (`id`)
- `uq_permissions_code` [UNIQUE] · (`code`)

#### Inverse relations (referenced by)

- `employee_permission_overrides` via (`permission_id`)
- `permission_overrides` via (`permission_id`)
- `role_permissions` via (`permission_id`)

---

### `plugin_api_keys`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: RBP · DGOV
- **Prisma model**: `plugin_api_keys`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `plugin_installation_id` | uuid         | YES  | —                   |       |
| 4   | `name`                   | varchar(200) | NO   | —                   |       |
| 5   | `key_hash`               | varchar(128) | NO   | —                   |       |
| 6   | `key_prefix`             | varchar(12)  | NO   | —                   |       |
| 7   | `scopes`                 | \_text       | YES  | `'{}'::text[]`      |       |
| 8   | `expires_at`             | timestamptz  | YES  | —                   |       |
| 9   | `last_used_at`           | timestamptz  | YES  | —                   |       |
| 10  | `is_active`              | bool         | YES  | `true`              |       |
| 11  | `created_by`             | uuid         | YES  | —                   |       |
| 12  | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 13  | `revoked_at`             | timestamptz  | YES  | —                   |       |
| 14  | `created_by_employee_id` | uuid         | YES  | —                   |       |
| 15  | `deleted_at`             | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `plugin_installation_id` | `plugin_installations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_api_keys_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_plugin_api_keys_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_plugin_api_keys_installation` [INDEX] · (`plugin_installation_id`)
- `idx_plugin_api_keys_key_prefix` [INDEX] · (`key_prefix`)
- `idx_plugin_api_keys_not_deleted` [INDEX] · (`id`)
- `idx_plugin_api_keys_tenant` [INDEX] · (`tenant_id`)
- `plugin_api_keys_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `rbp_area_perspectives`

- **Tenant scoped**: no
- **Row estimate**: 47
- **Domains**: RBP
- **Prisma model**: `rbp_area_perspectives`

#### Columns

| #   | Column               | Type        | Null | Default                                             | Notes |
| --- | -------------------- | ----------- | ---- | --------------------------------------------------- | ----- |
| 1   | `id`                 | int4(32)    | NO   | `nextval('rbp_area_perspectives_id_seq'::regclass)` | PK    |
| 2   | `functional_area_id` | int4(32)    | NO   | —                                                   |       |
| 3   | `perspective_code`   | varchar(20) | NO   | —                                                   |       |
| 4   | `relevance`          | varchar(10) | YES  | `'PRIMARY'::character varying`                      |       |
| 5   | `created_at`         | timestamptz | YES  | `now()`                                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References                 | ON UPDATE | ON DELETE | Notes |
| -------------------- | -------------------------- | --------- | --------- | ----- |
| `functional_area_id` | `rbp_functional_areas(id)` | NO ACTION | RESTRICT  |       |
| `perspective_code`   | `rbp_perspectives(code)`   | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_area_perspectives_area` [INDEX] · (`functional_area_id`)
- `idx_area_perspectives_code` [INDEX] · (`perspective_code`)
- `rbp_area_perspectives_functional_area_id_perspective_code_key` [UNIQUE] · (`functional_area_id`, `perspective_code`)
- `rbp_area_perspectives_pkey` [PRIMARY] · (`id`)

---

### `rbp_dashboard_nav_items`

- **Tenant scoped**: no
- **Row estimate**: 279
- **Domains**: RBP
- **Prisma model**: `rbp_dashboard_nav_items`

#### Columns

| #   | Column                | Type         | Null | Default                                               | Notes |
| --- | --------------------- | ------------ | ---- | ----------------------------------------------------- | ----- |
| 1   | `id`                  | int4(32)     | NO   | `nextval('rbp_dashboard_nav_items_id_seq'::regclass)` | PK    |
| 2   | `dashboard_id`        | int4(32)     | NO   | —                                                     |       |
| 3   | `item_type`           | varchar(20)  | NO   | —                                                     |       |
| 4   | `target_page_id`      | int4(32)     | YES  | —                                                     |       |
| 5   | `target_dashboard_id` | int4(32)     | YES  | —                                                     |       |
| 6   | `external_url`        | varchar(500) | YES  | —                                                     |       |
| 7   | `section`             | varchar(50)  | NO   | `'main'::character varying`                           |       |
| 8   | `label_override`      | varchar(150) | YES  | —                                                     |       |
| 9   | `icon_override`       | varchar(50)  | YES  | —                                                     |       |
| 10  | `sort_order`          | int4(32)     | NO   | `0`                                                   |       |
| 11  | `is_visible`          | bool         | NO   | `true`                                                |       |
| 12  | `created_at`          | timestamptz  | NO   | `now()`                                               |       |
| 13  | `label_override_it`   | varchar(150) | YES  | —                                                     |       |
| 14  | `label_override_en`   | varchar(150) | YES  | —                                                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `dashboard_id`        | `rbp_dashboards(id)` | NO ACTION | CASCADE   |       |
| `target_dashboard_id` | `rbp_dashboards(id)` | NO ACTION | SET NULL  |       |
| `target_page_id`      | `rbp_pages(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_dashboard_nav_items_target_dashboard_id` [INDEX] · (`target_dashboard_id`)
- `idx_rbp_dashboard_nav_items_target_page_id` [INDEX] · (`target_page_id`)
- `idx_rbp_nav_items_dashboard` [INDEX] · (`dashboard_id`, `sort_order`)
- `rbp_dashboard_nav_items_pkey` [PRIMARY] · (`id`)

---

### `rbp_dashboards`

- **Tenant scoped**: no
- **Row estimate**: 11
- **Domains**: RBP
- **Prisma model**: `rbp_dashboards`

#### Columns

| #   | Column           | Type         | Null | Default                                      | Notes |
| --- | ---------------- | ------------ | ---- | -------------------------------------------- | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('rbp_dashboards_id_seq'::regclass)` | PK    |
| 2   | `code`           | varchar(50)  | NO   | —                                            |       |
| 3   | `name`           | varchar(100) | NO   | —                                            |       |
| 4   | `description`    | text         | YES  | —                                            |       |
| 5   | `layout_path`    | varchar(100) | NO   | —                                            |       |
| 6   | `icon`           | varchar(50)  | YES  | —                                            |       |
| 7   | `sort_order`     | int4(32)     | NO   | `0`                                          |       |
| 8   | `is_active`      | bool         | NO   | `true`                                       |       |
| 9   | `theme_config`   | jsonb        | YES  | `'{}'::jsonb`                                |       |
| 10  | `created_at`     | timestamptz  | NO   | `now()`                                      |       |
| 11  | `updated_at`     | timestamptz  | NO   | `now()`                                      |       |
| 12  | `name_it`        | varchar(100) | YES  | —                                            |       |
| 13  | `name_en`        | varchar(100) | YES  | —                                            |       |
| 14  | `description_it` | text         | YES  | —                                            |       |
| 15  | `description_en` | text         | YES  | —                                            |       |

#### Primary Key

`(`id`)`

#### Indexes

- `rbp_dashboards_code_key` [UNIQUE] · (`code`)
- `rbp_dashboards_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `rbp_dashboard_nav_items` via (`dashboard_id` · `target_dashboard_id`)
- `rbp_role_dashboards` via (`dashboard_id`)
- `rbp_roles` via (`default_dashboard_code`)
- `user_workspaces` via (`dashboard_id`)

---

### `rbp_data_classifications`

- **Tenant scoped**: no
- **Row estimate**: 5
- **Domains**: RBP
- **Prisma model**: `rbp_data_classifications`

#### Columns

| #   | Column              | Type         | Null | Default                                                | Notes |
| --- | ------------------- | ------------ | ---- | ------------------------------------------------------ | ----- |
| 1   | `id`                | int4(32)     | NO   | `nextval('rbp_data_classifications_id_seq'::regclass)` | PK    |
| 2   | `code`              | varchar(30)  | NO   | —                                                      |       |
| 3   | `name`              | varchar(100) | NO   | —                                                      |       |
| 4   | `description`       | text         | YES  | —                                                      |       |
| 5   | `sensitivity_level` | int4(32)     | NO   | —                                                      |       |
| 6   | `created_at`        | timestamptz  | NO   | `now()`                                                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `rbp_data_classifications_code_key` [UNIQUE] · (`code`)
- `rbp_data_classifications_pkey` [PRIMARY] · (`id`)
- `rbp_data_classifications_sensitivity_level_key` [UNIQUE] · (`sensitivity_level`)

#### Inverse relations (referenced by)

- `rbp_field_policies` via (`data_classification_id`)

---

### `rbp_field_classifications`

> This model contains an index with non-default null sort order and requires additional setup for migrations. Visit https://pris.ly/d/default-index-null-ordering for more info.

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: RBP
- **Prisma model**: `rbp_field_classifications`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                                                 | Notes |
| --- | ---------------- | ------------ | ---- | ------------------------------------------------------- | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('rbp_field_classifications_id_seq'::regclass)` | PK    |
| 2   | `tenant_id`      | uuid         | YES  | —                                                       |       |
| 3   | `table_name`     | varchar(100) | NO   | —                                                       |       |
| 4   | `column_name`    | varchar(100) | NO   | —                                                       |       |
| 5   | `classification` | varchar(20)  | NO   | —                                                       |       |
| 6   | `notes`          | text         | YES  | —                                                       |       |
| 7   | `created_at`     | timestamptz  | NO   | `now()`                                                 |       |
| 8   | `updated_at`     | timestamptz  | NO   | `now()`                                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_field_classifications_lookup` [INDEX] · (`table_name`, `tenant_id`)
- `rbp_field_classifications_pkey` [PRIMARY] · (`id`)
- `rbp_field_classifications_unique` [UNIQUE] · (`tenant_id`, `table_name`, `column_name`)

#### RLS Policies

- **rbp_field_classifications_read_policy** (SELECT · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR ((tenant_id)::text = current_setting('app.current_tenant_id'::text, true)))`

---

### `rbp_field_policies`

- **Tenant scoped**: no
- **Row estimate**: 40
- **Domains**: RBP
- **Prisma model**: `rbp_field_policies`

#### Columns

| #   | Column                   | Type        | Null | Default                                          | Notes |
| --- | ------------------------ | ----------- | ---- | ------------------------------------------------ | ----- |
| 1   | `id`                     | int4(32)    | NO   | `nextval('rbp_field_policies_id_seq'::regclass)` | PK    |
| 2   | `role_id`                | int4(32)    | NO   | —                                                |       |
| 3   | `data_classification_id` | int4(32)    | NO   | —                                                |       |
| 4   | `action`                 | varchar(20) | NO   | `'MASK'::character varying`                      |       |
| 5   | `field_list`             | jsonb       | YES  | `'[]'::jsonb`                                    |       |
| 6   | `created_at`             | timestamptz | NO   | `now()`                                          |       |
| 7   | `updated_at`             | timestamptz | NO   | `now()`                                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                     | ON UPDATE | ON DELETE | Notes |
| ------------------------ | ------------------------------ | --------- | --------- | ----- |
| `data_classification_id` | `rbp_data_classifications(id)` | NO ACTION | CASCADE   |       |
| `role_id`                | `rbp_roles(id)`                | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_field_policies_role` [INDEX] · (`role_id`)
- `rbp_field_policies_pkey` [PRIMARY] · (`id`)
- `rbp_field_policies_role_id_data_classification_id_key` [UNIQUE] · (`role_id`, `data_classification_id`)

---

### `rbp_functional_areas`

- **Tenant scoped**: no
- **Row estimate**: 34
- **Domains**: PET · RBP
- **Prisma model**: `rbp_functional_areas`

#### Columns

| #   | Column           | Type         | Null | Default                                            | Notes |
| --- | ---------------- | ------------ | ---- | -------------------------------------------------- | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('rbp_functional_areas_id_seq'::regclass)` | PK    |
| 2   | `code`           | varchar(50)  | NO   | —                                                  |       |
| 3   | `name`           | varchar(100) | NO   | —                                                  |       |
| 4   | `description`    | text         | YES  | —                                                  |       |
| 5   | `category`       | varchar(50)  | NO   | —                                                  |       |
| 6   | `sort_order`     | int4(32)     | NO   | `0`                                                |       |
| 7   | `is_active`      | bool         | NO   | `true`                                             |       |
| 8   | `created_at`     | timestamptz  | NO   | `now()`                                            |       |
| 9   | `updated_at`     | timestamptz  | NO   | `now()`                                            |       |
| 10  | `name_it`        | varchar(100) | YES  | —                                                  |       |
| 11  | `name_en`        | varchar(100) | YES  | —                                                  |       |
| 12  | `description_it` | text         | YES  | —                                                  |       |
| 13  | `description_en` | text         | YES  | —                                                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `rbp_functional_areas_code_key` [UNIQUE] · (`code`)
- `rbp_functional_areas_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `admin_component_registry` via (`functional_area_code`)
- `rbp_area_perspectives` via (`functional_area_id`)
- `rbp_pages` via (`functional_area_code`)
- `rbp_role_permissions` via (`functional_area_id`)
- `widget_catalog` via (`functional_area_code`)

---

### `rbp_pages`

- **Tenant scoped**: no
- **Row estimate**: 170
- **Domains**: RBP
- **Prisma model**: `rbp_pages`

#### Columns

| #   | Column                 | Type         | Null | Default                                 | Notes                                                                                                                                                     |
| --- | ---------------------- | ------------ | ---- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `id`                   | int4(32)     | NO   | `nextval('rbp_pages_id_seq'::regclass)` | PK                                                                                                                                                        |
| 2   | `code`                 | varchar(80)  | NO   | —                                       |                                                                                                                                                           |
| 3   | `name`                 | varchar(150) | NO   | —                                       |                                                                                                                                                           |
| 4   | `description`          | text         | YES  | —                                       |                                                                                                                                                           |
| 5   | `route_path`           | varchar(200) | NO   | —                                       |                                                                                                                                                           |
| 6   | `functional_area_code` | varchar(50)  | NO   | —                                       |                                                                                                                                                           |
| 7   | `status`               | varchar(20)  | NO   | `'ACTIVE'::character varying`           |                                                                                                                                                           |
| 8   | `redirect_to`          | varchar(200) | YES  | —                                       |                                                                                                                                                           |
| 9   | `icon`                 | varchar(50)  | YES  | —                                       |                                                                                                                                                           |
| 10  | `component_path`       | varchar(200) | YES  | —                                       |                                                                                                                                                           |
| 11  | `requires_auth`        | bool         | NO   | `true`                                  |                                                                                                                                                           |
| 12  | `metadata`             | jsonb        | YES  | `'{}'::jsonb`                           |                                                                                                                                                           |
| 13  | `created_at`           | timestamptz  | NO   | `now()`                                 |                                                                                                                                                           |
| 14  | `updated_at`           | timestamptz  | NO   | `now()`                                 |                                                                                                                                                           |
| 15  | `suggested_dashboards` | \_varchar    | YES  | `'{}'::character varying[]`             | Dashboard suggerite per pagine UNASSIGNED: array di dashboard codes. Popolato automaticamente durante page inventory. Usato per guidare il wiring futuro. |
| 16  | `name_it`              | varchar(150) | YES  | —                                       |                                                                                                                                                           |
| 17  | `name_en`              | varchar(150) | YES  | —                                       |                                                                                                                                                           |
| 18  | `description_it`       | text         | YES  | —                                       |                                                                                                                                                           |
| 19  | `description_en`       | text         | YES  | —                                       |                                                                                                                                                           |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References                   | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ---------------------------- | --------- | --------- | ----- |
| `functional_area_code` | `rbp_functional_areas(code)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_rbp_pages_area` [INDEX] · (`functional_area_code`)
- `idx_rbp_pages_status` [INDEX] · (`status`)
- `idx_rbp_pages_suggested` [INDEX] · (`suggested_dashboards`)
- `rbp_pages_code_key` [UNIQUE] · (`code`)
- `rbp_pages_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `rbp_dashboard_nav_items` via (`target_page_id`)

---

### `rbp_perspectives`

- **Tenant scoped**: no
- **Row estimate**: 3
- **Domains**: PET · RBP
- **Prisma model**: `rbp_perspectives`

#### Columns

| #   | Column           | Type         | Null | Default | Notes |
| --- | ---------------- | ------------ | ---- | ------- | ----- |
| 1   | `code`           | varchar(20)  | NO   | —       | PK    |
| 2   | `name`           | varchar(100) | NO   | —       |       |
| 3   | `description`    | text         | YES  | —       |       |
| 4   | `icon`           | varchar(50)  | YES  | —       |       |
| 5   | `color`          | varchar(7)   | YES  | —       |       |
| 6   | `sort_order`     | int4(32)     | YES  | `0`     |       |
| 7   | `created_at`     | timestamptz  | YES  | `now()` |       |
| 8   | `name_it`        | varchar(100) | YES  | —       |       |
| 9   | `name_en`        | varchar(100) | YES  | —       |       |
| 10  | `description_it` | text         | YES  | —       |       |
| 11  | `description_en` | text         | YES  | —       |       |

#### Primary Key

`(`code`)`

#### Indexes

- `rbp_perspectives_pkey` [PRIMARY] · (`code`)

#### Inverse relations (referenced by)

- `dashboard_elements` via (`perspective_code`)
- `dashboard_presets` via (`perspective_code`)
- `rbp_area_perspectives` via (`perspective_code`)
- `widget_catalog` via (`perspective_code`)

---

### `rbp_role_dashboards`

- **Tenant scoped**: no
- **Row estimate**: 23
- **Domains**: RBP
- **Prisma model**: `rbp_role_dashboards`

#### Columns

| #   | Column         | Type        | Null | Default                                           | Notes |
| --- | -------------- | ----------- | ---- | ------------------------------------------------- | ----- |
| 1   | `id`           | int4(32)    | NO   | `nextval('rbp_role_dashboards_id_seq'::regclass)` | PK    |
| 2   | `role_id`      | int4(32)    | NO   | —                                                 |       |
| 3   | `dashboard_id` | int4(32)    | NO   | —                                                 |       |
| 4   | `is_default`   | bool        | NO   | `false`                                           |       |
| 5   | `created_at`   | timestamptz | NO   | `now()`                                           |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References           | ON UPDATE | ON DELETE | Notes |
| -------------- | -------------------- | --------- | --------- | ----- |
| `dashboard_id` | `rbp_dashboards(id)` | NO ACTION | CASCADE   |       |
| `role_id`      | `rbp_roles(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_role_dashboards_default` [UNIQUE] · (`role_id`)
- `rbp_role_dashboards_pkey` [PRIMARY] · (`id`)
- `rbp_role_dashboards_role_id_dashboard_id_key` [UNIQUE] · (`role_id`, `dashboard_id`)

---

### `rbp_role_permissions`

- **Tenant scoped**: no
- **Row estimate**: 179
- **Domains**: RBP
- **Prisma model**: `rbp_role_permissions`

#### Columns

| #   | Column               | Type        | Null | Default                                            | Notes |
| --- | -------------------- | ----------- | ---- | -------------------------------------------------- | ----- |
| 1   | `id`                 | int4(32)    | NO   | `nextval('rbp_role_permissions_id_seq'::regclass)` | PK    |
| 2   | `role_id`            | int4(32)    | NO   | —                                                  |       |
| 3   | `functional_area_id` | int4(32)    | NO   | —                                                  |       |
| 4   | `can_view`           | bool        | NO   | `false`                                            |       |
| 5   | `can_create`         | bool        | NO   | `false`                                            |       |
| 6   | `can_edit`           | bool        | NO   | `false`                                            |       |
| 7   | `can_delete`         | bool        | NO   | `false`                                            |       |
| 8   | `can_approve`        | bool        | NO   | `false`                                            |       |
| 9   | `can_export`         | bool        | NO   | `false`                                            |       |
| 10  | `scope_type`         | varchar(30) | NO   | `'SELF'::character varying`                        |       |
| 11  | `conditions`         | jsonb       | YES  | `'{}'::jsonb`                                      |       |
| 12  | `created_at`         | timestamptz | NO   | `now()`                                            |       |
| 13  | `updated_at`         | timestamptz | NO   | `now()`                                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References                 | ON UPDATE | ON DELETE | Notes |
| -------------------- | -------------------------- | --------- | --------- | ----- |
| `functional_area_id` | `rbp_functional_areas(id)` | NO ACTION | CASCADE   |       |
| `role_id`            | `rbp_roles(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_role_permissions_area` [INDEX] · (`functional_area_id`)
- `idx_rbp_role_permissions_role` [INDEX] · (`role_id`)
- `rbp_role_permissions_pkey` [PRIMARY] · (`id`)
- `rbp_role_permissions_role_id_functional_area_id_key` [UNIQUE] · (`role_id`, `functional_area_id`)

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

### `rbp_scope_rules`

- **Tenant scoped**: no
- **Row estimate**: 8
- **Domains**: RBP
- **Prisma model**: `rbp_scope_rules`

#### Columns

| #   | Column         | Type        | Null | Default                                       | Notes |
| --- | -------------- | ----------- | ---- | --------------------------------------------- | ----- |
| 1   | `id`           | int4(32)    | NO   | `nextval('rbp_scope_rules_id_seq'::regclass)` | PK    |
| 2   | `role_id`      | int4(32)    | NO   | —                                             |       |
| 3   | `scope_type`   | varchar(30) | NO   | —                                             |       |
| 4   | `description`  | text        | YES  | —                                             |       |
| 5   | `sql_template` | text        | NO   | —                                             |       |
| 6   | `parameters`   | jsonb       | YES  | `'{}'::jsonb`                                 |       |
| 7   | `created_at`   | timestamptz | NO   | `now()`                                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns   | References      | ON UPDATE | ON DELETE | Notes |
| --------- | --------------- | --------- | --------- | ----- |
| `role_id` | `rbp_roles(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_scope_rules_role` [INDEX] · (`role_id`)
- `rbp_scope_rules_pkey` [PRIMARY] · (`id`)
- `rbp_scope_rules_role_id_scope_type_key` [UNIQUE] · (`role_id`, `scope_type`)

---

### `rbp_section_translations`

- **Tenant scoped**: yes
- **Row estimate**: 44
- **Domains**: RBP
- **Prisma model**: `rbp_section_translations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type        | Null | Default             | Notes |
| --- | -------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`           | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `section_code` | text        | NO   | —                   |       |
| 3   | `locale`       | text        | NO   | —                   |       |
| 4   | `label`        | text        | NO   | —                   |       |
| 5   | `tenant_id`    | uuid        | YES  | —                   |       |
| 6   | `created_at`   | timestamptz | NO   | `now()`             |       |
| 7   | `updated_at`   | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `rbp_section_translations_lookup_idx` [INDEX] · (`section_code`, `locale`)
- `rbp_section_translations_pkey` [PRIMARY] · (`id`)
- `rbp_section_translations_unique` [UNIQUE] · (`section_code`, `locale`, `tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `rbp_sections`

- **Tenant scoped**: yes
- **Row estimate**: 22
- **Domains**: RBP
- **Prisma model**: `rbp_sections`
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type         | Null | Default              | Notes |
| --- | ------------ | ------------ | ---- | -------------------- | ----- |
| 1   | `id`         | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`  | uuid         | YES  | —                    |       |
| 3   | `code`       | varchar(50)  | NO   | —                    |       |
| 4   | `label_it`   | varchar(100) | NO   | —                    |       |
| 5   | `label_en`   | varchar(100) | YES  | —                    |       |
| 6   | `sort_order` | int4(32)     | NO   | —                    |       |
| 7   | `icon`       | varchar(50)  | YES  | —                    |       |
| 8   | `created_at` | timestamptz  | YES  | `now()`              |       |
| 9   | `updated_at` | timestamptz  | YES  | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_sections_tenant` [INDEX] · (`tenant_id`, `sort_order`)
- `rbp_sections_pkey` [PRIMARY] · (`id`)
- `rbp_sections_tenant_id_code_key` [UNIQUE] · (`tenant_id`, `code`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `rbp_team_leaders`

- **Tenant scoped**: no
- **Row estimate**: 4
- **Domains**: RBP
- **Prisma model**: `rbp_team_leaders`
- **RLS**: enabled (forced)

#### Columns

| #   | Column        | Type        | Null | Default                                        | Notes |
| --- | ------------- | ----------- | ---- | ---------------------------------------------- | ----- |
| 1   | `id`          | int4(32)    | NO   | `nextval('rbp_team_leaders_id_seq'::regclass)` | PK    |
| 2   | `team_id`     | int4(32)    | NO   | —                                              |       |
| 3   | `leader_id`   | uuid        | NO   | —                                              |       |
| 4   | `assigned_at` | timestamptz | NO   | `now()`                                        |       |
| 5   | `revoked_at`  | timestamptz | YES  | —                                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `leader_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `team_id`   | `rbp_teams(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_team_leaders_team` [INDEX] · (`team_id`)
- `rbp_team_leaders_pkey` [PRIMARY] · (`id`)
- `rbp_team_leaders_team_id_leader_id_key` [UNIQUE] · (`team_id`, `leader_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(team_id IN ( SELECT rbp_teams.id
 FROM rbp_teams
WHERE (rbp_teams.tenant_id = current_tenant_id())))`
  - WITH CHECK: `(team_id IN ( SELECT rbp_teams.id
 FROM rbp_teams
WHERE (rbp_teams.tenant_id = current_tenant_id())))`

---

### `rbp_team_members`

- **Tenant scoped**: no
- **Row estimate**: 11
- **Domains**: RBP
- **Prisma model**: `rbp_team_members`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type        | Null | Default                                        | Notes |
| --- | -------------- | ----------- | ---- | ---------------------------------------------- | ----- |
| 1   | `id`           | int4(32)    | NO   | `nextval('rbp_team_members_id_seq'::regclass)` | PK    |
| 2   | `team_id`      | int4(32)    | NO   | —                                              |       |
| 3   | `employee_id`  | uuid        | NO   | —                                              |       |
| 4   | `role_in_team` | varchar(50) | NO   | `'member'::character varying`                  |       |
| 5   | `joined_at`    | timestamptz | NO   | `now()`                                        |       |
| 6   | `left_at`      | timestamptz | YES  | —                                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `team_id`     | `rbp_teams(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_team_members_team` [INDEX] · (`team_id`)
- `rbp_team_members_pkey` [PRIMARY] · (`id`)
- `rbp_team_members_team_id_employee_id_key` [UNIQUE] · (`team_id`, `employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(team_id IN ( SELECT rbp_teams.id
 FROM rbp_teams
WHERE (rbp_teams.tenant_id = current_tenant_id())))`
  - WITH CHECK: `(team_id IN ( SELECT rbp_teams.id
 FROM rbp_teams
WHERE (rbp_teams.tenant_id = current_tenant_id())))`

---

### `rbp_teams`

- **Tenant scoped**: yes
- **Row estimate**: 7
- **Domains**: RBP
- **Prisma model**: `rbp_teams`
- **RLS**: enabled (forced)

#### Columns

| #   | Column        | Type         | Null | Default                                 | Notes |
| --- | ------------- | ------------ | ---- | --------------------------------------- | ----- |
| 1   | `id`          | int4(32)     | NO   | `nextval('rbp_teams_id_seq'::regclass)` | PK    |
| 2   | `tenant_id`   | uuid         | NO   | —                                       |       |
| 3   | `code`        | varchar(50)  | NO   | —                                       |       |
| 4   | `name`        | varchar(150) | NO   | —                                       |       |
| 5   | `description` | text         | YES  | —                                       |       |
| 6   | `purpose`     | text         | YES  | —                                       |       |
| 7   | `created_by`  | uuid         | NO   | —                                       |       |
| 8   | `is_active`   | bool         | NO   | `true`                                  |       |
| 9   | `created_at`  | timestamptz  | NO   | `now()`                                 |       |
| 10  | `updated_at`  | timestamptz  | NO   | `now()`                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rbp_teams_created_by` [INDEX] · (`created_by`)
- `idx_rbp_teams_tenant` [INDEX] · (`tenant_id`)
- `rbp_teams_pkey` [PRIMARY] · (`id`)
- `rbp_teams_tenant_id_code_key` [UNIQUE] · (`tenant_id`, `code`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `rbp_team_leaders` via (`team_id`)
- `rbp_team_members` via (`team_id`)

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

### `role_permissions`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: RBP
- **Prisma model**: `role_permissions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type             | Null | Default             | Notes                                                         |
| --- | --------------- | ---------------- | ---- | ------------------- | ------------------------------------------------------------- |
| 1   | `id`            | uuid             | NO   | `gen_random_uuid()` | PK                                                            |
| 2   | `role`          | rbac_role        | NO   | —                   |                                                               |
| 3   | `permission_id` | uuid             | NO   | —                   |                                                               |
| 4   | `scope`         | permission_scope | NO   | —                   |                                                               |
| 5   | `conditions`    | jsonb            | YES  | `'{}'::jsonb`       | Additional conditions (JSON), e.g., {"department_only": true} |
| 6   | `granted_at`    | timestamptz      | YES  | `now()`             |                                                               |
| 7   | `granted_by`    | uuid             | YES  | —                   |                                                               |
| 8   | `notes`         | text             | YES  | —                   |                                                               |
| 9   | `tenant_id`     | uuid             | NO   | —                   |                                                               |
| 10  | `created_at`    | timestamptz      | YES  | `now()`             |                                                               |
| 11  | `updated_at`    | timestamptz      | YES  | `now()`             |                                                               |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `permission_id` | `permissions(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_role_permissions_permission` [INDEX] · (`permission_id`)
- `idx_role_permissions_role` [INDEX] · (`role`)
- `idx_role_permissions_scope` [INDEX] · (`scope`)
- `idx_role_permissions_tenant` [INDEX] · (`tenant_id`)
- `role_permissions_pkey` [PRIMARY] · (`id`)
- `uq_role_permission` [UNIQUE] · (`role`, `permission_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `role_skill_requirements`

- **Tenant scoped**: yes
- **Row estimate**: 90
- **Domains**: RBP
- **Prisma model**: `role_skill_requirements`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type                   | Null | Default                               | Notes                                           |
| --- | -------------------------- | ---------------------- | ---- | ------------------------------------- | ----------------------------------------------- |
| 1   | `id`                       | uuid                   | NO   | `gen_random_uuid()`                   | PK                                              |
| 2   | `tenant_id`                | uuid                   | NO   | —                                     |                                                 |
| 3   | `role_id`                  | uuid                   | NO   | —                                     |                                                 |
| 4   | `skill_id`                 | uuid                   | NO   | —                                     |                                                 |
| 5   | `required_knowledge_level` | int2(16)               | YES  | —                                     |                                                 |
| 6   | `required_skill_level`     | int2(16)               | YES  | —                                     |                                                 |
| 7   | `required_ability_level`   | int2(16)               | YES  | —                                     |                                                 |
| 8   | `required_behavior_level`  | int2(16)               | YES  | —                                     |                                                 |
| 9   | `required_attitude_level`  | int2(16)               | YES  | —                                     |                                                 |
| 10  | `min_composite_score`      | numeric(4,2)           | YES  | —                                     |                                                 |
| 11  | `importance`               | requirement_importance | NO   | `'important'::requirement_importance` | How critical this skill is for the role         |
| 12  | `weight`                   | numeric(3,2)           | YES  | `1.00`                                | Weighting factor for gap analysis scoring (0-5) |
| 13  | `is_primary`               | bool                   | YES  | `false`                               | Key/defining skill for this role                |
| 14  | `notes`                    | text                   | YES  | —                                     |                                                 |
| 15  | `source`                   | varchar(50)            | YES  | `'manual'::character varying`         |                                                 |
| 16  | `created_at`               | timestamptz            | YES  | `now()`                               |                                                 |
| 17  | `updated_at`               | timestamptz            | YES  | `now()`                               |                                                 |
| 18  | `created_by`               | uuid                   | YES  | —                                     |                                                 |
| 19  | `updated_by`               | uuid                   | YES  | —                                     |                                                 |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References           | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------------- | --------- | --------- | ----- |
| `created_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `role_id`    | `job_templates(id)`  | NO ACTION | CASCADE   |       |
| `skill_id`   | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `tenant_id`  | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `updated_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_role_skill_requirements_created_by` [INDEX] · (`created_by`)
- `idx_role_skill_requirements_updated_by` [INDEX] · (`updated_by`)
- `idx_rsr_importance` [INDEX] · (`importance`)
- `idx_rsr_primary` [INDEX] · (`role_id`)
- `idx_rsr_role` [INDEX] · (`role_id`)
- `idx_rsr_skill` [INDEX] · (`skill_id`)
- `idx_rsr_tenant_role` [INDEX] · (`tenant_id`, `role_id`)
- `role_skill_requirements_pkey` [PRIMARY] · (`id`)
- `unique_role_skill` [UNIQUE] · (`tenant_id`, `role_id`, `skill_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `sso_configurations`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: RBP
- **Prisma model**: `sso_configurations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                                                                                                          | Notes |
| --- | ------------------------ | ------------ | ---- | ---------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`                                                                                              | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                                                                                                                |       |
| 3   | `name`                   | varchar(200) | NO   | —                                                                                                                |       |
| 4   | `provider_type`          | varchar(30)  | NO   | —                                                                                                                |       |
| 5   | `saml_entity_id`         | varchar(500) | YES  | —                                                                                                                |       |
| 6   | `saml_sso_url`           | varchar(500) | YES  | —                                                                                                                |       |
| 7   | `saml_slo_url`           | varchar(500) | YES  | —                                                                                                                |       |
| 8   | `saml_certificate`       | text         | YES  | —                                                                                                                |       |
| 9   | `saml_name_id_format`    | varchar(100) | YES  | —                                                                                                                |       |
| 10  | `oidc_issuer`            | varchar(500) | YES  | —                                                                                                                |       |
| 11  | `oidc_client_id`         | varchar(200) | YES  | —                                                                                                                |       |
| 12  | `oidc_client_secret`     | varchar(500) | YES  | —                                                                                                                |       |
| 13  | `oidc_authorization_url` | varchar(500) | YES  | —                                                                                                                |       |
| 14  | `oidc_token_url`         | varchar(500) | YES  | —                                                                                                                |       |
| 15  | `oidc_userinfo_url`      | varchar(500) | YES  | —                                                                                                                |       |
| 16  | `oidc_scopes`            | text         | YES  | `'openid profile email'::text`                                                                                   |       |
| 17  | `attribute_mapping`      | jsonb        | YES  | `'{"email": "email", "lastName": "family_name", "firstName": "given_name", "employeeId": "employee_id"}'::jsonb` |       |
| 18  | `is_active`              | bool         | YES  | `false`                                                                                                          |       |
| 19  | `allow_password_login`   | bool         | YES  | `true`                                                                                                           |       |
| 20  | `auto_provision_users`   | bool         | YES  | `false`                                                                                                          |       |
| 21  | `default_role`           | varchar(50)  | YES  | `'employee'::character varying`                                                                                  |       |
| 22  | `allowed_domains`        | \_text       | YES  | —                                                                                                                |       |
| 23  | `created_by`             | uuid         | YES  | —                                                                                                                |       |
| 24  | `created_at`             | timestamp    | YES  | `now()`                                                                                                          |       |
| 25  | `updated_at`             | timestamp    | YES  | `now()`                                                                                                          |       |
| 26  | `created_by_employee_id` | uuid         | YES  | —                                                                                                                |       |
| 27  | `deleted_at`             | timestamptz  | YES  | —                                                                                                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sso_configurations_active` [INDEX] · (`id`)
- `idx_sso_configurations_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_sso_configurations_tenant` [INDEX] · (`tenant_id`)
- `sso_configurations_pkey` [PRIMARY] · (`id`)
- `sso_configurations_tenant_id_provider_type_key` [UNIQUE] · (`tenant_id`, `provider_type`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `sso_login_attempts` via (`config_id`)

---

### `sso_login_attempts`

- **Tenant scoped**: no
- **Row estimate**: 48
- **Domains**: RBP
- **Prisma model**: `sso_login_attempts`

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `config_id`     | uuid         | YES  | —                   |       |
| 3   | `email`         | varchar(200) | YES  | —                   |       |
| 4   | `status`        | varchar(30)  | YES  | —                   |       |
| 5   | `error_message` | text         | YES  | —                   |       |
| 6   | `ip_address`    | varchar(50)  | YES  | —                   |       |
| 7   | `user_agent`    | text         | YES  | —                   |       |
| 8   | `created_at`    | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References               | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------ | --------- | --------- | ----- |
| `config_id` | `sso_configurations(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sso_login_attempts_config` [INDEX] · (`config_id`)
- `sso_login_attempts_pkey` [PRIMARY] · (`id`)

---

### `user_pernr_mapping`

- **Tenant scoped**: no
- **Row estimate**: 571
- **Domains**: RBP
- **Prisma model**: `user_pernr_mapping`

#### Columns

| #   | Column         | Type        | Null | Default                                          | Notes |
| --- | -------------- | ----------- | ---- | ------------------------------------------------ | ----- |
| 1   | `id`           | int4(32)    | NO   | `nextval('user_pernr_mapping_id_seq'::regclass)` | PK    |
| 2   | `user_uuid`    | uuid        | NO   | —                                                |       |
| 3   | `pernr`        | varchar(8)  | NO   | —                                                |       |
| 4   | `bukrs`        | varchar(4)  | NO   | —                                                |       |
| 5   | `last_sync_at` | timestamp   | YES  | `now()`                                          |       |
| 6   | `sync_status`  | varchar(20) | YES  | `'synced'::character varying`                    |       |
| 7   | `created_at`   | timestamp   | YES  | `now()`                                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns | References     | ON UPDATE | ON DELETE | Notes |
| ------- | -------------- | --------- | --------- | ----- |
| `bukrs` | `t500c(bukrs)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_user_pernr_mapping_bukrs` [INDEX] · (`bukrs`)
- `user_pernr_mapping_pernr_key` [UNIQUE] · (`pernr`)
- `user_pernr_mapping_pkey` [PRIMARY] · (`id`)
- `user_pernr_mapping_user_uuid_key` [UNIQUE] · (`user_uuid`)

---

### `user_workspaces`

- **Tenant scoped**: yes
- **Row estimate**: 5
- **Domains**: RBP
- **Prisma model**: `user_workspaces`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default                                                 | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------------------------------------------- | ----- |
| 1   | `id`                       | int4(32)     | NO   | `nextval('user_workspaces_id_seq'::regclass)`           | PK    |
| 2   | `user_id`                  | uuid         | NO   | —                                                       |       |
| 3   | `tenant_id`                | uuid         | NO   | —                                                       |       |
| 4   | `name`                     | varchar(150) | NO   | `'La mia Scrivania'::character varying`                 |       |
| 5   | `description`              | text         | YES  | —                                                       |       |
| 6   | `layout_config`            | jsonb        | YES  | `'{"gap": 16, "columns": 12, "row_height": 80}'::jsonb` |       |
| 7   | `is_default`               | bool         | YES  | `false`                                                 |       |
| 8   | `is_active`                | bool         | YES  | `true`                                                  |       |
| 9   | `created_from_template_id` | int4(32)     | YES  | —                                                       |       |
| 10  | `sort_order`               | int4(32)     | YES  | `0`                                                     |       |
| 11  | `created_at`               | timestamptz  | YES  | `now()`                                                 |       |
| 12  | `updated_at`               | timestamptz  | YES  | `now()`                                                 |       |
| 13  | `dashboard_id`             | int4(32)     | YES  | —                                                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References           | ON UPDATE | ON DELETE | Notes |
| -------------- | -------------------- | --------- | --------- | ----- |
| `dashboard_id` | `rbp_dashboards(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`    | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `user_id`      | `users(id)`          | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_user_workspaces_default_per_dashboard` [UNIQUE] · (`user_id`, `dashboard_id`)
- `idx_user_workspaces_tenant` [INDEX] · (`tenant_id`)
- `idx_user_workspaces_tenant_id` [INDEX] · (`tenant_id`)
- `idx_user_workspaces_user` [INDEX] · (`user_id`)
- `idx_user_workspaces_user_id` [INDEX] · (`user_id`)
- `user_workspaces_pkey` [PRIMARY] · (`id`)
- `user_workspaces_user_tenant_dashboard_uniq` [UNIQUE] · (`user_id`, `tenant_id`, `dashboard_id`)

#### RLS Policies

- **user_workspaces_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)`
  - WITH CHECK: `(tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)`

#### Inverse relations (referenced by)

- `workspace_widgets` via (`workspace_id`)

---

### `users`

- **Tenant scoped**: no
- **Row estimate**: 274
- **Domains**: RBP
- **Prisma model**: `users`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default                     | Notes                                                                                                                                                                     |
| --- | ----------------------- | ------------ | ---- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `id`                    | uuid         | NO   | `uuid_generate_v4()`        | PK                                                                                                                                                                        |
| 2   | `username`              | varchar(100) | NO   | —                           |                                                                                                                                                                           |
| 3   | `password_hash`         | varchar(255) | YES  | —                           |                                                                                                                                                                           |
| 4   | `role`                  | varchar(50)  | YES  | `'USER'::character varying` |                                                                                                                                                                           |
| 5   | `permissions`           | \_text       | YES  | `'{}'::text[]`              |                                                                                                                                                                           |
| 6   | `is_active`             | bool         | YES  | `true`                      |                                                                                                                                                                           |
| 7   | `last_login`            | timestamp    | YES  | —                           |                                                                                                                                                                           |
| 8   | `created_at`            | timestamp    | YES  | `now()`                     |                                                                                                                                                                           |
| 9   | `updated_at`            | timestamp    | YES  | `now()`                     |                                                                                                                                                                           |
| 10  | `employee_id`           | uuid         | YES  | —                           |                                                                                                                                                                           |
| 11  | `deleted_at`            | timestamptz  | YES  | —                           |                                                                                                                                                                           |
| 12  | `totp_enabled`          | bool         | YES  | `false`                     |                                                                                                                                                                           |
| 13  | `totp_recovery_codes`   | \_text       | YES  | —                           |                                                                                                                                                                           |
| 14  | `totp_failed_attempts`  | int4(32)     | YES  | `0`                         |                                                                                                                                                                           |
| 15  | `totp_lockout_until`    | timestamptz  | YES  | —                           |                                                                                                                                                                           |
| 16  | `totp_secret_encrypted` | text         | YES  | —                           | Envelope-encrypted TOTP secret (AES-256-GCM via services/totpCrypto.ts). Base64: iv[12]\|\|tag[16]\|\|ciphertext. Replaces users.totp_secret plaintext storage (HIGH-09). |
| 17  | `palette_preference_id` | varchar(32)  | YES  | —                           | User dashboard palette override (PaletteId enum). NULL = inherit project default. Applies to /dashboard/\* routes only via DashboardPaletteApplier.                       |
| 18  | `theme_preference`      | varchar(8)   | YES  | —                           | User dashboard theme override (dark \| light). NULL = inherit project default. Coupled with palette_preference_id.                                                        |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `role`        | `rbp_roles(code)`    | CASCADE   | RESTRICT  |       |

#### Indexes

- `idx_users_active` [INDEX] · (`id`)
- `idx_users_employee_id` [INDEX] · (`employee_id`)
- `users_pkey` [PRIMARY] · (`id`)
- `users_username_key` [UNIQUE] · (`username`)

#### RLS Policies

- **user_auth_lookup_when_no_context** (SELECT · PERMISSIVE) · roles: `public`
  - USING: `(current_tenant_id() IS NULL)`
- **user_tenant_access** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((employee_id IS NULL) OR (employee_id IN ( SELECT employees_core.id
 FROM employees_core
WHERE (employees_core.tenant_id = current_tenant_id()))))`
  - WITH CHECK: `((employee_id IS NULL) OR (employee_id IN ( SELECT employees_core.id
 FROM employees_core
WHERE (employees_core.tenant_id = current_tenant_id()))))`

#### Inverse relations (referenced by)

- `ai_usage_log` via (`user_id`)
- `analysis_sessions` via (`created_by`)
- `analytics_events` via (`user_id`)
- `blueprint_results` via (`applied_by`)
- `blueprint_runs` via (`created_by`)
- `blueprint_templates` via (`created_by`)
- `career_skills` via (`validated_by`)
- `cross_entity_searches` via (`user_id`)
- `document_comments` via (`user_id`)
- `engagement_action_plans` via (`created_by` · `owner_id`)
- `engagement_feedback` via (`reviewed_by`)
- `engagement_pulse_configs` via (`created_by`)
- `engagement_survey_templates` via (`created_by`)
- `engagement_surveys` via (`created_by`)
- `enrichment_jobs` via (`requested_by_user_id`)
- `enrichment_matches` via (`reviewed_by_user_id`)
- `enrichment_merges` via (`committed_by_user_id` · `rolled_back_by_user_id`)
- `error_logs` via (`user_id`)
- `error_patterns` via (`resolved_by`)
- `news_articles` via (`author_id`)
- `news_bookmarks` via (`user_id`)
- `news_comments` via (`user_id`)
- `news_reactions` via (`user_id`)
- `news_reads` via (`user_id`)
- `notification_preferences` via (`user_id`)
- `notifications` via (`user_id`)
- `org_scenarios` via (`created_by`)
- `plugin_reviews` via (`user_id`)
- `rag_sessions` via (`user_id`)
- `rbp_teams` via (`created_by`)
- `recruiting_interview_participants` via (`user_id`)
- `recruiting_interviewer_availability` via (`user_id`)
- `semantic_search_log` via (`user_id`)
- `skill_classifications` via (`classified_by`)
- `skill_relationships` via (`validated_by`)
- `tenant_schema_version` via (`applied_by`)
- `user_workspaces` via (`user_id`)
- `whistleblowing_audit_log` via (`user_id`)
- `whistleblowing_handlers` via (`user_id`)
- `workforce_plans` via (`created_by` · `updated_by`)

---
