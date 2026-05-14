# BRAND-STATE — Cycle 2

> Updated: 2026-05-14T03:45Z · post-S62 reset · ADR-0032 charter · Phase 0 investor-ready rebuild shipped

## Current phase

**Phase 0 — Foundations + Design Contract — CLOSED** (S63 = questa sessione autonomous run)

Phase 1 next-up (fix 6 preset `_v2` rotti, ~14-18h, 42 task).

## Canonical SoT attivi

10 file in `01-canonical/` codificano le decisioni cycle 2 vincolanti per l'investor-ready rebuild:

- `trend-research-2026.md` (20 pattern dashboard analytics 2026)
- `inspirations-extracted.md` (7 reference site DESIGN.md)
- `moodboard.md` ("Calm Cockpit Decisionale" — Linear-meets-Stripe-meets-Visier)
- `layout-pattern.md` (10 leggi cockpit + 5 primitives + 40-30-20-10 + DOM anatomy)
- `role-data-matrix.md` (23 route × 8 ruoli + scope semantics)
- `widget-vocabulary.md` (mapping tipologia → widget)
- `i18n-policy.md` (zero hardcoded mix IT/EN)
- `header-footer-anatomy.md` (DOM canonical)
- `anti-patterns.md` (10 categorie banditi cross-route + positive benchmarks)
- `research-artifact-pattern.md` **(L17 — pattern de reference da `icon-libraries-showcase.html` archive, benchmark vivente investor-ready)**

Le decisioni cycle 1 considerate ancora valide vengono migrate selettivamente in cycle 2 con ri-affermazione esplicita (vedi `04-promotion/decision-migration-audit.md`, popolato Phase 4 di S62).

## Decisioni pending

Nessuna pending in senso formale. Direzioni possibili (non vincolanti, da decidere quando l'utente lo richiederà):

- Ridefinizione palette baseline (cycle 1 era μ-architect-legacy)
- Ridefinizione typography stack (cycle 1: Inter + Exo 2 + JetBrains Mono)
- Ridefinizione logo wordmark (cycle 1: HeuresysWordmark 3 varianti)
- Approccio dashboard rendering (cycle 1: G6 preset `_v2` live)

## Asset inventory cycle 2

Vuoto. `01-canonical/`, `02-tokens/`, `03-mockups/` tutti vuoti al reset.

`02-tokens/tokens.json` popolato in Phase 5 S62 con baseline μ-architect-legacy estratta dall'archive (1 palette, no più 17 runtime switchable).

## Reference archive cycle 1

`../.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md` — inventario completo cycle 1 (1027 file, 87 decisioni, 32 direzioni Set 1-4 scartate, 5 mockup canonici, brand book v0, asset DB SQLite 346 entry, 138 promoted).

Disponibile come materia prima per consultazione esplicita.

## Setup tecnico

- Production CSS canonical: `services/app/src/styles/tokens.css` (1 SoT, popolato Phase 5 S62)
- Logo component: `packages/ui/src/components/wordmark.tsx` (cycle 1, invariato — eventuale ri-affermazione cycle 2)
- AppShell `(app)/layout.tsx` invariato — solo import CSS aggiornato in Phase 5

## Workflow cycle 2

- Decision new → entry `DECISIONS-LOG-v2.md` L-NN + se canonical → file `01-canonical/<topic>.md`
- Promotion → `/studio2:promote <route> <staging-id>` (3-gate flow)
- Rollback → `/studio2:rollback <route>`

## Reference

- ADR-0032: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`
- Skill cycle 2: `.claude/skills/brand-resume/SKILL.md`
- Skill promotion cycle 2: `.claude/skills/studio2/SKILL.md` (creata Phase 6 S62)
- Plan S62: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
