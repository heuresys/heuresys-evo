import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const pillVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider',
  {
    variants: {
      tone: {
        ok: 'border-success bg-success/15 text-success',
        warn: 'border-warning bg-warning/15 text-warning',
        down: 'border-destructive bg-destructive/15 text-destructive',
        info: 'border-primary bg-primary/15 text-primary',
      },
    },
    defaultVariants: { tone: 'ok' },
  }
);

const dotVariants = cva('inline-block h-1.5 w-1.5 rounded-full', {
  variants: {
    tone: {
      ok: 'bg-success',
      warn: 'bg-warning',
      down: 'bg-destructive',
      info: 'bg-primary',
    },
    pulse: {
      true: 'animate-pulse',
      false: '',
    },
  },
  defaultVariants: { tone: 'ok', pulse: false },
});

export type IntegrationHealthTone = 'ok' | 'warn' | 'down' | 'info';

export interface IntegrationHealthPillProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof pillVariants> {
  label?: string;
  pulse?: boolean;
  showDot?: boolean;
}

const DEFAULT_LABEL: Record<IntegrationHealthTone, string> = {
  ok: 'OK',
  warn: 'WARN',
  down: 'DOWN',
  info: 'INFO',
};

export function IntegrationHealthPill({
  tone = 'ok',
  label,
  pulse = false,
  showDot = true,
  className,
  ...props
}: IntegrationHealthPillProps) {
  const resolvedTone: IntegrationHealthTone = tone ?? 'ok';
  const text = label ?? DEFAULT_LABEL[resolvedTone];
  return (
    <span
      role="status"
      aria-label={`Integration health: ${text}`}
      className={cn(pillVariants({ tone: resolvedTone }), className)}
      {...props}
    >
      {showDot ? (
        <span aria-hidden="true" className={dotVariants({ tone: resolvedTone, pulse })} />
      ) : null}
      <span>{text}</span>
    </span>
  );
}
