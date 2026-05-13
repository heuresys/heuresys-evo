import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';

export interface CompItem {
  id: string;
  label: string;
  value: number | string | null;
  unit?: string;
  /** Constraint P11 — when true, renders <DataNotAvailable /> instead of value. */
  unavailable?: boolean;
}

export interface BrandCompCardProps {
  items: CompItem[];
}

/**
 * BrandCompCard — compensation breakdown grid mockup-fedele.
 * Layout: .comp-grid (2-col) > .comp-card (.lbl + .val + .unit) per item.
 * Pattern usato in TenantOwnerOverview per breakdown salary/bonus/equity/total.
 *
 * P11: each item with `unavailable: true` renders DataNotAvailable instead of value.
 */
export function BrandCompCard({ items }: BrandCompCardProps) {
  return (
    <div className="comp-grid">
      {items.map((it) => (
        <div key={it.id} className="comp-card">
          <div className="lbl">{it.label}</div>
          <div className="val">
            {it.unavailable || it.value === null || it.value === undefined ? (
              <DataNotAvailable
                variant="inline"
                reason={`${it.label} source not implemented in schema`}
              />
            ) : (
              <>
                {it.value}
                {it.unit ? <span className="unit">{it.unit}</span> : null}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
