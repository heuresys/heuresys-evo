import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getNavForUser } from '@/lib/navigation';
import { resolveUserPalette } from '@/lib/theme-framework/resolve-user-palette';
import { BrandShell, type BrandShellTenant } from './_components/BrandShell';

/**
 * (app) route group layout — wraps all authenticated app routes with the
 * brand-fedele BrandShell (μ-architect-legacy mockup direction).
 *
 * Authenticated routes only: unauthenticated visitors are redirected to /login.
 *
 * Phase 15.A — replaces the generic AppShell (Tailwind utility) with the
 * canonical brand chrome (.dashboard-shell + .nav-bar + .app + .sidebar +
 * .workspace + .app-footer).
 */
export default async function AppGroupLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const u = session.user as {
    username?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    tenantId?: string;
  };

  const sections = getNavForUser(session);

  // Tenant lookup (platform users have no tenant_id → fallback)
  let tenant: BrandShellTenant;
  if (u.tenantId) {
    const t = await prisma.tenants.findUnique({
      where: { id: u.tenantId },
      select: { name: true, code: true, status: true },
    });
    tenant = {
      name: t?.name ?? 'Tenant',
      meta: t ? `${t.code ?? ''}${t.status ? ` · ${t.status}` : ''}`.trim() : undefined,
      initials: deriveInitials(t?.name ?? 'Tenant'),
      shortId: u.tenantId.slice(0, 8),
    };
  } else {
    tenant = {
      name: 'Heuresys System',
      meta: 'PLATFORM · superuser scope',
      initials: 'HS',
    };
  }

  // P6 W#6 (L74): displayName preferenza name > nameFromEmail > username > 'User'.
  // Per utenti Credentials NextAuth (no name su DB), deriva full name dall'email
  // canonical convention 'first.last@domain' → 'First Last'.
  const emailDerivedName = u.email ? nameFromEmail(u.email) : null;
  const displayName = u.name ?? emailDerivedName ?? u.username ?? u.email ?? 'User';
  const userInitials = deriveInitials(displayName);
  const roleLevel = ROLE_LEVELS[u.role ?? 'EMPLOYEE'] ?? null;

  // Resolve user-scoped palette + theme (project default fallback if NULL)
  const userIdMaybe = (session.user as { id?: string }).id;
  const { palette, theme } = await resolveUserPalette(userIdMaybe);

  return (
    <BrandShell
      sections={sections}
      user={{
        username: u.username ?? u.email ?? u.name ?? 'user',
        role: u.role ?? 'EMPLOYEE',
        roleLevel,
        displayName,
        initials: userInitials,
      }}
      tenant={tenant}
      envLabel={process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'}
      initialPalette={palette}
      initialTheme={theme}
    >
      {children}
    </BrandShell>
  );
}

/**
 * P6 W#6 (L74): canonical role → level mapping (CLAUDE.md authoritative).
 * Used to render '{role} · level {N}' in BrandShell user-card (mockup-fedele).
 */
const ROLE_LEVELS: Record<string, number> = {
  SUPERUSER: -1,
  TENANT_OWNER: 0,
  IT_ADMIN: 1,
  HR_DIRECTOR: 2,
  HR_MANAGER: 3,
  DEPT_HEAD: 4,
  LINE_MANAGER: 5,
  EMPLOYEE: 6,
};

/**
 * P6 W#6 (L74): derive full name from canonical email convention
 * 'first.last@domain' → 'First Last'. Single-segment local-part fallback to
 * Title Case as-is. Used when session.user.name is null (NextAuth Credentials).
 */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  if (!local) return email;
  return local
    .split('.')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

function deriveInitials(name: string): string {
  const cleaned = name.replace(/[^A-Za-zÀ-ÿ\s]/g, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) return name.slice(0, 2).toUpperCase();
  if (!second) return first.slice(0, 2).toUpperCase();
  return ((first[0] ?? '') + (second[0] ?? '')).toUpperCase();
}
