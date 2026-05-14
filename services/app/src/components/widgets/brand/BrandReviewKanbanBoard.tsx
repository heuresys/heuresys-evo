'use client';

/**
 * BrandReviewKanbanBoard — Kanban 4 colonne per review cycle (cycle 2 Phase 3).
 *
 * Pending / In progress / Submitted / Approved. Source:
 * services/app/src/lib/data/reviews-queries.ts.
 * P11: items === null → DataNotAvailable.
 */
import * as React from 'react';
import { DataNotAvailable } from '@/components/data/DataNotAvailable';
import { useLocale } from '@/lib/i18n';
import { pickWidgetString } from '@/lib/i18n/widget-strings';

export type ReviewStatus = 'pending' | 'in_progress' | 'submitted' | 'approved';

export interface ReviewCardItem {
  id: string;
  employeeName: string;
  reviewerName?: string | null;
  managerName?: string | null;
  ratingPreview?: number | null;
  dueDate?: Date | null;
  status: ReviewStatus;
}

export interface BrandReviewKanbanBoardProps {
  items: ReviewCardItem[] | null;
  title?: string;
}

const COLUMN_KEYS: Array<{
  key: ReviewStatus;
  labelKey: 'kanban_pending' | 'kanban_in_progress' | 'kanban_submitted' | 'kanban_approved';
  tone: string;
}> = [
  { key: 'pending', labelKey: 'kanban_pending', tone: 'kbn-col-muted' },
  { key: 'in_progress', labelKey: 'kanban_in_progress', tone: 'kbn-col-info' },
  { key: 'submitted', labelKey: 'kanban_submitted', tone: 'kbn-col-warn' },
  { key: 'approved', labelKey: 'kanban_approved', tone: 'kbn-col-ok' },
];

function formatDue(d: Date | null | undefined): string {
  if (!d) return '—';
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
}

export function BrandReviewKanbanBoard({ items, title }: BrandReviewKanbanBoardProps) {
  const { locale } = useLocale();
  const resolvedTitle = title ?? pickWidgetString(locale, 'title_review_cycle');
  if (items === null) {
    return (
      <div className="kbn-board">
        <div className="widget-head">
          <h3>{resolvedTitle}</h3>
        </div>
        <DataNotAvailable variant="block" />
      </div>
    );
  }

  const grouped: Record<ReviewStatus, ReviewCardItem[]> = {
    pending: [],
    in_progress: [],
    submitted: [],
    approved: [],
  };
  for (const item of items) {
    if (item.status in grouped) {
      grouped[item.status].push(item);
    }
  }

  return (
    <div className="kbn-board">
      <div className="widget-head">
        <h3>{resolvedTitle}</h3>
        <span className="count-chip">
          {items.length} {pickWidgetString(locale, 'count_reviews')}
        </span>
      </div>
      <div className="kbn-columns">
        {COLUMN_KEYS.map((col) => (
          <div key={col.key} className={`kbn-col ${col.tone}`}>
            <header className="kbn-col-head">
              <h4>{pickWidgetString(locale, col.labelKey)}</h4>
              <span className="kbn-count">{grouped[col.key].length}</span>
            </header>
            <ul className="kbn-cards">
              {grouped[col.key].map((card) => (
                <li key={card.id} className="kbn-card">
                  <div className="kbn-card-name">{card.employeeName}</div>
                  {card.managerName ? (
                    <div className="kbn-card-mgr">→ {card.managerName}</div>
                  ) : null}
                  <div className="kbn-card-meta">
                    {typeof card.ratingPreview === 'number' ? (
                      <span className="kbn-card-rating">{card.ratingPreview.toFixed(1)}</span>
                    ) : null}
                    <span className="kbn-card-due">{formatDue(card.dueDate ?? null)}</span>
                  </div>
                </li>
              ))}
              {grouped[col.key].length === 0 ? (
                <li className="kbn-empty">{pickWidgetString(locale, 'no_reviews_in_column')}</li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
