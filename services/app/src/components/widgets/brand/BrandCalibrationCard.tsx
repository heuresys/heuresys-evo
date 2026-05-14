'use client';

/**
 * BrandCalibrationCard — Manager × dept variance overview (cycle 2 Phase 3).
 *
 * Identifica outlier nei rating per dept/manager. Source: reviews-queries.ts.
 * P11: rows === null → DataNotAvailable.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';
import { useLocale } from '@/lib/i18n';
import { pickWidgetString } from '@/lib/i18n/widget-strings';

export interface CalibrationRow {
  managerId: string;
  managerName: string;
  deptName?: string | null;
  reviewCount: number;
  avgRating: number | null;
  variance: number | null;
  outlierCount: number;
}

export interface BrandCalibrationCardProps {
  rows: CalibrationRow[] | null;
  title?: string;
  /** Soglia variance per flag warning (default 0.5). */
  varianceWarnThreshold?: number;
}

function tone(variance: number | null, threshold: number): string {
  if (variance === null) return 'cal-tone-muted';
  if (variance >= threshold * 1.5) return 'cal-tone-crit';
  if (variance >= threshold) return 'cal-tone-warn';
  return 'cal-tone-ok';
}

export function BrandCalibrationCard({
  rows,
  title,
  varianceWarnThreshold = 0.5,
}: BrandCalibrationCardProps) {
  const { locale } = useLocale();
  const resolvedTitle = title ?? pickWidgetString(locale, 'title_calibration_board');
  if (rows === null) {
    return (
      <div className="cal-card">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="cal-card">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <p className="cal-empty">{pickWidgetString(locale, 'no_managers_to_calibrate')}</p>
      </div>
    );
  }

  return (
    <div className="cal-card">
      <div className="widget-head">
        <h3>{resolvedTitle}</h3>
        <span className="count-chip">
          {rows.length} {pickWidgetString(locale, 'count_managers')}
        </span>
      </div>
      <table className="cal-table">
        <thead>
          <tr>
            <th scope="col">{pickWidgetString(locale, 'manager_label')}</th>
            <th scope="col">{pickWidgetString(locale, 'dept_label')}</th>
            <th scope="col">{pickWidgetString(locale, 'count_reviews')}</th>
            <th scope="col">{pickWidgetString(locale, 'avg_label')}</th>
            <th scope="col">{pickWidgetString(locale, 'variance_label')}</th>
            <th scope="col">{pickWidgetString(locale, 'outliers_label')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.managerId} className={tone(r.variance, varianceWarnThreshold)}>
              <th scope="row">{r.managerName}</th>
              <td>{r.deptName ?? '—'}</td>
              <td className="num">{r.reviewCount}</td>
              <td className="num">{r.avgRating !== null ? r.avgRating.toFixed(1) : '—'}</td>
              <td className="num">{r.variance !== null ? r.variance.toFixed(2) : '—'}</td>
              <td className="num">{r.outlierCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
