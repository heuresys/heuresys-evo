import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * BentoGrid — adaptive responsive grid where children can span multiple
 * cells via colSpan/rowSpan props. CSS Grid auto-fit + named area-less.
 * (TIER 1)
 */
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  rowHeight?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export function BentoGrid({
  columns = 12,
  rowHeight = 'minmax(120px, auto)',
  gap = 'md',
  className,
  style,
  ...props
}: BentoGridProps) {
  const gapMap = { sm: '0.5rem', md: '1rem', lg: '1.5rem' };
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: rowHeight,
        gap: gapMap[gap],
        ...style,
      }}
      {...props}
    />
  );
}

export interface BentoCellProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
  colSpanMd?: number;
  rowSpanMd?: number;
}

export function BentoCell({
  colSpan = 1,
  rowSpan = 1,
  colSpanMd,
  rowSpanMd,
  className,
  style,
  ...props
}: BentoCellProps) {
  // Use inline style for span which CSS Grid honors directly.
  const spanStyle: React.CSSProperties = {
    gridColumn: `span ${colSpan} / span ${colSpan}`,
    gridRow: `span ${rowSpan} / span ${rowSpan}`,
    ...style,
  };
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background p-4',
        colSpanMd && `md:[grid-column:span_${colSpanMd}]`,
        rowSpanMd && `md:[grid-row:span_${rowSpanMd}]`,
        className
      )}
      style={spanStyle}
      {...props}
    />
  );
}
