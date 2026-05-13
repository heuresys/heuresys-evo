'use client';

import { useLocale } from '@/lib/i18n';

export type DataNotAvailableVariant = 'inline' | 'block' | 'tile';

export interface DataNotAvailableProps {
  /**
   * Layout variant.
   * - `inline` — single span placeholder for one value (e.g. inside KpiTile slot)
   * - `block` — centered block (for empty widget body, e.g. table area)
   * - `tile` — KpiTile-shaped placeholder keeping grid layout intact
   */
  variant?: DataNotAvailableVariant;
  /**
   * Optional debug context shown as title tooltip (e.g. "no rows in salary_band_assignments for tenant rtl-bank").
   * Not user-facing primary content — used for ops/debug.
   */
  reason?: string;
}

const LABELS = { it: 'Dati Non Disponibili', en: 'Data Not Available' } as const;

/**
 * Constraint P11 enforcement — render this component when a query returns
 * null / 0 / empty array. Never substitute with fake/random/demo values.
 *
 * See: CLAUDE.md §REGOLA NON NEGOZIABILE · .claude/CLAUDE.md CARD-4 · R18
 */
export function DataNotAvailable({ variant = 'inline', reason }: DataNotAvailableProps) {
  const { locale } = useLocale();
  const label = LABELS[locale] ?? LABELS.it;

  if (variant === 'tile') {
    return (
      <div
        className="data-not-available data-not-available--tile"
        role="status"
        aria-label={label}
        title={reason ?? undefined}
        data-testid="data-not-available"
      >
        <span className="data-not-available__icon" aria-hidden="true">
          ∅
        </span>
        <span className="data-not-available__label">{label}</span>
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div
        className="data-not-available data-not-available--block"
        role="status"
        aria-label={label}
        title={reason ?? undefined}
        data-testid="data-not-available"
      >
        <span className="data-not-available__icon" aria-hidden="true">
          ∅
        </span>
        <span className="data-not-available__label">{label}</span>
      </div>
    );
  }

  return (
    <span
      className="data-not-available data-not-available--inline"
      role="status"
      aria-label={label}
      title={reason ?? undefined}
      data-testid="data-not-available"
    >
      {label}
    </span>
  );
}
