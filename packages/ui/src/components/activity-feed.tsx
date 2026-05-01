import * as React from 'react';
import { cn } from '../lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

export interface ActivityFeedItem {
  id: string;
  actor: { name: string; avatar?: string };
  verb: string;
  target?: string;
  meta?: string;
  timestamp: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * ActivityFeed — vertical timeline of events with avatars + actions.
 * (TIER 3)
 */
export function ActivityFeed({
  items,
  className,
  emptyMessage = 'No activity yet.',
}: {
  items: ActivityFeedItem[];
  className?: string;
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return <p className={cn('p-6 text-center text-sm text-muted-fg', className)}>{emptyMessage}</p>;
  }
  return (
    <ol className={cn('flex flex-col', className)}>
      {items.map((it, idx) => (
        <li key={it.id} className="relative flex gap-4 pb-6 last:pb-0">
          {idx < items.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-5 top-10 -z-0 h-[calc(100%-2.5rem)] w-px bg-border"
            />
          ) : null}
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background">
            {it.actor.avatar ? <AvatarImage src={it.actor.avatar} alt={it.actor.name} /> : null}
            <AvatarFallback>{it.actor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <strong className="text-foreground">{it.actor.name}</strong>{' '}
              <span className="text-muted-fg">{it.verb}</span>
              {it.target ? (
                <>
                  {' '}
                  <strong className="text-foreground">{it.target}</strong>
                </>
              ) : null}
            </p>
            {it.meta ? <p className="text-xs text-muted-fg">{it.meta}</p> : null}
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-fg">
              <time dateTime={it.timestamp}>{formatRelative(it.timestamp)}</time>
              {it.actions}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
