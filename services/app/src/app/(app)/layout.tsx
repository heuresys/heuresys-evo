import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma, withTenant } from '@/lib/db';
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

  // P6 W#6 (L74): displayName preferenza nameFromEmail per email canonical
  // 'first.last@domain' (NextAuth Credentials popola u.name = email che è
  // illeggibile in user-card). Cascade: nameFromEmail > nice u.name > username > email.
  const emailDerivedName = u.email ? nameFromEmail(u.email) : null;
  const looksLikeEmail = (s: string | null | undefined) => !!s && s.includes('@');
  const niceUname = !looksLikeEmail(u.name) ? u.name : null;
  const displayName = emailDerivedName ?? niceUname ?? u.username ?? u.email ?? 'User';
  const userInitials = deriveInitials(displayName);
  const roleLevel = ROLE_LEVELS[u.role ?? 'EMPLOYEE'] ?? null;

  // Resolve user-scoped palette + theme (project default fallback if NULL)
  const userIdMaybe = (session.user as { id?: string }).id;
  const { palette, theme } = await resolveUserPalette(userIdMaybe);

  // P6 W#7-bis (L75 CF#5): footer metric live (cycle + reviews completion %).
  // Cycle string derived TS-side da NOW() (no DB query — robust anche senza
  // active review_cycles row). ReviewsPct via aggregator SQL su tenant.
  const footerMetrics = await getFooterMetrics(u.tenantId ?? null);

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
 * P6 W#7-bis (L75 CF#5): footer metric live derivation. Returns cycle name
 * (TS-derived `Q{1-4} {year}`) + reviewsPct (SQL aggregator
 * review_cycle_participants completion rate per tenant). Returns null fields
 * for platform users (no tenantId) — BrandShell hides the ctx-items.
 */
async function getFooterMetrics(
  tenantId: string | null
): Promise<{ cycle: string; reviewsPct: number | null }> {
  const now = new Date();
  const quarter = Math.floor(now.getUTCMonth() / 3) + 1;
  const cycle = `Q${quarter} ${now.getUTCFullYear()}`;

  if (!tenantId) return { cycle, reviewsPct: null };

  try {
    const rows = await withTenant(tenantId, async (tx) => {
      return tx.$queryRaw<Array<{ pct: number | null }>>`
        WITH cur AS (
          SELECT
            COUNT(*) FILTER (WHERE status = 'completed')::int AS done,
            COUNT(*)::int AS total
          FROM review_cycle_participants
          WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
        SELECT CASE WHEN total > 0 THEN ROUND(100.0 * done / total)::int ELSE NULL END AS pct
        FROM cur
      `;
    });
    const pctRaw = rows?.[0]?.pct;
    return {
      cycle,
      reviewsPct: typeof pctRaw === 'number' ? pctRaw : null,
    };
  } catch {
    return { cycle, reviewsPct: null };
  }
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
