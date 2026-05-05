# Staging README template — documentazione

Documenta lo schema del file `README.md` che `clone-route.sh` genera in ogni staging dir `.ux-design/10-staging/<route>/<TS>/README.md`.

## Source

Template letterale: `.claude/skills/studio/templates/README-staging.template.md`.

## Sezioni

| #   | Sezione                                                 | Compilato da                                      | Quando                                         |
| --- | ------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| 1   | Header (route + TS + author + commit + branch + status) | `clone-route.sh`                                  | Auto al clone                                  |
| 2   | `## Motivazione`                                        | Skill `superpowers:brainstorming` (gate A)        | Subito dopo clone                              |
| 3   | `## Checklist pre-promote`                              | User durante iterazione                           | Append-only                                    |
| 4   | `## File originali del clone`                           | `clone-route.sh`                                  | Auto al clone (lista file estratta da staging) |
| 5   | `## Dependency esterne osservate`                       | `clone-route.sh` (best-effort grep)               | Auto al clone                                  |
| 6   | `## Links`                                              | Compilare manualmente se serve                    | Manuale                                        |
| 7   | `## Status timeline` (append-only)                      | `clone-route.sh` (entry iniziale) + user (append) | Auto + manuale                                 |
| 8   | `## Note iterazione` (journal append-only)              | User durante iterazione                           | Manuale                                        |

## Status flow

Il campo `Status:` nell'header del README progredisce così:

```
draft  →  ready-for-audit  →  ready-for-promote  →  promoted  (terminal)
                                                  ↓
                                              abandoned  (terminal)
```

Ogni cambio di status va loggato nella sezione `## Status timeline` come riga timestamp + descrizione (append-only, mai modificare entry passate).

## Placeholder usati nel template

| Placeholder                   | Sostituito con                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| `<ROUTE>`                     | route name (es. `dashboard`, `admin/users`)                                                               |
| `<TS>`                        | timestamp del clone (`YYYY-MM-DD-HHMM`)                                                                   |
| `<ISO_TIMESTAMP>`             | ISO 8601 UTC del momento del clone                                                                        |
| `<AUTHOR_NAME>`               | `git config user.name`                                                                                    |
| `<AUTHOR_EMAIL>`              | `git config user.email`                                                                                   |
| `<PRE_CLONE_COMMIT_SHA>`      | `git rev-parse HEAD` al momento del clone                                                                 |
| `<BRANCH>`                    | `git rev-parse --abbrev-ref HEAD` al momento del clone                                                    |
| `<FILE_LIST_PLACEHOLDER>`     | output di `find <STAGING_DIR> -type f` (escluso `.source-hashes.json`, `.external-deps.txt`, `README.md`) |
| `<DEPS_EXTERNAL_PLACEHOLDER>` | contenuto di `.external-deps.txt` (grep import esterni)                                                   |

## Esempio popolato

```markdown
# Staging — `dashboard` @ `2026-05-05-2030`

**Created**: `2026-05-05T18:30:14Z`
**Author**: `Enzo Spenuso` `enzo.spenuso@outlook.com`
**Source commit**: `abc1234` (branch `main`)
**Source path**: `services/app/src/app/dashboard/`
**Status**: `draft`

## Motivazione

Refactor dell'hero della dashboard per allineare l'aspetto al direction ζ
(post-D1 μ-architect-legacy) e per risolvere 1 P1 segnalato dall'audit
del 2026-05-04 sulla typography scale.

Criterio di successo: punteggio /brand:audit ≥ 8 + 0 P0 + ≤ 1 P1.

[... resto del README ...]
```

## Quando aggiornare il template

Modifica il template `templates/README-staging.template.md` quando:

- Cambi lo schema delle sezioni (aggiungi/rimuovi)
- Cambi i placeholder usati
- Cambi il flow status
- Cambi i riferimenti ad altri file della skill

Dopo modifica template: aggiorna anche `clone-route.sh` se cambiano i placeholder gestiti.

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Template letterale: [`../templates/README-staging.template.md`](../templates/README-staging.template.md)
- Script che lo popola: [`../scripts/clone-route.sh`](../scripts/clone-route.sh)
- Slash command che lo invoca: [`../../commands/studio/clone.md`](../../commands/studio/clone.md)
