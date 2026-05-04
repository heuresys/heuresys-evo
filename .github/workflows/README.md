# GitHub Actions Workflows

Pipeline CI/CD del progetto. Workflow consolidati post-S11 (PR #A workflow consolidation):
4 active workflow + 1 composite action sharing setup.

## Workflow attivi

| Workflow        | Trigger                                  | Jobs                                            | Scope                                                                  |
| --------------- | ---------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `quality.yml`   | PR + push su `main`                      | `lint`, `typecheck`, `test`, `build-workspaces` | Quality gates per tutti i `services/*` e `packages/*`                  |
| `security.yml`  | PR + push + cron `17 3 * * *` + dispatch | `gitleaks`, `npm-audit`, `semgrep`              | Secret scan + dependency audit + SAST                                  |
| `storybook.yml` | PR + push se cambia `packages/ui/**`     | build + deploy GH Pages                         | UI library docs published a `https://heuresys.github.io/heuresys-evo/` |

Tutti i workflow heavy (eccetto `gitleaks`) implementano fast-path `handoff-only-detect`:
PR che toccano solo `.handoff/**` o root `CHANGELOG.md` ottengono check verdi in <60s
invece di ~3 min wall time, mantenendo branch protection 7 check verdi.

## Composite actions

| Action                | Used by                                                     | Scope                                                               |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `setup-node-prisma`   | `quality.yml` (4 jobs), `security.yml` (npm-audit)          | DRY checkout + Node 20 + npm@11 + npm ci + Prisma generate (cached) |
| `handoff-only-detect` | `quality.yml` (4 jobs), `security.yml` (npm-audit, semgrep) | Fast-path detection per PR docs-only                                |

## Branch protection (post PR #D)

`main` esige 4 check **mandatory** prima del merge:

- `lint`, `typecheck`, `test`, `gitleaks`

E 3 check **optional** (girano + report ma non bloccano):

- `build-workspaces`, `npm-audit`, `semgrep`

Razionale documentato in **ADR-0021** (replaces ADR-0019 strict-7).

## Convenzioni

- I template di workflow non ancora attivati vivono in `docs/runbooks/future-deployments-examples.md` (non come `.yml.example` nella dir workflows, evita confusione con i workflow attivi)
- Secret in GitHub Settings → Secrets → Actions, mai hardcoded
- Path-based filtering (`paths:` in trigger) per evitare run inutili sui monorepo
- Cache npm via `actions/setup-node@v6` con `cache: 'npm'` (centralizzato in composite `setup-node-prisma`)
- Cache Prisma generate output via `actions/cache@v4` (centralizzato in composite, key su lockfile + schema hash)

## Workflow non previsti (out of scope corrente)

- Deploy `services/enrichment/` — workflow separato quando il servizio è pronto
- E2E completi cross-service — possibile workflow `e2e.yml` schedulato (notturno o pre-release)
- Release tagging automatico — quando il versioning si stabilizza

Template per `deploy-app-api` e `deploy-marketing` in `docs/runbooks/future-deployments-examples.md`.

## Note PostgreSQL

PostgreSQL è **bare-metal** (vedi `db/README.md`). Per i job di test che richiedono DB:

- Opzione A: Postgres reale di test esposto via secret `DATABASE_URL_TEST`
- Opzione B: PG provisionato a runtime (testcontainers-node)
- ❌ NON usare un service container Postgres "permanente" nel workflow (incoerente con la decisione architetturale)
