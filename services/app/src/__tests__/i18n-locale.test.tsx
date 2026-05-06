/**
 * Phase 14.H — Tests for locale primitives + switcher.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, render, fireEvent } from '@testing-library/react';
import {
  LocaleProvider,
  useLocale,
  useTranslate,
  pickBilingual,
  isLocale,
  DEFAULT_LOCALE,
  LocaleSwitcher,
} from '@/lib/i18n';

beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LocaleProvider>{children}</LocaleProvider>
);

describe('isLocale', () => {
  it('accepts supported codes', () => {
    expect(isLocale('it')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });
  it('rejects unsupported', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe('useLocale', () => {
  it('returns DEFAULT_LOCALE outside provider (tolerant fallback)', () => {
    const { result } = renderHook(() => useLocale());
    expect(result.current.locale).toBe(DEFAULT_LOCALE);
  });

  it('returns DEFAULT_LOCALE inside provider when nothing else specified', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.locale).toBe('it');
  });

  it('reads ?lang= from URL on first render', () => {
    window.history.replaceState({}, '', '/?lang=en');
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.locale).toBe('en');
  });

  it('reads localStorage when no query param present', () => {
    window.localStorage.setItem('heuresys.locale', 'en');
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.locale).toBe('en');
  });

  it('setLocale updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.locale).toBe('it');
    act(() => result.current.setLocale('en'));
    expect(result.current.locale).toBe('en');
    expect(window.localStorage.getItem('heuresys.locale')).toBe('en');
  });

  it('setLocale rejects invalid input silently', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    act(() => result.current.setLocale('fr' as 'it'));
    expect(result.current.locale).toBe('it'); // unchanged
  });
});

describe('pickBilingual', () => {
  it('picks IT field when locale=it', () => {
    expect(pickBilingual({ name_it: 'Casa', name_en: 'Home' }, 'name', 'it')).toBe('Casa');
  });

  it('picks EN field when locale=en', () => {
    expect(pickBilingual({ name_it: 'Casa', name_en: 'Home' }, 'name', 'en')).toBe('Home');
  });

  it('falls back to other locale when requested missing', () => {
    expect(pickBilingual({ name_en: 'Home' }, 'name', 'it')).toBe('Home');
  });

  it('falls back to legacy single-locale field', () => {
    expect(pickBilingual({ name: 'Casa' }, 'name', 'it')).toBe('Casa');
  });

  it('returns empty string when nothing matches', () => {
    expect(pickBilingual({}, 'name', 'it')).toBe('');
    expect(pickBilingual(null, 'name', 'it')).toBe('');
  });
});

describe('useTranslate', () => {
  it('uses active locale automatically', () => {
    const { result } = renderHook(
      () => {
        const t = useTranslate();
        return t({ name_it: 'Casa', name_en: 'Home' }, 'name');
      },
      { wrapper }
    );
    expect(result.current).toBe('Casa');
  });

  it('updates when locale changes', () => {
    const { result } = renderHook(
      () => {
        const { setLocale } = useLocale();
        const t = useTranslate();
        return { setLocale, value: t({ name_it: 'Casa', name_en: 'Home' }, 'name') };
      },
      { wrapper }
    );
    expect(result.current.value).toBe('Casa');
    act(() => result.current.setLocale('en'));
    expect(result.current.value).toBe('Home');
  });
});

describe('LocaleSwitcher', () => {
  it('renders 2 options (IT/EN) and respects active locale', () => {
    const { container } = render(
      <LocaleProvider>
        <LocaleSwitcher />
      </LocaleProvider>
    );
    const select = container.querySelector('select')!;
    expect(select.value).toBe('it');
    const opts = Array.from(container.querySelectorAll('option')).map((o) => o.value);
    expect(opts).toEqual(['it', 'en']);
  });

  it('triggers setLocale on change', () => {
    const { container, getByRole } = render(
      <LocaleProvider>
        <LocaleSwitcher />
        <Reader />
      </LocaleProvider>
    );
    const select = container.querySelector('select')!;
    fireEvent.change(select, { target: { value: 'en' } });
    expect(getByRole('paragraph').textContent).toBe('en');
  });
});

function Reader() {
  const { locale } = useLocale();
  return <p role="paragraph">{locale}</p>;
}
