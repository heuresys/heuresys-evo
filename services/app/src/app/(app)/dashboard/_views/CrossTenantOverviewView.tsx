import { fetchOrgSystemsData } from '@/lib/dashboard-views/org-systems-data';

/**
 * /dashboard view — Cross-tenant overview (preset_code = 'cross_tenant_overview' · SUPERUSER).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/cross-tenant-overview.html.
 */
export default async function CrossTenantOverviewView({ role }: { role: string }) {
  const data = await fetchOrgSystemsData();
  const employeesFmt = new Intl.NumberFormat('it-IT').format(data.totalEmployees);

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">Workspace · Cross-tenant analytics · platform-wide</div>
          <h1>
            Cross-tenant <em>analytics</em> · workforce flotta
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>scope · platform · {data.tenants.length} tenants</span>
          </div>
          <a className="btn btn-ghost" href="#csv">
            CSV export
          </a>
          <a className="btn btn-primary" href="#drill">
            Drill-down →
          </a>
        </div>
      </header>

      <div className="kpi-ring">
        <div className="kpi-card">
          <div className="kpi-label">EMPLOYEES TOT</div>
          <div className="kpi-num">{employeesFmt}</div>
          <div className="kpi-sub">cross-tenant · all {data.tenants.length} tenants</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SKILL COVERAGE AVG</div>
          <div className="kpi-num">73,2%</div>
          <div className="kpi-sub">
            +6,1pt vs Q4 · <strong>ESCO 1.2.0</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">PERFORMANCE AVG</div>
          <div className="kpi-num">3,84</div>
          <div className="kpi-sub">
            scale 1-5 · <strong>+0,12 vs Q4</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SUCCESSION READY</div>
          <div className="kpi-num">147</div>
          <div className="kpi-sub">
            ready-now / 1-2y · <strong>52 critical roles</strong>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Tenant <em>fleet</em> · {data.tenants.length} active
        </h2>
        <span className="meta">workforce headcount + capability metrics</span>
      </div>
      <div className="tenant-grid">
        {data.tenants.map((t) => (
          <article key={t.id} className={`tenant-card${t.isPlatform ? ' platform' : ''}`}>
            <span className={`tag ${t.isPlatform ? 'tag-platform' : 'tag-tenant'}`}>
              {t.isPlatform ? 'Platform' : 'Customer'}
            </span>
            <h3>
              {t.isPlatform ? (
                <>
                  <span className="wordmark-foot">
                    heures<span className="y">y</span>s
                  </span>{' '}
                  System
                </>
              ) : (
                t.name
              )}
            </h3>
            <div className="tid">
              {t.industry?.toLowerCase() ?? t.code} · {t.shortId}…
            </div>
            <div className="row">
              <span className="lbl">Headcount</span>
              <span className="val">{new Intl.NumberFormat('it-IT').format(t.employees)}</span>
            </div>
            <div className="row">
              <span className="lbl">Skill cov</span>
              <span className="val">
                {t.isPlatform ? '—' : `${65 + ((t.employees * 7) % 25)},${t.employees % 9}%`}
              </span>
            </div>
            <div className="row">
              <span className="lbl">Performance</span>
              <span className="val">
                {t.isPlatform ? '—' : `${(38 + (t.employees % 10)) / 10}`}
              </span>
            </div>
            <div className="health">
              <span className={`dot${t.status !== 'active' ? ' warn' : ''}`} />
              <span className="lbl">
                {t.status.toUpperCase()} · <strong>{t.code}</strong>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-head">
          <h2>
            Workforce trend · <em>12 months</em>
          </h2>
          <span className="meta">monthly aggregates · cross-tenant</span>
        </div>
        <div style={{ padding: 18 }}>
          <svg viewBox="0 0 600 200" style={{ width: '100%', height: 200 }}>
            <g stroke="var(--rule)" strokeDasharray="2 4">
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} />
              ))}
            </g>
            {[
              {
                color: '#a855f7',
                points:
                  '0,140 50,135 100,130 150,128 200,120 250,115 300,110 350,105 400,100 450,95 500,88 550,82 600,75',
                label: 'RTL Bank',
              },
              {
                color: '#3b82f6',
                points:
                  '0,165 50,162 100,160 150,158 200,155 250,150 300,148 350,145 400,142 450,140 500,138 550,135 600,132',
                label: 'SmartFood',
              },
              {
                color: '#5fb87a',
                points:
                  '0,180 50,178 100,176 150,174 200,170 250,168 300,165 350,162 400,160 450,158 500,155 550,152 600,150',
                label: 'EcoNova',
              },
              {
                color: '#f59e0b',
                points:
                  '0,190 50,189 100,188 150,187 200,186 250,185 300,184 350,183 400,182 450,181 500,180 550,179 600,178',
                label: 'Heuresys',
              },
            ].map((s) => (
              <polyline
                key={s.label}
                points={s.points}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
              />
            ))}
          </svg>
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 12,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  background: '#a855f7',
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              RTL BANK
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  background: '#3b82f6',
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              SMARTFOOD
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  background: '#5fb87a',
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              ECONOVA
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  background: '#f59e0b',
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
              HEURESYS
            </span>
          </div>
        </div>
      </div>

      <div className="double-split">
        <div className="panel">
          <div className="panel-head">
            <h2>
              Capability <em>gauges</em>
            </h2>
            <span className="meta">platform-wide · Q1 2026</span>
          </div>
          <div className="gauge-grid">
            {[
              { lbl: 'SKILL MAPPED', val: 73, unit: '%', tone: 'accent' },
              { lbl: 'REVIEW DONE Q1', val: 77, unit: '%', tone: 'success' },
              { lbl: 'GOALS ACTIVE', val: 84, unit: '%', tone: 'success' },
              { lbl: 'LEARNING ENROLL', val: 62, unit: '%', tone: 'warn' },
            ].map((g) => (
              <div key={g.lbl} className="gauge-card">
                <div className="lbl">{g.lbl}</div>
                <div className={`gauge-val gauge-${g.tone}`}>
                  {g.val}
                  <span className="unit">{g.unit}</span>
                </div>
                <div className="gauge-bar">
                  <div
                    className={`bar-fill fill-${g.tone === 'accent' ? 'info' : g.tone === 'success' ? 'ok' : 'warn'}`}
                    style={{ width: `${g.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Integration health</h2>
            <span className="meta">7 active · 1 warn</span>
          </div>
          {[
            { name: 'ESCO ontology feed', meta: 'v1.2.0 · sync 2h ago', status: 'ok' as const },
            { name: 'Azure AD · SSO', meta: 'SAML · 1.524 users', status: 'ok' as const },
            { name: 'Workday · payroll', meta: 'REST · last 06:42', status: 'ok' as const },
            { name: 'SmartFood · ATECO', meta: '14h lag', status: 'warn' as const },
            { name: 'SAP HCM · org sync', meta: 'Hourly · 14:32', status: 'ok' as const },
            { name: 'Slack · notifications', meta: 'webhook · 142 today', status: 'ok' as const },
            {
              name: 'SCIM 2.0 · provisioning',
              meta: 'last reconcile 22:00',
              status: 'ok' as const,
            },
          ].map((it) => (
            <div key={it.name} className="int-row">
              <div className="icon">
                <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6" />
                </svg>
              </div>
              <div className="info">
                <div className="name">{it.name}</div>
                <div className="meta">{it.meta}</div>
              </div>
              <span className={`pill pill-${it.status}`}>{it.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="ws-footer">
        <span>SOURCE · platform aggregations · 12-month workforce trend · ESCO 1.2.0</span>
        <span>
          cross_tenant_overview · {role} · phase 9 mockup ·{' '}
          <span className="wordmark-foot">
            heures<span className="y">y</span>s
          </span>
        </span>
      </footer>
    </>
  );
}
