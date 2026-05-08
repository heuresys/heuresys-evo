import * as React from 'react';

export interface CompItem {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
}

export interface BrandCompCardProps {
  items: CompItem[];
}

/**
 * BrandCompCard — compensation breakdown grid mockup-fedele.
 * Layout: .comp-grid (2-col) > .comp-card (.lbl + .val + .unit) per item.
 * Pattern usato in TenantOwnerOverview per breakdown salary/bonus/equity/total.
 */
export function BrandCompCard({ items }: BrandCompCardProps) {
  return (
    <div className="comp-grid">
      {items.map((it) => (
        <div key={it.id} className="comp-card">
          <div className="lbl">{it.label}</div>
          <div className="val">
            {it.value}
            {it.unit ? <span className="unit">{it.unit}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
