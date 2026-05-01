'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

/**
 * OtpInput — segmented one-time password input. Auto-advance + paste support.
 * (TIER 6)
 */
export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  className,
  ariaLabel = 'One-time password',
}: OtpInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  function setChar(idx: number, ch: string) {
    const arr = chars.slice();
    arr[idx] = ch;
    const next = arr.join('').slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  }

  return (
    <div role="group" aria-label={ariaLabel} className={cn('flex gap-1.5', className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={chars[i]}
          disabled={disabled}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, '').slice(-1);
            setChar(i, ch);
            if (ch && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !chars[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
            if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
            if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (txt) {
              e.preventDefault();
              onChange(txt);
              if (txt.length === length) onComplete?.(txt);
              refs.current[Math.min(txt.length, length - 1)]?.focus();
            }
          }}
          className={cn(
            'h-12 w-10 rounded-md border border-input bg-background text-center text-lg font-semibold',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            disabled && 'opacity-50'
          )}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
