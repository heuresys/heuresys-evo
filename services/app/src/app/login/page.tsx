import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

/**
 * /login — server-rendered credentials form. The form posts to a server
 * action that wraps `signIn('credentials', ...)`. On success, NextAuth
 * sets the session cookie and we redirect to /dashboard.
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  async function authenticate(formData: FormData): Promise<void> {
    'use server';
    try {
      await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirectTo: '/dashboard',
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/login?error=${encodeURIComponent(err.type)}`);
      }
      throw err;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Use your Heuresys credentials. Dev seed: <code>evo.dev</code> /{' '}
          <code>admin123</code>.
        </p>

        <form action={authenticate} className="mt-6 flex flex-col gap-4">
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
            className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary/90"
          >
            Sign in
          </button>
        </form>

        <SearchError searchParams={searchParams} />
      </div>
    </main>
  );
}

async function SearchError({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  if (!sp.error) return null;
  return (
    <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      Sign-in failed: {sp.error}
    </p>
  );
}
