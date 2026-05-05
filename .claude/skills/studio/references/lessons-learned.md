# Lessons learned — pattern operativi emersi dall'uso reale

> File **append-only**. Mai cancellare entry passate. Aggiungi sezione `### [pattern] — <timestamp>` per ogni lezione.

Documenta pattern che NON erano evidenti dal design originale ma sono emersi dall'uso. Vedi [`self-evolution.md`](self-evolution.md) § "Lessons learned — quando appendere" per linee guida.

## Format

```markdown
### [<pattern-id>] — <ISO timestamp>

<descrizione 1-3 frasi: cosa è successo, qual è la lezione, come applicarla in futuro>

**Trigger condition**: <quando questo pattern si manifesta>
**Mitigation**: <azione concreta da prendere>
**Promoted to**: <error-catalog.md / SKILL.md / CLAUDE.md root> (se la lezione è stata stabilizzata)
```

## Active lessons

### [drift-crlf] — 2026-05-05T18:50:00Z

Drift detection del 5-gate flow su Windows Git Bash generava falsi positivi: gli hash sha256 dei file di produzione corrispondevano perfettamente a `.source-hashes.json`, ma `promote.sh` segnalava drift su tutti i file.

**Trigger condition**: ambiente Windows Git Bash con `python3` che fa auto CRLF su `print()`. Il loop bash che legge pairs `path<TAB>hash` ottiene `hash\r` invece di `hash`, e il confronto stringa fallisce.

**Mitigation**: in tutti gli script che leggono output di `python3`:

- Usare `sys.stdout.write(s + chr(10))` invece di `print()` (evita auto-newline conversion)
- Strip `\r` esplicito post-`read`: `FHASH="${FHASH%$'\r'}"`
- Pattern `read -r FPATH FHASH || [ -n "$FPATH" ]` per gestire ultima riga senza newline

**Promoted to**: `scripts/promote.sh`, `scripts/restore.sh`, `scripts/status.sh` (commit `e46d6be`).

---

### [ts-collision-suffix] — 2026-05-05T18:00:00Z

Doppio `/studio:clone` nello stesso minuto produrrebbe collision di TS (`YYYY-MM-DD-HHMM`).

**Trigger condition**: 2+ esecuzioni di clone-route.sh entro 60 secondi.

**Mitigation**: lo script applica suffix incrementale `-2`, `-3`, fino a `-10`. Oltre, errore `CLONE_E104` ("aspetta 1 minuto"). Mai overwrite di staging esistente.

**Promoted to**: `scripts/clone-route.sh` + `references/route-mapping.md` § F2 (design originale).

---

### [README-motivazione-fallback] — 2026-05-05T19:00:00Z

In `/studio:promote`, l'estrazione della `reason` dal README.md staging falliva (sezione `## Motivazione` vuota) generando reason `"(README § Motivazione vuota — gate A non completato)"`.

**Trigger condition**: utente skip-pa il gate A (brainstorming post-clone) e non compila la sezione Motivazione.

**Mitigation**: il MANIFEST registra il fallback string, segnalando che gate A non è stato eseguito. Non è bloccante (è warning `PROMOTE_E310`). Skill `brand-resume` o `studio:bootstrap` dovrebbero pre-compilare la sezione.

**Promoted to**: `scripts/promote.sh` + `templates/README-staging.template.md`.

---

<!-- Append nuove lezioni qui sotto. Non modificare entry passate. -->
