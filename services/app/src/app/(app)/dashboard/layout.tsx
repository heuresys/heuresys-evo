import { auth } from '@/lib/auth';
import { resolveUserPalette } from '@/lib/theme-framework/resolve-user-palette';
import { DashboardPaletteApplier } from './_components/DashboardPaletteApplier';

/**
 * /dashboard/* layout — scopes user-preference palette/theme application
 * via DashboardPaletteApplier (sets <html data-palette> on mount, restores
 * project default on unmount).
 *
 * The visible switcher control is rendered universally in the BrandShell
 * topbar (chrome standard, all (app)/* routes). This layout exists only to
 * apply the effect within /dashboard scope, as decided by user.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const { palette, theme } = await resolveUserPalette(userId);

  return (
    <>
      <DashboardPaletteApplier palette={palette} theme={theme} />
      {children}
    </>
  );
}
