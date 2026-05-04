# ADR-0006: Monorepo boundary — services + packages

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B6

## Context

Il greenfield evo è organizzato come npm workspaces:

```
heuresys-evo/
├── services/
│   ├── api-gateway/     # Express 5 backend
│   ├── app/             # Next.js 16 (auth + dashboard)
│   ├── enrichment/      # placeholder per ESCO/Firecrawl pipeline
│   ├── marketing/       # Next.js 16 (sito pubblico)
│   └── playground/      # placeholder demo (archived in B9)
└── packages/
    ├── shared/          # tipi + schemi Zod condivisi
    └── ui/              # design system (Phase B7 espande)
```

Forces:

- **Code sharing**: tipi DTO, schemi Zod, util di validazione devono essere condivisi tra `services/api-gateway` e `services/app` senza duplicazione.
- **Build isolation**: ogni service ha il suo build target (Express bundle, Next.js build, ecc.). Un singolo bundle monolitico sarebbe controproducente.
- **Dep hoisting**: npm workspaces esegue dep hoisting in `node_modules/` root, riducendo footprint disco vs separate `node_modules/` per service.
- **Versioning**: l'evo è un internal monorepo, non un library publisher. No semantic-release per workspace, no publish to npm — versioning è solo intra-repo (`*` per workspace deps).

## Decision

Monorepo a **due tier**:

1. **`services/*`** — applicazioni eseguibili. Ognuna ha:
   - proprio `package.json` con `name: "@heuresys/<name>"` o `"<name>"`
   - proprio entry point eseguibile (Express server o Next.js)
   - può dipendere da `packages/*` via `"@heuresys/shared": "*"`
   - NON dipende da altri `services/*` (loose coupling via HTTP)

2. **`packages/*`** — librerie pure (no entry eseguibile). Ognuna ha:
   - `name: "@heuresys/<name>"` (scoped)
   - export controllato via `"exports"` field in package.json
   - può dipendere da altri `packages/*` ma NON da `services/*`

3. **Root** — orchestrator only:
   - npm scripts che invocano `--workspaces --if-present`
   - dev deps cross-cutting (husky, commitlint, prettier)
   - NON contiene code sorgente eseguibile

Cross-service comunicazione: **HTTP only**, no shared mutable state, no shared in-process import. JWT cookie cross-service (vedi ADR-0009) è eccezione esplicita per auth.

## Alternatives considered

- **Single Next.js app (no api-gateway)**: rejected — separa boundary auth/data layer è valore (testabilità, performance tuning indipendente, futuro horizontal scaling).
- **Turborepo / Nx**: rejected come ADR-0006 strict scope; npm workspaces native sono sufficienti per la scala attuale (2-5 services). Possibile reconsider se il tempo build cumulativo supera 60s.
- **PNPM workspaces**: rejected — npm 10+ è installato di default sulla VM, switch a pnpm aggiunge una dipendenza tooling senza ROI immediato.

## Consequences

Positive:

- Code sharing senza duplicazione (tipi DTO Zod riusati cross-service).
- Build isolation: un break in `services/marketing` non impatta `services/app`.
- Dep hoisting riduce footprint disco di `node_modules/` (~40% vs separate trees).

Negative:

- Hoisting può causare conflitti versioning subtle (es. due workspace richiedono major diversi della stessa lib). Mitigato da pinning esatto (B1.9).
- Tooling deve essere workspace-aware (eslint, prettier, vitest config con `--workspaces`).
- Inter-service refactor che tocca multipli workspace richiede commit più ampi.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §11 Phase B6
- npm workspaces docs: https://docs.npmjs.com/cli/v10/using-npm/workspaces
