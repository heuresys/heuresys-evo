/**
 * tenant-owner-queries.ts — Live data queries for /dashboard tenant_owner_overview view.
 *
 * Constraint P11 (heuresys-evo) — these queries replace previously hardcoded
 * KPI fixtures in TenantOwnerOverviewView.tsx. Each returns either real DB
 * values or `null` (→ component renders <DataNotAvailable />).
 *
 * Never invent / interpolate / random-substitute values. If a metric source
 * does not yet exist in the schema, return `null` so the UI surfaces it as
 * "Dati Non Disponibili".
 *
 * Tenant scope: every query is wrapped in withTenant(tenantId, ...) → RLS
 * policies enforce P1 multi-tenant isolation DB-level.
 */
import { withTenant } from '@/lib/db';

export type TenantOwnerKpi = {
  /** Active (deleted_at IS NULL) employees count for tenant. `null` if unable to query. */
  employees: number | null;
  /** Average performance_reviews.overall_rating (scale 1-5) for tenant. `null` if no reviews. */
  performanceAvg: number | null;
  /** Skill coverage ratio 0..1 = AVG(LEAST(assessed_level/required_level, 1)) over assessments with required_level > 0. */
  skillCoverage: number | null;
  /** Annual compensation run-rate (€) = SUM(salary_band_assignments.current_salary). */
  compensationRun: number | null;
};

export type DepartmentRow = {
  id: string;
  name: string;
  headcount: number;
  /** Skill coverage 0..1 for employees in this org_unit. `null` if no skill assessments. */
  skillCoverage: number | null;
  /** Average overall_rating for reviews of employees in this org_unit. `null` if no reviews. */
  performanceAvg: number | null;
};

export type SuccessionReadiness = {
  /** Total succession_candidates linked to active succession_plans for tenant. */
  totalCandidates: number;
  /** Count where readiness_level = 'ready_now'. */
  readyNowCount: number;
  /** readyNowCount / totalCandidates (0..1). `null` if totalCandidates = 0. */
  readyNowPercent: number | null;
};

export type CompensationBreakdown = {
  /** Base annual payroll = SUM(salary_band_assignments.current_salary). */
  basePayroll: number | null;
  /** Variable pool = SUM(bonus_plans.total_budget) WHERE bonus_type IN ('annual','spot','quarterly') AND status='active'. */
  variablePool: number | null;
  /** Executive LTI = SUM(bonus_plans.total_budget) WHERE bonus_type='retention' AND status='active'. */
  execLti: number | null;
  /** Benefits — currently no DB source. Always `null` (→ DataNotAvailable). */
  benefits: number | null;
};

/**
 * KPI ring (4 cards): employees, performanceAvg, skillCoverage, compensationRun.
 */
export async function fetchTenantOwnerKpi(tenantId: string | null): Promise<TenantOwnerKpi> {
  if (!tenantId) {
    return { employees: null, performanceAvg: null, skillCoverage: null, compensationRun: null };
  }
  try {
    return await withTenant(tenantId, async (tx) => {
      const [empCount, perfAvg, skillCov, compSum] = await Promise.all([
        tx.employees.count({ where: { tenant_id: tenantId, deleted_at: null } }),
        tx.performance_reviews.aggregate({
          where: { tenant_id: tenantId, overall_rating: { not: null } },
          _avg: { overall_rating: true },
        }),
        tx.$queryRaw<Array<{ coverage: number | null }>>`
          SELECT AVG(
            CASE WHEN required_level > 0
              THEN LEAST(assessed_level::float / required_level::float, 1.0)
            END
          )::float AS coverage
          FROM employee_skill_assessments
          WHERE tenant_id = ${tenantId}
            AND assessed_level IS NOT NULL
            AND required_level IS NOT NULL
            AND required_level > 0
        `,
        tx.$queryRaw<Array<{ total: number | null }>>`
          SELECT SUM(sba.current_salary)::float AS total
          FROM salary_band_assignments sba
          JOIN employees e ON e.id = sba.employee_id
          WHERE e.tenant_id = ${tenantId}
            AND e.deleted_at IS NULL
        `,
      ]);

      return {
        employees: empCount > 0 ? empCount : null,
        performanceAvg:
          perfAvg._avg?.overall_rating != null ? Number(perfAvg._avg.overall_rating) : null,
        skillCoverage: skillCov[0]?.coverage != null ? Number(skillCov[0].coverage) : null,
        compensationRun: compSum[0]?.total != null ? Number(compSum[0].total) : null,
      };
    });
  } catch {
    return { employees: null, performanceAvg: null, skillCoverage: null, compensationRun: null };
  }
}

/**
 * Department breakdown — org_units at level 2 (typical "department" level) ordered by headcount desc.
 * Limited to 8 rows to match the dashboard layout.
 */
export async function fetchDepartmentBreakdown(tenantId: string | null): Promise<DepartmentRow[]> {
  if (!tenantId) return [];
  try {
    return await withTenant(tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          name: string;
          headcount: number;
          skill_coverage: number | null;
          performance_avg: number | null;
        }>
      >`
        SELECT
          ou.id::text                                                            AS id,
          COALESCE(ou.name_it, ou.name, ou.code)                                  AS name,
          COUNT(DISTINCT e.id)::int                                               AS headcount,
          (
            SELECT AVG(
              CASE WHEN esa.required_level > 0
                THEN LEAST(esa.assessed_level::float / esa.required_level::float, 1.0)
              END
            )::float
            FROM employees e2
            JOIN employee_skill_assessments esa ON esa.employee_id = e2.id
            WHERE e2.org_unit_id = ou.id
              AND e2.deleted_at IS NULL
              AND esa.assessed_level IS NOT NULL
              AND esa.required_level IS NOT NULL
              AND esa.required_level > 0
          )                                                                       AS skill_coverage,
          (
            SELECT AVG(pr.overall_rating)::float
            FROM employees e3
            JOIN performance_reviews pr ON pr.employee_id = e3.id
            WHERE e3.org_unit_id = ou.id
              AND e3.deleted_at IS NULL
              AND pr.overall_rating IS NOT NULL
          )                                                                       AS performance_avg
        FROM org_units ou
        LEFT JOIN employees e
          ON e.org_unit_id = ou.id AND e.deleted_at IS NULL
        WHERE ou.tenant_id = ${tenantId}
          AND ou.deleted_at IS NULL
          AND ou.org_level = 2
          AND ou.is_active = true
        GROUP BY ou.id, ou.name_it, ou.name, ou.code
        HAVING COUNT(DISTINCT e.id) > 0
        ORDER BY COUNT(DISTINCT e.id) DESC
        LIMIT 8
      `;
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        headcount: r.headcount,
        skillCoverage: r.skill_coverage != null ? Number(r.skill_coverage) : null,
        performanceAvg: r.performance_avg != null ? Number(r.performance_avg) : null,
      }));
    });
  } catch {
    return [];
  }
}

/**
 * Succession readiness donut (% ready-now over total active-plan candidates).
 */
export async function fetchSuccessionReadiness(
  tenantId: string | null
): Promise<SuccessionReadiness> {
  if (!tenantId) {
    return { totalCandidates: 0, readyNowCount: 0, readyNowPercent: null };
  }
  try {
    return await withTenant(tenantId, async (tx) => {
      const rows = await tx.$queryRaw<Array<{ total: number; ready_now: number }>>`
        SELECT
          COUNT(*)::int                                                       AS total,
          COUNT(*) FILTER (WHERE sc.readiness_level = 'ready_now')::int        AS ready_now
        FROM succession_candidates sc
        JOIN succession_plans sp ON sp.id = sc.critical_role_id
        WHERE sp.tenant_id = ${tenantId}
          AND sp.status = 'active'
      `;
      const total = rows[0]?.total ?? 0;
      const readyNow = rows[0]?.ready_now ?? 0;
      return {
        totalCandidates: total,
        readyNowCount: readyNow,
        readyNowPercent: total > 0 ? readyNow / total : null,
      };
    });
  } catch {
    return { totalCandidates: 0, readyNowCount: 0, readyNowPercent: null };
  }
}

/**
 * Compensation breakdown (4 cards): base / variable / exec-LTI / benefits.
 * `benefits` source not yet implemented in schema → always null (DataNotAvailable).
 */
export async function fetchCompensationBreakdown(
  tenantId: string | null
): Promise<CompensationBreakdown> {
  if (!tenantId) {
    return { basePayroll: null, variablePool: null, execLti: null, benefits: null };
  }
  try {
    return await withTenant(tenantId, async (tx) => {
      const [basePayroll, variablePool, execLti] = await Promise.all([
        tx.$queryRaw<Array<{ total: number | null }>>`
          SELECT SUM(sba.current_salary)::float AS total
          FROM salary_band_assignments sba
          JOIN employees e ON e.id = sba.employee_id
          WHERE e.tenant_id = ${tenantId}
            AND e.deleted_at IS NULL
        `,
        tx.bonus_plans.aggregate({
          where: {
            tenant_id: tenantId,
            status: 'active',
            bonus_type: { in: ['annual', 'spot', 'quarterly', 'project'] },
          },
          _sum: { total_budget: true },
        }),
        tx.bonus_plans.aggregate({
          where: { tenant_id: tenantId, status: 'active', bonus_type: 'retention' },
          _sum: { total_budget: true },
        }),
      ]);

      return {
        basePayroll: basePayroll[0]?.total != null ? Number(basePayroll[0].total) : null,
        variablePool:
          variablePool._sum?.total_budget != null ? Number(variablePool._sum.total_budget) : null,
        execLti: execLti._sum?.total_budget != null ? Number(execLti._sum.total_budget) : null,
        benefits: null,
      };
    });
  } catch {
    return { basePayroll: null, variablePool: null, execLti: null, benefits: null };
  }
}

/**
 * Format helpers — non-localized. Caller uses these to render values consistent
 * with the dashboard mockup style (italian decimal "." for thousands, "," for decimal).
 */
export function formatItalianInt(n: number): string {
  return n.toLocaleString('it-IT', { maximumFractionDigits: 0 });
}

export function formatItalianDecimal(n: number, fractionDigits = 2): string {
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPercent(ratio: number, fractionDigits = 1): string {
  return formatItalianDecimal(ratio * 100, fractionDigits) + '%';
}

/** Format large EUR value as "X,Y M €" (millions). */
export function formatMillionEur(amount: number): string {
  return formatItalianDecimal(amount / 1_000_000, 1) + 'M €';
}
