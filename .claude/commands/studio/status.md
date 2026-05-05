---
description: Tabella consolidata stato studio workstream — staging attivi, backup disponibili, drift produzione
---

# /studio:status — Stato consolidato

Esegui ESATTAMENTE questo protocollo.

## Step 1 — Esegui status.sh

```bash
bash .claude/skills/studio/scripts/status.sh
```

Lo script produce 3 sezioni:

1. **Staging attivi** — Route, TS, Status (draft / ready-for-audit / ready-for-promote / promoted / abandoned)
2. **Backup disponibili (ultimi 10)** — Route, Backup-TS, Reason (truncated 50 char)
3. **Drift produzione vs ultimo backup** — Per ogni route con backup: ✓ in sync oppure ⚠ N file diff

## Step 2 — Interpretazione output

| Pattern                                    | Significato                                    | Azione                                                  |
| ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------- |
| `Staging count = 0 + Backup count = 0`     | Workspace vergine                              | Suggerisci `/studio:clone <route>` per iniziare         |
| `Staging > 1 settimana fa + status: draft` | Staging stale                                  | Suggerisci pulizia o continuare/abbandonare             |
| `Drift status: ⚠ N file diff`              | Produzione modificata fuori da workflow studio | Indaga: chi/quando, eventualmente nuovo backup baseline |
| `MANIFEST mancante`                        | Backup compromesso                             | Restore non sicuro — segnala                            |

## Step 3 — Aspetta direzione

L'utente può:

- Lanciare `/studio:clone <route>` per nuova staging
- Lanciare `/studio:diff <route>` per ispezionare staging specifica
- Lanciare `/studio:backup-list <route>` per dettaglio backup di una route
- Lanciare `/studio:restore <route> <bkp-TS>` se drift è non desiderato

## Cosa NON fare

- NON modificare nulla: il sub-command è puramente diagnostico
- NON proporre rollback automatico su drift: drift può essere intenzionale (cambio out-of-band autorizzato)

## Riferimenti

- Script: `.claude/skills/studio/scripts/status.sh`
- Errori: `.claude/skills/studio/references/error-catalog.md` § `/studio:status`
- Skill principale: `.claude/skills/studio/SKILL.md`
