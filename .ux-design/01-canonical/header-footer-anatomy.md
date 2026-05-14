# Header / Footer Anatomy — cycle 2 canonical

> Pattern unificato cross-route per investor-ready cockpit. Header = "una domanda risolta" + contesto navigazionale. Footer = metadata trasversali.

## Header anatomy (workspace-scoped `ws-header`)

Header del workspace, sopra il body del preset/route. Distinto dal topbar globale `nav-bar` (BrandShell).

### Struttura DOM canonica

```html
<header class="ws-header">
  <div class="title-block">
    <div class="breadcrumb">DASHBOARD · TALENT · AUDIENCE: HR_DIRECTOR</div>
    <h1>Talent &amp; capability <em>al colpo d'occhio</em></h1>
  </div>
  <div class="actions">
    <div class="scope-pill">
      <span class="dot"></span>
      <span>scope · rtl bank · hr_director</span>
    </div>
    <a class="btn btn-ghost" href="#export-pdf">Export PDF</a>
    <a class="btn btn-primary" href="/reviews">Apri review cycle →</a>
  </div>
</header>
```

### Elementi canonici

| Elemento                      | Quando appare                      | Sorgente                                                     |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------ | --- | ------------------ |
| `.breadcrumb`                 | sempre                             | `DASHBOARD · {perspective_code} · {persona_label             |     | role}`             |
| `<h1>`                        | sempre                             | `pickBilingual(preset, 'name', locale)` con `                |     | ` split per accent |
| `.scope-pill`                 | sempre (autenticati)               | `scope · {tenant.name.toLowerCase()} · {role.toLowerCase()}` |
| `.btn btn-ghost` (Export PDF) | route con export                   | href anchor o disabled coming-soon                           |
| `.btn btn-primary` (CTA)      | route con prossima azione naturale | href a route correlata                                       |

### H1 multi-word accent pattern

Il campo `dashboard_presets.name_*` può contenere delimitatore `||`:

- `"Talent & capability||al colpo d'occhio"` → `<h1>Talent &amp; capability <em>al colpo d'occhio</em></h1>`
- Senza `||`: split-last-word fallback per retrocompatibilità (`"Capability graph"` → `Capability <em>graph</em>`)

Implementazione: `services/app/src/app/(app)/dashboard/page.tsx` + `[code]/page.tsx` (entrambi T0.7 cycle 2 Phase 0).

### Filter bar (opzionale)

Quando la route ha filtri primari (employees, reviews, goals), aggiungere sopra `.title-block` una `.filter-bar`:

```html
<div class="filter-bar">
  <select aria-label="Dipartimento">
    ...
  </select>
  <input type="search" placeholder="Cerca per nome o skill" />
  <span class="chip">156 records</span>
  <button class="btn-ghost">Reset</button>
</div>
```

## Footer anatomy (app-level `app-footer`)

Footer applicativo, sempre presente in BrandShell. Distinto da `ws-footer` (workspace footer per-route — eliminato in cycle 2 Phase 0 T0.8).

### Struttura DOM canonica

```html
<footer class="app-footer">
  <div class="ft-static">
    <span class="copyright">© 2026 heures<span class="y">y</span>s.com</span>
    <div class="socials">
      <a href="https://www.linkedin.com/company/heuresys">LinkedIn</a>
      <a href="https://github.com/heuresys">GitHub</a>
      <a href="https://x.com/heuresys">X</a>
    </div>
  </div>
  <div class="ft-dynamic">
    <!-- BRAND METRICS LIVE (P6 W#7-bis) -->
    <span class="ctx-item">CYCLE <strong>Q1 2026 · 38%</strong></span>
    <span class="ctx-item">REVIEWS <strong>62%</strong></span>

    <!-- DEV-ONLY CHIPS (NEXT_PUBLIC_SHOW_DEV_FOOTER=1) -->
    <!-- ENV / TENANT / ROLE / BUILD hidden in production -->
  </div>
</footer>
```

### ft-static (sempre visibile)

| Elemento     | Note                                                             |
| ------------ | ---------------------------------------------------------------- |
| `.copyright` | `© 2026 heuresys.com` con wordmark embed (h minuscola, y accent) |
| `.socials`   | LinkedIn + GitHub + X (Twitter) — icone SVG, no testo            |

### ft-dynamic (selective)

| Chip                        | Visibility                                    | Sorgente                                                   |
| --------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| CYCLE                       | sempre se `footerMetrics.cycle` non null      | server prop derivato da NOW()                              |
| REVIEWS                     | sempre se `footerMetrics.reviewsPct` non null | server SQL aggregator review_cycle_participants completion |
| ENV / TENANT / ROLE / BUILD | solo `NEXT_PUBLIC_SHOW_DEV_FOOTER === '1'`    | dev-only debugging                                         |

**Vincolo prod (cycle 2 Phase 0 T0.8)**: `NEXT_PUBLIC_SHOW_DEV_FOOTER` flag default false. In produzione, footer mostra solo CYCLE + REVIEWS come brand metric live. Nessun UUID parziale, nessun role string, nessun build hash visibile all'utente finale.

## Topbar globale (nav-bar in BrandShell)

Sopra l'intera app. Persistente tra route.

### Struttura DOM canonica

```html
<nav class="nav-bar" aria-label="Top navigation">
  <div class="nav-left">
    <a href="/dashboard" class="wordmark-sm">heures<span class="y">y</span>s</a>
    <span class="label-pill"><span class="accent">DASHBOARD</span></span>
  </div>
  <div class="nav-right">
    <LocaleSwitcher />
    <PaletteSwitcher />
    <ThemeToggle />
    <UserMenu />
  </div>
</nav>
```

| Elemento          | Note                                                                             |
| ----------------- | -------------------------------------------------------------------------------- |
| `.wordmark-sm`    | logo originale 2 colori (body brand-blue + y accent), h minuscola, Exo 2 700     |
| `.label-pill`     | section label dinamico (DASHBOARD · EMPLOYEES · REVIEWS · …)                     |
| `LocaleSwitcher`  | toggle IT/EN, cookie-persistent                                                  |
| `PaletteSwitcher` | runtime palette switching (μ-architect-legacy default; preserved infrastructure) |
| `ThemeToggle`     | light/dark                                                                       |
| `UserMenu`        | avatar + role + sign out                                                         |

## Sidebar (BrandShell `aside.sidebar`)

| Zona                  | Contenuto                                                             |
| --------------------- | --------------------------------------------------------------------- |
| `.sidebar-top`        | toggle collapse + tenant-mini (avatar + name + meta)                  |
| `.sidebar-section`    | nav sezioni role-filtered (TALENT · PROCESSES · INSIGHTS · ADMIN · …) |
| `.user-card` (bottom) | avatar + displayName + `{role} · level {N}`                           |

Sidebar collapse persisted in `localStorage.heuresys.sidebar.collapsed`. Section collapse persisted per id.

## Pattern coerenza cross-route (Legge F10)

| Aspetto          | Vincolo                                                              |
| ---------------- | -------------------------------------------------------------------- | ----- | ----------------------------- |
| Layout grid      | Hero strip 4-col + Body principal full-width + secondary tab dock    |
| Header anatomy   | breadcrumb · h1 · scope-pill · actions (Export · CTA)                |
| Footer anatomy   | ft-static + ft-dynamic CYCLE/REVIEWS sempre · dev chips gated        |
| Loading skeleton | `<Skeleton variant="card                                             | row   | grid" />` from packages/ui    |
| Empty state      | `<DataNotAvailable variant="inline                                   | block | tile" />` per P11 unavailable |
| Color palette    | μ-architect-legacy canonical baseline                                |
| Typography       | Inter (sans-body) + Exo 2 (display) + JetBrains Mono (numerals/code) |
| Motion language  | 4 ease curves + 6 duration tokens da `motion.css`                    |

## Riferimenti

- `services/app/src/app/(app)/_components/BrandShell.tsx` — topbar + sidebar + footer
- `services/app/src/app/(app)/dashboard/page.tsx` — ws-header HR_DIRECTOR pattern
- `services/app/src/app/(app)/dashboard/[code]/page.tsx` — ws-header generic pattern
- `services/app/src/styles/dashboard-brand.css` — ws-header CSS rules
- Plan §0.8 (header/footer anatomy) + §1.1 F5/F10
