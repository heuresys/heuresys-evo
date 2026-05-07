import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { getServerLocale } from '@/lib/i18n/server';
import { hasMinRole } from '@heuresys/shared/rbp';

const STRINGS = {
  it: {
    title: 'Percorsi formativi',
    fallbackTitle: 'Formazione',
    noTenant: 'Nessun contesto tenant.',
    summary: (n: number, m: number) => `${n} percorsi · ${m} iscrizioni totali`,
    loadError: 'Caricamento fallito:',
    empty: 'Nessun percorso.',
    target: 'target:',
  },
  en: {
    title: 'Learning paths',
    fallbackTitle: 'Learning',
    noTenant: 'No tenant context.',
    summary: (n: number, m: number) => `${n} paths · ${m} total enrollments`,
    loadError: 'Could not load:',
    empty: 'No paths.',
    target: 'target:',
  },
} as const;

async function fetchLearning(tenantId: string) {
  return withTenant(tenantId, async (tx) => {
    const [paths, enrollments] = await Promise.all([
      tx.learning_paths.findMany({
        where: { deleted_at: null },
        orderBy: { code: 'asc' },
        take: 50,
        select: { id: true, code: true, title: true, target_role: true, status: true },
      }),
      tx.course_enrollments.count(),
    ]);
    return { paths, total_enrollments: enrollments };
  });
}

export default async function LearningPage() {
  const locale = await getServerLocale();
  const t = STRINGS[locale];
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;
  if (!hasMinRole(user, 'HR_MANAGER')) redirect('/dashboard');
  if (!user?.tenantId)
    return (
      <main className="p-8">
        <h1>{t.fallbackTitle}</h1>
        <p>{t.noTenant}</p>
      </main>
    );

  let data: Awaited<ReturnType<typeof fetchLearning>> = { paths: [], total_enrollments: 0 };
  let err: string | null = null;
  try {
    data = await fetchLearning(user.tenantId);
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.summary(data.paths.length, data.total_enrollments)}
        </p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t.loadError} <code>{err}</code>
          </p>
        ) : data.paths.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {data.paths.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 text-sm"
              >
                <code className="text-xs text-muted-foreground">{p.code}</code>
                <div>
                  <div className="font-medium">{p.title}</div>
                  {p.target_role ? (
                    <div className="text-xs text-muted-foreground">
                      {t.target} {p.target_role}
                    </div>
                  ) : null}
                </div>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-foreground">
                  {p.status ?? 'active'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
