import * as React from 'react';

export interface RadarAxis {
  id: string;
  label: string;
}

export interface RadarSeries {
  id: string;
  label: string;
  values: number[];
  color?: string;
}

export interface BrandCapabilityRadarProps {
  axes: RadarAxis[];
  series: RadarSeries[];
  max?: number;
  rings?: number;
  showLegend?: boolean;
  size?: number;
}

/**
 * BrandCapabilityRadar — SVG radar chart mockup-fedele.
 * 2 series (current + target) + axis labels mono uppercase + grid rings + legend.
 */
export function BrandCapabilityRadar({
  axes,
  series,
  max = 100,
  rings = 4,
  showLegend = true,
  size = 240,
}: BrandCapabilityRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.78;
  const n = axes.length;

  const angleFor = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2;

  const polarToCartesian = (radius: number, angle: number) => ({
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  });

  const ringPaths = React.useMemo(() => {
    const ps: string[] = [];
    for (let k = 1; k <= rings; k++) {
      const radiusK = (r * k) / rings;
      const points = axes.map((_, i) => polarToCartesian(radiusK, angleFor(i)));
      const d = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
      ps.push(d);
    }
    return ps;
  }, [r, rings, axes, n]); // eslint-disable-line react-hooks/exhaustive-deps

  const seriesPaths = series.slice(0, 2).map((s, idx) => {
    const points = s.values.slice(0, n).map((v, i) => {
      const radiusV = (Math.min(v, max) / max) * r;
      return polarToCartesian(radiusV, angleFor(i));
    });
    const d = points.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
    return {
      key: s.id,
      d,
      label: s.label,
      color: s.color ?? (idx === 0 ? 'var(--accent)' : 'var(--brand-blue)'),
      isFirst: idx === 0,
    };
  });

  const axisLines = axes.map((a, i) => {
    const tip = polarToCartesian(r, angleFor(i));
    const labelPoint = polarToCartesian(r * 1.12, angleFor(i));
    return { id: a.id, label: a.label, tip, labelPoint };
  });

  return (
    <section className="capability-radar">
      <div className="widget-head" style={{ borderBottom: 0, padding: 0, marginBottom: 4 }}>
        <h2>
          Capability <em>radar</em>
        </h2>
        <div className="filters">
          <span className="filter-pill active">{axes.length} axes</span>
        </div>
      </div>
      <svg
        className="radar-svg"
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Capability radar"
        role="img"
      >
        {/* Grid rings */}
        <g className="radar-grid">
          {ringPaths.map((d, i) => (
            <path key={i} d={d} className="radar-grid" />
          ))}
        </g>
        {/* Axis lines */}
        <g className="radar-axis">
          {axisLines.map((ax) => (
            <g key={ax.id}>
              <line x1={cx} y1={cy} x2={ax.tip.x} y2={ax.tip.y} stroke="var(--rule)" />
              <text
                x={ax.labelPoint.x}
                y={ax.labelPoint.y}
                textAnchor={
                  ax.labelPoint.x < cx - 5 ? 'end' : ax.labelPoint.x > cx + 5 ? 'start' : 'middle'
                }
                dominantBaseline="middle"
              >
                {ax.label}
              </text>
            </g>
          ))}
        </g>
        {/* Series */}
        {seriesPaths.map((s) => (
          <path
            key={s.key}
            d={s.d}
            className={s.isFirst ? 'radar-current' : 'radar-target'}
            style={{
              fill: s.isFirst ? s.color : 'none',
              fillOpacity: s.isFirst ? 0.18 : 0,
              stroke: s.color,
              strokeWidth: s.isFirst ? 2 : 1.5,
              strokeDasharray: s.isFirst ? undefined : '4 3',
            }}
          />
        ))}
      </svg>
      {showLegend && series.length > 0 ? (
        <div className="radar-legend">
          {series.slice(0, 2).map((s, i) => (
            <span key={s.id}>
              <span
                className="legend-swatch"
                style={{
                  background: s.color ?? (i === 0 ? 'var(--accent)' : 'var(--brand-blue)'),
                }}
              />
              {s.label}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
