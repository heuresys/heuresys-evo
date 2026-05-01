'use client';

import * as React from 'react';
import zxcvbn from 'zxcvbn';
import { cn } from '../../lib/cn';

/**
 * PasswordStrengthMeter — uses zxcvbn for entropy scoring (0-4).
 * Shows visual bars + feedback suggestions.
 * (TIER 6)
 */
export function PasswordStrengthMeter({
  password,
  userInputs = [],
  className,
}: {
  password: string;
  userInputs?: string[];
  className?: string;
}) {
  const result = React.useMemo(() => {
    if (!password) return null;
    return zxcvbn(password, userInputs);
  }, [password, userInputs]);

  const score = result?.score ?? 0;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'oklch(0.6 0.22 22)',
    'oklch(0.7 0.2 40)',
    'oklch(0.78 0.16 80)',
    'oklch(0.7 0.18 145)',
    'oklch(0.65 0.18 145)',
  ];

  if (!password) return null;

  return (
    <div className={cn('flex flex-col gap-1', className)} aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              background: i <= score ? colors[score] : 'oklch(0.92 0.008 252)',
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="font-medium" style={{ color: colors[score] }}>
          {labels[score]}
        </span>
        {result?.feedback.warning ? (
          <span className="text-muted-fg">{result.feedback.warning}</span>
        ) : null}
      </div>
      {result?.feedback.suggestions.length ? (
        <ul className="text-xs text-muted-fg">
          {result.feedback.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
