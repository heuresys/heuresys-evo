'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  FAMILY_ORDER,
  PALETTES,
  type PaletteFamily,
  type PaletteId,
  type ThemeMode,
} from '@/lib/theme-framework/palettes';
import { setUserPalette } from '@/lib/theme-framework/user-palette-action';

interface Props {
  initialPalette: PaletteId;
  initialTheme: ThemeMode;
}

/**
 * 3-swatch identity strip [bg | primary | accent].
 *   - As trigger: inherits CSS vars from <html data-palette> (current palette).
 *   - As popover grid item: scoped via data-palette attribute → each item
 *     resolves its own palette's CSS vars from palette-variants.css.
 */
function SwatchStrip({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 14 : 10;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        gap: 1,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid var(--rule)',
      }}
    >
      <span style={{ width: dim, height: dim, background: 'var(--bg)' }} />
      <span style={{ width: dim, height: dim, background: 'var(--primary)' }} />
      <span style={{ width: dim, height: dim, background: 'var(--accent)' }} />
    </span>
  );
}

/**
 * PaletteSwitcher — chrome-standard control rendered in the BrandShell topbar
 * (.nav-bar > .nav-right), as sibling of ThemeToggle.
 *
 * Visible on all (app)/* routes (universal chrome). The applied effect is
 * scoped to /dashboard/* via DashboardPaletteApplier (mounts <html data-palette>
 * only when user is under the dashboard subtree). Outside /dashboard the
 * preference is saved but visually inert.
 */
export function PaletteSwitcher({ initialPalette, initialTheme }: Props) {
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
    const html = document.documentElement;
    const wasDashboardScope =
      html.dataset.palette === prevPalette && html.dataset.theme === prevTheme;

    // Optimistic apply ONLY if user is currently in /dashboard scope (the
    // DashboardPaletteApplier sets the data-attributes there). Outside the
    // scope, persist the preference but leave the runtime DOM untouched.
    if (wasDashboardScope) {
      html.dataset.palette = newPalette;
      html.dataset.theme = newTheme;
    }
    setPalette(newPalette);
    setTheme(newTheme);
    setError(null);

    startTransition(async () => {
      try {
        await setUserPalette(newPalette, newTheme);
      } catch (err) {
        if (wasDashboardScope) {
          html.dataset.palette = prevPalette;
          html.dataset.theme = prevTheme;
        }
        setPalette(prevPalette);
        setTheme(prevTheme);
        setError(err instanceof Error ? err.message : 'Save failed');
      }
    });
  }

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Cambia palette dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          border: '1px solid var(--rule)',
          borderRadius: 6,
          background: 'transparent',
          cursor: 'pointer',
          opacity: isPending ? 0.5 : 1,
        }}
      >
        <SwatchStrip size="md" />
        <span aria-hidden="true" style={{ fontSize: 11, lineHeight: 1 }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Palette switcher"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            zIndex: 50,
            width: 280,
            borderRadius: 8,
            border: '1px solid var(--rule)',
            background: 'var(--surface-1)',
            padding: 12,
            boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
            color: 'var(--ink)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              padding: 2,
              border: '1px solid var(--rule)',
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            {(['dark', 'light'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => applyAndSave({ theme: mode })}
                aria-pressed={theme === mode}
                style={{
                  flex: 1,
                  padding: '4px 6px',
                  borderRadius: 4,
                  border: 'none',
                  fontSize: 11,
                  cursor: 'pointer',
                  background: theme === mode ? 'var(--accent)' : 'transparent',
                  color: theme === mode ? 'var(--surface-1)' : 'var(--ink)',
                }}
              >
                {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            ))}
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
            {FAMILY_ORDER.map((family: PaletteFamily) => {
              const items = PALETTES.filter((p) => p.family === family);
              if (items.length === 0) return null;
              return (
                <div key={family} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      color: 'var(--ink-muted)',
                      marginBottom: 4,
                    }}
                  >
                    {family}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {items.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyAndSave({ palette: p.id })}
                        aria-pressed={p.id === palette}
                        title={p.id}
                        data-palette={p.id}
                        data-theme={theme}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 4px',
                          borderRadius: 4,
                          border:
                            p.id === palette ? '1px solid var(--accent)' : '1px solid transparent',
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <SwatchStrip size="md" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <p style={{ marginTop: 8, fontSize: 11, color: 'var(--semantic-danger)' }} role="alert">
              {error}
            </p>
          )}
          {isPending && (
            <p style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-muted)' }}>
              Salvataggio in corso…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
