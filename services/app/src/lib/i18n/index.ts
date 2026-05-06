/**
 * Phase 14.H — i18n public surface.
 *
 * Server-safe exports come from ./locale-utils. Client-only exports come from
 * ./locale and ./locale-switcher (both 'use client').
 */

export {
  isLocale,
  pickBilingual,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from './locale-utils';

export { LocaleProvider, useLocale, useTranslate, type LocaleProviderProps } from './locale';

export { LocaleSwitcher, type LocaleSwitcherProps } from './locale-switcher';
