# Security guide (RTGB B4.12)

> Riferimento operativo allo stack security baseline. Per la decisione ADR-0012.

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
|  services/app (NextAuth v4)                                |
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
|   |- FORCE ROW LEVEL SECURITY su tabelle tenant-aware       |
|   '- SET app.current_tenant_id per transazione             |
+------------------------------------------------------------+
```

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

Quando si renderizza user-content HTML (es. note formatted): usa `DOMPurify` (client) o `sanitize-html` (server). Mai render diretto di markup non sanitizzato (vedi react safe rendering rules).

### Cookie hardening checklist

Per ogni cookie nuovo:

- [ ] `httpOnly: true` (a meno che JS lato client non DEVA leggerlo - in quel caso documenta perche)
- [ ] `secure: true` in production
- [ ] `sameSite: 'strict' | 'lax'` (mai `none` senza `secure: true`)
- [ ] `path: '/'` o piu specifico
- [ ] `maxAge` o `expires` impostato (no cookie permanente senza ragione)
- [ ] `domain` esplicito solo se cross-subdomain richiesto

## Pre-commit gate

`.husky/pre-commit` esegue:

1. `lint-staged` (prettier on staged files)
2. **Inline secret scan**: PEM `BEGIN [TYPE] PRIVATE KEY`, `sk-{32+}`, `gho_/ghp_{30+}`, `AKIA{16}`, `xox[bpoa]-{20+}`
3. **Schema-drift check**: se staged include `*/prisma/schema.prisma` e `DATABASE_URL` set -> `prisma-verify.sh`
4. Aborta commit su match (override solo via `--no-verify` con review)

`.husky/commit-msg` accetta solo:

- `[RTGB][PH<N>-T<M>] type: subject` (signature RTGB)
- Conventional Commits standard
- Merge/Revert/fixup commits

## CI gate

`.github/workflows/security.yml`:

- **gitleaks-action@v2** con full history
- **npm audit --omit=dev --audit-level=high** + JSON artifact upload
- **semgrep ci** con `p/owasp-top-ten p/typescript p/javascript p/secrets`

Daily schedule alle 03:17 UTC + on push/PR + manual dispatch.

## Incident response

Se sospetti leak credenziale:

1. **Rotate immediato**: `AUTH_SECRET`, `CSRF_SECRET`, DB password, qualsiasi API key in `.env*`
2. **Audit access logs**: cerca chiamate sospette in `services/api-gateway` log Pino (post-B5 con request_id)
3. **Revoke sessioni attive**: cambio AUTH_SECRET invalida tutti i JWT esistenti (re-login forzato)
4. **Force CSRF rebind**: `csrf-binding` cookies vengono invalidati al cambio secret (HMAC mismatch)
5. **Notifica Enzo**: prima di qualsiasi ulteriore azione

## Test security a runtime

Vitest test: `services/api-gateway/src/middleware/__tests__/security.test.ts`

- Headers helmet attivi
- CSRF flow end-to-end (cookie + token derivation + match)
- Rate limit (deferred - richiede mock timer)

E2E security headers: `tests/e2e/security.spec.ts` (post-B5).

## References

- [ADR-0012 security baseline](../decisions/0012-security-baseline.md)
- [ADR-0007 auth dual-system](../decisions/0007-auth-dual-system.md)
- [ADR-0008 multi-tenant RLS](../decisions/0008-multi-tenant-rls-evo.md)
- OWASP CSRF Prevention Cheat Sheet
- Helmet docs: https://helmetjs.github.io
- Mozilla Observatory: https://observatory.mozilla.org
