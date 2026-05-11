import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  DEFAULT_PALETTE,
  DEFAULT_THEME,
  isValidPaletteId,
  isValidTheme,
  type PaletteId,
  type ThemeMode,
} from '@/lib/theme-framework/palettes';
import { readActivePalette } from '@/lib/theme-framework/active-palette-store';
import { DashboardHeader } from './_components/DashboardHeader';
import { DashboardPaletteApplier } from './_components/DashboardPaletteApplier';

/**
 * Layout for /dashboard/* routes. Reads the active project palette plus any
 * user-scoped override (users.palette_preference_id / theme_preference) and
 * applies the resolved values to <html> via DashboardPaletteApplier on mount.
 * On unmount the applier restores the project default so other routes are
 * unaffected.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const project = await readActivePalette().catch(() => ({
    palette: DEFAULT_PALETTE,
    theme: DEFAULT_THEME,
  }));

  let palette: PaletteId = project.palette;
  let theme: ThemeMode = project.theme;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (userId) {
    // SAFE: self-read of own user palette preferences (where id = session.user.id).
    // users table has no tenant_id column (L52, derived via employee_id); access
    // is scoped to the caller's own row by primary key — no cross-tenant risk.
    const u = await prisma.users.findUnique({
      where: { id: userId },
      select: { palette_preference_id: true, theme_preference: true },
    });
    if (u?.palette_preference_id && isValidPaletteId(u.palette_preference_id)) {
      palette = u.palette_preference_id;
    }
    if (u?.theme_preference && isValidTheme(u.theme_preference)) {
      theme = u.theme_preference;
    }
  }

  return (
    <>
      <DashboardPaletteApplier palette={palette} theme={theme} />
      <DashboardHeader initialPalette={palette} initialTheme={theme} />
      {children}
    </>
  );
}
