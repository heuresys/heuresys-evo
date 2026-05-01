import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  optional?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  current: number;
  onStepClick?: (idx: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Stepper / Wizard nav — accessible numbered step progression.
 * (TIER 1)
 */
export function Stepper({
  steps,
  current,
  onStepClick,
  orientation = 'horizontal',
  className,
}: StepperProps) {
  const isV = orientation === 'vertical';
  return (
    <ol
      role="list"
      aria-label="Progress"
      className={cn(
        'flex',
        isV ? 'flex-col gap-3' : 'flex-row items-center gap-2 overflow-x-auto',
        className
      )}
    >
      {steps.map((step, idx) => {
        const completed = idx < current;
        const active = idx === current;
        const clickable = onStepClick && (completed || active);
        return (
          <li
            key={step.id}
            className={cn('flex items-center', isV ? 'gap-3' : 'flex-1 gap-2')}
            aria-current={active ? 'step' : undefined}
          >
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(idx)}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                completed && 'border-primary bg-primary text-primary-fg',
                active && 'border-primary bg-primary/10 text-primary',
                !completed && !active && 'border-border bg-background text-muted-fg',
                clickable && 'cursor-pointer hover:opacity-80'
              )}
              aria-label={`Step ${idx + 1}: ${step.label}`}
            >
              {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : idx + 1}
            </button>
            <div className={cn('flex-1', !isV && 'min-w-0')}>
              <div
                className={cn('text-sm font-medium', active ? 'text-foreground' : 'text-muted-fg')}
              >
                {step.label}
                {step.optional ? (
                  <span className="ml-1 text-xs font-normal text-muted-fg">(optional)</span>
                ) : null}
              </div>
              {step.description ? (
                <div className="text-xs text-muted-fg">{step.description}</div>
              ) : null}
            </div>
            {!isV && idx < steps.length - 1 ? (
              <div
                className={cn(
                  'h-px flex-1 transition-colors',
                  completed ? 'bg-primary' : 'bg-border'
                )}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
