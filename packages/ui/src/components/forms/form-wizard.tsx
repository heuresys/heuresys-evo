'use client';

import * as React from 'react';
import { Stepper, type StepperStep } from '../stepper';
import { Button } from '../Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../Card';
import { cn } from '../../lib/cn';

export interface FormWizardStep<TState = unknown> extends StepperStep {
  render: (state: TState, update: (patch: Partial<TState>) => void) => React.ReactNode;
  validate?: (state: TState) => string | null;
}

/**
 * FormWizard — multi-step form with per-step validation, save & resume hook,
 * and skeleton state for "load draft" UX. (TIER 6)
 */
export interface FormWizardProps<TState> {
  steps: FormWizardStep<TState>[];
  initial: TState;
  onComplete: (state: TState) => void;
  onSaveDraft?: (state: TState) => void;
  draft?: TState;
  className?: string;
  title?: string;
}

export function FormWizard<TState extends Record<string, unknown>>({
  steps,
  initial,
  onComplete,
  onSaveDraft,
  draft,
  className,
  title,
}: FormWizardProps<TState>) {
  const [state, setState] = React.useState<TState>(draft ?? initial);
  const [current, setCurrent] = React.useState(0);
  const [errors, setErrors] = React.useState<Record<number, string>>({});

  const update = (patch: Partial<TState>) => setState((s) => ({ ...s, ...patch }));

  const step = steps[current]!;

  function next() {
    const err = step.validate?.(state);
    if (err) {
      setErrors((e) => ({ ...e, [current]: err }));
      return;
    }
    setErrors((e) => {
      const next = { ...e };
      delete next[current];
      return next;
    });
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else onComplete(state);
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Stepper
        steps={steps.map((s) => ({
          id: s.id,
          label: s.label,
          description: s.description,
          optional: s.optional,
        }))}
        current={current}
        onStepClick={(i) => i < current && setCurrent(i)}
      />
      <Card>
        {title ? (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        ) : null}
        <CardContent>
          {step.render(state, update)}
          {errors[current] ? (
            <p
              role="alert"
              className="mt-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive"
            >
              {errors[current]}
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              Back
            </Button>
            {onSaveDraft ? (
              <Button variant="ghost" onClick={() => onSaveDraft(state)}>
                Save draft
              </Button>
            ) : null}
          </div>
          <Button onClick={next}>{current < steps.length - 1 ? 'Next' : 'Submit'}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
