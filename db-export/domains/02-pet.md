# Dominio PET — Process / Enterprise / Talent

> 3 access perspectives (COO / CFO-Chief Org / CHRO)

**Tabelle in questo dominio**: 2

## Tabelle

| Tabella                                       | Rows | Tenant | RLS | FK out | Cols |
| --------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`rbp_functional_areas`](#rbpfunctionalareas) | 34   | —      | —   | 0      | 13   |
| [`rbp_perspectives`](#rbpperspectives)        | 3    | —      | —   | 0      | 11   |

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
