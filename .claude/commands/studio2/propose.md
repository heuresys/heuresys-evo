---
description: Submission proposta modifica route cycle 2 — crea staging directory + acceptance criteria template + canonical-ref placeholder
argument-hint: <route>
---

# /studio2:propose <route>

Esegui ESATTAMENTE questo protocollo. Argument `$ARGUMENTS` = route name (es. `dashboard`, `login`, `me/skills`).

## Step 1 — Validate route exists

```
LS services/app/src/app/$ARGUMENTS/
```

Se non esiste → STOP, segnala "route $ARGUMENTS non trovata in services/app/src/app/".

## Step 2 — Generate timestamp

```bash
TS=$(date -u +%Y-%m-%dT%H%M%SZ)
```

## Step 3 — Create staging directory

```bash
mkdir -p .ux-design/03-mockups/$ARGUMENTS/staging-$TS
cp -r services/app/src/app/$ARGUMENTS/* .ux-design/03-mockups/$ARGUMENTS/staging-$TS/
```

## Step 4 — Generate STAGING-README.md template

Crea `.ux-design/03-mockups/$ARGUMENTS/staging-$TS/STAGING-README.md`:

```markdown
# Staging — $ARGUMENTS / $TS

> Cycle 2 staging post-S62 reset. ADR-0032 charter.

## Motivazione

<!-- Cosa cambia in questa staging? Quale problema risolve? Min 100 char. -->

## Acceptance criteria

- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## Canonical reference

Vedi `CANONICAL-REF.md` — campo `derived-from: L-NN` obbligatorio.

## Files modified vs production baseline

Run `git diff --stat services/app/src/app/$ARGUMENTS/ .ux-design/03-mockups/$ARGUMENTS/staging-$TS/`
```

## Step 5 — Generate CANONICAL-REF.md placeholder

Crea `.ux-design/03-mockups/$ARGUMENTS/staging-$TS/CANONICAL-REF.md`:

```markdown
# Canonical reference

> Gate 1 di /studio2:promote richiede `derived-from: L-NN` non vuoto, con L-NN esistente in `.ux-design/DECISIONS-LOG-v2.md`.

derived-from:

# Insert L-NN qui (es. "L2" per logo wordmark cycle 2). Se canonical decision non esiste ancora, decision prima → /brand workflow per firmarla.

rationale:

# Spiega come la modifica deriva dalla canonical decision citata. Min 2 frasi.
```

## Step 6 — Report

Output:

```
Staging creata: .ux-design/03-mockups/$ARGUMENTS/staging-$TS/

Next steps:
1. Itera in .ux-design/03-mockups/$ARGUMENTS/staging-$TS/
2. Compila STAGING-README.md (motivazione + acceptance criteria)
3. Compila CANONICAL-REF.md (derived-from: L-NN obbligatorio per gate 1)
4. Quando pronto: /studio2:promote $ARGUMENTS $TS
```

## Riferimenti

- Skill: `.claude/skills/studio2/SKILL.md`
- ADR-0032: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`
