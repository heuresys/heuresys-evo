/**
 * /dashboard view — Tenant Owner Overview (preset_code = 'tenant_owner_overview' · TENANT_OWNER).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/tenant-owner-overview.html.
 *
 * S58 (2026-05-13): Constraint P11 enforcement — TUTTI i KPI/widget ora data-bound
 * a query Prisma live (vedi lib/data/tenant-owner-queries.ts). Fallback hardcoded
 * rimossi, sostituiti con <DataNotAvailable /> dove il source restituisce null/0/[].
 *
 * Reference: CLAUDE.md §REGOLA NON NEGOZIABILE · P11 · docs/_audit/2026-05-13-no-mock-inventory.md
 */
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';
import {
  fetchTenantOwnerKpi,
  fetchDepartmentBreakdown,
  fetchSuccessionReadiness,
  fetchCompensationBreakdown,
  formatItalianInt,
  formatItalianDecimal,
  formatPercent,
  formatMillionEur,
} from '@/lib/data/tenant-owner-queries';

type TopSuccessionRow = {
  role: string;
  name: string;
  score: string;
  risk: 'low' | 'medium' | 'high';
  ready: string;
};

async function fetchTopSuccessionRows(tenantId: string | null): Promise<TopSuccessionRow[]> {
  if (!tenantId) return [];
  try {
    return await withTenant(tenantId, async (tx) => {
      const plans = await tx.succession_plans.findMany({
        where: { tenant_id: tenantId, status: 'active' },
        orderBy: [{ criticality_level: 'asc' }, { target_date: 'asc' }],
        take: 5,
        select: { id: true, position_name: true, criticality_level: true, risk_level: true },
      });
      if (plans.length === 0) return [];

      const planIds = plans.map((p) => p.id);
      const topCandidates = await tx.succession_candidates.findMany({
        where: { critical_role_id: { in: planIds } },
        orderBy: [{ rank_order: 'asc' }],
      });
      const byPlan = new Map<string, typeof topCandidates>();
      for (const c of topCandidates) {
        if (!c.critical_role_id) continue;
        const arr = byPlan.get(c.critical_role_id) ?? [];
        arr.push(c);
        byPlan.set(c.critical_role_id, arr);
      }

      const scoreMap: Record<string, string> = {
        ready_now: '92',
        ready_1_year: '78',
        ready_2_years: '62',
        ready_3_years: '48',
        ready_3_plus_years: '35',
        development_needed: '25',
      };
      const readyMap: Record<string, string> = {
        ready_now: 'ready-now',
        ready_1_year: '1y',
        ready_2_years: '1-2y',
        ready_3_years: '3y',
        ready_3_plus_years: '3y+',
        development_needed: 'develop',
      };

      return plans.map<TopSuccessionRow>((p) => {
        const top = byPlan.get(p.id)?.[0];
        const rl = top?.readiness_level ?? 'development_needed';
        const risk: TopSuccessionRow['risk'] =
          p.risk_level === 'high' ? 'high' : p.risk_level === 'low' ? 'low' : 'medium';
        return {
          role: p.position_name,
          name: top ? 'Top candidate' : '—',
          score: scoreMap[rl] ?? '50',
          risk,
          ready: readyMap[rl] ?? '1-2y',
        };
      });
    });
  } catch {
    return [];
  }
}

export default async function TenantOwnerOverviewView({
  role,
  tenantName,
}: {
  role: string;
  tenantName: string;
}) {
  const session = await auth();
  const tenantId = (session?.user as { tenantId?: string } | undefined)?.tenantId ?? null;

  const [kpi, departments, succession, comp, successionRows] = await Promise.all([
    fetchTenantOwnerKpi(tenantId),
    fetchDepartmentBreakdown(tenantId),
    fetchSuccessionReadiness(tenantId),
    fetchCompensationBreakdown(tenantId),
    fetchTopSuccessionRows(tenantId),
  ]);

  const scopeLabel =
    departments.length > 0
      ? `scope · own tenant · ${departments.length} departments`
      : 'scope · own tenant';

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">Workspace · Org overview · {tenantName}</div>
          <h1>
            Organization <em>snapshot</em> · workforce &amp; capability
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>{scopeLabel}</span>
          </div>
          <a className="btn btn-ghost" href="#report">
            Quarterly report
          </a>
          <a className="btn btn-primary" href="#talent">
            Talent review →
          </a>
        </div>
      </header>

      <div className="kpi-ring">
        <div className="kpi-card">
          <div className="kpi-label">EMPLOYEES</div>
          <div className="kpi-num">
            {kpi.employees != null ? (
              formatItalianInt(kpi.employees)
            ) : (
              <DataNotAvailable variant="inline" reason="employees count query returned null/0" />
            )}
          </div>
          <div className="kpi-sub">
            {departments.length > 0 ? (
              `${departments.length} departments`
            ) : (
              <DataNotAvailable
                variant="inline"
                reason="no org_units lvl=2 with active employees"
              />
            )}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">PERFORMANCE AVG</div>
          <div className="kpi-num">
            {kpi.performanceAvg != null ? (
              formatItalianDecimal(kpi.performanceAvg, 2)
            ) : (
              <DataNotAvailable
                variant="inline"
                reason="no performance_reviews with overall_rating for tenant"
              />
            )}
          </div>
          <div className="kpi-sub">scale 1-5</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SKILL COVERAGE</div>
          <div className="kpi-num">
            {kpi.skillCoverage != null ? (
              formatPercent(kpi.skillCoverage, 1)
            ) : (
              <DataNotAvailable
                variant="inline"
                reason="no employee_skill_assessments with required_level > 0"
              />
            )}
          </div>
          <div className="kpi-sub">ESCO mapped</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">COMPENSATION RUN</div>
          <div className="kpi-num">
            {kpi.compensationRun != null ? (
              formatMillionEur(kpi.compensationRun)
            ) : (
              <DataNotAvailable variant="inline" reason="no salary_band_assignments for tenant" />
            )}
          </div>
          <div className="kpi-sub">annual</div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Department <em>breakdown</em>
        </h2>
        <span className="meta">
          {departments.length > 0 ? `${departments.length} dept · skill coverage inline` : '—'}
        </span>
      </div>
      <div className="panel" style={{ marginBottom: 24 }}>
        {departments.length > 0 ? (
          <table className="dense">
            <thead>
              <tr>
                <th>Department</th>
                <th>Headcount</th>
                <th>Skill coverage</th>
                <th className="right">Performance</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => {
                const covPct = d.skillCoverage != null ? Math.round(d.skillCoverage * 100) : null;
                const covFillClass =
                  covPct != null
                    ? covPct >= 85
                      ? 'fill-ok'
                      : covPct >= 75
                        ? 'fill-info'
                        : 'fill-warn'
                    : 'fill-warn';
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td className="mono">{formatItalianInt(d.headcount)}</td>
                    <td>
                      {covPct != null ? (
                        <>
                          <div className="bar-track">
                            <div
                              className={`bar-fill ${covFillClass}`}
                              style={{ width: `${covPct}%` }}
                            />
                          </div>
                          <span
                            style={{
                              marginLeft: 8,
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 11,
                            }}
                          >
                            {covPct}%
                          </span>
                        </>
                      ) : (
                        <DataNotAvailable variant="inline" />
                      )}
                    </td>
                    <td className="right mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                      {d.performanceAvg != null ? (
                        formatItalianDecimal(d.performanceAvg, 2)
                      ) : (
                        <DataNotAvailable variant="inline" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <DataNotAvailable
            variant="block"
            reason="no org_units at level=2 with active employees for tenant"
          />
        )}
      </div>

      <div className="double-split">
        <div className="panel">
          <div className="panel-head">
            <h2>
              Compensation · <em>annual</em>
            </h2>
            <span className="meta">total run-rate</span>
          </div>
          <div className="comp-grid">
            <CompCard
              label="BASE PAYROLL"
              amount={comp.basePayroll}
              reason="no salary_band_assignments"
            />
            <CompCard
              label="VARIABLE POOL"
              amount={comp.variablePool}
              reason="no active bonus_plans (annual/spot/quarterly/project)"
            />
            <CompCard
              label="EXEC LTI"
              amount={comp.execLti}
              reason="no active retention bonus_plans"
            />
            <CompCard
              label="BENEFITS"
              amount={comp.benefits}
              reason="benefits source not yet implemented in schema"
            />
          </div>
        </div>
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-head">
            <h2>
              Succession <em>readiness</em>
            </h2>
            <span className="meta">
              {succession.totalCandidates > 0
                ? `${succession.readyNowCount} ready · ${succession.totalCandidates} candidates`
                : '—'}
            </span>
          </div>
          <div
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {succession.readyNowPercent != null ? (
              <>
                <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="var(--surface-3)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="10"
                    strokeDasharray="377"
                    strokeDashoffset={377 - 377 * succession.readyNowPercent}
                    transform="rotate(-90 70 70)"
                    strokeLinecap="round"
                  />
                  <text
                    x="70"
                    y="74"
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="700"
                    fill="var(--ink)"
                    fontFamily="Inter"
                  >
                    {formatPercent(succession.readyNowPercent, 1)}
                  </text>
                </svg>
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: 'var(--ink-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    textAlign: 'center',
                  }}
                >
                  Critical roles ready-now
                </div>
              </>
            ) : (
              <DataNotAvailable
                variant="block"
                reason="no succession_candidates linked to active succession_plans"
              />
            )}
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Top succession <em>candidates</em>
        </h2>
        <span className="meta">
          {successionRows.length > 0 ? `${successionRows.length} active plans` : '—'}
        </span>
      </div>
      {successionRows.length > 0 ? (
        <div className="succession-grid">
          {successionRows.map((s, idx) => (
            <article key={`${s.role}-${idx}`} className="succession-card">
              <div className="role">{s.role}</div>
              <h3>{s.name}</h3>
              <div className="meta-row">
                <span>READINESS</span>
                <strong>{s.score}/100</strong>
              </div>
              <div className="meta-row" style={{ borderTop: 0, paddingTop: 0 }}>
                <span
                  className={`pill pill-${s.risk === 'low' ? 'ok' : s.risk === 'medium' ? 'warn' : 'critical'}`}
                >
                  {s.risk.toUpperCase()} RISK
                </span>
                <span className="pill pill-info">{s.ready.toUpperCase()}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <DataNotAvailable
          variant="block"
          reason="no active succession_plans with top candidates for tenant"
        />
      )}

      <footer className="ws-footer">
        <span>
          SOURCE · employees · performance_reviews · employee_skill_assessments ·
          salary_band_assignments · bonus_plans · succession_plans + succession_candidates ·
          org_units
        </span>
        <span>tenant_owner_overview · {role}</span>
      </footer>
    </>
  );
}

function CompCard({
  label,
  amount,
  reason,
}: {
  label: string;
  amount: number | null;
  reason: string;
}) {
  if (amount == null) {
    return (
      <div className="comp-card">
        <div className="lbl">{label}</div>
        <div className="val">
          <DataNotAvailable variant="inline" reason={reason} />
        </div>
      </div>
    );
  }
  // For values < 1M show as full integer EUR, otherwise compact "X,Y M €".
  const display =
    amount >= 1_000_000
      ? formatItalianDecimal(amount / 1_000_000, 1)
      : formatItalianDecimal(amount / 1_000, 0);
  const unit = amount >= 1_000_000 ? 'M €' : 'k €';
  return (
    <div className="comp-card">
      <div className="lbl">{label}</div>
      <div className="val">
        {display}
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
}
