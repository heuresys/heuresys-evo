# Logo Heuresys — Definitivo

> **Status**: definitivo. Catturato da www.heuresys.com (sito legacy live al 2026-05-04). Decisione di Enzo: usato così com'è, niente esplorazione di alternative.

## Specifiche tecniche

| Proprietà                 | Valore                                                |
| ------------------------- | ----------------------------------------------------- |
| Tipo                      | Wordmark testuale (no symbol/mark separato)           |
| Testo                     | `Heuresys` (8 caratteri, lowercase tranne H iniziale) |
| Font                      | **Exo 2** (Google Fonts)                              |
| Font weight               | **700** (bold)                                        |
| Font size (viewBox units) | 26.6667px                                             |
| Letter-spacing            | -1.17px (tight)                                       |
| Line-height               | 0                                                     |
| ViewBox                   | `22 6 136 24`                                         |
| Aspect ratio              | ~5.7:1 (orizzontale)                                  |
| Anchor                    | `text-anchor="middle"`, x=90 y=24                     |

## Composizione cromatica

Il wordmark è bicolore con accento sul carattere centrale (`y`):

| Segmento   | Carattere      | Colore               | Hex equivalente | Tailwind     |
| ---------- | -------------- | -------------------- | --------------- | ------------ |
| Primary    | `Heures` (1-6) | `hsl(221, 83%, 53%)` | `#3b82f6`       | `blue-500`   |
| **Accent** | `y` (7)        | `#a855f7`            | `#a855f7`       | `purple-500` |
| Primary    | `s` (8)        | `hsl(221, 83%, 53%)` | `#3b82f6`       | `blue-500`   |

L'accento sulla `y` viola al centro è il **focal element semantico** del brand: non è decorativo, è il segno di riconoscibilità del wordmark.

### Equivalenti OKLCH (perceptual uniform, da integrare in `tokens.css`)

| Colore        | OKLCH approx           | Note                 |
| ------------- | ---------------------- | -------------------- |
| Primary blue  | `oklch(0.62 0.19 260)` | ~Tailwind blue-500   |
| Accent purple | `oklch(0.63 0.26 297)` | ~Tailwind purple-500 |

## File presente in questa cartella

- **`heuresys-wordmark.svg`** — versione canonical, autosufficiente, con `<defs><style>` inline. Compatibile con uso inline o standalone.

## Prerequisiti d'uso

- Il font **Exo 2** deve essere disponibile sulla pagina che renderizza il logo. In assenza, fallback al sans-serif di sistema (può deformare il letter-spacing tight). Per usi production: caricare via `next/font/google` con `Exo_2({ subsets: ["latin"], weight: ["700"] })`.
- Per asset bitmap (favicon `.ico`, og-image `.png`): da generare in fase di promozione v1.0. Vedi `08-promotion/v1.0-checklist.md`.

## Versioni da generare in Phase 7 (collassata a "cattura + derivati")

Phase 7 originale (esplorazione 5-7 logo concept) non serve più. Sostituita da:

- [ ] `heuresys-wordmark.svg` (canonical) ✅ presente
- [ ] `heuresys-wordmark-monochrome-dark.svg` (per dark backgrounds, entrambi i tspan in white)
- [ ] `heuresys-wordmark-monochrome-light.svg` (per light backgrounds, entrambi in primary)
- [ ] `heuresys-mark.svg` (solo la "y" viola isolata, per favicon e icon-set)
- [ ] `favicon.svg` (variant con padding minimo)
- [ ] `favicon.ico` (multi-size 16/32/48/64, generato in promozione)
- [ ] `og-image-template.svg` (1200×630, logo + tagline, per social preview)
- [ ] `apple-touch-icon.png` (180×180, derivata da mark)

## Vincoli di brand sul logo

| Regola                                                                                | Stato         |
| ------------------------------------------------------------------------------------- | ------------- |
| Non modificare i colori del wordmark (blue + purple su `y`)                           | ✅ Vincolante |
| Non sostituire il font Exo 2                                                          | ✅ Vincolante |
| Non aggiungere ombre, gradient, effetti decorativi al wordmark                        | ✅ Vincolante |
| Non usare il wordmark sotto i 80px di larghezza (sotto questa soglia → mark `y` solo) | ✅ Vincolante |
| Padding minimo intorno al wordmark = altezza della `H`                                | ✅ Vincolante |
| Su sfondo scuro: usare versione monochrome white (entrambe le tspan)                  | ✅ Vincolante |

## Provenienza

- Estratto da `https://www.heuresys.com/` (HTTP 200, Next.js SSR, locale `it`) il 2026-05-04
- Contesto: usato in header, footer, hero della landing page del sito legacy `heuresys.com.evo`
- Consegna esplicita di Enzo: "tenuto come logo definitivo del progetto (proprio così come è: typo Exo 2 e due colori)"
