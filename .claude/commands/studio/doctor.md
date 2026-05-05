---
description: Self-check della skill studio (file integrity + sintassi script + coerenza tabelle + version + log analysis)
argument-hint: '[--apply | --learn | --version]'
---

# /studio:doctor — Self-check / self-correct / self-learn

Esegui ESATTAMENTE questo protocollo.

## Modi operativi

| Modo                 | Comando                    | Cosa fa                                                                |
| -------------------- | -------------------------- | ---------------------------------------------------------------------- |
| Diagnostic (default) | `/studio:doctor`           | 8 categorie di check, exit 0 se tutto PASS                             |
| Auto-fix             | `/studio:doctor --apply`   | Fix automatico di issues safe (chmod, eventuale regen tabella)         |
| Learn                | `/studio:doctor --learn`   | Analizza `.logs/usage.jsonl`: top command, top errori, recent activity |
| Version              | `/studio:doctor --version` | Print versione skill da SKILL.md frontmatter                           |

## Step 1 — Esegui doctor.sh

```bash
bash .claude/skills/studio/scripts/doctor.sh $ARGUMENTS
```

## Step 2 — Output e interpretazione

**Diagnostic mode** produce 8 sezioni:

1. **File integrity** — SKILL.md + 8 references + 9 scripts esistono
2. **Commands ↔ files alignment** — ogni `/studio:*` in `commands/studio/*.md` ha riga corrispondente in SKILL.md tabella
3. **Bash syntax** — `bash -n` su tutti gli script
4. **Executable bit** — script hanno `+x` (warning se no, scriptmente funzionano via `bash <path>`)
5. **JSON templates** — `MANIFEST.template.json` parsa
6. **Error catalog coverage** — codici errore documentati
7. **Version coherence** — SKILL.md frontmatter `version:` + CHANGELOG entry corrispondente
8. **Self-learning data** — counter di invocazioni loggate + linee in `lessons-learned.md`

Risultato finale:

```
Summary: <PASS> pass · <FAIL> fail · <WARN> warn
```

## Step 3 — Recovery

Se ci sono FAIL:

- **File missing** → ricreare a mano oppure ripristinare da git (`git checkout HEAD -- <path>`)
- **Bash syntax error** → fix manuale + retry
- **Commands ↔ files mismatch** → `/studio:doctor --apply` può tentare regenerazione (presto)
- **JSON parse error** → fix manuale + retry

Se ci sono solo WARN:

- skill è funzionante, miglioramenti opzionali
- es. `chmod +x` mancante → `--apply` lo applica

## Step 4 — Modalità learn

`/studio:doctor --learn` mostra:

- Total invocations registrate in `.logs/usage.jsonl`
- Top 5 command per frequenza
- Top 5 fallimenti (exit code != 0)
- Recent activity (ultime 5 entry)

Utilità: identificare pattern di uso reale → guidare bump version + nuovi check + nuovi gate.

## Cosa NON fare

- NON modificare manualmente `.logs/usage.jsonl` (è log append-only generato dagli script)
- NON committare `.logs/` (è gitignored)
- NON usare `--apply` senza prima vedere output diagnostic (per essere consapevole di cosa cambia)

## Riferimenti

- Script: `.claude/skills/studio/scripts/doctor.sh`
- Helpers: `.claude/skills/studio/scripts/_helpers.sh`
- Self-evolution doc: `.claude/skills/studio/references/self-evolution.md`
- Lessons: `.claude/skills/studio/references/lessons-learned.md`
- Skill principale: `.claude/skills/studio/SKILL.md`
