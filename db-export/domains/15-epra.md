# Dominio EPRA — Embedding-Prediction-Recommendation-Action

> AI/Predictive stack

**Tabelle in questo dominio**: 19

## Tabelle

| Tabella                                                 | Rows | Tenant | RLS | FK out | Cols |
| ------------------------------------------------------- | ---- | ------ | --- | ------ | ---- |
| [`ai_analytics_daily`](#aianalyticsdaily)               | 772  | ✓      | ✓   | 1      | 22   |
| [`ai_escalation_queue`](#aiescalationqueue)             | 0    | ✓      | ✓   | 6      | 21   |
| [`ai_prompt_templates`](#aiprompttemplates)             | 12   | ✓      | ✓   | 1      | 15   |
| [`ai_provider_config`](#aiproviderconfig)               | 2    | —      | —   | 0      | 11   |
| [`ai_provider_metrics`](#aiprovidermetrics)             | 1    | —      | —   | 0      | 10   |
| [`ai_query_audit`](#aiqueryaudit)                       | 410  | ✓      | ✓   | 4      | 22   |
| [`ai_tenant_config`](#aitenantconfig)                   | 4    | ✓      | ✓   | 1      | 19   |
| [`ai_usage_log`](#aiusagelog)                           | 1    | ✓      | ✓   | 2      | 15   |
| [`analysis_sessions`](#analysissessions)                | 2    | ✓      | ✓   | 2      | 14   |
| [`analytics_aggregations`](#analyticsaggregations)      | 64   | ✓      | ✓   | 1      | 16   |
| [`analytics_events`](#analyticsevents)                  | 5000 | ✓      | ✓   | 3      | 14   |
| [`embedding_queue`](#embeddingqueue)                    | 1620 | ✓      | ✓   | 1      | 12   |
| [`model_predictions`](#modelpredictions)                | 267  | ✓      | ✓   | 2      | 12   |
| [`performance_predictions`](#performancepredictions)    | 267  | ✓      | ✓   | 2      | 26   |
| [`prediction_actions`](#predictionactions)              | 15   | ✓      | ✓   | 1      | 11   |
| [`prediction_factors`](#predictionfactors)              | 13   | ✓      | ✓   | 1      | 12   |
| [`prediction_model_accuracy`](#predictionmodelaccuracy) | 0    | ✓      | ✓   | 1      | 16   |
| [`predictive_models`](#predictivemodels)                | 16   | ✓      | ✓   | 1      | 19   |
| [`turnover_risk_scores`](#turnoverriskscores)           | 267  | ✓      | ✓   | 2      | 12   |

---

### `ai_analytics_daily`

- **Tenant scoped**: yes
- **Row estimate**: 772
- **Domains**: EPRA
- **Prisma model**: `ai_analytics_daily`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                      | Type         | Null | Default             | Notes |
| --- | --------------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                        | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`                 | uuid         | NO   | —                   |       |
| 3   | `date`                      | date         | NO   | —                   |       |
| 4   | `total_queries`             | int4(32)     | YES  | `0`                 |       |
| 5   | `unique_users`              | int4(32)     | YES  | `0`                 |       |
| 6   | `total_sessions`            | int4(32)     | YES  | `0`                 |       |
| 7   | `chat_queries`              | int4(32)     | YES  | `0`                 |       |
| 8   | `search_queries`            | int4(32)     | YES  | `0`                 |       |
| 9   | `sql_queries`               | int4(32)     | YES  | `0`                 |       |
| 10  | `document_qa_queries`       | int4(32)     | YES  | `0`                 |       |
| 11  | `avg_response_time_ms`      | int4(32)     | YES  | —                   |       |
| 12  | `p95_response_time_ms`      | int4(32)     | YES  | —                   |       |
| 13  | `error_count`               | int4(32)     | YES  | `0`                 |       |
| 14  | `total_tokens_input`        | int4(32)     | YES  | `0`                 |       |
| 15  | `total_tokens_output`       | int4(32)     | YES  | `0`                 |       |
| 16  | `avg_confidence_score`      | numeric(5,4) | YES  | —                   |       |
| 17  | `escalation_count`          | int4(32)     | YES  | `0`                 |       |
| 18  | `escalation_resolved_count` | int4(32)     | YES  | `0`                 |       |
| 19  | `feedback_count`            | int4(32)     | YES  | `0`                 |       |
| 20  | `avg_feedback_rating`       | numeric(3,2) | YES  | —                   |       |
| 21  | `top_query_categories`      | jsonb        | YES  | —                   |       |
| 22  | `created_at`                | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `ai_analytics_daily_pkey` [PRIMARY] · (`id`)
- `idx_ai_analytics_unique` [UNIQUE] · (`tenant_id`, `date`)

#### RLS Policies

- **tenant_isolation_ai_analytics** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `ai_escalation_queue`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: EPRA
- **Prisma model**: `ai_escalation_queue`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                        | Notes |
| --- | ------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                              |       |
| 3   | `message_id`        | uuid         | NO   | —                              |       |
| 4   | `session_id`        | uuid         | NO   | —                              |       |
| 5   | `employee_id`       | uuid         | YES  | —                              |       |
| 6   | `original_query`    | text         | NO   | —                              |       |
| 7   | `ai_response`       | text         | YES  | —                              |       |
| 8   | `confidence_score`  | numeric(5,4) | YES  | —                              |       |
| 9   | `escalation_reason` | varchar(255) | NO   | —                              |       |
| 10  | `category`          | varchar(50)  | YES  | —                              |       |
| 11  | `priority`          | varchar(20)  | YES  | `'normal'::character varying`  |       |
| 12  | `assigned_to`       | uuid         | YES  | —                              |       |
| 13  | `assigned_at`       | timestamp    | YES  | —                              |       |
| 14  | `status`            | varchar(20)  | YES  | `'pending'::character varying` |       |
| 15  | `human_response`    | text         | YES  | —                              |       |
| 16  | `resolved_at`       | timestamp    | YES  | —                              |       |
| 17  | `resolved_by`       | uuid         | YES  | —                              |       |
| 18  | `resolution_notes`  | text         | YES  | —                              |       |
| 19  | `should_train`      | bool         | YES  | `false`                        |       |
| 20  | `created_at`        | timestamp    | YES  | `now()`                        |       |
| 21  | `updated_at`        | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `assigned_to` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `message_id`  | `rag_messages(id)`   | NO ACTION | CASCADE   |       |
| `resolved_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `session_id`  | `rag_sessions(id)`   | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `ai_escalation_queue_pkey` [PRIMARY] · (`id`)
- `idx_ai_escalation_employee` [INDEX] · (`employee_id`)
- `idx_ai_escalation_message` [INDEX] · (`message_id`)
- `idx_ai_escalation_queue_resolved_by` [INDEX] · (`resolved_by`)
- `idx_ai_escalation_session` [INDEX] · (`session_id`)
- `idx_escalation_assigned` [INDEX] · (`assigned_to`)
- `idx_escalation_priority` [INDEX] · (`priority`, `created_at`)
- `idx_escalation_status` [INDEX] · (`status`)
- `idx_escalation_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_escalation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `ai_prompt_templates`

- **Tenant scoped**: yes
- **Row estimate**: 12
- **Domains**: EPRA
- **Prisma model**: `ai_prompt_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                       | Notes |
| --- | ---------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`            | uuid         | YES  | —                             |       |
| 3   | `code`                 | varchar(50)  | NO   | —                             |       |
| 4   | `language`             | varchar(5)   | NO   | `'it'::character varying`     |       |
| 5   | `name`                 | varchar(255) | NO   | —                             |       |
| 6   | `description`          | text         | YES  | —                             |       |
| 7   | `prompt_template`      | text         | NO   | —                             |       |
| 8   | `context_requirements` | jsonb        | YES  | —                             |       |
| 9   | `llm_provider`         | varchar(50)  | YES  | `'openai'::character varying` |       |
| 10  | `model_name`           | varchar(50)  | YES  | `'gpt-4o'::character varying` |       |
| 11  | `temperature`          | numeric(3,2) | YES  | `0.3`                         |       |
| 12  | `max_tokens`           | int4(32)     | YES  | `2000`                        |       |
| 13  | `is_active`            | bool         | NO   | `true`                        |       |
| 14  | `created_at`           | timestamptz  | NO   | `now()`                       |       |
| 15  | `updated_at`           | timestamptz  | NO   | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `ai_prompt_templates_pkey` [PRIMARY] · (`id`)
- `idx_ai_prompt_templates_tenant_id` [INDEX] · (`tenant_id`)
- `idx_ai_prompts_active` [INDEX] · (`is_active`, `code`)
- `uq_ai_prompt_code_lang` [UNIQUE] · (`code`, `language`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `ai_provider_config`

- **Tenant scoped**: no
- **Row estimate**: 2
- **Domains**: EPRA
- **Prisma model**: `ai_provider_config`

#### Columns

| #   | Column                  | Type          | Null | Default             | Notes |
| --- | ----------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                    | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `provider`              | varchar(50)   | NO   | —                   |       |
| 3   | `model`                 | varchar(100)  | NO   | —                   |       |
| 4   | `is_enabled`            | bool          | NO   | `true`              |       |
| 5   | `priority`              | int4(32)      | NO   | `10`                |       |
| 6   | `rate_limit_per_minute` | int4(32)      | NO   | `1000`              |       |
| 7   | `cost_per_1k_tokens`    | numeric(10,6) | NO   | `0.0001`            |       |
| 8   | `max_batch_size`        | int4(32)      | NO   | `100`               |       |
| 9   | `api_key_env_var`       | varchar(100)  | YES  | —                   |       |
| 10  | `created_at`            | timestamptz   | YES  | `now()`             |       |
| 11  | `updated_at`            | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `ai_provider_config_pkey` [PRIMARY] · (`id`)
- `ai_provider_config_provider_key` [UNIQUE] · (`provider`)

---

### `ai_provider_metrics`

- **Tenant scoped**: no
- **Row estimate**: 1
- **Domains**: EPRA
- **Prisma model**: `ai_provider_metrics`

#### Columns

| #   | Column           | Type          | Null | Default                          | Notes |
| --- | ---------------- | ------------- | ---- | -------------------------------- | ----- |
| 1   | `id`             | uuid          | NO   | `gen_random_uuid()`              | PK    |
| 2   | `provider`       | varchar(50)   | NO   | —                                |       |
| 3   | `request_count`  | int4(32)      | NO   | `0`                              |       |
| 4   | `token_count`    | int8(64)      | NO   | `0`                              |       |
| 5   | `total_cost`     | numeric(10,6) | NO   | `0`                              |       |
| 6   | `avg_latency_ms` | numeric(10,2) | NO   | `0`                              |       |
| 7   | `error_count`    | int4(32)      | NO   | `0`                              |       |
| 8   | `status`         | varchar(50)   | NO   | `'available'::character varying` |       |
| 9   | `recorded_at`    | timestamptz   | NO   | `now()`                          |       |
| 10  | `created_at`     | timestamptz   | YES  | `now()`                          |       |

#### Primary Key

`(`id`)`

#### Indexes

- `ai_provider_metrics_pkey` [PRIMARY] · (`id`)
- `idx_ai_metrics_provider_date` [INDEX] · (`provider`, `recorded_at`)

---

### `ai_query_audit`

- **Tenant scoped**: yes
- **Row estimate**: 410
- **Domains**: EPRA
- **Prisma model**: `ai_query_audit`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                   |       |
| 3   | `session_id`       | uuid         | YES  | —                   |       |
| 4   | `message_id`       | uuid         | YES  | —                   |       |
| 5   | `employee_id`      | uuid         | YES  | —                   |       |
| 6   | `query_text`       | text         | NO   | —                   |       |
| 7   | `query_type`       | varchar(50)  | YES  | —                   |       |
| 8   | `response_text`    | text         | YES  | —                   |       |
| 9   | `response_time_ms` | int4(32)     | YES  | —                   |       |
| 10  | `tokens_input`     | int4(32)     | YES  | —                   |       |
| 11  | `tokens_output`    | int4(32)     | YES  | —                   |       |
| 12  | `provider`         | varchar(50)  | YES  | —                   |       |
| 13  | `model`            | varchar(100) | YES  | —                   |       |
| 14  | `sources_used`     | jsonb        | YES  | —                   |       |
| 15  | `chunks_retrieved` | int4(32)     | YES  | —                   |       |
| 16  | `retrieval_score`  | numeric(5,4) | YES  | —                   |       |
| 17  | `confidence_score` | numeric(5,4) | YES  | —                   |       |
| 18  | `was_escalated`    | bool         | YES  | `false`             |       |
| 19  | `had_error`        | bool         | YES  | `false`             |       |
| 20  | `error_type`       | varchar(100) | YES  | —                   |       |
| 21  | `error_message`    | text         | YES  | —                   |       |
| 22  | `created_at`       | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `message_id`  | `rag_messages(id)`   | NO ACTION | SET NULL  |       |
| `session_id`  | `rag_sessions(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `ai_query_audit_pkey` [PRIMARY] · (`id`)
- `idx_ai_audit_date` [INDEX] · (`created_at`)
- `idx_ai_audit_employee` [INDEX] · (`employee_id`)
- `idx_ai_audit_provider` [INDEX] · (`provider`)
- `idx_ai_audit_tenant` [INDEX] · (`tenant_id`)
- `idx_ai_audit_type` [INDEX] · (`query_type`)
- `idx_ai_query_audit_message_id` [INDEX] · (`message_id`)
- `idx_ai_query_audit_session_id` [INDEX] · (`session_id`)

#### RLS Policies

- **tenant_isolation_ai_audit** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `ai_tenant_config`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: EPRA
- **Prisma model**: `ai_tenant_config`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                            | Type         | Null | Default                                       | Notes |
| --- | --------------------------------- | ------------ | ---- | --------------------------------------------- | ----- |
| 1   | `id`                              | uuid         | NO   | `gen_random_uuid()`                           | PK    |
| 2   | `tenant_id`                       | uuid         | NO   | —                                             |       |
| 3   | `default_provider`                | varchar(50)  | YES  | `'openai'::character varying`                 |       |
| 4   | `default_chat_model`              | varchar(100) | YES  | `'gpt-4o-mini'::character varying`            |       |
| 5   | `default_embedding_model`         | varchar(100) | YES  | `'text-embedding-3-small'::character varying` |       |
| 6   | `enable_sql_generation`           | bool         | YES  | `false`                                       |       |
| 7   | `enable_document_qa`              | bool         | YES  | `true`                                        |       |
| 8   | `enable_escalation`               | bool         | YES  | `true`                                        |       |
| 9   | `confidence_threshold_low`        | numeric(5,4) | YES  | `0.5000`                                      |       |
| 10  | `confidence_threshold_escalation` | numeric(5,4) | YES  | `0.3000`                                      |       |
| 11  | `max_queries_per_user_day`        | int4(32)     | YES  | `100`                                         |       |
| 12  | `max_tokens_per_user_day`         | int4(32)     | YES  | `50000`                                       |       |
| 13  | `system_prompt_base`              | text         | YES  | —                                             |       |
| 14  | `system_prompt_hr_context`        | text         | YES  | —                                             |       |
| 15  | `escalation_email`                | varchar(255) | YES  | —                                             |       |
| 16  | `escalation_notify_slack`         | bool         | YES  | `false`                                       |       |
| 17  | `escalation_slack_webhook`        | text         | YES  | —                                             |       |
| 18  | `created_at`                      | timestamp    | YES  | `now()`                                       |       |
| 19  | `updated_at`                      | timestamp    | YES  | `now()`                                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `ai_tenant_config_pkey` [PRIMARY] · (`id`)
- `ai_tenant_config_tenant_id_key` [UNIQUE] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `ai_usage_log`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: EPRA
- **Prisma model**: `ai_usage_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type          | Null | Default             | Notes |
| --- | ------------------ | ------------- | ---- | ------------------- | ----- |
| 1   | `id`               | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `provider`         | varchar(50)   | NO   | —                   |       |
| 3   | `model`            | varchar(100)  | NO   | —                   |       |
| 4   | `operation`        | varchar(50)   | NO   | —                   |       |
| 5   | `input_tokens`     | int4(32)      | YES  | —                   |       |
| 6   | `output_tokens`    | int4(32)      | YES  | —                   |       |
| 7   | `total_tokens`     | int4(32)      | NO   | —                   |       |
| 8   | `cost`             | numeric(10,8) | NO   | —                   |       |
| 9   | `latency_ms`       | int4(32)      | NO   | —                   |       |
| 10  | `success`          | bool          | NO   | —                   |       |
| 11  | `error_message`    | text          | YES  | —                   |       |
| 12  | `tenant_id`        | uuid          | NO   | —                   |       |
| 13  | `user_id`          | uuid          | YES  | —                   |       |
| 14  | `request_metadata` | jsonb         | YES  | —                   |       |
| 15  | `created_at`       | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |
| `user_id`   | `users(id)`   | NO ACTION | SET NULL  |       |

#### Indexes

- `ai_usage_log_pkey` [PRIMARY] · (`id`)
- `idx_ai_usage_created` [INDEX] · (`created_at`)
- `idx_ai_usage_log_user_id` [INDEX] · (`user_id`)
- `idx_ai_usage_operation` [INDEX] · (`operation`)
- `idx_ai_usage_provider` [INDEX] · (`provider`)
- `idx_ai_usage_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `analysis_sessions`

- **Tenant scoped**: yes
- **Row estimate**: 2
- **Domains**: EPRA
- **Prisma model**: `analysis_sessions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default                            | Notes |
| --- | -------------------- | ------------ | ---- | ---------------------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `uuid_generate_v4()`               | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                                  |       |
| 3   | `name`               | varchar(255) | NO   | —                                  |       |
| 4   | `description`        | text         | YES  | —                                  |       |
| 5   | `session_type`       | varchar(50)  | NO   | `'performance'::character varying` |       |
| 6   | `status`             | varchar(50)  | NO   | `'draft'::character varying`       |       |
| 7   | `parameters`         | jsonb        | YES  | `'{}'::jsonb`                      |       |
| 8   | `results`            | jsonb        | YES  | `'{}'::jsonb`                      |       |
| 9   | `findings_count`     | int4(32)     | YES  | `0`                                |       |
| 10  | `participants_count` | int4(32)     | YES  | `0`                                |       |
| 11  | `created_by`         | uuid         | YES  | —                                  |       |
| 12  | `created_at`         | timestamp    | YES  | `now()`                            |       |
| 13  | `updated_at`         | timestamp    | YES  | `now()`                            |       |
| 14  | `deleted_at`         | timestamp    | YES  | —                                  |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `created_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `analysis_sessions_pkey` [PRIMARY] · (`id`)
- `idx_analysis_sessions_created_by` [INDEX] · (`created_by`)
- `idx_analysis_sessions_deleted` [INDEX] · (`deleted_at`)
- `idx_analysis_sessions_status` [INDEX] · (`tenant_id`, `status`)
- `idx_analysis_sessions_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **analysis_sessions_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `analytics_aggregations`

- **Tenant scoped**: yes
- **Row estimate**: 64
- **Domains**: EPRA
- **Prisma model**: `analytics_aggregations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type          | Null | Default             | Notes |
| --- | ----------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`              | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`       | uuid          | NO   | —                   |       |
| 3   | `metric_name`     | varchar(100)  | NO   | —                   |       |
| 4   | `dimension`       | varchar(100)  | YES  | —                   |       |
| 5   | `dimension_value` | varchar(255)  | YES  | —                   |       |
| 6   | `period_type`     | varchar(20)   | NO   | —                   |       |
| 7   | `period_start`    | timestamptz   | NO   | —                   |       |
| 8   | `period_end`      | timestamptz   | NO   | —                   |       |
| 9   | `value_sum`       | numeric(20,4) | YES  | —                   |       |
| 10  | `value_count`     | int4(32)      | YES  | —                   |       |
| 11  | `value_avg`       | numeric(20,4) | YES  | —                   |       |
| 12  | `value_min`       | numeric(20,4) | YES  | —                   |       |
| 13  | `value_max`       | numeric(20,4) | YES  | —                   |       |
| 14  | `metadata`        | jsonb         | YES  | `'{}'::jsonb`       |       |
| 15  | `computed_at`     | timestamptz   | YES  | `now()`             |       |
| 16  | `created_at`      | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `analytics_aggregations_pkey` [PRIMARY] · (`id`)
- `idx_aggregations_unique` [UNIQUE] · (`tenant_id`, `metric_name`, `dimension`, `dimension_value`, `period_type`, `period_start`)

#### RLS Policies

- **tenant_isolation_aggregations** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `analytics_events`

- **Tenant scoped**: yes
- **Row estimate**: 5000
- **Domains**: EPRA
- **Prisma model**: `analytics_events`
- **RLS**: enabled (forced)

#### Columns

| #   | Column        | Type         | Null | Default             | Notes |
| --- | ------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`          | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`   | uuid         | NO   | —                   |       |
| 3   | `event_type`  | varchar(100) | NO   | —                   |       |
| 4   | `entity_type` | varchar(50)  | YES  | —                   |       |
| 5   | `entity_id`   | uuid         | YES  | —                   |       |
| 6   | `actor_id`    | uuid         | YES  | —                   |       |
| 7   | `event_data`  | jsonb        | YES  | `'{}'::jsonb`       |       |
| 8   | `occurred_at` | timestamptz  | YES  | `now()`             |       |
| 9   | `created_at`  | timestamptz  | YES  | `now()`             |       |
| 10  | `category`    | varchar(100) | YES  | —                   |       |
| 11  | `user_id`     | uuid         | YES  | —                   |       |
| 12  | `session_id`  | uuid         | YES  | —                   |       |
| 13  | `data`        | jsonb        | YES  | —                   |       |
| 14  | `metrics`     | jsonb        | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `actor_id`  | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `user_id`   | `users(id)`          | NO ACTION | SET NULL  |       |

#### Indexes

- `analytics_events_pkey` [PRIMARY] · (`id`)
- `idx_analytics_events_actor_id` [INDEX] · (`actor_id`)
- `idx_analytics_events_entity` [INDEX] · (`entity_type`, `entity_id`)
- `idx_analytics_events_occurred` [INDEX] · (`occurred_at`)
- `idx_analytics_events_tenant` [INDEX] · (`tenant_id`)
- `idx_analytics_events_type` [INDEX] · (`event_type`)
- `idx_analytics_events_user_id` [INDEX] · (`user_id`)

#### RLS Policies

- **tenant_isolation_analytics_events** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `embedding_queue`

- **Tenant scoped**: yes
- **Row estimate**: 1620
- **Domains**: EPRA
- **Prisma model**: `embedding_queue`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default                        | Notes |
| --- | --------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `entity_type`   | varchar(50) | NO   | —                              |       |
| 3   | `entity_id`     | uuid        | NO   | —                              |       |
| 4   | `tenant_id`     | uuid        | NO   | —                              |       |
| 5   | `operation`     | varchar(20) | NO   | `'upsert'::character varying`  |       |
| 6   | `priority`      | int4(32)    | YES  | `5`                            |       |
| 7   | `status`        | varchar(20) | YES  | `'pending'::character varying` |       |
| 8   | `attempts`      | int4(32)    | YES  | `0`                            |       |
| 9   | `max_attempts`  | int4(32)    | YES  | `3`                            |       |
| 10  | `error_message` | text        | YES  | —                              |       |
| 11  | `created_at`    | timestamptz | YES  | `now()`                        |       |
| 12  | `processed_at`  | timestamptz | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `embedding_queue_pkey` [PRIMARY] · (`id`)
- `idx_embedding_queue_pending` [INDEX] · (`status`, `priority`, `created_at`)
- `idx_embedding_queue_processing` [INDEX] · (`status`, `processed_at`)
- `idx_embedding_queue_tenant_id` [INDEX] · (`tenant_id`)
- `uk_embedding_queue_entity` [UNIQUE] · (`entity_type`, `entity_id`, `status`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `model_predictions`

- **Tenant scoped**: yes
- **Row estimate**: 267
- **Domains**: EPRA
- **Prisma model**: `model_predictions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type          | Null | Default             | Notes |
| --- | -------------------- | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`          | uuid          | NO   | —                   |       |
| 3   | `model_id`           | uuid          | YES  | —                   |       |
| 4   | `entity_type`        | varchar(50)   | NO   | —                   |       |
| 5   | `entity_id`          | uuid          | NO   | —                   |       |
| 6   | `prediction_value`   | numeric(20,4) | YES  | —                   |       |
| 7   | `prediction_label`   | varchar(100)  | YES  | —                   |       |
| 8   | `confidence_score`   | numeric(5,4)  | YES  | —                   |       |
| 9   | `prediction_details` | jsonb         | YES  | `'{}'::jsonb`       |       |
| 10  | `feature_importance` | jsonb         | YES  | `'{}'::jsonb`       |       |
| 11  | `valid_until`        | timestamptz   | YES  | —                   |       |
| 12  | `created_at`         | timestamptz   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References              | ON UPDATE | ON DELETE | Notes |
| ----------- | ----------------------- | --------- | --------- | ----- |
| `model_id`  | `predictive_models(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`           | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_predictions_created` [INDEX] · (`created_at`)
- `idx_predictions_entity` [INDEX] · (`tenant_id`, `entity_type`, `entity_id`)
- `idx_predictions_model` [INDEX] · (`model_id`)
- `model_predictions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_predictions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

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

### `prediction_actions`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: EPRA
- **Prisma model**: `prediction_actions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                               | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`                   | PK    |
| 2   | `action_code`            | varchar(50)  | NO   | —                                     |       |
| 3   | `action_name`            | varchar(200) | NO   | —                                     |       |
| 4   | `action_category`        | varchar(50)  | NO   | —                                     |       |
| 5   | `description`            | text         | YES  | —                                     |       |
| 6   | `applicable_risk_levels` | \_text       | YES  | `ARRAY['medium'::text, 'high'::text]` |       |
| 7   | `applicable_hipo`        | bool         | YES  | `false`                               |       |
| 8   | `estimated_impact`       | varchar(20)  | YES  | `'medium'::character varying`         |       |
| 9   | `typical_duration`       | varchar(50)  | YES  | —                                     |       |
| 10  | `created_at`             | timestamptz  | YES  | `now()`                               |       |
| 11  | `tenant_id`              | uuid         | YES  | —                                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_prediction_actions_tenant` [INDEX] · (`tenant_id`)
- `prediction_actions_action_code_key` [UNIQUE] · (`action_code`)
- `prediction_actions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_prediction_actions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `prediction_factors`

- **Tenant scoped**: yes
- **Row estimate**: 13
- **Domains**: EPRA
- **Prisma model**: `prediction_factors`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default             | Notes |
| --- | ----------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `factor_code`     | varchar(50)  | NO   | —                   |       |
| 3   | `factor_name`     | varchar(200) | NO   | —                   |       |
| 4   | `factor_category` | varchar(50)  | NO   | —                   |       |
| 5   | `description`     | text         | YES  | —                   |       |
| 6   | `weight_default`  | numeric(4,3) | YES  | `0.100`             |       |
| 7   | `data_source`     | varchar(100) | YES  | —                   |       |
| 8   | `is_positive`     | bool         | YES  | `true`              |       |
| 9   | `is_active`       | bool         | YES  | `true`              |       |
| 10  | `created_at`      | timestamptz  | YES  | `now()`             |       |
| 11  | `deleted_at`      | timestamptz  | YES  | —                   |       |
| 12  | `tenant_id`       | uuid         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_prediction_factors_active` [INDEX] · (`id`)
- `idx_prediction_factors_tenant` [INDEX] · (`tenant_id`)
- `prediction_factors_factor_code_key` [UNIQUE] · (`factor_code`)
- `prediction_factors_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_prediction_factors** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `prediction_model_accuracy`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: EPRA
- **Prisma model**: `prediction_model_accuracy`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `model_name`             | varchar(100) | NO   | —                   |       |
| 4   | `model_version`          | int4(32)     | NO   | —                   |       |
| 5   | `prediction_period`      | varchar(20)  | NO   | —                   |       |
| 6   | `total_predictions`      | int4(32)     | YES  | `0`                 |       |
| 7   | `validated_predictions`  | int4(32)     | YES  | `0`                 |       |
| 8   | `mean_absolute_error`    | numeric(5,4) | YES  | —                   |       |
| 9   | `root_mean_square_error` | numeric(5,4) | YES  | —                   |       |
| 10  | `accuracy_within_05`     | numeric(5,4) | YES  | —                   |       |
| 11  | `accuracy_within_10`     | numeric(5,4) | YES  | —                   |       |
| 12  | `hipo_precision`         | numeric(5,4) | YES  | —                   |       |
| 13  | `hipo_recall`            | numeric(5,4) | YES  | —                   |       |
| 14  | `risk_precision`         | numeric(5,4) | YES  | —                   |       |
| 15  | `calculated_at`          | timestamptz  | YES  | `now()`             |       |
| 16  | `created_at`             | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_model_accuracy_tenant` [INDEX] · (`tenant_id`)
- `prediction_model_accuracy_pkey` [PRIMARY] · (`id`)
- `prediction_model_accuracy_tenant_id_model_name_model_versio_key` [UNIQUE] · (`tenant_id`, `model_name`, `model_version`, `prediction_period`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `predictive_models`

- **Tenant scoped**: yes
- **Row estimate**: 16
- **Domains**: EPRA
- **Prisma model**: `predictive_models`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                      | Notes |
| --- | ------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                            |       |
| 3   | `name`              | varchar(200) | NO   | —                            |       |
| 4   | `model_type`        | varchar(100) | NO   | —                            |       |
| 5   | `description`       | text         | YES  | —                            |       |
| 6   | `algorithm`         | varchar(100) | YES  | —                            |       |
| 7   | `features`          | jsonb        | NO   | `'[]'::jsonb`                |       |
| 8   | `target_variable`   | varchar(100) | YES  | —                            |       |
| 9   | `hyperparameters`   | jsonb        | YES  | `'{}'::jsonb`                |       |
| 10  | `training_config`   | jsonb        | YES  | `'{}'::jsonb`                |       |
| 11  | `version`           | int4(32)     | YES  | `1`                          |       |
| 12  | `status`            | varchar(20)  | YES  | `'draft'::character varying` |       |
| 13  | `accuracy_metrics`  | jsonb        | YES  | `'{}'::jsonb`                |       |
| 14  | `last_trained_at`   | timestamptz  | YES  | —                            |       |
| 15  | `last_predicted_at` | timestamptz  | YES  | —                            |       |
| 16  | `is_active`         | bool         | YES  | `true`                       |       |
| 17  | `created_at`        | timestamptz  | YES  | `now()`                      |       |
| 18  | `updated_at`        | timestamptz  | YES  | `now()`                      |       |
| 19  | `deleted_at`        | timestamptz  | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_predictive_models_active` [INDEX] · (`id`)
- `idx_predictive_models_tenant` [INDEX] · (`tenant_id`)
- `idx_predictive_models_type` [INDEX] · (`model_type`)
- `predictive_models_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_predictive_models** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `model_predictions` via (`model_id`)

---

### `turnover_risk_scores`

- **Tenant scoped**: yes
- **Row estimate**: 267
- **Domains**: EPRA
- **Prisma model**: `turnover_risk_scores`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                   |       |
| 3   | `employee_id`         | uuid         | YES  | —                   |       |
| 4   | `risk_score`          | numeric(5,4) | NO   | —                   |       |
| 5   | `risk_level`          | varchar(20)  | NO   | —                   |       |
| 6   | `risk_factors`        | jsonb        | YES  | `'[]'::jsonb`       |       |
| 7   | `recommended_actions` | jsonb        | YES  | `'[]'::jsonb`       |       |
| 8   | `model_version`       | int4(32)     | YES  | —                   |       |
| 9   | `valid_from`          | timestamptz  | YES  | `now()`             |       |
| 10  | `valid_until`         | timestamptz  | YES  | —                   |       |
| 11  | `is_current`          | bool         | YES  | `true`              |       |
| 12  | `created_at`          | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_turnover_risk_employee` [INDEX] · (`employee_id`)
- `idx_turnover_risk_level` [INDEX] · (`risk_level`)
- `idx_turnover_risk_tenant` [INDEX] · (`tenant_id`)
- `turnover_risk_scores_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_turnover_risk** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---
