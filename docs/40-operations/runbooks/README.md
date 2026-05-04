# Runbooks

Operational runbooks per `heuresys-evo`. Ogni runbook copre uno scenario specifico con steps eseguibili, rollback e validation.

## Index (file presenti)

- [`db-reset.md`](./db-reset.md) — reset DB di test (locale + CI)
- [`rollback.md`](./rollback.md) — rollback di una phase RTGB o di un commit
- [`storybook-deploy.md`](./storybook-deploy.md) — deploy Storybook su GitHub Pages
- [`future-deployments-examples.md`](./future-deployments-examples.md) — template YAML per deploy non ancora attivati (app+api, marketing)

## Runbook deferred (non ancora scritti)

- `deploy.md` — deploy su VM OCI (post-cutover, prossima sessione)
- `rotate-secrets.md` — rotation AUTH_SECRET / DB pwd / API keys
- `monitoring-bootstrap.md` — setup Prometheus + Grafana

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
