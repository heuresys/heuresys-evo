/**
 * /analytics/workforce — workforce analytics overview.
 *
 * Renderizza 4 KPI live aggregator (headcount + departments + active
 * employees recent + workforce_planning scenarios count). Sidebar entry
 * mappata per HR_DIRECTOR + HR_MANAGER via role-nav-map.
 *
 * Per cockpit overview cycle 2 alternativo, vedi `/dashboard/workforce_analytics_v2`
 * (preset _v2 con KpiRing 4-strip + Histogram org_unit breakdown).
 */
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { withTenant } from '@/lib/db';

interface WorkforceKpis {
  headcount: number;
  newHires90d: number;
  departments: number;
  scenarios: number;
}

async function fetchWorkforceKpis(tenantId: string | null): Promise<WorkforceKpis> {
  if (!tenantId) {
    return { headcount: 0, newHires90d: 0, departments: 0, scenarios: 0 };
  }
  try {
    return await withTenant(tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{ headcount: number; new_hires_90d: number; departments: number; scenarios: number }>
      >`
        SELECT
          (SELECT COUNT(*)::int FROM employees
             WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
               AND is_active = true) AS headcount,
          (SELECT COUNT(*)::int FROM employees
             WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
               AND is_active = true
               AND created_at >= NOW() - INTERVAL '90 days') AS new_hires_90d,
          (SELECT COUNT(DISTINCT org_unit_id)::int FROM employees
             WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
               AND is_active = true
               AND org_unit_id IS NOT NULL) AS departments,
          (SELECT COUNT(*)::int FROM workforce_plan_scenarios
             WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid) AS scenarios
      `;
      const r = rows[0] ?? { headcount: 0, new_hires_90d: 0, departments: 0, scenarios: 0 };
      return {
        headcount: r.headcount ?? 0,
        newHires90d: r.new_hires_90d ?? 0,
        departments: r.departments ?? 0,
        scenarios: r.scenarios ?? 0,
      };
    });
  } catch {
    return { headcount: 0, newHires90d: 0, departments: 0, scenarios: 0 };
  }
}

export default async function AnalyticsWorkforcePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?next=/analytics/workforce');
  }
  const user = session.user as { role?: string; tenantId?: string };
  const role = user.role ?? 'EMPLOYEE';
  const kpis = await fetchWorkforceKpis(user.tenantId ?? null);

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">ANALYTICS · WORKFORCE · {role}</div>
          <h1>
            Analitiche <em>workforce</em>
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>scope · workforce planning</span>
          </div>
        </div>
      </header>

      <div className="kpi-ring">
        <article className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">HEADCOUNT</span>
          </div>
          <div className="kpi-num">{kpis.headcount}</div>
          <div className="kpi-sub">
            active employees · <strong>{kpis.newHires90d} last 90d</strong>
          </div>
        </article>
        <article className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">DEPARTMENTS</span>
          </div>
          <div className="kpi-num">{kpis.departments}</div>
          <div className="kpi-sub">org units coperti</div>
        </article>
        <article className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">PLANNING</span>
          </div>
          <div className="kpi-num">{kpis.scenarios}</div>
          <div className="kpi-sub">workforce scenarios</div>
        </article>
        <article className="kpi-card">
          <div className="kpi-head">
            <span className="kpi-label">NEW HIRES</span>
          </div>
          <div className="kpi-num">{kpis.newHires90d}</div>
          <div className="kpi-sub">
            ultimi 90 giorni · <strong>vs target Q1</strong>
          </div>
        </article>
      </div>
    </>
  );
}
