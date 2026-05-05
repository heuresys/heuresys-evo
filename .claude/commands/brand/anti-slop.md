---
description: Anti-slop fingerprint guardrails for Claude Design output (Heuresys-tuned)
argument-hint: '[optional: target surface — landing page, dashboard, marketing, etc.]'
---

# /brand:anti-slop

Carica il sistema di guardrail "break-default-aesthetic" come prompt di sessione, prima di qualsiasi generazione UI. Source: `.ux-design/99-samples/rohitg00-prompts/break-default-aesthetic.md`.

## Quando usarlo

- Prima messaggio in nuovo task di generazione UI
- Top di ogni DESIGN.md handover a Claude Design / Claude Code
- Prima di accettare un mockup AI-generated come baseline

## Rejections esplicite (Heuresys-flavored)

1. **ACCENT COLOR** — solo `--accent` da `02-aesthetic/heuresys.DESIGN.md`. NO teal default. NO secondo accent per varietà.
2. **STATUS INDICATORS** — niente animated dots, blinking lights, "live" badges, pulsing orbs. Status = static glyph + testo.
3. **CONTAINER NESTING** — max depth 2. NO card-on-card. Separazione via border o tonal shift, non wrapper.
4. **TYPOGRAPHY** — niente Inter/Roboto/Arial come primary face. Heuresys: Exo 2 wordmark + Inter UI + JetBrains Mono dati. NO serif headline + sans body se non specificato in DESIGN.md.
5. **LAYOUT CLICHES** — NO 3-column feature grid hero/section 2. NO identical-aspect card grid per dati eterogenei. NO "Get Started" / "Learn More" CTA pair default.
6. **DECORATIVE LEFT RULES** — 4px left-rule riservato a UN ruolo semantico (severity/status). MAI decorativo.
7. **ICON FAMILY** — UNA sola family. Heuresys = Phosphor. NO mix.
8. **GENERATIVE IMAGES** — solo colori da DESIGN.md (`--bg`, `--surface`, `--accent`, `--text`). NO purple-pink gradient. NO glass/frosted hero.
9. **MOTION** — purpose-driven (state, hierarchy, spatial). Decorative motion (floating particles, parallax, bobbing icons) richiede richiesta esplicita. Sempre `prefers-reduced-motion`.
10. **COPY** — microcopy product-specific. NO "Welcome to {Product}", NO "Built for teams", NO "Get Started" senza verbo che nomina l'azione.

## Positive bias

- Type choices distintive che servono il voice
- Una direzione estetica forte > "modern minimal" hedged
- Border-based depth > drop shadow
- Editorial rhythm (max-width, vertical breathing) > grid uniforme
- Content-first hero (type, table, demo) > decorative hero
- Surface reali (settings, empty state, edge case) > marketing hero solo

## Verification (post-generation, audita output)

Per ogni voce → PASS o FAIL:

- [ ] Accent = `--accent` Heuresys, non teal
- [ ] Zero animated status dot
- [ ] Container nesting ≤ 2
- [ ] Primary face NON Inter/Roboto/Arial
- [ ] Section 2 non è 3-column feature grid
- [ ] Coloured left-rule = ruolo semantico singolo
- [ ] Hero illustration in palette `heuresys.DESIGN.md`
- [ ] Single icon family (Phosphor)
- [ ] Motion purposeful o assente
- [ ] CTA verb-first product-specific

**Se ANY FAIL → rigenera la regione offending prima di mostrare l'output.**

## Target surface (se fornito)

$ARGUMENTS
