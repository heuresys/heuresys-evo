# Inspirations Extracted — 7 Reference Sites (DESIGN.md-style)

> **Status**: Draft cycle 2 (Phase 0 T0.3) · 2026-05-14 · WebFetch su 7 siti reference per estrarre design summary canonical da usare come "lift / avoid" guide nel rebuild investor-ready.
>
> **Method**: per ogni sito, 10 dimensioni osservate (header · palette · typography · layout · density · motion · drilldown · KPI rep · LIFT · AVOID). Inferenze da WebFetch markdown + screenshot dei content + industry knowledge. Dove la landing è marketing (non product UI) la nota è esplicita.
>
> **Caveat note**: Vercel `/dashboard`, PostHog product UI, e Notion app sono dietro auth/paywall — il WebFetch ha ritornato la marketing landing. Per quei 3 il design summary è inferred parzialmente dalla marketing + product screenshot pubblici osservabili nel content + industry knowledge consolidata su quelle product UI (esplicitamente flaggato nei rispettivi blocchi).

---

## Linear (linear.app)

### Header

Logo wordmark left-aligned, horizontal nav primary (Product, Resources, Customers, Pricing, Now, Contact), secondary right (Docs, Open app, Log in, Sign up). Search non prominente in marketing — DENTRO l'app Cmd+K è la primary navigation. Account widget minimo.

### Palette

Marketing: near-white background, dark charcoal text, blue-tinted accent (issue status), semantic green/orange/gray. Product UI (Linear app): dark mode default `#0E0F11` background, surface `#1A1B1F`, accent purple-blue `#5E6AD2`, text `#F0F0F2`. High-contrast saturated brand color usato sparingly.

### Typography

Inter Display (font-family proprietaria) + system fallback. Weights 400/500/600. Hierarchy: display 32-48px headline, 24px section, 16px body, 13px caption. Tabular figures attivati su numeri. Line-height generoso (1.5-1.6 marketing, più stretto 1.4 nell'app).

### Layout

12-col responsive marketing. Product app: sidebar persistent ~240px collapsibile (Cmd+B), main content fluid, optional right detail panel slide-over. Gutter 16-24px. Max width content constrained per readability.

### Density

Medium (marketing) → Medium-compact (app). Issue list 36-40px row height. Cards con padding 16-20px. Generous between major sections, tight within data tables.

### Motion

"Designed for speed" leitmotif. Transitions 120-200ms ease-out. Hover state: subtle bg shift (`color-mix` 4-8%). Cmd+K opening: scale+fade 150ms. Issue status change: micro-pulse. Tooltip keyboard hint dopo 1-2s pausa. No bounce/spring (industrial feel).

### Drilldown

Issue ID (ENG-2703) → side panel slide-over con tab interne (Activity, Sub-issues, Linked, Attachments). NON full-page nav. Breadcrumb implicit via issue ID. Backlog/Todo/In Progress/Done columns con count badge.

### KPI rep

Cycle time card · burndown chart · throughput bar chart. Numbers large + sparkline below + delta % colored. Agent status indicators animate ("Thought for 5s"). Status badges color-coded (Performance, iOS, High priority).

### LIFT

1. Cmd+K command palette — replicate per global navigation/search/action heuresys
2. Side panel drilldown (issue detail) — pattern per employee/role/skill detail
3. Keyboard hint tooltip on hover — educational overlay senza dedicated onboarding tour

### AVOID

1. Marketing landing molto airy NON è la product UI — il cockpit heuresys deve essere denser
2. Linear è opinionated single-purpose (issue tracking) — heuresys è multi-dominio (HR + comp + skill + 9-box), evita single-list-mental-model
3. Agent opacity nella feature recente Codex — se esponi AI, explicit owner (Linear lo fa bene, replicate)

---

## Vercel Dashboard (vercel.com/dashboard)

### Header

**NOTA paywall**: WebFetch ha ritornato login page (form centered, Vercel logo + Sign Up CTA). Product dashboard inferred da screenshot pubblici Vercel marketing + industry observation.

Inferred header app: logo top-left, team switcher dropdown adjacent, breadcrumb path `Team / Project / Environment`, search bar centro, notification bell + user avatar right. Tabs sub-header per project (Overview, Deployments, Analytics, Logs, Settings).

### Palette

Inferred dark mode (Vercel default): background `#000000` pure black + `#0A0A0A` surface, foreground `#FAFAFA`, accent gradient blue-purple, semantic verde success / red error / yellow warning. Pure black per OLED battery + maximum contrast.

### Typography

Geist Sans (proprietaria Vercel) + Geist Mono per code/URL. Inter fallback. Weights 400/500/600/700. Tabular numerals on metrics. Code blocks monospace strongly stylized.

### Layout

Sidebar 240px collapsibile, main content area, optional inspector panel right. Project cards grid: 3-4 col responsive desktop, 1 col mobile. Activity feed right-rail collapsible.

### Density

Medium. Project cards padding 16-20px. Activity feed compact 32-36px row. Deployment list table data-dense.

### Motion

Page transitions 150ms fade. Card hover: subtle border glow accent gradient. Deployment status pulse (in-progress). Analytics chart hover tooltip: instant. Skeleton shimmer on async load.

### Drilldown

Project card click → project overview page (separate route, NOT slide-over — è il differentiator vs Linear). Deployment row click → deployment detail panel with logs streaming. Breadcrumb back navigation.

### KPI rep

Status pills prominent: Ready (verde), Error (red), Building (animated yellow), Queued (gray). Deploy time (monospace), build duration sparkline. Bandwidth/edge requests big numbers + delta % vs previous period.

### LIFT

1. Status pill animation per in-progress state — replicate per "AI computing recommendation" / "import in progress"
2. Project cards grid pattern → tenant cards grid per SUPERUSER cross-tenant overview (already partially shipped in `cross_tenant_overview` preset)
3. Activity feed right-rail timeline — pattern 18 trend research

### AVOID

1. Login form full-screen forced — heuresys ha già aurora-login promoted, no regression
2. Page-navigation drilldown (Vercel) — heuresys preferisce slide-over per HR Director context-keeping
3. Pure black `#000` può essere troppo aggressive — la baseline `μ-architect-legacy` navy `#0F1419` è più "calm cockpit"

---

## PostHog (posthog.com)

### Header

**NOTA paywall**: WebFetch ha ritornato marketing landing (Product OS, Pricing, Docs, Community, Company, Get started free CTA). Product UI dashboard PostHog inferred da industry observation + Mobbin references.

Inferred app: logo top-left, project selector dropdown, primary nav left sidebar (Insights, Dashboards, Notebooks, Surveys, Feature Flags, Experiments), breadcrumb top, search Cmd+K, user avatar right.

### Palette

Marketing: high-saturation playful (purple-blue gradient, vibrant accent). Product UI inferred: light mode default + dark optional, surface white/off-white, accent purple `#7B61FF` PostHog brand, semantic full range.

### Typography

Inter (most likely) + system. Weights 400-700. Display chunky bold headlines (marketing). Body 14-16px. Code blocks monospace. Charts axis labels small 11-12px.

### Layout

12-col responsive marketing. Product UI: dual sidebar pattern (primary left + secondary filter/property panel optional). Dashboard grid drag-resizable cells (custom dashboard composition). Chart composition tile-based.

### Density

Marketing medium-sparse, product UI medium-dense. Insight cards 280-320px wide, mosaic layout. Property panel 280px right with filter chips stack.

### Motion

Chart drawing animation on load (line/bar animate-in 400ms). Tooltip on hover instant. Funnel step transition smooth. Insight creation: live preview update as user adjusts query.

### Drilldown

Insight click → full insight page (separate route) con query editor + visualization + breakdown. Breakdown click on chart → drill into segment. Notebook pattern: long-form analysis page.

### KPI rep

Trend cards: number + delta % + sparkline. Funnel viz with drop-off % each step. Path analysis (sankey-style). Retention cohort grid. Heat-map per usage frequency. Mix di chart types — non solo card.

### LIFT

1. Dashboard drag-resize tile composition — eventualmente per HR_DIRECTOR power-user custom dashboard (NON day-1, future iter)
2. Funnel visualization con drop-off % — pattern per Recruiting Funnel / Onboarding Flow / Performance Cycle in heuresys
3. Property filter chips right-panel — pattern 8 trend research, specifically apply pattern

### AVOID

1. Chart composition complexity (PostHog è analyst-oriented) — heuresys HR Director non scrive query, AI insight card pre-composta
2. Marketing-page color saturation aggressive — heuresys palette controllata (μ-architect-legacy baseline)
3. Dual sidebar mangia 480px screen su laptop 13" — heuresys deve restare single sidebar + slide-over

---

## Stripe (stripe.com)

### Header

Logo Stripe left, horizontal nav (Products, Solutions, Developers, Resources, Pricing), language selector (it/en visible), Login + Sign up CTA right. Mega-menu on hover per category. Sticky on scroll.

### Palette

Marketing: white background dominant, near-black `#1A1A1A` text, purple-blue brand `#635BFF`, gradient accents (Stripe signature). Stripe Dashboard product (Stripe Atlas/Dashboard UI): light mode default crisp, dark mode optional. Numbers in success green `#00D084`.

### Typography

Stripe Sans (proprietaria, custom Söhne-like) + system fallback. Weights 400/500/600. Tabular numerals enabled. Hierarchy: 64px hero, 32px section, 24px subhead, 16px body, 14px secondary, 12px micro. Tight tracking on display.

### Layout

12-col responsive marketing. Product Dashboard: sidebar ~220px + main content + optional inspector. Tables data-dense con sticky header. Metric cards 2-4 col grid.

### Density

Medium (marketing) → Medium-dense (Dashboard product). Numerical density notable: balance/transaction/conversion metrics tightly packed but with strong typography hierarchy.

### Motion

Subtle. Page transition 100-150ms fade. Card hover: small shadow lift + 1-2px translateY. Number ticker animation on initial load (count-up). Chart animate draw 300-400ms.

### Drilldown

Payment row click → payment detail page (full route nav — Stripe pattern). Customer click → customer profile with transaction history nested. Hierarchical breadcrumb. Inline filter saved as URL params.

### KPI rep

"1,9 Bln USD", "99,999%", "200 Mln+" big numbers + context label. Percentile overlay (P50/P95/P99 lines on chart). Cohort tables with conditional fill. Color-coded scoring (Risk score: green/yellow/red).

### LIFT

1. Tabular numerals + monospace numbers in tables — pattern 11 strongly verified by Stripe
2. Percentile overlay on chart (P50/P95) — replicate per salary band distribution, performance score distribution
3. Strong typography hierarchy come signal of trust/professionalism — investor-ready signal #1

### AVOID

1. Marketing-page extreme whitespace — heuresys cockpit non è landing page
2. Stripe è transactional-flow oriented — heuresys è exploratory (HR Director scopre insight), preferire slide-over a route-nav drilldown
3. Pure white background full-screen — heuresys baseline dark, light mode rimane opt-in

---

## ClickHouse (clickhouse.com)

### Header

Logo + version (clickhouse.com), nav: Use Cases, Cloud, Open Source, Docs, Community, Blog. Dual CTA: "Try Cloud" + "Get OSS". Client logo carousel below hero.

### Palette

Likely bright blue/cyan accent (typical analytics tech). White/light gray backgrounds in marketing. Dark gray text. Industrial palette (not warm/playful). Code blocks dark background contrast.

### Typography

Sans-serif modern geometric headlines (Inter or proprietary). **Monospace numerals visible** in stats ("2.9k+ Contributors", "47.4k+ Stars"). Code blocks: `JetBrains Mono` o `Fira Code` likely. Strong contrast between display weight and body.

### Layout

12-col responsive. Sections alternate full-width hero + 3-col card grid + 2-col split. Logo carousel packs 50+ clients (data-dense industrial flex).

### Density

**Data-dense industrial**. FAQ accordion (compression). Use case cards stack vertically with icons + copy + CTAs. Quantified callouts repeated ("10x performance", "50x faster").

### Motion

Carousel auto-advance (logo strip). Tab filtering for use case category. Hover state on CTAs. Less playful than PostHog, more "industrial reliability".

### Drilldown

Hero → use case category → client testimonial video → detailed case page (linked). "Explore [topic] →" repeating CTA. Linear path forward.

### KPI rep

Large numerical callouts: "2.9k+ Contributors", "47.4k+ Stars", "790+ Releases". Comparative metrics ("10x", "50x"). Monospace numerals reinforces "we measure precisely" trust signal.

### LIFT

1. Monospace numerals + auto-updating counter feel — KPI cards heuresys con tabular figures e count-up animation on initial render
2. Logo carousel pattern → tenant logo strip in SUPERUSER cross-tenant overview (RTL Bank · SmartFood · EcoNova · Heuresys System)
3. Industrial reliability tone (vs playful) — banking context RTL Bank K.64.19 richiede questa serietà

### AVOID

1. Carousel auto-advance può disturbare — usare static grid o user-controlled
2. ClickHouse è developer-tool homepage — heuresys non deve sembrare "ops/devtool", deve sembrare "executive intelligence cockpit"
3. Bright cyan accent — heuresys palette controllata da μ-architect-legacy (brand-blue + purple), no random accent

---

## Notion (notion.so → notion.com)

### Header

**NOTA redirect**: notion.so 301 → notion.com (fetched). Marketing landing: logo, nav (AI, Solutions, Resources), Login + Get free + Request demo CTA. Mega-menu on hover. Product Notion app (workspace) inferred industry observation.

Inferred app: workspace switcher top-left, page tree sidebar left ~240px, breadcrumb top, page title + cover image, content area editable. Topbar minimal (share button, comments, settings).

### Palette

Marketing: white background, black text, blue links `#0A66C2`, gradient accents (purple-pink for AI features). Product app: light mode default (cream-tinted whites), dark mode optional. Highlight colors muted pastel.

### Typography

Inter (or Notion's variant) + system fallback. Page title 32-40px display. Body 16px serif/sans mix. Heading hierarchy h1-h3 strong. Inline code: monospace muted background.

### Layout

12-col marketing. Product app: tree sidebar + main content + optional right comments panel. Page-as-document mental model (NOT dashboard grid). Nested page hierarchy unbounded depth.

### Density

Medium-sparse. Page padding generous. Tree sidebar items 28-32px row. Block-based content (each block = small padded element).

### Motion

Smooth (Notion signature). Block insert/delete animate. Drag-drop block reorder visible. Sidebar collapse 200ms ease. Page load fade-in 150ms. Subtle, never jarring.

### Drilldown

Page → nested sub-page (tree expand sidebar). Breadcrumb at top shows path. Inline editing: click block, edit in-place. Slash command `/` for block type insertion. Database view: gallery → table → board → timeline switchable.

### KPI rep

Stats as callouts: "98% Forbes Cloud 100", "100M+ users", "62% Fortune 100". Trust-signal numerical citation. Within product, database aggregations (count/sum/avg) shown as small footer text per column.

### LIFT

1. Tree hierarchy sidebar with expand/collapse — pattern per OPOURSKA org hierarchy (tenant → orgUnit → role → employee navigation)
2. Breadcrumb top showing path — replicate per deep navigation in capability_graph / employee_journey
3. Inline editing pattern — eventually for HR_MANAGER quick edit cells (NOT day-1)

### AVOID

1. Notion is document-as-page mental model — heuresys cockpit is decision-surface, NOT document
2. Sparse density Notion — heuresys deve essere denser, KPI grid 4-6 card visible above fold
3. Slash command `/` for content editing — conflict with potential keyboard nav in heuresys; use Cmd+K only

---

## Airtable (airtable.com)

### Header

Logo Airtable left, mega-menu nav (Platform, Solutions, Resources, Learn), right actions (Enterprise, Pricing, Book demo, Sign In). Mobile-responsive hamburger toggle.

### Palette

Marketing: white/light gray dominant, dark `#1A1A1A` body, brand blue `#0066CC` logo accent, orange `#FF6B35` CTA (inferred). Product app Airtable: bright multi-color (purple/blue/teal/yellow/red bases). Color is functional (base color identifies workspace).

### Typography

Airtable proprietary sans-serif + Inter fallback likely. Weights 400-700. Body 16px regular. Navigation 14-16px medium. Quote attribution 12-14px.

### Layout

12-col marketing responsive. Product app: tab views top (Grid/Calendar/Gallery/Kanban/Form/Timeline) + filter chips bar + main data area + optional right detail panel. Sidebar workspace tree left.

### Density

Medium (marketing) → Medium-dense (product). Cards padding 24-32px section spacing 40-48px (marketing). Product app: table rows 32-40px configurable, gallery cards 200-280px wide.

### Motion

Animated GIF hero (marketing). Smooth fade transitions tabbed content. View switch (Grid → Kanban): rows transform into cards 400ms. Row expand: slide-over 200ms. No jarring motion.

### Drilldown

Row click → side panel slide-over with all fields + linked records + comments + activity. Field expand: rich text editor in-place. Linked record click: navigate to linked base or open inline mini-card.

### KPI rep

"500,000 leading teams" (trust signal). Within product: column footer aggregations (count/sum/avg/min/max). Summary view = grouped table with subtotal rows. No native sparkline (limitation Airtable).

### LIFT

1. Tab views top (Grid/Kanban/Gallery/Timeline) — replicate for Talent Pipeline (Pipeline Kanban / List Grid / 9-box Matrix / Timeline view)
2. Row expand slide-over panel — pattern 13 trend research, strongly verified by Airtable
3. Filter chips bar + sort + group toolbar above table — pattern 8 trend research, Airtable canonical reference

### AVOID

1. Color-as-identity (base colors purple/teal/yellow random) — heuresys palette is brand-controlled, color is semantic NOT decorative
2. Airtable is database-as-spreadsheet mental model — heuresys cockpit is decision-surface, table view è UNA delle viste non LA vista
3. Verbose marketing copy with stat soup — heuresys page copy must be terse, banking-grade

---

## Synthesis — Convergenza Inspirations

7 reference convergono su 5 primitives canonical da liftare nel cockpit heuresys cycle 2:

| Primitive                               | Reference forte                    | Application heuresys                |
| --------------------------------------- | ---------------------------------- | ----------------------------------- |
| Sidebar 240-260px + Cmd+K               | Linear · Vercel · Stripe Dashboard | AppShell già OK, aggiungere Cmd+K   |
| Side-panel slide-over drilldown         | Linear · Airtable                  | Replace eventuali full-page drill   |
| Tabular monospace numerals              | Stripe · ClickHouse                | Tokens font-feature-settings `tnum` |
| Status pill + semantic color consistent | Vercel · Linear                    | Define 6 semantic tokens canonical  |
| Tab views switch (Grid/Kanban/9-box)    | Airtable · PostHog                 | TalentPipeline + capability_graph   |

5 anti-pattern da evitare consolidato:

1. **Full-page route navigation drilldown** (Vercel · Stripe) → heuresys preferisce slide-over per context-keeping HR Director
2. **Marketing-page extreme whitespace** (Stripe · Notion) → cockpit must be denser
3. **Color-as-decoration random** (Airtable bases · PostHog playful) → palette brand-controlled, color sempre semantic
4. **Document/spreadsheet mental model** (Notion · Airtable) → heuresys è decision-surface, non document
5. **Developer-tool tone** (ClickHouse · PostHog) → banking RTL Bank context, executive-intelligence tone

---

## Sources

- [linear.app](https://linear.app)
- [linear.app/now/how-we-redesigned-the-linear-ui — Linear UI redesign part II](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [The Elegant Design of Linear.app — Tela Blog](https://telablog.com/the-elegant-design-of-linear-app/)
- [Linear Docs — Conceptual Model](https://linear.app/docs/conceptual-model)
- [vercel.com/dashboard (login-gated)](https://vercel.com/dashboard)
- [posthog.com](https://posthog.com)
- [stripe.com](https://stripe.com)
- [clickhouse.com](https://clickhouse.com)
- [notion.com (notion.so redirect)](https://www.notion.com/)
- [airtable.com](https://www.airtable.com)
