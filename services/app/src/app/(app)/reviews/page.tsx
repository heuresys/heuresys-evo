import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { getServerLocale } from '@/lib/i18n/server';
import { hasMinRole } from '@heuresys/shared/rbp';

const STRINGS = {
  it: {
    title: 'Cicli di valutazione',
    fallbackTitle: 'Valutazioni',
    noTenant: 'Nessun contesto tenant.',
    tenantScope: (id: string) => `Ambito tenant · ${id}…`,
    loadError: 'Caricamento valutazioni fallito:',
    empty: 'Nessuna valutazione nel perimetro.',
    counter: (n: number) => `${n} valutazioni`,
    thPeriod: 'Periodo',
    thType: 'Tipo',
    thStatus: 'Stato',
    thRating: 'Punteggio',
  },
  en: {
    title: 'Performance reviews',
    fallbackTitle: 'Reviews',
    noTenant: 'No tenant context.',
    tenantScope: (id: string) => `Tenant scope · ${id}…`,
    loadError: 'Could not load reviews:',
    empty: 'No reviews in scope.',
    counter: (n: number) => `${n} reviews`,
    thPeriod: 'Period',
    thType: 'Type',
    thStatus: 'Status',
    thRating: 'Rating',
  },
} as const;

async function fetchReviews(tenantId: string) {
  // P11 + S59 P1 fix: WHERE tenant_id esplicito.
  // L'utente DB `heuresys` ha rolbypassrls=true → RLS bypassed. Filtro mandatory.
  return withTenant(tenantId, (tx) =>
    tx.performance_reviews.findMany({
      where: { tenant_id: tenantId },
      orderBy: { review_period_end: 'desc' },
      take: 100,
      select: {
        id: true,
        employee_id: true,
        reviewer_id: true,
        review_type: true,
        review_period_start: true,
        review_period_end: true,
        overall_rating: true,
        status: true,
      },
    })
  );
}

const STATUS_TONE: Record<string, string> = {
  completed: 'rgba(95,184,122,0.18)',
  in_progress: 'rgba(94,105,209,0.18)',
  draft: 'rgba(138,142,155,0.18)',
};

export default async function ReviewsPage() {
  const locale = await getServerLocale();
  const t = STRINGS[locale];
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;
  if (!hasMinRole(user, 'HR_MANAGER')) redirect('/dashboard');
  if (!user?.tenantId) {
    return (
      <main className="p-8">
        <h1>{t.fallbackTitle}</h1>
        <p>{t.noTenant}</p>
      </main>
    );
  }

  let reviews: Awaited<ReturnType<typeof fetchReviews>> = [];
  let err: string | null = null;
  try {
    reviews = await fetchReviews(user.tenantId);
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
            {t.loadError} <span className="text-xs opacity-70">(errore tecnico registrato)</span>
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">{t.counter(reviews.length)}</p>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left font-mono">{t.thPeriod}</th>
                    <th className="p-2 text-left font-mono">{t.thType}</th>
                    <th className="p-2 text-left font-mono">{t.thStatus}</th>
                    <th className="p-2 text-right font-mono">{t.thRating}</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-2 font-mono text-xs">
                        {r.review_period_start?.toISOString().slice(0, 10)} →{' '}
                        {r.review_period_end?.toISOString().slice(0, 10)}
                      </td>
                      <td className="p-2 text-xs">{r.review_type ?? '—'}</td>
                      <td className="p-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: STATUS_TONE[r.status ?? 'draft'] ?? STATUS_TONE.draft,
                          }}
                        >
                          {r.status ?? 'draft'}
                        </span>
                      </td>
                      <td className="p-2 text-right font-mono">
                        {r.overall_rating != null ? Number(r.overall_rating).toFixed(2) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
