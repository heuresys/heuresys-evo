---
name: brand-resume
description: Use when user says "lavoriamo sul brand", "riprendiamo il design", "continuiamo con la ux", "aggiungiamo una direzione", references files in .ux-design/, or otherwise indicates intent to resume the brand identity workstream. This skill loads the cross-session continuity protocol from .ux-design/SESSION-RESUME.md, BRAND-STATE.md, DECISIONS-LOG.md, sets up the local HTTP server for mockups, loads relevant skills (brainstorming, frontend-design), and greets the user with current phase + established decisions + pending decisions.
---

# brand-resume — Cross-session resume per workstream brand identity Heuresys

Questo skill istituisce il protocollo di ripresa del workstream brand identity quando l'utente apre una sessione fresca e accenna al brand.

## Quando attivarlo

Trigger esplicito: l'utente dice una di queste frasi (o equivalenti):

- "lavoriamo sul brand"
- "riprendiamo il design"
- "continuiamo con la ux"
- "aggiungiamo una direzione"
- "fammi vedere ζ" (o qualsiasi direzione α-θ)
- "mostrami i mockup"

Trigger implicito:

- L'utente apre/edita un file dentro `.ux-design/`
- L'utente fa riferimento a "logo", "palette", "tipografia", "dashboard design", "motion language"
- Esiste un riferimento al workstream in `.handoff/STATE.md` § Active workstream

## Cosa fa il skill

Esegue il protocollo 8-step documentato in [`.ux-design/SESSION-RESUME.md`](../../../.ux-design/SESSION-RESUME.md):

### Step 1 — Lettura obbligatoria dei 3 SoT

```
Read D:\evo.heuresys.com\.ux-design\SESSION-RESUME.md
Read D:\evo.heuresys.com\.ux-design\BRAND-STATE.md
Read D:\evo.heuresys.com\.ux-design\DECISIONS-LOG.md
```

Questi 3 file contengono:

- **SESSION-RESUME.md**: il protocollo procedurale completo (questo file lo richiama)
- **BRAND-STATE.md**: stato corrente consolidato (phase, decisioni stabilite/pending, asset inventory, setup tecnico, URL chiave per Chrome companion, next actions proposte)
- **DECISIONS-LOG.md**: cronologia append-only L1-L13+ delle decisioni con superseduture esplicite e decisioni scartate (NON riproporre)

### Step 2 — Verifica asset

```
Glob: .ux-design/**/*.{md,html,svg,json,css}
```

Confronta con `BRAND-STATE.md` § Asset inventory. Discrepanze → update `BRAND-STATE.md`.

### Step 3 — HTTP server (se servirà mockup live)

```bash
cd .ux-design && python -m http.server 8765 --bind 127.0.0.1
```

Esegui in background. Verifica HTTP 200 su `http://127.0.0.1:8765/02-aesthetic/direction-explorations/index.html`.

### Step 4 — Invoca skill rilevanti

```
Skill superpowers:brainstorming
Skill frontend-design:frontend-design
```

### Step 5 — Loada tools deferred via ToolSearch alla bisogna

Per task tracking:

```
ToolSearch select:TaskCreate,TaskUpdate,TaskList
```

Per scelte visuali:

```
ToolSearch select:AskUserQuestion
```

Per Chrome companion:

```
ToolSearch select:mcp__claude-in-chrome__tabs_context_mcp,tabs_create_mcp,navigate,computer,browser_batch,read_page,get_page_text
```

Per ricerca web:

```
ToolSearch select:WebSearch,WebFetch
```

### Step 6 — Saluta con stato chiaro

Format messaggio max 5 righe + tabella decisioni:

```
Workstream brand identity ripreso.

Phase corrente: <da BRAND-STATE.md § Current phase>
Decisioni stabilite: <max 3 chiave>
Decisioni pending: <max 3 blocking>

Da dove riprendiamo?
```

### Step 7 — Aspetta direzione esplicita

Eccezione: istruzione self-contained → procedi direttamente.

## Cosa NON fare

| ❌ NON fare                                                                                                                                   | ✅ Fare invece                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Riproporre direzioni già scartate (Pairing A, C, B2 Manrope, B3 DM Sans, "Editorial Cinematic Ontologico" sciolto, logo "definitivo" sciolto) | Consultare `DECISIONS-LOG.md` § Decisioni scartate                         |
| Ricostruire il piano da zero                                                                                                                  | Riferirsi a `~/.claude/plans/usa-superpowers-e-tutti-delegated-orbit.md`   |
| Duplicare mockup esistenti                                                                                                                    | Consultare `BRAND-STATE.md` § Asset inventory                              |
| Chiedere "che brand identity vuoi?"                                                                                                           | Phase 1-3 già stabilite (mission, voice, personas, dashboard architecture) |
| Over-engineer                                                                                                                                 | Se "stai over-engineering" → stop, semplificare                            |

## Comando complementare

L'utente può anche digitare `/brand` per attivare lo stesso protocollo via slash command. Vedi `.claude/commands/brand.md`.

## Riferimenti

- Protocollo procedurale completo: `.ux-design/SESSION-RESUME.md`
- Stato consolidato: `.ux-design/BRAND-STATE.md`
- Cronologia decisioni: `.ux-design/DECISIONS-LOG.md`
- Slash command: `.claude/commands/brand.md`
- Project CLAUDE.md: `CLAUDE.md` § Brand workstream
- Handoff state: `.handoff/STATE.md` § Active workstream
- Auto-memory: `~/.claude/projects/D--evo-heuresys-com/memory/feedback_brand_workstream.md`
