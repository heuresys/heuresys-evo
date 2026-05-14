'use client';

/**
 * BrandCalibrationCard — Manager × dept variance overview (cycle 2 Phase 3).
 *
 * Identifica outlier nei rating per dept/manager. Source: reviews-queries.ts.
 * P11: rows === null → DataNotAvailable.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';

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
  title = 'Calibration board',
  varianceWarnThreshold = 0.5,
}: BrandCalibrationCardProps) {
  if (rows === null) {
    return (
      <div className="cal-card">
        <div className="widget-head">
          <h3>{title}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="cal-card">
        <div className="widget-head">
          <h3>{title}</h3>
        </div>
        <p className="cal-empty">Nessun manager con review da calibrare.</p>
      </div>
    );
  }

  return (
    <div className="cal-card">
      <div className="widget-head">
        <h3>{title}</h3>
        <span className="count-chip">{rows.length} managers</span>
      </div>
      <table className="cal-table">
        <thead>
          <tr>
            <th scope="col">Manager</th>
            <th scope="col">Dept</th>
            <th scope="col">Reviews</th>
            <th scope="col">Avg</th>
            <th scope="col">Variance</th>
            <th scope="col">Outliers</th>
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
