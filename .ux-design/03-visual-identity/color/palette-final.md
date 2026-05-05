# Palette Final — Heuresys (v2 — D1 confermato)

> **Status**: ✅ **v2 confermata** (2026-05-05 — DECISIONS-LOG L21). Palette base = legacy `www.heuresys.com` (Variant C cinematic dark) + standard L16/L18 logo + binding al modello base `mu-architect-legacy.html`.
>
> **Source di riferimento**: token system in `02-aesthetic/direction-explorations/legacy-palette.css` (CSS overlay Set 5) — questo file (`palette-final.md`) è la documentazione canonica.
>
> **Drop-in spec per AI agents**: vedi `02-aesthetic/heuresys.DESIGN.md` (9 sezioni canoniche, pattern getdesign.md compatible).

## Brand inviolabili (dal logo)

| Token             | OKLCH                  | Hex       | HSL (riferimento legacy) | Uso                                                                                                                                  |
| ----------------- | ---------------------- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--brand-primary` | `oklch(0.62 0.19 260)` | `#3b82f6` | `hsl(221 83% 53%)`       | Wordmark primary "Heures…s", primary CTA, link, focus ring, brand accents UI, primary buttons (gradient start)                       |
| `--brand-accent`  | `oklch(0.63 0.26 297)` | `#a855f7` | —                        | Wordmark "y" focal element, glow soft, badge highlight, capability score positive, micro-celebration, primary buttons (gradient end) |

## Dark mode (default per dashboard + marketing surface)

```css
@theme {
  /* Brand inviolabili */
  --brand-primary: oklch(0.62 0.19 260); /* #3b82f6 */
  --brand-accent: oklch(0.63 0.26 297); /* #a855f7 */

  /* Surface */
  --color-background: oklch(0.1 0.005 260); /* near-black navy */
  --color-foreground: oklch(0.96 0.005 260); /* quasi-white */
  --color-surface: oklch(0.14 0.01 260); /* card bg */
  --color-surface-elevated: oklch(0.17 0.012 260); /* card elevated / hover */
  --color-surface-overlay: oklch(0.2 0.015 260); /* modal / popover */

  /* Text */
  --color-muted: oklch(0.22 0.025 260); /* very subtle gray surface */
  --color-muted-foreground: oklch(0.65 0.015 260); /* secondary text */

  /* Chrome */
  --color-border: oklch(0.27 0.02 260); /* subtle divider */
  --color-border-strong: oklch(0.34 0.025 260); /* emphasis divider */
  --color-input: oklch(0.18 0.015 260); /* input bg */
  --color-ring: oklch(0.65 0.22 260); /* focus ring (più vivido) */

  /* Brand application */
  --color-primary: oklch(0.62 0.19 260);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-primary-hover: oklch(0.66 0.2 260);
  --color-accent: oklch(0.63 0.26 297);
  --color-accent-foreground: oklch(0.99 0 0);
  --color-accent-hover: oklch(0.67 0.27 297);

  /* Semantic */
  --color-success: oklch(0.72 0.2 142); /* green vivid */
  --color-success-foreground: oklch(0.99 0 0);
  --color-warning: oklch(0.8 0.2 80); /* amber vivid */
  --color-warning-foreground: oklch(0.1 0.02 80);
  --color-destructive: oklch(0.65 0.25 25); /* red vivid */
  --color-destructive-foreground: oklch(0.99 0 0);
  --color-info: oklch(0.7 0.18 220); /* cyan-ish info */
  --color-info-foreground: oklch(0.99 0 0);

  /* Glow / shadow brand */
  --shadow-brand-glow: 0 0 60px 8px oklch(0.63 0.26 297 / 0.3); /* purple soft glow */
  --shadow-card: 0 1px 2px oklch(0 0 0 / 0.3);
  --shadow-elevated: 0 8px 24px oklch(0 0 0 / 0.4);
  --shadow-overlay: 0 24px 48px oklch(0 0 0 / 0.5);
}
```

## Light mode (derivato, in pari dignità)

```css
@theme light {
  /* Brand inviolabili (immutate) */
  --brand-primary: oklch(0.62 0.19 260);
  --brand-accent: oklch(0.63 0.26 297);

  /* Surface — invertita luminance, hue conservata */
  --color-background: oklch(0.99 0.003 260); /* off-white cool */
  --color-foreground: oklch(0.18 0.02 260); /* gray-900 freddo */
  --color-surface: oklch(0.97 0.005 260); /* card bg light */
  --color-surface-elevated: oklch(0.94 0.008 260); /* card elevated */
  --color-surface-overlay: oklch(0.99 0.003 260); /* modal */

  --color-muted: oklch(0.96 0.005 260);
  --color-muted-foreground: oklch(0.48 0.02 260);

  --color-border: oklch(0.92 0.01 260);
  --color-border-strong: oklch(0.85 0.015 260);
  --color-input: oklch(0.97 0.005 260);
  --color-ring: oklch(0.62 0.19 260); /* uguale a primary */

  --color-primary: oklch(0.62 0.19 260);
  --color-primary-foreground: oklch(0.99 0 0);
  --color-primary-hover: oklch(0.55 0.2 260); /* più scuro per contrast su light */
  --color-accent: oklch(0.63 0.26 297);
  --color-accent-foreground: oklch(0.99 0 0);
  --color-accent-hover: oklch(0.55 0.27 297);

  --color-success: oklch(0.62 0.18 142);
  --color-success-foreground: oklch(0.99 0 0);
  --color-warning: oklch(0.74 0.18 75);
  --color-warning-foreground: oklch(0.18 0.02 75);
  --color-destructive: oklch(0.55 0.22 25);
  --color-destructive-foreground: oklch(0.99 0 0);
  --color-info: oklch(0.6 0.15 220);
  --color-info-foreground: oklch(0.99 0 0);

  --shadow-brand-glow: 0 0 40px 4px oklch(0.63 0.26 297 / 0.18);
  --shadow-card: 0 1px 2px oklch(0 0 0 / 0.06);
  --shadow-elevated: 0 4px 16px oklch(0 0 0 / 0.1);
  --shadow-overlay: 0 16px 32px oklch(0 0 0 / 0.16);
}
```

## Gradient brand (CTA pattern)

Gradient lineare blue → purple, allinea ai colori del logo. Usato per:

- Button primary CTA ("Inizia Ora", "Inizia Oggi", "Salva")
- Hero accent strip
- Loading bar / progress indicators
- Selected nav item underline

```css
.bg-brand-gradient {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%);
}

.text-brand-gradient {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

Nota: il gradient è SOLO per CTA e text accent puntuale. NON per backgrounds di sezioni intere.

## Glow effect (signature element)

Effetto identitario osservato sotto il wordmark hero:

```css
.brand-glow {
  filter: drop-shadow(0 0 60px oklch(0.63 0.26 297 / 0.4));
}

.brand-glow-soft {
  filter: drop-shadow(0 0 40px oklch(0.63 0.26 297 / 0.2));
}
```

Uso: hero wordmark, KPI numbers in evidenza, capability node hover, primary CTA on hover.

## Capability dimension colors (per data viz)

Le 5 dimensioni capability hanno colori dedicati nel Knowledge Graph viz:

| Dimensione  | Token               | OKLCH                  | Note                              |
| ----------- | ------------------- | ---------------------- | --------------------------------- |
| Process     | `--cap-process`     | `oklch(0.62 0.19 260)` | Brand primary blue                |
| Structure   | `--cap-structure`   | `oklch(0.70 0.18 220)` | Cyan info                         |
| Role        | `--cap-role`        | `oklch(0.63 0.26 297)` | Brand accent purple               |
| Competence  | `--cap-competence`  | `oklch(0.72 0.20 142)` | Success green (skill = positive)  |
| Performance | `--cap-performance` | `oklch(0.80 0.20 80)`  | Warning amber (perf = misurabile) |

Coerente con anche il claim "5 dimensioni in un grafo" — ogni dimensione ha il suo "colore semantico" riconoscibile.

## Contrast verifica WCAG 2.1 AA

| Coppia (dark mode)                 | Ratio  | Status |
| ---------------------------------- | ------ | ------ |
| `foreground` on `background`       | ~17:1  | ✅ AAA |
| `foreground` on `surface`          | ~14:1  | ✅ AAA |
| `muted-foreground` on `background` | ~6.5:1 | ✅ AA  |
| `primary` on `background`          | ~6:1   | ✅ AA  |
| `primary-foreground` on `primary`  | ~9:1   | ✅ AAA |
| `accent` on `background`           | ~6.5:1 | ✅ AA  |

| Coppia (light mode)                | Ratio  | Status |
| ---------------------------------- | ------ | ------ |
| `foreground` on `background`       | ~16:1  | ✅ AAA |
| `muted-foreground` on `background` | ~5.5:1 | ✅ AA  |
| `primary` on `background`          | ~4.7:1 | ✅ AA  |
| `primary-hover` on `background`    | ~6.2:1 | ✅ AA  |

## Anti-pattern (rinforzo)

- ❌ Mai usare il purple come primary diffuso — è solo accent puntuale
- ❌ Mai gradient su sezioni intere (solo CTA + text accent)
- ❌ Mai background con saturation alta (resta near-neutral cool)
- ❌ Mai introdurre 3° brand color
- ❌ Mai usare colori "warm" (orange/red/yellow) come accent — solo come semantic

## Integration path verso `tokens.css` (Phase 11)

Quando promosso a v1.0, questo file diventa la base per aggiornare `packages/ui/src/styles/tokens.css`:

1. Sostituire `--color-primary` con OKLCH allineato wordmark
2. Aggiungere `--color-accent` purple
3. Aggiungere `--cap-*` token capability dimensions
4. Aggiungere `--shadow-brand-glow`
5. Verificare dark mode esistente non rompa

Vedi anche `08-promotion/v1.0-checklist.md` (da scrivere) per workflow promozione.

## Cross-reference

- Logo: `03-visual-identity/logo/final/heuresys-wordmark.svg`
- Direction: `02-aesthetic/direction-final.md`
- Capture sito legacy: `02-aesthetic/heuresys-com-current-style.md`
- Tokens existing: `packages/ui/src/styles/tokens.css`
