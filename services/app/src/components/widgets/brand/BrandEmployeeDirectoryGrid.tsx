'use client';

/**
 * BrandEmployeeDirectoryGrid — Grid view degli employees (cycle 2 Phase 3).
 *
 * Card grid Employee con avatar + role badge + dept + manager + skill chips.
 * Source data: services/app/src/lib/data/employees-queries.ts fetchEmployeesList.
 * P11: data === null → renderizza DataNotAvailable variant block.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';
import { useLocale } from '@/lib/i18n';
import { pickWidgetString } from '@/lib/i18n/widget-strings';

export interface EmployeeDirectoryItem {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string | null;
  email: string;
  orgUnitName?: string | null;
  managerName?: string | null;
  flightRisk?: 'low' | 'medium' | 'high' | null;
  performanceRating?: number | null;
  skillTop3?: string[];
}

export interface BrandEmployeeDirectoryGridProps {
  items: EmployeeDirectoryItem[] | null;
  title?: string;
  emptyMessage?: string;
}

function initials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function BrandEmployeeDirectoryGrid({
  items,
  title,
  emptyMessage,
}: BrandEmployeeDirectoryGridProps) {
  const { locale } = useLocale();
  const resolvedTitle = title ?? pickWidgetString(locale, 'title_employees');
  const resolvedEmpty = emptyMessage ?? pickWidgetString(locale, 'no_employees_in_scope');
  if (items === null) {
    return (
      <div className="emp-directory">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="emp-directory">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <p className="emp-empty">{resolvedEmpty}</p>
      </div>
    );
  }

  return (
    <div className="emp-directory">
      <div className="widget-head">
        <h3>{resolvedTitle}</h3>
        <span className="count-chip">
          {items.length} {pickWidgetString(locale, 'count_records')}
        </span>
      </div>
      <div className="emp-grid">
        {items.map((emp) => (
          <article key={emp.id} className="emp-card" data-flight-risk={emp.flightRisk ?? undefined}>
            <div className="emp-avatar">{initials(emp.firstName, emp.lastName)}</div>
            <div className="emp-info">
              <div className="emp-name">
                {emp.firstName} {emp.lastName}
              </div>
              {emp.jobTitle ? <div className="emp-title">{emp.jobTitle}</div> : null}
              {emp.orgUnitName ? <div className="emp-dept">{emp.orgUnitName}</div> : null}
              {emp.skillTop3 && emp.skillTop3.length > 0 ? (
                <ul className="emp-skills" aria-label="Top skills">
                  {emp.skillTop3.slice(0, 3).map((s) => (
                    <li key={s} className="emp-skill-chip">
                      {s}
                    </li>
                  ))}
                </ul>
              ) : null}
              {emp.flightRisk ? (
                <span className={`emp-risk emp-risk-${emp.flightRisk}`}>
                  {pickWidgetString(locale, 'flight_risk_label')}: {emp.flightRisk}
                </span>
              ) : null}
            </div>
            {typeof emp.performanceRating === 'number' ? (
              <div className="emp-rating" aria-label={`Rating ${emp.performanceRating}`}>
                {emp.performanceRating.toFixed(1)}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
