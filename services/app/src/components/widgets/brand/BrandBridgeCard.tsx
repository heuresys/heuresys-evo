import * as React from 'react';

export interface BridgeItem {
  id: string;
  role: string;
  readinessLabel: string;
  readinessValue?: number;
  readinessUnit?: string;
  gaps: string[];
}

export interface BrandBridgeCardProps {
  items: BridgeItem[];
}

/**
 * BrandBridgeCard — career bridge grid mockup-fedele.
 * Layout: .bridge-grid (3-col) > .bridge-card (.role + .readiness · .readiness-lbl + value + .gap-list > .gap-item*) per item.
 * Pattern usato in EmployeeJourney per visualizzare 3 next-role bridge con skill gaps.
 */
export function BrandBridgeCard({ items }: BrandBridgeCardProps) {
  return (
    <div className="bridge-grid">
      {items.map((it) => (
        <div key={it.id} className="bridge-card">
          <div className="role">{it.role}</div>
          <div className="readiness">
            <span className="readiness-lbl">{it.readinessLabel}</span>
            {typeof it.readinessValue === 'number' ? (
              <strong style={{ color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {it.readinessValue}
                {it.readinessUnit ?? '%'}
              </strong>
            ) : null}
          </div>
          <div className="gap-list">
            {it.gaps.map((g, i) => (
              <div key={i} className="gap-item">
                {g}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
