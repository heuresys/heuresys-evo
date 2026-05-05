# Heuresys — Motion language

> **SoT** Phase 8 motion specification. Anchor: `mu-architect-legacy.html` (D1) + `heuresys.DESIGN.md` Section 6 Depth & Elevation + anti-slop guardrails.
>
> **Last update**: 2026-05-05 (L24)

## Direttiva di base

**Trustworthy 60% / Courage 40%**. Movimento funzionale, non decorativo. Motion serve a:

1. Confermare un'azione utente (feedback)
2. Indirizzare l'attenzione (focus shift)
3. Mostrare uno stato di sistema (live data, sync)
4. Riempire un'attesa percettiva (skeleton, progressive reveal)

**Mai motion gratuita**. Mai blinking, bouncy, elastic, infinite spinning. Mai > 600ms per UI element.

## Token

| Token             | Value                               | Use case                                     |
| ----------------- | ----------------------------------- | -------------------------------------------- |
| `--ease-out`      | `cubic-bezier(0.16, 1, 0.3, 1)`     | entry, reveal (default UI)                   |
| `--ease-in-out`   | `cubic-bezier(0.45, 0, 0.55, 1)`    | loops soft (breathing, glow pulse)           |
| `--ease-in`       | `cubic-bezier(0.7, 0, 0.84, 0)`     | exit, dismiss                                |
| `--ease-spring`   | `cubic-bezier(0.34, 1.56, 0.64, 1)` | use SPARINGLY (success confirm, achievement) |
| `--dur-instant`   | `100ms`                             | toggle, switch, theme change                 |
| `--dur-fast`      | `150ms`                             | hover, focus state, ripple                   |
| `--dur-standard`  | `300ms`                             | reveal, slide, fade                          |
| `--dur-slow`      | `600ms`                             | hero entrance, loading skeleton complete     |
| `--dur-chart`     | `200ms`                             | chart render, sparkline draw, bar grow       |
| `--dur-loop-glow` | `4s`                                | wordmark glow breathing (very slow)          |

## 5 Pattern canonici

### 1. Wordmark glow breathing

Il wordmark hero (Heuresys) ha un soft purple glow che pulsa molto lentamente (4s loop, ease-in-out). Effetto "alive but calm". Drop-shadow opacity 0.20 → 0.35 → 0.20.
**Vincolo**: NEVER on dashboard chrome wordmark (small size in nav-bar). Only hero/landing surface.

### 2. Gradient transitions (theme switch)

Quando l'utente cambia theme dark↔light, transition smooth di:

- `background` 200ms ease-out
- `color` 200ms ease-out
- `border-color` 200ms ease-out
  **Vincolo**: NO transition su layout/dimensioni. Solo color tokens.

### 3. KG topology node hover

Su Knowledge Graph viz, hover su un nodo:

- Node scale 1 → 1.15 (150ms ease-out)
- Edges connesse: stroke-opacity 0.6 → 1 (150ms)
- Edges non connesse: stroke-opacity 0.6 → 0.15 (150ms)
- Tooltip fade-in (200ms)
  **Vincolo**: NO infinite ring/orbit animation. Static + responsive only.

### 4. KPI sparkline draw

Quando KPI card entra in viewport, sparkline viene "disegnata" da sinistra a destra in 200ms con stroke-dasharray animation. KPI number incrementa da 0 al valore finale (200ms ease-out, count-up).
**Vincolo**: max 200ms (anti-slop). Non rallentare lettura.

### 5. Scroll-triggered reveal

Sezioni dashboard (KPI ring → main panels → footer) entrano con:

- `opacity: 0 → 1`
- `translateY(8px) → translateY(0)`
- Duration 300ms ease-out
- Stagger 60ms per child consecutivo
  **Vincolo**: trigger solo al primo scroll. Una volta rivelato, NON re-animare al re-scroll.

## Pattern ausiliari (uso libero)

| Pattern                 | Spec                                                                              |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Button press**        | scale(1) → scale(0.97) → scale(1), 100ms ease-in-out                              |
| **Card lift**           | hover: `translateY(-2px)` + `border-color: var(--accent)`, 150ms ease-out         |
| **Sidebar collapse**    | `grid-template-columns` transition 200ms ease (già implementato in Phase 9)       |
| **Section h4 collapse** | NO transition al momento (CSS `display: none` snap). Future: `max-height` smooth. |
| **Skeleton loading**    | linear-gradient shimmer, 1.5s linear infinite, opacity 0.3-0.6                    |
| **Toast / banner**      | enter: slideInRight 300ms · exit: fadeOut 200ms                                   |
| **Modal**               | enter: scale(0.96) → scale(1) + opacity, 200ms ease-out                           |

## Anti-pattern bandita

- ❌ Animated status dots (blinking · pulsing · orbit) → **anti-slop reject** (`heuresys.DESIGN.md` Section 7)
- ❌ Spinning loaders su elementi UI > 16px (use skeleton invece)
- ❌ Bouncy/elastic easing su business UI (trustworthy compromise)
- ❌ Animation duration > 600ms per UI elements
- ❌ Auto-playing video / parallax overpowering
- ❌ Particle effects, confetti (eccezione: rare achievement micro-celebration)
- ❌ Re-animate scroll reveal al re-enter viewport (one-time only)

## Browser support & accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Tutti i prototipi rispettano `prefers-reduced-motion: reduce`.

## Prototipi

| #   | File                           | Pattern dimostrato                                       |
| --- | ------------------------------ | -------------------------------------------------------- |
| 01  | `01-wordmark-glow.html`        | Wordmark hero con glow breathing 4s loop                 |
| 02  | `02-gradient-transitions.html` | Theme switch dark↔light smooth · color token transitions |
| 03  | `03-kg-topology-hover.html`    | KG node hover scale + edges focus/blur · tooltip         |
| 04  | `04-sparkline-animate.html`    | KPI sparkline draw 200ms + count-up number               |
| 05  | `05-scroll-reveals.html`       | Sezioni dashboard reveal stagger 60ms on scroll          |

**Hub**: `index.html` con grid 5 prototipi navigabili.

## Implementation guideline (post-Phase 8)

Quando si integrerà motion in `services/app/` (Next.js production):

1. **Token CSS variables**: replicare `--ease-*` e `--dur-*` in `services/app/src/styles/motion.css` o equivalente.
2. **prefers-reduced-motion**: enforcement in `_document.tsx` o root layout.
3. **No client-side libs**: preferire CSS animations + Framer Motion solo se serve orchestrazione (es. AnimatePresence per modal).
4. **No GSAP** (overkill per UI density Heuresys).
5. **No Lottie** ai render dashboard (peso bundle, complicità accessibility).

## Cross-references

- Modello base D1: `02-aesthetic/direction-explorations/mu-architect-legacy.html`
- DESIGN.md Section 6 (Depth & Elevation): `02-aesthetic/heuresys.DESIGN.md`
- Anti-slop: `99-samples/rohitg00-prompts/break-default-aesthetic.md`
- Phase 9 dashboards: `06-mockups/dashboards/` (motion già parzialmente integrato: theme switch, sidebar collapse)
