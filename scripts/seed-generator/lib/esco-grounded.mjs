/**
 * lib/esco-grounded.mjs — ESCO catalog query helpers.
 *
 * ESCO catalog (read-only, NULL tenant_id): 14.011 esco_skills, 3.040 esco_occupations,
 * 126.051 esco_occupation_skills, 11.634 skill_adjacencies, 28.983 job_template_skills.
 * Catalog assoluto, NON tenant-scoped (proietta su kg_nodes/edges in S35.5 ESKAP).
 *
 * Pattern d'uso: pre-fetch ESCO entities by ISCO code or label, return rows
 * for downstream seeding (job_template_skills generation, skill_assessments).
 */

/**
 * Find ESCO occupations by ISCO group code prefix (es. '2412' for Personnel/HR).
 * @param {import('pg').PoolClient} client
 * @param {string} iscoPrefix
 * @returns {Promise<Array<{id: string, preferred_label: string, isco_code: string}>>}
 */
export async function findOccupationsByIsco(client, iscoPrefix) {
  const { rows } = await client.query(
    `SELECT id, preferred_label, isco_code
     FROM esco_occupations
     WHERE isco_code LIKE $1
     ORDER BY isco_code, preferred_label
     LIMIT 200`,
    [`${iscoPrefix}%`]
  );
  return rows;
}

/**
 * Get essential + optional skills for an occupation (via esco_occupation_skills join).
 * @param {import('pg').PoolClient} client
 * @param {string} occupationId
 * @returns {Promise<Array<{skill_id: string, preferred_label: string, relation_type: string}>>}
 */
export async function findSkillsForOccupation(client, occupationId) {
  const { rows } = await client.query(
    `SELECT s.id AS skill_id, s.preferred_label, eos.relation_type
     FROM esco_occupation_skills eos
     JOIN esco_skills s ON s.id = eos.skill_id
     WHERE eos.occupation_id = $1
     ORDER BY eos.relation_type DESC, s.preferred_label`,
    [occupationId]
  );
  return rows;
}

/**
 * Find adjacent skills (skill_adjacencies graph).
 * @param {import('pg').PoolClient} client
 * @param {string} skillId
 * @param {number} limit
 * @returns {Promise<Array<{related_id: string, preferred_label: string, distance: number}>>}
 */
export async function findAdjacentSkills(client, skillId, limit = 10) {
  const { rows } = await client.query(
    `SELECT sa.related_skill_id AS related_id, s.preferred_label, sa.distance
     FROM skill_adjacencies sa
     JOIN esco_skills s ON s.id = sa.related_skill_id
     WHERE sa.skill_id = $1
     ORDER BY sa.distance ASC
     LIMIT $2`,
    [skillId, limit]
  );
  return rows;
}

/**
 * Find ESCO skills by label (case-insensitive partial match).
 * Use for resolving industry-specific critical skills.
 * @param {import('pg').PoolClient} client
 * @param {string} labelLike
 * @param {number} limit
 * @returns {Promise<Array<{id: string, preferred_label: string}>>}
 */
export async function findSkillsByLabel(client, labelLike, limit = 20) {
  const { rows } = await client.query(
    `SELECT id, preferred_label
     FROM esco_skills
     WHERE preferred_label ILIKE $1
     ORDER BY length(preferred_label), preferred_label
     LIMIT $2`,
    [`%${labelLike}%`, limit]
  );
  return rows;
}

/**
 * Get job_template_skills rows for a job_template_id (with ESCO labels).
 * Used in OPOURSKA layer 5 seeding to derive skill_role_requirements.
 */
export async function findJobTemplateSkills(client, jobTemplateId) {
  const { rows } = await client.query(
    `SELECT jts.skill_id, jts.is_essential, jts.required_proficiency, s.preferred_label
     FROM job_template_skills jts
     LEFT JOIN esco_skills s ON s.id = jts.skill_id
     WHERE jts.job_template_id = $1`,
    [jobTemplateId]
  );
  return rows;
}
