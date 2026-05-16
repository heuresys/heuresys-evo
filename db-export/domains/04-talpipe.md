# Dominio TALPIPE — Talent Pipeline (Career-Succession-9Box-TalentPool-Mobility-Promotion)

> Talent flow + succession derivation

**Tabelle in questo dominio**: 28

## Tabelle

| Tabella                                                     | Rows | Tenant | RLS | FK out | Cols |
| ----------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`career_conversations`](#careerconversations)              | 50   | ✓      | ✓   | 2      | 7    |
| [`career_goal_milestones`](#careergoalmilestones)           | 216  | ✓      | ✓   | 2      | 12   |
| [`career_goals`](#careergoals)                              | 60   | ✓      | ✓   | 2      | 12   |
| [`career_path_level_skills`](#careerpathlevelskills)        | 100  | ✓      | ✓   | 3      | 16   |
| [`career_path_levels`](#careerpathlevels)                   | 75   | —      | —   | 1      | 14   |
| [`career_path_recommendations`](#careerpathrecommendations) | 85   | ✓      | ✓   | 6      | 23   |
| [`career_path_templates`](#careerpathtemplates)             | 16   | ✓      | ✓   | 1      | 16   |
| [`career_paths`](#careerpaths)                              | 32   | ✓      | ✓   | 2      | 16   |
| [`career_profiles`](#careerprofiles)                        | 158  | ✓      | ✓   | 2      | 10   |
| [`career_recommendations`](#careerrecommendations)          | 192  | ✓      | ✓   | 2      | 13   |
| [`career_simulations`](#careersimulations)                  | 20   | ✓      | ✓   | 6      | 18   |
| [`career_skills`](#careerskills)                            | 1106 | ✓      | ✓   | 4      | 12   |
| [`critical_roles`](#criticalroles)                          | 16   | ✓      | ✓   | 1      | 11   |
| [`employee_career_paths`](#employeecareerpaths)             | 128  | ✓      | ✓   | 3      | 13   |
| [`employee_career_progress`](#employeecareerprogress)       | 40   | ✓      | ✓   | 4      | 18   |
| [`internal_mobility_postings`](#internalmobilitypostings)   | 27   | ✓      | ✓   | 5      | 22   |
| [`internal_mobility_requests`](#internalmobilityrequests)   | 15   | ✓      | ✓   | 2      | 19   |
| [`mentor_match_scores`](#mentormatchscores)                 | 30   | ✓      | ✓   | 4      | 14   |
| [`mentorship_programs`](#mentorshipprograms)                | 12   | ✓      | ✓   | 1      | 14   |
| [`mentorship_sessions`](#mentorshipsessions)                | 355  | ✓      | ✓   | 2      | 10   |
| [`mentorships`](#mentorships)                               | 124  | ✓      | ✓   | 1      | 15   |
| [`succession_candidates`](#successioncandidates)            | 188  | ✓      | ✓   | 2      | 11   |
| [`succession_plans`](#successionplans)                      | 28   | ✓      | ✓   | 1      | 17   |
| [`talent_pool_members`](#talentpoolmembers)                 | 40   | ✓      | ✓   | 3      | 11   |
| [`talent_pools`](#talentpools)                              | 24   | ✓      | ✓   | 1      | 13   |
| [`workforce_plan_actions`](#workforceplanactions)           | 20   | ✓      | ✓   | 4      | 17   |
| [`workforce_plan_scenarios`](#workforceplanscenarios)       | 9    | ✓      | ✓   | 3      | 12   |
| [`workforce_plans`](#workforceplans)                        | 43   | ✓      | ✓   | 3      | 15   |

---

### `career_conversations`

- **Tenant scoped**: yes
- **Row estimate**: 50
- **Domains**: TALPIPE
- **Prisma model**: `career_conversations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type        | Null | Default             | Notes |
| --- | ----------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`              | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`       | uuid        | NO   | —                   |       |
| 3   | `profile_id`      | uuid        | NO   | —                   |       |
| 4   | `messages`        | jsonb       | NO   | `'[]'::jsonb`       |       |
| 5   | `summary`         | text        | YES  | —                   |       |
| 6   | `last_message_at` | timestamptz | NO   | `now()`             |       |
| 7   | `created_at`      | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References            | ON UPDATE | ON DELETE | Notes |
| ------------ | --------------------- | --------- | --------- | ----- |
| `profile_id` | `career_profiles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `career_conversations_pkey` [PRIMARY] · (`id`)
- `idx_career_conversations_profile` [INDEX] · (`profile_id`)
- `idx_career_conversations_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_goal_milestones`

- **Tenant scoped**: yes
- **Row estimate**: 216
- **Domains**: TALPIPE
- **Prisma model**: `career_goal_milestones`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                       | Notes |
| --- | ---------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`      | uuid         | NO   | —                             |       |
| 3   | `goal_id`        | uuid         | NO   | —                             |       |
| 4   | `title`          | varchar(255) | NO   | —                             |       |
| 5   | `description`    | text         | YES  | —                             |       |
| 6   | `type`           | varchar(50)  | NO   | `'action'::character varying` |       |
| 7   | `due_date`       | date         | YES  | —                             |       |
| 8   | `completed_at`   | timestamptz  | YES  | —                             |       |
| 9   | `reference_type` | varchar(50)  | YES  | —                             |       |
| 10  | `reference_id`   | uuid         | YES  | —                             |       |
| 11  | `sequence_order` | int4(32)     | NO   | `0`                           |       |
| 12  | `created_at`     | timestamptz  | NO   | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References         | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------ | --------- | --------- | ----- |
| `goal_id`   | `career_goals(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `career_goal_milestones_pkey` [PRIMARY] · (`id`)
- `idx_career_goal_milestones_tenant_id` [INDEX] · (`tenant_id`)
- `idx_career_milestones_goal` [INDEX] · (`goal_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_goals`

- **Tenant scoped**: yes
- **Row estimate**: 60
- **Domains**: TALPIPE
- **Prisma model**: `career_goals`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                       | Notes |
| --- | ---------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`            | uuid         | NO   | —                             |       |
| 3   | `profile_id`           | uuid         | NO   | —                             |       |
| 4   | `target_role`          | varchar(255) | NO   | —                             |       |
| 5   | `target_job_family_id` | uuid         | YES  | —                             |       |
| 6   | `target_date`          | date         | YES  | —                             |       |
| 7   | `status`               | varchar(50)  | NO   | `'active'::character varying` |       |
| 8   | `progress`             | int4(32)     | NO   | `0`                           |       |
| 9   | `motivation`           | text         | YES  | —                             |       |
| 10  | `created_at`           | timestamptz  | NO   | `now()`                       |       |
| 11  | `updated_at`           | timestamptz  | NO   | `now()`                       |       |
| 12  | `completed_at`         | timestamptz  | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References            | ON UPDATE | ON DELETE | Notes |
| ------------ | --------------------- | --------- | --------- | ----- |
| `profile_id` | `career_profiles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `career_goals_pkey` [PRIMARY] · (`id`)
- `idx_career_goals_status` [INDEX] · (`profile_id`, `status`)
- `idx_career_goals_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `career_goal_milestones` via (`goal_id`)

---

### `career_path_level_skills`

- **Tenant scoped**: yes
- **Row estimate**: 100
- **Domains**: TALPIPE
- **Prisma model**: `career_path_level_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type                    | Null | Default                                | Notes |
| --- | -------------------------- | ----------------------- | ---- | -------------------------------------- | ----- |
| 1   | `id`                       | uuid                    | NO   | `gen_random_uuid()`                    | PK    |
| 2   | `tenant_id`                | uuid                    | NO   | —                                      |       |
| 3   | `level_id`                 | uuid                    | NO   | —                                      |       |
| 4   | `skill_id`                 | uuid                    | NO   | —                                      |       |
| 5   | `required_knowledge_level` | int2(16)                | YES  | —                                      |       |
| 6   | `required_skill_level`     | int2(16)                | YES  | —                                      |       |
| 7   | `required_ability_level`   | int2(16)                | YES  | —                                      |       |
| 8   | `required_behavior_level`  | int2(16)                | YES  | —                                      |       |
| 9   | `required_attitude_level`  | int2(16)                | YES  | —                                      |       |
| 10  | `min_composite_score`      | numeric(3,2)            | YES  | —                                      |       |
| 11  | `importance`               | career_skill_importance | YES  | `'important'::career_skill_importance` |       |
| 12  | `weight`                   | numeric(3,2)            | YES  | `1.0`                                  |       |
| 13  | `is_mandatory`             | bool                    | YES  | `false`                                |       |
| 14  | `notes`                    | text                    | YES  | —                                      |       |
| 15  | `created_at`               | timestamptz             | YES  | `now()`                                |       |
| 16  | `updated_at`               | timestamptz             | YES  | `now()`                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References               | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------ | --------- | --------- | ----- |
| `level_id`  | `career_path_levels(id)` | NO ACTION | CASCADE   |       |
| `skill_id`  | `esco_skills(id)`        | NO ACTION | RESTRICT  |       |
| `tenant_id` | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `career_path_level_skills_level_id_skill_id_key` [UNIQUE] · (`level_id`, `skill_id`)
- `career_path_level_skills_pkey` [PRIMARY] · (`id`)
- `idx_career_level_skills_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_path_levels`

- **Tenant scoped**: no
- **Row estimate**: 75
- **Domains**: TALPIPE
- **Prisma model**: `career_path_levels`

#### Columns

| #   | Column                    | Type          | Null | Default             | Notes |
| --- | ------------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `path_id`                 | uuid          | YES  | —                   |       |
| 3   | `title`                   | varchar(200)  | NO   | —                   |       |
| 4   | `description`             | text          | YES  | —                   |       |
| 5   | `level_order`             | int4(32)      | NO   | —                   |       |
| 6   | `min_years_experience`    | int4(32)      | YES  | `0`                 |       |
| 7   | `required_skills`         | \_text        | YES  | —                   |       |
| 8   | `required_certifications` | \_text        | YES  | —                   |       |
| 9   | `salary_band_min`         | numeric(12,2) | YES  | —                   |       |
| 10  | `salary_band_max`         | numeric(12,2) | YES  | —                   |       |
| 11  | `created_at`              | timestamp     | YES  | `now()`             |       |
| 12  | `target_job_id`           | uuid          | YES  | —                   |       |
| 13  | `typical_duration_months` | int4(32)      | YES  | `24`                |       |
| 14  | `skill_gap_threshold`     | numeric(3,2)  | YES  | `0.5`               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `target_job_id` | `tenant_jobs(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `career_path_levels_pkey` [PRIMARY] · (`id`)
- `idx_career_path_levels_path` [INDEX] · (`path_id`)
- `idx_career_path_levels_target_job_id` [INDEX] · (`target_job_id`)

#### Inverse relations (referenced by)

- `career_path_level_skills` via (`level_id`)
- `career_path_recommendations` via (`current_level_id` · `reachable_level_id` · `target_level_id`)
- `career_simulations` via (`target_level_id`)
- `employee_career_progress` via (`level_id`)

---

### `career_path_recommendations`

- **Tenant scoped**: yes
- **Row estimate**: 85
- **Domains**: TALPIPE
- **Prisma model**: `career_path_recommendations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                       | Type         | Null | Default             | Notes |
| --- | ---------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                         | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                  | uuid         | NO   | —                   |       |
| 3   | `employee_id`                | uuid         | NO   | —                   |       |
| 4   | `path_id`                    | uuid         | NO   | —                   |       |
| 5   | `fit_score`                  | numeric(3,2) | YES  | —                   |       |
| 6   | `skill_match_score`          | numeric(3,2) | YES  | —                   |       |
| 7   | `interest_match_score`       | numeric(3,2) | YES  | —                   |       |
| 8   | `market_demand_score`        | numeric(3,2) | YES  | —                   |       |
| 9   | `composite_score`            | numeric(3,2) | YES  | —                   |       |
| 10  | `current_level_id`           | uuid         | YES  | —                   |       |
| 11  | `reachable_level_id`         | uuid         | YES  | —                   |       |
| 12  | `target_level_id`            | uuid         | YES  | —                   |       |
| 13  | `total_skill_gaps`           | int4(32)     | YES  | `0`                 |       |
| 14  | `critical_skill_gaps`        | int4(32)     | YES  | `0`                 |       |
| 15  | `estimated_months_to_next`   | int4(32)     | YES  | —                   |       |
| 16  | `estimated_months_to_target` | int4(32)     | YES  | —                   |       |
| 17  | `development_summary`        | jsonb        | YES  | —                   |       |
| 18  | `is_primary_recommendation`  | bool         | YES  | `false`             |       |
| 19  | `recommendation_reason`      | text         | YES  | —                   |       |
| 20  | `generated_at`               | timestamptz  | YES  | `now()`             |       |
| 21  | `expires_at`                 | timestamptz  | YES  | —                   |       |
| 22  | `version`                    | int4(32)     | YES  | `1`                 |       |
| 23  | `created_at`                 | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References               | ON UPDATE | ON DELETE | Notes |
| -------------------- | ------------------------ | --------- | --------- | ----- |
| `current_level_id`   | `career_path_levels(id)` | NO ACTION | CASCADE   |       |
| `employee_id`        | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `path_id`            | `career_paths(id)`       | NO ACTION | CASCADE   |       |
| `reachable_level_id` | `career_path_levels(id)` | NO ACTION | CASCADE   |       |
| `target_level_id`    | `career_path_levels(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`          | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `career_path_recommendations_employee_id_path_id_key` [UNIQUE] · (`employee_id`, `path_id`)
- `career_path_recommendations_pkey` [PRIMARY] · (`id`)
- `idx_career_path_rec_current` [INDEX] · (`current_level_id`)
- `idx_career_path_rec_target` [INDEX] · (`target_level_id`)
- `idx_career_path_recommendations_reachable_level_id` [INDEX] · (`reachable_level_id`)
- `idx_career_path_recommendations_tenant_id` [INDEX] · (`tenant_id`)
- `idx_career_recommendations_primary` [INDEX] · (`is_primary_recommendation`)
- `idx_career_recommendations_score` [INDEX] · (`composite_score`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_path_templates`

- **Tenant scoped**: yes
- **Row estimate**: 16
- **Domains**: TALPIPE
- **Prisma model**: `career_path_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                   |       |
| 3   | `name`                | varchar(255) | NO   | —                   |       |
| 4   | `description`         | text         | YES  | —                   |       |
| 5   | `from_role`           | varchar(255) | NO   | —                   |       |
| 6   | `to_role`             | varchar(255) | NO   | —                   |       |
| 7   | `from_job_family_id`  | uuid         | YES  | —                   |       |
| 8   | `to_job_family_id`    | uuid         | YES  | —                   |       |
| 9   | `estimated_months`    | int4(32)     | YES  | —                   |       |
| 10  | `required_skills`     | jsonb        | YES  | `'[]'::jsonb`       |       |
| 11  | `recommended_courses` | jsonb        | YES  | `'[]'::jsonb`       |       |
| 12  | `success_rate`        | numeric(3,2) | YES  | —                   |       |
| 13  | `is_active`           | bool         | NO   | `true`              |       |
| 14  | `created_at`          | timestamptz  | NO   | `now()`             |       |
| 15  | `updated_at`          | timestamptz  | NO   | `now()`             |       |
| 16  | `deleted_at`          | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `career_path_templates_pkey` [PRIMARY] · (`id`)
- `idx_career_path_templates_active` [INDEX] · (`id`)
- `idx_career_path_templates_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_paths`

- **Tenant scoped**: yes
- **Row estimate**: 32
- **Domains**: TALPIPE
- **Prisma model**: `career_paths`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                       | Notes                                                              |
| --- | ------------------------ | ------------ | ---- | ----------------------------- | ------------------------------------------------------------------ |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`           | PK                                                                 |
| 2   | `tenant_id`              | uuid         | NO   | —                             |                                                                    |
| 3   | `name`                   | varchar(200) | NO   | —                             |                                                                    |
| 4   | `description`            | text         | YES  | —                             |                                                                    |
| 5   | `department`             | varchar(100) | YES  | —                             |                                                                    |
| 6   | `path_type`              | varchar(50)  | YES  | `'linear'::character varying` |                                                                    |
| 7   | `is_active`              | bool         | YES  | `true`                        |                                                                    |
| 8   | `created_by`             | uuid         | YES  | —                             |                                                                    |
| 9   | `created_at`             | timestamp    | YES  | `now()`                       |                                                                    |
| 10  | `updated_at`             | timestamp    | YES  | `now()`                       |                                                                    |
| 11  | `created_by_employee_id` | uuid         | YES  | —                             |                                                                    |
| 12  | `embedding`              | vector       | YES  | —                             | Semantic embedding of career path (name, description, target role) |
| 13  | `embedding_text_hash`    | varchar(64)  | YES  | —                             |                                                                    |
| 14  | `embedding_model`        | varchar(100) | YES  | —                             |                                                                    |
| 15  | `embedding_generated_at` | timestamptz  | YES  | —                             |                                                                    |
| 16  | `deleted_at`             | timestamptz  | YES  | —                             |                                                                    |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `career_paths_pkey` [PRIMARY] · (`id`)
- `idx_career_paths_active` [INDEX] · (`id`)
- `idx_career_paths_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_career_paths_embedding` [INDEX] · (`embedding`)
- `idx_career_paths_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `career_path_recommendations` via (`path_id`)
- `career_simulations` via (`target_path_id`)
- `employee_career_progress` via (`path_id`)

---

### `career_profiles`

- **Tenant scoped**: yes
- **Row estimate**: 158
- **Domains**: TALPIPE
- **Prisma model**: `career_profiles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type        | Null | Default                              | Notes |
| --- | ----------------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                    | uuid        | NO   | `gen_random_uuid()`                  | PK    |
| 2   | `tenant_id`             | uuid        | NO   | —                                    |       |
| 3   | `employee_id`           | uuid        | NO   | —                                    |       |
| 4   | `current_job_family_id` | uuid        | YES  | —                                    |       |
| 5   | `career_aspiration`     | text        | YES  | —                                    |       |
| 6   | `preferred_work_style`  | varchar(50) | YES  | —                                    |       |
| 7   | `mobility_preference`   | varchar(50) | YES  | `'same_location'::character varying` |       |
| 8   | `last_assessment_date`  | timestamptz | YES  | —                                    |       |
| 9   | `created_at`            | timestamptz | NO   | `now()`                              |       |
| 10  | `updated_at`            | timestamptz | NO   | `now()`                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `career_profiles_pkey` [PRIMARY] · (`id`)
- `idx_career_profiles_tenant` [INDEX] · (`tenant_id`)
- `unique_career_profile` [UNIQUE] · (`employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `career_conversations` via (`profile_id`)
- `career_goals` via (`profile_id`)
- `career_recommendations` via (`profile_id`)
- `career_skills` via (`profile_id`)

---

### `career_recommendations`

- **Tenant scoped**: yes
- **Row estimate**: 192
- **Domains**: TALPIPE
- **Prisma model**: `career_recommendations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default             | Notes |
| --- | ----------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                   |       |
| 3   | `profile_id`      | uuid         | NO   | —                   |       |
| 4   | `type`            | varchar(50)  | NO   | —                   |       |
| 5   | `reference_type`  | varchar(50)  | NO   | —                   |       |
| 6   | `reference_id`    | uuid         | YES  | —                   |       |
| 7   | `title`           | varchar(255) | NO   | —                   |       |
| 8   | `description`     | text         | YES  | —                   |       |
| 9   | `relevance_score` | numeric(3,2) | NO   | `0.5`               |       |
| 10  | `reason`          | text         | YES  | —                   |       |
| 11  | `is_dismissed`    | bool         | NO   | `false`             |       |
| 12  | `created_at`      | timestamptz  | NO   | `now()`             |       |
| 13  | `expires_at`      | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References            | ON UPDATE | ON DELETE | Notes |
| ------------ | --------------------- | --------- | --------- | ----- |
| `profile_id` | `career_profiles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `career_recommendations_pkey` [PRIMARY] · (`id`)
- `idx_career_recommendations_tenant_id` [INDEX] · (`tenant_id`)
- `idx_career_recommendations_type` [INDEX] · (`profile_id`, `type`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_simulations`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: TALPIPE
- **Prisma model**: `career_simulations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                      | Type         | Null | Default             | Notes |
| --- | --------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                        | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                 | uuid         | NO   | —                   |       |
| 3   | `employee_id`               | uuid         | NO   | —                   |       |
| 4   | `simulation_name`           | varchar(200) | YES  | —                   |       |
| 5   | `target_job_id`             | uuid         | YES  | —                   |       |
| 6   | `target_path_id`            | uuid         | YES  | —                   |       |
| 7   | `target_level_id`           | uuid         | YES  | —                   |       |
| 8   | `current_skills_snapshot`   | jsonb        | YES  | —                   |       |
| 9   | `current_gap_analysis`      | jsonb        | YES  | —                   |       |
| 10  | `is_reachable`              | bool         | YES  | —                   |       |
| 11  | `skill_distance`            | numeric(5,2) | YES  | —                   |       |
| 12  | `estimated_timeline_months` | int4(32)     | YES  | —                   |       |
| 13  | `required_trainings`        | jsonb        | YES  | —                   |       |
| 14  | `required_experiences`      | jsonb        | YES  | —                   |       |
| 15  | `milestone_plan`            | jsonb        | YES  | —                   |       |
| 16  | `alternative_paths`         | jsonb        | YES  | —                   |       |
| 17  | `created_at`                | timestamptz  | YES  | `now()`             |       |
| 18  | `created_by`                | uuid         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References               | ON UPDATE | ON DELETE | Notes |
| ----------------- | ------------------------ | --------- | --------- | ----- |
| `created_by`      | `employees_core(id)`     | NO ACTION | SET NULL  |       |
| `employee_id`     | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `target_job_id`   | `tenant_jobs(id)`        | NO ACTION | CASCADE   |       |
| `target_level_id` | `career_path_levels(id)` | NO ACTION | CASCADE   |       |
| `target_path_id`  | `career_paths(id)`       | NO ACTION | CASCADE   |       |
| `tenant_id`       | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `career_simulations_pkey` [PRIMARY] · (`id`)
- `idx_career_simulations_created_by` [INDEX] · (`created_by`)
- `idx_career_simulations_employee` [INDEX] · (`employee_id`)
- `idx_career_simulations_target_job` [INDEX] · (`target_job_id`)
- `idx_career_simulations_target_level_id` [INDEX] · (`target_level_id`)
- `idx_career_simulations_target_path_id` [INDEX] · (`target_path_id`)
- `idx_career_simulations_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `career_skills`

- **Tenant scoped**: yes
- **Row estimate**: 1106
- **Domains**: TALPIPE
- **Prisma model**: `career_skills`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                     | Notes |
| --- | ---------------- | ------------ | ---- | --------------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()`         | PK    |
| 2   | `tenant_id`      | uuid         | NO   | —                           |       |
| 3   | `profile_id`     | uuid         | NO   | —                           |       |
| 4   | `skill_id`       | uuid         | YES  | —                           |       |
| 5   | `skill_name`     | varchar(255) | NO   | —                           |       |
| 6   | `proficiency`    | int4(32)     | NO   | `1`                         |       |
| 7   | `source`         | varchar(50)  | NO   | `'self'::character varying` |       |
| 8   | `validated_by`   | uuid         | YES  | —                           |       |
| 9   | `validated_at`   | timestamptz  | YES  | —                           |       |
| 10  | `evidence_notes` | text         | YES  | —                           |       |
| 11  | `created_at`     | timestamptz  | NO   | `now()`                     |       |
| 12  | `updated_at`     | timestamptz  | NO   | `now()`                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References            | ON UPDATE | ON DELETE | Notes |
| -------------- | --------------------- | --------- | --------- | ----- |
| `profile_id`   | `career_profiles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`    | `tenants(id)`         | NO ACTION | CASCADE   |       |
| `validated_by` | `users(id)`           | NO ACTION | SET NULL  |       |
| `skill_id`     | `esco_skills(id)`     | NO ACTION | RESTRICT  |       |

#### Indexes

- `career_skills_pkey` [PRIMARY] · (`id`)
- `idx_career_skills_profile` [INDEX] · (`profile_id`)
- `idx_career_skills_skill` [INDEX] · (`skill_id`)
- `idx_career_skills_tenant_id` [INDEX] · (`tenant_id`)
- `idx_career_skills_validated_by` [INDEX] · (`validated_by`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `critical_roles`

- **Tenant scoped**: yes
- **Row estimate**: 16
- **Domains**: TALPIPE
- **Prisma model**: `critical_roles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default                        | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`             | uuid         | NO   | —                              |       |
| 3   | `role_name`             | varchar(255) | NO   | —                              |       |
| 4   | `department`            | varchar(100) | YES  | —                              |       |
| 5   | `current_incumbent_id`  | uuid         | YES  | —                              |       |
| 6   | `criticality_level`     | varchar(20)  | YES  | `'High'::character varying`    |       |
| 7   | `impact_if_vacant`      | text         | YES  | —                              |       |
| 8   | `time_to_fill_estimate` | int4(32)     | YES  | —                              |       |
| 9   | `succession_status`     | varchar(50)  | YES  | `'at_risk'::character varying` |       |
| 10  | `created_at`            | timestamp    | YES  | `now()`                        |       |
| 11  | `updated_at`            | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `critical_roles_pkey` [PRIMARY] · (`id`)
- `idx_critical_roles_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `employee_career_paths`

- **Tenant scoped**: yes
- **Row estimate**: 128
- **Domains**: TALPIPE
- **Prisma model**: `employee_career_paths`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type        | Null | Default                       | Notes |
| --- | ------------------------- | ----------- | ---- | ----------------------------- | ----- |
| 1   | `id`                      | uuid        | NO   | `gen_random_uuid()`           | PK    |
| 2   | `employee_id`             | uuid        | YES  | —                             |       |
| 3   | `path_id`                 | uuid        | YES  | —                             |       |
| 4   | `current_level_id`        | uuid        | YES  | —                             |       |
| 5   | `status`                  | varchar(30) | YES  | `'active'::character varying` |       |
| 6   | `started_at`              | timestamp   | YES  | `now()`                       |       |
| 7   | `target_completion`       | date        | YES  | —                             |       |
| 8   | `notes`                   | text        | YES  | —                             |       |
| 9   | `assigned_by`             | uuid        | YES  | —                             |       |
| 10  | `created_at`              | timestamp   | YES  | `now()`                       |       |
| 11  | `updated_at`              | timestamp   | YES  | `now()`                       |       |
| 12  | `assigned_by_employee_id` | uuid        | YES  | —                             |       |
| 13  | `tenant_id`               | uuid        | NO   | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------- | -------------------- | --------- | --------- | ----- |
| `assigned_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `employee_id`             | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`               | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `employee_career_paths_pkey` [PRIMARY] · (`id`)
- `idx_employee_career_paths_assigned_by_employee_id` [INDEX] · (`assigned_by_employee_id`)
- `idx_employee_career_paths_emp` [INDEX] · (`employee_id`)
- `idx_employee_career_paths_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_employee_career_paths** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `employee_career_progress`

- **Tenant scoped**: yes
- **Row estimate**: 40
- **Domains**: TALPIPE
- **Prisma model**: `employee_career_progress`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                      | Type         | Null | Default                            | Notes |
| --- | --------------------------- | ------------ | ---- | ---------------------------------- | ----- |
| 1   | `id`                        | uuid         | NO   | `gen_random_uuid()`                | PK    |
| 2   | `tenant_id`                 | uuid         | NO   | —                                  |       |
| 3   | `employee_id`               | uuid         | NO   | —                                  |       |
| 4   | `path_id`                   | uuid         | NO   | —                                  |       |
| 5   | `level_id`                  | uuid         | NO   | —                                  |       |
| 6   | `status`                    | varchar(20)  | YES  | `'not_started'::character varying` |       |
| 7   | `started_at`                | timestamptz  | YES  | —                                  |       |
| 8   | `completed_at`              | timestamptz  | YES  | —                                  |       |
| 9   | `overall_fit_score`         | numeric(3,2) | YES  | —                                  |       |
| 10  | `skill_coverage_pct`        | numeric(5,2) | YES  | —                                  |       |
| 11  | `avg_skill_gap`             | numeric(3,2) | YES  | —                                  |       |
| 12  | `critical_gaps_count`       | int4(32)     | YES  | `0`                                |       |
| 13  | `estimated_months_to_ready` | int4(32)     | YES  | —                                  |       |
| 14  | `actual_months_spent`       | int4(32)     | YES  | —                                  |       |
| 15  | `last_analyzed_at`          | timestamptz  | YES  | —                                  |       |
| 16  | `analysis_version`          | int4(32)     | YES  | `1`                                |       |
| 17  | `created_at`                | timestamptz  | YES  | `now()`                            |       |
| 18  | `updated_at`                | timestamptz  | YES  | `now()`                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References               | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------ | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `level_id`    | `career_path_levels(id)` | NO ACTION | CASCADE   |       |
| `path_id`     | `career_paths(id)`       | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `employee_career_progress_employee_id_level_id_key` [UNIQUE] · (`employee_id`, `level_id`)
- `employee_career_progress_pkey` [PRIMARY] · (`id`)
- `idx_career_progress_path` [INDEX] · (`path_id`)
- `idx_career_progress_status` [INDEX] · (`status`)
- `idx_employee_career_progress_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `internal_mobility_postings`

- **Tenant scoped**: yes
- **Row estimate**: 27
- **Domains**: TALPIPE
- **Prisma model**: `internal_mobility_postings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type          | Null | Default                       | Notes |
| --- | ------------------- | ------------- | ---- | ----------------------------- | ----- |
| 1   | `id`                | uuid          | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`         | uuid          | NO   | —                             |       |
| 3   | `title`             | varchar(255)  | NO   | —                             |       |
| 4   | `location_id`       | uuid          | YES  | —                             |       |
| 5   | `work_type`         | varchar(30)   | YES  | `'hybrid'::character varying` |       |
| 6   | `summary`           | text          | YES  | —                             |       |
| 7   | `job_level`         | varchar(50)   | YES  | —                             |       |
| 8   | `job_family`        | varchar(100)  | YES  | —                             |       |
| 9   | `required_skills`   | \_text        | YES  | —                             |       |
| 10  | `min_tenure_months` | int4(32)      | YES  | `6`                           |       |
| 11  | `min_rating`        | numeric(3,1)  | YES  | —                             |       |
| 12  | `salary_min`        | numeric(12,2) | YES  | —                             |       |
| 13  | `salary_max`        | numeric(12,2) | YES  | —                             |       |
| 14  | `currency`          | varchar(10)   | YES  | `'EUR'::character varying`    |       |
| 15  | `status`            | varchar(30)   | YES  | `'draft'::character varying`  |       |
| 16  | `posted_at`         | timestamptz   | YES  | —                             |       |
| 17  | `expires_at`        | timestamptz   | YES  | —                             |       |
| 18  | `hiring_manager_id` | uuid          | YES  | —                             |       |
| 19  | `created_by`        | uuid          | YES  | —                             |       |
| 20  | `created_at`        | timestamptz   | YES  | `now()`                       |       |
| 21  | `updated_at`        | timestamptz   | YES  | `now()`                       |       |
| 22  | `org_unit_id`       | uuid          | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References           | ON UPDATE | ON DELETE | Notes |
| ------------------- | -------------------- | --------- | --------- | ----- |
| `created_by`        | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `hiring_manager_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `location_id`       | `locations(id)`      | NO ACTION | RESTRICT  |       |
| `org_unit_id`       | `org_units(id)`      | NO ACTION | CASCADE   |       |
| `tenant_id`         | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_internal_mobility_postings_created_by` [INDEX] · (`created_by`)
- `idx_internal_mobility_postings_hiring_manager_id` [INDEX] · (`hiring_manager_id`)
- `idx_internal_mobility_postings_location_id` [INDEX] · (`location_id`)
- `idx_internal_mobility_postings_org_unit_id` [INDEX] · (`org_unit_id`)
- `idx_internal_mobility_postings_status` [INDEX] · (`status`)
- `idx_internal_mobility_postings_tenant` [INDEX] · (`tenant_id`)
- `internal_mobility_postings_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_internal_mobility_postings_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `internal_mobility_requests`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: TALPIPE
- **Prisma model**: `internal_mobility_requests`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                        | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                              |       |
| 3   | `employee_id`            | uuid         | NO   | —                              |       |
| 4   | `current_position`       | varchar(200) | YES  | —                              |       |
| 5   | `current_department_id`  | uuid         | YES  | —                              |       |
| 6   | `target_position`        | varchar(200) | YES  | —                              |       |
| 7   | `target_department_id`   | uuid         | YES  | —                              |       |
| 8   | `target_location_id`     | uuid         | YES  | —                              |       |
| 9   | `motivation`             | text         | YES  | —                              |       |
| 10  | `career_goals`           | text         | YES  | —                              |       |
| 11  | `timeline`               | varchar(50)  | YES  | —                              |       |
| 12  | `status`                 | varchar(50)  | YES  | `'pending'::character varying` |       |
| 13  | `manager_notes`          | text         | YES  | —                              |       |
| 14  | `hr_notes`               | text         | YES  | —                              |       |
| 15  | `created_at`             | timestamptz  | YES  | `now()`                        |       |
| 16  | `updated_at`             | timestamptz  | YES  | `now()`                        |       |
| 17  | `request_embedding`      | vector       | YES  | —                              |       |
| 18  | `embedding_model`        | varchar(100) | YES  | —                              |       |
| 19  | `embedding_generated_at` | timestamptz  | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_mobility_requests_embedding` [INDEX] · (`request_embedding`)
- `idx_mobility_requests_employee` [INDEX] · (`employee_id`)
- `idx_mobility_requests_tenant` [INDEX] · (`tenant_id`, `status`)
- `internal_mobility_requests_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `mentor_match_scores`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: TALPIPE
- **Prisma model**: `mentor_match_scores`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                         | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                               |       |
| 3   | `mentee_id`           | uuid         | NO   | —                               |       |
| 4   | `mentor_id`           | uuid         | NO   | —                               |       |
| 5   | `skill_id`            | uuid         | YES  | —                               |       |
| 6   | `skill_name`          | varchar(200) | YES  | —                               |       |
| 7   | `mentee_level`        | numeric(3,2) | YES  | —                               |       |
| 8   | `mentor_level`        | numeric(3,2) | YES  | —                               |       |
| 9   | `match_score`         | numeric(5,4) | YES  | —                               |       |
| 10  | `match_factors`       | jsonb        | YES  | `'{}'::jsonb`                   |       |
| 11  | `is_recommended`      | bool         | YES  | `false`                         |       |
| 12  | `recommendation_rank` | int4(32)     | YES  | —                               |       |
| 13  | `created_at`          | timestamptz  | YES  | `now()`                         |       |
| 14  | `expires_at`          | timestamptz  | YES  | `(now() + '30 days'::interval)` |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `mentee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `mentor_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `skill_id`  | `esco_skills(id)`    | NO ACTION | SET NULL  |       |
| `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_mentor_match_mentee` [INDEX] · (`mentee_id`)
- `idx_mentor_match_score` [INDEX] · (`match_score`)
- `idx_mentor_match_scores_tenant_id` [INDEX] · (`tenant_id`)
- `idx_mentor_match_skill` [INDEX] · (`skill_id`)
- `mentor_match_scores_mentee_id_mentor_id_skill_id_key` [UNIQUE] · (`mentee_id`, `mentor_id`, `skill_id`)
- `mentor_match_scores_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_mentor_matches** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `mentorship_programs`

- **Tenant scoped**: yes
- **Row estimate**: 12
- **Domains**: TALPIPE
- **Prisma model**: `mentorship_programs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                        | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`            | uuid         | NO   | —                              |       |
| 3   | `name`                 | varchar(255) | NO   | —                              |       |
| 4   | `description`          | text         | YES  | —                              |       |
| 5   | `program_type`         | varchar(50)  | YES  | `'general'::character varying` |       |
| 6   | `status`               | varchar(20)  | YES  | `'active'::character varying`  |       |
| 7   | `duration_months`      | int4(32)     | YES  | `6`                            |       |
| 8   | `max_participants`     | int4(32)     | YES  | `50`                           |       |
| 9   | `focus_areas`          | \_text       | YES  | —                              |       |
| 10  | `eligibility_criteria` | jsonb        | YES  | —                              |       |
| 11  | `start_date`           | date         | YES  | —                              |       |
| 12  | `end_date`             | date         | YES  | —                              |       |
| 13  | `created_at`           | timestamp    | YES  | `now()`                        |       |
| 14  | `updated_at`           | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_mentorship_programs_tenant_id` [INDEX] · (`tenant_id`)
- `mentorship_programs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `mentorship_sessions`

- **Tenant scoped**: yes
- **Row estimate**: 355
- **Domains**: TALPIPE
- **Prisma model**: `mentorship_sessions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type        | Null | Default                          | Notes |
| --- | ------------------ | ----------- | ---- | -------------------------------- | ----- |
| 1   | `id`               | uuid        | NO   | `gen_random_uuid()`              | PK    |
| 2   | `mentorship_id`    | uuid        | NO   | —                                |       |
| 3   | `session_date`     | timestamp   | NO   | —                                |       |
| 4   | `duration_minutes` | int4(32)    | YES  | `60`                             |       |
| 5   | `status`           | varchar(20) | YES  | `'scheduled'::character varying` |       |
| 6   | `topics`           | \_text      | YES  | —                                |       |
| 7   | `notes`            | text        | YES  | —                                |       |
| 8   | `rating`           | int4(32)    | YES  | —                                |       |
| 9   | `created_at`       | timestamp   | YES  | `now()`                          |       |
| 10  | `tenant_id`        | uuid        | NO   | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `mentorship_id` | `mentorships(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_mentorship_sessions_mentorship_id` [INDEX] · (`mentorship_id`)
- `idx_mentorship_sessions_tenant` [INDEX] · (`tenant_id`)
- `mentorship_sessions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_mentorship_sessions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `mentorships`

- **Tenant scoped**: yes
- **Row estimate**: 124
- **Domains**: TALPIPE
- **Prisma model**: `mentorships`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                          | Notes |
| --- | ------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                                |       |
| 3   | `program_id`        | uuid         | YES  | —                                |       |
| 4   | `mentor_id`         | uuid         | NO   | —                                |       |
| 5   | `mentee_id`         | uuid         | NO   | —                                |       |
| 6   | `status`            | varchar(30)  | YES  | `'active'::character varying`    |       |
| 7   | `focus_areas`       | \_text       | YES  | —                                |       |
| 8   | `meeting_frequency` | varchar(30)  | YES  | `'bi-weekly'::character varying` |       |
| 9   | `goals`             | \_text       | YES  | —                                |       |
| 10  | `match_score`       | numeric(5,2) | YES  | —                                |       |
| 11  | `start_date`        | date         | YES  | `CURRENT_DATE`                   |       |
| 12  | `end_date`          | date         | YES  | —                                |       |
| 13  | `notes`             | text         | YES  | —                                |       |
| 14  | `created_at`        | timestamp    | YES  | `now()`                          |       |
| 15  | `updated_at`        | timestamp    | YES  | `now()`                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_mentorships_tenant_id` [INDEX] · (`tenant_id`)
- `mentorships_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `mentorship_sessions` via (`mentorship_id`)

---

### `succession_candidates`

- **Tenant scoped**: yes
- **Row estimate**: 188
- **Domains**: TALPIPE
- **Prisma model**: `succession_candidates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type        | Null | Default                              | Notes |
| --- | ----------------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                    | uuid        | NO   | `gen_random_uuid()`                  | PK    |
| 2   | `critical_role_id`      | uuid        | YES  | —                                    |       |
| 3   | `candidate_employee_id` | uuid        | YES  | —                                    |       |
| 4   | `readiness_level`       | varchar(50) | YES  | `'ready_2_years'::character varying` |       |
| 5   | `strengths`             | text        | YES  | —                                    |       |
| 6   | `development_needs`     | text        | YES  | —                                    |       |
| 7   | `development_plan`      | text        | YES  | —                                    |       |
| 8   | `rank_order`            | int4(32)    | YES  | `1`                                  |       |
| 9   | `created_at`            | timestamp   | YES  | `now()`                              |       |
| 10  | `updated_at`            | timestamp   | YES  | `now()`                              |       |
| 11  | `tenant_id`             | uuid        | NO   | —                                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns            | References             | ON UPDATE | ON DELETE | Notes |
| ------------------ | ---------------------- | --------- | --------- | ----- |
| `tenant_id`        | `tenants(id)`          | NO ACTION | CASCADE   |       |
| `critical_role_id` | `succession_plans(id)` | CASCADE   | SET NULL  |       |

#### Indexes

- `idx_succession_candidates_role` [INDEX] · (`critical_role_id`)
- `idx_succession_candidates_tenant` [INDEX] · (`tenant_id`)
- `succession_candidates_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_succession_candidates** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `succession_plans`

- **Tenant scoped**: yes
- **Row estimate**: 28
- **Domains**: TALPIPE
- **Prisma model**: `succession_plans`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                       | Notes |
| --- | ------------------------ | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                             |       |
| 3   | `position_name`          | varchar(200) | NO   | —                             |       |
| 4   | `position_id`            | uuid         | YES  | —                             |       |
| 5   | `incumbent_employee_id`  | uuid         | YES  | —                             |       |
| 6   | `criticality_level`      | varchar(20)  | YES  | `'medium'::character varying` |       |
| 7   | `risk_level`             | varchar(20)  | YES  | `'medium'::character varying` |       |
| 8   | `notes`                  | text         | YES  | —                             |       |
| 9   | `target_date`            | date         | YES  | —                             |       |
| 10  | `status`                 | varchar(50)  | YES  | `'active'::character varying` |       |
| 11  | `created_by`             | uuid         | YES  | —                             |       |
| 12  | `created_at`             | timestamptz  | YES  | `now()`                       |       |
| 13  | `updated_at`             | timestamptz  | YES  | `now()`                       |       |
| 14  | `embedding`              | vector       | YES  | —                             |       |
| 15  | `embedding_text_hash`    | varchar(64)  | YES  | —                             |       |
| 16  | `embedding_model`        | varchar(100) | YES  | —                             |       |
| 17  | `embedding_generated_at` | timestamptz  | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_succession_plans_embedding` [INDEX] · (`embedding`)
- `idx_succession_plans_tenant` [INDEX] · (`tenant_id`, `status`)
- `succession_plans_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `succession_candidates` via (`critical_role_id`)

---

### `talent_pool_members`

- **Tenant scoped**: yes
- **Row estimate**: 40
- **Domains**: TALPIPE
- **Prisma model**: `talent_pool_members`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type        | Null | Default             | Notes |
| --- | ---------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`             | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`      | uuid        | NO   | —                   |       |
| 3   | `talent_pool_id` | uuid        | NO   | —                   |       |
| 4   | `employee_id`    | uuid        | NO   | —                   |       |
| 5   | `added_reason`   | text        | YES  | —                   |       |
| 6   | `added_by`       | uuid        | YES  | —                   |       |
| 7   | `added_at`       | timestamptz | YES  | `now()`             |       |
| 8   | `removed_at`     | timestamptz | YES  | —                   |       |
| 9   | `removed_reason` | text        | YES  | —                   |       |
| 10  | `created_at`     | timestamptz | YES  | `now()`             |       |
| 11  | `updated_at`     | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References           | ON UPDATE | ON DELETE | Notes |
| ---------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`    | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `talent_pool_id` | `talent_pools(id)`   | NO ACTION | CASCADE   |       |
| `tenant_id`      | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_talent_pool_members_employee` [INDEX] · (`tenant_id`, `employee_id`)
- `idx_talent_pool_members_pool` [INDEX] · (`talent_pool_id`)
- `talent_pool_members_pkey` [PRIMARY] · (`id`)
- `uk_talent_pool_member` [UNIQUE] · (`talent_pool_id`, `employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `talent_pools`

- **Tenant scoped**: yes
- **Row estimate**: 24
- **Domains**: TALPIPE
- **Prisma model**: `talent_pools`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default             | Notes |
| --- | ----------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                   |       |
| 3   | `name`            | varchar(200) | NO   | —                   |       |
| 4   | `description`     | text         | YES  | —                   |       |
| 5   | `pool_type`       | varchar(50)  | NO   | —                   |       |
| 6   | `criteria`        | jsonb        | YES  | —                   |       |
| 7   | `is_active`       | bool         | YES  | `true`              |       |
| 8   | `created_by`      | uuid         | YES  | —                   |       |
| 9   | `created_at`      | timestamptz  | YES  | `now()`             |       |
| 10  | `updated_at`      | timestamptz  | YES  | `now()`             |       |
| 11  | `embedding`       | vector       | YES  | —                   |       |
| 12  | `embedding_model` | varchar(100) | YES  | —                   |       |
| 13  | `deleted_at`      | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_talent_pools_active` [INDEX] · (`id`)
- `idx_talent_pools_embedding` [INDEX] · (`embedding`)
- `idx_talent_pools_tenant` [INDEX] · (`tenant_id`, `is_active`)
- `talent_pools_pkey` [PRIMARY] · (`id`)
- `uk_talent_pool_name` [UNIQUE] · (`tenant_id`, `name`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `talent_pool_members` via (`talent_pool_id`)

---

### `workforce_plan_actions`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: TALPIPE
- **Prisma model**: `workforce_plan_actions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type          | Null | Default                        | Notes |
| --- | -------------------- | ------------- | ---- | ------------------------------ | ----- |
| 1   | `id`                 | uuid          | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`          | uuid          | NO   | —                              |       |
| 3   | `workforce_plan_id`  | uuid          | NO   | —                              |       |
| 4   | `scenario_id`        | uuid          | YES  | —                              |       |
| 5   | `action_type`        | varchar(50)   | NO   | —                              |       |
| 6   | `priority`           | varchar(20)   | YES  | `'medium'::character varying`  |       |
| 7   | `title`              | varchar(255)  | NO   | —                              |       |
| 8   | `description`        | text          | YES  | —                              |       |
| 9   | `target_role`        | varchar(200)  | YES  | —                              |       |
| 10  | `headcount`          | int4(32)      | YES  | `1`                            |       |
| 11  | `target_date`        | date          | YES  | —                              |       |
| 12  | `status`             | varchar(20)   | YES  | `'pending'::character varying` |       |
| 13  | `estimated_cost`     | numeric(12,2) | YES  | —                              |       |
| 14  | `notes`              | text          | YES  | —                              |       |
| 15  | `created_at`         | timestamptz   | YES  | `now()`                        |       |
| 16  | `updated_at`         | timestamptz   | YES  | `now()`                        |       |
| 17  | `target_org_unit_id` | uuid          | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References                     | ON UPDATE | ON DELETE | Notes |
| -------------------- | ------------------------------ | --------- | --------- | ----- |
| `scenario_id`        | `workforce_plan_scenarios(id)` | NO ACTION | CASCADE   |       |
| `target_org_unit_id` | `org_units(id)`                | NO ACTION | CASCADE   |       |
| `tenant_id`          | `tenants(id)`                  | NO ACTION | CASCADE   |       |
| `workforce_plan_id`  | `workforce_plans(id)`          | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_workforce_plan_actions_plan` [INDEX] · (`workforce_plan_id`)
- `idx_workforce_plan_actions_scenario_id` [INDEX] · (`scenario_id`)
- `idx_workforce_plan_actions_target_org_unit_id` [INDEX] · (`target_org_unit_id`)
- `idx_workforce_plan_actions_tenant` [INDEX] · (`tenant_id`)
- `workforce_plan_actions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_workforce_plan_actions_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `workforce_plan_scenarios`

- **Tenant scoped**: yes
- **Row estimate**: 9
- **Domains**: TALPIPE
- **Prisma model**: `workforce_plan_scenarios`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                      | Notes |
| --- | ------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                            |       |
| 3   | `workforce_plan_id` | uuid         | NO   | —                            |       |
| 4   | `name`              | varchar(255) | NO   | —                            |       |
| 5   | `description`       | text         | YES  | —                            |       |
| 6   | `scenario_type`     | varchar(50)  | YES  | `'base'::character varying`  |       |
| 7   | `assumptions`       | jsonb        | YES  | `'{}'::jsonb`                |       |
| 8   | `target_date`       | date         | YES  | —                            |       |
| 9   | `status`            | varchar(20)  | YES  | `'draft'::character varying` |       |
| 10  | `created_by`        | uuid         | YES  | —                            |       |
| 11  | `created_at`        | timestamptz  | YES  | `now()`                      |       |
| 12  | `updated_at`        | timestamptz  | YES  | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References            | ON UPDATE | ON DELETE | Notes |
| ------------------- | --------------------- | --------- | --------- | ----- |
| `created_by`        | `employees_core(id)`  | NO ACTION | SET NULL  |       |
| `tenant_id`         | `tenants(id)`         | NO ACTION | CASCADE   |       |
| `workforce_plan_id` | `workforce_plans(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_workforce_plan_scenarios_created_by` [INDEX] · (`created_by`)
- `idx_workforce_plan_scenarios_plan` [INDEX] · (`workforce_plan_id`)
- `idx_workforce_plan_scenarios_tenant` [INDEX] · (`tenant_id`)
- `workforce_plan_scenarios_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **rls_workforce_plan_scenarios_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `workforce_plan_actions` via (`scenario_id`)

---

### `workforce_plans`

- **Tenant scoped**: yes
- **Row estimate**: 43
- **Domains**: TALPIPE
- **Prisma model**: `workforce_plans`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                      | Notes                                         |
| --- | ------------------------ | ------------ | ---- | ---------------------------- | --------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`          | PK                                            |
| 2   | `tenant_id`              | uuid         | NO   | —                            |                                               |
| 3   | `name`                   | varchar(255) | NO   | —                            |                                               |
| 4   | `description`            | text         | YES  | —                            |                                               |
| 5   | `target_date`            | date         | NO   | —                            |                                               |
| 6   | `status`                 | varchar(20)  | NO   | `'draft'::character varying` |                                               |
| 7   | `requirements`           | jsonb        | NO   | `'[]'::jsonb`                | JSONB BY DESIGN: workforce demand model.      |
| 8   | `gap_analysis`           | jsonb        | NO   | `'[]'::jsonb`                | JSONB BY DESIGN: computed workforce gap.      |
| 9   | `hiring_recommendations` | jsonb        | NO   | `'[]'::jsonb`                | JSONB BY DESIGN: computed hiring suggestions. |
| 10  | `training_investments`   | jsonb        | NO   | `'[]'::jsonb`                | JSONB BY DESIGN: computed training ROI.       |
| 11  | `summary`                | jsonb        | NO   | `'{}'::jsonb`                | JSONB BY DESIGN: plan summary snapshot.       |
| 12  | `created_by`             | uuid         | YES  | —                            |                                               |
| 13  | `updated_by`             | uuid         | YES  | —                            |                                               |
| 14  | `created_at`             | timestamptz  | NO   | `now()`                      |                                               |
| 15  | `updated_at`             | timestamptz  | NO   | `now()`                      |                                               |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |
| `updated_by` | `users(id)`   | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_workforce_plans_created` [INDEX] · (`tenant_id`, `created_at`)
- `idx_workforce_plans_created_by` [INDEX] · (`created_by`)
- `idx_workforce_plans_requirements` [INDEX] · (`requirements`)
- `idx_workforce_plans_status` [INDEX] · (`tenant_id`, `status`)
- `idx_workforce_plans_summary` [INDEX] · (`summary`)
- `idx_workforce_plans_target_date` [INDEX] · (`tenant_id`, `target_date`)
- `idx_workforce_plans_tenant` [INDEX] · (`tenant_id`)
- `idx_workforce_plans_updated_by` [INDEX] · (`updated_by`)
- `workforce_plans_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `workforce_plan_actions` via (`workforce_plan_id`)
- `workforce_plan_scenarios` via (`workforce_plan_id`)

---
