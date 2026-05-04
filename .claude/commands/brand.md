---
description: Riprende il workstream brand identity Heuresys. Legge protocollo + state + log decisioni, avvia server local, carica skill, saluta con stato corrente.
---

# /brand — Riprendi workstream brand identity

Esegui ESATTAMENTE questo protocollo prima di rispondere all'utente.

## Step 1 — Leggi i 3 documenti SoT (in ordine, obbligatorio)

```
Read D:\evo.heuresys.com\.ux-design\SESSION-RESUME.md
Read D:\evo.heuresys.com\.ux-design\BRAND-STATE.md
Read D:\evo.heuresys.com\.ux-design\DECISIONS-LOG.md
```

## Step 2 — Verifica gli asset esistenti

```
Glob: .ux-design/**/*.{md,html,svg,json,css}
```

Confronta con `BRAND-STATE.md` § Asset inventory. Se diverge, aggiorna `BRAND-STATE.md`.

## Step 3 — Avvia HTTP server local in background (per mockup live)

Solo se sessione richiederà mockup HTML in browser:

```bash
cd .ux-design && python -m http.server 8765 --bind 127.0.0.1
```

Background mode con `run_in_background: true`. Verifica con `curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:8765/02-aesthetic/direction-explorations/index.html` → atteso `HTTP 200`.

## Step 4 — Invoca skill rilevanti

```
Skill superpowers:brainstorming
Skill frontend-design:frontend-design
```

Opzionale (se serve wizard ricco):

```
Skill frontend-design-pro:design
```

## Step 5 — Loada tools deferred via ToolSearch (alla bisogna)

```
ToolSearch select:TaskCreate,TaskUpdate,TaskList,AskUserQuestion,WebSearch,WebFetch
ToolSearch select:mcp__claude-in-chrome__tabs_context_mcp,tabs_create_mcp,navigate,computer,browser_batch
```

## Step 6 — Saluta Enzo con stato chiaro

Format messaggio (max 5 righe + tabella decisioni):

```
Workstream brand identity ripreso.

Phase corrente: <da BRAND-STATE.md § Current phase>
Decisioni stabilite: <max 3 elementi chiave>
Decisioni pending: <max 3 elementi blocking>

Da dove riprendiamo?
```

## Step 7 — Aspetta direzione esplicita prima di toccare file

Eccezione: se l'utente apre con istruzione self-contained, procedi direttamente.

## Cosa NON fare

- NON riproporre direzioni già scartate (vedi `DECISIONS-LOG.md` § Decisioni scartate)
- NON ricostruire piano da zero (è in `~/.claude/plans/usa-superpowers-e-tutti-delegated-orbit.md`)
- NON duplicare mockup esistenti (vedi `BRAND-STATE.md` § Asset inventory)
- NON chiedere "che brand identity vuoi?" — già definita in phase 1-3
- NON over-engineer: se l'utente segnala "stai over-engineering" → stop e semplifica
