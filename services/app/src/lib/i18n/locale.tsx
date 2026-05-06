/**
 * Phase 14.H — Client-side LocaleProvider + hooks.
 *
 * Pure helpers (`isLocale`, `pickBilingual`, types) live in `./locale-utils`
 * so server components can import them without crossing the client boundary.
 *
 * Persistence priority (client only):
 *   1. ?lang=it|en URL query param (explicit override)
 *   2. localStorage `heuresys.locale` (last user choice)
 *   3. Fallback: DEFAULT_LOCALE ('it')
 */

'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, isLocale, pickBilingual, type Locale } from './locale-utils';

const STORAGE_KEY = 'heuresys.locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export interface LocaleProviderProps {
  children: React.ReactNode;
  /** Optional initial override, e.g. derived from server-side query param. */
  initialLocale?: Locale;
}

function readInitial(initialLocale: Locale | undefined): Locale {
  if (initialLocale && isLocale(initialLocale)) return initialLocale;
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('lang');
    if (isLocale(fromQuery)) return fromQuery;
  } catch {
    // ignore
  }
  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(fromStorage)) return fromStorage;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => readInitial(initialLocale));

  useEffect(() => {
    const detected = readInitial(initialLocale);
    if (detected !== locale) setLocaleState(detected);
    // intentionally only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: DEFAULT_LOCALE, setLocale: () => {} };
  }
  return ctx;
}

/** Hook variant of `pickBilingual` that uses the active locale automatically. */
export function useTranslate(): <T extends Record<string, unknown>>(
  obj: T | null | undefined,
  field: string
) => string {
  const { locale } = useLocale();
  return useCallback(
    <T extends Record<string, unknown>>(obj: T | null | undefined, field: string) =>
      pickBilingual(obj, field, locale),
    [locale]
  );
}
