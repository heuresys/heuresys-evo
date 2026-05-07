import * as React from 'react';
import type { AppShellNavItem } from '@heuresys/ui';

/**
 * Placeholder nav (FASE 1.7) — replaced by `getNavForUser(session)` in FASE 2.
 * Kept minimal & static; mirrors the routes already implemented under (app)/.
 */
export const PLACEHOLDER_NAV: AppShellNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Icon path="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
  },
  {
    id: 'ontology',
    label: 'Ontology',
    href: '/ontology',
    icon: <Icon path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  },
  {
    id: 'explorer',
    label: 'Explorer',
    icon: <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    children: [
      { id: 'esco', label: 'ESCO tree', href: '/explorer/esco' },
      { id: 'sap', label: 'SAP sync', href: '/explorer/sap' },
      { id: 'kg', label: 'Knowledge graph', href: '/explorer/kg' },
    ],
  },
  {
    id: 'showcase',
    label: 'Components',
    href: '/showcase',
    icon: <Icon path="M4 6h16M4 12h16M4 18h16" />,
  },
];

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
