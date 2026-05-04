# `.ux-design/` — Session Resume Protocol

> **Scopo**: protocollo per riprendere il workstream brand identity in una sessione fresca. Quando l'utente dice "lavoriamo sul brand" / "riprendiamo il design" / "continuiamo con la ux" / accenna a logo/palette/typography/dashboard, **segui questo file dall'inizio alla fine prima di rispondere**.

## Quick start (3 modi alternativi per attivare)

| Modo                 | Come                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slash command**    | L'utente digita `/brand` → Claude esegue `.claude/commands/brand.md`                                                                                                                         |
| **Skill invocation** | Claude invoca `Skill brand-resume` (auto-trigger su keyword)                                                                                                                                 |
| **Auto-detection**   | claude-mem `MEMORY.md` ha entry `feedback_brand_workstream.md` in cima → auto-loaded → trigger detection automatico su keyword "brand"/"ux"/"logo"/"palette"/"tipografia"/"dashboard design" |

## Trigger di attivazione

Attiva questo protocollo se l'utente:

- Dice esplicitamente: "brand", "brand identity", "ux-design", "logo", "palette", "tipografia", "dashboard design", "lavoriamo sul brand"
- Riferisce file dentro `.ux-design/`
- Chiede continuità dopo `/handoff` precedente che menziona brand workstream
- Chiede mockup, design exploration, theme variants

## Protocollo (8 step ordinati)

### Step 1 — Leggi BRAND-STATE.md (obbligatorio)

```
Read D:\evo.heuresys.com\.ux-design\BRAND-STATE.md
```

Contiene: phase corrente, decisioni stabilite, decisioni pending, asset prodotti, prossimi step proposti.

### Step 2 — Leggi DECISIONS-LOG.md per cronologia

```
Read D:\evo.heuresys.com\.ux-design\DECISIONS-LOG.md
```

Contiene: log cronologico append-only di ogni decisione presa, con data e contesto.

### Step 3 — Verifica gli asset prodotti

```
Glob: .ux-design/**/*.{md,html,svg,json,css}
```

Confronta con quanto dichiarato in `BRAND-STATE.md` § Asset inventory. Se diverge, aggiorna `BRAND-STATE.md`.

### Step 4 — Avvia HTTP server local (solo se servono mockup live)

```bash
cd .ux-design && python -m http.server 8765 --bind 127.0.0.1
```

Esegui in `run_in_background: true` con `Bash` tool. Verifica con `curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:8765/02-aesthetic/direction-explorations/index.html` → atteso `HTTP 200`.

Server NON serve se la sessione è solo testuale/strategica. Avvialo solo quando devi mostrare mockup HTML in browser via `mcp__claude-in-chrome__*`.

### Step 5 — Carica skills rilevanti

Invoca via `Skill` tool (loading non-distruttivo, ti posiziona):

- `superpowers:brainstorming` — sempre, per process discipline
- `frontend-design:frontend-design` — per design framework Anthropic (purpose, audience, aesthetic direction)
- `frontend-design-pro:design` — wizard interattivo se servono moodboard/palette/font

### Step 6 — Loada tools deferred (solo quando servono)

Via `ToolSearch` quando arriva la necessità:

- `TaskCreate` / `TaskUpdate` / `TaskList` — tracking phase corrente (vedi `BRAND-STATE.md` § Phase tracking)
- `AskUserQuestion` — per scelte visive A/B
- `WebFetch` / `WebSearch` — per analisi sito legacy `www.heuresys.com` o trend research
- `mcp__claude-in-chrome__tabs_context_mcp` + `tabs_create_mcp` + `navigate` + `computer` (screenshot) + `browser_batch` — per Chrome companion visivo

### Step 7 — Saluta Enzo con stato chiaro

Format messaggio di saluto (max 5 righe):

```
Workstream brand identity ripreso.

Phase corrente: <da BRAND-STATE.md § Current phase>
Decisioni stabilite: <max 3 elementi chiave>
Decisioni pending: <max 3 elementi blocking>

Da dove riprendiamo?
```

### Step 8 — Aspetta direzione esplicita prima di toccare file

Eccezione: se l'utente apre con istruzione self-contained ("aggiungi una 9° direzione...", "fammi vedere ζ in light mode...", etc.), procedi direttamente.

## Cosa NON fare al resume

- ❌ Non riproporre direzioni già scartate (vedi `DECISIONS-LOG.md` § Scartate)
- ❌ Non ricostruire il piano da zero (è già in `C:\Users\enzospenuso\.claude\plans\usa-superpowers-e-tutti-delegated-orbit.md`)
- ❌ Non duplicare mockup esistenti (vedi inventory in `BRAND-STATE.md`)
- ❌ Non chiedere "che brand identity vuoi?" — è già definita nelle phase 1-3
- ❌ Non over-engineer: se Enzo segnala over-engineering, stop e semplifica (vedi Operating Baseline)

## Aggiornamento del protocollo stesso

Questo file (`SESSION-RESUME.md`) va aggiornato **solo** quando:

1. Cambia la struttura di `.ux-design/`
2. Cambiano gli skill/tool necessari
3. Cambia il workflow di resume (rare)

Non aggiornare a ogni decisione di brand — quelle vanno in `DECISIONS-LOG.md` + `BRAND-STATE.md`.

## Cross-reference

- **Stato corrente**: `BRAND-STATE.md`
- **Cronologia decisioni**: `DECISIONS-LOG.md`
- **Inventario file**: `.ux-design/README.md` § Struttura
- **Piano originale**: `C:\Users\enzospenuso\.claude\plans\usa-superpowers-e-tutti-delegated-orbit.md`
- **Operating baseline**: `docs/_meta/operating-baseline.md` (regole comportamentali generali)
- **Project CLAUDE.md**: `D:\evo.heuresys.com\CLAUDE.md` § Brand workstream
- **Handoff state**: `.handoff/STATE.md` § Active workstream
