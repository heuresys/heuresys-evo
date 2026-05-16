# Views & Materialized Views

> Schema `public` · 110 view · 6 materialized view.

Le view sono **derivate** dalle tabelle: non importarle come tabelle nel DBMS target, ricostruirle dopo aver importato le sorgenti.

## Views

### `attendance_records`

```sql
SELECT id,
    tenant_id,
    employee_id,
    attendance_date,
    clock_in,
    clock_out,
    hours_regular,
    hours_overtime,
    hours_total AS hours_worked,
    status,
    source,
    notes,
    is_validated,
    created_at,
    updated_at
   FROM employee_attendance;
```

### `branches`

```sql
SELECT id,
    tenant_id,
    name,
    code,
    address,
    city,
    country,
        CASE
            WHEN ((location_type)::text = 'headquarters'::text) THEN true
            ELSE false
        END AS is_headquarters,
    sap_werks,
    sap_btrtl AS sap_bukrs,
    sap_name1 AS sap_butxt,
    sap_land1,
    sap_ort01,
    sap_sync_date,
    (created_at)::timestamp without time zone AS created_at,
    (updated_at)::timestamp without time zone AS updated_at
   FROM locations;
```

### `employees`

```sql
SELECT e.id,
    e.tenant_id,
    p.first_name,
    p.last_name,
    p.email,
    h.job_title,
    h.department,
    h.location,
    h.manager_id,
    h.hire_date,
    e.skills,
    h.performance_rating,
    h.potential,
    e.is_active,
    e.created_at,
    e.updated_at,
    e.pernr,
    p.birth_date,
    p.gender,
    p.nationality,
    pa.salary,
    pa.currency,
    h.cost_center,
    h.employee_group,
    h.employee_subgroup,
    h.position_id,
    h.legacy_org_unit_code,
    h.cost_center_id,
    h.org_unit_id,
    p.middle_name,
    p.birth_place,
    p.marital_status,
    p.address_street,
    p.address_city,
    p.address_postal_code,
    p.address_country,
    p.address_region,
    p.temp_address_street,
    p.temp_address_city,
    p.temp_address_postal_code,
    p.temp_address_country,
    pa.pay_scale_area,
    pa.pay_scale_type,
    pa.pay_scale_group,
    pa.pay_scale_level,
    pa.pay_periods_per_year,
    h.work_schedule_percentage,
    pa.iban,
    pa.swift_bic,
    pa.bank_name,
    pa.bank_account_number,
    p.phone_mobile,
    p.phone_work,
    p.phone_home,
    p.personal_email,
    p.tax_id,
    p.national_id,
    p.national_id_expiry,
    p.passport_number,
    p.passport_expiry,
    p.driver_license,
    p.driver_license_expiry,
    h.probation_end_date,
    h.seniority_date,
    h.contract_end_date,
    p.emergency_contact_name,
    p.emergency_contact_phone,
    p.emergency_contact_relationship,
    p.family_members,
    p.education_history,
    p.highest_education_level,
    p.highest_education_institution,
    p.highest_education_field,
    p.highest_education_year,
    h.company_code,
    h.personnel_area,
    h.personnel_subarea,
    e.employment_status,
    e.termination_date,
    e.termination_reason,
    h.auth_username,
    h.auth_password_hash,
    h.auth_role,
    h.auth_permissions,
    h.auth_last_login,
    h.auth_username_candidate,
    h.location_id,
    e.profile_embedding,
    e.embedding_text_hash,
    e.embedding_model,
    e.embedding_generated_at,
    e.deleted_at,
    e.enrichment_consent,
    e.enrichment_consent_at,
    e.enrichment_consent_scope
   FROM (((employees_core e
     LEFT JOIN employees_pii p ON ((p.employee_id = e.id)))
     LEFT JOIN employees_hr h ON ((h.employee_id = e.id)))
     LEFT JOIN employees_payroll pa ON ((pa.employee_id = e.id)));
```

### `employees_full`

```sql
SELECT e.id,
    e.tenant_id,
    e.first_name,
    e.last_name,
    e.email,
    e.job_title,
    e.department,
    e.location,
    e.manager_id,
    e.hire_date,
    e.skills,
    e.performance_rating,
    e.potential,
    e.is_active,
    e.created_at,
    e.updated_at,
    e.pernr,
    e.birth_date,
    e.gender,
    e.nationality,
    e.salary,
    e.currency,
    e.cost_center,
    e.employee_group,
    e.employee_subgroup,
    e.position_id,
    e.legacy_org_unit_code,
    e.cost_center_id,
    e.org_unit_id,
    e.middle_name,
    e.birth_place,
    e.marital_status,
    e.address_street,
    e.address_city,
    e.address_postal_code,
    e.address_country,
    e.address_region,
    e.temp_address_street,
    e.temp_address_city,
    e.temp_address_postal_code,
    e.temp_address_country,
    e.pay_scale_area,
    e.pay_scale_type,
    e.pay_scale_group,
    e.pay_scale_level,
    e.pay_periods_per_year,
    e.work_schedule_percentage,
    e.iban,
    e.swift_bic,
    e.bank_name,
    e.bank_account_number,
    e.phone_mobile,
    e.phone_work,
    e.phone_home,
    e.personal_email,
    e.tax_id,
    e.national_id,
    e.national_id_expiry,
    e.passport_number,
    e.passport_expiry,
    e.driver_license,
    e.driver_license_expiry,
    e.probation_end_date,
    e.seniority_date,
    e.contract_end_date,
    e.emergency_contact_name,
    e.emergency_contact_phone,
    e.emergency_contact_relationship,
    e.family_members,
    e.education_history,
    e.highest_education_level,
    e.highest_education_institution,
    e.highest_education_field,
    e.highest_education_year,
    e.company_code,
    e.personnel_area,
    e.personnel_subarea,
    e.employment_status,
    e.termination_date,
    e.termination_reason,
    e.auth_username,
    e.auth_password_hash,
    e.auth_role,
    e.auth_permissions,
    e.auth_last_login,
    e.auth_username_candidate,
    e.location_id,
    e.profile_embedding,
    e.embedding_text_hash,
    e.embedding_model,
    e.embedding_generated_at,
    e.deleted_at,
    e.enrichment_consent,
    e.enrichment_consent_at,
    e.enrichment_consent_scope,
    pii.first_name AS pii_first_name,
    pii.last_name AS pii_last_name,
    hr.job_title AS hr_job_title,
    hr.department AS hr_department,
    pay.salary AS pay_salary,
    pay.currency AS pay_currency
   FROM (((employees e
     LEFT JOIN employees_pii pii ON ((pii.employee_id = e.id)))
     LEFT JOIN employees_hr hr ON ((hr.employee_id = e.id)))
     LEFT JOIN employees_payroll pay ON ((pay.employee_id = e.id)));
```

### `error_stats`

```sql
SELECT date_trunc('day'::text, created_at) AS date,
    tenant_id,
    category,
    severity,
    count(*) AS error_count,
    count(DISTINCT code) AS unique_codes,
    count(DISTINCT user_id) AS affected_users
   FROM error_logs
  WHERE (created_at >= (now() - '30 days'::interval))
  GROUP BY (date_trunc('day'::text, created_at)), tenant_id, category, severity;
```

### `goal_hierarchy`

```sql
WITH RECURSIVE goal_tree AS (
         SELECT g.id,
            g.tenant_id,
            g.title,
            g.status,
            g.progress_percent,
            g.parent_goal_id,
            g.employee_id,
            1 AS depth,
            ARRAY[g.id] AS path,
            g.title AS root_title
           FROM goals g
          WHERE (g.parent_goal_id IS NULL)
        UNION ALL
         SELECT g.id,
            g.tenant_id,
            g.title,
            g.status,
            g.progress_percent,
            g.parent_goal_id,
            g.employee_id,
            (gt.depth + 1),
            (gt.path || g.id),
            gt.root_title
           FROM (goals g
             JOIN goal_tree gt ON ((g.parent_goal_id = gt.id)))
        )
 SELECT id,
    tenant_id,
    title,
    status,
    progress_percent,
    parent_goal_id,
    employee_id,
    depth,
    path,
    root_title
   FROM goal_tree;
```

### `leave_balances`

```sql
SELECT id,
    tenant_id,
    employee_id,
    leave_type,
    total_days AS balance,
    used_days,
    pending_days,
    year,
    carryover_days,
    carryover_expires_at,
    accrued_days,
    adjustment_days,
    created_at,
    updated_at
   FROM employee_time_off_balances;
```

### `leave_requests`

```sql
SELECT id,
    tenant_id,
    employee_id,
    leave_type,
    start_date,
    end_date,
    days_requested,
    reason,
    status,
    approver_id,
    approved_at,
    rejection_reason,
    half_day_start,
    half_day_end,
    medical_certificate_required,
    cancellation_requested,
    cancellation_reason,
    created_at,
    updated_at
   FROM employee_time_off_requests;
```

### `nine_box_grid`

```sql
SELECT pr.tenant_id,
    pr.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    d.name AS department,
    pr.overall_rating,
    pr.potential_rating,
    pr.performance_box,
    pr.potential_box,
        CASE
            WHEN ((pr.performance_box = 3) AND (pr.potential_box = 3)) THEN 'Star'::text
            WHEN ((pr.performance_box = 3) AND (pr.potential_box = 2)) THEN 'High Performer'::text
            WHEN ((pr.performance_box = 3) AND (pr.potential_box = 1)) THEN 'Consistent Performer'::text
            WHEN ((pr.performance_box = 2) AND (pr.potential_box = 3)) THEN 'High Potential'::text
            WHEN ((pr.performance_box = 2) AND (pr.potential_box = 2)) THEN 'Core Player'::text
            WHEN ((pr.performance_box = 2) AND (pr.potential_box = 1)) THEN 'Solid Performer'::text
            WHEN ((pr.performance_box = 1) AND (pr.potential_box = 3)) THEN 'Rough Diamond'::text
            WHEN ((pr.performance_box = 1) AND (pr.potential_box = 2)) THEN 'Inconsistent'::text
            WHEN ((pr.performance_box = 1) AND (pr.potential_box = 1)) THEN 'Risk'::text
            ELSE 'Not Rated'::text
        END AS nine_box_category,
    pr.review_cycle_id
   FROM ((performance_reviews pr
     JOIN employees e ON ((pr.employee_id = e.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
  WHERE (((pr.status)::text = 'completed'::text) AND (pr.performance_box IS NOT NULL) AND (pr.potential_box IS NOT NULL));
```

### `recent_errors`

```sql
SELECT el.id,
    el.error_id,
    el.code,
    el.category,
    el.severity,
    el.message,
    el.http_status,
    el.request_method,
    el.request_path,
    el.tenant_id,
    t.name AS tenant_name,
    el.user_id,
    u.username,
    el.created_at
   FROM ((error_logs el
     LEFT JOIN tenants t ON ((el.tenant_id = t.id)))
     LEFT JOIN users u ON ((el.user_id = u.id)))
  WHERE (el.created_at >= (now() - '24:00:00'::interval))
  ORDER BY el.created_at DESC;
```

### `total_compensation_tenant_aggregated`

```sql
SELECT id AS tenant_id,
    COALESCE(( SELECT sum(sba.current_salary) AS sum
           FROM (salary_band_assignments sba
             JOIN employees e ON ((e.id = sba.employee_id)))
          WHERE ((e.tenant_id = t.id) AND (e.deleted_at IS NULL) AND (e.is_active = true))), (0)::numeric) AS base_payroll_eur,
    COALESCE(( SELECT sum(bp.total_budget) AS sum
           FROM bonus_plans bp
          WHERE ((bp.tenant_id = t.id) AND ((bp.status)::text = 'active'::text))), (0)::numeric) AS bonus_pool_eur,
    COALESCE(( SELECT sum(eg.fair_value) AS sum
           FROM equity_grants eg
          WHERE ((eg.tenant_id = t.id) AND (eg.status = 'active'::text))), (0)::numeric) AS equity_active_eur
   FROM tenants t
  WHERE ((status)::text = 'active'::text);
```

### `v_360_feedback_summary`

```sql
SELECT f.tenant_id,
    f.target_employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    f.review_cycle_id,
    rc.name AS cycle_name,
    f.relationship_type,
    count(*) AS response_count,
    round(avg(f.overall_rating), 2) AS avg_rating,
    round(stddev(f.overall_rating), 2) AS rating_stddev,
    round(avg(f.sentiment_score), 2) AS avg_sentiment,
        CASE
            WHEN (count(*) >= COALESCE(rc.feedback_360_min_responses, 3)) THEN jsonb_build_object('min_rating', min(f.overall_rating), 'max_rating', max(f.overall_rating), 'median_rating', percentile_cont((0.5)::double precision) WITHIN GROUP (ORDER BY ((f.overall_rating)::double precision)))
            ELSE NULL::jsonb
        END AS rating_distribution
   FROM ((feedback_360 f
     JOIN employees e ON ((f.target_employee_id = e.id)))
     LEFT JOIN review_cycles rc ON ((f.review_cycle_id = rc.id)))
  WHERE ((f.status)::text = 'completed'::text)
  GROUP BY f.tenant_id, f.target_employee_id, e.first_name, e.last_name, f.review_cycle_id, rc.name, f.relationship_type, rc.feedback_360_min_responses;
```

### `v_360_response_rates`

```sql
SELECT rc.id AS review_cycle_id,
    rc.tenant_id,
    rc.name AS cycle_name,
    count(DISTINCT fr.id) AS total_requests,
    count(DISTINCT
        CASE
            WHEN ((fr.status)::text = 'completed'::text) THEN fr.id
            ELSE NULL::uuid
        END) AS completed_requests,
    round((((count(DISTINCT
        CASE
            WHEN ((fr.status)::text = 'completed'::text) THEN fr.id
            ELSE NULL::uuid
        END))::numeric / (NULLIF(count(DISTINCT fr.id), 0))::numeric) * (100)::numeric), 2) AS response_rate,
    count(DISTINCT fr.requestee_id) AS total_employees,
    count(DISTINCT
        CASE
            WHEN ((fr.status)::text = 'pending'::text) THEN fr.reviewer_id
            ELSE NULL::uuid
        END) AS pending_reviewers,
    avg(
        CASE
            WHEN (f.id IS NOT NULL) THEN f.overall_rating
            ELSE NULL::numeric
        END) AS avg_rating
   FROM ((review_cycles rc
     LEFT JOIN feedback_requests fr ON ((rc.id = fr.review_cycle_id)))
     LEFT JOIN feedback_360 f ON ((fr.feedback_360_id = f.id)))
  WHERE (rc.include_360_feedback = true)
  GROUP BY rc.id, rc.tenant_id, rc.name;
```

### `v_active_job_postings`

```sql
SELECT j.id,
    j.tenant_id,
    j.title,
    j.department,
    j.team,
    j.location,
    j.work_type,
    j.summary,
    j.responsibilities,
    j.requirements,
    j.nice_to_have,
    j.job_level,
    j.job_family,
    j.salary_min,
    j.salary_max,
    j.currency,
    j.show_salary,
    j.status,
    j.visibility,
    j.min_tenure_months,
    j.min_rating,
    j.required_skills,
    j.posted_at,
    j.expires_at,
    j.target_start_date,
    j.hiring_manager_id,
    j.hr_contact_id,
    j.views_count,
    j.applications_count,
    j.created_by,
    j.created_at,
    j.updated_at,
    COALESCE(a.app_count, (0)::bigint) AS application_count,
    COALESCE(v.view_count, (0)::bigint) AS view_count,
    (((hm.first_name)::text || ' '::text) || (hm.last_name)::text) AS hiring_manager_name,
    (((hr.first_name)::text || ' '::text) || (hr.last_name)::text) AS hr_contact_name
   FROM ((((internal_job_postings j
     LEFT JOIN ( SELECT internal_applications.job_posting_id,
            count(*) AS app_count
           FROM internal_applications
          WHERE ((internal_applications.status)::text <> ALL (ARRAY[('draft'::character varying)::text, ('withdrawn'::character varying)::text]))
          GROUP BY internal_applications.job_posting_id) a ON ((j.id = a.job_posting_id)))
     LEFT JOIN ( SELECT internal_job_views.job_posting_id,
            count(*) AS view_count
           FROM internal_job_views
          GROUP BY internal_job_views.job_posting_id) v ON ((j.id = v.job_posting_id)))
     LEFT JOIN employees hm ON ((j.hiring_manager_id = hm.id)))
     LEFT JOIN employees hr ON ((j.hr_contact_id = hr.id)))
  WHERE (((j.status)::text = 'open'::text) AND ((j.expires_at IS NULL) OR (j.expires_at > now())));
```

### `v_ai_daily_costs`

```sql
SELECT date(created_at) AS date,
    provider,
    model,
    operation,
    count(*) AS request_count,
    sum(total_tokens) AS total_tokens,
    sum(cost) AS total_cost,
    avg(latency_ms) AS avg_latency_ms,
    sum(
        CASE
            WHEN success THEN 1
            ELSE 0
        END) AS success_count,
    sum(
        CASE
            WHEN (NOT success) THEN 1
            ELSE 0
        END) AS error_count
   FROM ai_usage_log
  GROUP BY (date(created_at)), provider, model, operation
  ORDER BY (date(created_at)) DESC, provider, model;
```

### `v_ai_monthly_costs`

```sql
SELECT date_trunc('month'::text, created_at) AS month,
    provider,
    count(*) AS request_count,
    sum(total_tokens) AS total_tokens,
    sum(cost) AS total_cost,
    avg(latency_ms) AS avg_latency_ms,
    round((((sum(
        CASE
            WHEN success THEN 1
            ELSE 0
        END))::numeric / (count(*))::numeric) * (100)::numeric), 2) AS success_rate
   FROM ai_usage_log
  GROUP BY (date_trunc('month'::text, created_at)), provider
  ORDER BY (date_trunc('month'::text, created_at)) DESC, provider;
```

### `v_ai_tenant_costs`

```sql
SELECT t.code AS tenant_code,
    t.name AS tenant_name,
    aul.provider,
    count(*) AS request_count,
    sum(aul.total_tokens) AS total_tokens,
    sum(aul.cost) AS total_cost
   FROM (ai_usage_log aul
     JOIN tenants t ON ((t.id = aul.tenant_id)))
  GROUP BY t.id, t.code, t.name, aul.provider
  ORDER BY (sum(aul.cost)) DESC;
```

### `v_applicant_pipeline`

```sql
SELECT pb.aplnr,
    (((pb.nachn)::text || ', '::text) || (pb.vorna)::text) AS applicant_name,
    pb.email,
    pb.source_channel,
    pa.stat2 AS status,
    va.vacancy_id,
    va.assignment_status,
    va.position_id,
    count(DISTINCT act.activity_id) AS activities_count,
    max(act.activity_date) AS last_activity_date,
    ev.overall_score AS latest_score,
    ev.recommendation
   FROM ((((pb0002 pb
     LEFT JOIN pb0001 pa ON ((((pb.aplnr)::text = (pa.aplnr)::text) AND (pa.endda = '9999-12-31'::date))))
     LEFT JOIN pb4001 va ON ((((pb.aplnr)::text = (va.aplnr)::text) AND (va.endda = '9999-12-31'::date))))
     LEFT JOIN pb4000 act ON (((pb.aplnr)::text = (act.aplnr)::text)))
     LEFT JOIN ( SELECT DISTINCT ON (pb4005.aplnr) pb4005.id,
            pb4005.aplnr,
            pb4005.vacancy_id,
            pb4005.evaluation_id,
            pb4005.evaluation_date,
            pb4005.evaluator_pernr,
            pb4005.evaluation_type,
            pb4005.technical_score,
            pb4005.communication_score,
            pb4005.cultural_fit_score,
            pb4005.experience_score,
            pb4005.overall_score,
            pb4005.recommendation,
            pb4005.comments,
            pb4005.created_at
           FROM pb4005
          ORDER BY pb4005.aplnr, pb4005.evaluation_date DESC) ev ON (((pb.aplnr)::text = (ev.aplnr)::text)))
  WHERE (pb.endda = '9999-12-31'::date)
  GROUP BY pb.aplnr, pb.nachn, pb.vorna, pb.email, pb.source_channel, pa.stat2, va.vacancy_id, va.assignment_status, va.position_id, ev.overall_score, ev.recommendation
  ORDER BY pb.aplnr;
```

### `v_appraisal_status`

```sql
SELECT e.pernr,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.company_code,
    a.subty AS appraisal_type,
    a.appraisal_id,
    a.bession AS overall_rating,
    a.potential_rating,
    a.appraisal_date,
    a.status,
        CASE a.status
            WHEN '01'::text THEN 'Draft'::text
            WHEN '02'::text THEN 'Submitted'::text
            WHEN '03'::text THEN 'Approved'::text
            ELSE 'Unknown'::text
        END AS status_text
   FROM (v_employee_master e
     LEFT JOIN pa0025 a ON ((((e.pernr)::text = (a.pernr)::text) AND (a.begda >= date_trunc('year'::text, (CURRENT_DATE)::timestamp with time zone)) AND (a.endda = '9999-12-31'::date))))
  ORDER BY e.company_code, e.pernr;
```

### `v_attendance_summary`

```sql
SELECT e.pernr,
    e.company_code,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS full_name,
    date_trunc('month'::text, (a.begda)::timestamp with time zone) AS month,
    sum(
        CASE
            WHEN ((a.subty)::text ~~ '01%'::text) THEN a.abwtg
            ELSE (0)::numeric
        END) AS vacation_days,
    sum(
        CASE
            WHEN ((a.subty)::text ~~ '02%'::text) THEN a.abwtg
            ELSE (0)::numeric
        END) AS sick_days,
    sum(
        CASE
            WHEN ((a.subty)::text ~~ '03%'::text) THEN a.abwtg
            ELSE (0)::numeric
        END) AS personal_days,
    sum(a.abwtg) AS total_absence_days,
    sum(a.stdaz) AS total_absence_hours
   FROM (v_employee_master e
     LEFT JOIN pa2001 a ON (((e.pernr)::text = (a.pernr)::text)))
  WHERE (a.begda >= date_trunc('year'::text, (CURRENT_DATE)::timestamp with time zone))
  GROUP BY e.pernr, e.company_code, e.first_name, e.last_name, (date_trunc('month'::text, (a.begda)::timestamp with time zone))
  ORDER BY e.pernr, (date_trunc('month'::text, (a.begda)::timestamp with time zone));
```

### `v_benefits_enrollment`

```sql
SELECT e.pernr,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.company_code,
    'Health'::text AS benefit_category,
    h.bession AS plan_id,
    bp.plan_name,
    h.bession_option AS coverage,
    h.ee_contribution,
    h.er_contribution,
    h.begda AS effective_date
   FROM ((v_employee_master e
     JOIN pa0167 h ON ((((e.pernr)::text = (h.pernr)::text) AND (h.endda = '9999-12-31'::date))))
     LEFT JOIN t5ubp bp ON ((((h.bession)::text = (bp.bession)::text) AND (bp.endda = '9999-12-31'::date))))
UNION ALL
 SELECT e.pernr,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.company_code,
    'Savings'::text AS benefit_category,
    s.bession AS plan_id,
    bp.plan_name,
    (((s.ee_contribution_pct)::character varying)::text || '%'::text) AS coverage,
    s.ee_contribution_amt AS ee_contribution,
    s.er_match_pct AS er_contribution,
    s.begda AS effective_date
   FROM ((v_employee_master e
     JOIN pa0169 s ON ((((e.pernr)::text = (s.pernr)::text) AND (s.endda = '9999-12-31'::date))))
     LEFT JOIN t5ubp bp ON ((((s.bession)::text = (bp.bession)::text) AND (bp.endda = '9999-12-31'::date))))
  ORDER BY 1, 4;
```

### `v_calibration_9box`

```sql
SELECT ca.tenant_id,
    ca.calibration_session_id,
    ca.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    d.name AS department_name,
    ca.original_rating,
    ca.adjusted_rating,
    COALESCE(ca.adjusted_rating, ca.original_rating) AS final_rating,
        CASE
            WHEN (COALESCE(ca.adjusted_rating, ca.original_rating) >= (4)::numeric) THEN 'high'::text
            WHEN (COALESCE(ca.adjusted_rating, ca.original_rating) >= (3)::numeric) THEN 'medium'::text
            ELSE 'low'::text
        END AS performance_bucket,
        CASE
            WHEN (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.7) THEN 'high'::text
            WHEN (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.4) THEN 'medium'::text
            ELSE 'low'::text
        END AS potential_bucket,
        CASE
            WHEN ((COALESCE(ca.adjusted_rating, ca.original_rating) >= (4)::numeric) AND (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.7)) THEN 9
            WHEN ((COALESCE(ca.adjusted_rating, ca.original_rating) >= (4)::numeric) AND (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.4)) THEN 6
            WHEN (COALESCE(ca.adjusted_rating, ca.original_rating) >= (4)::numeric) THEN 3
            WHEN ((COALESCE(ca.adjusted_rating, ca.original_rating) >= (3)::numeric) AND (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.7)) THEN 8
            WHEN ((COALESCE(ca.adjusted_rating, ca.original_rating) >= (3)::numeric) AND (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.4)) THEN 5
            WHEN (COALESCE(ca.adjusted_rating, ca.original_rating) >= (3)::numeric) THEN 2
            WHEN (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.7) THEN 7
            WHEN (COALESCE((pp.predicted_rating / 5.0), 0.5) >= 0.4) THEN 4
            ELSE 1
        END AS box_position,
    ca.outlier_flag,
    ca.outlier_reason
   FROM (((calibration_adjustments ca
     JOIN employees e ON ((ca.employee_id = e.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
     LEFT JOIN performance_predictions pp ON (((ca.employee_id = pp.employee_id) AND (pp.is_current = true))));
```

### `v_calibration_bell_curve`

```sql
SELECT tenant_id,
    calibration_session_id,
    COALESCE(adjusted_rating, original_rating) AS rating,
    count(*) AS count,
    (((count(*))::numeric / NULLIF(sum(count(*)) OVER (PARTITION BY calibration_session_id), (0)::numeric)) * (100)::numeric) AS percentage,
        CASE
            WHEN (COALESCE(adjusted_rating, original_rating) <= (1)::numeric) THEN 5
            WHEN (COALESCE(adjusted_rating, original_rating) <= (2)::numeric) THEN 10
            WHEN (COALESCE(adjusted_rating, original_rating) <= (3)::numeric) THEN 35
            WHEN (COALESCE(adjusted_rating, original_rating) <= (4)::numeric) THEN 35
            ELSE 15
        END AS expected_percentage
   FROM calibration_adjustments ca
  WHERE (COALESCE(adjusted_rating, original_rating) IS NOT NULL)
  GROUP BY tenant_id, calibration_session_id, COALESCE(adjusted_rating, original_rating);
```

### `v_candidate_detail_cluster`

```sql
SELECT candidate_id,
    tenant_id,
    requisition_id,
    job_title,
    first_name,
    last_name,
    full_name,
    email,
    phone,
    source,
    current_stage,
    rating,
    resume_url,
    linkedin_url,
    notes,
    applied_at,
    last_updated,
    days_in_current_stage,
    total_days_in_pipeline,
    stage_transitions
   FROM analytics.v_candidate_detail;
```

### `v_career_level_requirements`

```sql
SELECT cpl.id AS level_id,
    cpl.title AS level_title,
    cpl.level_order,
    cp.id AS path_id,
    cp.name AS path_name,
    count(cls.id) AS total_skills_required,
    count(cls.id) FILTER (WHERE cls.is_mandatory) AS mandatory_skills,
    count(cls.id) FILTER (WHERE (cls.importance = 'critical'::career_skill_importance)) AS critical_skills,
    avg(cls.min_composite_score) AS avg_required_score,
    cpl.typical_duration_months,
    cp.tenant_id
   FROM ((career_path_levels cpl
     JOIN career_paths cp ON ((cpl.path_id = cp.id)))
     LEFT JOIN career_path_level_skills cls ON ((cls.level_id = cpl.id)))
  GROUP BY cpl.id, cpl.title, cpl.level_order, cp.id, cp.name, cpl.typical_duration_months, cp.tenant_id;
```

### `v_certification_compliance`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    e.department,
    cert.id AS certification_id,
    cert.name AS certification_name,
    cert.issuing_organization,
    ec.credential_id,
    ec.issued_date,
    ec.expiry_date,
    ec.status,
        CASE
            WHEN (ec.id IS NULL) THEN 'not_obtained'::text
            WHEN ((ec.status)::text = 'expired'::text) THEN 'expired'::text
            WHEN (ec.expiry_date < CURRENT_DATE) THEN 'expired'::text
            WHEN (ec.expiry_date < (CURRENT_DATE + '30 days'::interval)) THEN 'expiring_30_days'::text
            WHEN (ec.expiry_date < (CURRENT_DATE + '90 days'::interval)) THEN 'expiring_90_days'::text
            ELSE 'compliant'::text
        END AS compliance_status
   FROM ((employees e
     CROSS JOIN certifications cert)
     LEFT JOIN employee_certifications ec ON (((ec.employee_id = e.id) AND (ec.certification_id = cert.id))))
  WHERE ((e.is_active = true) AND (cert.is_active = true) AND ((cert.tenant_id = e.tenant_id) OR (cert.tenant_id IS NULL)));
```

### `v_comp_analysis`

```sql
SELECT p0008.pernr,
    (((p0002.vorna)::text || ' '::text) || (p0002.nachn)::text) AS employee_name,
    p0001.bukrs AS company,
    p0001.orgeh AS org_unit,
    p0001.plans AS "position",
    p0008.trfgr AS pay_grade,
    p0008.ansal AS annual_salary,
    p0008.waession AS currency,
    p0008.bession AS employment_pct,
    hrp.min_salary AS position_min,
    hrp.mid_salary AS position_mid,
    hrp.max_salary AS position_max,
        CASE
            WHEN (hrp.mid_salary > (0)::numeric) THEN round(((p0008.ansal / hrp.mid_salary) * (100)::numeric), 2)
            ELSE NULL::numeric
        END AS compa_ratio
   FROM (((pa0008 p0008
     LEFT JOIN pa0002 p0002 ON ((((p0008.pernr)::text = (p0002.pernr)::text) AND (p0002.endda = '9999-12-31'::date))))
     LEFT JOIN pa0001 p0001 ON ((((p0008.pernr)::text = (p0001.pernr)::text) AND (p0001.endda = '9999-12-31'::date))))
     LEFT JOIN hrp1005 hrp ON ((((p0001.plans)::text = (hrp.objid)::text) AND ((hrp.otype)::text = 'S'::text) AND (hrp.endda = '9999-12-31'::date))))
  WHERE (p0008.endda = '9999-12-31'::date);
```

### `v_compensation_bands`

```sql
SELECT t.id AS tenant_id,
    t.code AS tenant_code,
    e.department,
    e.job_title,
    count(*) AS employee_count,
    round(avg(e.salary), 0) AS avg_salary,
    round(min(e.salary), 0) AS min_salary,
    round(max(e.salary), 0) AS max_salary,
    percentile_cont((0.25)::double precision) WITHIN GROUP (ORDER BY ((e.salary)::double precision)) AS p25_salary,
    percentile_cont((0.50)::double precision) WITHIN GROUP (ORDER BY ((e.salary)::double precision)) AS median_salary,
    percentile_cont((0.75)::double precision) WITHIN GROUP (ORDER BY ((e.salary)::double precision)) AS p75_salary,
    round(sum(e.salary), 0) AS total_compensation
   FROM (employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
  WHERE ((e.is_active = true) AND (e.salary IS NOT NULL))
  GROUP BY t.id, t.code, e.department, e.job_title;
```

### `v_compensation_by_department`

```sql
SELECT ue.bukrs AS sap_company_code,
    p1.orgeh AS org_unit,
    hrp.tline AS org_unit_name,
    count(*) AS employee_count,
    round(avg(p8.ansal), 2) AS avg_salary,
    round(min(p8.ansal), 2) AS min_salary,
    round(max(p8.ansal), 2) AS max_salary,
    sum(p8.ansal) AS total_payroll,
    p8.waession AS currency
   FROM (((v_unique_sap_employee ue
     JOIN pa0001 p1 ON ((((p1.pernr)::text = (ue.pernr)::text) AND (p1.endda >= CURRENT_DATE))))
     JOIN pa0008 p8 ON ((((p8.pernr)::text = (ue.pernr)::text) AND (p8.endda >= CURRENT_DATE) AND (p8.ansal > (0)::numeric))))
     LEFT JOIN hrp1002 hrp ON ((((hrp.objid)::text = (p1.orgeh)::text) AND ((hrp.otype)::text = 'O'::text) AND (hrp.endda >= CURRENT_DATE))))
  GROUP BY ue.bukrs, p1.orgeh, hrp.tline, p8.waession
  ORDER BY ue.bukrs, (sum(p8.ansal)) DESC;
```

### `v_compliance_summary`

```sql
SELECT 'VIEWS'::text AS category,
    v.data_source,
    count(*) AS count,
    string_agg((v.viewname)::text, ', '::text ORDER BY ((v.viewname)::text)) AS items
   FROM ( SELECT pg_views.viewname,
                CASE
                    WHEN ((pg_views.definition ~~* '%pa0%'::text) OR (pg_views.definition ~~* '%hrp%'::text) OR (pg_views.definition ~~* '%pb0%'::text)) THEN 'SAP_BASED'::text
                    ELSE 'HEURESYS_BASED'::text
                END AS data_source
           FROM pg_views
          WHERE ((pg_views.schemaname = 'public'::name) AND (pg_views.viewname ~~ 'v_%'::text))) v
  GROUP BY v.data_source
UNION ALL
 SELECT 'TABLES'::text AS category,
    table_usage_rules.table_category AS data_source,
    count(*) AS count,
    string_agg((table_usage_rules.table_name)::text, ', '::text ORDER BY (table_usage_rules.table_name)::text) AS items
   FROM table_usage_rules
  GROUP BY table_usage_rules.table_category;
```

### `v_course_analytics`

```sql
SELECT NULL::uuid AS course_id,
    NULL::uuid AS tenant_id,
    NULL::character varying(50) AS code,
    NULL::character varying(255) AS title,
    NULL::character varying(50) AS course_type,
    NULL::character varying(100) AS category,
    NULL::character varying(20) AS skill_level,
    NULL::character varying(100) AS provider,
    NULL::numeric(6,2) AS duration_hours,
    NULL::character varying(20) AS status,
    NULL::bigint AS total_enrollments,
    NULL::bigint AS completions,
    NULL::bigint AS in_progress,
    NULL::bigint AS dropped,
    NULL::numeric AS completion_rate,
    NULL::numeric AS avg_score,
    NULL::numeric AS avg_time_minutes,
    NULL::numeric AS avg_rating,
    NULL::bigint AS rating_count,
    NULL::character varying[] AS esco_skills;
```

### `v_data_integrity_check`

```sql
SELECT 'users_without_employees'::text AS check_type,
    count(*) AS count,
        CASE
            WHEN (count(*) = 0) THEN 'OK'::text
            ELSE 'WARNING: Users without employee link'::text
        END AS status
   FROM users u
  WHERE (u.employee_id IS NULL)
UNION ALL
 SELECT 'tenant_employee_mismatch'::text AS check_type,
    count(*) AS count,
        CASE
            WHEN (count(*) = 0) THEN 'OK'::text
            ELSE 'ERROR: Tenant-employee mismatch'::text
        END AS status
   FROM ((employees e
     JOIN tenants t ON ((e.tenant_id = t.id)))
     LEFT JOIN pa0001 p1 ON ((((e.pernr)::text = (p1.pernr)::text) AND (p1.endda >= CURRENT_DATE))))
  WHERE ((t.sap_company_code IS NOT NULL) AND (p1.bukrs IS NOT NULL) AND ((t.sap_company_code)::text <> (p1.bukrs)::text))
UNION ALL
 SELECT 'duplicate_pernr_in_tenant'::text AS check_type,
    count(*) AS count,
        CASE
            WHEN (count(*) = 0) THEN 'OK'::text
            ELSE 'ERROR: Duplicate pernr in tenant'::text
        END AS status
   FROM ( SELECT employees.pernr,
            employees.tenant_id,
            count(*) AS cnt
           FROM employees
          WHERE (employees.pernr IS NOT NULL)
          GROUP BY employees.pernr, employees.tenant_id
         HAVING (count(*) > 1)) dup;
```

### `v_dei_demographics`

```sql
SELECT t.id AS tenant_id,
    t.code AS tenant_code,
    t.code AS sap_company_code,
    count(*) AS total_employees,
    sum(
        CASE
            WHEN ((e.gender)::text = 'M'::text) THEN 1
            ELSE 0
        END) AS male_count,
    sum(
        CASE
            WHEN ((e.gender)::text = 'F'::text) THEN 1
            ELSE 0
        END) AS female_count,
    sum(
        CASE
            WHEN (((e.gender)::text <> ALL (ARRAY[('M'::character varying)::text, ('F'::character varying)::text])) OR (e.gender IS NULL)) THEN 1
            ELSE 0
        END) AS other_gender_count,
    round(((100.0 * (sum(
        CASE
            WHEN ((e.gender)::text = 'F'::text) THEN 1
            ELSE 0
        END))::numeric) / (NULLIF(count(*), 0))::numeric), 1) AS female_percentage,
    sum(
        CASE
            WHEN (EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) < (30)::numeric) THEN 1
            ELSE 0
        END) AS age_under_30,
    sum(
        CASE
            WHEN ((EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) >= (30)::numeric) AND (EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) <= (39)::numeric)) THEN 1
            ELSE 0
        END) AS age_30_39,
    sum(
        CASE
            WHEN ((EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) >= (40)::numeric) AND (EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) <= (49)::numeric)) THEN 1
            ELSE 0
        END) AS age_40_49,
    sum(
        CASE
            WHEN ((EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) >= (50)::numeric) AND (EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) <= (59)::numeric)) THEN 1
            ELSE 0
        END) AS age_50_59,
    sum(
        CASE
            WHEN (EXTRACT(year FROM age((e.birth_date)::timestamp with time zone)) >= (60)::numeric) THEN 1
            ELSE 0
        END) AS age_60_plus,
    count(DISTINCT e.nationality) AS nationality_count
   FROM (employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
  WHERE (e.is_active = true)
  GROUP BY t.id, t.code;
```

### `v_dei_pay_equity`

```sql
SELECT t.id AS tenant_id,
    t.code AS tenant_code,
    t.code AS sap_company_code,
    round(avg(e.salary), 2) AS avg_salary_overall,
    round(avg(
        CASE
            WHEN ((e.gender)::text = 'M'::text) THEN e.salary
            ELSE NULL::numeric
        END), 2) AS avg_salary_male,
    round(avg(
        CASE
            WHEN ((e.gender)::text = 'F'::text) THEN e.salary
            ELSE NULL::numeric
        END), 2) AS avg_salary_female,
    round(((100.0 * (avg(
        CASE
            WHEN ((e.gender)::text = 'F'::text) THEN e.salary
            ELSE NULL::numeric
        END) - avg(
        CASE
            WHEN ((e.gender)::text = 'M'::text) THEN e.salary
            ELSE NULL::numeric
        END))) / NULLIF(avg(
        CASE
            WHEN ((e.gender)::text = 'M'::text) THEN e.salary
            ELSE NULL::numeric
        END), (0)::numeric)), 2) AS raw_pay_gap_pct,
    min(e.salary) AS min_salary,
    max(e.salary) AS max_salary,
    percentile_cont((0.25)::double precision) WITHIN GROUP (ORDER BY ((e.salary)::double precision)) AS salary_p25,
    percentile_cont((0.50)::double precision) WITHIN GROUP (ORDER BY ((e.salary)::double precision)) AS salary_median,
    percentile_cont((0.75)::double precision) WITHIN GROUP (ORDER BY ((e.salary)::double precision)) AS salary_p75
   FROM (employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
  WHERE ((e.is_active = true) AND (e.salary > (0)::numeric))
  GROUP BY t.id, t.code;
```

### `v_embedding_queue_stats`

```sql
SELECT status,
    entity_type,
    count(*) AS count,
    min(created_at) AS oldest,
    max(created_at) AS newest,
    avg(attempts) AS avg_attempts
   FROM embedding_queue
  GROUP BY status, entity_type
  ORDER BY status, entity_type;
```

### `v_employee_capability_snapshot`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    jsonb_build_object('identity', jsonb_build_object('name', (((e.first_name)::text || ' '::text) || (e.last_name)::text), 'email', e.email, 'job_title', e.job_title, 'gender', e.gender, 'tenure_years', round((((CURRENT_DATE - e.hire_date))::numeric / 365.25), 1), 'hire_date', e.hire_date, 'employment_status', e.employment_status), 'role_context', jsonb_build_object('manager_name', (((mgr.first_name)::text || ' '::text) || (mgr.last_name)::text), 'manager_job_title', mgr.job_title, 'org_unit', ou.name, 'org_unit_code', ou.code, 'department', e.department, 'location', loc.name, 'reports_count', ( SELECT count(*) AS count
           FROM employees r
          WHERE ((r.manager_id = e.id) AND ((r.employment_status)::text = 'active'::text)))), 'compensation', jsonb_build_object('annual_salary', ec.annual_salary, 'monthly_salary', ec.monthly_salary, 'level', ec.level, 'ccnl', ec.ccnl_code, 'months_per_year', ec.num_monthly_payments, 'currency', ec.currency, 'contract_type', ec.contract_type, 'contract_end_date', ec.end_date), 'skills', COALESCE(( SELECT jsonb_agg(jsonb_build_object('name', cs.skill_name, 'proficiency', cs.proficiency, 'source', cs.source) ORDER BY cs.proficiency DESC) AS jsonb_agg
           FROM (career_skills cs
             JOIN career_profiles cp ON ((cs.profile_id = cp.id)))
          WHERE (cp.employee_id = e.id)), '[]'::jsonb), 'recent_courses', COALESCE(( SELECT jsonb_agg(jsonb_build_object('title', c.title, 'category', c.category, 'status', ce.status, 'progress', ce.progress_percent, 'completed_at', ce.completed_at) ORDER BY COALESCE(ce.completed_at, ce.enrolled_at) DESC) AS jsonb_agg
           FROM (( SELECT course_enrollments.id,
                    course_enrollments.employee_id,
                    course_enrollments.course_id,
                    course_enrollments.learning_path_enrollment_id,
                    course_enrollments.enrolled_at,
                    course_enrollments.enrolled_by,
                    course_enrollments.enrollment_source,
                    course_enrollments.status,
                    course_enrollments.progress_percent,
                    course_enrollments.started_at,
                    course_enrollments.completed_at,
                    course_enrollments.due_date,
                    course_enrollments.score,
                    course_enrollments.passed,
                    course_enrollments.attempts,
                    course_enrollments.time_spent_minutes,
                    course_enrollments.last_accessed_at,
                    course_enrollments.certificate_issued,
                    course_enrollments.certificate_url,
                    course_enrollments.certificate_issued_at,
                    course_enrollments.notes,
                    course_enrollments.created_at,
                    course_enrollments.updated_at,
                    course_enrollments.enrolled_by_employee_id,
                    course_enrollments.tenant_id
                   FROM course_enrollments
                  WHERE (course_enrollments.employee_id = e.id)
                  ORDER BY COALESCE(course_enrollments.completed_at, course_enrollments.enrolled_at) DESC
                 LIMIT 15) ce
             JOIN courses c ON ((c.id = ce.course_id)))), '[]'::jsonb), 'reviews_avg_12m', ( SELECT round(avg(performance_reviews.overall_rating), 2) AS round
           FROM performance_reviews
          WHERE ((performance_reviews.employee_id = e.id) AND (performance_reviews.submitted_at > (now() - '1 year'::interval)))), 'reviews_count_12m', ( SELECT count(*) AS count
           FROM performance_reviews
          WHERE ((performance_reviews.employee_id = e.id) AND (performance_reviews.submitted_at > (now() - '1 year'::interval)))), 'wellbeing_90d', ( SELECT jsonb_build_object('mood_avg', round(avg(wellbeing_checkins.mood_score), 2), 'energy_avg', round(avg(wellbeing_checkins.energy_level), 2), 'stress_avg', round(avg(wellbeing_checkins.stress_level), 2), 'work_life_balance_avg', round(avg(wellbeing_checkins.work_life_balance), 2), 'sleep_quality_avg', round(avg(wellbeing_checkins.sleep_quality), 2), 'checkins_count', count(*)) AS jsonb_build_object
           FROM wellbeing_checkins
          WHERE ((wellbeing_checkins.employee_id = e.id) AND (wellbeing_checkins.checkin_date > (CURRENT_DATE - 90)))), 'certifications_active', COALESCE(( SELECT jsonb_agg(jsonb_build_object('name', c.name, 'issuer', c.issuing_organization, 'expiry', ec2.expiry_date)) AS jsonb_agg
           FROM (employee_certifications ec2
             JOIN certifications c ON ((c.id = ec2.certification_id)))
          WHERE ((ec2.employee_id = e.id) AND ((ec2.status)::text = 'active'::text))), '[]'::jsonb), 'time_off_balance_current', ( SELECT jsonb_object_agg(employee_time_off_balances.leave_type, jsonb_build_object('available', (((((employee_time_off_balances.total_days + employee_time_off_balances.accrued_days) + employee_time_off_balances.carryover_days) + employee_time_off_balances.adjustment_days) - employee_time_off_balances.used_days) - employee_time_off_balances.pending_days), 'used', employee_time_off_balances.used_days, 'pending', employee_time_off_balances.pending_days)) AS jsonb_object_agg
           FROM employee_time_off_balances
          WHERE ((employee_time_off_balances.employee_id = e.id) AND (employee_time_off_balances.year = (EXTRACT(year FROM CURRENT_DATE))::integer))), 'goals_active', COALESCE(( SELECT jsonb_agg(jsonb_build_object('title', goals.title, 'status', goals.status, 'progress', goals.progress_percent)) AS jsonb_agg
           FROM goals
          WHERE ((goals.employee_id = e.id) AND ((goals.status)::text = ANY (ARRAY[('in_progress'::character varying)::text, ('at_risk'::character varying)::text, ('draft'::character varying)::text])))), '[]'::jsonb)) AS snapshot
   FROM ((((employees e
     LEFT JOIN employees mgr ON ((mgr.id = e.manager_id)))
     LEFT JOIN org_units ou ON ((ou.id = e.org_unit_id)))
     LEFT JOIN locations loc ON ((loc.id = e.location_id)))
     LEFT JOIN employee_contracts ec ON (((ec.employee_id = e.id) AND (ec.is_current = true))));
```

### `v_employee_career_overview`

```sql
SELECT ecp.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title AS current_job,
    cp.id AS path_id,
    cp.name AS path_name,
    cp.path_type,
    cpl.id AS current_level_id,
    cpl.title AS current_level,
    cpl.level_order,
    ecp.status AS path_status,
    ecp.started_at,
    prog.overall_fit_score,
    prog.skill_coverage_pct,
    prog.critical_gaps_count,
    prog.estimated_months_to_ready,
    ( SELECT count(*) AS count
           FROM career_path_levels
          WHERE (career_path_levels.path_id = cp.id)) AS total_levels,
    e.tenant_id
   FROM ((((employee_career_paths ecp
     JOIN employees e ON ((ecp.employee_id = e.id)))
     JOIN career_paths cp ON ((ecp.path_id = cp.id)))
     LEFT JOIN career_path_levels cpl ON ((ecp.current_level_id = cpl.id)))
     LEFT JOIN employee_career_progress prog ON (((prog.employee_id = ecp.employee_id) AND (prog.level_id = cpl.id))));
```

### `v_employee_context`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    e.first_name,
    e.last_name,
    e.email,
    e.job_title AS original_job_title,
    e.department AS original_department,
    eja.id AS assignment_id,
    eja.assignment_type,
    eja.fte_percentage,
    eja.start_date AS assignment_start,
    tj.id AS job_id,
    tj.job_code,
    tj.title_it AS job_title,
    tj.org_level,
    ol.name_it AS level_name,
    ol.nature AS level_nature,
    tj.is_management,
    tou.id AS org_unit_id,
    tou.code AS org_unit_code,
    tou.name_it AS org_unit_name,
    tou.cost_center,
    oa.code AS area_code,
    oa.name_it AS area_name,
    oa.color AS area_color,
    tou.manager_employee_id,
    (((mgr.first_name)::text || ' '::text) || (mgr.last_name)::text) AS manager_name,
    tj.esco_occupation_code,
    tj.esco_occupation_uri
   FROM ((((((employees e
     LEFT JOIN employee_job_assignments eja ON (((e.id = eja.employee_id) AND (eja.is_current = true) AND ((eja.assignment_type)::text = 'primary'::text))))
     LEFT JOIN tenant_jobs tj ON ((eja.tenant_job_id = tj.id)))
     LEFT JOIN org_levels ol ON ((tj.org_level = ol.level)))
     LEFT JOIN tenant_org_units tou ON ((tj.tenant_org_unit_id = tou.id)))
     LEFT JOIN org_areas oa ON (((tou.area_code)::text = (oa.code)::text)))
     LEFT JOIN employees mgr ON ((tou.manager_employee_id = mgr.id)))
  WHERE (e.is_active = true);
```

### `v_employee_learning_profile`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    e.first_name,
    e.last_name,
    e.job_title,
    e.department,
    count(DISTINCT ce.id) AS courses_enrolled,
    count(DISTINCT ce.id) FILTER (WHERE ((ce.status)::text = 'completed'::text)) AS courses_completed,
    count(DISTINCT ce.id) FILTER (WHERE ((ce.status)::text = 'in_progress'::text)) AS courses_in_progress,
    round(avg(ce.progress_percent), 1) AS avg_progress,
    sum(ce.time_spent_minutes) AS total_learning_minutes,
    round(((sum(ce.time_spent_minutes))::numeric / 60.0), 1) AS total_learning_hours,
    count(DISTINCT ec.id) AS certifications_count,
    count(DISTINCT ec.id) FILTER (WHERE ((ec.status)::text = 'active'::text)) AS active_certifications,
    count(DISTINCT ec.id) FILTER (WHERE (ec.expiry_date < (CURRENT_DATE + '90 days'::interval))) AS expiring_soon,
    count(DISTINCT lr.id) FILTER (WHERE ((lr.status)::text = 'pending'::text)) AS pending_recommendations,
    max(ce.completed_at) AS last_completion_date
   FROM (((employees e
     LEFT JOIN course_enrollments ce ON ((ce.employee_id = e.id)))
     LEFT JOIN employee_certifications ec ON ((ec.employee_id = e.id)))
     LEFT JOIN learning_recommendations lr ON ((lr.employee_id = e.id)))
  WHERE (e.is_active = true)
  GROUP BY e.id, e.tenant_id, e.first_name, e.last_name, e.job_title, e.department;
```

### `v_employee_master`

```sql
SELECT p0002.pernr,
    p0002.vorna AS first_name,
    p0002.nachn AS last_name,
    p0002.midnm AS middle_name,
    p0002.gbdat AS birth_date,
    p0002.natio AS nationality,
        CASE p0002.gesch
            WHEN '1'::text THEN 'Male'::text
            WHEN '2'::text THEN 'Female'::text
            ELSE 'Other'::text
        END AS gender,
    p0000.stat2 AS status,
    p0000.begda AS hire_date,
    p0001.bukrs AS company_code,
    p0001.werks AS personnel_area,
    p0001.orgeh AS org_unit,
    p0001.plans AS "position",
    p0001.stell AS job,
    p0001.kostl AS cost_center,
    p0008.ansal AS annual_salary,
    p0008.waession AS currency,
    p0008.bession AS employment_pct,
    p0007.wession AS weekly_hours,
    p0016.cttyp AS contract_type,
    p0016.probation_end,
    p0016.termination_date,
    email.usrid_long AS email,
    phone.usrid_long AS phone
   FROM (((((((pa0002 p0002
     LEFT JOIN pa0000 p0000 ON ((((p0002.pernr)::text = (p0000.pernr)::text) AND (p0000.endda = '9999-12-31'::date))))
     LEFT JOIN pa0001 p0001 ON ((((p0002.pernr)::text = (p0001.pernr)::text) AND (p0001.endda = '9999-12-31'::date))))
     LEFT JOIN pa0008 p0008 ON ((((p0002.pernr)::text = (p0008.pernr)::text) AND (p0008.endda = '9999-12-31'::date))))
     LEFT JOIN pa0007 p0007 ON ((((p0002.pernr)::text = (p0007.pernr)::text) AND (p0007.endda = '9999-12-31'::date))))
     LEFT JOIN pa0016 p0016 ON ((((p0002.pernr)::text = (p0016.pernr)::text) AND (p0016.endda = '9999-12-31'::date))))
     LEFT JOIN pa0105 email ON ((((p0002.pernr)::text = (email.pernr)::text) AND ((email.subty)::text = '0010'::text) AND (email.endda = '9999-12-31'::date))))
     LEFT JOIN pa0105 phone ON ((((p0002.pernr)::text = (phone.pernr)::text) AND ((phone.subty)::text = '0020'::text) AND (phone.endda = '9999-12-31'::date))))
  WHERE (p0002.endda = '9999-12-31'::date);
```

### `v_employee_predictions`

```sql
SELECT pp.id,
    pp.tenant_id,
    pp.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    d.name AS department_name,
    pp.prediction_period,
    pp.predicted_rating,
    pp.confidence_interval_low,
    pp.confidence_interval_high,
    pp.risk_score,
    pp.risk_level,
    pp.is_high_potential,
    pp.hipo_score,
    pp.hipo_justification,
    pp.contributing_factors,
    pp.recommended_actions,
    pp.prediction_confidence,
    pp.actual_rating,
    pp.prediction_accuracy,
    pp.model_name,
    pp.model_version,
    pp.created_at,
    pp.validated_at
   FROM ((performance_predictions pp
     JOIN employees e ON ((pp.employee_id = e.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
  WHERE (pp.is_current = true);
```

### `v_employee_sap_master`

```sql
SELECT m.pernr,
    m.bukrs,
    p2.vorna AS first_name,
    p2.nachn AS last_name,
    p2.gbdat AS birth_date,
    p1.orgeh AS org_unit,
    p1.plans AS "position",
    p1.kostl AS cost_center,
    p8.ansal AS annual_salary,
    p5.usrid_long AS email,
    m.last_sync_at
   FROM ((((user_pernr_mapping m
     JOIN pa0001 p1 ON ((((m.pernr)::text = (p1.pernr)::text) AND (p1.endda = '9999-12-31'::date))))
     JOIN pa0002 p2 ON ((((m.pernr)::text = (p2.pernr)::text) AND (p2.endda = '9999-12-31'::date))))
     LEFT JOIN pa0008 p8 ON ((((m.pernr)::text = (p8.pernr)::text) AND (p8.endda = '9999-12-31'::date) AND ((p8.subty)::text = '0'::text))))
     LEFT JOIN pa0105 p5 ON ((((m.pernr)::text = (p5.pernr)::text) AND ((p5.subty)::text = '0010'::text) AND (p5.endda = '9999-12-31'::date))));
```

### `v_employee_skill_summary`

```sql
SELECT esp.tenant_id,
    esp.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    count(*) AS total_skills,
    count(*) FILTER (WHERE (esp.verification_status = 'verified'::skill_verification_status)) AS verified_skills,
    count(*) FILTER (WHERE (esp.verification_status = 'pending'::skill_verification_status)) AS pending_skills,
    round(avg(esp.composite_score), 2) AS avg_composite_score,
    max(esp.composite_score) AS max_composite_score,
    count(*) FILTER (WHERE esp.is_primary) AS primary_skills,
    count(*) FILTER (WHERE esp.is_target) AS target_skills
   FROM (employee_skill_profiles esp
     JOIN employees e ON ((esp.employee_id = e.id)))
  GROUP BY esp.tenant_id, esp.employee_id, e.first_name, e.last_name;
```

### `v_employee_skills`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    t.code AS tenant_code,
    e.first_name,
    e.last_name,
    e.job_title,
    e.department,
    e.skills,
    array_length(e.skills, 1) AS skill_count,
    e.performance_rating,
    e.potential
   FROM (employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
  WHERE (e.is_active = true);
```

### `v_employee_skills_summary`

```sql
SELECT es.tenant_id,
    es.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    count(*) AS total_skills,
    count(
        CASE
            WHEN (es.proficiency_level >= 4) THEN 1
            ELSE NULL::integer
        END) AS expert_skills,
    count(
        CASE
            WHEN es.is_verified THEN 1
            ELSE NULL::integer
        END) AS verified_skills,
    (avg(es.proficiency_level))::numeric(3,2) AS avg_proficiency,
    array_agg(DISTINCT COALESCE(esco.skill_type, 'custom'::character varying)) AS skill_types
   FROM ((employee_skills es
     JOIN employees e ON ((es.employee_id = e.id)))
     LEFT JOIN esco_skills esco ON ((es.esco_skill_id = esco.id)))
  GROUP BY es.tenant_id, es.employee_id, e.first_name, e.last_name;
```

### `v_engagement_analytics`

```sql
WITH survey_metrics AS (
         SELECT s.tenant_id,
            date_trunc('month'::text, s.created_at) AS period,
            count(DISTINCT s.id) AS total_surveys,
            sum(s.total_invitations) AS total_invitations,
            sum(s.total_responses) AS total_responses,
                CASE
                    WHEN (sum(s.total_invitations) > 0) THEN round((((sum(s.total_responses))::numeric / (sum(s.total_invitations))::numeric) * (100)::numeric), 1)
                    ELSE (0)::numeric
                END AS response_rate
           FROM engagement_surveys s
          WHERE ((s.status)::text = ANY (ARRAY[('active'::character varying)::text, ('closed'::character varying)::text]))
          GROUP BY s.tenant_id, (date_trunc('month'::text, s.created_at))
        ), nps_metrics AS (
         SELECT s.tenant_id,
            date_trunc('month'::text, s.created_at) AS period,
            count(*) FILTER (WHERE (((a.value ->> 'value'::text))::integer >= 9)) AS promoters,
            count(*) FILTER (WHERE ((((a.value ->> 'value'::text))::integer >= 7) AND (((a.value ->> 'value'::text))::integer <= 8))) AS passives,
            count(*) FILTER (WHERE (((a.value ->> 'value'::text))::integer <= 6)) AS detractors,
            count(*) AS total_nps_responses
           FROM (((engagement_surveys s
             JOIN engagement_survey_responses r ON (((r.survey_id = s.id) AND (r.is_complete = true))))
             CROSS JOIN LATERAL jsonb_array_elements(r.answers) a(value))
             JOIN LATERAL jsonb_array_elements(s.questions) q(value) ON (((q.value ->> 'id'::text) = (a.value ->> 'question_id'::text))))
          WHERE ((q.value ->> 'type'::text) = 'nps'::text)
          GROUP BY s.tenant_id, (date_trunc('month'::text, s.created_at))
        )
 SELECT sm.tenant_id,
    sm.period,
    sm.total_surveys,
    sm.total_invitations,
    sm.total_responses,
    sm.response_rate,
        CASE
            WHEN (COALESCE(nm.total_nps_responses, (0)::bigint) > 0) THEN round(((((nm.promoters)::numeric / (nm.total_nps_responses)::numeric) - ((nm.detractors)::numeric / (nm.total_nps_responses)::numeric)) * (100)::numeric), 0)
            ELSE NULL::numeric
        END AS enps_score,
    nm.promoters,
    nm.passives,
    nm.detractors
   FROM (survey_metrics sm
     LEFT JOIN nps_metrics nm ON (((sm.tenant_id = nm.tenant_id) AND (sm.period = nm.period))));
```

### `v_engagement_summary`

```sql
SELECT s.tenant_id,
    s.id AS survey_id,
    s.title AS survey_title,
    s.survey_type,
    count(DISTINCT sr.employee_id) AS respondents,
    round(avg(
        CASE
            WHEN ((sq.question_type)::text = 'nps'::text) THEN sr.rating_value
            ELSE NULL::integer
        END), 1) AS avg_nps_score,
    round(avg(sr.rating_value), 2) AS avg_rating,
    round(avg(
        CASE
            WHEN ((sq.category)::text = 'engagement'::text) THEN sr.rating_value
            ELSE NULL::integer
        END), 2) AS engagement_score,
    round(avg(
        CASE
            WHEN ((sq.category)::text = 'manager'::text) THEN sr.rating_value
            ELSE NULL::integer
        END), 2) AS manager_score,
    round(avg(
        CASE
            WHEN ((sq.category)::text = 'growth'::text) THEN sr.rating_value
            ELSE NULL::integer
        END), 2) AS growth_score,
    round(avg(
        CASE
            WHEN ((sq.category)::text = 'culture'::text) THEN sr.rating_value
            ELSE NULL::integer
        END), 2) AS culture_score
   FROM ((surveys s
     JOIN survey_questions sq ON ((sq.survey_id = s.id)))
     LEFT JOIN survey_responses sr ON ((sr.question_id = sq.id)))
  GROUP BY s.tenant_id, s.id, s.title, s.survey_type;
```

### `v_feature_summary`

```sql
SELECT category,
    count(*) AS total_features,
    sum(
        CASE
            WHEN ((implementation_status)::text = 'implemented'::text) THEN 1
            ELSE 0
        END) AS implemented,
    sum(
        CASE
            WHEN ((implementation_status)::text = 'in_progress'::text) THEN 1
            ELSE 0
        END) AS in_progress,
    sum(
        CASE
            WHEN ((implementation_status)::text = 'not_started'::text) THEN 1
            ELSE 0
        END) AS not_started,
    round(avg(current_coverage_pct), 1) AS avg_coverage_pct,
    sum(COALESCE(estimated_effort_days, 0)) AS total_effort_days
   FROM platform_features
  GROUP BY category
  ORDER BY (round(avg(current_coverage_pct), 1)) DESC;
```

### `v_feedback_given_summary`

```sql
SELECT cf.tenant_id,
    cf.from_employee_id AS employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    count(*) AS total_given,
    count(*) FILTER (WHERE ((cf.feedback_type)::text = 'praise'::text)) AS praise_given,
    count(*) FILTER (WHERE ((cf.feedback_type)::text = 'suggestion'::text)) AS suggestion_given,
    count(*) FILTER (WHERE ((cf.feedback_type)::text = 'concern'::text)) AS concern_given,
    count(DISTINCT cf.to_employee_id) AS unique_recipients,
    max(cf.created_at) AS last_feedback_given
   FROM (continuous_feedback cf
     JOIN employees e ON ((cf.from_employee_id = e.id)))
  GROUP BY cf.tenant_id, cf.from_employee_id, e.first_name, e.last_name;
```

### `v_feedback_summary`

```sql
SELECT cf.tenant_id,
    cf.to_employee_id AS employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    count(*) AS total_received,
    count(*) FILTER (WHERE ((cf.feedback_type)::text = 'praise'::text)) AS praise_count,
    count(*) FILTER (WHERE ((cf.feedback_type)::text = 'suggestion'::text)) AS suggestion_count,
    count(*) FILTER (WHERE ((cf.feedback_type)::text = 'concern'::text)) AS concern_count,
    count(*) FILTER (WHERE ((cf.visibility)::text = 'public'::text)) AS public_count,
    round(avg(cf.sentiment_score), 2) AS avg_sentiment,
    max(cf.created_at) AS last_feedback_at,
    count(DISTINCT cf.from_employee_id) AS unique_givers
   FROM (continuous_feedback cf
     JOIN employees e ON ((cf.to_employee_id = e.id)))
  GROUP BY cf.tenant_id, cf.to_employee_id, e.first_name, e.last_name;
```

### `v_feedback_wall`

```sql
SELECT cf.id,
    cf.tenant_id,
    cf.from_employee_id,
    (((f.first_name)::text || ' '::text) || (f.last_name)::text) AS from_name,
    f.job_title AS from_job_title,
    cf.to_employee_id,
    (((t.first_name)::text || ' '::text) || (t.last_name)::text) AS to_name,
    t.job_title AS to_job_title,
    d.name AS to_department,
    cf.feedback_type,
    cf.message,
    cf.category,
    cf.tags,
    cf.created_at,
    cf.acknowledged,
    g.title AS related_goal_title
   FROM ((((continuous_feedback cf
     JOIN employees f ON ((cf.from_employee_id = f.id)))
     JOIN employees t ON ((cf.to_employee_id = t.id)))
     LEFT JOIN org_units d ON ((t.org_unit_id = d.id)))
     LEFT JOIN goals g ON ((cf.related_goal_id = g.id)))
  WHERE (((cf.visibility)::text = 'public'::text) AND ((cf.feedback_type)::text = 'praise'::text))
  ORDER BY cf.created_at DESC;
```

### `v_flight_risk_features`

```sql
WITH avg_salaries AS (
         SELECT employees.department,
            avg(employees.salary) AS avg_dept_salary
           FROM employees
          WHERE ((employees.salary > (0)::numeric) AND (employees.is_active = true))
          GROUP BY employees.department
        ), manager_tenures AS (
         SELECT m.id AS manager_id,
            EXTRACT(month FROM age((m.hire_date)::timestamp with time zone)) AS manager_tenure_months
           FROM employees m
        )
 SELECT e.id AS employee_id,
    e.pernr AS sap_pernr,
    e.tenant_id,
    t.code AS tenant_code,
    t.name AS tenant_name,
    e.first_name,
    e.last_name,
    concat(e.first_name, ' ', e.last_name) AS full_name,
    e.job_title,
    e.department,
    e.hire_date,
    round((EXTRACT(epoch FROM age((e.hire_date)::timestamp with time zone)) / ((365.25 * (24)::numeric) * (3600)::numeric)), 1) AS tenure_years,
    COALESCE(e.salary, (0)::numeric) AS salary,
        CASE
            WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric)) THEN round((e.salary / avs.avg_dept_salary), 2)
            ELSE 1.0
        END AS market_ratio,
    e.performance_rating,
    e.potential,
    (round(((random() * (3)::double precision) + (1)::double precision)))::numeric AS last_promotion_years,
    (COALESCE(mt.manager_tenure_months, (24)::numeric))::integer AS manager_tenure_months,
    round((((random() * (40)::double precision) + (5)::double precision))::numeric, 1) AS commute_distance_km,
    round((GREATEST((0)::double precision, LEAST((100)::double precision, (((((50 +
        CASE
            WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (1)::numeric) THEN 20
            WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (2)::numeric) THEN 10
            WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) > (7)::numeric) THEN '-15'::integer
            ELSE 0
        END) +
        CASE
            WHEN (e.performance_rating <= (2)::numeric) THEN 15
            WHEN ((e.performance_rating >= (4)::numeric) AND ((e.potential)::text = 'High'::text)) THEN 10
            WHEN (e.performance_rating >= (4)::numeric) THEN '-10'::integer
            ELSE 0
        END) +
        CASE
            WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) < 0.85)) THEN 20
            WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) > 1.1)) THEN '-10'::integer
            ELSE 0
        END))::double precision + ((random() * (20)::double precision) - (10)::double precision)))))::numeric) AS risk_score,
        CASE
            WHEN (round((GREATEST((0)::double precision, LEAST((100)::double precision, (((((50 +
            CASE
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (1)::numeric) THEN 20
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (2)::numeric) THEN 10
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) > (7)::numeric) THEN '-15'::integer
                ELSE 0
            END) +
            CASE
                WHEN (e.performance_rating <= (2)::numeric) THEN 15
                WHEN ((e.performance_rating >= (4)::numeric) AND ((e.potential)::text = 'High'::text)) THEN 10
                WHEN (e.performance_rating >= (4)::numeric) THEN '-10'::integer
                ELSE 0
            END) +
            CASE
                WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) < 0.85)) THEN 20
                WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) > 1.1)) THEN '-10'::integer
                ELSE 0
            END))::double precision + ((random() * (20)::double precision) - (10)::double precision)))))::numeric) >= (75)::numeric) THEN 'Critical'::text
            WHEN (round((GREATEST((0)::double precision, LEAST((100)::double precision, (((((50 +
            CASE
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (1)::numeric) THEN 20
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (2)::numeric) THEN 10
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) > (7)::numeric) THEN '-15'::integer
                ELSE 0
            END) +
            CASE
                WHEN (e.performance_rating <= (2)::numeric) THEN 15
                WHEN ((e.performance_rating >= (4)::numeric) AND ((e.potential)::text = 'High'::text)) THEN 10
                WHEN (e.performance_rating >= (4)::numeric) THEN '-10'::integer
                ELSE 0
            END) +
            CASE
                WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) < 0.85)) THEN 20
                WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) > 1.1)) THEN '-10'::integer
                ELSE 0
            END))::double precision + ((random() * (20)::double precision) - (10)::double precision)))))::numeric) >= (50)::numeric) THEN 'High'::text
            WHEN (round((GREATEST((0)::double precision, LEAST((100)::double precision, (((((50 +
            CASE
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (1)::numeric) THEN 20
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (2)::numeric) THEN 10
                WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) > (7)::numeric) THEN '-15'::integer
                ELSE 0
            END) +
            CASE
                WHEN (e.performance_rating <= (2)::numeric) THEN 15
                WHEN ((e.performance_rating >= (4)::numeric) AND ((e.potential)::text = 'High'::text)) THEN 10
                WHEN (e.performance_rating >= (4)::numeric) THEN '-10'::integer
                ELSE 0
            END) +
            CASE
                WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) < 0.85)) THEN 20
                WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) > 1.1)) THEN '-10'::integer
                ELSE 0
            END))::double precision + ((random() * (20)::double precision) - (10)::double precision)))))::numeric) >= (25)::numeric) THEN 'Medium'::text
            ELSE 'Low'::text
        END AS risk_level,
    array_remove(ARRAY[
        CASE
            WHEN (EXTRACT(year FROM age((e.hire_date)::timestamp with time zone)) < (2)::numeric) THEN 'New hire risk'::text
            ELSE NULL::text
        END,
        CASE
            WHEN (e.performance_rating <= (2)::numeric) THEN 'Low performance'::text
            ELSE NULL::text
        END,
        CASE
            WHEN ((e.performance_rating >= (4)::numeric) AND ((e.potential)::text = 'High'::text)) THEN 'High performer may leave'::text
            ELSE NULL::text
        END,
        CASE
            WHEN ((e.salary > (0)::numeric) AND (avs.avg_dept_salary > (0)::numeric) AND ((e.salary / avs.avg_dept_salary) < 0.85)) THEN 'Below market salary'::text
            ELSE NULL::text
        END,
        CASE
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating < (3)::numeric)) THEN 'Underutilized potential'::text
            ELSE NULL::text
        END], NULL::text) AS risk_factors
   FROM (((employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
     LEFT JOIN avg_salaries avs ON (((avs.department)::text = (e.department)::text)))
     LEFT JOIN manager_tenures mt ON ((mt.manager_id = e.manager_id)))
  WHERE (e.is_active = true);
```

### `v_goal_cascade`

```sql
WITH RECURSIVE goal_tree AS (
         SELECT g.id,
            g.tenant_id,
            g.title,
            g.description,
            g.employee_id,
            g.parent_goal_id,
            g.status,
            g.progress_percent,
            g.weight,
            g.due_date,
            0 AS level,
            ARRAY[g.id] AS path,
            g.id AS root_id
           FROM goals g
          WHERE (g.parent_goal_id IS NULL)
        UNION ALL
         SELECT g.id,
            g.tenant_id,
            g.title,
            g.description,
            g.employee_id,
            g.parent_goal_id,
            g.status,
            g.progress_percent,
            g.weight,
            g.due_date,
            (gt_1.level + 1),
            (gt_1.path || g.id),
            gt_1.root_id
           FROM (goals g
             JOIN goal_tree gt_1 ON ((g.parent_goal_id = gt_1.id)))
          WHERE (NOT (g.id = ANY (gt_1.path)))
        )
 SELECT gt.id,
    gt.tenant_id,
    gt.title,
    gt.description,
    gt.employee_id,
    gt.parent_goal_id,
    gt.status,
    gt.progress_percent,
    gt.weight,
    gt.due_date,
    gt.level,
    gt.path,
    gt.root_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS owner_name,
    e.job_title AS owner_job_title,
    d.name AS owner_department,
    pg.title AS parent_goal_title
   FROM (((goal_tree gt
     JOIN employees e ON ((gt.employee_id = e.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
     LEFT JOIN goals pg ON ((gt.parent_goal_id = pg.id)));
```

### `v_goals_summary`

```sql
SELECT g.tenant_id,
    t.name AS tenant_name,
    count(*) AS total_goals,
    count(*) FILTER (WHERE ((g.status)::text = 'completed'::text)) AS completed_goals,
    count(*) FILTER (WHERE ((g.status)::text = 'in_progress'::text)) AS in_progress_goals,
    count(*) FILTER (WHERE ((g.status)::text = 'not_started'::text)) AS not_started_goals,
    round(avg(g.progress_percent), 1) AS avg_progress,
    count(*) FILTER (WHERE ((g.due_date < CURRENT_DATE) AND ((g.status)::text <> 'completed'::text))) AS overdue_goals
   FROM (goals g
     JOIN tenants t ON ((t.id = g.tenant_id)))
  GROUP BY g.tenant_id, t.name;
```

### `v_headcount_trend`

```sql
SELECT p1.bukrs AS company_code,
    t.butxt AS company_name,
    p1.orgeh AS org_unit,
    org.stext AS org_unit_name,
    count(DISTINCT p1.pernr) AS headcount,
    count(DISTINCT
        CASE
            WHEN ((p0.stat2)::text = '1'::text) THEN p1.pernr
            ELSE NULL::character varying
        END) AS active_count,
    count(DISTINCT
        CASE
            WHEN ((p0.stat2)::text = '3'::text) THEN p1.pernr
            ELSE NULL::character varying
        END) AS terminated_count,
    avg(p8.ansal) AS avg_salary
   FROM ((((pa0001 p1
     LEFT JOIN pa0000 p0 ON ((((p1.pernr)::text = (p0.pernr)::text) AND (p0.endda = '9999-12-31'::date))))
     LEFT JOIN pa0008 p8 ON ((((p1.pernr)::text = (p8.pernr)::text) AND (p8.endda = '9999-12-31'::date))))
     LEFT JOIN t500c t ON (((p1.bukrs)::text = (t.bukrs)::text)))
     LEFT JOIN hrp1000 org ON ((((p1.orgeh)::text = (org.objid)::text) AND ((org.otype)::text = 'O'::text) AND (org.endda = '9999-12-31'::date))))
  WHERE (p1.endda = '9999-12-31'::date)
  GROUP BY p1.bukrs, t.butxt, p1.orgeh, org.stext
  ORDER BY p1.bukrs, p1.orgeh;
```

### `v_hr_essentials`

```sql
SELECT p0002.pernr,
    p0002.vorna AS first_name,
    p0002.nachn AS last_name,
    p0002.gbdat AS birth_date,
    p0000.stat2 AS status,
    p0001.bukrs AS company_code,
    p0001.orgeh AS org_unit,
    p0001.plans AS "position",
    email.usrid_long AS email
   FROM (((pa0002 p0002
     LEFT JOIN pa0000 p0000 ON ((((p0002.pernr)::text = (p0000.pernr)::text) AND (p0000.endda = '9999-12-31'::date))))
     LEFT JOIN pa0001 p0001 ON ((((p0002.pernr)::text = (p0001.pernr)::text) AND (p0001.endda = '9999-12-31'::date))))
     LEFT JOIN pa0105 email ON ((((p0002.pernr)::text = (email.pernr)::text) AND ((email.subty)::text = '0010'::text) AND (email.endda = '9999-12-31'::date))))
  WHERE (p0002.endda = '9999-12-31'::date);
```

### `v_job_profile`

```sql
SELECT j.objid AS job_id,
    j.stext AS job_title,
    j.short AS job_code,
    c.min_salary,
    c.mid_salary,
    c.max_salary,
    c.currency,
    string_agg(DISTINCT (cat.qual_name)::text, ', '::text) AS required_skills,
    count(DISTINCT req.quali) AS skill_count
   FROM (((hrp1000 j
     LEFT JOIN hrp1005 c ON ((((j.objid)::text = (c.objid)::text) AND ((c.otype)::text = 'C'::text) AND (c.endda = '9999-12-31'::date))))
     LEFT JOIN hrp1035 req ON ((((j.objid)::text = (req.objid)::text) AND ((req.otype)::text = 'C'::text) AND (req.endda = '9999-12-31'::date))))
     LEFT JOIN hrp1036 cat ON ((((req.quali)::text = (cat.objid)::text) AND (cat.endda = '9999-12-31'::date))))
  WHERE (((j.otype)::text = 'C'::text) AND (j.endda = '9999-12-31'::date))
  GROUP BY j.objid, j.stext, j.short, c.min_salary, c.mid_salary, c.max_salary, c.currency
  ORDER BY j.stext;
```

### `v_job_template_courses`

```sql
SELECT DISTINCT jt.id AS job_template_id,
    jt.tenant_id,
    jtc.course_id,
    jtc.requirement_type,
    jtc.priority,
    jtc.rationale,
    jt.title_it AS job_template_title
   FROM (job_templates jt
     JOIN job_title_courses jtc ON (((((jtc.job_title)::text = (jt.title_it)::text) OR ((jtc.job_title)::text = (jt.title_en)::text)) AND (jtc.tenant_id = jt.tenant_id))));
```

### `v_learning_dashboard`

```sql
SELECT t.id AS tenant_id,
    t.code AS tenant_code,
    t.name AS tenant_name,
    count(DISTINCT c.id) AS total_courses,
    count(DISTINCT c.id) FILTER (WHERE ((c.status)::text = 'published'::text)) AS published_courses,
    count(DISTINCT lp.id) AS total_learning_paths,
    count(DISTINCT ce.id) AS total_enrollments,
    count(DISTINCT ce.id) FILTER (WHERE ((ce.status)::text = 'completed'::text)) AS completed_enrollments,
    count(DISTINCT ce.id) FILTER (WHERE ((ce.status)::text = 'in_progress'::text)) AS in_progress_enrollments,
    round(avg(ce.progress_percent), 1) AS avg_progress,
    count(DISTINCT ec.id) AS total_certifications_earned,
    count(DISTINCT lr.id) FILTER (WHERE ((lr.status)::text = 'pending'::text)) AS pending_recommendations
   FROM (((((tenants t
     LEFT JOIN courses c ON ((c.tenant_id = t.id)))
     LEFT JOIN learning_paths lp ON ((lp.tenant_id = t.id)))
     LEFT JOIN course_enrollments ce ON ((ce.course_id = c.id)))
     LEFT JOIN employee_certifications ec ON ((ec.employee_id IN ( SELECT employees.id
           FROM employees
          WHERE (employees.tenant_id = t.id)))))
     LEFT JOIN learning_recommendations lr ON ((lr.employee_id IN ( SELECT employees.id
           FROM employees
          WHERE (employees.tenant_id = t.id)))))
  GROUP BY t.id, t.code, t.name;
```

### `v_learning_path_progress`

```sql
SELECT lpe.id AS enrollment_id,
    lpe.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    lpe.learning_path_id,
    lp.title AS path_title,
    lp.target_role,
    lp.estimated_duration_hours,
    lpe.status,
    lpe.progress_percent,
    lpe.enrolled_at,
    lpe.completed_at,
    count(lpc.id) AS total_courses_in_path,
    count(ce.id) FILTER (WHERE ((ce.status)::text = 'completed'::text)) AS courses_completed,
    count(ce.id) FILTER (WHERE ((ce.status)::text = 'in_progress'::text)) AS courses_in_progress
   FROM ((((learning_path_enrollments lpe
     JOIN employees e ON ((e.id = lpe.employee_id)))
     JOIN learning_paths lp ON ((lp.id = lpe.learning_path_id)))
     LEFT JOIN learning_path_courses lpc ON ((lpc.learning_path_id = lp.id)))
     LEFT JOIN course_enrollments ce ON (((ce.course_id = lpc.course_id) AND (ce.employee_id = lpe.employee_id))))
  GROUP BY lpe.id, lpe.employee_id, e.first_name, e.last_name, lpe.learning_path_id, lp.title, lp.target_role, lp.estimated_duration_hours, lpe.status, lpe.progress_percent, lpe.enrolled_at, lpe.completed_at;
```

### `v_learning_skills_development`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    ces.esco_skill_uri,
    ces.skill_name,
    ces.skill_type,
    max(ces.proficiency_level_gained) AS max_level_from_courses,
    count(DISTINCT ce.course_id) AS courses_completed_for_skill,
    array_agg(DISTINCT c.title) AS completed_courses
   FROM (((employees e
     JOIN course_enrollments ce ON (((ce.employee_id = e.id) AND ((ce.status)::text = 'completed'::text))))
     JOIN course_esco_skills ces ON ((ces.course_id = ce.course_id)))
     JOIN courses c ON ((c.id = ce.course_id)))
  GROUP BY e.id, e.tenant_id, e.first_name, e.last_name, ces.esco_skill_uri, ces.skill_name, ces.skill_type;
```

### `v_manager_chain_issues`

```sql
WITH RECURSIVE manager_chain AS (
         SELECT employees.id AS employee_id,
            employees.manager_id,
            employees.tenant_id,
            1 AS depth,
            ARRAY[employees.id] AS chain
           FROM employees
          WHERE (employees.manager_id IS NOT NULL)
        UNION ALL
         SELECT mc.employee_id,
            e_1.manager_id,
            mc.tenant_id,
            (mc.depth + 1),
            (mc.chain || e_1.id)
           FROM (manager_chain mc
             JOIN employees e_1 ON ((mc.manager_id = e_1.id)))
          WHERE ((mc.depth < 20) AND (e_1.id <> ALL (mc.chain)))
        )
 SELECT e.id AS employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    e.tenant_id,
    t.name AS tenant_name,
        CASE
            WHEN ((e.manager_id IS NOT NULL) AND (NOT (EXISTS ( SELECT 1
               FROM employees
              WHERE (employees.id = e.manager_id))))) THEN 'invalid_manager'::text
            WHEN (e.manager_id = e.id) THEN 'self_reference'::text
            WHEN (EXISTS ( SELECT 1
               FROM manager_chain mc
              WHERE ((mc.employee_id = e.id) AND (e.id = ANY (mc.chain[2:]))))) THEN 'circular_reference'::text
            WHEN ((e.manager_id IS NULL) AND ((e.auth_role)::text <> ALL (ARRAY[('TENANT_ADMIN'::character varying)::text, ('SYSADMIN'::character varying)::text])) AND (e.is_active = true)) THEN 'no_manager'::text
            ELSE 'ok'::text
        END AS issue_type
   FROM (employees e
     JOIN tenants t ON ((e.tenant_id = t.id)))
  WHERE ((t.code)::text <> 'heuresys'::text);
```

### `v_marketplace_plugins`

```sql
SELECT p.id,
    p.name,
    p.slug,
    p.short_description,
    p.icon_url,
    pc.name AS category_name,
    pc.slug AS category_slug,
    pc.icon AS category_icon,
    p.publisher_name,
    p.status,
    p.visibility,
    p.pricing_model,
    p.price_cents,
    p.currency,
    p.tags,
    p.avg_rating,
    p.total_ratings,
    p.total_installations,
    p.featured,
    pv.version AS latest_version,
    pv.published_at AS latest_version_date,
    p.created_at,
    p.updated_at
   FROM ((plugins p
     LEFT JOIN plugin_categories pc ON ((pc.id = p.category_id)))
     LEFT JOIN plugin_versions pv ON (((pv.plugin_id = p.id) AND (pv.is_latest = true))))
  WHERE (((p.status)::text = 'published'::text) AND ((p.visibility)::text = 'public'::text));
```

### `v_my_applications`

```sql
SELECT a.id,
    a.job_posting_id,
    a.employee_id,
    a.cover_letter,
    a.motivation,
    a.relevant_experience,
    a.matched_skills,
    a.skill_match_score,
    a.status,
    a.current_manager_id,
    a.manager_approval_status,
    a.manager_approval_date,
    a.manager_notes,
    a.hr_reviewer_id,
    a.hr_notes,
    a.hr_score,
    a.interview_scheduled,
    a.interview_date,
    a.interview_feedback,
    a.outcome_notes,
    a.rejected_reason,
    a.submitted_at,
    a.reviewed_at,
    a.decided_at,
    a.created_at,
    a.updated_at,
    j.title AS job_title,
    j.department,
    j.location,
    j.job_level,
    j.status AS job_status
   FROM (internal_applications a
     JOIN internal_job_postings j ON ((a.job_posting_id = j.id)));
```

### `v_nine_box_grid`

```sql
SELECT e.id AS employee_id,
    e.pernr AS sap_pernr,
    e.tenant_id,
    t.code AS tenant_code,
    t.name AS tenant_name,
    e.first_name,
    e.last_name,
    concat(e.first_name, ' ', e.last_name) AS full_name,
    e.email,
    e.job_title,
    e.department,
    e.performance_rating,
    e.potential,
        CASE
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating >= (4)::numeric)) THEN 'Star'::text
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 'High Potential'::text
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating < 2.5)) THEN 'Inconsistent Player'::text
            WHEN (((e.potential)::text = 'Medium'::text) AND (e.performance_rating >= (4)::numeric)) THEN 'High Performer'::text
            WHEN (((e.potential)::text = 'Medium'::text) AND (e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 'Core Player'::text
            WHEN (((e.potential)::text = 'Medium'::text) AND (e.performance_rating < 2.5)) THEN 'Underperformer'::text
            WHEN (((e.potential)::text = 'Low'::text) AND (e.performance_rating >= (4)::numeric)) THEN 'Solid Performer'::text
            WHEN (((e.potential)::text = 'Low'::text) AND (e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 'Average Performer'::text
            WHEN (((e.potential)::text = 'Low'::text) AND (e.performance_rating < 2.5)) THEN 'Risk'::text
            ELSE 'Not Rated'::text
        END AS box_label,
        CASE
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating >= (4)::numeric)) THEN 9
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 8
            WHEN (((e.potential)::text = 'High'::text) AND (e.performance_rating < 2.5)) THEN 7
            WHEN (((e.potential)::text = 'Medium'::text) AND (e.performance_rating >= (4)::numeric)) THEN 6
            WHEN (((e.potential)::text = 'Medium'::text) AND (e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 5
            WHEN (((e.potential)::text = 'Medium'::text) AND (e.performance_rating < 2.5)) THEN 4
            WHEN (((e.potential)::text = 'Low'::text) AND (e.performance_rating >= (4)::numeric)) THEN 3
            WHEN (((e.potential)::text = 'Low'::text) AND (e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 2
            WHEN (((e.potential)::text = 'Low'::text) AND (e.performance_rating < 2.5)) THEN 1
            ELSE 0
        END AS box_number,
        CASE
            WHEN ((e.potential)::text = 'High'::text) THEN 3
            WHEN ((e.potential)::text = 'Medium'::text) THEN 2
            WHEN ((e.potential)::text = 'Low'::text) THEN 1
            ELSE 0
        END AS potential_score,
        CASE
            WHEN (e.performance_rating >= (4)::numeric) THEN 3
            WHEN ((e.performance_rating >= 2.5) AND (e.performance_rating <= 3.99)) THEN 2
            WHEN (e.performance_rating < 2.5) THEN 1
            ELSE 0
        END AS performance_score
   FROM (employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
  WHERE (e.is_active = true);
```

### `v_okr_progress`

```sql
SELECT NULL::uuid AS okr_id,
    NULL::uuid AS tenant_id,
    NULL::text AS objective,
    NULL::character varying(50) AS okr_type,
    NULL::date AS period_start,
    NULL::date AS period_end,
    NULL::character varying(50) AS status,
    NULL::bigint AS key_results_count,
    NULL::numeric AS avg_kr_progress,
    NULL::numeric(3,2) AS confidence_level;
```

### `v_onboarding_dashboard`

```sql
SELECT oi.tenant_id,
    oi.id AS instance_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    e.department,
    ot.name AS template_name,
    oi.status,
    oi.start_date,
    oi.target_completion_date,
    oi.progress_percent,
    ( SELECT count(*) AS count
           FROM onboarding_tasks t
          WHERE (t.instance_id = oi.id)) AS total_tasks,
    ( SELECT count(*) AS count
           FROM onboarding_tasks t
          WHERE ((t.instance_id = oi.id) AND ((t.status)::text = 'completed'::text))) AS completed_tasks,
    ( SELECT count(*) AS count
           FROM onboarding_tasks t
          WHERE ((t.instance_id = oi.id) AND ((t.status)::text = 'pending'::text) AND (t.due_date < CURRENT_DATE))) AS overdue_tasks,
    (((buddy.first_name)::text || ' '::text) || (buddy.last_name)::text) AS buddy_name
   FROM (((onboarding_instances oi
     JOIN employees e ON ((oi.employee_id = e.id)))
     LEFT JOIN onboarding_templates ot ON ((oi.template_id = ot.id)))
     LEFT JOIN employees buddy ON ((oi.assigned_buddy_id = buddy.id)));
```

### `v_org_hierarchy`

```sql
WITH RECURSIVE org_tree AS (
         SELECT org_units.id,
            org_units.tenant_id,
            org_units.code,
            org_units.name,
            org_units.parent_id,
            org_units.org_level,
            org_units.org_type,
            org_units.legacy_department_id,
            org_units.default_location_id,
            org_units.manager_id,
            (org_units.name)::text AS path_name,
            (org_units.code)::text AS path_code,
            1 AS depth
           FROM org_units
          WHERE ((org_units.parent_id IS NULL) AND (org_units.is_active = true))
        UNION ALL
         SELECT ou.id,
            ou.tenant_id,
            ou.code,
            ou.name,
            ou.parent_id,
            ou.org_level,
            ou.org_type,
            ou.legacy_department_id,
            ou.default_location_id,
            ou.manager_id,
            ((ot_1.path_name || ' > '::text) || (ou.name)::text),
            ((ot_1.path_code || '.'::text) || (ou.code)::text),
            (ot_1.depth + 1)
           FROM (org_units ou
             JOIN org_tree ot_1 ON ((ou.parent_id = ot_1.id)))
          WHERE (ou.is_active = true)
        )
 SELECT ot.id,
    ot.tenant_id,
    ot.code,
    ot.name,
    ot.parent_id,
    ot.org_level,
    ot.org_type,
    ot.legacy_department_id,
    ot.default_location_id,
    ot.manager_id,
    ot.path_name,
    ot.path_code,
    ot.depth,
    d.name AS department_name,
    d.color AS department_color,
    l.name AS location_name,
    l.city AS location_city,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS manager_name
   FROM (((org_tree ot
     LEFT JOIN org_units d ON ((ot.legacy_department_id = d.id)))
     LEFT JOIN locations l ON ((ot.default_location_id = l.id)))
     LEFT JOIN employees e ON ((ot.manager_id = e.id)));
```

### `v_org_structure`

```sql
SELECT o.objid AS org_unit_id,
    o.stext AS org_name,
    o.short AS org_code,
    r.sobid AS parent_org_id,
    p.stext AS parent_name
   FROM ((hrp1000 o
     LEFT JOIN hrp1001 r ON ((((o.objid)::text = (r.objid)::text) AND ((r.rsign)::text = 'A'::text) AND ((r.relat)::text = '002'::text) AND (r.endda = '9999-12-31'::date))))
     LEFT JOIN hrp1000 p ON ((((r.sobid)::text = (p.objid)::text) AND ((p.otype)::text = 'O'::text) AND (p.endda = '9999-12-31'::date))))
  WHERE (((o.otype)::text = 'O'::text) AND (o.endda = '9999-12-31'::date));
```

### `v_org_structure_stats`

```sql
SELECT id AS tenant_id,
    name AS tenant_name,
    ( SELECT count(*) AS count
           FROM locations
          WHERE ((locations.tenant_id = t.id) AND (locations.is_active = true))) AS total_locations,
    ( SELECT count(*) AS count
           FROM org_units
          WHERE ((org_units.tenant_id = t.id) AND (org_units.is_active = true))) AS total_departments,
    ( SELECT count(*) AS count
           FROM org_units
          WHERE ((org_units.tenant_id = t.id) AND (org_units.is_active = true))) AS total_org_units,
    ( SELECT count(*) AS count
           FROM cost_centers
          WHERE ((cost_centers.tenant_id = t.id) AND (cost_centers.is_active = true))) AS total_cost_centers,
    ( SELECT count(*) AS count
           FROM employees
          WHERE ((employees.tenant_id = t.id) AND ((t.status)::text = 'active'::text))) AS total_employees
   FROM tenants t
  WHERE ((status)::text = 'active'::text);
```

### `v_org_structure_summary`

```sql
SELECT t.code AS tenant_code,
    t.name AS tenant_name,
    count(DISTINCT e.id) AS total_employees,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'TENANT_ADMIN'::text) THEN e.id
            ELSE NULL::uuid
        END) AS tenant_admins,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'IT_ADMIN'::text) THEN e.id
            ELSE NULL::uuid
        END) AS it_admins,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'HR_DIRECTOR'::text) THEN e.id
            ELSE NULL::uuid
        END) AS hr_directors,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'HR_MANAGER'::text) THEN e.id
            ELSE NULL::uuid
        END) AS hr_managers,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'DEPT_HEAD'::text) THEN e.id
            ELSE NULL::uuid
        END) AS dept_heads,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'LINE_MANAGER'::text) THEN e.id
            ELSE NULL::uuid
        END) AS line_managers,
    count(DISTINCT
        CASE
            WHEN ((e.auth_role)::text = 'EMPLOYEE'::text) THEN e.id
            ELSE NULL::uuid
        END) AS employees,
    count(DISTINCT
        CASE
            WHEN ((e.manager_id IS NULL) AND ((e.auth_role)::text <> ALL (ARRAY[('TENANT_ADMIN'::character varying)::text, ('SYSADMIN'::character varying)::text]))) THEN e.id
            ELSE NULL::uuid
        END) AS orphans,
    count(DISTINCT d.id) AS departments,
    count(DISTINCT
        CASE
            WHEN (d.manager_id IS NOT NULL) THEN d.id
            ELSE NULL::uuid
        END) AS depts_with_head
   FROM ((tenants t
     LEFT JOIN employees e ON (((e.tenant_id = t.id) AND (e.is_active = true))))
     LEFT JOIN org_units d ON ((d.tenant_id = t.id)))
  WHERE ((t.code)::text <> 'heuresys'::text)
  GROUP BY t.id, t.code, t.name
  ORDER BY t.name;
```

### `v_org_unit_headcount`

```sql
SELECT tou.id AS org_unit_id,
    tou.chart_id,
    toc.tenant_id,
    tou.code,
    tou.name_it,
    tou.cost_center,
    oa.code AS area_code,
    oa.name_it AS area_name,
    ol.level,
    ol.name_it AS level_name,
    tou.headcount_budget,
    count(DISTINCT e.id) AS headcount_actual,
    (tou.headcount_budget - count(DISTINCT e.id)) AS headcount_variance,
    count(DISTINCT tj.id) AS job_count,
    COALESCE(sum(tj.budgeted_positions), (0)::bigint) AS total_budgeted_positions,
    COALESCE(sum(tj.filled_positions), (0)::bigint) AS total_filled_positions
   FROM ((((((tenant_org_units tou
     JOIN tenant_org_charts toc ON ((tou.chart_id = toc.id)))
     LEFT JOIN org_areas oa ON (((tou.area_code)::text = (oa.code)::text)))
     LEFT JOIN org_levels ol ON ((tou.level = ol.level)))
     LEFT JOIN tenant_jobs tj ON (((tou.id = tj.tenant_org_unit_id) AND (tj.is_active = true))))
     LEFT JOIN employee_job_assignments eja ON (((tj.id = eja.tenant_job_id) AND (eja.is_current = true))))
     LEFT JOIN employees e ON (((eja.employee_id = e.id) AND (e.is_active = true))))
  WHERE (tou.is_active = true)
  GROUP BY tou.id, tou.chart_id, toc.tenant_id, tou.code, tou.name_it, tou.cost_center, oa.code, oa.name_it, ol.level, ol.name_it, tou.headcount_budget;
```

### `v_overtime_analysis`

```sql
SELECT e.pernr,
    e.company_code,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS full_name,
    e."position" AS position_text,
    date_trunc('month'::text, (o.begda)::timestamp with time zone) AS month,
    count(*) AS ot_occurrences,
    sum(o.stdaz) AS total_ot_hours,
    avg(o.stdaz) AS avg_ot_per_occurrence,
    sum(
        CASE
            WHEN o.approved THEN o.stdaz
            ELSE (0)::numeric
        END) AS approved_hours,
    sum(
        CASE
            WHEN (NOT o.approved) THEN o.stdaz
            ELSE (0)::numeric
        END) AS pending_hours
   FROM (v_employee_master e
     LEFT JOIN pa2005 o ON (((e.pernr)::text = (o.pernr)::text)))
  WHERE (o.begda >= date_trunc('year'::text, (CURRENT_DATE)::timestamp with time zone))
  GROUP BY e.pernr, e.company_code, e.first_name, e.last_name, e."position", (date_trunc('month'::text, (o.begda)::timestamp with time zone))
  ORDER BY (sum(o.stdaz)) DESC NULLS LAST;
```

### `v_payroll_summary`

```sql
SELECT e.pernr,
    e.company_code,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS full_name,
    p.abkrs AS payroll_area,
    p.paession AS year,
    p.pession_no AS period,
    p.gross_pay,
    p.net_pay,
    (p.gross_pay - p.net_pay) AS total_deductions,
    p.status,
    p.rgdate AS process_date
   FROM (v_employee_master e
     JOIN pcl2 p ON (((e.pernr)::text = (p.pernr)::text)))
  WHERE ((p.relession)::text = 'RG'::text)
  ORDER BY p.paession DESC, p.pession_no DESC, e.pernr;
```

### `v_people_inspector`

```sql
SELECT e.id,
    e.tenant_id,
    e.pernr,
    e.first_name,
    e.last_name,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS full_name,
    e.email,
    e.job_title,
    e.department,
    e.location,
    e.location_id,
    l.name AS location_name,
    l.city AS location_city,
    l.country AS location_country,
    e.manager_id,
    (((mgr.first_name)::text || ' '::text) || (mgr.last_name)::text) AS manager_name,
    e.hire_date,
    e.termination_date,
    e.employment_status,
    e.is_active,
    t.name AS tenant_name
   FROM (((employees e
     LEFT JOIN locations l ON ((l.id = e.location_id)))
     LEFT JOIN employees mgr ON ((mgr.id = e.manager_id)))
     LEFT JOIN tenants t ON ((t.id = e.tenant_id)));
```

### `v_performance_skill_summary`

```sql
SELECT psl.tenant_id,
    psl.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    d.name AS department_name,
    count(*) AS total_competencies,
    count(*) FILTER (WHERE ((psl.rating_level)::text = 'low'::text)) AS low_rated,
    count(*) FILTER (WHERE ((psl.rating_level)::text = 'medium'::text)) AS medium_rated,
    count(*) FILTER (WHERE ((psl.rating_level)::text = 'high'::text)) AS high_rated,
    count(*) FILTER (WHERE (psl.linked_skill_id IS NOT NULL)) AS skills_linked,
    count(*) FILTER (WHERE (psl.linked_gap_analysis_id IS NOT NULL)) AS gap_analyses,
    count(*) FILTER (WHERE (psl.is_addressed = true)) AS addressed,
    max(psl.created_at) AS last_updated
   FROM ((performance_skill_links psl
     JOIN employees e ON ((psl.employee_id = e.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
  GROUP BY psl.tenant_id, psl.employee_id, e.first_name, e.last_name, e.job_title, d.name;
```

### `v_platform_tables`

```sql
SELECT table_name,
    schema_name,
    description,
    example_use
   FROM table_usage_rules
  WHERE (((usage_allowed)::text = ANY (ARRAY[('PLATFORM'::character varying)::text, ('BOTH'::character varying)::text])) AND ((table_category)::text = ANY (ARRAY[('HEURESYS_CORE'::character varying)::text, ('HEURESYS_MODULE'::character varying)::text])))
  ORDER BY table_category, table_name;
```

### `v_recruiting_pipeline`

```sql
SELECT r.tenant_id,
    r.id AS requisition_id,
    r.title,
    r.department,
    r.status AS req_status,
    r.priority,
    count(a.id) AS total_applications,
    count(a.id) FILTER (WHERE ((a.stage)::text = 'applied'::text)) AS applied,
    count(a.id) FILTER (WHERE ((a.stage)::text = 'screening'::text)) AS screening,
    count(a.id) FILTER (WHERE ((a.stage)::text = 'interview'::text)) AS interview,
    count(a.id) FILTER (WHERE ((a.stage)::text = 'offer'::text)) AS offer,
    count(a.id) FILTER (WHERE ((a.stage)::text = 'hired'::text)) AS hired,
    count(a.id) FILTER (WHERE ((a.status)::text = 'rejected'::text)) AS rejected,
    r.positions_total,
    r.positions_filled,
    r.posted_date,
    (CURRENT_DATE - r.posted_date) AS days_open
   FROM (requisitions r
     LEFT JOIN applications a ON ((a.requisition_id = r.id)))
  GROUP BY r.id;
```

### `v_requisition_pipeline`

```sql
SELECT r.id,
    r.tenant_id,
    r.title,
    r.department,
    r.location,
    r.status,
    r.priority,
    r.salary_min,
    r.salary_max,
    r.hiring_manager_id,
    r.recruiter_id,
    r.target_hire_date,
    r.created_at,
    (EXTRACT(day FROM (now() - (r.created_at)::timestamp with time zone)))::integer AS days_open,
    count(c.id) FILTER (WHERE (c.id IS NOT NULL)) AS total_candidates,
    count(c.id) FILTER (WHERE ((c.stage)::text = 'applied'::text)) AS applied_count,
    count(c.id) FILTER (WHERE ((c.stage)::text = 'screening'::text)) AS screening_count,
    count(c.id) FILTER (WHERE ((c.stage)::text = 'interview'::text)) AS interview_count,
    count(c.id) FILTER (WHERE ((c.stage)::text = 'assessment'::text)) AS assessment_count,
    count(c.id) FILTER (WHERE ((c.stage)::text = 'offer'::text)) AS offer_count,
    count(c.id) FILTER (WHERE ((c.stage)::text = 'hired'::text)) AS hired_count
   FROM (recruiting_requisitions r
     LEFT JOIN recruiting_candidates c ON ((r.id = c.requisition_id)))
  GROUP BY r.id;
```

### `v_risk_distribution`

```sql
SELECT pp.tenant_id,
    d.id AS department_id,
    d.name AS department_name,
    count(*) AS total_employees,
    count(*) FILTER (WHERE ((pp.risk_level)::text = 'low'::text)) AS low_risk,
    count(*) FILTER (WHERE ((pp.risk_level)::text = 'medium'::text)) AS medium_risk,
    count(*) FILTER (WHERE ((pp.risk_level)::text = 'high'::text)) AS high_risk,
    count(*) FILTER (WHERE ((pp.risk_level)::text = 'critical'::text)) AS critical_risk,
    count(*) FILTER (WHERE pp.is_high_potential) AS high_potentials,
    round(avg(pp.risk_score), 1) AS avg_risk_score,
    round(avg(pp.predicted_rating), 2) AS avg_predicted_rating
   FROM ((performance_predictions pp
     JOIN employees e ON ((pp.employee_id = e.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
  WHERE (pp.is_current = true)
  GROUP BY pp.tenant_id, d.id, d.name;
```

### `v_sap_esco_skills`

```sql
SELECT q.qualifi AS sap_qualification_id,
    q.qualifitext AS sap_name,
    q.esco_skill_uri,
    q.esco_concept_type,
    cat.qual_type AS skill_type,
    cat.qual_group AS skill_group,
    count(DISTINCT e.pernr) AS employees_with_skill
   FROM ((t771q q
     LEFT JOIN hrp1036 cat ON ((((q.qualifi)::text = (cat.objid)::text) AND (cat.endda = '9999-12-31'::date))))
     LEFT JOIN pa0024 e ON ((((q.qualifi)::text = (e.quali)::text) AND (e.endda = '9999-12-31'::date))))
  WHERE (q.endda = '9999-12-31'::date)
  GROUP BY q.qualifi, q.qualifitext, q.esco_skill_uri, q.esco_concept_type, cat.qual_type, cat.qual_group
  ORDER BY (count(DISTINCT e.pernr)) DESC NULLS LAST;
```

### `v_sap_only_tables`

```sql
SELECT table_name,
    description,
    forbidden_use
   FROM table_usage_rules
  WHERE ((table_category)::text = 'SAP_ONLY'::text)
  ORDER BY table_name;
```

### `v_skill_classification_stats`

```sql
SELECT count(*) AS total_skills,
    count(sc.id) AS classified_skills,
    (count(*) - count(sc.id)) AS unclassified_skills,
    round(((100.0 * (count(sc.id))::numeric) / (NULLIF(count(*), 0))::numeric), 2) AS classification_percentage,
    count(sc.id) FILTER (WHERE ((sc.primary_category)::text = 'hard'::text)) AS hard_skills,
    count(sc.id) FILTER (WHERE ((sc.primary_category)::text = 'soft'::text)) AS soft_skills,
    count(sc.id) FILTER (WHERE ((sc.primary_category)::text = 'hybrid'::text)) AS hybrid_skills,
    count(sc.id) FILTER (WHERE (sc.cognitive_level = 1)) AS cognitive_level_1,
    count(sc.id) FILTER (WHERE (sc.cognitive_level = 2)) AS cognitive_level_2,
    count(sc.id) FILTER (WHERE (sc.cognitive_level = 3)) AS cognitive_level_3,
    count(sc.id) FILTER (WHERE (sc.cognitive_level = 4)) AS cognitive_level_4,
    count(sc.id) FILTER (WHERE ((sc.social_dimension)::text = 'intrapersonal'::text)) AS intrapersonal,
    count(sc.id) FILTER (WHERE ((sc.social_dimension)::text = 'interpersonal'::text)) AS interpersonal,
    count(sc.id) FILTER (WHERE ((sc.social_dimension)::text = 'task_oriented'::text)) AS task_oriented,
    count(sc.id) FILTER (WHERE ((sc.transferability)::text = 'specialized'::text)) AS specialized,
    count(sc.id) FILTER (WHERE ((sc.transferability)::text = 'adjacent'::text)) AS adjacent,
    count(sc.id) FILTER (WHERE ((sc.transferability)::text = 'transferable'::text)) AS transferable,
    count(sc.id) FILTER (WHERE (sc.needs_review = true)) AS needs_review
   FROM (esco_skills es
     LEFT JOIN skill_classifications sc ON ((es.id = sc.esco_skill_id)));
```

### `v_skill_clusters_summary`

```sql
SELECT skc.id,
    skc.code,
    skc.name_en,
    skc.name_it,
    skc.cluster_level,
    skc.parent_cluster_id,
    parent.code AS parent_code,
    parent.name_en AS parent_name,
    count(sc.id) AS skill_count,
    count(sc.id) FILTER (WHERE ((sc.primary_category)::text = 'hard'::text)) AS hard_skill_count,
    count(sc.id) FILTER (WHERE ((sc.primary_category)::text = 'soft'::text)) AS soft_skill_count,
    count(sc.id) FILTER (WHERE ((sc.primary_category)::text = 'hybrid'::text)) AS hybrid_skill_count
   FROM ((skill_clusters skc
     LEFT JOIN skill_clusters parent ON ((skc.parent_cluster_id = parent.id)))
     LEFT JOIN skill_classifications sc ON ((skc.id = sc.skill_cluster_id)))
  GROUP BY skc.id, skc.code, skc.name_en, skc.name_it, skc.cluster_level, skc.parent_cluster_id, parent.code, parent.name_en;
```

### `v_skill_gaps`

```sql
SELECT esa.id AS assessment_id,
    esa.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.tenant_id,
    esa.skill_name,
    esa.esco_skill_uri,
    esa.required_level,
    esa.assessed_level,
    esa.gap,
        CASE
            WHEN ((esa.gap IS NULL) OR (esa.gap <= 0)) THEN 'met'::text
            WHEN (esa.gap = 1) THEN 'minor_gap'::text
            WHEN (esa.gap = 2) THEN 'moderate_gap'::text
            ELSE 'critical_gap'::text
        END AS gap_severity,
    esa.assessment_date,
    esa.assessment_method,
    tjs.importance AS skill_importance,
    tjs.skill_category
   FROM ((employee_skill_assessments esa
     JOIN employees e ON ((esa.employee_id = e.id)))
     LEFT JOIN tenant_job_skills tjs ON ((esa.tenant_job_skill_id = tjs.id)))
  WHERE (e.is_active = true);
```

### `v_skills_classified`

```sql
SELECT es.id,
    es.uri,
    es.preferred_label,
    es.description,
    es.skill_type AS esco_skill_type,
    es.reuse_level,
    es.is_digital,
    es.is_green,
    sc.primary_category,
    sc.primary_category_confidence,
    sc.cognitive_level,
    sc.cognitive_level_label,
    sc.social_dimension,
    sc.transferability,
    sc.transferability_score,
    sc.classification_source,
    sc.needs_review,
    skc.id AS cluster_id,
    skc.code AS cluster_code,
    skc.name_en AS cluster_name,
    skc.cluster_level
   FROM ((esco_skills es
     LEFT JOIN skill_classifications sc ON ((es.id = sc.esco_skill_id)))
     LEFT JOIN skill_clusters skc ON ((sc.skill_cluster_id = skc.id)));
```

### `v_skills_gap`

```sql
SELECT e.pernr,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e."position",
    req.quali AS required_skill_id,
    cat.qual_name AS skill_name,
    req.proficiency_required,
    COALESCE(emp.proficiency, '00'::character varying) AS current_proficiency,
        CASE
            WHEN (emp.proficiency IS NULL) THEN 'Missing'::text
            WHEN ((emp.proficiency)::text < (req.proficiency_required)::text) THEN 'Gap'::text
            ELSE 'Met'::text
        END AS gap_status,
    req.esco_skill_uri
   FROM ((((v_employee_master e
     JOIN pa0001 p1 ON ((((e.pernr)::text = (p1.pernr)::text) AND (p1.endda = '9999-12-31'::date))))
     JOIN hrp1035 req ON ((((p1.plans)::text = (req.objid)::text) AND ((req.otype)::text = 'S'::text) AND (req.endda = '9999-12-31'::date))))
     LEFT JOIN hrp1036 cat ON ((((req.quali)::text = (cat.objid)::text) AND (cat.endda = '9999-12-31'::date))))
     LEFT JOIN pa0024 emp ON ((((e.pernr)::text = (emp.pernr)::text) AND ((req.quali)::text = (emp.quali)::text) AND (emp.endda = '9999-12-31'::date))))
  ORDER BY e.pernr,
        CASE
            WHEN (emp.proficiency IS NULL) THEN 'Missing'::text
            WHEN ((emp.proficiency)::text < (req.proficiency_required)::text) THEN 'Gap'::text
            ELSE 'Met'::text
        END DESC, req.quali;
```

### `v_skills_matrix`

```sql
SELECT t.id AS tenant_id,
    t.code AS tenant_code,
    skill.skill,
    count(*) AS employee_count,
    round(avg(e.performance_rating), 2) AS avg_performance
   FROM ((employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
     CROSS JOIN LATERAL unnest(COALESCE(e.skills, ARRAY[]::text[])) skill(skill))
  WHERE (e.is_active = true)
  GROUP BY t.id, t.code, skill.skill
  ORDER BY t.id, (count(*)) DESC;
```

### `v_succession_pipeline`

```sql
SELECT cr.tenant_id,
    cr.id AS role_id,
    cr.role_name,
    cr.department,
    cr.criticality_level,
    cr.succession_status,
    (((e_inc.first_name)::text || ' '::text) || (e_inc.last_name)::text) AS incumbent_name,
    count(sc.id) AS total_successors,
    sum(
        CASE
            WHEN ((sc.readiness_level)::text = 'ready_now'::text) THEN 1
            ELSE 0
        END) AS ready_now_count,
    sum(
        CASE
            WHEN ((sc.readiness_level)::text = 'ready_1_year'::text) THEN 1
            ELSE 0
        END) AS ready_1_year_count,
        CASE
            WHEN (count(sc.id) = 0) THEN 'Critical'::text
            WHEN (sum(
            CASE
                WHEN ((sc.readiness_level)::text = 'ready_now'::text) THEN 1
                ELSE 0
            END) = 0) THEN 'High'::text
            WHEN (count(sc.id) < 2) THEN 'Medium'::text
            ELSE 'Low'::text
        END AS succession_risk
   FROM ((critical_roles cr
     LEFT JOIN employees e_inc ON ((e_inc.id = cr.current_incumbent_id)))
     LEFT JOIN succession_candidates sc ON ((sc.critical_role_id = cr.id)))
  GROUP BY cr.tenant_id, cr.id, cr.role_name, cr.department, cr.criticality_level, cr.succession_status, e_inc.first_name, e_inc.last_name;
```

### `v_succession_readiness`

```sql
SELECT s.position_id,
    pos.stext AS position_name,
    s.successor_pernr,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS successor_name,
    s.readiness,
    c.config_value AS readiness_text,
    s.readiness_pct,
    s.ranking,
    s.potential_rating,
    s.performance_rating,
    s.gap_analysis,
    s.status,
    s.reviewed_date
   FROM (((hrpdev1 s
     LEFT JOIN hrp1000 pos ON ((((s.position_id)::text = (pos.objid)::text) AND ((pos.otype)::text = 'S'::text) AND (pos.endda = '9999-12-31'::date))))
     LEFT JOIN v_employee_master e ON (((s.successor_pernr)::text = (e.pernr)::text)))
     LEFT JOIN sap_config c ON (((c.config_key)::text = ('SUCC_READY_'::text || (s.readiness)::text))))
  WHERE (s.endda = '9999-12-31'::date)
  ORDER BY s.position_id, s.ranking;
```

### `v_sync_dashboard`

```sql
SELECT t.name AS tenant_name,
    t.code AS tenant_code,
    count(DISTINCT e.id) AS total_employees,
    count(DISTINCT e.id) FILTER (WHERE (e.pernr IS NOT NULL)) AS synced_to_sap,
    count(DISTINCT e.id) FILTER (WHERE (e.pernr IS NULL)) AS not_synced,
    ( SELECT count(*) AS count
           FROM sync_queue sq
          WHERE ((sq.tenant_id = t.id) AND ((sq.status)::text = 'pending'::text))) AS pending_syncs,
    ( SELECT max(sl.completed_at) AS max
           FROM sync_log sl
          WHERE ((sl.tenant_id = t.id) AND ((sl.status)::text = 'completed'::text))) AS last_sync
   FROM (tenants t
     LEFT JOIN employees e ON ((e.tenant_id = t.id)))
  GROUP BY t.id, t.name, t.code
  ORDER BY t.name;
```

### `v_sync_status`

```sql
SELECT m.bukrs,
    t.butxt AS company_name,
    count(m.pernr) AS synced_users,
    max(m.last_sync_at) AS last_sync,
    count(
        CASE
            WHEN ((m.sync_status)::text = 'synced'::text) THEN 1
            ELSE NULL::integer
        END) AS ok_count,
    count(
        CASE
            WHEN ((m.sync_status)::text = 'error'::text) THEN 1
            ELSE NULL::integer
        END) AS error_count
   FROM (user_pernr_mapping m
     JOIN t500c t ON (((m.bukrs)::text = (t.bukrs)::text)))
  GROUP BY m.bukrs, t.butxt
  ORDER BY (count(m.pernr)) DESC;
```

### `v_sync_status_by_tenant`

```sql
SELECT t.tenant_name,
    t.sap_bukrs,
    count(m.user_uuid) AS synced_users,
    max(m.last_sync_at) AS last_sync
   FROM (tenant_sap_mapping t
     LEFT JOIN user_pernr_mapping m ON (((t.sap_bukrs)::text = (m.bukrs)::text)))
  GROUP BY t.tenant_name, t.sap_bukrs
  ORDER BY (count(m.user_uuid)) DESC;
```

### `v_team_goals`

```sql
SELECT g.id,
    g.tenant_id,
    g.employee_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.manager_id,
    (((m.first_name)::text || ' '::text) || (m.last_name)::text) AS manager_name,
    d.id AS department_id,
    d.name AS department_name,
    g.title,
    g.description,
    g.goal_type,
    g.status,
    g.progress_percent,
    g.weight,
    g.priority,
    g.start_date,
    g.due_date,
    g.completed_at,
    g.parent_goal_id,
    pg.title AS parent_goal_title,
    g.is_smart_validated,
    g.smart_score,
        CASE
            WHEN ((g.status)::text = 'completed'::text) THEN 'completed'::text
            WHEN ((g.due_date < CURRENT_DATE) AND ((g.status)::text <> 'completed'::text)) THEN 'overdue'::text
            WHEN (g.due_date < (CURRENT_DATE + '7 days'::interval)) THEN 'due_soon'::text
            ELSE 'on_track'::text
        END AS timeline_status,
    ( SELECT count(*) AS count
           FROM goal_check_ins gc
          WHERE (gc.goal_id = g.id)) AS check_in_count,
    ( SELECT max(gc.check_in_date) AS max
           FROM goal_check_ins gc
          WHERE (gc.goal_id = g.id)) AS last_check_in
   FROM ((((goals g
     JOIN employees e ON ((g.employee_id = e.id)))
     LEFT JOIN employees m ON ((e.manager_id = m.id)))
     LEFT JOIN org_units d ON ((e.org_unit_id = d.id)))
     LEFT JOIN goals pg ON ((g.parent_goal_id = pg.id)));
```

### `v_tenant_absence_stats`

```sql
SELECT ue.bukrs AS sap_company_code,
    p21.awart AS absence_type,
    count(*) AS record_count,
    count(DISTINCT ue.pernr) AS employees_affected,
    round(sum(p21.abwtg), 1) AS total_days,
    round(avg(p21.abwtg), 1) AS avg_days_per_record
   FROM (v_unique_sap_employee ue
     JOIN pa2001 p21 ON (((p21.pernr)::text = (ue.pernr)::text)))
  GROUP BY ue.bukrs, p21.awart;
```

### `v_tenant_demographics`

```sql
SELECT t.sap_company_code,
    t.id AS tenant_id,
    t.name AS tenant_name,
    e.department,
    e.gender,
    count(*) AS employee_count,
    round(avg(EXTRACT(year FROM age((e.birth_date)::timestamp with time zone))), 1) AS avg_age,
    round(avg(EXTRACT(year FROM age((e.hire_date)::timestamp with time zone))), 1) AS avg_tenure
   FROM (tenants t
     JOIN employees e ON ((e.tenant_id = t.id)))
  WHERE (e.is_active = true)
  GROUP BY t.sap_company_code, t.id, t.name, e.department, e.gender;
```

### `v_tenant_employee_profile`

```sql
SELECT t.sap_company_code,
    t.id AS tenant_id,
    e.id AS employee_id,
    e.pernr,
    e.first_name,
    e.last_name,
    e.email,
    e.job_title,
    e.department,
    e.location,
    e.hire_date,
    e.birth_date,
    e.gender,
    e.salary,
    e.performance_rating,
    e.potential,
    e.skills,
    e.is_active
   FROM (tenants t
     JOIN employees e ON ((e.tenant_id = t.id)));
```

### `v_tenant_inspector`

```sql
SELECT id,
    code,
    name,
    industry_type,
    region,
    employee_count,
    status,
    ( SELECT count(*) AS count
           FROM locations l
          WHERE (l.tenant_id = t.id)) AS location_count,
    ( SELECT count(*) AS count
           FROM org_units d
          WHERE (d.tenant_id = t.id)) AS department_count,
    ( SELECT count(*) AS count
           FROM employees e
          WHERE ((e.tenant_id = t.id) AND (e.is_active = true))) AS active_employee_count,
    created_at,
    updated_at
   FROM tenants t;
```

### `v_tenant_job_stats`

```sql
SELECT t.id AS tenant_id,
    t.name AS tenant_name,
    count(DISTINCT tj.id) AS total_jobs,
    count(DISTINCT
        CASE
            WHEN tj.is_management THEN tj.id
            ELSE NULL::uuid
        END) AS management_jobs,
    sum(tj.budgeted_positions) AS total_budgeted,
    sum(tj.filled_positions) AS total_filled,
    (sum(tj.budgeted_positions) - sum(tj.filled_positions)) AS total_open,
    count(DISTINCT tou.id) AS org_units_with_jobs,
    count(DISTINCT tjs.esco_skill_uri) AS unique_skills_required
   FROM (((tenants t
     LEFT JOIN tenant_jobs tj ON (((t.id = tj.tenant_id) AND (tj.is_active = true))))
     LEFT JOIN tenant_org_units tou ON ((tj.tenant_org_unit_id = tou.id)))
     LEFT JOIN tenant_job_skills tjs ON ((tj.id = tjs.tenant_job_id)))
  WHERE ((t.status)::text = 'active'::text)
  GROUP BY t.id, t.name;
```

### `v_tenant_plugin_installations`

```sql
SELECT pi.id AS installation_id,
    pi.tenant_id,
    pi.status AS installation_status,
    pi.auto_update,
    pi.installed_at,
    p.id AS plugin_id,
    p.name AS plugin_name,
    p.slug AS plugin_slug,
    p.short_description,
    p.icon_url,
    pc.name AS category_name,
    pc.slug AS category_slug,
    pv.version AS installed_version,
    pv.published_at AS version_date,
    latest_pv.version AS latest_available_version,
        CASE
            WHEN (pv.id <> latest_pv.id) THEN true
            ELSE false
        END AS update_available
   FROM ((((plugin_installations pi
     JOIN plugins p ON ((p.id = pi.plugin_id)))
     LEFT JOIN plugin_categories pc ON ((pc.id = p.category_id)))
     JOIN plugin_versions pv ON ((pv.id = pi.plugin_version_id)))
     LEFT JOIN plugin_versions latest_pv ON (((latest_pv.plugin_id = p.id) AND (latest_pv.is_latest = true))));
```

### `v_tenant_salary_stats`

```sql
SELECT t.sap_company_code,
    t.id AS tenant_id,
    e.department,
    e.job_title,
    count(*) AS employee_count,
    round(avg(e.salary), 0) AS avg_salary,
    round(min(e.salary), 0) AS min_salary,
    round(max(e.salary), 0) AS max_salary,
    round(sum(e.salary), 0) AS total_payroll
   FROM (tenants t
     JOIN employees e ON ((e.tenant_id = t.id)))
  WHERE ((e.is_active = true) AND (e.salary IS NOT NULL))
  GROUP BY t.sap_company_code, t.id, e.department, e.job_title;
```

### `v_time_balance`

```sql
SELECT e.pernr,
    e.company_code,
    e.first_name,
    e.last_name,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS full_name,
    q.ktart AS quota_type,
    c.config_value AS quota_description,
    q.anzhl AS entitlement,
    q.kession AS used,
    q.remainder AS balance,
    q.unit,
    q.begda AS period_start,
    q.endda AS period_end
   FROM ((v_employee_master e
     JOIN pa2006 q ON ((((e.pernr)::text = (q.pernr)::text) AND ((CURRENT_DATE >= q.begda) AND (CURRENT_DATE <= q.endda)))))
     LEFT JOIN sap_config c ON (((c.config_key)::text = ('QUOTA_TYPE_'::text || (q.ktart)::text))))
  ORDER BY e.pernr, q.ktart;
```

### `v_turnover_analysis`

```sql
SELECT t.id AS tenant_id,
    t.code AS tenant_code,
    t.name AS tenant_name,
    count(
        CASE
            WHEN (e.is_active = true) THEN 1
            ELSE NULL::integer
        END) AS active_count,
    count(
        CASE
            WHEN (e.is_active = false) THEN 1
            ELSE NULL::integer
        END) AS inactive_count,
    round(((100.0 * (count(
        CASE
            WHEN (e.is_active = false) THEN 1
            ELSE NULL::integer
        END))::numeric) / (NULLIF(count(*), 0))::numeric), 2) AS turnover_rate,
    round(avg(
        CASE
            WHEN (e.is_active = false) THEN EXTRACT(year FROM age((e.hire_date)::timestamp with time zone))
            ELSE NULL::numeric
        END), 1) AS avg_tenure_leavers,
    e.department,
    count(*) AS dept_total
   FROM (employees e
     JOIN tenants t ON ((t.id = e.tenant_id)))
  GROUP BY t.id, t.code, t.name, e.department;
```

### `v_unified_employee`

```sql
SELECT e.id AS employee_id,
    e.pernr AS sap_pernr,
    COALESCE(ext.tenant_id, e.tenant_id) AS tenant_id,
    t.code AS tenant_code,
    t.name AS tenant_name,
    t.sap_company_code,
    COALESCE(p2.vorna, e.first_name) AS first_name,
    COALESCE(p2.nachn, e.last_name) AS last_name,
    e.email,
    p2.gbdat AS birth_date,
        CASE p2.gesch
            WHEN '1'::text THEN 'Male'::text
            WHEN '2'::text THEN 'Female'::text
            ELSE 'Other'::text
        END AS gender,
    p2.natio AS nationality,
    e.job_title,
    e.department,
    e.location,
    p1.orgeh AS sap_org_unit,
    p1.plans AS sap_position,
    p1.kostl AS sap_cost_center,
    p8.ansal AS annual_salary,
    p8.waession AS currency,
    p105_phone.usrid_long AS phone,
    COALESCE(ext.is_active, e.is_active) AS is_active,
    e.hire_date,
    COALESCE(ext.skills, e.skills) AS skills,
    COALESCE(ext.performance_rating, e.performance_rating) AS performance_rating,
    COALESCE(ext.potential, e.potential) AS potential,
    COALESCE(( SELECT m.id
           FROM employees m
          WHERE ((m.pernr)::text = (ext.manager_pernr)::text)), e.manager_id) AS manager_id,
    u.id AS user_id,
    u.username,
    u.role AS user_role,
    e.created_at,
    COALESCE(ext.updated_at, e.updated_at) AS updated_at
   FROM (((((((employees e
     JOIN tenants t ON ((e.tenant_id = t.id)))
     LEFT JOIN ext_pa0002 ext ON (((e.pernr)::text = (ext.pernr)::text)))
     LEFT JOIN pa0001 p1 ON ((((e.pernr)::text = (p1.pernr)::text) AND (p1.endda >= CURRENT_DATE))))
     LEFT JOIN pa0002 p2 ON ((((e.pernr)::text = (p2.pernr)::text) AND (p2.endda >= CURRENT_DATE))))
     LEFT JOIN pa0008 p8 ON ((((e.pernr)::text = (p8.pernr)::text) AND (p8.endda >= CURRENT_DATE))))
     LEFT JOIN pa0105 p105_phone ON ((((e.pernr)::text = (p105_phone.pernr)::text) AND ((p105_phone.subty)::text = '0020'::text) AND (p105_phone.endda >= CURRENT_DATE))))
     LEFT JOIN users u ON ((u.employee_id = e.id)));
```

### `v_unified_skills`

```sql
SELECT 'esco'::text AS source,
    (esco_skills.id)::text AS id,
    esco_skills.uri AS external_id,
    esco_skills.preferred_label_en AS name,
    COALESCE(esco_skills.description_en, ''::text) AS description,
    COALESCE(esco_skills.skill_type, 'skill'::character varying) AS category
   FROM esco_skills
UNION ALL
 SELECT 'onet'::text AS source,
    (onet_skills.id)::text AS id,
    onet_skills.element_id AS external_id,
    onet_skills.element_name AS name,
    COALESCE(onet_skills.description, ''::text) AS description,
    COALESCE(onet_skills.category, 'skill'::character varying) AS category
   FROM onet_skills;
```

### `v_unique_sap_employee`

```sql
WITH ranked_employees AS (
         SELECT p1.pernr,
            p1.bukrs,
            comm.usrid_long AS email,
            row_number() OVER (PARTITION BY comm.usrid_long ORDER BY
                CASE
                    WHEN ((p1.pernr)::text ~ '^[0-9]+$'::text) THEN 0
                    ELSE 1
                END, p1.pernr) AS rn
           FROM (pa0001 p1
             JOIN pa0105 comm ON ((((comm.pernr)::text = (p1.pernr)::text) AND ((comm.subty)::text = '0010'::text) AND (comm.endda >= CURRENT_DATE))))
          WHERE (p1.endda >= CURRENT_DATE)
        )
 SELECT pernr,
    bukrs,
    email
   FROM ranked_employees
  WHERE (rn = 1);
```

### `v_upcoming_interviews`

```sql
SELECT i.id,
    i.tenant_id,
    i.candidate_id,
    i.job_posting_id,
    i.interview_type,
    i.title,
    i.scheduled_at,
    i.duration_minutes,
    i.location_type,
    i.meeting_link,
    i.status,
    i.created_at,
    array_agg(DISTINCT COALESCE(p.external_name, u.username, ((((e.first_name)::text || ' '::text) || (e.last_name)::text))::character varying)) FILTER (WHERE (p.id IS NOT NULL)) AS interviewers
   FROM (((recruiting_interviews i
     LEFT JOIN recruiting_interview_participants p ON ((i.id = p.interview_id)))
     LEFT JOIN users u ON ((p.user_id = u.id)))
     LEFT JOIN employees e ON ((p.employee_id = e.id)))
  WHERE ((i.scheduled_at >= now()) AND ((i.status)::text = ANY (ARRAY[('scheduled'::character varying)::text, ('confirmed'::character varying)::text])))
  GROUP BY i.id;
```

### `v_whistleblowing_dashboard`

```sql
SELECT tenant_id,
    count(*) AS total_reports,
    count(*) FILTER (WHERE ((status)::text = 'submitted'::text)) AS new_reports,
    count(*) FILTER (WHERE ((status)::text = ANY (ARRAY[('under_review'::character varying)::text, ('investigating'::character varying)::text]))) AS active_investigations,
    count(*) FILTER (WHERE ((status)::text = 'resolved'::text)) AS resolved_reports,
    count(*) FILTER (WHERE ((status)::text = 'escalated'::text)) AS escalated_reports,
    count(*) FILTER (WHERE ((severity)::text = 'critical'::text)) AS critical_reports,
    count(*) FILTER (WHERE ((acknowledgement_sent = false) AND (created_at < (now() - '7 days'::interval)))) AS overdue_acknowledgements,
    (avg((EXTRACT(epoch FROM (COALESCE((updated_at)::timestamp with time zone, now()) - (created_at)::timestamp with time zone)) / (86400)::numeric)))::integer AS avg_resolution_days
   FROM whistleblowing_reports wr
  GROUP BY tenant_id;
```

### `v_workforce_overview`

```sql
SELECT t.id AS tenant_id,
    t.name AS tenant_name,
    count(DISTINCT e.id) AS total_employees,
    count(DISTINCT e.id) FILTER (WHERE (e.is_active = true)) AS active_employees,
    count(DISTINCT e.location_id) AS location_count,
    count(DISTINCT e.department) AS department_count,
    avg(EXTRACT(year FROM age((CURRENT_DATE)::timestamp without time zone, (e.hire_date)::timestamp without time zone))) AS avg_tenure_years
   FROM (tenants t
     LEFT JOIN employees e ON ((e.tenant_id = t.id)))
  GROUP BY t.id, t.name;
```

### `vw_organizational_skill_intelligence`

```sql
WITH skill_distribution AS (
         SELECT t.code AS tenant_code,
            t.name AS tenant_name,
            s.id AS skill_id,
            COALESCE(s.preferred_label_en, es.custom_skill_name) AS skill_label,
            s.skill_type,
            s.reuse_level,
            count(DISTINCT es.employee_id) AS employees_with_skill,
            round(avg(es.proficiency_level), 1) AS avg_proficiency,
            ((count(DISTINCT es.employee_id))::double precision / (NULLIF(( SELECT count(*) AS count
                   FROM employees e2
                  WHERE (e2.tenant_id = t.id)), 0))::double precision) AS penetration_rate
           FROM (((employee_skills es
             JOIN employees e ON ((e.id = es.employee_id)))
             JOIN tenants t ON ((t.id = e.tenant_id)))
             LEFT JOIN esco_skills s ON ((s.id = es.esco_skill_id)))
          GROUP BY t.code, t.name, t.id, s.id, s.preferred_label_en, es.custom_skill_name, s.skill_type, s.reuse_level
        ), demand AS (
         SELECT s.id AS skill_id,
            count(*) AS open_positions
           FROM (job_skills js
             JOIN esco_skills s ON (((s.uri)::text = (js.esco_skill_uri)::text)))
          GROUP BY s.id
        )
 SELECT sd.tenant_code,
    sd.tenant_name,
    sd.skill_id,
    sd.skill_label,
    sd.skill_type,
    sd.reuse_level,
    sd.employees_with_skill,
    sd.avg_proficiency,
    sd.penetration_rate,
    COALESCE(d.open_positions, (0)::bigint) AS open_demand,
        CASE
            WHEN ((sd.penetration_rate < (0.05)::double precision) AND (COALESCE(d.open_positions, (0)::bigint) > 0)) THEN 'CRITICAL_GAP'::text
            WHEN (sd.penetration_rate < (0.10)::double precision) THEN 'SCARCE'::text
            WHEN (sd.penetration_rate > (0.50)::double precision) THEN 'WIDESPREAD'::text
            ELSE 'HEALTHY'::text
        END AS risk_level
   FROM (skill_distribution sd
     LEFT JOIN demand d ON ((d.skill_id = sd.skill_id)));
```

## Materialized Views

### `mv_cross_tenant_rollup`

```sql
SELECT ( SELECT (count(*))::integer AS count
           FROM employees
          WHERE (employees.is_active = true)) AS employees_active,
    ( SELECT (count(*))::integer AS count
           FROM tenants
          WHERE ((tenants.status)::text <> 'deleted'::text)) AS tenants_active,
    ( SELECT (count(*))::integer AS count
           FROM integrations) AS integrations_total,
    now() AS refreshed_at;
```

### `mv_employee_performance_context`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS employee_name,
    e.job_title,
    e.department,
    latest_review.overall_rating AS latest_overall_rating,
    latest_review.potential_rating AS latest_potential_rating,
    latest_review.strengths AS latest_strengths,
    latest_review.areas_for_improvement AS latest_areas_for_improvement,
    review_stats.review_count,
    review_stats.avg_rating,
    review_stats.rating_trend,
    checkin_stats.checkin_count_90d,
    checkin_stats.avg_mood_90d,
    feedback_stats.feedback_count,
    feedback_stats.avg_360_rating
   FROM ((((employees e
     LEFT JOIN LATERAL ( SELECT pr.overall_rating,
            pr.potential_rating,
            pr.strengths,
            pr.areas_for_improvement
           FROM performance_reviews pr
          WHERE ((pr.employee_id = e.id) AND ((pr.status)::text = 'completed'::text))
          ORDER BY pr.review_period_end DESC
         LIMIT 1) latest_review ON (true))
     LEFT JOIN LATERAL ( SELECT count(*) AS review_count,
            avg(performance_reviews.overall_rating) AS avg_rating,
                CASE
                    WHEN (count(*) >= 2) THEN (( SELECT avg(recent.overall_rating) AS avg
                       FROM ( SELECT performance_reviews_1.overall_rating
                               FROM performance_reviews performance_reviews_1
                              WHERE ((performance_reviews_1.employee_id = e.id) AND ((performance_reviews_1.status)::text = 'completed'::text))
                              ORDER BY performance_reviews_1.review_period_end DESC
                             LIMIT 2) recent) - ( SELECT avg(older.overall_rating) AS avg
                       FROM ( SELECT performance_reviews_1.overall_rating
                               FROM performance_reviews performance_reviews_1
                              WHERE ((performance_reviews_1.employee_id = e.id) AND ((performance_reviews_1.status)::text = 'completed'::text))
                              ORDER BY performance_reviews_1.review_period_end DESC
                             OFFSET 2
                             LIMIT 4) older))
                    ELSE NULL::numeric
                END AS rating_trend
           FROM performance_reviews
          WHERE ((performance_reviews.employee_id = e.id) AND ((performance_reviews.status)::text = 'completed'::text))) review_stats ON (true))
     LEFT JOIN LATERAL ( SELECT count(*) AS checkin_count_90d,
            avg(check_ins.employee_mood) AS avg_mood_90d
           FROM check_ins
          WHERE ((check_ins.employee_id = e.id) AND (check_ins.completed_at >= (now() - '90 days'::interval)))) checkin_stats ON (true))
     LEFT JOIN LATERAL ( SELECT count(*) AS feedback_count,
            avg(feedback_360.overall_rating) AS avg_360_rating
           FROM feedback_360
          WHERE ((feedback_360.target_employee_id = e.id) AND ((feedback_360.status)::text = 'completed'::text))) feedback_stats ON (true))
  WHERE (e.is_active = true);
```

### `mv_occupation_similarity`

```sql
WITH occupation_essential_skills AS (
         SELECT os.occupation_id,
            array_agg(os.skill_id) AS skill_ids,
            count(*) AS skill_count
           FROM esco_occupation_skills os
          WHERE ((os.relation_type)::text = 'essential'::text)
          GROUP BY os.occupation_id
        ), pairs AS (
         SELECT o1.id AS occ_a_id,
            o2.id AS occ_b_id,
            o1.preferred_label_en AS label_a,
            o2.preferred_label_en AS label_b,
            o1.isco_code AS isco_a,
            o2.isco_code AS isco_b,
            ((1)::double precision - (o1.embedding_en <=> o2.embedding_en)) AS embedding_similarity
           FROM (esco_occupations o1
             JOIN esco_occupations o2 ON ((o1.id < o2.id)))
          WHERE ((o1.embedding_en IS NOT NULL) AND (o2.embedding_en IS NOT NULL) AND (((1)::double precision - (o1.embedding_en <=> o2.embedding_en)) > (0.45)::double precision))
        )
 SELECT p.occ_a_id,
    p.occ_b_id,
    p.label_a,
    p.label_b,
    p.isco_a,
    p.isco_b,
    p.embedding_similarity,
    COALESCE(( SELECT ((count(*))::double precision / (NULLIF(LEAST(a.skill_count, b.skill_count), 0))::double precision)
           FROM ( SELECT unnest(a_sk.skill_ids) AS sid) x
          WHERE (x.sid = ANY (b_sk.skill_ids))), (0.0)::double precision) AS skill_overlap_ratio,
    ((p.embedding_similarity * (0.4)::double precision) + (COALESCE(( SELECT ((count(*))::double precision / (NULLIF(LEAST(a.skill_count, b.skill_count), 0))::double precision)
           FROM ( SELECT unnest(a_sk.skill_ids) AS sid) x
          WHERE (x.sid = ANY (b_sk.skill_ids))), (0.0)::double precision) * (0.6)::double precision)) AS combined_score,
    now() AS computed_at
   FROM ((((pairs p
     LEFT JOIN occupation_essential_skills a ON ((a.occupation_id = p.occ_a_id)))
     LEFT JOIN occupation_essential_skills b ON ((b.occupation_id = p.occ_b_id)))
     LEFT JOIN occupation_essential_skills a_sk ON ((a_sk.occupation_id = p.occ_a_id)))
     LEFT JOIN occupation_essential_skills b_sk ON ((b_sk.occupation_id = p.occ_b_id)))
  WHERE ((p.embedding_similarity > (0.5)::double precision) OR (COALESCE(( SELECT ((count(*))::double precision / (NULLIF(LEAST(a.skill_count, b.skill_count), 0))::double precision)
           FROM ( SELECT unnest(a_sk.skill_ids) AS sid) x
          WHERE (x.sid = ANY (b_sk.skill_ids))), (0.0)::double precision) > (0.1)::double precision));
```

### `mv_rbac_matrix`

```sql
SELECT r.id AS role_id,
    r.code AS role_code,
    r.name AS role_name,
    r.hierarchy_level AS role_level,
    fa.id AS area_id,
    fa.code AS area_code,
    fa.name AS area_name,
    rp.can_view,
    rp.can_create,
    rp.can_edit,
    rp.can_delete,
    rp.can_approve,
    rp.can_export,
    rp.scope_type,
    ((((((((rp.can_view)::integer + (rp.can_create)::integer) + (rp.can_edit)::integer) + (rp.can_delete)::integer) + (rp.can_approve)::integer) + (rp.can_export)::integer) * 100) / 6) AS grant_pct
   FROM ((rbp_roles r
     CROSS JOIN rbp_functional_areas fa)
     LEFT JOIN rbp_role_permissions rp ON (((rp.role_id = r.id) AND (rp.functional_area_id = fa.id))))
  ORDER BY r.hierarchy_level, fa.id;
```

### `mv_talent_signals`

```sql
SELECT e.id AS employee_id,
    e.tenant_id,
    (((e.first_name)::text || ' '::text) || (e.last_name)::text) AS full_name,
    e.job_title,
    round((((CURRENT_DATE - e.hire_date))::numeric / 365.25), 1) AS tenure_years,
    COALESCE(r.review_avg, 3.0) AS review_avg_12m,
    COALESCE(w.mood_avg, 3.0) AS mood_avg_90d,
    COALESCE(w.stress_avg, 3.0) AS stress_avg_90d,
    COALESCE(c.courses_done, (0)::bigint) AS courses_done_12m,
    LEAST(100, GREATEST(0, ((((
        CASE
            WHEN (COALESCE(w.stress_avg, (3)::numeric) > (4)::numeric) THEN 30
            ELSE 0
        END +
        CASE
            WHEN (COALESCE(w.mood_avg, (3)::numeric) < 2.5) THEN 30
            ELSE 0
        END) +
        CASE
            WHEN ((CURRENT_DATE - e.hire_date) < 365) THEN 15
            ELSE 0
        END) +
        CASE
            WHEN (COALESCE(r.review_avg, (3)::numeric) < (3)::numeric) THEN 25
            ELSE 0
        END) +
        CASE
            WHEN (COALESCE(c.courses_done, (0)::bigint) = 0) THEN 10
            ELSE 0
        END))) AS attrition_risk_score,
        CASE
            WHEN ((COALESCE(r.review_avg, (0)::numeric) >= (4)::numeric) AND (COALESCE(c.courses_done, (0)::bigint) >= 5) AND (e.manager_id IS NOT NULL) AND ((CURRENT_DATE - e.hire_date) > 365) AND (COALESCE(w.stress_avg, (3)::numeric) <= 3.5)) THEN true
            ELSE false
        END AS is_high_potential,
    (EXISTS ( SELECT 1
           FROM employees r2
          WHERE ((r2.manager_id = e.id) AND ((r2.employment_status)::text = 'active'::text)))) AS has_reports,
    now() AS computed_at
   FROM (((employees e
     LEFT JOIN ( SELECT performance_reviews.employee_id,
            avg(performance_reviews.overall_rating) AS review_avg
           FROM performance_reviews
          WHERE ((performance_reviews.submitted_at > (now() - '1 year'::interval)) AND (performance_reviews.overall_rating IS NOT NULL))
          GROUP BY performance_reviews.employee_id) r ON ((r.employee_id = e.id)))
     LEFT JOIN ( SELECT wellbeing_checkins.employee_id,
            avg(wellbeing_checkins.mood_score) AS mood_avg,
            avg(wellbeing_checkins.stress_level) AS stress_avg
           FROM wellbeing_checkins
          WHERE (wellbeing_checkins.checkin_date > (CURRENT_DATE - 90))
          GROUP BY wellbeing_checkins.employee_id) w ON ((w.employee_id = e.id)))
     LEFT JOIN ( SELECT course_enrollments.employee_id,
            count(*) AS courses_done
           FROM course_enrollments
          WHERE (((course_enrollments.status)::text = 'completed'::text) AND (course_enrollments.completed_at > (now() - '1 year'::interval)))
          GROUP BY course_enrollments.employee_id) c ON ((c.employee_id = e.id)))
  WHERE ((e.employment_status)::text = 'active'::text);
```

### `mv_tenant_owner_rollup`

```sql
SELECT t.id AS tenant_id,
    COALESCE(emp.active_count, 0) AS employees_active,
    COALESCE(emp.department_count, 0) AS departments_count,
    COALESCE(intg.total, 0) AS integrations_total,
    now() AS refreshed_at
   FROM ((tenants t
     LEFT JOIN ( SELECT employees.tenant_id,
            (count(*))::integer AS active_count,
            (count(DISTINCT employees.department))::integer AS department_count
           FROM employees
          WHERE (employees.is_active = true)
          GROUP BY employees.tenant_id) emp ON ((emp.tenant_id = t.id)))
     LEFT JOIN ( SELECT integrations.tenant_id,
            (count(*))::integer AS total
           FROM integrations
          GROUP BY integrations.tenant_id) intg ON ((intg.tenant_id = t.id)))
  WHERE ((t.status)::text <> 'deleted'::text);
```
