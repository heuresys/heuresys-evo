---
description: 3-gate promotion staging → produzione (canonical derivation + live data + user confirm) + backup automatico
argument-hint: <route> <staging-TS>
---

# /studio2:promote <route> <staging-TS>

Esegui ESATTAMENTE questo protocollo. `$ARGUMENTS` = `<route> <staging-TS>` (es. `dashboard 2026-05-13T220000Z`).

## Step 1 — Parse arguments

Split `$ARGUMENTS` su whitespace: `ROUTE = first word`, `TS = second word`.

Verifica staging exists:

```
LS .ux-design/03-mockups/$ROUTE/staging-$TS/
```

Se non esiste → STOP "staging $TS not found for route $ROUTE".

## Step 2 — Gate 1: Canonical derivation

Read `.ux-design/03-mockups/$ROUTE/staging-$TS/CANONICAL-REF.md`.

Estrai value di `derived-from:` field.

- Se vuoto / "L-NN" placeholder / non esiste → **BLOCKER GATE 1**. Output:
  ```
  ❌ Gate 1 FAIL — canonical-ref non firmata.
  CANONICAL-REF.md derived-from: deve referenziare L-NN esistente in DECISIONS-LOG-v2.md.
  Aborting promote.
  ```
- Se "Ln" (es. "L2"): verifica L-NN esiste in `.ux-design/DECISIONS-LOG-v2.md`:
  ```
  Grep "^## L$N " .ux-design/DECISIONS-LOG-v2.md
  ```

  - Match → ✅ Gate 1 PASS
  - No match → ❌ Gate 1 FAIL "L-NN $N non esiste in DECISIONS-LOG-v2.md"

## Step 3 — Gate 2: Live data only

Grep cross-file in `.ux-design/03-mockups/$ROUTE/staging-$TS/`:

```
Grep -E "(value|count|rating|n)=\{[0-9]+" .ux-design/03-mockups/$ROUTE/staging-$TS/**/*.tsx
Grep -E "const [A-Z_]+ = \[\{.{200,}" .ux-design/03-mockups/$ROUTE/staging-$TS/**/*.tsx
Grep -E "(MOCK_|DEMO_|FIXTURE_)" .ux-design/03-mockups/$ROUTE/staging-$TS/**/*.tsx
```

Per ogni file con match: verificare se è legittimo (i18n string, CSS class literal, layout numerico grid span) o violazione P11.

Verifica anche presence `<DataNotAvailable />` se fallback condizionali esistono:

```
Grep -E "((null|undefined|\?\?)\s*\?|\|\|\s*['\"])" + verifica <DataNotAvailable
```

- Tutti hardcoded sono legittimi + nessun MOCK*/DEMO*/FIXTURE\_ + tutti fallback usano `<DataNotAvailable />` → ✅ Gate 2 PASS
- Almeno uno fail → ❌ Gate 2 FAIL "PROMOTE_E309_FIXTURE" + lista file violanti

## Step 4 — Gate 3: User confirm

Mostra summary:

```
Promotion summary $ROUTE / $TS

Gate 1 (canonical derivation): ✅ derived-from L$N (...)
Gate 2 (live data only): ✅ <count> files scanned, 0 violations

Files che saranno sovrascritti:
<git diff --stat services/app/src/app/$ROUTE/ .ux-design/03-mockups/$ROUTE/staging-$TS/>

Procedo con promote?
```

Aspetta risposta utente:

- "yes" / "procedi" / "promuovi" → ✅ Gate 3 PASS
- altro / "no" / ambiguo → ❌ Gate 3 FAIL, abort

## Step 5 — Backup automatico

```bash
BACKUP_TS=$(date -u +%Y-%m-%dT%H%M%SZ)
mkdir -p .ux-design/.backups/$ROUTE/$BACKUP_TS
cp -r services/app/src/app/$ROUTE/* .ux-design/.backups/$ROUTE/$BACKUP_TS/
```

Update MANIFEST:

```bash
echo "{\"route\": \"$ROUTE\", \"backup_ts\": \"$BACKUP_TS\", \"replaced_by\": \"staging-$TS\", \"canonical_ref\": \"L$N\", \"promoted_at\": \"$(date -u -Iseconds)\"}" >> .ux-design/.backups/MANIFEST.jsonl
```

## Step 6 — Overwrite production

```bash
rm -rf services/app/src/app/$ROUTE/*
cp -r .ux-design/03-mockups/$ROUTE/staging-$TS/* services/app/src/app/$ROUTE/
# Exclude STAGING-README.md e CANONICAL-REF.md da produzione:
rm -f services/app/src/app/$ROUTE/STAGING-README.md services/app/src/app/$ROUTE/CANONICAL-REF.md
```

## Step 7 — Typecheck + build pre-commit

```bash
cd services/app && npx tsc --noEmit
$env:NODE_OPTIONS='--max-old-space-size=4096'; npx next build
```

- Both PASS → procedi commit
- Either FAIL → rollback automatico, restore da `.ux-design/.backups/$ROUTE/$BACKUP_TS/`, abort

## Step 8 — Commit

```bash
git add services/app/src/app/$ROUTE/ .ux-design/.backups/MANIFEST.jsonl
git commit -m "feat($ROUTE): promote staging $TS [cycle 2 ADR-0032]"
```

Body suggerito:

```
- Canonical reference: L$N
- Gate 1 (canonical derivation): PASS
- Gate 2 (live data): PASS, X files scanned
- Backup: .ux-design/.backups/$ROUTE/$BACKUP_TS/
- Staging: .ux-design/03-mockups/$ROUTE/staging-$TS/
```

**NO push automatico** — utente decide quando.

## Step 9 — Report

```
✅ Promote completato.

Route: $ROUTE
Staging: staging-$TS (canonical L$N)
Backup: .ux-design/.backups/$ROUTE/$BACKUP_TS/
Commit: <hash>

Per rollback: /studio2:rollback $ROUTE
```

## Riferimenti

- Skill: `.claude/skills/studio2/SKILL.md`
- ADR-0032: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`
