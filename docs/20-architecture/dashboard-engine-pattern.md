# Dashboard engine pattern — Phase 13

**Status**: Active (2026-05-06 · Phase 13 closed)
**Scope**: data-driven dashboard composition for evo · 9 Tier 1 dashboard preset rendered runtime
**Audience**: backend dev evo, frontend dev evo, security reviewer

## Mission

Sostituire i 5 mockup HTML statici Phase 9 con un **engine renderer parametrizzato** che compone runtime ogni dashboard da DB, leggendo (a) il preset (registry template) e (b) gli element (binding widget × grid position × visibility). 9 dashboard preset Tier 1 totale: 5 esistenti (3 TALENT + 2 ENTERPRISE) + 4 PROCESS.

Allineato a `dashboard-architecture.md` (regola 4-elementi) + `migration-strategy-pet-driven.md` (47 PET) + observatori PROCESS / ENTERPRISE / TALENT.

## Layer architettura

```
.ux-design/06-mockups/dashboards/*.html       (designer reference, frozen at promotion time)
                ↓
db.dashboard_presets        (registry templates, 9 row, platform-wide)
db.dashboard_elements       (binding preset×widget×position, RLS tenant-aware)
                ↓
services/app/src/lib/dashboard-engine/
  ├── loader.ts             (Prisma read · server-only)
  ├── resolver.ts           (RBP + perspective + tenant override merge · pure)
  ├── registry.tsx          (widget_code → React lazy import · client-only)
  ├── grid.tsx              (CSS Grid 12-col · client-only)
  └── index.ts              (server-safe public API)
                ↓
services/app/src/app/dashboard/[code]/page.tsx  (server component · session+RBP+render)
                ↓
packages/ui  (8 atomic component TIER 17 · KpiRing · IntegrationHealthPill · …)
```

Tutto è data-driven: aggiungere una nuova dashboard = aggiungere 1 riga a `dashboard_presets` + N righe a `dashboard_elements`. Nessun nuovo file React richiesto se i widget code sono nel registry.

## Boundary critico — 3 namespace dashboard distinti

| Tabella                                    | Numero righe | Scopo                                                  | Owner             |
| ------------------------------------------ | ------------ | ------------------------------------------------------ | ----------------- |
| `rbp_dashboards`                           | 11           | Role-default dashboard registry (sistema RBP legacy)   | Sistema           |
| `dashboards` + `dashboard_widgets`         | 20 + 160     | User workspace runtime (UUID, per-user, drag-resize)   | User (per tenant) |
| `dashboard_presets` + `dashboard_elements` | 9 + 30       | **Phase 13 templates** (mockup-derived, platform-wide) | Sistema           |

Distinzione operativa:

- **Engine 13.C tocca SOLO `dashboard_presets` + `dashboard_elements`**.
- `rbp_dashboards` (11) + `rbp_role_dashboards` (23) restano gestiti dal sistema RBP esistente per default routing/menu (intoccati da Phase 13).
- `dashboards` + `dashboard_widgets` (UUID) sono runtime user workspace e **sono out-of-scope V1** (drag-resize editor → Phase 14).

I tre namespace coesistono senza overlap funzionale né collisione di nomi.

## Loader (server-only)

```typescript
// services/app/src/lib/dashboard-engine/loader.ts
loadDashboardPreset(code, { tenantId, requirePublished });
// Prisma findUnique con include dashboard_elements WHERE OR(tenant_id IS NULL, tenant_id = currentTenant)
// requirePublished=true (default) restituisce null per preset Phase 13.D non ancora pubblicati
listPublishedPresets();
// SELECT for menu/index UI · ordered by sort_order
```

Il loader **NON** applica RBP/perspective filter — è solo data access. La visibility logic vive nel resolver (testabile pure, no DB mock).

## Resolver (pure functions)

```typescript
// services/app/src/lib/dashboard-engine/resolver.ts
ROLE_LEVEL = { SUPERUSER: -1, TENANT_OWNER: 0, IT_ADMIN: 1, HR_DIRECTOR: 2,
               HR_MANAGER: 3, DEPT_HEAD: 4, LINE_MANAGER: 5, EMPLOYEE: 6 }

resolveElements(elements, { role, perspective }):
  1. visibility filter: keep el if userRoleLevel <= el.visibility_min_role
  2. perspective filter (?observer=PROCESS|ENTERPRISE|TALENT): keep el if
     el.perspective_code matches OR el.perspective_code is null (unscoped)
  3. tenant override merge: at same `position`, tenant-specific row (tenant_id != null)
     shadows platform default (tenant_id == null)
  4. sort by position ascending
```

**Visibility semantica**: `visibility_min_role = 6` (EMPLOYEE) → visibile a tutti. `visibility_min_role = 2` (HR_DIRECTOR) → solo level <=2 (i.e. HR_DIRECTOR, IT_ADMIN, TENANT_OWNER, SUPERUSER) vedono.

Test coverage: 18 vitest test in `services/app/src/__tests__/dashboard-engine.test.ts`.

## Registry (client-only)

```typescript
// services/app/src/lib/dashboard-engine/registry.tsx ('use client')
WIDGET_REGISTRY = {
  KpiRing,
  IntegrationHealthPill,
  SuccessionCard,
  CareerArc,
  KgMiniGraph,
  SkillHeatmap,
  CapabilityRadar,
  RbacMatrix,
}; // → next/dynamic ssr:false per code-splitting per route
resolveWidget(widget_code); // returns ComponentType | null
```

V1 i widget renderizzano demo data hardcoded (parità Storybook stories). V2 (Phase 14): widget riceve `config` + `data` props da engine `data-fetcher`.

`ssr: false` uniforme: alcuni widget (KgMiniGraph) richiedono `window` (cytoscape) e non sono SSR-safe. Trattamento uniforme = consistenza + no edge case mixed.

Aggiungere un widget: append a `WIDGET_REGISTRY` map + import da `@heuresys/ui`. Nessuna altra modifica richiesta lato engine.

## Grid (client-only)

CSS Grid 12-col + `auto-rows-[minmax(140px,auto)]`. Ogni element ha `grid_col_start/span` e `grid_row_start/span` da DB. Clamp difensivo (no overflow oltre 12 col).

V1 non c'è drag-resize né editor utente (out-of-scope; Phase 14+ se richiesto).

## Page route — `/dashboard/[code]`

Server component (`services/app/src/app/dashboard/[code]/page.tsx`):

1. `auth()` legge session NextAuth v4 → user.{role, tenantId}
2. Se non autenticato → redirect `/login?next=...`
3. `loadDashboardPreset(code, { tenantId, requirePublished: true })` → Prisma
4. `notFound()` se preset assente o non pubblicato
5. `resolveElements(preset.dashboard_elements, { role, perspective: searchParams.observer })`
6. Render header (preset.name + persona + perspective + role/tenant pill) + `<DashboardGrid elements={...} />`

URL path scelto: **`/dashboard/[code]`** (non `(dashboard)/[code]` come da plan originale) per evitare collisione con root-level static route esistenti (`/login`, `/showcase`, `/brand-studio`, `/dashboard`). Il legacy `/dashboard` (employee list scaffold) resta intoccato — `/dashboard/[code]` è estensione naturale.

URL params:

- `code` — `dashboard_presets.code` (e.g. `hr_director_overview`, `process_recruiting_funnel`)
- `?observer=PROCESS|ENTERPRISE|TALENT` — perspective filter

Esempi URL:

```
/dashboard/hr_director_overview
/dashboard/skills_heatmap?observer=TALENT
/dashboard/process_recruiting_funnel
/dashboard/org_systems?observer=ENTERPRISE
```

## RLS — defense in depth

Le 327 RLS policy nel DB evo (incluse 1 nuova in Phase 13.B su `dashboard_elements`) sono pattern "defense in depth". Tutti i ruoli login DB (`heuresys`, `heuresys_backup`, `postgres`) hanno `BYPASSRLS=true` — l'isolamento tenant **reale** in api-gateway è applicato via Prisma client extension + `AsyncLocalStorage` (vedi `rls-with-prisma-pattern.md`). Per le route services/app via `prisma` singleton (in `lib/db.ts`), per V1 il filtro tenant è esplicito nel loader (`OR tenant_id = userTenantId`); il pattern extension è da estendere se/quando servirà copertura uniforme.

Per Phase 13.B specifico:

- `dashboard_presets` no RLS — platform-wide read pubblico
- `dashboard_elements` RLS attiva con FORCE → in produzione (con ruolo NOBYPASSRLS) garantisce isolation P1 anche se loader cleanup scordasse il filtro `OR tenant_id = ...`

## Sequenza chiamate (cold cache)

```
HTTP GET /dashboard/hr_director_overview?observer=TALENT
    ↓
auth() · NextAuth v4 JWT decode (no DB call)
    ↓
loadDashboardPreset('hr_director_overview', { tenantId: '0c54...', requirePublished: true })
    ↓ Prisma findUnique on dashboard_presets + include elements (1 query)
resolveElements(elements, { role: 'HR_DIRECTOR', perspective: 'TALENT' })
    ↓ pure: filter + merge + sort (in-memory)
RSC payload serialize · BigInt → string
    ↓
DashboardGrid (client) · for each element:
  WIDGET_REGISTRY[code] → next/dynamic load (cached after first)
    ↓ first render: Loading skeleton → widget mount
```

Latency budget P95 ≤500ms server-side (target plan §13.E). 1 Prisma query + pure function, easily met.

## Future evolutions (out-of-scope V1)

| #   | Evoluzione                                                                    | Phase target                                 |
| --- | ----------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | data-fetcher dispatch (`data_source_type` sql/graph/api/static)               | Phase 14                                     |
| 2   | drag-resize editor utente (`dashboards` + `dashboard_widgets` UUID workspace) | Phase 14+                                    |
| 3   | Audit log P4 su mutations preset/element                                      | Quando preset diventano editable da UI (V2+) |
| 4   | E2E Playwright + golden image diff (per 9 preset × 8 ruoli = 72 combo)        | Quando ci sarà infra Playwright              |
| 5   | Bundle analyzer + code-split target ≤200KB initial per dashboard              | Phase 14                                     |
| 6   | i18n switch IT/EN runtime (preset.name_it / name_en già seedati)              | Phase 14                                     |

## File reference

| File             | Path                                                  | LOC           | Scope    |
| ---------------- | ----------------------------------------------------- | ------------- | -------- |
| Migration schema | `db/migrations/0002_phase13_dashboard_engine.sql`     | 130           | DB       |
| Seed data        | `db/seeds/phase13_dashboard_presets.sql`              | 175           | DB       |
| Schema Prisma    | `services/app/prisma/schema.prisma` (+50 LOC)         | —             | ORM      |
| Engine loader    | `services/app/src/lib/dashboard-engine/loader.ts`     | 50            | Server   |
| Engine resolver  | `services/app/src/lib/dashboard-engine/resolver.ts`   | 95            | Pure     |
| Engine registry  | `services/app/src/lib/dashboard-engine/registry.tsx`  | 230           | Client   |
| Engine grid      | `services/app/src/lib/dashboard-engine/grid.tsx`      | 65            | Client   |
| Engine barrel    | `services/app/src/lib/dashboard-engine/index.ts`      | 20            | Server   |
| Route page       | `services/app/src/app/dashboard/[code]/page.tsx`      | 90            | Server   |
| Resolver tests   | `services/app/src/__tests__/dashboard-engine.test.ts` | 175 (18 test) | Test     |
| Atomic widgets   | `packages/ui/src/components/dashboard/*.tsx`          | 8 component   | UI       |
| Mockup HTML      | `.ux-design/06-mockups/dashboards/*.html`             | 9 file        | Designer |

## Cross-reference

- `~/.claude/plans/credo-che-se-tu-jazzy-key.md` § Phase 13 — strategic plan (autonomous execution)
- `.ux-design/DECISIONS-LOG.md` § L29 (13.A) + L30 (13.B) + L31 (13.C/D/E) — decision history
- `docs/20-architecture/rls-with-prisma-pattern.md` — RLS bypass pattern explained
- `docs/30-developer/security-baseline.md` — P1-P10 enforcement baseline
- `.ux-design/06-mockups/dashboards/index.html` — designer hub for 5 Phase 9 mockup
