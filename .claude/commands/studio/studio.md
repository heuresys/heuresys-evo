---
description: Entry interattivo per workflow clone/promote/backup di route Next.js. Mostra staging attivi + ultimi backup + menu next action.
---

# /studio — Entry interattivo studio workstream

Esegui ESATTAMENTE questo protocollo prima di rispondere all'utente.

## Step 1 — Enumera staging attivi

```bash
ls -la .ux-design/10-staging/ 2>/dev/null
find .ux-design/10-staging/ -mindepth 2 -maxdepth 4 -type d -name '20*-*-*-*' 2>/dev/null | sort
```

Se cartella `.ux-design/10-staging/` non esiste o è vuota → segnala "nessuno staging attivo".

## Step 2 — Enumera ultimi backup per route

```bash
ls -la .ux-design/.backups/ 2>/dev/null
find .ux-design/.backups/ -mindepth 2 -maxdepth 4 -type d -name '*-pre-promote' 2>/dev/null | sort -r | head -20
```

Se cartella `.ux-design/.backups/` non esiste o è vuota → segnala "nessun backup esistente".

## Step 3 — Enumera route di produzione disponibili

```bash
find services/app/src/app -mindepth 1 -maxdepth 3 -name 'page.tsx' -type f 2>/dev/null
```

Output: lista route candidate per clone (ogni `page.tsx` rappresenta una route).

## Step 4 — Presenta stato e menu

Format messaggio:

```
Studio workstream — stato attuale

Route produzione disponibili: <count>
Staging attivi: <count> (mostra ultimi 5 con timestamp)
Backup disponibili: <count> (mostra ultimi 5 con timestamp)

Cosa fare?

  1. /studio:clone <route>            — crea nuova staging
  2. /studio:diff <route> [<TS>]      — diff staging vs produzione
  3. /studio:promote <route> <TS>     — promuove staging in produzione (con backup)
  4. /studio:restore <route> <bkp-TS> — ripristina da backup
  5. /studio:backup-list [<route>]    — lista backup
  6. /studio:status                   — tabella consolidata stato
```

## Step 5 — Aspetta direzione esplicita

Non procedere a clone/diff/promote senza richiesta esplicita dell'utente.

Eccezione: se l'utente apre con istruzione self-contained (es. "/studio:clone dashboard"), procedi direttamente al sub-command.

## Cosa NON fare

- NON modificare nulla in questa fase: solo lettura filesystem
- NON inferire la route che l'utente vuole clonare: chiedere se ambiguo
- NON saltare lo step 1-2: l'utente deve vedere staging attivi prima di crearne nuovi (evita doppio clone)
- NON proporre clone su route che già hanno staging attivo recente — segnala "esiste già staging del \<TS\>: continui lì o ne crei uno nuovo?"

## Riferimenti

- Skill principale: [`.claude/skills/studio/SKILL.md`](../../skills/studio/SKILL.md)
- Sub-commands: `.claude/commands/studio/{clone,diff,promote,restore,backup-list,status}.md`
- Edge case: `.claude/skills/studio/references/route-mapping.md`
- Errori: `.claude/skills/studio/references/error-catalog.md`
