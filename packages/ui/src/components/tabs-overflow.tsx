'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TabItem {
  id: string;
  label: string;
  badge?: React.ReactNode;
  disabled?: boolean;
}

/**
 * TabsOverflow — horizontally scrollable tabs that gracefully collapse
 * overflow into a "More" dropdown. Measures via ResizeObserver.
 * (TIER 1)
 */
export function TabsOverflow({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(items.length);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const w = el.offsetWidth;
      const approxItemWidth = 128;
      const moreSlot = 100;
      const fitable = Math.max(1, Math.floor((w - moreSlot) / approxItemWidth));
      setVisibleCount(Math.min(items.length, fitable));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  const visible = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount);

  return (
    <div ref={containerRef} className={cn('flex items-center gap-1 overflow-hidden', className)}>
      <div role="tablist" aria-orientation="horizontal" className="flex items-center gap-1">
        {visible.map((it) => (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={value === it.id}
            disabled={it.disabled}
            onClick={() => onChange(it.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
              value === it.id
                ? 'bg-primary text-primary-fg'
                : 'text-muted-fg hover:bg-accent hover:text-foreground',
              it.disabled && 'opacity-50'
            )}
          >
            <span>{it.label}</span>
            {it.badge}
          </button>
        ))}
      </div>
      {overflow.length > 0 ? (
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setOverflowOpen((o) => !o)}
            aria-expanded={overflowOpen}
            aria-haspopup="menu"
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-fg hover:bg-accent"
          >
            More ({overflow.length})
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          {overflowOpen ? (
            <ul
              role="menu"
              className="absolute right-0 top-full z-20 mt-1 min-w-[10rem] rounded-md border border-border bg-background p-1 shadow-md"
            >
              {overflow.map((it) => (
                <li key={it.id} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onChange(it.id);
                      setOverflowOpen(false);
                    }}
                    disabled={it.disabled}
                    className={cn(
                      'block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent',
                      value === it.id && 'bg-primary/10 text-primary'
                    )}
                  >
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
