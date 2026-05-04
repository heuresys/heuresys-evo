# Color Palette — Explorations (anchored on logo)

> **Stato**: ancorata al logo Heuresys. I due colori del wordmark sono **vincolo di partenza**, non variabili. Esploriamo intorno: neutrals, accenti complementari, semantic colors, dark mode.

## Ancore vincolanti (dal logo)

| Token             | OKLCH                  | Hex (riferimento) | Uso                                                                          |
| ----------------- | ---------------------- | ----------------- | ---------------------------------------------------------------------------- |
| `--brand-primary` | `oklch(0.62 0.19 260)` | `#3b82f6`         | Wordmark "Heures…s", primary CTA, link, focus ring, brand accents            |
| `--brand-accent`  | `oklch(0.63 0.26 297)` | `#a855f7`         | Wordmark "y", highlight, badge, capability score positive, micro-celebration |

Note: i valori OKLCH sono approssimazioni perceptually uniform; gli hex sono i riferimenti del wordmark live (HSL/HEX). Da raffinare con tool di conversione in fase implementazione.

## Esplorazioni intorno alle ancore

Tre direzioni alternative per **neutrals + semantic + dark mode**, tutte compatibili con il logo come ancora.

### Variant A — Cool minimal (Linear-like)

Neutri freddi (gray 240° hue), bianchi puri, contrasto alto, palette spartana. Coerente con direzione estetica "minimal-tech".

| Token                | OKLCH                   | Note                                       |
| -------------------- | ----------------------- | ------------------------------------------ |
| `--background`       | `oklch(0.99 0 0)`       | bianco pressoché puro                      |
| `--foreground`       | `oklch(0.18 0.02 260)`  | gray-900 freddo (hue allineata al primary) |
| `--muted`            | `oklch(0.96 0.005 260)` | gray-50 freddo                             |
| `--muted-foreground` | `oklch(0.48 0.02 260)`  | gray-500 freddo                            |
| `--border`           | `oklch(0.92 0.01 260)`  | gray-200 freddo                            |
| `--ring`             | `oklch(0.62 0.19 260)`  | uguale a primary                           |
| `--success`          | `oklch(0.69 0.18 142)`  | green-500                                  |
| `--warning`          | `oklch(0.78 0.18 75)`   | amber-500                                  |
| `--destructive`      | `oklch(0.60 0.22 25)`   | red-500                                    |

**Mood**: tech, ordinato, neutrale. Lascia parlare i dati.

### Variant B — Warm editorial

Neutri leggermente caldi (hue 60-90°, beige/cream), tipografici, contrasto medio. Coerente con direzione "editorial-distinct" (academic gravitas).

| Token                | OKLCH                   | Note                                    |
| -------------------- | ----------------------- | --------------------------------------- |
| `--background`       | `oklch(0.985 0.005 75)` | cream warm                              |
| `--foreground`       | `oklch(0.22 0.015 75)`  | gray-900 leggermente warm               |
| `--muted`            | `oklch(0.96 0.01 75)`   | beige-50                                |
| `--muted-foreground` | `oklch(0.50 0.02 75)`   | gray-500 warm                           |
| `--border`           | `oklch(0.91 0.015 75)`  | beige-200                               |
| `--ring`             | `oklch(0.62 0.19 260)`  | uguale a primary (contrast con warm bg) |
| `--success`          | `oklch(0.65 0.16 142)`  | green muted                             |
| `--warning`          | `oklch(0.74 0.16 65)`   | amber muted                             |
| `--destructive`      | `oklch(0.58 0.20 25)`   | red muted                               |

**Mood**: rivista intellettuale, paper-like, autorità tipografica.

### Variant C — Cinematic dark-first

Dark mode primaria (background dark navy/black), accenti vivi, contrasto cinematico. Coerente con direzione "cinematic-wow" + dashboard density per power user.

| Token (dark mode native) | OKLCH                   | Note                                         |
| ------------------------ | ----------------------- | -------------------------------------------- |
| `--background`           | `oklch(0.16 0.02 260)`  | navy-near-black                              |
| `--foreground`           | `oklch(0.96 0.005 260)` | quasi bianco                                 |
| `--muted`                | `oklch(0.22 0.025 260)` | dark navy                                    |
| `--muted-foreground`     | `oklch(0.65 0.02 260)`  | gray light                                   |
| `--border`               | `oklch(0.27 0.03 260)`  | dark border                                  |
| `--ring`                 | `oklch(0.65 0.22 260)`  | primary più vivido (alza luminance per dark) |
| `--success`              | `oklch(0.72 0.20 142)`  | green vivid                                  |
| `--warning`              | `oklch(0.80 0.20 80)`   | amber vivid                                  |
| `--destructive`          | `oklch(0.65 0.25 25)`   | red vivid                                    |

**Mood**: bloomberg-grade dashboard, modalità "war room", focus profondo. Light mode esiste come switch ma è secondaria.

## Dark mode in tutte le variant

Per A e B (light primary), il dark mode è derivato:

- Inversione luminance per `background` / `foreground`
- Hue conservata (non shift)
- Chroma alzata leggermente sui semantic per compensare perdita perceptiva
- Primary e accent del wordmark restano costanti (mai modificati)

Per C il dark è native, light è derivato.

## Confronto rapido

| Aspetto                            | A Cool minimal        | B Warm editorial   | C Cinematic dark                    |
| ---------------------------------- | --------------------- | ------------------ | ----------------------------------- |
| Allineamento direzione estetica    | Minimal-tech (Linear) | Editorial-distinct | Cinematic-wow                       |
| Allineamento target Enterprise (β) | ✅ Forte              | ✅ Forte           | △ Possibile                         |
| Allineamento dashboard density     | △ Media               | ⚠ Bassa            | ✅ Forte                            |
| Allineamento marketing surface     | ✅ Pulita             | ✅ Distintiva      | △ Niche                             |
| Time-to-build                      | Basso                 | Medio              | Alto (cinematic richiede più asset) |

## Decisione differita

Scelta della variant viene fatta in **Phase 4 (aesthetic direction)** dopo trend research e moodboard. Questo file resta come **shortlist motivata** che ancora le scelte cromatiche al logo immutabile.

Vincoli che ogni variant scelta deve rispettare:

1. **Logo blue + purple inviolabili** (mai shift di hue)
2. **Contrasto WCAG 2.1 AA** su `foreground/background` e `primary/background-on-primary`
3. **Dark mode in pari dignità** con light (almeno per dashboard)
4. **OKLCH come color space nativo** (allineato con `tokens.css` esistente)
5. **Coerenza con Tailwind 4 `@theme` directive** (nei `--color-*` token)

## Anti-pattern

- ❌ Usare il purple del logo come accent **diffuso** in UI (es. tutti i bottoni primary in purple). Il purple è **solo del wordmark**, in UI è il blue il primary.
- ❌ Aggiungere un terzo "brand color" che non sia derivato dal blue o dal purple
- ❌ Gradient del logo (blue→purple linear). Il logo è due colori puri, non gradient.
- ❌ Ombre/glow sotto al wordmark
