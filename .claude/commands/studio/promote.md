---
description: Promuove staging in produzione via 5-gate flow con backup restorable obbligatorio
argument-hint: '<route> <TS> [--accept-drift]'
---

# /studio:promote <route> <TS> — Promozione staging → produzione

Esegui ESATTAMENTE questo protocollo a 5 gate (A-E già coperti pre-questo command, F-G qui).

## Step 1 — Validazione argomenti

Argomenti obbligatori: `<route>` + `<TS>` (entrambi). NESSUN default su TS per safety.

Se `$ARGUMENTS` non contiene almeno 2 token: STOP. Errore `PROMOTE_E301`.

Flag opzionale `--accept-drift`: utente accetta drift produzione (sconsigliato — vedi gate F1).

## Step 2 — Gate B: Brand audit (raccomandato)

Verifica che gate B sia stato passato. Se l'utente non l'ha fatto recentemente, suggerisci:

```
/brand:audit http://localhost:3000/<route>
```

Atteso: score ≥ 7, P0 count = 0. Se P0 > 0 → BLOCCA con `PROMOTE_E304`.

L'utente può saltarlo dichiarando esplicitamente "salto audit" — segnala in MANIFEST come warning (`PROMOTE_E310`).

## Step 3 — Gate C: Anti-slop fingerprint check (raccomandato)

Verifica che gate C sia stato passato:

```
/brand:anti-slop
```

Atteso: tutte le verification PASS. Se almeno 1 FAIL critico → BLOCCA con `PROMOTE_E305`.

## Step 4 — Gate D: Verification before completion (obbligatorio)

Invoca:

```
Skill superpowers:verification-before-completion
```

Esegui Self-Integrity Check 5/5:

- [Test] Eseguito il test che dimostra il fix?
- [Coverage] Tutti i casi richiesti, non solo 1?
- [Side effects] Non ho rotto altro?
- [Acceptance] Ogni criterion ha PASS verificato?
- [Persistence] Cambi committati + pushati? (no per ora — gate E)

Se ANY "no" → BLOCCA con `PROMOTE_E306`. Risolvi e ricicla.

## Step 5 — Esegui DRY-RUN

```bash
bash .claude/skills/studio/scripts/promote.sh --dry-run "<route>" "<TS>"
```

Lo script mostra:

- Source staging path
- Target prod path
- Backup path pianificato (con TS dedicato)
- Pre-commit SHA + branch + author
- Drift detection (numero file diff)
- Reason estratta da `README.md § Motivazione` dello staging
- Lista file staging → prod con size + sha256
- Diff stat fra staging e prod
- Commit message preview

## Step 6 — Gate E: Conferma esplicita utente

Mostra preview dry-run all'utente. Chiedi conferma testuale ("yes" / "y" / "procedi") in modo esplicito.

Se utente risponde NO o ambiguo → STOP con `PROMOTE_E307`. Niente side-effect.

Se utente conferma → procedi a Step 7.

## Step 7 — Esegui CONFIRMED

```bash
bash .claude/skills/studio/scripts/promote.sh --confirmed "<route>" "<TS>"
```

Lo script:

1. Verifica repo clean su `services/app/src/app/<route>/` (else `PROMOTE_E302`)
2. Crea `.ux-design/.backups/<route>/<TS>-pre-promote/` + copia file produzione
3. Scrive `MANIFEST.json` (validato JSON parse)
4. Sostituisce produzione con file da staging (esclusi metadata)
5. `git add <prod-path>` + `git commit` (husky run, NO `--no-verify`)
6. Aggiorna `MANIFEST.json` con `post_promote_commit` SHA
7. **NO push** (push è opt-in separato)

## Step 8 — Output al user

Dopo successo:

- Pre-promote commit SHA
- Post-promote commit SHA
- Path backup
- Suggerimento push (`git push origin <branch>`) — esplicito, mai automatico
- Suggerimento restore (`/studio:restore <route> <bkp-TS>-pre-promote`) per safety net

## Step 9 — Eventuale gestione fail husky

Se commit fallisce (gate F: husky pre-commit fail):

- Backup è stato creato (immutabile)
- Produzione è stata modificata ma NON committata
- Errore `PROMOTE_E308` con istruzioni:
  - Risolvi violazioni husky (lint-staged / gitleaks / commitlint)
  - Re-stage e commit manualmente, oppure
  - `/studio:restore <route> <BKP_TS>-pre-promote` per rollback istantaneo

## Cosa NON fare

- NON usare `--accept-drift` di default: è una scappatoia per casi anomali
- NON eseguire `git push` automaticamente dopo il commit: deve essere esplicito
- NON saltare Step 4 (gate D verification): è obbligatorio
- NON saltare Step 6 (gate E conferma): mai promote senza approvazione esplicita utente
- NON usare `git commit --no-verify`: bypassa husky, viola CLAUDE.md root regola R11

## Riferimenti

- Script: `.claude/skills/studio/scripts/promote.sh`
- 5-gate flow dettaglio: `.claude/skills/studio/references/promote-flow.md`
- MANIFEST.json schema: `.claude/skills/studio/references/manifest-schema.md`
- Skill orchestration map: `.claude/skills/studio/references/orchestration-map.md`
- Errori: `.claude/skills/studio/references/error-catalog.md` § `/studio:promote`
- Skill principale: `.claude/skills/studio/SKILL.md`
