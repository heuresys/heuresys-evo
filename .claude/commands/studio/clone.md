---
description: Clone a Next.js production page into .ux-design/10-staging/ for safe iteration
argument-hint: '<route> (es. dashboard, login, admin/users)'
---

# /studio:clone <route> — Clone route produzione in staging brand

Esegui ESATTAMENTE questo protocollo.

## Step 1 — Validazione argomento

Se `$ARGUMENTS` è vuoto: STOP. Chiedi all'utente la route da clonare. Esempi: `dashboard`, `login`, `showcase`, `admin/users`, `(authenticated)/dashboard`.

Se la route ha caratteri sospetti (path traversal, spazi non quoted, etc.): STOP. Avvisa l'utente.

## Step 2 — Verifica route esista in produzione

Prima di lanciare lo script, verifica con un check rapido:

```bash
ls services/app/src/app/$ARGUMENTS/page.tsx 2>/dev/null \
  || find services/app/src/app -path "*/$ARGUMENTS/page.tsx" 2>/dev/null | head -5
```

Se nessun match: STOP con `CLONE_E102` — segnala route inesistente e mostra route disponibili (`ls services/app/src/app/`).

## Step 3 — Esegui clone-route.sh

```bash
bash .claude/skills/studio/scripts/clone-route.sh "$ARGUMENTS"
```

Lo script:

- Risolve path produzione (con discovery route group)
- Genera TS `YYYY-MM-DD-HHMM` (con suffix `-2`, `-3` se collision)
- Crea `.ux-design/10-staging/<route>/<TS>/`
- Copia file (rsync se disponibile, altrimenti `cp -R`)
- Calcola sha256 di ogni file → `.source-hashes.json`
- Discover dependency esterne → `.external-deps.txt`
- Genera README.md popolato dal template

## Step 4 — Output al user

Mostra l'output dello script + summary:

```
Staging creato: <PATH>
File copiati: <COUNT>
Dependency esterne osservate: <COUNT>
Branch: <BRANCH> @ commit <SHA>
```

## Step 5 — Gate A (Skill superpowers:brainstorming)

Invoca:

```
Skill superpowers:brainstorming
```

Argomento: aiutare l'utente a compilare la sezione `## Motivazione` del README staging. Domande chiave:

- Perché iteriamo su questa pagina?
- Quale problema/insight risolviamo?
- Qual è il criterio di successo (visivo, funzionale, di brand)?
- Quale mockup di riferimento (`.ux-design/06-mockups/...`) o decision log entry (`.ux-design/DECISIONS-LOG.md`) si applica?

Trascrivi il risultato del brainstorming nella sezione `## Motivazione` del README.

## Step 6 — Aspetta direzione

A questo punto la staging è pronta. L'utente può:

- Iterare manualmente sui file in staging
- Invocare `Skill frontend-design` per pattern componenti
- Invocare `Skill frontend-design-pro:design` per wizard color/typography/moodboard
- Invocare `Skill figma:figma-implement-design` se il design parte da Figma
- Invocare `/studio:diff <route> <TS>` per vedere modifiche
- Quando pronto: `/studio:promote <route> <TS>` per ri-promuovere

## Cosa NON fare

- NON modificare file in `services/app/src/app/<route>/` (produzione) durante la fase di clone — useresti il workflow sbagliato
- NON saltare il gate A (brainstorming): la motivazione nel README è il criterio per il commit message di promote
- NON eliminare `.source-hashes.json` o `.external-deps.txt` dalla staging: servono al promote per drift detection
- NON committare la cartella `.ux-design/10-staging/<route>/<TS>/` come parte di un commit di feature: lo staging vive segregato dalla build, ma può essere committato come work-in-progress (la cartella è tracked)

## Riferimenti

- Script: `.claude/skills/studio/scripts/clone-route.sh`
- Template README staging: `.claude/skills/studio/templates/README-staging.template.md`
- Convenzione path + edge case: `.claude/skills/studio/references/route-mapping.md`
- Errori: `.claude/skills/studio/references/error-catalog.md` § `/studio:clone`
- Skill principale: `.claude/skills/studio/SKILL.md`
