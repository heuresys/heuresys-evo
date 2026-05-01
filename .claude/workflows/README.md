# Claude Code Workflows

Workflow multi-step ricorrenti, scritti come istruzioni per Claude Code.

A differenza degli skill (auto-invocati per match) e dei command (esecutivi single-shot), i workflow descrivono **procedure complesse** che attraversano più step e richiedono coordinamento.

## Naming convention
Un file `.md` per workflow, kebab-case, con prefisso azione:
- `ship-feature.md` — flow completo da branch a merge
- `add-migration.md` — creare + testare + applicare migration Postgres
- `deploy.md` — flow di deploy su VM OCI
- `rotate-secrets.md` — rotazione API key e DB credentials
- `onboard-developer.md` — setup workspace per nuovo dev

## Struttura suggerita per un workflow

```markdown
# Workflow: <nome>

## Quando usarlo
<trigger del workflow>

## Pre-requisiti
- <stato di partenza richiesto>

## Step
1. ...
2. ...
3. ...

## Verifiche post-execution
- <how to confirm success>

## Rollback
- <undo path se step intermedio fallisce>
```

## Differenza con skill/command

| Tipo | Quando | Dove vive |
|---|---|---|
| Skill | Auto-invocato su match descrizione | `.claude/skills/<name>/SKILL.md` |
| Command | Triggerato da `/<name>` esplicito | `.claude/commands/<name>.md` |
| Workflow | Procedura referenziata da utente o altro skill | `.claude/workflows/<name>.md` |

(nessun workflow definito ancora — aggiungine uno quando un pattern manuale si ripete >2 volte)
