/**
 * Server-side locale helper.
 *
 * Reads the active locale from the `heuresys.locale` cookie set by the client
 * `LocaleProvider` when the user toggles language via `<LocaleSwitcher>`.
 * Falls back to DEFAULT_LOCALE ('it') if cookie is missing/invalid.
 *
 * Use this from server components / route handlers that render bilingual UI:
 *
 *   const locale = await getServerLocale();
 *   const t = STRINGS[locale]; // {it: {...}, en: {...}}
 */

import 'server-only';
import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, type Locale } from './locale-utils';

const COOKIE_KEY = 'heuresys.locale';

export async function getServerLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const v = store.get(COOKIE_KEY)?.value;
    if (isLocale(v)) return v;
  } catch {
    // cookies() unavailable (e.g. unit test) — fall through
  }
  return DEFAULT_LOCALE;
}
