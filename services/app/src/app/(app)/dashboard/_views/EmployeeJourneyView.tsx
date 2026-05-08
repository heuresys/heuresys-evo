/**
 * /dashboard view — Employee Journey (preset_code = 'employee_journey' · LINE_MANAGER + EMPLOYEE).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/employee-journey.html.
 */
export default async function EmployeeJourneyView({
  role,
  username,
  tenantName,
}: {
  role: string;
  username: string;
  tenantName: string;
}) {
  const initials = username
    .split(/[.\s_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

  const stages = [
    { id: '1', label: 'Data Analyst Intern', year: 'Q3 2023', status: 'past' as const },
    { id: '2', label: 'Quant Analyst Junior', year: 'Q1 2024', status: 'past' as const },
    { id: '3', label: 'Quant Analyst Senior', year: 'Q1 2026', status: 'current' as const },
    { id: '4', label: 'Risk Modelling Lead', year: 'Q3 2026 →', status: 'future' as const },
    { id: '5', label: 'Head Risk Quant', year: '2029+', status: 'future' as const },
  ];

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
          <h2 className="profile-name">{username}</h2>
          <div className="profile-sub">e/2011 · Quant Analyst Junior · Risk Modelling</div>
          <div className="profile-badges">
            <span className="pbadge pbadge-role">Level 6 · {role}</span>
            <span className="pbadge pbadge-dept">Risk Modelling Dept</span>
            <span className="pbadge pbadge-tenure">2y 4m tenure</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="stat-num">
              14<span className="unit">/18</span>
            </div>
            <div className="stat-lbl">SKILL MAPPED</div>
          </div>
          <div className="profile-stat">
            <div className="stat-num">
              4,2<span className="unit">/5</span>
            </div>
            <div className="stat-lbl">REVIEW SCORE</div>
          </div>
          <div className="profile-stat">
            <div className="stat-num">
              68<span className="unit">%</span>
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
          <span className="meta">5-stage timeline</span>
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

      <div className="main-split">
        <div className="panel">
          <div className="panel-head">
            <h2>
              Skill <em>trend</em> · 4 quarter
            </h2>
            <span className="meta">5 dimensions tracked</span>
          </div>
          <div style={{ padding: 18 }}>
            <svg viewBox="0 0 600 240" style={{ width: '100%', height: 220 }}>
              <g stroke="var(--rule)" strokeDasharray="2 4">
                {[40, 80, 120, 160, 200].map((y) => (
                  <line key={y} x1="40" y1={y} x2="600" y2={y} />
                ))}
              </g>
              {[
                {
                  color: '#a855f7',
                  points: '40,200 180,180 320,140 460,90 600,60',
                  label: 'Modellazione finanziaria',
                },
                {
                  color: '#3b82f6',
                  points: '40,210 180,190 320,160 460,120 600,90',
                  label: 'ML applicato',
                },
                {
                  color: '#5fb87a',
                  points: '40,180 180,150 320,120 460,80 600,50',
                  label: 'Python',
                },
                {
                  color: '#f59e0b',
                  points: '40,220 180,210 320,180 460,150 600,130',
                  label: 'Stress testing',
                },
                { color: '#6c5ce7', points: '40,170 180,150 320,130 460,110 600,85', label: 'SQL' },
              ].map((s) => (
                <polyline
                  key={s.label}
                  points={s.points}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                />
              ))}
              {['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26'].map((q, i) => (
                <text
                  key={q}
                  x={40 + i * 140}
                  y="232"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="9"
                  fill="var(--ink-muted)"
                  letterSpacing="1"
                  textAnchor={i === 0 ? 'start' : 'middle'}
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
            <span className="meta">5-axis · current vs target</span>
          </div>
          <svg className="radar-svg" viewBox="0 0 240 240">
            {[1, 2, 3, 4].map((k) => (
              <polygon
                key={k}
                points={[0, 1, 2, 3, 4]
                  .map((i) => {
                    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                    const r = (90 * k) / 4;
                    return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="var(--rule)"
              />
            ))}
            <polygon
              points={[82, 70, 35, 60, 75]
                .map((v, i) => {
                  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                  const r = (90 * v) / 100;
                  return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                })
                .join(' ')}
              fill="var(--accent)"
              fillOpacity="0.18"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <polygon
              points={[75, 80, 70, 80, 85]
                .map((v, i) => {
                  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                  const r = (90 * v) / 100;
                  return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                })
                .join(' ')}
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {['Process', 'Struct', 'Role', 'Skill', 'Perf'].map((l, i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
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

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-head">
          <h2>
            Review <em>history</em>
          </h2>
          <span className="meta">last 4 cycles</span>
        </div>
        <table className="dense">
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Self score</th>
              <th>Manager score</th>
              <th>Calibration</th>
              <th className="right">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {[
              { cyc: 'Q1 2026', self: 4.2, mgr: 4.1, cal: 4.2, out: 'meets' as const },
              { cyc: 'Q4 2025', self: 4.0, mgr: 3.9, cal: 4.0, out: 'meets' as const },
              { cyc: 'Q3 2025', self: 3.8, mgr: 4.0, cal: 3.9, out: 'meets' as const },
              { cyc: 'Q2 2025', self: 3.6, mgr: 3.7, cal: 3.7, out: 'grow' as const },
            ].map((r) => (
              <tr key={r.cyc}>
                <td style={{ fontWeight: 600 }}>{r.cyc}</td>
                <td className="mono">{r.self.toFixed(1).replace('.', ',')}</td>
                <td className="mono">{r.mgr.toFixed(1).replace('.', ',')}</td>
                <td>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${r.cal >= 4.0 ? 'fill-ok' : 'fill-warn'}`}
                      style={{ width: `${(r.cal / 5) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="right">
                  <span className={`pill pill-${r.out === 'meets' ? 'ok' : 'warn'}`}>
                    {r.out.toUpperCase()}
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
        <span className="meta">3 candidate trajectories · readiness ring</span>
      </div>
      <div className="bridge-grid">
        {[
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
        ].map((b) => (
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
