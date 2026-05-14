/**
 * workforce-analytics-queries.ts — Role-aware analytics queries (cycle 2 Phase 2).
 *
 * Source per /analytics/workforce + hero KpiRing trends. P11 compliant.
 */
import { withTenant } from '@/lib/db';
import { resolveScope, type ScopeContext } from './_role-shaper';

export interface WorkforceKpi {
  headcount: number | null;
  newHires90d: number | null;
  attritionRate12m: number | null;
  openRequisitions: number | null;
}

const EMPTY_KPI: WorkforceKpi = {
  headcount: null,
  newHires90d: null,
  attritionRate12m: null,
  openRequisitions: null,
};

export async function fetchWorkforceKpi(ctx: ScopeContext): Promise<WorkforceKpi> {
  if (!ctx.tenantId) return EMPTY_KPI;
  const scope = resolveScope(ctx, 'employees');
  if (!scope.requiresTenantWrap) return EMPTY_KPI;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          headcount: number;
          new_hires: number;
          leavers_12m: number;
          attrition_rate: number | null;
        }>
      >`
        WITH stats AS (
          SELECT
            COUNT(*) FILTER (WHERE is_active = true)::int AS headcount,
            COUNT(*) FILTER (WHERE is_active = true AND hire_date > NOW() - INTERVAL '90 days')::int AS new_hires,
            COUNT(*) FILTER (WHERE is_active = false AND deleted_at > NOW() - INTERVAL '12 months')::int AS leavers_12m,
            COUNT(*) FILTER (WHERE is_active = true)::float AS hc_active
          FROM employees
          WHERE tenant_id = ${ctx.tenantId}::uuid
        )
        SELECT
          headcount,
          new_hires,
          leavers_12m,
          CASE WHEN hc_active > 0 THEN ROUND(100.0 * leavers_12m / hc_active, 1)
               ELSE NULL END::float AS attrition_rate
        FROM stats
      `;
      const r = rows[0] ?? { headcount: 0, new_hires: 0, leavers_12m: 0, attrition_rate: null };

      let openReqs: number | null = null;
      try {
        const reqRows = await tx.$queryRaw<Array<{ open: number }>>`
          SELECT COUNT(*)::int AS open
          FROM recruiting_requisitions
          WHERE tenant_id = ${ctx.tenantId}::uuid AND status IN ('open', 'in_progress')
        `;
        openReqs = reqRows[0]?.open ?? 0;
      } catch {
        openReqs = null;
      }

      return {
        headcount: r.headcount,
        newHires90d: r.new_hires,
        attritionRate12m: r.attrition_rate,
        openRequisitions: openReqs,
      };
    });
  } catch {
    return EMPTY_KPI;
  }
}

export interface HeadcountTrendPoint {
  month: string;
  headcount: number;
  hires: number;
  leavers: number;
}

export async function fetchHeadcountTrend(
  ctx: ScopeContext,
  monthsBack: number = 12
): Promise<HeadcountTrendPoint[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'employees');
  if (!scope.requiresTenantWrap) return null;

  const months = Math.min(Math.max(monthsBack, 1), 24);

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          month: string;
          headcount: number;
          hires: number;
          leavers: number;
        }>
      >`
        WITH months AS (
          SELECT generate_series(
            date_trunc('month', NOW()) - (${months} || ' months')::interval,
            date_trunc('month', NOW()),
            '1 month'::interval
          ) AS m
        )
        SELECT
          to_char(m.m, 'YYYY-MM') AS month,
          (SELECT COUNT(*)::int FROM employees
             WHERE tenant_id = ${ctx.tenantId}::uuid
               AND hire_date <= m.m + INTERVAL '1 month'
               AND (deleted_at IS NULL OR deleted_at > m.m + INTERVAL '1 month')) AS headcount,
          (SELECT COUNT(*)::int FROM employees
             WHERE tenant_id = ${ctx.tenantId}::uuid
               AND hire_date >= m.m AND hire_date < m.m + INTERVAL '1 month') AS hires,
          (SELECT COUNT(*)::int FROM employees
             WHERE tenant_id = ${ctx.tenantId}::uuid
               AND deleted_at >= m.m AND deleted_at < m.m + INTERVAL '1 month') AS leavers
        FROM months m
        ORDER BY m.m
      `;
      return rows;
    });
  } catch {
    return null;
  }
}
