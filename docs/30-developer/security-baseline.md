# Security Baseline — heuresys-evo

> **Status**: Canonical SoT for security operations + P1-P10 enforcement rules.
> **Source**: consolidated da `docs/30-developer/security-baseline.md` (RTGB B4.12 reference) + `.claude/rules/security.md` (P1-P10 enforcement) + cross-cutting concerns di `docs/20-architecture/overview.md`.
>
> **Status S11**: questo file è il SoT operativo. `.claude/rules/security.md` resta come thin pointer per loading automatico Claude Code CLI; le regole effettive vivono qui.

## Architettura defensive layers

```
+------------------------------------------------------------+
|  Browser                                                   |
|   |- HTTPS only (HSTS preload)                             |
|   |- CSP enforced (no inline scripts)                      |
|   '- SameSite=strict cookies (CSRF binding)                |
+------------------------------------------------------------+
              |
              v
+------------------------------------------------------------+
|  services/app (Next.js 16 + NextAuth v4)                   |
|   |- Cookie authjs.session-token (HttpOnly, SameSite=lax)  |
|   |- AUTH_SECRET shared with api-gateway                   |
|   '- Edge proxy.ts JWT check via getToken()                |
+------------------------------------------------------------+
              | HTTP request with cookie + X-CSRF-Token
              v
+------------------------------------------------------------+
|  services/api-gateway (Express 5)                          |
|   |- hardenedHelmet (CSP report-only, HSTS, ...)           |
|   |- rateLimitGeneral 100/15min, rateLimitAuth 10/5min     |
|   |- csrfHmac middleware (HMAC-bound CSRF)                 |
|   |- requireAuth (Auth.js v5 cookie validation)            |
|   |- tenant scope enforcement (header || JWT.tenantId)     |
|   '- Zod input validation                                  |
+------------------------------------------------------------+
              |
              v
+------------------------------------------------------------+
|  PostgreSQL                                                |
|   |- Role heuresys_app_user (no BYPASSRLS)                 |
|   |- FORCE ROW LEVEL SECURITY su tabelle tenant-aware      |
|   '- SET app.current_tenant_id per transazione             |
+------------------------------------------------------------+
```

## P1-P10 enforcement rules

I 10 principi (`CLAUDE.md` root sezione "Principi P1-P10") concretizzati in regole di codice. Validati in code review + tooling automatico (lint, typecheck, test, security scan).

### P1 — Multi-tenant always

- **Every** Prisma query touching tenant-scoped tables must include `tenantId` in the `where` clause
- Never trust a `tenantId` derived from request body alone — always verify against authenticated session (`session.user.tenantId`)
- Cross-tenant lookups (e.g., SUPERUSER admin views) require explicit `requirePermission('PLATFORM', 'CROSS_TENANT_READ')` check
- **Test**: write at least one test per endpoint that asserts NO data leakage when querying with wrong `tenantId`

### P3 — Authorization (RBP enforced)

- Use `requirePermission(area, action)` Express middleware on every protected route (api-gateway) and `usePermission` hook on every gated UI element (services/app)
- **Never** `requireRole('SUPERUSER')` or similar — RBP è data-driven (P9), checks vanno fatti contro le 33 functional areas in `rbp_functional_areas`, NON contro ruoli hardcoded
- Public endpoints sono eccezioni esplicite documentate con commento `@Public — reason: <why>`

### P4 — Audit logging

- All write operations (INSERT/UPDATE/DELETE) must produce an `audit_logs` row before transaction commit
- Audit row include: `tenant_id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `before`, `after`, `metadata`, `ip_address`, `user_agent`
- Use the `auditedTransaction()` helper instead of raw `prisma.$transaction()` per garantire atomicità audit + business mutation
- Read operations su entità sensibili (employees PII, salaries) anche audited via dedicated middleware

### P5 — RLS DB-level

- Postgres Row Level Security enabled on every tenant-scoped table
- Policies enforce `tenant_id = current_setting('app.current_tenant_id')::uuid`
- App layer must `SET LOCAL app.current_tenant_id = '<uuid>'` at start of every transaction
- New tables added: must include RLS policy in same migration that creates the table (no migration goes through without RLS for tenant-scoped tables)

### P6 — No raw SQL injection + secrets

- Use parameterized queries for any database access (Prisma `$queryRaw` only with tagged templates: `$queryRaw\`SELECT ... WHERE id = ${id}\``)
- Secrets must never appear in committed files
- Use environment variables; reference them in code, never hardcode
- `.env` is gitignored; `.env.example` contains only placeholder values
- Pre-commit hook (`.husky/pre-commit`) runs gitleaks-lite secret scan; never bypass with `--no-verify`

### P7 — Validated input

- Validate all input crossing a trust boundary (HTTP, file upload, IPC) with **zod** schemas
- Escape output appropriate to the target context (HTML, shell, SQL)
- File uploads: validate MIME + magic bytes (not just extension), enforce size limits, scan for embedded scripts

### P8 — Output and logging hygiene

- Never log credentials, tokens, full personal identifiers, or session cookies
- Use **Pino** structured logger with redaction of sensitive fields (`password`, `token`, `cookie`, `Authorization`)
- Error responses to clients must not leak internal details (paths, stack traces, query structure)
- Sentry integration: server-side errors include sanitized context only; client-side errors strip user PII before transport
- `console.log` is forbidden in production code paths (P8 enforcement via lint rule)

## Comandi quick check

```bash
# Verifica headers security su endpoint live
curl -sI http://localhost:8200/health | grep -iE 'strict-transport|content-security|x-frame|referrer-policy'

# Test rate limit (15 chiamate consecutive)
for i in {1..15}; do curl -s http://localhost:8200/auth/csrf -o /dev/null -w '%{http_code}\n'; done | sort | uniq -c

# Test CSRF flow
curl -sc /tmp/c.txt http://localhost:8200/csrf | jq .token
TOKEN=$(curl -sb /tmp/c.txt http://localhost:8200/csrf | jq -r .token)
curl -sb /tmp/c.txt -X POST http://localhost:8200/employees \
  -H "X-CSRF-Token: $TOKEN" \
  -H 'Content-Type: application/json' -d '{}'

# Audit dipendenze
npm audit --omit=dev

# Scan secrets locali (mirror del pre-commit hook)
gitleaks detect --source . --no-git
```

## Variabili d'ambiente security-critical

| Var                    | Required   | Note                                                            |
| ---------------------- | ---------- | --------------------------------------------------------------- |
| `AUTH_SECRET`          | si         | >=32 byte. Stesso valore in services/app + services/api-gateway |
| `CSRF_SECRET`          | no         | Se assente, fallback ad AUTH_SECRET                             |
| `CSP_ENFORCE`          | no         | `1` flippa CSP da report-only a enforce                         |
| `RATE_LIMIT_WINDOW_MS` | no         | default 15 min                                                  |
| `RATE_LIMIT_MAX`       | no         | default 100                                                     |
| `RATE_LIMIT_AUTH_MAX`  | no         | default 10 (per /auth/\* in 5min)                               |
| `CORS_ORIGINS`         | si in prod | comma-separated origin allowlist                                |

## Pattern raccomandati

### Validazione input (Zod boundary)

```ts
import { z } from 'zod';
import { Request, Response } from 'express';

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  cursor: z.string().uuid().optional(),
});

router.get('/employees', async (req, res) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_query', issues: parsed.error.issues });
  }
  // ... parsed.data is type-safe and validated
});
```

### Sanitizzazione HTML (raw user-content)

Quando si renderizza user-content HTML (es. note formatted): usa `DOMPurify` (client) o `sanitize-html` (server). Mai render diretto di markup non sanitizzato.

### Cookie hardening checklist

Per ogni cookie nuovo:

- [ ] `httpOnly: true` (a meno che JS lato client non DEVA leggerlo — in quel caso documenta perché)
- [ ] `secure: true` in production
- [ ] `sameSite: 'strict' | 'lax'` (mai `none` senza `secure: true`)
- [ ] `path: '/'` o più specifico
- [ ] `maxAge` o `expires` impostato (no cookie permanente senza ragione)
- [ ] `domain` esplicito solo se cross-subdomain richiesto

## Pre-commit gate

`.husky/pre-commit` esegue:

1. `lint-staged` (prettier on staged files)
2. **Inline secret scan**: PEM `BEGIN [TYPE] PRIVATE KEY`, `sk-{32+}`, `gho_/ghp_{30+}`, `AKIA{16}`, `xox[bpoa]-{20+}`
3. **Schema-drift check**: se staged include `*/prisma/schema.prisma` e `DATABASE_URL` set → `prisma-verify.sh`
4. Aborta commit su match (override solo via `--no-verify` con review)

Allowlist path: `.husky/*`, `docs/*`, `.handoff/*` (S10 PR #21 — descriptive prose about past detections).

`.husky/commit-msg` accetta solo:

- `[RTGB][PH<N>-T<M>] type: subject` (signature RTGB legacy)
- Conventional Commits standard
- Merge/Revert/fixup commits

## CI gate

`.github/workflows/security.yml` (S11 post-PR #23):

- **gitleaks** CLI (self-installed v8.21.2) con full history. Allowlist via `gitleaks.toml` (S10 PR #21).
- **npm audit --omit=dev --audit-level=high** + JSON artifact upload
- **semgrep ci** con `p/owasp-top-ten p/typescript p/javascript p/secrets`

Daily schedule alle 03:17 UTC + on push/PR + manual dispatch.

Branch protection (ADR-0021): 4 mandatory checks (`lint`, `typecheck`, `test`, `gitleaks`) + 3 optional (`build-workspaces`, `npm-audit`, `semgrep`).

## Incident response

Se sospetti leak credenziale:

1. **Rotate immediato**: `AUTH_SECRET`, `CSRF_SECRET`, DB password, qualsiasi API key in `.env*`
2. **Audit access logs**: cerca chiamate sospette in `services/api-gateway` log Pino (post-B5 con request_id)
3. **Revoke sessioni attive**: cambio `AUTH_SECRET` invalida tutti i JWT esistenti (re-login forzato)
4. **Force CSRF rebind**: `csrf-binding` cookies vengono invalidati al cambio secret (HMAC mismatch)
5. **Notifica Enzo**: prima di qualsiasi ulteriore azione

## Test security a runtime

Vitest test: `services/api-gateway/src/middleware/__tests__/security.test.ts`

- Headers helmet attivi
- CSRF flow end-to-end (cookie + token derivation + match)
- Rate limit (deferred — richiede mock timer)

E2E security headers: `tests/e2e/security.spec.ts` (post-B5).

## References

- [`../decisions/0012-security-baseline.md`](../decisions/0012-security-baseline.md) — ADR-0012
- [`../decisions/0007-auth-dual-system.md`](../decisions/0007-auth-dual-system.md) — ADR-0007
- [`../decisions/0008-multi-tenant-rls-evo.md`](../decisions/0008-multi-tenant-rls-evo.md) — ADR-0008
- [`../decisions/0021-branch-protection-rebalanced.md`](../decisions/0021-branch-protection-rebalanced.md) — ADR-0021 (S11)
- [`../20-architecture/overview.md`](../20-architecture/overview.md) — cross-cutting concerns table
- OWASP CSRF Prevention Cheat Sheet
- Helmet docs: https://helmetjs.github.io
- Mozilla Observatory: https://observatory.mozilla.org
- `db/seeds/audit-examples.sql` — audit log examples
- `rbp_functional_areas` table — RBP areas reference
