'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const fabVariants = cva(
  'fixed z-40 inline-flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      size: {
        sm: 'h-10 w-10',
        md: 'h-14 w-14',
        lg: 'h-16 w-16',
      },
      position: {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
      },
      tone: {
        primary: 'bg-primary text-primary-fg hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-fg hover:bg-secondary/80',
        accent: 'bg-accent text-accent-fg hover:bg-accent/80',
      },
    },
    defaultVariants: { size: 'md', position: 'bottom-right', tone: 'primary' },
  }
);

export interface FABProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof fabVariants> {
  icon?: React.ReactNode;
  label: string;
  extended?: boolean;
}

/**
 * FAB — Floating Action Button. Pinned to viewport corners.
 * Supports extended (icon + label visible) for primary actions.
 * (TIER 1)
 */
export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ className, size, position, tone, icon, label, extended, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={extended ? undefined : label}
      className={cn(
        fabVariants({ size, position, tone }),
        extended && 'h-12 w-auto px-5',
        className
      )}
      {...props}
    >
      <span aria-hidden="true">{icon ?? <Plus className="h-5 w-5" />}</span>
      {extended ? <span className="ml-2 text-sm font-medium">{label}</span> : null}
    </button>
  )
);
FAB.displayName = 'FAB';
