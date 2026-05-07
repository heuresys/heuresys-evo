# Dashboard engine pattern — Phase 13 + 14.A

**Status**: Active (2026-05-07 · Phase 13 closed · Phase 14 Sprint 1 A+H shipped)
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

## Phase 14.A — Live data binding (shipped 2026-05-07)

Sprint 1 Bundle F · sub-phase A+H shipped end-to-end:

| Layer                | What                                                                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-fetcher.ts`    | Dispatch `static`/`sql` (api/graph reserved Sprint 2-3) + process-local LRU cache + RLS via `withTenant`                                                                          |
| `adapters.ts`        | 8 widget-specific adapters mapping raw rows → component props (KpiRing, IntegrationHealthPill, SuccessionCard, CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar, RbacMatrix) |
| `prefetch.ts`        | Parallel `fetchWidgetData` per visible element · returns id→data map for RSC payload                                                                                              |
| `registry.tsx`       | Refactored to `liveWrapper(widgetCode, demoProps, render)` — Live data with Demo fallback                                                                                         |
| `route handler`      | `GET /api/dashboard/data/[elementId]` · auth + RBP visibility + tenant ownership gates                                                                                            |
| `use-widget-data.ts` | SWR-style client hook · zero deps · cache TTL + `mutate()` + `revalidateOnFocus`                                                                                                  |
| `i18n/`              | Locale provider + `pickBilingual()` pure helper · `?lang=it\|en` query + localStorage                                                                                             |
| Seed phase14a        | 8 KpiRing SQL count + 4 IntegrationHealthPill static                                                                                                                              |
| Seed phase14b        | 9 composite static (SuccessionCard, CareerArc×2, KgMiniGraph×2, SkillHeatmap×2, CapabilityRadar, RbacMatrix)                                                                      |

Live smoke verified end-to-end: `/dashboard/hr_director_overview?lang=en` →
KpiRing pos 1 shows `Active employees · 270` (RLS scope RTL Bank) ·
SuccessionCard pos 2 shows `Stefania Bianchi` (static) · header switches
IT/EN with the locale switcher.

Test coverage delta: +85 vitest (16 fetcher + 28 adapters + 6 prefetch +
10 route + 9 hook + 17 i18n - 1 dedup) → 120/120 verde su services/app.

E2E coverage: 1 dashboard fixture (chromium · HR_DIRECTOR · 3 spec verde).
Full 8 ruoli × 9 dashboard = 72-fixture matrix deferred to Sprint 1
follow-up. Perf script `scripts/perf-dashboard.mjs` ready (production-mode
binding number deferred — dev mode ballpark P95 ~2.6s @ 10c/5s).

## Future evolutions (post-Sprint 1)

| #   | Evoluzione                                                                    | Phase target                           |
| --- | ----------------------------------------------------------------------------- | -------------------------------------- |
| 1   | Composite SQL queries (jsonb_agg over talents/skills) replacing `static` seed | Sprint 1 follow-up                     |
| 2   | Production-mode perf binding (next build && start + autocannon · P95 ≤ 500ms) | Sprint 1 follow-up                     |
| 3   | Full 72-fixture Playwright matrix (9 dashboard × 8 ruoli) + golden screenshot | Sprint 1 follow-up                     |
| 4   | drag-resize editor utente (`dashboards` + `dashboard_widgets` UUID workspace) | Sprint 3 · C                           |
| 5   | Audit log P4 su mutations preset/element                                      | Sprint 2 · E (pre-req of Sprint 3 · C) |
| 6   | `/ontology` reopen + OpenAI advisor widget                                    | Sprint 2 · F                           |
| 7   | Tier 2 portfolio (ESCO/SAP/KG explorer)                                       | Sprint 3 · G                           |
| 8   | Bundle analyzer + code-split target ≤200KB initial per dashboard              | Performance pass                       |

## File reference

| File             | Path                                                                                              | Scope    |
| ---------------- | ------------------------------------------------------------------------------------------------- | -------- |
| Migration schema | `db/migrations/0002_phase13_dashboard_engine.sql`                                                 | DB       |
| Seed data        | `db/seeds/phase13_dashboard_presets.sql`                                                          | DB       |
| Seed 14.A SQL    | `db/seeds/phase14a_dashboard_data_sources.sql`                                                    | DB       |
| Seed 14.A static | `db/seeds/phase14b_dashboard_composite_static.sql`                                                | DB       |
| Schema Prisma    | `services/app/prisma/schema.prisma`                                                               | ORM      |
| Engine loader    | `services/app/src/lib/dashboard-engine/loader.ts`                                                 | Server   |
| Engine resolver  | `services/app/src/lib/dashboard-engine/resolver.ts`                                               | Pure     |
| Engine fetcher   | `services/app/src/lib/dashboard-engine/data-fetcher.ts`                                           | Server   |
| Engine adapters  | `services/app/src/lib/dashboard-engine/adapters.ts`                                               | Pure     |
| Engine prefetch  | `services/app/src/lib/dashboard-engine/prefetch.ts`                                               | Server   |
| Engine hook      | `services/app/src/lib/dashboard-engine/use-widget-data.ts`                                        | Client   |
| Engine registry  | `services/app/src/lib/dashboard-engine/registry.tsx`                                              | Client   |
| Engine grid      | `services/app/src/lib/dashboard-engine/grid.tsx`                                                  | Client   |
| Engine barrel    | `services/app/src/lib/dashboard-engine/index.ts`                                                  | Server   |
| Data route       | `services/app/src/app/api/dashboard/data/[elementId]/route.ts`                                    | Server   |
| Route page       | `services/app/src/app/dashboard/[code]/page.tsx`                                                  | Server   |
| Root layout      | `services/app/src/app/layout.tsx`                                                                 | Server   |
| i18n utils       | `services/app/src/lib/i18n/locale-utils.ts`                                                       | Pure     |
| i18n provider    | `services/app/src/lib/i18n/locale.tsx`                                                            | Client   |
| i18n switcher    | `services/app/src/lib/i18n/locale-switcher.tsx`                                                   | Client   |
| Atomic widgets   | `packages/ui/src/components/dashboard/*.tsx`                                                      | UI       |
| Mockup HTML      | `.ux-design/06-mockups/dashboards/*.html`                                                         | Designer |
| Vitest engine    | `services/app/src/__tests__/dashboard-{engine,data-fetcher,adapters,prefetch,data-route}.test.ts` | Test     |
| Vitest hook      | `services/app/src/__tests__/use-widget-data.test.ts`                                              | Test     |
| Vitest i18n      | `services/app/src/__tests__/i18n-locale.test.tsx`                                                 | Test     |
| E2E dashboard    | `services/app/tests/e2e/dashboard.spec.ts`                                                        | Test     |
| Perf script      | `services/app/scripts/perf-dashboard.mjs`                                                         | Tooling  |

## Cross-reference

- `~/.claude/plans/credo-che-se-tu-jazzy-key.md` § Phase 13 — Phase 13 strategic plan (executed)
- `~/.claude/plans/phase14-{index,sprint1-foundation,sprint2-ai-compliance,sprint3-ux-tier2}.md` — Phase 14 Bundle F plan
- `docs/70-planning/phase14-scope.md` — Phase 14 scope draft (8 tracce, 5 bundle)
- `.ux-design/DECISIONS-LOG.md` § L29 (13.A) + L30 (13.B) + L31 (13.C/D/E) — Phase 13 decision history
- `docs/20-architecture/rls-with-prisma-pattern.md` — RLS bypass pattern explained
- `docs/30-developer/security-baseline.md` — P1-P10 enforcement baseline
- `.ux-design/06-mockups/dashboards/index.html` — designer hub for 5 Phase 9 mockup
