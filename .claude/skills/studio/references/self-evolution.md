# Self-evolution — meccanismi di auto-apprendimento, auto-correzione, auto-aggiornamento

Documenta i 3 processi che permettono alla skill `studio` di evolvere nel tempo senza richiedere riscritture manuali sistematiche.

## I 3 meccanismi

| Meccanismo          | Cosa fa                                                                                                                 | Trigger                                                                        | Storage                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **Self-learning**   | Cattura pattern d'uso reali (frequenza command, errori ricorrenti, durate)                                              | Ogni invocazione di script principale (via `_log_invocation` in `_helpers.sh`) | `.claude/skills/studio/.logs/usage.jsonl` (append-only, gitignored) |
| **Self-correcting** | Detect drift della skill stessa (file mancanti, link rotti, sintassi script, coerenza tabelle)                          | Su richiesta utente: `/studio:doctor`                                          | Output a console + exit code; auto-fix safe via `--apply`           |
| **Self-updating**   | Aggiorna parti deterministiche della skill (tabelle sub-command, version, CHANGELOG) quando i file sottostanti cambiano | `/studio:doctor --apply` (manuale) o futuri hook git pre-commit                | File rigenerati: `SKILL.md` tabella, `CHANGELOG.md` entry           |

## Flow architetturale

```
┌──────────────────────────────────────────────────────────┐
│ INVOCAZIONE script (clone, promote, restore, ecc.)       │
│  ↓                                                       │
│  source _helpers.sh                                      │
│  trap '_log_invocation "$0" "$@" $?' EXIT                │
│  ↓                                                       │
│  esecuzione normale                                      │
│  ↓ EXIT (qualunque sia il path)                          │
│  _log_invocation appende JSONL a .logs/usage.jsonl       │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ /studio:doctor (manuale, periodico)                      │
│  ↓                                                       │
│  diagnostic (8 check categories)                         │
│  ↓                                                       │
│  flag --apply: auto-fix safe                             │
│  flag --learn: analisi usage.jsonl                       │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│ Lessons learned (manuale + helper function)              │
│  ↓                                                       │
│  references/lessons-learned.md (append-only)             │
│  Entry: ### [pattern] — <timestamp>                      │
│         <description>                                    │
└──────────────────────────────────────────────────────────┘
```

## Self-learning — log structure

Ogni invocazione di script principale append una linea JSONL a `.logs/usage.jsonl`:

```json
{"ts":"2026-05-05T19:30:14Z","script":"clone-route","args":["dashboard"],"exit":0,"cwd":"/d/evo.heuresys.com"}
{"ts":"2026-05-05T19:32:01Z","script":"promote","args":["--dry-run","dashboard","2026-05-05-1930"],"exit":0,"cwd":"/d/evo.heuresys.com"}
{"ts":"2026-05-05T19:35:45Z","script":"promote","args":["--confirmed","dashboard","2026-05-05-1930"],"exit":3,"cwd":"/d/evo.heuresys.com"}
```

Campi obbligatori: `ts` (ISO UTC), `script` (nome senza .sh), `args` (array, può essere vuoto), `exit` (numerico), `cwd`.

**Privacy**: log è 100% locale (`.logs/` è gitignored, mai pushato). Nessun dato sensibile (no contenuto file, no segreti).

**Analisi**: `/studio:doctor --learn` aggrega via python3:

- Top command per frequenza
- Top fallimenti (exit != 0) con script + exit code
- Recent activity (ultime 5 entry)

## Self-correcting — 8 check categories di doctor

| #   | Categoria                  | Cosa verifica                                                                  |
| --- | -------------------------- | ------------------------------------------------------------------------------ |
| 1   | File integrity             | SKILL.md + 8 references + 9 scripts esistono                                   |
| 2   | Commands ↔ files alignment | Ogni file in `commands/studio/*.md` ha riga corrispondente in tabella SKILL.md |
| 3   | Bash syntax                | `bash -n` su tutti gli script                                                  |
| 4   | Executable bit             | Script hanno chmod +x (warning se no, fix con --apply)                         |
| 5   | JSON templates             | `MANIFEST.template.json` parsa correttamente                                   |
| 6   | Error catalog coverage     | Codici `<DOMAIN>_E<NUM>` documentati in error-catalog.md                       |
| 7   | Version coherence          | SKILL.md frontmatter `version:` + entry in CHANGELOG.md                        |
| 8   | Self-learning data         | Counter invocazioni in usage.jsonl + linee in lessons-learned.md               |

Auto-fix safe (con `--apply`):

- Chmod +x mancante
- (Future) Regenerate tabella sub-command da `commands/studio/*.md` frontmatter `description`
- (Future) Bump CHANGELOG entry mancante

Auto-fix NON applicato in autonomia: edit di references markdown, fix sintassi bash, fix JSON. Servono review manuale.

## Self-updating — dove andiamo

Future enhancement (non day-1):

- `/studio:doctor --regen-table` — rigenera SKILL.md tabella sub-comandi da frontmatter `description` di `commands/studio/*.md`
- `/studio:doctor --bump <major|minor|patch>` — bump version in SKILL.md frontmatter + crea CHANGELOG entry
- Hook git pre-commit che esegue `doctor.sh` automatic check

## Lessons learned — quando appendere

Il file [`lessons-learned.md`](lessons-learned.md) cattura pattern operativi che NON erano evidenti dal design originale ma sono emersi dall'uso. Esempi di lezioni utili:

- "Mockup HTML con `<style>` inline tradurre come CSS module, non come `<style jsx>`"
- "Route group `(authenticated)/<route>` richiede modifiche al `layout.tsx` parent — flag in README"
- "Drift detection genera falsi positivi su file con CRLF differente dal repo"

**Quando appendere**:

- Bug trovato in produzione e fixato → lesson "se X allora Y"
- Pattern di errore ricorrente in `.logs/usage.jsonl` (3+ volte stesso exit code) → lesson preventiva
- Workflow alternativo che funziona meglio del documentato → lesson sostitutiva

**Come appendere**:

```bash
# In bash:
source .claude/skills/studio/scripts/_helpers.sh
_capture_lesson "drift-crlf" "Drift detection sensibile a line endings: stripe \\r prima di confronto sha256"

# Oppure manualmente in lessons-learned.md:
### [drift-crlf] — 2026-05-05T19:30:14Z

Drift detection sensibile a line endings...
```

## Integrazione con CLAUDE.md root

Quando un pattern emerge come stabile (3+ lezioni convergenti), va promosso:

- **Skill-level** → aggiornare `references/error-catalog.md` o `route-mapping.md`
- **Project-level** → aggiornare `CLAUDE.md` root (es. nuovo trigger keyword, nuovo workflow standard)
- **Decision-level** → entry in `.ux-design/DECISIONS-LOG.md` se la lezione cambia comportamento del workstream brand

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Doctor script: [`../scripts/doctor.sh`](../scripts/doctor.sh)
- Helpers: [`../scripts/_helpers.sh`](../scripts/_helpers.sh)
- Lessons: [`lessons-learned.md`](lessons-learned.md)
- CHANGELOG: [`../CHANGELOG.md`](../CHANGELOG.md)
- Slash command: [`../../commands/studio/doctor.md`](../../commands/studio/doctor.md)
