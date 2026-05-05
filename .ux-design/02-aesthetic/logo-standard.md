# Heuresys logo — y-accent standard

> **Stabilito**: 2026-05-05 (DECISIONS-LOG L16)
> **Scopo**: standard di rendering del logo "heuresys" cross-direzione, indipendente dalla tipografia di ogni direction. Garantisce riconoscibilità visiva omogenea anche al variare di palette/typography/mood.

## Principio fondante

Il **wordmark "heuresys"** ha la lettera **"y"** sempre rendered come signal differenziato — accent color + style — e con letter-spacing naturale del font (no override custom). La differenziazione è **moderata, non teatrale**: contrasto sottile che preserva l'integrità tipografica e la trustworthy-leaning identity B2B enterprise.

## Regole canoniche

| Regola         | Spec                                                                                                             | Razionale                                                                                                                                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Color y**    | `var(--accent)` sempre, theme-aware (auto-switch light/dark)                                                     | Il signal cromatico è il differenziatore primario; deve rispettare il theme attivo                                                                                                                                                            |
| **Weight y**   | Contrasto **moderato** rispetto al body. Body 700 → y 500-600; body 800 → y 600-700. NO weight 200               | Differenziazione sottile, non teatrale. Allineato a 60/40 trustworthy/courage (no overdrive courage)                                                                                                                                          |
| **Style y**    | **Sans-serif**: NO italic (descender slanted invade glyph adiacente). **Serif**: italic preferito.               | Browser visual review 2026-05-05 ha rivelato che Inter/Geist/Bricolage italic 'y' ha descender che si sovrappone visualmente alla 's' adiacente. Differenziazione sans = color + weight gap. Serif italic ha glyph distinctive senza overlap. |
| **Position y** | Letter-spacing **naturale** del font. NO `letter-spacing` custom. Distanza `s-y-s` simmetrica = kerning naturale | Il logo deve fluire come una parola unica; gap manuali rompono la lettura e creano "y come asset isolato"                                                                                                                                     |
| **Tipografia** | Indipendente — funziona con Inter, Source Serif, Space Grotesk, Bricolage variable, ecc.                         | Il logo è un'identità trasversale; ogni direction porta la propria tipografia + applica la y-rule                                                                                                                                             |
| **Monogram**   | Stessa logica: il punto centrale / nodo / glyph isolato che rappresenta la y nel mark è in `--accent`            | Coerenza wordmark ↔ mark assicura riconoscibilità a thumbnail size                                                                                                                                                                            |

## CSS pattern canonico

```css
:root {
  --accent: <direction-specific-accent>; /* light theme */
}
[data-theme='dark'] {
  --accent: <direction-specific-accent-dark>;
}

.wordmark {
  font-family: var(--display-face);
  font-weight: 700; /* o 800 a seconda della direction */
  color: var(--ink);
  letter-spacing: normal; /* NO override */
}

/* Sans-serif (Inter, Geist, Space Grotesk, Bricolage) */
.wordmark.sans .y {
  color: var(--accent);
  font-weight: 500; /* contrasto moderato (gap 200 da body) */
  /* NO italic — descender italic invade glyph adiacente */
}

/* Serif (Fraunces, Newsreader, Source Serif, DM Serif) */
.wordmark.serif .y {
  color: var(--accent);
  font-weight: 500;
  font-style: italic; /* preferito — serif italic glyph distinctive */
}
```

## HTML pattern canonico

```html
<span class="wordmark">heures<span class="y">y</span>s</span>
```

## SVG pattern (per logo file SVG)

```svg
<text x="0" y="0" font-family="<face>" font-weight="700" fill="currentColor">heures</text>
<text x="..." y="0" font-family="<face>" font-weight="500" font-style="italic" fill="var(--accent)">y</text>
<text x="..." y="0" font-family="<face>" font-weight="700" fill="currentColor">s</text>
```

**Attenzione**: nei file SVG usa `<tspan>` invece di tre `<text>` separati per preservare il kerning naturale. Pattern raccomandato:

```svg
<text font-family="<face>" font-weight="700" fill="currentColor">heures<tspan font-weight="500" font-style="italic" fill="var(--accent)">y</tspan>s</text>
```

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

| Data       | Cambiamento                                                             | Reference         |
| ---------- | ----------------------------------------------------------------------- | ----------------- |
| 2026-05-04 | Logo legacy www.heuresys.com Exo 2 + "y" purple — dichiarato definitivo | DECISIONS-LOG L6  |
| 2026-05-05 | L6 sciolta — esplorazione libera logo                                   | DECISIONS-LOG L11 |
| 2026-05-05 | Logo y-accent standard definito (questo documento)                      | DECISIONS-LOG L16 |

## Vedi anche

- [`DECISIONS-LOG.md`](../DECISIONS-LOG.md) — cronologia decisioni
- [`BRAND-STATE.md`](../BRAND-STATE.md) — stato corrente
- [`99-samples/rohitg00-prompts/break-default-aesthetic.md`](../99-samples/rohitg00-prompts/break-default-aesthetic.md) — anti-slop guardrails compatibili
- [`03-visual-identity/logo/final/`](../03-visual-identity/logo/final/) — file SVG logo (under reconsideration post-L11)
