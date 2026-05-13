# Promote flow — 6-gate flow + 2 fail-safe

Documenta il flusso bloccante di `/studio:promote` con 6 gate obbligatori (A-E + D.2) e 2 fail-safe esecutivi (F-G).

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
┌──────────────────────────────────────────────────────────────┐
│ GATE D.2 — NO-FIXTURE CHECK (heuresys-evo P11)               │
│ La staging candidate NON deve contenere mock/hardcoded/random│
│ - Numeri letterali in JSX KPI (`value={86}` ❌)              │
│ - const/array fixture > 2 elementi inline                    │
│ - Demo data come fallback senza percorso live Prisma         │
│ - Source query non esiste? → CREARE prima, poi promotion     │
│ Atteso: zero violation pattern + fallback = `<DataNotAvailable />` │
│ Errore: PROMOTE_E309_FIXTURE → BLOCCA                        │
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

| Gate          | Scope            | Skill/Comando                                       | Esito atteso                    | Errore se fail                            | Bypass possibile?                    |
| ------------- | ---------------- | --------------------------------------------------- | ------------------------------- | ----------------------------------------- | ------------------------------------ |
| A             | Motivazione      | `superpowers:brainstorming` (in /studio:clone)      | README § Motivazione compilata  | `PROMOTE_E310` (warning)                  | Sì (warning, non blocca)             |
| B             | Brand audit      | `/brand:audit <url>`                                | score ≥ 7, P0 = 0               | `PROMOTE_E304` (bloccante)                | Skip esplicito → warning in MANIFEST |
| C             | Anti-slop        | `/brand:anti-slop`                                  | Tutti PASS                      | `PROMOTE_E305` (bloccante)                | NO                                   |
| D             | Verification     | `superpowers:verification-before-completion`        | 5/5 self-integrity              | `PROMOTE_E306` (bloccante)                | NO                                   |
| D.2           | NO-FIXTURE (P11) | grep fixture pattern + check `<DataNotAvailable />` | zero hardcoded/mock/random      | `PROMOTE_E309_FIXTURE` (bloccante)        | NO                                   |
| E             | User confirm     | dry-run preview + esplicito "yes"                   | Conferma testuale               | `PROMOTE_E307` (bloccante)                | NO                                   |
| F (fail-safe) | Repo clean       | `git diff --quiet`                                  | working tree clean su prod-path | `PROMOTE_E302` (bloccante pre-script)     | NO                                   |
| G (fail-safe) | Husky            | husky pre-commit hook                               | hook PASS                       | `PROMOTE_E308` (bloccante post-overwrite) | NO (mai `--no-verify`)               |

## Stato del filesystem dopo ogni gate

| Dopo gate                     | Backup creato? | Produzione modificata? | Commit creato? |
| ----------------------------- | -------------- | ---------------------- | -------------- |
| A                             | NO             | NO                     | NO             |
| B                             | NO             | NO                     | NO             |
| C                             | NO             | NO                     | NO             |
| D                             | NO             | NO                     | NO             |
| D.2                           | NO             | NO                     | NO             |
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

## Gate D.2 — NO-FIXTURE CHECK (heuresys-evo P11)

**Scope**: enforcement constraint **SOLO DATI LIVE da DBMS** (CLAUDE.md §REGOLA NON NEGOZIABILE).

**Esecuzione check pre-promotion**:

```bash
# Pattern 1: numeri letterali in JSX (KPI hardcoded)
grep -rn -E '(value|count|rating|amount|total|n)=\{[0-9]+' .ux-design/10-staging/<route>/<TS>/

# Pattern 2: array hardcoded > 2 elementi
grep -rn -E 'const [A-Z_]+ = \[\{.{200,}' .ux-design/10-staging/<route>/<TS>/

# Pattern 3: variabili mock/fixture
grep -rn -iE '(MOCK_|DEMO_|FIXTURE_|STUB_)' .ux-design/10-staging/<route>/<TS>/

# Pattern 4: fallback senza DataNotAvailable
grep -rn -E '(\?\?|\|\|)\s*\[\{' .ux-design/10-staging/<route>/<TS>/
```

**Se VIOLATION rilevata** → blocker `PROMOTE_E309_FIXTURE` → utente deve:

1. Verificare se query Prisma live esiste in `services/app/src/lib/data/*.ts`
   - **SÌ** → sostituire fixture con `await fetchXxx(tenantId)` + render con `<DataNotAvailable />` fallback
   - **NO** → CREARE prima la query (mai dedurre/inventare), poi rilanciare `/studio:promote`
2. Rimuovere ogni demo/random/hardcoded
3. Rilanciare `/studio:promote <route> <TS>` da Gate A

**Esclusioni legittime**:

- i18n strings (UI labels IT/EN, ARIA strings)
- CSS class names letterali
- Layout numerici (column counts, grid spans)
- Constanti di config UI (animation durations, breakpoints)

**Reference**:

- CLAUDE.md root: §REGOLA NON NEGOZIABILE + P11
- `.claude/CLAUDE.md`: CARD-4 + R18
- Component: `services/app/src/components/data/DataNotAvailable.tsx`
- Inventory baseline: `docs/_audit/2026-05-13-no-mock-inventory.md`

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Errori catalog: [`error-catalog.md`](error-catalog.md)
- MANIFEST schema: [`manifest-schema.md`](manifest-schema.md)
- Orchestration map: [`orchestration-map.md`](orchestration-map.md)
- Slash command: [`../../commands/studio/promote.md`](../../commands/studio/promote.md)
