'use client';

import * as React from 'react';
import { resolveWidget } from './registry';
import type { DashboardElementShape } from './resolver';

export interface DashboardGridProps {
  elements: Array<DashboardElementShape & { id: string | number; data?: unknown }>;
  className?: string;
}

const UnknownWidget: React.FC<{ code: string }> = ({ code }) => (
  <div className="flex h-full min-h-[120px] w-full items-center justify-center rounded-md border border-dashed border-destructive/40 bg-destructive/5 text-xs text-destructive">
    Unknown widget: <code className="ml-1">{code}</code>
  </div>
);

/**
 * Phase 13.C / 14.A — Dashboard renderer (CSS Grid 12-col, V1 static layout).
 * Receives resolved elements from the server component and renders each via
 * the widget registry. Each element optionally carries `data` (prefetched
 * server-side via data-fetcher). Widget components that consume data are
 * marked Live in the registry; Demo entries ignore `data` and render
 * hardcoded fixtures (backward compat — gradual migration per widget code).
 */
export function DashboardGrid({ elements, className }: DashboardGridProps) {
  if (elements.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-fg">
        No widgets to display. Adjust your role or perspective filter.
      </div>
    );
  }
  return (
    <div
      className={['grid grid-cols-12 gap-4 auto-rows-[minmax(140px,auto)]', className ?? ''].join(
        ' '
      )}
    >
      {elements.map((el) => {
        const Widget = resolveWidget(el.widget_code);
        const colStart = clamp(el.grid_col_start, 1, 12);
        const colSpan = clamp(el.grid_col_span, 1, 12 - (colStart - 1));
        const rowStart = clamp(el.grid_row_start, 1, 99);
        const rowSpan = clamp(el.grid_row_span, 1, 12);
        return (
          <div
            key={String(el.id)}
            data-widget-code={el.widget_code}
            data-position={el.position}
            className="rounded-lg border border-border bg-background p-4"
            style={{
              gridColumn: `${colStart} / span ${colSpan}`,
              gridRow: `${rowStart} / span ${rowSpan}`,
            }}
          >
            {Widget ? <Widget data={el.data} /> : <UnknownWidget code={el.widget_code} />}
          </div>
        );
      })}
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}
