# Dashboard Architecture — Regola dei 4 elementi (data-driven)

> **Specifica architettonica fondante** consegnata da Enzo. Vincolante per Phase 9 (mockup dashboard) e per tutte le surface applicative del prodotto.

## Definizione

In Heuresys una **dashboard** è l'assemblaggio di esattamente **4 elementi** strutturali:

```
┌─────────────────────────────────────────────────────────┐
│  HEADER                                                 │  ← elemento 1 (top)
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│          │                                              │
│ SIDEBAR  │  CONTENT WINDOW                              │  ← elemento 4 (centro)
│ (scelta  │  (pagina + oggetti + dati                    │
│ funzio-  │   collegati alla scelta funzionale)          │
│ nale)    │                                              │
│          │                                              │
│  ← el.3  │                                              │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│  FOOTER                                                 │  ← elemento 2 (bottom)
└─────────────────────────────────────────────────────────┘
```

Ciascun elemento può contenere componenti di controllo, logo SVG, widget di stato, breadcrumb, search, theme toggle, user menu, ecc.

## Le 4 entità

### 1. Header

Barra superiore persistente. Contiene tipicamente:

- Logo Heuresys (SVG, link a home)
- Breadcrumb di navigazione corrente
- Global search (Cmd-K friendly)
- Quick actions / command palette
- Notifiche
- Theme toggle (light/dark)
- User menu / avatar

### 2. Footer

Barra inferiore persistente. Contiene tipicamente:

- Build/version info (env, commit hash short)
- Status indicator (sistema operativo, sync ESCO, audit pipeline)
- Link supporto / docs
- Copyright / legal short

### 3. Sidebar (di scelta funzionale)

Pannello laterale persistente. È il **controllo di routing funzionale** della dashboard. Contiene:

- Voci di menu organizzate per area funzionale (RBP `rbp_functional_areas`, 33 aree)
- Ciascuna voce determina **quale pagina viene caricata nel content window**
- Comportamento collapsible (espansa / compressa con icone)
- Stato attivo evidenziato con primary color brand

La sidebar **non** mostra contenuto dati — è solo navigazione/scelta.

### 4. Content window

Area centrale dove viene **caricata la pagina** corrispondente alla scelta in sidebar. Caratteristiche:

- **Theme inheritance**: il tema globale della dashboard è ereditato dalla pagina caricata (light/dark sempre disponibile come switch)
- Contiene oggetti UI (cards, charts, tables, forms, viz)
- Contiene dati collegati alla scelta funzionale (Prisma queries scoped a `tenantId` + RBP permissions)
- Può contenere **dashboard nidificate** (vedi §"Dashboard nidificate")

## Composizione data-driven

La dashboard **non è statica**: la sua composizione viene determinata a runtime dal DBMS in funzione del **ruolo utente** (RBP, 8 livelli da SUPERUSER a EMPLOYEE).

### Tabelle DBMS coinvolte (concettuali)

| Tabella                 | Scopo                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `dashboards`            | Definizione dashboard (id, slug, descrizione, theme override default)                                               |
| `dashboard_elements`    | Elementi costitutivi: header config, footer config, sidebar items, default content page                             |
| `role_dashboard_assoc`  | Associazione ruolo → dashboard (uno-a-molti: un ruolo può avere più dashboard, una dashboard può servire più ruoli) |
| `dashboard_permissions` | Livelli di autorizzazione differenziati per profilo utente sulla stessa dashboard                                   |
| `dashboard_routes`      | Mapping voce sidebar → pagina caricata in content window                                                            |

> Nota: queste sono **specifiche concettuali**. I nomi tabella effettivi e schema saranno formalizzati in fase di porting Phase 6+ (vedi `docs/10-strategy/migration-strategy-pet-driven.md`). Quando tabelle reali emergeranno (`role_views`, `view_compositions`, simili), questo doc va aggiornato.

### Conseguenza pratica

| Utente         | Ruolo (RBP)      | Dashboard accessibile                         | Permessi                            |
| -------------- | ---------------- | --------------------------------------------- | ----------------------------------- |
| HR Director    | HR_DIRECTOR (2)  | `dash-hr-strategic` + `dash-capability-graph` | Read all + write capability rubric  |
| Davide Conti   | IT_ADMIN (1)     | `dash-system-health` + `dash-audit`           | Read all + write integration config |
| Stefania Greco | LINE_MANAGER (5) | `dash-team-overview` + `dash-review-cycle`    | Read team + write review            |
| Andrea Rossi   | EMPLOYEE (6)     | `dash-my-profile` + `dash-my-path`            | Read own + write self-assessment    |

Stessa shell (4 elementi), composizione e content **diversi** per ruolo. **Una dashboard può essere associata a più profili** ma con livelli di autorizzazione differenziati (es. HR_DIRECTOR vede tutta `dash-capability-graph`, HR_MANAGER vede solo own BU).

## Dashboard nidificate

Caso speciale: il **content window può contenere un'altra dashboard**.

Quando una dashboard è nidificata in un'altra:

- ✅ Mantiene la sua **sidebar** (scelta funzionale interna sub-routing)
- ✅ Mantiene il suo **content window** (pagina caricata)
- ❌ **Non mostra header**
- ❌ **Non mostra footer**

Use case tipici:

- Drill-down: dashboard parent mostra org-level, click su BU apre `dash-bu-detail` come nested → utente resta nello shell parent (header/footer/sidebar parent persistono)
- Workflow multi-step: review cycle dashboard nest pagine intermedie sotto stessa shell
- Modal-like deep-dive: capability node dettaglio nested sopra view padre

Implementazione concettuale: il render della nested dashboard riceve un prop `embedded: true` che disabilita header e footer. Sidebar e content vengono renderizzati ma con z-index/scope distinto.

## Theme inheritance

Il tema globale della dashboard (colori, typography, spacing, motion) **non è proprietà della shell** (header/footer/sidebar) ma della **pagina caricata nel content window**.

### Conseguenza

Quando l'utente clicca una voce sidebar e si carica una nuova pagina nel content window:

1. La pagina dichiara il proprio theme override (se differente dal default)
2. Header/footer/sidebar **ereditano** quel theme
3. Light/dark switch resta disponibile a livello globale ma applica al theme corrente

### Pattern tecnico atteso

In Next.js + Tailwind 4 `@theme` directive, ogni pagina può usare layout-specific CSS variable scoping:

```tsx
// services/app/src/app/(dashboards)/hr-strategic/page.tsx
export default function HrStrategicPage() {
  return (
    <div className="theme-hr-strategic" data-theme-mode="auto">
      {/* contenuto */}
    </div>
  );
}
```

Con `theme-hr-strategic` definito come scope CSS che override `--color-*` token `@theme`. La shell esterna (header/footer/sidebar) usa CSS custom property dinamico — eredita.

## Vincoli per Phase 9 (mockup dashboard)

I mockup dashboard che produrremo in Phase 9 **devono** rispettare la regola 4-elementi:

| Mockup                                  | Header | Footer | Sidebar      | Content (cosa)                                |
| --------------------------------------- | ------ | ------ | ------------ | --------------------------------------------- |
| HR Director Overview                    | ✅     | ✅     | ✅ (33 aree) | Capability radar org-level + KPI bento        |
| Capability Graph                        | ✅     | ✅     | ✅           | Force-directed graph 5 dimensioni interattivo |
| Skills Heatmap                          | ✅     | ✅     | ✅           | Matrix BU × Capability con cell drill-down    |
| Employee Journey                        | ✅     | ✅     | ✅           | Timeline horizontal + path projection         |
| (Nested example) Capability node detail | ❌     | ❌     | ✅           | Deep-dive single capability nested in parent  |

## Anti-pattern

- ❌ Mockup di pagina senza i 4 elementi (es. solo content window senza shell)
- ❌ Variazione strutturale dei 4 elementi (es. sidebar a destra invece di sinistra)
- ❌ Theme dichiarato sull'header invece che sulla pagina caricata
- ❌ Dashboard nidificata che mostra header/footer (regola: nested = senza header/footer)
- ❌ Composizione dashboard hardcoded in codice (deve essere data-driven via DBMS)
- ❌ Sidebar che mostra dati dinamici di business (è solo scelta funzionale)

## Cross-reference

- Logo nel header: vedi `03-visual-identity/logo/final/heuresys-wordmark.svg`
- Theme tokens base: `packages/ui/src/styles/tokens.css` (esistente)
- Persona × dashboard mapping: `01-strategy/personas/*.md`
- RBP areas: 33 functional areas in `rbp_functional_areas` (DB)
- Mockup focus: Phase 9 in `D:\evo.heuresys.com\.ux-design\06-mockups\dashboards\`
