import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * PageHeader — admin page header with title, description, breadcrumbs slot,
 * and right-aligned action area. (TIER 1)
 */
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  badges?: React.ReactNode;
  divider?: boolean;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badges,
  divider = true,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn('flex flex-col gap-3 pb-6', divider && 'border-b border-border', className)}
      {...props}
    >
      {breadcrumbs ? <div className="text-sm text-muted-fg">{breadcrumbs}</div> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            {badges}
          </div>
          {description ? <p className="max-w-prose text-sm text-muted-fg">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
