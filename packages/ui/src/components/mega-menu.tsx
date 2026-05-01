'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MegaMenuColumn {
  heading: string;
  items: Array<{
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: React.ReactNode;
  }>;
}

export interface MegaMenuTrigger {
  id: string;
  label: string;
  columns: MegaMenuColumn[];
  featured?: React.ReactNode;
}

/**
 * MegaMenu — multi-column dropdown for top navigation. Supports featured
 * card slot per trigger. (TIER 1)
 */
export function MegaMenu({
  triggers,
  className,
}: {
  triggers: MegaMenuTrigger[];
  className?: string;
}) {
  const [open, setOpen] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(null);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav ref={ref} aria-label="Primary" className={cn('flex items-center gap-1', className)}>
      {triggers.map((t) => {
        const isOpen = open === t.id;
        return (
          <div key={t.id} className="relative">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : t.id)}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isOpen
                  ? 'bg-accent text-foreground'
                  : 'text-muted-fg hover:bg-accent hover:text-foreground'
              )}
            >
              {t.label}
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div
                role="menu"
                className="fixed left-0 right-0 top-[calc(var(--header-height,3.5rem))] z-30 border-b border-border bg-background shadow-lg"
              >
                <div
                  className="mx-auto grid max-w-7xl gap-6 p-6 md:grid-cols-[repeat(var(--col-count),minmax(0,1fr))_minmax(0,18rem)]"
                  style={{ ['--col-count' as never]: t.columns.length }}
                >
                  {t.columns.map((col, idx) => (
                    <div key={idx}>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-fg">
                        {col.heading}
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {col.items.map((item) => {
                          const Tag = item.href ? 'a' : 'button';
                          return (
                            <li key={item.id}>
                              <Tag
                                type={Tag === 'button' ? 'button' : undefined}
                                href={item.href}
                                onClick={() => {
                                  item.onClick?.();
                                  setOpen(null);
                                }}
                                className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
                              >
                                {item.icon ? (
                                  <span className="mt-0.5 text-muted-fg">{item.icon}</span>
                                ) : null}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    {item.label}
                                    {item.badge}
                                  </div>
                                  {item.description ? (
                                    <p className="text-xs text-muted-fg">{item.description}</p>
                                  ) : null}
                                </div>
                              </Tag>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  {t.featured ? (
                    <aside className="rounded-lg bg-muted/50 p-4">{t.featured}</aside>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
