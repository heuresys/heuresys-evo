# Contributing to heuresys-evo

> Workflow di contribuzione per il greenfield evo. Per onboarding base vedi `docs/30-developer/onboarding.md`.

## Branch & commit workflow

L'evo è autonomous-mode (Cantiere B): si committa direttamente su `main` per RTGB tasks. Per work non-RTGB:

1. **Branch naming**: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`
2. **Commit signature**:
   - **RTGB**: `[RTGB][PH<N>-T<M>] <type>: <subject>` (es. `[RTGB][PH4-T2] security: add CSRF middleware`)
   - **Conventional**: `<type>(<scope>): <subject>` (es. `feat(api): add /employees endpoint`)
3. **Tipi accettati** (commitlint): `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `deps`, `config`, `security`, `adr`, `schema`, `ui`, `story`, `tokens`, `obs`, `migration`, `a11y`
4. **Pre-commit gate** automatico (husky):
   - lint-staged → prettier su file staged
   - secret scan inline (PEM, sk-/gho*/ghp*/AKIA/Slack tokens)
   - schema-drift check se `prisma/schema.prisma` staged + `DATABASE_URL` set
5. **Commit-msg gate**: regex valida signature; reject su mismatch

## ADR process

Per qualsiasi decisione architetturale con impact > 1gg di lavoro:

1. Crea `docs/50-reference/decisions/NNNN-<slug>.md` con next number
2. Sezioni obbligatorie:
   - **Status** (Proposed / Accepted / Superseded by ADR-XXXX / Deprecated)
   - **Date** (YYYY-MM-DD)
   - **Authors**
   - **Phase** (RTGB phase if applicable)
   - **Context** (forces, vincoli)
   - **Decision** (cosa si è scelto)
   - **Alternatives considered** (cosa è stato rifiutato e perché)
   - **Consequences** (positive + negative)
   - **References**
3. ADR template + numbering automatico via tooling: `docs/50-reference/decisions/0001-postgresql-bare-metal.md` come reference style.
4. Status iniziale `Proposed` → diventa `Accepted` quando il commit relativo è merged.
5. Supersede esplicito: il nuovo ADR ha `**Supersedes**: ADR-XXXX` + il vecchio aggiorna `Status` a `Superseded by ADR-NEW`.

## Test gate

Prima di mergeare:

- [ ] `npm run typecheck` — 0 errori
- [ ] `npx vitest run` — 100% pass
- [ ] `npm run test:e2e` (dove rilevante)
- [ ] Coverage non scende sotto threshold (vitest.config.ts per workspace)
- [ ] A11y test verde (`jest-axe`) per ogni nuovo componente UI

## Release process

L'evo non pubblica package npm; le release sono deployment events sulla VM OCI.

1. Tag SemVer: `git tag v0.x.y` quando si vuole snapshot per rollback
2. Tag RTGB phase: `rtgb/phase<N>/done` quando una phase Cantiere B è chiusa
3. Tag milestone: `rtgb/v1.0-evo-hardened` per closure finale Cantiere B
4. Deployment manuale (post-cutover) — vedi runbook `docs/40-operations/runbooks/deploy.md`

## File modificati ad alto impact

| File                               | Chi può toccarlo             | Note                                        |
| ---------------------------------- | ---------------------------- | ------------------------------------------- |
| `package.json` workspace top-level | Cantiere B (RTGB) o consenso | Cambia surface deps cross-workspace         |
| `services/*/prisma/schema.prisma`  | Owner del service            | Deve passare `prisma-verify`                |
| `db/migrations/*.sql`              | Owner della migration        | Append-only, no edit di migration applicate |
| `docs/50-reference/decisions/*`    | Author dell'ADR              | Aggiorna `Status` quando supersede          |
| `.husky/*`                         | Cantiere B                   | Modifiche affettano tutti i committers      |
| `.github/workflows/*`              | Cantiere B                   | Test su feature branch prima di main        |

## Communication

- **Bug critici / security**: aprire issue con label `urgent` (privato repo)
- **Domande architettura**: leggi prima `docs/50-reference/decisions/`, poi apri issue label `question`
- **Roadmap RTGB**: `/home/ubuntu/heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md`

## Code style enforcement

- **Prettier**: `printWidth 100`, `singleQuote`, `semi`, `trailingComma es5`, `lf` line endings
- **TypeScript strict**: `noUncheckedIndexedAccess: true`, type-only imports preferred
- **Imports order**: built-in → external → `@heuresys/*` → relative → side-effect (eslint-plugin-import quando attivato)
- **No console.log** in prod paths (eslint warning)
- **Zod boundary**: ogni endpoint pubblico parsa input via Zod schema

## Locali Claude Code

`CLAUDE.md` (root) contiene istruzioni operative per AI assistants. Edit con consenso del team.

## License

UNLICENSED proprietary. Tutti i contributi assumono cessione all'organizzazione Heuresys.
