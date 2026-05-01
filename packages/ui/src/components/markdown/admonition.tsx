import * as React from 'react';
import { Info, AlertTriangle, Lightbulb, AlertCircle, BookOpen, Quote } from 'lucide-react';
import { cn } from '../../lib/cn';

const VARIANTS = {
  info: { icon: Info, label: 'Info', className: 'border-info/40 bg-info/10 text-info' },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    className: 'border-warning/40 bg-warning/10 text-warning',
  },
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    className: 'border-success/40 bg-success/10 text-success',
  },
  danger: {
    icon: AlertCircle,
    label: 'Danger',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
  },
  note: {
    icon: BookOpen,
    label: 'Note',
    className: 'border-border bg-muted/40 text-foreground',
  },
  quote: {
    icon: Quote,
    label: 'Quote',
    className: 'border-l-4 border-primary bg-primary/5 text-foreground',
  },
} as const;

export type AdmonitionVariant = keyof typeof VARIANTS;

/**
 * Admonition — callout block for markdown / docs.
 * Variants: info / warning / tip / danger / note / quote.
 * (TIER 10)
 */
export function Admonition({
  variant = 'info',
  title,
  children,
  className,
}: {
  variant?: AdmonitionVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, label, className: vClass } = VARIANTS[variant];
  return (
    <aside
      role="note"
      className={cn('flex gap-3 rounded-md border p-3 text-sm', vClass, className)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-medium">{title ?? label}</p>
        <div className="text-foreground/80">{children}</div>
      </div>
    </aside>
  );
}
