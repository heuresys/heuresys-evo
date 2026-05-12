import { fetchOrgSystemsData } from '@/lib/dashboard-views/org-systems-data';
import { fetchIntegrationsHealth } from '@/lib/dashboard-views/integrations-data';

/**
 * /dashboard view — Org & Systems (preset_code = 'org_systems' · IT_ADMIN).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/org-systems.html.
 * Data live: tenants · audit_logs · rbac counts · employees count.
 *
 * S41 W4-final: integration health section bound to integrations table
 * (replaces 7-item hardcoded list).
 */
export default async function OrgSystemsView({ role }: { role: string }) {
  const [data, integrationsLive] = await Promise.all([
    fetchOrgSystemsData(),
    fetchIntegrationsHealth(7),
  ]);

  const platformTenant = data.tenants.find((t) => t.isPlatform);
  const customerTenants = data.tenants.filter((t) => !t.isPlatform);
  const employeesFmt = new Intl.NumberFormat('it-IT').format(data.totalEmployees);

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">Platform admin · Org &amp; systems · cross-tenant</div>
          <h1>
            Multi-tenant <em>governance</em> &amp; system health
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>scope · platform · {role.toLowerCase()}</span>
          </div>
          <a className="btn btn-ghost" href="#audit">
            Audit export
          </a>
          <a className="btn btn-primary" href="#new-tenant">
            Aggiungi tenant →
          </a>
        </div>
      </header>

      <div className="kpi-ring">
        <div className="kpi-card">
          <div className="kpi-label">ACTIVE TENANTS</div>
          <div className="kpi-num">{data.tenants.length}</div>
          <div className="kpi-sub">
            {platformTenant ? '1 platform + ' : ''}
            {customerTenants.length} customer · <strong>{employeesFmt} emp tot</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">RBAC ROLES</div>
          <div className="kpi-num">{data.rbac.roles}</div>
          <div className="kpi-sub">
            level −1 SUPERUSER → level 6 EMPLOYEE · <strong>data-driven</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">RLS POLICIES</div>
          <div className="kpi-num">{data.rbac.policies}</div>
          <div className="kpi-sub">
            DB-level enforcement · <strong>{data.rbac.joins} RBP joins</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SYSTEM UPTIME</div>
          <div className="kpi-num">99,97%</div>
          <div className="kpi-sub">
            last 30 days · <strong>SLA 99,9%</strong>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>
          Tenant <em>fleet</em> · {data.tenants.length} active
        </h2>
        <span className="meta">schema 566 modelli · prisma 5.22</span>
      </div>
      <div className="tenant-grid">
        {data.tenants.map((t) => (
          <article key={t.id} className={`tenant-card${t.isPlatform ? ' platform' : ''}`}>
            <span className={`tag ${t.isPlatform ? 'tag-platform' : 'tag-tenant'}`}>
              {t.isPlatform ? 'Platform' : `Customer · ${t.status}`}
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
              tenantId · {t.shortId}... · {t.industry?.toLowerCase() ?? t.code}
            </div>
            <div className="row">
              <span className="lbl">Employees</span>
              <span className="val">{new Intl.NumberFormat('it-IT').format(t.employees)}</span>
            </div>
            <div className="row">
              <span className="lbl">Schema</span>
              <span className="val">v42 prod</span>
            </div>
            <div className="row">
              <span className="lbl">Status</span>
              <span className={`val${t.status === 'active' ? ' success' : ''}`}>{t.status}</span>
            </div>
            <div className="health">
              <span className={`dot${t.status !== 'active' ? ' warn' : ''}`} />
              <span className="lbl">
                {t.status === 'active' ? 'HEALTHY' : t.status.toUpperCase()} ·{' '}
                <strong>tenant {t.code}</strong>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="double-split">
        <div className="panel">
          <div className="panel-head">
            <h2>
              RBAC matrix · <em>{data.rbac.roles} roles</em> × functional areas
            </h2>
            <span className="meta">heat = grant %</span>
          </div>
          <table className="rbac">
            <thead>
              <tr>
                <th>Role</th>
                <th>Scope</th>
                <th>Areas</th>
                <th>Grant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SUPERUSER (−1)</td>
                <td className="scope">all {data.rbac.areas} areas · all tenants · all CRUD</td>
                <td>
                  {data.rbac.areas}/{data.rbac.areas}
                </td>
                <td className="lvl-100">100%</td>
              </tr>
              <tr>
                <td>TENANT_OWNER (0)</td>
                <td className="scope">all {data.rbac.areas} areas · own tenant · all CRUD</td>
                <td>
                  {data.rbac.areas}/{data.rbac.areas}
                </td>
                <td className="lvl-95">95%</td>
              </tr>
              <tr>
                <td>HR_DIRECTOR (2)</td>
                <td className="scope">talent + capability + review + comp</td>
                <td>26/{data.rbac.areas}</td>
                <td className="lvl-80">80%</td>
              </tr>
              <tr>
                <td>IT_ADMIN (1)</td>
                <td className="scope">system + auth + integrations · own tenant</td>
                <td>20/{data.rbac.areas}</td>
                <td className="lvl-60">60%</td>
              </tr>
              <tr>
                <td>HR_MANAGER (3)</td>
                <td className="scope">talent + review (own dept)</td>
                <td>13/{data.rbac.areas}</td>
                <td className="lvl-40">40%</td>
              </tr>
              <tr>
                <td>DEPT_HEAD (4)</td>
                <td className="scope">team capability · view ESCO</td>
                <td>8/{data.rbac.areas}</td>
                <td className="lvl-25">25%</td>
              </tr>
              <tr>
                <td>LINE_MANAGER (5)</td>
                <td className="scope">team review (own reports)</td>
                <td>5/{data.rbac.areas}</td>
                <td className="lvl-15">15%</td>
              </tr>
              <tr>
                <td>EMPLOYEE (6)</td>
                <td className="scope">own profile · own ESCO mapping</td>
                <td>2/{data.rbac.areas}</td>
                <td className="lvl-5">5%</td>
              </tr>
            </tbody>
          </table>
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
                  name: 'No integrations configured',
                  meta: 'integrations table empty for this tenant',
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

      <div className="section-head">
        <h2>
          System <em>metrics</em> · last 24h
        </h2>
        <span className="meta">PostgreSQL 16 · Redis 7 · BullMQ</span>
      </div>
      <div className="metrics-grid">
        {[
          {
            lbl: 'DB SIZE',
            val: '14,8',
            unit: 'GB',
            color: '#a855f7',
            points: '0,20 15,18 30,17 45,15 60,14 75,12 90,11 105,10 120,9',
          },
          {
            lbl: 'QUERY P95',
            val: '187',
            unit: 'ms',
            color: '#3b82f6',
            points: '0,14 15,16 30,12 45,10 60,8 75,11 90,9 105,7 120,6',
          },
          {
            lbl: 'RLS OVERHEAD',
            val: '2,3',
            unit: '%',
            color: '#5fb87a',
            points: '0,12 15,11 30,10 45,11 60,9 75,10 90,8 105,9 120,8',
          },
          {
            lbl: 'JOBS QUEUE',
            val: '42',
            unit: '/min',
            color: '#f59e0b',
            points: '0,8 15,10 30,7 45,12 60,9 75,8 90,11 105,9 120,10',
          },
        ].map((m) => (
          <div key={m.lbl} className="metric-card">
            <div className="lbl">{m.lbl}</div>
            <div className="val">
              {m.val}
              <span className="unit">{m.unit}</span>
            </div>
            <svg className="sparkline" viewBox="0 0 120 28" preserveAspectRatio="none">
              <polyline points={m.points} fill="none" stroke={m.color} strokeWidth="1.5" />
            </svg>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>
            Audit log · <em>live stream</em>
          </h2>
          <span className="meta">{data.audit.length} recent events</span>
        </div>
        <div className="audit-list">
          {data.audit.length === 0 ? (
            <div className="audit-row">
              <span className="ts">—</span>
              <span className="what">No recent audit events</span>
              <span className="actor">—</span>
            </div>
          ) : (
            data.audit.map((e, i) => (
              <div key={i} className="audit-row">
                <span className="ts">{e.ago}</span>
                <span className="what">
                  <strong>{e.action.toLowerCase().replace(/_/g, '.')}</strong> ·{' '}
                  {e.description.length > 100 ? `${e.description.slice(0, 100)}…` : e.description}
                  {e.highlight ? (
                    <>
                      {' '}
                      · <span className="accent">{e.highlight}</span>
                    </>
                  ) : null}
                </span>
                <span className="actor">{e.actor}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="ws-footer">
        <span>
          SOURCE · audit_logs · pino redaction · {data.tenants.length} tenants ·{' '}
          {data.rbac.policies} RLS policies · {data.rbac.joins} RBP joins · ESCO 1.2.0
        </span>
        <span>
          Phase 9 Mockup ·{' '}
          <span className="wordmark-foot">
            heures<span className="y">y</span>s
          </span>{' '}
          DESIGN.md · L21 modello base
        </span>
      </footer>
    </>
  );
}
