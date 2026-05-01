import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const neuVariants = cva('rounded-2xl bg-muted p-4 transition-all', {
  variants: {
    elevation: {
      raised: 'shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.6)]',
      pressed:
        'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.6)]',
      flat: '',
    },
  },
  defaultVariants: { elevation: 'raised' },
});

export interface NeumorphicCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof neuVariants> {}

/**
 * NeumorphicCard — soft shadow elevated/pressed surface for "soft" UI styles.
 * (TIER 2)
 */
export const NeumorphicCard = React.forwardRef<HTMLDivElement, NeumorphicCardProps>(
  ({ className, elevation, ...props }, ref) => (
    <div ref={ref} className={cn(neuVariants({ elevation }), className)} {...props} />
  )
);
NeumorphicCard.displayName = 'NeumorphicCard';
