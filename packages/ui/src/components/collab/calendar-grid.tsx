'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

export interface CalendarEvent {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  title: string;
  tone?: 'primary' | 'success' | 'warning' | 'destructive';
}

/**
 * CalendarGrid — month view calendar with event dots + click-to-select.
 * Pure SVG/HTML, no DnD here (heavy DnD belongs to a separate Calendar prod
 * component for booking flows). (TIER 5)
 */
export function CalendarGrid({
  month,
  year,
  events = [],
  selected,
  onSelectDate,
  className,
}: {
  month: number; // 0-11
  year: number;
  events?: CalendarEvent[];
  selected?: string;
  onSelectDate?: (iso: string) => void;
  className?: string;
}) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: ({ iso: string; day: number } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ iso, day: d });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsByIso = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div
      className={cn('rounded-md border border-border bg-background p-3', className)}
      role="grid"
      aria-label={`Calendar ${year}-${month + 1}`}
    >
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-fg">
        {dayLabels.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />;
          const evs = eventsByIso.get(cell.iso) ?? [];
          const isSelected = cell.iso === selected;
          return (
            <button
              type="button"
              key={cell.iso}
              role="gridcell"
              aria-selected={isSelected}
              onClick={() => onSelectDate?.(cell.iso)}
              className={cn(
                'flex aspect-square flex-col items-center justify-center gap-1 rounded-md p-1 text-sm transition-colors',
                'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isSelected && 'bg-primary text-primary-fg'
              )}
            >
              <span>{cell.day}</span>
              {evs.length > 0 ? (
                <span className="flex gap-0.5">
                  {evs.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={cn(
                        'h-1 w-1 rounded-full',
                        e.tone === 'success' && 'bg-success',
                        e.tone === 'warning' && 'bg-warning',
                        e.tone === 'destructive' && 'bg-destructive',
                        (!e.tone || e.tone === 'primary') &&
                          (isSelected ? 'bg-primary-fg' : 'bg-primary')
                      )}
                    />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
