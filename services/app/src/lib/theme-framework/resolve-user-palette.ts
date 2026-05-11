import { prisma } from '@/lib/db';
import {
  DEFAULT_PALETTE,
  DEFAULT_THEME,
  isValidPaletteId,
  isValidTheme,
  type PaletteId,
  type ThemeMode,
} from './palettes';
import { readActivePalette } from './active-palette-store';

/**
 * Resolves the active palette/theme for a user:
 *   1. project default (active-palette.json) as base
 *   2. user override (users.palette_preference_id + .theme_preference) if present
 *
 * Server-side. Used by:
 *   - (app)/layout.tsx → renders BrandShell topbar with switcher initial state
 *   - (app)/dashboard/layout.tsx → applies <html data-palette> for /dashboard/* scope
 */
export async function resolveUserPalette(
  userId: string | null | undefined
): Promise<{ palette: PaletteId; theme: ThemeMode }> {
  const project = await readActivePalette().catch(() => ({
    palette: DEFAULT_PALETTE,
    theme: DEFAULT_THEME,
  }));
  if (!userId) return project;
  // SAFE: self-read of own user palette preferences (where id = userId from
  // authenticated session). users table has no tenant_id column (L52, derived
  // via employee_id) — access is scoped to caller's own row by primary key.
  const u = await prisma.users.findUnique({
    where: { id: userId },
    select: { palette_preference_id: true, theme_preference: true },
  });
  return {
    palette:
      u?.palette_preference_id && isValidPaletteId(u.palette_preference_id)
        ? u.palette_preference_id
        : project.palette,
    theme:
      u?.theme_preference && isValidTheme(u.theme_preference) ? u.theme_preference : project.theme,
  };
}
