'use client';

import * as React from 'react';
import { Grip } from 'lucide-react';
import { cn } from '../lib/cn';

export interface AppSwitcherApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  href?: string;
  description?: string;
  onClick?: () => void;
}

/**
 * AppSwitcher — Google-style waffle 3x3 launcher. Opens a popover with
 * a grid of apps. (TIER 1)
 */
export function AppSwitcher({
  apps,
  trigger,
  className,
}: {
  apps: AppSwitcherApp[];
  trigger?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open app switcher"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-fg hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {trigger ?? <Grip className="h-5 w-5" aria-hidden="true" />}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="App switcher"
          className="absolute right-0 top-full z-30 mt-2 w-72 rounded-md border border-border bg-background p-3 shadow-lg"
        >
          <div className="grid grid-cols-3 gap-1">
            {apps.map((a) => {
              const Tag = a.href ? 'a' : 'button';
              return (
                <Tag
                  key={a.id}
                  type={Tag === 'button' ? 'button' : undefined}
                  href={a.href}
                  onClick={() => {
                    a.onClick?.();
                    setOpen(false);
                  }}
                  title={a.description ?? a.name}
                  className="flex flex-col items-center gap-1.5 rounded-md p-3 text-center text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {a.icon}
                  </span>
                  <span className="truncate text-foreground">{a.name}</span>
                </Tag>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
