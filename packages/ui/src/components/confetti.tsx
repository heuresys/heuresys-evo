'use client';

import * as React from 'react';
import confettiLib from 'canvas-confetti';

/**
 * useConfetti — fire celebratory confetti burst from any component.
 * Wraps canvas-confetti. (TIER 3)
 */
export function useConfetti() {
  return React.useCallback((options?: confettiLib.Options) => {
    confettiLib({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      ...options,
    });
  }, []);
}

/**
 * ConfettiButton — drop-in button that fires confetti on click.
 */
export function ConfettiButton({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const fire = useConfetti();
  return (
    <button
      type="button"
      onClick={(e) => {
        fire();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
