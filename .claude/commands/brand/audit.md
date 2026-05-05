---
description: Senior product designer audit on a live URL with scores, top issues, and prioritized punch list
argument-hint: '<url> [optional: focus category]'
---

# /brand:audit

Esegui audit di design su URL live secondo rubric senior product-designer. Source: `.ux-design/99-samples/rohitg00-prompts/audit-live-site.md`.

## Input

URL e contesto: $ARGUMENTS

(Se URL vuoto: chiedi all'utente l'URL — non inventarlo.)

## Rubric (audit completo)

Per ognuna delle 7 categorie produci: **Score 0-10 · Top 3 issues con selettore + coordinate · Fix concreto (CSS snippet o copy rewrite) · Priority P0/P1/P2**.

1. **HIERARCHY** — type scale, visual weight, scan path
2. **SPACING** — rhythm, breathing room, alignment, scale discipline
3. **COLOR** — palette coherence, contrast, role clarity
4. **ACCESSIBILITY** — WCAG AA text/background, focus state, target size
5. **AI-SLOP PATTERNS** — Inter overuse, purple gradient, card-grid monotony, fake-3D glass, generic rounded button, emoji-heavy copy
6. **MOTION** — purposeful vs decorative, reduced-motion handling
7. **COPY** — microcopy tone, CTA clarity, error-state voice

## Output

```markdown
# Design Audit — <domain>

## Scores

| Categoria | Score | Verdict |
| --------- | ----- | ------- |
| Hierarchy | x/10  | ...     |
| ...       | ...   | ...     |

## Top Issues

### P0 — <titolo>

- Element: <selector>
- Issue: <evidenza concreta>
- Fix: <CSS snippet o copy rewrite>

[ripeti per ogni P0/P1/P2]

## Punch List (ordered by impact × effort)

1. [P0] ... — <stima tempo>
2. [P0] ... — ...
3. [P1] ... — ...
```

## Vincoli

- **Cita evidenza** (selettore + valore osservato). NO claim verificabili senza prova.
- Se non riesci a verificare un dato (es. computed style senza WebFetch al sorgente), dichiaralo esplicitamente come "non verificato"
- Per audit di `evo.heuresys.com` o `www.heuresys.com` usa anche il riferimento `.ux-design/02-aesthetic/heuresys.DESIGN.md` come baseline atteso e segnala drift

## Pair con altri command

- Punch list → `/brand:anti-slop` per generare fix conformi
- Confronto multi-URL competitivo: ripeti audit e produci comparative matrix
