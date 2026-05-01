'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/cn';
import { SUPPORTED_LOCALES } from './locale-formatters';

/**
 * LanguagePicker — locale switcher with flag/label.
 * RTL-aware (sets dir attribute when ar/he/fa selected).
 * (TIER 11)
 */
export function LanguagePicker({
  value,
  onChange,
  locales = SUPPORTED_LOCALES as ReadonlyArray<{ code: string; label: string }>,
  className,
}: {
  value: string;
  onChange: (code: string) => void;
  locales?: ReadonlyArray<{ code: string; label: string }>;
  className?: string;
}) {
  return (
    <label className={cn('inline-flex items-center gap-2', className)}>
      <Globe className="h-4 w-4 text-muted-fg" aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          const rtl = ['ar', 'he', 'fa'].some((c) => e.target.value.startsWith(c));
          document.documentElement.dir = rtl ? 'rtl' : 'ltr';
          document.documentElement.lang = e.target.value;
        }}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        aria-label="Select language"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
