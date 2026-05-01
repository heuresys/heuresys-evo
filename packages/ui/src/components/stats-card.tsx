'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/cn';

export interface StatsCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number; // percentage change
  trendDirection?: 'up' | 'down' | 'flat';
  description?: string;
  sparkline?: number[];
  icon?: React.ReactNode;
  animate?: boolean;
  className?: string;
}

/**
 * StatsCard — KPI card with animated count-up + sparkline + trend badge.
 * (TIER 3)
 */
export function StatsCard({
  label,
  value,
  unit,
  trend,
  trendDirection,
  description,
  sparkline,
  icon,
  animate = true,
  className,
}: StatsCardProps) {
  const numericValue = typeof value === 'number' ? value : null;
  const [display, setDisplay] = React.useState(animate && numericValue !== null ? 0 : value);

  React.useEffect(() => {
    if (!animate || numericValue === null) return;
    let raf = 0;
    const start = performance.now();
    const duration = 800;
    const from = 0;
    const to = numericValue;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round((from + (to - from) * eased) * 100) / 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, numericValue]);

  const dir =
    trendDirection ?? (trend == null ? 'flat' : trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat');
  const TrendIcon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
  const trendColor =
    dir === 'up' ? 'text-success' : dir === 'down' ? 'text-destructive' : 'text-muted-fg';

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border bg-background p-4',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-fg">{label}</span>
        {icon ? <span className="text-muted-fg">{icon}</span> : null}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums">{display}</span>
        {unit ? <span className="text-sm text-muted-fg">{unit}</span> : null}
      </div>
      <div className="flex items-center gap-2 text-xs">
        {trend != null ? (
          <span className={cn('inline-flex items-center gap-0.5 font-medium', trendColor)}>
            <TrendIcon className="h-3 w-3" aria-hidden="true" />
            {Math.abs(trend).toFixed(1)}%
          </span>
        ) : null}
        {description ? <span className="text-muted-fg">{description}</span> : null}
      </div>
      {sparkline && sparkline.length > 1 ? <Sparkline data={sparkline} /> : null}
    </div>
  );
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const w = 120;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn('h-8 w-full text-primary', className)}
      role="img"
      aria-label={`Sparkline trend`}
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}
