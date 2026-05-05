---
description: Prima promozione greenfield — clone scaffold prod + copia mockup HTML come reference + README con motivazione translation
argument-hint: '<mockup-path> <route>'
---

# /studio:bootstrap <mockup-path> <route> — Prima promozione (translation greenfield)

Esegui ESATTAMENTE questo protocollo.

## Quando usarlo

- La route `<route>` esiste in produzione come **scaffold** (page.tsx minimo, non implementazione finale)
- Esiste un **mockup HTML** standalone in `.ux-design/06-mockups/...` che rappresenta il design target
- Vuoi **tradurre** il mockup HTML → componenti React, sostituendo lo scaffold corrente

## Differenza con `/studio:clone`

| Aspetto               | `/studio:clone <route>`               | `/studio:bootstrap <mockup> <route>`                          |
| --------------------- | ------------------------------------- | ------------------------------------------------------------- |
| Source iniziale       | Pagina React esistente                | Mockup HTML + scaffold React                                  |
| Caso d'uso            | Iterazione su pagina già implementata | Prima implementazione (translation)                           |
| Mockup di riferimento | nessuno                               | `source-mockup.html` copiato in staging                       |
| README § Motivazione  | da compilare via brainstorming        | pre-popolato con workflow translation                         |
| `.source-hashes.json` | hash file produzione                  | hash + `bootstrap_source` + `operation_intent: first_promote` |

## Step 1 — Validazione argomenti

Argomenti obbligatori: `<mockup-path>` + `<route>`.

Se `$ARGUMENTS` non contiene almeno 2 token: STOP. Errore `BOOTSTRAP_E001`.

Verifica preliminare:

```bash
ls "$1" 2>/dev/null     # mockup deve esistere
ls services/app/src/app/$2/page.tsx 2>/dev/null   # route deve esistere come scaffold
```

Se mockup non `.html`/`.htm` → STOP `BOOTSTRAP_E002`.

## Step 2 — Esegui bootstrap.sh

```bash
bash .claude/skills/studio/scripts/bootstrap.sh "$1" "$2"
```

Lo script:

1. Invoca internamente `clone-route.sh <route>` (eredita TS collision logic, file copy, sha256, deps grep)
2. Copia `<mockup-path>` come `<staging>/source-mockup.html`
3. Arricchisce `.source-hashes.json` con campi `bootstrap_source` e `operation_intent: "first_promote"`
4. Riscrive sezione `## Motivazione` del README staging con contesto translation + workflow consigliato

## Step 3 — Output al user

Mostra l'output dello script + summary:

```
✓ Bootstrap complete
  Mockup source:   <path> → <staging>/source-mockup.html
  Staging:         .ux-design/10-staging/<route>/<TS>/
  README:          <staging>/README.md (Motivazione popolata)
```

## Step 4 — Suggerisci skill di traduzione

Dopo bootstrap, l'utente è pronto per la translation. Proponi:

```
Skill frontend-design:frontend-design        # pattern componenti React
Skill frontend-design-pro:design             # wizard color/typography/moodboard
Skill figma:figma-implement-design           # se mockup ha equivalente Figma
```

Suggerisci anche di:

- Aprire `<staging>/source-mockup.html` in browser come reference visuale
- Lavorare su `<staging>/page.tsx` (sovrascrivendo lo scaffold corrente con componenti tradotti)
- Estrarre componenti riutilizzabili in `<staging>/_components/` quando sensato

## Step 5 — Aspetta direzione

L'utente itera in staging. Quando pronto:

- `/studio:diff <route> <TS>` per review modifiche
- `/brand:audit http://localhost:3200/<route>` (gate B)
- `/brand:anti-slop` (gate C)
- `/studio:promote <route> <TS>` per promozione (drift detection è normale: scaffold corrente differisce dal contenuto staging)

## Note su drift detection in promote

`/studio:promote` confronta produzione corrente vs hash registrati al clone (per rilevare drift OUT-OF-BAND, modifiche fatte da altri). Per bootstrap:

- Hash registrati = scaffold corrente (esatto stato pre-modifica)
- Drift è atteso = 0 (nessuno tocca lo scaffold mentre traduci)
- Se drift > 0 → qualcuno ha modificato lo scaffold dopo bootstrap (gestire come drift normale)

NESSUN flag speciale needed in promote: il flusso 5-gate funziona uguale.

## Cosa NON fare

- NON usare `bootstrap` su una route già implementata (usa `/studio:clone` invece)
- NON copiare mockup esterni a `.ux-design/06-mockups/` come bootstrap source (out-of-scope)
- NON modificare `source-mockup.html` nello staging: è reference immutabile
- NON saltare la traduzione e fare promote diretto dello scaffold cloned: il workflow di valore è la traduzione progressiva

## Riferimenti

- Script: `.claude/skills/studio/scripts/bootstrap.sh`
- Wrapping di: `.claude/skills/studio/scripts/clone-route.sh`
- Skill di traduzione: `frontend-design`, `frontend-design-pro:design`, `figma:figma-implement-design`
- Errori: `.claude/skills/studio/references/error-catalog.md`
- Skill principale: `.claude/skills/studio/SKILL.md`
