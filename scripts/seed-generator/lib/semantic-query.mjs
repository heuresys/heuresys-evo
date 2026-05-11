/**
 * lib/semantic-query.mjs — Semantic-driven query helpers (TALPIPE succession + others).
 *
 * Goal: query DBMS to identify candidates that are semantically coherent
 * (NOT random within tenant). Example: succession candidates for a target
 * role must have skills coverage ≥70% of role requirements + latest_rating ≥3
 * + tenure ≥1.5 years.
 *
 * Reuses ESCO + employee_skill_assessments + performance_reviews + role_skill_requirements
 * to build coherent queries.
 */

/**
 * Find succession candidates for a target_job_template_id, validating semantic constraints.
 * @param {import('pg').PoolClient} client (inside withTenantTx)
 * @param {{
 *   tenant_id: string,
 *   target_job_template_id: string,
 *   current_fiscal_year: number,
 *   min_coverage_pct?: number,    // default 70
 *   min_rating?: number,           // default 3
 *   min_tenure_years?: number,     // default 1.5
 *   top_n?: number                 // default 5
 * }} args
 * @returns {Promise<Array<{
 *   employee_id: string,
 *   current_role_id: string,
 *   coverage_pct: number,
 *   avg_proficiency: number,
 *   latest_rating: number,
 *   tenure_years: number,
 *   readiness_score: number,
 *   readiness_bucket: 'READY_NOW'|'READY_1_2_YR'|'READY_3_5_YR'|'DEVELOPMENT_NEEDED'
 * }>>}
 */
export async function findSuccessionCandidates(client, args) {
  const {
    tenant_id,
    target_job_template_id,
    current_fiscal_year,
    min_coverage_pct = 70,
    min_rating = 3,
    min_tenure_years = 1.5,
    top_n = 5,
  } = args;

  const { rows } = await client.query(
    `WITH role_skills AS (
       SELECT skill_id, COALESCE(required_proficiency, 3) AS required_proficiency
       FROM role_skill_requirements
       WHERE job_template_id = $1::uuid
     ),
     candidate_coverage AS (
       SELECT
         e.id AS employee_id,
         e.job_template_id AS current_role_id,
         COUNT(*) FILTER (WHERE esa.proficiency_level >= rs.required_proficiency) AS skills_covered,
         COUNT(rs.skill_id) AS skills_required,
         AVG(esa.proficiency_level)::float AS avg_proficiency,
         MAX(pr.overall_rating) AS latest_rating,
         EXTRACT(YEAR FROM age(NOW(), e.hire_date))::float AS tenure_years
       FROM employees e
       CROSS JOIN role_skills rs
       LEFT JOIN employee_skill_assessments esa
         ON esa.employee_id = e.id AND esa.skill_id = rs.skill_id
       LEFT JOIN performance_reviews pr
         ON pr.employee_id = e.id AND pr.fiscal_year = $2
       WHERE e.tenant_id = $3::uuid
         AND e.job_template_id IS DISTINCT FROM $1::uuid
         AND COALESCE(e.employment_status, 'active') = 'active'
       GROUP BY e.id, e.job_template_id, e.hire_date
     )
     SELECT
       employee_id,
       current_role_id,
       ROUND(100.0 * skills_covered / NULLIF(skills_required, 0), 1)::float AS coverage_pct,
       avg_proficiency,
       latest_rating,
       tenure_years
     FROM candidate_coverage
     WHERE skills_covered::float / NULLIF(skills_required, 0) >= $4 / 100.0
       AND latest_rating >= $5
       AND tenure_years >= $6
     ORDER BY
       (skills_covered::float / NULLIF(skills_required, 0)) DESC,
       latest_rating DESC,
       avg_proficiency DESC
     LIMIT $7`,
    [
      target_job_template_id,
      current_fiscal_year,
      tenant_id,
      min_coverage_pct,
      min_rating,
      min_tenure_years,
      top_n,
    ]
  );

  return rows.map((r) => {
    const readiness =
      0.5 * (r.coverage_pct / 100) +
      0.3 * (r.latest_rating / 5) +
      0.2 * Math.min(r.tenure_years / 5, 1);
    const bucket =
      readiness >= 0.85
        ? 'READY_NOW'
        : readiness >= 0.7
          ? 'READY_1_2_YR'
          : readiness >= 0.55
            ? 'READY_3_5_YR'
            : 'DEVELOPMENT_NEEDED';
    return { ...r, readiness_score: Number(readiness.toFixed(3)), readiness_bucket: bucket };
  });
}

/**
 * Verify a single succession_pipeline row passes semantic gate (used pre-INSERT).
 */
export async function verifySuccessionCandidate(
  client,
  { tenant_id, employee_id, target_job_template_id, min_coverage_pct = 70 }
) {
  const { rows } = await client.query(
    `WITH role_skills AS (
       SELECT skill_id, COALESCE(required_proficiency, 3) AS required_proficiency
       FROM role_skill_requirements WHERE job_template_id = $1::uuid
     ),
     coverage AS (
       SELECT
         COUNT(*) FILTER (WHERE esa.proficiency_level >= rs.required_proficiency) AS covered,
         COUNT(rs.skill_id) AS required
       FROM role_skills rs
       LEFT JOIN employee_skill_assessments esa
         ON esa.employee_id = $2::uuid AND esa.skill_id = rs.skill_id
     )
     SELECT covered, required, ROUND(100.0 * covered / NULLIF(required, 0), 1)::float AS pct
     FROM coverage`,
    [target_job_template_id, employee_id]
  );
  if (rows.length === 0) return { ok: false, reason: 'no_role_skills' };
  const { covered, required, pct } = rows[0];
  if (required === 0 || required === null) return { ok: false, reason: 'no_skill_requirements' };
  if (pct < min_coverage_pct)
    return { ok: false, reason: 'coverage_below_threshold', pct, covered, required };
  return { ok: true, pct, covered, required };
}
