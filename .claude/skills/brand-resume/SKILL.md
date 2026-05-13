---
name: brand-resume
description: Use when user says "lavoriamo sul brand", "riprendiamo il design", "continuiamo con la ux", references files in .ux-design/, or otherwise indicates intent to resume the brand identity workstream. Cycle 2 protocol post-S62 reset (2026-05-13). Reads `.ux-design/BRAND-STATE.md` + `.ux-design/DECISIONS-LOG-v2.md` (cycle 2, not cycle 1 archive), verifies canonical SoT, greets with current cycle 2 phase.
---

# brand-resume — Cycle 2 brand identity resume protocol

> **Cycle 2 protocol post-S62 reset 2026-05-13** — ADR-0032 charter.
> Cycle 1 archived in `.ux-design-archive-2026-05-13/` (immutable). Lettura solo per audit storico / materia prima.

## Quando attivarlo

Trigger esplicito (italiano o inglese):

- "lavoriamo sul brand"
- "riprendiamo il design"
- "continuiamo con la ux"
- "aggiungiamo una direzione"
- "definiamo il brand"
- "ricominciamo l'identity"

Trigger implicito:

- L'utente apre/edita un file dentro `.ux-design/` (cycle 2)
- L'utente fa riferimento a "logo", "palette", "tipografia", "dashboard design", "motion language"
- Esiste un riferimento al workstream in `.handoff/STATE.md` § Debt attivo

## Cosa fa il skill (4-step protocol cycle 2)

### Step 1 — Lettura SoT cycle 2 (in ordine)

```
Read D:\evo.heuresys.com\.ux-design\BRAND-STATE.md
Read D:\evo.heuresys.com\.ux-design\DECISIONS-LOG-v2.md   (ultime 5 entry sono sufficienti)
Read D:\evo.heuresys.com\.ux-design\README.md             (policy segregazione cycle 2)
```

### Step 2 — Verifica `01-canonical/` SoT

```
Glob: .ux-design/01-canonical/**/*
```

Se vuoto → cycle 2 in Phase 1 (assessment iniziale, nessuna decisione canonical ancora).
Se contiene file → leggi i SoT vincolanti dichiarati.

### Step 3 — Saluta con stato chiaro

Format messaggio (max 5 righe):

```
Workstream brand identity (cycle 2) ripreso.

Phase corrente: <da BRAND-STATE.md>
Canonical SoT attivi: <count file in 01-canonical/>
Decisioni cycle 2: <count L-NN in DECISIONS-LOG-v2.md>

Da dove riprendiamo?
```

### Step 4 — Aspetta direzione esplicita

Eccezione: istruzione self-contained → procedi direttamente.

## Cosa NON fare

| ❌ NON fare                                                          | ✅ Fare invece                                                                                                                                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Leggere automaticamente `.ux-design-archive-2026-05-13/`             | Archive è materia prima per consultazione manuale (solo su richiesta esplicita Enzo)                                                                   |
| Riproporre direzioni cycle 1 (α-θ, μ-\*, ecc.) come decisioni attive | Cycle 2 reinizia da zero. Per migration di una decisione cycle 1 → controllare `.ux-design/04-promotion/decision-migration-audit.md` outcome `MIGRATE` |
| Avviare http server local automaticamente                            | Cycle 2 protocollo è light, no server local default. Avvialo solo se l'utente chiede mockup live                                                       |
| Caricare skill brainstorming/frontend-design automaticamente         | Caricale alla bisogna quando l'utente richiede creative work                                                                                           |
| Chiedere "che brand identity vuoi?" da zero ignorando archive        | Archive è ground truth storica: se utente vuole partire da una direzione cycle 1 → consultare archive su richiesta                                     |

## Cosa è cambiato vs cycle 1 (S62 reset)

- **8-step protocol → 4-step** (semplificato)
- **HTTP server background → removed default** (opt-in solo)
- **Skill autoload (brainstorming + frontend-design) → removed default** (opt-in solo)
- **Tools deferred via ToolSearch → removed default** (carica solo quando servono)
- **Path SoT**: `DECISIONS-LOG.md` → `DECISIONS-LOG-v2.md` (vuoto al reset, popolato selettivamente)
- **Asset showcase webapp** (`09-asset-showcase/`) → archiviata, consultazione manuale via SQLite browser
- **Mockup HTML canonici** cycle 1 → archiviati, ri-promozione richiede ri-affermazione decisione cycle 2

## Comando complementare

`/brand` slash command attiva stesso protocollo. Vedi `.claude/commands/brand.md`.

## Riferimenti

- SoT cycle 2: `.ux-design/BRAND-STATE.md` · `.ux-design/DECISIONS-LOG-v2.md` · `.ux-design/01-canonical/` · `.ux-design/README.md`
- Archive immutabile cycle 1: `.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md`
- Decision migration audit: `.ux-design/04-promotion/decision-migration-audit.md`
- ADR-0032 reset charter: `docs/50-reference/decisions/ADR-0032-brand-design-reset-cycle-2.md`
- Project CLAUDE.md: `CLAUDE.md` § Brand workstream
- Handoff state: `.handoff/STATE.md`
