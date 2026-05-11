import * as React from 'react';

export interface BridgeItem {
  id: string;
  role: string;
  readinessLabel: string;
  readinessValue?: number;
  readinessUnit?: string;
  gaps: string[];
  /** ISO date string. If `< now + 90d` AND readinessLevel != 'ready_now' → URGENT SLA badge. */
  targetDate?: string;
  /** Readiness enum from succession_candidates.readiness_level */
  readinessLevel?:
    | 'ready_now'
    | 'ready_1_year'
    | 'ready_2_years'
    | 'ready_3_years'
    | 'ready_3_plus_years'
    | 'development_needed';
}

export interface BrandBridgeCardProps {
  items: BridgeItem[];
}

/**
 * S39 W6.4 — Derive SLA urgency badge.
 * URGENT iff: targetDate < now + 90d AND readiness !== 'ready_now'.
 * SOON iff: targetDate < now + 180d AND readiness in ('ready_2_years','ready_3_*','development_needed').
 */
function slaBadge(item: BridgeItem): { kind: 'urgent' | 'soon' | null; label: string } {
  if (!item.targetDate) return { kind: null, label: '' };
  const target = new Date(item.targetDate).getTime();
  if (isNaN(target)) return { kind: null, label: '' };
  const daysToTarget = (target - Date.now()) / (1000 * 60 * 60 * 24);
  const isReady = item.readinessLevel === 'ready_now';
  if (daysToTarget < 90 && !isReady) {
    return { kind: 'urgent', label: 'URGENT' };
  }
  if (
    daysToTarget < 180 &&
    item.readinessLevel &&
    ['ready_2_years', 'ready_3_years', 'ready_3_plus_years', 'development_needed'].includes(
      item.readinessLevel
    )
  ) {
    return { kind: 'soon', label: 'SOON' };
  }
  return { kind: null, label: '' };
}

/**
 * BrandBridgeCard — career bridge grid mockup-fedele.
 * Layout: .bridge-grid (3-col) > .bridge-card (.role + .readiness · .readiness-lbl + value + .gap-list > .gap-item*) per item.
 * Pattern usato in EmployeeJourney per visualizzare 3 next-role bridge con skill gaps.
 *
 * S39 W6.4: aggiunge SLA badge URGENT/SOON derivato da targetDate + readinessLevel.
 */
export function BrandBridgeCard({ items }: BrandBridgeCardProps) {
  return (
    <div className="bridge-grid">
      {items.map((it) => {
        const sla = slaBadge(it);
        return (
          <div key={it.id} className="bridge-card">
            <div className="role">
              {it.role}
              {sla.kind ? (
                <span
                  className={`pill pill-${sla.kind === 'urgent' ? 'critical' : 'warn'}`}
                  style={{ marginLeft: 8, fontSize: '0.7em', verticalAlign: 'middle' }}
                  aria-label={`SLA ${sla.label}`}
                  title={`Succession SLA: ${sla.label} (target ${it.targetDate})`}
                >
                  {sla.label}
                </span>
              ) : null}
            </div>
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
        );
      })}
    </div>
  );
}
