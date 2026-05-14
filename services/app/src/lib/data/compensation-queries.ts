/**
 * compensation-queries.ts — Role-aware compensation queries (cycle 2 Phase 2).
 *
 * Source per /compensation + KPI hero. P11 compliant.
 */
import { withTenant } from '@/lib/db';
import { resolveScope, type ScopeContext } from './_role-shaper';

export interface CompensationKpi {
  avgSalary: number | null;
  medianSalary: number | null;
  p90Salary: number | null;
  totalPayroll: number | null;
}

const EMPTY_KPI: CompensationKpi = {
  avgSalary: null,
  medianSalary: null,
  p90Salary: null,
  totalPayroll: null,
};

export async function fetchCompensationKpi(ctx: ScopeContext): Promise<CompensationKpi> {
  if (!ctx.tenantId) return EMPTY_KPI;
  const scope = resolveScope(ctx, 'compensation');
  if (!scope.requiresTenantWrap) return EMPTY_KPI;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          avg_s: number | null;
          median_s: number | null;
          p90_s: number | null;
          total_s: number | null;
        }>
      >`
        SELECT
          AVG(current_salary)::float AS avg_s,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY current_salary)::float AS median_s,
          PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY current_salary)::float AS p90_s,
          SUM(current_salary)::float AS total_s
        FROM salary_band_assignments
        WHERE tenant_id = ${ctx.tenantId}::uuid
          AND current_salary IS NOT NULL
      `;
      const r = rows[0] ?? { avg_s: null, median_s: null, p90_s: null, total_s: null };
      return {
        avgSalary: r.avg_s !== null ? Math.round(r.avg_s) : null,
        medianSalary: r.median_s !== null ? Math.round(r.median_s) : null,
        p90Salary: r.p90_s !== null ? Math.round(r.p90_s) : null,
        totalPayroll: r.total_s !== null ? Math.round(r.total_s) : null,
      };
    });
  } catch {
    return EMPTY_KPI;
  }
}

export interface SalaryHistogramBin {
  bucket: string;
  count: number;
}

export async function fetchSalaryHistogram(
  ctx: ScopeContext,
  bucketSize: number = 10000
): Promise<SalaryHistogramBin[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'compensation');
  if (!scope.requiresTenantWrap) return null;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<Array<{ bucket: string; count: number }>>`
        SELECT
          (FLOOR(current_salary / ${bucketSize}) * ${bucketSize})::text || '–' ||
            ((FLOOR(current_salary / ${bucketSize}) + 1) * ${bucketSize})::text AS bucket,
          COUNT(*)::int AS count
        FROM salary_band_assignments
        WHERE tenant_id = ${ctx.tenantId}::uuid
          AND current_salary IS NOT NULL
        GROUP BY bucket, FLOOR(current_salary / ${bucketSize})
        ORDER BY FLOOR(current_salary / ${bucketSize})
      `;
      return rows;
    });
  } catch {
    return null;
  }
}

export interface BonusPlanRow {
  id: string;
  name: string;
  bonusType: string | null;
  totalBudget: number | null;
  status: string | null;
}

export async function fetchBonusPlans(ctx: ScopeContext): Promise<BonusPlanRow[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'compensation');
  if (!scope.requiresTenantWrap) return null;
  // bonus_plans visibili solo a level >= HR_MANAGER (3) o sopra
  if (scope.level === 'self' || scope.level === 'reports') return null;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.bonus_plans.findMany({
        where: { tenant_id: ctx.tenantId! },
        select: {
          id: true,
          name: true,
          bonus_type: true,
          total_budget: true,
          status: true,
        },
        orderBy: { created_at: 'desc' },
        take: 20,
      });
      return rows.map((r) => ({
        id: String(r.id),
        name: r.name,
        bonusType: r.bonus_type,
        totalBudget: r.total_budget !== null ? Number(r.total_budget) : null,
        status: r.status,
      }));
    });
  } catch {
    return null;
  }
}
