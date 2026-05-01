'use client';

import * as React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/cn';
import { Input } from './Input';
import { Button } from './Button';
import { Badge } from './badge';

export interface FilterChip {
  id: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  chips?: FilterChip[];
  onClearAll?: () => void;
  filtersSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * FilterBar smart — search input + chip-based active filters + advanced
 * filters dropdown. (TIER 1)
 */
export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  chips = [],
  onClearAll,
  filtersSlot,
  rightSlot,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-md border border-border bg-background p-3',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-fg"
            aria-hidden="true"
          />
          <Input
            value={searchValue ?? ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search"
          />
        </div>
        {filtersSlot ? <div className="flex items-center gap-2">{filtersSlot}</div> : null}
        {rightSlot ? <div className="ml-auto flex items-center gap-2">{rightSlot}</div> : null}
      </div>
      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-fg" aria-hidden="true" />
          {chips.map((c) => (
            <Badge key={c.id} variant="secondary" className="gap-1 pr-1">
              <span className="text-xs">
                {c.label}: {c.value}
              </span>
              <button
                type="button"
                onClick={c.onRemove}
                aria-label={`Remove filter ${c.label}`}
                className="rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
          {onClearAll && chips.length > 1 ? (
            <Button size="sm" variant="ghost" onClick={onClearAll}>
              Clear all
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
