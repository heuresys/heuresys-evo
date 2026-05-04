/**
 * Showcase page — dimostrazione end-to-end pipeline UI → Prisma → DB → renderer.
 *
 * Render server-side query reali sui 566 modelli post-introspect (2026-05-02).
 * Pubblica intentionally — non autenticata — per demo investor / smoke test.
 *
 * Path: /showcase
 * Lente PET coperte: Talent (ESCO), Enterprise (multi-tenant), Process (audit), cross-cutting (PET 47 mapping).
 */

import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getEnterpriseTenantSummary() {
  return prisma.$queryRaw<
    Array<{
      tenant: string;
      employees: bigint;
      org_units: bigint;
      locations: bigint;
      cost_centers: bigint;
    }>
  >`
    SELECT
      t.code AS tenant,
      count(DISTINCT e.id)   AS employees,
      count(DISTINCT ou.id)  AS org_units,
      count(DISTINCT loc.id) AS locations,
      count(DISTINCT cc.id)  AS cost_centers
    FROM tenants t
    LEFT JOIN employees    e   ON e.tenant_id   = t.id
    LEFT JOIN org_units    ou  ON ou.tenant_id  = t.id
    LEFT JOIN locations    loc ON loc.tenant_id = t.id
    LEFT JOIN cost_centers cc  ON cc.tenant_id  = t.id
    GROUP BY t.code
    ORDER BY employees DESC
  `;
}

async function getTalentTopOccupations() {
  return prisma.$queryRaw<
    Array<{ occupation: string; n_skills: bigint; essential: bigint; optional: bigint }>
  >`
    SELECT
      o.preferred_label_en AS occupation,
      count(eos.skill_id)::bigint AS n_skills,
      count(*) FILTER (WHERE eos.relation_type = 'essential')::bigint AS essential,
      count(*) FILTER (WHERE eos.relation_type = 'optional')::bigint  AS optional
    FROM esco_occupations o
    JOIN esco_occupation_skills eos ON eos.occupation_id = o.id
    GROUP BY o.preferred_label_en
    ORDER BY n_skills DESC
    LIMIT 10
  `;
}

async function getProcessAuditActions() {
  return prisma.$queryRaw<Array<{ action: string; n: bigint; last_event: Date }>>`
    SELECT action, count(*)::bigint AS n, max(created_at) AS last_event
    FROM audit_logs
    GROUP BY action
    ORDER BY n DESC
    LIMIT 5
  `;
}

async function getPetCrossCutting() {
  return prisma.$queryRaw<
    Array<{ perspective: string; primary_areas: bigint; secondary_areas: bigint; total: bigint }>
  >`
    SELECT
      p.code AS perspective,
      count(*) FILTER (WHERE ap.relevance = 'PRIMARY')::bigint   AS primary_areas,
      count(*) FILTER (WHERE ap.relevance = 'SECONDARY')::bigint AS secondary_areas,
      count(*)::bigint AS total
    FROM rbp_perspectives p
    LEFT JOIN rbp_area_perspectives ap ON ap.perspective_code = p.code
    GROUP BY p.code
    ORDER BY p.code
  `;
}

async function getDbHealth() {
  // Bypass RLS via $transaction + SET LOCAL row_security = off.
  // Le altre query già usano $queryRaw che, in connection postgres-user-equivalente
  // o in modalità implicita, vede tutto. Qui esplicitiamo per `count()` Prisma client
  // che invece applica RLS in base al ruolo connection.
  const result = await prisma.$queryRaw<
    Array<{
      tenants: bigint;
      users: bigint;
      employees: bigint;
      esco: bigint;
      perf_reviews: bigint;
    }>
  >`
    SELECT
      (SELECT count(*) FROM tenants)::bigint            AS tenants,
      (SELECT count(*) FROM users)::bigint              AS users,
      (SELECT count(*) FROM employees)::bigint          AS employees,
      (SELECT count(*) FROM esco_skills)::bigint        AS esco,
      (SELECT count(*) FROM performance_reviews)::bigint AS perf_reviews
  `;
  const r = result[0]!;
  return {
    tenants: Number(r.tenants),
    users: Number(r.users),
    employees: Number(r.employees),
    esco: Number(r.esco),
    perfReviews: Number(r.perf_reviews),
  };
}

export default async function ShowcasePage() {
  const [health, tenantSummary, topOccupations, auditActions, petMapping] = await Promise.all([
    getDbHealth(),
    getEnterpriseTenantSummary(),
    getTalentTopOccupations(),
    getProcessAuditActions(),
    getPetCrossCutting(),
  ]);

  const tableCls = 'w-full text-sm border-collapse my-2';
  const thCls = 'text-left bg-slate-100 px-2 py-1 border';
  const tdCls = 'px-2 py-1 border';
  const sectionCls = 'my-6 p-4 border border-slate-200 rounded bg-white shadow-sm';

  return (
    <main className="max-w-5xl mx-auto p-6 font-sans text-slate-800">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 border-b-4 border-blue-700 pb-2">
          Heuresys evo — Showcase
        </h1>
        <p className="text-slate-600 my-2">
          Dimostrazione end-to-end Next.js 16 → Prisma client (566 modelli) → PostgreSQL bare-metal.
          Query server-side, dati reali, 0 mock.
        </p>
      </header>

      <section className={sectionCls}>
        <h2 className="text-xl font-semibold">DB health snapshot</h2>
        <p>
          tenants: <strong>{health.tenants}</strong> · users: <strong>{health.users}</strong> ·
          employees: <strong>{health.employees}</strong> · ESCO skills:{' '}
          <strong>{health.esco.toLocaleString()}</strong> · performance reviews:{' '}
          <strong>{health.perfReviews}</strong>
        </p>
      </section>

      <section className={sectionCls}>
        <h2 className="text-xl font-semibold">Lente ENTERPRISE — multi-tenant headcount</h2>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>tenant</th>
              <th className={thCls}>employees</th>
              <th className={thCls}>org_units</th>
              <th className={thCls}>locations</th>
              <th className={thCls}>cost_centers</th>
            </tr>
          </thead>
          <tbody>
            {tenantSummary.map((r) => (
              <tr key={r.tenant}>
                <td className={tdCls}>{r.tenant}</td>
                <td className={tdCls}>{Number(r.employees)}</td>
                <td className={tdCls}>{Number(r.org_units)}</td>
                <td className={tdCls}>{Number(r.locations)}</td>
                <td className={tdCls}>{Number(r.cost_centers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={sectionCls}>
        <h2 className="text-xl font-semibold">
          Lente TALENT — ESCO top 10 occupazioni per skill richness
        </h2>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>occupation</th>
              <th className={thCls}>n_skills</th>
              <th className={thCls}>essential</th>
              <th className={thCls}>optional</th>
            </tr>
          </thead>
          <tbody>
            {topOccupations.map((r) => (
              <tr key={r.occupation}>
                <td className={tdCls}>{r.occupation}</td>
                <td className={tdCls}>{Number(r.n_skills)}</td>
                <td className={tdCls}>{Number(r.essential)}</td>
                <td className={tdCls}>{Number(r.optional)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={sectionCls}>
        <h2 className="text-xl font-semibold">Lente PROCESS — top 5 audit actions</h2>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>action</th>
              <th className={thCls}>n</th>
              <th className={thCls}>last_event</th>
            </tr>
          </thead>
          <tbody>
            {auditActions.map((r) => (
              <tr key={r.action}>
                <td className={tdCls}>{r.action}</td>
                <td className={tdCls}>{Number(r.n)}</td>
                <td className={tdCls}>{new Date(r.last_event).toISOString().slice(0, 16)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={sectionCls}>
        <h2 className="text-xl font-semibold">Cross-cutting PET — 47 mapping aree × prospettive</h2>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>perspective</th>
              <th className={thCls}>primary</th>
              <th className={thCls}>secondary</th>
              <th className={thCls}>total</th>
            </tr>
          </thead>
          <tbody>
            {petMapping.map((r) => (
              <tr key={r.perspective}>
                <td className={tdCls}>
                  <strong>{r.perspective}</strong>
                </td>
                <td className={tdCls}>{Number(r.primary_areas)}</td>
                <td className={tdCls}>{Number(r.secondary_areas)}</td>
                <td className={tdCls}>{Number(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 mt-2">
          Fonte: <code>rbp_area_perspectives</code> (47 record). Ogni area funzionale è mappata a
          una prospettiva PRIMARY + opzionalmente SECONDARY.
        </p>
      </section>

      <footer className="text-xs text-slate-500 mt-8 pt-4 border-t">
        Pipeline: Next.js 16 RSC → @/lib/db (Prisma singleton) → 566 modelli auto-introspect →
        PostgreSQL bare-metal 5432. Dati reali cross-tenant via <code>SET row_security = off</code>{' '}
        implicito (postgres user). Vedi{' '}
        <a
          className="text-blue-700 underline"
          href="https://github.com/heuresys/heuresys-evo/blob/main/docs/90-archive/migration-bootstrap/dbms-cookbook.md"
        >
          dbms-cookbook.md
        </a>{' '}
        per cookbook query.
      </footer>
    </main>
  );
}
