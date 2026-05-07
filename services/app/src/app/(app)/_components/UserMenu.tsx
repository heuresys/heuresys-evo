'use client';

import * as React from 'react';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Button,
} from '@heuresys/ui';

export interface UserMenuProps {
  username: string;
  role: string;
}

/**
 * Extract user initials from `<tenant>.<first>.<last>` style usernames.
 * Examples:
 *   "rtl-bank.maria.colombo"     → "MC"  (skip tenant, first+last)
 *   "rtl-bank.federica.marchetti" → "FM"
 *   "sysadmin"                    → "SY"
 *   "evo.dev"                     → "ED"
 *   "admin"                       → "AD"
 */
export function computeInitials(username: string): string {
  const trimmed = username.trim();
  if (!trimmed) return 'U';
  const parts = trimmed.split(/[.\s_@]+/).filter(Boolean);
  // 3+ parts → assume <tenant>.<first>.<last…> pattern, take last 2
  if (parts.length >= 3) {
    const first = parts[parts.length - 2]?.[0] ?? '';
    const last = parts[parts.length - 1]?.[0] ?? '';
    return (first + last).toUpperCase() || 'U';
  }
  // 2 parts → first letter of each
  if (parts.length === 2) {
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U';
  }
  // 1 part → first 2 chars
  return trimmed.slice(0, 2).toUpperCase();
}

export function UserMenu({ username, role }: UserMenuProps) {
  const initials = React.useMemo(() => computeInitials(username), [username]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Account · ${username}`}>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 999,
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            {initials}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{username}</span>
            <span
              style={{
                fontSize: 11,
                color: 'var(--ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/login' })}>
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
