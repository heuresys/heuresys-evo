/**
 * /dashboard view — Cross-tenant overview (preset_code = 'cross_tenant_overview' · SUPERUSER).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/cross-tenant-overview.html.
 *
 * S41 W4-final: per-tenant aggregations (headcount, skill coverage, performance,
 * succession) bound to fetchCrossTenantData. Integration health bound to
 * fetchIntegrationsHealth. Workforce 12-month trend SVG remains layout fixture
 * (requires monthly_employee_snapshot aggregation — carry-forward S42+).
 */
import { fetchCrossTenantData } from '@/lib/dashboard-views/cross-tenant-data';
import { fetchIntegrationsHealth } from '@/lib/dashboard-views/integrations-data';

export default async function CrossTenantOverviewView({ role }: { role: string }) {
  const [data, integrationsLive] = await Promise.all([
    fetchCrossTenantData(),
    fetchIntegrationsHealth(7),
  ]);
  const nf = new Intl.NumberFormat('it-IT');
  const employeesFmt = nf.format(data.totals.employees);
  const tenants = data.tenants;
  const totals = data.totals;

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
            <span>scope · platform · {totals.tenants} tenants</span>
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
          <div className="kpi-sub">cross-tenant · all {totals.tenants} tenants</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SKILL COVERAGE AVG</div>
          <div className="kpi-num">{totals.skillCoverageAvg}%</div>
          <div className="kpi-sub">
            customer tenants · <strong>ESCO 1.2.0</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">PERFORMANCE AVG</div>
          <div className="kpi-num">{totals.performanceAvg.toFixed(2).replace('.', ',')}</div>
          <div className="kpi-sub">
            scale 1-5 · <strong>customer avg</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SUCCESSION READY</div>
          <div className="kpi-num">{totals.successionReady}</div>
          <div className="kpi-sub">
            ready-now / 1y · <strong>cross-tenant</strong>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Tenant <em>fleet</em> · {tenants.length} active
        </h2>
        <span className="meta">workforce headcount + capability metrics</span>
      </div>
      <div className="tenant-grid">
        {tenants.map((t) => (
          <article key={t.tenantId} className={`tenant-card${t.isPlatform ? ' platform' : ''}`}>
            <span className={`tag ${t.isPlatform ? 'tag-platform' : 'tag-tenant'}`}>
              {t.isPlatform ? 'Platform' : 'Customer'}
            </span>
            <h3>
              {t.isPlatform ? (
                <>
                  <span className="wordmark-foot" aria-label="Heuresys">
                    heures
                    <span className="y" aria-hidden="true">
                      y
                    </span>
                    s
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
              <span className="val">{nf.format(t.employees)}</span>
            </div>
            <div className="row">
              <span className="lbl">Skill cov</span>
              <span className="val">{t.isPlatform ? '—' : `${t.skillCoveragePct}%`}</span>
            </div>
            <div className="row">
              <span className="lbl">Performance</span>
              <span className="val">
                {t.isPlatform || t.performanceAvg === 0
                  ? '—'
                  : t.performanceAvg.toFixed(2).replace('.', ',')}
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

      {(() => {
        const trend = data.workforceTrend;
        // Build series + month axis from live data with fallback
        const months = trend?.months ?? [
          'Jan 25',
          'Feb 25',
          'Mar 25',
          'Apr 25',
          'May 25',
          'Jun 25',
          'Jul 25',
          'Aug 25',
          'Sep 25',
          'Oct 25',
          'Nov 25',
          'Dec 25',
          'Jan 26',
        ];
        const fallbackSeries = [
          {
            tenantId: 'rtl',
            code: 'rtl-bank',
            label: 'RTL Bank',
            color: '#a855f7',
            values: [60, 65, 70, 72, 80, 85, 90, 95, 100, 105, 112, 118, 125],
          },
          {
            tenantId: 'sf',
            code: 'smartfood',
            label: 'SmartFood',
            color: '#3b82f6',
            values: [35, 38, 40, 42, 45, 50, 52, 55, 58, 60, 62, 65, 68],
          },
          {
            tenantId: 'en',
            code: 'econova',
            label: 'EcoNova',
            color: '#5fb87a',
            values: [20, 22, 24, 26, 30, 32, 35, 38, 40, 42, 45, 48, 50],
          },
          {
            tenantId: 'hs',
            code: 'heuresys',
            label: 'Heuresys',
            color: '#f59e0b',
            values: [10, 10, 11, 12, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          },
        ];
        const series = trend?.series && trend.series.length > 0 ? trend.series : fallbackSeries;
        // Normalize: max across all series → 100% → y=0; min → y=160. Padding 20.
        const allVals = series.flatMap((s) => s.values);
        const maxV = Math.max(1, ...allVals);
        const minV = Math.min(0, ...allVals);
        const yRange = Math.max(1, maxV - minV);
        const xStep = months.length > 1 ? 600 / (months.length - 1) : 600;
        const buildPoints = (vals: number[]) =>
          vals
            .map(
              (v, i) =>
                `${(i * xStep).toFixed(1)},${(190 - ((v - minV) / yRange) * 170).toFixed(1)}`
            )
            .join(' ');

        return (
          <div className="panel" style={{ marginBottom: 24 }}>
            <div className="panel-head">
              <h2>
                Workforce trend · <em>{months.length} months</em>
              </h2>
              <span className="meta">monthly cumulative headcount · cross-tenant</span>
            </div>
            <div style={{ padding: 18 }}>
              <svg viewBox="0 0 600 200" style={{ width: '100%', height: 200 }}>
                <g stroke="var(--rule)" strokeDasharray="2 4">
                  {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} />
                  ))}
                </g>
                {series.map((s) => (
                  <polyline
                    key={s.tenantId}
                    points={buildPoints(s.values)}
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
                  flexWrap: 'wrap',
                }}
              >
                {series.map((s) => (
                  <span key={s.tenantId}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        background: s.color,
                        marginRight: 6,
                        verticalAlign: 'middle',
                      }}
                    />
                    {s.code.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

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
              {
                lbl: 'SKILL MAPPED',
                val: totals.skillCoverageAvg,
                unit: '%',
                tone: 'accent' as const,
              },
              {
                lbl: 'PERF AVG (× 20)',
                val: Math.round(totals.performanceAvg * 20),
                unit: '%',
                tone: 'success' as const,
              },
              {
                lbl: 'SUCCESSION RATIO',
                val:
                  totals.employees > 0
                    ? Math.round((totals.successionReady / totals.employees) * 100)
                    : 0,
                unit: '%',
                tone: 'success' as const,
              },
              {
                lbl: 'TENANT ACTIVE',
                val:
                  totals.tenants > 0
                    ? Math.round(
                        (tenants.filter((t) => t.status === 'active').length / totals.tenants) * 100
                      )
                    : 0,
                unit: '%',
                tone: 'warn' as const,
              },
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
                    style={{ width: `${Math.min(100, g.val)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Integration health</h2>
            <span className="meta">
              {integrationsLive.length} active ·{' '}
              {integrationsLive.filter((i) => i.status !== 'ok').length} warn
            </span>
          </div>
          {(integrationsLive.length > 0
            ? integrationsLive
            : [
                {
                  name: 'No integrations',
                  meta: 'integrations table empty',
                  status: 'warn' as const,
                  color: 'var(--semantic-warning)',
                },
              ]
          ).map((it) => (
            <div key={it.name} className="int-row">
              <div className="icon">
                <svg viewBox="0 0 16 16" fill="none" stroke={it.color} strokeWidth="1.5">
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
        <span>
          SOURCE · tenants · employees · employee_skill_assessments · succession_candidates ·
          integrations
        </span>
        <span>
          cross_tenant_overview · {role} ·{' '}
          <span className="wordmark-foot">
            heures<span className="y">y</span>s
          </span>
        </span>
      </footer>
    </>
  );
}
