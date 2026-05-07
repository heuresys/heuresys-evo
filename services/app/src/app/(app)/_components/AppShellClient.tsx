'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, HeuresysWordmark, type AppShellNavItem } from '@heuresys/ui';
import { UserMenu } from './UserMenu';

export interface AppShellClientProps {
  nav: AppShellNavItem[];
  user: { username: string; role: string; tenantId?: string };
  children: React.ReactNode;
}

/**
 * Client wrapper around `<AppShell />` that:
 * - injects the active state from `usePathname()`
 * - wires the brand wordmark in the sidebar
 * - exposes a user menu in the topbar (sign-out)
 *
 * The nav tree is computed server-side (per-role) and serialized as
 * plain props — no client-side role lookup happens here.
 */
export function AppShellClient({ nav, user, children }: AppShellClientProps) {
  const pathname = usePathname();
  const decoratedNav = React.useMemo(() => decorateActive(nav, pathname ?? ''), [nav, pathname]);

  return (
    <AppShell
      brand={<HeuresysWordmark variant="default" size="md" />}
      nav={decoratedNav}
      topbarRight={<UserMenu username={user.username} role={user.role} />}
    >
      {children}
    </AppShell>
  );
}

function decorateActive(items: AppShellNavItem[], pathname: string): AppShellNavItem[] {
  return items.map((it) => {
    const childActive = it.children
      ? it.children.some((c) => c.href && pathname.startsWith(c.href))
      : false;
    const selfActive = !!it.href && (pathname === it.href || pathname.startsWith(`${it.href}/`));
    return {
      ...it,
      active: selfActive || childActive,
      children: it.children ? decorateActive(it.children, pathname) : undefined,
    };
  });
}
