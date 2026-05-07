import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { getServerLocale } from '@/lib/i18n/server';
import { hasMinRole } from '@heuresys/shared/rbp';

const STRINGS = {
  it: {
    title: 'Obiettivi',
    noTenant: 'Nessun contesto tenant.',
    tenantScope: (id: string) => `Obiettivi tenant · ${id}…`,
    loadError: 'Caricamento fallito:',
    empty: 'Nessun obiettivo.',
    counter: (n: number) => `${n} obiettivi`,
  },
  en: {
    title: 'Goals',
    noTenant: 'No tenant context.',
    tenantScope: (id: string) => `Tenant goals · ${id}…`,
    loadError: 'Could not load:',
    empty: 'No goals.',
    counter: (n: number) => `${n} goals`,
  },
} as const;

async function fetchGoals(tenantId: string) {
  return withTenant(tenantId, (tx) =>
    tx.goals.findMany({
      where: {},
      orderBy: { start_date: 'desc' },
      take: 100,
      select: {
        id: true,
        title: true,
        goal_type: true,
        status: true,
        progress_percent: true,
        start_date: true,
        due_date: true,
        employee_id: true,
      },
    })
  );
}

const STATUS_COLOR: Record<string, string> = {
  achieved: '#5fb87a',
  on_track: '#3b82f6',
  at_risk: '#d4a017',
  off_track: '#ef4444',
  not_started: '#8a8e9b',
};

export default async function GoalsPage() {
  const locale = await getServerLocale();
  const t = STRINGS[locale];
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;
  if (!hasMinRole(user, 'HR_MANAGER')) redirect('/dashboard');
  if (!user?.tenantId)
    return (
      <main className="p-8">
        <h1>{t.title}</h1>
        <p>{t.noTenant}</p>
      </main>
    );

  let goals: Awaited<ReturnType<typeof fetchGoals>> = [];
  let err: string | null = null;
  try {
    goals = await fetchGoals(user.tenantId);
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.tenantScope(user.tenantId.slice(0, 8))}
        </p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t.loadError} <code>{err}</code>
          </p>
        ) : goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">{t.counter(goals.length)}</p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {goals.map((g) => {
                const pct = g.progress_percent != null ? Number(g.progress_percent) : 0;
                const color = STATUS_COLOR[g.status ?? 'not_started'] ?? '#8a8e9b';
                return (
                  <li
                    key={g.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{g.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {g.goal_type ?? 'objective'} ·{' '}
                        {g.start_date?.toISOString().slice(0, 10) ?? '—'} →{' '}
                        {g.due_date?.toISOString().slice(0, 10) ?? '—'}
                      </div>
                    </div>
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }}
                      />
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ background: `${color}33`, color }}
                    >
                      {g.status ?? 'not_started'}
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
