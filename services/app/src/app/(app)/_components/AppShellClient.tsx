'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, HeuresysWordmark, type AppShellNavItem } from '@heuresys/ui';
import { LocaleSwitcher } from '@/lib/i18n';
import type { NavSection } from '@/lib/navigation/types';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { buildAppShellNav } from './nav-builder';

export interface AppShellClientProps {
  /** Sections computed server-side via getNavForUser(session). */
  sections: NavSection[];
  user: { username: string; role: string; tenantId?: string };
  children: React.ReactNode;
}

/**
 * Client wrapper around `<AppShell />` that:
 * - converts the role-driven NavSection[] into the AppShellNavItem[] tree
 * - injects the active state from `usePathname()`
 * - wires the brand wordmark in the sidebar
 * - exposes a user menu in the topbar (sign-out)
 */
export function AppShellClient({ sections, user, children }: AppShellClientProps) {
  const pathname = usePathname();

  const nav = React.useMemo(() => {
    const tree = buildAppShellNav(sections);
    return decorateActive(tree, pathname ?? '');
  }, [sections, pathname]);

  return (
    <AppShell
      brand={<HeuresysWordmark variant="default" size="md" />}
      nav={nav}
      topbarRight={
        <>
          <LocaleSwitcher />
          <ThemeToggle />
          <UserMenu username={user.username} role={user.role} />
        </>
      }
    >
      {children}
    </AppShell>
  );
}

/**
 * Decorates each nav node with `active: true` if the current pathname matches
 * the node's href (or any of its descendants').
 */
function decorateActive(items: AppShellNavItem[], pathname: string): AppShellNavItem[] {
  return items.map((it) => {
    const childActive = it.children
      ? it.children.some((c) => c.href && matches(pathname, c.href))
      : false;
    const selfActive = !!it.href && matches(pathname, it.href);
    return {
      ...it,
      active: selfActive || childActive,
      children: it.children ? decorateActive(it.children, pathname) : undefined,
    };
  });
}

function matches(pathname: string, href: string): boolean {
  if (!pathname || !href) return false;
  // Strip query / hash
  const cleanHref = href.split('?')[0]!.split('#')[0]!;
  if (cleanHref === '/') return pathname === '/';
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}
