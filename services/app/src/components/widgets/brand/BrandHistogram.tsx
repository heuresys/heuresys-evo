import * as React from 'react';

export type HistogramTone = 'critical' | 'warn' | 'ok' | 'info';

export interface HistogramItem {
  id: string;
  label: string;
  value: number;
  tone?: HistogramTone;
}

export interface BrandHistogramProps {
  items: HistogramItem[];
  max?: number;
}

/**
 * BrandHistogram — bar chart orizzontale mockup-fedele.
 * Layout: .histogram (column) > .histo-bar (label · track > fill · count) per row.
 * Width = value / max * 100%. Tone variants critical/warn/ok/info.
 */
export function BrandHistogram({ items, max }: BrandHistogramProps) {
  const computedMax = max ?? (items.reduce((m, it) => Math.max(m, it.value), 0) || 1);
  return (
    <div className="histogram">
      {items.map((it) => {
        const pct = Math.max(0, Math.min(100, (it.value / computedMax) * 100));
        const tone = it.tone ?? 'info';
        return (
          <div key={it.id} className="histo-bar">
            <span className="histo-label">{it.label}</span>
            <span className="histo-track">
              <span className={`histo-fill fill-${tone}`} style={{ width: `${pct}%` }} />
            </span>
            <span className="histo-count">{it.value}</span>
          </div>
        );
      })}
    </div>
  );
}
