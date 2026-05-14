# Research Artifact Pattern — cycle 2 canonical

> **Pattern de reference promosso a canonical cycle 2 sulla base di un esempio shipped completo cycle 1**: `icon-libraries-showcase.html` (archive, immutabile). Documento canonical estratto + classificato + raccomandato come template per ogni futuro "comparative research artifact" investor-ready.

## Benchmark vivente (single source)

```
.ux-design-archive-2026-05-13/02-aesthetic/icon-libraries-showcase.html
```

571 righe HTML+CSS+JS inline · auto-contained · production-quality · brand-aligned al 100%. Demo: aprire via `python3 -m http.server` dal folder `02-aesthetic` perché Chrome blocca `file://` JS toggle.

**Stato**: file fisicamente in cycle 1 archive (immutabile post-S62 reset), promosso a **reference pattern canonical cycle 2** via questo doc. Lasciato in archive per evitare duplicazione; futuri artefatti research seguono questo pattern (NON copiare/forkare il file, **estendere il pattern**).

## Quando usarlo

Trigger di adozione:

- **Comparative research pages** (es. icon libraries, typography stacks, charting libs, color palette options, layout pattern references, ESCO ontology comparisons, competitor benchmark)
- **Deep-dive showcases** che mostrano N opzioni con structure ripetuta e raccomandazione finale
- **Brand audit artifacts** dove serve dimostrare visivamente differenze tra varianti
- **Decision-record visual companion** quando una DECISIONS-LOG entry richiede un artefatto visivo

Anti-trigger (NON adottare):

- Marketing landing page (different funnel)
- Operational dashboard (use preset `_v2` engine invece)
- Form / wizard step (use packages/ui form patterns)
- Single-detail page (use `[code]` route preset)

## Token canonical estratti (osservati nel file)

### Palette (1:1 con `services/app/src/styles/tokens.css` cycle 2 baseline)

| CSS var         | Dark mode | Light mode | Uso                                                                 |
| --------------- | --------- | ---------- | ------------------------------------------------------------------- |
| `--bg`          | `#0a0d18` | `#f4f5f7`  | page background                                                     |
| `--surface-1`   | `#14182a` | `#ffffff`  | card / nav-bar bg                                                   |
| `--surface-2`   | `#1c2138` | `#ebecf0`  | nested panel / code block / icon-preview cell                       |
| `--surface-3`   | `#252b48` | `#e0e2e8`  | chip decorativo neutro                                              |
| `--ink`         | `#f4f5f7` | `#0a0d18`  | body text primary                                                   |
| `--ink-soft`    | `#c8cad2` | `#2a2d38`  | lead paragraph / desc card                                          |
| `--ink-muted`   | `#8b8e99` | `#6a6d75`  | meta / breadcrumb / mono labels                                     |
| `--rule`        | `#232838` | `#d8dae0`  | border subtle 1px                                                   |
| `--rule-strong` | `#3a4055` | `#b6b9c2`  | border emphasized                                                   |
| `--brand-blue`  | `#3b82f6` | `#2452c8`  | wordmark body                                                       |
| `--accent`      | `#a855f7` | `#7e3fc8`  | gradient highlight, hover state, accent-pill, recommendation border |
| `--accent-deep` | `#7e3fc8` | `#5e2898`  | hover-shift accent                                                  |
| `--accent-soft` | `#2a1a44` | `#ede0fa`  | chip pill-line bg, reco gradient bottom                             |
| `--success`     | `#5fb87a` | `#2da147`  | chip multi-weight                                                   |
| `--warning`     | `#f59e0b` | `#b8860b`  | chip fill state                                                     |

**Regola**: il gradient accent purple è **invariante tra dark/light** (preserva brand). Solo surface/ink invertono. Allineato `moodboard.md` § Palette canonical.

### Typography

| Family             | Weight                                                   | Uso                                                                                   |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Inter**          | 400 (body) / 600 (h2/h3) / 700 (h1, numeric big, strong) | tutto il body + headings + numbers                                                    |
| **JetBrains Mono** | 400 / 500 / 600 / 700                                    | labels caps, breadcrumb, code blocks, meta footer, table mono cols, npm install lines |
| **Exo 2**          | 700                                                      | **solo** wordmark (regola L2, embed obbligatorio)                                     |

Tabular numerals impliciti via Inter weight 700 sui count big (`1,500+`, `9,000+`, ecc.).

### Spacing & sizes

- `.container` max-width: `1280px` · padding: `48px 32px`
- Section margin-bottom: `48px` (head/compare/lib-grid/reco/footer-meta)
- Card padding: `18-20px` (head/body)
- Border-radius: `4px` (button/code) · `6px` (small panel) · `8px` (table) · `10px` (large card/reco)
- Border: `1px solid var(--rule)` baseline · `1px solid var(--accent)` hover/emphasis
- H1: `36px / line-height 1.15 / letter-spacing -1px`
- H2: `20px / weight 600 / letter-spacing -0.5px`
- H3 (card title): `22px / weight 700`
- Body: `13-16px / line-height 1.55`
- Mono labels caps: `9-11px / letter-spacing 1-2px / uppercase`

### Motion

- Card hover: `transition: border-color 0.15s` (solo border, no scale/translate)
- Link button hover: `transition: all 0.15s` (bg + color)
- Theme toggle: istantaneo, no transition esplicita (CSS var swap)

**Regola F8 motion measured**: hover/transition SOLO dove c'è cambio di stato (focus/CTA). Zero animazioni decorative, zero scroll-triggered effects, zero pulse/glow gratuiti.

## Anatomia componenti (pattern ripetibili)

### 1. Topbar `.nav-bar`

```
[wordmark heures(y)s + back link] [breadcrumb + label-pill section] [Light/Dark toggle]
```

- Border-bottom 1px rule + ::after accent line opacity 0.5 (sottile accent rule sotto)
- Wordmark con Exo 2 700 + drop-shadow accent 12px (subtle glow brand)
- Label-pill: bg accent solid + white text + radius 3px (sezione corrente highlighted)
- Theme toggle: outline-ghost → fill on hover

### 2. Head section

```
breadcrumb mono caps (path doc) → H1 con accent <em> → lead paragraph
```

- Breadcrumb path `02-aesthetic · research · ...` mono uppercase muted
- H1 keyword in `<em>` → render `--accent` purple, no italic (font-style:normal). Regola: 1 sola parola accent per H1
- Lead paragraph: max-width 760px (no full-width per readability F2)
- Border-bottom rule + margin 32px → separator naturale

### 3. Comparison table `.compare`

```
[Comparison · <em>N a confronto</em>] [aggiornato YYYY-MM]
table N×7 (#, Library, By, Icons, Style, Stroke, License)
```

- Card panel surface-1 + border rule + radius 8 + overflow hidden
- Header row mono caps 9px letter-spacing 2px su bg surface-2
- Row hover: bg surface-2 (subtle highlight)
- Chip Style **color-coded**:
  - `.pill-line` → bg accent-soft + text accent (line variants)
  - `.pill-multi` → bg success rgba 0.15 + text success (multi-weight)
  - `.pill-fill` → bg warning rgba 0.15 + text warning (riservato future use)
- Mono cells per #, Icons (count), Stroke, License → `font-family: JetBrains Mono`

### 4. Library card `.lib-card` (in `.lib-grid` 2-col)

```
┌─ head ─────────────────────────┐
│ NN · CATEGORY     COUNT+       │
│ Nome libreria     SUBLABEL     │
│ subtitle by autore             │
├─ body ─────────────────────────┤
│ Descrizione paragraph          │
│ ┌─ samples ─ 6 icons grid ──┐  │
│ │ [home][user][chart][...]  │  │
│ └────────────────────────────┘  │
│ PRO          CONTRO            │
│ keyword …    text plain        │
│ ┌─ install ─────────────────┐  │
│ │ $ npm install xxx          │  │
│ └────────────────────────────┘  │
│ [site.com →]  [tag][tag][tag]  │
└────────────────────────────────┘
```

Detail:

- `.lib-head` flex row con num+title sinistra · count+sublabel destra
- `.num` mono caps accent purple letter-spacing 1.5px (es. `01 · LINE`)
- `.h3` Inter 700 22px white
- `.by` mono 10px muted
- `.stats .count` Inter 700 18px accent purple (`1,500+`)
- `.stats .lbl` mono 9px muted (es. `ICONS` / `VARIANTS`)
- `.lib-desc` body 13px ink-soft line-height 1.55
- `.lib-samples` grid 6-col gap 8px su bg surface-2 padding 16px radius 6 → 6 sample cells aspect-ratio 1 con SVG icona 22×22 (REAL icons della libreria)
- `.lib-meta` grid 2-col PRO/CONTRO con `.lbl` mono caps + `.val` body + `strong` accent
- `.lib-install` mono 11px bg surface-2 border rule (mostra `$ npm install ...`)
- `.lib-foot` flex link sx + tags dx
- `.lib-link` outline accent → fill su hover
- `.tag` mono 9px bg surface-3 muted (decorative chip)

**Hover card**: `border-color: var(--accent)` transition 0.15s (no scale/translate)

### 5. Recommendation panel `.reco`

```
┌─ accent-bordered card with gradient bg ──┐
│ Raccomandazione per [wordmark] · N candidati shortlisted
│ Selezione basata su: ...
│ 1° Lucide  · descrizione  · Risk: ...   │
│ 2° Phosphor · descrizione · Risk: ...   │
│ 3° Tabler · descrizione  · Risk: ...    │
│ Decisione finale: pending [Persona]     │
└─────────────────────────────────────────┘
```

- Background: `linear-gradient(0deg, var(--accent-soft) 0%, var(--surface-1) 100%)` → subtle tint accent dal basso
- Border: `1px solid var(--accent)` always-on (NOT solo hover — visual hierarchy: questa card è "diversa")
- Ul list: ogni `<li>` flex con `strong` accent rank+name (min-width 100px) + descrizione + risk note
- `<strong>` accent purple weight 600
- **Decisione finale: pending [Persona]** — preserva DECISION AUTHORITY (R20) sempre

### 6. Footer doc `.footer-meta`

```
SOURCE · YYYY-MM · attribution                heuresys · path · L_NN reference
```

Mono 10px letter-spacing 1px uppercase muted. Sx: source attribution. Dx: doc path + DECISIONS-LOG reference. Border-top rule + padding-top 24px.

## Mapping alle 10 leggi cockpit (`layout-pattern.md`)

| Legge                           | Applicazione concreta nel benchmark                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **F1 una pagina = una domanda** | H1 "10 librerie icone moderne minimaliste per dashboard wow" — domanda implicita: "quale libreria scegliere per heuresys?"                  |
| **F2 Pareto del dato**          | Comparison table N×7 in zona top risponde all'80% (overview) → 10 card sotto = 20% deep-dive on demand                                      |
| **F3 gerarchia 3-livelli**      | Hero (H1+lead) → comparison table (overview) → 10 card (detail) → reco panel (decisione). Anche dentro card: head → body → install → footer |
| **F4 generale → particolare**   | Table sintetica → card 6-icon preview real → install command → site link → tags. Drill naturale top-to-bottom                               |
| **F5 header/footer surfaces**   | Topbar nav-bar (wordmark + breadcrumb + theme) + footer-meta (source + reference) — metadata cross-doc                                      |
| **F6 viste dinamiche**          | Theme toggle Light/Dark istantaneo (single but meaningful view switch)                                                                      |
| **F7 strutture ramificate**     | Reco list ranking 1°/2°/3° (mini-cascade hierarchical)                                                                                      |
| **F8 attention misurato**       | Hover effect SOLO su card border + link button. Zero scroll animations. Zero glow gratuiti                                                  |
| **F9 space economy**            | Zero placeholder. Zero "coming soon". Lead paragraph max-width 760 (no full-stretch waste). Card grid 2-col (no overcompression)            |
| **F10 coerenza assoluta**       | 10 card layout 100% identico (template-driven). Stesso gap, stesso padding, stesso H3, stessa anatomy head/body/foot                        |

## Mapping a `anti-patterns.md` (categorie evitate)

- ✅ **A. Debug leak** — zero UUID/role/build hash leak nel JSX
- ✅ **B. Scaffold/disclaimer** — zero "coming soon" / "Sprint 2" / "DECISIONS-LOG L_NN" user-facing
- ✅ **C. Mock UX personas** — zero "Maria CHRO" etc. La sezione reco cita "pending Enzo" come decision authority concreta, non persona inventata
- ✅ **D. Layout violation** — F1-F10 tutte rispettate (vedi mapping sopra)
- ✅ **E. P11 violation** — la sezione reco ammette "Decisione finale: pending Enzo" (no fake decision). Source attribution esplicita footer
- ✅ **F. i18n** — pagina full Italian (lingua canonical) + termini tecnici Inter EN preservati (NPM, MIT, ecc.)
- ✅ **G. Performance** — fonts preconnect + preload via Google Fonts CSS · zero JS bundle (vanilla toggle inline)
- ✅ **H. Security** — zero dato sensibile, no PII, no token
- ✅ **I. Brand identity** — wordmark Exo 2 700 + y accent (regola L2) · single accent purple no rainbow · μ-architect-legacy palette preservata
- ✅ **J. Accessibility** — semantic HTML (table > thead > tbody, nav > button, h1 > h2 > h3) · contrast ratio dark mode white/navy >7:1 AAA

## Use-case template (futuri artefatti)

Per creare un nuovo research artifact cycle 2 che segue questo pattern:

1. **Copy l'HTML come bootstrap** — apri il source `.ux-design-archive-2026-05-13/02-aesthetic/icon-libraries-showcase.html`, copia struttura + tokens CSS
2. **Salva nel folder cycle 2 appropriato** — es. `.ux-design/02-tokens/`, `.ux-design/03-mockups/`, o nuovo `.ux-design/05-research/` se serve nuova categoria
3. **Sostituisci content keeping anatomy**:
   - Topbar breadcrumb + label-pill: nuova sezione caps
   - H1 + lead: nuova domanda + nuovo contesto
   - Comparison table: nuovi headers (max 6-7 col) + N righe
   - Library cards: rinomina `.lib-*` se non sono librerie, oppure tieni se è un confronto strumenti analogo
   - Recommendation panel: nuovo shortlist + nuovo "Decisione finale: pending [Persona]"
   - Footer source + reference
4. **Token check**: NON modificare i `:root` CSS variables (palette canonical). Solo content + classes layout.
5. **Brand audit gate**: run `/brand:audit <path>` su URL local dopo creazione + verifica score ≥ 7 (vedi `anti-patterns.md`)
6. **DECISIONS-LOG-v2 entry**: ogni nuovo research artifact riceve un L-NN entry con reference path + decision context

## Pattern de reference status

- **Adottato come canonical cycle 2**: 2026-05-14 via L17
- **Severity di adesione**: STRONG (default per qualunque comparative research artifact)
- **Esempi futuri attesi**: typography stacks comparison · chart libraries comparison · color palette options · competitor benchmark · ESCO taxonomy explorer (subset) · ADR visual companions
- **Override permesso**: solo con DECISIONS-LOG-v2 entry esplicita ("L_NN: deroga research pattern per X reason")

## Reference

- **Benchmark source** (immutabile): `.ux-design-archive-2026-05-13/02-aesthetic/icon-libraries-showcase.html`
- **Moodboard canonical** (palette + typography source): `.ux-design/01-canonical/moodboard.md`
- **Layout pattern** (10 leggi cockpit source): `.ux-design/01-canonical/layout-pattern.md`
- **Anti-patterns** (guardrails source): `.ux-design/01-canonical/anti-patterns.md`
- **Header/footer anatomy** (DOM canonical): `.ux-design/01-canonical/header-footer-anatomy.md`
- **DECISIONS-LOG-v2**: L17 (this canonical promotion)
- **DECISIONS-LOG cycle 1 archive**: L22 (original showcase creation, non visible in cycle 2 — vedi `.ux-design-archive-2026-05-13/DECISIONS-LOG.md` se serve contesto storico)
