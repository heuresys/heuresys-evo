import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AppShellClient } from './_components/AppShellClient';
import { PLACEHOLDER_NAV } from './_components/placeholder-nav';

/**
 * (app) route group layout — wraps all authenticated app routes with the
 * Heuresys AppShell (sidebar + topbar + user menu).
 *
 * Authenticated routes only: unauthenticated visitors are redirected to /login.
 *
 * Phase 14.SH FASE 1.7 — placeholder static nav. FASE 2 replaces this with
 * `getNavForUser(session)` (role-driven SIDEBAR_MAP).
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

  return (
    <AppShellClient
      user={{
        username: u.username ?? u.email ?? u.name ?? 'user',
        role: u.role ?? 'EMPLOYEE',
        tenantId: u.tenantId,
      }}
      nav={PLACEHOLDER_NAV}
    >
      {children}
    </AppShellClient>
  );
}
