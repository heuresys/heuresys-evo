'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './Button';
import { Input } from './Input';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  showFirstLast?: boolean;
  showJumpTo?: boolean;
  showPageSize?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

/**
 * Pagination advanced — first/prev/page numbers/next/last + jump-to + size picker.
 * (TIER 1)
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  showFirstLast = true,
  showJumpTo = false,
  showPageSize = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  className,
}: PaginationProps) {
  const [jump, setJump] = React.useState('');
  const start = Math.max(1, Math.min(page - 2, Math.max(1, pageCount - 4)));
  const end = Math.min(pageCount, start + 4);
  const visiblePages: number[] = [];
  for (let i = start; i <= end; i++) visiblePages.push(i);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center gap-2 text-sm', className)}
    >
      {showFirstLast ? (
        <Button
          size="icon"
          variant="outline"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : null}
      <Button
        size="icon"
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
      <div className="flex items-center gap-1">
        {visiblePages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? 'default' : 'ghost'}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
            className="min-w-[2.25rem]"
          >
            {p}
          </Button>
        ))}
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      {showFirstLast ? (
        <Button
          size="icon"
          variant="outline"
          onClick={() => onPageChange(pageCount)}
          disabled={page >= pageCount}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : null}
      <span className="ml-2 text-muted-fg">
        {page} / {pageCount}
      </span>
      {showJumpTo ? (
        <form
          className="ml-2 flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(jump);
            if (Number.isFinite(n) && n >= 1 && n <= pageCount) {
              onPageChange(Math.floor(n));
              setJump('');
            }
          }}
        >
          <label className="text-muted-fg" htmlFor="jump-to-page">
            Go to
          </label>
          <Input
            id="jump-to-page"
            type="number"
            min={1}
            max={pageCount}
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            className="w-16 text-center"
          />
        </form>
      ) : null}
      {showPageSize && onPageSizeChange ? (
        <div className="ml-auto flex items-center gap-2">
          <label className="text-muted-fg" htmlFor="page-size-select">
            Rows
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </nav>
  );
}
