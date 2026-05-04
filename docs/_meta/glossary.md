# Glossary

> Termini ricorrenti nel progetto heuresys-evo. Aggiornare con ogni nuovo concept consolidato.

| Term             | Acronym                                                      | Definition                                                                                                                         |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| ADR              | Architecture Decision Record                                 | Documento markdown in `docs/decisions/` che traccia una decisione architetturale, alternative considerate, conseguenze             |
| Auth.js          | —                                                            | Famiglia v5 di NextAuth (post-rename); `@auth/express`, `@auth/core` ecc. Compatibile JWT con NextAuth v4 se cookie name allineato |
| Cantiere A       | —                                                            | Stream di lavoro legacy (`heuresys.com.evo`), Phase 0-5 di Bridge Plan RTG                                                         |
| Cantiere B       | RTGB                                                         | Stream di lavoro hardening greenfield (`heuresys-evo`), Phase B0-B12 del ROAD_TO_GLORY_EVO_HARDENING                               |
| CSP              | Content Security Policy                                      | HTTP header che limita le origini delle risorse caricabili dal browser                                                             |
| CSRF             | Cross-Site Request Forgery                                   | Attack class; mitigata in evo via HMAC-bound token + binding cookie HttpOnly                                                       |
| CVA              | class-variance-authority                                     | Lib per type-safe Tailwind variants in componenti React                                                                            |
| ESCO             | European Skills, Competences, Qualifications and Occupations | Tassonomia EU di skill+occupations usata come knowledge graph (legacy)                                                             |
| HMAC             | Hash-based Message Authentication Code                       | Tecnica crypto per derivare un token dal cookie binding usando AUTH_SECRET                                                         |
| HRMS             | Human Resources Management System                            | Categoria del prodotto Heuresys                                                                                                    |
| HSTS             | HTTP Strict Transport Security                               | Header che obbliga HTTPS                                                                                                           |
| JWT              | JSON Web Token                                               | Token formato standard per session payload (algoritmo JWE A256CBC-HS512 in Auth.js)                                                |
| NACE/ATECO       | —                                                            | Classificazioni industria EU (NACE 4-livelli) e ITA (ATECO 6-livelli)                                                              |
| OKLCH            | —                                                            | Color space perceptually uniform usato in tokens.css                                                                               |
| Prisma           | —                                                            | ORM TypeScript-first per PostgreSQL                                                                                                |
| RBP              | Role-Based Permissions                                       | Sistema permessi del legacy Heuresys, 8 ruoli + 33 aree funzionali                                                                 |
| RLS              | Row Level Security                                           | Feature Postgres per filtrare righe per session var (qui: tenant_id)                                                               |
| Roadmap          | —                                                            | `ROAD_TO_GLORY_EVO_HARDENING.md` — SoT operativo Cantiere B                                                                        |
| RTGB             | Road To Glory Bridge                                         | Prefix commit signature per Cantiere B (`[RTGB][PHx-Ty]`)                                                                          |
| Server Component | RSC                                                          | Next.js 13+ React Server Components — render server-side, no JS bundle                                                             |
| Tenant           | —                                                            | Cliente B2B isolato. Multi-tenancy enforce via RLS on `tenant_id` UUID                                                             |
| TOTP             | Time-based One-Time Password                                 | 2FA opzionale (deferred — vedi auth.ts comment)                                                                                    |
| Vitest workspace | —                                                            | Configurazione root `vitest.workspace.ts` che orchestra test cross-workspace npm                                                   |
| Wave             | —                                                            | Sub-batch di tasks dentro una phase RTGB (es. wave 2 = Phase B1 NextAuth migration)                                                |
| Zod              | —                                                            | Library TypeScript-first di runtime schema validation; usata come boundary input                                                   |

## Pattern names

| Pattern                 | Source          | Where used                                                        |
| ----------------------- | --------------- | ----------------------------------------------------------------- |
| Client island           | shadcn/ui       | `services/app/src/app/login/login-form.tsx`                       |
| Composition primitives  | every-layout    | `packages/ui/src/components/layout-primitives.tsx`                |
| Double-submit CSRF      | OWASP           | **rejected** in favor of HMAC-bound (vedi ADR-0012)               |
| Synchronizer token CSRF | OWASP           | Pattern attuale `csrfHmac`                                        |
| HMAC-bound CSRF         | OWASP variant   | Implementato in `services/api-gateway/src/middleware/security.ts` |
| Headless component      | Radix           | Tutti i primitives in `packages/ui/src/components/`               |
| Variant API             | shadcn/ui + CVA | Button/Badge variants typed via VariantProps                      |
| Singleton client        | Prisma          | `services/api-gateway/src/db/pool.ts`                             |
| RLS per-transaction     | Postgres        | `withTenant(tenantId, fn)` helper                                 |

## Acronimi cross-cutting

- **MVP**: Minimum Viable Product
- **DD**: Due Diligence
- **SR**: Session Report (Cantiere A docs)
- **TDR**: Technical Decision Record (alias di ADR in alcuni contesti legacy)
- **DAG**: Directed Acyclic Graph (usato per dependencies di phase/task in roadmap)
