# Heuresys logo — "logo originale" standard

> **Nome canonical**: dal 2026-05-06 il logo predefinito si chiama **"logo originale"** per distinguerlo da eventuali altri logo derivati o sperimentali futuri.
>
> **L27 (2026-05-06) + L48 (2026-05-09) — REGOLE PERMANENTI** che cumulano L25 e specificano due colori palette-aware + eccezione plain text:
>
> 1. **h** sempre minuscola → wordmark = `heuresys` (mai `Heuresys`)
> 2. **Tutte le 8 lettere** stesso font (Exo 2), stesso peso (700), stessa grandezza, stesso style (no italic)
> 3. **Due colori palette-aware** (L48 update — era hardcoded blu+purple):
>    - Body lettere = `var(--primary)` — palette-aware: blue legacy/alpha, terracotta zeta, salmon beta, navy gamma, violet theta, ecc.
>    - `y` = `var(--accent)` — palette-aware: secondo colore distinto da primary per bicolor effect garantito
> 4. Letter-spacing naturale del font (no override custom)
> 5. **In ogni ricorrenza** (header, footer, modal) si usa il logo embedded, non plain text
> 6. **ECCEZIONE plain text**: se la ricorrenza è **indirizzo, link o dominio** → resta plain lowercase (no embed)
>
> Le regole L16 (weight gap moderato 700→500) e L18 (no italic per sans) sono **supersedute** dalla L25/L27. Le sezioni successive riflettono la spec L27+L48 finale.
>
> **L48 update razionale**: `--primary` è semantico (prende il colore primary della palette attiva), mentre `--brand-blue` era hardcoded blu (token storico). In legacy/alpha non cambia visivamente (`--primary == #3b82f6 == --brand-blue`). In palette non-blue il body si adatta al character della palette (es. zeta terracotta + moss y; beta salmon + yellow y; gamma navy + amber y; theta violet + cyan y). Vincolo associato: ogni palette del framework `.ux-design/02-aesthetic/theme-framework/` garantisce `--primary ≠ --accent`.

> **Stabilito**: 2026-05-05 (DECISIONS-LOG L16 → aggiornato L18 → finalizzato L25)
> **Scopo**: standard di rendering del logo "heuresys" cross-direzione, indipendente dalla tipografia di ogni direction. Garantisce riconoscibilità visiva omogenea anche al variare di palette/typography/mood.

## Principio fondante (L27 + L48 — "logo originale")

Il **wordmark "heuresys"** ("logo originale") è composto da 8 lettere identiche per font, peso, grandezza e stile, con **due colori palette-aware**:

- 7 lettere body in `var(--primary)` — colore primario della palette attiva (blue in legacy/alpha, terracotta in zeta, salmon in beta, navy in gamma, violet in theta, ecc.)
- la **y** in `var(--accent)` — secondo colore della palette attiva (sempre distinto da primary per bicolor effect)

La h è sempre minuscola. Nessun italic, nessun gap di weight, nessuna scale-down. La signature visiva è il pattern primary+accent palette-aware, non più hardcoded blue+purple né body theme-aware (`--ink`).

**Razionale**: pattern già consolidato in Phase 9 dashboard come `.wordmark-foot.legacy` (L23), promosso a default cross-surface dal 2026-05-06 (L27). L48 (2026-05-09) canonicalizza il body color a `var(--primary)` invece di `var(--brand-blue)` per supportare palette non-blue del theme-framework v1.

## Regole canoniche (L25)

| Regola            | Spec L25                                                            | Razionale                                                                                                              |
| ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Case**          | `heuresys` lowercase sempre (`h` minuscola)                         | Brand voice "tool, not corporation". Lowercase = approachable, modern, ontological tool                                |
| **Color y**       | `var(--accent)` sempre, theme-aware (auto-switch light/dark)        | Il signal cromatico è l'**unico** differenziatore. Massima leggibilità, massimo signal                                 |
| **Weight y**      | **Identico** al body (700 = 700, 800 = 800)                         | Nessun gap. La y deve avere la stessa "presenza" delle altre lettere — solo colore diverso                             |
| **Size y**        | **Identica** alle altre lettere (no scale)                          | Coerenza tipografica. Una lettera diversa di size rompe il kerning e crea "asset isolato"                              |
| **Style y**       | **NO italic** (su qualunque font, sans o serif)                     | Italic crea descender obliquo (sans) o tone editorial (serif) — entrambi off-brand. Tone B2B = uniforme                |
| **Position y**    | Letter-spacing **naturale** del font. NO `letter-spacing` custom    | Il logo deve fluire come una parola unica. Gap manuali rompono la lettura                                              |
| **Tipografia**    | Inter / Geist / Space Grotesk / Bricolage / Source Sans / Exo 2 OK  | Il logo è agnostic. Funziona perché lo "stress" è solo il colore                                                       |
| **Monogram (y)**  | Solo glyph "y" in `--accent`, stesso weight del wordmark            | Mark = "y" isolata. Stessa size relativa, stesso weight                                                                |
| **Embed ovunque** | Header + footer + modal + social meta = sempre logo, mai plain text | Riconoscibilità brand cross-surface. Mai `<a>heuresys.com</a>` plain — sempre `<a>` wraps `<span class="wordmark">...` |

## Due convenzioni richiamabili: "originale" e "relativo"

Dal 2026-05-06 esistono **due classi CSS** che condividono la **stessa struttura tipografica** (Exo 2 700 · h lowercase · 8 lettere identiche · no italic · letter-spacing naturale) e si differenziano solo nel **mapping dei due colori**:

| Classe                                   | Body color                                           | Y color                               | Quando                                                                                                                                                     |
| ---------------------------------------- | ---------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.wordmark-original` (L27 default + L48) | `var(--primary)` **palette-aware**                   | `var(--accent)` **palette-aware**     | Tema brand canonical · default cross-surface · si adatta alla palette attiva (blue+purple in legacy, terracotta+moss in zeta, salmon+yellow in beta, ecc.) |
| `.wordmark-relative` (L28)               | `var(--logo-body, var(--ink))` **derivato dal tema** | `var(--accent)` **derivato dal tema** | Surface con tema CSS alternativo (direction estetica diversa, palette cliente custom, variante stagionale)                                                 |

Ogni tema CSS che vuole un logo "relativo" definisce il suo `--logo-body` (token canonico dedicato). Se non lo definisce, il fallback nativo CSS `var(--logo-body, var(--ink))` ricade su `--ink` (theme-aware neutro). `--accent` viene preso dalla palette del tema attivo.

## CSS pattern canonico

```css
:root {
  --primary: #2452c8; /* light theme · logo originale body (palette-aware) */
  --accent: #7e3fc8; /* light theme · y color (palette-aware) */
  --brand-blue: #2452c8; /* alias storico, kept per compatibilità */
  --ink: #0a0d18; /* light theme · fallback logo relativo body */
}
[data-theme='dark'] {
  --primary: #3b82f6;
  --accent: #a855f7;
  --brand-blue: #3b82f6;
  --ink: #f4f5f7;
}

/* "Logo originale" (L27 + L48) — 2 colori palette-aware */
.wordmark-original {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  color: var(--primary); /* COLORE BODY · palette-aware (era --brand-blue pre-L48) */
  letter-spacing: normal; /* NO override */
  text-transform: lowercase; /* h sempre minuscola */
}
.wordmark-original .y {
  color: var(--accent); /* COLORE Y · palette-aware */
}

/* "Logo relativo" (L28) — 2 colori derivati dal tema CSS attivo */
.wordmark-relative {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  color: var(--logo-body, var(--ink)); /* token tema · fallback --ink */
  letter-spacing: normal;
  text-transform: lowercase;
}
.wordmark-relative .y {
  color: var(--accent); /* token tema (può variare per direction) */
}

/* Utility per embed inline in contesti tipografici diversi (mono/Inter)
   Default segue convenzione "logo originale" (palette-aware). */
.wm-inline {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  letter-spacing: normal;
  text-transform: lowercase;
  color: var(--primary);
}
.wm-inline .y {
  color: var(--accent);
}
```

**Esempio applicativo logo relativo** — tema "Blueprint γ" (industrial blueprint direction):

```css
[data-theme-direction='blueprint'] {
  --logo-body: #1c5fa4; /* deep blueprint blue, tema-specifico */
  --accent: #d97706; /* engineering yellow → orange, tema-specifico */
}
```

Il markup `<span class="wordmark-relative">heures<span class="y">y</span>s</span>` su una surface con `data-theme-direction="blueprint"` rende automaticamente body in `#1c5fa4` + y in `#d97706`, allineato al tema attivo.

## HTML pattern canonico

Default (logo originale, L27):

```html
<span class="wordmark-original">heures<span class="y">y</span>s</span>
```

Quando il tema CSS prescelto richiede mapping color tematico (logo relativo, L28):

```html
<span class="wordmark-relative">heures<span class="y">y</span>s</span>
```

Inline body embed (eredita convenzione default originale):

```html
<span class="wm-inline">heures<span class="y">y</span>s</span>
```

**Nota L27/L28**: la `h` è sempre minuscola. Niente capitalizzazione (mai `Heuresys`).

## Eccezione plain text (L27): indirizzi, link, domini

Le ricorrenze "heuresys" che fanno parte di **indirizzi · link · domini** restano **plain text lowercase**, NON embed. Casi tipici:

| Caso                        | Esempio                                       | Resa                                      |
| --------------------------- | --------------------------------------------- | ----------------------------------------- |
| Link a dominio              | `← heuresys.com` (top-back link)              | plain                                     |
| Sotto-dominio               | `rtl-bank.heuresys.com` (tenant-meta)         | plain                                     |
| Copyright dominio           | `© 2026 heuresys.com — ...` (footer)          | plain                                     |
| FQDN production             | `evo.heuresys.com` · `www.heuresys.com`       | plain                                     |
| Email aziendale             | `info@heuresys.com`                           | plain                                     |
| localStorage / programmatic | `localStorage.setItem('heuresys-theme', ...)` | plain (lowercase)                         |
| `<title>` HTML              | `<title>Accedi — heuresys</title>`            | plain (lowercase, tag accetta solo plain) |

In tutti gli altri contesti (header label, footer attribution, modal title, paragraph reference, button copy, navigation item) → **embed obbligatorio**.

## SVG pattern (per logo file SVG · L25)

```svg
<text font-family="<face>" font-weight="700" fill="currentColor">heures<tspan fill="var(--accent)">y</tspan>s</text>
```

Nota L25: il `<tspan>` per la y NON ha `font-weight` o `font-style` override. Eredita dal `<text>` parent. Solo `fill` cambia.

## Anti-pattern (cosa NON fare)

| Anti-pattern                                             | Perché è vietato                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| `letter-spacing: 0.05em` o offset manuali sulla y        | Rompe la fluidità del wordmark; la y diventa "asset incollato"        |
| Weight y a 200 (extra-light) con body 700-800            | Gap troppo estremo: la y sembra un errore di rendering, non un signal |
| Color y hardcoded (es. `color: #5e69d1`)                 | Non si adatta al theme; rompe la regola light/dark switch             |
| y in stesso weight + style del body                      | Nessun differenziatore visivo; y indistinguibile dalle altre lettere  |
| y in upper-case ("heuresYs")                             | Cambia la lettura del wordmark; mai modificare il case                |
| y come SVG icon separato dal testo (positioned absolute) | Rompe la fluidità e il kerning naturale                               |
| Dimensione y ≠ resto del wordmark                        | y deve avere identica dimensione delle altre lettere                  |

## Verifica conformità (checklist pre-merge)

Prima di considerare un mockup "logo-conforme":

- [ ] La y è in `var(--accent)` (non hardcoded)
- [ ] Il color cambia correttamente al theme toggle light↔dark
- [ ] Weight y differisce moderatamente dal body (200 punti circa)
- [ ] Style italic applicato (o documentata eccezione tipografica)
- [ ] Nessun `letter-spacing` custom sulla y o adiacenti
- [ ] Distanza visiva s↔y == y↔s (simmetria kerning naturale)
- [ ] Riconoscibilità a thumbnail (verifica a 24×24px)
- [ ] Logo SVG (file separato in `03-visual-identity/logo/`) allineato allo standard

## Tipografie compatibili

Lo standard è agnostic. Verificato funzionare con:

- **Inter** (700 body / 500 italic y) — Set 3 ι/μ, η Swiss
- **Source Serif 4** (700 body / 400 italic y) — Set 3 κ
- **Space Grotesk** (700 body / 500 italic y) — Set 1 γ
- **Bricolage Grotesque variable** (wght 700 / wght 500 italic) — Set 2 ε/θ
- **Geist** (700 body / 500 italic y)
- **Source Sans 3** (700 body / 400 italic y)

## Eccezioni direzione-specifiche

Alcune direction hanno constraint tipografici o concept signature che giustificano deviazioni controllate dalla spec base. Ogni eccezione DEVE essere documentata.

| Direction                  | Eccezione                                                                             | Razionale                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ζ Architectural Warm       | Weight gap impossibile (body wght 400, y wght 400) — solo italic + accent color       | DM Serif Display è single-weight su Google Fonts. Italic + accent rimane signal sufficiente.                         |
| θ Algorithmic Generative   | y in gradient text (`var(--gen-1)` → `var(--gen-3)`) invece di single `var(--accent)` | Il claim della direzione è "il brand emerge dal grafo, gradient generativo derivato"; signal cromatico è il _punto_. |
| κ Quantitative FT Tempered | Weight gap 300 (body 700 / y 400), leggermente sopra il "moderato 200"                | Source Serif 4 italic 400 ha optical balance corretto a heading scale 36-56px; weight 500 italic appare pesante.     |

## Storia delle decisioni

| Data       | Cambiamento                                                                                                                                                                                                                                                           | Reference         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 2026-05-04 | Logo legacy www.heuresys.com Exo 2 + "y" purple — dichiarato definitivo                                                                                                                                                                                               | DECISIONS-LOG L6  |
| 2026-05-05 | L6 sciolta — esplorazione libera logo                                                                                                                                                                                                                                 | DECISIONS-LOG L11 |
| 2026-05-05 | Logo y-accent standard definito                                                                                                                                                                                                                                       | DECISIONS-LOG L16 |
| 2026-05-05 | NO italic per sans-serif (descender invade adjacent s)                                                                                                                                                                                                                | DECISIONS-LOG L18 |
| 2026-05-05 | **L25 PERMANENT**: h lowercase · tutte lettere identiche peso/size/style · solo color diverso · embed ovunque (no plain text "heuresys")                                                                                                                              | DECISIONS-LOG L25 |
| 2026-05-06 | **L27 — "logo originale"**: nome canonical · due colori fissi (body `--brand-blue` + y `--accent`) · ECCEZIONE plain text per indirizzi/link/domini                                                                                                                   | DECISIONS-LOG L27 |
| 2026-05-06 | **L28 — "logo relativo"**: convenzione richiamabile · stessa struttura del logo originale ma body `var(--logo-body, var(--ink))` + y `var(--accent)` derivati dal tema CSS attivo · per surface tematizzate                                                           | DECISIONS-LOG L28 |
| 2026-05-09 | **L48 — body color canonical** = `var(--primary)` (era `var(--brand-blue)`) · palette-aware: in legacy/alpha resta blu, in zeta terracotta, in beta salmon, in gamma navy, ecc. · vincolo `--primary ≠ --accent` garantito in tutte le palette del theme-framework v1 | DECISIONS-LOG L48 |

## Vedi anche

- [`DECISIONS-LOG.md`](../DECISIONS-LOG.md) — cronologia decisioni
- [`BRAND-STATE.md`](../BRAND-STATE.md) — stato corrente
- [`99-samples/rohitg00-prompts/break-default-aesthetic.md`](../99-samples/rohitg00-prompts/break-default-aesthetic.md) — anti-slop guardrails compatibili
- [`03-visual-identity/logo/final/`](../03-visual-identity/logo/final/) — file SVG logo (under reconsideration post-L11)
