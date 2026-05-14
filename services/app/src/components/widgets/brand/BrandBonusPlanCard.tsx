'use client';

/**
 * BrandBonusPlanCard — Bonus plans list (annual / spot / quarterly / retention) (cycle 2 Phase 3).
 *
 * Source: services/app/src/lib/data/compensation-queries.ts fetchBonusPlans.
 * Hidden per self/reports scope (least privilege). P11 compliant.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';

export interface BonusPlanRow {
  id: string;
  name: string;
  bonusType: string | null;
  totalBudget: number | null;
  status: string | null;
  coverageEmployees?: number | null;
  paidAmount?: number | null;
}

export interface BrandBonusPlanCardProps {
  plans: BonusPlanRow[] | null;
  title?: string;
  currency?: string;
}

function fmtCurrency(value: number | null, currency: string): string {
  if (value === null) return '—';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

const TYPE_LABEL: Record<string, string> = {
  annual: 'Annual',
  spot: 'Spot',
  quarterly: 'Quarterly',
  retention: 'Retention',
  signing: 'Signing',
};

export function BrandBonusPlanCard({
  plans,
  title = 'Bonus plans',
  currency = 'EUR',
}: BrandBonusPlanCardProps) {
  if (plans === null) {
    return (
      <div className="bonus-plans">
        <div className="widget-head">
          <h3>{title}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bonus-plans">
        <div className="widget-head">
          <h3>{title}</h3>
        </div>
        <p className="bonus-empty">Nessun bonus plan attivo.</p>
      </div>
    );
  }

  const totalBudget = plans.reduce((acc, p) => acc + (p.totalBudget ?? 0), 0);

  return (
    <div className="bonus-plans">
      <div className="widget-head">
        <h3>{title}</h3>
        <div className="bonus-summary">
          <span className="bonus-total">Total budget {fmtCurrency(totalBudget, currency)}</span>
          <span className="count-chip">{plans.length} plans</span>
        </div>
      </div>
      <ul className="bonus-list">
        {plans.map((plan) => (
          <li key={plan.id} className="bonus-item" data-status={plan.status ?? undefined}>
            <div className="bonus-name">
              <strong>{plan.name}</strong>
              {plan.bonusType ? (
                <span className="bonus-type-chip">
                  {TYPE_LABEL[plan.bonusType] ?? plan.bonusType}
                </span>
              ) : null}
            </div>
            <div className="bonus-meta">
              <span className="bonus-budget">{fmtCurrency(plan.totalBudget, currency)}</span>
              {typeof plan.coverageEmployees === 'number' ? (
                <span className="bonus-coverage">{plan.coverageEmployees} employees</span>
              ) : null}
              {plan.status ? <span className="bonus-status">{plan.status}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
