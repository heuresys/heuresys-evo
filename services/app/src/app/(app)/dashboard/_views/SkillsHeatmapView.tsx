/**
 * /dashboard view — Skills Heatmap (preset_code = 'skills_heatmap' · HR_MANAGER).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/skills-heatmap.html.
 *
 * S41 W4-final: department × skill coverage matrix bound to
 * employee_skill_assessments JOIN employees per-tenant.
 */
import { auth } from '@/lib/auth';
import { fetchSkillsHeatmapData } from '@/lib/dashboard-views/skills-heatmap-data';

export default async function SkillsHeatmapView({
  role,
  tenantName,
}: {
  role: string;
  tenantName: string;
}) {
  const session = await auth();
  const tenantId = (session?.user as { tenantId?: string } | undefined)?.tenantId ?? null;
  const live = await fetchSkillsHeatmapData(tenantId);

  // Fallback fixture (preserves brand-fedele layout when DB not seeded)
  const departments =
    live.departments.length > 0
      ? live.departments
      : [
          'Retail B.',
          'Corporate B.',
          'IT & Digital',
          'Risk & Comp.',
          'Operations',
          'Marketing',
          'Finance',
          'HR',
        ];
  const skills =
    live.skills.length > 0
      ? live.skills
      : [
          'SQL',
          'Python',
          'ML',
          'Stress test',
          'GDPR',
          'Excel fin.',
          'Comms',
          'Lead',
          'Agile',
          'Risk an.',
          'CX',
          'Reporting',
        ];
  const cells: number[][] =
    live.cells.length > 0
      ? live.cells
      : departments.map((_, di) =>
          skills.map((_, si) => Math.floor(((Math.sin(di * 13 + si * 7) + 1) / 2) * 100))
        );

  function heatBucket(v: number): string {
    if (v >= 85) return 'heat-6';
    if (v >= 75) return 'heat-5';
    if (v >= 60) return 'heat-4';
    if (v >= 45) return 'heat-3';
    if (v >= 30) return 'heat-2';
    if (v >= 15) return 'heat-1';
    return 'heat-0';
  }

  const totals =
    live.cells.length > 0
      ? live.totals
      : { critical: 12, warning: 23, healthy: 61, avgCoverage: 72 };
  const criticalCells =
    live.criticalCells.length > 0
      ? live.criticalCells
      : [
          { dept: 'Risk', skill: 'Stress testing', coverage: 12, bucket: 'critical' as const },
          { dept: 'Legal', skill: 'GDPR compliance', coverage: 18, bucket: 'critical' as const },
          { dept: 'Risk', skill: 'ML risk models', coverage: 22, bucket: 'critical' as const },
          {
            dept: 'Operations',
            skill: 'Lean Six Sigma',
            coverage: 26,
            bucket: 'critical' as const,
          },
          { dept: 'Marketing', skill: 'CDP & MarTech', coverage: 28, bucket: 'critical' as const },
          { dept: 'IT/Quant', skill: 'Python ML', coverage: 30, bucket: 'critical' as const },
        ];
  const buckets =
    live.buckets.length > 0
      ? live.buckets
      : [
          { range: '0-20%', count: 4, tone: 'critical' as const },
          { range: '20-40%', count: 12, tone: 'critical' as const },
          { range: '40-60%', count: 23, tone: 'warn' as const },
          { range: '60-70%', count: 18, tone: 'warn' as const },
          { range: '70-80%', count: 22, tone: 'ok' as const },
          { range: '80-90%', count: 15, tone: 'ok' as const },
          { range: '90-100%', count: 6, tone: 'info' as const },
        ];
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">Talent · Skills heatmap · Q1 2026</div>
          <h1>
            Coverage skill <em>per dipartimento</em>
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>{tenantName} · prod</span>
          </div>
          <a className="btn btn-ghost" href="#csv">
            Export CSV
          </a>
          <a className="btn btn-primary" href="#training">
            Genera training plan →
          </a>
        </div>
      </header>

      <div className="kpi-ring">
        <div className="kpi-card">
          <div className="kpi-label">CRITICAL CELLS · P0</div>
          <div className="kpi-num">{totals.critical}</div>
          <div className="kpi-sub">
            coverage &lt; 30% · <strong>action req</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">WARNING CELLS · P1</div>
          <div className="kpi-num">{totals.warning}</div>
          <div className="kpi-sub">
            coverage 30-60% · <strong>monitor</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">HEALTHY CELLS · OK</div>
          <div className="kpi-num">{totals.healthy}</div>
          <div className="kpi-sub">
            coverage &gt; 60% · <strong>baseline</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">AVG COVERAGE</div>
          <div className="kpi-num">{totals.avgCoverage.toString().replace('.', ',')}%</div>
          <div className="kpi-sub">
            vs Q4 2025 · <strong>+ESCO 312</strong>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">PRIORITY</span>
          <span className="filter-pill active">All</span>
          <span className="filter-pill">P0</span>
          <span className="filter-pill">P1</span>
          <span className="filter-pill">OK</span>
        </div>
        <div className="filter-group">
          <span className="filter-label">CAPABILITY</span>
          <span className="filter-pill active">All 5</span>
          <span className="filter-pill">Process</span>
          <span className="filter-pill">Role</span>
          <span className="filter-pill">Competency</span>
        </div>
        <div className="filter-group">
          <span className="filter-label">CYCLE</span>
          <span className="filter-pill active">Q1 2026</span>
          <span className="filter-pill">Q4 2025</span>
          <span className="filter-pill">Δ trend</span>
        </div>
      </div>

      <div className="heatmap-wrap">
        <div className="panel-head" style={{ borderBottom: '1px solid var(--rule)' }}>
          <h2>
            Coverage <em>matrix</em> · {departments.length} dept × {skills.length} ESCO skills
          </h2>
          <span className="meta">heat = coverage % · click cell for drill</span>
        </div>
        <div
          className="heatmap-grid"
          style={{
            gridTemplateColumns: `minmax(120px, max-content) repeat(${skills.length}, 1fr)`,
            padding: 18,
          }}
        >
          <div />
          {skills.map((s) => (
            <div key={s} className="heatmap-col-header">
              {s}
            </div>
          ))}
          {departments.map((d, di) => (
            <Frag key={d}>
              <div className="heatmap-row-label">{d}</div>
              {skills.map((s, si) => {
                const v = cells[di]?.[si] ?? 0;
                return (
                  <div
                    key={s}
                    className={`heatmap-cell ${heatBucket(v)}`}
                    title={`${d} × ${s}: ${v}%`}
                  >
                    {v}
                  </div>
                );
              })}
            </Frag>
          ))}
        </div>
      </div>

      <div className="double-split">
        <div className="panel">
          <div className="panel-head">
            <h2>
              Coverage <em>distribution</em>
            </h2>
            <span className="meta">cells per coverage bucket</span>
          </div>
          <div className="histogram">
            {buckets.map((b) => (
              <div key={b.range} className="histo-bar">
                <span className="histo-label">{b.range}</span>
                <div className="histo-track">
                  <div
                    className={`histo-fill fill-${b.tone}`}
                    style={{ width: `${(b.count / maxBucket) * 100}%` }}
                  />
                </div>
                <span className="histo-count">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>
              Critical cells · <em>P0</em>
            </h2>
            <span className="meta">{criticalCells.length} highest gaps</span>
          </div>
          {criticalCells.map((c) => (
            <div key={`${c.dept}-${c.skill}`} className="crit-row">
              <span className="dept">{c.dept}</span>
              <span className="skill">{c.skill}</span>
              <span className="cov">{c.coverage}%</span>
              <span className="pill pill-critical">−{Math.max(0, 75 - c.coverage)}pt</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="ws-footer">
        <span>SOURCE · employee_skill_assessments · employees · departments · ESCO 1.2.0</span>
        <span>skills_heatmap · {role}</span>
      </footer>
    </>
  );
}

function Frag({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
