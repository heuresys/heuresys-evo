import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getNavForUser } from '@/lib/navigation';
import { AppShellClient } from './_components/AppShellClient';

/**
 * (app) route group layout — wraps all authenticated app routes with the
 * Heuresys AppShell (sidebar + topbar + user menu).
 *
 * Authenticated routes only: unauthenticated visitors are redirected to /login.
 *
 * Phase 14.SH FASE 2 — sidebar is now role-driven via `getNavForUser(session)`
 * pulling the SIDEBAR_MAP for the user's role (8 canonical evo roles).
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

  return (
    <AppShellClient
      user={{
        username: u.username ?? u.email ?? u.name ?? 'user',
        role: u.role ?? 'EMPLOYEE',
        tenantId: u.tenantId,
      }}
      sections={sections}
    >
      {children}
    </AppShellClient>
  );
}
