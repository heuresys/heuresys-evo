'use client';

import * as React from 'react';
import {
  PALETTES,
  FAMILY_ORDER,
  DEFAULT_ACTIVE_PALETTE,
  type ActivePaletteState,
  type PaletteId,
  type PaletteMeta,
  type ThemeMode,
} from '@/lib/theme-framework/palettes';
import { applyPaletteToProject, setPreviewPalette, clearPreviewPalette } from './actions';

type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; label: string }
  | { kind: 'ok'; label: string }
  | { kind: 'err'; label: string };

interface PalettePresetsTabProps {
  initial: ActivePaletteState;
}

const HTML_PALETTE_ATTR = 'data-palette';
const HTML_THEME_ATTR = 'data-theme';

export function PalettePresetsTab({ initial }: PalettePresetsTabProps) {
  const [state, setState] = React.useState<ActivePaletteState>(initial ?? DEFAULT_ACTIVE_PALETTE);
  const [status, setStatus] = React.useState<Status>({ kind: 'idle' });
  const [originalState] = React.useState<ActivePaletteState>(initial);

  // Live preview: write data-palette/data-theme on <html> as user clicks.
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(HTML_PALETTE_ATTR, state.palette);
    root.setAttribute(HTML_THEME_ATTR, state.theme);
  }, [state.palette, state.theme]);

  function selectPalette(id: PaletteId) {
    setState((prev) => ({ ...prev, palette: id }));
    setStatus({ kind: 'idle' });
  }

  function toggleTheme() {
    setState((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
    setStatus({ kind: 'idle' });
  }

  async function handleStagePreview() {
    setStatus({ kind: 'busy', label: 'Saving preview cookie…' });
    try {
      await setPreviewPalette(state.palette, state.theme);
      setStatus({
        kind: 'ok',
        label: `Preview saved (cookie). Reload any page to see ${state.palette} · ${state.theme}.`,
      });
    } catch (err) {
      setStatus({ kind: 'err', label: (err as Error).message });
    }
  }

  async function handleClearPreview() {
    setStatus({ kind: 'busy', label: 'Clearing preview cookie…' });
    try {
      await clearPreviewPalette();
      setStatus({ kind: 'ok', label: 'Preview cleared. File-backed palette restored.' });
    } catch (err) {
      setStatus({ kind: 'err', label: (err as Error).message });
    }
  }

  async function handleApply() {
    setStatus({ kind: 'busy', label: 'Writing active-palette.json…' });
    try {
      const result = await applyPaletteToProject(state.palette, state.theme);
      setStatus({
        kind: 'ok',
        label: `Applied: ${result.palette} · ${result.theme}. Reload to see project-wide.`,
      });
    } catch (err) {
      setStatus({ kind: 'err', label: (err as Error).message });
    }
  }

  function handleResetLocal() {
    setState(originalState);
    setStatus({ kind: 'ok', label: 'Local preview reverted to last saved state.' });
  }

  const statusColor =
    status.kind === 'ok'
      ? 'text-green-700 bg-green-50 border-green-200'
      : status.kind === 'err'
        ? 'text-red-700 bg-red-50 border-red-200'
        : status.kind === 'busy'
          ? 'text-blue-700 bg-blue-50 border-blue-200'
          : 'text-muted-foreground bg-neutral-50 border-neutral-200';

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Palette Presets</h2>
          <p className="text-sm text-muted-foreground">
            17 palette × 2 mode (dark + light) — click for live preview, then Apply to persist
            project-wide.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
          >
            Theme: {state.theme === 'dark' ? '◐ DARK' : '◑ LIGHT'}
          </button>
          <button
            type="button"
            onClick={handleStagePreview}
            disabled={status.kind === 'busy'}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            Save preview
          </button>
          <button
            type="button"
            onClick={handleClearPreview}
            disabled={status.kind === 'busy'}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            Clear preview
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={status.kind === 'busy'}
            className="rounded-md border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Apply to project
          </button>
          <button
            type="button"
            onClick={handleResetLocal}
            disabled={status.kind === 'busy'}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            Reset local
          </button>
        </div>
      </header>

      {status.kind !== 'idle' ? (
        <div className={`rounded-md border px-3 py-2 text-sm ${statusColor}`} role="status">
          {status.label}
        </div>
      ) : null}

      <div className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-mono text-muted-foreground">
        Live: <code>data-palette=&quot;{state.palette}&quot;</code> ·{' '}
        <code>data-theme=&quot;{state.theme}&quot;</code>
      </div>

      {FAMILY_ORDER.map((family) => {
        const palettes = PALETTES.filter((p) => p.family === family);
        return (
          <section key={family} className="flex flex-col gap-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {family}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {palettes.map((p) => (
                <PaletteCard
                  key={p.id}
                  meta={p}
                  active={p.id === state.palette}
                  onSelect={() => selectPalette(p.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

interface PaletteCardProps {
  meta: PaletteMeta;
  active: boolean;
  onSelect: () => void;
}

function PaletteCard({ meta, active, onSelect }: PaletteCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
        active
          ? 'flex items-center gap-2 rounded-md border-2 border-neutral-900 bg-neutral-50 px-3 py-2 text-left text-sm font-medium'
          : 'flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-sm font-medium hover:bg-neutral-50'
      }
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-neutral-200"
        style={{ background: meta.swatch }}
      />
      <span className="truncate">{meta.label}</span>
      {active ? (
        <span className="ml-auto rounded-sm bg-neutral-900 px-1 py-0.5 text-[10px] uppercase text-white">
          ON
        </span>
      ) : null}
    </button>
  );
}
