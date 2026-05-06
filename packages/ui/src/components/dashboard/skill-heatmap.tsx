import * as React from 'react';
import { cn } from '../../lib/cn';

export interface SkillHeatmapAxis {
  id: string;
  label: string;
}

export interface SkillHeatmapCell {
  rowId: string;
  colId: string;
  /** 0-100 coverage / proficiency / count normalized */
  value: number;
  /** optional human label to render inside the cell (overrides numeric) */
  display?: string;
}

export interface SkillHeatmapProps {
  rows: SkillHeatmapAxis[];
  cols: SkillHeatmapAxis[];
  cells: SkillHeatmapCell[];
  /** caption for screen readers */
  caption?: string;
  /** show numeric value inside cell */
  showValue?: boolean;
  /** override default sequential scale */
  colorScale?: (value: number) => string;
  onCellClick?: (cell: SkillHeatmapCell) => void;
  className?: string;
}

const DEFAULT_BUCKETS: { min: number; cls: string }[] = [
  { min: 80, cls: 'bg-primary/40 text-foreground' },
  { min: 60, cls: 'bg-primary/30 text-foreground' },
  { min: 40, cls: 'bg-primary/20 text-foreground' },
  { min: 20, cls: 'bg-primary/10 text-muted-fg' },
  { min: 0, cls: 'bg-muted/40 text-muted-fg' },
];

function defaultScale(value: number): string {
  for (const b of DEFAULT_BUCKETS) if (value >= b.min) return b.cls;
  return DEFAULT_BUCKETS[DEFAULT_BUCKETS.length - 1]!.cls;
}

export function SkillHeatmap({
  rows,
  cols,
  cells,
  caption,
  showValue = true,
  colorScale,
  onCellClick,
  className,
}: SkillHeatmapProps) {
  const cellMap = React.useMemo(() => {
    const m = new Map<string, SkillHeatmapCell>();
    for (const c of cells) m.set(`${c.rowId}|${c.colId}`, c);
    return m;
  }, [cells]);

  const scale = colorScale ?? defaultScale;

  return (
    <div className={cn('overflow-auto rounded-md border border-border', className)}>
      <table className="min-w-full border-collapse text-xs">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 top-0 z-20 border-b border-r border-border bg-muted px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-fg"
            >
              &nbsp;
            </th>
            {cols.map((c) => (
              <th
                key={c.id}
                scope="col"
                className="sticky top-0 z-10 border-b border-r border-border bg-muted px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-fg"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-r border-border bg-background px-3 py-2 text-left text-xs font-semibold"
              >
                {r.label}
              </th>
              {cols.map((c) => {
                const cell = cellMap.get(`${r.id}|${c.id}`);
                const value = cell?.value ?? 0;
                const cls = scale(value);
                const display = cell?.display ?? (showValue ? value.toFixed(0) : '');
                const interactive = !!onCellClick && !!cell;
                return (
                  <td
                    key={c.id}
                    aria-label={`${r.label} × ${c.label}: ${value}`}
                    className={cn(
                      'border-b border-r border-border px-2 py-2 text-center font-mono text-[11px] tabular-nums transition-colors',
                      cls,
                      interactive && 'cursor-pointer hover:brightness-125'
                    )}
                    onClick={interactive ? () => onCellClick!(cell!) : undefined}
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    onKeyDown={
                      interactive
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onCellClick!(cell!);
                            }
                          }
                        : undefined
                    }
                  >
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
