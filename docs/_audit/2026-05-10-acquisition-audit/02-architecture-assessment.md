# D1 — Architecture & Code Health Assessment

> **Auditor**: architect-review subagent · **Data**: 2026-05-10 · **Mandato**: ACQ-AUDIT-2026-05

## TL;DR (≤80 parole)

Architettura monorepo a due tier (`services/*` + `packages/*`) coerente nei principi e ben implementata nei boundary HTTP. Service topology pulita: Next.js 16 (FE+BFF) ↔ Express 5 (API gateway) ↔ Postgres con RLS, JWT cookie cross-service. Pattern dependency direction rispettato (zero import inversi `packages → services`). Tuttavia documentazione architetturale presenta **drift sistematico vs realtà del codice** (workspace fantasma, framework errato, package mai esistito), Prisma client duplicato in 2 service e ADR-0006 obsoleto. Code health solido, governance documentale debole.

## Severity overview

| Finding                                                                                                                                                     | Severity | Evidence                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1.1 — ADR-0006 + monorepo-strategy.md descrivono workspace inesistenti (`services/marketing`, `services/playground`, `packages/types`)                     | high     | `docs/50-reference/decisions/0006-monorepo-boundary.md:18-23`; `docs/20-architecture/monorepo-workspace-strategy.md:14-15,24-72`; ground truth: `services/{api-gateway,app,enrichment}` + `packages/{shared,ui}` |
| F1.2 — `monorepo-workspace-strategy.md:13` dichiara api-gateway "NestJS port 8012" — codice è Express 5 port 8200                                           | high     | `services/api-gateway/package.json:30` (`"express": "^5.2.1"`); `docs/20-architecture/overview.md:29` (Express 5 port 8200, corretto)                                                                            |
| F1.3 — Prisma generated client duplicato in 2 service workspace (no single client package)                                                                  | medium   | `services/app/prisma/generated/client/` + `services/api-gateway/prisma/generated/client/` (10 import sites confermati via grep)                                                                                  |
| F1.4 — Versioni Zod divergenti documentate ma non riflesse: doc dice api-gateway zod@3 / app zod@4; reale tutti su zod@3                                    | medium   | `monorepo-workspace-strategy.md:105-115`; `services/app/package.json:35` (`zod ^3.24.0`); `services/api-gateway/package.json:37` (`zod ^3.24.0`); `packages/ui/package.json:108` (`zod ^3.25.76`)                |
| F1.5 — `services/enrichment` shippato come dependency `bullmq+ioredis+@anthropic-ai/sdk` ma NON wired in topology (CLAUDE.md "Workers" + ADR-0015 "Active") | medium   | `services/enrichment/package.json:19-26`; `docs/20-architecture/overview.md:51-53` ("deferred"); `CLAUDE.md` riga "Workers" tra runtime stack                                                                    |
| F1.6 — `services/app` dichiara nel description "NextAuth v5" ma installato è next-auth v4.24.14 + `@auth/prisma-adapter` v2                                 | medium   | `services/app/package.json:6,30`; CLAUDE.md "Auth: NextAuth v4 (Credentials + bcryptjs)" — descrizione package fuori sync                                                                                        |
| F1.7 — Cross-service JWT decode bifurcation v4↔v5 indica tech-debt non chiuso (NextAuth v4 cookie + Auth.js v5 fallback)                                    | medium   | `services/api-gateway/src/lib/jwt-v4-decoder.ts` (referenced in CLAUDE.md "API runtime"), `services/api-gateway` ha `@auth/express ^0.12.2` ma services/app usa next-auth v4                                     |
| F1.8 — `next lint` deprecato Next.js 16 → ESLint config non migrata, `lint` script app è no-op                                                              | medium   | `services/app/package.json:11` (`"lint": "echo ... && exit 0"`); idem api-gateway:13, enrichment:12, packages/shared, packages/ui                                                                                |
| F1.9 — Deep relative imports oltre 3 livelli in 2 file (low signal ma indicatore mancata path alias)                                                        | low      | `services/app/tests/e2e/helpers/auth.ts:1`; `services/app/src/lib/dashboard-engine/loader.ts:2` (`from '../../../prisma/generated/client/index.js'`)                                                             |
| F1.10 — `npm overrides` in root forza `cookie ^0.7.0` dentro next-auth + @auth/core (workaround vuln non documentato)                                       | low      | `package.json:50-55`; nessun ADR di reference                                                                                                                                                                    |
| F1.11 — Mismatch port doc: `monorepo-workspace-strategy.md` cita "8012" (legacy domain), realtà è 8200 (evo)                                                | low      | `monorepo-workspace-strategy.md:13`; CLAUDE.md confirma 8200                                                                                                                                                     |
| F1.12 — CLAUDE.md dichiara "566 modelli Prisma" + "16 model allowlist api-gateway" — gap di selezione non spiegato in ADR                                   | low      | `CLAUDE.md` Stack table; nessun ADR su criterio allowlist                                                                                                                                                        |

## Findings dettagliati

### F1.1 — Documentazione architetturale descrive workspace inesistenti

**Severity**: high
**Evidence**: `docs/50-reference/decisions/0006-monorepo-boundary.md:18-23` elenca 5 services (`api-gateway`, `app`, `enrichment`, `marketing`, `playground`); `docs/20-architecture/monorepo-workspace-strategy.md:14-15` aggiunge `playground/` e dedica intera sezione (`monorepo-workspace-strategy.md:24-72`) al package `@heuresys/types` ("Single source of truth per i tipi cross-workspace"). Filesystem reale (`ls services/` + `ls packages/`): `services/{api-gateway,app,enrichment}` + `packages/{shared,ui}`. Nessun `marketing`, nessun `playground`, nessun `types`. Grep `@heuresys/types` su tutto il repo: **0 match**.
**Detail**: `services/playground` risulta "archived in B9" nell'ADR ma non è stato fatto né archive marker né update doc. `services/marketing` non è mai stato implementato (legacy `www.heuresys.com` resta su repo separato `heuresys.com.evo` come da CLAUDE.md Domini table). Il package `@heuresys/types` con brand types (`TenantId`, `UserId`) è documentato con esempio di codice completo, package.json, sezione "Consumo da api-gateway" — pura fiction documentale.
**Risk if not addressed**: un acquirer che fa due diligence tecnica leggendo gli ADR si aspetta di trovare quei workspace; la discovery del gap mina credibilità di tutta la documentazione architetturale e suggerisce che altri ADR potrebbero essere stale. Per nuovi sviluppatori onboarding genera confusione operativa concreta.

### F1.2 — Doc monorepo dichiara NestJS, codice è Express 5

**Severity**: high
**Evidence**: `monorepo-workspace-strategy.md:13` "api-gateway/ # NestJS, port 8012". Realtà: `services/api-gateway/package.json:30` `"express": "^5.2.1"`, ADR-0006 `0006-monorepo-boundary.md:14` corretto ("Express 5 backend"), `overview.md:29` corretto. La discrepanza è confinata a `monorepo-workspace-strategy.md` ma è grossolana.
**Detail**: NestJS è framework completamente diverso (DI, decorators, modules) da Express plain con middleware. La doc cita anche "nestjs-zod" per giustificare zod@3 in api-gateway, dipendenza che non esiste in `package.json`.
**Risk if not addressed**: prima impressione dell'acquirer su un doc strategico; segnala documentazione non maintained. Se altri doc hanno errori simili la stack reale del prodotto non è verificabile via lettura.

### F1.3 — Prisma generated client duplicato

**Severity**: medium
**Evidence**: `ls services/app/prisma/generated/client/` e `ls services/api-gateway/prisma/generated/client/` entrambi popolati (`default.d.ts`, `default.js`, `edge.d.ts`...). 10 import sites grep confermati su `prisma/generated/client` cross-services. Entrambi hanno identici script `prisma:pull / prisma:prune / prisma:generate / prisma:refresh` (`services/app/package.json:16-19` + `services/api-gateway/package.json:15-18`).
**Detail**: ogni service rigenera in autonomia il client da pulled schema. CLAUDE.md menziona "Prisma allowlist api-gateway: 16 model" suggerendo che le 2 generazioni sono per scope ridotto in api-gateway, ma niente in ADR formalizza la scelta. Conseguenza pratica: 2 binari Prisma engine, 2 set di tipi che possono divergere se uno dei 2 `prisma:refresh` non viene eseguito. Approccio alternativo standard (un `packages/db` client unico esposto via `@heuresys/db`) non è stato adottato e nemmeno valutato in ADR.
**Risk if not addressed**: drift tipi cross-service silenzioso (api-gateway compila con un Tenant model, services/app con altro), maintenance overhead 2x su prisma upgrade, footprint disco doppio.

### F1.4 — Drift documentazione vs lockfile su versioni Zod

**Severity**: medium
**Evidence**: `monorepo-workspace-strategy.md:105-115` esempio dichiara api-gateway `zod ^3.23.0` + app `zod ^4.0.0` con commento "Next.js 16 usa zod@4". Realtà package.json: `services/app:35` zod `^3.24.0`, `services/api-gateway:37` zod `^3.24.0`, `packages/ui:108` zod `^3.25.76`, `services/enrichment:25` zod `^3.24.0`, `packages/shared:25` zod `^3.24.0`. Tutto su zod@3, nessuno su zod@4.
**Detail**: l'esempio nel doc è didattico ("Esempio reale") ma falso. Suggerisce che nuovi dev potrebbero voler "applicare la regola del workspace divergence" inutilmente, o non capire perché `npm ls zod --workspaces` dia output diverso da quello mostrato.
**Risk if not addressed**: confonde decision-making su upgrade futuri; minore vs F1.1 ma sintomo della stessa malattia.

### F1.5 — `services/enrichment` scaffolded ma non integrato

**Severity**: medium
**Evidence**: `services/enrichment/package.json` dichiara `bullmq ^5.13.0`, `ioredis ^5.4.1`, `@anthropic-ai/sdk ^0.93.0`. Description: "scaffold per RTG Phase 3 task 3.9-3.10". `overview.md:51-53` lo etichetta "deferred". CLAUDE.md Stack table lo cita "Workers / BullMQ + Redis (6380)" come if production. Stessa CLAUDE.md (Test/lint state) riporta "7 enrichment" test, ma nulla su consumer/producer mounting in api-gateway.
**Detail**: il workspace esiste, ha test verdi, ha le dipendenze, ma non risulta startato nel topology runtime (no systemd unit documentata, no entry in dev/build/deploy script root). Queue API non documentata, nessun ADR su backpressure/retry/dead-letter strategy.
**Risk if not addressed**: acquirer chiede "che fa enrichment in prod?" e la risposta è "scaffold". Per una piattaforma SaaS che vende AI workforce orchestration questo è un capability gap percepito.

### F1.6 — Description package.json contradice runtime auth

**Severity**: medium
**Evidence**: `services/app/package.json:6` description: `"Heuresys SaaS dashboard (services/app) — Next.js 16 + NextAuth v5"`. Dependency `services/app/package.json:30` `"next-auth": "^4.24.14"` + `"@auth/prisma-adapter": "^2.11.2"`. CLAUDE.md "Auth: NextAuth v4". Le 3 fonti sono in disaccordo a 2 contro 1 (description sbagliata).
**Detail**: small string ma è una bandiera rossa di leggerezza nei metadata di pacchetto, che spesso vengono letti da tooling di compliance (SBOM, Renovate, Dependabot label).
**Risk if not addressed**: SBOM generato per acquisition data room potrebbe mostrare inconsistenza che richiede chiarimento.

### F1.7 — Bifurcation JWT v4↔v5 come tech-debt

**Severity**: medium
**Evidence**: CLAUDE.md "API runtime" section menziona `services/api-gateway/src/lib/jwt-v4-decoder.ts` (jose `jwtDecrypt` + HKDF NextAuth v4 info string) + "middleware/auth.ts bifurcation v4-cookie → fallback Auth.js v5 `getSession()`". Conferma in services/api-gateway dependency: `@auth/express ^0.12.2` (v5-style) coesiste con jwtDecode custom v4.
**Detail**: cross-service auth funziona (CLAUDE.md "11/11 test green") ma serve manutenere 2 path decode + dual-validation ad ogni richiesta. Migrazione completa a v5 NextAuth/Auth.js rimuoverebbe la bifurcation, riducendo superficie di bug auth-critical. Nessun ADR di plan migration.
**Risk if not addressed**: ogni upgrade di Next.js o Auth.js libraries richiede regression test su entrambi i path; acquirer audit sicurezza segnerà come "non-canonical auth pattern".

### F1.8 — Lint pipeline degradata: 5/5 workspace usano echo no-op

**Severity**: medium
**Evidence**: `services/app/package.json:11`, `services/api-gateway/package.json:13`, `services/enrichment/package.json:12`, `packages/shared/package.json:17`, `packages/ui/package.json:18` tutti pattern `"lint": "echo '... lint via tsc only' && exit 0"`. Commento app: "next lint deprecato in Next.js 16, ESLint flat config TBD". CLAUDE.md root "ESLint 9".
**Detail**: typecheck non sostituisce lint (no-floating-promise, no-unused-vars, react-hooks/exhaustive-deps, import-order, prettier diff). Hooks pre-commit hanno lint-staged + gitleaks ma `npm run lint` workspace livello è morto. `eslint.config.*` flat config TBD da quando Next.js 16 (Q1 2026): ~3 mesi di lint disabled.
**Risk if not addressed**: code health metric "0 lint errors" è ingannevole; bug class catturati da ESLint regole sono presenti non rilevati. Per acquirer è red flag su engineering hygiene.

### F1.9 — Path alias mancante / deep relative imports

**Severity**: low
**Evidence**: `services/app/src/lib/dashboard-engine/loader.ts:2` `import type { Prisma } from '../../../prisma/generated/client/index.js';` quando esiste già alias `@/` (visibile a riga 1: `import { prisma } from '@/lib/db'`). Pattern simile in `services/app/tests/e2e/helpers/auth.ts:1`.
**Detail**: piccola incoerenza, ma sintomo di mancata convenzione enforced (no eslint-plugin-import o no rule no-relative-parent-imports).
**Risk if not addressed**: refactor friction; basso impatto.

### F1.10 — npm overrides root non documentati

**Severity**: low
**Evidence**: `package.json:44-55` 5 overrides (`postcss`, `uuid`, nested `exceljs.uuid`, nested `next-auth.cookie`, nested `@auth/core.cookie`). Nessun riferimento ADR. CLAUDE.md non li menziona. Memoria globale (obs Apr 4) cita "exceljs has nested uuid@8.3.2 unreachable by root override" → fix chirurgico.
**Detail**: overrides sono workaround per CVE/transitive vuln; senza doc è ostico ricostruire perché esistono al prossimo dependency upgrade (rimuovi → torna vulnerability).
**Risk if not addressed**: rimozione accidentale durante "modernize-deps" reintroduce vuln.

### F1.11 — Port 8012 vs 8200

**Severity**: low
**Evidence**: `monorepo-workspace-strategy.md:13` cita port 8012 (legacy `heuresys.com.evo` Docker stack), CLAUDE.md/overview.md confermano 8200 per evo. Solo errore in 1 doc.
**Risk if not addressed**: minor, recuperabile leggendo CLAUDE.md.

### F1.12 — Allowlist Prisma model api-gateway non spiegata

**Severity**: low
**Evidence**: CLAUDE.md "Prisma allowlist api-gateway: 16 model" su un totale di "566 modelli Prisma". Razionale (security? bundle size? maintained surface?) non in ADR.
**Risk if not addressed**: futuro maintainer non sa quale criterio applicare per aggiungere/togliere model dall'allowlist.

## Strengths (cosa funziona bene)

- **Dependency direction enforcement reale**: grep `@heuresys/(api-gateway|app|enrichment)` dentro `packages/`: 0 match. Regola ADR-0006 "packages NON dipendono da services" è rispettata in pratica, non solo in policy.
- **Service topology HTTP-only pulita**: zero import cross-service `services/X → services/Y`. Solo `rbac.test.ts` ha 1 deep relative ma intra-service.
- **JWT cross-service via shared AUTH_SECRET + cookie name canonico**: pattern documentato in `overview.md:71-91` con flow auth completo step-by-step. Auditabile.
- **`packages/shared` exports map ben strutturato** (`./auth`, `./schemas`, `./types`, `./rbp`) con barrel pattern controllato (`packages/shared/package.json:9-15`).
- **Workspace dependencies via `"*"` workspace protocol** (es. `services/app/package.json:25-26` `"@heuresys/shared": "*"`) coerente con ADR-0006 decisione "no semver intra-repo".
- **Engine pin uniforme** (Node ≥20, npm ≥10) su tutti i workspace.
- **Service boundary ports + responsabilità chiari**: 3200 (FE), 8200 (API), 5432 (DB) — tre layer, tre porte, no overlap.
- **Test footprint cross-workspace consistente**: 865 test totali distribuiti (CLAUDE.md), Vitest + Playwright + jest-axe + supertest pattern uniforme.

## Open architectural questions (decisioni pending o ambigue)

- **Single Prisma client package?** F1.3 — adottare `packages/db` per centralizzare generazione + tipi, o mantenere duplicato deliberato (allowlist scope diverso)? Nessun ADR.
- **services/enrichment activation timeline**: F1.5 — quando entra in prod? Quale queue provider (Redis bare-metal nuovo o riusare 6380)? Producer in services/app o api-gateway?
- **Migrazione completa NextAuth v4 → Auth.js v5**: F1.7 — finire il porting o cementare la bifurcation come long-term? Decisione apre/chiude tech debt.
- **ESLint flat config Next.js 16**: F1.8 — chi/quando? Bloccato su upstream `eslint-config-next` flat support?
- **Multi-istanza horizontal scaling**: `overview.md:122` "deferred (richiede swap rate-limit a Redis-backed)" — quando trigger di acquisition driver?
- **Servizi extra ADR-0006 (`marketing`, `playground`)**: marketing va su nuovo workspace o resta su `heuresys.com.evo` legacy? Playground rimosso definitivamente?

## Acquirer perspective

Cosa preoccupa di più un buyer tecnico esterno:

1. **Documentazione architetturale stale** (F1.1, F1.2, F1.4) è il segnale più costoso. Non perché i drift siano in sé bloccanti, ma perché impongono al buyer un re-discovery completo della topology reale per tech due-diligence. ADR-0006, che è "constitution document" del monorepo, dichiara 5 servizi quando ce ne sono 3 + 1 scaffold. Buyer lo legge come "team writes ADR ma non li manutiene". Effort fix: ~6-8h FTE (rewrite ADR + monorepo-strategy + sync overview), ROI alto per signaling.

2. **services/enrichment promesso ma non consegnato** (F1.5). La pitch della piattaforma è "Organizational Intelligence + AI workforce orchestration". L'AI worker è scaffold con bullmq+anthropic ma non running. Buyer chiederà demo: se la risposta è "in roadmap S27+" la valuation della componente AI scende.

3. **Prisma client duplicato** (F1.3) è il più concreto rischio operativo. Drift silenzioso tra api-gateway e app types è failure mode realistico nei prossimi 6 mesi se uno dei due `prisma:refresh` viene dimenticato post-migration. Standard fix (single `packages/db`) è 8-12h FTE ma cambia profilo runtime di api-gateway (allowlist va riimplementata diversamente).

4. **Lint disabled su tutti i workspace** (F1.8) è red flag culturale: 3 mesi di "TBD" su un fix che è 1 file di config. Per buyer questo dice "il team accetta tech debt operazionale", ortogonale alla qualità del codice ma rilevante per operating cadence.

5. **Quello che NON preoccupa** (degno di nota): boundary HTTP-only tra services è ineccepibile, dependency direction è enforced, `packages/shared` exports map è chirurgicamente progettato, workspace protocol è coerente, port topology è ordinata. Il **codice di base è sano**, è la **governance documentale + scaffold non finiti** a generare debito percepito.

**Verdetto sintetico D1**: codice OK, doc da rifare, 2 decisioni architetturali ancora aperte (Prisma client + enrichment) che valgono ~25-40h FTE risolvere.
