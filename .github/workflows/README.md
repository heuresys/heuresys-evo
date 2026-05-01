# GitHub Actions Workflows

Pipeline CI/CD del progetto. I workflow stub hanno suffisso `.example` per evitare run accidentali finché non sono completati.

## Workflow previsti

| Workflow | Trigger | Scope |
|---|---|---|
| `ci.yml` | PR + push su `main` | Lint + typecheck + test (unit + integration) per tutti i `services/*` e `packages/*` |
| `deploy-marketing.yml` | Push su `main` se cambia `services/marketing/**` | Build + deploy landing su Vercel (CDN statico) |
| `deploy-app-api.yml` | Push su `main` se cambia `services/app/**` o `services/api-gateway/**` | Build + push artefatti + SSH deploy su VM OCI dietro Nginx |

## Convenzioni
- Workflow stub vivono come `.yml.example` finché non sono pronti
- Quando completati, si rinominano rimuovendo `.example`
- Secret in GitHub Settings → Secrets → Actions, mai hardcoded
- Path-based filtering (`paths:` in trigger) per evitare run inutili sui monorepo
- Matrix strategy quando i job sono identici across services
- Cache npm via `actions/setup-node@v4` con `cache: 'npm'`

## Workflow non previsti (out of scope iniziale)
- Deploy `services/enrichment/` — workflow separato quando il servizio è pronto
- E2E completi cross-service — possibile workflow `e2e.yml` schedulato (notturno o pre-release)
- Release tagging automatico — quando il versioning si stabilizza

## Note PostgreSQL
PostgreSQL è **bare-metal** (vedi `db/README.md`). Per i job di test che richiedono DB:
- Opzione A: Postgres reale di test esposto via secret `DATABASE_URL_TEST`
- Opzione B: PG provisionato a runtime (testcontainers-node)
- ❌ NON usare un service container Postgres "permanente" nel workflow (incoerente con la decisione architetturale)
