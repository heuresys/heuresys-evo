# Dominio SKILGRO — Skill-Knowledge-Inventory-Learning-GROwth

> Learning Loop (gap → recommend → enroll → cert → reassess)

**Tabelle in questo dominio**: 45

## Tabelle

| Tabella                                                       | Rows   | Tenant | RLS | FK out | Cols |
| ------------------------------------------------------------- | ------ | ------ | --- | ------ | ---- |
| [`certification_esco_skills`](#certificationescoskills)       | 664    | —      | —   | 0      | 6    |
| [`certifications`](#certifications)                           | 88     | ✓      | ✓   | 1      | 18   |
| [`competencies`](#competencies)                               | 32     | ✓      | ✓   | 2      | 13   |
| [`competency_frameworks`](#competencyframeworks)              | 4      | ✓      | ✓   | 1      | 10   |
| [`competency_review_ratings`](#competencyreviewratings)       | 465    | ✓      | ✓   | 3      | 15   |
| [`course_enrollments`](#courseenrollments)                    | 3052   | ✓      | ✓   | 4      | 25   |
| [`course_enrollments_semantic`](#courseenrollmentssemantic)   | 20     | ✓      | ✓   | 3      | 13   |
| [`course_esco_skills`](#courseescoskills)                     | 717    | —      | —   | 1      | 8    |
| [`course_modules`](#coursemodules)                            | 564    | ✓      | ✓   | 2      | 12   |
| [`courses`](#courses)                                         | 127    | ✓      | ✓   | 2      | 33   |
| [`employee_certifications`](#employeecertifications)          | 729    | ✓      | ✓   | 4      | 17   |
| [`employee_skill_assessments`](#employeeskillassessments)     | 3140   | ✓      | ✓   | 3      | 16   |
| [`employee_skill_history`](#employeeskillhistory)             | 312    | ✓      | ✓   | 3      | 20   |
| [`employee_skill_mappings`](#employeeskillmappings)           | 1121   | ✓      | ✓   | 4      | 14   |
| [`employee_skill_profiles`](#employeeskillprofiles)           | 312    | ✓      | ✓   | 4      | 29   |
| [`employee_skills`](#employeeskills)                          | 1445   | ✓      | ✓   | 4      | 22   |
| [`extracted_skills`](#extractedskills)                        | 0      | ✓      | ✓   | 3      | 10   |
| [`import_skill_links`](#importskilllinks)                     | 0      | ✓      | ✓   | 3      | 9    |
| [`learning_bookmarks`](#learningbookmarks)                    | 43     | ✓      | ✓   | 3      | 6    |
| [`learning_content_providers`](#learningcontentproviders)     | 12     | ✓      | ✓   | 1      | 12   |
| [`learning_path_courses`](#learningpathcourses)               | 124    | ✓      | ✓   | 2      | 8    |
| [`learning_path_enrollments`](#learningpathenrollments)       | 341    | ✓      | ✓   | 4      | 13   |
| [`learning_paths`](#learningpaths)                            | 20     | ✓      | ✓   | 2      | 25   |
| [`learning_ratings`](#learningratings)                        | 396    | ✓      | ✓   | 3      | 8    |
| [`learning_recommendations`](#learningrecommendations)        | 1045   | ✓      | ✓   | 3      | 18   |
| [`module_completions`](#modulecompletions)                    | 2899   | ✓      | ✓   | 2      | 12   |
| [`rating_scales`](#ratingscales)                              | 4      | ✓      | ✓   | 1      | 13   |
| [`skill_adjacencies`](#skilladjacencies)                      | 11.634 | —      | —   | 2      | 9    |
| [`skill_aliases`](#skillaliases)                              | 80     | —      | —   | 1      | 9    |
| [`skill_classifications`](#skillclassifications)              | 7215   | —      | —   | 3      | 18   |
| [`skill_clusters`](#skillclusters)                            | 49     | —      | —   | 1      | 14   |
| [`skill_demand_metrics`](#skilldemandmetrics)                 | 200    | ✓      | ✓   | 2      | 15   |
| [`skill_development_paths`](#skilldevelopmentpaths)           | 65     | —      | —   | 1      | 13   |
| [`skill_extraction_jobs`](#skillextractionjobs)               | 31     | ✓      | ✓   | 1      | 15   |
| [`skill_gap_analyses`](#skillgapanalyses)                     | 304    | ✓      | ✓   | 2      | 28   |
| [`skill_gap_snapshots`](#skillgapsnapshots)                   | 36     | ✓      | ✓   | 2      | 10   |
| [`skill_matrices`](#skillmatrices)                            | 4      | ✓      | ✓   | 1      | 16   |
| [`skill_migration_jobs`](#skillmigrationjobs)                 | 0      | ✓      | ✓   | 1      | 12   |
| [`skill_pair_usage`](#skillpairusage)                         | 111    | ✓      | ✓   | 3      | 10   |
| [`skill_relationships`](#skillrelationships)                  | 16     | —      | —   | 3      | 12   |
| [`skill_requirements_templates`](#skillrequirementstemplates) | 8      | ✓      | ✓   | 3      | 14   |
| [`skill_supply_metrics`](#skillsupplymetrics)                 | 200    | ✓      | ✓   | 2      | 11   |
| [`skill_synonyms`](#skillsynonyms)                            | 50     | —      | —   | 1      | 7    |
| [`skill_taxonomy_extensions`](#skilltaxonomyextensions)       | 52     | ✓      | ✓   | 3      | 12   |
| [`unknown_skills`](#unknownskills)                            | 30     | ✓      | ✓   | 4      | 14   |

---

### `certification_esco_skills`

- **Tenant scoped**: no
- **Row estimate**: 664
- **Domains**: SKILGRO
- **Prisma model**: `certification_esco_skills`

#### Columns

| #   | Column                        | Type         | Null | Default             | Notes |
| --- | ----------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                          | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `certification_id`            | uuid         | YES  | —                   |       |
| 3   | `esco_skill_uri`              | varchar(255) | NO   | —                   |       |
| 4   | `skill_name`                  | varchar(255) | NO   | —                   |       |
| 5   | `proficiency_level_validated` | int4(32)     | YES  | —                   |       |
| 6   | `created_at`                  | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `certification_esco_skills_certification_id_esco_skill_uri_key` [UNIQUE] · (`certification_id`, `esco_skill_uri`)
- `certification_esco_skills_pkey` [PRIMARY] · (`id`)

---

### `certifications`

- **Tenant scoped**: yes
- **Row estimate**: 88
- **Domains**: SKILGRO
- **Prisma model**: `certifications`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                       | Type         | Null | Default             | Notes                                                  |
| --- | ---------------------------- | ------------ | ---- | ------------------- | ------------------------------------------------------ |
| 1   | `id`                         | uuid         | NO   | `gen_random_uuid()` | PK                                                     |
| 2   | `tenant_id`                  | uuid         | NO   | —                   |                                                        |
| 3   | `code`                       | varchar(50)  | NO   | —                   |                                                        |
| 4   | `name`                       | varchar(255) | NO   | —                   |                                                        |
| 5   | `name_en`                    | varchar(255) | YES  | —                   |                                                        |
| 6   | `issuing_organization`       | varchar(255) | NO   | —                   |                                                        |
| 7   | `description`                | text         | YES  | —                   |                                                        |
| 8   | `validity_months`            | int4(32)     | YES  | —                   |                                                        |
| 9   | `renewal_requirements`       | text         | YES  | —                   |                                                        |
| 10  | `verification_url`           | varchar(500) | YES  | —                   |                                                        |
| 11  | `is_internal`                | bool         | YES  | `false`             |                                                        |
| 12  | `required_for_job_templates` | \_uuid       | YES  | —                   |                                                        |
| 13  | `is_active`                  | bool         | YES  | `true`              |                                                        |
| 14  | `created_at`                 | timestamptz  | YES  | `now()`             |                                                        |
| 15  | `deleted_at`                 | timestamptz  | YES  | —                   |                                                        |
| 16  | `name_it`                    | varchar(255) | YES  | —                   | Italian name (Slice 2 i18n — see migration 206)        |
| 17  | `description_it`             | text         | YES  | —                   | Italian description (Slice 2 i18n — see migration 206) |
| 18  | `description_en`             | text         | YES  | —                   | English description (Slice 2 i18n — see migration 206) |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `certifications_pkey` [PRIMARY] · (`id`)
- `idx_certifications_active` [INDEX] · (`id`)
- `idx_certifications_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `employee_certifications` via (`certification_id`)

---

### `competencies`

- **Tenant scoped**: yes
- **Row estimate**: 32
- **Domains**: SKILGRO
- **Prisma model**: `competencies`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default             | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`             | uuid         | NO   | —                   |       |
| 3   | `framework_id`          | uuid         | NO   | —                   |       |
| 4   | `name`                  | varchar(100) | NO   | —                   |       |
| 5   | `description`           | text         | YES  | —                   |       |
| 6   | `category`              | varchar(100) | YES  | —                   |       |
| 7   | `behavioral_indicators` | jsonb        | YES  | `'[]'::jsonb`       |       |
| 8   | `weight`                | numeric(5,2) | YES  | `100`               |       |
| 9   | `sort_order`            | int4(32)     | YES  | `0`                 |       |
| 10  | `is_active`             | bool         | YES  | `true`              |       |
| 11  | `created_at`            | timestamptz  | YES  | `now()`             |       |
| 12  | `updated_at`            | timestamptz  | YES  | `now()`             |       |
| 13  | `deleted_at`            | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References                  | ON UPDATE | ON DELETE | Notes |
| -------------- | --------------------------- | --------- | --------- | ----- |
| `framework_id` | `competency_frameworks(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`    | `tenants(id)`               | NO ACTION | CASCADE   |       |

#### Indexes

- `competencies_pkey` [PRIMARY] · (`id`)
- `idx_competencies_active` [INDEX] · (`id`)
- `idx_competencies_framework` [INDEX] · (`framework_id`)
- `idx_competencies_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `competency_frameworks`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: SKILGRO
- **Prisma model**: `competency_frameworks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                     | Notes |
| --- | ---------------- | ------------ | ---- | --------------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()`         | PK    |
| 2   | `tenant_id`      | uuid         | NO   | —                           |       |
| 3   | `name`           | varchar(100) | NO   | —                           |       |
| 4   | `description`    | text         | YES  | —                           |       |
| 5   | `version`        | varchar(20)  | YES  | `'1.0'::character varying`  |       |
| 6   | `framework_type` | varchar(30)  | YES  | `'core'::character varying` |       |
| 7   | `is_active`      | bool         | YES  | `true`                      |       |
| 8   | `created_at`     | timestamptz  | YES  | `now()`                     |       |
| 9   | `updated_at`     | timestamptz  | YES  | `now()`                     |       |
| 10  | `deleted_at`     | timestamptz  | YES  | —                           |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `competency_frameworks_pkey` [PRIMARY] · (`id`)
- `idx_competency_frameworks_active` [INDEX] · (`id`)
- `idx_competency_frameworks_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `competencies` via (`framework_id`)

---

### `competency_review_ratings`

- **Tenant scoped**: yes
- **Row estimate**: 465
- **Domains**: SKILGRO
- **Prisma model**: `competency_review_ratings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default             | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`             | uuid         | NO   | —                   |       |
| 3   | `performance_review_id` | uuid         | NO   | —                   |       |
| 4   | `employee_id`           | uuid         | NO   | —                   |       |
| 5   | `competency_id`         | uuid         | YES  | —                   |       |
| 6   | `ksaba_dimension`       | varchar(20)  | YES  | —                   |       |
| 7   | `competency_name`       | varchar(100) | NO   | —                   |       |
| 8   | `self_rating`           | numeric(3,2) | YES  | —                   |       |
| 9   | `self_comment`          | text         | YES  | —                   |       |
| 10  | `self_evidence`         | \_text       | YES  | —                   |       |
| 11  | `manager_rating`        | numeric(3,2) | YES  | —                   |       |
| 12  | `manager_comment`       | text         | YES  | —                   |       |
| 13  | `weight`                | numeric(3,2) | YES  | `1.0`               |       |
| 14  | `created_at`            | timestamptz  | YES  | `now()`             |       |
| 15  | `updated_at`            | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                | ON UPDATE | ON DELETE | Notes |
| ----------------------- | ------------------------- | --------- | --------- | ----- |
| `employee_id`           | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `performance_review_id` | `performance_reviews(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`             | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `competency_review_ratings_performance_review_id_competency__key` [UNIQUE] · (`performance_review_id`, `competency_name`)
- `competency_review_ratings_pkey` [PRIMARY] · (`id`)
- `idx_competency_review_ratings_dimension` [INDEX] · (`ksaba_dimension`)
- `idx_competency_review_ratings_employee` [INDEX] · (`employee_id`)
- `idx_competency_review_ratings_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `course_enrollments`

- **Tenant scoped**: yes
- **Row estimate**: 3052
- **Domains**: SKILGRO
- **Prisma model**: `course_enrollments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                        | Type         | Null | Default                         | Notes |
| --- | ----------------------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                          | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `employee_id`                 | uuid         | YES  | —                               |       |
| 3   | `course_id`                   | uuid         | YES  | —                               |       |
| 4   | `learning_path_enrollment_id` | uuid         | YES  | —                               |       |
| 5   | `enrolled_at`                 | timestamptz  | YES  | `now()`                         |       |
| 6   | `enrolled_by`                 | uuid         | YES  | —                               |       |
| 7   | `enrollment_source`           | varchar(50)  | YES  | `'self'::character varying`     |       |
| 8   | `status`                      | varchar(20)  | YES  | `'enrolled'::character varying` |       |
| 9   | `progress_percent`            | int4(32)     | YES  | `0`                             |       |
| 10  | `started_at`                  | timestamptz  | YES  | —                               |       |
| 11  | `completed_at`                | timestamptz  | YES  | —                               |       |
| 12  | `due_date`                    | date         | YES  | —                               |       |
| 13  | `score`                       | numeric(5,2) | YES  | —                               |       |
| 14  | `passed`                      | bool         | YES  | —                               |       |
| 15  | `attempts`                    | int4(32)     | YES  | `0`                             |       |
| 16  | `time_spent_minutes`          | int4(32)     | YES  | `0`                             |       |
| 17  | `last_accessed_at`            | timestamptz  | YES  | —                               |       |
| 18  | `certificate_issued`          | bool         | YES  | `false`                         |       |
| 19  | `certificate_url`             | varchar(500) | YES  | —                               |       |
| 20  | `certificate_issued_at`       | timestamptz  | YES  | —                               |       |
| 21  | `notes`                       | text         | YES  | —                               |       |
| 22  | `created_at`                  | timestamptz  | YES  | `now()`                         |       |
| 23  | `updated_at`                  | timestamptz  | YES  | `now()`                         |       |
| 24  | `enrolled_by_employee_id`     | uuid         | YES  | —                               |       |
| 25  | `tenant_id`                   | uuid         | NO   | —                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `enrolled_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `course_id`               | `courses(id)`        | NO ACTION | CASCADE   |       |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `course_enrollments_pkey` [PRIMARY] · (`id`)
- `idx_course_enrollments_course` [INDEX] · (`course_id`)
- `idx_course_enrollments_employee` [INDEX] · (`employee_id`)
- `idx_course_enrollments_enrolled_by_employee_id` [INDEX] · (`enrolled_by_employee_id`)
- `idx_course_enrollments_status` [INDEX] · (`status`)
- `idx_course_enrollments_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `course_enrollments_semantic`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: SKILGRO
- **Prisma model**: `course_enrollments_semantic`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `enrollment_id`          | uuid         | NO   | —                   |       |
| 4   | `employee_id`            | uuid         | NO   | —                   |       |
| 5   | `course_id`              | uuid         | NO   | —                   |       |
| 6   | `enrollment_reason`      | text         | YES  | —                   |       |
| 7   | `learning_goals`         | text         | YES  | —                   |       |
| 8   | `completion_feedback`    | text         | YES  | —                   |       |
| 9   | `skills_acquired`        | text         | YES  | —                   |       |
| 10  | `context_embedding`      | vector       | YES  | —                   |       |
| 11  | `embedding_model`        | varchar(100) | YES  | —                   |       |
| 12  | `embedding_generated_at` | timestamptz  | YES  | —                   |       |
| 13  | `created_at`             | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `course_id`   | `courses(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `course_enrollments_semantic_pkey` [PRIMARY] · (`id`)
- `idx_course_enrollments_semantic_course_id` [INDEX] · (`course_id`)
- `idx_course_enrollments_semantic_embedding` [INDEX] · (`context_embedding`)
- `idx_course_enrollments_semantic_employee` [INDEX] · (`tenant_id`, `employee_id`)
- `uk_enrollment_semantic` [UNIQUE] · (`enrollment_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `course_esco_skills`

- **Tenant scoped**: no
- **Row estimate**: 717
- **Domains**: SKILGRO
- **Prisma model**: `course_esco_skills`

#### Columns

| #   | Column                     | Type         | Null | Default             | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `course_id`                | uuid         | YES  | —                   |       |
| 3   | `esco_skill_uri`           | varchar(255) | NO   | —                   |       |
| 4   | `skill_name`               | varchar(255) | NO   | —                   |       |
| 5   | `skill_type`               | varchar(50)  | YES  | —                   |       |
| 6   | `proficiency_level_gained` | int4(32)     | YES  | —                   |       |
| 7   | `is_primary`               | bool         | YES  | `false`             |       |
| 8   | `created_at`               | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `course_id` | `courses(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `course_esco_skills_pkey` [PRIMARY] · (`id`)
- `idx_course_esco_skills_course_id` [INDEX] · (`course_id`)

---

### `course_modules`

- **Tenant scoped**: yes
- **Row estimate**: 564
- **Domains**: SKILGRO
- **Prisma model**: `course_modules`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `course_id`        | uuid         | YES  | —                   |       |
| 3   | `title`            | varchar(255) | NO   | —                   |       |
| 4   | `description`      | text         | YES  | —                   |       |
| 5   | `sequence_order`   | int4(32)     | NO   | —                   |       |
| 6   | `duration_minutes` | int4(32)     | YES  | —                   |       |
| 7   | `content_type`     | varchar(50)  | YES  | —                   |       |
| 8   | `content_url`      | varchar(500) | YES  | —                   |       |
| 9   | `is_mandatory`     | bool         | YES  | `true`              |       |
| 10  | `passing_score`    | numeric(5,2) | YES  | —                   |       |
| 11  | `created_at`       | timestamptz  | YES  | `now()`             |       |
| 12  | `tenant_id`        | uuid         | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `course_id` | `courses(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `course_modules_pkey` [PRIMARY] · (`id`)
- `idx_course_modules_course_id` [INDEX] · (`course_id`)
- `idx_course_modules_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_course_modules** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `module_completions` via (`module_id`)

---

### `courses`

- **Tenant scoped**: yes
- **Row estimate**: 127
- **Domains**: SKILGRO
- **Prisma model**: `courses`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                          | Type         | Null | Default                         | Notes                                            |
| --- | ------------------------------- | ------------ | ---- | ------------------------------- | ------------------------------------------------ |
| 1   | `id`                            | uuid         | NO   | `gen_random_uuid()`             | PK                                               |
| 2   | `tenant_id`                     | uuid         | NO   | —                               |                                                  |
| 3   | `code`                          | varchar(50)  | NO   | —                               |                                                  |
| 4   | `title`                         | varchar(255) | NO   | —                               |                                                  |
| 5   | `title_en`                      | varchar(255) | YES  | —                               |                                                  |
| 6   | `description`                   | text         | YES  | —                               |                                                  |
| 7   | `description_en`                | text         | YES  | —                               |                                                  |
| 8   | `course_type`                   | varchar(50)  | NO   | `'online'::character varying`   |                                                  |
| 9   | `category`                      | varchar(100) | YES  | —                               |                                                  |
| 10  | `duration_hours`                | numeric(6,2) | YES  | —                               |                                                  |
| 11  | `skill_level`                   | varchar(20)  | YES  | `'beginner'::character varying` |                                                  |
| 12  | `provider`                      | varchar(100) | YES  | —                               |                                                  |
| 13  | `provider_course_id`            | varchar(100) | YES  | —                               |                                                  |
| 14  | `provider_url`                  | varchar(500) | YES  | —                               |                                                  |
| 15  | `thumbnail_url`                 | varchar(500) | YES  | —                               |                                                  |
| 16  | `video_url`                     | varchar(500) | YES  | —                               |                                                  |
| 17  | `is_mandatory`                  | bool         | YES  | `false`                         |                                                  |
| 18  | `is_certification`              | bool         | YES  | `false`                         |                                                  |
| 19  | `certification_validity_months` | int4(32)     | YES  | —                               |                                                  |
| 20  | `max_enrollments`               | int4(32)     | YES  | —                               |                                                  |
| 21  | `language`                      | varchar(10)  | YES  | `'it'::character varying`       |                                                  |
| 22  | `tags`                          | \_text       | YES  | —                               |                                                  |
| 23  | `prerequisites`                 | \_uuid       | YES  | —                               |                                                  |
| 24  | `status`                        | varchar(20)  | YES  | `'draft'::character varying`    |                                                  |
| 25  | `published_at`                  | timestamptz  | YES  | —                               |                                                  |
| 26  | `created_by`                    | uuid         | YES  | —                               |                                                  |
| 27  | `created_at`                    | timestamptz  | YES  | `now()`                         |                                                  |
| 28  | `updated_at`                    | timestamptz  | YES  | `now()`                         |                                                  |
| 29  | `created_by_employee_id`        | uuid         | YES  | —                               |                                                  |
| 30  | `embedding_en`                  | vector       | YES  | —                               | Vector embedding of course description (English) |
| 31  | `embedding_it`                  | vector       | YES  | —                               | Vector embedding of course description (Italian) |
| 32  | `embedding_model`               | varchar(100) | YES  | —                               |                                                  |
| 33  | `embedding_generated_at`        | timestamptz  | YES  | —                               |                                                  |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                                            | References           | ON UPDATE | ON DELETE | Notes |
| -------------------------------------------------- | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id`                           | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`, `tenant_id`, `tenant_id`, `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `courses_pkey` [PRIMARY] · (`id`)
- `idx_courses_created_by` [INDEX] · (`created_by_employee_id`)
- `idx_courses_embedding_en` [INDEX] · (`embedding_en`)
- `idx_courses_embedding_it` [INDEX] · (`embedding_it`)
- `idx_courses_status` [INDEX] · (`status`)
- `idx_courses_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `compliance_training_requirements` via (`course_id`)
- `course_enrollments` via (`course_id`)
- `course_enrollments_semantic` via (`course_id`)
- `course_esco_skills` via (`course_id`)
- `course_modules` via (`course_id`)
- `employee_training_records` via (`course_id`)
- `job_title_courses` via (`course_id`)
- `learning_bookmarks` via (`course_id`)
- `learning_path_courses` via (`course_id`)
- `learning_ratings` via (`course_id`)
- `learning_recommendations` via (`course_id`)

---

### `employee_certifications`

- **Tenant scoped**: yes
- **Row estimate**: 729
- **Domains**: SKILGRO
- **Prisma model**: `employee_certifications`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                           | Notes |
| --- | ------------------------- | ------------ | ---- | --------------------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`               | PK    |
| 2   | `employee_id`             | uuid         | YES  | —                                 |       |
| 3   | `certification_id`        | uuid         | YES  | —                                 |       |
| 4   | `credential_id`           | varchar(100) | YES  | —                                 |       |
| 5   | `issued_date`             | date         | NO   | —                                 |       |
| 6   | `expiry_date`             | date         | YES  | —                                 |       |
| 7   | `status`                  | varchar(20)  | YES  | `'active'::character varying`     |       |
| 8   | `credential_url`          | varchar(500) | YES  | —                                 |       |
| 9   | `verification_status`     | varchar(20)  | YES  | `'unverified'::character varying` |       |
| 10  | `verified_by`             | uuid         | YES  | —                                 |       |
| 11  | `verified_at`             | timestamptz  | YES  | —                                 |       |
| 12  | `document_url`            | varchar(500) | YES  | —                                 |       |
| 13  | `notes`                   | text         | YES  | —                                 |       |
| 14  | `created_at`              | timestamptz  | YES  | `now()`                           |       |
| 15  | `updated_at`              | timestamptz  | YES  | `now()`                           |       |
| 16  | `verified_by_employee_id` | uuid         | YES  | —                                 |       |
| 17  | `tenant_id`               | uuid         | NO   | —                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `verified_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `certification_id`        | `certifications(id)` | NO ACTION | SET NULL  |       |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `employee_certifications_pkey` [PRIMARY] · (`id`)
- `idx_employee_certifications_certification_id` [INDEX] · (`certification_id`)
- `idx_employee_certifications_employee` [INDEX] · (`employee_id`)
- `idx_employee_certifications_status` [INDEX] · (`status`)
- `idx_employee_certifications_tenant` [INDEX] · (`tenant_id`)
- `idx_employee_certifications_verified_by_employee_id` [INDEX] · (`verified_by_employee_id`)

#### RLS Policies

- **tenant_isolation_employee_certifications** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `employee_skill_assessments`

- **Tenant scoped**: yes
- **Row estimate**: 3140
- **Domains**: SKILGRO
- **Prisma model**: `employee_skill_assessments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `employee_id`         | uuid         | NO   | —                   |       |
| 3   | `tenant_job_skill_id` | uuid         | YES  | —                   |       |
| 4   | `esco_skill_uri`      | varchar(255) | YES  | —                   |       |
| 5   | `skill_name`          | varchar(255) | NO   | —                   |       |
| 6   | `assessed_level`      | int4(32)     | NO   | —                   |       |
| 7   | `required_level`      | int4(32)     | YES  | —                   |       |
| 8   | `gap`                 | int4(32)     | YES  | —                   |       |
| 9   | `assessment_date`     | date         | NO   | —                   |       |
| 10  | `assessed_by`         | uuid         | YES  | —                   |       |
| 11  | `assessment_method`   | varchar(50)  | YES  | —                   |       |
| 12  | `evidence_notes`      | text         | YES  | —                   |       |
| 13  | `certification_url`   | varchar(255) | YES  | —                   |       |
| 14  | `created_at`          | timestamptz  | YES  | `now()`             |       |
| 15  | `updated_at`          | timestamptz  | YES  | `now()`             |       |
| 16  | `tenant_id`           | uuid         | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References              | ON UPDATE | ON DELETE | Notes |
| --------------------- | ----------------------- | --------- | --------- | ----- |
| `tenant_job_skill_id` | `tenant_job_skills(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`           | `tenants(id)`           | NO ACTION | CASCADE   |       |
| `employee_id`         | `employees_core(id)`    | NO ACTION | CASCADE   |       |

#### Indexes

- `employee_skill_assessments_pkey` [PRIMARY] · (`id`)
- `idx_emp_skills_date` [INDEX] · (`assessment_date`)
- `idx_emp_skills_emp_skillname` [INDEX] · (`employee_id`, `skill_name`)
- `idx_emp_skills_employee` [INDEX] · (`employee_id`)
- `idx_emp_skills_esco` [INDEX] · (`esco_skill_uri`)
- `idx_emp_skills_gap` [INDEX] · (`gap`)
- `idx_emp_skills_job_skill` [INDEX] · (`tenant_job_skill_id`)
- `idx_employee_skill_assessments_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_employee_skill_assessments** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `employee_skill_history`

- **Tenant scoped**: yes
- **Row estimate**: 312
- **Domains**: SKILGRO
- **Prisma model**: `employee_skill_history`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default             | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `profile_id`               | uuid         | NO   | —                   |       |
| 3   | `previous_knowledge_level` | int2(16)     | YES  | —                   |       |
| 4   | `previous_skill_level`     | int2(16)     | YES  | —                   |       |
| 5   | `previous_ability_level`   | int2(16)     | YES  | —                   |       |
| 6   | `previous_behavior_level`  | int2(16)     | YES  | —                   |       |
| 7   | `previous_attitude_level`  | int2(16)     | YES  | —                   |       |
| 8   | `previous_composite_score` | numeric(4,2) | YES  | —                   |       |
| 9   | `new_knowledge_level`      | int2(16)     | YES  | —                   |       |
| 10  | `new_skill_level`          | int2(16)     | YES  | —                   |       |
| 11  | `new_ability_level`        | int2(16)     | YES  | —                   |       |
| 12  | `new_behavior_level`       | int2(16)     | YES  | —                   |       |
| 13  | `new_attitude_level`       | int2(16)     | YES  | —                   |       |
| 14  | `new_composite_score`      | numeric(4,2) | YES  | —                   |       |
| 15  | `change_type`              | varchar(50)  | NO   | —                   |       |
| 16  | `change_reason`            | text         | YES  | —                   |       |
| 17  | `changed_by`               | uuid         | YES  | —                   |       |
| 18  | `changed_at`               | timestamptz  | YES  | `now()`             |       |
| 19  | `created_at`               | timestamptz  | YES  | `now()`             |       |
| 20  | `tenant_id`                | uuid         | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References                    | ON UPDATE | ON DELETE | Notes |
| ------------ | ----------------------------- | --------- | --------- | ----- |
| `changed_by` | `employees_core(id)`          | NO ACTION | SET NULL  |       |
| `profile_id` | `employee_skill_profiles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`                 | NO ACTION | CASCADE   |       |

#### Indexes

- `employee_skill_history_pkey` [PRIMARY] · (`id`)
- `idx_employee_skill_history_changed_by` [INDEX] · (`changed_by`)
- `idx_employee_skill_history_tenant` [INDEX] · (`tenant_id`)
- `idx_esh_changed_at` [INDEX] · (`changed_at`)
- `idx_esh_profile` [INDEX] · (`profile_id`)

#### RLS Policies

- **tenant_isolation_employee_skill_history** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `employee_skill_mappings`

- **Tenant scoped**: yes
- **Row estimate**: 1121
- **Domains**: SKILGRO
- **Prisma model**: `employee_skill_mappings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default             | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                   |       |
| 3   | `employee_id`             | uuid         | NO   | —                   |       |
| 4   | `original_text`           | text         | NO   | —                   |       |
| 5   | `esco_skill_id`           | uuid         | YES  | —                   |       |
| 6   | `mapping_confidence`      | numeric(3,2) | YES  | —                   |       |
| 7   | `mapping_method`          | varchar(50)  | YES  | —                   |       |
| 8   | `proficiency_level`       | int4(32)     | YES  | —                   |       |
| 9   | `years_experience`        | numeric(4,1) | YES  | —                   |       |
| 10  | `verified_by`             | uuid         | YES  | —                   |       |
| 11  | `verified_at`             | timestamptz  | YES  | —                   |       |
| 12  | `created_at`              | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`              | timestamptz  | YES  | `now()`             |       |
| 14  | `verified_by_employee_id` | uuid         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `esco_skill_id`           | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `verified_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `employee_skill_mappings_pkey` [PRIMARY] · (`id`)
- `employee_skill_mappings_tenant_id_employee_id_original_text_key` [UNIQUE] · (`tenant_id`, `employee_id`, `original_text`)
- `idx_employee_skill_mappings_esco` [INDEX] · (`esco_skill_id`)
- `idx_employee_skill_mappings_tenant` [INDEX] · (`tenant_id`)
- `idx_employee_skill_mappings_verified_by_employee_id` [INDEX] · (`verified_by_employee_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `employee_skill_profiles`

- **Tenant scoped**: yes
- **Row estimate**: 312
- **Domains**: SKILGRO
- **Prisma model**: `employee_skill_profiles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type                      | Null | Default                                 | Notes                                                    |
| --- | ------------------------- | ------------------------- | ---- | --------------------------------------- | -------------------------------------------------------- |
| 1   | `id`                      | uuid                      | NO   | `gen_random_uuid()`                     | PK                                                       |
| 2   | `tenant_id`               | uuid                      | NO   | —                                       |                                                          |
| 3   | `employee_id`             | uuid                      | NO   | —                                       |                                                          |
| 4   | `skill_id`                | uuid                      | NO   | —                                       |                                                          |
| 5   | `knowledge_level`         | int2(16)                  | YES  | `0`                                     | K - Theoretical understanding (0-5)                      |
| 6   | `skill_level`             | int2(16)                  | YES  | `0`                                     | S - Practical application ability (0-5)                  |
| 7   | `ability_level`           | int2(16)                  | YES  | `0`                                     | A - Cognitive/physical capacity (0-5)                    |
| 8   | `behavior_level`          | int2(16)                  | YES  | `0`                                     | B - Observable actions/habits (0-5)                      |
| 9   | `attitude_level`          | int2(16)                  | YES  | `0`                                     | A - Mindset/disposition (0-5)                            |
| 10  | `composite_score`         | numeric(4,2)              | YES  | `0.00`                                  | Weighted average of KSABA (default: K20 S30 A25 B15 A10) |
| 11  | `source`                  | skill_source_type         | NO   | `'self_declaration'::skill_source_type` |                                                          |
| 12  | `source_description`      | text                      | YES  | —                                       |                                                          |
| 13  | `acquired_date`           | date                      | YES  | —                                       |                                                          |
| 14  | `last_demonstrated`       | date                      | YES  | —                                       |                                                          |
| 15  | `evidence_type`           | varchar(50)               | YES  | —                                       |                                                          |
| 16  | `evidence_id`             | uuid                      | YES  | —                                       |                                                          |
| 17  | `evidence_url`            | text                      | YES  | —                                       |                                                          |
| 18  | `evidence_notes`          | text                      | YES  | —                                       |                                                          |
| 19  | `verification_status`     | skill_verification_status | YES  | `'pending'::skill_verification_status`  |                                                          |
| 20  | `verified_by`             | uuid                      | YES  | —                                       |                                                          |
| 21  | `verified_at`             | timestamptz               | YES  | —                                       |                                                          |
| 22  | `verification_notes`      | text                      | YES  | —                                       |                                                          |
| 23  | `verification_expires_at` | date                      | YES  | —                                       |                                                          |
| 24  | `confidence_score`        | numeric(4,3)              | YES  | `0.500`                                 |                                                          |
| 25  | `is_primary`              | bool                      | YES  | `false`                                 |                                                          |
| 26  | `is_target`               | bool                      | YES  | `false`                                 |                                                          |
| 27  | `target_level`            | int2(16)                  | YES  | —                                       |                                                          |
| 28  | `created_at`              | timestamptz               | YES  | `now()`                                 |                                                          |
| 29  | `updated_at`              | timestamptz               | YES  | `now()`                                 |                                                          |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `skill_id`    | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `verified_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `employee_skill_profiles_pkey` [PRIMARY] · (`id`)
- `idx_employee_skill_profiles_verified` [INDEX] · (`verified_by`)
- `idx_esp_composite` [INDEX] · (`composite_score`)
- `idx_esp_employee` [INDEX] · (`employee_id`)
- `idx_esp_pending_verification` [INDEX] · (`tenant_id`, `verification_status`)
- `idx_esp_primary` [INDEX] · (`employee_id`)
- `idx_esp_skill` [INDEX] · (`skill_id`)
- `idx_esp_source` [INDEX] · (`source`)
- `idx_esp_target` [INDEX] · (`employee_id`)
- `idx_esp_tenant_employee` [INDEX] · (`tenant_id`, `employee_id`)
- `idx_esp_verification` [INDEX] · (`verification_status`)
- `unique_employee_skill` [UNIQUE] · (`tenant_id`, `employee_id`, `skill_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `employee_skill_history` via (`profile_id`)

---

### `employee_skills`

- **Tenant scoped**: yes
- **Row estimate**: 1445
- **Domains**: SKILGRO
- **Prisma model**: `employee_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                         | Type         | Null | Default                                | Notes |
| --- | ------------------------------ | ------------ | ---- | -------------------------------------- | ----- |
| 1   | `id`                           | uuid         | NO   | `gen_random_uuid()`                    | PK    |
| 2   | `tenant_id`                    | uuid         | NO   | —                                      |       |
| 3   | `employee_id`                  | uuid         | NO   | —                                      |       |
| 4   | `esco_skill_id`                | uuid         | YES  | —                                      |       |
| 5   | `custom_skill_name`            | varchar(255) | YES  | —                                      |       |
| 6   | `proficiency_level`            | int4(32)     | YES  | —                                      |       |
| 7   | `proficiency_label`            | varchar(50)  | YES  | —                                      |       |
| 8   | `years_experience`             | numeric(4,1) | YES  | —                                      |       |
| 9   | `is_primary`                   | bool         | YES  | `false`                                |       |
| 10  | `is_verified`                  | bool         | YES  | `false`                                |       |
| 11  | `verified_by`                  | uuid         | YES  | —                                      |       |
| 12  | `verified_at`                  | timestamptz  | YES  | —                                      |       |
| 13  | `source`                       | varchar(50)  | YES  | `'self_assessment'::character varying` |       |
| 14  | `confidence_score`             | numeric(3,2) | YES  | —                                      |       |
| 15  | `last_used_at`                 | date         | YES  | —                                      |       |
| 16  | `notes`                        | text         | YES  | —                                      |       |
| 17  | `created_at`                   | timestamptz  | YES  | `now()`                                |       |
| 18  | `updated_at`                   | timestamptz  | YES  | `now()`                                |       |
| 19  | `verified_by_employee_id`      | uuid         | YES  | —                                      |       |
| 20  | `primary_category`             | varchar(20)  | YES  | —                                      |       |
| 21  | `cognitive_level_achieved`     | int4(32)     | YES  | —                                      |       |
| 22  | `transferability_demonstrated` | varchar(20)  | YES  | —                                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `esco_skill_id`           | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `verified_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `employee_skills_pkey` [PRIMARY] · (`id`)
- `idx_employee_skills_employee` [INDEX] · (`employee_id`)
- `idx_employee_skills_esco` [INDEX] · (`esco_skill_id`)
- `idx_employee_skills_proficiency` [INDEX] · (`proficiency_level`)
- `idx_employee_skills_tenant` [INDEX] · (`tenant_id`)
- `idx_employee_skills_tenant_employee` [INDEX] · (`tenant_id`, `employee_id`)
- `idx_employee_skills_verified` [INDEX] · (`verified_by_employee_id`)

#### RLS Policies

- **employee_skills_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `extracted_skills`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SKILGRO
- **Prisma model**: `extracted_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                   |       |
| 3   | `job_posting_id`     | uuid         | NO   | —                   |       |
| 4   | `raw_text`           | text         | NO   | —                   |       |
| 5   | `esco_skill_id`      | uuid         | YES  | —                   |       |
| 6   | `mapping_confidence` | numeric(3,2) | YES  | —                   |       |
| 7   | `is_required`        | bool         | YES  | `true`              |       |
| 8   | `mention_count`      | int4(32)     | YES  | `1`                 |       |
| 9   | `context_snippet`    | text         | YES  | —                   |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References             | ON UPDATE | ON DELETE | Notes |
| ---------------- | ---------------------- | --------- | --------- | ----- |
| `esco_skill_id`  | `esco_skills(id)`      | NO ACTION | RESTRICT  |       |
| `job_posting_id` | `job_postings_raw(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`      | `tenants(id)`          | NO ACTION | CASCADE   |       |

#### Indexes

- `extracted_skills_pkey` [PRIMARY] · (`id`)
- `idx_extracted_skills_esco` [INDEX] · (`esco_skill_id`)
- `idx_extracted_skills_posting` [INDEX] · (`job_posting_id`)
- `idx_extracted_skills_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `import_skill_links`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SKILGRO · DGOV
- **Prisma model**: `import_skill_links`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default                     | Notes |
| --- | --------------- | ------------ | ---- | --------------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`         | PK    |
| 2   | `import_job_id` | uuid         | NO   | —                           |       |
| 3   | `tenant_id`     | uuid         | NO   | —                           |       |
| 4   | `input_text`    | varchar(500) | NO   | —                           |       |
| 5   | `esco_skill_id` | uuid         | YES  | —                           |       |
| 6   | `similarity`    | numeric(5,4) | YES  | —                           |       |
| 7   | `confidence`    | varchar(10)  | NO   | `'none'::character varying` |       |
| 8   | `accepted`      | bool         | YES  | —                           |       |
| 9   | `created_at`    | timestamptz  | NO   | `now()`                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `import_job_id` | `import_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_import_skill_links_esco_skill_id` [INDEX] · (`esco_skill_id`)
- `idx_import_skill_links_job` [INDEX] · (`import_job_id`)
- `idx_import_skill_links_tenant` [INDEX] · (`tenant_id`)
- `import_skill_links_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `learning_bookmarks`

- **Tenant scoped**: yes
- **Row estimate**: 43
- **Domains**: SKILGRO
- **Prisma model**: `learning_bookmarks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type        | Null | Default             | Notes |
| --- | ------------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`               | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `employee_id`      | uuid        | YES  | —                   |       |
| 3   | `course_id`        | uuid        | YES  | —                   |       |
| 4   | `learning_path_id` | uuid        | YES  | —                   |       |
| 5   | `created_at`       | timestamptz | YES  | `now()`             |       |
| 6   | `tenant_id`        | uuid        | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `course_id`   | `courses(id)`        | NO ACTION | SET NULL  |       |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_learning_bookmarks_course_id` [INDEX] · (`course_id`)
- `idx_learning_bookmarks_employee_id` [INDEX] · (`employee_id`)
- `idx_learning_bookmarks_tenant` [INDEX] · (`tenant_id`)
- `learning_bookmarks_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_learning_bookmarks** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `learning_content_providers`

- **Tenant scoped**: yes
- **Row estimate**: 12
- **Domains**: SKILGRO
- **Prisma model**: `learning_content_providers`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default             | Notes |
| --- | ------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                   |       |
| 3   | `provider_name`     | varchar(100) | NO   | —                   |       |
| 4   | `provider_type`     | varchar(50)  | YES  | —                   |       |
| 5   | `api_endpoint`      | varchar(500) | YES  | —                   |       |
| 6   | `api_key_encrypted` | varchar(500) | YES  | —                   |       |
| 7   | `sync_enabled`      | bool         | YES  | `false`             |       |
| 8   | `last_sync_at`      | timestamptz  | YES  | —                   |       |
| 9   | `config`            | jsonb        | YES  | —                   |       |
| 10  | `is_active`         | bool         | YES  | `true`              |       |
| 11  | `created_at`        | timestamptz  | YES  | `now()`             |       |
| 12  | `deleted_at`        | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_learning_content_providers_active` [INDEX] · (`id`)
- `idx_learning_content_providers_tenant_id` [INDEX] · (`tenant_id`)
- `learning_content_providers_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `learning_path_courses`

- **Tenant scoped**: yes
- **Row estimate**: 124
- **Domains**: SKILGRO
- **Prisma model**: `learning_path_courses`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default             | Notes |
| --- | ------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `learning_path_id`  | uuid        | YES  | —                   |       |
| 3   | `course_id`         | uuid        | YES  | —                   |       |
| 4   | `sequence_order`    | int4(32)    | NO   | —                   |       |
| 5   | `is_mandatory`      | bool        | YES  | `true`              |       |
| 6   | `unlock_after_days` | int4(32)    | YES  | `0`                 |       |
| 7   | `created_at`        | timestamptz | YES  | `now()`             |       |
| 8   | `tenant_id`         | uuid        | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |
| `course_id` | `courses(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_learning_path_courses_course_id` [INDEX] · (`course_id`)
- `idx_learning_path_courses_tenant` [INDEX] · (`tenant_id`)
- `learning_path_courses_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_learning_path_courses** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `learning_path_enrollments`

- **Tenant scoped**: yes
- **Row estimate**: 341
- **Domains**: SKILGRO
- **Prisma model**: `learning_path_enrollments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type        | Null | Default                         | Notes |
| --- | ------------------------- | ----------- | ---- | ------------------------------- | ----- |
| 1   | `id`                      | uuid        | NO   | `gen_random_uuid()`             | PK    |
| 2   | `employee_id`             | uuid        | YES  | —                               |       |
| 3   | `learning_path_id`        | uuid        | YES  | —                               |       |
| 4   | `enrolled_at`             | timestamptz | YES  | `now()`                         |       |
| 5   | `enrolled_by`             | uuid        | YES  | —                               |       |
| 6   | `status`                  | varchar(20) | YES  | `'enrolled'::character varying` |       |
| 7   | `progress_percent`        | int4(32)    | YES  | `0`                             |       |
| 8   | `started_at`              | timestamptz | YES  | —                               |       |
| 9   | `completed_at`            | timestamptz | YES  | —                               |       |
| 10  | `due_date`                | date        | YES  | —                               |       |
| 11  | `created_at`              | timestamptz | YES  | `now()`                         |       |
| 12  | `enrolled_by_employee_id` | uuid        | YES  | —                               |       |
| 13  | `tenant_id`               | uuid        | NO   | —                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `learning_path_id`        | `learning_paths(id)` | NO ACTION | CASCADE   |       |
| `enrolled_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_learning_path_enroll_emp` [INDEX] · (`employee_id`)
- `idx_learning_path_enroll_path` [INDEX] · (`learning_path_id`)
- `idx_learning_path_enrollments_enrolled_by_employee_id` [INDEX] · (`enrolled_by_employee_id`)
- `idx_learning_path_enrollments_tenant_id` [INDEX] · (`tenant_id`)
- `learning_path_enrollments_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `learning_paths`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: SKILGRO
- **Prisma model**: `learning_paths`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default                       | Notes                                                                 |
| --- | -------------------------- | ------------ | ---- | ----------------------------- | --------------------------------------------------------------------- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()`           | PK                                                                    |
| 2   | `tenant_id`                | uuid         | NO   | —                             |                                                                       |
| 3   | `code`                     | varchar(50)  | NO   | —                             |                                                                       |
| 4   | `title`                    | varchar(255) | NO   | —                             |                                                                       |
| 5   | `title_en`                 | varchar(255) | YES  | —                             |                                                                       |
| 6   | `description`              | text         | YES  | —                             |                                                                       |
| 7   | `target_role`              | varchar(100) | YES  | —                             |                                                                       |
| 8   | `target_job_template_id`   | uuid         | YES  | —                             |                                                                       |
| 9   | `estimated_duration_hours` | numeric(6,2) | YES  | —                             |                                                                       |
| 10  | `skill_level`              | varchar(20)  | YES  | —                             |                                                                       |
| 11  | `path_type`                | varchar(50)  | YES  | `'career'::character varying` |                                                                       |
| 12  | `is_active`                | bool         | YES  | `true`                        |                                                                       |
| 13  | `is_mandatory`             | bool         | YES  | `false`                       |                                                                       |
| 14  | `created_by`               | uuid         | YES  | —                             |                                                                       |
| 15  | `created_at`               | timestamptz  | YES  | `now()`                       |                                                                       |
| 16  | `updated_at`               | timestamptz  | YES  | `now()`                       |                                                                       |
| 17  | `created_by_employee_id`   | uuid         | YES  | —                             |                                                                       |
| 18  | `embedding`                | vector       | YES  | —                             | Semantic embedding of learning path (title, description, target role) |
| 19  | `embedding_text_hash`      | varchar(64)  | YES  | —                             |                                                                       |
| 20  | `embedding_model`          | varchar(100) | YES  | —                             |                                                                       |
| 21  | `embedding_generated_at`   | timestamptz  | YES  | —                             |                                                                       |
| 22  | `deleted_at`               | timestamptz  | YES  | —                             |                                                                       |
| 23  | `title_it`                 | varchar(255) | YES  | —                             | Italian title (Slice 2 i18n — see migration 206)                      |
| 24  | `description_it`           | text         | YES  | —                             | Italian description (Slice 2 i18n — see migration 206)                |
| 25  | `description_en`           | text         | YES  | —                             | English description (Slice 2 i18n — see migration 206)                |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                                            | References           | ON UPDATE | ON DELETE | Notes |
| -------------------------------------------------- | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id`                           | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`, `tenant_id`, `tenant_id`, `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_learning_paths_active` [INDEX] · (`id`)
- `idx_learning_paths_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_learning_paths_embedding` [INDEX] · (`embedding`)
- `idx_learning_paths_tenant_id` [INDEX] · (`tenant_id`)
- `learning_paths_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `job_title_learning_paths` via (`learning_path_id`)
- `learning_path_enrollments` via (`learning_path_id`)

---

### `learning_ratings`

- **Tenant scoped**: yes
- **Row estimate**: 396
- **Domains**: SKILGRO
- **Prisma model**: `learning_ratings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default             | Notes |
| --- | --------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `course_id`     | uuid        | YES  | —                   |       |
| 3   | `employee_id`   | uuid        | YES  | —                   |       |
| 4   | `rating`        | int4(32)    | YES  | —                   |       |
| 5   | `review`        | text        | YES  | —                   |       |
| 6   | `helpful_count` | int4(32)    | YES  | `0`                 |       |
| 7   | `created_at`    | timestamptz | YES  | `now()`             |       |
| 8   | `tenant_id`     | uuid        | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `course_id`   | `courses(id)`        | NO ACTION | SET NULL  |       |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_learning_ratings_course_id` [INDEX] · (`course_id`)
- `idx_learning_ratings_employee_id` [INDEX] · (`employee_id`)
- `idx_learning_ratings_tenant` [INDEX] · (`tenant_id`)
- `learning_ratings_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_learning_ratings** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `learning_recommendations`

- **Tenant scoped**: yes
- **Row estimate**: 1045
- **Domains**: SKILGRO
- **Prisma model**: `learning_recommendations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                        | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `employee_id`          | uuid         | YES  | —                              |       |
| 3   | `course_id`            | uuid         | YES  | —                              |       |
| 4   | `learning_path_id`     | uuid         | YES  | —                              |       |
| 5   | `certification_id`     | uuid         | YES  | —                              |       |
| 6   | `recommendation_type`  | varchar(50)  | NO   | —                              |       |
| 7   | `reason`               | text         | NO   | —                              |       |
| 8   | `priority`             | int4(32)     | YES  | `5`                            |       |
| 9   | `confidence_score`     | numeric(3,2) | YES  | —                              |       |
| 10  | `skill_gaps_addressed` | \_text       | YES  | —                              |       |
| 11  | `source_context`       | jsonb        | YES  | —                              |       |
| 12  | `status`               | varchar(20)  | YES  | `'pending'::character varying` |       |
| 13  | `created_at`           | timestamptz  | YES  | `now()`                        |       |
| 14  | `viewed_at`            | timestamptz  | YES  | —                              |       |
| 15  | `actioned_at`          | timestamptz  | YES  | —                              |       |
| 16  | `dismissed_at`         | timestamptz  | YES  | —                              |       |
| 17  | `dismiss_reason`       | varchar(255) | YES  | —                              |       |
| 18  | `tenant_id`            | uuid         | NO   | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `course_id`   | `courses(id)`        | NO ACTION | SET NULL  |       |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_learning_recommendations_course_id` [INDEX] · (`course_id`)
- `idx_learning_recommendations_employee` [INDEX] · (`employee_id`)
- `idx_learning_recommendations_status` [INDEX] · (`status`)
- `idx_learning_recommendations_tenant` [INDEX] · (`tenant_id`)
- `learning_recommendations_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_learning_recommendations** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `module_completions`

- **Tenant scoped**: yes
- **Row estimate**: 2899
- **Domains**: SKILGRO
- **Prisma model**: `module_completions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                            | Notes |
| --- | -------------------- | ------------ | ---- | ---------------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`                | PK    |
| 2   | `enrollment_id`      | uuid         | YES  | —                                  |       |
| 3   | `module_id`          | uuid         | YES  | —                                  |       |
| 4   | `status`             | varchar(20)  | YES  | `'not_started'::character varying` |       |
| 5   | `started_at`         | timestamptz  | YES  | —                                  |       |
| 6   | `completed_at`       | timestamptz  | YES  | —                                  |       |
| 7   | `score`              | numeric(5,2) | YES  | —                                  |       |
| 8   | `time_spent_minutes` | int4(32)     | YES  | `0`                                |       |
| 9   | `attempts`           | int4(32)     | YES  | `1`                                |       |
| 10  | `created_at`         | timestamptz  | YES  | `now()`                            |       |
| 11  | `updated_at`         | timestamptz  | YES  | `now()`                            |       |
| 12  | `tenant_id`          | uuid         | NO   | —                                  |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `module_id` | `course_modules(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_module_completions_tenant` [INDEX] · (`tenant_id`)
- `module_completions_enrollment_id_module_id_key` [UNIQUE] · (`enrollment_id`, `module_id`)
- `module_completions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_module_completions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `rating_scales`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: SKILGRO
- **Prisma model**: `rating_scales`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type         | Null | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes |
| --- | -------------- | ------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | PK    |
| 2   | `tenant_id`    | uuid         | NO   | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |       |
| 3   | `name`         | varchar(100) | NO   | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |       |
| 4   | `description`  | text         | YES  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |       |
| 5   | `scale_type`   | varchar(30)  | YES  | `'numeric'::character varying`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |       |
| 6   | `min_value`    | numeric(3,1) | YES  | `1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |       |
| 7   | `max_value`    | numeric(3,1) | YES  | `5`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |       |
| 8   | `scale_points` | jsonb        | NO   | `'[{"label": "Needs Improvement", "value": 1, "description": "Performance consistently below expectations"}, {"label": "Developing", "value": 2, "description": "Performance sometimes meets expectations"}, {"label": "Meets Expectations", "value": 3, "description": "Performance consistently meets expectations"}, {"label": "Exceeds Expectations", "value": 4, "description": "Performance frequently exceeds expectations"}, {"label": "Outstanding", "value": 5, "description": "Performance consistently exceeds expectations"}]'::jsonb` |       |
| 9   | `is_default`   | bool         | YES  | `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |       |
| 10  | `is_active`    | bool         | YES  | `true`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |       |
| 11  | `created_at`   | timestamptz  | YES  | `now()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |       |
| 12  | `updated_at`   | timestamptz  | YES  | `now()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |       |
| 13  | `deleted_at`   | timestamptz  | YES  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rating_scales_active` [INDEX] · (`id`)
- `idx_rating_scales_tenant` [INDEX] · (`tenant_id`)
- `rating_scales_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

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

### `skill_aliases`

> This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.

- **Tenant scoped**: no
- **Row estimate**: 80
- **Domains**: SKILGRO
- **Prisma model**: `skill_aliases`

#### Columns

| #   | Column             | Type         | Null | Default                        | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `esco_skill_id`    | uuid         | YES  | —                              |       |
| 3   | `alias_text`       | varchar(255) | NO   | —                              |       |
| 4   | `alias_type`       | varchar(50)  | YES  | `'synonym'::character varying` |       |
| 5   | `language_code`    | varchar(5)   | YES  | `'en'::character varying`      |       |
| 6   | `confidence_score` | numeric(3,2) | YES  | `1.0`                          |       |
| 7   | `source`           | varchar(50)  | YES  | `'manual'::character varying`  |       |
| 8   | `is_verified`      | bool         | YES  | `false`                        |       |
| 9   | `created_at`       | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_skill_aliases_esco` [INDEX] · (`esco_skill_id`)
- `skill_aliases_pkey` [PRIMARY] · (`id`)

---

### `skill_classifications`

- **Tenant scoped**: no
- **Row estimate**: 7215
- **Domains**: SKILGRO
- **Prisma model**: `skill_classifications`

#### Columns

| #   | Column                        | Type         | Null | Default                             | Notes |
| --- | ----------------------------- | ------------ | ---- | ----------------------------------- | ----- |
| 1   | `id`                          | uuid         | NO   | `gen_random_uuid()`                 | PK    |
| 2   | `esco_skill_id`               | uuid         | NO   | —                                   |       |
| 3   | `primary_category`            | varchar(20)  | NO   | —                                   |       |
| 4   | `primary_category_confidence` | numeric(3,2) | YES  | —                                   |       |
| 5   | `cognitive_level`             | int4(32)     | YES  | —                                   |       |
| 6   | `cognitive_level_label`       | varchar(30)  | YES  | —                                   |       |
| 7   | `social_dimension`            | varchar(30)  | YES  | —                                   |       |
| 8   | `transferability`             | varchar(20)  | NO   | `'transferable'::character varying` |       |
| 9   | `transferability_score`       | numeric(3,2) | YES  | —                                   |       |
| 10  | `skill_cluster_id`            | uuid         | YES  | —                                   |       |
| 11  | `classification_source`       | varchar(50)  | YES  | `'ai_assisted'::character varying`  |       |
| 12  | `classified_by`               | uuid         | YES  | —                                   |       |
| 13  | `classified_at`               | timestamptz  | YES  | —                                   |       |
| 14  | `needs_review`                | bool         | YES  | `false`                             |       |
| 15  | `review_notes`                | text         | YES  | —                                   |       |
| 16  | `created_at`                  | timestamptz  | YES  | `now()`                             |       |
| 17  | `updated_at`                  | timestamptz  | YES  | `now()`                             |       |
| 18  | `confidence_score`            | numeric(5,4) | YES  | `0.0`                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns            | References           | ON UPDATE | ON DELETE | Notes |
| ------------------ | -------------------- | --------- | --------- | ----- |
| `classified_by`    | `users(id)`          | NO ACTION | SET NULL  |       |
| `esco_skill_id`    | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `skill_cluster_id` | `skill_clusters(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_skill_class_category` [INDEX] · (`primary_category`)
- `idx_skill_class_cluster` [INDEX] · (`skill_cluster_id`)
- `idx_skill_class_cognitive` [INDEX] · (`cognitive_level`)
- `idx_skill_class_review` [INDEX] · (`needs_review`)
- `idx_skill_class_social` [INDEX] · (`social_dimension`)
- `idx_skill_class_source` [INDEX] · (`classification_source`)
- `idx_skill_class_transfer` [INDEX] · (`transferability`)
- `idx_skill_classifications_classified_by` [INDEX] · (`classified_by`)
- `skill_classifications_pkey` [PRIMARY] · (`id`)
- `uq_skill_classifications_esco` [UNIQUE] · (`esco_skill_id`)

---

### `skill_clusters`

- **Tenant scoped**: no
- **Row estimate**: 49
- **Domains**: SKILGRO
- **Prisma model**: `skill_clusters`

#### Columns

| #   | Column              | Type         | Null | Default             | Notes |
| --- | ------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `code`              | varchar(50)  | NO   | —                   |       |
| 3   | `name_en`           | varchar(200) | NO   | —                   |       |
| 4   | `name_it`           | varchar(200) | YES  | —                   |       |
| 5   | `description`       | text         | YES  | —                   |       |
| 6   | `parent_cluster_id` | uuid         | YES  | —                   |       |
| 7   | `cluster_level`     | int4(32)     | YES  | `1`                 |       |
| 8   | `career_path_codes` | \_text       | YES  | —                   |       |
| 9   | `industry_codes`    | \_text       | YES  | —                   |       |
| 10  | `is_active`         | bool         | YES  | `true`              |       |
| 11  | `sort_order`        | int4(32)     | YES  | `0`                 |       |
| 12  | `created_at`        | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`        | timestamptz  | YES  | `now()`             |       |
| 14  | `deleted_at`        | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References           | ON UPDATE | ON DELETE | Notes |
| ------------------- | -------------------- | --------- | --------- | ----- |
| `parent_cluster_id` | `skill_clusters(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_skill_clusters_active` [INDEX] · (`is_active`)
- `idx_skill_clusters_career` [INDEX] · (`career_path_codes`)
- `idx_skill_clusters_industry` [INDEX] · (`industry_codes`)
- `idx_skill_clusters_level` [INDEX] · (`cluster_level`)
- `idx_skill_clusters_not_deleted` [INDEX] · (`id`)
- `idx_skill_clusters_parent` [INDEX] · (`parent_cluster_id`)
- `skill_clusters_code_key` [UNIQUE] · (`code`)
- `skill_clusters_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `skill_classifications` via (`skill_cluster_id`)
- `skill_clusters` via (`parent_cluster_id`)

---

### `skill_demand_metrics`

- **Tenant scoped**: yes
- **Row estimate**: 200
- **Domains**: SKILGRO
- **Prisma model**: `skill_demand_metrics`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type          | Null | Default             | Notes |
| --- | --------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`           | uuid          | NO   | —                   |       |
| 3   | `esco_skill_id`       | uuid          | NO   | —                   |       |
| 4   | `period_start`        | date          | NO   | —                   |       |
| 5   | `period_end`          | date          | NO   | —                   |       |
| 6   | `total_postings`      | int4(32)      | YES  | `0`                 |       |
| 7   | `postings_required`   | int4(32)      | YES  | `0`                 |       |
| 8   | `postings_preferred`  | int4(32)      | YES  | `0`                 |       |
| 9   | `avg_salary_min`      | numeric(12,2) | YES  | —                   |       |
| 10  | `avg_salary_max`      | numeric(12,2) | YES  | —                   |       |
| 11  | `by_experience_level` | jsonb         | YES  | `'{}'::jsonb`       |       |
| 12  | `by_location`         | jsonb         | YES  | `'{}'::jsonb`       |       |
| 13  | `by_industry`         | jsonb         | YES  | `'{}'::jsonb`       |       |
| 14  | `trend_vs_previous`   | numeric(5,2)  | YES  | —                   |       |
| 15  | `created_at`          | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`     | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_demand_esco` [INDEX] · (`esco_skill_id`)
- `idx_skill_demand_period` [INDEX] · (`period_start`, `period_end`)
- `idx_skill_demand_tenant` [INDEX] · (`tenant_id`)
- `skill_demand_metrics_pkey` [PRIMARY] · (`id`)
- `skill_demand_metrics_tenant_id_esco_skill_id_period_start_p_key` [UNIQUE] · (`tenant_id`, `esco_skill_id`, `period_start`, `period_end`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `skill_development_paths`

- **Tenant scoped**: no
- **Row estimate**: 65
- **Domains**: SKILGRO
- **Prisma model**: `skill_development_paths`

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `employee_id`         | uuid         | YES  | —                   |       |
| 3   | `target_job_family`   | varchar(100) | YES  | —                   |       |
| 4   | `target_job_level`    | varchar(50)  | YES  | —                   |       |
| 5   | `current_skills`      | \_text       | YES  | —                   |       |
| 6   | `missing_skills`      | \_text       | YES  | —                   |       |
| 7   | `recommended_actions` | text         | YES  | —                   |       |
| 8   | `progress_percent`    | int4(32)     | YES  | `0`                 |       |
| 9   | `estimated_months`    | int4(32)     | YES  | —                   |       |
| 10  | `is_active`           | bool         | YES  | `true`              |       |
| 11  | `created_at`          | timestamp    | YES  | `now()`             |       |
| 12  | `updated_at`          | timestamp    | YES  | `now()`             |       |
| 13  | `deleted_at`          | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_development_paths_active` [INDEX] · (`id`)
- `idx_skill_development_paths_employee_id` [INDEX] · (`employee_id`)
- `skill_development_paths_pkey` [PRIMARY] · (`id`)

---

### `skill_extraction_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 31
- **Domains**: SKILGRO
- **Prisma model**: `skill_extraction_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                        | Notes |
| --- | -------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                              |       |
| 3   | `job_type`           | varchar(50)  | NO   | —                              |       |
| 4   | `source_type`        | varchar(50)  | NO   | —                              |       |
| 5   | `source_reference`   | varchar(500) | YES  | —                              |       |
| 6   | `source_text`        | text         | YES  | —                              |       |
| 7   | `status`             | varchar(20)  | YES  | `'pending'::character varying` |       |
| 8   | `extracted_skills`   | jsonb        | YES  | `'[]'::jsonb`                  |       |
| 9   | `mapped_skills`      | jsonb        | YES  | `'[]'::jsonb`                  |       |
| 10  | `unmapped_skills`    | jsonb        | YES  | `'[]'::jsonb`                  |       |
| 11  | `extraction_model`   | varchar(100) | YES  | —                              |       |
| 12  | `processing_time_ms` | int4(32)     | YES  | —                              |       |
| 13  | `error_message`      | text         | YES  | —                              |       |
| 14  | `created_at`         | timestamptz  | YES  | `now()`                        |       |
| 15  | `completed_at`       | timestamptz  | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_extraction_status` [INDEX] · (`status`)
- `idx_skill_extraction_tenant` [INDEX] · (`tenant_id`)
- `skill_extraction_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **skill_extraction_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `skill_gap_analyses`

- **Tenant scoped**: yes
- **Row estimate**: 304
- **Domains**: SKILGRO
- **Prisma model**: `skill_gap_analyses`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes                                                                 |
| --- | ------------------------ | ------------ | ---- | ------------------- | --------------------------------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK                                                                    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |                                                                       |
| 3   | `analysis_name`          | varchar(255) | NO   | —                   |                                                                       |
| 4   | `analysis_type`          | varchar(50)  | NO   | —                   |                                                                       |
| 5   | `target_entity_type`     | varchar(50)  | YES  | —                   |                                                                       |
| 6   | `target_entity_id`       | uuid         | YES  | —                   |                                                                       |
| 7   | `target_position_id`     | uuid         | YES  | —                   |                                                                       |
| 8   | `target_position_name`   | varchar(255) | YES  | —                   |                                                                       |
| 9   | `comparison_type`        | varchar(50)  | YES  | —                   |                                                                       |
| 10  | `analysis_date`          | date         | YES  | `CURRENT_DATE`      |                                                                       |
| 11  | `overall_match_score`    | numeric(5,2) | YES  | —                   |                                                                       |
| 12  | `coverage_score`         | numeric(5,2) | YES  | —                   |                                                                       |
| 13  | `proficiency_score`      | numeric(5,2) | YES  | —                   |                                                                       |
| 14  | `skill_matches`          | jsonb        | YES  | `'[]'::jsonb`       | JSONB BY DESIGN: computed skill match scores.                         |
| 15  | `skill_gaps`             | jsonb        | YES  | `'[]'::jsonb`       | JSONB BY DESIGN: computed gap analysis results snapshot.              |
| 16  | `skill_surplus`          | jsonb        | YES  | `'[]'::jsonb`       | JSONB BY DESIGN: computed surplus analysis.                           |
| 17  | `recommendations`        | jsonb        | YES  | `'[]'::jsonb`       | JSONB BY DESIGN: computed learning recommendations.                   |
| 18  | `priority_skills`        | jsonb        | YES  | `'[]'::jsonb`       | JSONB BY DESIGN: computed priority ranking.                           |
| 19  | `market_comparison`      | jsonb        | YES  | —                   | JSONB BY DESIGN: computed market benchmark.                           |
| 20  | `internal_comparison`    | jsonb        | YES  | —                   | JSONB BY DESIGN: computed internal benchmark.                         |
| 21  | `created_by`             | uuid         | YES  | —                   |                                                                       |
| 22  | `created_at`             | timestamptz  | YES  | `now()`             |                                                                       |
| 23  | `updated_at`             | timestamptz  | YES  | `now()`             |                                                                       |
| 24  | `created_by_employee_id` | uuid         | YES  | —                   |                                                                       |
| 25  | `analysis_embedding`     | vector       | YES  | —                   | Semantic embedding of gap analysis (recommendations, priority skills) |
| 26  | `embedding_text_hash`    | varchar(64)  | YES  | —                   |                                                                       |
| 27  | `embedding_model`        | varchar(100) | YES  | —                   |                                                                       |
| 28  | `embedding_generated_at` | timestamptz  | YES  | —                   |                                                                       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_gap_analyses_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_skill_gap_analyses_embedding` [INDEX] · (`analysis_embedding`)
- `idx_skill_gap_analyses_tenant_id` [INDEX] · (`tenant_id`)
- `idx_skill_gap_entity` [INDEX] · (`target_entity_type`, `target_entity_id`)
- `skill_gap_analyses_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **skill_gap_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `performance_skill_links` via (`linked_gap_analysis_id`)

---

### `skill_gap_snapshots`

- **Tenant scoped**: yes
- **Row estimate**: 36
- **Domains**: SKILGRO
- **Prisma model**: `skill_gap_snapshots`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `name`                   | varchar(255) | NO   | —                   |       |
| 4   | `analysis_date`          | date         | NO   | `CURRENT_DATE`      |       |
| 5   | `scope`                  | jsonb        | YES  | `'{}'::jsonb`       |       |
| 6   | `gap_metrics`            | jsonb        | NO   | `'{}'::jsonb`       |       |
| 7   | `recommendations`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 8   | `created_by`             | uuid         | YES  | —                   |       |
| 9   | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 10  | `created_by_employee_id` | uuid         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_gap_date` [INDEX] · (`analysis_date`)
- `idx_skill_gap_snapshots_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_skill_gap_tenant` [INDEX] · (`tenant_id`)
- `skill_gap_snapshots_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `skill_matrices`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: SKILGRO
- **Prisma model**: `skill_matrices`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                   |       |
| 3   | `matrix_name`        | varchar(255) | NO   | —                   |       |
| 4   | `matrix_type`        | varchar(50)  | NO   | —                   |       |
| 5   | `entity_type`        | varchar(50)  | YES  | —                   |       |
| 6   | `entity_id`          | uuid         | YES  | —                   |       |
| 7   | `generated_at`       | timestamptz  | YES  | `now()`             |       |
| 8   | `total_employees`    | int4(32)     | YES  | —                   |       |
| 9   | `total_skills`       | int4(32)     | YES  | —                   |       |
| 10  | `skill_coverage`     | jsonb        | YES  | `'{}'::jsonb`       |       |
| 11  | `skill_distribution` | jsonb        | YES  | `'{}'::jsonb`       |       |
| 12  | `skill_trends`       | jsonb        | YES  | `'[]'::jsonb`       |       |
| 13  | `top_skills`         | jsonb        | YES  | `'[]'::jsonb`       |       |
| 14  | `rare_skills`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 15  | `critical_gaps`      | jsonb        | YES  | `'[]'::jsonb`       |       |
| 16  | `created_at`         | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_matrix_entity` [INDEX] · (`entity_type`, `entity_id`)
- `idx_skill_matrix_tenant` [INDEX] · (`tenant_id`)
- `skill_matrices_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **skill_matrix_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `skill_migration_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SKILGRO
- **Prisma model**: `skill_migration_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default                        | Notes |
| --- | ------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                              |       |
| 3   | `job_type`          | varchar(50) | NO   | —                              |       |
| 4   | `status`            | varchar(20) | NO   | `'pending'::character varying` |       |
| 5   | `total_records`     | int4(32)    | NO   | `0`                            |       |
| 6   | `processed_records` | int4(32)    | NO   | `0`                            |       |
| 7   | `matched_records`   | int4(32)    | NO   | `0`                            |       |
| 8   | `failed_records`    | int4(32)    | NO   | `0`                            |       |
| 9   | `error_message`     | text        | YES  | —                              |       |
| 10  | `started_at`        | timestamptz | YES  | —                              |       |
| 11  | `completed_at`      | timestamptz | YES  | —                              |       |
| 12  | `created_at`        | timestamptz | NO   | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_migration_jobs_status` [INDEX] · (`status`)
- `idx_skill_migration_jobs_tenant` [INDEX] · (`tenant_id`)
- `skill_migration_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `skill_pair_usage`

- **Tenant scoped**: yes
- **Row estimate**: 111
- **Domains**: SKILGRO
- **Prisma model**: `skill_pair_usage`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default             | Notes                                            |
| --- | --------------------- | ------------ | ---- | ------------------- | ------------------------------------------------ |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK                                               |
| 2   | `skill_id_1`          | uuid         | NO   | —                   |                                                  |
| 3   | `skill_id_2`          | uuid         | NO   | —                   |                                                  |
| 4   | `tenant_id`           | uuid         | NO   | —                   |                                                  |
| 5   | `co_occurrence_count` | int4(32)     | NO   | `1`                 | Number of times these skills appeared together   |
| 6   | `last_seen_at`        | timestamptz  | YES  | `now()`             |                                                  |
| 7   | `context_type`        | varchar(50)  | YES  | —                   | Context where skills were seen together          |
| 8   | `usage_strength`      | numeric(5,4) | YES  | `0.0`               | Normalized strength 0-1 based on usage frequency |
| 9   | `created_at`          | timestamptz  | YES  | `now()`             |                                                  |
| 10  | `updated_at`          | timestamptz  | YES  | `now()`             |                                                  |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References        | ON UPDATE | ON DELETE | Notes |
| ------------ | ----------------- | --------- | --------- | ----- |
| `skill_id_1` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `skill_id_2` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`  | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_pair_usage_context` [INDEX] · (`context_type`)
- `idx_skill_pair_usage_skill1` [INDEX] · (`skill_id_1`)
- `idx_skill_pair_usage_skill2` [INDEX] · (`skill_id_2`)
- `idx_skill_pair_usage_strength` [INDEX] · (`usage_strength`)
- `idx_skill_pair_usage_tenant` [INDEX] · (`tenant_id`)
- `skill_pair_unique` [UNIQUE] · (`skill_id_1`, `skill_id_2`, `tenant_id`, `context_type`)
- `skill_pair_usage_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `skill_relationships`

- **Tenant scoped**: no
- **Row estimate**: 16
- **Domains**: SKILGRO
- **Prisma model**: `skill_relationships`

#### Columns

| #   | Column                  | Type         | Null | Default                            | Notes |
| --- | ----------------------- | ------------ | ---- | ---------------------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()`                | PK    |
| 2   | `source_skill_id`       | uuid         | NO   | —                                  |       |
| 3   | `target_skill_id`       | uuid         | NO   | —                                  |       |
| 4   | `relationship_type`     | varchar(30)  | NO   | —                                  |       |
| 5   | `relationship_strength` | numeric(3,2) | YES  | `0.50`                             |       |
| 6   | `is_bidirectional`      | bool         | YES  | `false`                            |       |
| 7   | `substitution_context`  | text         | YES  | —                                  |       |
| 8   | `prerequisite_level`    | int4(32)     | YES  | —                                  |       |
| 9   | `relationship_source`   | varchar(50)  | YES  | `'ai_inferred'::character varying` |       |
| 10  | `validated_by`          | uuid         | YES  | —                                  |       |
| 11  | `validated_at`          | timestamptz  | YES  | —                                  |       |
| 12  | `created_at`            | timestamptz  | YES  | `now()`                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References        | ON UPDATE | ON DELETE | Notes |
| ----------------- | ----------------- | --------- | --------- | ----- |
| `source_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `target_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `validated_by`    | `users(id)`       | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_skill_rel_bidirectional` [INDEX] · (`is_bidirectional`)
- `idx_skill_rel_source` [INDEX] · (`source_skill_id`)
- `idx_skill_rel_strength` [INDEX] · (`relationship_strength`)
- `idx_skill_rel_target` [INDEX] · (`target_skill_id`)
- `idx_skill_rel_type` [INDEX] · (`relationship_type`)
- `idx_skill_relationships_validated_by` [INDEX] · (`validated_by`)
- `skill_relationships_pkey` [PRIMARY] · (`id`)
- `uq_skill_relationship` [UNIQUE] · (`source_skill_id`, `target_skill_id`, `relationship_type`)

---

### `skill_requirements_templates`

- **Tenant scoped**: yes
- **Row estimate**: 8
- **Domains**: SKILGRO
- **Prisma model**: `skill_requirements_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                       | Notes |
| --- | ---------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`            | uuid         | NO   | —                             |       |
| 3   | `name`                 | varchar(255) | NO   | —                             |       |
| 4   | `description`          | text         | YES  | —                             |       |
| 5   | `is_default`           | bool         | YES  | `false`                       |       |
| 6   | `skill_id`             | uuid         | YES  | —                             |       |
| 7   | `skill_name`           | varchar(255) | NO   | —                             |       |
| 8   | `required_count`       | int4(32)     | NO   | `1`                           |       |
| 9   | `required_proficiency` | numeric(3,1) | NO   | `3.0`                         |       |
| 10  | `priority`             | varchar(20)  | NO   | `'medium'::character varying` |       |
| 11  | `notes`                | text         | YES  | —                             |       |
| 12  | `created_at`           | timestamptz  | NO   | `now()`                       |       |
| 13  | `updated_at`           | timestamptz  | NO   | `now()`                       |       |
| 14  | `org_unit_id`          | uuid         | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References        | ON UPDATE | ON DELETE | Notes |
| ------------- | ----------------- | --------- | --------- | ----- |
| `org_unit_id` | `org_units(id)`   | NO ACTION | CASCADE   |       |
| `skill_id`    | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`   | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_req_templates_skill` [INDEX] · (`skill_id`)
- `idx_skill_req_templates_tenant` [INDEX] · (`tenant_id`)
- `idx_skill_requirements_templates_org_unit_id` [INDEX] · (`org_unit_id`)
- `skill_requirements_templates_pkey` [PRIMARY] · (`id`)
- `skill_requirements_templates_tenant_id_name_skill_name_key` [UNIQUE] · (`tenant_id`, `name`, `skill_name`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `skill_supply_metrics`

- **Tenant scoped**: yes
- **Row estimate**: 200
- **Domains**: SKILGRO
- **Prisma model**: `skill_supply_metrics`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default             | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                | uuid         | NO   | —                   |       |
| 3   | `esco_skill_id`            | uuid         | NO   | —                   |       |
| 4   | `calculated_date`          | date         | YES  | `CURRENT_DATE`      |       |
| 5   | `employee_count`           | int4(32)     | YES  | `0`                 |       |
| 6   | `avg_proficiency`          | numeric(3,2) | YES  | —                   |       |
| 7   | `proficiency_distribution` | jsonb        | YES  | `'{}'::jsonb`       |       |
| 8   | `by_department`            | jsonb        | YES  | `'{}'::jsonb`       |       |
| 9   | `by_tenure`                | jsonb        | YES  | `'{}'::jsonb`       |       |
| 10  | `trend_vs_previous`        | numeric(5,2) | YES  | —                   |       |
| 11  | `created_at`               | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`     | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_supply_esco` [INDEX] · (`esco_skill_id`)
- `idx_skill_supply_tenant` [INDEX] · (`tenant_id`)
- `skill_supply_metrics_pkey` [PRIMARY] · (`id`)
- `skill_supply_metrics_tenant_id_esco_skill_id_calculated_dat_key` [UNIQUE] · (`tenant_id`, `esco_skill_id`, `calculated_date`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `skill_synonyms`

> This model contains an expression index which requires additional setup for migrations. Visit https://pris.ly/d/expression-indexes for more info.

- **Tenant scoped**: no
- **Row estimate**: 50
- **Domains**: SKILGRO
- **Prisma model**: `skill_synonyms`

#### Columns

| #   | Column          | Type        | Null | Default                   | Notes |
| --- | --------------- | ----------- | ---- | ------------------------- | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()`       | PK    |
| 2   | `esco_skill_id` | uuid        | NO   | —                         |       |
| 3   | `synonym`       | text        | NO   | —                         |       |
| 4   | `language`      | varchar(10) | YES  | `'en'::character varying` |       |
| 5   | `source`        | varchar(50) | YES  | —                         |       |
| 6   | `usage_count`   | int4(32)    | YES  | `0`                       |       |
| 7   | `created_at`    | timestamptz | YES  | `now()`                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_skill_synonyms_esco` [INDEX] · (`esco_skill_id`)
- `skill_synonyms_esco_skill_id_synonym_language_key` [UNIQUE] · (`esco_skill_id`, `synonym`, `language`)
- `skill_synonyms_pkey` [PRIMARY] · (`id`)

---

### `skill_taxonomy_extensions`

- **Tenant scoped**: yes
- **Row estimate**: 52
- **Domains**: SKILGRO
- **Prisma model**: `skill_taxonomy_extensions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default                       | Notes |
| --- | ----------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                             |       |
| 3   | `skill_id`        | uuid         | NO   | —                             |       |
| 4   | `extension_type`  | varchar(50)  | NO   | —                             |       |
| 5   | `extension_key`   | varchar(100) | YES  | —                             |       |
| 6   | `extension_value` | text         | YES  | —                             |       |
| 7   | `language`        | varchar(10)  | YES  | `'it'::character varying`     |       |
| 8   | `source`          | varchar(50)  | YES  | `'manual'::character varying` |       |
| 9   | `is_approved`     | bool         | YES  | `false`                       |       |
| 10  | `approved_by`     | uuid         | YES  | —                             |       |
| 11  | `created_at`      | timestamptz  | YES  | `now()`                       |       |
| 12  | `updated_at`      | timestamptz  | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `approved_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `skill_id`    | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_skill_taxonomy_extensions_approved_by` [INDEX] · (`approved_by`)
- `idx_skill_taxonomy_extensions_skill` [INDEX] · (`skill_id`)
- `idx_skill_taxonomy_extensions_tenant` [INDEX] · (`tenant_id`)
- `skill_taxonomy_extensions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_skill_taxonomy_extensions_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `unknown_skills`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: SKILGRO
- **Prisma model**: `unknown_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                        | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                              |       |
| 3   | `raw_text`                | text         | NO   | —                              |       |
| 4   | `occurrence_count`        | int4(32)     | YES  | `1`                            |       |
| 5   | `first_seen_at`           | timestamptz  | YES  | `now()`                        |       |
| 6   | `last_seen_at`            | timestamptz  | YES  | `now()`                        |       |
| 7   | `suggested_esco_id`       | uuid         | YES  | —                              |       |
| 8   | `suggested_confidence`    | numeric(3,2) | YES  | —                              |       |
| 9   | `review_status`           | varchar(50)  | YES  | `'pending'::character varying` |       |
| 10  | `reviewed_by`             | uuid         | YES  | —                              |       |
| 11  | `reviewed_at`             | timestamptz  | YES  | —                              |       |
| 12  | `mapped_to_esco_id`       | uuid         | YES  | —                              |       |
| 13  | `reviewed_by_employee_id` | uuid         | YES  | —                              |       |
| 14  | `created_at`              | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `mapped_to_esco_id`       | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `reviewed_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `suggested_esco_id`       | `esco_skills(id)`    | NO ACTION | RESTRICT  |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_unknown_skills_mapped_to_esco_id` [INDEX] · (`mapped_to_esco_id`)
- `idx_unknown_skills_reviewed_by_employee_id` [INDEX] · (`reviewed_by_employee_id`)
- `idx_unknown_skills_status` [INDEX] · (`review_status`)
- `idx_unknown_skills_suggested_esco_id` [INDEX] · (`suggested_esco_id`)
- `idx_unknown_skills_tenant` [INDEX] · (`tenant_id`)
- `unknown_skills_pkey` [PRIMARY] · (`id`)
- `unknown_skills_tenant_id_raw_text_key` [UNIQUE] · (`tenant_id`, `raw_text`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---
