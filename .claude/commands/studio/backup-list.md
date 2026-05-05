---
description: Lista backup disponibili filtrata per route opzionale
argument-hint: '[<route>]'
---

# /studio:backup-list — Lista backup

Esegui ESATTAMENTE questo protocollo.

## Step 1 — Esegui list-backups.sh

```bash
bash .claude/skills/studio/scripts/list-backups.sh $ARGUMENTS
```

Comportamento:

- Se `$ARGUMENTS` vuoto → lista TUTTI i backup, ordinati per TS decrescente
- Se `$ARGUMENTS` contiene una route → filtra solo quei backup

## Step 2 — Output al user

Tabella con colonne:

| Colonna   | Significato                                                  | Source                                              |
| --------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Route     | Nome route                                                   | path della cartella backup                          |
| Backup-TS | Timestamp del backup (formato `YYYY-MM-DD-HHMM-pre-promote`) | nome cartella                                       |
| Author    | Nome autore                                                  | `MANIFEST.json` § `author.name` (truncated 13 char) |
| Reason    | Motivazione promozione                                       | `MANIFEST.json` § `reason` (truncated 60 char)      |

Footer: `Totale: N backup`.

## Step 3 — Aspetta direzione

L'utente può:

- Inspezionare un backup specifico: `cat .ux-design/.backups/<route>/<TS>-pre-promote/MANIFEST.json`
- Lanciare `/studio:restore <route> <TS>-pre-promote` per rollback
- Lanciare `/studio:status` per vista consolidata
- Lanciare `/studio:diff <route>` per confronto con staging corrente

## Cosa NON fare

- NON cancellare backup: sono immutabili per design (audit trail)
- NON modificare MANIFEST.json di backup esistenti
- NON proporre auto-pruning di backup vecchi: la decisione di archiviazione è dell'utente (eventuale futuro `/studio:archive` con retention policy)

## Riferimenti

- Script: `.claude/skills/studio/scripts/list-backups.sh`
- Errori: `.claude/skills/studio/references/error-catalog.md` § `/studio:backup-list`
- Skill principale: `.claude/skills/studio/SKILL.md`
