# services/marketing

Landing pubblica `heuresys.com` — sito vetrina, lead gen, blog, pricing, contact.

## Scope

- Pagine pubbliche non autenticate
- Performance e SEO-first (SSG dove possibile)
- A/B testing copy/CTA
- Redirect a `services/app` per login

## Stack target

- Next.js 16 (App Router, prevalentemente SSG)
- Tailwind + componenti da `packages/ui`
- next-intl per i18n IT/EN

## Deploy target

- CDN statico (Vercel o equivalente)
- Dominio `heuresys.com`

## Convenzioni

- Niente accesso a DB diretto, niente API auth-protetta
- Asset visivi pesanti vanno ottimizzati (`next/image`, lazy load)
- Form di contatto via API endpoint pubblico esposto da `services/api-gateway`
