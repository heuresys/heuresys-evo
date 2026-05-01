import * as React from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center',
        className
      )}
      {...props}
    >
      {icon ? <div className="text-muted-fg">{icon}</div> : null}
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="max-w-prose text-sm text-muted-fg">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export interface ErrorStateProps extends EmptyStateProps {
  retry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', ...rest }: Partial<ErrorStateProps>) {
  return <EmptyState title={title} {...rest} />;
}
