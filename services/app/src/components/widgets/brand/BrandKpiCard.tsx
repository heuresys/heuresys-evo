import * as React from 'react';

export interface BrandKpiCardProps {
  /** Numeric KPI value (formatted with locale tabular nums). */
  value: number;
  /** Mono uppercase label (e.g. "FLEET HEADCOUNT"). */
  label?: string;
  /** Sublabel below the number (e.g. "cross-tenant · all 4 tenants"). */
  sublabel?: string;
  /** P6 W#2 (L71): Optional <strong> emphasis appended to sublabel inline.
   * Renders as `{sublabel} · <strong>{subStrong}</strong>`. */
  subStrong?: string;
  /** Optional unit suffix (e.g. "%"). */
  unit?: string;
  /** Trend value (positive/negative). Renders as colored delta. */
  trend?: number;
  /** P6 W#2 (L71): Override default `+X.X%` formatter with custom string
   * (e.g. "+243", "+12,3pt", "+8"). When set, replaces auto-formatted delta text.
   * Direction (up/down/flat) still derives from `trend` numeric sign. */
  trendLabel?: string;
  /** Footer left text (defaults to a derived "vs target" hint). */
  footLeft?: React.ReactNode;
  /** Footer right text (typically the accent value). */
  footRight?: React.ReactNode;
  /** SVG icon node for the head-right slot. */
  icon?: React.ReactNode;
}

/**
 * BrandKpiCard — μ-architect kpi-card chrome (mockup-fedele).
 * Layout: head (label + icon) → number 32px tabular-nums + delta colored →
 * sublabel → foot (border-top, key/value with accent strong).
 */
export function BrandKpiCard({
  value,
  label,
  sublabel,
  subStrong,
  unit,
  trend,
  trendLabel,
  footLeft,
  footRight,
  icon,
}: BrandKpiCardProps) {
  const numberStr = new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: 0,
  }).format(value);

  const deltaCls =
    trend === undefined || trend === null
      ? null
      : trend > 0
        ? 'delta up'
        : trend < 0
          ? 'delta down'
          : 'delta flat';
  const deltaText =
    trend === undefined || trend === null
      ? null
      : (trendLabel ??
        `${trend > 0 ? '+' : ''}${trend.toLocaleString('it-IT', { maximumFractionDigits: 1 })}%`);

  return (
    <article className="kpi-card">
      <div className="kpi-head">
        <span className="kpi-label">{label ?? 'KPI'}</span>
        {icon ? <span className="kpi-icon">{icon}</span> : null}
      </div>
      <div className="kpi-num">
        {numberStr}
        {unit ? <span style={{ fontSize: '20px', fontWeight: 600 }}> {unit}</span> : null}
        {deltaCls && deltaText ? <span className={deltaCls}>{deltaText}</span> : null}
      </div>
      {sublabel || subStrong ? (
        <div className="kpi-sub">
          {sublabel ?? ''}
          {sublabel && subStrong ? ' · ' : null}
          {subStrong ? <strong>{subStrong}</strong> : null}
        </div>
      ) : null}
      {footLeft || footRight ? (
        <div className="kpi-foot">
          <span>{footLeft ?? ''}</span>
          <span>{footRight ?? ''}</span>
        </div>
      ) : null}
    </article>
  );
}
