'use client';

import * as React from 'react';
import {
  ThemeBuilderWizard,
  DEFAULT_THEME_STATE,
  exportTokensCss,
  type ThemeBuilderState,
} from '@heuresys/ui';
import { applyThemeToProject, setPreviewTheme, clearPreviewTheme } from './actions';

const DRAFT_KEY = 'heuresys.theme-studio.draft';

type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; label: string }
  | { kind: 'ok'; label: string }
  | { kind: 'err'; label: string };

export function BrandStudioClient() {
  const [initialState, setInitialState] = React.useState<ThemeBuilderState | null>(null);
  const [currentState, setCurrentState] = React.useState<ThemeBuilderState>(DEFAULT_THEME_STATE);
  const [status, setStatus] = React.useState<Status>({ kind: 'idle' });

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ThemeBuilderState;
        setInitialState(parsed);
        setCurrentState(parsed);
        return;
      }
    } catch {
      // Corrupted draft: fall through to default.
    }
    setInitialState(DEFAULT_THEME_STATE);
  }, []);

  React.useEffect(() => {
    if (initialState === null) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(currentState));
    } catch {
      // Quota exceeded or storage disabled: ignore silently in dev tool.
    }
  }, [currentState, initialState]);

  async function handlePreview() {
    setStatus({ kind: 'busy', label: 'Activating preview…' });
    try {
      await setPreviewTheme(exportTokensCss(currentState));
      setStatus({ kind: 'ok', label: 'Preview active. Reload any page to see it applied.' });
    } catch (err) {
      setStatus({ kind: 'err', label: (err as Error).message });
    }
  }

  async function handleClearPreview() {
    setStatus({ kind: 'busy', label: 'Clearing preview…' });
    try {
      await clearPreviewTheme();
      setStatus({ kind: 'ok', label: 'Preview cleared.' });
    } catch (err) {
      setStatus({ kind: 'err', label: (err as Error).message });
    }
  }

  async function handleApply() {
    setStatus({ kind: 'busy', label: 'Writing active-theme.css…' });
    try {
      const result = await applyThemeToProject(exportTokensCss(currentState));
      setStatus({ kind: 'ok', label: `Applied to ${result.path}. Reload to see changes.` });
    } catch (err) {
      setStatus({ kind: 'err', label: (err as Error).message });
    }
  }

  function handleResetDraft() {
    window.localStorage.removeItem(DRAFT_KEY);
    setInitialState(DEFAULT_THEME_STATE);
    setCurrentState(DEFAULT_THEME_STATE);
    setStatus({ kind: 'ok', label: 'Draft reset.' });
  }

  if (initialState === null) {
    return <div className="p-6 text-sm text-neutral-500">Loading draft…</div>;
  }

  const statusColor =
    status.kind === 'ok'
      ? 'text-green-700 bg-green-50 border-green-200'
      : status.kind === 'err'
        ? 'text-red-700 bg-red-50 border-red-200'
        : status.kind === 'busy'
          ? 'text-blue-700 bg-blue-50 border-blue-200'
          : 'text-neutral-500 bg-neutral-50 border-neutral-200';

  return (
    <div className="flex flex-col gap-4 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Brand Studio</h1>
          <p className="text-sm text-neutral-600">
            Dev tool — draft autosaved to localStorage. Use Preview to test on the site, or Apply to
            write tokens into the project.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={status.kind === 'busy'}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            Preview on site
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
            onClick={handleResetDraft}
            disabled={status.kind === 'busy'}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            Reset draft
          </button>
        </div>
      </header>

      {status.kind !== 'idle' ? (
        <div className={`rounded-md border px-3 py-2 text-sm ${statusColor}`} role="status">
          {status.label}
        </div>
      ) : null}

      <ThemeBuilderWizard
        initial={initialState}
        onChange={setCurrentState}
        onComplete={setCurrentState}
      />
    </div>
  );
}
