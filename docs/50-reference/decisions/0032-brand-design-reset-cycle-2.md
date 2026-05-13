# ADR-0032: Brand & Design System Reset — Cycle 2 Bootstrap

**Status**: Accepted
**Date**: 2026-05-13
**Authors**: Enzo Spenuso (sole coder) + Claude Opus 4.7 (executor S62)
**Sprint**: S62
**Supersedes**: ADR-0025 (brand identity sealed v1 promotion), ADR-0026 (Phase 15.A brand-fedele dashboard rendering)

## Context

Dalla S22 alla S61 (10 giorni operativi, 2026-05-04 → 2026-05-13) il workstream brand identity & design system di heuresys-evo ha accumulato **stratificazione cronologica non bonificata** che ha reso quasi impossibile mantenere ordine. Mappatura forensica S62 (Phase 1 exploration via 3 Explore agents paralleli) ha quantificato:

- **87 entry** `DECISIONS-LOG.md` in 10 giorni (L1-L87) — 3 supersedute (L6/L9/L10→L11), 84 attive, di cui ~50% operative/contestuali (non brand decisions reali)
- **32 direzioni aesthetic** Set 1-4 esplorate (α-θ + ι-λ + μ-architect + μ-art-director + μ-pragmatic + μ-synthesis), tutte scartate in L19, ma tutte conservate fisicamente come materia prima
- **1027 file** in `.ux-design/` con SoT parallele non sincronizzate:
  - HTML mockup canonici (`06-mockups/`) ↔ catalog DB SQLite (`09-asset-showcase/` con 346 asset / 138 promoted) ↔ tokens W3C DTCG JSON (`05-theme-variants/`) ↔ theme framework runtime (`02-aesthetic/theme-framework/`) ↔ CSS active hardcoded (`services/app/src/styles/active-theme.css`)
- **Production CSS layer**: 5192 righe su 5 file con **57 variabili duplicate** in 3 file (`palette-core.css` 131 + `palette-variants.css` 1625 + `active-theme.css` 205). Cascata che vince per ordine import — comportamento non deterministico in code review.
- **`/studio:*` skill**: 9 sub-comandi, 6-gate flow (A-E + D.2) + 2 fail-safe (F, G). Gate A "motivazione compilata" e Gate C "anti-slop" criteri vaghi. Dependency su `/brand:anti-slop` esterno non documentato in promote-flow.md.
- **ADR-0023/24/25/26 referenziati ma alcuni file mancanti nel repo** — drift documentazione vs implementazione.

Brand v1.0 promotion **formalmente CHIUSA** (14/14 categorie ✅ in `.ux-design/08-promotion/v1.0-checklist.md`) ma:

- `BRAND-STATE.md` Phase 15.F final state
- v1.0 checklist
- asset DB SQLite (catalog operativo SoT L46/L47)
- production CSS attivo (`active-theme.css` μ-architect-legacy hardcoded)
- 5 mockup HTML canonici

…**non sono allineati tra loro**. Il sistema risulta "fermo" (DECISIONS-LOG-L87 + STATE.md "Nessuno. Sistema fermo.") ma con artefatti residui che mascherano la realtà operativa.

**Forces** che hanno generato la stratificazione:

1. **Append-only DECISIONS-LOG** senza pruning periodico — bias generativo "ogni step diventa decisione"
2. **Esplorazione direzioni multipla** (Set 1, 2, 3, 4) senza commit irreversibile a una sola, ciascuno parzialmente realizzato in HTML
3. **Promotion process velocity** ≠ governance refresh velocity — promote senza retire delle decisioni superate
4. **SoT non-canonical**: 4 SoT parallele per la stessa categoria (mockup HTML vs catalog DB vs tokens JSON vs CSS attivo) senza priority ranking esplicito
5. **Skill `/studio:*` mai ridotta** — accumulazione 9 sub-comandi, 6-gate flow, alcuni mai eseguiti realmente

**Symptom decisivo**: Enzo ha dichiarato esplicitamente che la stratificazione "rende quasi impossibile mettere ordine al progetto" e ha richiesto un reset radicale.

## Decision

**Reset radicale del workstream brand identity & design system**, con conservazione del materiale come archivio immutabile (materia prima per cycle 2, non stato attivo). **6 punti firmati**:

### 1. Archive cycle 1 → immutabile

`.ux-design/` (1027 file, S22→S61 cycle 1) → spostato fisicamente in **`.ux-design-archive-2026-05-13/`** via `git mv` (single rename top-level, history preservation a livello directory). Marker `_ARCHIVED-IMMUTABLE.md` top-level dichiara read-only status.

Skill `brand-resume` e command `/brand` aggiornati: protocol cycle 2 punta a nuovo `.ux-design/` (cycle 2 vuoto). Archive consultabile solo su richiesta esplicita dell'utente.

### 2. Production CSS consolidation → 1 SoT

Collapse di `palette-core.css` + `palette-variants.css` + `active-theme.css` in singolo file canonical `services/app/src/styles/tokens.css`:

- Eliminazione 57 variabili duplicate
- Eliminazione 17 palette runtime switchable (α-θ + μ-\*) — solo **μ-architect-legacy** baseline conservata (palette currently live in produzione)
- `dashboard-brand.css` (3104 LOC scoped `.dashboard-shell`) mantenuto isolato
- `motion.css` mantenuto isolato
- Allineamento a `02-tokens/tokens.json` W3C DTCG canonical (cycle 2)
- Brand-studio route adattata: 1 palette baseline invece di 17 runtime switchable

Reintroduzione palette runtime switching in cycle 2 sarà decisione esplicita firmata in `01-canonical/`.

### 3. Promotion process → `/studio2:*` v2, `/studio:*` frozen DEPRECATED

Nuovo `.claude/skills/studio2/` con 4 sub-comandi essenziali (riduzione da 9):

| Comando                                 | Scopo                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `/studio2`                              | Entry interattivo cycle 2 (canonical SoT attivi, mockup pipeline, ultimo promote) |
| `/studio2:propose <route>`              | Submission proposta modifica con acceptance criteria template                     |
| `/studio2:promote <route> <staging-id>` | 3-gate flow (canonical-derivation + live-data + user-confirm)                     |
| `/studio2:rollback <route>`             | Restore istantaneo a stato pre-promote                                            |

**Gate v2 flow** (3-gate vs 6+2 cycle 1):

- Gate 1: la modifica è derivata da decisione canonical in `.ux-design/01-canonical/`?
- Gate 2: live data only (eredita Gate D.2 cycle 1 — automatic grep no-fixture)
- Gate 3: user confirm esplicito

Vecchio `.claude/skills/studio/SKILL.md` frontmatter `deprecated: true` + notice top-level. Resta funzionante per emergency hotfix di route legacy.

### 4. Decisions log → migrazione selettiva con ri-affermazione esplicita

Vecchio `DECISIONS-LOG.md` cycle 1 (L1-L87) NON ereditato automaticamente. Audit selettivo in `.ux-design/04-promotion/decision-migration-audit.md`:

- Per ciascuna L-NN: outcome `MIGRATE` / `DECAY` / `SUPERSEDED` / `N-A` con motivazione 1-line
- Decisioni MIGRATE → ri-affermate esplicitamente come L1-LN in nuovo `DECISIONS-LOG-v2.md` con citazione predecessore archive
- Decisioni DECAY → non portate avanti (decadono per non-promozione)
- Decisioni SUPERSEDED in cycle 1 → marker storico, irrilevanti
- Decisioni N-A (operative/contestuali) → fuori scope brand workstream

### 5. Esecuzione monolitica S62

Tutto il reset eseguito in singola sessione S62 (sessione long opus 4.7 1M context), in 8 phase sequenziali (Phase 0-8) documentate nel plan canonical `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`. Rollback via `git tag pre-reset-s62` + `git branch backup/pre-reset-s62`.

### 6. Catalog DB `09-asset-showcase` archiviato come tutto il resto

Webapp Express+Prisma+SQLite locale (346 asset, 138 promoted, 11 dashboardCode `*_v2`) finita in `.ux-design-archive-2026-05-13/09-asset-showcase/`. Frozen. Cycle 2 ricomincia da zero anche sull'inventario asset. Consultazione manuale via SQLite browser se servono asset specifici come materia prima.

## Consequences

### Cosa cambia

| Area                                                   | Cambio                                                                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Skill `brand-resume`                                   | Protocol ridotto a 4-step (vs 8-step). HTTP server + skill autoload + tools deferred → opt-in. Path target = `.ux-design/` cycle 2 |
| Command `/brand`                                       | Idem (4-step protocol cycle 2)                                                                                                     |
| `.ux-design/` filesystem                               | Vuoto al reset, scaffold minimo (README + SESSION-RESUME + BRAND-STATE + DECISIONS-LOG-v2 + 4 subdirectory)                        |
| `services/app/src/styles/`                             | 3 file CSS rimossi (palette-core, palette-variants, active-theme) → 1 file `tokens.css` canonical                                  |
| `services/app/src/app/layout.tsx` + `(app)/layout.tsx` | Import CSS riallineati                                                                                                             |
| `services/app/src/app/brand-studio/page.tsx`           | Token editor su 1 palette baseline (vs 17 palette switchable)                                                                      |
| `.claude/skills/studio/`                               | Frontmatter `deprecated: true` + top-level DEPRECATED notice                                                                       |
| `.claude/skills/studio2/`                              | Nuovo (4 sub-comandi, 3-gate flow)                                                                                                 |
| `.claude/commands/studio2/`                            | Nuovo (4 file)                                                                                                                     |
| `CLAUDE.md` root § Brand workstream                    | Rewritten per cycle 2 + reference archive                                                                                          |
| `.handoff/STATE.md`                                    | Closure S62 reset                                                                                                                  |
| `.handoff/BACKLOG.md`                                  | Rimossa entry "Brand v1.0 promotion (~16-25h)" (archiviata)                                                                        |
| `~/.claude/projects/D--evo-heuresys-com/memory/`       | Memory files brand + studio aggiornati cycle 2 paths                                                                               |

### Cosa NON cambia

| Area                                              | Status                                 |
| ------------------------------------------------- | -------------------------------------- |
| `packages/ui/` 96 componenti                      | Invariato                              |
| Schema DB `heuresys_platform`                     | Nessuna migration                      |
| Login route `services/app/src/app/login/page.tsx` | `login-aurora` promosso resta          |
| Dashboard rendering pipeline G6                   | 7 preset `_v2` live invariati          |
| AppShell role-based `(app)/layout.tsx`            | Invariato (solo import CSS aggiornato) |
| Test suite (865 test verdi)                       | Invariata, deve restare verde          |
| Lint suite                                        | Invariata, deve restare exit 0         |
| Operating baseline CARD-5 Debt vs Raccomandazioni | Invariato (cycle-agnostico)            |
| Principi P1-P11                                   | Invariati                              |
| Lexicon canonical 16 sigle + CASCADIA             | Invariati                              |

### Rischi e mitigazioni

- **CSS consolidation regression visiva** (MED prob, HIGH impact) → snapshot Phase 0 + visual diff Chrome MCP + rollback via `pre-reset-s62` tag in <5min
- **17 palette runtime usate in produzione** (LOW prob, MED impact) → grep `data-palette=` cross-codebase pre-Phase 5 verifica zero occorrenze attive
- **Brand-studio route rompe** (MED prob, LOW impact) → adattamento token editor a 1 palette baseline in Phase 5
- **Skill brand-resume cached path** (LOW prob, LOW impact) → patch SESSION-RESUME in Phase 1 prima del move
- **Memory file machine-local divergence** (LOW prob, LOW impact) → fuori scope cross-machine sync

## Migration plan

Eseguito in S62 via plan canonical `~/.claude/plans/c-stata-una-continua-indexed-cocke.md` — 8 phase sequenziali:

1. **Phase 0**: Safety snapshot (tag + branch backup + smoke baseline)
2. **Phase 1**: Archive `.ux-design/` + patch governance references
3. **Phase 2**: ADR-0032 (questo documento)
4. **Phase 3**: Cycle 2 scaffolding (nuovo `.ux-design/` vuoto)
5. **Phase 4**: Audit selettivo L1-L87 → migration scorecard
6. **Phase 5**: Production CSS consolidation (1 SoT `tokens.css`) — **HIGH RISK**
7. **Phase 6**: `/studio2:*` v2 skill + freeze `/studio:*` DEPRECATED
8. **Phase 7**: Governance docs + memory file sync
9. **Phase 8**: Final verification (13 checks) + commit consolidato + push main

## References

### Cycle 1 archive (immutabile)

- `.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md` — top-level marker
- `.ux-design-archive-2026-05-13/DECISIONS-LOG.md` — L1-L87 (3260 LOC)
- `.ux-design-archive-2026-05-13/BRAND-STATE.md` — Phase 15.F final state
- `.ux-design-archive-2026-05-13/08-promotion/v1.0-checklist.md` — 14/14 ✅ chiusa
- `.ux-design-archive-2026-05-13/09-asset-showcase/` — webapp SQLite 346 asset frozen

### Cycle 2 active

- `.ux-design/README.md` — policy segregazione + protocol cycle 2
- `.ux-design/SESSION-RESUME.md` — protocol 4-step
- `.ux-design/BRAND-STATE.md` — Phase 1 cycle 2 (assessment iniziale)
- `.ux-design/DECISIONS-LOG-v2.md` — L1-LN cycle 2 (vuoto al reset, popolato selettivamente Phase 4)
- `.ux-design/01-canonical/` — SoT vincolanti cycle 2 (vuoto al reset)
- `.ux-design/02-tokens/tokens.json` — W3C DTCG canonical (popolato Phase 5)
- `.ux-design/04-promotion/decision-migration-audit.md` — scorecard L1-L87 audit

### Plan & safety

- `~/.claude/plans/c-stata-una-continua-indexed-cocke.md` — plan canonical S62
- Git tag `pre-reset-s62` annotated — rollback safety
- Git branch `backup/pre-reset-s62` — rollback safety alternativo

### Supersedes

- **ADR-0025** brand identity sealed v1 promotion — cycle 1 brand v1.0 promotion archiviata
- **ADR-0026** Phase 15.A brand-fedele dashboard rendering — cycle 1 dashboard pipeline frozen (mantenuta in produzione via G6 `_v2` preset, ma reset del workstream brand che la generava)

### Related

- CARD-5 operating baseline Debt vs Raccomandazioni — il reset è **event**, non genera né Debt né Raccomandazioni. È cambio di SoT canonical formalmente firmato.
- CARD-4 NO MOCK / P11 invariato — preservato in Gate 2 di `/studio2:promote`.
