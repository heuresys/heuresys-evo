'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '../lib/cn';

const order = ['light', 'dark', 'system'] as const;

export function ThemeToggle({ className }: { className?: string }): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  function cycle() {
    const idx = order.indexOf(theme as (typeof order)[number]);
    setTheme(order[(idx + 1) % order.length]!);
  }
  return (
    <button
      type="button"
      aria-label={`Theme: ${theme}. Click to cycle.`}
      onClick={cycle}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
