import * as React from 'react';

export interface BrandMetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  /** Optional sparkline samples (0-100). Renders inline SVG `polyline` if provided. */
  sparkline?: number[];
  /** Sparkline stroke. Defaults to `var(--accent)`. */
  sparklineColor?: string;
}

/**
 * BrandMetricCard — metric card mockup-fedele.
 * Layout: `.metric-card` chrome (.lbl uppercase mono + .val tabular num + optional .sparkline SVG).
 * Coverage: org-systems system metrics grid (DB · CPU · memory · queue).
 */
export function BrandMetricCard({
  label,
  value,
  unit,
  sparkline,
  sparklineColor = 'var(--accent)',
}: BrandMetricCardProps) {
  return (
    <div className="metric-card">
      <div className="lbl">{label}</div>
      <div className="val">
        {value}
        {unit ? <span className="unit">{unit}</span> : null}
      </div>
      {sparkline && sparkline.length >= 2 ? (
        <svg
          className="sparkline"
          viewBox={`0 0 ${(sparkline.length - 1) * 10} 30`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth="1.5"
            points={sparkline
              .map((v, i) => `${i * 10},${30 - Math.max(0, Math.min(100, v)) * 0.28}`)
              .join(' ')}
          />
        </svg>
      ) : null}
    </div>
  );
}
