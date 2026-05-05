# Heuresys logo — y-accent standard

> **L25 (2026-05-05) — REGOLE PERMANENTI** che superano L16 e L18:
>
> 1. **h** sempre minuscola → wordmark = `heuresys` (mai `Heuresys`)
> 2. **Tutte le lettere** stesso font, stesso peso, stessa grandezza — **nessun gap di weight**
> 3. **NO italic** (su qualunque tipografia, sans o serif)
> 4. **Solo y** in `var(--accent)` color — il colore è l'**unico** differenziatore
> 5. Letter-spacing naturale del font (no override custom)
> 6. **In ogni occorrenza** (header, footer, modal, social meta) si usa il LOGO embedded, non plain text
>
> Le regole L16 (weight gap moderato 700→500) e L18 (no italic per sans) sono **supersedute** dalla L25 nel punto specifico del weight gap. Le sezioni successive di questo file riflettono la spec L25.

> **Stabilito**: 2026-05-05 (DECISIONS-LOG L16 → aggiornato L18 → finalizzato L25)
> **Scopo**: standard di rendering del logo "heuresys" cross-direzione, indipendente dalla tipografia di ogni direction. Garantisce riconoscibilità visiva omogenea anche al variare di palette/typography/mood.

## Principio fondante (L25)

Il **wordmark "heuresys"** è composto da 8 lettere identiche per font, peso, grandezza e stile, con la sola **"y"** colorata diversamente (`var(--accent)`). La h è sempre minuscola. Nessun italic, nessun gap di weight. Il **colore** è l'unico differenziatore — minimalismo radicale per signal cromatico puro.

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

## CSS pattern canonico (L25)

```css
:root {
  --accent: <direction-specific-accent>; /* light theme */
}
[data-theme='dark'] {
  --accent: <direction-specific-accent-dark>;
}

/* Wordmark — tutte le lettere identiche per font/peso/size/style */
.wordmark {
  font-family: var(--display-face); /* Exo 2 default, agnostic */
  font-weight: 700;
  color: var(--ink); /* o var(--brand-blue) per dashboard architect */
  letter-spacing: normal; /* NO override */
}

/* Y — UNICO differenziatore: il color */
.wordmark .y {
  color: var(--accent);
  /* NESSUN font-weight override (eredita 700) */
  /* NESSUN font-style italic */
  /* NESSUN font-size override */
}
```

## HTML pattern canonico (L25)

```html
<span class="wordmark">heures<span class="y">y</span>s</span>
```

**Nota L25**: la `h` è sempre minuscola. Niente capitalizzazione (mai `Heuresys`).

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

| Data       | Cambiamento                                                                                                                              | Reference         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 2026-05-04 | Logo legacy www.heuresys.com Exo 2 + "y" purple — dichiarato definitivo                                                                  | DECISIONS-LOG L6  |
| 2026-05-05 | L6 sciolta — esplorazione libera logo                                                                                                    | DECISIONS-LOG L11 |
| 2026-05-05 | Logo y-accent standard definito                                                                                                          | DECISIONS-LOG L16 |
| 2026-05-05 | NO italic per sans-serif (descender invade adjacent s)                                                                                   | DECISIONS-LOG L18 |
| 2026-05-05 | **L25 PERMANENT**: h lowercase · tutte lettere identiche peso/size/style · solo color diverso · embed ovunque (no plain text "heuresys") | DECISIONS-LOG L25 |

## Vedi anche

- [`DECISIONS-LOG.md`](../DECISIONS-LOG.md) — cronologia decisioni
- [`BRAND-STATE.md`](../BRAND-STATE.md) — stato corrente
- [`99-samples/rohitg00-prompts/break-default-aesthetic.md`](../99-samples/rohitg00-prompts/break-default-aesthetic.md) — anti-slop guardrails compatibili
- [`03-visual-identity/logo/final/`](../03-visual-identity/logo/final/) — file SVG logo (under reconsideration post-L11)
