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

export interface CrossTenantLiveData {
  tenants: CrossTenantRow[];
  totals: CrossTenantPlatformTotals;
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

    return { tenants: rows, totals };
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
    };
  }
}
