# Dominio GOKMER — Goal-Objective-KPI-Measurement-Evaluation-Review

> Performance Cycle

**Tabelle in questo dominio**: 40

## Tabelle

| Tabella                                                        | Rows | Tenant | RLS | FK out | Cols |
| -------------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`calibration_adjustments`](#calibrationadjustments)           | 20   | ✓      | ✓   | 6      | 18   |
| [`calibration_audit_log`](#calibrationauditlog)                | 30   | ✓      | ✓   | 4      | 11   |
| [`calibration_discussions`](#calibrationdiscussions)           | 60   | ✓      | ✓   | 2      | 14   |
| [`calibration_participants`](#calibrationparticipants)         | 30   | ✓      | ✓   | 2      | 9    |
| [`calibration_results`](#calibrationresults)                   | 50   | ✓      | ✓   | 5      | 16   |
| [`calibration_sessions`](#calibrationsessions)                 | 86   | ✓      | ✓   | 4      | 19   |
| [`check_ins`](#checkins)                                       | 2495 | ✓      | ✓   | 3      | 26   |
| [`continuous_feedback`](#continuousfeedback)                   | 729  | ✓      | ✓   | 4      | 17   |
| [`feedback_360`](#feedback360)                                 | 714  | ✓      | ✓   | 6      | 23   |
| [`feedback_360_peer_suggestions`](#feedback360peersuggestions) | 20   | ✓      | ✓   | 4      | 11   |
| [`feedback_360_questionnaires`](#feedback360questionnaires)    | 4    | ✓      | ✓   | 2      | 11   |
| [`feedback_360_questions`](#feedback360questions)              | 28   | ✓      | ✓   | 2      | 15   |
| [`feedback_categories`](#feedbackcategories)                   | 32   | ✓      | ✓   | 1      | 10   |
| [`feedback_requests`](#feedbackrequests)                       | 246  | ✓      | ✓   | 5      | 16   |
| [`feedback_responses`](#feedbackresponses)                     | 0    | ✓      | ✓   | 1      | 9    |
| [`goal_alignments`](#goalalignments)                           | 100  | ✓      | ✓   | 3      | 7    |
| [`goal_check_ins`](#goalcheckins)                              | 1000 | ✓      | ✓   | 3      | 13   |
| [`goal_comments`](#goalcomments)                               | 856  | ✓      | ✓   | 4      | 9    |
| [`goal_milestones`](#goalmilestones)                           | 1000 | ✓      | ✓   | 2      | 11   |
| [`goal_review_ratings`](#goalreviewratings)                    | 155  | ✓      | ✓   | 4      | 13   |
| [`goal_templates`](#goaltemplates)                             | 40   | ✓      | ✓   | 3      | 19   |
| [`goal_updates`](#goalupdates)                                 | 1811 | ✓      | ✓   | 3      | 12   |
| [`goals`](#goals)                                              | 1068 | ✓      | ✓   | 5      | 27   |
| [`key_results`](#keyresults)                                   | 20   | ✓      | ✓   | 1      | 17   |
| [`okr_check_ins`](#okrcheckins)                                | 15   | ✓      | ✓   | 4      | 14   |
| [`okr_checkins`](#okrcheckins)                                 | 10   | ✓      | ✓   | 3      | 12   |
| [`okrs`](#okrs)                                                | 20   | ✓      | ✓   | 3      | 20   |
| [`performance_predictions`](#performancepredictions)           | 267  | ✓      | ✓   | 2      | 26   |
| [`performance_review_templates`](#performancereviewtemplates)  | 4    | ✓      | ✓   | 1      | 16   |
| [`performance_reviews`](#performancereviews)                   | 292  | ✓      | ✓   | 7      | 52   |
| [`performance_skill_links`](#performanceskilllinks)            | 150  | ✓      | ✓   | 5      | 15   |
| [`performance_trends`](#performancetrends)                     | 202  | ✓      | ✓   | 2      | 14   |
| [`recognition`](#recognition)                                  | 485  | ✓      | ✓   | 1      | 13   |
| [`review_cycle_notifications`](#reviewcyclenotifications)      | 25   | ✓      | ✓   | 3      | 13   |
| [`review_cycle_participants`](#reviewcycleparticipants)        | 250  | ✓      | ✓   | 4      | 17   |
| [`review_cycle_phases`](#reviewcyclephases)                    | 20   | ✓      | ✓   | 2      | 14   |
| [`review_cycles`](#reviewcycles)                               | 35   | ✓      | ✓   | 1      | 34   |
| [`roadmap_phases`](#roadmapphases)                             | 7    | —      | —   | 0      | 8    |
| [`self_assessment_evidence`](#selfassessmentevidence)          | 237  | ✓      | ✓   | 5      | 17   |
| [`self_reviews`](#selfreviews)                                 | 30   | ✓      | ✓   | 3      | 22   |

---

### `calibration_adjustments`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: GOKMER
- **Prisma model**: `calibration_adjustments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes                                                        |
| --- | ------------------------ | ------------ | ---- | ------------------- | ------------------------------------------------------------ |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK                                                           |
| 2   | `tenant_id`              | uuid         | NO   | —                   |                                                              |
| 3   | `calibration_session_id` | uuid         | NO   | —                   |                                                              |
| 4   | `employee_id`            | uuid         | NO   | —                   |                                                              |
| 5   | `original_rating`        | numeric(3,1) | NO   | —                   |                                                              |
| 6   | `adjusted_rating`        | numeric(3,1) | NO   | —                   |                                                              |
| 7   | `rating_category`        | varchar(50)  | YES  | —                   |                                                              |
| 8   | `adjustment_reason`      | text         | NO   | —                   |                                                              |
| 9   | `supporting_evidence`    | text         | YES  | —                   |                                                              |
| 10  | `proposed_by`            | uuid         | YES  | —                   |                                                              |
| 11  | `approved_by`            | uuid         | YES  | —                   |                                                              |
| 12  | `approved_at`            | timestamptz  | YES  | —                   |                                                              |
| 13  | `created_at`             | timestamptz  | YES  | `now()`             |                                                              |
| 14  | `discussion_notes`       | text         | YES  | —                   | Notes from calibration discussion about this employee        |
| 15  | `outlier_flag`           | bool         | YES  | `false`             | Whether this rating was flagged as an outlier                |
| 16  | `outlier_reason`         | varchar(100) | YES  | —                   | Reason for outlier flag: high_variance, extreme_rating, etc. |
| 17  | `applied_at`             | timestamptz  | YES  | —                   |                                                              |
| 18  | `applied_by`             | uuid         | YES  | —                   |                                                              |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------------- | --------- | --------- | ----- |
| `applied_by`             | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `approved_by`            | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `calibration_session_id` | `calibration_sessions(id)` | NO ACTION | CASCADE   |       |
| `employee_id`            | `employees_core(id)`       | NO ACTION | CASCADE   |       |
| `proposed_by`            | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `calibration_adjustments_pkey` [PRIMARY] · (`id`)
- `idx_calibration_adj_applied` [INDEX] · (`applied_by`)
- `idx_calibration_adj_approved` [INDEX] · (`approved_by`)
- `idx_calibration_adj_proposed` [INDEX] · (`proposed_by`)
- `idx_calibration_adjustments_employee` [INDEX] · (`employee_id`)
- `idx_calibration_adjustments_session` [INDEX] · (`calibration_session_id`)
- `idx_calibration_adjustments_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `calibration_audit_log` via (`adjustment_id`)

---

### `calibration_audit_log`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: GOKMER
- **Prisma model**: `calibration_audit_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type        | Null | Default             | Notes |
| --- | ------------------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid        | NO   | —                   |       |
| 3   | `calibration_session_id` | uuid        | NO   | —                   |       |
| 4   | `adjustment_id`          | uuid        | YES  | —                   |       |
| 5   | `action_type`            | varchar(50) | NO   | —                   |       |
| 6   | `action_by`              | uuid        | YES  | —                   |       |
| 7   | `action_at`              | timestamptz | YES  | `now()`             |       |
| 8   | `old_value`              | jsonb       | YES  | —                   |       |
| 9   | `new_value`              | jsonb       | YES  | —                   |       |
| 10  | `description`            | text        | YES  | —                   |       |
| 11  | `created_at`             | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                    | ON UPDATE | ON DELETE | Notes |
| ------------------------ | ----------------------------- | --------- | --------- | ----- |
| `action_by`              | `employees_core(id)`          | NO ACTION | SET NULL  |       |
| `adjustment_id`          | `calibration_adjustments(id)` | NO ACTION | SET NULL  |       |
| `calibration_session_id` | `calibration_sessions(id)`    | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`                 | NO ACTION | CASCADE   |       |

#### Indexes

- `calibration_audit_log_pkey` [PRIMARY] · (`id`)
- `idx_calibration_audit_action` [INDEX] · (`action_type`)
- `idx_calibration_audit_adjustment` [INDEX] · (`adjustment_id`)
- `idx_calibration_audit_log_action_by` [INDEX] · (`action_by`)
- `idx_calibration_audit_session` [INDEX] · (`calibration_session_id`)
- `idx_calibration_audit_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `calibration_discussions`

- **Tenant scoped**: yes
- **Row estimate**: 60
- **Domains**: GOKMER
- **Prisma model**: `calibration_discussions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type        | Null | Default             | Notes |
| --- | ---------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `session_id`           | uuid        | YES  | —                   |       |
| 3   | `employee_id`          | uuid        | YES  | —                   |       |
| 4   | `original_rating`      | varchar(20) | YES  | —                   |       |
| 5   | `original_potential`   | varchar(20) | YES  | —                   |       |
| 6   | `calibrated_rating`    | varchar(20) | YES  | —                   |       |
| 7   | `calibrated_potential` | varchar(20) | YES  | —                   |       |
| 8   | `discussion_notes`     | text        | YES  | —                   |       |
| 9   | `adjustment_reason`    | text        | YES  | —                   |       |
| 10  | `was_adjusted`         | bool        | YES  | `false`             |       |
| 11  | `discussed_at`         | timestamp   | YES  | `now()`             |       |
| 12  | `created_at`           | timestamptz | YES  | `now()`             |       |
| 13  | `updated_at`           | timestamptz | YES  | `now()`             |       |
| 14  | `tenant_id`            | uuid        | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `calibration_discussions_pkey` [PRIMARY] · (`id`)
- `idx_calibration_discussions_employee_id` [INDEX] · (`employee_id`)
- `idx_calibration_discussions_session` [INDEX] · (`session_id`)
- `idx_calibration_discussions_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_calibration_discussions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `calibration_participants`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: GOKMER
- **Prisma model**: `calibration_participants`
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default                            | Notes |
| --- | ------------ | ----------- | ---- | ---------------------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()`                | PK    |
| 2   | `session_id` | uuid        | YES  | —                                  |       |
| 3   | `manager_id` | uuid        | YES  | —                                  |       |
| 4   | `role`       | varchar(30) | YES  | `'participant'::character varying` |       |
| 5   | `attended`   | bool        | YES  | `false`                            |       |
| 6   | `joined_at`  | timestamp   | YES  | —                                  |       |
| 7   | `tenant_id`  | uuid        | NO   | —                                  |       |
| 8   | `created_at` | timestamptz | YES  | `now()`                            |       |
| 9   | `updated_at` | timestamptz | YES  | `now()`                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References           | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------------- | --------- | --------- | ----- |
| `tenant_id`  | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `manager_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `calibration_participants_pkey` [PRIMARY] · (`id`)
- `idx_calibration_participants_manager_id` [INDEX] · (`manager_id`)
- `idx_calibration_participants_session` [INDEX] · (`session_id`)
- `idx_calibration_participants_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `calibration_results`

- **Tenant scoped**: yes
- **Row estimate**: 50
- **Domains**: GOKMER
- **Prisma model**: `calibration_results`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default             | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                   |       |
| 3   | `calibration_session_id`  | uuid         | NO   | —                   |       |
| 4   | `employee_id`             | uuid         | NO   | —                   |       |
| 5   | `performance_review_id`   | uuid         | YES  | —                   |       |
| 6   | `pre_calibration_rating`  | numeric(3,1) | YES  | —                   |       |
| 7   | `post_calibration_rating` | numeric(3,1) | YES  | —                   |       |
| 8   | `final_rating`            | numeric(3,1) | YES  | —                   |       |
| 9   | `rating_change`           | numeric(3,1) | YES  | —                   |       |
| 10  | `justification`           | text         | YES  | —                   |       |
| 11  | `is_outlier`              | bool         | YES  | `false`             |       |
| 12  | `approved_by`             | uuid         | YES  | —                   |       |
| 13  | `approved_at`             | timestamptz  | YES  | —                   |       |
| 14  | `calibration_notes`       | text         | YES  | —                   |       |
| 15  | `created_at`              | timestamptz  | YES  | `now()`             |       |
| 16  | `updated_at`              | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------------- | --------- | --------- | ----- |
| `approved_by`            | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `calibration_session_id` | `calibration_sessions(id)` | NO ACTION | CASCADE   |       |
| `employee_id`            | `employees_core(id)`       | NO ACTION | CASCADE   |       |
| `performance_review_id`  | `performance_reviews(id)`  | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `calibration_results_pkey` [PRIMARY] · (`id`)
- `idx_calibration_results_approved_by` [INDEX] · (`approved_by`)
- `idx_calibration_results_employee` [INDEX] · (`employee_id`)
- `idx_calibration_results_performance_review_id` [INDEX] · (`performance_review_id`)
- `idx_calibration_results_session` [INDEX] · (`calibration_session_id`)
- `idx_calibration_results_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **rls_calibration_results_tenant** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `calibration_sessions`

- **Tenant scoped**: yes
- **Row estimate**: 86
- **Domains**: GOKMER
- **Prisma model**: `calibration_sessions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                       | Type         | Null | Default                          | Notes |
| --- | ---------------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                         | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`                  | uuid         | NO   | —                                |       |
| 3   | `name`                       | varchar(200) | NO   | —                                |       |
| 4   | `description`                | text         | YES  | —                                |       |
| 5   | `review_cycle_id`            | uuid         | YES  | —                                |       |
| 6   | `department`                 | varchar(100) | YES  | —                                |       |
| 7   | `scheduled_date`             | timestamp    | YES  | —                                |       |
| 8   | `duration_minutes`           | int4(32)     | YES  | `120`                            |       |
| 9   | `location`                   | varchar(200) | YES  | —                                |       |
| 10  | `facilitator_id`             | uuid         | YES  | —                                |       |
| 11  | `status`                     | varchar(30)  | YES  | `'scheduled'::character varying` |       |
| 12  | `summary_notes`              | text         | YES  | —                                |       |
| 13  | `adjustments_count`          | int4(32)     | YES  | `0`                              |       |
| 14  | `created_by`                 | uuid         | YES  | —                                |       |
| 15  | `created_at`                 | timestamp    | YES  | `now()`                          |       |
| 16  | `updated_at`                 | timestamp    | YES  | `now()`                          |       |
| 17  | `created_by_employee_id`     | uuid         | YES  | —                                |       |
| 18  | `facilitator_id_employee_id` | uuid         | YES  | —                                |       |
| 19  | `org_unit_id`                | uuid         | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                      | References           | ON UPDATE | ON DELETE | Notes |
| ---------------------------- | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id`     | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `facilitator_id_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `org_unit_id`                | `org_units(id)`      | NO ACTION | CASCADE   |       |
| `tenant_id`                  | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `calibration_sessions_pkey` [PRIMARY] · (`id`)
- `idx_calibration_sessions_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_calibration_sessions_cycle` [INDEX] · (`review_cycle_id`)
- `idx_calibration_sessions_date` [INDEX] · (`scheduled_date`)
- `idx_calibration_sessions_facilitator_id_employee_id` [INDEX] · (`facilitator_id_employee_id`)
- `idx_calibration_sessions_org_unit_id` [INDEX] · (`org_unit_id`)
- `idx_calibration_sessions_status` [INDEX] · (`status`)
- `idx_calibration_sessions_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `calibration_adjustments` via (`calibration_session_id`)
- `calibration_audit_log` via (`calibration_session_id`)
- `calibration_results` via (`calibration_session_id`)

---

### `check_ins`

- **Tenant scoped**: yes
- **Row estimate**: 2495
- **Domains**: GOKMER
- **Prisma model**: `check_ins`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                          | Notes                                                                                                            |
| --- | ------------------------ | ------------ | ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`              | PK                                                                                                               |
| 2   | `tenant_id`              | uuid         | NO   | —                                |                                                                                                                  |
| 3   | `employee_id`            | uuid         | NO   | —                                |                                                                                                                  |
| 4   | `manager_id`             | uuid         | YES  | —                                |                                                                                                                  |
| 5   | `scheduled_date`         | timestamptz  | NO   | —                                |                                                                                                                  |
| 6   | `duration_minutes`       | int4(32)     | YES  | `30`                             |                                                                                                                  |
| 7   | `meeting_type`           | varchar(50)  | YES  | `'weekly'::character varying`    |                                                                                                                  |
| 8   | `agenda`                 | text         | YES  | —                                |                                                                                                                  |
| 9   | `employee_notes`         | text         | YES  | —                                |                                                                                                                  |
| 10  | `manager_notes`          | text         | YES  | —                                |                                                                                                                  |
| 11  | `action_items`           | jsonb        | YES  | —                                | NORMALIZABLE: should become check_in_actions (1:N). Contains array of {description, assignee, due_date, status}. |
| 12  | `employee_mood`          | int4(32)     | YES  | —                                |                                                                                                                  |
| 13  | `status`                 | varchar(50)  | YES  | `'scheduled'::character varying` |                                                                                                                  |
| 14  | `completed_at`           | timestamptz  | YES  | —                                |                                                                                                                  |
| 15  | `created_at`             | timestamptz  | YES  | `CURRENT_TIMESTAMP`              |                                                                                                                  |
| 16  | `updated_at`             | timestamptz  | YES  | `CURRENT_TIMESTAMP`              |                                                                                                                  |
| 17  | `topics_discussed`       | jsonb        | YES  | `'[]'::jsonb`                    | JSONB BY DESIGN: free-form topic list, not referencing other entities.                                           |
| 18  | `employee_engagement`    | int4(32)     | YES  | —                                |                                                                                                                  |
| 19  | `goals_discussed`        | jsonb        | YES  | `'[]'::jsonb`                    | NORMALIZABLE: should become check_in_goals (M:N junction to goals). Contains array of goal_id references.        |
| 20  | `follow_up_items`        | jsonb        | YES  | `'[]'::jsonb`                    | NORMALIZABLE: should become check_in_follow_ups (1:N). Contains array of {item, owner, due_date}.                |
| 21  | `next_checkin_date`      | date         | YES  | —                                |                                                                                                                  |
| 22  | `private_notes`          | text         | YES  | —                                |                                                                                                                  |
| 23  | `content_embedding`      | vector       | YES  | —                                | Semantic embedding of check-in content (agenda, notes, action items)                                             |
| 24  | `embedding_text_hash`    | varchar(64)  | YES  | —                                |                                                                                                                  |
| 25  | `embedding_model`        | varchar(100) | YES  | —                                |                                                                                                                  |
| 26  | `embedding_generated_at` | timestamptz  | YES  | —                                |                                                                                                                  |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `manager_id`  | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `check_ins_pkey` [PRIMARY] · (`id`)
- `idx_check_ins_embedding` [INDEX] · (`content_embedding`)
- `idx_check_ins_employee` [INDEX] · (`employee_id`)
- `idx_check_ins_manager` [INDEX] · (`manager_id`)
- `idx_check_ins_scheduled` [INDEX] · (`scheduled_date`)
- `idx_check_ins_status` [INDEX] · (`status`)
- `idx_check_ins_tenant` [INDEX] · (`tenant_id`)
- `idx_checkins_tenant_employee` [INDEX] · (`tenant_id`, `employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `continuous_feedback`

- **Tenant scoped**: yes
- **Row estimate**: 729
- **Domains**: GOKMER
- **Prisma model**: `continuous_feedback`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default                        | Notes                                                                              |
| --- | ----------------------- | ------------ | ---- | ------------------------------ | ---------------------------------------------------------------------------------- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()`            | PK                                                                                 |
| 2   | `tenant_id`             | uuid         | NO   | —                              |                                                                                    |
| 3   | `from_employee_id`      | uuid         | YES  | —                              |                                                                                    |
| 4   | `to_employee_id`        | uuid         | NO   | —                              |                                                                                    |
| 5   | `feedback_type`         | varchar(30)  | YES  | `'praise'::character varying`  |                                                                                    |
| 6   | `message`               | text         | NO   | —                              |                                                                                    |
| 7   | `is_private`            | bool         | YES  | `false`                        |                                                                                    |
| 8   | `related_goal_id`       | uuid         | YES  | —                              |                                                                                    |
| 9   | `created_at`            | timestamp    | YES  | `now()`                        |                                                                                    |
| 10  | `competency_id`         | uuid         | YES  | —                              | Optional link to a competency being praised/improved                               |
| 11  | `sentiment_score`       | numeric(3,2) | YES  | —                              | AI-calculated sentiment (-1 to 1)                                                  |
| 12  | `acknowledged`          | bool         | YES  | `false`                        |                                                                                    |
| 13  | `acknowledged_at`       | timestamptz  | YES  | —                              |                                                                                    |
| 14  | `visibility`            | varchar(20)  | YES  | `'private'::character varying` | Visibility level: private (only recipient), team (team members), public (everyone) |
| 15  | `tags`                  | \_text       | YES  | —                              |                                                                                    |
| 16  | `category`              | varchar(50)  | YES  | —                              | Category: collaboration, leadership, technical, communication, etc.                |
| 17  | `performance_review_id` | uuid         | YES  | —                              |                                                                                    |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                | ON UPDATE | ON DELETE | Notes |
| ----------------------- | ------------------------- | --------- | --------- | ----- |
| `performance_review_id` | `performance_reviews(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`             | `tenants(id)`             | NO ACTION | CASCADE   |       |
| `from_employee_id`      | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `to_employee_id`        | `employees_core(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `continuous_feedback_pkey` [PRIMARY] · (`id`)
- `idx_continuous_feedback_created` [INDEX] · (`created_at`)
- `idx_continuous_feedback_from` [INDEX] · (`from_employee_id`)
- `idx_continuous_feedback_review` [INDEX] · (`performance_review_id`)
- `idx_continuous_feedback_tenant` [INDEX] · (`tenant_id`)
- `idx_continuous_feedback_to` [INDEX] · (`to_employee_id`)
- `idx_continuous_feedback_type` [INDEX] · (`feedback_type`)
- `idx_continuous_feedback_visibility` [INDEX] · (`visibility`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `feedback_360`

- **Tenant scoped**: yes
- **Row estimate**: 714
- **Domains**: GOKMER
- **Prisma model**: `feedback_360`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                        | Notes                                                                    |
| --- | ------------------------- | ------------ | ---- | ------------------------------ | ------------------------------------------------------------------------ |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`            | PK                                                                       |
| 2   | `tenant_id`               | uuid         | NO   | —                              |                                                                          |
| 3   | `target_employee_id`      | uuid         | YES  | —                              |                                                                          |
| 4   | `reviewer_employee_id`    | uuid         | YES  | —                              |                                                                          |
| 5   | `review_cycle_id`         | uuid         | YES  | —                              |                                                                          |
| 6   | `relationship_type`       | varchar(50)  | YES  | —                              |                                                                          |
| 7   | `overall_rating`          | numeric(3,2) | YES  | —                              |                                                                          |
| 8   | `strengths`               | text         | YES  | —                              |                                                                          |
| 9   | `areas_for_improvement`   | text         | YES  | —                              |                                                                          |
| 10  | `is_anonymous`            | bool         | YES  | `true`                         |                                                                          |
| 11  | `status`                  | varchar(50)  | YES  | `'pending'::character varying` |                                                                          |
| 12  | `created_at`              | timestamp    | YES  | `now()`                        |                                                                          |
| 13  | `completed_at`            | timestamp    | YES  | —                              |                                                                          |
| 14  | `content_embedding`       | vector       | YES  | —                              | Semantic embedding of 360 feedback content (strengths, improvements)     |
| 15  | `embedding_text_hash`     | varchar(64)  | YES  | —                              |                                                                          |
| 16  | `embedding_model`         | varchar(100) | YES  | —                              |                                                                          |
| 17  | `embedding_generated_at`  | timestamptz  | YES  | —                              |                                                                          |
| 18  | `questionnaire_id`        | uuid         | YES  | —                              |                                                                          |
| 19  | `performance_review_id`   | uuid         | YES  | —                              |                                                                          |
| 20  | `request_id`              | uuid         | YES  | —                              |                                                                          |
| 21  | `question_responses`      | jsonb        | YES  | —                              | JSONB BY DESIGN: embedded survey responses with scores, tightly coupled. |
| 22  | `sentiment_score`         | numeric(3,2) | YES  | —                              | AI-calculated sentiment (-1 to 1)                                        |
| 23  | `submission_time_seconds` | int4(32)     | YES  | —                              |                                                                          |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                        | ON UPDATE | ON DELETE | Notes |
| ----------------------- | --------------------------------- | --------- | --------- | ----- |
| `performance_review_id` | `performance_reviews(id)`         | NO ACTION | SET NULL  |       |
| `questionnaire_id`      | `feedback_360_questionnaires(id)` | NO ACTION | SET NULL  |       |
| `request_id`            | `feedback_requests(id)`           | NO ACTION | SET NULL  |       |
| `tenant_id`             | `tenants(id)`                     | NO ACTION | CASCADE   |       |
| `reviewer_employee_id`  | `employees_core(id)`              | NO ACTION | SET NULL  |       |
| `target_employee_id`    | `employees_core(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_360_pkey` [PRIMARY] · (`id`)
- `idx_feedback_360_cycle` [INDEX] · (`review_cycle_id`)
- `idx_feedback_360_embedding` [INDEX] · (`content_embedding`)
- `idx_feedback_360_questionnaire_id` [INDEX] · (`questionnaire_id`)
- `idx_feedback_360_request_id` [INDEX] · (`request_id`)
- `idx_feedback_360_review` [INDEX] · (`performance_review_id`)
- `idx_feedback_360_reviewer` [INDEX] · (`reviewer_employee_id`)
- `idx_feedback_360_status` [INDEX] · (`status`)
- `idx_feedback_360_target` [INDEX] · (`target_employee_id`)
- `idx_feedback_360_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `feedback_requests` via (`feedback_360_id`)

---

### `feedback_360_peer_suggestions`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: GOKMER
- **Prisma model**: `feedback_360_peer_suggestions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                          | Notes |
| --- | -------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                                |       |
| 3   | `target_employee_id` | uuid         | NO   | —                                |       |
| 4   | `suggested_peer_id`  | uuid         | NO   | —                                |       |
| 5   | `review_cycle_id`    | uuid         | YES  | —                                |       |
| 6   | `suggestion_source`  | varchar(50)  | YES  | `'algorithm'::character varying` |       |
| 7   | `relationship_type`  | varchar(50)  | YES  | —                                |       |
| 8   | `confidence_score`   | numeric(3,2) | YES  | —                                |       |
| 9   | `reason`             | text         | YES  | —                                |       |
| 10  | `is_selected`        | bool         | YES  | `false`                          |       |
| 11  | `created_at`         | timestamptz  | YES  | `now()`                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References           | ON UPDATE | ON DELETE | Notes |
| -------------------- | -------------------- | --------- | --------- | ----- |
| `review_cycle_id`    | `review_cycles(id)`  | NO ACTION | SET NULL  |       |
| `suggested_peer_id`  | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `target_employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`          | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_360_peer_suggestions_pkey` [PRIMARY] · (`id`)
- `feedback_360_peer_suggestions_tenant_id_target_employee_id__key` [UNIQUE] · (`tenant_id`, `target_employee_id`, `suggested_peer_id`, `review_cycle_id`)
- `idx_peer_suggestions_cycle` [INDEX] · (`review_cycle_id`)
- `idx_peer_suggestions_target` [INDEX] · (`target_employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `feedback_360_questionnaires`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: GOKMER
- **Prisma model**: `feedback_360_questionnaires`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                                                                     | Notes |
| --- | -------------------- | ------------ | ---- | --------------------------------------------------------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`                                                         | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                                                                           |       |
| 3   | `name`               | varchar(255) | NO   | —                                                                           |       |
| 4   | `description`        | text         | YES  | —                                                                           |       |
| 5   | `is_default`         | bool         | YES  | `false`                                                                     |       |
| 6   | `relationship_types` | \_text       | YES  | `ARRAY['manager'::text, 'peer'::text, 'direct_report'::text, 'self'::text]` |       |
| 7   | `is_active`          | bool         | YES  | `true`                                                                      |       |
| 8   | `created_by`         | uuid         | YES  | —                                                                           |       |
| 9   | `created_at`         | timestamptz  | YES  | `now()`                                                                     |       |
| 10  | `updated_at`         | timestamptz  | YES  | `now()`                                                                     |       |
| 11  | `deleted_at`         | timestamptz  | YES  | —                                                                           |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References           | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------------- | --------- | --------- | ----- |
| `created_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_360_questionnaires_pkey` [PRIMARY] · (`id`)
- `idx_feedback_360_questionnaires_active` [INDEX] · (`is_active`)
- `idx_feedback_360_questionnaires_created_by` [INDEX] · (`created_by`)
- `idx_feedback_360_questionnaires_not_deleted` [INDEX] · (`id`)
- `idx_feedback_360_questionnaires_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `feedback_360` via (`questionnaire_id`)
- `feedback_360_questions` via (`questionnaire_id`)
- `feedback_requests` via (`questionnaire_id`)

---

### `feedback_360_questions`

- **Tenant scoped**: yes
- **Row estimate**: 28
- **Domains**: GOKMER
- **Prisma model**: `feedback_360_questions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                       | Notes |
| --- | -------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                             |       |
| 3   | `questionnaire_id`   | uuid         | NO   | —                             |       |
| 4   | `question_text`      | text         | NO   | —                             |       |
| 5   | `question_type`      | varchar(50)  | YES  | `'rating'::character varying` |       |
| 6   | `category`           | varchar(100) | YES  | —                             |       |
| 7   | `ksaba_dimension`    | varchar(20)  | YES  | —                             |       |
| 8   | `competency_id`      | uuid         | YES  | —                             |       |
| 9   | `options`            | jsonb        | YES  | —                             |       |
| 10  | `rating_scale_min`   | int4(32)     | YES  | `1`                           |       |
| 11  | `rating_scale_max`   | int4(32)     | YES  | `5`                           |       |
| 12  | `is_required`        | bool         | YES  | `true`                        |       |
| 13  | `display_order`      | int4(32)     | YES  | `0`                           |       |
| 14  | `relationship_types` | \_text       | YES  | —                             |       |
| 15  | `created_at`         | timestamptz  | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns            | References                        | ON UPDATE | ON DELETE | Notes |
| ------------------ | --------------------------------- | --------- | --------- | ----- |
| `questionnaire_id` | `feedback_360_questionnaires(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`        | `tenants(id)`                     | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_360_questions_pkey` [PRIMARY] · (`id`)
- `idx_feedback_360_questions_category` [INDEX] · (`category`)
- `idx_feedback_360_questions_questionnaire` [INDEX] · (`questionnaire_id`)
- `idx_feedback_360_questions_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `feedback_categories`

- **Tenant scoped**: yes
- **Row estimate**: 32
- **Domains**: GOKMER
- **Prisma model**: `feedback_categories`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`     | uuid         | NO   | —                   |       |
| 3   | `name`          | varchar(100) | NO   | —                   |       |
| 4   | `description`   | text         | YES  | —                   |       |
| 5   | `icon`          | varchar(50)  | YES  | —                   |       |
| 6   | `color`         | varchar(20)  | YES  | —                   |       |
| 7   | `display_order` | int4(32)     | YES  | `0`                 |       |
| 8   | `is_active`     | bool         | YES  | `true`              |       |
| 9   | `created_at`    | timestamptz  | YES  | `now()`             |       |
| 10  | `deleted_at`    | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_categories_pkey` [PRIMARY] · (`id`)
- `idx_feedback_categories_active` [INDEX] · (`id`)
- `idx_feedback_categories_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `feedback_requests`

- **Tenant scoped**: yes
- **Row estimate**: 246
- **Domains**: GOKMER
- **Prisma model**: `feedback_requests`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type        | Null | Default                        | Notes                                    |
| --- | ----------------------- | ----------- | ---- | ------------------------------ | ---------------------------------------- |
| 1   | `id`                    | uuid        | NO   | `gen_random_uuid()`            | PK                                       |
| 2   | `tenant_id`             | uuid        | NO   | —                              |                                          |
| 3   | `requestee_id`          | uuid        | NO   | —                              |                                          |
| 4   | `reviewer_id`           | uuid        | NO   | —                              |                                          |
| 5   | `feedback_type`         | varchar(50) | YES  | `'peer'::character varying`    |                                          |
| 6   | `status`                | varchar(50) | YES  | `'pending'::character varying` |                                          |
| 7   | `due_date`              | date        | YES  | —                              |                                          |
| 8   | `completed_at`          | timestamptz | YES  | —                              |                                          |
| 9   | `is_anonymous`          | bool        | YES  | `true`                         |                                          |
| 10  | `created_at`            | timestamptz | YES  | `CURRENT_TIMESTAMP`            |                                          |
| 11  | `review_cycle_id`       | uuid        | YES  | —                              |                                          |
| 12  | `performance_review_id` | uuid        | YES  | —                              |                                          |
| 13  | `questionnaire_id`      | uuid        | YES  | —                              |                                          |
| 14  | `relationship_type`     | varchar(50) | YES  | —                              | Type: manager, peer, direct_report, self |
| 15  | `reminder_sent_at`      | timestamptz | YES  | —                              |                                          |
| 16  | `feedback_360_id`       | uuid        | YES  | —                              |                                          |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                        | ON UPDATE | ON DELETE | Notes |
| ----------------------- | --------------------------------- | --------- | --------- | ----- |
| `feedback_360_id`       | `feedback_360(id)`                | NO ACTION | SET NULL  |       |
| `performance_review_id` | `performance_reviews(id)`         | NO ACTION | CASCADE   |       |
| `questionnaire_id`      | `feedback_360_questionnaires(id)` | NO ACTION | SET NULL  |       |
| `review_cycle_id`       | `review_cycles(id)`               | NO ACTION | CASCADE   |       |
| `tenant_id`             | `tenants(id)`                     | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_requests_pkey` [PRIMARY] · (`id`)
- `idx_feedback_requests_feedback_360_id` [INDEX] · (`feedback_360_id`)
- `idx_feedback_requests_performance_review_id` [INDEX] · (`performance_review_id`)
- `idx_feedback_requests_questionnaire_id` [INDEX] · (`questionnaire_id`)
- `idx_feedback_requests_review_cycle_id` [INDEX] · (`review_cycle_id`)
- `idx_feedback_requests_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `feedback_360` via (`request_id`)

---

### `feedback_responses`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: GOKMER
- **Prisma model**: `feedback_responses`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type        | Null | Default             | Notes |
| --- | ----------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                    | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `request_id`            | uuid        | NO   | —                   |       |
| 3   | `overall_rating`        | int4(32)    | YES  | —                   |       |
| 4   | `strengths`             | text        | YES  | —                   |       |
| 5   | `areas_for_improvement` | text        | YES  | —                   |       |
| 6   | `additional_comments`   | text        | YES  | —                   |       |
| 7   | `competency_ratings`    | jsonb       | YES  | —                   |       |
| 8   | `created_at`            | timestamptz | YES  | `CURRENT_TIMESTAMP` |       |
| 9   | `tenant_id`             | uuid        | NO   | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `feedback_responses_pkey` [PRIMARY] · (`id`)
- `idx_feedback_responses_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_feedback_responses** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `goal_alignments`

- **Tenant scoped**: yes
- **Row estimate**: 100
- **Domains**: GOKMER
- **Prisma model**: `goal_alignments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                         | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                               |       |
| 3   | `goal_id`          | uuid         | NO   | —                               |       |
| 4   | `aligned_goal_id`  | uuid         | NO   | —                               |       |
| 5   | `alignment_type`   | varchar(50)  | YES  | `'supports'::character varying` |       |
| 6   | `alignment_weight` | numeric(5,2) | YES  | `100`                           |       |
| 7   | `created_at`       | timestamptz  | YES  | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References    | ON UPDATE | ON DELETE | Notes |
| ----------------- | ------------- | --------- | --------- | ----- |
| `aligned_goal_id` | `goals(id)`   | NO ACTION | CASCADE   |       |
| `goal_id`         | `goals(id)`   | NO ACTION | CASCADE   |       |
| `tenant_id`       | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_alignments_pkey` [PRIMARY] · (`id`)
- `idx_goal_alignments_aligned` [INDEX] · (`aligned_goal_id`)
- `idx_goal_alignments_goal` [INDEX] · (`goal_id`)
- `idx_goal_alignments_tenant_id` [INDEX] · (`tenant_id`)
- `unique_goal_alignment` [UNIQUE] · (`goal_id`, `aligned_goal_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `goal_check_ins`

- **Tenant scoped**: yes
- **Row estimate**: 1000
- **Domains**: GOKMER
- **Prisma model**: `goal_check_ins`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default             | Notes |
| --- | ------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                   |       |
| 3   | `goal_id`           | uuid        | NO   | —                   |       |
| 4   | `employee_id`       | uuid        | NO   | —                   |       |
| 5   | `check_in_date`     | date        | NO   | `CURRENT_DATE`      |       |
| 6   | `previous_progress` | int4(32)    | YES  | —                   |       |
| 7   | `new_progress`      | int4(32)    | NO   | —                   |       |
| 8   | `status_update`     | varchar(50) | YES  | —                   |       |
| 9   | `notes`             | text        | YES  | —                   |       |
| 10  | `blockers`          | text        | YES  | —                   |       |
| 11  | `next_steps`        | text        | YES  | —                   |       |
| 12  | `confidence_level`  | int4(32)    | YES  | —                   |       |
| 13  | `created_at`        | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `goal_id`     | `goals(id)`          | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_check_ins_pkey` [PRIMARY] · (`id`)
- `idx_goal_check_ins_date` [INDEX] · (`check_in_date`)
- `idx_goal_check_ins_employee` [INDEX] · (`employee_id`)
- `idx_goal_check_ins_goal` [INDEX] · (`goal_id`)
- `idx_goal_check_ins_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `goal_comments`

- **Tenant scoped**: yes
- **Row estimate**: 856
- **Domains**: GOKMER
- **Prisma model**: `goal_comments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default             | Notes |
| --- | ------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                   |       |
| 3   | `goal_id`           | uuid        | NO   | —                   |       |
| 4   | `author_id`         | uuid        | YES  | —                   |       |
| 5   | `parent_comment_id` | uuid        | YES  | —                   |       |
| 6   | `content`           | text        | NO   | —                   |       |
| 7   | `is_private`        | bool        | YES  | `false`             |       |
| 8   | `created_at`        | timestamptz | YES  | `now()`             |       |
| 9   | `updated_at`        | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References           | ON UPDATE | ON DELETE | Notes |
| ------------------- | -------------------- | --------- | --------- | ----- |
| `author_id`         | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `goal_id`           | `goals(id)`          | NO ACTION | CASCADE   |       |
| `parent_comment_id` | `goal_comments(id)`  | NO ACTION | CASCADE   |       |
| `tenant_id`         | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_comments_pkey` [PRIMARY] · (`id`)
- `idx_goal_comments_author` [INDEX] · (`author_id`)
- `idx_goal_comments_goal` [INDEX] · (`goal_id`)
- `idx_goal_comments_parent_comment_id` [INDEX] · (`parent_comment_id`)
- `idx_goal_comments_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `goal_comments` via (`parent_comment_id`)

---

### `goal_milestones`

- **Tenant scoped**: yes
- **Row estimate**: 1000
- **Domains**: GOKMER
- **Prisma model**: `goal_milestones`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type         | Null | Default                        | Notes |
| --- | -------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`    | uuid         | NO   | —                              |       |
| 3   | `goal_id`      | uuid         | NO   | —                              |       |
| 4   | `title`        | varchar(255) | NO   | —                              |       |
| 5   | `description`  | text         | YES  | —                              |       |
| 6   | `target_date`  | date         | YES  | —                              |       |
| 7   | `completed_at` | timestamptz  | YES  | —                              |       |
| 8   | `status`       | varchar(20)  | YES  | `'pending'::character varying` |       |
| 9   | `weight`       | numeric(5,2) | YES  | `0`                            |       |
| 10  | `created_at`   | timestamptz  | YES  | `now()`                        |       |
| 11  | `updated_at`   | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `goal_id`   | `goals(id)`   | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_milestones_pkey` [PRIMARY] · (`id`)
- `idx_goal_milestones_goal` [INDEX] · (`goal_id`)
- `idx_goal_milestones_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `goal_review_ratings`

- **Tenant scoped**: yes
- **Row estimate**: 155
- **Domains**: GOKMER
- **Prisma model**: `goal_review_ratings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default             | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                   |       |
| 3   | `performance_review_id`   | uuid         | NO   | —                   |       |
| 4   | `goal_id`                 | uuid         | NO   | —                   |       |
| 5   | `employee_id`             | uuid         | NO   | —                   |       |
| 6   | `self_rating`             | numeric(3,2) | YES  | —                   |       |
| 7   | `self_comment`            | text         | YES  | —                   |       |
| 8   | `achievement_description` | text         | YES  | —                   |       |
| 9   | `manager_rating`          | numeric(3,2) | YES  | —                   |       |
| 10  | `manager_comment`         | text         | YES  | —                   |       |
| 11  | `weight`                  | numeric(3,2) | YES  | `1.0`               |       |
| 12  | `created_at`              | timestamptz  | YES  | `now()`             |       |
| 13  | `updated_at`              | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                | ON UPDATE | ON DELETE | Notes |
| ----------------------- | ------------------------- | --------- | --------- | ----- |
| `employee_id`           | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `goal_id`               | `goals(id)`               | NO ACTION | CASCADE   |       |
| `performance_review_id` | `performance_reviews(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`             | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_review_ratings_performance_review_id_goal_id_key` [UNIQUE] · (`performance_review_id`, `goal_id`)
- `goal_review_ratings_pkey` [PRIMARY] · (`id`)
- `idx_goal_review_ratings_employee` [INDEX] · (`employee_id`)
- `idx_goal_review_ratings_goal` [INDEX] · (`goal_id`)
- `idx_goal_review_ratings_review` [INDEX] · (`performance_review_id`)
- `idx_goal_review_ratings_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `goal_templates`

- **Tenant scoped**: yes
- **Row estimate**: 40
- **Domains**: GOKMER
- **Prisma model**: `goal_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                          | Notes |
| --- | ------------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                                |       |
| 3   | `name`                    | varchar(255) | NO   | —                                |       |
| 4   | `description`             | text         | YES  | —                                |       |
| 5   | `category`                | varchar(100) | YES  | —                                |       |
| 6   | `goal_type`               | varchar(50)  | YES  | `'objective'::character varying` |       |
| 7   | `suggested_metrics`       | \_text       | YES  | —                                |       |
| 8   | `suggested_duration_days` | int4(32)     | YES  | —                                |       |
| 9   | `suggested_weight`        | numeric(3,2) | YES  | `1.0`                            |       |
| 10  | `difficulty_level`        | varchar(20)  | YES  | `'medium'::character varying`    |       |
| 11  | `role_id`                 | uuid         | YES  | —                                |       |
| 12  | `is_company_wide`         | bool         | YES  | `false`                          |       |
| 13  | `usage_count`             | int4(32)     | YES  | `0`                              |       |
| 14  | `is_active`               | bool         | YES  | `true`                           |       |
| 15  | `created_by`              | uuid         | YES  | —                                |       |
| 16  | `created_at`              | timestamptz  | YES  | `now()`                          |       |
| 17  | `updated_at`              | timestamptz  | YES  | `now()`                          |       |
| 18  | `deleted_at`              | timestamptz  | YES  | —                                |       |
| 19  | `org_unit_id`             | uuid         | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `created_by`  | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `org_unit_id` | `org_units(id)`      | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_templates_pkey` [PRIMARY] · (`id`)
- `idx_goal_templates_active` [INDEX] · (`is_active`)
- `idx_goal_templates_category` [INDEX] · (`category`)
- `idx_goal_templates_created_by` [INDEX] · (`created_by`)
- `idx_goal_templates_not_deleted` [INDEX] · (`id`)
- `idx_goal_templates_org_unit_id` [INDEX] · (`org_unit_id`)
- `idx_goal_templates_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `goals` via (`template_id`)

---

### `goal_updates`

- **Tenant scoped**: yes
- **Row estimate**: 1811
- **Domains**: GOKMER
- **Prisma model**: `goal_updates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                         | Notes |
| --- | ------------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                               |       |
| 3   | `goal_id`           | uuid         | NO   | —                               |       |
| 4   | `author_id`         | uuid         | YES  | —                               |       |
| 5   | `update_type`       | varchar(30)  | YES  | `'progress'::character varying` |       |
| 6   | `previous_progress` | numeric(5,2) | YES  | —                               |       |
| 7   | `new_progress`      | numeric(5,2) | YES  | —                               |       |
| 8   | `previous_status`   | varchar(30)  | YES  | —                               |       |
| 9   | `new_status`        | varchar(30)  | YES  | —                               |       |
| 10  | `content`           | text         | YES  | —                               |       |
| 11  | `attachments`       | jsonb        | YES  | `'[]'::jsonb`                   |       |
| 12  | `created_at`        | timestamptz  | YES  | `now()`                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `author_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `goal_id`   | `goals(id)`          | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `goal_updates_pkey` [PRIMARY] · (`id`)
- `idx_goal_updates_author` [INDEX] · (`author_id`)
- `idx_goal_updates_created` [INDEX] · (`created_at`)
- `idx_goal_updates_goal` [INDEX] · (`goal_id`)
- `idx_goal_updates_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `goals`

- **Tenant scoped**: yes
- **Row estimate**: 1068
- **Domains**: GOKMER
- **Prisma model**: `goals`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                            | Notes                                                |
| --- | ------------------------ | ------------ | ---- | ---------------------------------- | ---------------------------------------------------- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`                | PK                                                   |
| 2   | `tenant_id`              | uuid         | NO   | —                                  |                                                      |
| 3   | `employee_id`            | uuid         | YES  | —                                  |                                                      |
| 4   | `title`                  | varchar(255) | NO   | —                                  |                                                      |
| 5   | `description`            | text         | YES  | —                                  |                                                      |
| 6   | `goal_type`              | varchar(50)  | YES  | `'objective'::character varying`   |                                                      |
| 7   | `parent_goal_id`         | uuid         | YES  | —                                  |                                                      |
| 8   | `start_date`             | date         | YES  | —                                  |                                                      |
| 9   | `due_date`               | date         | YES  | —                                  |                                                      |
| 10  | `status`                 | varchar(50)  | YES  | `'not_started'::character varying` |                                                      |
| 11  | `progress_percent`       | int4(32)     | YES  | `0`                                |                                                      |
| 12  | `weight`                 | numeric(3,2) | YES  | `1.0`                              |                                                      |
| 13  | `created_at`             | timestamp    | YES  | `now()`                            |                                                      |
| 14  | `updated_at`             | timestamp    | YES  | `now()`                            |                                                      |
| 15  | `completed_at`           | timestamp    | YES  | —                                  |                                                      |
| 16  | `category`               | varchar(100) | YES  | —                                  |                                                      |
| 17  | `owner_id`               | uuid         | YES  | —                                  |                                                      |
| 18  | `priority`               | varchar(20)  | YES  | `'medium'::character varying`      |                                                      |
| 19  | `tags`                   | jsonb        | YES  | `'[]'::jsonb`                      | JSONB BY DESIGN: free-form goal categorization tags. |
| 20  | `custom_fields`          | jsonb        | YES  | `'{}'::jsonb`                      | JSONB BY DESIGN: user-defined goal extensions.       |
| 21  | `embedding`              | vector       | YES  | —                                  | Vector embedding of goal title and description       |
| 22  | `embedding_model`        | varchar(100) | YES  | —                                  |                                                      |
| 23  | `embedding_generated_at` | timestamptz  | YES  | —                                  |                                                      |
| 24  | `smart_criteria`         | jsonb        | YES  | —                                  | JSONB BY DESIGN: SMART goal evaluation criteria.     |
| 25  | `is_smart_validated`     | bool         | YES  | `false`                            |                                                      |
| 26  | `smart_score`            | int4(32)     | YES  | —                                  | Calculated SMART compliance score 0-100              |
| 27  | `template_id`            | uuid         | YES  | —                                  |                                                      |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References           | ON UPDATE | ON DELETE | Notes |
| ---------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`    | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `owner_id`       | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `parent_goal_id` | `goals(id)`          | NO ACTION | SET NULL  |       |
| `template_id`    | `goal_templates(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`      | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `goals_pkey` [PRIMARY] · (`id`)
- `idx_goals_due_date` [INDEX] · (`tenant_id`, `due_date`)
- `idx_goals_embedding` [INDEX] · (`embedding`)
- `idx_goals_employee` [INDEX] · (`employee_id`)
- `idx_goals_owner` [INDEX] · (`owner_id`)
- `idx_goals_parent` [INDEX] · (`parent_goal_id`)
- `idx_goals_status` [INDEX] · (`tenant_id`, `status`)
- `idx_goals_template` [INDEX] · (`template_id`)
- `idx_goals_tenant` [INDEX] · (`tenant_id`)
- `idx_goals_tenant_employee` [INDEX] · (`tenant_id`, `employee_id`)
- `idx_goals_type` [INDEX] · (`tenant_id`, `goal_type`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `goal_alignments` via (`aligned_goal_id` · `goal_id`)
- `goal_check_ins` via (`goal_id`)
- `goal_comments` via (`goal_id`)
- `goal_milestones` via (`goal_id`)
- `goal_review_ratings` via (`goal_id`)
- `goal_updates` via (`goal_id`)
- `goals` via (`parent_goal_id`)
- `self_assessment_evidence` via (`related_goal_id`)

---

### `key_results`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: GOKMER
- **Prisma model**: `key_results`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type          | Null | Default                           | Notes |
| --- | ------------------ | ------------- | ---- | --------------------------------- | ----- |
| 1   | `id`               | uuid          | NO   | `gen_random_uuid()`               | PK    |
| 2   | `okr_id`           | uuid          | NO   | —                                 |       |
| 3   | `description`      | text          | NO   | —                                 |       |
| 4   | `metric_type`      | varchar(50)   | YES  | `'percentage'::character varying` |       |
| 5   | `start_value`      | numeric(15,2) | YES  | `0`                               |       |
| 6   | `target_value`     | numeric(15,2) | NO   | —                                 |       |
| 7   | `current_value`    | numeric(15,2) | YES  | `0`                               |       |
| 8   | `unit`             | varchar(50)   | YES  | —                                 |       |
| 9   | `progress_percent` | numeric(5,2)  | YES  | `0`                               |       |
| 10  | `status`           | varchar(50)   | YES  | `'on_track'::character varying`   |       |
| 11  | `weight`           | numeric(5,2)  | YES  | `1.0`                             |       |
| 12  | `owner_id`         | uuid          | YES  | —                                 |       |
| 13  | `created_at`       | timestamptz   | YES  | `CURRENT_TIMESTAMP`               |       |
| 14  | `updated_at`       | timestamptz   | YES  | `CURRENT_TIMESTAMP`               |       |
| 15  | `tenant_id`        | uuid          | NO   | —                                 |       |
| 16  | `last_check_in_at` | timestamptz   | YES  | —                                 |       |
| 17  | `confidence_level` | int4(32)      | YES  | `3`                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_key_results_okr` [INDEX] · (`okr_id`)
- `idx_key_results_owner` [INDEX] · (`owner_id`)
- `idx_key_results_status` [INDEX] · (`status`)
- `idx_key_results_tenant_id` [INDEX] · (`tenant_id`)
- `key_results_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `okr_check_ins` via (`key_result_id`)

---

### `okr_check_ins`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: GOKMER
- **Prisma model**: `okr_check_ins`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type          | Null | Default             | Notes |
| --- | ------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid          | NO   | —                   |       |
| 3   | `okr_id`            | uuid          | NO   | —                   |       |
| 4   | `key_result_id`     | uuid          | YES  | —                   |       |
| 5   | `employee_id`       | uuid          | NO   | —                   |       |
| 6   | `check_in_date`     | date          | NO   | `CURRENT_DATE`      |       |
| 7   | `previous_value`    | numeric(15,2) | YES  | —                   |       |
| 8   | `new_value`         | numeric(15,2) | NO   | —                   |       |
| 9   | `previous_progress` | numeric(5,2)  | YES  | —                   |       |
| 10  | `new_progress`      | numeric(5,2)  | YES  | —                   |       |
| 11  | `confidence_level`  | int4(32)      | YES  | —                   |       |
| 12  | `notes`             | text          | YES  | —                   |       |
| 13  | `blockers`          | text          | YES  | —                   |       |
| 14  | `created_at`        | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References           | ON UPDATE | ON DELETE | Notes |
| --------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`   | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `key_result_id` | `key_results(id)`    | NO ACTION | CASCADE   |       |
| `okr_id`        | `okrs(id)`           | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_okr_check_ins_date` [INDEX] · (`check_in_date`)
- `idx_okr_check_ins_employee` [INDEX] · (`employee_id`)
- `idx_okr_check_ins_kr` [INDEX] · (`key_result_id`)
- `idx_okr_check_ins_okr` [INDEX] · (`okr_id`)
- `idx_okr_check_ins_tenant_id` [INDEX] · (`tenant_id`)
- `okr_check_ins_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `okr_checkins`

- **Tenant scoped**: yes
- **Row estimate**: 10
- **Domains**: GOKMER
- **Prisma model**: `okr_checkins`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                   |       |
| 3   | `okr_id`             | uuid         | NO   | —                   |       |
| 4   | `author_id`          | uuid         | YES  | —                   |       |
| 5   | `checkin_date`       | date         | NO   | `CURRENT_DATE`      |       |
| 6   | `overall_progress`   | numeric(5,2) | YES  | —                   |       |
| 7   | `confidence_level`   | numeric(5,2) | YES  | —                   |       |
| 8   | `status_update`      | text         | YES  | —                   |       |
| 9   | `blockers`           | text         | YES  | —                   |       |
| 10  | `next_steps`         | text         | YES  | —                   |       |
| 11  | `key_result_updates` | jsonb        | YES  | `'[]'::jsonb`       |       |
| 12  | `created_at`         | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `author_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `okr_id`    | `okrs(id)`           | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_okr_checkins_author_id` [INDEX] · (`author_id`)
- `idx_okr_checkins_date` [INDEX] · (`checkin_date`)
- `idx_okr_checkins_okr` [INDEX] · (`okr_id`)
- `idx_okr_checkins_tenant_id` [INDEX] · (`tenant_id`)
- `okr_checkins_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `okrs`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: GOKMER
- **Prisma model**: `okrs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                          | Notes |
| --- | ------------------ | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                                |       |
| 3   | `objective`        | text         | NO   | —                                |       |
| 4   | `okr_type`         | varchar(50)  | YES  | `'company'::character varying`   |       |
| 5   | `department`       | varchar(100) | YES  | —                                |       |
| 6   | `period_type`      | varchar(20)  | YES  | `'quarterly'::character varying` |       |
| 7   | `period_start`     | date         | NO   | —                                |       |
| 8   | `period_end`       | date         | NO   | —                                |       |
| 9   | `status`           | varchar(50)  | YES  | `'active'::character varying`    |       |
| 10  | `overall_progress` | numeric(5,2) | YES  | `0`                              |       |
| 11  | `confidence_level` | numeric(3,2) | YES  | —                                |       |
| 12  | `owner_id`         | uuid         | YES  | —                                |       |
| 13  | `created_by`       | uuid         | YES  | —                                |       |
| 14  | `created_at`       | timestamptz  | YES  | `CURRENT_TIMESTAMP`              |       |
| 15  | `updated_at`       | timestamptz  | YES  | `CURRENT_TIMESTAMP`              |       |
| 16  | `description`      | text         | YES  | —                                |       |
| 17  | `parent_okr_id`    | uuid         | YES  | —                                |       |
| 18  | `tags`             | jsonb        | YES  | `'[]'::jsonb`                    |       |
| 19  | `fiscal_year`      | int4(32)     | YES  | —                                |       |
| 20  | `fiscal_quarter`   | int4(32)     | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References           | ON UPDATE | ON DELETE | Notes |
| --------------- | -------------------- | --------- | --------- | ----- |
| `owner_id`      | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `parent_okr_id` | `okrs(id)`           | NO ACTION | SET NULL  |       |
| `tenant_id`     | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_okrs_owner` [INDEX] · (`tenant_id`, `owner_id`)
- `idx_okrs_parent_okr_id` [INDEX] · (`parent_okr_id`)
- `idx_okrs_period` [INDEX] · (`tenant_id`, `period_start`, `period_end`)
- `idx_okrs_status` [INDEX] · (`tenant_id`, `status`)
- `idx_okrs_tenant` [INDEX] · (`tenant_id`)
- `idx_okrs_type` [INDEX] · (`tenant_id`, `okr_type`)
- `okrs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `okr_check_ins` via (`okr_id`)
- `okr_checkins` via (`okr_id`)
- `okrs` via (`parent_okr_id`)

---

### `performance_predictions`

- **Tenant scoped**: yes
- **Row estimate**: 267
- **Domains**: GOKMER · EPRA
- **Prisma model**: `performance_predictions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default                                 | Notes                                                                      |
| --- | -------------------------- | ------------ | ---- | --------------------------------------- | -------------------------------------------------------------------------- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()`                     | PK                                                                         |
| 2   | `tenant_id`                | uuid         | NO   | —                                       |                                                                            |
| 3   | `employee_id`              | uuid         | YES  | —                                       |                                                                            |
| 4   | `prediction_period`        | varchar(20)  | NO   | —                                       |                                                                            |
| 5   | `predicted_rating`         | numeric(3,2) | YES  | —                                       |                                                                            |
| 6   | `confidence_interval_low`  | numeric(3,2) | YES  | —                                       |                                                                            |
| 7   | `confidence_interval_high` | numeric(3,2) | YES  | —                                       |                                                                            |
| 8   | `influencing_factors`      | jsonb        | YES  | `'[]'::jsonb`                           |                                                                            |
| 9   | `improvement_suggestions`  | jsonb        | YES  | `'[]'::jsonb`                           |                                                                            |
| 10  | `model_version`            | int4(32)     | YES  | —                                       |                                                                            |
| 11  | `is_current`               | bool         | YES  | `true`                                  |                                                                            |
| 12  | `created_at`               | timestamptz  | YES  | `now()`                                 |                                                                            |
| 13  | `risk_score`               | int4(32)     | YES  | —                                       | Performance risk score 0-100 (higher = more at risk)                       |
| 14  | `risk_level`               | varchar(20)  | YES  | —                                       | Risk category: low (0-25), medium (26-50), high (51-75), critical (76-100) |
| 15  | `is_high_potential`        | bool         | YES  | `false`                                 | Flag indicating high potential employee                                    |
| 16  | `hipo_score`               | numeric(3,2) | YES  | —                                       | High potential score (0-5)                                                 |
| 17  | `hipo_justification`       | text         | YES  | —                                       | Explanation of HiPo classification                                         |
| 18  | `contributing_factors`     | jsonb        | YES  | `'[]'::jsonb`                           | Detailed breakdown of factors affecting prediction                         |
| 19  | `recommended_actions`      | jsonb        | YES  | `'[]'::jsonb`                           | Suggested interventions with priority and impact                           |
| 20  | `data_sources`             | jsonb        | YES  | `'[]'::jsonb`                           |                                                                            |
| 21  | `prediction_confidence`    | numeric(5,4) | YES  | —                                       | Model confidence in prediction (0-1)                                       |
| 22  | `actual_rating`            | numeric(3,2) | YES  | —                                       | Actual rating after review period (for accuracy calc)                      |
| 23  | `prediction_accuracy`      | numeric(5,4) | YES  | —                                       | How accurate prediction was vs actual                                      |
| 24  | `validated_at`             | timestamptz  | YES  | —                                       |                                                                            |
| 25  | `model_name`               | varchar(100) | YES  | `'heuresys-perf-v1'::character varying` |                                                                            |
| 26  | `feature_weights`          | jsonb        | YES  | `'{}'::jsonb`                           |                                                                            |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_perf_predictions_employee` [INDEX] · (`employee_id`)
- `idx_perf_predictions_hipo` [INDEX] · (`is_high_potential`)
- `idx_perf_predictions_model` [INDEX] · (`model_name`, `model_version`)
- `idx_perf_predictions_risk` [INDEX] · (`risk_score`)
- `idx_perf_predictions_tenant` [INDEX] · (`tenant_id`)
- `performance_predictions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_perf_predictions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `performance_review_templates`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: GOKMER
- **Prisma model**: `performance_review_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default                                                                                                                                             | Notes |
| --- | -------------------------- | ------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()`                                                                                                                                 | PK    |
| 2   | `tenant_id`                | uuid         | NO   | —                                                                                                                                                   |       |
| 3   | `name`                     | varchar(255) | NO   | —                                                                                                                                                   |       |
| 4   | `description`              | text         | YES  | —                                                                                                                                                   |       |
| 5   | `template_type`            | varchar(50)  | YES  | `'standard'::character varying`                                                                                                                     |       |
| 6   | `rating_scale_type`        | varchar(20)  | YES  | `'1-5'::character varying`                                                                                                                          |       |
| 7   | `rating_scale_config`      | jsonb        | YES  | `'{"max": 5, "min": 1, "labels": ["Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding"]}'::jsonb` |       |
| 8   | `sections`                 | jsonb        | NO   | `'[]'::jsonb`                                                                                                                                       |       |
| 9   | `competencies`             | jsonb        | YES  | —                                                                                                                                                   |       |
| 10  | `include_goals`            | bool         | YES  | `true`                                                                                                                                              |       |
| 11  | `include_development_plan` | bool         | YES  | `true`                                                                                                                                              |       |
| 12  | `is_default`               | bool         | YES  | `false`                                                                                                                                             |       |
| 13  | `is_active`                | bool         | YES  | `true`                                                                                                                                              |       |
| 14  | `created_at`               | timestamptz  | YES  | `now()`                                                                                                                                             |       |
| 15  | `updated_at`               | timestamptz  | YES  | `now()`                                                                                                                                             |       |
| 16  | `deleted_at`               | timestamptz  | YES  | —                                                                                                                                                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_perf_review_templates_active` [INDEX] · (`is_active`)
- `idx_perf_review_templates_tenant` [INDEX] · (`tenant_id`)
- `idx_performance_review_templates_active` [INDEX] · (`id`)
- `performance_review_templates_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `performance_reviews` via (`template_id`)

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

### `performance_skill_links`

- **Tenant scoped**: yes
- **Row estimate**: 150
- **Domains**: GOKMER
- **Prisma model**: `performance_skill_links`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default             | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                | uuid         | NO   | —                   |       |
| 3   | `performance_review_id`    | uuid         | NO   | —                   |       |
| 4   | `employee_id`              | uuid         | NO   | —                   |       |
| 5   | `competency_name`          | varchar(200) | NO   | —                   |       |
| 6   | `competency_rating`        | numeric(3,2) | YES  | —                   |       |
| 7   | `rating_level`             | varchar(20)  | YES  | —                   |       |
| 8   | `linked_skill_id`          | uuid         | YES  | —                   |       |
| 9   | `linked_gap_analysis_id`   | uuid         | YES  | —                   |       |
| 10  | `recommended_actions`      | jsonb        | YES  | `'[]'::jsonb`       |       |
| 11  | `learning_path_id`         | uuid         | YES  | —                   |       |
| 12  | `mentor_recommendation_id` | uuid         | YES  | —                   |       |
| 13  | `is_addressed`             | bool         | YES  | `false`             |       |
| 14  | `addressed_at`             | timestamptz  | YES  | —                   |       |
| 15  | `created_at`               | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                | ON UPDATE | ON DELETE | Notes |
| ------------------------ | ------------------------- | --------- | --------- | ----- |
| `employee_id`            | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `linked_gap_analysis_id` | `skill_gap_analyses(id)`  | NO ACTION | SET NULL  |       |
| `linked_skill_id`        | `esco_skills(id)`         | NO ACTION | SET NULL  |       |
| `performance_review_id`  | `performance_reviews(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_perf_skill_links_employee` [INDEX] · (`employee_id`)
- `idx_perf_skill_links_rating` [INDEX] · (`rating_level`)
- `idx_perf_skill_links_tenant` [INDEX] · (`tenant_id`)
- `idx_performance_skill_links_linked_gap_analysis_id` [INDEX] · (`linked_gap_analysis_id`)
- `idx_performance_skill_links_linked_skill_id` [INDEX] · (`linked_skill_id`)
- `performance_skill_links_performance_review_id_competency_na_key` [UNIQUE] · (`performance_review_id`, `competency_name`)
- `performance_skill_links_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_skill_links** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `performance_trends`

- **Tenant scoped**: yes
- **Row estimate**: 202
- **Domains**: GOKMER
- **Prisma model**: `performance_trends`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default             | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`            | uuid         | NO   | —                   |       |
| 3   | `employee_id`          | uuid         | NO   | —                   |       |
| 4   | `period_start`         | date         | NO   | —                   |       |
| 5   | `period_end`           | date         | NO   | —                   |       |
| 6   | `overall_rating`       | numeric(3,2) | YES  | —                   |       |
| 7   | `goal_achievement_pct` | numeric(5,2) | YES  | —                   |       |
| 8   | `competency_score`     | numeric(3,2) | YES  | —                   |       |
| 9   | `engagement_score`     | numeric(3,2) | YES  | —                   |       |
| 10  | `performance_tier`     | varchar(20)  | YES  | —                   |       |
| 11  | `trend_direction`      | varchar(20)  | YES  | —                   |       |
| 12  | `summary_text`         | text         | YES  | —                   |       |
| 13  | `summary_embedding`    | vector       | YES  | —                   |       |
| 14  | `created_at`           | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_performance_trends_embedding` [INDEX] · (`summary_embedding`)
- `idx_performance_trends_employee` [INDEX] · (`tenant_id`, `employee_id`, `period_end`)
- `performance_trends_pkey` [PRIMARY] · (`id`)
- `uk_performance_trend` [UNIQUE] · (`tenant_id`, `employee_id`, `period_start`, `period_end`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `recognition`

- **Tenant scoped**: yes
- **Row estimate**: 485
- **Domains**: GOKMER
- **Prisma model**: `recognition`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                   |       |
| 3   | `from_employee_id` | uuid         | YES  | —                   |       |
| 4   | `to_employee_id`   | uuid         | YES  | —                   |       |
| 5   | `message`          | text         | NO   | —                   |       |
| 6   | `category`         | varchar(50)  | YES  | —                   |       |
| 7   | `is_public`        | bool         | YES  | `true`              |       |
| 8   | `created_at`       | timestamp    | YES  | `now()`             |       |
| 9   | `receiver_id`      | uuid         | YES  | —                   |       |
| 10  | `giver_id`         | uuid         | YES  | —                   |       |
| 11  | `badge_type`       | varchar(50)  | YES  | —                   |       |
| 12  | `core_value`       | varchar(100) | YES  | —                   |       |
| 13  | `points_awarded`   | int4(32)     | YES  | `0`                 |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_recognition_tenant_id` [INDEX] · (`tenant_id`)
- `idx_recognition_to` [INDEX] · (`to_employee_id`)
- `recognition_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `review_cycle_notifications`

- **Tenant scoped**: yes
- **Row estimate**: 25
- **Domains**: GOKMER
- **Prisma model**: `review_cycle_notifications`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                        | Notes |
| --- | ------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                              |       |
| 3   | `review_cycle_id`   | uuid         | NO   | —                              |       |
| 4   | `notification_type` | varchar(50)  | NO   | —                              |       |
| 5   | `recipient_type`    | varchar(20)  | NO   | —                              |       |
| 6   | `recipient_id`      | uuid         | YES  | —                              |       |
| 7   | `subject`           | varchar(255) | YES  | —                              |       |
| 8   | `body`              | text         | YES  | —                              |       |
| 9   | `scheduled_at`      | timestamptz  | YES  | —                              |       |
| 10  | `sent_at`           | timestamptz  | YES  | —                              |       |
| 11  | `status`            | varchar(20)  | YES  | `'pending'::character varying` |       |
| 12  | `error_message`     | text         | YES  | —                              |       |
| 13  | `created_at`        | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References           | ON UPDATE | ON DELETE | Notes |
| ----------------- | -------------------- | --------- | --------- | ----- |
| `recipient_id`    | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `review_cycle_id` | `review_cycles(id)`  | NO ACTION | CASCADE   |       |
| `tenant_id`       | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_review_cycle_notifications_recipient_id` [INDEX] · (`recipient_id`)
- `idx_review_cycle_notifications_tenant_id` [INDEX] · (`tenant_id`)
- `idx_review_notifications_cycle` [INDEX] · (`review_cycle_id`)
- `idx_review_notifications_scheduled` [INDEX] · (`scheduled_at`)
- `idx_review_notifications_status` [INDEX] · (`status`)
- `review_cycle_notifications_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `review_cycle_participants`

- **Tenant scoped**: yes
- **Row estimate**: 250
- **Domains**: GOKMER
- **Prisma model**: `review_cycle_participants`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                        | Type        | Null | Default                        | Notes |
| --- | ----------------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                          | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`                   | uuid        | NO   | —                              |       |
| 3   | `review_cycle_id`             | uuid        | NO   | —                              |       |
| 4   | `employee_id`                 | uuid        | NO   | —                              |       |
| 5   | `manager_id`                  | uuid        | YES  | —                              |       |
| 6   | `status`                      | varchar(30) | YES  | `'pending'::character varying` |       |
| 7   | `self_review_completed`       | bool        | YES  | `false`                        |       |
| 8   | `self_review_completed_at`    | timestamptz | YES  | —                              |       |
| 9   | `manager_review_completed`    | bool        | YES  | `false`                        |       |
| 10  | `manager_review_completed_at` | timestamptz | YES  | —                              |       |
| 11  | `calibrated`                  | bool        | YES  | `false`                        |       |
| 12  | `calibrated_at`               | timestamptz | YES  | —                              |       |
| 13  | `acknowledged`                | bool        | YES  | `false`                        |       |
| 14  | `acknowledged_at`             | timestamptz | YES  | —                              |       |
| 15  | `excluded_reason`             | text        | YES  | —                              |       |
| 16  | `created_at`                  | timestamptz | YES  | `now()`                        |       |
| 17  | `updated_at`                  | timestamptz | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References           | ON UPDATE | ON DELETE | Notes |
| ----------------- | -------------------- | --------- | --------- | ----- |
| `employee_id`     | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `manager_id`      | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `review_cycle_id` | `review_cycles(id)`  | NO ACTION | CASCADE   |       |
| `tenant_id`       | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_review_cycle_participants_cycle` [INDEX] · (`review_cycle_id`)
- `idx_review_cycle_participants_employee` [INDEX] · (`employee_id`)
- `idx_review_cycle_participants_manager` [INDEX] · (`manager_id`)
- `idx_review_cycle_participants_status` [INDEX] · (`status`)
- `idx_review_cycle_participants_tenant` [INDEX] · (`tenant_id`)
- `review_cycle_participants_pkey` [PRIMARY] · (`id`)
- `unique_cycle_employee` [UNIQUE] · (`review_cycle_id`, `employee_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `review_cycle_phases`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: GOKMER
- **Prisma model**: `review_cycle_phases`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type        | Null | Default                        | Notes |
| --- | ----------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                    | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`             | uuid        | NO   | —                              |       |
| 3   | `review_cycle_id`       | uuid        | NO   | —                              |       |
| 4   | `phase_name`            | varchar(50) | NO   | —                              |       |
| 5   | `phase_order`           | int4(32)    | NO   | —                              |       |
| 6   | `start_date`            | date        | NO   | —                              |       |
| 7   | `end_date`              | date        | NO   | —                              |       |
| 8   | `status`                | varchar(20) | YES  | `'pending'::character varying` |       |
| 9   | `instructions`          | text        | YES  | —                              |       |
| 10  | `reminder_days_before`  | int4(32)    | YES  | `3`                            |       |
| 11  | `escalation_days_after` | int4(32)    | YES  | `2`                            |       |
| 12  | `is_required`           | bool        | YES  | `true`                         |       |
| 13  | `created_at`            | timestamptz | YES  | `now()`                        |       |
| 14  | `updated_at`            | timestamptz | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References          | ON UPDATE | ON DELETE | Notes |
| ----------------- | ------------------- | --------- | --------- | ----- |
| `review_cycle_id` | `review_cycles(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`       | `tenants(id)`       | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_review_cycle_phases_cycle` [INDEX] · (`review_cycle_id`)
- `idx_review_cycle_phases_tenant` [INDEX] · (`tenant_id`)
- `review_cycle_phases_pkey` [PRIMARY] · (`id`)
- `review_cycle_phases_review_cycle_id_phase_name_key` [UNIQUE] · (`review_cycle_id`, `phase_name`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `review_cycles`

- **Tenant scoped**: yes
- **Row estimate**: 35
- **Domains**: GOKMER
- **Prisma model**: `review_cycles`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                       | Type         | Null | Default                                                                                                                                             | Notes                                               |
| --- | ---------------------------- | ------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | `id`                         | uuid         | NO   | `gen_random_uuid()`                                                                                                                                 | PK                                                  |
| 2   | `tenant_id`                  | uuid         | NO   | —                                                                                                                                                   |                                                     |
| 3   | `name`                       | varchar(255) | NO   | —                                                                                                                                                   |                                                     |
| 4   | `description`                | text         | YES  | —                                                                                                                                                   |                                                     |
| 5   | `cycle_type`                 | varchar(50)  | YES  | `'annual'::character varying`                                                                                                                       |                                                     |
| 6   | `start_date`                 | date         | NO   | —                                                                                                                                                   |                                                     |
| 7   | `end_date`                   | date         | NO   | —                                                                                                                                                   |                                                     |
| 8   | `status`                     | varchar(50)  | YES  | `'draft'::character varying`                                                                                                                        |                                                     |
| 9   | `created_at`                 | timestamptz  | YES  | `CURRENT_TIMESTAMP`                                                                                                                                 |                                                     |
| 10  | `updated_at`                 | timestamptz  | YES  | `CURRENT_TIMESTAMP`                                                                                                                                 |                                                     |
| 11  | `self_review_deadline`       | date         | YES  | —                                                                                                                                                   |                                                     |
| 12  | `manager_review_deadline`    | date         | YES  | —                                                                                                                                                   |                                                     |
| 13  | `calibration_deadline`       | date         | YES  | —                                                                                                                                                   |                                                     |
| 14  | `feedback_deadline`          | date         | YES  | —                                                                                                                                                   |                                                     |
| 15  | `acknowledgment_deadline`    | date         | YES  | —                                                                                                                                                   |                                                     |
| 16  | `include_self_review`        | bool         | YES  | `true`                                                                                                                                              |                                                     |
| 17  | `include_peer_review`        | bool         | YES  | `false`                                                                                                                                             |                                                     |
| 18  | `include_upward_review`      | bool         | YES  | `false`                                                                                                                                             |                                                     |
| 19  | `include_360_feedback`       | bool         | YES  | `false`                                                                                                                                             |                                                     |
| 20  | `require_goal_assessment`    | bool         | YES  | `true`                                                                                                                                              |                                                     |
| 21  | `require_competency_rating`  | bool         | YES  | `true`                                                                                                                                              |                                                     |
| 22  | `review_template_id`         | uuid         | YES  | —                                                                                                                                                   |                                                     |
| 23  | `competency_framework_id`    | uuid         | YES  | —                                                                                                                                                   |                                                     |
| 24  | `rating_scale_id`            | uuid         | YES  | —                                                                                                                                                   |                                                     |
| 25  | `eligible_employees_filter`  | jsonb        | YES  | `'{}'::jsonb`                                                                                                                                       |                                                     |
| 26  | `finalization_deadline`      | date         | YES  | —                                                                                                                                                   |                                                     |
| 27  | `rating_scale_type`          | varchar(20)  | YES  | `'1-5'::character varying`                                                                                                                          | Rating scale: 1-5, 1-10, or descriptive             |
| 28  | `rating_scale_config`        | jsonb        | YES  | `'{"max": 5, "min": 1, "labels": ["Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "Outstanding"]}'::jsonb` | JSON config with min, max, and labels               |
| 29  | `launched_at`                | timestamptz  | YES  | —                                                                                                                                                   |                                                     |
| 30  | `completed_at`               | timestamptz  | YES  | —                                                                                                                                                   |                                                     |
| 31  | `template_id`                | uuid         | YES  | —                                                                                                                                                   |                                                     |
| 32  | `feedback_360_anonymous`     | bool         | YES  | `true`                                                                                                                                              | Whether 360 feedback is anonymous for this cycle    |
| 33  | `feedback_360_min_responses` | int4(32)     | YES  | `3`                                                                                                                                                 | Minimum responses before showing aggregated results |
| 34  | `feedback_360_deadline`      | date         | YES  | —                                                                                                                                                   |                                                     |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_review_cycles_dates` [INDEX] · (`start_date`, `end_date`)
- `idx_review_cycles_status` [INDEX] · (`tenant_id`, `status`)
- `idx_review_cycles_tenant` [INDEX] · (`tenant_id`)
- `review_cycles_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `feedback_360_peer_suggestions` via (`review_cycle_id`)
- `feedback_requests` via (`review_cycle_id`)
- `performance_reviews` via (`review_cycle_id`)
- `review_cycle_notifications` via (`review_cycle_id`)
- `review_cycle_participants` via (`review_cycle_id`)
- `review_cycle_phases` via (`review_cycle_id`)

---

### `roadmap_phases`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: GOKMER
- **Prisma model**: `roadmap_phases`

#### Columns

| #   | Column          | Type         | Null | Default                        | Notes |
| --- | --------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `name`          | varchar(100) | NO   | —                              |       |
| 3   | `description`   | text         | YES  | —                              |       |
| 4   | `status`        | varchar(20)  | YES  | `'planned'::character varying` |       |
| 5   | `start_date`    | date         | YES  | —                              |       |
| 6   | `end_date`      | date         | YES  | —                              |       |
| 7   | `display_order` | int4(32)     | YES  | `0`                            |       |
| 8   | `created_at`    | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Indexes

- `roadmap_phases_pkey` [PRIMARY] · (`id`)

---

### `self_assessment_evidence`

- **Tenant scoped**: yes
- **Row estimate**: 237
- **Domains**: GOKMER
- **Prisma model**: `self_assessment_evidence`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default             | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`             | uuid         | NO   | —                   |       |
| 3   | `performance_review_id` | uuid         | NO   | —                   |       |
| 4   | `employee_id`           | uuid         | NO   | —                   |       |
| 5   | `evidence_type`         | varchar(50)  | NO   | —                   |       |
| 6   | `title`                 | varchar(255) | NO   | —                   |       |
| 7   | `description`           | text         | YES  | —                   |       |
| 8   | `file_url`              | varchar(500) | YES  | —                   |       |
| 9   | `external_link`         | varchar(500) | YES  | —                   |       |
| 10  | `related_goal_id`       | uuid         | YES  | —                   |       |
| 11  | `related_competency`    | varchar(100) | YES  | —                   |       |
| 12  | `date_achieved`         | date         | YES  | —                   |       |
| 13  | `verified`              | bool         | YES  | `false`             |       |
| 14  | `verified_by`           | uuid         | YES  | —                   |       |
| 15  | `verified_at`           | timestamptz  | YES  | —                   |       |
| 16  | `created_at`            | timestamptz  | YES  | `now()`             |       |
| 17  | `updated_at`            | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                | ON UPDATE | ON DELETE | Notes |
| ----------------------- | ------------------------- | --------- | --------- | ----- |
| `employee_id`           | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `performance_review_id` | `performance_reviews(id)` | NO ACTION | CASCADE   |       |
| `related_goal_id`       | `goals(id)`               | NO ACTION | SET NULL  |       |
| `tenant_id`             | `tenants(id)`             | NO ACTION | CASCADE   |       |
| `verified_by`           | `employees_core(id)`      | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_self_assessment_evidence_employee` [INDEX] · (`employee_id`)
- `idx_self_assessment_evidence_goal` [INDEX] · (`related_goal_id`)
- `idx_self_assessment_evidence_review` [INDEX] · (`performance_review_id`)
- `idx_self_assessment_evidence_tenant` [INDEX] · (`tenant_id`)
- `idx_self_assessment_evidence_verified_by` [INDEX] · (`verified_by`)
- `self_assessment_evidence_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `self_reviews`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: GOKMER
- **Prisma model**: `self_reviews`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                      | Notes                                                                           |
| --- | ------------------------- | ------------ | ---- | ---------------------------- | ------------------------------------------------------------------------------- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`          | PK                                                                              |
| 2   | `tenant_id`               | uuid         | NO   | —                            |                                                                                 |
| 3   | `performance_review_id`   | uuid         | NO   | —                            |                                                                                 |
| 4   | `employee_id`             | uuid         | NO   | —                            |                                                                                 |
| 5   | `self_overall_rating`     | numeric(3,1) | YES  | —                            |                                                                                 |
| 6   | `self_goal_rating`        | numeric(3,1) | YES  | —                            |                                                                                 |
| 7   | `self_competency_rating`  | numeric(3,1) | YES  | —                            |                                                                                 |
| 8   | `achievements`            | text         | YES  | —                            |                                                                                 |
| 9   | `challenges`              | text         | YES  | —                            |                                                                                 |
| 10  | `learnings`               | text         | YES  | —                            |                                                                                 |
| 11  | `goals_for_next_period`   | text         | YES  | —                            |                                                                                 |
| 12  | `feedback_for_manager`    | text         | YES  | —                            |                                                                                 |
| 13  | `competency_self_ratings` | jsonb        | YES  | `'[]'::jsonb`                | JSONB BY DESIGN: self-assessment scores, mirrors performance_reviews structure. |
| 14  | `goal_self_assessments`   | jsonb        | YES  | `'[]'::jsonb`                | JSONB BY DESIGN: detailed self-assessment text per goal.                        |
| 15  | `status`                  | varchar(20)  | YES  | `'draft'::character varying` |                                                                                 |
| 16  | `submitted_at`            | timestamptz  | YES  | —                            |                                                                                 |
| 17  | `created_at`              | timestamptz  | YES  | `now()`                      |                                                                                 |
| 18  | `updated_at`              | timestamptz  | YES  | `now()`                      |                                                                                 |
| 19  | `goal_ratings`            | jsonb        | YES  | —                            | JSONB BY DESIGN: self goal ratings.                                             |
| 20  | `ksaba_ratings`           | jsonb        | YES  | —                            | JSONB BY DESIGN: KSABA framework self-ratings.                                  |
| 21  | `evidence_count`          | int4(32)     | YES  | `0`                          |                                                                                 |
| 22  | `last_saved_at`           | timestamptz  | YES  | —                            |                                                                                 |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References                | ON UPDATE | ON DELETE | Notes |
| ----------------------- | ------------------------- | --------- | --------- | ----- |
| `employee_id`           | `employees_core(id)`      | NO ACTION | CASCADE   |       |
| `performance_review_id` | `performance_reviews(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`             | `tenants(id)`             | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_self_reviews_employee` [INDEX] · (`employee_id`)
- `idx_self_reviews_tenant_id` [INDEX] · (`tenant_id`)
- `self_reviews_pkey` [PRIMARY] · (`id`)
- `unique_self_review` [UNIQUE] · (`performance_review_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---
