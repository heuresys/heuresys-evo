import * as React from 'react';
import { cn } from '../../lib/cn';

/**
 * SkipLink — keyboard-only "Skip to main content" link, visible on focus.
 * (TIER 12)
 */
export function SkipLink({
  href = '#main-content',
  label = 'Skip to main content',
  className,
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only fixed left-4 top-4 z-[60] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg shadow-md',
        'focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
    >
      {label}
    </a>
  );
}
