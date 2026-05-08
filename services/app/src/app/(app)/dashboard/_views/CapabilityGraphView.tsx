/**
 * /dashboard view — Capability Graph (preset_code = 'capability_graph' · DEPT_HEAD).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/capability-graph.html.
 */
export default async function CapabilityGraphView({
  role,
  tenantName,
}: {
  role: string;
  tenantName: string;
}) {
  // Force-directed pseudo-layout: 5 capability clusters + ~24 nodes
  const clusters = [
    { id: 'process', label: 'Process', color: 'var(--cap-process)' },
    { id: 'structure', label: 'Structure', color: 'var(--cap-structure)' },
    { id: 'role', label: 'Role', color: 'var(--cap-role)' },
    { id: 'competency', label: 'Competency', color: 'var(--cap-competence)' },
    { id: 'performance', label: 'Performance', color: 'var(--cap-performance)' },
  ];

  // 24 nodes: positioned on circles per cluster
  const nodes = clusters.flatMap((c, ci) => {
    const cx = 250 + Math.cos((ci / 5) * Math.PI * 2 - Math.PI / 2) * 150;
    const cy = 200 + Math.sin((ci / 5) * Math.PI * 2 - Math.PI / 2) * 120;
    return Array.from({ length: 5 }).map((_, i) => {
      const angle = (i / 5) * Math.PI * 2;
      return {
        id: `${c.id}-${i}`,
        label: `${c.label.slice(0, 3)} ${i + 1}`,
        cluster: c.id,
        color: c.color,
        x: cx + Math.cos(angle) * 35,
        y: cy + Math.sin(angle) * 35,
      };
    });
  });

  const edges = nodes.flatMap((n, i) => {
    if (i === nodes.length - 1) return [];
    return [{ id: `e-${i}`, source: n, target: nodes[(i + 1) % nodes.length]! }];
  });

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">Knowledge Graph · Capability ontology · ESCO 1.2.0</div>
          <h1>
            Capability <em>graph topology</em>
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>{tenantName} · prod</span>
          </div>
          <a className="btn btn-ghost" href="#graphml">
            Export GraphML
          </a>
          <a className="btn btn-primary" href="#query">
            Esegui query →
          </a>
        </div>
      </header>

      <div className="kpi-ring">
        <div className="kpi-card">
          <div className="kpi-label">NODES TOTAL</div>
          <div className="kpi-num">
            14.011<span className="delta up">+312</span>
          </div>
          <div className="kpi-sub">
            ESCO + custom · <strong>v1.2.0</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">EDGES TOTAL</div>
          <div className="kpi-num">
            42.087<span className="delta up">+1.847</span>
          </div>
          <div className="kpi-sub">
            relations + skills · <strong>density 3.0×</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">COVERAGE TENANT</div>
          <div className="kpi-num">
            82,4%<span className="delta up">+6,1%</span>
          </div>
          <div className="kpi-sub">
            mapped employees · <strong>ESCO ↔ ATECO</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">QUERY P95</div>
          <div className="kpi-num">
            187<span className="delta up">−42ms</span>
          </div>
          <div className="kpi-sub">
            graph traversal · <strong>indexed</strong>
          </div>
        </div>
      </div>

      <div className="kg-split">
        <section className="panel">
          <div className="panel-head">
            <h2>
              Knowledge Graph <em>topology</em>
            </h2>
            <span className="meta">
              5 clusters · {nodes.length} nodes · {edges.length} edges
            </span>
          </div>
          <div style={{ padding: 18 }}>
            <svg viewBox="0 0 500 400" style={{ width: '100%', height: 380 }}>
              {edges.map((e) => (
                <line
                  key={e.id}
                  x1={e.source.x}
                  y1={e.source.y}
                  x2={e.target.x}
                  y2={e.target.y}
                  stroke="var(--rule-strong)"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
              ))}
              {nodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="8"
                    fill={n.color}
                    fillOpacity="0.85"
                    stroke="var(--surface-1)"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </svg>
            <div className="kg-legend">
              {clusters.map((c) => (
                <span key={c.id}>
                  <span className="legend-dot" style={{ background: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="panel">
          <div className="panel-head">
            <h2>
              Ontology <em>breakdown</em>
            </h2>
            <span className="meta">5 capability families</span>
          </div>
          {[
            { name: 'Process · Operational', count: 3.821, pct: 27.3, color: 'var(--cap-process)' },
            {
              name: 'Structure · Organizational',
              count: 2.105,
              pct: 15.0,
              color: 'var(--cap-structure)',
            },
            { name: 'Role · Functional', count: 4.632, pct: 33.1, color: 'var(--cap-role)' },
            { name: 'Competency · Skill', count: 2.879, pct: 20.5, color: 'var(--cap-competence)' },
            {
              name: 'Performance · Outcome',
              count: 574,
              pct: 4.1,
              color: 'var(--cap-performance)',
            },
          ].map((o) => (
            <div key={o.name} className="ont-row">
              <div className="glyph-box" style={{ background: o.color, opacity: 0.85 }} />
              <div className="info">
                <div className="name">{o.name}</div>
                <div className="meta">{new Intl.NumberFormat('it-IT').format(o.count)} nodes</div>
              </div>
              <span className="ont-pct">{o.pct.toString().replace('.', ',')}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-head">
        <h2>
          Top entities · <em>by edge density</em>
        </h2>
        <span className="meta">7 highest centrality nodes</span>
      </div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <table className="dense">
          <thead>
            <tr>
              <th>ESCO ID</th>
              <th>Entity</th>
              <th>Type</th>
              <th className="right">In</th>
              <th className="right">Out</th>
              <th>Centrality</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 'esco:S1.2.4.1',
                entity: 'Project management',
                type: 'role',
                i: 187,
                o: 142,
                c: 92,
              },
              {
                id: 'esco:S2.6.1',
                entity: 'SQL · Python',
                type: 'competency',
                i: 156,
                o: 98,
                c: 84,
              },
              {
                id: 'esco:S1.4.1.2',
                entity: 'Risk management',
                type: 'process',
                i: 142,
                o: 118,
                c: 78,
              },
              {
                id: 'esco:S2.1.3',
                entity: 'Communication B2',
                type: 'competency',
                i: 132,
                o: 87,
                c: 72,
              },
              {
                id: 'esco:S1.3.2',
                entity: 'Financial analysis',
                type: 'role',
                i: 118,
                o: 92,
                c: 68,
              },
              {
                id: 'esco:S1.5.1',
                entity: 'Customer relationship',
                type: 'process',
                i: 105,
                o: 78,
                c: 62,
              },
              {
                id: 'esco:S2.4.1',
                entity: 'Data analysis',
                type: 'competency',
                i: 98,
                o: 73,
                c: 58,
              },
            ].map((r) => (
              <tr key={r.id}>
                <td className="mono muted">{r.id}</td>
                <td style={{ fontWeight: 600 }}>{r.entity}</td>
                <td>
                  <span
                    className={`pill pill-${r.type === 'role' ? 'info' : r.type === 'competency' ? 'ok' : 'warn'}`}
                  >
                    {r.type.toUpperCase()}
                  </span>
                </td>
                <td className="right mono">{r.i}</td>
                <td className="right mono">{r.o}</td>
                <td>
                  <div className="bar-track">
                    <div className="bar-fill fill-info" style={{ width: `${r.c}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-head">
        <h2>
          ESCO <em>sync</em> stats
        </h2>
        <span className="meta">3 tracking metrics · last 24h</span>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="lbl">LAST SYNC</div>
          <div className="val">
            1h<span className="unit">12m ago</span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--ink-muted)',
            }}
          >
            312 skill aggiunti · 47 mod
          </div>
        </div>
        <div className="metric-card">
          <div className="lbl">DRIFT DETECTION</div>
          <div className="val">
            0<span className="unit">drift</span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--semantic-success)',
            }}
          >
            in sync ESCO 1.2.0
          </div>
        </div>
        <div className="metric-card">
          <div className="lbl">PROSSIMO SYNC</div>
          <div className="val">
            22h<span className="unit">48m</span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--ink-muted)',
            }}
          >
            cron · daily 03:00 UTC
          </div>
        </div>
      </div>

      <footer className="ws-footer">
        <span>SOURCE · esco_skills · esco_skill_relations · capability_clusters · ESCO 1.2.0</span>
        <span>capability_graph · {role}</span>
      </footer>
    </>
  );
}
