import * as React from 'react';

export interface KgNode {
  id: string;
  label: string;
  group?: string;
}

export interface KgEdge {
  id?: string;
  source: string;
  target: string;
}

export interface KgLegendItem {
  group: string;
  label: string;
  color: string;
}

export interface BrandKgGraphProps {
  nodes: KgNode[];
  edges: KgEdge[];
  legend?: KgLegendItem[];
  ariaLabel?: string;
  height?: number;
}

interface PositionedNode extends KgNode {
  x: number;
  y: number;
  color: string;
}

/**
 * BrandKgGraph — KG topology SVG mockup-fedele (no Cytoscape).
 * Posiziona nodi su un layout a forza pseudo-circolare deterministico
 * (no animazione, server-renderable). Compatto, no dependencies extra.
 */
export function BrandKgGraph({
  nodes,
  edges,
  legend,
  ariaLabel = 'Knowledge graph topology',
  height = 280,
}: BrandKgGraphProps) {
  const colorMap = React.useMemo(() => {
    const m: Record<string, string> = {};
    if (legend) {
      for (const l of legend) m[l.group] = l.color;
    }
    return m;
  }, [legend]);

  const positioned: PositionedNode[] = React.useMemo(() => {
    const n = nodes.length;
    if (n === 0) return [];
    const cx = 250;
    const cy = height / 2;
    const radius = Math.min(180, height / 2 - 30);
    return nodes.map((node, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        ...node,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        color:
          colorMap[node.group ?? ''] ??
          (node.group === 'tech'
            ? 'var(--cap-process)'
            : node.group === 'soft'
              ? 'var(--cap-competence)'
              : node.group === 'domain'
                ? 'var(--accent)'
                : 'var(--brand-blue)'),
      };
    });
  }, [nodes, colorMap, height]);

  const nodeIndex = React.useMemo(() => {
    const m: Record<string, PositionedNode> = {};
    for (const n of positioned) m[n.id] = n;
    return m;
  }, [positioned]);

  return (
    <section className="kg-graph">
      <div className="skill-gap-head" style={{ borderBottom: 0, padding: 0, marginBottom: 4 }}>
        <h2>
          Capability <em>graph</em>
        </h2>
        <div className="filters">
          <span className="filter-pill active">
            {nodes.length}n · {edges.length}e
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 500 ${height}`} aria-label={ariaLabel} role="img">
        {edges.map((e, i) => {
          const a = nodeIndex[e.source];
          const b = nodeIndex[e.target];
          if (!a || !b) return null;
          return (
            <line
              key={e.id ?? `${e.source}-${e.target}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="edge-line"
            />
          );
        })}
        {positioned.map((n) => (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={20}
              fill={n.color}
              fillOpacity={0.85}
              stroke="var(--surface-1)"
              strokeWidth={2}
            />
            <text x={n.x} y={n.y + 36} className="node-label">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      {legend && legend.length > 0 ? (
        <div className="legend">
          {legend.map((l) => (
            <span key={l.group}>
              <span className="legend-dot" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
