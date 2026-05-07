import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { isAuthenticated } from '@heuresys/shared/rbp';

async function fetchMyLearning(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({ where: { id: userId }, select: { employee_id: true } });
    if (!u?.employee_id) return null;
    return tx.course_enrollments.findMany({
      where: { employee_id: u.employee_id },
      orderBy: { enrolled_at: 'desc' },
      take: 50,
      select: {
        id: true,
        status: true,
        enrollment_source: true,
        enrolled_at: true,
        progress_percent: true,
        course_id: true,
      },
    });
  });
}

const STATUS_TONE: Record<string, string> = {
  completed: 'rgba(95,184,122,0.18)',
  in_progress: 'rgba(94,105,209,0.18)',
  enrolled: 'rgba(138,142,155,0.18)',
};

export default async function MyLearningPage() {
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; role?: string; tenantId?: string }
    | undefined;
  if (!isAuthenticated(user)) redirect('/login');
  if (!user?.id || !user?.tenantId)
    return (
      <main className="p-8">
        <h1>My learning</h1>
        <p className="text-sm text-destructive">No session context.</p>
      </main>
    );

  let enrollments: Awaited<ReturnType<typeof fetchMyLearning>> = null;
  let err: string | null = null;
  try {
    enrollments = await fetchMyLearning(user.tenantId, user.id);
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">My learning</h1>
        <p className="mt-1 text-sm text-muted-foreground">Learner: {user.username}</p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load: <code>{err}</code>
          </p>
        ) : !enrollments ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No employee record linked.
          </p>
        ) : enrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No course enrollments yet.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">{enrollments.length} enrollments</p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {enrollments.map((e) => {
                const pct = e.progress_percent != null ? Number(e.progress_percent) : 0;
                return (
                  <li
                    key={e.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
                  >
                    <div>
                      <code className="text-xs">course {e.course_id?.slice(0, 8) ?? '—'}…</code>
                      <div className="text-xs text-muted-foreground">
                        enrolled {e.enrolled_at?.toISOString().slice(0, 10) ?? '—'} ·{' '}
                        {e.enrollment_source ?? 'self'}
                      </div>
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: STATUS_TONE[e.status ?? 'enrolled'] ?? STATUS_TONE.enrolled,
                      }}
                    >
                      {e.status ?? 'enrolled'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
