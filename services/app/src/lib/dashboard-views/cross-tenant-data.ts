import { prisma } from '@/lib/db';

/**
 * Server-side fetcher for /dashboard cross_tenant_overview view (S41 W4-final).
 * Aggregates per-tenant metrics: headcount, skill coverage avg, performance avg,
 * succession ready candidates. SUPERUSER cross-tenant intentional.
 */

export interface CrossTenantRow {
  tenantId: string;
  code: string;
  name: string;
  status: string;
  industry: string | null;
  employees: number;
  skillCoveragePct: number; // 0-100
  performanceAvg: number; // 0-5
  successionReady: number;
  isPlatform: boolean;
  shortId: string;
}

export interface CrossTenantPlatformTotals {
  employees: number;
  skillCoverageAvg: number;
  performanceAvg: number;
  successionReady: number;
  tenants: number;
}

export interface WorkforceTrendSeries {
  tenantId: string;
  code: string;
  label: string;
  color: string;
  values: number[]; // 13 months, cumulative headcount
}

export interface WorkforceTrendData {
  months: string[]; // ['Jan 25','Feb 25',...]
  series: WorkforceTrendSeries[];
}

export interface CrossTenantLiveData {
  tenants: CrossTenantRow[];
  totals: CrossTenantPlatformTotals;
  workforceTrend: WorkforceTrendData | null;
}

export async function fetchCrossTenantData(): Promise<CrossTenantLiveData> {
  try {
    const tenantsRaw = await prisma.tenants.findMany({
      select: { id: true, code: true, name: true, status: true, industry_type: true },
      orderBy: { created_at: 'asc' },
    });

    // SAFE: SUPERUSER cross-tenant view (intentional)
    const empByTenant = await prisma.employees.groupBy({
      by: ['tenant_id'],
      where: { is_active: true },
      _count: { id: true },
      _avg: { performance_rating: true },
    });
    const empMap = new Map<string, { employees: number; perfAvg: number }>();
    for (const e of empByTenant) {
      if (e.tenant_id) {
        empMap.set(e.tenant_id, {
          employees: e._count.id,
          perfAvg: Number(e._avg.performance_rating ?? 0),
        });
      }
    }

    // Skill coverage: ratio of employees with ≥1 skill assessment, per tenant
    const skillCoverageRaw = await prisma.$queryRaw<
      { tenant_id: string; mapped: bigint; total: bigint }[]
    >`
      SELECT t.id AS tenant_id,
             COUNT(DISTINCT esca.employee_id) AS mapped,
             COUNT(DISTINCT e.id) AS total
      FROM tenants t
      LEFT JOIN employees e ON e.tenant_id = t.id AND e.is_active = true
      LEFT JOIN employee_skill_assessments esca ON esca.employee_id = e.id
      GROUP BY t.id
    `;
    const coverageMap = new Map<string, number>();
    for (const r of skillCoverageRaw) {
      const total = Number(r.total);
      const mapped = Number(r.mapped);
      coverageMap.set(r.tenant_id, total > 0 ? Math.round((mapped / total) * 100) : 0);
    }

    const successionByTenant = await prisma.succession_candidates.groupBy({
      by: ['tenant_id'],
      where: { readiness_level: { in: ['ready_now', 'ready_1_year'] } },
      _count: { id: true },
    });
    const succMap = new Map<string, number>();
    for (const s of successionByTenant) {
      if (s.tenant_id) succMap.set(s.tenant_id, s._count.id);
    }

    const rows: CrossTenantRow[] = tenantsRaw.map((t) => {
      const emp = empMap.get(t.id);
      const isPlatform = t.code === 'heuresys' || t.name.toLowerCase().includes('heuresys system');
      return {
        tenantId: t.id,
        code: t.code,
        name: t.name,
        status: t.status ?? 'active',
        industry: t.industry_type,
        employees: emp?.employees ?? 0,
        skillCoveragePct: coverageMap.get(t.id) ?? 0,
        performanceAvg: emp?.perfAvg ? +emp.perfAvg.toFixed(2) : 0,
        successionReady: succMap.get(t.id) ?? 0,
        isPlatform,
        shortId: t.id.slice(0, 8),
      };
    });

    const customerRows = rows.filter((r) => !r.isPlatform);
    const totals: CrossTenantPlatformTotals = {
      employees: rows.reduce((a, r) => a + r.employees, 0),
      skillCoverageAvg:
        customerRows.length > 0
          ? Math.round(
              customerRows.reduce((a, r) => a + r.skillCoveragePct, 0) / customerRows.length
            )
          : 0,
      performanceAvg:
        customerRows.length > 0
          ? +(customerRows.reduce((a, r) => a + r.performanceAvg, 0) / customerRows.length).toFixed(
              2
            )
          : 0,
      successionReady: rows.reduce((a, r) => a + r.successionReady, 0),
      tenants: rows.length,
    };

    const workforceTrend = await fetchWorkforceTrend(rows);

    return { tenants: rows, totals, workforceTrend };
  } catch {
    return {
      tenants: [],
      totals: {
        employees: 0,
        skillCoverageAvg: 0,
        performanceAvg: 0,
        successionReady: 0,
        tenants: 0,
      },
      workforceTrend: null,
    };
  }
}

const TREND_COLORS = ['#a855f7', '#3b82f6', '#5fb87a', '#f59e0b'];

/**
 * 13-month cumulative headcount per tenant. Computed on-the-fly from
 * employees.hire_date + termination_date (carry-forward: migrate to
 * monthly_employee_snapshot mat view for performance once seeded).
 *
 * SAFE: SUPERUSER cross-tenant aggregation (intentional, platform-only view).
 */
async function fetchWorkforceTrend(tenants: CrossTenantRow[]): Promise<WorkforceTrendData | null> {
  if (tenants.length === 0) return null;
  const customers = tenants.filter((t) => !t.isPlatform).slice(0, 4);
  if (customers.length === 0) return null;

  // 13 month boundaries (start of each month, oldest → newest)
  const now = new Date();
  const months: { date: Date; label: string }[] = [];
  for (let i = 12; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      date: d,
      label: `${d.toLocaleString('en', { month: 'short' })} ${String(d.getFullYear()).slice(-2)}`,
    });
  }

  // SAFE: SUPERUSER cross-tenant aggregation
  const rawRows = await prisma.$queryRaw<
    { tenant_id: string; month_start: Date; headcount: bigint }[]
  >`
    WITH month_grid AS (
      SELECT generate_series(
        date_trunc('month', now())::date - interval '12 months',
        date_trunc('month', now())::date,
        interval '1 month'
      )::date AS month_start
    ),
    tenant_grid AS (
      SELECT id AS tenant_id FROM tenants WHERE id = ANY(${customers.map((c) => c.tenantId)}::uuid[])
    )
    SELECT tg.tenant_id,
           mg.month_start,
           COUNT(e.id)::bigint AS headcount
    FROM tenant_grid tg
    CROSS JOIN month_grid mg
    LEFT JOIN employees e
      ON e.tenant_id = tg.tenant_id
      AND e.hire_date IS NOT NULL
      AND e.hire_date <= (mg.month_start + interval '1 month' - interval '1 day')
      AND (e.termination_date IS NULL OR e.termination_date > mg.month_start)
    GROUP BY tg.tenant_id, mg.month_start
    ORDER BY tg.tenant_id, mg.month_start
  `;

  const byTenant = new Map<string, Map<string, number>>();
  for (const r of rawRows) {
    const key = r.month_start.toISOString().slice(0, 10);
    if (!byTenant.has(r.tenant_id)) byTenant.set(r.tenant_id, new Map());
    byTenant.get(r.tenant_id)!.set(key, Number(r.headcount));
  }

  const series: WorkforceTrendSeries[] = customers.map((t, idx) => {
    const map = byTenant.get(t.tenantId) ?? new Map();
    const values = months.map((m) => map.get(m.date.toISOString().slice(0, 10)) ?? 0);
    return {
      tenantId: t.tenantId,
      code: t.code,
      label: t.name,
      color: TREND_COLORS[idx % TREND_COLORS.length]!,
      values,
    };
  });

  const anyData = series.some((s) => s.values.some((v) => v > 0));
  if (!anyData) return null;

  return { months: months.map((m) => m.label), series };
}
