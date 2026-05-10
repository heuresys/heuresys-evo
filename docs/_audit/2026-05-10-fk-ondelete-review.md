# FK ON DELETE review — phase16m decision matrix

> Generated: 2026-05-10 · S24 · L58 · auto-generated from `scripts/db/generate-fk-ondelete-migration.mjs`
> Source: `docs/_audit/_artifacts/2026-05-10-fk-noaction-310.csv` (310 FK with NO ACTION default)

## Summary by domain × rule

| Domain × Rule            |   Count |
| ------------------------ | ------: |
| Catalog::RESTRICT        |      57 |
| Default::CASCADE         |      63 |
| Employee-ref::SET NULL   |      70 |
| HR-cascade::CASCADE      |       4 |
| Payroll::RESTRICT        |      12 |
| Tenant::CASCADE          |      82 |
| User-ref::SET NULL       |      20 |
| Whistleblowing::RESTRICT |       2 |
| **TOTAL**                | **310** |

## Decision rules (priority order)

1. **ref_table = `tenants`** → `CASCADE`. Tenant nuke = full subtree cleanup.
2. **ref_table = `audit_logs`** → `RESTRICT`. Immutable audit trail; never silently deleted.
3. **table starts with `whistleblowing`** → `RESTRICT`. Sensitive content retained.
4. **table starts with `audit_`** → `SET NULL`. Preserve log row, drop dangling ref.
5. **table OR ref starts with `payroll|compensation|salary|bonus|merit|payslip|tax_`** → `RESTRICT`. Financial audit trail.
6. **ref_table = `users`** → `SET NULL`. User delete preserves dependent rows.
7. **ref*table starts with `rbp*|esco*|industry*|company\_` or is a catalog table** → `RESTRICT`. Enum-like.
8. **ref_table = `employees` AND column ∈ {manager_id, mentor_id, interviewer_id, assigned_to, resolved_by, created_by, updated_by, reviewed_by, approved_by, deleted_by, owner_id, modified_by, submitted_by, requester_id, approver_id, reporter_id, evaluator_id, completed_by, rejected_by, last_modified_by}** → `SET NULL`. Preserve subordinate row.
9. **ref_table = `employees` AND column ∈ {employee_id, subject_id, candidate_id, reviewee_id, target_employee_id}** → `CASCADE`. Employee primary link cascades.
10. **default** → `CASCADE`. Tenant-scoped subtree cleanup.

## Domain: Catalog (57 FK)

| Constraint                                                 | Table                             | Column                   | Ref Table                  | Ref Col | Rule       |
| ---------------------------------------------------------- | --------------------------------- | ------------------------ | -------------------------- | ------- | ---------- |
| `admin_component_registry_functional_area_code_fkey`       | `admin_component_registry`        | `functional_area_code`   | `rbp_functional_areas`     | `code`  | `RESTRICT` |
| `blueprint_templates_profile_id_fkey`                      | `blueprint_templates`             | `profile_id`             | `industry_profiles`        | `id`    | `RESTRICT` |
| `business_processes_profile_id_fkey`                       | `business_processes`              | `profile_id`             | `industry_profiles`        | `id`    | `RESTRICT` |
| `career_path_level_skills_skill_id_fkey`                   | `career_path_level_skills`        | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `fk_cs_skill`                                              | `career_skills`                   | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `contracts_location_id_fkey`                               | `contracts`                       | `location_id`            | `locations`                | `id`    | `RESTRICT` |
| `employee_skill_mappings_esco_skill_id_fkey`               | `employee_skill_mappings`         | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `employee_skill_profiles_skill_id_fkey`                    | `employee_skill_profiles`         | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `employee_skills_esco_skill_id_fkey`                       | `employee_skills`                 | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `fk_employees_location`                                    | `employees`                       | `location_id`            | `locations`                | `id`    | `RESTRICT` |
| `esco_occupation_skills_skill_id_fkey`                     | `esco_occupation_skills`          | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `esco_skill_relations_source_skill_id_fkey`                | `esco_skill_relations`            | `source_skill_id`        | `esco_skills`              | `id`    | `RESTRICT` |
| `esco_skill_relations_target_skill_id_fkey`                | `esco_skill_relations`            | `target_skill_id`        | `esco_skills`              | `id`    | `RESTRICT` |
| `extracted_skills_esco_skill_id_fkey`                      | `extracted_skills`                | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `import_skill_links_esco_skill_id_fkey`                    | `import_skill_links`              | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `industry_classifications_parent_code_fkey`                | `industry_classifications`        | `parent_code`            | `industry_classifications` | `code`  | `RESTRICT` |
| `industry_profiles_company_size_code_fkey`                 | `industry_profiles`               | `company_size_code`      | `company_sizes`            | `code`  | `RESTRICT` |
| `industry_profiles_nace_class_code_fkey`                   | `industry_profiles`               | `nace_class_code`        | `industry_classifications` | `code`  | `RESTRICT` |
| `internal_mobility_postings_location_id_fkey`              | `internal_mobility_postings`      | `location_id`            | `locations`                | `id`    | `RESTRICT` |
| `job_template_skills_skill_id_fkey`                        | `job_template_skills`             | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `onet_esco_mappings_esco_occupation_id_fkey`               | `onet_esco_mappings`              | `esco_occupation_id`     | `esco_occupations`         | `id`    | `RESTRICT` |
| `onet_esco_mappings_esco_skill_id_fkey`                    | `onet_esco_mappings`              | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `onet_skills_esco_skill_id_fkey`                           | `onet_skills`                     | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `onet_skills_mapped_esco_skill_id_fkey`                    | `onet_skills`                     | `mapped_esco_skill_id`   | `esco_skills`              | `id`    | `RESTRICT` |
| `ontology_skill_dimensions_esco_skill_id_fkey`             | `ontology_skill_dimensions`       | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `ontology_skill_relations_source_skill_id_fkey`            | `ontology_skill_relations`        | `source_skill_id`        | `esco_skills`              | `id`    | `RESTRICT` |
| `ontology_skill_relations_target_skill_id_fkey`            | `ontology_skill_relations`        | `target_skill_id`        | `esco_skills`              | `id`    | `RESTRICT` |
| `position_skill_requirements_esco_skill_id_fkey`           | `position_skill_requirements`     | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `process_roles_esco_occupation_id_fkey`                    | `process_roles`                   | `esco_occupation_id`     | `esco_occupations`         | `id`    | `RESTRICT` |
| `process_skill_requirements_esco_skill_id_fkey`            | `process_skill_requirements`      | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `rbp_area_perspectives_functional_area_id_fkey`            | `rbp_area_perspectives`           | `functional_area_id`     | `rbp_functional_areas`     | `id`    | `RESTRICT` |
| `rbp_area_perspectives_perspective_code_fkey`              | `rbp_area_perspectives`           | `perspective_code`       | `rbp_perspectives`         | `code`  | `RESTRICT` |
| `rbp_pages_functional_area_code_fkey`                      | `rbp_pages`                       | `functional_area_code`   | `rbp_functional_areas`     | `code`  | `RESTRICT` |
| `rbp_roles_default_dashboard_code_fkey`                    | `rbp_roles`                       | `default_dashboard_code` | `rbp_dashboards`           | `code`  | `RESTRICT` |
| `rbp_roles_inherits_from_fkey`                             | `rbp_roles`                       | `inherits_from`          | `rbp_roles`                | `code`  | `RESTRICT` |
| `role_skill_requirements_skill_id_fkey`                    | `role_skill_requirements`         | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_adjacencies_adjacent_skill_id_fkey`                 | `skill_adjacencies`               | `adjacent_skill_id`      | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_adjacencies_skill_id_fkey`                          | `skill_adjacencies`               | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_aliases_esco_skill_id_fkey`                         | `skill_aliases`                   | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_classifications_esco_skill_id_fkey`                 | `skill_classifications`           | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_demand_metrics_esco_skill_id_fkey`                  | `skill_demand_metrics`            | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_pair_usage_skill_id_1_fkey`                         | `skill_pair_usage`                | `skill_id_1`             | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_pair_usage_skill_id_2_fkey`                         | `skill_pair_usage`                | `skill_id_2`             | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_relationships_source_skill_id_fkey`                 | `skill_relationships`             | `source_skill_id`        | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_relationships_target_skill_id_fkey`                 | `skill_relationships`             | `target_skill_id`        | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_requirements_templates_skill_id_fkey`               | `skill_requirements_templates`    | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_supply_metrics_esco_skill_id_fkey`                  | `skill_supply_metrics`            | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_synonyms_esco_skill_id_fkey`                        | `skill_synonyms`                  | `esco_skill_id`          | `esco_skills`              | `id`    | `RESTRICT` |
| `skill_taxonomy_extensions_skill_id_fkey`                  | `skill_taxonomy_extensions`       | `skill_id`               | `esco_skills`              | `id`    | `RESTRICT` |
| `tenant_custom_skills_base_esco_skill_id_fkey`             | `tenant_custom_skills`            | `base_esco_skill_id`     | `esco_skills`              | `id`    | `RESTRICT` |
| `tenant_industry_classifications_classification_code_fkey` | `tenant_industry_classifications` | `classification_code`    | `industry_classifications` | `code`  | `RESTRICT` |
| `tenants_industry_profile_id_fkey`                         | `tenants`                         | `industry_profile_id`    | `industry_profiles`        | `id`    | `RESTRICT` |
| `unknown_skills_mapped_to_esco_id_fkey`                    | `unknown_skills`                  | `mapped_to_esco_id`      | `esco_skills`              | `id`    | `RESTRICT` |
| `unknown_skills_suggested_esco_id_fkey`                    | `unknown_skills`                  | `suggested_esco_id`      | `esco_skills`              | `id`    | `RESTRICT` |
| `widget_catalog_functional_area_code_fkey`                 | `widget_catalog`                  | `functional_area_code`   | `rbp_functional_areas`     | `code`  | `RESTRICT` |
| `widget_catalog_perspective_code_fkey`                     | `widget_catalog`                  | `perspective_code`       | `rbp_perspectives`         | `code`  | `RESTRICT` |
| `workspace_templates_target_role_id_fkey`                  | `workspace_templates`             | `target_role_id`         | `rbp_roles`                | `id`    | `RESTRICT` |

## Domain: Default (63 FK)

| Constraint                                            | Table                           | Column                   | Ref Table                     | Ref Col | Rule      |
| ----------------------------------------------------- | ------------------------------- | ------------------------ | ----------------------------- | ------- | --------- |
| `benchmark_reports_config_id_fkey`                    | `benchmark_reports`             | `config_id`              | `benchmark_configs`           | `id`    | `CASCADE` |
| `blueprint_runs_template_id_fkey`                     | `blueprint_runs`                | `template_id`            | `blueprint_templates`         | `id`    | `CASCADE` |
| `calibration_results_calibration_session_id_fkey`     | `calibration_results`           | `calibration_session_id` | `calibration_sessions`        | `id`    | `CASCADE` |
| `calibration_results_performance_review_id_fkey`      | `calibration_results`           | `performance_review_id`  | `performance_reviews`         | `id`    | `CASCADE` |
| `calibration_sessions_org_unit_id_fkey`               | `calibration_sessions`          | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `career_path_levels_target_job_id_fkey`               | `career_path_levels`            | `target_job_id`          | `tenant_jobs`                 | `id`    | `CASCADE` |
| `career_path_recommendations_current_level_id_fkey`   | `career_path_recommendations`   | `current_level_id`       | `career_path_levels`          | `id`    | `CASCADE` |
| `career_path_recommendations_reachable_level_id_fkey` | `career_path_recommendations`   | `reachable_level_id`     | `career_path_levels`          | `id`    | `CASCADE` |
| `career_path_recommendations_target_level_id_fkey`    | `career_path_recommendations`   | `target_level_id`        | `career_path_levels`          | `id`    | `CASCADE` |
| `career_simulations_target_job_id_fkey`               | `career_simulations`            | `target_job_id`          | `tenant_jobs`                 | `id`    | `CASCADE` |
| `career_simulations_target_level_id_fkey`             | `career_simulations`            | `target_level_id`        | `career_path_levels`          | `id`    | `CASCADE` |
| `career_simulations_target_path_id_fkey`              | `career_simulations`            | `target_path_id`         | `career_paths`                | `id`    | `CASCADE` |
| `ccnl_job_title_mapping_ccnl_code_fkey`               | `ccnl_job_title_mapping`        | `ccnl_code`              | `ccnl_contracts`              | `code`  | `CASCADE` |
| `ccnl_seniority_rules_ccnl_code_fkey`                 | `ccnl_seniority_rules`          | `ccnl_code`              | `ccnl_contracts`              | `code`  | `CASCADE` |
| `contract_amendments_contract_id_fkey`                | `contract_amendments`           | `contract_id`            | `contracts`                   | `id`    | `CASCADE` |
| `contracts_cost_center_id_fkey`                       | `contracts`                     | `cost_center_id`         | `cost_centers`                | `id`    | `CASCADE` |
| `contracts_org_unit_id_fkey`                          | `contracts`                     | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `document_requests_result_document_id_fkey`           | `document_requests`             | `result_document_id`     | `employee_documents`          | `id`    | `CASCADE` |
| `employee_documents_parent_document_id_fkey`          | `employee_documents`            | `parent_document_id`     | `employee_documents`          | `id`    | `CASCADE` |
| `employee_kpi_targets_tenant_job_kpi_id_fkey`         | `employee_kpi_targets`          | `tenant_job_kpi_id`      | `tenant_job_kpis`             | `id`    | `CASCADE` |
| `employee_skill_assessments_tenant_job_skill_id_fkey` | `employee_skill_assessments`    | `tenant_job_skill_id`    | `tenant_job_skills`           | `id`    | `CASCADE` |
| `employee_training_records_course_id_fkey`            | `employee_training_records`     | `course_id`              | `courses`                     | `id`    | `CASCADE` |
| `engagement_surveys_template_id_fkey`                 | `engagement_surveys`            | `template_id`            | `engagement_survey_templates` | `id`    | `CASCADE` |
| `enrichment_candidates_llm_provider_code_fkey`        | `enrichment_candidates`         | `llm_provider_code`      | `enrichment_llm_providers`    | `code`  | `CASCADE` |
| `export_jobs_config_id_fkey`                          | `export_jobs`                   | `config_id`              | `export_configurations`       | `id`    | `CASCADE` |
| `goal_templates_org_unit_id_fkey`                     | `goal_templates`                | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `import_skill_links_import_job_id_fkey`               | `import_skill_links`            | `import_job_id`          | `import_jobs`                 | `id`    | `CASCADE` |
| `industry_ccnl_mapping_ccnl_code_fkey`                | `industry_ccnl_mapping`         | `ccnl_code`              | `ccnl_contracts`              | `code`  | `CASCADE` |
| `internal_mobility_postings_org_unit_id_fkey`         | `internal_mobility_postings`    | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `job_analysis_job_family_id_fkey`                     | `job_analysis`                  | `job_family_id`          | `job_families`                | `id`    | `CASCADE` |
| `job_analysis_org_unit_id_fkey`                       | `job_analysis`                  | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `job_evaluations_job_analysis_id_fkey`                | `job_evaluations`               | `job_analysis_id`        | `job_analysis`                | `id`    | `CASCADE` |
| `job_families_parent_id_fkey`                         | `job_families`                  | `parent_id`              | `job_families`                | `id`    | `CASCADE` |
| `job_market_postings_source_id_fkey`                  | `job_market_postings`           | `source_id`              | `job_market_sources`          | `id`    | `CASCADE` |
| `job_postings_org_unit_id_fkey`                       | `job_postings`                  | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `job_template_skills_custom_skill_id_fkey`            | `job_template_skills`           | `custom_skill_id`        | `tenant_custom_skills`        | `id`    | `CASCADE` |
| `ontology_categories_parent_id_fkey`                  | `ontology_categories`           | `parent_id`              | `ontology_categories`         | `id`    | `CASCADE` |
| `org_scenarios_base_org_unit_id_fkey`                 | `org_scenarios`                 | `base_org_unit_id`       | `org_units`                   | `id`    | `CASCADE` |
| `permission_overrides_permission_id_fkey`             | `permission_overrides`          | `permission_id`          | `permissions`                 | `id`    | `CASCADE` |
| `plugin_categories_parent_id_fkey`                    | `plugin_categories`             | `parent_id`              | `plugin_categories`           | `id`    | `CASCADE` |
| `plugin_installations_plugin_version_id_fkey`         | `plugin_installations`          | `plugin_version_id`      | `plugin_versions`             | `id`    | `CASCADE` |
| `plugins_category_id_fkey`                            | `plugins`                       | `category_id`            | `plugin_categories`           | `id`    | `CASCADE` |
| `rag_documents_knowledge_base_id_fkey`                | `rag_documents`                 | `knowledge_base_id`      | `rag_knowledge_bases`         | `id`    | `CASCADE` |
| `rag_documents_parent_document_id_fkey`               | `rag_documents`                 | `parent_document_id`     | `rag_documents`               | `id`    | `CASCADE` |
| `recruiting_candidate_history_candidate_id_fkey`      | `recruiting_candidate_history`  | `candidate_id`           | `recruiting_candidates`       | `id`    | `CASCADE` |
| `recruiting_candidates_requisition_id_fkey`           | `recruiting_candidates`         | `requisition_id`         | `recruiting_requisitions`     | `id`    | `CASCADE` |
| `recruiting_offers_candidate_id_fkey`                 | `recruiting_offers`             | `candidate_id`           | `recruiting_candidates`       | `id`    | `CASCADE` |
| `recruiting_offers_requisition_id_fkey`               | `recruiting_offers`             | `requisition_id`         | `recruiting_requisitions`     | `id`    | `CASCADE` |
| `report_delivery_log_execution_id_fkey`               | `report_delivery_log`           | `execution_id`           | `report_executions`           | `id`    | `CASCADE` |
| `skill_requirements_templates_org_unit_id_fkey`       | `skill_requirements_templates`  | `org_unit_id`            | `org_units`                   | `id`    | `CASCADE` |
| `social_comments_parent_comment_id_fkey`              | `social_comments`               | `parent_comment_id`      | `social_comments`             | `id`    | `CASCADE` |
| `social_likes_comment_id_fkey`                        | `social_likes`                  | `comment_id`             | `social_comments`             | `id`    | `CASCADE` |
| `sso_login_attempts_config_id_fkey`                   | `sso_login_attempts`            | `config_id`              | `sso_configurations`          | `id`    | `CASCADE` |
| `tenant_custom_skills_category_id_fkey`               | `tenant_custom_skills`          | `category_id`            | `ontology_categories`         | `id`    | `CASCADE` |
| `tenant_custom_skills_superseded_by_fkey`             | `tenant_custom_skills`          | `superseded_by`          | `tenant_custom_skills`        | `id`    | `CASCADE` |
| `tenant_jobs_tenant_org_unit_id_fkey`                 | `tenant_jobs`                   | `tenant_org_unit_id`     | `tenant_org_units`            | `id`    | `CASCADE` |
| `fk_bukrs`                                            | `user_pernr_mapping`            | `bukrs`                  | `t500c`                       | `bukrs` | `CASCADE` |
| `wellbeing_program_enrollments_resource_id_fkey`      | `wellbeing_program_enrollments` | `resource_id`            | `wellbeing_resources`         | `id`    | `CASCADE` |
| `workforce_plan_actions_scenario_id_fkey`             | `workforce_plan_actions`        | `scenario_id`            | `workforce_plan_scenarios`    | `id`    | `CASCADE` |
| `workforce_plan_actions_target_org_unit_id_fkey`      | `workforce_plan_actions`        | `target_org_unit_id`     | `org_units`                   | `id`    | `CASCADE` |
| `workforce_plan_actions_workforce_plan_id_fkey`       | `workforce_plan_actions`        | `workforce_plan_id`      | `workforce_plans`             | `id`    | `CASCADE` |
| `workforce_plan_scenarios_workforce_plan_id_fkey`     | `workforce_plan_scenarios`      | `workforce_plan_id`      | `workforce_plans`             | `id`    | `CASCADE` |
| `workspace_widgets_widget_catalog_id_fkey`            | `workspace_widgets`             | `widget_catalog_id`      | `widget_catalog`              | `id`    | `CASCADE` |

## Domain: Employee-ref (70 FK)

| Constraint                                             | Table                               | Column                       | Ref Table   | Ref Col | Rule       |
| ------------------------------------------------------ | ----------------------------------- | ---------------------------- | ----------- | ------- | ---------- |
| `ai_escalation_queue_assigned_to_fkey`                 | `ai_escalation_queue`               | `assigned_to`                | `employees` | `id`    | `SET NULL` |
| `ai_escalation_queue_resolved_by_fkey`                 | `ai_escalation_queue`               | `resolved_by`                | `employees` | `id`    | `SET NULL` |
| `analytics_events_actor_id_fkey`                       | `analytics_events`                  | `actor_id`                   | `employees` | `id`    | `SET NULL` |
| `benchmark_reports_created_by_employee_id_fkey`        | `benchmark_reports`                 | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `calibration_results_approved_by_fkey`                 | `calibration_results`               | `approved_by`                | `employees` | `id`    | `SET NULL` |
| `calibration_sessions_created_by_fkey_emp`             | `calibration_sessions`              | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `calibration_sessions_facilitator_id_fkey_emp`         | `calibration_sessions`              | `facilitator_id_employee_id` | `employees` | `id`    | `SET NULL` |
| `career_paths_created_by_fkey_emp`                     | `career_paths`                      | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `career_simulations_created_by_fkey`                   | `career_simulations`                | `created_by`                 | `employees` | `id`    | `SET NULL` |
| `course_enrollments_enrolled_by_fkey_emp`              | `course_enrollments`                | `enrolled_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `courses_created_by_fkey_emp`                          | `courses`                           | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `dashboards_owner_id_fkey`                             | `dashboards`                        | `owner_id`                   | `employees` | `id`    | `SET NULL` |
| `data_subject_requests_completed_by_fkey_emp`          | `data_subject_requests`             | `completed_by_employee_id`   | `employees` | `id`    | `SET NULL` |
| `document_comments_user_id_fkey_emp`                   | `document_comments`                 | `user_id_employee_id`        | `employees` | `id`    | `SET NULL` |
| `document_locks_locked_by_fkey_emp`                    | `document_locks`                    | `locked_by_employee_id`      | `employees` | `id`    | `SET NULL` |
| `document_requests_assigned_to_fkey`                   | `document_requests`                 | `assigned_to`                | `employees` | `id`    | `SET NULL` |
| `document_versions_created_by_fkey_emp`                | `document_versions`                 | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `employee_career_paths_assigned_by_fkey_emp`           | `employee_career_paths`             | `assigned_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `employee_certifications_verified_by_fkey_emp`         | `employee_certifications`           | `verified_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `employee_documents_signed_by_fkey`                    | `employee_documents`                | `signed_by`                  | `employees` | `id`    | `SET NULL` |
| `employee_documents_uploaded_by_fkey`                  | `employee_documents`                | `uploaded_by`                | `employees` | `id`    | `SET NULL` |
| `employee_documents_verified_by_fkey`                  | `employee_documents`                | `verified_by`                | `employees` | `id`    | `SET NULL` |
| `employee_permission_overrides_granted_by_fkey`        | `employee_permission_overrides`     | `granted_by`                 | `employees` | `id`    | `SET NULL` |
| `employee_skill_history_changed_by_fkey`               | `employee_skill_history`            | `changed_by`                 | `employees` | `id`    | `SET NULL` |
| `employee_skill_mappings_verified_by_employee_id_fkey` | `employee_skill_mappings`           | `verified_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `employee_skill_profiles_verified_by_fkey`             | `employee_skill_profiles`           | `verified_by`                | `employees` | `id`    | `SET NULL` |
| `employee_skills_verified_by_employee_id_fkey`         | `employee_skills`                   | `verified_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `export_configurations_created_by_fkey`                | `export_configurations`             | `created_by`                 | `employees` | `id`    | `SET NULL` |
| `export_jobs_triggered_by_fkey`                        | `export_jobs`                       | `triggered_by`               | `employees` | `id`    | `SET NULL` |
| `internal_job_postings_created_by_fkey_emp`            | `internal_job_postings`             | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `internal_mobility_postings_created_by_fkey`           | `internal_mobility_postings`        | `created_by`                 | `employees` | `id`    | `SET NULL` |
| `internal_mobility_postings_hiring_manager_id_fkey`    | `internal_mobility_postings`        | `hiring_manager_id`          | `employees` | `id`    | `SET NULL` |
| `job_analysis_analyst_id_fkey`                         | `job_analysis`                      | `analyst_id`                 | `employees` | `id`    | `SET NULL` |
| `job_evaluations_evaluated_by_fkey`                    | `job_evaluations`                   | `evaluated_by`               | `employees` | `id`    | `SET NULL` |
| `learning_path_enrollments_enrolled_by_fkey_emp`       | `learning_path_enrollments`         | `enrolled_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `learning_paths_created_by_fkey_emp`                   | `learning_paths`                    | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `leave_approval_steps_approver_id_fkey`                | `leave_approval_steps`              | `approver_id`                | `employees` | `id`    | `SET NULL` |
| `onboarding_checklist_completed_by_fkey_emp`           | `onboarding_checklist`              | `completed_by_employee_id`   | `employees` | `id`    | `SET NULL` |
| `onboarding_documents_verified_by_fkey_emp`            | `onboarding_documents`              | `verified_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `onboarding_instances_created_by_fkey_emp`             | `onboarding_instances`              | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `onboarding_instances_hr_contact_id_fkey_emp`          | `onboarding_instances`              | `hr_contact_id_employee_id`  | `employees` | `id`    | `SET NULL` |
| `onboarding_tasks_completed_by_fkey_emp`               | `onboarding_tasks`                  | `completed_by_employee_id`   | `employees` | `id`    | `SET NULL` |
| `onboarding_templates_created_by_fkey_emp`             | `onboarding_templates`              | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `ontology_feedback_submitted_by_fkey`                  | `ontology_feedback`                 | `submitted_by`               | `employees` | `id`    | `SET NULL` |
| `permission_overrides_granted_by_fkey`                 | `permission_overrides`              | `granted_by`                 | `employees` | `id`    | `SET NULL` |
| `plugin_api_keys_created_by_employee_id_fkey`          | `plugin_api_keys`                   | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `plugin_configurations_updated_by_employee_id_fkey`    | `plugin_configurations`             | `updated_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `plugin_installations_installed_by_employee_id_fkey`   | `plugin_installations`              | `installed_by_employee_id`   | `employees` | `id`    | `SET NULL` |
| `plugin_reviews_user_id_employee_id_fkey`              | `plugin_reviews`                    | `user_id_employee_id`        | `employees` | `id`    | `SET NULL` |
| `plugin_webhooks_created_by_employee_id_fkey`          | `plugin_webhooks`                   | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `preboarding_equipment_approved_by_fkey_emp`           | `preboarding_equipment`             | `approved_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `preboarding_equipment_requested_by_fkey_emp`          | `preboarding_equipment`             | `requested_by_employee_id`   | `employees` | `id`    | `SET NULL` |
| `preboarding_sessions_created_by_fkey_emp`             | `preboarding_sessions`              | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `preboarding_templates_created_by_fkey_emp`            | `preboarding_templates`             | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `preboarding_welcome_content_created_by_fkey_emp`      | `preboarding_welcome_content`       | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `rag_documents_uploaded_by_fkey_emp`                   | `rag_documents`                     | `uploaded_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `recruiting_interview_participants_user_id_fkey_emp`   | `recruiting_interview_participants` | `user_id_employee_id`        | `employees` | `id`    | `SET NULL` |
| `recruiting_interviews_created_by_fkey_emp`            | `recruiting_interviews`             | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `report_definitions_created_by_fkey_emp`               | `report_definitions`                | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `report_executions_executed_by_fkey_emp`               | `report_executions`                 | `executed_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `role_skill_requirements_created_by_fkey`              | `role_skill_requirements`           | `created_by`                 | `employees` | `id`    | `SET NULL` |
| `role_skill_requirements_updated_by_fkey`              | `role_skill_requirements`           | `updated_by`                 | `employees` | `id`    | `SET NULL` |
| `signature_requests_created_by_fkey_emp`               | `signature_requests`                | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `skill_gap_analyses_created_by_employee_id_fkey`       | `skill_gap_analyses`                | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `skill_gap_snapshots_created_by_employee_id_fkey`      | `skill_gap_snapshots`               | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `skill_taxonomy_extensions_approved_by_fkey`           | `skill_taxonomy_extensions`         | `approved_by`                | `employees` | `id`    | `SET NULL` |
| `sso_configurations_created_by_fkey_emp`               | `sso_configurations`                | `created_by_employee_id`     | `employees` | `id`    | `SET NULL` |
| `tenants_books_approved_by_fkey_emp`                   | `tenants_books`                     | `approved_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `unknown_skills_reviewed_by_employee_id_fkey`          | `unknown_skills`                    | `reviewed_by_employee_id`    | `employees` | `id`    | `SET NULL` |
| `workforce_plan_scenarios_created_by_fkey`             | `workforce_plan_scenarios`          | `created_by`                 | `employees` | `id`    | `SET NULL` |

## Domain: HR-cascade (4 FK)

| Constraint                                     | Table                         | Column        | Ref Table   | Ref Col | Rule      |
| ---------------------------------------------- | ----------------------------- | ------------- | ----------- | ------- | --------- |
| `ai_escalation_queue_employee_id_fkey`         | `ai_escalation_queue`         | `employee_id` | `employees` | `id`    | `CASCADE` |
| `calibration_results_employee_id_fkey`         | `calibration_results`         | `employee_id` | `employees` | `id`    | `CASCADE` |
| `employee_contracts_employee_id_fkey`          | `employee_contracts`          | `employee_id` | `employees` | `id`    | `CASCADE` |
| `engagement_survey_responses_employee_id_fkey` | `engagement_survey_responses` | `employee_id` | `employees` | `id`    | `CASCADE` |

## Domain: Payroll (12 FK)

| Constraint                                     | Table                     | Column                     | Ref Table             | Ref Col | Rule       |
| ---------------------------------------------- | ------------------------- | -------------------------- | --------------------- | ------- | ---------- |
| `bonus_allocations_approved_by_fkey_emp`       | `bonus_allocations`       | `approved_by_employee_id`  | `employees`           | `id`    | `RESTRICT` |
| `bonus_plans_created_by_fkey_emp`              | `bonus_plans`             | `created_by_employee_id`   | `employees`           | `id`    | `RESTRICT` |
| `employee_overtime_payroll_job_id_fkey`        | `employee_overtime`       | `payroll_job_id`           | `payroll_export_jobs` | `id`    | `RESTRICT` |
| `merit_cycles_created_by_fkey_emp`             | `merit_cycles`            | `created_by_employee_id`   | `employees`           | `id`    | `RESTRICT` |
| `merit_recommendations_approved_by_fkey_emp`   | `merit_recommendations`   | `approved_by_employee_id`  | `employees`           | `id`    | `RESTRICT` |
| `merit_recommendations_submitted_by_fkey_emp`  | `merit_recommendations`   | `submitted_by_employee_id` | `employees`           | `id`    | `RESTRICT` |
| `salary_band_assignments_assigned_by_fkey_emp` | `salary_band_assignments` | `assigned_by_employee_id`  | `employees`           | `id`    | `RESTRICT` |
| `salary_band_assignments_band_id_fkey`         | `salary_band_assignments` | `band_id`                  | `salary_bands`        | `id`    | `RESTRICT` |
| `salary_bands_created_by_fkey_emp`             | `salary_bands`            | `created_by_employee_id`   | `employees`           | `id`    | `RESTRICT` |
| `salary_history_approved_by_fkey`              | `salary_history`          | `approved_by`              | `employees`           | `id`    | `RESTRICT` |
| `salary_history_contract_id_fkey`              | `salary_history`          | `contract_id`              | `contracts`           | `id`    | `RESTRICT` |
| `salary_history_employee_id_fkey`              | `salary_history`          | `employee_id`              | `employees`           | `id`    | `RESTRICT` |

## Domain: Tenant (82 FK)

| Constraint                                     | Table                           | Column                | Ref Table | Ref Col | Rule      |
| ---------------------------------------------- | ------------------------------- | --------------------- | --------- | ------- | --------- |
| `ai_usage_log_tenant_id_fkey`                  | `ai_usage_log`                  | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `analysis_sessions_tenant_id_fkey`             | `analysis_sessions`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `analytics_aggregations_tenant_id_fkey`        | `analytics_aggregations`        | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `analytics_events_tenant_id_fkey`              | `analytics_events`              | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `api_keys_tenant_id_fkey`                      | `api_keys`                      | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `blueprint_runs_tenant_id_fkey`                | `blueprint_runs`                | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `burnout_assessments_tenant_id_fkey`           | `burnout_assessments`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `calibration_results_tenant_id_fkey`           | `calibration_results`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `critical_roles_tenant_id_fkey`                | `critical_roles`                | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `cross_entity_relations_tenant_id_fkey`        | `cross_entity_relations`        | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `dashboard_widgets_tenant_id_fkey`             | `dashboard_widgets`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `dashboards_tenant_id_fkey`                    | `dashboards`                    | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `data_subject_requests_tenant_id_fkey`         | `data_subject_requests`         | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_addresses_tenant_id_fkey`            | `employee_addresses`            | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_bank_details_tenant_id_fkey`         | `employee_bank_details`         | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_benefits_tenant_id_fkey`             | `employee_benefits`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_contracts_tenant_id_fkey`            | `employee_contracts`            | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_emergency_contacts_tenant_id_fkey`   | `employee_emergency_contacts`   | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_permission_overrides_tenant_id_fkey` | `employee_permission_overrides` | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `employee_training_records_tenant_id_fkey`     | `employee_training_records`     | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `export_configurations_tenant_id_fkey`         | `export_configurations`         | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `export_jobs_tenant_id_fkey`                   | `export_jobs`                   | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ext_hrp1007_tenant_id_fkey`                   | `ext_hrp1007`                   | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ext_pa0002_tenant_id_fkey`                    | `ext_pa0002`                    | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ext_pb0002_tenant_id_fkey`                    | `ext_pb0002`                    | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `feedback_360_tenant_id_fkey`                  | `feedback_360`                  | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `goals_tenant_id_fkey`                         | `goals`                         | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `import_jobs_tenant_id_fkey`                   | `import_jobs`                   | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `import_skill_links_tenant_id_fkey`            | `import_skill_links`            | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `integrations_tenant_id_fkey`                  | `integrations`                  | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `internal_mobility_postings_tenant_id_fkey`    | `internal_mobility_postings`    | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `job_analysis_tenant_id_fkey`                  | `job_analysis`                  | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `job_evaluations_tenant_id_fkey`               | `job_evaluations`               | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `job_families_tenant_id_fkey`                  | `job_families`                  | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `market_salary_data_tenant_id_fkey`            | `market_salary_data`            | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `mentorship_programs_tenant_id_fkey`           | `mentorship_programs`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `mentorships_tenant_id_fkey`                   | `mentorships`                   | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `model_predictions_tenant_id_fkey`             | `model_predictions`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ontology_embedding_jobs_tenant_id_fkey`       | `ontology_embedding_jobs`       | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ontology_feedback_tenant_id_fkey`             | `ontology_feedback`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ontology_inference_jobs_tenant_id_fkey`       | `ontology_inference_jobs`       | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `ontology_source_mappings_tenant_id_fkey`      | `ontology_source_mappings`      | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `org_scenarios_tenant_id_fkey`                 | `org_scenarios`                 | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `performance_predictions_tenant_id_fkey`       | `performance_predictions`       | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `performance_reviews_tenant_id_fkey`           | `performance_reviews`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `permission_overrides_tenant_id_fkey`          | `permission_overrides`          | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugin_api_keys_tenant_id_fkey`               | `plugin_api_keys`               | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugin_configurations_tenant_id_fkey`         | `plugin_configurations`         | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugin_hook_executions_tenant_id_fkey`        | `plugin_hook_executions`        | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugin_installations_tenant_id_fkey`          | `plugin_installations`          | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugin_reviews_tenant_id_fkey`                | `plugin_reviews`                | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugin_webhooks_tenant_id_fkey`               | `plugin_webhooks`               | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `plugins_publisher_tenant_id_fkey`             | `plugins`                       | `publisher_tenant_id` | `tenants` | `id`    | `CASCADE` |
| `predictive_models_tenant_id_fkey`             | `predictive_models`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `rbp_teams_tenant_id_fkey`                     | `rbp_teams`                     | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `recognition_tenant_id_fkey`                   | `recognition`                   | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `recruiting_candidates_tenant_id_fkey`         | `recruiting_candidates`         | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `recruiting_offers_tenant_id_fkey`             | `recruiting_offers`             | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `recruiting_requisitions_tenant_id_fkey`       | `recruiting_requisitions`       | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `report_definitions_tenant_id_fkey`            | `report_definitions`            | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `report_delivery_log_tenant_id_fkey`           | `report_delivery_log`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `report_subscriptions_tenant_id_fkey`          | `report_subscriptions`          | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `role_permissions_tenant_id_fkey`              | `role_permissions`              | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `salary_bands_tenant_id_fkey`                  | `salary_bands`                  | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `salary_history_tenant_id_fkey`                | `salary_history`                | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `saved_jobs_tenant_id_fkey`                    | `saved_jobs`                    | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `skill_migration_jobs_tenant_id_fkey`          | `skill_migration_jobs`          | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `skill_taxonomy_extensions_tenant_id_fkey`     | `skill_taxonomy_extensions`     | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `surveys_tenant_id_fkey`                       | `surveys`                       | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `sync_log_tenant_id_fkey`                      | `sync_log`                      | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `sync_queue_tenant_id_fkey`                    | `sync_queue`                    | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `turnover_risk_scores_tenant_id_fkey`          | `turnover_risk_scores`          | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `user_workspaces_tenant_id_fkey`               | `user_workspaces`               | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `webhooks_tenant_id_fkey`                      | `webhooks`                      | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `wellbeing_checkins_tenant_id_fkey`            | `wellbeing_checkins`            | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `wellbeing_goals_tenant_id_fkey`               | `wellbeing_goals`               | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `wellbeing_program_enrollments_tenant_id_fkey` | `wellbeing_program_enrollments` | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `wellbeing_resources_tenant_id_fkey`           | `wellbeing_resources`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `widget_templates_tenant_id_fkey`              | `widget_templates`              | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `workforce_plan_actions_tenant_id_fkey`        | `workforce_plan_actions`        | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `workforce_plan_scenarios_tenant_id_fkey`      | `workforce_plan_scenarios`      | `tenant_id`           | `tenants` | `id`    | `CASCADE` |
| `workspace_templates_tenant_id_fkey`           | `workspace_templates`           | `tenant_id`           | `tenants` | `id`    | `CASCADE` |

## Domain: User-ref (20 FK)

| Constraint                                    | Table                         | Column          | Ref Table | Ref Col | Rule       |
| --------------------------------------------- | ----------------------------- | --------------- | --------- | ------- | ---------- |
| `analysis_sessions_created_by_fkey`           | `analysis_sessions`           | `created_by`    | `users`   | `id`    | `SET NULL` |
| `blueprint_results_applied_by_fkey`           | `blueprint_results`           | `applied_by`    | `users`   | `id`    | `SET NULL` |
| `blueprint_runs_created_by_fkey`              | `blueprint_runs`              | `created_by`    | `users`   | `id`    | `SET NULL` |
| `blueprint_templates_created_by_fkey`         | `blueprint_templates`         | `created_by`    | `users`   | `id`    | `SET NULL` |
| `career_skills_validated_by_fkey`             | `career_skills`               | `validated_by`  | `users`   | `id`    | `SET NULL` |
| `engagement_action_plans_created_by_fkey`     | `engagement_action_plans`     | `created_by`    | `users`   | `id`    | `SET NULL` |
| `engagement_action_plans_owner_id_fkey`       | `engagement_action_plans`     | `owner_id`      | `users`   | `id`    | `SET NULL` |
| `engagement_feedback_reviewed_by_fkey`        | `engagement_feedback`         | `reviewed_by`   | `users`   | `id`    | `SET NULL` |
| `engagement_pulse_configs_created_by_fkey`    | `engagement_pulse_configs`    | `created_by`    | `users`   | `id`    | `SET NULL` |
| `engagement_survey_templates_created_by_fkey` | `engagement_survey_templates` | `created_by`    | `users`   | `id`    | `SET NULL` |
| `engagement_surveys_created_by_fkey`          | `engagement_surveys`          | `created_by`    | `users`   | `id`    | `SET NULL` |
| `error_patterns_resolved_by_fkey`             | `error_patterns`              | `resolved_by`   | `users`   | `id`    | `SET NULL` |
| `org_scenarios_created_by_fkey`               | `org_scenarios`               | `created_by`    | `users`   | `id`    | `SET NULL` |
| `rbp_teams_created_by_fkey`                   | `rbp_teams`                   | `created_by`    | `users`   | `id`    | `SET NULL` |
| `skill_classifications_classified_by_fkey`    | `skill_classifications`       | `classified_by` | `users`   | `id`    | `SET NULL` |
| `skill_relationships_validated_by_fkey`       | `skill_relationships`         | `validated_by`  | `users`   | `id`    | `SET NULL` |
| `tenant_schema_version_applied_by_fkey`       | `tenant_schema_version`       | `applied_by`    | `users`   | `id`    | `SET NULL` |
| `user_workspaces_user_id_fkey`                | `user_workspaces`             | `user_id`       | `users`   | `id`    | `SET NULL` |
| `workforce_plans_created_by_fkey`             | `workforce_plans`             | `created_by`    | `users`   | `id`    | `SET NULL` |
| `workforce_plans_updated_by_fkey`             | `workforce_plans`             | `updated_by`    | `users`   | `id`    | `SET NULL` |

## Domain: Whistleblowing (2 FK)

| Constraint                                    | Table                      | Column                    | Ref Table   | Ref Col | Rule       |
| --------------------------------------------- | -------------------------- | ------------------------- | ----------- | ------- | ---------- |
| `whistleblowing_audit_log_user_id_fkey_emp`   | `whistleblowing_audit_log` | `user_id_employee_id`     | `employees` | `id`    | `RESTRICT` |
| `whistleblowing_reports_assigned_to_fkey_emp` | `whistleblowing_reports`   | `assigned_to_employee_id` | `employees` | `id`    | `RESTRICT` |
