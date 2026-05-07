'use client';

import * as React from 'react';
import { Button } from '@heuresys/ui';

const STORAGE_KEY = 'heuresys-theme';
type Theme = 'dark' | 'light';

/**
 * Simple theme toggle button (sun ⇄ moon icons).
 * - Default theme: dark (set on <html data-theme="dark">)
 * - Persists choice to localStorage('heuresys-theme')
 * - Hydration-safe: reads localStorage in useEffect, never on first render
 * - Respects @media (prefers-reduced-motion)
 */
export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('dark');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage may be blocked */
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Toggle theme" disabled>
        <span style={{ width: 16, height: 16, display: 'inline-block' }} aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={`Toggle theme (current: ${theme})`}
      aria-pressed={theme === 'light'}
    >
      <span aria-hidden="true">{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</span>
    </Button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
