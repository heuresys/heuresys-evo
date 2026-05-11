'use client';

import { useEffect, useRef } from 'react';
import type { PaletteId, ThemeMode } from '@/lib/theme-framework/palettes';

interface Props {
  palette: PaletteId | null;
  theme: ThemeMode | null;
}

/**
 * Applies user-preference palette/theme to <html> when mounted under /dashboard/*.
 * Restores the previous (project default) values on unmount so navigating away
 * from /dashboard reverts to the project-wide palette.
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
      const html = document.documentElement;
      const prev = prevRef.current;
      if (!prev) return;
      if (prev.palette !== null) html.dataset.palette = prev.palette;
      else delete html.dataset.palette;
      if (prev.theme !== null) html.dataset.theme = prev.theme;
      else delete html.dataset.theme;
    };
  }, [palette, theme]);

  return null;
}
