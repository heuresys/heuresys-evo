'use server';

import { auth } from '@/lib/auth';
import { auditedTransaction } from '@/lib/audit/auditedTransaction';
import {
  isValidPaletteId,
  isValidTheme,
  type PaletteId,
  type ThemeMode,
} from '@/lib/theme-framework/palettes';

const PLATFORM_TENANT_FALLBACK_ENV = 'DEFAULT_SUPERUSER_TENANT_ID';

interface DashboardActor {
  id: string;
  username: string;
  email: string | null;
  role: string | null;
  tenantId: string;
}

async function requireAuthenticatedUser(): Promise<DashboardActor> {
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; email?: string; role?: string; tenantId?: string }
    | undefined;
  if (!user || !user.id) {
    throw new Error('Unauthorized: authenticated session required');
  }
  const tenantId = user.tenantId ?? process.env[PLATFORM_TENANT_FALLBACK_ENV] ?? '';
  if (!tenantId) {
    throw new Error('Forbidden: tenant context unavailable');
  }
  return {
    id: user.id,
    username: user.username ?? 'unknown',
    email: user.email ?? null,
    role: user.role ?? null,
    tenantId,
  };
}

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
  const actor = await requireAuthenticatedUser();

  await auditedTransaction(
    {
      tenantId: actor.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userRole: actor.role,
    },
    {
      action: 'UPDATE',
      category: 'USER',
      resourceType: 'user',
      resourceId: actor.id,
      resourceName: actor.username,
      description: `User palette preference updated to ${palette}/${theme}`,
      newValue: { palette_preference_id: palette, theme_preference: theme },
      metadata: { source: 'dashboard-palette-switcher' },
    },
    async (tx) => {
      return tx.users.update({
        where: { id: actor.id },
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
