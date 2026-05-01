'use client';

import * as React from 'react';
import { Bell, Check } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  timestamp: string;
  read?: boolean;
  variant?: 'info' | 'success' | 'warning' | 'destructive';
  href?: string;
  onClick?: () => void;
}

/**
 * NotificationCenter — bell icon trigger + dropdown with read/unread states.
 * (TIER 3)
 */
export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  className,
}: {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    function close(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-fg hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[0.6rem] font-medium text-destructive-fg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-30 mt-2 w-80 rounded-md border border-border bg-background shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border p-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && onMarkAllRead ? (
              <Button size="sm" variant="ghost" onClick={onMarkAllRead}>
                <Check className="mr-1 h-3 w-3" /> Mark all read
              </Button>
            ) : null}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-6 text-center text-sm text-muted-fg">No notifications.</li>
            ) : (
              notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!n.read) onMarkRead?.(n.id);
                      n.onClick?.();
                      if (n.href) window.location.href = n.href;
                    }}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-border p-3 text-left transition-colors last:border-0 hover:bg-accent',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                        !n.read ? 'bg-primary' : 'bg-transparent',
                        n.variant === 'success' && 'bg-success',
                        n.variant === 'warning' && 'bg-warning',
                        n.variant === 'destructive' && 'bg-destructive'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      {n.body ? <p className="text-xs text-muted-fg">{n.body}</p> : null}
                      <time dateTime={n.timestamp} className="text-[0.65rem] text-muted-fg">
                        {new Date(n.timestamp).toLocaleString()}
                      </time>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
