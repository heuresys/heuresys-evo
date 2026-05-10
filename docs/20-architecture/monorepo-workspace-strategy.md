# Monorepo & Workspace Strategy — Heuresys evo

> **Decisione**: npm workspaces puri. Niente Turborepo, niente Nx.
> **Motivazione**: founder solo, KISS, build sequenziale ≤2 min accettabile, tooling extra non ripaga la complessità.

## Struttura (reality check 2026-05-10)

```
heuresys-evo/
├── package.json              # workspaces: ["services/*", "packages/*"]
├── services/
│   ├── api-gateway/          # Express 5, port 8200 (systemd bare-metal)
│   ├── app/                  # Next.js 16, port 3200, contiene prisma/
│   └── enrichment/           # BullMQ workers, port 8220
└── packages/
    ├── ui/                   # design system (Shadcn + Cantiere B v2, ~180 components)
    └── shared/               # zod schemas, type utils, RBP constants
```

Regola d'oro: `packages/*` non dipendono da nessun altro workspace. `services/*` dipendono da `packages/*` (mai da altro service).

> **Nota canonical** (post-2026-05-10): `services/marketing`, `services/playground`, `packages/types` documentati in versioni precedenti di questo file e in ADR-0006 **non esistono nel codebase**. Erano placeholder/visions mai implementati. Il monorepo reale ha 3 services + 2 packages = 5 workspace totali. Niente Docker (vedi ADR-0001 + ADR-0023): tutti i servizi runtime girano bare-metal via systemd.

## Type sharing cross-workspace

I tipi condivisi vivono in `packages/shared/src/` (zod schemas, RBP constants, brand types). Niente `packages/types` separato — fuso dentro `packages/shared`.

```typescript
// packages/shared/src/types/index.ts (esempio)
export type { Tenant, User, Role, EmployeeRecord, AuditLog } from '@prisma/client';

// Brand types per evitare mix di ID
export type TenantId = string & { readonly __brand: 'TenantId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type EmployeeId = string & { readonly __brand: 'EmployeeId' };

// Domain enums (tenant-scope, perspective)
export const PERSPECTIVES = ['PROCESS', 'ENTERPRISE', 'TALENT'] as const;
export type Perspective = (typeof PERSPECTIVES)[number];

// Re-export RBP role hierarchy (data-driven, ma costanti per type narrowing)
export const RBP_ROLES = [
  'SUPERUSER',
  'TENANT_OWNER',
  'IT_ADMIN',
  'HR_DIRECTOR',
  'HR_MANAGER',
  'DEPT_HEAD',
  'LINE_MANAGER',
  'EMPLOYEE',
] as const;
export type RbpRole = (typeof RBP_ROLES)[number];
```

Consumo da api-gateway o app:

```typescript
import type { TenantId, RbpRole } from '@heuresys/shared';
```

## Build orchestration

```bash
# Tutto in parallelo (npm risolve topology automaticamente)
npm run build --workspaces --if-present

# Singolo workspace
npm run build --workspace=services/api-gateway

# Catena dipendente: ricompila packages/* prima di services/*
npm run build --workspace=@heuresys/shared \
  && npm run build --workspace=@heuresys/ui \
  && npm run build --workspaces --if-present --workspace=services
```

In CI usiamo lo script `scripts/build-all.sh` che ordina workspace topologicamente leggendo `package.json` deps.

## Versioning interno

| Tipo         | Version           | Pubblicato?         |
| ------------ | ----------------- | ------------------- |
| `packages/*` | `0.0.0` (statico) | No, mai             |
| `services/*` | semver `0.x.y`    | No (deploy diretto) |
| Repo root    | `0.x.0`           | No                  |

Le `packages/*` restano `0.0.0` perché linkate via workspace protocol — il version field è inerte. Cambiamenti breaking in `@heuresys/shared` si propagano via TypeScript compile error nei consumer, non via semver.

## npm install hoist

npm workspaces hoist le dipendenze comuni in `node_modules/` root. Dipendenze divergenti finiscono in `<workspace>/node_modules/`.

Esempio reale: `services/api-gateway` usa `zod@3.x` (compat nestjs-zod), `services/app` usa `zod@4.x` (Next.js 16). Risoluzione:

```json
// services/api-gateway/package.json
{ "dependencies": { "zod": "^3.23.0" } }

// services/app/package.json
{ "dependencies": { "zod": "^4.0.0" } }
```

npm installa `zod@4` in root e `zod@3` in `services/api-gateway/node_modules/zod/`. Verifica:

```bash
npm ls zod --workspaces
# api-gateway → zod@3.23.x
# app         → zod@4.0.x
```

Workaround se serve forzare versione comune: aggiungere `"overrides"` in root `package.json`. Da usare con cautela — può rompere compat in workspace specifico.

## Script root utili

```json
{
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "eslint . --ext ts,tsx",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  }
}
```

## Quando rivisitare la decisione

Trigger per valutare Turborepo/Nx:

- Build totale > 5 min
- Team ≥ 3 sviluppatori (cache distribuita ripaga)
- CI matrix con > 4 workspace test paralleli

Finché siamo founder solo, npm workspaces è sufficiente.
