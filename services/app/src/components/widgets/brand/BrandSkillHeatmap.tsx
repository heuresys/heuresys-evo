import * as React from 'react';

export interface HeatmapAxis {
  id: string;
  label: string;
}

export interface HeatmapCell {
  rowId: string;
  colId: string;
  value: number;
}

export interface BrandSkillHeatmapProps {
  rows: HeatmapAxis[];
  cols: HeatmapAxis[];
  cells: HeatmapCell[];
  caption?: string;
  showValue?: boolean;
}

function bucket(value: number): string {
  if (value >= 85) return 'heat-6';
  if (value >= 75) return 'heat-5';
  if (value >= 60) return 'heat-4';
  if (value >= 45) return 'heat-3';
  if (value >= 30) return 'heat-2';
  if (value >= 15) return 'heat-1';
  return 'heat-0';
}

/**
 * BrandSkillHeatmap — heatmap matrix mockup-fedele.
 * Layout: heatmap-wrap chrome + grid (cols header row + rows label col + cells).
 */
export function BrandSkillHeatmap({
  rows,
  cols,
  cells,
  caption,
  showValue = true,
}: BrandSkillHeatmapProps) {
  const cellLookup = React.useMemo(() => {
    const m: Record<string, Record<string, number>> = {};
    for (const c of cells) {
      if (!m[c.rowId]) m[c.rowId] = {};
      m[c.rowId]![c.colId] = c.value;
    }
    return m;
  }, [cells]);

  // grid template: 1 col for row labels + N cols for columns
  const gridTemplateColumns = `minmax(120px, max-content) repeat(${cols.length}, 1fr)`;

  return (
    <div className="heatmap-wrap">
      {/* Title is rendered by parent LayoutPanel (data.title="Skill heatmap"). */}
      <div
        className="widget-head"
        style={{ borderBottom: 0, padding: 0, marginBottom: 12, justifyContent: 'flex-end' }}
      >
        <div className="filters">
          <span className="filter-pill active">
            {rows.length}×{cols.length}
          </span>
        </div>
      </div>
      <div
        className="heatmap-grid"
        style={{ gridTemplateColumns }}
        role="table"
        aria-label={caption ?? 'Skill heatmap'}
      >
        {/* Header row */}
        <div />
        {cols.map((c) => (
          <div key={c.id} className="heatmap-col-header" role="columnheader">
            {c.label}
          </div>
        ))}
        {/* Body rows */}
        {rows.map((r) => (
          <React.Fragment key={r.id}>
            <div className="heatmap-row-label" role="rowheader">
              {r.label}
            </div>
            {cols.map((c) => {
              const v = cellLookup[r.id]?.[c.id] ?? 0;
              return (
                <div
                  key={c.id}
                  className={`heatmap-cell ${bucket(v)}`}
                  role="cell"
                  title={`${r.label} × ${c.label}: ${v}`}
                >
                  {showValue ? Math.round(v) : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
