---
description: Diff fra staging e produzione per una route data (default TS = ultimo)
argument-hint: '<route> [<TS>]'
---

# /studio:diff — Diff staging vs produzione

Esegui ESATTAMENTE questo protocollo.

## Step 1 — Validazione argomenti

Se `$ARGUMENTS` è vuoto o non contiene almeno la route: STOP. Chiedi all'utente la route da confrontare.

Parsing argomenti:

- Primo token = `<route>` (obbligatorio)
- Secondo token = `<TS>` (opzionale, default = ultimo TS disponibile per la route)

## Step 2 — Esegui diff-staging.sh

```bash
bash .claude/skills/studio/scripts/diff-staging.sh $ARGUMENTS
```

Lo script:

- Risolve path produzione (con discovery route group se necessario)
- Risolve TS: se mancante → ultimo per mtime
- Esclude `README.md`, `.source-hashes.json`, `.external-deps.txt` dal confronto (metadata staging, non parte del diff)
- Esegue `git diff --no-index --stat` + per-file diff

## Step 3 — Output al user

Lo script restituisce:

- Header: `Diff: <prod-path> vs <staging-path>`
- Sezione `[Stat]`: summary count linee +/- per file
- Sezione `[Per-file diff]`: diff completo
- Footer: `✓ DIFF_E205` se diff vuoto, oppure suggerimento `/studio:promote` se diff non vuoto

## Step 4 — Aspetta direzione

L'utente può:

- Iterare ulteriormente in staging (modifica file)
- Lanciare di nuovo `/studio:diff` per riconfermare
- Lanciare `/studio:promote <route> <TS>` quando soddisfatto
- Lanciare `/studio:status` per vista consolidata

## Cosa NON fare

- NON proporre modifiche al diff: il sub-command è read-only
- NON spostare la TS di staging "per pulire": ogni staging ha audit trail proprio
- NON committare il `git diff` come patch in produzione: il workflow è clone→manipola→promote, non patch diretto

## Riferimenti

- Script: `.claude/skills/studio/scripts/diff-staging.sh`
- Errori: `.claude/skills/studio/references/error-catalog.md` § `/studio:diff`
- Skill principale: `.claude/skills/studio/SKILL.md`
