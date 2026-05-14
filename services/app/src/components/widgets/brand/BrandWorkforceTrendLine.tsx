'use client';

/**
 * BrandWorkforceTrendLine — Line chart trend headcount + hires + leavers (cycle 2 Phase 3).
 *
 * Source: services/app/src/lib/data/workforce-analytics-queries.ts fetchHeadcountTrend.
 * Implementazione minimal SVG inline per evitare dipendenza ECharts a runtime cost.
 * In Phase 3.2 può evolvere a ECharts/Recharts.
 * P11: points === null → DataNotAvailable.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';
import { useLocale } from '@/lib/i18n';
import { pickWidgetString } from '@/lib/i18n/widget-strings';

export interface WorkforceTrendPoint {
  month: string;
  headcount: number;
  hires: number;
  leavers: number;
}

export interface BrandWorkforceTrendLineProps {
  points: WorkforceTrendPoint[] | null;
  title?: string;
}

function buildPath(points: number[], width: number, height: number, padding: number): string {
  if (points.length === 0) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = (width - 2 * padding) / Math.max(points.length - 1, 1);
  return points
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((v - min) / range) * (height - 2 * padding);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export function BrandWorkforceTrendLine({ points, title }: BrandWorkforceTrendLineProps) {
  const { locale } = useLocale();
  const resolvedTitle = title ?? pickWidgetString(locale, 'title_headcount_trend');
  if (points === null) {
    return (
      <div className="wf-trend">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="wf-trend">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <p className="wf-empty">{pickWidgetString(locale, 'no_trend_data')}</p>
      </div>
    );
  }

  const W = 640;
  const H = 220;
  const PAD = 32;
  const headcountPath = buildPath(
    points.map((p) => p.headcount),
    W,
    H,
    PAD
  );

  const lastPoint = points[points.length - 1]!;
  const firstPoint = points[0]!;
  const totalHires = points.reduce((acc, p) => acc + p.hires, 0);
  const totalLeavers = points.reduce((acc, p) => acc + p.leavers, 0);
  const net = lastPoint.headcount - firstPoint.headcount;

  return (
    <div className="wf-trend">
      <div className="widget-head">
        <h3>{resolvedTitle}</h3>
        <div className="wf-trend-stats">
          <span className="wf-stat">
            {pickWidgetString(locale, 'headcount_label')} <strong>{lastPoint.headcount}</strong>
          </span>
          <span className={`wf-stat ${net >= 0 ? 'wf-positive' : 'wf-negative'}`}>
            {pickWidgetString(locale, 'net_label')} {net >= 0 ? '+' : ''}
            {net}
          </span>
          <span className="wf-stat">
            {pickWidgetString(locale, 'hires_label')} <strong>{totalHires}</strong> ·{' '}
            {pickWidgetString(locale, 'leavers_label')} <strong>{totalLeavers}</strong>
          </span>
        </div>
      </div>
      <svg className="wf-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={resolvedTitle}>
        <path className="wf-line wf-line-headcount" d={headcountPath} fill="none" />
        {points.map((p, i) => {
          const x = PAD + i * ((W - 2 * PAD) / Math.max(points.length - 1, 1));
          return (
            <g key={p.month}>
              <text
                x={x}
                y={H - 8}
                textAnchor="middle"
                className="wf-axis-label"
                fontSize="10"
                fill="currentColor"
                opacity="0.6"
              >
                {p.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
