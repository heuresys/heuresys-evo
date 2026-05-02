# TypeScript Strict — Heuresys evo

> **Regola dura**: zero `any`. Zero `// @ts-ignore`. Zero `as Type` senza narrowing precedente.
> Pre-commit hook (`tsc --noEmit`) blocca push con errori. CI fail chiusura PR.

## Compiler flags richiesti (root `tsconfig.base.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@heuresys/types": ["packages/types/src/index.ts"],
      "@heuresys/types/*": ["packages/types/src/*"],
      "@heuresys/shared": ["packages/shared/src/index.ts"],
      "@heuresys/shared/*": ["packages/shared/src/*"],
      "@heuresys/ui": ["packages/ui/src/index.ts"],
      "@heuresys/ui/*": ["packages/ui/src/*"]
    }
  }
}
```

Ogni workspace estende con override minimo:

```json
// services/api-gateway/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"]
}
```

## `noUncheckedIndexedAccess` — implicazioni quotidiane

Con questo flag, `array[i]` e `obj[key]` ritornano `T | undefined`. Va narrowed sempre.

```typescript
// ❌ Rotto con noUncheckedIndexedAccess
function getFirstEmployee(employees: Employee[]): string {
  return employees[0].email; // Error: employees[0] possibly undefined
}

// ✅ Narrowed
function getFirstEmployee(employees: Employee[]): string | null {
  const first = employees[0];
  return first ? first.email : null;
}

// ✅ O con assertion runtime esplicita (preferito quando invariante è garantita upstream)
function getFirstEmployee(employees: [Employee, ...Employee[]]): string {
  return employees[0].email; // tuple type garantisce non-empty
}
```

## `exactOptionalPropertyTypes`

`field?: string` è diverso da `field: string | undefined`. La prima vieta `field: undefined` esplicito (deve essere assente).

```typescript
type Patch = { firstName?: string };

const a: Patch = {}; // ✅
const b: Patch = { firstName: 'Mario' }; // ✅
const c: Patch = { firstName: undefined }; // ❌ Error
```

Per pattern PATCH usare `Partial<T>` esplicito o `T | undefined`:

```typescript
type EmployeePatch = { [K in keyof Employee]?: Employee[K] | undefined };
```

## `unknown` invece di `any`

`any` disabilita ogni check. `unknown` lo richiede esplicito.

```typescript
// ❌
function parsePayload(raw: any) {
  return raw.data.items;
}

// ✅
import { z } from 'zod';
const PayloadSchema = z.object({ data: z.object({ items: z.array(z.string()) }) });

function parsePayload(raw: unknown): string[] {
  return PayloadSchema.parse(raw).data.items;
}
```

## Branded types per IDs

Evitano cross-contamination tra ID semanticamente diversi.

```typescript
// packages/types/src/brands.ts
export type Brand<T, B> = T & { readonly __brand: B };

export type TenantId = Brand<string, 'TenantId'>;
export type UserId = Brand<string, 'UserId'>;
export type EmployeeId = Brand<string, 'EmployeeId'>;
export type DepartmentId = Brand<string, 'DepartmentId'>;

// Costruttori validati
export const TenantId = (v: string): TenantId => {
  if (!/^[0-9a-f-]{36}$/.test(v)) throw new Error(`Invalid TenantId: ${v}`);
  return v as TenantId;
};
```

Uso:

```typescript
function findEmployee(tenantId: TenantId, employeeId: EmployeeId): Promise<Employee | null> {
  return prisma.employee.findFirst({ where: { id: employeeId, tenantId } });
}

const t = 'abc-123' as string;
const e = 'def-456' as string;
findEmployee(t, e); // ❌ Error: argument of type 'string' is not assignable to TenantId
findEmployee(TenantId(t), EmployeeId(e)); // ✅
```

Costo runtime zero — il brand sparisce a compile time.

## ESLint rules (estratto `eslint.config.js`)

```javascript
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.{ts,tsx}'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': true, 'ts-expect-error': 'allow-with-description' },
    ],
  },
});
```

## Pre-commit hook (`.husky/pre-commit`)

```bash
#!/usr/bin/env bash
set -euo pipefail
npx tsc --noEmit -p tsconfig.base.json
npx eslint --max-warnings 0 .
npx lint-staged
```

Niente bypass `--no-verify` — se serve aggirare, è sintomo di problema architetturale, non di hook fastidioso.

## Eccezioni accettate

- File `*.d.ts` di terze parti senza tipi: `declare module 'pacchetto-untyped';`
- Test in cui serve `// @ts-expect-error <descrizione>` per testare branch type-error → motivare in commento.
- Mai eccezioni in production code path.
