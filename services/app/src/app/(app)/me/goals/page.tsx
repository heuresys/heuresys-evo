import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { isAuthenticated } from '@heuresys/shared/rbp';

async function fetchMyGoals(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({ where: { id: userId }, select: { employee_id: true } });
    if (!u?.employee_id) return null;
    return tx.goals.findMany({
      where: { employee_id: u.employee_id },
      orderBy: { start_date: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        goal_type: true,
        status: true,
        progress_percent: true,
        start_date: true,
        due_date: true,
      },
    });
  });
}

export default async function MyGoalsPage() {
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; role?: string; tenantId?: string }
    | undefined;
  if (!isAuthenticated(user)) redirect('/login');
  if (!user?.id || !user?.tenantId)
    return (
      <main className="p-8">
        <h1>My goals</h1>
        <p className="text-sm text-destructive">No session context.</p>
      </main>
    );

  let goals: Awaited<ReturnType<typeof fetchMyGoals>> = null;
  let err: string | null = null;
  try {
    goals = await fetchMyGoals(user.tenantId, user.id);
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">My goals</h1>
        <p className="mt-1 text-sm text-muted-foreground">Owner: {user.username}</p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load: <code>{err}</code>
          </p>
        ) : !goals ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No employee record linked.
          </p>
        ) : goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active goals.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {goals.map((g) => {
              const pct = g.progress_percent != null ? Number(g.progress_percent) : 0;
              return (
                <li key={g.id} className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 text-sm">
                  <div>
                    <div className="font-medium">{g.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {g.goal_type ?? 'objective'} · status: {g.status ?? 'not_started'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{pct.toFixed(0)}%</div>
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
