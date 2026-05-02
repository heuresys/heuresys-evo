# Next.js 16 App Router — Convenzioni evo

> Stack: Next.js 16, React 19, App Router only (no Pages Router).
> Path: `services/app/src/app/`. NextAuth v4 in `services/app/src/lib/auth.ts`.
> API canoniche → NestJS in `services/api-gateway` (port 8012). `route.ts` di Next solo per concerni Next-specific (NextAuth callbacks, webhook deploy).

## Struttura `services/app/src/app/`

```
app/
├── layout.tsx                # root layout (html/body, providers globali)
├── page.tsx                  # /  → landing
├── login/
│   └── page.tsx              # /login (Client Component, NextAuth signIn)
├── (authenticated)/          # route group, layout con auth gate
│   ├── layout.tsx            # check session, redirect /login se assente
│   ├── dashboard/
│   │   ├── page.tsx          # RSC, fetch dashboard widgets
│   │   ├── loading.tsx       # Suspense fallback
│   │   ├── error.tsx         # Error boundary
│   │   └── @modal/           # parallel route per modal preserve-state
│   │       ├── default.tsx   # null (no modal di default)
│   │       └── (.)employee/[id]/page.tsx  # intercepting route
│   └── employees/
│       ├── page.tsx          # list RSC
│       └── [id]/
│           └── page.tsx      # detail RSC
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts      # SOLO NextAuth handlers
```

## Server Components default

Tutti i `page.tsx`, `layout.tsx` sono Server Components di default. `'use client'` solo quando serve interattività (state, effetti, event handlers, browser API).

```typescript
// services/app/src/app/(authenticated)/employees/page.tsx
// Server Component (no directive)
import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import { EmployeeList } from './EmployeeList';
import { EmployeeListSkeleton } from './EmployeeListSkeleton';

export default async function EmployeesPage() {
  const session = await auth();
  if (!session) return null; // intercettato da layout (authenticated)/

  return (
    <main>
      <h1>Dipendenti</h1>
      <Suspense fallback={<EmployeeListSkeleton />}>
        <EmployeeList tenantId={session.user.tenantId} />
      </Suspense>
    </main>
  );
}
```

## Client Components — quando

Trigger oggettivi:

- `useState`, `useEffect`, `useReducer`
- Event handler (`onClick`, `onChange`, `onSubmit` interattivo non Server Action)
- Browser API (`window`, `localStorage`, `navigator`)
- Librerie client-only (`recharts`, `cytoscape`, `xyflow`)

```typescript
'use client';
import { useState } from 'react';

export function EmployeeFilter({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial);
  return <input value={q} onChange={(e) => setQ(e.target.value)} />;
}
```

Regola: tieni `'use client'` il più in basso possibile nell'albero. Mai sul layout o page se evitabile.

## Data fetching — RSC + direct fetch + Suspense

Niente SWR/React Query per dati critici lato server. Si fetcha direttamente in RSC con `fetch` + cache config Next.js o via Prisma direct.

```typescript
// EmployeeList.tsx — RSC async
import { prisma } from '@/lib/prisma';
import type { TenantId } from '@heuresys/types';

export async function EmployeeList({ tenantId }: { tenantId: TenantId }) {
  const employees = await prisma.employee.findMany({
    where: { tenantId },
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: { lastName: 'asc' },
    take: 50,
  });
  return (
    <ul>
      {employees.map((e) => (
        <li key={e.id}>{e.lastName} {e.firstName} — {e.email}</li>
      ))}
    </ul>
  );
}
```

Per dati altamente dinamici client-side (filtri, pagination) usare TanStack Query con `initialData` da RSC.

## Server Actions per mutation

Form submission via Server Action — zero API route boilerplate. Validazione zod + chiamata API gateway o Prisma diretto.

```typescript
// services/app/src/app/(authenticated)/employees/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CreateEmployeeSchema } from '@heuresys/shared/schemas/employee';

export async function createEmployeeAction(formData: FormData) {
  const session = await auth();
  if (!session) redirect('/login');

  const parsed = CreateEmployeeSchema.safeParse({
    ...Object.fromEntries(formData),
    tenantId: session.user.tenantId,
  });
  if (!parsed.success) return { error: parsed.error.flatten() };

  const res = await fetch(`${process.env.API_GATEWAY_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(parsed.data),
  });
  if (!res.ok) return { error: { server: ['create_failed'] } };

  revalidatePath('/employees');
  return { ok: true };
}
```

Form consumer:

```tsx
'use client';
import { useActionState } from 'react';
import { createEmployeeAction } from './actions';

export function EmployeeForm() {
  const [state, action, pending] = useActionState(createEmployeeAction, null);
  return (
    <form action={action}>
      <input name="firstName" required />
      <input name="lastName" required />
      <input name="email" type="email" required />
      <button disabled={pending}>{pending ? 'Salvo…' : 'Crea'}</button>
      {state?.error && <pre>{JSON.stringify(state.error)}</pre>}
    </form>
  );
}
```

## Metadata API

Statica:

```typescript
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Dipendenti — Heuresys',
  description: 'Gestione anagrafica dipendenti',
};
```

Dinamica (per detail page):

```typescript
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const emp = await prisma.employee.findUnique({ where: { id: params.id } });
  return { title: emp ? `${emp.firstName} ${emp.lastName} — Heuresys` : 'Non trovato' };
}
```

## Parallel & Intercepting routes (modal)

Il pattern `@modal` + `(.)` permette di aprire la detail page come modal sulla list, preservando URL e history.

```
employees/
├── page.tsx                  # list
├── @modal/
│   ├── default.tsx           # export default function() { return null; }
│   └── (.)[id]/
│       └── page.tsx          # render modale (Dialog) con dettaglio
└── [id]/
    └── page.tsx              # full page detail (deep link)
```

`(.)` = intercept stesso livello. `(..)` = livello sopra. Quando l'utente clicca link `/employees/123` da `/employees`, vede modal. Quando ricarica o entra deep, vede full page.

Layout deve dichiarare lo slot:

```tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

## Anti-pattern

- `route.ts` per business logic CRUD — usa NestJS api-gateway.
- `useEffect` + `fetch` in Client Component per dati che potresti fetchare in RSC.
- `'use client'` sull'intera page senza necessità (rompe streaming + bundle bloat).
- Mock data in Server Action o RSC — viola feedback `feedback_no_mock_data`.
