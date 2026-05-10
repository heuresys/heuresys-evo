# Governance Evo — Quick Reference

**Status**: Active (last reviewed 2026-05-04, S10)
**Scope**: principi P1-P10 + RBP + PET + decoupling da CLAUDE.md root legacy. Onboarding in ≤30 min.
**Audience**: nuovi dev evo, reviewer PR, architect.

> ⚠️ **Open issue (S10)**: la formulazione P1-P10 in questo doc differisce da quella in `CLAUDE.md` root (es. P4 qui = "RLS first", P4 in CLAUDE.md = "Audit logged"). Da consolidare in S11: scegliere canonical formulation tra `CLAUDE.md`, questo doc e `docs/10-strategy/migration-strategy-pet-driven.md` §Governance, e propagare.

## Principi P1-P10

Sintesi (full text in `docs/10-strategy/migration-strategy-pet-driven.md` §Governance):

| #   | Principio                                        | Implicazione operativa evo                                                                     |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| P1  | Capability Governance multi-tenant               | Ogni feature scoped a `tenant_id`, niente concept "globale" senza esplicito `Platform`         |
| P2  | Three lenses PET (Process / Enterprise / Talent) | UI navigation organizzata per lens, area può essere mappata a >1 lens (PRIMARY + SECONDARY)    |
| P3  | RBP authorization data-driven                    | Mai hardcode `if (role === 'ADMIN')`. Sempre `requirePermission(area, action)`                 |
| P4  | RLS first                                        | 605 RLS policies attive su tabelle tenant-scoped (S10 baseline). Bypass solo SUPERUSER + audit |
| P5  | Type safety end-to-end                           | Prisma generated types fino al frontend (zod schema condivisi via `packages/ui`)               |
| P6  | Async-first                                      | Job lunghi su BullMQ (`services/enrichment`), no sync HTTP >2s                                 |
| P7  | Observability obbligatoria                       | Pino structured logs + OpenTelemetry traces + Prometheus metrics. Niente `console.log`         |
| P8  | Fail loud, recover graceful                      | Exception filters globali, error_code univoci, mai swallow silenziosi                          |
| P9  | Everything data-driven via DBMS                  | Ruoli, navigation, widget, perspectives, prompts: tutto in tabelle. Zero array hardcoded       |
| P10 | Multi-level Platform/Tenant                      | Ogni config supporta scope Platform (`tenant_id IS NULL`) e scope Tenant (`tenant_id = X`)     |

Derogations D1-D4 (TBD: ricostruire elenco completo da `docs/10-strategy/migration-strategy-pet-driven.md` Sezione 0 quando portata in evo).

## PET — 47 mapping aree × lenti

3 perspectives in `rbp_perspectives` (DBMS):

- **Process** — focus su flussi, pipeline, blueprint
- **Enterprise** — focus su organization design, systems, governance
- **Talent** — focus HR, persone, competenze, sviluppo

47 mapping in `rbp_area_perspectives` (PRIMARY + SECONDARY). Esempi:

| Area              | PRIMARY    | SECONDARY  |
| ----------------- | ---------- | ---------- |
| `EMPLOYEES`       | Talent     | Enterprise |
| `ORG_DESIGN`      | Enterprise | Process    |
| `HIRING_PIPELINE` | Process    | Talent     |
| `ESCO_BROWSER`    | Talent     | —          |
| `KG_GRAPH`        | Enterprise | Talent     |

Query attuale (DB live):

```sql
SELECT a.code, p.code AS lens_code, ap.priority
FROM rbp_area_perspectives ap
JOIN rbp_areas a ON a.id = ap.area_id
JOIN rbp_perspectives p ON p.id = ap.perspective_id
ORDER BY a.code, ap.priority;
```

Frontend usa `usePerspectiveAreas(lensCode)` hook che chiama `/api/v1/perspectives/:code/areas`.

## RBP — 8 ruoli + scope rules + field policies

### 8 ruoli (level decrescente)

| Code         | Level | Scope tipico             |
| ------------ | ----- | ------------------------ |
| SUPERUSER    | -1    | Platform-wide, BYPASSRLS |
| TENANT_OWNER | 0     | Full tenant              |
| IT_ADMIN     | 1     | Configurazione tenant    |
| HR_DIRECTOR  | 2     | Tenant HR scope          |
| HR_MANAGER   | 3     | Department HR scope      |
| DEPT_HEAD    | 4     | Department               |
| LINE_MANAGER | 5     | Team (direct reports)    |
| EMPLOYEE     | 6     | Self                     |

Alias legacy mantenuti: `SYSADMIN → TENANT_OWNER`, `ADMIN → TENANT_OWNER`. Da rimuovere a fine cutover.

### 6 scope rules (`rbp_scope_rules`)

`PLATFORM` | `TENANT` | `DEPARTMENT` | `HIERARCHY` | `TEAM` | `SELF`

Determinano la `WHERE clause` aggiuntiva applicata da `getScopeCondition(role, area)`. Esempio: `HR_MANAGER + EMPLOYEES + DEPARTMENT` → `WHERE department_id IN (SELECT id FROM org_units WHERE manager_id = $userId)`.

### 3 field policies (`rbp_field_policies`)

`SHOW` (default) | `MASK` (es. salary → `***`) | `HIDE` (omesso da response). Applicate via `class-transformer` interceptor che legge policy dal DBMS prima di serializzare.

## Decoupling da CLAUDE.md root legacy

Il `CLAUDE.md` di `/home/ubuntu/heuresys.com.evo/` è **Cowork-specific** (workspace orchestrator per Enzo). L'evo NON eredita quel contesto. Specificamente l'evo NON adotta:

- Protocollo Cowork ↔ CLI (PROMPT/PLAN/EXEC/REPORT/REVIEW): non applicabile a green-field
- Bootstrap GATE 0-5 della session-start.md: era specifico al workspace Cowork con `.auto-memory/` SoT
- Sandbox-Transient/Workspace-Persistent semantics: l'evo è codice puro, no scratchpad cross-session
- Path autoritativi `cowork-meta/`, `blueprints/`, `.auto-memory/`: l'evo usa `docs/` strutturata + git history come SoT
- Commit signature `[CLI] tipo(scope)`: l'evo usa Conventional Commits standard (`feat:`, `fix:`, `docs:`)

Cosa l'evo eredita dal legacy:

- Architettura RBP framework (porting integrale, vedi `auth-nestjs-pattern.md`)
- ESCO Knowledge Graph (DBMS condiviso)
- Schema DB Postgres (566 modelli Prisma post db pull 2026-05-02)
- 4 tenants attivi (heuresys, rtl-bank, smartfood, econova)
- Principi P1-P10 e PET concept

Cosa l'evo NON eredita:

- Express 5 stack → sostituito con NestJS 10
- Dual pool pg con `set_config` session-level → sostituito con Prisma + middleware AsyncLocalStorage
- Auth custom + NextAuth v5-beta → semplificato a `@nestjs/passport` + NextAuth v4
- `dc.sh` wrapper Docker (legacy) → eliminato; runtime evo è bare-metal systemd, niente container (vedi ADR-0001 + ADR-0023)
- Estensione monolite con 12 modules in un singolo workspace → 4 workspace separati

## Quick reference per onboarding sviluppatore

1. Clone repo, `pnpm install` in root.
2. Leggere in ordine:
   - `docs/10-strategy/migration-strategy-pet-driven.md` (§Governance + §Tier list)
   - `docs/20-architecture/nestjs-module-conventions.md`
   - `docs/20-architecture/prisma-data-access-pattern.md`
   - `docs/20-architecture/rls-with-prisma-pattern.md`
   - `docs/20-architecture/auth-nestjs-pattern.md`
   - `docs/20-architecture/api-versioning-strategy.md`
   - `docs/20-architecture/cutover-strategy-evo.md`
   - questo file (`governance-evo.md`)
3. Setup DB locale: `make db-up` (docker-compose con seed 4 tenant + RBP base).
4. Run `services/api-gateway`: `pnpm --filter api-gateway dev`. Endpoint health: `http://localhost:8012/health`.
5. Run `services/app`: `pnpm --filter app dev`. http://localhost:3012, login con credenziali demo (`docs/_meta/dev-credentials.md` — TBD).
6. Prima PR: piccola feature in area `EMPLOYEES`, applicare full guards (Jwt + Tenant + Rbp), test integration con RLS rollback pattern.

## Riferimenti

- `docs/10-strategy/migration-strategy-pet-driven.md` — full text P1-P10, Tier list, derogations
- `docs/_meta/migration-doc-audit.md` — audit doc legacy
- `docs/90-archive/migration-bootstrap/dbms-cookbook.md` — query reali DBMS
- Legacy `CLAUDE.md` root — riferimento storico, non vincolante per evo
