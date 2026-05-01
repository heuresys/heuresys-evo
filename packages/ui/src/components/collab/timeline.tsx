import * as React from 'react';
import { cn } from '../../lib/cn';

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  tone?: 'primary' | 'success' | 'warning' | 'destructive' | 'muted';
}

const toneClass: Record<NonNullable<TimelineEvent['tone']>, string> = {
  primary: 'bg-primary text-primary-fg',
  success: 'bg-success text-success-fg',
  warning: 'bg-warning text-warning-fg',
  destructive: 'bg-destructive text-destructive-fg',
  muted: 'bg-muted text-muted-fg',
};

/**
 * Timeline — vertical event timeline. (TIER 5)
 */
export function Timeline({
  events,
  className,
  emptyMessage = 'No events.',
}: {
  events: TimelineEvent[];
  className?: string;
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return <p className={cn('p-6 text-center text-sm text-muted-fg', className)}>{emptyMessage}</p>;
  }
  return (
    <ol className={cn('relative ml-4 border-l border-border', className)}>
      {events.map((e) => (
        <li key={e.id} className="relative pb-6 pl-6">
          <span
            aria-hidden="true"
            className={cn(
              'absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-background',
              toneClass[e.tone ?? 'primary']
            )}
          >
            {e.icon ?? <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          </span>
          <time dateTime={e.time} className="text-xs text-muted-fg">
            {new Date(e.time).toLocaleString()}
          </time>
          <h4 className="text-sm font-medium">{e.title}</h4>
          {e.description ? <p className="text-xs text-muted-fg">{e.description}</p> : null}
        </li>
      ))}
    </ol>
  );
}
