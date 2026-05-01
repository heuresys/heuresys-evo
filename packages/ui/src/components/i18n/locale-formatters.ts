/**
 * Locale-aware formatters via Intl API. (TIER 11)
 */

export function formatCurrency(value: number, currency = 'EUR', locale = 'it-IT'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = 'it-IT'
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatPercent(value: number, fractionDigits = 1, locale = 'it-IT'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale = 'it-IT'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

export function formatDateTime(date: Date | string, locale = 'it-IT'): string {
  return formatDate(date, { dateStyle: 'medium', timeStyle: 'short' }, locale);
}

export function formatRelativeTime(date: Date | string, locale = 'it-IT'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = (d.getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) {
      return rtf.format(Math.round(diff / seconds), unit);
    }
  }
  return rtf.format(0, 'second');
}

export function formatList(
  items: string[],
  locale = 'it-IT',
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lf = new (Intl as any).ListFormat(locale, { style: 'long', type });
  return lf.format(items);
}

export const SUPPORTED_LOCALES = [
  { code: 'it-IT', label: 'Italiano' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'es-ES', label: 'Español' },
  { code: 'pt-PT', label: 'Português' },
] as const;
