import * as React from 'react';
import { cn } from '../lib/cn';

export interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

/**
 * MobileBottomNav — fixed bottom navigation bar for mobile/tablet.
 * Optimized for thumb-reach and 5 items max.
 * (TIER 1)
 */
export function MobileBottomNav({
  items,
  className,
}: {
  items: MobileNavItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Primary navigation (mobile)"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden',
        className
      )}
    >
      {items.slice(0, 5).map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={it.onClick}
          aria-current={it.active ? 'page' : undefined}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors',
            it.active ? 'text-primary' : 'text-muted-fg hover:text-foreground'
          )}
        >
          <span className="relative" aria-hidden="true">
            {it.icon}
            {it.badge && it.badge > 0 ? (
              <span className="absolute -right-2 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[0.6rem] font-medium text-destructive-fg">
                {it.badge > 99 ? '99+' : it.badge}
              </span>
            ) : null}
          </span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
