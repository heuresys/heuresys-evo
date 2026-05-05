# Orchestration map — quale skill in quale fase

Mappa completa di quale skill esistente la skill `studio` invoca o si aspetta sia stata invocata in ogni fase del workflow clone↔promote↔backup.

## Fasi del workflow

| Fase                                 | Comando trigger                         | Skill invocate                                                                  | Tipo invocazione                        | Output consumato            |
| ------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------- | --------------------------- |
| 1. Entry                             | `/studio`                               | nessuna obbligatoria                                                            | n/a                                     | n/a                         |
| 2. Clone                             | `/studio:clone <route>`                 | `superpowers:brainstorming` (gate A)                                            | Esplicita post-clone                    | README § Motivazione        |
| 3. Manipolazione staging             | (libero)                                | `frontend-design`, `frontend-design-pro:design`, `figma:figma-implement-design` | Opzionale (utente sceglie)              | File modificati in staging  |
| 4. Diff verifica                     | `/studio:diff <route>`                  | nessuna                                                                         | n/a                                     | output diff                 |
| 5. Pre-promote audit (gate B)        | `/brand:audit <url>`                    | n/a (è già un command)                                                          | Esplicita                               | score + P0 count            |
| 6. Pre-promote anti-slop (gate C)    | `/brand:anti-slop`                      | n/a (è già un command)                                                          | Esplicita                               | fingerprint check PASS/FAIL |
| 7. Pre-promote verification (gate D) | `/studio:promote` interno               | `superpowers:verification-before-completion`                                    | Implicita (chiamata da promote command) | self-integrity 5/5          |
| 8. Promote esecuzione                | `/studio:promote` interno               | nessuna (script esegue tutto)                                                   | n/a                                     | commit + backup             |
| 9. Restore                           | `/studio:restore` interno               | `superpowers:verification-before-completion`                                    | Implicita (chiamata da restore command) | self-integrity 5/5          |
| 10. Status / backup-list             | `/studio:status`, `/studio:backup-list` | nessuna                                                                         | n/a                                     | n/a                         |

## Skill orchestrate — dettaglio

### `superpowers:brainstorming`

**Quando**: post-clone (gate A), opzionale ma raccomandato.

**Scopo**: aiutare l'utente a compilare la sezione `## Motivazione` del README staging, rispondendo a:

- Perché iteriamo su questa pagina?
- Quale problema/insight risolviamo?
- Qual è il criterio di successo?
- Quale mockup di riferimento si applica?

**Input**: route + path staging.
**Output**: testo da inserire in `README.md § Motivazione`.

### `superpowers:writing-plans`

**Quando**: opzionale, prima di iterare su modifiche complesse in staging.

**Scopo**: strutturare il piano di modifica (es. "redesign hero" decomposto in sub-task).

**Input**: motivazione + criterio di successo.
**Output**: plan file in `~/.claude/plans/` o note nel README staging § Note iterazione.

### `superpowers:verification-before-completion`

**Quando**: pre-promote (gate D) e pre-restore.

**Scopo**: Self-Integrity Check 5/5 prima di azione potenzialmente irreversibile.

**Input**: stato repo + staging + checklist README.
**Output**: PASS (5/5) o FAIL (con elenco "no" da risolvere).

### `frontend-design` (frontend-design plugin)

**Quando**: durante manipolazione staging, su richiesta utente.

**Scopo**: pattern di componenti React + best practice UI.

**Input**: contesto staging path + domanda specifica.
**Output**: snippet codice + spiegazione pattern.

### `frontend-design-pro:design` (frontend-design-pro plugin)

**Quando**: durante manipolazione staging, su richiesta utente.

**Scopo**: wizard interattivo per color/typography/moodboard.

**Input**: brief design.
**Output**: token CSS, palette, font pairing.

### `figma:figma-implement-design` (figma plugin)

**Quando**: se il design parte da un file Figma.

**Scopo**: tradurre design Figma in codice Next.js direttamente nello staging.

**Input**: Figma URL + path staging target.
**Output**: file `.tsx` + `.css` modificati nello staging.

### Comandi `/brand:*` (gate B + C in promote)

| Comando                          | Quando                       | Scopo                                               | Output                      |
| -------------------------------- | ---------------------------- | --------------------------------------------------- | --------------------------- |
| `/brand:audit <url>`             | gate B pre-promote           | Audit live URL con score 0-10 + P0/P1/P2 punch list | score + counts              |
| `/brand:anti-slop`               | gate C pre-promote           | Fingerprint check anti AI-slop                      | PASS/FAIL per ogni voce     |
| `/brand:family-picker`           | opzionale fase setup         | Pick aesthetic family se nuovo dominio visivo       | famiglia raccomandata       |
| `/brand:designer-debate <brief>` | opzionale (review)           | 3-voice critique brief                              | synthesis + minority report |
| `/brand:extract <url>`           | opzionale (capture baseline) | DESIGN.md da URL/screenshot                         | DESIGN.md 9 sezioni         |
| `/brand:remix <A> <B>`           | opzionale (ibridazione)      | Combina 2 DESIGN.md                                 | terzo DESIGN.md             |

## Sequenza happy path (riferimento)

```
1. USER: "iteriamo sulla dashboard"
   ↓
2. /studio:clone dashboard  →  brainstorming (gate A)
   ↓
3. USER itera in staging  →  frontend-design / frontend-design-pro:design / figma (opzionali)
   ↓
4. /studio:diff dashboard  →  output diff per review
   ↓
5. /brand:audit http://localhost:3000/dashboard  →  gate B
   ↓
6. /brand:anti-slop  →  gate C
   ↓
7. /studio:promote dashboard <TS>
   ├─→ verification-before-completion  →  gate D
   ├─→ scripts/promote.sh --dry-run  →  preview
   ├─→ user explicit "yes"  →  gate E
   └─→ scripts/promote.sh --confirmed  →  backup + overwrite + commit
   ↓
8. (opzionale) git push origin main
```

## Skill NON invocate (out-of-scope)

| Skill                                     | Perché non invocata                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `superpowers:test-driven-development`     | UI changes non hanno test unit standard; gate D verification copre  |
| `superpowers:writing-skills`              | La skill studio si scrive una sola volta, non runtime               |
| `superpowers:executing-plans`             | Plan execution è per development progetti, non workflow staging     |
| `superpowers:dispatching-parallel-agents` | Promote è seriale per design (atomicità)                            |
| `superpowers:using-git-worktrees`         | Out-of-scope; staging è isolato in `.ux-design/`, non worktree      |
| `claude-mem:*`                            | Memory layer ortogonale, non parte del flow operativo               |
| `chrome-devtools-mcp:*`                   | Opzionale per audit visivo browser; gate B copre via `/brand:audit` |

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Promote flow: [`promote-flow.md`](promote-flow.md)
- Errori catalog: [`error-catalog.md`](error-catalog.md)
