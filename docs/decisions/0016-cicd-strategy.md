# ADR-0016: CI/CD strategy (B10)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B10

## Context

Il greenfield evo è ospitato su GitHub mirror privato (ADR-0005). I gates CI devono coprire 4 dimensioni: type-safety, test coverage, security scan, build viability. Senza CI, ogni regression viene scoperta in dev runtime — costoso quando il deploy è singola VM.

## Decision

Stack CI a 3 workflow + 1 dependabot, eseguiti via GitHub Actions su `ubuntu-latest`:

### 1. `.github/workflows/ci.yml` — quality gate

Trigger: push to main, pull request to main.

Job:

- `lint` — `npm run lint --workspaces --if-present`
- `typecheck` — `npm run typecheck --workspaces --if-present`
- `test` — `npm run test:unit` + `npm run test:integration` (con secret `DATABASE_URL_TEST`)
- Service container: redis 7-alpine (per integration tests che usano BullMQ-equivalent)
- Postgres NON containerizzato in CI (vedi ADR-0001) — usa secret `DATABASE_URL_TEST` verso istanza managed o testcontainers-node on-demand

### 2. `.github/workflows/build.yml` — build viability

Trigger: push to main, pull request to main.

Job: `npm run build --workspaces --if-present` con `NEXT_TELEMETRY_DISABLED=1`. Verifica che ogni service compili (Express bundle + Next.js builds + Storybook static).

### 3. `.github/workflows/security.yml` — security scan

Trigger: push to main, pull request to main, daily cron `17 3 * * *`, manual dispatch.

Jobs:

- `gitleaks` — `gitleaks-action@v2` con `fetch-depth: 0` (full git history scan)
- `npm-audit` — `npm audit --omit=dev --audit-level=high` + JSON artifact upload (30-day retention)
- `semgrep` — `semgrep ci` con `p/owasp-top-ten p/typescript p/javascript p/secrets`

### 4. `.github/dependabot.yml` — dep upgrades

Schedule:

- npm: weekly Monday 06:00 Europe/Rome, max 5 PRs, increase-if-necessary versioning
- github-actions: monthly

Grouping: `@types/*`, `vitest/*`, `@testing-library/*`, `@storybook/*`, `eslint-*` (riduce PR noise).

### Branch protection

Manual setup post-MVP traffic (deferred):

```bash
gh api repos/heuresys/heuresys-evo/branches/main/protection \
  -X PUT \
  -f required_status_checks.contexts[]='ci.lint-typecheck-test' \
  -f required_status_checks.contexts[]='build.build-workspaces' \
  -f required_status_checks.contexts[]='security.gitleaks' \
  -f enforce_admins=false \
  -f required_pull_request_reviews=null \
  -f restrictions=null
```

Pre-MVP: branch protection NON abilitata (autonomous-mode push diretto).

## Alternatives considered

- **GitHub-hosted vs self-hosted runners**: rejected self-hosted — costo gestione runner + sicurezza non giustificato.
- **Workflow monolitico singolo `ci.yml`**: rejected — split per concern permette skip selettivo (es. security ogni day, ci ogni push).
- **Trivy invece di Semgrep**: complementare, non sostitutivo. Semgrep coverage TS/JS specifica; Trivy potrebbe aggiungersi in futuro.
- **Renovate invece di Dependabot**: equivalent, Dependabot è native GitHub e zero-config.

## Consequences

Positive:

- Pre-merge gate completo (typecheck + test + build + security).
- Daily cron security scan cattura advisory pubblicate dopo merge.
- Dependabot grouping riduce churn: ~3-5 PRs/week vs ~20 senza grouping.
- Storybook deploy NON in CI (deferred B10.4) — compile-only check sufficiente per ora.

Negative:

- Tempo CI cumulato ~5-7 min per PR. Ottimizzazioni future: matrix split, caching aggressivo.
- npm audit fail noisy con upstream advisories non risolvibili (vedi ADR-0009 npm audit state).
- Semgrep richiede `SEMGREP_APP_TOKEN` secret per platform features (free tier abbastanza per pubblico).

## Smoke validation

- `ci.yml` esistente al boot evo, preservato verbatim (vedi commit `[RTGB][PH2-T1]`)
- `build.yml`, `security.yml`, `dependabot.yml` aggiunti in B10.1-B10.6
- Manual trigger via `workflow_dispatch` testato post-push (verificabile via `gh workflow run`)

## Future work

- B10.4 storybook deploy preview (richiede B7+B8 completati — readyish)
- B10.5 branch protection enforcement (post-MVP traffic)
- Coverage report artifact su PR comment via `coverage-action` (B11+)
- Bundle size budget enforcement (size-limit) per services/app

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §15 Phase B10
- ADR-0005 GitHub mirror private
- GitHub Actions docs: https://docs.github.com/en/actions
- Semgrep ci: https://semgrep.dev/docs/semgrep-ci
- gitleaks-action: https://github.com/gitleaks/gitleaks-action
