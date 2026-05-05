# Staging — `<ROUTE>` @ `<TS>`

**Created**: `<ISO_TIMESTAMP>`
**Author**: `<AUTHOR_NAME>` `<AUTHOR_EMAIL>`
**Source commit**: `<PRE_CLONE_COMMIT_SHA>` (branch `<BRANCH>`)
**Source path**: `services/app/src/app/<ROUTE>/`
**Status**: `draft`

## Motivazione

<!-- 1-3 paragrafi: perché si itera, quale problema si risolve, criterio di successo. Compilare via /studio:clone gate A (superpowers:brainstorming). -->

_(da compilare durante gate A — superpowers:brainstorming)_

## Checklist pre-promote

- [ ] Brainstorming completato (motivazione + criterio di successo qui sopra)
- [ ] Modifiche eseguite in staging (NON in produzione)
- [ ] Diff revisionato visivamente (`/studio:diff <route> <TS>`)
- [ ] `/brand:audit` su URL locale → score ≥ 7 + 0 P0
- [ ] `/brand:anti-slop` clean su sorgente staging
- [ ] `superpowers:verification-before-completion` self-integrity 5/5
- [ ] Test manuale browser (chrome-devtools-mcp opzionale)
- [ ] Approvazione utente esplicita per dry-run

## File originali del clone

_(elenco generato automaticamente dallo script — NON modificare manualmente)_

```
<FILE_LIST_PLACEHOLDER>
```

Hash sha256 di ogni file: `.source-hashes.json` (usato da `/studio:promote` per drift detection).

## Dependency esterne osservate

_(file shared importati da page.tsx — NON inclusi nel clone, da gestire fuori scope se modificati)_

```
<DEPS_EXTERNAL_PLACEHOLDER>
```

## Links

- Produzione attuale: `services/app/src/app/<ROUTE>/`
- Backup precedenti per questa route: `.ux-design/.backups/<ROUTE>/`
- Mockup di riferimento (se applicabile): `.ux-design/06-mockups/...`
- Decision log entry (se applicabile): `.ux-design/DECISIONS-LOG.md`

## Status timeline (append-only)

- `<ISO_TIMESTAMP>` — staging creato via `/studio:clone <ROUTE>`

<!-- Append-only: ogni cambio di status (ready-for-audit, ready-for-promote, promoted, abandoned) aggiunge una riga timestamp + descrizione. Mai modificare entry passate. -->

## Note iterazione

<!-- Journal libero append-only di tentativi/scarti durante la sessione. Utile per audit trail e per /studio:promote § reason. -->

_(da compilare durante l'iterazione)_
