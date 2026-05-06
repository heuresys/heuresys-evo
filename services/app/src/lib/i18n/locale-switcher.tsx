/**
 * Phase 14.H — Tiny locale switcher dropdown (client component).
 * Reads/sets the active locale via the LocaleProvider context. Display labels
 * are themselves locale-aware so the menu reads natural in either language.
 */

'use client';

import { SUPPORTED_LOCALES, type Locale } from './locale-utils';
import { useLocale } from './locale';

const LABELS: Record<Locale, { native: string; flag: string }> = {
  it: { native: 'Italiano', flag: '🇮🇹' },
  en: { native: 'English', flag: '🇬🇧' },
};

export interface LocaleSwitcherProps {
  className?: string;
  /** Show full label "Italiano" vs short code "IT". Defaults to short. */
  variant?: 'short' | 'full';
}

export function LocaleSwitcher({ className, variant = 'short' }: LocaleSwitcherProps) {
  const { locale, setLocale } = useLocale();
  return (
    <label className={['inline-flex items-center gap-1', className ?? ''].join(' ')}>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Select language"
        className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-fg hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {variant === 'full' ? `${LABELS[l].flag} ${LABELS[l].native}` : l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
