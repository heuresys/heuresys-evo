'use client';

import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface AppShellNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: React.ReactNode;
  children?: AppShellNavItem[];
}

export interface AppShellProps {
  brand?: React.ReactNode;
  nav: AppShellNavItem[];
  topbarLeft?: React.ReactNode;
  topbarRight?: React.ReactNode;
  children: React.ReactNode;
  collapsedDefault?: boolean;
  className?: string;
}

/**
 * AppShell — full app skeleton: collapsible sidebar + topbar + main content.
 * Hierarchical sidenav supports 2 levels. Mobile uses overlay drawer.
 * (TIER 1)
 */
export function AppShell({
  brand,
  nav,
  topbarLeft,
  topbarRight,
  children,
  collapsedDefault = false,
  className,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(collapsedDefault);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', className)}>
      {/* Sidebar (desktop) */}
      <aside
        className={cn(
          'hidden border-r border-border bg-muted/30 transition-all md:flex md:flex-col',
          collapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Primary navigation"
      >
        <div className="flex h-14 items-center border-b border-border px-3">
          {!collapsed ? <div className="flex-1 truncate text-sm font-semibold">{brand}</div> : null}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <NavList items={nav} collapsed={collapsed} />
        </nav>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background md:hidden"
            aria-label="Primary navigation (mobile)"
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-3">
              <div className="text-sm font-semibold">{brand}</div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              <NavList items={nav} collapsed={false} />
            </nav>
          </aside>
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-2 border-b border-border bg-background px-4">
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </Button>
          {topbarLeft}
          <div className="ml-auto flex items-center gap-2">{topbarRight}</div>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function NavList({ items, collapsed }: { items: AppShellNavItem[]; collapsed: boolean }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((it) => (
        <li key={it.id}>
          <NavItemRow item={it} collapsed={collapsed} />
        </li>
      ))}
    </ul>
  );
}

function NavItemRow({ item, collapsed }: { item: AppShellNavItem; collapsed: boolean }) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Tag = item.href ? 'a' : 'button';

  return (
    <>
      <Tag
        type={Tag === 'button' ? 'button' : undefined}
        href={item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setOpen((o) => !o);
          } else {
            item.onClick?.();
          }
        }}
        aria-current={item.active ? 'page' : undefined}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
          item.active ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-accent'
        )}
        title={collapsed ? item.label : undefined}
      >
        {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
        {!collapsed ? <span className="flex-1 truncate text-left">{item.label}</span> : null}
        {!collapsed && item.badge ? item.badge : null}
      </Tag>
      {hasChildren && open && !collapsed ? (
        <ul className="ml-6 mt-0.5 flex flex-col gap-0.5">
          {item.children!.map((c) => (
            <li key={c.id}>
              <NavItemRow item={c} collapsed={false} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
