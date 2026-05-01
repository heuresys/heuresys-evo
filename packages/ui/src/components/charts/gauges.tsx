import * as React from 'react';
import { cn } from '../../lib/cn';

/**
 * Radial gauge animated (semi-circle or full circle). SVG-only, no deps.
 * (TIER 4 gauges)
 */
export interface RadialGaugeProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  unit?: string;
  size?: number;
  thickness?: number;
  variant?: 'semi' | 'full';
  tone?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const TONE_VAR = {
  primary: 'oklch(0.55 0.18 264)',
  success: 'oklch(0.65 0.16 145)',
  warning: 'oklch(0.78 0.16 80)',
  destructive: 'oklch(0.6 0.22 22)',
};

export function RadialGauge({
  value,
  max = 100,
  min = 0,
  label,
  unit,
  size = 160,
  thickness = 14,
  variant = 'semi',
  tone = 'primary',
  className,
}: RadialGaugeProps) {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = variant === 'semi' ? size / 2 + r / 4 : size / 2;
  const startAngle = variant === 'semi' ? 180 : 90;
  const endAngle = variant === 'semi' ? 0 : 90 - 360;
  const sweepAngle = (endAngle - startAngle) * ratio;
  const trackAngle = endAngle - startAngle;

  const arcPath = (start: number, sweep: number) => {
    const startRad = (start * Math.PI) / 180;
    const endRad = ((start + sweep) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy - r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy - r * Math.sin(endRad);
    const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
    const sweepFlag = sweep > 0 ? 0 : 1;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${x2} ${y2}`;
  };

  return (
    <div
      role="img"
      aria-label={`${label ?? 'Gauge'}: ${value}${unit ? ` ${unit}` : ''}`}
      className={cn('inline-flex flex-col items-center', className)}
    >
      <svg width={size} height={variant === 'semi' ? size * 0.7 : size}>
        <path
          d={arcPath(startAngle, trackAngle)}
          stroke="oklch(0.92 0.008 252)"
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={arcPath(startAngle, sweepAngle)}
          stroke={TONE_VAR[tone]}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
        />
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: size / 6, fontWeight: 600 }}
        >
          {value}
          {unit ? <tspan style={{ fontSize: size / 12, opacity: 0.6 }}> {unit}</tspan> : null}
        </text>
        {label ? (
          <text
            x={cx}
            y={cy + 30}
            textAnchor="middle"
            className="fill-muted-fg"
            style={{ fontSize: size / 14 }}
          >
            {label}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

/**
 * ActivityRing — Apple Watch-style multi-ring progress indicator.
 */
export interface ActivityRingProps {
  rings: { value: number; max: number; color: string; label?: string }[];
  size?: number;
  thickness?: number;
  className?: string;
}

export function ActivityRing({ rings, size = 140, thickness = 12, className }: ActivityRingProps) {
  return (
    <svg
      role="img"
      aria-label={rings
        .map((r) => `${r.label ?? 'Ring'}: ${Math.round((r.value / r.max) * 100)}%`)
        .join(', ')}
      width={size}
      height={size}
      className={cn('inline-block', className)}
    >
      {rings.map((ring, idx) => {
        const r = (size - thickness) / 2 - idx * (thickness + 2);
        const c = 2 * Math.PI * r;
        const ratio = Math.max(0, Math.min(1, ring.value / ring.max));
        return (
          <g key={idx} transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={ring.color}
              strokeOpacity={0.18}
              strokeWidth={thickness}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={ring.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${c * ratio} ${c}`}
              style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * LinearGauge — horizontal progress with label + value.
 */
export interface LinearGaugeProps {
  value: number;
  max?: number;
  label?: string;
  segments?: number;
  tone?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function LinearGauge({
  value,
  max = 100,
  label,
  segments,
  tone = 'primary',
  className,
}: LinearGaugeProps) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn('flex flex-col gap-1', className)}
    >
      {label ? (
        <div className="flex justify-between text-xs">
          <span>{label}</span>
          <span className="font-medium">
            {value} / {max}
          </span>
        </div>
      ) : null}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${ratio * 100}%`, background: TONE_VAR[tone] }}
        />
        {segments
          ? Array.from({ length: segments - 1 }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute top-0 h-full w-px bg-background"
                style={{ left: `${((i + 1) / segments) * 100}%` }}
              />
            ))
          : null}
      </div>
    </div>
  );
}
