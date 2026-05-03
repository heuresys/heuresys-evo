---
description: 'Security baseline — always loaded'
---

# Security Baseline

Heuresys evo enforces 10 binding principles (P1-P10) defined in `CLAUDE.md` (project root). This file expands the security-critical subset (P1, P3, P4, P5, P6, P7, P8) with concrete enforcement rules. Always read alongside `CLAUDE.md`.

## Multi-tenant (P1)

- **Every** Prisma query touching tenant-scoped tables must include `tenantId` in `where` clause
- Never trust a tenantId derived from request body alone — always verify against authenticated session (`session.user.tenantId`)
- Cross-tenant lookups (e.g. SUPERUSER admin views) require explicit `requirePermission('PLATFORM', 'CROSS_TENANT_READ')` check
- Test: write at least one test per endpoint that asserts NO data leakage when querying with wrong tenantId

## Authorization (P3)

- Use `@RequirePermission('AREA', 'ACTION')` decorator on every NestJS controller method
- **Never** `requireRole('SUPERUSER')` or similar — RBP is data-driven (P9), checks must be against the 33 functional areas defined in `rbp_functional_areas`, not hardcoded roles
- Frontend: gate UI elements via `usePermission('AREA', 'ACTION')` hook (mirrors backend decorator semantics)
- Public endpoints are explicit exceptions documented with `@Public()` decorator + reason comment

## Audit logging (P4)

- All write operations (INSERT/UPDATE/DELETE) must produce an `audit_logs` row before transaction commit
- Audit row includes: `tenant_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before`, `after`, `metadata`, `ip_address`, `user_agent`
- Use `auditedTransaction()` helper instead of raw `prisma.$transaction()` to ensure audit row write is atomic with business mutation
- Read operations on sensitive entities (employees PII, salaries) also audited via dedicated middleware

## RLS DB-level (P5)

- Postgres Row Level Security enabled on every tenant-scoped table
- Policies enforce `tenant_id = current_setting('app.current_tenant_id')::uuid`
- App layer must `SET LOCAL app.current_tenant_id = '<uuid>'` at start of every transaction
- New tables added: must include RLS policy in same migration that creates the table (no migration goes through without RLS for tenant-scoped tables)

## Secrets (P6 + general)

- Secrets must never appear in committed files
- Use environment variables; reference them in code, never hardcode
- `.env` is gitignored; `.env.example` contains only placeholder values
- Pre-commit hook (`.husky/pre-commit`) runs gitleaks-lite secret scan; never bypass with `--no-verify`
- Token rotation: see `~/.claude/memory/token_vault_hygiene_TODO.md` for cross-project vault management

## Input handling (P6 + P7)

- Validate all input crossing a trust boundary (HTTP, file upload, IPC) with **zod** schemas (P7 + `nestjs-zod`)
- Use parameterized queries for any database access (Prisma `$queryRaw` only with tagged templates: `$queryRaw\`SELECT ... WHERE id = ${id}\``)
- Escape output appropriate to the target context (HTML, shell, SQL)
- File uploads: validate MIME + magic bytes (not just extension), enforce size limits, scan for embedded scripts

## Output and logging (P8)

- Never log credentials, tokens, full personal identifiers, or session cookies
- Use **Pino** structured logger with redaction of sensitive fields (`password`, `token`, `cookie`, `Authorization`)
- Error responses to clients must not leak internal details (paths, stack traces, query structure)
- Sentry integration: server-side errors include sanitized context only; client-side errors strip user PII before transport
- `console.log` is forbidden in production code paths (P8 enforcement via lint rule)

## Cross-references

- Project principles full text: `D:\evo.heuresys.com\CLAUDE.md` sezione "Principi P1-P10 (vincolanti per ogni PR)"
- Pre-commit safety: `.husky/pre-commit` (lint-staged + gitleaks)
- Audit examples: `db/seeds/audit-examples.sql`
- RBP areas reference: `rbp_functional_areas` table + `docs/30-developer/rbp-permissions.md`
