import { LoginForm } from './login-form';

/**
 * /login — credentials sign-in.
 *
 * NextAuth v4 does not support `signIn` as a Server Action (the helper lives
 * in `next-auth/react` and runs client-side). The form is therefore a small
 * client island; the rest of the page is server-rendered.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Use your Heuresys credentials. Dev seed: <code>evo.dev</code> / <code>admin123</code>.
        </p>

        <LoginForm initialError={sp.error} />
      </div>
    </main>
  );
}
