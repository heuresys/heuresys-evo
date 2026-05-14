/**
 * employees-queries.ts — Role-aware employees queries (cycle 2 Phase 2).
 *
 * Live data per /employees route + KPI hero su /dashboard. P11 compliant:
 * tutte le funzioni ritornano `null` quando lo schema non ha source o quando
 * tenantId non è risolvibile → caller renderizza `<DataNotAvailable />`.
 */
import { withTenant } from '@/lib/db';
import { resolveScope, type ScopeContext } from './_role-shaper';

export interface EmployeesCountResult {
  /** Total active employees nello scope. `null` se query fail. */
  total: number | null;
  /** New hires last 90 days nello scope. `null` se query fail. */
  newHires90d: number | null;
  /** Avg tenure in months nello scope. `null` se query fail. */
  avgTenureMonths: number | null;
}

export interface EmployeeListRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string | null;
  orgUnitId: string | null;
  managerId: string | null;
  hiredAt: Date | null;
  isActive: boolean;
}

const EMPTY_COUNT: EmployeesCountResult = {
  total: null,
  newHires90d: null,
  avgTenureMonths: null,
};

export async function fetchEmployeesCount(ctx: ScopeContext): Promise<EmployeesCountResult> {
  if (!ctx.tenantId) return EMPTY_COUNT;
  const scope = resolveScope(ctx, 'employees');
  if (!scope.requiresTenantWrap) return EMPTY_COUNT;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const [total, newHires90d, tenureRows] = await Promise.all([
        tx.employees.count({ where: { ...scope.where, is_active: true } }),
        tx.employees.count({
          where: {
            ...scope.where,
            is_active: true,
            hired_at: { gte: new Date(Date.now() - 90 * 24 * 3600 * 1000) },
          },
        }),
        tx.$queryRaw<Array<{ avg_months: number | null }>>`
          SELECT AVG(EXTRACT(EPOCH FROM (NOW() - hired_at)) / (30.44 * 86400))::float AS avg_months
          FROM employees
          WHERE tenant_id = ${ctx.tenantId}::uuid
            AND is_active = true
            AND hired_at IS NOT NULL
        `,
      ]);

      const avgRow = tenureRows[0];
      const avgTenureMonths =
        avgRow && avgRow.avg_months !== null ? Math.round(avgRow.avg_months) : null;

      return { total, newHires90d, avgTenureMonths };
    });
  } catch {
    return EMPTY_COUNT;
  }
}

export async function fetchEmployeesList(
  ctx: ScopeContext,
  opts: { limit?: number; offset?: number } = {}
): Promise<EmployeeListRow[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'employees');
  if (!scope.requiresTenantWrap) return null;

  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.employees.findMany({
        where: { ...scope.where, is_active: true },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          job_title: true,
          org_unit_id: true,
          manager_id: true,
          hired_at: true,
          is_active: true,
        },
        orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
        take: limit,
        skip: offset,
      });
      return rows.map((r) => ({
        id: r.id,
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
        jobTitle: r.job_title,
        orgUnitId: r.org_unit_id,
        managerId: r.manager_id,
        hiredAt: r.hired_at,
        isActive: r.is_active ?? true,
      }));
    });
  } catch {
    return null;
  }
}
