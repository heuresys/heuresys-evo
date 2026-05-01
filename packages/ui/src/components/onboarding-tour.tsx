'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * OnboardingTour — Joyride-style multi-step coach marks.
 * Highlights elements via querySelector + renders a popover beside them.
 * (TIER 3)
 */
export function OnboardingTour({
  steps,
  active,
  onDismiss,
  onComplete,
}: {
  steps: TourStep[];
  active: boolean;
  onDismiss?: () => void;
  onComplete?: () => void;
}) {
  const [idx, setIdx] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const step = steps[idx];

  React.useEffect(() => {
    if (!active || !step) return;
    const el = document.querySelector(step.targetSelector);
    if (el) {
      setRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [active, step]);

  if (!active || !step || !rect) return null;

  const placement = step.placement ?? 'bottom';
  const popoverStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 60,
    ...(placement === 'bottom' && { top: rect.bottom + 12, left: rect.left }),
    ...(placement === 'top' && {
      top: rect.top - 12,
      left: rect.left,
      transform: 'translateY(-100%)',
    }),
    ...(placement === 'right' && { top: rect.top, left: rect.right + 12 }),
    ...(placement === 'left' && {
      top: rect.top,
      left: rect.left - 12,
      transform: 'translateX(-100%)',
    }),
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-50 rounded-md ring-4 ring-primary"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />
      <div
        role="dialog"
        aria-labelledby={`tour-title-${step.id}`}
        className={cn('w-80 rounded-md border border-border bg-background p-4 shadow-xl')}
        style={popoverStyle}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 id={`tour-title-${step.id}`} className="text-sm font-semibold">
            {step.title}
          </h3>
          <button
            type="button"
            onClick={() => onDismiss?.()}
            aria-label="Dismiss tour"
            className="text-muted-fg hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-fg">{step.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-fg">
            {idx + 1} / {steps.length}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              disabled={idx === 0}
            >
              Back
            </Button>
            {idx < steps.length - 1 ? (
              <Button size="sm" onClick={() => setIdx((i) => i + 1)}>
                Next
              </Button>
            ) : (
              <Button size="sm" onClick={onComplete}>
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
