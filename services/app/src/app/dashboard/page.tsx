import { headers } from 'next/headers';
import { auth, signOut } from '@/lib/auth';

/**
 * /dashboard — server component that calls the api-gateway /employees
 * endpoint, forwarding the inbound session cookie so the gateway can
 * authenticate the same caller.
 *
 * Cookie name `authjs.session-token` is the shared default of NextAuth v5
 * and @auth/express; AUTH_SECRET is also shared, so the gateway can decode
 * and validate the cookie without any extra round-trip.
 */
async function fetchEmployees(): Promise<{
  data: Array<{ id: string; first_name?: string | null; last_name?: string | null }>;
  total: number;
  nextCursor: string | null;
} | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8200';
  const cookie = (await headers()).get('cookie') ?? '';
  try {
    const res = await fetch(`${apiUrl}/employees?limit=10`, {
      headers: { cookie },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as Awaited<ReturnType<typeof fetchEmployees>>;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user as
    | { username?: string; role?: string; tenantId?: string }
    | undefined;

  const result = await fetchEmployees();

  async function doSignOut(): Promise<void> {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Signed in as <strong>{user?.username ?? 'unknown'}</strong>
            {user?.role ? <> · {user.role}</> : null}
            {user?.tenantId ? (
              <>
                {' '}
                · tenant <code className="text-xs">{user.tenantId.slice(0, 8)}…</code>
              </>
            ) : null}
          </p>
        </div>
        <form action={doSignOut}>
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-md border border-neutral-300 px-4 text-sm hover:bg-neutral-100"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Employees</h2>
        {result === null ? (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not reach api-gateway. Is it running on{' '}
            <code>{process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8200'}</code>?
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-neutral-500">
              {result.total} total · showing {result.data.length}
              {result.nextCursor ? ' · more available' : ''}
            </p>
            <ul className="mt-4 divide-y divide-neutral-200 rounded-md border border-neutral-200">
              {result.data.map((emp) => (
                <li key={emp.id} className="flex items-center gap-3 p-3 text-sm">
                  <span className="font-medium">
                    {[emp.first_name, emp.last_name].filter(Boolean).join(' ') || '(no name)'}
                  </span>
                  <code className="ml-auto text-xs text-neutral-400">{emp.id.slice(0, 8)}…</code>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
