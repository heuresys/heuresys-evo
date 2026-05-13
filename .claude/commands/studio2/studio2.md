---
description: Entry interattivo studio2 cycle 2 — mostra canonical SoT attivi, staging pipeline, ultimi promote
---

# /studio2 — Entry interattivo cycle 2

Esegui ESATTAMENTE questo protocollo:

## Step 1 — Lettura stato cycle 2

```
Glob: .ux-design/01-canonical/**/*
Glob: .ux-design/03-mockups/*/staging-*/
Read .ux-design/BRAND-STATE.md
```

## Step 2 — Status table

Format output:

```
studio2 status (cycle 2)

Canonical SoT attivi: <count file 01-canonical/>
Staging in pipeline: <count subdirectories 03-mockups/*/staging-*/>
Ultimi 3 promote: <ts/route da .ux-design/.backups/, se esistono>

Next actions disponibili:
- /studio2:propose <route> → nuova staging
- /studio2:promote <route> <staging-id> → 3-gate promotion
- /studio2:rollback <route> → restore da backup
```

## Step 3 — Aspetta direzione esplicita

Niente automatic action. L'utente sceglie il prossimo comando.

## Riferimenti

- Skill: `.claude/skills/studio2/SKILL.md`
- ADR-0032: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`
