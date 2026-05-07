'use client';

import { useTransition } from 'react';
import { signOut } from 'next-auth/react';

/**
 * Client island that wraps NextAuth v4's `signOut` from next-auth/react.
 * v4 does not provide a Server-Action signOut helper.
 */
export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() =>
        startTransition(() => {
          void signOut({ callbackUrl: '/' });
        })
      }
      disabled={isPending}
      className="inline-flex h-9 items-center rounded-md border border-neutral-300 px-4 text-sm hover:bg-neutral-100 disabled:opacity-60"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
