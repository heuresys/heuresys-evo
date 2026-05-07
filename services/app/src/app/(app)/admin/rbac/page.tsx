import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getServerLocale } from '@/lib/i18n/server';
import { hasMinRole } from '@heuresys/shared/rbp';

const STRINGS = {
  it: {
    title: 'Matrice RBAC',
    summary: (r: number, a: number) =>
      `${r} ruoli × ${a} aree funzionali · permessi: V=visualizza, A=approva, E=modifica, D=elimina`,
    loadError: 'Caricamento fallito:',
    empty: 'Nessun ruolo configurato.',
    thArea: 'Area funzionale',
  },
  en: {
    title: 'RBAC matrix',
    summary: (r: number, a: number) =>
      `${r} roles × ${a} functional areas · permissions: V=view, A=approve, E=edit, D=delete`,
    loadError: 'Could not load:',
    empty: 'No roles configured.',
    thArea: 'Functional area',
  },
} as const;

/**
 * /admin/rbac — RBAC matrix viewer (8 roles × 33+ functional areas).
 * SOURCE: rbp_roles + rbp_functional_areas + rbp_role_permissions joins.
 */
async function fetchRbacMatrix() {
  const [roles, areas, permissions] = await Promise.all([
    prisma.rbp_roles.findMany({
      orderBy: { hierarchy_level: 'asc' },
      select: { id: true, code: true, name: true, hierarchy_level: true },
    }),
    prisma.rbp_functional_areas.findMany({
      orderBy: { sort_order: 'asc' },
      select: { id: true, code: true, name: true, category: true },
    }),
    prisma.rbp_role_permissions.findMany({
      select: {
        role_id: true,
        functional_area_id: true,
        can_view: true,
        can_edit: true,
        can_delete: true,
        can_approve: true,
        can_export: true,
        scope_type: true,
      },
    }),
  ]);
  // Build a map: role_id × area_id → highest permission level
  const permLevel = (p: (typeof permissions)[number]): string => {
    if (p.can_delete) return 'D';
    if (p.can_edit) return 'E';
    if (p.can_approve) return 'A';
    if (p.can_view) return 'V';
    return '—';
  };
  const matrix = new Map<string, string>();
  for (const p of permissions) {
    matrix.set(`${p.role_id}:${p.functional_area_id}`, permLevel(p));
  }
  return { roles, areas, matrix };
}

const PERM_TONE: Record<string, string> = {
  D: 'rgba(239,68,68,0.20)',
  E: 'rgba(212,160,23,0.22)',
  A: 'rgba(94,105,209,0.22)',
  V: 'rgba(95,184,122,0.18)',
  '—': 'transparent',
};

export default async function RbacMatrixPage() {
  const locale = await getServerLocale();
  const t = STRINGS[locale];
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!hasMinRole(user, 'HR_DIRECTOR')) redirect('/dashboard');

  let data: Awaited<ReturnType<typeof fetchRbacMatrix>> = {
    roles: [],
    areas: [],
    matrix: new Map(),
  };
  let err: string | null = null;
  try {
    data = await fetchRbacMatrix();
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-full p-6">
      <header>
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.summary(data.roles.length, data.areas.length)}
        </p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t.loadError} <code>{err}</code>
          </p>
        ) : data.roles.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="sticky left-0 z-10 bg-muted p-2 text-left font-mono uppercase tracking-wide text-muted-foreground border-r border-border min-w-[200px]">
                    {t.thArea}
                  </th>
                  {data.roles.map((r) => (
                    <th
                      key={r.id}
                      className="p-2 text-center font-mono uppercase tracking-wide text-muted-foreground border-l border-border"
                      style={{ minWidth: 80 }}
                    >
                      {r.code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.areas.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="sticky left-0 z-10 bg-card p-2 border-r border-border text-xs">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-muted-foreground">{a.code}</div>
                    </td>
                    {data.roles.map((r) => {
                      const perm = data.matrix.get(`${r.id}:${a.id}`) ?? '—';
                      return (
                        <td key={r.id} className="p-1 text-center border-l border-border">
                          <span
                            className="inline-block w-7 h-6 rounded text-center font-mono font-bold"
                            style={{ background: PERM_TONE[perm], lineHeight: '24px' }}
                            aria-label={`${r.code} · ${a.code}: ${perm}`}
                          >
                            {perm}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
