'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  FAMILY_ORDER,
  PALETTES,
  type PaletteFamily,
  type PaletteId,
  type ThemeMode,
} from '@/lib/theme-framework/palettes';
import { setUserPalette } from '../actions';

interface Props {
  initialPalette: PaletteId;
  initialTheme: ThemeMode;
}

export function PaletteSwitcherDropdown({ initialPalette, initialTheme }: Props) {
  const [palette, setPalette] = useState<PaletteId>(initialPalette);
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  function applyAndSave(next: { palette?: PaletteId; theme?: ThemeMode }) {
    const newPalette = next.palette ?? palette;
    const newTheme = next.theme ?? theme;
    if (newPalette === palette && newTheme === theme) return;

    const prevPalette = palette;
    const prevTheme = theme;

    // Optimistic apply to <html> dataset — runtime palette swap.
    document.documentElement.dataset.palette = newPalette;
    document.documentElement.dataset.theme = newTheme;
    setPalette(newPalette);
    setTheme(newTheme);
    setError(null);

    startTransition(async () => {
      try {
        await setUserPalette(newPalette, newTheme);
      } catch (err) {
        document.documentElement.dataset.palette = prevPalette;
        document.documentElement.dataset.theme = prevTheme;
        setPalette(prevPalette);
        setTheme(prevTheme);
        setError(err instanceof Error ? err.message : 'Save failed');
      }
    });
  }

  const currentMeta = PALETTES.find((p) => p.id === palette);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md border border-[var(--rule)] bg-[var(--surface-1)] px-3 py-1.5 text-sm hover:bg-[var(--surface-2)] disabled:opacity-50"
        disabled={isPending}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Cambia palette dashboard"
      >
        <span
          className="inline-block h-3 w-3 rounded-full border border-[var(--rule)]"
          style={{ background: currentMeta?.swatch ?? 'transparent' }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{currentMeta?.label ?? palette}</span>
        <span aria-hidden="true">{theme === 'dark' ? '🌙' : '☀️'}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Palette switcher"
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[var(--rule)] bg-[var(--surface-1)] p-3 shadow-xl"
        >
          <div className="mb-3 flex gap-1 rounded-md border border-[var(--rule)] p-0.5">
            {(['dark', 'light'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => applyAndSave({ theme: mode })}
                aria-pressed={theme === mode}
                className={`flex-1 rounded px-2 py-1 text-xs ${
                  theme === mode
                    ? 'bg-[var(--accent)] text-[var(--surface-1)]'
                    : 'hover:bg-[var(--surface-2)]'
                }`}
              >
                {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            ))}
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto">
            {FAMILY_ORDER.map((family: PaletteFamily) => {
              const items = PALETTES.filter((p) => p.family === family);
              if (items.length === 0) return null;
              return (
                <div key={family}>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    {family}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {items.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyAndSave({ palette: p.id })}
                        aria-pressed={p.id === palette}
                        className={`flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[var(--surface-2)] ${
                          p.id === palette ? 'ring-1 ring-[var(--accent)]' : ''
                        }`}
                        title={p.id}
                      >
                        <span
                          className="inline-block h-3 w-3 flex-shrink-0 rounded-full border border-[var(--rule)]"
                          style={{ background: p.swatch }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <p className="mt-2 text-xs text-[var(--semantic-danger)]" role="alert">
              {error}
            </p>
          )}
          {isPending && (
            <p className="mt-2 text-xs text-[var(--ink-muted)]">Salvataggio in corso…</p>
          )}
        </div>
      )}
    </div>
  );
}
