import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const glassVariants = cva('rounded-lg border bg-background/40 backdrop-blur', {
  variants: {
    intensity: {
      light: 'backdrop-blur-sm bg-background/60 border-border/40',
      medium: 'backdrop-blur-md bg-background/40 border-border/30',
      heavy: 'backdrop-blur-xl bg-background/20 border-border/20',
    },
    tint: {
      none: '',
      primary: 'ring-1 ring-primary/30',
      accent: 'ring-1 ring-accent/30',
    },
  },
  defaultVariants: { intensity: 'medium', tint: 'none' },
});

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof glassVariants> {}

/**
 * GlassCard — glassmorphism container with backdrop-blur tunable.
 * (TIER 2)
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity, tint, ...props }, ref) => (
    <div ref={ref} className={cn(glassVariants({ intensity, tint }), className)} {...props} />
  )
);
GlassCard.displayName = 'GlassCard';
