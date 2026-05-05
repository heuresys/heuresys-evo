# Promote flow — 5-gate flow + 2 fail-safe

Documenta il flusso bloccante di `/studio:promote` con 5 gate obbligatori (A-E) e 2 fail-safe esecutivi (F-G).

## Diagramma

```
USER: /studio:promote <route> <TS>
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ GATE A — Motivazione (assolto in /studio:clone via gate A)   │
│ README.md § Motivazione deve essere compilata                │
│ Skill: superpowers:brainstorming                             │
│ Errore: PROMOTE_E310 (warning) se sezione vuota              │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ GATE B — Brand audit                                         │
│ Comando: /brand:audit http://localhost:3000/<route>          │
│ Atteso: score ≥ 7, P0 count = 0                              │
│ Errore: PROMOTE_E304 se P0 > 0 → BLOCCA                      │
│ Override: skip esplicito → MANIFEST contiene warning         │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ GATE C — Anti-slop fingerprint                               │
│ Comando: /brand:anti-slop                                    │
│ Atteso: tutte verification PASS                              │
│ Errore: PROMOTE_E305 se ≥1 FAIL critico → BLOCCA             │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ GATE D — Verification before completion                      │
│ Skill: superpowers:verification-before-completion            │
│ Atteso: Self-Integrity Check 5/5                             │
│ Errore: PROMOTE_E306 se any "no" → BLOCCA                    │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
[Esegui scripts/promote.sh --dry-run]
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ GATE E — User explicit confirm                               │
│ Mostra preview MANIFEST + diff + commit message              │
│ Atteso: user dice esplicitamente "yes"/"procedi"             │
│ Errore: PROMOTE_E307 se NO o ambiguo → ABORT (no side-effect)│
└──────────────────────────────────────────────────────────────┘
  │
  ▼
[Esegui scripts/promote.sh --confirmed]
  │
  ├─→ Crea .ux-design/.backups/<route>/<TS>-pre-promote/
  │     ├─ Copia file produzione
  │     └─ Scrive MANIFEST.json
  │
  ├─→ Overwrite produzione con file staging (esclusi metadata)
  │
  ├─→ git add <prod-path>
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ FAIL-SAFE F — Repo clean check (pre-overwrite)               │
│ Verifica: git diff --quiet su prod-path                      │
│ Errore: PROMOTE_E302 se dirty → ABORT con backup ROLLBACK    │
└──────────────────────────────────────────────────────────────┘
  │
  ├─→ git commit (husky run, NO --no-verify)
  │
  ▼
┌──────────────────────────────────────────────────────────────┐
│ FAIL-SAFE G — Husky pre-commit hook                          │
│ Lint-staged: prettier su .md/.json/.yml/.css                 │
│ Gitleaks-lite: secret scan                                   │
│ Commitlint: subject ≤70 char + type/scope conforme           │
│ Errore: PROMOTE_E308 se hook fail → ABORT con istruzioni:    │
│   • backup intatto                                           │
│   • produzione overwritten ma NON committata                 │
│   • risolvere violazioni e committare manualmente, oppure    │
│   • /studio:restore per rollback istantaneo                  │
└──────────────────────────────────────────────────────────────┘
  │
  ▼
[Update MANIFEST.json con post_promote_commit SHA]
  │
  ▼
[NO push — push è opt-in esplicito separato]
  │
  ▼
✓ Promote complete
```

## Tabella riassuntiva gate

| Gate          | Scope        | Skill/Comando                                  | Esito atteso                    | Errore se fail                            | Bypass possibile?                    |
| ------------- | ------------ | ---------------------------------------------- | ------------------------------- | ----------------------------------------- | ------------------------------------ |
| A             | Motivazione  | `superpowers:brainstorming` (in /studio:clone) | README § Motivazione compilata  | `PROMOTE_E310` (warning)                  | Sì (warning, non blocca)             |
| B             | Brand audit  | `/brand:audit <url>`                           | score ≥ 7, P0 = 0               | `PROMOTE_E304` (bloccante)                | Skip esplicito → warning in MANIFEST |
| C             | Anti-slop    | `/brand:anti-slop`                             | Tutti PASS                      | `PROMOTE_E305` (bloccante)                | NO                                   |
| D             | Verification | `superpowers:verification-before-completion`   | 5/5 self-integrity              | `PROMOTE_E306` (bloccante)                | NO                                   |
| E             | User confirm | dry-run preview + esplicito "yes"              | Conferma testuale               | `PROMOTE_E307` (bloccante)                | NO                                   |
| F (fail-safe) | Repo clean   | `git diff --quiet`                             | working tree clean su prod-path | `PROMOTE_E302` (bloccante pre-script)     | NO                                   |
| G (fail-safe) | Husky        | husky pre-commit hook                          | hook PASS                       | `PROMOTE_E308` (bloccante post-overwrite) | NO (mai `--no-verify`)               |

## Stato del filesystem dopo ogni gate

| Dopo gate                     | Backup creato? | Produzione modificata? | Commit creato? |
| ----------------------------- | -------------- | ---------------------- | -------------- |
| A                             | NO             | NO                     | NO             |
| B                             | NO             | NO                     | NO             |
| C                             | NO             | NO                     | NO             |
| D                             | NO             | NO                     | NO             |
| E (post dry-run, no confirm)  | NO             | NO                     | NO             |
| E (post dry-run, confirm yes) | imminente      | imminente              | imminente      |
| F (clean check pass)          | NO             | NO                     | NO             |
| post copy + MANIFEST          | SÌ             | SÌ                     | NO             |
| G (husky pass)                | SÌ             | SÌ                     | SÌ             |
| G (husky fail)                | SÌ (intatto)   | SÌ (sospeso)           | NO             |

## Recovery scenari

| Scenario                                  | Comando recovery                                                                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Gate E "no" → abort dry-run               | nessuno serve, side-effect = 0                                                                                                    |
| Gate G fail → backup OK ma commit fallito | risolvere husky violations + `git add` + `git commit` manuale, oppure `/studio:restore <route> <BKP_TS>-pre-promote` per rollback |
| Gate F fail → repo dirty pre-promote      | `git stash` o commit pendenti, poi rilancia /studio:promote                                                                       |
| Drift detect (`PROMOTE_E303`)             | nuovo `/studio:clone <route>` (preferito), oppure `--accept-drift` (sconsigliato)                                                 |
| Errore inatteso post-overwrite            | `/studio:restore <route> <BKP_TS>-pre-promote` immediato                                                                          |

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Errori catalog: [`error-catalog.md`](error-catalog.md)
- MANIFEST schema: [`manifest-schema.md`](manifest-schema.md)
- Orchestration map: [`orchestration-map.md`](orchestration-map.md)
- Slash command: [`../../commands/studio/promote.md`](../../commands/studio/promote.md)
