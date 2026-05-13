---
description: Riprende il workstream brand identity Heuresys (cycle 2 post-S62 reset). Legge SoT cycle 2, verifica canonical, saluta con stato corrente. Archive cycle 1 disponibile su richiesta esplicita.
---

# /brand — Riprendi workstream brand identity (cycle 2)

Esegui ESATTAMENTE questo protocollo prima di rispondere all'utente.

> **Cycle 2 protocol post-S62 reset 2026-05-13** — ADR-0032 charter.

## Step 1 — Leggi SoT cycle 2 (in ordine)

```
Read D:\evo.heuresys.com\.ux-design\BRAND-STATE.md
Read D:\evo.heuresys.com\.ux-design\DECISIONS-LOG-v2.md   (ultime 5 entry)
Read D:\evo.heuresys.com\.ux-design\README.md             (policy segregazione)
```

## Step 2 — Verifica canonical SoT

```
Glob: .ux-design/01-canonical/**/*
```

Se vuoto → cycle 2 in Phase 1 iniziale (nessuna decisione canonical firmata).
Se contiene file → leggili come SoT vincolanti.

## Step 3 — Saluta Enzo con stato chiaro

Format (max 5 righe):

```
Workstream brand identity (cycle 2) ripreso.

Phase corrente: <da BRAND-STATE.md>
Canonical SoT attivi: <count file in 01-canonical/>
Decisioni cycle 2: <count L-NN in DECISIONS-LOG-v2.md>

Da dove riprendiamo?
```

## Step 4 — Aspetta direzione esplicita

Eccezione: istruzione self-contained → procedi direttamente.

## Cosa NON fare

- ❌ NON leggere automaticamente `.ux-design-archive-2026-05-13/` (cycle 1 materia prima, solo su richiesta esplicita)
- ❌ NON riproporre direzioni cycle 1 (α-θ, μ-\*, Set 1-4) come attive — sono archiviate
- ❌ NON avviare http server local automaticamente (opt-in solo se Enzo chiede mockup live)
- ❌ NON autoload skill brainstorming/frontend-design (opt-in alla bisogna)
- ❌ NON chiedere "che brand identity vuoi?" da zero ignorando archive — se utente vuole partire da una direzione cycle 1, consultare archive

## Differenze cycle 2 vs cycle 1

| Aspetto           | Cycle 1 (archived)                             | Cycle 2 (current)                      |
| ----------------- | ---------------------------------------------- | -------------------------------------- |
| Protocol steps    | 8                                              | 4                                      |
| HTTP server local | Default-on background                          | Opt-in                                 |
| Skill autoload    | brainstorming + frontend-design                | Opt-in                                 |
| Tools deferred    | ToolSearch autoload                            | Carica solo se servono                 |
| SoT file          | `DECISIONS-LOG.md` (87 entry)                  | `DECISIONS-LOG-v2.md` (vuoto al reset) |
| Mockup HTML       | `06-mockups/dashboards/` (5 + 2 carry-forward) | `03-mockups/` (vuoto)                  |
| Asset DB          | `09-asset-showcase/` SQLite webapp (346 asset) | Archive only                           |

## Riferimenti

- SoT cycle 2: `.ux-design/BRAND-STATE.md` · `.ux-design/DECISIONS-LOG-v2.md` · `.ux-design/01-canonical/` · `.ux-design/README.md`
- Archive immutabile cycle 1: `.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md`
- Decision migration audit: `.ux-design/04-promotion/decision-migration-audit.md`
- ADR-0032 reset charter: `docs/50-reference/decisions/ADR-0032-brand-design-reset-cycle-2.md`
- Skill: `.claude/skills/brand-resume/SKILL.md`
