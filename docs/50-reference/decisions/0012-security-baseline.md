# ADR-0012: Security baseline (B4)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B4

## Context

Pre-B4: `services/api-gateway` aveva solo `helmet()` con default config; nessun CSRF, nessun rate-limit, nessuna policy CSP esplicita, nessun secrets scan in pre-commit. Il legacy ha pagato in audit forensic 92 finding (vedi memoria proj). Il greenfield deve partire con baseline ragionevole e blocchi misurabili.

## Decision

Stack security a 5 layer + secrets scan + Zod boundary.

### 1. HTTP headers (Helmet hardened) — B4.1

`hardenedHelmet` middleware con override:

- **CSP** strict default-src 'self', script-src 'self' (no inline), style-src 'self' + 'unsafe-inline' (Tailwind injects runtime styles), object-src 'none', frame-ancestors 'none', form-action 'self', upgrade-insecure-requests
- **CSP report-only first** (B4.8) — `CSP_ENFORCE=1` env per attivare enforcement dopo monitoring
- **HSTS** maxAge 1 year + includeSubDomains + preload
- **Referrer-Policy** strict-origin-when-cross-origin
- **Cross-Origin-Resource-Policy** same-site
- crossOriginEmbedderPolicy disabilitato (API-only, no embedded HTML)

### 2. Rate limiting — B4.3

- `rateLimitGeneral` 100 req/15min/ip su tutto il gateway (env tunable: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`)
- `rateLimitAuth` 10 req/5min/ip su `/auth/*` per slow-down brute-force (env: `RATE_LIMIT_AUTH_MAX`)
- Standard headers draft-7, legacy headers off
- 429 risposta JSON `{ error: "rate_limit_exceeded" }`

Storage: in-memory default. Per multi-instance deploy → swap a `rate-limit-redis` (deferred a runbook B11).

### 3. CSRF protection — B4.2 (HMAC-bound, NOT legacy double-submit)

**Il pattern**:

1. `GET /csrf` — emette cookie HttpOnly `csrf-binding` (24 random bytes base64url) + ritorna `{ token: hmac(secret, binding) }` in response body
2. Client legge token da JSON, lo memorizza in memoria (no localStorage/cookie)
3. Su request unsafe (POST/PUT/PATCH/DELETE), client manda `X-CSRF-Token` header
4. `csrfHmac` middleware estrae binding cookie, ricomputa hmac, fa `timingSafeEqual` con header
5. Mismatch → 403 `{ error: "csrf_token_mismatch" }`

**Perché HMAC-bound vs legacy double-submit**: il double-submit classico richiede un cookie JS-readable, fragile a XSS che può leakare il token e replay. Il pattern HMAC mantiene il binding HttpOnly e deriva il token via secret server-side; un attaccante via XSS può leggere il token solo se ottiene il binding cookie, ma `httpOnly: true` lo previene.

**Skip paths**: `/auth/*` (Auth.js gestisce il proprio CSRF), `/health`, `/metrics`, `/ready`, `/csrf`.

### 4. Cookie hardening (NextAuth v4 lato app + CSRF lato gateway) — B4.4

- **NextAuth session cookie** (`authjs.session-token`): `httpOnly: true`, `sameSite: lax`, `secure` in prod, `path: /`. Forzato in `services/app/src/lib/auth.config.ts`.
- **CSRF binding cookie** (`csrf-binding`): `httpOnly: true`, `sameSite: strict`, `secure` in prod, `path: /`, maxAge 12h.
- **Auth.js Express**: usa default httpOnly + secure (verificato via `@auth/express` defaults).

### 5. Input validation (Zod boundary) — B4.5

- Ogni endpoint pubblico usa `zod.parse()` su body/query/params
- Failure → 400 con shape standard
- Schemi condivisi in `packages/shared/src/schemas/*.zod.ts`
- Middleware helper `validateBody/validateQuery/validateParams` (in `packages/shared/src/middleware/zod.ts` quando aggiunto)

### 6. Secrets scan — B4.6

- **Local pre-commit** (`.husky/pre-commit`): regex inline per PEM PRIVATE KEY, sk-\* tokens, gho*/ghp*, AKIA, xox[bpoa]
- **CI** (`.github/workflows/security.yml`): `gitleaks-action@v2` con full git history
- **CI complemento**: `npm audit --omit=dev` + `semgrep ci --config=p/owasp-top-ten p/typescript p/javascript p/secrets`

### 7. .env hygiene — B4.7

- `.env.example` aggiornato con tutte le variabili (incluso `CSRF_SECRET` se separato da `AUTH_SECRET`)
- `.gitignore` blocca `.env`, `.env.production`, `.env.staging`
- Secrets scan blocca anche staging di file `.pem`/`.key`

## Alternatives considered

- **csurf middleware**: rejected — unmaintained dal 2022, non più al passo con Express 5.
- **csrf-csrf** (alternative npm lib): valutata, rejected per evitare yet-another-dependency dato che HMAC-bound è 50 LOC self-contained e auditable.
- **Stateful CSRF (server-side store)**: rejected — adds Redis dep solo per CSRF; HMAC stateless è equivalente in sicurezza.
- **CSP enforce immediato (no report-only)**: rejected — rischio di rompere production senza monitoring; report-only first è prassi.
- **Bcrypt rounds aumentati a 14**: deferred a B12 perf benchmark.

## Consequences

Positive:

- 5 layer di defense (CSP, HSTS, rate-limit, CSRF, input validation) attivi dal day 1.
- CSRF HttpOnly-compatible (Semgrep clean).
- Rate-limit blocca brute-force credenziali (10 req/5min su /auth).
- Secrets scan locale (pre-commit) + CI (gitleaks + semgrep) = double gate.

Negative:

- Client web deve fetchare `/csrf` prima di POST — extra round-trip iniziale (~10ms in LAN).
- CSP report-only va monitorato e flippato a enforce — ADR aperto su quando (B12 candidate).
- In-memory rate-limit non scala oltre singolo process — runbook deploy multi-istanza richiede Redis store.

## Smoke validation

- Test unit `services/api-gateway/src/middleware/__tests__/security.test.ts`:
  - Helmet headers HSTS+nosniff+frameguard+referrer+CSP-RO
  - CSRF flow: /csrf issues cookie, POST without token 403, POST with valid token 200, POST with forged token 403
- Coverage: 6 test added, all green
- Typecheck: 0 errors

## Future work

- Sentry / error tracking → deferred a B5 ADR-0013
- Cookie consent banner → deferred a B7 (UI work)
- Subresource Integrity per CDN scripts → out of scope (no CDN scripts at present)
- Web Application Firewall → infra layer, fuori scope Cantiere B

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §9 Phase B4
- ADR-0007 auth dual-system
- ADR-0009 stack version strategy (NextAuth v4 cookie naming)
- OWASP CSRF Prevention Cheat Sheet
- Helmet docs: https://helmetjs.github.io
- express-rate-limit docs: https://express-rate-limit.mintlify.app
