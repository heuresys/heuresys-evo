'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';

/**
 * Client island that wraps NextAuth v4's `signIn` from next-auth/react.
 * Emits an `error` query string on failure so the server-rendered shell
 * can render an inline error.
 */
export function LoginForm({ initialError }: { initialError?: string }) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get('username') ?? '');
    const password = String(fd.get('password') ?? '');
    startTransition(async () => {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });
      if (res?.ok && res.url) {
        window.location.href = res.url;
      } else {
        setError(res?.error ?? 'CredentialsSignin');
      }
    });
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Username</span>
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            className="h-9 rounded-md border border-neutral-300 px-3"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-9 rounded-md border border-neutral-300 px-3"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Sign-in failed: {error}
        </p>
      ) : null}
    </>
  );
}
