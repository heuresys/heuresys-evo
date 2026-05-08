import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getNavForUser } from '@/lib/navigation';
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

  const displayName = u.name ?? u.username ?? u.email ?? 'User';
  const userInitials = deriveInitials(displayName);

  return (
    <BrandShell
      sections={sections}
      user={{
        username: u.username ?? u.email ?? u.name ?? 'user',
        role: u.role ?? 'EMPLOYEE',
        displayName,
        initials: userInitials,
      }}
      tenant={tenant}
      envLabel={process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'}
    >
      {children}
    </BrandShell>
  );
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
