import * as React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * Breadcrumbs advanced — collapses to ellipsis when items > maxItems.
 * (TIER 1)
 */
export function Breadcrumbs({
  items,
  maxItems = 5,
  separator = <ChevronRight className="h-3.5 w-3.5 text-muted-fg" aria-hidden="true" />,
  className,
}: {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: React.ReactNode;
  className?: string;
}) {
  let visible = items;
  let collapsed: BreadcrumbItem[] = [];
  if (items.length > maxItems) {
    visible = [items[0]!, ...items.slice(items.length - (maxItems - 2))];
    collapsed = items.slice(1, items.length - (maxItems - 2));
  }
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {visible.map((it, idx) => {
          const isCollapseSlot = idx === 1 && collapsed.length > 0;
          const isLast = idx === visible.length - 1;
          return (
            <React.Fragment key={`${it.label}-${idx}`}>
              {idx > 0 ? <li aria-hidden="true">{separator}</li> : null}
              {isCollapseSlot ? (
                <li>
                  <CollapsedItems items={collapsed} />
                </li>
              ) : null}
              {isCollapseSlot ? <li aria-hidden="true">{separator}</li> : null}
              <li>
                {isLast || (!it.href && !it.onClick) ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="font-medium text-foreground"
                  >
                    {it.label}
                  </span>
                ) : (
                  <a
                    href={it.href}
                    onClick={(e) => {
                      if (it.onClick) {
                        e.preventDefault();
                        it.onClick();
                      }
                    }}
                    className="text-muted-fg hover:text-foreground hover:underline"
                  >
                    {it.label}
                  </a>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

function CollapsedItems({ items }: { items: BreadcrumbItem[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative">
      <button
        type="button"
        aria-label={`Show ${items.length} hidden breadcrumbs`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center rounded p-0.5 text-muted-fg hover:bg-muted hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open ? (
        <ul className="absolute left-0 top-full z-20 mt-1 min-w-[10rem] rounded-md border border-border bg-background p-1 shadow-md">
          {items.map((it) => (
            <li key={it.label}>
              <a
                href={it.href}
                onClick={(e) => {
                  if (it.onClick) {
                    e.preventDefault();
                    it.onClick();
                  }
                  setOpen(false);
                }}
                className="block rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-accent"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
}
