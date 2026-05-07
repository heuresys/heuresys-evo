import * as React from 'react';
import type { NavIconName } from '@/lib/navigation/types';

const ICON_PATHS: Record<NavIconName, string> = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  employees: 'M16 11a3 3 0 11-6 0 3 3 0 016 0zM3 19a6 6 0 1112 0v1H3v-1zm14 0a4 4 0 014-4v5h-4v-1z',
  capability: 'M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v7l10 5 10-5v-7l-10 5z',
  reviews: 'M5 3h14a2 2 0 012 2v14l-4-4H5a2 2 0 01-2-2V5a2 2 0 012-2zm3 6h8m-8 4h5',
  goals:
    'M12 2v4m0 12v4M2 12h4m12 0h4M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8m0-12.8l-2.8 2.8m-7.2 7.2l-2.8 2.8M12 8a4 4 0 100 8 4 4 0 000-8z',
  learning: 'M2 5l10-3 10 3-10 3-10-3zm0 6l10 3 10-3M2 17l10 3 10-3',
  analytics: 'M3 21V9m6 12V3m6 18v-9m6 9V13',
  compensation:
    'M12 2v20M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zm0 5c0 1.7 3.1 3 7 3s7-1.3 7-3M5 17c0 1.7 3.1 3 7 3s7-1.3 7-3',
  'org-chart':
    'M12 3v3m0 12v3M3 12h3m12 0h3M5 5h6v4H5V5zm8 8h6v4h-6v-4zM5 13h6v6H5v-6zm8-8h6v4h-6V5z',
  tenant: 'M3 21V7l9-4 9 4v14H3zm6-3h6m-6-4h6m-6-4h6',
  system: 'M12 2l9 4v6c0 5-3.5 9-9 10-5.5-1-9-5-9-10V6l9-4z',
  'users-admin': 'M16 11a3 3 0 11-6 0 3 3 0 016 0zM3 20v-2a4 4 0 014-4h8a4 4 0 014 4v2',
  audit: 'M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6zm0 0v6h6M9 13h6m-6 4h6',
  rbac: 'M9 12l2 2 4-4m-2-7a9 9 0 100 18 9 9 0 000-18z',
  integrations: 'M10 4l4 4-4 4 4 4-4 4M14 4l-4 4 4 4-4 4 4 4',
  ontology:
    'M5 21h14m-9-9a3 3 0 100-6 3 3 0 000 6zm6 6a3 3 0 100-6 3 3 0 000 6zm-12 0a3 3 0 100-6 3 3 0 000 6zM10 12l3-3m-7 9l3-3m6 3l-3-3',
  esco: 'M3 6h18M3 12h18M3 18h18',
  sap: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 3v18m-9-9h18',
  kg: 'M5 4h4v4H5V4zm10 0h4v4h-4V4zM5 16h4v4H5v-4zm10 0h4v4h-4v-4zM7 8v8m10-8v8M7 6h10M7 18h10',
  profile: 'M12 12a4 4 0 100-8 4 4 0 000 8zm0 2a8 8 0 00-8 8h16a8 8 0 00-8-8z',
  team: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m10-5a4 4 0 11-8 0 4 4 0 018 0zm-4 8a4 4 0 100-8 4 4 0 000 8z',
  settings:
    'M12 15a3 3 0 100-6 3 3 0 000 6zm9-3l-2-1.5V9l2-1.5-2-3.5-2.5 1L15 4l-1-2h-4l-1 2-1.5-1L5 6l2 1.5V9l-2 1.5 2 3.5 2.5-1L9 14l1 2h4l1-2 1.5 1 2.5-3.5z',
  showcase: 'M4 6h16M4 12h16M4 18h10',
};

/**
 * Stateless icon component used in the dynamic sidebar.
 * Server-renderable (no React hooks, no client effects).
 */
export function NavIcon({ name }: { name: NavIconName }) {
  const d = ICON_PATHS[name];
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
