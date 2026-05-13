# Logo Heuresys — Definitivo (v2 post-L21)

> **Status**: ✅ **v2 confermata** (2026-05-05 — DECISIONS-LOG L21). Logo legacy `www.heuresys.com` preservato come base + aggiornato a standard **L16** (logo y-accent) + **L18** (no italic per sans-serif). Vedi `02-aesthetic/logo-standard.md` per spec completa.

## Specifiche tecniche

| Proprietà                 | Valore                                                |
| ------------------------- | ----------------------------------------------------- |
| Tipo                      | Wordmark testuale (no symbol/mark separato)           |
| Testo                     | `Heuresys` (8 caratteri, lowercase tranne H iniziale) |
| Font                      | **Exo 2** (Google Fonts)                              |
| Font weight body          | **700** (bold)                                        |
| Font weight y             | **500** (gap moderato L16, NO italic L18)             |
| Font size (viewBox units) | 26.6667px                                             |
| Letter-spacing            | -0.5px (kerning naturale L16, NO override custom)     |
| Line-height               | 0                                                     |
| ViewBox                   | `22 6 136 24`                                         |
| Aspect ratio              | ~5.7:1 (orizzontale)                                  |
| Anchor                    | `text-anchor="middle"`, x=90 y=24                     |

## Composizione cromatica

Il wordmark è bicolore con accento sul carattere centrale (`y`):

| Segmento   | Carattere      | Colore    | Hex equivalente | Tailwind     |
| ---------- | -------------- | --------- | --------------- | ------------ |
| Primary    | `Heures` (1-6) | `#3b82f6` | `#3b82f6`       | `blue-500`   |
| **Accent** | `y` (7)        | `#a855f7` | `#a855f7`       | `purple-500` |
| Primary    | `s` (8)        | `#3b82f6` | `#3b82f6`       | `blue-500`   |

L'accento sulla `y` viola al centro è il **focal element semantico** del brand: non è decorativo, è il segno di riconoscibilità del wordmark.

## File presenti in questa cartella

| File                                     | Status | Spec                                                                                     |
| ---------------------------------------- | ------ | ---------------------------------------------------------------------------------------- |
| `heuresys-wordmark.svg`                  | ✅     | Canonical full color · "Heures"+"s" blue + "y" purple weight 500                         |
| `heuresys-wordmark-monochrome-dark.svg`  | ✅     | Tutto white (per dark backgrounds, contesti senza accent)                                |
| `heuresys-wordmark-monochrome-light.svg` | ✅     | Tutto blue primary (per light backgrounds, contesti monochrome blu)                      |
| `heuresys-mark.svg`                      | ✅     | Solo "y" purple isolata (per favicon, icon-set, mark contexts) · weight 500 L16 standard |
| `favicon.svg`                            | ✅     | "y" purple su quadrato dark navy `#0a0d18` (legacy bg)                                   |
| `og-image-template.svg`                  | ✅     | 1200×630 social preview · wordmark + tagline + payoff · gradient glow legacy             |
| `favicon.ico` (multi-size 16/32/48/64)   | ⏳     | Da generare via tool (Phase 11 promozione)                                               |
| `apple-touch-icon.png` (180×180)         | ⏳     | Da generare derivata dal mark.svg                                                        |

## Aggiornamenti L16 + L18 (2026-05-05)

Tutti i file SVG aggiornati post-L21 con:

- **Weight y** ridotto da 700 a **500** (L16 gap moderato dal body 700)
- **Letter-spacing** body wordmark allineato a `-0.5px` (era `-1.17px`, ora kerning più naturale L16)
- **NO italic** sulla y — Exo 2 è sans-serif, italic causa descender overlap (L18 — verificato browser visual review)
- **favicon bg** allineato a `#0a0d18` (legacy bg dark navy, era `#0a0a14` slightly different)

## Prerequisiti d'uso

- Il font **Exo 2** deve essere disponibile sulla pagina che renderizza il logo. In assenza, fallback al sans-serif di sistema (può deformare il letter-spacing). Per production: caricare via `next/font/google` con `Exo_2({ subsets: ["latin"], weight: ["500", "700"] })`.
- Bitmap derivati (`.ico`, `.png`) da generare in fase di promozione v1.0. Vedi `08-promotion/v1.0-checklist.md`.

## Vincoli di brand sul logo

| Regola                                                                                      | Stato         |
| ------------------------------------------------------------------------------------------- | ------------- |
| Non modificare i colori del wordmark (blue + purple su `y`)                                 | ✅ Vincolante |
| Non sostituire il font Exo 2                                                                | ✅ Vincolante |
| Mantenere weight gap moderato (700 body / 500 y) — L16                                      | ✅ Vincolante |
| NO italic sulla y per Exo 2 — L18 (descender slanted invade s)                              | ✅ Vincolante |
| Non aggiungere ombre, gradient, effetti decorativi al wordmark inline                       | ✅ Vincolante |
| Non usare il wordmark sotto gli 80px di larghezza (sotto → usare `mark.svg` solo)           | ✅ Vincolante |
| Padding minimo intorno al wordmark = altezza della `H`                                      | ✅ Vincolante |
| Su sfondo scuro generic: monochrome dark (white). Su sfondo chiaro: monochrome light (blue) | ✅ Vincolante |
| Sul brand bg dark navy `#0a0d18`: usa wordmark canonical full color                         | ✅ Vincolante |
| Glow drop-shadow purple sotto wordmark hero — signature legacy preservata                   | ✅ Vincolante |

## Provenienza

- Estratto da `https://www.heuresys.com/` (HTTP 200, Next.js SSR, locale `it`) il 2026-05-04
- Contesto: usato in header, footer, hero della landing page del sito legacy `heuresys.com.evo`
- Consegna iniziale di Enzo (L6, sciolta poi in L11): "tenuto come logo definitivo del progetto (proprio così come è: typo Exo 2 e due colori)"
- **Confermato finale (L21)**: dopo esplorazione 32 mockup direzionali (Set 1+2+3+4+5), il logo legacy resta preferito + aggiornato a standard L16/L18

## Cross-reference

- **Logo standard**: `02-aesthetic/logo-standard.md` (L16 + L18)
- **DESIGN.md sezione 3**: `02-aesthetic/heuresys.DESIGN.md` § Typography Rules
- **Modello base**: `02-aesthetic/direction-explorations/mu-architect-legacy.html`
- **Palette legacy**: `02-aesthetic/direction-explorations/legacy-palette.css`
- **Capture sito legacy**: `02-aesthetic/heuresys-com-current-style.md`
