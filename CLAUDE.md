# Heuresys evo — Project Instructions (Claude Code)

> Repo: `heuresys-evo` (greenfield rewrite di `heuresys.com.evo` legacy).
> Path canonico: `/home/ubuntu/heuresys-evo/` (VM `oracle-vm-default`).
> Niente Cowork bootstrap, niente SESSION_REPORT, niente `.auto-memory/`. Quel framework è scope legacy.

## Session start protocol

All'inizio di ogni nuova sessione, **come primo atto** (prima di rispondere a qualsiasi
domanda dell'utente):

1. Leggi `.handoff/HANDOFF.md` per priorities + open questions correnti
2. Leggi `.handoff/PROJECT-STATE.md` per architettura/components/metrics
3. Scansiona `.handoff/auto/` per breadcrumbs più recenti del `HANDOFF.md` mtime — surface eventuali stati post-handoff
4. Verifica `git status -sb` (working tree clean? in sync con `origin/main`?)
5. Verifica `gh run list --branch main --limit 3` (CI verde?)
6. Saluta l'utente con: 1-line state recap + top 3 priorities (numerate) + open questions (se rilevanti)
7. Chiedi: "Continuiamo dalla todo #1, scegli un'altra priorità, o qualcosa di nuovo?"
8. **Aspetta direzione esplicita** prima di toccare codice o eseguire operazioni

Eccezione: salta il protocol solo se l'utente apre con un comando diretto e self-contained
(es. `git status`, `npm test`, una domanda specifica su un file). In quei casi rispondi
diretto, ma cita comunque eventuali priority bloccanti dal HANDOFF se rilevanti.

A fine sessione, attivare la skill `handoff` (alias: "chiudi sessione", "fine sessione",
"/handoff") che aggiorna i 4 file `.handoff/{HANDOFF,PROJECT-STATE,PROJECT-LOG,CHANGELOG}.md`

- snapshot dated.

## Mission

Piattaforma SaaS B2B di Organizational Intelligence & Workforce Orchestration. Layer ontologico tra ERP/HR/BI per governare processi, struttura, ruoli, competenze e performance via Knowledge Graph ESCO bilingue (IT/EN).

## Stack

| Layer       | Tech                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| Workspace   | npm workspaces (Node ≥20, npm ≥10) — vedi `docs/20-architecture/monorepo-workspace-strategy.md`            |
| API Gateway | Express 5 + zod (port 8200) — `services/api-gateway`                                                       |
| Frontend    | Next.js 16 + React 19 + Tailwind 4 (port 3200) — `services/app`                                            |
| Workers     | BullMQ + Redis — `services/enrichment`                                                                     |
| UI Library  | Shadcn base + Cantiere B v2 (180 components) — `packages/ui`                                               |
| ORM         | Prisma 5.22 (566 modelli, schema in `services/app/prisma/schema.prisma`) — bump 6/7 deferred, vedi HANDOFF |
| DB          | PostgreSQL 16 bare-metal (5432) — distinto dal legacy heuresys.com.evo che usa 5433 (container)            |
| Cache/Queue | Redis (6380)                                                                                               |
| Auth        | NextAuth v4 (Credentials + bcryptjs)                                                                       |
| Test        | Vitest 4 in api-gateway/app/ui/shared/enrichment (250 test, S8 fix workspace)                              |
| Lint/Format | ESLint 9, Prettier, Husky + lint-staged + commitlint                                                       |

## Comandi quotidiani

```bash
# Dev (tutti i workspace in parallelo)
npm run dev --workspaces --if-present

# Build mirato
npm run build --workspace=services/api-gateway

# Typecheck globale (pre-commit hook)
npx tsc --noEmit -p tsconfig.base.json

# Test
npm test --workspace=services/api-gateway

# Prisma
cd services/app && npx prisma migrate dev --name <desc>   # development
cd services/app && npx prisma migrate deploy              # production
cd services/app && npx prisma migrate status              # drift check
```

Vedi `docs/30-developer/prisma-migration-workflow.md` per workflow completo.

## Domini & routing (VM `oracle-vm-default`, IP 80.225.82.207)

| Dominio                                                          | Repo                                     | Stack   | Frontend port | API port | DB port           |
| ---------------------------------------------------------------- | ---------------------------------------- | ------- | ------------- | -------- | ----------------- |
| `evo.heuresys.com` (HTTPS)                                       | `/home/ubuntu/heuresys-evo` (questo)     | systemd | 3200          | 8200     | 5432 (bare-metal) |
| `www.heuresys.com`, `heuresys.com` (HTTPS — pending DNS+certbot) | `/home/ubuntu/heuresys.com.evo` (legacy) | Docker  | 3012          | 8012     | 5433 (container)  |

Tutto ciò che si sviluppa in questo repo deve essere servito da `evo.heuresys.com`.
Il legacy resta intoccato: stesso server, ports diverse, repo separato.

nginx vhosts in `/etc/nginx/sites-available/`:

- `evo.heuresys.com.conf` (active) → `/api/auth/` su 3200, `/api/` su 8200, `/` su 3200
- `www.heuresys.com.conf` (preparato, attivabile via `scripts/enable-www-vhost.sh` dopo DNS update)

## Stato attuale (2026-05-04, S10)

- **Pagine Next.js evo**: 5 (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`)
- **Endpoint Express evo**: 8+ (4xx-aware, scaffolding + alcuni operativi)
- **Test totali**: 250 verdi (5 workspace, 100% passing)
- **RLS policies**: 605 attive · **RBP role-area-permission joins**: 326
- **`packages/ui`**: ~180 component, Storybook 9 (84 stories), pubblicato su GitHub Pages (workflow `Storybook Deploy` S10)
- **Vulnerabilità npm audit**: 0 (S8 supply chain hardening)
- **Repo visibility**: PUBLIC (S9 flip post billing-exhaust). Branch protection attiva su `main` (S10): 7 required checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`) + linear history + no force push + no deletion. `enforce_admins=false`. Auto-merge + `allow_update_branch` enabled
- **Migration parity legacy**: vedi `docs/30-developer/feature-parity-tracking.md`
- **Strategia migration**: PET-driven, vedi `docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md` (Phase 6 cutover-event CANCELLATA, sostituita da Phase 6+ progressive Tier 1 port)

## Multi-tenant & RBP (sintesi)

- **4 tenant** seedati: Heuresys System (platform), RTL Bank (test), SmartFood, EcoNova
- **8 ruoli RBP**: SUPERUSER (-1), TENANT_OWNER (0), IT_ADMIN (1), HR_DIRECTOR (2), HR_MANAGER (3), DEPT_HEAD (4), LINE_MANAGER (5), EMPLOYEE (6)
- **33 functional areas** (`rbp_functional_areas`) + **47 PET mapping** (Process/Enterprise/Talent)
- Authorization data-driven: `@RequirePermission('AREA', 'ACTION')` (mai `requireRole`)
- RLS attiva DB-level (P5)

## Principi P1-P10 (vincolanti per ogni PR)

1. **P1** Multi-tenant always — `tenantId` in ogni query
2. **P2** Auth-required default — endpoint pubblici sono eccezione esplicita
3. **P3** RBP enforced — `requirePermission`, mai bypass
4. **P4** Audit logged — `audit_logs` insert per write operations
5. **P5** RLS DB-level — policy attive su tutte le tabelle tenant-scoped
6. **P6** No raw SQL injection — solo Prisma o `$queryRaw` con tagged template
7. **P7** Validated input — zod schema per ogni DTO (vedi `docs/30-developer/dto-validation-with-zod-or-class-validator.md`)
8. **P8** Error logged — Pino + Sentry, mai `console.log` in prod path
9. **P9** Everything data-driven — ruoli, permessi, navigazione, perspective: tutto in DB
10. **P10** Multi-level Platform/Tenant — config supporta `tenantId NULL` (Platform) e `tenantId <uuid>` (Tenant)

## Convenzioni commit (commitlint)

Conventional Commits con scope obbligatorio:

```
<type>(<scope>): <subject>

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`.
Scope: `api-gateway`, `app`, `enrichment`, `ui`, `shared`, `db`, `infra`, `docs`, `repo`.

Esempi:

- `feat(api-gateway): add EmployeeModule with CRUD endpoints`
- `fix(app): resolve hydration mismatch in dashboard widget`
- `chore(repo): bump prisma to 6.0.1`

`commitlint.config.cjs` enforce. Pre-commit hook in `.husky/`.

## Documenti strategici di riferimento

- `docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md` — strategia di porting dal legacy
- `docs/_meta/governance-evo.md` — governance progetto (decisioni, ADR index)
- `docs/20-architecture/monorepo-workspace-strategy.md` — npm workspaces, no Turborepo
- `docs/30-developer/typescript-strict-evo.md` — TS strict, zero `any`
- `docs/30-developer/nextjs-app-router-conventions.md` — RSC, Server Actions, parallel routes
- `docs/30-developer/dto-validation-with-zod-or-class-validator.md` — zod + nestjs-zod
- `docs/30-developer/prisma-migration-workflow.md` — migrate dev/deploy, baseline, drift
- `docs/30-developer/feature-parity-tracking.md` — tracker 33 aree legacy → evo

## Quando fare PR

- Branch da `main`, naming: `<type>/<short-desc>` (es. `feat/employee-module`)
- 1 PR = 1 funzionalità coerente. PR multi-scope vanno splittate.
- Checklist PR description: P1-P10 review, test aggiunti, parity tracker aggiornato (se area in scope), `migrate status` clean, `tsc --noEmit` green.
- Niente force-push su `main`. Niente `--no-verify`.
