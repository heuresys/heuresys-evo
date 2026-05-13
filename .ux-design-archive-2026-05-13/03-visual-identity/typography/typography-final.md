# Typography Final — Heuresys

> **Status**: ✅ **v1 confermata** (2026-05-05 — DECISIONS-LOG L21). Stack tipografico fissato post-D1 sulla scelta `mu-architect-legacy.html` come modello base.
>
> **Riferimento canonical**: `02-aesthetic/heuresys.DESIGN.md` § Typography Rules (sezione 3 di 9 canoniche).

## Stack ufficiale

| Layer              | Font               | Weight              | Use case                                                        |
| ------------------ | ------------------ | ------------------- | --------------------------------------------------------------- |
| **Wordmark**       | **Exo 2**          | 700 + y 500         | Logo wordmark "heuresys" — solo logo, NON per altri heading     |
| **Body / heading** | **Inter**          | 400-500-600-700-800 | Tutto il resto — headline, body, label, button, link, deck      |
| **Data / mono**    | **JetBrains Mono** | 400-500-600-700     | Numeri tabular, code snippets, ID, token names, breadcrumb mono |

## Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Per Next.js: usare `next/font` per self-hosting + zero CLS.

## Type scale

Base 16px, ratio 1.25 modular:

```
9 / 11 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 80 / 88
```

**Usage map**:

| Size  | Token name    | Use case                                          |
| ----- | ------------- | ------------------------------------------------- |
| 9     | `--font-2xs`  | mono token labels, tickers minuscoli              |
| 11    | `--font-xs`   | breadcrumb mono, meta uppercase, badge label      |
| 13    | `--font-sm`   | UI labels, sidebar links, body small, table cells |
| 14    | `--font-base` | button, table cell default, form label            |
| 16    | `--font-md`   | body default                                      |
| 18    | `--font-lg`   | body large, deck                                  |
| 22    | `--font-xl`   | subhead, dashboard h2                             |
| 28    | `--font-2xl`  | dashboard h1, headline section                    |
| 36    | `--font-3xl`  | headline grandi, KPI numbers in evidenza          |
| 48    | `--font-4xl`  | hero subhead, KPI gigante                         |
| 64    | `--font-5xl`  | hero headline marketing                           |
| 80-88 | `--font-hero` | wordmark gigante landing hero                     |

## Letter-spacing rules

| Context                 | Value                            | Rationale                              |
| ----------------------- | -------------------------------- | -------------------------------------- |
| Body, label, mono       | `letter-spacing: normal`         | No override, kerning naturale          |
| Heading 22-36           | `letter-spacing: -0.5px`         | Lieve compressione per Inter density   |
| Heading 48-64           | `letter-spacing: -1.5px to -2px` | Tight spacing per Inter weight 700-800 |
| Heading 80-88           | `letter-spacing: -3px`           | Hero gigante, optical correction       |
| Wordmark Exo 2          | `letter-spacing: -0.5px`         | Preserva kerning naturale, NO custom   |
| Mono uppercase tracking | `letter-spacing: 1.5-2px`        | Tabular labels, breadcrumb, badge      |

## Line-height rules

| Context       | Value    | Note                        |
| ------------- | -------- | --------------------------- |
| Body          | 1.5      | Reading comfort             |
| Heading 22-36 | 1.2      | Tight per dashboard density |
| Heading 48-88 | 1.0-1.05 | Hero impact                 |
| Mono labels   | 1.4      | Tracking compensation       |
| Tabular nums  | 1.0      | KPI numbers no leading      |

## Font-feature-settings (ALWAYS ON)

```css
body {
  font-feature-settings:
    'tnum' 1,
    'cv11' 1,
    'ss01' 1;
  /* tnum = tabular numerals (allineamento numerico)
     cv11 = single-storey 'a' (Inter cleaner)
     ss01 = stylistic set Inter (alternative glyphs) */
}

table,
.num,
.data {
  font-variant-numeric: tabular-nums;
}
```

## Logo wordmark rule (L16 + L18)

```css
.wordmark {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.5px;
}
.wordmark .y {
  color: var(--accent); /* purple #a855f7 */
  font-weight: 500; /* L16 gap moderato (700 → 500) */
  /* L18: NO italic — Exo 2 è sans-serif, descender slanted invade s */
}
```

HTML pattern: `<span class="wordmark">heures<span class="y">y</span>s</span>`

SVG pattern (per file logo):

```svg
<text font-family="Exo 2" font-weight="700" fill="currentColor">
  heures<tspan font-weight="500" fill="#a855f7">y</tspan>s
</text>
```

## Anti-pattern (Heuresys-specific)

- ❌ NO serif fonts (es. Fraunces, Source Serif, Newsreader, DM Serif). Sans-only.
- ❌ NO italic sulla y del wordmark (L18 — Exo 2 sans descender problem).
- ❌ NO Geist come typography (legacy logo è Exo 2; per body Inter > Geist).
- ❌ NO weight 200 per la y (gap troppo estremo, sembra bug).
- ❌ NO letter-spacing custom sulla y o adiacenti.
- ❌ NO upper-case wordmark ("HEURESYS"). Sempre lowercase or capital-first ("heuresys" or "Heuresys").
- ❌ NO font variabile per body (non serve, Inter weight statico OK).

## Alternative tipografiche scartate

| Pairing scartato                       | Motivo                                                               | Reference                            |
| -------------------------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| Inter Tight + Inter + JetBrains        | Più sicuro ma "passe-partout"                                        | turn-of-decision typography 1° round |
| Space Grotesk + Inter + IBM Plex       | Aggiunge secondo carattere distintivo che si scontra con Exo 2 brand | turn-of-decision typography 1° round |
| Manrope                                | Troppo morbido/friendly per "serious enterprise"                     | B-alternatives                       |
| DM Sans                                | "Mood industrial-severo" si scontra con cinematic glow               | B-alternatives                       |
| Plus Jakarta Sans                      | OK ma Inter più universale                                           | B-alternatives                       |
| Geist standalone                       | Era candidato Phase 6 round 1 (B1), poi sciolto post-L11 reset       | DECISIONS-LOG L10                    |
| Source Serif 4 (per κ Quantitative FT) | Direzione FT-Grade scartata in D1                                    | Set 3 alternative                    |
| Bricolage Grotesque (per ε/θ)          | Direzioni Sculptural/Generative scartate in D1                       | Set 2 alternative                    |
| Fraunces (per β Brutalist)             | Direzione Brutalist scartata in D1                                   | Set 1 alternative                    |

## Esempi rendering

**Heading hero**:

```html
<h1
  style="font-family: Inter; font-weight: 700; font-size: 48px; letter-spacing: -1.2px; line-height: 1.1;"
>
  Il Layer Mancante <span style="color: var(--accent);">tra ERP, HR e BI</span>
</h1>
```

**Dashboard h1**:

```html
<h1
  style="font-family: Inter; font-weight: 600; font-size: 28px; letter-spacing: -0.8px; line-height: 1;"
>
  Capability registry overview
</h1>
```

**KPI big**:

```html
<div
  style="font-family: Inter; font-weight: 700; font-size: 36px; letter-spacing: -1px; font-variant-numeric: tabular-nums;"
>
  14.011 <span style="font-size: 14px; color: var(--accent); font-weight: 500;">+12.3%</span>
</div>
```

**Mono label**:

```html
<span
  style="font-family: 'JetBrains Mono'; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-muted); font-weight: 600;"
>
  D-001 · TABLES
</span>
```

**Wordmark hero**:

```html
<div
  class="wordmark glow"
  style="font-family: 'Exo 2'; font-weight: 700; font-size: 88px; letter-spacing: -3px;"
>
  heures<span class="y" style="color: var(--accent); font-weight: 500;">y</span>s
</div>
```

## Cross-reference

- **DESIGN.md sezione 3**: `02-aesthetic/heuresys.DESIGN.md` § Typography Rules (canonical drop-in)
- **Logo standard**: `02-aesthetic/logo-standard.md` (L16 + L18)
- **Modello base**: `02-aesthetic/direction-explorations/mu-architect-legacy.html`
- **CSS overlay legacy**: `02-aesthetic/direction-explorations/legacy-palette.css`
- **Pairing exploration archive**: `pairing-explorations.html` + `pairing-b-alternatives.html` (storico, non più active)
