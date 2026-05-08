/**
 * /dashboard view — Tenant Owner Overview (preset_code = 'tenant_owner_overview' · TENANT_OWNER).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/tenant-owner-overview.html.
 */
export default async function TenantOwnerOverviewView({
  role,
  tenantName,
}: {
  role: string;
  tenantName: string;
}) {
  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">
            Workspace · Org overview · {tenantName} · all departments
          </div>
          <h1>
            Organization <em>snapshot</em> · workforce &amp; capability
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>scope · own tenant · 8 departments</span>
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
          <div className="kpi-num">1.247</div>
          <div className="kpi-sub">
            8 departments · <strong>+243 vs Q4</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">PERFORMANCE AVG</div>
          <div className="kpi-num">3,91</div>
          <div className="kpi-sub">
            scale 1-5 · <strong>+0,18 vs Q4</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SKILL COVERAGE</div>
          <div className="kpi-num">82,4%</div>
          <div className="kpi-sub">
            ESCO mapped · <strong>+12,3pt</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">COMPENSATION RUN</div>
          <div className="kpi-num">62,4M €</div>
          <div className="kpi-sub">
            FY26 plan · <strong>52,8M base</strong>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Department <em>breakdown</em>
        </h2>
        <span className="meta">8 dept · skill coverage inline</span>
      </div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <table className="dense">
          <thead>
            <tr>
              <th>Department</th>
              <th>Headcount</th>
              <th>Skill coverage</th>
              <th className="right">Performance</th>
              <th className="right">Δ Q4</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Retail Banking', emp: 412, cov: 86, perf: '4,02', delta: '+0,15' },
              { name: 'Corporate Banking', emp: 238, cov: 88, perf: '3,98', delta: '+0,21' },
              { name: 'IT & Digital', emp: 187, cov: 91, perf: '4,11', delta: '+0,28' },
              { name: 'Risk & Compliance', emp: 141, cov: 84, perf: '3,89', delta: '+0,12' },
              { name: 'Operations', emp: 118, cov: 76, perf: '3,72', delta: '+0,08' },
              { name: 'Marketing & CX', emp: 72, cov: 79, perf: '3,85', delta: '+0,17' },
              { name: 'Finance & Tax', emp: 48, cov: 88, perf: '4,05', delta: '+0,22' },
              { name: 'HR', emp: 31, cov: 92, perf: '4,18', delta: '+0,30' },
            ].map((d) => (
              <tr key={d.name}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td className="mono">{d.emp}</td>
                <td>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${d.cov >= 85 ? 'fill-ok' : d.cov >= 75 ? 'fill-info' : 'fill-warn'}`}
                      style={{ width: `${d.cov}%` }}
                    />
                  </div>
                  <span
                    style={{ marginLeft: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
                  >
                    {d.cov}%
                  </span>
                </td>
                <td className="right mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {d.perf}
                </td>
                <td className="right mono" style={{ color: 'var(--semantic-success)' }}>
                  {d.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="double-split">
        <div className="panel">
          <div className="panel-head">
            <h2>
              Compensation · <em>FY26</em>
            </h2>
            <span className="meta">total run-rate</span>
          </div>
          <div className="comp-grid">
            {[
              { lbl: 'BASE PAYROLL', val: '52,8', unit: 'M €' },
              { lbl: 'VARIABLE POOL', val: '9,6', unit: 'M €' },
              { lbl: 'EXEC LTI', val: '3,2', unit: 'M €' },
              { lbl: 'BENEFITS', val: '4,1', unit: 'M €' },
            ].map((c) => (
              <div key={c.lbl} className="comp-card">
                <div className="lbl">{c.lbl}</div>
                <div className="val">
                  {c.val}
                  <span className="unit">{c.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-head">
            <h2>
              Succession <em>readiness</em>
            </h2>
            <span className="meta">29,2% ready · 124 candidates</span>
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
                strokeDashoffset="267"
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
                29,2%
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
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Top succession <em>candidates</em>
        </h2>
        <span className="meta">5 ready-now · cross-dept</span>
      </div>
      <div className="succession-grid">
        {[
          {
            role: 'Head Credit Risk',
            name: 'Stefania Bianchi',
            score: '92',
            risk: 'low' as const,
            ready: 'ready-now',
          },
          {
            role: 'Head Quant Analytics',
            name: 'Gabriele Amato',
            score: '88',
            risk: 'low' as const,
            ready: 'ready-now',
          },
          {
            role: 'Director CX',
            name: 'Sofia Conti',
            score: '85',
            risk: 'medium' as const,
            ready: '1-2y',
          },
          {
            role: 'Head IT Architecture',
            name: 'Davide Ferrara',
            score: '82',
            risk: 'low' as const,
            ready: '1-2y',
          },
          {
            role: 'Head HR Business',
            name: 'Sergio Bianchi',
            score: '79',
            risk: 'medium' as const,
            ready: '3-5y',
          },
        ].map((s) => (
          <article key={s.name} className="succession-card">
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

      <footer className="ws-footer">
        <span>SOURCE · employees · review_cycles · compensation_plan · succession_pipeline</span>
        <span>tenant_owner_overview · {role}</span>
      </footer>
    </>
  );
}
