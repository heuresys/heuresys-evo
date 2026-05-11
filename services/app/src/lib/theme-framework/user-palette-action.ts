'use server';

import { auth } from '@/lib/auth';
import { auditedTransaction } from '@/lib/audit/auditedTransaction';
import { isValidPaletteId, isValidTheme, type PaletteId, type ThemeMode } from './palettes';

const PLATFORM_TENANT_FALLBACK_ENV = 'DEFAULT_SUPERUSER_TENANT_ID';

/**
 * Per-user palette + theme preference. Saved in users.palette_preference_id /
 * users.theme_preference. Applied to /dashboard/* routes only (scope decision).
 *
 * Auth required (any logged-in user). Preference is scoped to the caller's
 * own row by session.user.id — no cross-user spoofing possible.
 *
 * Audit row (P4): action=UPDATE category=USER, resourceId = own user id.
 */
export async function setUserPalette(
  palette: PaletteId,
  theme: ThemeMode
): Promise<{ ok: true; palette: PaletteId; theme: ThemeMode }> {
  if (!isValidPaletteId(palette)) {
    throw new Error(`Invalid palette: ${String(palette)}`);
  }
  if (!isValidTheme(theme)) {
    throw new Error(`Invalid theme: ${String(theme)}`);
  }
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; email?: string; role?: string; tenantId?: string }
    | undefined;
  if (!user?.id) {
    throw new Error('Unauthorized: authenticated session required');
  }
  const tenantId = user.tenantId ?? process.env[PLATFORM_TENANT_FALLBACK_ENV] ?? '';
  if (!tenantId) {
    throw new Error('Forbidden: tenant context unavailable');
  }

  await auditedTransaction(
    {
      tenantId,
      userId: user.id,
      userEmail: user.email ?? null,
      userRole: user.role ?? null,
    },
    {
      action: 'UPDATE',
      category: 'USER',
      resourceType: 'user',
      resourceId: user.id,
      resourceName: user.username ?? user.email ?? user.id,
      description: `User palette preference updated to ${palette}/${theme}`,
      newValue: { palette_preference_id: palette, theme_preference: theme },
      metadata: { source: 'brandshell-palette-switcher' },
    },
    async (tx) => {
      // SAFE: self-update of own user palette preference (where id = session.user.id).
      // users table has no tenant_id column (L52, derived via employee_id); update
      // is scoped to caller's own row by primary key from authenticated session.
      return tx.users.update({
        where: { id: user.id },
        data: {
          palette_preference_id: palette,
          theme_preference: theme,
        },
        select: { id: true },
      });
    }
  );

  return { ok: true, palette, theme };
}
