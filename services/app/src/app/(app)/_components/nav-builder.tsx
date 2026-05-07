import * as React from 'react';
import type { AppShellNavItem } from '@heuresys/ui';
import type { NavSection, NavItem } from '@/lib/navigation/types';
import { NavIcon } from './nav-icons';

/**
 * Convert a server-computed NavSection[] into the AppShellNavItem[] tree
 * consumed by `<AppShell>`.
 *
 * Strategy: each section becomes a top-level group (parent NavItem with no
 * href + section's items as children). AppShell expands/collapses on click.
 * The section is rendered as a non-link group with the title as label.
 */
export function buildAppShellNav(sections: NavSection[]): AppShellNavItem[] {
  return sections.map((sec) => ({
    id: `section-${sec.id}`,
    label: sec.title,
    icon: sectionIcon(sec.id),
    children: sec.items.map(toAppShellLeaf),
  }));
}

function toAppShellLeaf(item: NavItem): AppShellNavItem {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    badge: item.badge ? <Badge>{item.badge}</Badge> : undefined,
  };
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 6px',
        borderRadius: 999,
        background: 'var(--accent-soft)',
        color: 'var(--accent)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: 0.4,
      }}
    >
      {children}
    </span>
  );
}

function sectionIcon(id: string): React.ReactNode {
  // Map well-known section ids to representative icons
  switch (id) {
    case 'workspace':
      return <NavIcon name="dashboard" />;
    case 'ontology':
      return <NavIcon name="ontology" />;
    case 'system':
      return <NavIcon name="system" />;
    case 'self':
      return <NavIcon name="profile" />;
    case 'team':
      return <NavIcon name="team" />;
    default:
      return <NavIcon name="dashboard" />;
  }
}
