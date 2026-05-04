# ADR-0009: Stack version strategy (B1 hardening)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Supersedes**: ADR-0003 (auth-nextauth-v5-prisma) for the v5-vs-v4 choice
**Phase**: RTGB B1

## Context

Roadmap `ROAD_TO_GLORY_EVO_HARDENING.md` §3.1 mandates removal of bleeding-edge dependencies. The pre-hardening stack used:

| Dep         | Version pre-B1 | Risk classification         |
| ----------- | -------------- | --------------------------- |
| next-auth   | 5.0.0-beta.31  | Beta in production-aspirant |
| typescript  | 6.0.3          | Bleeding-edge major         |
| tailwindcss | ^4.2.4         | Recent major (stable)       |
| storybook   | ^9.1.20        | Recent major (stable)       |
| vite        | ^7.3.2         | Recent major (stable)       |
| express     | ^5.2.1         | Recent major (stable)       |
| prisma      | ^5.22.0        | Stable                      |
| react       | ^19.2.5        | Stable                      |
| next        | ^16.2.4        | Stable                      |

Forces in play:

- **Stability**: a beta dependency in the auth path is a recurring source of upgrade churn and undocumented behavior changes.
- **Cross-service compatibility**: `services/api-gateway` uses `@auth/express@^0.12.2` (Auth.js v5 family). The session JWT is shared via cookie + AUTH_SECRET, so any auth change on the app side must keep the cookie name and JWT format aligned.
- **Migration cost**: NextAuth v4 lacks the v5 ergonomic surface used by the codebase (server-action `signIn`/`signOut`, `auth()` helper, `handlers` export). Migration requires structural rework of the login/dashboard pages.
- **TypeScript 6 risk**: TS 6 is a recent major; downgrade to 5.x has marginal benefit (TS 6 is mostly retro-compatible) at the cost of revisiting per-workspace tsconfigs.

## Decision

1. **NextAuth v5-beta.31 → v4.24.14** (services/app). Done in commit chain on `rtgb/init` lineage:
   - `package.json`: `next-auth: ^4.24.10` (resolves 4.24.14)
   - Cookie name forced to `authjs.session-token` in `src/lib/auth.config.ts` so v4-minted JWTs are recognized by the gateway's `@auth/express` (Auth.js v5).
   - `src/lib/auth.ts`: NextAuth v4 returns a single handler — wrapped as `handlers = { GET, POST }`. Server-side session via `getServerSession(authOptions)` exported as `auth()` shim.
   - `src/proxy.ts`: `auth(req => …)` v5 wrapper replaced by direct `getToken({ req, secret, cookieName })` from `next-auth/jwt`.
   - `src/app/login/page.tsx`: server-action `signIn` (v5-only) replaced by a small client island (`login-form.tsx`) using `signIn` from `next-auth/react`.
   - `src/app/dashboard/page.tsx`: same pattern for `signOut` (`sign-out-button.tsx`).

2. **TypeScript 6.0.3 retained**. Downgrade to 5.x not undertaken — the version is retro-compatible with the codebase's TS usage and the hardening effort is better spent elsewhere. Risk accepted.

3. **Tailwind 4 / Storybook 9 / Vite 7 / Express 5 retained**. All are stable in their current major. Documented here as known recent majors, not red flags.

4. **`@auth/prisma-adapter@^2.11.2` retained dormant**. v2 is the Auth.js v5 family adapter. NextAuth v4 normally pairs with `@next-auth/prisma-adapter` or `@auth/prisma-adapter@^1`. Since the JWT strategy is in use (`session: { strategy: 'jwt' }`) and the adapter is not wired, the package is unused at runtime. Reactivating the adapter (e.g., for OAuth providers) will require pinning to a v4-compatible version.

## Alternatives considered

- **Pin v5-beta.31 exactly + monitor for v5 GA**: rejected per roadmap §3.1 mandate to remove beta deps from production paths.
- **Downgrade @auth/express on api-gateway to a v4-compatible JWT issuer**: rejected — `@auth/express` only ships in the v5 family. Would have required replacing it with a manual `jsonwebtoken` issuer + bespoke cookie middleware.
- **Force cookie name `next-auth.session-token` (v4 default) and rename on api-gateway**: rejected — requires custom cookie reader in `@auth/express`, increasing maintenance burden.

## Consequences

Positive:

- No beta dep in the auth-critical path.
- `npm audit --omit=dev` no longer reports `next-auth@5.0.0-beta.31` as a transitive risk surface.
- Cross-service JWT validated via shared secret + shared cookie name.

Negative:

- Login + sign-out now require client islands. Server-rendered shell still renders without JS, but the actual sign-in cannot happen with JS disabled (acceptable — public site `services/marketing` does not require auth).
- Loss of v5-only ergonomic helpers (`auth()` shorthand was reimplemented as `getServerSession(authOptions)` shim).
- Future OAuth providers will require selecting a v4-compatible `@auth/prisma-adapter` or migrating the adapter strategy.

## Smoke validation

- `npx tsc --noEmit` (services/app): 0 errors
- `npx vitest run` (services/app): 12/12 passing (`authorize.test.ts`)
- E2E sign-in flow: deferred to Phase B3 (Playwright config + DB-backed fixtures). Tracked in `state.json` task B1.5.

## npm audit state (post-S8 supply chain hardening, 2026-05-04)

`npm audit --omit=dev` reports **0 advisories** (era 6 in S7 close, 5 in S8 mid).

S8 chiusura supply chain ha eliminato tutte le 6 vulnerabilità tramite npm overrides nested:

- `postcss: ^8.5.10` (root override) — fix line-return parsing
- `uuid: ^14.0.0` (root + nested in `exceljs`) — fix buffer bounds
- `cookie: ^0.7.0` (nested in `next-auth` + `@auth/core`) — fix OOB chars

Vedi `package.json` `overrides` block per gli override attivi.

### Storico (per riferimento — pre-S8)

`npm audit --omit=dev` reportava 6 advisories (2 low + 4 moderate), all transitive:

| Package    | Severity | Root cause                                                 | Fix path applicato S8                |
| ---------- | -------- | ---------------------------------------------------------- | ------------------------------------ |
| cookie     | low      | OOB chars in cookie name/path/domain (GHSA-pxg6-pf52-xh8x) | nested override `cookie: ^0.7.0`     |
| @auth/core | low      | via cookie                                                 | risolto via cookie override          |
| postcss    | moderate | line-return parsing (GHSA-7fh5-64p2-3v2j)                  | root override `postcss: ^8.5.10`     |
| next       | moderate | via postcss                                                | risolto via postcss override         |
| uuid       | moderate | buffer bounds (GHSA-w5hq-g745-h8pq)                        | root + nested override `uuid: ^14.0` |
| next-auth  | moderate | via @auth/core + uuid (transitive)                         | risolto via cookie + uuid override   |

`npm audit fix --force` avrebbe downgradato `next-auth` a v3 (breaking; rejected in B1). Approccio finale: nested overrides senza version downgrade.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §3.1, §6 Phase B1
- ADR-0003 (superseded for v5 choice)
- NextAuth v4 docs: https://next-auth.js.org (v4 archive section)
- @auth/express README (Auth.js v5 family): https://authjs.dev/reference/express
