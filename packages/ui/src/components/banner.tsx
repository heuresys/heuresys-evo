'use client';

import * as React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const bannerVariants = cva('relative flex items-start gap-3 rounded-md border p-3 text-sm', {
  variants: {
    tone: {
      info: 'border-info/40 bg-info/10 text-info',
      success: 'border-success/40 bg-success/10 text-success',
      warning: 'border-warning/40 bg-warning/10 text-warning',
      destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
      neutral: 'border-border bg-muted/30 text-foreground',
    },
  },
  defaultVariants: { tone: 'info' },
});

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
  neutral: Info,
};

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Banner — page-level alert with variant tone + optional dismiss.
 * (TIER 3)
 */
export function Banner({
  tone = 'info',
  title,
  dismissible,
  onDismiss,
  children,
  className,
  ...props
}: BannerProps) {
  const Icon = ICONS[tone ?? 'info'];
  return (
    <div role="status" className={cn(bannerVariants({ tone }), className)} {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title ? <p className="font-medium text-foreground">{title}</p> : null}
        <div className="text-foreground/80">{children}</div>
      </div>
      {dismissible ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="text-muted-fg hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
