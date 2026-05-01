# Runbooks

Operational runbooks per `heuresys-evo`. Ogni runbook copre uno scenario specifico con steps eseguibili, rollback e validation.

## Index

- [`db-reset.md`](./db-reset.md) — reset DB di test (locale + CI)
- [`deploy.md`](./deploy.md) — deploy su VM OCI (post-cutover)
- [`rollback.md`](./rollback.md) — rollback di una phase RTGB o di un commit
- [`rotate-secrets.md`](./rotate-secrets.md) — rotation di AUTH_SECRET / DB pwd / API keys
- [`monitoring-bootstrap.md`](./monitoring-bootstrap.md) — setup Prometheus + Grafana (deferred, B11+)

## Convenzioni runbook

Ogni file contiene:

1. **Scenario** — quando applicare
2. **Prerequisiti** — credenziali, env, accessi
3. **Steps** — comandi numerati, verbatim copy-pasteable
4. **Validation** — comandi che dimostrano successo
5. **Rollback** — come tornare allo stato pre-runbook
6. **Common pitfalls** — errori tipici + workaround

## Note

I runbooks sono _testati operativi_ — se trovi un comando che non funziona, aggiorna il runbook nello stesso commit del fix. Mai lasciare runbook stale che inducono in errore.
