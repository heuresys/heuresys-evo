# Heuresys — Brand Book v0

> **Phase 12** · 2026-05-07 · **v0** (first comprehensive edition)
>
> Documento testuale comprehensive consolidato di brand identity Heuresys. v0 = first edition non rifinita editorialmente. v1 (futura) sarà l'edizione visiva con layout tipografico curato.

---

## 0 · Cover

| Field          | Value                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------ |
| Brand          | **Heuresys**                                                                               |
| Wordmark       | `heuresys` (lowercase) · Exo 2 700 · `y` accent purple weight 500                          |
| Tagline        | _Layer ontologico tra ERP, HR e BI per governare processi, struttura, ruoli e performance_ |
| Direction      | μ-architect-legacy · D1 closed 2026-05-05 (L19/L21)                                        |
| Version        | v0 — comprehensive textual edition                                                         |
| Repo path      | `.ux-design/07-brand-book/BRAND-BOOK-v0.md`                                                |
| Token version  | 1.0.0 (`.ux-design/05-theme-variants/tokens-*.json`)                                       |
| Production SoT | `services/app/src/styles/active-theme.css`                                                 |

---

## 1 · Mission

Heuresys è una piattaforma SaaS B2B di **Organizational Intelligence & Workforce Orchestration**: un layer ontologico che siede tra i sistemi ERP, HR e BI esistenti per governare in modo unificato:

- **Processi** (PET / Process)
- **Struttura organizzativa** (Enterprise)
- **Ruoli e competenze** (Talent — ESCO bilingue IT/EN)
- **Performance**

Il prodotto rende esplicito un grafo di conoscenza che le aziende mature hanno implicito nei propri sistemi, e lo trasforma in leve operative misurabili.

**Categoria**: Workforce Intelligence Platform · enterprise-grade · multi-tenant · data-driven via Knowledge Graph ESCO.

> Riferimento canonical: [`.ux-design/01-strategy/brand-foundations.md`](../01-strategy/brand-foundations.md)

---

## 2 · Voice & tone

**Lingua**: italiano · termini tecnici e codice in inglese.

**3 tratti permanenti**:

1. **Autorità** — sappiamo di cosa parliamo, non chiediamo permesso
2. **Precisione** — claim con numeri, non aggettivi vuoti
3. **Anti-buzzword** — niente "sinergia", "leverage", "rivoluzione", "AI-powered"

| ✅ Diciamo                                                        | ❌ Non diciamo                                             |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| _"605 RLS policies attive · 326 RBP joins"_                       | _"Soluzione enterprise-grade scalabile"_                   |
| _"Mapping ESCO copre 82,4% del workforce in 14 giorni medi"_      | _"AI-powered workforce intelligence che rivoluziona l'HR"_ |
| _"4 tenant in produzione · 1.524 dipendenti · 270 RTL Bank live"_ | _"Trusted by leading enterprises worldwide"_               |

> Riferimento canonical: [`.ux-design/01-strategy/voice-and-tone.md`](../01-strategy/voice-and-tone.md)

---

## 3 · Personas (8 — coverage RBP completa)

Personas illustrative, non utenti reali. **8 personas = 1:1 mapping con i ruoli RBP canonici Heuresys** (level −1 → 6). Definiscono mappa dei bisogni e dei vincoli del prodotto a tutti i livelli.

| #   | Persona                            | Età | RBP role         | Org · ruolo                       | Capability bisogni / surface chiave                                                              |
| --- | ---------------------------------- | --- | ---------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | **HR Director**                    | 47  | HR_DIRECTOR (2)  | RTL Bank · Chief HR Officer       | Skill gap matrix · succession ready · perf calibration · capability radar                        |
| 2   | **Davide · IT Architect**          | 38  | IT_ADMIN (1)     | RTL Bank · IT Architect           | RBAC governance · integrations health · audit live · KG sync · SAP HCM                           |
| 3   | **Stefania · Line Manager**        | 41  | LINE_MANAGER (5) | RTL Bank · Head Credit Risk Mod.  | Team capability · review cycles · 1:1 OKR · talent retention                                     |
| 4   | **Andrea · Employee**              | 29  | EMPLOYEE (6)     | RTL Bank · Quant Analyst Junior   | Self-service career arc · ESCO mapping · learning paths                                          |
| 5   | **Enzo · Platform Admin**          | —   | SUPERUSER (-1)   | Heuresys System · founder         | Cross-tenant analytics · system metrics · audit log unificato · RBAC matrix viewer cross-tenant  |
| 6   | **Marco · Tenant Owner**           | 54  | TENANT_OWNER (0) | RTL Bank · COO                    | Org snapshot · 8-dept breakdown · compensation FY · 9-box top-2 succession · capability gauge    |
| 7   | **Federica · HR Business Partner** | 39  | HR_MANAGER (3)   | RTL Bank · Risk & Compliance HRBP | Reviews dept-scoped · goals dept-scoped · skill heatmap dept · hire request workflow             |
| 8   | **Sabrina · Department Head**      | 51  | DEPT_HEAD (4)    | RTL Bank · Head Risk & Compliance | Team capability KG scope=team · capability emerging gap · 9-box succession dept · ESCO read-only |

### Note sulle personas

- **1:1 con RBP**: ogni persona corrisponde a uno dei 8 ruoli canonici (`SUPERUSER` -1 → `EMPLOYEE` 6). Coverage completa.
- **Tutte tranne SUPERUSER condividono lo stesso tenant** illustrativo (RTL Bank). SUPERUSER opera cross-tenant (Heuresys System platform).
- **Personas hanno scope-aware surface preferences**: il route handler + RBP middleware rispettano lo scope (es. `?scope=dept` per HR_MANAGER, `?scope=team` per DEPT_HEAD/LINE_MANAGER).

> Riferimenti: [`.ux-design/01-strategy/personas/`](../01-strategy/personas/) — 8 file md narrativi (`01-hr-director.md` … `08-dept-head.md`)

---

## 4 · Audience positioning

| Segment                      | Status                | Note                                                                                              |
| ---------------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| α PMI (50-500 emp)           | Possibile             | Voice tweak verso pragmatic; dashboard density ridotta                                            |
| **β Enterprise (500-5000+)** | **Raccomandato (D2)** | RTL Bank, banche/insurance/utilities mid-large. Multi-tenant, RLS, audit, ESCO 14k skills target. |
| γ Dual-track                 | Pending               | Possibile post-product-market-fit, non da day-1                                                   |

Tutta la stack è progettata β Enterprise-first (multi-tenant default, P1-P10 enforcement, 605 RLS policies, 326 RBP joins).

> Riferimento canonical: [`.ux-design/01-strategy/audience-positioning.md`](../01-strategy/audience-positioning.md)

---

## 5 · Aesthetic direction · μ-architect-legacy (D1)

**D1 risolto** 2026-05-05 (L19/L21). Direzione canonical = `mu-architect-legacy.html`: Set 5 Systems POV con palette legacy `www.heuresys.com` (Exo 2 + dark navy + brand blue + purple accent + gradient blue→purple).

**Fingerprint**:

- Tonalità: Trustworthy 60% / Courage 40% (data-dense pro · clarity 60% · expressiveness 40%)
- Mood: cinematic dark + functional · architect-grade · sub-saturazione disciplinata
- Reference compass: Linear · ClickHouse · Stripe · Vercel · Apple keynote
- Anti-pattern bandita: blinking dots · neon overdose · gradient su section interi · 3° brand color

**32 direzioni esplorate** (Set 1-5) prima di chiusura D1. Decisioni scartate documentate in `DECISIONS-LOG.md` § Scartate.

> Riferimento canonical: [`.ux-design/02-aesthetic/direction-explorations/mu-architect-legacy.html`](../02-aesthetic/direction-explorations/mu-architect-legacy.html) + [`.ux-design/02-aesthetic/heuresys.DESIGN.md`](../02-aesthetic/heuresys.DESIGN.md)

---

## 6 · Color (OKLCH spec)

### Brand inviolabili

| Token             | OKLCH                  | Hex       | Use                                                                              |
| ----------------- | ---------------------- | --------- | -------------------------------------------------------------------------------- |
| `--brand-primary` | `oklch(0.62 0.19 260)` | `#3b82f6` | Wordmark body (L27) · primary CTA · link · focus ring                            |
| `--brand-accent`  | `oklch(0.63 0.26 297)` | `#a855f7` | Wordmark `y` accent (L25) · glow soft · capability score positive · gradient end |

### Theme dark (default)

`background #0a0a10` · `surface-1 #131320` · `ink #f5f6fa` · `accent #5e69d1` · `rule #25262d`. Vedi `tokens-dark.json` per scala completa.

### Theme light (derivato)

`background #f7f8fb` · `surface-1 #ffffff` · `ink #0a0a10` · `accent #4954c4` · `rule #d8dae0`. Vedi `tokens-light.json`.

### Semantic

`success #5fb87a` · `warning #d4a017` · `danger #ef4444` · `info #3b82f6`.

### Capability dimensions (KG viz)

`process` blue · `structure` cyan · `role` purple · `competence` green · `performance` amber.

### Gradient brand

Linear `135deg, #3b82f6 → #a855f7`. **Solo** per CTA primary, hero accent strip, text gradient puntuale. **Mai** su section interi.

### Anti-pattern color

- ❌ Mai purple come primary diffuso (solo accent puntuale)
- ❌ Mai gradient su section interi
- ❌ Mai 3° brand color
- ❌ Mai warm (orange/red/yellow) come accent (solo semantic)
- ❌ Mai background ad alta saturazione

### Contrast WCAG

Tutte le coppie testate ≥ AA. Foreground/background AAA (~17:1 dark, ~16:1 light). Per WCAG 2.2 AAA full audit (target 7:1 ovunque), pending.

> Riferimento canonical: [`.ux-design/03-visual-identity/color/palette-final.md`](../03-visual-identity/color/palette-final.md)

---

## 7 · Typography

### Stack ufficiale

| Layer              | Font               | Weight              | Use                                                    |
| ------------------ | ------------------ | ------------------- | ------------------------------------------------------ |
| **Wordmark**       | **Exo 2**          | 700 + y 500         | SOLO logo wordmark "heuresys", mai per altri heading   |
| **Body / heading** | **Inter**          | 400-500-600-700-800 | Tutto il resto: headline, body, label, button, link    |
| **Data / mono**    | **JetBrains Mono** | 400-500-600-700     | Numeri tabular, code, ID, token names, breadcrumb mono |

### Type scale

Base 16px, ratio 1.25 modular: `9 / 11 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 80 / 88`.

Token names: `2xs · xs · sm · base · md · lg · xl · 2xl · 3xl · 4xl · 5xl · hero`.

### Letter-spacing rules

| Context                 | Value                  |
| ----------------------- | ---------------------- |
| Body, label, mono       | `normal` (no override) |
| Heading 22-36           | `-0.5px` tight         |
| Heading 48-64           | `-1.5/-2px` tighter    |
| Heading 80-88 hero      | `-3px` tightest        |
| Wordmark Exo 2          | `-0.5px`               |
| Mono uppercase tracking | `1.5-2px` wide         |

### Font-feature-settings (always on)

```css
font-feature-settings:
  'tnum' 1,
  'cv11' 1,
  'ss01' 1;
```

(Tabular nums + Inter single-storey 'a' + stylistic set 01.)

### Anti-pattern typography

- ❌ NO serif fonts (Fraunces, Source Serif, Newsreader, DM Serif)
- ❌ NO italic sulla y del wordmark (L18 — Exo 2 sans descender problem)
- ❌ NO weight 200 per la y (gap troppo estremo)
- ❌ NO letter-spacing custom sulla y o adiacenti
- ❌ NO upper-case wordmark ("HEURESYS")
- ❌ NO font variabile per body

> Riferimento canonical: [`.ux-design/03-visual-identity/typography/typography-final.md`](../03-visual-identity/typography/typography-final.md)

---

## 8 · Logo · 3 regole permanenti (L25 · L27 · L28)

### L25 — Wordmark structure (PERMANENT)

- `h` lowercase
- Tutte le 8 lettere identiche: stesso peso, stessa size, stesso style (eccetto la `y`)
- **SOLO** la `y` ha colore diverso
- HTML pattern: `<span class="wordmark">heures<span class="y">y</span>s</span>`
- SVG pattern: `<text>heures<tspan>y</tspan>s</text>`
- Embed obbligatorio in tutte le ricorrenze "heuresys" — header, footer, modal

### L27 — Logo originale (canonico)

- 2 colori fissi (no theme inheritance):
  - body = `var(--brand-blue)` (`#3b82f6`)
  - y = `var(--accent)` (`#a855f7`)
- Exo 2 weight 700 body, 500 y
- **ECCEZIONE plain text**: indirizzi, link, domini → testo neutro consentito (`heuresys.com` in monospace, niente colorazione)

### L28 — Logo relativo (convenzione tematizzata)

- Classe `.wordmark-relative`
- Stessa struttura del logo originale MA:
  - body = `var(--logo-body, var(--ink))` — derivato dal tema CSS attivo
  - y = `var(--accent)` — stesso accent del tema attivo
- Per surface tematizzate (direction estetica · palette cliente custom · variante stagionale)
- **NON** è light/dark — è "logo che adatta colore al contesto cromatico"

### Asset SVG canonical

| File                                     | Use                                |
| ---------------------------------------- | ---------------------------------- |
| `heuresys-wordmark.svg`                  | Default wordmark (L27 originale)   |
| `heuresys-wordmark-monochrome-dark.svg`  | Su sfondo scuro                    |
| `heuresys-wordmark-monochrome-light.svg` | Su sfondo chiaro                   |
| `heuresys-mark.svg`                      | Solo "y" isolata (favicon outline) |
| `favicon.svg`                            | "y" su quadrato dark               |
| `og-image-template.svg`                  | 1200×630 social preview            |

Path: [`.ux-design/03-visual-identity/logo/final/`](../03-visual-identity/logo/final/)

> Riferimento canonical: [`.ux-design/02-aesthetic/logo-standard.md`](../02-aesthetic/logo-standard.md)

---

## 9 · Motion language

**Direttiva**: trustworthy 60% / courage 40%. Movimento **funzionale, mai decorativo**. Mai > 600ms per UI element.

### 5 pattern canonici

1. **Wordmark glow breathing** — hero glow soft purple, 4s loop ease-in-out (NEVER on dashboard chrome)
2. **Theme transition** — color tokens 200ms ease-out (NO layout transition)
3. **KG topology hover** — node scale 1→1.15 + edges focus/blur 150ms
4. **Sparkline draw** — KPI sparkline left-to-right + count-up 200ms (max anti-slop)
5. **Scroll reveal** — opacity + translateY(8px), stagger 60ms, ONE-TIME

### Token (snippet)

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1); /* baseline active-theme */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* entry primary */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* SPARINGLY */
--duration-fast: 120ms; /* baseline active-theme */
--duration-base: 200ms;
--duration-slow: 320ms;
--duration-loop-glow: 4s;
```

### Anti-pattern motion

- ❌ Animated status dots (blinking · pulsing · orbit)
- ❌ Spinning loaders > 16px (use skeleton)
- ❌ Bouncy/elastic easing on business UI
- ❌ Animation > 600ms per UI element
- ❌ Auto-playing video / parallax overpowering
- ❌ Re-animate scroll reveal on re-enter viewport

### Accessibility

`@media (prefers-reduced-motion: reduce)` enforcement obbligatorio (vedi `tokens-motion.json` § accessibility).

> Riferimento canonical: [`.ux-design/04-motion-language/motion-final.md`](../04-motion-language/motion-final.md) + 5 prototipi `01-wordmark-glow.html` … `05-scroll-reveals.html`

---

## 10 · Dashboard architecture

Regola **4-elementi data-driven** (Phase 9):

1. **Header** (nav-bar 50px) — back link · wordmark · phase label · theme toggle
2. **Sidebar** (240px collapsible 64px) — toggle · tenant-mini card · h4 sections collassabili · sidebar links · user-card bottom
3. **Workspace** (flex 1) — ws-header (breadcrumb · h1 · scope-pill · actions) · KPI ring · main panels · ws-footer
4. **Footer** (app-footer 32px) — copyright + socials + ft-dynamic context-aware status pulses

**Theme inheritance**: tutti i 4 elementi consumano gli stessi token. Theme switch propaga ovunque via CSS custom properties (no JS state).

**Nested dashboards**: senza header/footer ripetuti — solo workspace inner.

### Inventory mockup `06-mockups/dashboards/` (5 surface)

| File                         | Persona             | Perspective | Widget core                                                                                    |
| ---------------------------- | ------------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `hr-director-overview.html`  | HR Director         | TALENT      | KpiRing · SkillHeatmap · activity feed · SuccessionCard                                        |
| `capability-graph.html`      | IT Admin            | ENTERPRISE  | KgMiniGraph hero · ontology breakdown · ESCO sync                                              |
| `skills-heatmap.html`        | HR Director         | TALENT      | matrice 8 dept × 12 skill · filters · distribution histogram                                   |
| `employee-journey.html`      | Employee            | TALENT      | profile hero · CareerArc 5-stage · CapabilityRadar · KgMiniGraph                               |
| `org-systems.html`           | IT Admin (platform) | ENTERPRISE  | 4 tenant fleet · RbacMatrix · IntegrationHealthPill · audit log                                |
| `cross-tenant-overview.html` | SUPERUSER           | ENTERPRISE  | Cross-tenant analytics · workforce trend chart · capability gauges (Phase 14.SH carry-forward) |
| `tenant-owner-overview.html` | TENANT_OWNER        | ENTERPRISE  | Org snapshot · 8-dept breakdown · compensation plan · succession (Phase 14.SH carry-forward)   |

### 4 mockup PROCESS (Phase 13.D)

`process-recruiting-funnel` · `process-onboarding-flow` · `process-performance-cycle` · `process-learning-paths`.

### Production runtime

Dashboard data-driven via `dashboard-engine` Phase 13.C: route `/dashboard/[code]` carica preset+elements da Postgres bare-metal SoT (4 tenants · 270+ employees), risolve via RBP visibility + perspective filter, prefetch live data per element via 8-widget adapter registry, render CSS Grid layout client-side.

> Riferimenti: [`.ux-design/01-strategy/dashboard-architecture.md`](../01-strategy/dashboard-architecture.md) · [`docs/20-architecture/dashboard-engine-pattern.md`](../../docs/20-architecture/dashboard-engine-pattern.md) · [`services/app/src/lib/dashboard-engine/`](../../services/app/src/lib/dashboard-engine/)

---

## 11 · UI components — principi

**Library**: `@heuresys/ui` Cantiere B v2 · ~180 component · Storybook 9 (84 stories) · GitHub Pages.

### Principi

1. **Server-first** — server components default, client opt-in via `'use client'`
2. **Token-driven** — zero hardcoded colors/dimensions, sempre `var(--*)`
3. **Theme-invariant API** — i component non sanno se sono dark/light, leggono token
4. **Accessibility obbligatoria** — `aria-*` su ogni interactive · keyboard nav · focus visible
5. **No animation gratuita** — match motion-final.md pattern + anti-pattern bandita
6. **Composition > configuration** — preferire children/slots a 20 prop boolean

### Component flagship

`<HeuresysWordmark>` (variant default/relative) · `<AppShell>` (brand topbar + nav sidebar + content) · `<DashboardGrid>` (CSS Grid + drag-resize editor) · `<KpiRing>` `<SkillHeatmap>` `<CareerArc>` `<CapabilityRadar>` `<KgMiniGraph>` `<SuccessionCard>` `<RbacMatrix>` `<IntegrationHealthPill>` (8 atomic dashboard widgets TIER 17).

### Naming convention

PascalCase · noun-based · prefix `Heuresys` solo per brand-locked (`<HeuresysWordmark>`). Atomic widget = bare noun (`<KpiRing>`, non `<HeuresysKpiRing>`).

---

## 12 · Accessibility

**Target**: **WCAG 2.2 AAA full** (D-A11Y · Phase 14.SH FASE 4 · pending audit).

### Status corrente

| Capitolo                       | Status                                               |
| ------------------------------ | ---------------------------------------------------- |
| Color contrast AA              | ✅ Verified (palette-final.md)                       |
| Color contrast AAA (7:1)       | 🟡 Audit pending                                     |
| Keyboard navigation            | ✅ AppShell + form base                              |
| Focus visible                  | ✅ Token `--color-ring`                              |
| Screen reader (NVDA/VoiceOver) | 🟡 Manual pass pending                               |
| `prefers-reduced-motion`       | ✅ Enforced in active-theme.css + tokens-motion.json |
| Target size ≥ 24×24            | 🟡 Audit pending                                     |
| Drag alternatives              | 🟡 Editor mode pending                               |
| Live regions (`aria-live`)     | 🟡 Sprint follow-up                                  |
| Inline help text               | 🟡 Sprint follow-up                                  |

### Convenzioni obbligatorie

- Ogni `<button>` ha `aria-label` se contiene solo icona
- Form input hanno `<label>` esplicita o `aria-labelledby`
- Color contrast verificato via tool (axe-core CI integration pending)
- Keyboard shortcut documentati e non confliggono con browser/OS

### Anti-pattern accessibility

- ❌ Color-only state communication (use icon + text + color)
- ❌ Animation infinite senza opt-out
- ❌ Tooltip su elementi non-focusable
- ❌ Modal senza focus trap
- ❌ Skip link mancante in route con sidebar

---

## 13 · Do's & Don'ts (cross-cutting)

| ✅ Do                                                              | ❌ Don't                                                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Usa `var(--token)` per ogni color/dimension                        | Hardcoded hex `#abcdef` nei component                          |
| Wordmark sempre lowercase + struttura L25                          | "Heuresys" capital-first o "HEURESYS" upper                    |
| Gradient blue→purple SOLO per CTA + text accent                    | Gradient su section background, hero strip, card               |
| Italiano + termini tecnici inglesi                                 | Buzzword: "sinergia", "leverage", "AI-powered", "rivoluzione"  |
| Numeri concreti nei claim ("605 RLS · 270 emp")                    | Aggettivi vuoti: "scalable", "world-class", "next-gen"         |
| Motion solo per feedback / focus / state / wait fillers            | Motion decorativa, blinking, bouncy, infinite spinner > 16px   |
| Token JSON come SoT portabile + active-theme.css come SoT runtime  | Editare uno senza l'altro (sync obbligatorio)                  |
| RLS DB-level + RBP middleware + audit log per ogni write           | Auth check solo client-side, role hardcoded, write senza audit |
| Dark theme default per dashboard                                   | Forzare light per "leggibilità marketing"                      |
| Capability dimension colors fissi (process=blue · role=purple · …) | Inventare 6° dimensione color o rimappare a piacere            |

---

## 14 · File map (governance)

```
.ux-design/
├── README.md                                  # Policy segregazione + struttura
├── SESSION-RESUME.md                          # Resume protocol cross-session
├── BRAND-STATE.md                             # SoT phase + decisioni
├── DECISIONS-LOG.md                           # Cronologia append-only L1→L34
├── 01-strategy/                               # Mission, voice, personas, audience, dashboard arch
├── 02-aesthetic/                              # 32 direzioni esplorate + heuresys.DESIGN.md (9 sezioni canoniche)
│   ├── direction-explorations/                # 32 file HTML α→μ (D1 = mu-architect-legacy)
│   └── logo-standard.md                       # L16/L18/L25/L27/L28
├── 03-visual-identity/
│   ├── color/palette-final.md                 # OKLCH spec dark+light
│   ├── typography/typography-final.md         # Stack Exo2+Inter+JetBrains
│   └── logo/final/*.svg                       # 6 SVG canonical
├── 04-motion-language/
│   ├── motion-final.md                        # SoT spec
│   ├── 01-wordmark-glow.html                  # Prototipo 1
│   ├── 02-gradient-transitions.html           # Prototipo 2
│   ├── 03-kg-topology-hover.html              # Prototipo 3
│   ├── 04-sparkline-animate.html              # Prototipo 4
│   └── 05-scroll-reveals.html                 # Prototipo 5
├── 05-theme-variants/                         # Phase 11 — design tokens portable
│   ├── tokens-dark.json                       # SoT W3C DTCG dark
│   ├── tokens-light.json                      # Override light
│   ├── tokens-motion.json                     # Motion presets
│   └── README.md                              # Uso + compatibility
├── 06-mockups/
│   ├── auth/                                  # 4 login variants (login-aurora promosso production)
│   └── dashboards/                            # 7 mockup HTML (5 Phase 9 + 2 Phase 14.SH carry-forward)
├── 07-brand-book/
│   └── BRAND-BOOK-v0.md                       # Questo file (Phase 12)
├── 08-promotion/                              # v1 promotion checklists (vuoto, futura)
├── 10-staging/                                # Studio workstream — staging cloni produzione
└── 99-samples/                                # Read-only reference library (rohitg00 + voltagent)
```

### Production binding

| `.ux-design/` artifact                   | Production binding                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `tokens-dark.json` / `tokens-light.json` | `services/app/src/styles/active-theme.css`                                         |
| `tokens-motion.json`                     | (idem · sezione motion)                                                            |
| Logo SVG canonical                       | `services/app/public/brand/*.svg` (futuro export)                                  |
| Mockup HTML dashboards                   | `services/app/src/app/(app)/dashboard/[code]/` (data-driven via Phase 13.C engine) |
| Login mockup `login-aurora.html`         | `services/app/src/app/login/page.tsx` (Phase 14.SH FASE 1)                         |

### Vincolo cross-pollination

**Nessun import diretto** da `.ux-design/` in production code (`services/`, `packages/`). Solo mirror controllato via:

1. CSS hand-port (`active-theme.css` ← copia da prototipi)
2. Token JSON build pipeline (Style Dictionary, futuro)
3. SVG logo asset copy (futuro)

Questo separa lab da prod e permette evoluzione del brand senza release pressure.

---

## 15 · Governance + changelog

### Cadence aggiornamenti

- **`BRAND-STATE.md`** — ogni decisione brand (immediato)
- **`DECISIONS-LOG.md`** — ogni decisione, append-only con `Lnn` numbered
- **`active-theme.css`** — ogni token cambio, in sync con `tokens-*.json`
- **Brand book v0 → v1** — quando v0 verrà rifinito editorialmente con layout grafico

### Approval gates

- **Logo modifica** → Enzo approval (single coder + brand owner)
- **Color token aggiunta/rinomina** → revisione + sync `tokens-*.json` + `active-theme.css`
- **Motion pattern nuovo** → prototipo HTML + add a `motion-final.md` + `tokens-motion.json`
- **Direction estetica nuova** (es. ν, ξ) → ammessa solo come exploration in `02-aesthetic/direction-explorations/`, mai promossa a default senza superseding D1 esplicito

### Versioning brand book

| Version | Date       | Note                                                                               |
| ------- | ---------- | ---------------------------------------------------------------------------------- |
| v0      | 2026-05-07 | First comprehensive textual edition. Phase 12 close. Aligned to L34/Phase 14.SH.   |
| v1      | (futura)   | Edizione visiva con typesetting curato + cover art + asset embed alta risoluzione. |

### Changelog macro decisioni (L1→L34)

Cronologia completa in [`DECISIONS-LOG.md`](../DECISIONS-LOG.md). Highlights:

| L   | Date       | Decision                                                                              |
| --- | ---------- | ------------------------------------------------------------------------------------- |
| L1  | 2026-05-04 | Scope `.ux-design/` = B (docs + asset + JSON, no React sperimentale)                  |
| L2  | 2026-05-04 | Greenfield, guida progressiva, scelte a vista via Chrome                              |
| L3  | 2026-05-04 | Compass: Linear, Vercel, Stripe, Apple keynote, Awwwards                              |
| L4  | 2026-05-04 | Phase 9 dashboard = focus massimo                                                     |
| L5  | 2026-05-04 | `.ux-design/` versionato cross-machine via git                                        |
| L8  | 2026-05-05 | Light+dark dual mode in pari dignità per Set 2                                        |
| L14 | 2026-05-05 | `99-samples/` library integrata + DESIGN.md a 9 sezioni canoniche                     |
| L16 | 2026-05-05 | Logo y-accent standard (peso gap moderato 700→500)                                    |
| L18 | 2026-05-05 | NO italic sulla y (Exo 2 sans descender problem)                                      |
| L19 | 2026-05-05 | Esperimento mu-architect-legacy con palette legacy www.heuresys.com                   |
| L21 | 2026-05-05 | **D1 closed** — μ-architect-legacy promosso direzione canonical                       |
| L22 | 2026-05-05 | Phase 9 dashboard mockup 5/5 layout v2 (sidebar collapsible, h4 sezioni collassabili) |
| L24 | 2026-05-05 | Phase 8 motion language shipped (5 prototipi + motion-final.md)                       |
| L25 | 2026-05-05 | **Wordmark PERMANENT**: h lowercase + tutte lettere identiche + solo y color diverso  |
| L27 | 2026-05-06 | "Logo originale" canonical: 2 colori fissi (brand-blue + accent purple)               |
| L28 | 2026-05-06 | "Logo relativo" convenzione `.wordmark-relative` per surface tematizzate              |
| L29 | 2026-05-06 | Phase 13.A — 8 atomic dashboard widget TIER 17                                        |
| L30 | 2026-05-06 | Phase 13.B — schema migration 0002 + 9 preset + 30 element seeded                     |
| L31 | 2026-05-06 | Phase 13.C+D+E — engine renderer + 4 mockup PROCESS + docs                            |
| L32 | 2026-05-07 | Phase 14 Sprint 1 — live data binding + i18n + Playwright RBP matrix                  |
| L33 | 2026-05-07 | Phase 14 Sprint 2 — `auditedDashboardMutation()` + /ontology + Tier 2 explorer        |
| L34 | 2026-05-07 | DBMS bare-metal promosso SoT + Phase 14.SH plan approvato + execution shipped         |

### Roadmap prossima

Post brand book v0 (questo file):

1. **WCAG 2.2 AAA full audit** — axe-core CI + manual NVDA/VoiceOver pass (~3-5h)
2. **Production build perf bench** — `next build` + autocannon prod, target P95 ≤ 500ms (~1-2h)
3. **API gateway cross-service JWT fix** — `jose` library, riabilitare api-gateway calls (~2-3h)
4. **Phase 11.1 token build pipeline** — Style Dictionary v4 generator JSON → CSS/JS/Swift (futuro)
5. **Brand book v1 visivo** — typesetting + cover art + assets embed alta risoluzione (futuro)
6. **Direction ν / ξ** se richiesta esplicita (mai automatic)

---

## Cross-reference rapido

| Per…                                  | Vedi                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Cambiare un token color**           | `services/app/src/styles/active-theme.css` + `.ux-design/05-theme-variants/tokens-*.json`                                            |
| **Aggiungere una direction estetica** | `.ux-design/02-aesthetic/direction-explorations/` + `BRAND-STATE.md` § Phase 4                                                       |
| **Capire perché D1 è μ-architect**    | `DECISIONS-LOG.md` L19→L21                                                                                                           |
| **Riprendere la sessione brand**      | `.ux-design/SESSION-RESUME.md` + skill `brand-resume`                                                                                |
| **Integrare token in nuovo tool**     | `.ux-design/05-theme-variants/README.md` § Uso lato consumer                                                                         |
| **Testare WCAG su una vista**         | (pending) `docs/40-operations/a11y-audit-2026-05-07.md`                                                                              |
| **Promuovere mockup a produzione**    | Skill `studio` + `/studio:promote <route> <TS>`                                                                                      |
| **Catalogo asset dashboard (audit)**  | [`08-promotion/brand-dashboard-catalog-CURRENT-STATE.md`](../08-promotion/brand-dashboard-catalog-CURRENT-STATE.md) — pre-flight L40 |

---

**Brand book v0 — fine documento.**

Per dettagli approfonditi, ogni sezione punta al file canonical SoT corrispondente. Questo brand book è il punto di ingresso unificato; i SoT individuali sono la verità per implementazione.
