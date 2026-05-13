---
description: Rollback istantaneo route da backup pre-promote (commit revert nuovo, NO history rewrite)
argument-hint: <route>
---

# /studio2:rollback <route>

Esegui ESATTAMENTE questo protocollo. `$ARGUMENTS` = route name.

## Step 1 — List backups

```bash
ls -1 .ux-design/.backups/$ARGUMENTS/ | sort -r | head -10
```

Se directory vuota → STOP "nessun backup disponibile per route $ARGUMENTS".

## Step 2 — User selection

Mostra tabella backup disponibili (ts + dimensione + commit hash se in MANIFEST.jsonl). Utente sceglie `<backup-TS>`.

## Step 3 — Confirm

```
Rollback summary:

Route: $ARGUMENTS
Backup target: .ux-design/.backups/$ARGUMENTS/<backup-TS>/
Production attualmente:  <git log -1 services/app/src/app/$ARGUMENTS/>

⚠️ Files in services/app/src/app/$ARGUMENTS/ saranno sostituiti.
Saranno preservati: nuovo commit revert (no history rewrite).

Procedo?
```

Aspetta "yes" / "procedi".

## Step 4 — Restore

```bash
rm -rf services/app/src/app/$ARGUMENTS/*
cp -r .ux-design/.backups/$ARGUMENTS/<backup-TS>/* services/app/src/app/$ARGUMENTS/
```

## Step 5 — Typecheck + commit

```bash
cd services/app && npx tsc --noEmit
```

PASS → commit:

```bash
git add services/app/src/app/$ARGUMENTS/
git commit -m "revert($ARGUMENTS): rollback to backup <backup-TS> [cycle 2]"
```

## Step 6 — Report

```
✅ Rollback completato.

Route: $ARGUMENTS restaurata da backup <backup-TS>.
Commit: <hash> (revert, no history rewrite).
```

NO push automatico.

## Riferimenti

- Skill: `.claude/skills/studio2/SKILL.md`
