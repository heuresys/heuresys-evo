/**
 * lib/zod-schemas.mjs — Zod schemas per CASCADIA seeding artifacts.
 *
 * Riusa zod ^3.24 già in services/app/package.json e packages/shared.
 * Schemas progettati per validare i 4 profili in `db/seeds/realistic/_research_cache/`
 * + record AI-augmented prodotti dagli script per-sigla.
 *
 * Filosofia: required-only sui campi che downstream usa per FK/INSERT;
 * `passthrough()` su livelli annidati per evitare false positives su minor drift.
 */

import { z } from 'zod';

// ---------- Industry profile (cache JSON per tenant) ----------

const IndustryClassificationSchema = z
  .object({
    nace_class_code: z.string().min(1),
    nace_label_it: z.string().min(1),
    nace_label_en: z.string().optional(),
    ateco_code: z.string().optional(),
    ateco_label_it: z.string().optional(),
    sub_industry: z.array(z.string()).default([]),
    company_size_code: z.string().optional(),
    company_size_label: z.string().optional(),
    geography: z.string().optional(),
  })
  .passthrough();

const WorkforceBaselineSchema = z
  .object({
    total_employees_canonical: z.number().int().nonnegative(),
    org_depth_typical: z.number().int().positive().optional(),
    span_of_control_max: z.number().int().positive().optional(),
    span_of_control_typical: z.number().int().positive().optional(),
    fte_by_function: z.record(z.number()).optional(),
    seniority_distribution: z.record(z.number()).optional(),
    geographic_distribution: z.record(z.number()).optional(),
  })
  .passthrough();

const CanonicalRoleSchema = z
  .object({
    code: z.string().optional(),
    // RTL Bank usa `title`, altri tenant `title_it`. Almeno uno richiesto.
    title: z.string().optional(),
    title_it: z.string().optional(),
    level: z.string().optional(),
    esco_isco: z.string().optional(),
    ccnl_level: z.string().optional(),
    headcount_typical: z.number().int().nonnegative().optional(),
  })
  .passthrough()
  .refine((r) => Boolean(r.title || r.title_it), {
    message: 'canonical_role requires title or title_it',
  });

const RoleInventorySchema = z
  .object({
    total_unique_roles: z.number().int().positive().optional(),
    canonical_roles: z.array(CanonicalRoleSchema).default([]),
  })
  .passthrough();

const KpiEntrySchema = z
  .object({
    code: z.string().min(1),
    // RTL Bank `name`, altri tenant `name_it`. Almeno uno richiesto.
    name: z.string().optional(),
    name_it: z.string().optional(),
    unit: z.string().optional(),
    // RTL Bank stringa, altri tenant possono dare numero (es. target: 0.95)
    target: z.union([z.string(), z.number()]).optional(),
    frequency: z.string().optional(),
  })
  .passthrough()
  .refine((k) => Boolean(k.name || k.name_it), {
    message: 'kpi requires name or name_it',
  });

const KpiFrameworkSchema = z
  .object({
    operational: z.array(KpiEntrySchema).default([]),
    strategic: z.array(KpiEntrySchema).default([]),
    compliance_regulatory: z.array(KpiEntrySchema).default([]),
    people_culture: z.array(KpiEntrySchema).default([]),
  })
  .passthrough();

const ComplianceFrameworkSchema = z
  .object({
    code: z.string().min(1),
    name: z.string().min(1),
    scope: z.string().optional(),
    regulator: z.string().optional(),
  })
  .passthrough();

const ItalianContextSchema = z
  .object({
    // RTL Bank usa `ccnl_reference_code`, altri `ccnl_code` o `ccnl_reference`.
    ccnl_reference_code: z.string().optional(),
    ccnl_code: z.string().optional(),
    ccnl_reference: z.string().optional(),
    ccnl_reference_name: z.string().optional(),
    annual_leave_days_canonical: z.number().int().nonnegative().optional(),
    payroll_specifics: z.record(z.any()).optional(),
    sindacati_canonical: z.array(z.union([z.string(), z.record(z.any())])).optional(),
    sindacati: z.array(z.union([z.string(), z.record(z.any())])).optional(),
  })
  .passthrough()
  .refine((c) => Boolean(c.ccnl_reference_code || c.ccnl_code || c.ccnl_reference), {
    message: 'italian_context requires ccnl_reference_code or ccnl_code or ccnl_reference',
  });

export const IndustryProfileSchema = z
  .object({
    schema_version: z.string().min(1),
    generated_at: z.string().min(1),
    generation_method: z.string().optional(),
    tenant_code: z.string().min(1),
    tenant_name: z.string().optional(),
    industry_classification: IndustryClassificationSchema,
    workforce_baseline: WorkforceBaselineSchema,
    org_structure_template: z.record(z.any()).optional(),
    process_blueprint: z.record(z.any()).optional(),
    role_inventory: RoleInventorySchema,
    skill_emphasis: z.record(z.any()).optional(),
    kpi_framework: KpiFrameworkSchema,
    compliance_frameworks: z.array(ComplianceFrameworkSchema).default([]),
    assessment_patterns: z.record(z.any()).optional(),
    italian_context: ItalianContextSchema,
    stakeholder_profile: z.array(z.any()).optional(),
    ld_focus_areas: z.array(z.any()).optional(),
    // RTL Bank usa oggetto, altri usano array. Accept entrambi.
    recruiting_focus: z.union([z.record(z.any()), z.array(z.any())]).optional(),
    metadata: z.record(z.any()).optional(),
  })
  .passthrough();

// ---------- Record schemas (AI-augmented INSERT payload) ----------

export const SuccessionCandidateSchema = z
  .object({
    employee_id: z.string().uuid(),
    target_role_id: z.string().uuid().nullable().optional(),
    target_occupation_isco: z.string().min(1).optional(),
    target_position_label: z.string().min(1),
    readiness_label: z.enum(['ready_now', '6_12_months', '12_24_months', 'long_term']),
    skill_coverage_pct: z.number().min(0).max(100),
    risk_level: z.enum(['low', 'medium', 'high']).default('medium'),
    rationale: z.string().min(20).max(500),
    review_score_quintile: z.number().int().min(1).max(5).optional(),
  })
  .strict();

export const AssessmentRecordSchema = z
  .object({
    employee_id: z.string().uuid(),
    competency_id: z.string().uuid().optional(),
    esco_skill_id: z.string().optional(),
    rating: z.number().min(0).max(5),
    assessor_role: z.enum(['self', 'manager', 'peer', 'subordinate']).default('manager'),
    period: z.string().min(4),
    comments: z.string().max(800).optional(),
  })
  .strict();

export const LearningRecommendationSchema = z
  .object({
    employee_id: z.string().uuid(),
    course_id: z.string().uuid().optional(),
    skill_id: z.string().uuid().optional(),
    rationale: z.string().min(10).max(400),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    estimated_hours: z.number().positive().max(200).optional(),
  })
  .strict();

export const EngagementResponseSchema = z
  .object({
    survey_id: z.string().uuid(),
    employee_id: z.string().uuid().nullable(),
    score_value: z.number().min(1).max(10),
    open_answer: z.string().max(400).nullable().optional(),
    submitted_at: z.string().datetime().optional(),
  })
  .strict();

export const SkillGapAnalysisSchema = z
  .object({
    employee_id: z.string().uuid(),
    role_id: z.string().uuid().optional(),
    missing_skills: z.array(z.string()).default([]),
    overall_gap_pct: z.number().min(0).max(100),
    closure_estimate_months: z.number().int().nonnegative().optional(),
  })
  .strict();

// ---------- Diff log (per audit cross-tenant) ----------

export const TenantDiffEntrySchema = z
  .object({
    section: z.string().min(1),
    field: z.string().min(1),
    rtl_value: z.any(),
    tenant_value: z.any(),
    decision: z.enum(['inherit', 'override', 'sector-specific']).default('sector-specific'),
    rationale: z.string().min(5).max(300),
  })
  .strict();

// ---------- Helpers ----------

/**
 * Parse e valida un profilo, ritornando { ok, data, error }.
 */
export function validateIndustryProfile(raw) {
  const parsed = IndustryProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.format(), data: null };
  }
  return { ok: true, error: null, data: parsed.data };
}

/**
 * Batch validate array di record con uno schema specifico.
 */
export function validateBatch(schema, records) {
  const errors = [];
  const ok = [];
  for (let i = 0; i < records.length; i++) {
    const result = schema.safeParse(records[i]);
    if (result.success) ok.push(result.data);
    else errors.push({ index: i, error: result.error.format() });
  }
  return { passed: ok, failed: errors, total: records.length };
}
