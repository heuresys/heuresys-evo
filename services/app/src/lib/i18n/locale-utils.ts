/**
 * Phase 14.H — Pure i18n utilities (server-safe).
 *
 * No React, no 'use client'. Importable from server components, route
 * handlers, and the client provider alike.
 */

export type Locale = 'it' | 'en';

export const SUPPORTED_LOCALES: Locale[] = ['it', 'en'];
export const DEFAULT_LOCALE: Locale = 'it';

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && SUPPORTED_LOCALES.includes(v as Locale);
}

/**
 * Pick `<field>_<locale>` from a bilingual record. Falls back to the other
 * locale, then to the legacy single-locale field, then to ''.
 */
export function pickBilingual<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  field: string,
  locale: Locale
): string {
  if (!obj || typeof obj !== 'object') return '';
  const primary = obj[`${field}_${locale}`];
  if (typeof primary === 'string' && primary.length > 0) return primary;
  const fallback = obj[`${field}_${locale === 'it' ? 'en' : 'it'}`];
  if (typeof fallback === 'string') return fallback;
  const generic = obj[field];
  if (typeof generic === 'string') return generic;
  return '';
}
