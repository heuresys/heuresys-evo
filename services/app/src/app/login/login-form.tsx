'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';

/**
 * Client island wrapping NextAuth v4's `signIn` from next-auth/react.
 * Aurora-styled form aligned to .ux-design/06-mockups/auth/login-aurora.html.
 *
 * Hydration-safe: form has no `action`/`method`, and the submit handler
 * always preventDefaults — preventing native GET submission if Playwright
 * (or a user) clicks before React hydrates.
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
    <form onSubmit={onSubmit} className="auth-form" noValidate aria-busy={isPending}>
      <div className="field">
        <label className="field-label" htmlFor="username">
          Email aziendale
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          placeholder="maria.chro@rtl-bank.it"
          className="field-input"
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••••"
          className="field-input"
        />
      </div>

      <div className="field-row">
        <label className="checkbox-label">
          <input type="checkbox" name="remember" />
          <span>Ricordami su questo dispositivo</span>
        </label>
        <a href="/forgot-password" className="forgot-link">
          Password dimenticata?
        </a>
      </div>

      <button type="submit" disabled={isPending} className="btn btn-primary">
        {isPending ? 'Accesso in corso…' : 'Accedi'}
      </button>

      {error ? (
        <p className="auth-error" role="alert">
          Accesso fallito: {error}
        </p>
      ) : null}
    </form>
  );
}
