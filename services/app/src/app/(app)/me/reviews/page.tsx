import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { getServerLocale } from '@/lib/i18n/server';
import { isAuthenticated } from '@heuresys/shared/rbp';

const STRINGS = {
  it: {
    title: 'Le mie review',
    noSession: 'Nessun contesto sessione.',
    reviewee: (n: string) => `Reviewee: ${n}`,
    loadError: 'Caricamento fallito:',
    noLink: 'Nessun record dipendente collegato.',
    empty: 'Ancora nessuna review.',
  },
  en: {
    title: 'My reviews',
    noSession: 'No session context.',
    reviewee: (n: string) => `Reviewee: ${n}`,
    loadError: 'Could not load:',
    noLink: 'No employee record linked.',
    empty: 'No reviews yet.',
  },
} as const;

async function fetchMyReviews(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({ where: { id: userId }, select: { employee_id: true } });
    if (!u?.employee_id) return null;
    return tx.performance_reviews.findMany({
      where: { employee_id: u.employee_id },
      orderBy: { review_period_end: 'desc' },
      take: 50,
      select: {
        id: true,
        review_type: true,
        review_period_start: true,
        review_period_end: true,
        overall_rating: true,
        status: true,
      },
    });
  });
}

export default async function MyReviewsPage() {
  const locale = await getServerLocale();
  const t = STRINGS[locale];
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; role?: string; tenantId?: string }
    | undefined;
  if (!isAuthenticated(user)) redirect('/login');
  if (!user?.id || !user?.tenantId)
    return (
      <main className="p-8">
        <h1>{t.title}</h1>
        <p className="text-sm text-destructive">{t.noSession}</p>
      </main>
    );

  let reviews: Awaited<ReturnType<typeof fetchMyReviews>> = null;
  let err: string | null = null;
  try {
    reviews = await fetchMyReviews(user.tenantId, user.id);
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.reviewee(user.username ?? '')}</p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t.loadError} <code>{err}</code>
          </p>
        ) : !reviews ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            {t.noLink}
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
              >
                <div>
                  <div className="font-medium">{r.review_type ?? 'annual'}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.review_period_start?.toISOString().slice(0, 10)} →{' '}
                    {r.review_period_end?.toISOString().slice(0, 10)}
                  </div>
                </div>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium">
                  {r.status ?? 'draft'}
                </span>
                <span className="font-mono text-sm">
                  {r.overall_rating != null ? Number(r.overall_rating).toFixed(2) : '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
