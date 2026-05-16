# Dominio PULSAR — PUlse-LinkedScore-Action-Retention

> Engagement Loop

**Tabelle in questo dominio**: 29

## Tabelle

| Tabella                                                         | Rows | Tenant | RLS | FK out | Cols |
| --------------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`burnout_assessments`](#burnoutassessments)                    | 54   | ✓      | ✓   | 2      | 13   |
| [`club_events`](#clubevents)                                    | 237  | —      | —   | 0      | 13   |
| [`club_memberships`](#clubmemberships)                          | 9    | —      | —   | 1      | 8    |
| [`engagement_action_plans`](#engagementactionplans)             | 6    | ✓      | ✓   | 3      | 14   |
| [`engagement_feedback`](#engagementfeedback)                    | 685  | ✓      | ✓   | 2      | 9    |
| [`engagement_pulse_configs`](#engagementpulseconfigs)           | 3    | ✓      | ✓   | 2      | 14   |
| [`engagement_survey_responses`](#engagementsurveyresponses)     | 1327 | ✓      | ✓   | 3      | 10   |
| [`engagement_survey_templates`](#engagementsurveytemplates)     | 20   | ✓      | ✓   | 2      | 12   |
| [`engagement_surveys`](#engagementsurveys)                      | 18   | ✓      | ✓   | 3      | 18   |
| [`news_article_tags`](#newsarticletags)                         | 19   | —      | —   | 2      | 3    |
| [`news_articles`](#newsarticles)                                | 32   | ✓      | ✓   | 3      | 22   |
| [`news_bookmarks`](#newsbookmarks)                              | 15   | ✓      | ✓   | 3      | 5    |
| [`news_categories`](#newscategories)                            | 20   | ✓      | ✓   | 2      | 13   |
| [`news_comments`](#newscomments)                                | 422  | ✓      | ✓   | 4      | 9    |
| [`news_reactions`](#newsreactions)                              | 780  | ✓      | ✓   | 3      | 6    |
| [`news_reads`](#newsreads)                                      | 1139 | ✓      | ✓   | 3      | 8    |
| [`news_tags`](#newstags)                                        | 8    | ✓      | ✓   | 1      | 5    |
| [`pulse_checks`](#pulsechecks)                                  | 1145 | ✓      | ✓   | 2      | 10   |
| [`social_comments`](#socialcomments)                            | 20   | —      | —   | 2      | 8    |
| [`social_likes`](#sociallikes)                                  | 48   | —      | —   | 3      | 5    |
| [`social_posts`](#socialposts)                                  | 20   | ✓      | ✓   | 1      | 16   |
| [`survey_questions`](#surveyquestions)                          | 31   | ✓      | ✓   | 2      | 10   |
| [`survey_responses`](#surveyresponses)                          | 4482 | ✓      | ✓   | 4      | 9    |
| [`survey_templates`](#surveytemplates)                          | 9    | ✓      | ✓   | 1      | 13   |
| [`surveys`](#surveys)                                           | 11   | ✓      | ✓   | 1      | 15   |
| [`wellbeing_checkins`](#wellbeingcheckins)                      | 1142 | ✓      | ✓   | 2      | 12   |
| [`wellbeing_goals`](#wellbeinggoals)                            | 120  | ✓      | ✓   | 2      | 14   |
| [`wellbeing_program_enrollments`](#wellbeingprogramenrollments) | 67   | ✓      | ✓   | 3      | 11   |
| [`wellbeing_resources`](#wellbeingresources)                    | 30   | ✓      | ✓   | 1      | 11   |

---

### `burnout_assessments`

- **Tenant scoped**: yes
- **Row estimate**: 54
- **Domains**: PULSAR
- **Prisma model**: `burnout_assessments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type        | Null | Default             | Notes |
| --- | -------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid        | NO   | —                   |       |
| 3   | `employee_id`        | uuid        | NO   | —                   |       |
| 4   | `assessment_date`    | date        | NO   | `CURRENT_DATE`      |       |
| 5   | `exhaustion_score`   | int4(32)    | YES  | —                   |       |
| 6   | `cynicism_score`     | int4(32)    | YES  | —                   |       |
| 7   | `inefficacy_score`   | int4(32)    | YES  | —                   |       |
| 8   | `overall_risk`       | varchar(20) | YES  | —                   |       |
| 9   | `workload_factor`    | int4(32)    | YES  | —                   |       |
| 10  | `autonomy_factor`    | int4(32)    | YES  | —                   |       |
| 11  | `recognition_factor` | int4(32)    | YES  | —                   |       |
| 12  | `recommendations`    | jsonb       | YES  | —                   |       |
| 13  | `created_at`         | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `burnout_assessments_pkey` [PRIMARY] · (`id`)
- `idx_burnout_assessments_employee` [INDEX] · (`employee_id`)
- `idx_burnout_assessments_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `club_events`

- **Tenant scoped**: no
- **Row estimate**: 237
- **Domains**: PULSAR
- **Prisma model**: `club_events`

#### Columns

| #   | Column            | Type         | Null | Default             | Notes |
| --- | ----------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `club_id`         | uuid         | YES  | —                   |       |
| 3   | `title`           | varchar(200) | NO   | —                   |       |
| 4   | `description`     | text         | YES  | —                   |       |
| 5   | `event_date`      | timestamp    | NO   | —                   |       |
| 6   | `end_date`        | timestamp    | YES  | —                   |       |
| 7   | `location`        | varchar(300) | YES  | —                   |       |
| 8   | `is_virtual`      | bool         | YES  | `false`             |       |
| 9   | `virtual_link`    | text         | YES  | —                   |       |
| 10  | `max_attendees`   | int4(32)     | YES  | —                   |       |
| 11  | `attendees_count` | int4(32)     | YES  | `0`                 |       |
| 12  | `created_by`      | uuid         | YES  | —                   |       |
| 13  | `created_at`      | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `club_events_pkey` [PRIMARY] · (`id`)
- `idx_club_events_club` [INDEX] · (`club_id`)

---

### `club_memberships`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: PULSAR
- **Prisma model**: `club_memberships`

#### Columns

| #   | Column        | Type        | Null | Default                       | Notes |
| --- | ------------- | ----------- | ---- | ----------------------------- | ----- |
| 1   | `id`          | uuid        | NO   | `gen_random_uuid()`           | PK    |
| 2   | `club_id`     | uuid        | YES  | —                             |       |
| 3   | `employee_id` | uuid        | YES  | —                             |       |
| 4   | `role`        | varchar(30) | YES  | `'member'::character varying` |       |
| 5   | `status`      | varchar(30) | YES  | `'active'::character varying` |       |
| 6   | `joined_at`   | timestamp   | YES  | `now()`                       |       |
| 7   | `created_at`  | timestamptz | YES  | `now()`                       |       |
| 8   | `updated_at`  | timestamptz | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `club_memberships_club_id_employee_id_key` [UNIQUE] · (`club_id`, `employee_id`)
- `club_memberships_pkey` [PRIMARY] · (`id`)

---

### `engagement_action_plans`

- **Tenant scoped**: yes
- **Row estimate**: 6
- **Domains**: PULSAR
- **Prisma model**: `engagement_action_plans`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type         | Null | Default                        | Notes |
| --- | -------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`    | uuid         | NO   | —                              |       |
| 3   | `source_type`  | varchar(50)  | NO   | —                              |       |
| 4   | `source_id`    | uuid         | YES  | —                              |       |
| 5   | `title`        | varchar(255) | NO   | —                              |       |
| 6   | `description`  | text         | YES  | —                              |       |
| 7   | `owner_id`     | uuid         | NO   | —                              |       |
| 8   | `status`       | varchar(20)  | NO   | `'planned'::character varying` |       |
| 9   | `priority`     | varchar(20)  | NO   | `'medium'::character varying`  |       |
| 10  | `due_date`     | date         | YES  | —                              |       |
| 11  | `completed_at` | timestamptz  | YES  | —                              |       |
| 12  | `created_by`   | uuid         | NO   | —                              |       |
| 13  | `created_at`   | timestamptz  | NO   | `now()`                        |       |
| 14  | `updated_at`   | timestamptz  | NO   | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `owner_id`   | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `engagement_action_plans_pkey` [PRIMARY] · (`id`)
- `idx_engagement_action_plans_created_by` [INDEX] · (`created_by`)
- `idx_engagement_actions_owner` [INDEX] · (`owner_id`)
- `idx_engagement_actions_status` [INDEX] · (`tenant_id`, `status`)
- `idx_engagement_actions_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `engagement_feedback`

- **Tenant scoped**: yes
- **Row estimate**: 685
- **Domains**: PULSAR
- **Prisma model**: `engagement_feedback`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type        | Null | Default                      | Notes |
| --- | -------------- | ----------- | ---- | ---------------------------- | ----- |
| 1   | `id`           | uuid        | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`    | uuid        | NO   | —                            |       |
| 3   | `category`     | varchar(50) | NO   | `'other'::character varying` |       |
| 4   | `message`      | text        | NO   | —                            |       |
| 5   | `status`       | varchar(20) | NO   | `'new'::character varying`   |       |
| 6   | `reviewed_by`  | uuid        | YES  | —                            |       |
| 7   | `reviewed_at`  | timestamptz | YES  | —                            |       |
| 8   | `action_notes` | text        | YES  | —                            |       |
| 9   | `created_at`   | timestamptz | NO   | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References    | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------- | --------- | --------- | ----- |
| `reviewed_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `engagement_feedback_pkey` [PRIMARY] · (`id`)
- `idx_engagement_feedback_created` [INDEX] · (`tenant_id`, `created_at`)
- `idx_engagement_feedback_reviewed_by` [INDEX] · (`reviewed_by`)
- `idx_engagement_feedback_status` [INDEX] · (`tenant_id`, `status`)
- `idx_engagement_feedback_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `engagement_pulse_configs`

- **Tenant scoped**: yes
- **Row estimate**: 3
- **Domains**: PULSAR
- **Prisma model**: `engagement_pulse_configs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                         | Notes |
| --- | ---------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`      | uuid         | NO   | —                               |       |
| 3   | `name`           | varchar(255) | NO   | —                               |       |
| 4   | `questions`      | jsonb        | NO   | `'[]'::jsonb`                   |       |
| 5   | `frequency`      | varchar(20)  | NO   | `'biweekly'::character varying` |       |
| 6   | `audience_type`  | varchar(20)  | NO   | `'all'::character varying`      |       |
| 7   | `audience_ids`   | \_uuid       | YES  | `'{}'::uuid[]`                  |       |
| 8   | `is_active`      | bool         | NO   | `true`                          |       |
| 9   | `last_sent_at`   | timestamptz  | YES  | —                               |       |
| 10  | `next_send_date` | timestamptz  | YES  | —                               |       |
| 11  | `created_by`     | uuid         | NO   | —                               |       |
| 12  | `created_at`     | timestamptz  | NO   | `now()`                         |       |
| 13  | `updated_at`     | timestamptz  | NO   | `now()`                         |       |
| 14  | `deleted_at`     | timestamptz  | YES  | —                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `engagement_pulse_configs_pkey` [PRIMARY] · (`id`)
- `idx_engagement_pulse_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_engagement_pulse_configs_active` [INDEX] · (`id`)
- `idx_engagement_pulse_configs_created_by` [INDEX] · (`created_by`)
- `idx_engagement_pulse_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `engagement_survey_responses`

- **Tenant scoped**: yes
- **Row estimate**: 1327
- **Domains**: PULSAR
- **Prisma model**: `engagement_survey_responses`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type        | Null | Default             | Notes                                      |
| --- | ----------------- | ----------- | ---- | ------------------- | ------------------------------------------ |
| 1   | `id`              | uuid        | NO   | `gen_random_uuid()` | PK                                         |
| 2   | `tenant_id`       | uuid        | NO   | —                   |                                            |
| 3   | `survey_id`       | uuid        | NO   | —                   |                                            |
| 4   | `employee_id`     | uuid        | YES  | —                   |                                            |
| 5   | `anonymous_token` | varchar(64) | YES  | —                   | Hash token for anonymous response tracking |
| 6   | `answers`         | jsonb       | NO   | `'[]'::jsonb`       |                                            |
| 7   | `started_at`      | timestamptz | NO   | `now()`             |                                            |
| 8   | `completed_at`    | timestamptz | YES  | —                   |                                            |
| 9   | `is_complete`     | bool        | NO   | `false`             |                                            |
| 10  | `created_at`      | timestamptz | YES  | `now()`             |                                            |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References               | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------ | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `survey_id`   | `engagement_surveys(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `engagement_survey_responses_pkey` [PRIMARY] · (`id`)
- `idx_engagement_responses_anonymous_unique` [UNIQUE] · (`survey_id`, `anonymous_token`)
- `idx_engagement_responses_complete` [INDEX] · (`survey_id`, `is_complete`)
- `idx_engagement_responses_employee` [INDEX] · (`employee_id`)
- `idx_engagement_responses_employee_unique` [UNIQUE] · (`survey_id`, `employee_id`)
- `idx_engagement_responses_survey` [INDEX] · (`survey_id`)
- `idx_engagement_survey_responses_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `engagement_survey_templates`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: PULSAR
- **Prisma model**: `engagement_survey_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column        | Type         | Null | Default                       | Notes                                                                      |
| --- | ------------- | ------------ | ---- | ----------------------------- | -------------------------------------------------------------------------- |
| 1   | `id`          | uuid         | NO   | `gen_random_uuid()`           | PK                                                                         |
| 2   | `tenant_id`   | uuid         | NO   | —                             |                                                                            |
| 3   | `name`        | varchar(255) | NO   | —                             |                                                                            |
| 4   | `description` | text         | YES  | —                             |                                                                            |
| 5   | `category`    | varchar(50)  | NO   | `'custom'::character varying` |                                                                            |
| 6   | `questions`   | jsonb        | NO   | `'[]'::jsonb`                 | JSONB array of question definitions with id, text, type, required, options |
| 7   | `is_system`   | bool         | NO   | `false`                       |                                                                            |
| 8   | `is_active`   | bool         | NO   | `true`                        |                                                                            |
| 9   | `created_by`  | uuid         | YES  | —                             |                                                                            |
| 10  | `created_at`  | timestamptz  | NO   | `now()`                       |                                                                            |
| 11  | `updated_at`  | timestamptz  | NO   | `now()`                       |                                                                            |
| 12  | `deleted_at`  | timestamptz  | YES  | —                             |                                                                            |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `engagement_survey_templates_pkey` [PRIMARY] · (`id`)
- `idx_engagement_survey_templates_active` [INDEX] · (`id`)
- `idx_engagement_survey_templates_created_by` [INDEX] · (`created_by`)
- `idx_engagement_templates_category` [INDEX] · (`tenant_id`, `category`)
- `idx_engagement_templates_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `engagement_surveys` via (`template_id`)

---

### `engagement_surveys`

- **Tenant scoped**: yes
- **Row estimate**: 18
- **Domains**: PULSAR
- **Prisma model**: `engagement_surveys`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                      | Notes |
| --- | ------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                            |       |
| 3   | `template_id`       | uuid         | YES  | —                            |       |
| 4   | `title`             | varchar(255) | NO   | —                            |       |
| 5   | `description`       | text         | YES  | —                            |       |
| 6   | `questions`         | jsonb        | NO   | `'[]'::jsonb`                |       |
| 7   | `is_anonymous`      | bool         | NO   | `true`                       |       |
| 8   | `status`            | varchar(20)  | NO   | `'draft'::character varying` |       |
| 9   | `audience_type`     | varchar(20)  | NO   | `'all'::character varying`   |       |
| 10  | `audience_ids`      | \_uuid       | YES  | `'{}'::uuid[]`               |       |
| 11  | `start_date`        | timestamptz  | NO   | `now()`                      |       |
| 12  | `end_date`          | timestamptz  | YES  | —                            |       |
| 13  | `reminder_days`     | \_int4       | YES  | `'{3,7}'::integer[]`         |       |
| 14  | `total_invitations` | int4(32)     | NO   | `0`                          |       |
| 15  | `total_responses`   | int4(32)     | NO   | `0`                          |       |
| 16  | `created_by`        | uuid         | NO   | —                            |       |
| 17  | `created_at`        | timestamptz  | NO   | `now()`                      |       |
| 18  | `updated_at`        | timestamptz  | NO   | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References                        | ON UPDATE | ON DELETE | Notes |
| ------------- | --------------------------------- | --------- | --------- | ----- |
| `created_by`  | `users(id)`                       | NO ACTION | SET NULL  |       |
| `template_id` | `engagement_survey_templates(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`                     | NO ACTION | CASCADE   |       |

#### Indexes

- `engagement_surveys_pkey` [PRIMARY] · (`id`)
- `idx_engagement_surveys_created_by` [INDEX] · (`created_by`)
- `idx_engagement_surveys_dates` [INDEX] · (`tenant_id`, `start_date`, `end_date`)
- `idx_engagement_surveys_status` [INDEX] · (`tenant_id`, `status`)
- `idx_engagement_surveys_template` [INDEX] · (`template_id`)
- `idx_engagement_surveys_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `engagement_survey_responses` via (`survey_id`)

---

### `news_article_tags`

- **Tenant scoped**: no
- **Row estimate**: 19
- **Domains**: PULSAR
- **Prisma model**: `news_article_tags`

#### Columns

| #   | Column       | Type        | Null | Default | Notes |
| --- | ------------ | ----------- | ---- | ------- | ----- |
| 1   | `article_id` | uuid        | NO   | —       | PK    |
| 2   | `tag_id`     | uuid        | NO   | —       | PK    |
| 3   | `created_at` | timestamptz | YES  | `now()` |       |

#### Primary Key

`(`article_id`, `tag_id`)`

#### Foreign Keys

| Columns      | References          | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------- | --------- | --------- | ----- |
| `article_id` | `news_articles(id)` | NO ACTION | CASCADE   |       |
| `tag_id`     | `news_tags(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `news_article_tags_pkey` [PRIMARY] · (`article_id`, `tag_id`)

---

### `news_articles`

- **Tenant scoped**: yes
- **Row estimate**: 32
- **Domains**: PULSAR
- **Prisma model**: `news_articles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                      | Notes |
| --- | ------------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                            |       |
| 3   | `category_id`             | uuid         | YES  | —                            |       |
| 4   | `author_id`               | uuid         | NO   | —                            |       |
| 5   | `title`                   | varchar(255) | NO   | —                            |       |
| 6   | `slug`                    | varchar(255) | NO   | —                            |       |
| 7   | `excerpt`                 | text         | YES  | —                            |       |
| 8   | `content`                 | text         | NO   | —                            |       |
| 9   | `cover_image_url`         | text         | YES  | —                            |       |
| 10  | `status`                  | varchar(20)  | NO   | `'draft'::character varying` |       |
| 11  | `is_featured`             | bool         | NO   | `false`                      |       |
| 12  | `is_pinned`               | bool         | NO   | `false`                      |       |
| 13  | `allow_comments`          | bool         | NO   | `true`                       |       |
| 14  | `requires_acknowledgment` | bool         | NO   | `false`                      |       |
| 15  | `audience_type`           | varchar(20)  | NO   | `'all'::character varying`   |       |
| 16  | `audience_ids`            | jsonb        | YES  | `'[]'::jsonb`                |       |
| 17  | `publish_at`              | timestamptz  | YES  | —                            |       |
| 18  | `published_at`            | timestamptz  | YES  | —                            |       |
| 19  | `archived_at`             | timestamptz  | YES  | —                            |       |
| 20  | `views_count`             | int4(32)     | NO   | `0`                          |       |
| 21  | `created_at`              | timestamptz  | NO   | `now()`                      |       |
| 22  | `updated_at`              | timestamptz  | NO   | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References            | ON UPDATE | ON DELETE | Notes |
| ------------- | --------------------- | --------- | --------- | ----- |
| `author_id`   | `users(id)`           | NO ACTION | SET NULL  |       |
| `category_id` | `news_categories(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_news_articles_author` [INDEX] · (`author_id`)
- `idx_news_articles_category` [INDEX] · (`category_id`)
- `idx_news_articles_featured` [INDEX] · (`tenant_id`, `is_featured`)
- `idx_news_articles_published` [INDEX] · (`tenant_id`, `published_at`)
- `idx_news_articles_status` [INDEX] · (`tenant_id`, `status`)
- `idx_news_articles_tenant` [INDEX] · (`tenant_id`)
- `news_articles_pkey` [PRIMARY] · (`id`)
- `unique_article_slug` [UNIQUE] · (`tenant_id`, `slug`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `news_article_tags` via (`article_id`)
- `news_bookmarks` via (`article_id`)
- `news_comments` via (`article_id`)
- `news_reactions` via (`article_id`)
- `news_reads` via (`article_id`)

---

### `news_bookmarks`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: PULSAR
- **Prisma model**: `news_bookmarks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default             | Notes |
| --- | ------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`  | uuid        | NO   | —                   |       |
| 3   | `article_id` | uuid        | NO   | —                   |       |
| 4   | `user_id`    | uuid        | NO   | —                   |       |
| 5   | `created_at` | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References          | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------- | --------- | --------- | ----- |
| `article_id` | `news_articles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`       | NO ACTION | CASCADE   |       |
| `user_id`    | `users(id)`         | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_news_bookmarks_tenant_id` [INDEX] · (`tenant_id`)
- `idx_news_bookmarks_user` [INDEX] · (`user_id`)
- `news_bookmarks_pkey` [PRIMARY] · (`id`)
- `unique_bookmark` [UNIQUE] · (`article_id`, `user_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `news_categories`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: PULSAR
- **Prisma model**: `news_categories`
- **RLS**: enabled (forced)

#### Columns

| #   | Column        | Type         | Null | Default                        | Notes |
| --- | ------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`          | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`   | uuid         | NO   | —                              |       |
| 3   | `name`        | varchar(100) | NO   | —                              |       |
| 4   | `slug`        | varchar(100) | NO   | —                              |       |
| 5   | `description` | text         | YES  | —                              |       |
| 6   | `parent_id`   | uuid         | YES  | —                              |       |
| 7   | `icon`        | varchar(50)  | YES  | `'folder'::character varying`  |       |
| 8   | `color`       | varchar(20)  | YES  | `'#6366f1'::character varying` |       |
| 9   | `sort_order`  | int4(32)     | NO   | `0`                            |       |
| 10  | `is_active`   | bool         | NO   | `true`                         |       |
| 11  | `created_at`  | timestamptz  | NO   | `now()`                        |       |
| 12  | `updated_at`  | timestamptz  | NO   | `now()`                        |       |
| 13  | `deleted_at`  | timestamptz  | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References            | ON UPDATE | ON DELETE | Notes |
| ----------- | --------------------- | --------- | --------- | ----- |
| `parent_id` | `news_categories(id)` | NO ACTION | SET NULL  |       |
| `tenant_id` | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_news_categories_active` [INDEX] · (`id`)
- `idx_news_categories_parent` [INDEX] · (`parent_id`)
- `idx_news_categories_tenant` [INDEX] · (`tenant_id`)
- `news_categories_pkey` [PRIMARY] · (`id`)
- `unique_category_slug` [UNIQUE] · (`tenant_id`, `slug`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `news_articles` via (`category_id`)
- `news_categories` via (`parent_id`)

---

### `news_comments`

- **Tenant scoped**: yes
- **Row estimate**: 422
- **Domains**: PULSAR
- **Prisma model**: `news_comments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default             | Notes |
| --- | ------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`  | uuid        | NO   | —                   |       |
| 3   | `article_id` | uuid        | NO   | —                   |       |
| 4   | `user_id`    | uuid        | NO   | —                   |       |
| 5   | `parent_id`  | uuid        | YES  | —                   |       |
| 6   | `content`    | text        | NO   | —                   |       |
| 7   | `is_hidden`  | bool        | NO   | `false`             |       |
| 8   | `created_at` | timestamptz | NO   | `now()`             |       |
| 9   | `updated_at` | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References          | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------- | --------- | --------- | ----- |
| `article_id` | `news_articles(id)` | NO ACTION | CASCADE   |       |
| `parent_id`  | `news_comments(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`       | NO ACTION | CASCADE   |       |
| `user_id`    | `users(id)`         | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_news_comments_article` [INDEX] · (`article_id`)
- `idx_news_comments_parent_id` [INDEX] · (`parent_id`)
- `idx_news_comments_tenant_id` [INDEX] · (`tenant_id`)
- `idx_news_comments_user_id` [INDEX] · (`user_id`)
- `news_comments_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `news_comments` via (`parent_id`)

---

### `news_reactions`

- **Tenant scoped**: yes
- **Row estimate**: 780
- **Domains**: PULSAR
- **Prisma model**: `news_reactions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default                     | Notes |
| --- | ------------ | ----------- | ---- | --------------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()`         | PK    |
| 2   | `tenant_id`  | uuid        | NO   | —                           |       |
| 3   | `article_id` | uuid        | NO   | —                           |       |
| 4   | `user_id`    | uuid        | NO   | —                           |       |
| 5   | `type`       | varchar(20) | NO   | `'like'::character varying` |       |
| 6   | `created_at` | timestamptz | NO   | `now()`                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References          | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------- | --------- | --------- | ----- |
| `article_id` | `news_articles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`       | NO ACTION | CASCADE   |       |
| `user_id`    | `users(id)`         | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_news_reactions_article` [INDEX] · (`article_id`)
- `idx_news_reactions_tenant_id` [INDEX] · (`tenant_id`)
- `news_reactions_pkey` [PRIMARY] · (`id`)
- `unique_user_reaction` [UNIQUE] · (`article_id`, `user_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `news_reads`

- **Tenant scoped**: yes
- **Row estimate**: 1139
- **Domains**: PULSAR
- **Prisma model**: `news_reads`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type        | Null | Default             | Notes |
| --- | ---------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`            | uuid        | NO   | —                   |       |
| 3   | `article_id`           | uuid        | NO   | —                   |       |
| 4   | `user_id`              | uuid        | NO   | —                   |       |
| 5   | `read_at`              | timestamptz | NO   | `now()`             |       |
| 6   | `acknowledged_at`      | timestamptz | YES  | —                   |       |
| 7   | `reading_time_seconds` | int4(32)    | YES  | `0`                 |       |
| 8   | `created_at`           | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References          | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------- | --------- | --------- | ----- |
| `article_id` | `news_articles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`  | `tenants(id)`       | NO ACTION | CASCADE   |       |
| `user_id`    | `users(id)`         | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_news_reads_article` [INDEX] · (`article_id`)
- `idx_news_reads_tenant_id` [INDEX] · (`tenant_id`)
- `idx_news_reads_user` [INDEX] · (`user_id`)
- `news_reads_pkey` [PRIMARY] · (`id`)
- `unique_user_read` [UNIQUE] · (`article_id`, `user_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `news_tags`

- **Tenant scoped**: yes
- **Row estimate**: 8
- **Domains**: PULSAR
- **Prisma model**: `news_tags`
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default             | Notes |
| --- | ------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`  | uuid        | NO   | —                   |       |
| 3   | `name`       | varchar(50) | NO   | —                   |       |
| 4   | `slug`       | varchar(50) | NO   | —                   |       |
| 5   | `created_at` | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_news_tags_tenant` [INDEX] · (`tenant_id`)
- `news_tags_pkey` [PRIMARY] · (`id`)
- `unique_tag_slug` [UNIQUE] · (`tenant_id`, `slug`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `news_article_tags` via (`tag_id`)

---

### `pulse_checks`

- **Tenant scoped**: yes
- **Row estimate**: 1145
- **Domains**: PULSAR
- **Prisma model**: `pulse_checks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type        | Null | Default             | Notes |
| --- | -------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid        | NO   | —                   |       |
| 3   | `employee_id`        | uuid        | YES  | —                   |       |
| 4   | `mood_score`         | int4(32)    | YES  | —                   |       |
| 5   | `workload_score`     | int4(32)    | YES  | —                   |       |
| 6   | `satisfaction_score` | int4(32)    | YES  | —                   |       |
| 7   | `comment`            | text        | YES  | —                   |       |
| 8   | `check_date`         | date        | YES  | `CURRENT_DATE`      |       |
| 9   | `week_number`        | int4(32)    | YES  | —                   |       |
| 10  | `created_at`         | timestamptz | YES  | `CURRENT_TIMESTAMP` |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_pulse_checks_date` [INDEX] · (`check_date`)
- `idx_pulse_checks_employee_id` [INDEX] · (`employee_id`)
- `idx_pulse_checks_tenant` [INDEX] · (`tenant_id`)
- `pulse_checks_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `social_comments`

- **Tenant scoped**: no
- **Row estimate**: 20
- **Domains**: PULSAR
- **Prisma model**: `social_comments`

#### Columns

| #   | Column              | Type      | Null | Default             | Notes |
| --- | ------------------- | --------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid      | NO   | `gen_random_uuid()` | PK    |
| 2   | `post_id`           | uuid      | YES  | —                   |       |
| 3   | `author_id`         | uuid      | YES  | —                   |       |
| 4   | `parent_comment_id` | uuid      | YES  | —                   |       |
| 5   | `content`           | text      | NO   | —                   |       |
| 6   | `likes_count`       | int4(32)  | YES  | `0`                 |       |
| 7   | `created_at`        | timestamp | YES  | `now()`             |       |
| 8   | `updated_at`        | timestamp | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References            | ON UPDATE | ON DELETE | Notes |
| ------------------- | --------------------- | --------- | --------- | ----- |
| `parent_comment_id` | `social_comments(id)` | NO ACTION | CASCADE   |       |
| `post_id`           | `social_posts(id)`    | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_social_comments_parent_comment_id` [INDEX] · (`parent_comment_id`)
- `idx_social_comments_post` [INDEX] · (`post_id`)
- `social_comments_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `social_comments` via (`parent_comment_id`)
- `social_likes` via (`comment_id`)

---

### `social_likes`

- **Tenant scoped**: no
- **Row estimate**: 48
- **Domains**: PULSAR
- **Prisma model**: `social_likes`

#### Columns

| #   | Column        | Type      | Null | Default             | Notes |
| --- | ------------- | --------- | ---- | ------------------- | ----- |
| 1   | `id`          | uuid      | NO   | `gen_random_uuid()` | PK    |
| 2   | `post_id`     | uuid      | YES  | —                   |       |
| 3   | `comment_id`  | uuid      | YES  | —                   |       |
| 4   | `employee_id` | uuid      | YES  | —                   |       |
| 5   | `created_at`  | timestamp | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References            | ON UPDATE | ON DELETE | Notes |
| ------------- | --------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)`  | NO ACTION | SET NULL  |       |
| `comment_id`  | `social_comments(id)` | NO ACTION | CASCADE   |       |
| `post_id`     | `social_posts(id)`    | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_social_likes_comment_id` [INDEX] · (`comment_id`)
- `idx_social_likes_post` [INDEX] · (`post_id`)
- `social_likes_pkey` [PRIMARY] · (`id`)
- `social_likes_post_id_employee_id_key` [UNIQUE] · (`post_id`, `employee_id`)

---

### `social_posts`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: PULSAR
- **Prisma model**: `social_posts`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type        | Null | Default                        | Notes |
| --- | -------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`          | uuid        | NO   | —                              |       |
| 3   | `author_id`          | uuid        | YES  | —                              |       |
| 4   | `content`            | text        | NO   | —                              |       |
| 5   | `post_type`          | varchar(50) | YES  | `'update'::character varying`  |       |
| 6   | `attachments`        | jsonb       | YES  | —                              |       |
| 7   | `poll_options`       | jsonb       | YES  | —                              |       |
| 8   | `visibility`         | varchar(30) | YES  | `'company'::character varying` |       |
| 9   | `target_departments` | \_text      | YES  | —                              |       |
| 10  | `likes_count`        | int4(32)    | YES  | `0`                            |       |
| 11  | `comments_count`     | int4(32)    | YES  | `0`                            |       |
| 12  | `is_pinned`          | bool        | YES  | `false`                        |       |
| 13  | `pinned_until`       | timestamp   | YES  | —                              |       |
| 14  | `published_at`       | timestamp   | YES  | `now()`                        |       |
| 15  | `created_at`         | timestamp   | YES  | `now()`                        |       |
| 16  | `updated_at`         | timestamp   | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_social_posts_author` [INDEX] · (`author_id`)
- `idx_social_posts_published` [INDEX] · (`published_at`)
- `idx_social_posts_tenant` [INDEX] · (`tenant_id`)
- `social_posts_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `social_comments` via (`post_id`)
- `social_likes` via (`post_id`)

---

### `survey_questions`

- **Tenant scoped**: yes
- **Row estimate**: 31
- **Domains**: PULSAR
- **Prisma model**: `survey_questions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default                       | Notes |
| --- | --------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `survey_id`     | uuid         | YES  | —                             |       |
| 3   | `question_text` | text         | NO   | —                             |       |
| 4   | `question_type` | varchar(50)  | YES  | `'rating'::character varying` |       |
| 5   | `options`       | jsonb        | YES  | —                             |       |
| 6   | `category`      | varchar(100) | YES  | —                             |       |
| 7   | `display_order` | int4(32)     | YES  | `0`                           |       |
| 8   | `is_required`   | bool         | YES  | `true`                        |       |
| 9   | `created_at`    | timestamptz  | YES  | `now()`                       |       |
| 10  | `tenant_id`     | uuid         | NO   | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |
| `survey_id` | `surveys(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_survey_questions_survey_id` [INDEX] · (`survey_id`)
- `idx_survey_questions_tenant` [INDEX] · (`tenant_id`)
- `survey_questions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_survey_questions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `survey_responses` via (`question_id`)

---

### `survey_responses`

- **Tenant scoped**: yes
- **Row estimate**: 4482
- **Domains**: PULSAR
- **Prisma model**: `survey_responses`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type         | Null | Default             | Notes |
| --- | -------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `survey_id`    | uuid         | YES  | —                   |       |
| 3   | `question_id`  | uuid         | YES  | —                   |       |
| 4   | `employee_id`  | uuid         | YES  | —                   |       |
| 5   | `rating_value` | int4(32)     | YES  | —                   |       |
| 6   | `text_value`   | text         | YES  | —                   |       |
| 7   | `choice_value` | varchar(255) | YES  | —                   |       |
| 8   | `created_at`   | timestamp    | YES  | `now()`             |       |
| 9   | `tenant_id`    | uuid         | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References             | ON UPDATE | ON DELETE | Notes |
| ------------- | ---------------------- | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`          | NO ACTION | CASCADE   |       |
| `employee_id` | `employees_core(id)`   | NO ACTION | SET NULL  |       |
| `question_id` | `survey_questions(id)` | NO ACTION | CASCADE   |       |
| `survey_id`   | `surveys(id)`          | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_survey_responses_employee_id` [INDEX] · (`employee_id`)
- `idx_survey_responses_question_id` [INDEX] · (`question_id`)
- `idx_survey_responses_survey` [INDEX] · (`survey_id`)
- `idx_survey_responses_tenant` [INDEX] · (`tenant_id`)
- `survey_responses_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_survey_responses** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `survey_templates`

- **Tenant scoped**: yes
- **Row estimate**: 9
- **Domains**: PULSAR
- **Prisma model**: `survey_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                           | Notes |
| --- | ------------------------ | ------------ | ---- | --------------------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`               | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                                 |       |
| 3   | `name`                   | varchar(255) | NO   | —                                 |       |
| 4   | `description`            | text         | YES  | —                                 |       |
| 5   | `survey_type`            | varchar(50)  | YES  | `'engagement'::character varying` |       |
| 6   | `questions`              | jsonb        | NO   | —                                 |       |
| 7   | `is_anonymous`           | bool         | YES  | `true`                            |       |
| 8   | `estimated_time_minutes` | int4(32)     | YES  | `10`                              |       |
| 9   | `is_active`              | bool         | YES  | `true`                            |       |
| 10  | `is_system_template`     | bool         | YES  | `false`                           |       |
| 11  | `created_at`             | timestamptz  | YES  | `CURRENT_TIMESTAMP`               |       |
| 12  | `updated_at`             | timestamptz  | YES  | `CURRENT_TIMESTAMP`               |       |
| 13  | `deleted_at`             | timestamptz  | YES  | —                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_survey_templates_active` [INDEX] · (`id`)
- `idx_survey_templates_tenant` [INDEX] · (`tenant_id`)
- `survey_templates_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `surveys`

- **Tenant scoped**: yes
- **Row estimate**: 11
- **Domains**: PULSAR
- **Prisma model**: `surveys`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                           | Notes |
| --- | ------------------- | ------------ | ---- | --------------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`               | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                                 |       |
| 3   | `title`             | varchar(255) | NO   | —                                 |       |
| 4   | `description`       | text         | YES  | —                                 |       |
| 5   | `survey_type`       | varchar(50)  | YES  | `'engagement'::character varying` |       |
| 6   | `start_date`        | date         | YES  | —                                 |       |
| 7   | `end_date`          | date         | YES  | —                                 |       |
| 8   | `is_anonymous`      | bool         | YES  | `true`                            |       |
| 9   | `is_active`         | bool         | YES  | `true`                            |       |
| 10  | `created_at`        | timestamp    | YES  | `now()`                           |       |
| 11  | `updated_at`        | timestamp    | YES  | `now()`                           |       |
| 12  | `status`            | varchar(50)  | YES  | `'draft'::character varying`      |       |
| 13  | `questions`         | jsonb        | YES  | —                                 |       |
| 14  | `total_invitations` | int4(32)     | YES  | `0`                               |       |
| 15  | `deleted_at`        | timestamptz  | YES  | —                                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_surveys_active` [INDEX] · (`id`)
- `idx_surveys_tenant` [INDEX] · (`tenant_id`)
- `surveys_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `survey_questions` via (`survey_id`)
- `survey_responses` via (`survey_id`)

---

### `wellbeing_checkins`

- **Tenant scoped**: yes
- **Row estimate**: 1142
- **Domains**: PULSAR
- **Prisma model**: `wellbeing_checkins`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default             | Notes |
| --- | ------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                   |       |
| 3   | `employee_id`       | uuid        | NO   | —                   |       |
| 4   | `checkin_date`      | date        | NO   | `CURRENT_DATE`      |       |
| 5   | `mood_score`        | int4(32)    | YES  | —                   |       |
| 6   | `energy_level`      | int4(32)    | YES  | —                   |       |
| 7   | `stress_level`      | int4(32)    | YES  | —                   |       |
| 8   | `work_life_balance` | int4(32)    | YES  | —                   |       |
| 9   | `sleep_quality`     | int4(32)    | YES  | —                   |       |
| 10  | `notes`             | text        | YES  | —                   |       |
| 11  | `is_anonymous`      | bool        | YES  | `false`             |       |
| 12  | `created_at`        | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wellbeing_checkins_employee` [INDEX] · (`employee_id`)
- `idx_wellbeing_checkins_tenant_date` [INDEX] · (`tenant_id`, `checkin_date`)
- `unique_daily_checkin` [UNIQUE] · (`employee_id`, `checkin_date`)
- `wellbeing_checkins_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `wellbeing_goals`

- **Tenant scoped**: yes
- **Row estimate**: 120
- **Domains**: PULSAR
- **Prisma model**: `wellbeing_goals`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default                       | Notes |
| --- | --------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`     | uuid         | NO   | —                             |       |
| 3   | `employee_id`   | uuid         | NO   | —                             |       |
| 4   | `goal_type`     | varchar(50)  | NO   | —                             |       |
| 5   | `title`         | varchar(200) | NO   | —                             |       |
| 6   | `description`   | text         | YES  | —                             |       |
| 7   | `target_value`  | int4(32)     | YES  | —                             |       |
| 8   | `current_value` | int4(32)     | YES  | `0`                           |       |
| 9   | `unit`          | varchar(50)  | YES  | —                             |       |
| 10  | `start_date`    | date         | NO   | —                             |       |
| 11  | `target_date`   | date         | NO   | —                             |       |
| 12  | `status`        | varchar(20)  | YES  | `'active'::character varying` |       |
| 13  | `created_at`    | timestamptz  | YES  | `now()`                       |       |
| 14  | `updated_at`    | timestamptz  | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wellbeing_goals_employee` [INDEX] · (`employee_id`)
- `idx_wellbeing_goals_tenant_id` [INDEX] · (`tenant_id`)
- `wellbeing_goals_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `wellbeing_program_enrollments`

- **Tenant scoped**: yes
- **Row estimate**: 67
- **Domains**: PULSAR
- **Prisma model**: `wellbeing_program_enrollments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type        | Null | Default                         | Notes |
| --- | -------------- | ----------- | ---- | ------------------------------- | ----- |
| 1   | `id`           | uuid        | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`    | uuid        | NO   | —                               |       |
| 3   | `employee_id`  | uuid        | NO   | —                               |       |
| 4   | `resource_id`  | uuid        | NO   | —                               |       |
| 5   | `enrolled_at`  | timestamptz | YES  | `now()`                         |       |
| 6   | `completed_at` | timestamptz | YES  | —                               |       |
| 7   | `status`       | varchar(20) | YES  | `'enrolled'::character varying` |       |
| 8   | `rating`       | int4(32)    | YES  | —                               |       |
| 9   | `feedback`     | text        | YES  | —                               |       |
| 10  | `created_at`   | timestamptz | YES  | `now()`                         |       |
| 11  | `updated_at`   | timestamptz | YES  | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References                | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `resource_id` | `wellbeing_resources(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wellbeing_program_enrollments_employee_id` [INDEX] · (`employee_id`)
- `idx_wellbeing_program_enrollments_resource_id` [INDEX] · (`resource_id`)
- `idx_wellbeing_program_enrollments_tenant_id` [INDEX] · (`tenant_id`)
- `wellbeing_program_enrollments_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `wellbeing_resources`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: PULSAR
- **Prisma model**: `wellbeing_resources`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`     | uuid         | NO   | —                   |       |
| 3   | `title`         | varchar(200) | NO   | —                   |       |
| 4   | `description`   | text         | YES  | —                   |       |
| 5   | `category`      | varchar(50)  | NO   | —                   |       |
| 6   | `resource_type` | varchar(50)  | NO   | —                   |       |
| 7   | `url`           | text         | YES  | —                   |       |
| 8   | `provider`      | varchar(100) | YES  | —                   |       |
| 9   | `is_active`     | bool         | YES  | `true`              |       |
| 10  | `created_at`    | timestamptz  | YES  | `now()`             |       |
| 11  | `deleted_at`    | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_wellbeing_resources_active` [INDEX] · (`id`)
- `idx_wellbeing_resources_category` [INDEX] · (`category`)
- `idx_wellbeing_resources_tenant_id` [INDEX] · (`tenant_id`)
- `wellbeing_resources_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `wellbeing_program_enrollments` via (`resource_id`)

---
