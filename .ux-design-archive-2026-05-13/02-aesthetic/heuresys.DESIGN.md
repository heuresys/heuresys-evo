# Heuresys — DESIGN.md

> **Canonical design system specification**. Drop-in compatible con AI coding agents (pattern getdesign.md / VoltAgent/awesome-design-md / rohitg00/awesome-claude-design). 9 sezioni canoniche da `brand-to-design-md.md` template.
>
> **Source**: D1 chiusa 2026-05-05 (DECISIONS-LOG L21) — modello base `mu-architect-legacy.html`. Palette legacy `www.heuresys.com`.
> **Standard logo**: L16 + L18 — vedi `02-aesthetic/logo-standard.md`.
>
> Per usare: copia questo file nel root del progetto + dì all'AI agent "build me X following DESIGN.md" oppure carica in Claude Design.

---

## 1. Visual Theme & Atmosphere

**Family**: Data-Dense Pro · Systems Architect POV.

**Mood**: dashboard-first cinematic enterprise. Dark navy near-black bg con accent purple + brand blue + gradient blue→purple. Trustworthy 60% / Courage 40% (no overdrive cinema). Atmosphere: capability operating system, ontological layer, B2B enterprise serious. Power users (CHRO/CIO/HR director) read dashboards a arm's length 8h/day.

**Riferimenti compass**: ClickHouse (data-dense), Linear (restraint), PostHog (product-marketing), Stripe (gradient discipline). Anti-references: Cinematic Dark overdrive (Runway/ElevenLabs neon), Glass futurism.

**Anti-slop fingerprint** (compliant a `99-samples/rohitg00-prompts/break-default-aesthetic.md`):

- ✅ Single chromatic accent (purple `#a855f7`)
- ✅ No teal default
- ✅ No animated status dots (static glyphs + explicit text)
- ✅ Container nesting ≤ 3 (sidebar > section > link OK)
- ✅ Typography project-specific (Exo 2 + Inter + JetBrains Mono — NOT Inter alone)
- ✅ No 3-col feature grid in hero/section 2
- ✅ Single icon family (Phosphor / custom mono-line)

---

## 2. Color Palette & Roles

```css
/* DARK (default) */
:root {
  /* Foundation */
  --bg: #0a0d18; /* near-black dark navy */
  --paper: #14182a;
  --surface-1: #14182a; /* card, panel, primary container */
  --surface-2: #1c2138; /* hover, table header, subtle elevation */
  --surface-3: #252b48; /* selected, active filter, focus bg */
  --ink: #f4f5f7; /* primary text */
  --ink-soft: #c8cad2; /* secondary text */
  --ink-muted: #8b8e99; /* tertiary, captions */
  --ink-tertiary: #5e6168; /* dimmed labels, disabled */
  --rule: #232838; /* divider, border subtle */
  --rule-strong: #3a4055; /* divider emphasis */

  /* Brand legacy */
  --brand-blue: #3b82f6; /* link, focus, CTA gradient start */
  --brand-blue-deep: #2452c8;
  --accent: #a855f7; /* logo y, glow, gradient end, primary action */
  --accent-deep: #7e3fc8;
  --accent-hover: #b878f8;
  --accent-soft: #2a1a44; /* badge bg, focus ring */

  /* Gradient + Glow signature */
  --gradient: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  --glow: 0 0 60px rgba(168, 85, 247, 0.35);

  /* Capability dimensions (data viz) */
  --cap-process: #3b82f6;
  --cap-structure: #6c5ce7;
  --cap-role: #a855f7;
  --cap-competence: #5fb87a;
  --cap-performance: #f59e0b;

  /* Semantic */
  --semantic-success: #5fb87a; /* positive delta, growth */
  --semantic-warning: #f59e0b; /* caution, decline */
  --semantic-info: #3b82f6; /* info, neutral notification */
  --semantic-danger: #ff6b6b; /* error, breach (raro) */
  --token-label: #5fffa3; /* token name labels in --architect surfaces */
}

/* LIGHT */
[data-theme='light'] {
  --bg: #f4f5f7;
  --paper: #ffffff;
  --surface-1: #ffffff;
  --surface-2: #ebecf0;
  --surface-3: #e0e2e8;
  --ink: #0a0d18;
  --ink-soft: #2a2d38;
  --ink-muted: #6a6d75;
  --ink-tertiary: #9ea0a8;
  --rule: #d8dae0;
  --rule-strong: #b6b9c2;

  --brand-blue: #2452c8;
  --brand-blue-deep: #1e3fa0;
  --accent: #7e3fc8; /* deeper purple per contrast su light */
  --accent-deep: #5e2898;
  --accent-hover: #9354d8;
  --accent-soft: #ede0fa;

  --gradient: linear-gradient(135deg, #2452c8 0%, #7e3fc8 100%);
  --glow: 0 0 40px rgba(126, 63, 200, 0.18);

  --cap-process: #2452c8;
  --cap-structure: #5a45c0;
  --cap-role: #7e3fc8;
  --cap-competence: #2da147;
  --cap-performance: #b8860b;

  --semantic-success: #2da147;
  --semantic-warning: #b8860b;
  --semantic-info: #2452c8;
  --semantic-danger: #c54545;
  --token-label: #1a8e3e;
}
```

**Role rules**:

- `--accent` purple = SINGLE chromatic action color. Used per logo y, primary CTA, focus ring, hero accent text. NEVER as background of large sections.
- `--brand-blue` = link, focus, CTA gradient start. Pair con accent purple.
- `--gradient` (blue→purple) = CTA buttons, hero text moments, headline emphasis. NEVER as section background.
- `--glow` = drop-shadow purple sotto wordmark hero, KPI numbers in evidenza, capability node hover.

---

## 3. Typography Rules

**Stack**:

- **Wordmark**: `Exo 2` weight 700 (legacy logo font). Fallback: `Inter` weight 800.
- **UI / body / heading**: `Inter` weight 400-500-600-700-800. Fallback: `system-ui`.
- **Numbers / data / code / mono**: `JetBrains Mono` weight 400-500-600-700. `font-variant-numeric: tabular-nums` always-on.

**Scale** (16-base, ratio 1.25 modular):

```
11 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 80 / 88
```

**Usage map**:

| Size  | Use case                                               |
| ----- | ------------------------------------------------------ |
| 9-11  | mono labels, ticker, breadcrumb, captions, token names |
| 13-14 | UI labels, body small, sidebar links, form labels      |
| 16    | body default                                           |
| 18-22 | body large, deck, lead intro                           |
| 28-36 | headline section, dashboard h1                         |
| 48-64 | wordmark hero size, big KPI numbers                    |
| 80-88 | wordmark gigante hero landing                          |

**Letter-spacing**:

- Body, label, mono → `letter-spacing: normal` (no override)
- Heading 28-48 → `letter-spacing: -0.5px to -1px` (tight per Inter density)
- Wordmark Exo 2 → `letter-spacing: -0.5px` (preserva kerning naturale, NO custom)

**Logo rule (L25 PERMANENT — supersedes L16 partial weight gap)**:

```css
.wordmark {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  color: var(--ink); /* o var(--brand-blue) per dashboard architect */
  letter-spacing: normal;
}
.wordmark .y {
  color: var(--accent);
  /* L25: NO font-weight override (eredita 700) */
  /* L25: NO font-style italic */
  /* L25: NO font-size override */
  /* Il colore è l'UNICO differenziatore */
}
```

HTML pattern: `<span class="wordmark">heures<span class="y">y</span>s</span>`

**Vincoli L25** (permanent):

1. `h` SEMPRE minuscola — mai `Heuresys`
2. Tutte le 8 lettere stesso font / peso / size / style
3. Solo `y` color diverso (`var(--accent)`)
4. Letter-spacing naturale (no override)
5. **Embed ovunque**: header, footer, modal, social meta usano sempre `<span class="wordmark">...` — mai plain text `heuresys.com`

---

## 4. Component Stylings

**Buttons** (L22 · solid color only, NO gradient):

- Primary CTA: `background: var(--accent)`, white text, radius 6px, padding 10px/20px, weight 600, font-size 14px. Hover: `background: var(--accent-deep)`. **Mai gradient** (L22).
- Secondary: `background: var(--surface-2)`, `border: 1px solid var(--rule-strong)`, `color: var(--ink)`. Hover: `background: var(--surface-3)`.
- Ghost / link: `background: transparent`, `color: var(--ink-soft)`. Hover: `color: var(--ink)`.

**Object backgrounds rule (L22)**: nessun `var(--gradient)` come `background` di oggetti UI riconoscibili (button, avatar/initials circle, badge pill, progress bar fill, milestone dot, KPI ring fill). Usare `var(--accent)` solid o `var(--accent-soft)` tinted. Gradient ammesso SOLO come decoration line (e.g. `nav-bar::after` 2px border) o dentro `<linearGradient>` SVG dataviz (graph edges, radar fills).

**Cards**:

- `background: var(--surface-1)`, `border: 1px solid var(--rule)`, `border-radius: 6-8px`, `padding: 16-24px`.
- NO drop-shadow. Border-based depth only.
- Hover: `border-color: var(--rule-strong)`. NO transform.

**Inputs**:

- `background: var(--surface-1)`, `border: 1px solid var(--rule-strong)`, `border-radius: 6px`, `padding: 8-12px`.
- Focus: `border-color: var(--accent)`, `box-shadow: 0 0 0 2px var(--accent-soft)`.
- Mono font for inputs accepting code/IDs.

**Tables (data-dense)**:

- Row height 32px (compact) o 40px (comfortable).
- Header: `background: var(--surface-2)`, mono uppercase 9-10px tracking 1.5px.
- Zebra opzionale: `tr:nth-child(odd) { background: var(--surface-2); }`.
- Sticky header + sticky first column for >10 rows.
- Right-align numeric columns (`text-align: right`, `font-variant-numeric: tabular-nums`).
- Truncate with ellipsis, reveal full on hover.

**Pills / Badges**:

- Pill-shaped 20px tall, mono uppercase 9-10px, padding 1px/6px.
- Live: `background: var(--accent-soft)`, `color: var(--accent)`.
- Stable: `background: var(--surface-3)`, `color: var(--ink-muted)`.
- Warn: `background: var(--surface-3)`, `color: var(--semantic-warning)`.

**Sidebar nav (L22 · v2 layout)**:

- Width 240px default · collapsible a 64px icon rail (toggle button in alto, persistente in `localStorage` come `heuresys-sidebar`).
- **Logo Heuresys** SEMPRE nel nav-bar (header), MAI in sidebar.
- **Tenant logo** sempre in cima sidebar via `.tenant-mini` card: `t-avatar` (rounded square 32px, `background: var(--accent)` solid) + `t-name` (Inter 600 13px) + `t-meta` (mono 10px sector/env). In modalità collapsed: solo `.t-avatar` visibile.
- Section heading (`h4`): mono uppercase 9px tracking 2px, `color: var(--ink-tertiary)`. **Cliccabile** (`onclick="toggleSection(this)"`) per espandere/comprimere la sezione. Include `<span class="chev">▾</span>` che ruota -90° quando sezione collassata.
- Section collassata via `.sidebar-section.collapsed > *:not(h4) { display: none }` — niente wrapper extra.
- Link: 7px/12px padding, font 13px, `color: var(--ink-soft)`. Hover: bg `var(--surface-2)`.
- Active: bg `var(--surface-3)`, `border-left: 2px solid var(--brand-blue)`.
- Sidebar toggle button: 28x28px, `border: 1px solid var(--rule-strong)`, hover `border-color: var(--accent)`. Icona chevron `<` che ruota a `>` in stato collapsed.
- User card in fondo sidebar (avatar 36px `background: var(--accent)` solid + name + role mono).

**Wordmark logo**: vedi sezione 3 + L16/L18 standard. Posizione canonical: nav-bar di ogni surface (mai duplicato in sidebar).

---

## 5. Layout Principles

**Container**: max-width 1280px (marketing), no max (dashboard), padding generoso 32-48px lateral.

**Grid base**: 4px (Architect view: la grid 4px è la verità del design system. Ogni surface, gap, padding e radius DEVE essere multiplo di 4).

**Spacing scale**:

```
2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64 / 80 / 96 / 128
```

**Layout pattern**:

- Sidebar 220px + workspace fluid (dashboard surface)
- 12-col grid Swiss-style (marketing/landing)
- 2-col split (text + viz hero)
- 3-col cards (perspectives, features)
- 4-col KPI ring (dashboard overview)

**Density**:

- Dashboard = high density (16-row table per viewport, 4 KPI ring)
- Marketing = medium density (3-col features, 2-col hero)
- Landing hero = low density (whitespace generoso, type-led)

---

## 6. Depth & Elevation

**Flat by default**. Border-based depth.

**Shadow allowed only**:

- Dropdowns: `box-shadow: 0 2px 8px rgba(0,0,0,0.04);`
- Modals: `box-shadow: 0 24px 48px rgba(0,0,0,0.4);` (dark) / `0 16px 32px rgba(0,0,0,0.16);` (light)
- Wordmark hero glow: `filter: drop-shadow(0 0 60px rgba(168,85,247,0.35));` — SIGNATURE element
- KPI numbers in evidenza: `filter: drop-shadow(0 0 30px rgba(168,85,247,0.25));` — opzionale

**Border-based elevation**:

- `--surface-1` = card base
- `--surface-2` = card hovered or table header
- `--surface-3` = card selected or active filter

NO drop-shadow on cards/buttons/inputs.

---

## 7. Do's and Don'ts

**Do**:

- Use accent purple as **punctuation** (logo y, single CTA per surface), not paragraph
- Keep dashboard density high — users are professional power users
- Show more data per screen, not less (capability operating system promise)
- Use mono for numbers, IDs, anything copyable
- Use `font-variant-numeric: tabular-nums` always-on
- Apply gradient blue→purple SOLO come decoration line (nav-bar bottom 2px) o dataviz SVG (`<linearGradient>` per graph edges, radar fills). MAI come `background` di pulsanti, avatar, badge, progress bar (L22)
- Lock spacing to 4px multiples
- Use border-based depth (no shadows on cards)
- Apply glow drop-shadow sotto wordmark hero (signature legacy element)

**Don't**:

- Add a second chromatic accent (single purple only, plus blue for links/focus)
- Use teal accent (anti-slop reject)
- Animate status indicators (no blinking dots, no pulsing orbs, no "live" badges)
- Round corners beyond 8px (data-dense aesthetic)
- Use serif fonts (lock to Exo 2 + Inter + JetBrains Mono)
- Center-align numeric data (always right-align)
- Apply gradient to button backgrounds, avatar/initials circle, badge pill, progress bar fill, milestone dot, KPI ring (use `var(--accent)` solid). Gradient OK only on decoration lines + SVG dataviz (L22)
- Animate chart rendering beyond 200ms
- Use drop shadows on cards or buttons
- Introduce purple-pink gradient hero clichés (anti-slop reject)

---

## 8. Responsive Behavior

**Breakpoints**:

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Pattern**:

- **Mobile (<768px)**: dashboard not apologetic — show single KPI per viewport with drill-down link. Sidebar collapses to drawer. Tables become scrollable horizontal lists.
- **Tablet (768-1024px)**: 2-col layouts collapse to single column. Sidebar still 220px or drawer. KPI ring 2-col.
- **Desktop (1024-1280px)**: full 3-col features, 4-col KPI ring.
- **Wide (1280px+)**: max-width container, sidebar fixed, content fluid.

**Type scaling**:

- Heading scale reduces by 1 step on mobile (88→64, 64→48, 48→36, 36→28).
- Body remains 16px.
- Mono remains tabular size (10-12px).

**Don't** cram desktop dashboard into 375px. Use intentional mobile patterns (single KPI, drill-down, drawer nav).

---

## 9. Agent Prompt Guide

**For AI coding agents using this DESIGN.md**:

When generating UI for Heuresys:

1. **Bias toward**: dark navy canvas, tabular numerals, mono for data, single accent purple, 4px grid, dense tables with sticky headers, border-based depth, Exo 2 for wordmark only, Inter for everything else.

2. **Reject if instructed otherwise**:
   - Light backgrounds for primary dashboards (dark first; light is opt-in via theme toggle)
   - Hero illustrations or glass cards as primary hero
   - Non-tabular numerals
   - Icon libraries with soft strokes (use mono-line / Phosphor / custom)
   - Serif headlines (Heuresys is sans-only)
   - Italic on the y of wordmark when font is sans-serif (L18 rule)

3. **Always**:
   - Apply L16 + L18 logo standard (y in `var(--accent)`, weight 500, NO italic for sans, italic OK for serif)
   - Keep container nesting ≤ 3
   - Use `var(--accent)` solid (NOT `var(--gradient)`) for button backgrounds, avatar circle, badge, progress bar fill (L22). Gradient reserved per decoration line + SVG dataviz
   - Apply `var(--glow)` drop-shadow under wordmark hero
   - Verify WCAG AA contrast for any text/background pair
   - Lock spacing to multiples of 4px

4. **Never**:
   - Use teal as accent (`#16d5e6` or near)
   - Add animated status dots, blinking lights, "live" badges in nav/header/hero
   - Use Inter as primary face if alternative direction is specified — but for Heuresys, Inter IS the primary
   - Use purple-pink gradient on dark backgrounds as hero composition (use blue→purple legacy gradient instead)
   - Apply italic to y of wordmark in sans-serif fonts (browser visual review confirmed descender invades adjacent s — L18)

5. **Verification (after generating)**:
   - [ ] Logo y is in `var(--accent)` purple, not hardcoded
   - [ ] Logo y has weight 500 (or font-variation-settings 'wght' 500-600 for variable fonts)
   - [ ] No italic on y if font is sans-serif
   - [ ] Single accent color used consistently
   - [ ] Container nesting ≤ 3
   - [ ] Numeric columns right-aligned with tabular-nums
   - [ ] Spacing values are multiples of 4
   - [ ] WCAG AA contrast respected
   - [ ] No teal, no purple-pink gradient anywhere

If any check fails, regenerate the offending region.

---

## 10. Layout patterns Phase 9 (L22)

**Dashboard 5-surface family** (`06-mockups/dashboards/`):

| Surface              | Persona target | Sidebar tenant | Scope         |
| -------------------- | -------------- | -------------- | ------------- |
| HR Director Overview | Maria CHRO     | RTL Bank       | strategic     |
| Capability Graph     | Davide IT      | RTL Bank       | technical     |
| Skills Heatmap       | Maria CHRO     | RTL Bank       | tactical      |
| Employee Journey     | Andrea EMP     | RTL Bank       | self-service  |
| Org & Systems        | Davide IT      | Heuresys Sys   | platform-wide |

**Shared structure**:

- `<nav class="nav-bar">` — `nav-left` (back link + wordmark-sm Heuresys) + `label` PHASE/PILL + theme toggle
- `<aside class="sidebar">` — `sidebar-header` (toggle button) + `tenant-mini` card + N `sidebar-section` (h4 collapsibili) + `user-card` in fondo
- `<main class="workspace">` — `ws-header` (breadcrumb + h1 + actions) + KPI ring 4-col + content panels (split 2:1 / 1:1 / full) + `ws-footer`

**Persistence**:

- `localStorage.heuresys-theme` = `dark` | `light`
- `localStorage.heuresys-sidebar` = `open` | `collapsed`

**Navigation hub**: `06-mockups/dashboards/index.html` lista 5 surfaces con badge persona + tenant + scope.

---

## Cross-references

- **Modello base**: `02-aesthetic/direction-explorations/mu-architect-legacy.html`
- **CSS overlay**: `02-aesthetic/direction-explorations/legacy-palette.css`
- **Logo standard**: `02-aesthetic/logo-standard.md` (L16 + L18)
- **Capture sito legacy**: `02-aesthetic/heuresys-com-current-style.md`
- **Palette token reference**: `03-visual-identity/color/palette-final.md`
- **Typography reference**: `03-visual-identity/typography/typography-final.md` (Phase 6)
- **Logo SVG file**: `03-visual-identity/logo/final/heuresys-wordmark.svg` (Phase 7)
- **Decisions**: `DECISIONS-LOG.md` § L16, L18, L20, L21
- **99-samples reference patterns**: `99-samples/voltagent-design-md/` + `99-samples/rohitg00-frameworks/data-dense/`
