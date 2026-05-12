/**
 * /dashboard view — Employee Journey (preset_code = 'employee_journey' · LINE_MANAGER + EMPLOYEE).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/employee-journey.html.
 *
 * S41 W4-final: profile-hero + career-arc + review-history + bridge-grid bound to
 * Prisma (employees + employee_timeline + performance_reviews + succession_candidates).
 * Skill-trend polyline + capability-radar SVG remain layout-driven fixtures
 * (require historical aggregation + target enrichment — carry-forward S42+).
 */
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { fetchEmployeeJourneyData } from '@/lib/dashboard-views/employee-journey-data';

export default async function EmployeeJourneyView({
  role,
  username,
  tenantName,
}: {
  role: string;
  username: string;
  tenantName: string;
}) {
  const session = await auth();
  const tenantId = (session?.user as { tenantId?: string } | undefined)?.tenantId ?? null;
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // Resolve employee_id via users.employee_id link
  let employeeId: string | null = null;
  if (userId) {
    const u = await prisma.users.findUnique({
      where: { id: userId },
      select: { employee_id: true },
    });
    employeeId = u?.employee_id ?? null;
  }

  const live = await fetchEmployeeJourneyData(tenantId, employeeId);

  const initials =
    live.profile?.initials ??
    username
      .split(/[.\s_-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? '')
      .join('');

  const displayName = live.profile?.fullName ?? username;
  const subLine = live.profile
    ? `e/${live.profile.id.slice(0, 4)} · ${live.profile.jobTitle ?? '—'}${live.profile.department ? ` · ${live.profile.department}` : ''}`
    : 'e/2011 · Quant Analyst Junior · Risk Modelling';
  const tenureLabel = live.profile
    ? `${live.profile.tenureYears}y ${live.profile.tenureMonths}m tenure`
    : '2y 4m tenure';
  const levelLabel = live.profile?.level
    ? `Level ${live.profile.level} · ${role}`
    : `Level 6 · ${role}`;

  const stages =
    live.stages.length > 0
      ? live.stages
      : [
          { id: '1', label: 'Data Analyst Intern', year: 'Q3 2023', status: 'past' as const },
          { id: '2', label: 'Quant Analyst Junior', year: 'Q1 2024', status: 'past' as const },
          { id: '3', label: 'Quant Analyst Senior', year: 'Q1 2026', status: 'current' as const },
          { id: '4', label: 'Risk Modelling Lead', year: 'Q3 2026 →', status: 'future' as const },
          { id: '5', label: 'Head Risk Quant', year: '2029+', status: 'future' as const },
        ];

  const reviews =
    live.reviews.length > 0
      ? live.reviews
      : ([
          { cycle: 'Q1 2026', goal: 4.2, comp: 4.1, overall: 4.2, outcome: 'meets' },
          { cycle: 'Q4 2025', goal: 4.0, comp: 3.9, overall: 4.0, outcome: 'meets' },
          { cycle: 'Q3 2025', goal: 3.8, comp: 4.0, overall: 3.9, outcome: 'meets' },
          { cycle: 'Q2 2025', goal: 3.6, comp: 3.7, overall: 3.7, outcome: 'grow' },
        ] as const);

  const bridges =
    live.bridges.length > 0
      ? live.bridges.map((b) => ({
          role: b.role,
          readiness: b.readiness,
          gaps: b.gaps.length > 0 ? b.gaps : ['Skill gap +18pt', 'Lead 0-1 +8pt', 'Risk an. +12pt'],
        }))
      : [
          {
            role: 'Quant Analyst Senior',
            readiness: 68,
            gaps: ['Stress testing +18pt', 'Risk an. SQL +12pt', 'Lead 0-1 +8pt'],
          },
          {
            role: 'Data Scientist · Risk',
            readiness: 54,
            gaps: ['ML applicato +24pt', 'Python +12pt', 'Risk an. +18pt'],
          },
          {
            role: 'Risk Reporting Lead',
            readiness: 42,
            gaps: ['Reporting tools +28pt', 'Lead +20pt', 'Comms +14pt'],
          },
        ];

  const skillMapped = live.skillStats.mapped > 0 ? live.skillStats.mapped : 14;
  const skillTotal = live.skillStats.total > 0 ? live.skillStats.total : 18;
  const reviewAvg =
    live.reviews.length > 0
      ? +(live.reviews.reduce((a, r) => a + r.overall, 0) / live.reviews.length).toFixed(1)
      : 4.2;
  const readinessNext = live.skillStats.readinessNext > 0 ? live.skillStats.readinessNext : 68;

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">My profile · Career journey · Q1 2026</div>
          <h1>
            La tua <em>traiettoria</em> in heuresys
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>{tenantName} · prod</span>
          </div>
          <a className="btn btn-ghost" href="#print">
            Stampa report
          </a>
          <a className="btn btn-primary" href="#review">
            Apri review →
          </a>
        </div>
      </header>

      <div className="profile-hero">
        <div className="profile-avatar">{initials || '??'}</div>
        <div className="profile-meta">
          <h2 className="profile-name">{displayName}</h2>
          <div className="profile-sub">{subLine}</div>
          <div className="profile-badges">
            <span className="pbadge pbadge-role">{levelLabel}</span>
            <span className="pbadge pbadge-dept">
              {live.profile?.department ?? 'Risk Modelling Dept'}
            </span>
            <span className="pbadge pbadge-tenure">{tenureLabel}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="stat-num">
              {skillMapped}
              <span className="unit">/{skillTotal}</span>
            </div>
            <div className="stat-lbl">SKILL MAPPED</div>
          </div>
          <div className="profile-stat">
            <div className="stat-num">
              {reviewAvg.toFixed(1).replace('.', ',')}
              <span className="unit">/5</span>
            </div>
            <div className="stat-lbl">REVIEW SCORE</div>
          </div>
          <div className="profile-stat">
            <div className="stat-num">
              {readinessNext}
              <span className="unit">%</span>
            </div>
            <div className="stat-lbl">READINESS NEXT</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-head">
          <h2>
            Career <em>arc</em>
          </h2>
          <span className="meta">{stages.length}-stage timeline</span>
        </div>
        <div className="career-arc" role="list" aria-label="Career arc">
          {stages.map((s, i) => (
            <div key={s.id} className={`career-stage ${s.status}`} role="listitem">
              <div className="dot">{i + 1}</div>
              <div className="label">{s.label}</div>
              <div className="year">{s.year}</div>
            </div>
          ))}
        </div>
      </div>

      {(() => {
        // Build skill-trend series (live or fallback). Polyline points mapped to
        // viewBox coordinates: x = 40 + idx*140 (5 quarters), y = 200 - (v/100)*180.
        const trendQuarters = live.skillTrend?.quarters ?? [
          'Q1 25',
          'Q2 25',
          'Q3 25',
          'Q4 25',
          'Q1 26',
        ];
        const trendSeries =
          live.skillTrend?.series && live.skillTrend.series.length > 0
            ? live.skillTrend.series
            : [
                {
                  label: 'Modellazione finanziaria',
                  color: '#a855f7',
                  values: [10, 30, 60, 80, 90],
                },
                { label: 'ML applicato', color: '#3b82f6', values: [5, 25, 50, 70, 85] },
                { label: 'Python', color: '#5fb87a', values: [20, 45, 65, 85, 95] },
                { label: 'Stress testing', color: '#f59e0b', values: [0, 10, 30, 50, 65] },
                { label: 'SQL', color: '#6c5ce7', values: [25, 45, 60, 75, 85] },
              ];
        const trendPoints = (vals: number[]) =>
          vals
            .map(
              (v, i) =>
                `${40 + i * ((600 - 40) / Math.max(1, vals.length - 1))},${200 - (Math.min(100, Math.max(0, v)) / 100) * 160}`
            )
            .join(' ');

        // Build radar polygons (live or fallback). Points relative to 120,120 center.
        const radar = live.radar;
        const currentVals = radar?.series.find((s) => s.name === 'Current')?.values ?? [
          82, 70, 35, 60, 75,
        ];
        const targetVals = radar?.series.find((s) => s.name === 'Target')?.values ?? [
          75, 80, 70, 80, 85,
        ];
        const radarLabels = radar?.axes ?? ['Process', 'Struct', 'Role', 'Skill', 'Perf'];
        const radarPoints = (vals: number[]) =>
          vals
            .map((v, i) => {
              const angle = (i / vals.length) * Math.PI * 2 - Math.PI / 2;
              const r = (90 * Math.min(100, Math.max(0, v))) / 100;
              return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
            })
            .join(' ');

        return (
          <div className="main-split">
            <div className="panel">
              <div className="panel-head">
                <h2>
                  Skill <em>trend</em> · {trendQuarters.length} quarter
                </h2>
                <span className="meta">{trendSeries.length} skills tracked</span>
              </div>
              <div style={{ padding: 18 }}>
                <svg viewBox="0 0 600 240" style={{ width: '100%', height: 220 }}>
                  <g stroke="var(--rule)" strokeDasharray="2 4">
                    {[40, 80, 120, 160, 200].map((y) => (
                      <line key={y} x1="40" y1={y} x2="600" y2={y} />
                    ))}
                  </g>
                  {trendSeries.map((s) => (
                    <polyline
                      key={s.label}
                      points={trendPoints(s.values)}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2"
                    />
                  ))}
                  {trendQuarters.map((q, i) => (
                    <text
                      key={q}
                      x={40 + i * ((600 - 40) / Math.max(1, trendQuarters.length - 1))}
                      y="232"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="9"
                      fill="var(--ink-muted)"
                      letterSpacing="1"
                      textAnchor={
                        i === 0 ? 'start' : i === trendQuarters.length - 1 ? 'end' : 'middle'
                      }
                    >
                      {q}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            <div className="capability-radar">
              <div className="panel-head" style={{ borderBottom: 0, padding: 0, marginBottom: 12 }}>
                <h2>
                  Capability <em>radar</em>
                </h2>
                <span className="meta">{radarLabels.length}-axis · current vs target</span>
              </div>
              <svg className="radar-svg" viewBox="0 0 240 240">
                {[1, 2, 3, 4].map((k) => (
                  <polygon
                    key={k}
                    points={radarLabels
                      .map((_, i) => {
                        const angle = (i / radarLabels.length) * Math.PI * 2 - Math.PI / 2;
                        const r = (90 * k) / 4;
                        return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="var(--rule)"
                  />
                ))}
                <polygon
                  points={radarPoints(currentVals)}
                  fill="var(--accent)"
                  fillOpacity="0.18"
                  stroke="var(--accent)"
                  strokeWidth="2"
                />
                <polygon
                  points={radarPoints(targetVals)}
                  fill="none"
                  stroke="var(--brand-blue)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {radarLabels.map((l, i) => {
                  const angle = (i / radarLabels.length) * Math.PI * 2 - Math.PI / 2;
                  const r = 105;
                  return (
                    <text
                      key={l}
                      x={120 + Math.cos(angle) * r}
                      y={120 + Math.sin(angle) * r}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="9"
                      fill="var(--ink-muted)"
                      letterSpacing="1"
                    >
                      {l.toUpperCase()}
                    </text>
                  );
                })}
              </svg>
              <div className="radar-legend">
                <span>
                  <span className="legend-swatch" style={{ background: 'var(--accent)' }} />
                  Current
                </span>
                <span>
                  <span className="legend-swatch" style={{ background: 'var(--brand-blue)' }} />
                  Target
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-head">
          <h2>
            Review <em>history</em>
          </h2>
          <span className="meta">last {reviews.length} cycles</span>
        </div>
        <table className="dense">
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Goal score</th>
              <th>Competency</th>
              <th>Overall</th>
              <th className="right">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.cycle}>
                <td style={{ fontWeight: 600 }}>{r.cycle}</td>
                <td className="mono">{r.goal.toFixed(1).replace('.', ',')}</td>
                <td className="mono">{r.comp.toFixed(1).replace('.', ',')}</td>
                <td>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${r.overall >= 4.0 ? 'fill-ok' : 'fill-warn'}`}
                      style={{ width: `${(r.overall / 5) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="right">
                  <span
                    className={`pill pill-${r.outcome === 'meets' || r.outcome === 'exceeds' ? 'ok' : 'warn'}`}
                  >
                    {r.outcome.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-head">
        <h2>
          Bridge to next <em>roles</em>
        </h2>
        <span className="meta">{bridges.length} candidate trajectories · readiness ring</span>
      </div>
      <div className="bridge-grid">
        {bridges.map((b) => (
          <article key={b.role} className="bridge-card">
            <div className="role">{b.role}</div>
            <div className="readiness">
              <svg viewBox="0 0 80 80" style={{ width: 80, height: 80 }}>
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--surface-3)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - b.readiness / 100)}
                  transform="rotate(-90 40 40)"
                  strokeLinecap="round"
                />
                <text
                  x="40"
                  y="44"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="var(--ink)"
                  fontFamily="Inter"
                >
                  {b.readiness}%
                </text>
              </svg>
              <span className="readiness-lbl">readiness</span>
            </div>
            <div className="gap-list">
              {b.gaps.map((g) => (
                <div key={g} className="gap-item">
                  {g}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <footer className="ws-footer">
        <span>SOURCE · employees · review_cycles · skill_assessments · career_paths · ESCO</span>
        <span>employee_journey · {role}</span>
      </footer>
    </>
  );
}
