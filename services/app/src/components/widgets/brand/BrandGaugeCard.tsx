import * as React from 'react';

export type GaugeTone = 'accent' | 'success' | 'warn';

export interface BrandGaugeCardProps {
  label: string;
  value: number;
  unit?: string;
  tone?: GaugeTone;
  max?: number;
}

const FILL_TONE: Record<GaugeTone, string> = {
  accent: 'info',
  success: 'ok',
  warn: 'warn',
};

/**
 * BrandGaugeCard — capability gauge mockup-fedele.
 * Layout: .gauge-card chrome + .lbl + .gauge-val.gauge-${tone} + .gauge-bar > .bar-fill.fill-${mapped}.
 * Tone canonical: accent (text) → info (bar fill); success → ok; warn → warn.
 */
export function BrandGaugeCard({
  label,
  value,
  unit = '%',
  tone = 'accent',
  max = 100,
}: BrandGaugeCardProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="gauge-card">
      <div className="lbl">{label}</div>
      <div className={`gauge-val gauge-${tone}`}>
        {value}
        <span className="unit">{unit}</span>
      </div>
      <div className="gauge-bar">
        <div className={`bar-fill fill-${FILL_TONE[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
