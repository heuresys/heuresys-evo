-- Phase 16.M · S24 · L58 — FK ON DELETE explicit per domain
-- =============================================================================
-- Tags 310 FK without explicit ON DELETE rule. Decision matrix in
-- docs/_audit/2026-05-10-fk-ondelete-review.md (auto-generated).
--
-- Rules (priority top-down):
--   1. ref=tenants → CASCADE
--   2. ref=audit_logs → RESTRICT
--   3. table=whistleblowing_% → RESTRICT
--   4. table=audit_% → SET NULL
--   5. table|ref=payroll|compensation|salary|bonus|merit|payslip → RESTRICT
--   6. ref=users → SET NULL
--   7. ref=rbp_|esco_|catalog-like → RESTRICT
--   8. ref=employees AND col in PRESERVE_REF_COLS → SET NULL
--   9. ref=employees AND col=employee_id|subject_id|candidate_id → CASCADE
--  10. else → CASCADE
-- =============================================================================

BEGIN;

-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.admin_component_registry DROP CONSTRAINT IF EXISTS admin_component_registry_functional_area_code_fkey, ADD CONSTRAINT admin_component_registry_functional_area_code_fkey FOREIGN KEY (functional_area_code) REFERENCES public.rbp_functional_areas(code) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.ai_escalation_queue DROP CONSTRAINT IF EXISTS ai_escalation_queue_assigned_to_fkey, ADD CONSTRAINT ai_escalation_queue_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [HR-cascade/CASCADE] Employee delete cascades subordinates
ALTER TABLE public.ai_escalation_queue DROP CONSTRAINT IF EXISTS ai_escalation_queue_employee_id_fkey, ADD CONSTRAINT ai_escalation_queue_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.ai_escalation_queue DROP CONSTRAINT IF EXISTS ai_escalation_queue_resolved_by_fkey, ADD CONSTRAINT ai_escalation_queue_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_tenant_id_fkey, ADD CONSTRAINT ai_usage_log_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.analysis_sessions DROP CONSTRAINT IF EXISTS analysis_sessions_created_by_fkey, ADD CONSTRAINT analysis_sessions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.analysis_sessions DROP CONSTRAINT IF EXISTS analysis_sessions_tenant_id_fkey, ADD CONSTRAINT analysis_sessions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.analytics_aggregations DROP CONSTRAINT IF EXISTS analytics_aggregations_tenant_id_fkey, ADD CONSTRAINT analytics_aggregations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_actor_id_fkey, ADD CONSTRAINT analytics_events_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_tenant_id_fkey, ADD CONSTRAINT analytics_events_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.api_keys DROP CONSTRAINT IF EXISTS api_keys_tenant_id_fkey, ADD CONSTRAINT api_keys_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.benchmark_reports DROP CONSTRAINT IF EXISTS benchmark_reports_config_id_fkey, ADD CONSTRAINT benchmark_reports_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.benchmark_configs(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.benchmark_reports DROP CONSTRAINT IF EXISTS benchmark_reports_created_by_employee_id_fkey, ADD CONSTRAINT benchmark_reports_created_by_employee_id_fkey FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.blueprint_results DROP CONSTRAINT IF EXISTS blueprint_results_applied_by_fkey, ADD CONSTRAINT blueprint_results_applied_by_fkey FOREIGN KEY (applied_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.blueprint_runs DROP CONSTRAINT IF EXISTS blueprint_runs_created_by_fkey, ADD CONSTRAINT blueprint_runs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.blueprint_runs DROP CONSTRAINT IF EXISTS blueprint_runs_template_id_fkey, ADD CONSTRAINT blueprint_runs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.blueprint_templates(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.blueprint_runs DROP CONSTRAINT IF EXISTS blueprint_runs_tenant_id_fkey, ADD CONSTRAINT blueprint_runs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.blueprint_templates DROP CONSTRAINT IF EXISTS blueprint_templates_created_by_fkey, ADD CONSTRAINT blueprint_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.blueprint_templates DROP CONSTRAINT IF EXISTS blueprint_templates_profile_id_fkey, ADD CONSTRAINT blueprint_templates_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.industry_profiles(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.bonus_allocations DROP CONSTRAINT IF EXISTS bonus_allocations_approved_by_fkey_emp, ADD CONSTRAINT bonus_allocations_approved_by_fkey_emp FOREIGN KEY (approved_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.bonus_plans DROP CONSTRAINT IF EXISTS bonus_plans_created_by_fkey_emp, ADD CONSTRAINT bonus_plans_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.burnout_assessments DROP CONSTRAINT IF EXISTS burnout_assessments_tenant_id_fkey, ADD CONSTRAINT burnout_assessments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.business_processes DROP CONSTRAINT IF EXISTS business_processes_profile_id_fkey, ADD CONSTRAINT business_processes_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.industry_profiles(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.calibration_results DROP CONSTRAINT IF EXISTS calibration_results_approved_by_fkey, ADD CONSTRAINT calibration_results_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.calibration_results DROP CONSTRAINT IF EXISTS calibration_results_calibration_session_id_fkey, ADD CONSTRAINT calibration_results_calibration_session_id_fkey FOREIGN KEY (calibration_session_id) REFERENCES public.calibration_sessions(id) ON DELETE CASCADE;
-- [HR-cascade/CASCADE] Employee delete cascades subordinates
ALTER TABLE public.calibration_results DROP CONSTRAINT IF EXISTS calibration_results_employee_id_fkey, ADD CONSTRAINT calibration_results_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.calibration_results DROP CONSTRAINT IF EXISTS calibration_results_performance_review_id_fkey, ADD CONSTRAINT calibration_results_performance_review_id_fkey FOREIGN KEY (performance_review_id) REFERENCES public.performance_reviews(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.calibration_results DROP CONSTRAINT IF EXISTS calibration_results_tenant_id_fkey, ADD CONSTRAINT calibration_results_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.calibration_sessions DROP CONSTRAINT IF EXISTS calibration_sessions_created_by_fkey_emp, ADD CONSTRAINT calibration_sessions_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.calibration_sessions DROP CONSTRAINT IF EXISTS calibration_sessions_facilitator_id_fkey_emp, ADD CONSTRAINT calibration_sessions_facilitator_id_fkey_emp FOREIGN KEY (facilitator_id_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.calibration_sessions DROP CONSTRAINT IF EXISTS calibration_sessions_org_unit_id_fkey, ADD CONSTRAINT calibration_sessions_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.career_path_level_skills DROP CONSTRAINT IF EXISTS career_path_level_skills_skill_id_fkey, ADD CONSTRAINT career_path_level_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_path_levels DROP CONSTRAINT IF EXISTS career_path_levels_target_job_id_fkey, ADD CONSTRAINT career_path_levels_target_job_id_fkey FOREIGN KEY (target_job_id) REFERENCES public.tenant_jobs(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_path_recommendations DROP CONSTRAINT IF EXISTS career_path_recommendations_current_level_id_fkey, ADD CONSTRAINT career_path_recommendations_current_level_id_fkey FOREIGN KEY (current_level_id) REFERENCES public.career_path_levels(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_path_recommendations DROP CONSTRAINT IF EXISTS career_path_recommendations_reachable_level_id_fkey, ADD CONSTRAINT career_path_recommendations_reachable_level_id_fkey FOREIGN KEY (reachable_level_id) REFERENCES public.career_path_levels(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_path_recommendations DROP CONSTRAINT IF EXISTS career_path_recommendations_target_level_id_fkey, ADD CONSTRAINT career_path_recommendations_target_level_id_fkey FOREIGN KEY (target_level_id) REFERENCES public.career_path_levels(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.career_paths DROP CONSTRAINT IF EXISTS career_paths_created_by_fkey_emp, ADD CONSTRAINT career_paths_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.career_simulations DROP CONSTRAINT IF EXISTS career_simulations_created_by_fkey, ADD CONSTRAINT career_simulations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_simulations DROP CONSTRAINT IF EXISTS career_simulations_target_job_id_fkey, ADD CONSTRAINT career_simulations_target_job_id_fkey FOREIGN KEY (target_job_id) REFERENCES public.tenant_jobs(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_simulations DROP CONSTRAINT IF EXISTS career_simulations_target_level_id_fkey, ADD CONSTRAINT career_simulations_target_level_id_fkey FOREIGN KEY (target_level_id) REFERENCES public.career_path_levels(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.career_simulations DROP CONSTRAINT IF EXISTS career_simulations_target_path_id_fkey, ADD CONSTRAINT career_simulations_target_path_id_fkey FOREIGN KEY (target_path_id) REFERENCES public.career_paths(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.career_skills DROP CONSTRAINT IF EXISTS fk_cs_skill, ADD CONSTRAINT fk_cs_skill FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.career_skills DROP CONSTRAINT IF EXISTS career_skills_validated_by_fkey, ADD CONSTRAINT career_skills_validated_by_fkey FOREIGN KEY (validated_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.ccnl_job_title_mapping DROP CONSTRAINT IF EXISTS ccnl_job_title_mapping_ccnl_code_fkey, ADD CONSTRAINT ccnl_job_title_mapping_ccnl_code_fkey FOREIGN KEY (ccnl_code) REFERENCES public.ccnl_contracts(code) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.ccnl_seniority_rules DROP CONSTRAINT IF EXISTS ccnl_seniority_rules_ccnl_code_fkey, ADD CONSTRAINT ccnl_seniority_rules_ccnl_code_fkey FOREIGN KEY (ccnl_code) REFERENCES public.ccnl_contracts(code) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.contract_amendments DROP CONSTRAINT IF EXISTS contract_amendments_contract_id_fkey, ADD CONSTRAINT contract_amendments_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_cost_center_id_fkey, ADD CONSTRAINT contracts_cost_center_id_fkey FOREIGN KEY (cost_center_id) REFERENCES public.cost_centers(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_location_id_fkey, ADD CONSTRAINT contracts_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_org_unit_id_fkey, ADD CONSTRAINT contracts_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_enrolled_by_fkey_emp, ADD CONSTRAINT course_enrollments_enrolled_by_fkey_emp FOREIGN KEY (enrolled_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_created_by_fkey_emp, ADD CONSTRAINT courses_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.critical_roles DROP CONSTRAINT IF EXISTS critical_roles_tenant_id_fkey, ADD CONSTRAINT critical_roles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.cross_entity_relations DROP CONSTRAINT IF EXISTS cross_entity_relations_tenant_id_fkey, ADD CONSTRAINT cross_entity_relations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.dashboard_widgets DROP CONSTRAINT IF EXISTS dashboard_widgets_tenant_id_fkey, ADD CONSTRAINT dashboard_widgets_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.dashboards DROP CONSTRAINT IF EXISTS dashboards_owner_id_fkey, ADD CONSTRAINT dashboards_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.dashboards DROP CONSTRAINT IF EXISTS dashboards_tenant_id_fkey, ADD CONSTRAINT dashboards_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.data_subject_requests DROP CONSTRAINT IF EXISTS data_subject_requests_completed_by_fkey_emp, ADD CONSTRAINT data_subject_requests_completed_by_fkey_emp FOREIGN KEY (completed_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.data_subject_requests DROP CONSTRAINT IF EXISTS data_subject_requests_tenant_id_fkey, ADD CONSTRAINT data_subject_requests_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.document_comments DROP CONSTRAINT IF EXISTS document_comments_user_id_fkey_emp, ADD CONSTRAINT document_comments_user_id_fkey_emp FOREIGN KEY (user_id_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.document_locks DROP CONSTRAINT IF EXISTS document_locks_locked_by_fkey_emp, ADD CONSTRAINT document_locks_locked_by_fkey_emp FOREIGN KEY (locked_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.document_requests DROP CONSTRAINT IF EXISTS document_requests_assigned_to_fkey, ADD CONSTRAINT document_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.document_requests DROP CONSTRAINT IF EXISTS document_requests_result_document_id_fkey, ADD CONSTRAINT document_requests_result_document_id_fkey FOREIGN KEY (result_document_id) REFERENCES public.employee_documents(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.document_versions DROP CONSTRAINT IF EXISTS document_versions_created_by_fkey_emp, ADD CONSTRAINT document_versions_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_addresses DROP CONSTRAINT IF EXISTS employee_addresses_tenant_id_fkey, ADD CONSTRAINT employee_addresses_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_bank_details DROP CONSTRAINT IF EXISTS employee_bank_details_tenant_id_fkey, ADD CONSTRAINT employee_bank_details_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_benefits DROP CONSTRAINT IF EXISTS employee_benefits_tenant_id_fkey, ADD CONSTRAINT employee_benefits_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_career_paths DROP CONSTRAINT IF EXISTS employee_career_paths_assigned_by_fkey_emp, ADD CONSTRAINT employee_career_paths_assigned_by_fkey_emp FOREIGN KEY (assigned_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_certifications DROP CONSTRAINT IF EXISTS employee_certifications_verified_by_fkey_emp, ADD CONSTRAINT employee_certifications_verified_by_fkey_emp FOREIGN KEY (verified_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [HR-cascade/CASCADE] Employee delete cascades subordinates
ALTER TABLE public.employee_contracts DROP CONSTRAINT IF EXISTS employee_contracts_employee_id_fkey, ADD CONSTRAINT employee_contracts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_contracts DROP CONSTRAINT IF EXISTS employee_contracts_tenant_id_fkey, ADD CONSTRAINT employee_contracts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.employee_documents DROP CONSTRAINT IF EXISTS employee_documents_parent_document_id_fkey, ADD CONSTRAINT employee_documents_parent_document_id_fkey FOREIGN KEY (parent_document_id) REFERENCES public.employee_documents(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_documents DROP CONSTRAINT IF EXISTS employee_documents_signed_by_fkey, ADD CONSTRAINT employee_documents_signed_by_fkey FOREIGN KEY (signed_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_documents DROP CONSTRAINT IF EXISTS employee_documents_uploaded_by_fkey, ADD CONSTRAINT employee_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_documents DROP CONSTRAINT IF EXISTS employee_documents_verified_by_fkey, ADD CONSTRAINT employee_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_emergency_contacts DROP CONSTRAINT IF EXISTS employee_emergency_contacts_tenant_id_fkey, ADD CONSTRAINT employee_emergency_contacts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.employee_kpi_targets DROP CONSTRAINT IF EXISTS employee_kpi_targets_tenant_job_kpi_id_fkey, ADD CONSTRAINT employee_kpi_targets_tenant_job_kpi_id_fkey FOREIGN KEY (tenant_job_kpi_id) REFERENCES public.tenant_job_kpis(id) ON DELETE CASCADE;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.employee_overtime DROP CONSTRAINT IF EXISTS employee_overtime_payroll_job_id_fkey, ADD CONSTRAINT employee_overtime_payroll_job_id_fkey FOREIGN KEY (payroll_job_id) REFERENCES public.payroll_export_jobs(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_permission_overrides DROP CONSTRAINT IF EXISTS employee_permission_overrides_granted_by_fkey, ADD CONSTRAINT employee_permission_overrides_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_permission_overrides DROP CONSTRAINT IF EXISTS employee_permission_overrides_tenant_id_fkey, ADD CONSTRAINT employee_permission_overrides_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.employee_skill_assessments DROP CONSTRAINT IF EXISTS employee_skill_assessments_tenant_job_skill_id_fkey, ADD CONSTRAINT employee_skill_assessments_tenant_job_skill_id_fkey FOREIGN KEY (tenant_job_skill_id) REFERENCES public.tenant_job_skills(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_skill_history DROP CONSTRAINT IF EXISTS employee_skill_history_changed_by_fkey, ADD CONSTRAINT employee_skill_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.employee_skill_mappings DROP CONSTRAINT IF EXISTS employee_skill_mappings_esco_skill_id_fkey, ADD CONSTRAINT employee_skill_mappings_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_skill_mappings DROP CONSTRAINT IF EXISTS employee_skill_mappings_verified_by_employee_id_fkey, ADD CONSTRAINT employee_skill_mappings_verified_by_employee_id_fkey FOREIGN KEY (verified_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.employee_skill_profiles DROP CONSTRAINT IF EXISTS employee_skill_profiles_skill_id_fkey, ADD CONSTRAINT employee_skill_profiles_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_skill_profiles DROP CONSTRAINT IF EXISTS employee_skill_profiles_verified_by_fkey, ADD CONSTRAINT employee_skill_profiles_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.employee_skills DROP CONSTRAINT IF EXISTS employee_skills_esco_skill_id_fkey, ADD CONSTRAINT employee_skills_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.employee_skills DROP CONSTRAINT IF EXISTS employee_skills_verified_by_employee_id_fkey, ADD CONSTRAINT employee_skills_verified_by_employee_id_fkey FOREIGN KEY (verified_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.employee_training_records DROP CONSTRAINT IF EXISTS employee_training_records_course_id_fkey, ADD CONSTRAINT employee_training_records_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.employee_training_records DROP CONSTRAINT IF EXISTS employee_training_records_tenant_id_fkey, ADD CONSTRAINT employee_training_records_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS fk_employees_location, ADD CONSTRAINT fk_employees_location FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE RESTRICT;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.engagement_action_plans DROP CONSTRAINT IF EXISTS engagement_action_plans_created_by_fkey, ADD CONSTRAINT engagement_action_plans_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.engagement_action_plans DROP CONSTRAINT IF EXISTS engagement_action_plans_owner_id_fkey, ADD CONSTRAINT engagement_action_plans_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.engagement_feedback DROP CONSTRAINT IF EXISTS engagement_feedback_reviewed_by_fkey, ADD CONSTRAINT engagement_feedback_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.engagement_pulse_configs DROP CONSTRAINT IF EXISTS engagement_pulse_configs_created_by_fkey, ADD CONSTRAINT engagement_pulse_configs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [HR-cascade/CASCADE] Employee delete cascades subordinates
ALTER TABLE public.engagement_survey_responses DROP CONSTRAINT IF EXISTS engagement_survey_responses_employee_id_fkey, ADD CONSTRAINT engagement_survey_responses_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.engagement_survey_templates DROP CONSTRAINT IF EXISTS engagement_survey_templates_created_by_fkey, ADD CONSTRAINT engagement_survey_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.engagement_surveys DROP CONSTRAINT IF EXISTS engagement_surveys_created_by_fkey, ADD CONSTRAINT engagement_surveys_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.engagement_surveys DROP CONSTRAINT IF EXISTS engagement_surveys_template_id_fkey, ADD CONSTRAINT engagement_surveys_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.engagement_survey_templates(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.enrichment_candidates DROP CONSTRAINT IF EXISTS enrichment_candidates_llm_provider_code_fkey, ADD CONSTRAINT enrichment_candidates_llm_provider_code_fkey FOREIGN KEY (llm_provider_code) REFERENCES public.enrichment_llm_providers(code) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.error_patterns DROP CONSTRAINT IF EXISTS error_patterns_resolved_by_fkey, ADD CONSTRAINT error_patterns_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.esco_occupation_skills DROP CONSTRAINT IF EXISTS esco_occupation_skills_skill_id_fkey, ADD CONSTRAINT esco_occupation_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.esco_skill_relations DROP CONSTRAINT IF EXISTS esco_skill_relations_source_skill_id_fkey, ADD CONSTRAINT esco_skill_relations_source_skill_id_fkey FOREIGN KEY (source_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.esco_skill_relations DROP CONSTRAINT IF EXISTS esco_skill_relations_target_skill_id_fkey, ADD CONSTRAINT esco_skill_relations_target_skill_id_fkey FOREIGN KEY (target_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.export_configurations DROP CONSTRAINT IF EXISTS export_configurations_created_by_fkey, ADD CONSTRAINT export_configurations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.export_configurations DROP CONSTRAINT IF EXISTS export_configurations_tenant_id_fkey, ADD CONSTRAINT export_configurations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.export_jobs DROP CONSTRAINT IF EXISTS export_jobs_config_id_fkey, ADD CONSTRAINT export_jobs_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.export_configurations(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.export_jobs DROP CONSTRAINT IF EXISTS export_jobs_tenant_id_fkey, ADD CONSTRAINT export_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.export_jobs DROP CONSTRAINT IF EXISTS export_jobs_triggered_by_fkey, ADD CONSTRAINT export_jobs_triggered_by_fkey FOREIGN KEY (triggered_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ext_hrp1007 DROP CONSTRAINT IF EXISTS ext_hrp1007_tenant_id_fkey, ADD CONSTRAINT ext_hrp1007_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ext_pa0002 DROP CONSTRAINT IF EXISTS ext_pa0002_tenant_id_fkey, ADD CONSTRAINT ext_pa0002_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ext_pb0002 DROP CONSTRAINT IF EXISTS ext_pb0002_tenant_id_fkey, ADD CONSTRAINT ext_pb0002_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.extracted_skills DROP CONSTRAINT IF EXISTS extracted_skills_esco_skill_id_fkey, ADD CONSTRAINT extracted_skills_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.feedback_360 DROP CONSTRAINT IF EXISTS feedback_360_tenant_id_fkey, ADD CONSTRAINT feedback_360_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.goal_templates DROP CONSTRAINT IF EXISTS goal_templates_org_unit_id_fkey, ADD CONSTRAINT goal_templates_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.goals DROP CONSTRAINT IF EXISTS goals_tenant_id_fkey, ADD CONSTRAINT goals_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.import_jobs DROP CONSTRAINT IF EXISTS import_jobs_tenant_id_fkey, ADD CONSTRAINT import_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.import_skill_links DROP CONSTRAINT IF EXISTS import_skill_links_esco_skill_id_fkey, ADD CONSTRAINT import_skill_links_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.import_skill_links DROP CONSTRAINT IF EXISTS import_skill_links_import_job_id_fkey, ADD CONSTRAINT import_skill_links_import_job_id_fkey FOREIGN KEY (import_job_id) REFERENCES public.import_jobs(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.import_skill_links DROP CONSTRAINT IF EXISTS import_skill_links_tenant_id_fkey, ADD CONSTRAINT import_skill_links_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.industry_ccnl_mapping DROP CONSTRAINT IF EXISTS industry_ccnl_mapping_ccnl_code_fkey, ADD CONSTRAINT industry_ccnl_mapping_ccnl_code_fkey FOREIGN KEY (ccnl_code) REFERENCES public.ccnl_contracts(code) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.industry_classifications DROP CONSTRAINT IF EXISTS industry_classifications_parent_code_fkey, ADD CONSTRAINT industry_classifications_parent_code_fkey FOREIGN KEY (parent_code) REFERENCES public.industry_classifications(code) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.industry_profiles DROP CONSTRAINT IF EXISTS industry_profiles_company_size_code_fkey, ADD CONSTRAINT industry_profiles_company_size_code_fkey FOREIGN KEY (company_size_code) REFERENCES public.company_sizes(code) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.industry_profiles DROP CONSTRAINT IF EXISTS industry_profiles_nace_class_code_fkey, ADD CONSTRAINT industry_profiles_nace_class_code_fkey FOREIGN KEY (nace_class_code) REFERENCES public.industry_classifications(code) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.integrations DROP CONSTRAINT IF EXISTS integrations_tenant_id_fkey, ADD CONSTRAINT integrations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.internal_job_postings DROP CONSTRAINT IF EXISTS internal_job_postings_created_by_fkey_emp, ADD CONSTRAINT internal_job_postings_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.internal_mobility_postings DROP CONSTRAINT IF EXISTS internal_mobility_postings_created_by_fkey, ADD CONSTRAINT internal_mobility_postings_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.internal_mobility_postings DROP CONSTRAINT IF EXISTS internal_mobility_postings_hiring_manager_id_fkey, ADD CONSTRAINT internal_mobility_postings_hiring_manager_id_fkey FOREIGN KEY (hiring_manager_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.internal_mobility_postings DROP CONSTRAINT IF EXISTS internal_mobility_postings_location_id_fkey, ADD CONSTRAINT internal_mobility_postings_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.internal_mobility_postings DROP CONSTRAINT IF EXISTS internal_mobility_postings_org_unit_id_fkey, ADD CONSTRAINT internal_mobility_postings_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.internal_mobility_postings DROP CONSTRAINT IF EXISTS internal_mobility_postings_tenant_id_fkey, ADD CONSTRAINT internal_mobility_postings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.job_analysis DROP CONSTRAINT IF EXISTS job_analysis_analyst_id_fkey, ADD CONSTRAINT job_analysis_analyst_id_fkey FOREIGN KEY (analyst_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_analysis DROP CONSTRAINT IF EXISTS job_analysis_job_family_id_fkey, ADD CONSTRAINT job_analysis_job_family_id_fkey FOREIGN KEY (job_family_id) REFERENCES public.job_families(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_analysis DROP CONSTRAINT IF EXISTS job_analysis_org_unit_id_fkey, ADD CONSTRAINT job_analysis_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.job_analysis DROP CONSTRAINT IF EXISTS job_analysis_tenant_id_fkey, ADD CONSTRAINT job_analysis_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.job_evaluations DROP CONSTRAINT IF EXISTS job_evaluations_evaluated_by_fkey, ADD CONSTRAINT job_evaluations_evaluated_by_fkey FOREIGN KEY (evaluated_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_evaluations DROP CONSTRAINT IF EXISTS job_evaluations_job_analysis_id_fkey, ADD CONSTRAINT job_evaluations_job_analysis_id_fkey FOREIGN KEY (job_analysis_id) REFERENCES public.job_analysis(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.job_evaluations DROP CONSTRAINT IF EXISTS job_evaluations_tenant_id_fkey, ADD CONSTRAINT job_evaluations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_families DROP CONSTRAINT IF EXISTS job_families_parent_id_fkey, ADD CONSTRAINT job_families_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.job_families(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.job_families DROP CONSTRAINT IF EXISTS job_families_tenant_id_fkey, ADD CONSTRAINT job_families_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_market_postings DROP CONSTRAINT IF EXISTS job_market_postings_source_id_fkey, ADD CONSTRAINT job_market_postings_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.job_market_sources(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_postings DROP CONSTRAINT IF EXISTS job_postings_org_unit_id_fkey, ADD CONSTRAINT job_postings_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.job_template_skills DROP CONSTRAINT IF EXISTS job_template_skills_custom_skill_id_fkey, ADD CONSTRAINT job_template_skills_custom_skill_id_fkey FOREIGN KEY (custom_skill_id) REFERENCES public.tenant_custom_skills(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.job_template_skills DROP CONSTRAINT IF EXISTS job_template_skills_skill_id_fkey, ADD CONSTRAINT job_template_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.learning_path_enrollments DROP CONSTRAINT IF EXISTS learning_path_enrollments_enrolled_by_fkey_emp, ADD CONSTRAINT learning_path_enrollments_enrolled_by_fkey_emp FOREIGN KEY (enrolled_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.learning_paths DROP CONSTRAINT IF EXISTS learning_paths_created_by_fkey_emp, ADD CONSTRAINT learning_paths_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.leave_approval_steps DROP CONSTRAINT IF EXISTS leave_approval_steps_approver_id_fkey, ADD CONSTRAINT leave_approval_steps_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.market_salary_data DROP CONSTRAINT IF EXISTS market_salary_data_tenant_id_fkey, ADD CONSTRAINT market_salary_data_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.mentorship_programs DROP CONSTRAINT IF EXISTS mentorship_programs_tenant_id_fkey, ADD CONSTRAINT mentorship_programs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.mentorships DROP CONSTRAINT IF EXISTS mentorships_tenant_id_fkey, ADD CONSTRAINT mentorships_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.merit_cycles DROP CONSTRAINT IF EXISTS merit_cycles_created_by_fkey_emp, ADD CONSTRAINT merit_cycles_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.merit_recommendations DROP CONSTRAINT IF EXISTS merit_recommendations_approved_by_fkey_emp, ADD CONSTRAINT merit_recommendations_approved_by_fkey_emp FOREIGN KEY (approved_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.merit_recommendations DROP CONSTRAINT IF EXISTS merit_recommendations_submitted_by_fkey_emp, ADD CONSTRAINT merit_recommendations_submitted_by_fkey_emp FOREIGN KEY (submitted_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.model_predictions DROP CONSTRAINT IF EXISTS model_predictions_tenant_id_fkey, ADD CONSTRAINT model_predictions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.onboarding_checklist DROP CONSTRAINT IF EXISTS onboarding_checklist_completed_by_fkey_emp, ADD CONSTRAINT onboarding_checklist_completed_by_fkey_emp FOREIGN KEY (completed_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.onboarding_documents DROP CONSTRAINT IF EXISTS onboarding_documents_verified_by_fkey_emp, ADD CONSTRAINT onboarding_documents_verified_by_fkey_emp FOREIGN KEY (verified_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.onboarding_instances DROP CONSTRAINT IF EXISTS onboarding_instances_created_by_fkey_emp, ADD CONSTRAINT onboarding_instances_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.onboarding_instances DROP CONSTRAINT IF EXISTS onboarding_instances_hr_contact_id_fkey_emp, ADD CONSTRAINT onboarding_instances_hr_contact_id_fkey_emp FOREIGN KEY (hr_contact_id_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.onboarding_tasks DROP CONSTRAINT IF EXISTS onboarding_tasks_completed_by_fkey_emp, ADD CONSTRAINT onboarding_tasks_completed_by_fkey_emp FOREIGN KEY (completed_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.onboarding_templates DROP CONSTRAINT IF EXISTS onboarding_templates_created_by_fkey_emp, ADD CONSTRAINT onboarding_templates_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.onet_esco_mappings DROP CONSTRAINT IF EXISTS onet_esco_mappings_esco_occupation_id_fkey, ADD CONSTRAINT onet_esco_mappings_esco_occupation_id_fkey FOREIGN KEY (esco_occupation_id) REFERENCES public.esco_occupations(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.onet_esco_mappings DROP CONSTRAINT IF EXISTS onet_esco_mappings_esco_skill_id_fkey, ADD CONSTRAINT onet_esco_mappings_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.onet_skills DROP CONSTRAINT IF EXISTS onet_skills_esco_skill_id_fkey, ADD CONSTRAINT onet_skills_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.onet_skills DROP CONSTRAINT IF EXISTS onet_skills_mapped_esco_skill_id_fkey, ADD CONSTRAINT onet_skills_mapped_esco_skill_id_fkey FOREIGN KEY (mapped_esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.ontology_categories DROP CONSTRAINT IF EXISTS ontology_categories_parent_id_fkey, ADD CONSTRAINT ontology_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.ontology_categories(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ontology_embedding_jobs DROP CONSTRAINT IF EXISTS ontology_embedding_jobs_tenant_id_fkey, ADD CONSTRAINT ontology_embedding_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.ontology_feedback DROP CONSTRAINT IF EXISTS ontology_feedback_submitted_by_fkey, ADD CONSTRAINT ontology_feedback_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ontology_feedback DROP CONSTRAINT IF EXISTS ontology_feedback_tenant_id_fkey, ADD CONSTRAINT ontology_feedback_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ontology_inference_jobs DROP CONSTRAINT IF EXISTS ontology_inference_jobs_tenant_id_fkey, ADD CONSTRAINT ontology_inference_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.ontology_skill_dimensions DROP CONSTRAINT IF EXISTS ontology_skill_dimensions_esco_skill_id_fkey, ADD CONSTRAINT ontology_skill_dimensions_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.ontology_skill_relations DROP CONSTRAINT IF EXISTS ontology_skill_relations_source_skill_id_fkey, ADD CONSTRAINT ontology_skill_relations_source_skill_id_fkey FOREIGN KEY (source_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.ontology_skill_relations DROP CONSTRAINT IF EXISTS ontology_skill_relations_target_skill_id_fkey, ADD CONSTRAINT ontology_skill_relations_target_skill_id_fkey FOREIGN KEY (target_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.ontology_source_mappings DROP CONSTRAINT IF EXISTS ontology_source_mappings_tenant_id_fkey, ADD CONSTRAINT ontology_source_mappings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.org_scenarios DROP CONSTRAINT IF EXISTS org_scenarios_base_org_unit_id_fkey, ADD CONSTRAINT org_scenarios_base_org_unit_id_fkey FOREIGN KEY (base_org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.org_scenarios DROP CONSTRAINT IF EXISTS org_scenarios_created_by_fkey, ADD CONSTRAINT org_scenarios_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.org_scenarios DROP CONSTRAINT IF EXISTS org_scenarios_tenant_id_fkey, ADD CONSTRAINT org_scenarios_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.performance_predictions DROP CONSTRAINT IF EXISTS performance_predictions_tenant_id_fkey, ADD CONSTRAINT performance_predictions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.performance_reviews DROP CONSTRAINT IF EXISTS performance_reviews_tenant_id_fkey, ADD CONSTRAINT performance_reviews_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.permission_overrides DROP CONSTRAINT IF EXISTS permission_overrides_granted_by_fkey, ADD CONSTRAINT permission_overrides_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.permission_overrides DROP CONSTRAINT IF EXISTS permission_overrides_permission_id_fkey, ADD CONSTRAINT permission_overrides_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.permission_overrides DROP CONSTRAINT IF EXISTS permission_overrides_tenant_id_fkey, ADD CONSTRAINT permission_overrides_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.plugin_api_keys DROP CONSTRAINT IF EXISTS plugin_api_keys_created_by_employee_id_fkey, ADD CONSTRAINT plugin_api_keys_created_by_employee_id_fkey FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugin_api_keys DROP CONSTRAINT IF EXISTS plugin_api_keys_tenant_id_fkey, ADD CONSTRAINT plugin_api_keys_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.plugin_categories DROP CONSTRAINT IF EXISTS plugin_categories_parent_id_fkey, ADD CONSTRAINT plugin_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.plugin_categories(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugin_configurations DROP CONSTRAINT IF EXISTS plugin_configurations_tenant_id_fkey, ADD CONSTRAINT plugin_configurations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.plugin_configurations DROP CONSTRAINT IF EXISTS plugin_configurations_updated_by_employee_id_fkey, ADD CONSTRAINT plugin_configurations_updated_by_employee_id_fkey FOREIGN KEY (updated_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugin_hook_executions DROP CONSTRAINT IF EXISTS plugin_hook_executions_tenant_id_fkey, ADD CONSTRAINT plugin_hook_executions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.plugin_installations DROP CONSTRAINT IF EXISTS plugin_installations_installed_by_employee_id_fkey, ADD CONSTRAINT plugin_installations_installed_by_employee_id_fkey FOREIGN KEY (installed_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.plugin_installations DROP CONSTRAINT IF EXISTS plugin_installations_plugin_version_id_fkey, ADD CONSTRAINT plugin_installations_plugin_version_id_fkey FOREIGN KEY (plugin_version_id) REFERENCES public.plugin_versions(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugin_installations DROP CONSTRAINT IF EXISTS plugin_installations_tenant_id_fkey, ADD CONSTRAINT plugin_installations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugin_reviews DROP CONSTRAINT IF EXISTS plugin_reviews_tenant_id_fkey, ADD CONSTRAINT plugin_reviews_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.plugin_reviews DROP CONSTRAINT IF EXISTS plugin_reviews_user_id_employee_id_fkey, ADD CONSTRAINT plugin_reviews_user_id_employee_id_fkey FOREIGN KEY (user_id_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.plugin_webhooks DROP CONSTRAINT IF EXISTS plugin_webhooks_created_by_employee_id_fkey, ADD CONSTRAINT plugin_webhooks_created_by_employee_id_fkey FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugin_webhooks DROP CONSTRAINT IF EXISTS plugin_webhooks_tenant_id_fkey, ADD CONSTRAINT plugin_webhooks_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.plugins DROP CONSTRAINT IF EXISTS plugins_category_id_fkey, ADD CONSTRAINT plugins_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.plugin_categories(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.plugins DROP CONSTRAINT IF EXISTS plugins_publisher_tenant_id_fkey, ADD CONSTRAINT plugins_publisher_tenant_id_fkey FOREIGN KEY (publisher_tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.position_skill_requirements DROP CONSTRAINT IF EXISTS position_skill_requirements_esco_skill_id_fkey, ADD CONSTRAINT position_skill_requirements_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.preboarding_equipment DROP CONSTRAINT IF EXISTS preboarding_equipment_approved_by_fkey_emp, ADD CONSTRAINT preboarding_equipment_approved_by_fkey_emp FOREIGN KEY (approved_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.preboarding_equipment DROP CONSTRAINT IF EXISTS preboarding_equipment_requested_by_fkey_emp, ADD CONSTRAINT preboarding_equipment_requested_by_fkey_emp FOREIGN KEY (requested_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.preboarding_sessions DROP CONSTRAINT IF EXISTS preboarding_sessions_created_by_fkey_emp, ADD CONSTRAINT preboarding_sessions_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.preboarding_templates DROP CONSTRAINT IF EXISTS preboarding_templates_created_by_fkey_emp, ADD CONSTRAINT preboarding_templates_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.preboarding_welcome_content DROP CONSTRAINT IF EXISTS preboarding_welcome_content_created_by_fkey_emp, ADD CONSTRAINT preboarding_welcome_content_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.predictive_models DROP CONSTRAINT IF EXISTS predictive_models_tenant_id_fkey, ADD CONSTRAINT predictive_models_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.process_roles DROP CONSTRAINT IF EXISTS process_roles_esco_occupation_id_fkey, ADD CONSTRAINT process_roles_esco_occupation_id_fkey FOREIGN KEY (esco_occupation_id) REFERENCES public.esco_occupations(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.process_skill_requirements DROP CONSTRAINT IF EXISTS process_skill_requirements_esco_skill_id_fkey, ADD CONSTRAINT process_skill_requirements_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.rag_documents DROP CONSTRAINT IF EXISTS rag_documents_knowledge_base_id_fkey, ADD CONSTRAINT rag_documents_knowledge_base_id_fkey FOREIGN KEY (knowledge_base_id) REFERENCES public.rag_knowledge_bases(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.rag_documents DROP CONSTRAINT IF EXISTS rag_documents_parent_document_id_fkey, ADD CONSTRAINT rag_documents_parent_document_id_fkey FOREIGN KEY (parent_document_id) REFERENCES public.rag_documents(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.rag_documents DROP CONSTRAINT IF EXISTS rag_documents_uploaded_by_fkey_emp, ADD CONSTRAINT rag_documents_uploaded_by_fkey_emp FOREIGN KEY (uploaded_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.rbp_area_perspectives DROP CONSTRAINT IF EXISTS rbp_area_perspectives_functional_area_id_fkey, ADD CONSTRAINT rbp_area_perspectives_functional_area_id_fkey FOREIGN KEY (functional_area_id) REFERENCES public.rbp_functional_areas(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.rbp_area_perspectives DROP CONSTRAINT IF EXISTS rbp_area_perspectives_perspective_code_fkey, ADD CONSTRAINT rbp_area_perspectives_perspective_code_fkey FOREIGN KEY (perspective_code) REFERENCES public.rbp_perspectives(code) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.rbp_pages DROP CONSTRAINT IF EXISTS rbp_pages_functional_area_code_fkey, ADD CONSTRAINT rbp_pages_functional_area_code_fkey FOREIGN KEY (functional_area_code) REFERENCES public.rbp_functional_areas(code) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.rbp_roles DROP CONSTRAINT IF EXISTS rbp_roles_default_dashboard_code_fkey, ADD CONSTRAINT rbp_roles_default_dashboard_code_fkey FOREIGN KEY (default_dashboard_code) REFERENCES public.rbp_dashboards(code) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.rbp_roles DROP CONSTRAINT IF EXISTS rbp_roles_inherits_from_fkey, ADD CONSTRAINT rbp_roles_inherits_from_fkey FOREIGN KEY (inherits_from) REFERENCES public.rbp_roles(code) ON DELETE RESTRICT;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.rbp_teams DROP CONSTRAINT IF EXISTS rbp_teams_created_by_fkey, ADD CONSTRAINT rbp_teams_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.rbp_teams DROP CONSTRAINT IF EXISTS rbp_teams_tenant_id_fkey, ADD CONSTRAINT rbp_teams_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.recognition DROP CONSTRAINT IF EXISTS recognition_tenant_id_fkey, ADD CONSTRAINT recognition_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.recruiting_candidate_history DROP CONSTRAINT IF EXISTS recruiting_candidate_history_candidate_id_fkey, ADD CONSTRAINT recruiting_candidate_history_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.recruiting_candidates(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.recruiting_candidates DROP CONSTRAINT IF EXISTS recruiting_candidates_requisition_id_fkey, ADD CONSTRAINT recruiting_candidates_requisition_id_fkey FOREIGN KEY (requisition_id) REFERENCES public.recruiting_requisitions(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.recruiting_candidates DROP CONSTRAINT IF EXISTS recruiting_candidates_tenant_id_fkey, ADD CONSTRAINT recruiting_candidates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.recruiting_interview_participants DROP CONSTRAINT IF EXISTS recruiting_interview_participants_user_id_fkey_emp, ADD CONSTRAINT recruiting_interview_participants_user_id_fkey_emp FOREIGN KEY (user_id_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.recruiting_interviews DROP CONSTRAINT IF EXISTS recruiting_interviews_created_by_fkey_emp, ADD CONSTRAINT recruiting_interviews_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.recruiting_offers DROP CONSTRAINT IF EXISTS recruiting_offers_candidate_id_fkey, ADD CONSTRAINT recruiting_offers_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.recruiting_candidates(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.recruiting_offers DROP CONSTRAINT IF EXISTS recruiting_offers_requisition_id_fkey, ADD CONSTRAINT recruiting_offers_requisition_id_fkey FOREIGN KEY (requisition_id) REFERENCES public.recruiting_requisitions(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.recruiting_offers DROP CONSTRAINT IF EXISTS recruiting_offers_tenant_id_fkey, ADD CONSTRAINT recruiting_offers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.recruiting_requisitions DROP CONSTRAINT IF EXISTS recruiting_requisitions_tenant_id_fkey, ADD CONSTRAINT recruiting_requisitions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.report_definitions DROP CONSTRAINT IF EXISTS report_definitions_created_by_fkey_emp, ADD CONSTRAINT report_definitions_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.report_definitions DROP CONSTRAINT IF EXISTS report_definitions_tenant_id_fkey, ADD CONSTRAINT report_definitions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.report_delivery_log DROP CONSTRAINT IF EXISTS report_delivery_log_execution_id_fkey, ADD CONSTRAINT report_delivery_log_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.report_executions(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.report_delivery_log DROP CONSTRAINT IF EXISTS report_delivery_log_tenant_id_fkey, ADD CONSTRAINT report_delivery_log_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.report_executions DROP CONSTRAINT IF EXISTS report_executions_executed_by_fkey_emp, ADD CONSTRAINT report_executions_executed_by_fkey_emp FOREIGN KEY (executed_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.report_subscriptions DROP CONSTRAINT IF EXISTS report_subscriptions_tenant_id_fkey, ADD CONSTRAINT report_subscriptions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_tenant_id_fkey, ADD CONSTRAINT role_permissions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.role_skill_requirements DROP CONSTRAINT IF EXISTS role_skill_requirements_created_by_fkey, ADD CONSTRAINT role_skill_requirements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.role_skill_requirements DROP CONSTRAINT IF EXISTS role_skill_requirements_skill_id_fkey, ADD CONSTRAINT role_skill_requirements_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.role_skill_requirements DROP CONSTRAINT IF EXISTS role_skill_requirements_updated_by_fkey, ADD CONSTRAINT role_skill_requirements_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.salary_band_assignments DROP CONSTRAINT IF EXISTS salary_band_assignments_assigned_by_fkey_emp, ADD CONSTRAINT salary_band_assignments_assigned_by_fkey_emp FOREIGN KEY (assigned_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.salary_band_assignments DROP CONSTRAINT IF EXISTS salary_band_assignments_band_id_fkey, ADD CONSTRAINT salary_band_assignments_band_id_fkey FOREIGN KEY (band_id) REFERENCES public.salary_bands(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.salary_bands DROP CONSTRAINT IF EXISTS salary_bands_created_by_fkey_emp, ADD CONSTRAINT salary_bands_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.salary_bands DROP CONSTRAINT IF EXISTS salary_bands_tenant_id_fkey, ADD CONSTRAINT salary_bands_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.salary_history DROP CONSTRAINT IF EXISTS salary_history_approved_by_fkey, ADD CONSTRAINT salary_history_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.salary_history DROP CONSTRAINT IF EXISTS salary_history_contract_id_fkey, ADD CONSTRAINT salary_history_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE RESTRICT;
-- [Payroll/RESTRICT] Financial audit trail
ALTER TABLE public.salary_history DROP CONSTRAINT IF EXISTS salary_history_employee_id_fkey, ADD CONSTRAINT salary_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.salary_history DROP CONSTRAINT IF EXISTS salary_history_tenant_id_fkey, ADD CONSTRAINT salary_history_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_tenant_id_fkey, ADD CONSTRAINT saved_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.signature_requests DROP CONSTRAINT IF EXISTS signature_requests_created_by_fkey_emp, ADD CONSTRAINT signature_requests_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_adjacencies DROP CONSTRAINT IF EXISTS skill_adjacencies_adjacent_skill_id_fkey, ADD CONSTRAINT skill_adjacencies_adjacent_skill_id_fkey FOREIGN KEY (adjacent_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_adjacencies DROP CONSTRAINT IF EXISTS skill_adjacencies_skill_id_fkey, ADD CONSTRAINT skill_adjacencies_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_aliases DROP CONSTRAINT IF EXISTS skill_aliases_esco_skill_id_fkey, ADD CONSTRAINT skill_aliases_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.skill_classifications DROP CONSTRAINT IF EXISTS skill_classifications_classified_by_fkey, ADD CONSTRAINT skill_classifications_classified_by_fkey FOREIGN KEY (classified_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_classifications DROP CONSTRAINT IF EXISTS skill_classifications_esco_skill_id_fkey, ADD CONSTRAINT skill_classifications_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_demand_metrics DROP CONSTRAINT IF EXISTS skill_demand_metrics_esco_skill_id_fkey, ADD CONSTRAINT skill_demand_metrics_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.skill_gap_analyses DROP CONSTRAINT IF EXISTS skill_gap_analyses_created_by_employee_id_fkey, ADD CONSTRAINT skill_gap_analyses_created_by_employee_id_fkey FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.skill_gap_snapshots DROP CONSTRAINT IF EXISTS skill_gap_snapshots_created_by_employee_id_fkey, ADD CONSTRAINT skill_gap_snapshots_created_by_employee_id_fkey FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.skill_migration_jobs DROP CONSTRAINT IF EXISTS skill_migration_jobs_tenant_id_fkey, ADD CONSTRAINT skill_migration_jobs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_pair_usage DROP CONSTRAINT IF EXISTS skill_pair_usage_skill_id_1_fkey, ADD CONSTRAINT skill_pair_usage_skill_id_1_fkey FOREIGN KEY (skill_id_1) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_pair_usage DROP CONSTRAINT IF EXISTS skill_pair_usage_skill_id_2_fkey, ADD CONSTRAINT skill_pair_usage_skill_id_2_fkey FOREIGN KEY (skill_id_2) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_relationships DROP CONSTRAINT IF EXISTS skill_relationships_source_skill_id_fkey, ADD CONSTRAINT skill_relationships_source_skill_id_fkey FOREIGN KEY (source_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_relationships DROP CONSTRAINT IF EXISTS skill_relationships_target_skill_id_fkey, ADD CONSTRAINT skill_relationships_target_skill_id_fkey FOREIGN KEY (target_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.skill_relationships DROP CONSTRAINT IF EXISTS skill_relationships_validated_by_fkey, ADD CONSTRAINT skill_relationships_validated_by_fkey FOREIGN KEY (validated_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.skill_requirements_templates DROP CONSTRAINT IF EXISTS skill_requirements_templates_org_unit_id_fkey, ADD CONSTRAINT skill_requirements_templates_org_unit_id_fkey FOREIGN KEY (org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_requirements_templates DROP CONSTRAINT IF EXISTS skill_requirements_templates_skill_id_fkey, ADD CONSTRAINT skill_requirements_templates_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_supply_metrics DROP CONSTRAINT IF EXISTS skill_supply_metrics_esco_skill_id_fkey, ADD CONSTRAINT skill_supply_metrics_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_synonyms DROP CONSTRAINT IF EXISTS skill_synonyms_esco_skill_id_fkey, ADD CONSTRAINT skill_synonyms_esco_skill_id_fkey FOREIGN KEY (esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.skill_taxonomy_extensions DROP CONSTRAINT IF EXISTS skill_taxonomy_extensions_approved_by_fkey, ADD CONSTRAINT skill_taxonomy_extensions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.skill_taxonomy_extensions DROP CONSTRAINT IF EXISTS skill_taxonomy_extensions_skill_id_fkey, ADD CONSTRAINT skill_taxonomy_extensions_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.skill_taxonomy_extensions DROP CONSTRAINT IF EXISTS skill_taxonomy_extensions_tenant_id_fkey, ADD CONSTRAINT skill_taxonomy_extensions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.social_comments DROP CONSTRAINT IF EXISTS social_comments_parent_comment_id_fkey, ADD CONSTRAINT social_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.social_comments(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.social_likes DROP CONSTRAINT IF EXISTS social_likes_comment_id_fkey, ADD CONSTRAINT social_likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.social_comments(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.sso_configurations DROP CONSTRAINT IF EXISTS sso_configurations_created_by_fkey_emp, ADD CONSTRAINT sso_configurations_created_by_fkey_emp FOREIGN KEY (created_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.sso_login_attempts DROP CONSTRAINT IF EXISTS sso_login_attempts_config_id_fkey, ADD CONSTRAINT sso_login_attempts_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.sso_configurations(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.surveys DROP CONSTRAINT IF EXISTS surveys_tenant_id_fkey, ADD CONSTRAINT surveys_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.sync_log DROP CONSTRAINT IF EXISTS sync_log_tenant_id_fkey, ADD CONSTRAINT sync_log_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.sync_queue DROP CONSTRAINT IF EXISTS sync_queue_tenant_id_fkey, ADD CONSTRAINT sync_queue_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.tenant_custom_skills DROP CONSTRAINT IF EXISTS tenant_custom_skills_base_esco_skill_id_fkey, ADD CONSTRAINT tenant_custom_skills_base_esco_skill_id_fkey FOREIGN KEY (base_esco_skill_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.tenant_custom_skills DROP CONSTRAINT IF EXISTS tenant_custom_skills_category_id_fkey, ADD CONSTRAINT tenant_custom_skills_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.ontology_categories(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.tenant_custom_skills DROP CONSTRAINT IF EXISTS tenant_custom_skills_superseded_by_fkey, ADD CONSTRAINT tenant_custom_skills_superseded_by_fkey FOREIGN KEY (superseded_by) REFERENCES public.tenant_custom_skills(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.tenant_industry_classifications DROP CONSTRAINT IF EXISTS tenant_industry_classifications_classification_code_fkey, ADD CONSTRAINT tenant_industry_classifications_classification_code_fkey FOREIGN KEY (classification_code) REFERENCES public.industry_classifications(code) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.tenant_jobs DROP CONSTRAINT IF EXISTS tenant_jobs_tenant_org_unit_id_fkey, ADD CONSTRAINT tenant_jobs_tenant_org_unit_id_fkey FOREIGN KEY (tenant_org_unit_id) REFERENCES public.tenant_org_units(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.tenant_schema_version DROP CONSTRAINT IF EXISTS tenant_schema_version_applied_by_fkey, ADD CONSTRAINT tenant_schema_version_applied_by_fkey FOREIGN KEY (applied_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.tenants DROP CONSTRAINT IF EXISTS tenants_industry_profile_id_fkey, ADD CONSTRAINT tenants_industry_profile_id_fkey FOREIGN KEY (industry_profile_id) REFERENCES public.industry_profiles(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.tenants_books DROP CONSTRAINT IF EXISTS tenants_books_approved_by_fkey_emp, ADD CONSTRAINT tenants_books_approved_by_fkey_emp FOREIGN KEY (approved_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.turnover_risk_scores DROP CONSTRAINT IF EXISTS turnover_risk_scores_tenant_id_fkey, ADD CONSTRAINT turnover_risk_scores_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.unknown_skills DROP CONSTRAINT IF EXISTS unknown_skills_mapped_to_esco_id_fkey, ADD CONSTRAINT unknown_skills_mapped_to_esco_id_fkey FOREIGN KEY (mapped_to_esco_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Employee-ref/SET NULL] Default for non-primary employee link
ALTER TABLE public.unknown_skills DROP CONSTRAINT IF EXISTS unknown_skills_reviewed_by_employee_id_fkey, ADD CONSTRAINT unknown_skills_reviewed_by_employee_id_fkey FOREIGN KEY (reviewed_by_employee_id) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.unknown_skills DROP CONSTRAINT IF EXISTS unknown_skills_suggested_esco_id_fkey, ADD CONSTRAINT unknown_skills_suggested_esco_id_fkey FOREIGN KEY (suggested_esco_id) REFERENCES public.esco_skills(id) ON DELETE RESTRICT;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.user_pernr_mapping DROP CONSTRAINT IF EXISTS fk_bukrs, ADD CONSTRAINT fk_bukrs FOREIGN KEY (bukrs) REFERENCES public.t500c(bukrs) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.user_workspaces DROP CONSTRAINT IF EXISTS user_workspaces_tenant_id_fkey, ADD CONSTRAINT user_workspaces_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.user_workspaces DROP CONSTRAINT IF EXISTS user_workspaces_user_id_fkey, ADD CONSTRAINT user_workspaces_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.webhooks DROP CONSTRAINT IF EXISTS webhooks_tenant_id_fkey, ADD CONSTRAINT webhooks_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.wellbeing_checkins DROP CONSTRAINT IF EXISTS wellbeing_checkins_tenant_id_fkey, ADD CONSTRAINT wellbeing_checkins_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.wellbeing_goals DROP CONSTRAINT IF EXISTS wellbeing_goals_tenant_id_fkey, ADD CONSTRAINT wellbeing_goals_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.wellbeing_program_enrollments DROP CONSTRAINT IF EXISTS wellbeing_program_enrollments_resource_id_fkey, ADD CONSTRAINT wellbeing_program_enrollments_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.wellbeing_resources(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.wellbeing_program_enrollments DROP CONSTRAINT IF EXISTS wellbeing_program_enrollments_tenant_id_fkey, ADD CONSTRAINT wellbeing_program_enrollments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.wellbeing_resources DROP CONSTRAINT IF EXISTS wellbeing_resources_tenant_id_fkey, ADD CONSTRAINT wellbeing_resources_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Whistleblowing/RESTRICT] Sensitive data, retain forever
ALTER TABLE public.whistleblowing_audit_log DROP CONSTRAINT IF EXISTS whistleblowing_audit_log_user_id_fkey_emp, ADD CONSTRAINT whistleblowing_audit_log_user_id_fkey_emp FOREIGN KEY (user_id_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Whistleblowing/RESTRICT] Sensitive data, retain forever
ALTER TABLE public.whistleblowing_reports DROP CONSTRAINT IF EXISTS whistleblowing_reports_assigned_to_fkey_emp, ADD CONSTRAINT whistleblowing_reports_assigned_to_fkey_emp FOREIGN KEY (assigned_to_employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.widget_catalog DROP CONSTRAINT IF EXISTS widget_catalog_functional_area_code_fkey, ADD CONSTRAINT widget_catalog_functional_area_code_fkey FOREIGN KEY (functional_area_code) REFERENCES public.rbp_functional_areas(code) ON DELETE RESTRICT;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.widget_catalog DROP CONSTRAINT IF EXISTS widget_catalog_perspective_code_fkey, ADD CONSTRAINT widget_catalog_perspective_code_fkey FOREIGN KEY (perspective_code) REFERENCES public.rbp_perspectives(code) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.widget_templates DROP CONSTRAINT IF EXISTS widget_templates_tenant_id_fkey, ADD CONSTRAINT widget_templates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.workforce_plan_actions DROP CONSTRAINT IF EXISTS workforce_plan_actions_scenario_id_fkey, ADD CONSTRAINT workforce_plan_actions_scenario_id_fkey FOREIGN KEY (scenario_id) REFERENCES public.workforce_plan_scenarios(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.workforce_plan_actions DROP CONSTRAINT IF EXISTS workforce_plan_actions_target_org_unit_id_fkey, ADD CONSTRAINT workforce_plan_actions_target_org_unit_id_fkey FOREIGN KEY (target_org_unit_id) REFERENCES public.org_units(id) ON DELETE CASCADE;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.workforce_plan_actions DROP CONSTRAINT IF EXISTS workforce_plan_actions_tenant_id_fkey, ADD CONSTRAINT workforce_plan_actions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.workforce_plan_actions DROP CONSTRAINT IF EXISTS workforce_plan_actions_workforce_plan_id_fkey, ADD CONSTRAINT workforce_plan_actions_workforce_plan_id_fkey FOREIGN KEY (workforce_plan_id) REFERENCES public.workforce_plans(id) ON DELETE CASCADE;
-- [Employee-ref/SET NULL] Preserve subordinate row, employee delete sets NULL
ALTER TABLE public.workforce_plan_scenarios DROP CONSTRAINT IF EXISTS workforce_plan_scenarios_created_by_fkey, ADD CONSTRAINT workforce_plan_scenarios_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.employees(id) ON DELETE SET NULL;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.workforce_plan_scenarios DROP CONSTRAINT IF EXISTS workforce_plan_scenarios_tenant_id_fkey, ADD CONSTRAINT workforce_plan_scenarios_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.workforce_plan_scenarios DROP CONSTRAINT IF EXISTS workforce_plan_scenarios_workforce_plan_id_fkey, ADD CONSTRAINT workforce_plan_scenarios_workforce_plan_id_fkey FOREIGN KEY (workforce_plan_id) REFERENCES public.workforce_plans(id) ON DELETE CASCADE;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.workforce_plans DROP CONSTRAINT IF EXISTS workforce_plans_created_by_fkey, ADD CONSTRAINT workforce_plans_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [User-ref/SET NULL] User delete preserves dependent rows
ALTER TABLE public.workforce_plans DROP CONSTRAINT IF EXISTS workforce_plans_updated_by_fkey, ADD CONSTRAINT workforce_plans_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;
-- [Catalog/RESTRICT] Enum-like reference catalog
ALTER TABLE public.workspace_templates DROP CONSTRAINT IF EXISTS workspace_templates_target_role_id_fkey, ADD CONSTRAINT workspace_templates_target_role_id_fkey FOREIGN KEY (target_role_id) REFERENCES public.rbp_roles(id) ON DELETE RESTRICT;
-- [Tenant/CASCADE] Tenant nuke = full subtree cleanup
ALTER TABLE public.workspace_templates DROP CONSTRAINT IF EXISTS workspace_templates_tenant_id_fkey, ADD CONSTRAINT workspace_templates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
-- [Default/CASCADE] Tenant-scoped subtree cleanup default
ALTER TABLE public.workspace_widgets DROP CONSTRAINT IF EXISTS workspace_widgets_widget_catalog_id_fkey, ADD CONSTRAINT workspace_widgets_widget_catalog_id_fkey FOREIGN KEY (widget_catalog_id) REFERENCES public.widget_catalog(id) ON DELETE CASCADE;

-- Post-apply assertion: 0 FK left with confdeltype=a (NO ACTION default)
DO $$
DECLARE v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count FROM pg_constraint con
  JOIN pg_class t ON con.conrelid = t.oid AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='public')
  WHERE con.contype='f' AND con.confdeltype='a';
  IF v_count != 0 THEN RAISE EXCEPTION 'phase16m: % FK still NO ACTION (default)', v_count; END IF;
  RAISE NOTICE 'phase16m: 0 FK NO ACTION default. % FK explicitly tagged.', 310;
END $$;

COMMIT;
