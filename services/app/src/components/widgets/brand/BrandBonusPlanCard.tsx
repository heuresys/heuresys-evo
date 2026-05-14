'use client';

/**
 * BrandBonusPlanCard — Bonus plans list (annual / spot / quarterly / retention) (cycle 2 Phase 3).
 *
 * Source: services/app/src/lib/data/compensation-queries.ts fetchBonusPlans.
 * Hidden per self/reports scope (least privilege). P11 compliant.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';
import { useLocale } from '@/lib/i18n';
import { pickWidgetString } from '@/lib/i18n/widget-strings';

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

function fmtCurrency(value: number | null, currency: string, locale: string): string {
  if (value === null) return '—';
  return new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-US', {
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

export function BrandBonusPlanCard({ plans, title, currency = 'EUR' }: BrandBonusPlanCardProps) {
  const { locale } = useLocale();
  const resolvedTitle = title ?? pickWidgetString(locale, 'title_bonus_plans');
  if (plans === null) {
    return (
      <div className="bonus-plans">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bonus-plans">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <p className="bonus-empty">{pickWidgetString(locale, 'no_active_bonus_plans')}</p>
      </div>
    );
  }

  const totalBudget = plans.reduce((acc, p) => acc + (p.totalBudget ?? 0), 0);

  return (
    <div className="bonus-plans">
      <div className="widget-head">
        <h3>{resolvedTitle}</h3>
        <div className="bonus-summary">
          <span className="bonus-total">
            {pickWidgetString(locale, 'total_budget')} {fmtCurrency(totalBudget, currency, locale)}
          </span>
          <span className="count-chip">
            {plans.length} {pickWidgetString(locale, 'count_plans')}
          </span>
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
              <span className="bonus-budget">
                {fmtCurrency(plan.totalBudget, currency, locale)}
              </span>
              {typeof plan.coverageEmployees === 'number' ? (
                <span className="bonus-coverage">
                  {plan.coverageEmployees} {pickWidgetString(locale, 'count_employees')}
                </span>
              ) : null}
              {plan.status ? <span className="bonus-status">{plan.status}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
