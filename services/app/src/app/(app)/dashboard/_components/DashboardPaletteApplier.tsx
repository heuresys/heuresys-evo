'use client';

import { useEffect, useRef } from 'react';
import type { PaletteId, ThemeMode } from '@/lib/theme-framework/palettes';

interface Props {
  palette: PaletteId | null;
  theme: ThemeMode | null;
}

/**
 * Scopes user-preference palette/theme application to /dashboard/* routes:
 * sets <html data-palette={X} data-theme={Y}> on mount, restores the
 * previous (project default) values on unmount so navigating away from
 * /dashboard reverts to the project-wide palette.
 *
 * The switcher control itself lives in BrandShell topbar (chrome standard),
 * visible on all (app)/* routes. Only the runtime effect is dashboard-scoped.
 */
export function DashboardPaletteApplier({ palette, theme }: Props) {
  const prevRef = useRef<{ palette: string | null; theme: string | null } | null>(null);

  useEffect(() => {
    if (!palette && !theme) return;
    const html = document.documentElement;
    prevRef.current = {
      palette: html.dataset.palette ?? null,
      theme: html.dataset.theme ?? null,
    };
    if (palette) html.dataset.palette = palette;
    if (theme) html.dataset.theme = theme;

    return () => {
      const root = document.documentElement;
      const prev = prevRef.current;
      if (!prev) return;
      if (prev.palette !== null) root.dataset.palette = prev.palette;
      else delete root.dataset.palette;
      if (prev.theme !== null) root.dataset.theme = prev.theme;
      else delete root.dataset.theme;
    };
  }, [palette, theme]);

  return null;
}
