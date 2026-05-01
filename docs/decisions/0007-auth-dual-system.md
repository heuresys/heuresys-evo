# ADR-0007: Auth dual-system (NextAuth v4 in app + @auth/express in api-gateway)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B6

## Context

Il sistema ha due servizi auth-aware: `services/app` (Next.js front end + server components) e `services/api-gateway` (Express REST). Entrambi devono autenticare la stessa identità utente, e gli RPC server-side da app a api-gateway devono propagare il principal senza second hop di sign-in.

Forces:

- **Cross-service identity**: il dashboard server component fa `fetch` verso api-gateway forwardando il `Cookie` header inbound; api-gateway deve poter decodificare il cookie come autoritativo.
- **Stack diversity**: Next.js App Router ha bisogno di NextAuth (la lib più matura per RSC + Edge middleware). Express ha bisogno di `@auth/express` (Auth.js v5 Express integration) o di un middleware bespoke con `jsonwebtoken`.
- **Maintenance**: avere un solo "issuer" del cookie semplifica debug e key rotation (un solo AUTH_SECRET, un solo cookie name canonico).

## Decision

**Dual-system con compatibilità cookie + secret**:

1. **Issuer del cookie**: `services/app` (NextAuth v4.24.x) — è il punto dove l'utente fa sign-in via /login.
2. **Reader del cookie**: `services/api-gateway` (`@auth/express@^0.12.x`) — valida il cookie inbound senza altro round-trip.
3. **Compatibilità garantita da**:
   - **AUTH_SECRET condiviso** (env var nei due servizi, stesso valore)
   - **Cookie name unificato** `authjs.session-token` (default v5; in v4 forzato esplicitamente in `services/app/src/lib/auth.config.ts → cookies.sessionToken.name`)
   - **JWT format** JWE A256CBC-HS512 con HKDF da AUTH_SECRET — NextAuth v4 e Auth.js v5 family condividono lo stesso encoder
4. **Strategy**: `jwt` su entrambi i lati (no DB-backed sessions). PrismaAdapter NON wired (v2 dormant).

## Alternatives considered

- **Single auth instance + service mesh (proxy)**: rejected — overhead operativo (sidecar proxy o API Gateway dedicato) sproporzionato per la scala attuale.
- **Custom JWT middleware in api-gateway con `jsonwebtoken` puro**: rejected — perde la conformità Auth.js (cookie format, error contract) e richiede codice manutenuto manualmente.
- **OAuth proxying (api-gateway agisce come OAuth client di un IdP esterno)**: rejected per ora — niente IdP esterno necessario allo stato corrente. Riconsiderare se entra Google/Microsoft SSO.

## Consequences

Positive:

- Un singolo sign-in, un singolo cookie, due servizi che lo riconoscono.
- Nessun round-trip extra (no token introspection HTTP) — la validazione è locale via secret.
- Rotation di AUTH_SECRET = rotation atomica di entrambi i lati (deploy coordinato).

Negative:

- Tight coupling sul cookie name + secret. Cambio di nome cookie richiede modifica simultanea in entrambi i servizi.
- Drift tra release NextAuth v4 e Auth.js v5 può introdurre incompatibilità future (encoder cambia in major release). Mitigato da: B12 final smoke test + pinning esatto (B1.9).
- Se in futuro `@auth/express` non rilascerà più patch security, sarà necessario migrare a un middleware bespoke (effort 1-2 giorni).

## Validation

- E2E sign-in deferred a B3 (Playwright + DB fixtures).
- Cross-service forwarding cookie: testato manualmente nel codice (`dashboard/page.tsx` linea ~22 — `headers().get('cookie')` forward).
- Smoke unit: `services/app/src/lib/__tests__/authorize.test.ts` 12/12 pass.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §11 Phase B6
- ADR-0009 stack version strategy (NextAuth v5β → v4 downgrade)
- ADR-0003 (superseded for v5 choice)
- @auth/express docs: https://authjs.dev/reference/express
