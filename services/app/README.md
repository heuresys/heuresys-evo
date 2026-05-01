# services/app

Webapp SaaS autenticata `app.heuresys.com` — dashboard multi-tenant, knowledge graph, org design, workforce intelligence.

## Scope
- Pagine autenticate post-login
- Multi-tenant con RLS Postgres + RBP framework
- Visualizzazioni complesse (Cytoscape, D3, ECharts, XY-Flow)
- Admin tools come route segment `(admin)/*` con guard

## Stack target
- Next.js 16 + React 19 (App Router, SSR + Server Components)
- Tailwind + Radix UI da `packages/ui`
- TanStack Query/Table, framer-motion
- Sentry frontend, telemetria custom

## Deploy target
- VM OCI (oracle-vm-default) dietro Nginx
- Porta `3012` (coerente con landing live attuale)
- Dominio `app.heuresys.com`

## Convenzioni
- Auth gestita lato API gateway (JWT in cookie httpOnly)
- Stato client minimale, source of truth = server
- Componenti UI riutilizzabili → promossi a `packages/ui`
- Route segment `(playground)` vietato qui (usa `services/playground/`)
