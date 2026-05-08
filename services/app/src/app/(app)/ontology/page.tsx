/**
 * Phase 14 Sprint 2.F — /ontology page (RSC).
 *
 * Server-side ESCO occupation search (keyword ILIKE on preferred_label_en/it)
 * + advisor panel rendered client-side. Auth + RBP gate is enforced by the
 * advisor route handler — the page itself only requires authentication
 * (handled by the (auth) middleware on the dashboard layout group).
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isAdvisorEnabled } from '@/lib/ontology/openai-client';
import { OntologyAdvisor } from '@/components/ontology/OntologyAdvisor';

export const dynamic = 'force-dynamic';

interface OntologyPageProps {
  searchParams: Promise<{ q?: string; occ?: string }>;
}

export default async function OntologyPage({ searchParams }: OntologyPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/ontology');
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const selectedId = params.occ ?? null;

  const occupations = query
    ? await prisma.esco_occupations.findMany({
        where: {
          OR: [
            { preferred_label_en: { contains: query, mode: 'insensitive' } },
            { preferred_label_it: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          code: true,
          preferred_label_en: true,
          preferred_label_it: true,
          isco_code: true,
        },
        take: 20,
        orderBy: { preferred_label_en: 'asc' },
      })
    : [];

  const selected = selectedId
    ? await prisma.esco_occupations.findUnique({
        where: { id: selectedId },
        select: {
          id: true,
          code: true,
          preferred_label_en: true,
          preferred_label_it: true,
          description_en: true,
          isco_code: true,
        },
      })
    : null;

  const advisorEnabled = isAdvisorEnabled();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Ontology · ESCO knowledge graph</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search 3,040 ESCO occupations + 14,011 skills. Pick one to ask the OpenAI advisor for a
          workforce-planning recommendation.
        </p>
      </header>

      <form action="/ontology" method="get" className="mb-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search occupations (EN or IT)…"
          className="h-10 w-full rounded-md border border-neutral-300 px-3"
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
        >
          Search
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-medium">Results</h2>
          {!query && <p className="text-sm text-muted-foreground">Type a query to start.</p>}
          {query && occupations.length === 0 && (
            <p className="text-sm text-muted-foreground">No occupations matched “{query}”.</p>
          )}
          <ul className="space-y-1">
            {occupations.map((o) => {
              const isSelected = o.id === selectedId;
              return (
                <li key={o.id}>
                  <a
                    href={`/ontology?q=${encodeURIComponent(query)}&occ=${o.id}`}
                    className={`block rounded-md border px-3 py-2 text-sm ${
                      isSelected
                        ? 'border-primary bg-primary/5 font-medium'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                    data-testid="ontology-result"
                  >
                    <span className="font-medium">{o.preferred_label_en}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ESCO {o.code} · ISCO {o.isco_code}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Advisor</h2>
          {!selected ? (
            <p className="text-sm text-muted-foreground">
              Select an occupation to ask the advisor.
            </p>
          ) : (
            <OntologyAdvisor
              occupation={{
                id: selected.id,
                code: selected.code,
                labelEn: selected.preferred_label_en ?? '',
                labelIt: selected.preferred_label_it ?? '',
                descriptionEn: selected.description_en ?? '',
                iscoCode: selected.isco_code ?? '',
              }}
              advisorEnabled={advisorEnabled}
            />
          )}
        </section>
      </div>
    </main>
  );
}
