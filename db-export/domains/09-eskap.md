# Dominio ESKAP — ESCO + Knowledge graph Application Projection

> KG full + tenant projection

**Tabelle in questo dominio**: 31

## Tabelle

| Tabella                                                            | Rows    | Tenant | RLS | FK out | Cols |
| ------------------------------------------------------------------ | ------- | ------ | --- | ------ | ---- |
| [`cross_entity_relations`](#crossentityrelations)                  | 85      | ✓      | ✓   | 1      | 11   |
| [`cross_entity_searches`](#crossentitysearches)                    | 0       | ✓      | ✓   | 2      | 10   |
| [`esco_isco_groups`](#escoiscogroups)                              | 14      | —      | —   | 0      | 10   |
| [`esco_occupation_skills`](#escooccupationskills)                  | 126.051 | —      | —   | 2      | 5    |
| [`esco_occupations`](#escooccupations)                             | 3040    | —      | —   | 0      | 20   |
| [`esco_skill_groups`](#escoskillgroups)                            | 10      | —      | —   | 0      | 8    |
| [`esco_skill_relations`](#escoskillrelations)                      | 5818    | —      | —   | 2      | 7    |
| [`esco_skills`](#escoskills)                                       | 14.011  | —      | —   | 0      | 29   |
| [`onet_abilities`](#onetabilities)                                 | 15      | —      | —   | 0      | 7    |
| [`onet_esco_mappings`](#onetescomappings)                          | 135     | —      | —   | 2      | 10   |
| [`onet_import_jobs`](#onetimportjobs)                              | 0       | —      | —   | 0      | 10   |
| [`onet_knowledge`](#onetknowledge)                                 | 20      | —      | —   | 0      | 7    |
| [`onet_occupation_abilities`](#onetoccupationabilities)            | 215     | —      | —   | 2      | 6    |
| [`onet_occupation_knowledge`](#onetoccupationknowledge)            | 279     | —      | —   | 2      | 6    |
| [`onet_occupation_skills`](#onetoccupationskills)                  | 71      | —      | —   | 2      | 6    |
| [`onet_occupation_work_activities`](#onetoccupationworkactivities) | 218     | —      | —   | 2      | 6    |
| [`onet_occupations`](#onetoccupations)                             | 25      | —      | —   | 0      | 17   |
| [`onet_skills`](#onetskills)                                       | 35      | —      | —   | 2      | 11   |
| [`onet_work_activities`](#onetworkactivities)                      | 15      | —      | —   | 0      | 8    |
| [`ontology_categories`](#ontologycategories)                       | 9       | —      | —   | 1      | 14   |
| [`ontology_embedding_jobs`](#ontologyembeddingjobs)                | 1       | ✓      | ✓   | 1      | 17   |
| [`ontology_feedback`](#ontologyfeedback)                           | 52      | ✓      | ✓   | 2      | 9    |
| [`ontology_inference_jobs`](#ontologyinferencejobs)                | 0       | ✓      | ✓   | 1      | 12   |
| [`ontology_quality_metrics`](#ontologyqualitymetrics)              | 50      | —      | —   | 0      | 9    |
| [`ontology_skill_dimensions`](#ontologyskilldimensions)            | 25      | —      | —   | 1      | 13   |
| [`ontology_skill_relations`](#ontologyskillrelations)              | 30      | —      | —   | 2      | 15   |
| [`ontology_source_mappings`](#ontologysourcemappings)              | 40      | ✓      | ✓   | 1      | 12   |
| [`semantic_entity_index`](#semanticentityindex)                    | 4115    | ✓      | ✓   | 1      | 14   |
| [`semantic_entity_relations`](#semanticentityrelations)            | 15      | ✓      | ✓   | 1      | 10   |
| [`semantic_search_log`](#semanticsearchlog)                        | 7       | ✓      | ✓   | 2      | 12   |
| [`skill_adjacencies`](#skilladjacencies)                           | 11.634  | —      | —   | 2      | 9    |

---

### `cross_entity_relations`

- **Tenant scoped**: yes
- **Row estimate**: 85
- **Domains**: ESKAP
- **Prisma model**: `cross_entity_relations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                       | Notes |
| --- | -------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                             |       |
| 3   | `source_entity_type` | varchar(50)  | NO   | —                             |       |
| 4   | `source_entity_id`   | uuid         | NO   | —                             |       |
| 5   | `target_entity_type` | varchar(50)  | NO   | —                             |       |
| 6   | `target_entity_id`   | uuid         | NO   | —                             |       |
| 7   | `relation_type`      | varchar(50)  | NO   | —                             |       |
| 8   | `confidence_score`   | numeric(5,4) | YES  | —                             |       |
| 9   | `source`             | varchar(30)  | YES  | `'manual'::character varying` |       |
| 10  | `metadata`           | jsonb        | YES  | `'{}'::jsonb`                 |       |
| 11  | `created_at`         | timestamptz  | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `cross_entity_relations_pkey` [PRIMARY] · (`id`)
- `cross_entity_relations_tenant_id_source_entity_type_source__key` [UNIQUE] · (`tenant_id`, `source_entity_type`, `source_entity_id`, `target_entity_type`, `target_entity_id`, `relation_type`)
- `idx_cross_entity_relations_source` [INDEX] · (`source_entity_type`, `source_entity_id`)
- `idx_cross_entity_relations_target` [INDEX] · (`target_entity_type`, `target_entity_id`)
- `idx_cross_entity_relations_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **rls_cross_entity_relations_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `cross_entity_searches`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: ESKAP
- **Prisma model**: `cross_entity_searches`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type        | Null | Default             | Notes |
| --- | -------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `query_text`         | text        | NO   | —                   |       |
| 3   | `query_embedding`    | vector      | YES  | —                   |       |
| 4   | `entity_types`       | \_text      | NO   | —                   |       |
| 5   | `results_count`      | int4(32)    | YES  | —                   |       |
| 6   | `top_results`        | jsonb       | YES  | —                   |       |
| 7   | `search_duration_ms` | int4(32)    | YES  | —                   |       |
| 8   | `tenant_id`          | uuid        | NO   | —                   |       |
| 9   | `user_id`            | uuid        | YES  | —                   |       |
| 10  | `created_at`         | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |
| `user_id`   | `users(id)`   | NO ACTION | SET NULL  |       |

#### Indexes

- `cross_entity_searches_pkey` [PRIMARY] · (`id`)
- `idx_ces_created` [INDEX] · (`created_at`)
- `idx_ces_tenant` [INDEX] · (`tenant_id`)
- `idx_cross_entity_searches_user_id` [INDEX] · (`user_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `esco_isco_groups`

- **Tenant scoped**: no
- **Row estimate**: 14
- **Domains**: ESKAP
- **Prisma model**: `esco_isco_groups`

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `uri`                | varchar(500) | YES  | —                   |       |
| 3   | `code`               | varchar(20)  | NO   | —                   |       |
| 4   | `preferred_label_en` | varchar(500) | YES  | —                   |       |
| 5   | `preferred_label_it` | varchar(500) | YES  | —                   |       |
| 6   | `description_en`     | text         | YES  | —                   |       |
| 7   | `description_it`     | text         | YES  | —                   |       |
| 8   | `parent_uri`         | varchar(500) | YES  | —                   |       |
| 9   | `level`              | int4(32)     | YES  | `1`                 |       |
| 10  | `created_at`         | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `esco_isco_groups_code_key` [UNIQUE] · (`code`)
- `esco_isco_groups_pkey` [PRIMARY] · (`id`)
- `esco_isco_groups_uri_key` [UNIQUE] · (`uri`)

---

### `esco_occupation_skills`

- **Tenant scoped**: no
- **Row estimate**: 126.051
- **Domains**: ESKAP
- **Prisma model**: `esco_occupation_skills`

#### Columns

| #   | Column          | Type        | Null | Default                          | Notes |
| --- | --------------- | ----------- | ---- | -------------------------------- | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()`              | PK    |
| 2   | `occupation_id` | uuid        | NO   | —                                |       |
| 3   | `skill_id`      | uuid        | NO   | —                                |       |
| 4   | `relation_type` | varchar(50) | YES  | `'essential'::character varying` |       |
| 5   | `created_at`    | timestamptz | NO   | `now()`                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References             | ON UPDATE | ON DELETE | Notes |
| --------------- | ---------------------- | --------- | --------- | ----- |
| `occupation_id` | `esco_occupations(id)` | NO ACTION | CASCADE   |       |
| `skill_id`      | `esco_skills(id)`      | NO ACTION | RESTRICT  |       |

#### Indexes

- `esco_occupation_skills_occupation_id_skill_id_key` [UNIQUE] · (`occupation_id`, `skill_id`)
- `esco_occupation_skills_pkey` [PRIMARY] · (`id`)

---

### `esco_occupations`

- **Tenant scoped**: no
- **Row estimate**: 3040
- **Domains**: ESKAP
- **Prisma model**: `esco_occupations`

#### Columns

| #   | Column                   | Type         | Null | Default              | Notes                                                |
| --- | ------------------------ | ------------ | ---- | -------------------- | ---------------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `uuid_generate_v4()` | PK                                                   |
| 2   | `uri`                    | varchar(255) | NO   | —                    |                                                      |
| 3   | `preferred_label`        | varchar(500) | NO   | —                    |                                                      |
| 4   | `description`            | text         | YES  | —                    |                                                      |
| 5   | `isco_code`              | varchar(10)  | YES  | —                    |                                                      |
| 6   | `nace_codes`             | \_text       | YES  | —                    |                                                      |
| 7   | `created_at`             | timestamp    | YES  | `now()`              |                                                      |
| 8   | `embedding_en`           | vector       | YES  | —                    | Vector embedding of occupation description (English) |
| 9   | `embedding_it`           | vector       | YES  | —                    | Vector embedding of occupation description (Italian) |
| 10  | `embedding_model`        | varchar(100) | YES  | —                    |                                                      |
| 11  | `embedding_generated_at` | timestamptz  | YES  | —                    |                                                      |
| 12  | `preferred_label_en`     | varchar(500) | YES  | —                    |                                                      |
| 13  | `preferred_label_it`     | varchar(500) | YES  | —                    |                                                      |
| 14  | `code`                   | varchar(20)  | YES  | —                    |                                                      |
| 15  | `description_en`         | text         | YES  | —                    |                                                      |
| 16  | `description_it`         | text         | YES  | —                    |                                                      |
| 17  | `parent_uri`             | varchar(500) | YES  | —                    |                                                      |
| 18  | `level`                  | int4(32)     | YES  | `1`                  |                                                      |
| 19  | `alt_labels`             | text         | YES  | —                    |                                                      |
| 20  | `alt_labels_it`          | text         | YES  | —                    |                                                      |

#### Primary Key

`(`id`)`

#### Indexes

- `esco_occupations_pkey` [PRIMARY] · (`id`)
- `esco_occupations_uri_key` [UNIQUE] · (`uri`)
- `idx_esco_occupations_embedding_en` [INDEX] · (`embedding_en`)
- `idx_esco_occupations_embedding_it` [INDEX] · (`embedding_it`)
- `idx_esco_occupations_isco` [INDEX] · (`isco_code`)
- `idx_esco_occupations_label` [INDEX] · (`preferred_label`)

#### Inverse relations (referenced by)

- `esco_occupation_skills` via (`occupation_id`)
- `occupation_industry_classifications` via (`occupation_id`)
- `onet_esco_mappings` via (`esco_occupation_id`)
- `process_roles` via (`esco_occupation_id`)

---

### `esco_skill_groups`

- **Tenant scoped**: no
- **Row estimate**: 10
- **Domains**: ESKAP
- **Prisma model**: `esco_skill_groups`

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `uri`                | varchar(500) | NO   | —                   |       |
| 3   | `preferred_label_en` | varchar(500) | YES  | —                   |       |
| 4   | `preferred_label_it` | varchar(500) | YES  | —                   |       |
| 5   | `description_en`     | text         | YES  | —                   |       |
| 6   | `description_it`     | text         | YES  | —                   |       |
| 7   | `broader_uri`        | varchar(500) | YES  | —                   |       |
| 8   | `created_at`         | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `esco_skill_groups_pkey` [PRIMARY] · (`id`)
- `esco_skill_groups_uri_key` [UNIQUE] · (`uri`)

---

### `esco_skill_relations`

- **Tenant scoped**: no
- **Row estimate**: 5818
- **Domains**: ESKAP
- **Prisma model**: `esco_skill_relations`

#### Columns

| #   | Column              | Type         | Null | Default             | Notes |
| --- | ------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `source_skill_id`   | uuid         | NO   | —                   |       |
| 3   | `target_skill_id`   | uuid         | NO   | —                   |       |
| 4   | `relation_type`     | varchar(50)  | NO   | —                   |       |
| 5   | `created_at`        | timestamptz  | NO   | `now()`             |       |
| 6   | `skill_uri`         | varchar(500) | YES  | —                   |       |
| 7   | `related_skill_uri` | varchar(500) | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References        | ON UPDATE | ON DELETE | Notes |
| ----------------- | ----------------- | --------- | --------- | ----- |
| `source_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `target_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `esco_skill_relations_pkey` [PRIMARY] · (`id`)
- `esco_skill_relations_source_skill_id_target_skill_id_relati_key` [UNIQUE] · (`source_skill_id`, `target_skill_id`, `relation_type`)
- `idx_esco_skill_relations_related_uri` [INDEX] · (`related_skill_uri`)
- `idx_esco_skill_relations_skill_uri` [INDEX] · (`skill_uri`)

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

### `onet_abilities`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: ESKAP
- **Prisma model**: `onet_abilities`

#### Columns

| #   | Column         | Type         | Null | Default             | Notes |
| --- | -------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `element_id`   | varchar(50)  | NO   | —                   |       |
| 3   | `element_name` | varchar(500) | NO   | —                   |       |
| 4   | `description`  | text         | YES  | —                   |       |
| 5   | `category`     | varchar(100) | YES  | —                   |       |
| 6   | `created_at`   | timestamptz  | NO   | `now()`             |       |
| 7   | `updated_at`   | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `onet_abilities_element_id_key` [UNIQUE] · (`element_id`)
- `onet_abilities_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `onet_occupation_abilities` via (`ability_id`)

---

### `onet_esco_mappings`

- **Tenant scoped**: no
- **Row estimate**: 135
- **Domains**: ESKAP
- **Prisma model**: `onet_esco_mappings`

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `onet_element_id`    | varchar(50)  | NO   | —                   |       |
| 3   | `onet_element_type`  | varchar(50)  | NO   | —                   |       |
| 4   | `esco_uri`           | varchar(500) | YES  | —                   |       |
| 5   | `esco_skill_id`      | uuid         | YES  | —                   |       |
| 6   | `esco_occupation_id` | uuid         | YES  | —                   |       |
| 7   | `confidence`         | numeric(5,4) | NO   | `0.0`               |       |
| 8   | `mapping_method`     | varchar(50)  | YES  | —                   |       |
| 9   | `created_at`         | timestamptz  | NO   | `now()`             |       |
| 10  | `updated_at`         | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References             | ON UPDATE | ON DELETE | Notes |
| -------------------- | ---------------------- | --------- | --------- | ----- |
| `esco_occupation_id` | `esco_occupations(id)` | NO ACTION | RESTRICT  |       |
| `esco_skill_id`      | `esco_skills(id)`      | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_onet_esco_mappings_confidence` [INDEX] · (`confidence`)
- `idx_onet_esco_mappings_esco_occupation_id` [INDEX] · (`esco_occupation_id`)
- `idx_onet_esco_mappings_esco_skill_id` [INDEX] · (`esco_skill_id`)
- `idx_onet_esco_mappings_onet` [INDEX] · (`onet_element_id`, `onet_element_type`)
- `onet_esco_mappings_pkey` [PRIMARY] · (`id`)

---

### `onet_import_jobs`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: ESKAP
- **Prisma model**: `onet_import_jobs`

#### Columns

| #   | Column              | Type        | Null | Default                        | Notes |
| --- | ------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `import_type`       | varchar(50) | NO   | —                              |       |
| 3   | `source_version`    | varchar(50) | YES  | —                              |       |
| 4   | `status`            | varchar(20) | NO   | `'pending'::character varying` |       |
| 5   | `total_records`     | int4(32)    | YES  | `0`                            |       |
| 6   | `processed_records` | int4(32)    | YES  | `0`                            |       |
| 7   | `error_message`     | text        | YES  | —                              |       |
| 8   | `started_at`        | timestamptz | YES  | —                              |       |
| 9   | `completed_at`      | timestamptz | YES  | —                              |       |
| 10  | `created_at`        | timestamptz | NO   | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Indexes

- `onet_import_jobs_pkey` [PRIMARY] · (`id`)

---

### `onet_knowledge`

- **Tenant scoped**: no
- **Row estimate**: 20
- **Domains**: ESKAP
- **Prisma model**: `onet_knowledge`

#### Columns

| #   | Column         | Type         | Null | Default             | Notes |
| --- | -------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `element_id`   | varchar(50)  | NO   | —                   |       |
| 3   | `element_name` | varchar(500) | NO   | —                   |       |
| 4   | `description`  | text         | YES  | —                   |       |
| 5   | `domain`       | varchar(200) | YES  | —                   |       |
| 6   | `created_at`   | timestamptz  | NO   | `now()`             |       |
| 7   | `updated_at`   | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `onet_knowledge_element_id_key` [UNIQUE] · (`element_id`)
- `onet_knowledge_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `onet_occupation_knowledge` via (`knowledge_id`)

---

### `onet_occupation_abilities`

- **Tenant scoped**: no
- **Row estimate**: 215
- **Domains**: ESKAP
- **Prisma model**: `onet_occupation_abilities`

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `occupation_id` | uuid         | NO   | —                   |       |
| 3   | `ability_id`    | uuid         | NO   | —                   |       |
| 4   | `importance`    | numeric(5,2) | YES  | —                   |       |
| 5   | `level`         | numeric(5,2) | YES  | —                   |       |
| 6   | `created_at`    | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References             | ON UPDATE | ON DELETE | Notes |
| --------------- | ---------------------- | --------- | --------- | ----- |
| `ability_id`    | `onet_abilities(id)`   | NO ACTION | CASCADE   |       |
| `occupation_id` | `onet_occupations(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `onet_occupation_abilities_occupation_id_ability_id_key` [UNIQUE] · (`occupation_id`, `ability_id`)
- `onet_occupation_abilities_pkey` [PRIMARY] · (`id`)

---

### `onet_occupation_knowledge`

- **Tenant scoped**: no
- **Row estimate**: 279
- **Domains**: ESKAP
- **Prisma model**: `onet_occupation_knowledge`

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `occupation_id` | uuid         | NO   | —                   |       |
| 3   | `knowledge_id`  | uuid         | NO   | —                   |       |
| 4   | `importance`    | numeric(5,2) | YES  | —                   |       |
| 5   | `level`         | numeric(5,2) | YES  | —                   |       |
| 6   | `created_at`    | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References             | ON UPDATE | ON DELETE | Notes |
| --------------- | ---------------------- | --------- | --------- | ----- |
| `knowledge_id`  | `onet_knowledge(id)`   | NO ACTION | CASCADE   |       |
| `occupation_id` | `onet_occupations(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `onet_occupation_knowledge_occupation_id_knowledge_id_key` [UNIQUE] · (`occupation_id`, `knowledge_id`)
- `onet_occupation_knowledge_pkey` [PRIMARY] · (`id`)

---

### `onet_occupation_skills`

- **Tenant scoped**: no
- **Row estimate**: 71
- **Domains**: ESKAP
- **Prisma model**: `onet_occupation_skills`

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `occupation_id` | uuid         | NO   | —                   |       |
| 3   | `skill_id`      | uuid         | NO   | —                   |       |
| 4   | `importance`    | numeric(5,2) | YES  | —                   |       |
| 5   | `level`         | numeric(5,2) | YES  | —                   |       |
| 6   | `created_at`    | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References             | ON UPDATE | ON DELETE | Notes |
| --------------- | ---------------------- | --------- | --------- | ----- |
| `occupation_id` | `onet_occupations(id)` | NO ACTION | CASCADE   |       |
| `skill_id`      | `onet_skills(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `onet_occupation_skills_occupation_id_skill_id_key` [UNIQUE] · (`occupation_id`, `skill_id`)
- `onet_occupation_skills_pkey` [PRIMARY] · (`id`)

---

### `onet_occupation_work_activities`

- **Tenant scoped**: no
- **Row estimate**: 218
- **Domains**: ESKAP
- **Prisma model**: `onet_occupation_work_activities`

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `occupation_id`    | uuid         | NO   | —                   |       |
| 3   | `work_activity_id` | uuid         | NO   | —                   |       |
| 4   | `importance`       | numeric(5,2) | YES  | —                   |       |
| 5   | `level`            | numeric(5,2) | YES  | —                   |       |
| 6   | `created_at`       | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns            | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------ | -------------------------- | --------- | --------- | ----- |
| `occupation_id`    | `onet_occupations(id)`     | NO ACTION | CASCADE   |       |
| `work_activity_id` | `onet_work_activities(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `onet_occupation_work_activiti_occupation_id_work_activity_i_key` [UNIQUE] · (`occupation_id`, `work_activity_id`)
- `onet_occupation_work_activities_pkey` [PRIMARY] · (`id`)

---

### `onet_occupations`

- **Tenant scoped**: no
- **Row estimate**: 25
- **Domains**: ESKAP
- **Prisma model**: `onet_occupations`

#### Columns

| #   | Column                 | Type         | Null | Default             | Notes                                                                                                     |
| --- | ---------------------- | ------------ | ---- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()` | PK                                                                                                        |
| 2   | `onet_soc_code`        | varchar(20)  | NO   | —                   |                                                                                                           |
| 3   | `title`                | varchar(500) | NO   | —                   |                                                                                                           |
| 4   | `description`          | text         | YES  | —                   |                                                                                                           |
| 5   | `job_zone`             | int4(32)     | YES  | —                   |                                                                                                           |
| 6   | `related_experience`   | text         | YES  | —                   |                                                                                                           |
| 7   | `education_required`   | text         | YES  | —                   |                                                                                                           |
| 8   | `on_job_training`      | text         | YES  | —                   |                                                                                                           |
| 9   | `source_version`       | varchar(50)  | YES  | —                   |                                                                                                           |
| 10  | `created_at`           | timestamptz  | NO   | `now()`             |                                                                                                           |
| 11  | `updated_at`           | timestamptz  | NO   | `now()`             |                                                                                                           |
| 12  | `embedding_en`         | vector       | YES  | —                   |                                                                                                           |
| 13  | `title_it`             | varchar(255) | YES  | —                   | Italian title (Slice 2 i18n — see migration 206; may equal EN pending curation, see needs_translation_it) |
| 14  | `title_en`             | varchar(255) | YES  | —                   | English title (Slice 2 i18n — see migration 206)                                                          |
| 15  | `description_it`       | text         | YES  | —                   | Italian description (see needs_translation_it)                                                            |
| 16  | `description_en`       | text         | YES  | —                   | English description                                                                                       |
| 17  | `needs_translation_it` | bool         | YES  | `false`             | True when the IT value is a placeholder copied from EN and needs human translation                        |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_onet_occupations_title` [INDEX] · (`title`)
- `onet_occupations_onet_soc_code_key` [UNIQUE] · (`onet_soc_code`)
- `onet_occupations_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `onet_occupation_abilities` via (`occupation_id`)
- `onet_occupation_knowledge` via (`occupation_id`)
- `onet_occupation_skills` via (`occupation_id`)
- `onet_occupation_work_activities` via (`occupation_id`)

---

### `onet_skills`

- **Tenant scoped**: no
- **Row estimate**: 35
- **Domains**: ESKAP
- **Prisma model**: `onet_skills`

#### Columns

| #   | Column                 | Type         | Null | Default             | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `element_id`           | varchar(50)  | NO   | —                   |       |
| 3   | `element_name`         | varchar(500) | NO   | —                   |       |
| 4   | `description`          | text         | YES  | —                   |       |
| 5   | `category`             | varchar(100) | YES  | —                   |       |
| 6   | `esco_skill_id`        | uuid         | YES  | —                   |       |
| 7   | `similarity_score`     | numeric(5,4) | YES  | —                   |       |
| 8   | `created_at`           | timestamptz  | NO   | `now()`             |       |
| 9   | `updated_at`           | timestamptz  | NO   | `now()`             |       |
| 10  | `mapped_esco_skill_id` | uuid         | YES  | —                   |       |
| 11  | `mapping_confidence`   | numeric(5,4) | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References        | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id`        | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `mapped_esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_onet_skills_esco_skill_id` [INDEX] · (`esco_skill_id`)
- `idx_onet_skills_mapped_esco_skill_id` [INDEX] · (`mapped_esco_skill_id`)
- `idx_onet_skills_name` [INDEX] · (`element_name`)
- `onet_skills_element_id_key` [UNIQUE] · (`element_id`)
- `onet_skills_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `onet_occupation_skills` via (`skill_id`)

---

### `onet_work_activities`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: ESKAP
- **Prisma model**: `onet_work_activities`

#### Columns

| #   | Column              | Type         | Null | Default             | Notes |
| --- | ------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `element_id`        | varchar(50)  | NO   | —                   |       |
| 3   | `element_name`      | varchar(500) | NO   | —                   |       |
| 4   | `description`       | text         | YES  | —                   |       |
| 5   | `activity_type`     | varchar(100) | YES  | —                   |       |
| 6   | `parent_element_id` | varchar(50)  | YES  | —                   |       |
| 7   | `created_at`        | timestamptz  | NO   | `now()`             |       |
| 8   | `updated_at`        | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `onet_work_activities_element_id_key` [UNIQUE] · (`element_id`)
- `onet_work_activities_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `onet_occupation_work_activities` via (`work_activity_id`)

---

### `ontology_categories`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: ESKAP
- **Prisma model**: `ontology_categories`

#### Columns

| #   | Column           | Type         | Null | Default             | Notes |
| --- | ---------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `parent_id`      | uuid         | YES  | —                   |       |
| 3   | `code`           | varchar(50)  | NO   | —                   |       |
| 4   | `name_en`        | varchar(255) | NO   | —                   |       |
| 5   | `name_it`        | varchar(255) | YES  | —                   |       |
| 6   | `description_en` | text         | YES  | —                   |       |
| 7   | `description_it` | text         | YES  | —                   |       |
| 8   | `level`          | int4(32)     | NO   | `0`                 |       |
| 9   | `esco_pillar`    | varchar(100) | YES  | —                   |       |
| 10  | `isced_field`    | varchar(20)  | YES  | —                   |       |
| 11  | `is_active`      | bool         | YES  | `true`              |       |
| 12  | `created_at`     | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`     | timestamptz  | YES  | `now()`             |       |
| 14  | `deleted_at`     | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References                | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------- | --------- | --------- | ----- |
| `parent_id` | `ontology_categories(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ontology_categories_active` [INDEX] · (`is_active`)
- `idx_ontology_categories_level` [INDEX] · (`level`)
- `idx_ontology_categories_not_deleted` [INDEX] · (`id`)
- `idx_ontology_categories_parent` [INDEX] · (`parent_id`)
- `ontology_categories_code_unique` [UNIQUE] · (`code`)
- `ontology_categories_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `ontology_categories` via (`parent_id`)
- `tenant_custom_skills` via (`category_id`)

---

### `ontology_embedding_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: ESKAP
- **Prisma model**: `ontology_embedding_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type          | Null | Default                        | Notes |
| --- | ----------------- | ------------- | ---- | ------------------------------ | ----- |
| 1   | `id`              | uuid          | NO   | `gen_random_uuid()`            | PK    |
| 2   | `job_type`        | varchar(50)   | NO   | —                              |       |
| 3   | `target_table`    | varchar(100)  | NO   | —                              |       |
| 4   | `tenant_id`       | uuid          | NO   | —                              |       |
| 5   | `status`          | varchar(20)   | NO   | `'pending'::character varying` |       |
| 6   | `total_items`     | int4(32)      | YES  | —                              |       |
| 7   | `processed_items` | int4(32)      | YES  | `0`                            |       |
| 8   | `failed_items`    | int4(32)      | YES  | `0`                            |       |
| 9   | `provider`        | varchar(50)   | NO   | —                              |       |
| 10  | `model`           | varchar(100)  | NO   | —                              |       |
| 11  | `tokens_used`     | int4(32)      | YES  | `0`                            |       |
| 12  | `estimated_cost`  | numeric(10,4) | YES  | —                              |       |
| 13  | `started_at`      | timestamptz   | YES  | —                              |       |
| 14  | `completed_at`    | timestamptz   | YES  | —                              |       |
| 15  | `last_error`      | text          | YES  | —                              |       |
| 16  | `retry_count`     | int4(32)      | YES  | `0`                            |       |
| 17  | `created_at`      | timestamptz   | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_embedding_jobs_status` [INDEX] · (`status`)
- `idx_embedding_jobs_tenant` [INDEX] · (`tenant_id`)
- `ontology_embedding_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `ontology_feedback`

- **Tenant scoped**: yes
- **Row estimate**: 52
- **Domains**: ESKAP
- **Prisma model**: `ontology_feedback`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default             | Notes |
| --- | --------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`     | uuid        | NO   | —                   |       |
| 3   | `entity_type`   | varchar(50) | NO   | —                   |       |
| 4   | `entity_id`     | uuid        | NO   | —                   |       |
| 5   | `feedback_type` | varchar(30) | NO   | —                   |       |
| 6   | `feedback_text` | text        | YES  | —                   |       |
| 7   | `submitted_by`  | uuid        | YES  | —                   |       |
| 8   | `metadata`      | jsonb       | YES  | `'{}'::jsonb`       |       |
| 9   | `created_at`    | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References           | ON UPDATE | ON DELETE | Notes |
| -------------- | -------------------- | --------- | --------- | ----- |
| `submitted_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`    | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ontology_feedback_entity` [INDEX] · (`entity_type`, `entity_id`)
- `idx_ontology_feedback_submitted_by` [INDEX] · (`submitted_by`)
- `idx_ontology_feedback_tenant` [INDEX] · (`tenant_id`)
- `ontology_feedback_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_ontology_feedback_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `ontology_inference_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: ESKAP
- **Prisma model**: `ontology_inference_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                        | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `job_type`             | varchar(50)  | NO   | —                              |       |
| 3   | `status`               | varchar(20)  | NO   | `'pending'::character varying` |       |
| 4   | `total_pairs`          | int4(32)     | YES  | —                              |       |
| 5   | `processed_pairs`      | int4(32)     | YES  | `0`                            |       |
| 6   | `relations_found`      | int4(32)     | YES  | `0`                            |       |
| 7   | `similarity_threshold` | numeric(3,2) | YES  | `0.75`                         |       |
| 8   | `started_at`           | timestamptz  | YES  | —                              |       |
| 9   | `completed_at`         | timestamptz  | YES  | —                              |       |
| 10  | `error`                | text         | YES  | —                              |       |
| 11  | `created_at`           | timestamptz  | YES  | `now()`                        |       |
| 12  | `tenant_id`            | uuid         | NO   | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_inference_jobs_status` [INDEX] · (`status`)
- `idx_inference_jobs_tenant` [INDEX] · (`tenant_id`)
- `ontology_inference_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `ontology_quality_metrics`

- **Tenant scoped**: no
- **Row estimate**: 50
- **Domains**: ESKAP
- **Prisma model**: `ontology_quality_metrics`

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `entity_type`      | varchar(50)  | NO   | —                   |       |
| 3   | `entity_id`        | uuid         | NO   | —                   |       |
| 4   | `metric_name`      | varchar(100) | NO   | —                   |       |
| 5   | `metric_value`     | numeric(5,4) | YES  | —                   |       |
| 6   | `measurement_date` | date         | YES  | `CURRENT_DATE`      |       |
| 7   | `model_version`    | varchar(50)  | YES  | —                   |       |
| 8   | `notes`            | text         | YES  | —                   |       |
| 9   | `created_at`       | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_ontology_quality_entity` [INDEX] · (`entity_type`, `entity_id`)
- `ontology_quality_metrics_pkey` [PRIMARY] · (`id`)

---

### `ontology_skill_dimensions`

- **Tenant scoped**: no
- **Row estimate**: 25
- **Domains**: ESKAP
- **Prisma model**: `ontology_skill_dimensions`

#### Columns

| #   | Column            | Type         | Null | Default                                | Notes |
| --- | ----------------- | ------------ | ---- | -------------------------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`                    | PK    |
| 2   | `esco_skill_id`   | uuid         | NO   | —                                      |       |
| 3   | `dimension_type`  | varchar(20)  | NO   | —                                      |       |
| 4   | `description_en`  | text         | YES  | —                                      |       |
| 5   | `description_it`  | text         | YES  | —                                      |       |
| 6   | `level_scale`     | varchar(50)  | YES  | `'basic_to_expert'::character varying` |       |
| 7   | `min_level`       | int4(32)     | YES  | `1`                                    |       |
| 8   | `max_level`       | int4(32)     | YES  | `5`                                    |       |
| 9   | `embedding`       | vector       | YES  | —                                      |       |
| 10  | `embedding_model` | varchar(100) | YES  | —                                      |       |
| 11  | `is_primary`      | bool         | YES  | `false`                                |       |
| 12  | `created_at`      | timestamptz  | YES  | `now()`                                |       |
| 13  | `updated_at`      | timestamptz  | YES  | `now()`                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_ontology_dimensions_embedding` [INDEX] · (`embedding`)
- `idx_ontology_dimensions_primary` [INDEX] · (`is_primary`)
- `idx_ontology_dimensions_skill` [INDEX] · (`esco_skill_id`)
- `idx_ontology_dimensions_type` [INDEX] · (`dimension_type`)
- `ontology_dimensions_unique` [UNIQUE] · (`esco_skill_id`, `dimension_type`)
- `ontology_skill_dimensions_pkey` [PRIMARY] · (`id`)

---

### `ontology_skill_relations`

- **Tenant scoped**: no
- **Row estimate**: 30
- **Domains**: ESKAP
- **Prisma model**: `ontology_skill_relations`

#### Columns

| #   | Column            | Type         | Null | Default                         | Notes |
| --- | ----------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `source_skill_id` | uuid         | NO   | —                               |       |
| 3   | `target_skill_id` | uuid         | NO   | —                               |       |
| 4   | `relation_type`   | varchar(50)  | NO   | —                               |       |
| 5   | `strength`        | numeric(3,2) | YES  | `1.00`                          |       |
| 6   | `context`         | varchar(255) | YES  | —                               |       |
| 7   | `source`          | varchar(50)  | NO   | `'manual'::character varying`   |       |
| 8   | `confidence`      | numeric(3,2) | YES  | —                               |       |
| 9   | `model_version`   | varchar(100) | YES  | —                               |       |
| 10  | `inference_date`  | timestamptz  | YES  | —                               |       |
| 11  | `approval_status` | varchar(20)  | YES  | `'approved'::character varying` |       |
| 12  | `approved_by`     | uuid         | YES  | —                               |       |
| 13  | `approved_at`     | timestamptz  | YES  | —                               |       |
| 14  | `created_at`      | timestamptz  | YES  | `now()`                         |       |
| 15  | `updated_at`      | timestamptz  | YES  | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References        | ON UPDATE | ON DELETE | Notes |
| ----------------- | ----------------- | --------- | --------- | ----- |
| `source_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `target_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_ontology_relations_inferred` [INDEX] · (`source`)
- `idx_ontology_relations_pending` [INDEX] · (`approval_status`)
- `idx_ontology_relations_source` [INDEX] · (`source_skill_id`)
- `idx_ontology_relations_target` [INDEX] · (`target_skill_id`)
- `idx_ontology_relations_type` [INDEX] · (`relation_type`)
- `ontology_relations_unique` [UNIQUE] · (`source_skill_id`, `target_skill_id`, `relation_type`)
- `ontology_skill_relations_pkey` [PRIMARY] · (`id`)

---

### `ontology_source_mappings`

- **Tenant scoped**: yes
- **Row estimate**: 40
- **Domains**: ESKAP
- **Prisma model**: `ontology_source_mappings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                       | Notes |
| --- | ------------------ | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                             |       |
| 3   | `source_system`    | varchar(50)  | NO   | —                             |       |
| 4   | `source_id`        | varchar(200) | NO   | —                             |       |
| 5   | `source_type`      | varchar(50)  | YES  | —                             |       |
| 6   | `target_table`     | varchar(100) | NO   | —                             |       |
| 7   | `target_id`        | uuid         | NO   | —                             |       |
| 8   | `confidence_score` | numeric(5,4) | YES  | —                             |       |
| 9   | `mapping_method`   | varchar(50)  | YES  | `'manual'::character varying` |       |
| 10  | `verified`         | bool         | YES  | `false`                       |       |
| 11  | `created_at`       | timestamptz  | YES  | `now()`                       |       |
| 12  | `updated_at`       | timestamptz  | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ontology_source_mappings_source` [INDEX] · (`source_system`, `source_id`)
- `idx_ontology_source_mappings_tenant` [INDEX] · (`tenant_id`)
- `ontology_source_mappings_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_ontology_source_mappings_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `semantic_entity_index`

- **Tenant scoped**: yes
- **Row estimate**: 4115
- **Domains**: ESKAP
- **Prisma model**: `semantic_entity_index`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `entity_type`            | varchar(50)  | NO   | —                   |       |
| 4   | `entity_id`              | uuid         | NO   | —                   |       |
| 5   | `entity_name`            | varchar(500) | YES  | —                   |       |
| 6   | `entity_context`         | text         | YES  | —                   |       |
| 7   | `embedding`              | vector       | NO   | —                   |       |
| 8   | `embedding_model`        | varchar(100) | YES  | —                   |       |
| 9   | `embedding_generated_at` | timestamptz  | YES  | `now()`             |       |
| 10  | `metadata`               | jsonb        | YES  | —                   |       |
| 11  | `is_active`              | bool         | YES  | `true`              |       |
| 12  | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`             | timestamptz  | YES  | `now()`             |       |
| 14  | `deleted_at`             | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_semantic_entity_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_semantic_entity_embedding` [INDEX] · (`embedding`)
- `idx_semantic_entity_index_active` [INDEX] · (`id`)
- `idx_semantic_entity_type` [INDEX] · (`tenant_id`, `entity_type`)
- `semantic_entity_index_pkey` [PRIMARY] · (`id`)
- `uk_semantic_entity` [UNIQUE] · (`tenant_id`, `entity_type`, `entity_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `semantic_entity_relations`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: ESKAP
- **Prisma model**: `semantic_entity_relations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                   |       |
| 3   | `source_entity_type` | varchar(50)  | NO   | —                   |       |
| 4   | `source_entity_id`   | uuid         | NO   | —                   |       |
| 5   | `target_entity_type` | varchar(50)  | NO   | —                   |       |
| 6   | `target_entity_id`   | uuid         | NO   | —                   |       |
| 7   | `relation_type`      | varchar(50)  | NO   | —                   |       |
| 8   | `relation_strength`  | numeric(3,2) | YES  | `1.0`               |       |
| 9   | `metadata`           | jsonb        | YES  | —                   |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_semantic_relations_source` [INDEX] · (`tenant_id`, `source_entity_type`, `source_entity_id`)
- `idx_semantic_relations_target` [INDEX] · (`tenant_id`, `target_entity_type`, `target_entity_id`)
- `semantic_entity_relations_pkey` [PRIMARY] · (`id`)
- `uk_semantic_relation` [UNIQUE] · (`tenant_id`, `source_entity_type`, `source_entity_id`, `target_entity_type`, `target_entity_id`, `relation_type`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `semantic_search_log`

- **Tenant scoped**: yes
- **Row estimate**: 7
- **Domains**: ESKAP
- **Prisma model**: `semantic_search_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type        | Null | Default             | Notes |
| --- | -------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid        | NO   | —                   |       |
| 3   | `user_id`            | uuid        | YES  | —                   |       |
| 4   | `query_text`         | text        | NO   | —                   |       |
| 5   | `query_embedding`    | vector      | YES  | —                   |       |
| 6   | `entity_types`       | \_text      | YES  | —                   |       |
| 7   | `filters`            | jsonb       | YES  | —                   |       |
| 8   | `results_count`      | int4(32)    | YES  | —                   |       |
| 9   | `top_results`        | jsonb       | YES  | —                   |       |
| 10  | `search_duration_ms` | int4(32)    | YES  | —                   |       |
| 11  | `feedback_score`     | int4(32)    | YES  | —                   |       |
| 12  | `created_at`         | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `user_id`   | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_semantic_search_log_tenant` [INDEX] · (`tenant_id`, `created_at`)
- `idx_semantic_search_log_user_id` [INDEX] · (`user_id`)
- `semantic_search_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `skill_adjacencies`

- **Tenant scoped**: no
- **Row estimate**: 11.634
- **Domains**: SKILGRO · ESKAP
- **Prisma model**: `skill_adjacencies`

#### Columns

| #   | Column                     | Type         | Null | Default             | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `skill_id`                 | uuid         | NO   | —                   |       |
| 3   | `adjacent_skill_id`        | uuid         | NO   | —                   |       |
| 4   | `adjacency_score`          | numeric(4,3) | NO   | —                   |       |
| 5   | `adjacency_type`           | varchar(30)  | YES  | —                   |       |
| 6   | `job_posting_cooccurrence` | int4(32)     | YES  | `0`                 |       |
| 7   | `employee_cooccurrence`    | int4(32)     | YES  | `0`                 |       |
| 8   | `calculated_at`            | timestamptz  | YES  | `now()`             |       |
| 9   | `created_at`               | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References        | ON UPDATE | ON DELETE | Notes |
| ------------------- | ----------------- | --------- | --------- | ----- |
| `adjacent_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `skill_id`          | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_skill_adj_adjacent` [INDEX] · (`adjacent_skill_id`)
- `idx_skill_adj_cooccur` [INDEX] · (`job_posting_cooccurrence`)
- `idx_skill_adj_score` [INDEX] · (`adjacency_score`)
- `idx_skill_adj_skill` [INDEX] · (`skill_id`)
- `idx_skill_adj_type` [INDEX] · (`adjacency_type`)
- `skill_adjacencies_pkey` [PRIMARY] · (`id`)
- `uq_skill_adjacency` [UNIQUE] · (`skill_id`, `adjacent_skill_id`)

---
