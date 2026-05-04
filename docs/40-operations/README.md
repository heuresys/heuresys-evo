# 40-operations — playbooks, ops procedures, incident response

PLAYBOOK-level documentation: cosa fare quando in produzione.

## File index

| Doc                                                  | Scope                                                                                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`deploy-evo.md`](deploy-evo.md)                     | Deploy procedura su VM OCI (systemd)                                                                                                       |
| [`db-management-evo.md`](db-management-evo.md)       | DB ops: backup, restore, migration, monitoring                                                                                             |
| [`observability-nestjs.md`](observability-nestjs.md) | Pino structured logging + Prometheus metrics (NB: nome legacy "nestjs", stack reale **Express 5**; rename pendente a observability-evo.md) |
| [`incident-runbook-evo.md`](incident-runbook-evo.md) | Generic incident runbook (escalation, comms, triage)                                                                                       |
| [`runbooks/`](runbooks/)                             | Scenario-specific scripts                                                                                                                  |

## Runbooks scenario-specific

In [`runbooks/`](runbooks/):

- `db-reset.md` — reset DB di test (locale + CI)
- `rollback.md` — rollback di una phase RTGB o di un commit
- `storybook-deploy.md` — deploy Storybook su GitHub Pages
- `future-deployments-examples.md` — template YAML per deploy non ancora attivati

## When to add here

Use the decision tree in [`../_meta/doc-architecture.md`](../_meta/doc-architecture.md) Q4: "La doc è operational playbook?".

Per **come funziona** (non come fare): vedi [`../20-architecture/`](../20-architecture/).
Per **how-to** dev: vedi [`../30-developer/`](../30-developer/).

## See also

- [`../decisions/0013-observability-strategy.md`](../decisions/0013-observability-strategy.md) — ADR-0013
- [`../decisions/0001-postgresql-bare-metal.md`](../decisions/0001-postgresql-bare-metal.md) — ADR-0001
