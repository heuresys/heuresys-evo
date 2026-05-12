'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="motion-button-press"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '2.25rem',
        padding: '0 1rem',
        borderRadius: 'var(--radius-3, 6px)',
        background: 'transparent',
        color: 'var(--danger, #d4525a)',
        border: '1px solid var(--danger, #d4525a)',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
      }}
      aria-label="Disconnetti questa sessione"
    >
      Disconnetti
    </button>
  );
}
