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

// Note: `getServerLocale` is intentionally NOT re-exported here. It lives in
// `./server` and pulls in `next/headers` + `server-only`. Server components
// must import it directly from `@/lib/i18n/server` to keep client bundles
// (and vitest transforms) free of server-only modules.
