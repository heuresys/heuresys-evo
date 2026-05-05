---
description: Ripristina produzione da un backup pre-promote (rollback con nuovo commit revert)
argument-hint: '<route> <backup-TS> (es. dashboard 2026-05-05-2030-pre-promote)'
---

# /studio:restore <route> <backup-TS> — Rollback da backup

Esegui ESATTAMENTE questo protocollo.

## Step 1 — Validazione argomenti

Argomenti obbligatori: `<route>` + `<backup-TS>`. Il `<backup-TS>` può essere fornito con o senza suffisso `-pre-promote` — lo script normalizza.

Se `$ARGUMENTS` non contiene almeno 2 token: STOP. Errore `RESTORE_E401`.

## Step 2 — Verifica backup esista e MANIFEST sia valido

Prima del dry-run, verifica:

```bash
ls .ux-design/.backups/$1/$2-pre-promote/MANIFEST.json 2>/dev/null
```

Se manca → STOP con `RESTORE_E402` o `RESTORE_E403`. Suggerisci `/studio:backup-list <route>` per vedere TS validi.

## Step 3 — Gate D: Verification before completion (obbligatorio)

Invoca:

```
Skill superpowers:verification-before-completion
```

Self-Integrity Check 5/5 prima di rollback. Se ANY "no" → BLOCCA.

## Step 4 — Esegui DRY-RUN

```bash
bash .claude/skills/studio/scripts/restore.sh --dry-run "<route>" "<backup-TS>"
```

Lo script mostra:

- Backup source path
- Backup creation timestamp + author
- Pre-promote commit SHA + post-promote commit SHA (entrambi del MANIFEST originale)
- Numero file da ripristinare
- Drift produzione vs MANIFEST.files (warning solo, non bloccante per restore)
- Reason originale del promote (motivazione di partenza)
- Commit message preview

## Step 5 — Conferma esplicita utente

Mostra preview dry-run all'utente. Chiedi conferma testuale ("yes" / "y" / "procedi") per procedere.

Se utente risponde NO o ambiguo → STOP. Niente side-effect.

Se drift `>0` → spiega all'utente che alcuni file produzione differiscono dal MANIFEST (potrebbero essere modifiche post-backup): chiedi se proseguire comunque (sovrascriverà quei file).

## Step 6 — Esegui CONFIRMED

```bash
bash .claude/skills/studio/scripts/restore.sh --confirmed "<route>" "<backup-TS>"
```

Lo script:

1. Verifica repo clean su path target (else `RESTORE_E405`)
2. Sostituisce produzione con file backup (esclusi `MANIFEST.json`)
3. `git add <prod-path>` + `git commit` (husky run, NO `--no-verify`)
4. **NO push** (push è opt-in separato)

Commit message: `revert(app): restore <route> from backup <TS>`. NUOVO commit, NON modifica history (mai `--amend`).

## Step 7 — Output al user

Dopo successo:

- Pre-restore commit SHA
- Post-restore commit SHA
- Conferma backup intatto (immutabilità)
- Suggerimento push (`git push origin <branch>`) — esplicito, mai automatico

## Cosa NON fare

- NON cancellare il backup dopo restore: il backup resta immutabile (audit trail)
- NON usare `git revert <commit>` esternamente: lo script gestisce il revert con commit nuovo dal contenuto backup
- NON modificare manualmente `MANIFEST.json` del backup utilizzato
- NON chiedere conferma multipla: 1 dry-run + 1 confirm sono sufficienti
- NON saltare gate D verification: è obbligatorio per safety

## Riferimenti

- Script: `.claude/skills/studio/scripts/restore.sh`
- MANIFEST schema: `.claude/skills/studio/references/manifest-schema.md`
- Promote flow (recovery scenari): `.claude/skills/studio/references/promote-flow.md`
- Errori: `.claude/skills/studio/references/error-catalog.md` § `/studio:restore`
- Skill principale: `.claude/skills/studio/SKILL.md`
