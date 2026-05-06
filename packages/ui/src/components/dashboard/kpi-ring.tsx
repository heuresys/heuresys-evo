import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RadialGauge, type RadialGaugeProps } from '../charts/gauges';
import { cn } from '../../lib/cn';

export type KpiRingTone = 'primary' | 'success' | 'warning' | 'destructive';

export interface KpiRingThresholds {
  /** value ≥ goodAt → success */
  goodAt?: number;
  /** value ≥ warnAt → warning (else destructive) */
  warnAt?: number;
}

export interface KpiRingProps {
  value: number;
  max?: number;
  min?: number;
  label: string;
  sublabel?: string;
  unit?: string;
  /** previous-period delta in percent points */
  trend?: number;
  /** threshold-based tone resolution; ignored if `tone` is set explicitly */
  thresholds?: KpiRingThresholds;
  /** override threshold-based resolution */
  tone?: KpiRingTone;
  size?: number;
  thickness?: number;
  variant?: RadialGaugeProps['variant'];
  className?: string;
}

function resolveTone(value: number, thresholds: KpiRingThresholds | undefined): KpiRingTone {
  if (!thresholds) return 'primary';
  const { goodAt, warnAt } = thresholds;
  if (goodAt != null && value >= goodAt) return 'success';
  if (warnAt != null && value >= warnAt) return 'warning';
  if (warnAt != null || goodAt != null) return 'destructive';
  return 'primary';
}

export function KpiRing({
  value,
  max = 100,
  min = 0,
  label,
  sublabel,
  unit,
  trend,
  thresholds,
  tone,
  size = 160,
  thickness = 14,
  variant = 'semi',
  className,
}: KpiRingProps) {
  const resolvedTone = tone ?? resolveTone(value, thresholds);
  const trendDir = trend == null ? null : trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat';
  const TrendIcon =
    trendDir === 'up'
      ? TrendingUp
      : trendDir === 'down'
        ? TrendingDown
        : trendDir === 'flat'
          ? Minus
          : null;
  const trendColor =
    trendDir === 'up' ? 'text-success' : trendDir === 'down' ? 'text-destructive' : 'text-muted-fg';

  return (
    <div
      role="group"
      aria-label={`KPI ${label}: ${value}${unit ? ' ' + unit : ''}`}
      className={cn('flex flex-col items-center gap-1', className)}
    >
      <RadialGauge
        value={value}
        max={max}
        min={min}
        unit={unit}
        size={size}
        thickness={thickness}
        variant={variant}
        tone={resolvedTone}
      />
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-fg">{label}</div>
        {sublabel ? <div className="mt-0.5 text-xs text-muted-fg">{sublabel}</div> : null}
        {trend != null && TrendIcon ? (
          <span
            className={cn(
              'mt-1 inline-flex items-center gap-0.5 text-xs font-medium tabular-nums',
              trendColor
            )}
          >
            <TrendIcon className="h-3 w-3" aria-hidden="true" />
            {Math.abs(trend).toFixed(1)}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
