import * as React from 'react';
import { cn } from '../../lib/cn';

export interface CapabilityRadarAxis {
  id: string;
  label: string;
}

export interface CapabilityRadarSeries {
  id: string;
  label: string;
  /** Same length as `axes`, values 0-max */
  values: number[];
  /** Override stroke/fill color */
  color?: string;
}

export interface CapabilityRadarProps {
  axes: CapabilityRadarAxis[];
  series: CapabilityRadarSeries[];
  max?: number;
  size?: number;
  rings?: number;
  showLegend?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  'oklch(0.55 0.18 264)', // primary blue
  'oklch(0.58 0.22 305)', // accent purple
  'oklch(0.65 0.16 145)', // success
  'oklch(0.78 0.16 80)', // warning
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function CapabilityRadar({
  axes,
  series,
  max = 100,
  size = 280,
  rings = 4,
  showLegend = true,
  className,
}: CapabilityRadarProps) {
  if (axes.length < 3) {
    return (
      <p className={cn('p-4 text-sm text-muted-fg', className)}>Radar requires at least 3 axes.</p>
    );
  }
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.78;
  const step = 360 / axes.length;

  return (
    <div className={cn('inline-flex flex-col items-center gap-3', className)}>
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`Capability radar with ${axes.length} axes and ${series.length} series`}
      >
        {/* Concentric rings */}
        {Array.from({ length: rings }).map((_, i) => {
          const r = (radius * (i + 1)) / rings;
          const points = axes
            .map((_, a) => polar(cx, cy, r, a * step))
            .map((p) => `${p.x},${p.y}`)
            .join(' ');
          return (
            <polygon
              key={`ring-${i}`}
              points={points}
              fill="none"
              stroke="oklch(0.85 0.01 252)"
              strokeOpacity={i === rings - 1 ? 0.5 : 0.25}
              strokeWidth={1}
            />
          );
        })}
        {/* Axes lines */}
        {axes.map((ax, i) => {
          const p = polar(cx, cy, radius, i * step);
          return (
            <line
              key={`axis-${ax.id}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="oklch(0.85 0.01 252)"
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          );
        })}
        {/* Axis labels */}
        {axes.map((ax, i) => {
          const p = polar(cx, cy, radius + 14, i * step);
          return (
            <text
              key={`label-${ax.id}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-fg"
              style={{ fontSize: 11, fontWeight: 500 }}
            >
              {ax.label}
            </text>
          );
        })}
        {/* Series polygons */}
        {series.map((s, si) => {
          const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length]!;
          const pts = axes.map((_, i) => {
            const ratio = Math.max(0, Math.min(1, (s.values[i] ?? 0) / max));
            return polar(cx, cy, radius * ratio, i * step);
          });
          const points = pts.map((p) => `${p.x},${p.y}`).join(' ');
          return (
            <g key={s.id}>
              <polygon
                points={points}
                fill={color}
                fillOpacity={0.18}
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {pts.map((p, i) => (
                <circle key={`pt-${s.id}-${i}`} cx={p.x} cy={p.y} r={3} fill={color} />
              ))}
            </g>
          );
        })}
      </svg>
      {showLegend && series.length > 0 ? (
        <ul role="list" className="flex flex-wrap items-center gap-3">
          {series.map((s, si) => {
            const color = s.color ?? DEFAULT_COLORS[si % DEFAULT_COLORS.length]!;
            return (
              <li key={s.id} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: color }}
                />
                <span className="text-xs font-medium">{s.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
