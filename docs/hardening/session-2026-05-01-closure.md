# RTGB Cantiere B — Sessione 2026-05-01 closure

**Operatore**: Claude Opus 4.7 (1M context) — autonomous mode
**Mandato**: «leggi /home/ubuntu/heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md ed eseguilo in modalità autonomous»
**Repo target**: `/home/ubuntu/heuresys-evo` (greenfield + GitHub mirror `heuresys/heuresys-evo`)
**Durata**: ~1 sessione interattiva singola
**Commit count**: 11 RTGB commits + 3 phase tags

## Phase status

| Phase                         | Stato        | Tag                           | Note                                                                                                                     |
| ----------------------------- | ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **B0** Bootstrap              | ✅ COMPLETED | `rtgb/phase0/done`            | git init + GitHub privato + automation scripts L3 + husky/commitlint POSIX-clean                                         |
| **B1** Stack stabilization    | ✅ COMPLETED | `rtgb/phase1/done`            | NextAuth v5β.31 → v4.24.14 (5 file rewrite + 2 client islands), TS 6 retained, dev deps pinned, ADR-0009                 |
| **B2** Prisma workflow        | 🟡 PARTIAL   | —                             | B2.1 prisma-verify.sh + B2.3 rls-coverage.sql + B2.4 docs + ADR-0010 done; B2.2 (husky hook) / B2.6-B2.7 pending         |
| **B3** Test infrastructure    | ⏸ PENDING    | —                             | Vitest setup, Playwright, coverage threshold — heavy phase, deferred                                                     |
| **B4** Security baseline      | ⏸ PENDING    | —                             | helmet/CSRF/rate-limit/CSP — heavy phase, deferred                                                                       |
| **B5** Observability          | ⏸ PENDING    | —                             | Pino structured + /health + /metrics — deferred                                                                          |
| **B6** Governance ADRs        | 🟡 PARTIAL   | —                             | ADR-0005/06/07/08/09 (B6.1-B6.5) + ADR-0010 (B2.5 anticipated) + ADR-0015 (B9.5) done; B6.10 ADR-0014 + B6.11/12 pending |
| **B7** Design system          | ⏸ PENDING    | —                             | 30+ components — multi-session effort, biggest single block                                                              |
| **B8** Storybook              | ⏸ PENDING    | —                             | depends on B7                                                                                                            |
| **B9** Services cleanup       | ✅ COMPLETED | (no tag — partial-phase rule) | playground + marketing archived to `archive/`, enrichment status banner                                                  |
| **B10** CI/CD                 | 🟡 PARTIAL   | —                             | build.yml + security.yml + dependabot.yml + existing ci.yml preserved. B10.4/5/7/8 pending                               |
| **B11** Docs polish           | ⏸ PENDING    | —                             | deferred                                                                                                                 |
| **B12** Final smoke + closure | ⏸ PENDING    | —                             | precondition: B3 + B4 + B5 + B7 + B8 + B10                                                                               |

## Commits this session

```
d92c68a [RTGB][PH0-T8] doc: hardening README + smoke ciclo commit+push+pull
4478de4 [RTGB][PH0-T4] config: husky hooks POSIX sh compatibility
61af15a [RTGB][PH0-T4] config: husky 9 + lint-staged 15 + commitlint 19 + prettier 3
295e79d [RTGB][PH0-T5] doc: hardening automation scripts + .rtg-state-evo state
f8bcf32 [RTGB][PH0-T1] init: baseline greenfield evo (214 files, 155k LOC)
127d8aa [RTGB][PH1-T2] deps: NextAuth v5-beta.31 → v4.24.14 (services/app)
937dd97 [RTGB][PH1-T7] adr: stack version strategy + pin dev deps + close B1
+ 4 more for B6/B9/B2/B10 batches
```

## Red flag ledger (mapping closure progress)

| ID           | Descrizione                                             | Stato post-sessione                                                                                                                   |
| ------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| RF-DB-01     | Schema Prisma 15 modelli vs 635+ legacy                 | ACCEPTED (out of scope B, vedi ADR-0009 §Migration path)                                                                              |
| RF-DB-02     | 0 migrazioni Prisma                                     | ACCEPTED + documented (vedi prisma-workflow.md, ADR-0004)                                                                             |
| RF-DB-03     | Workflow `db pull → prune → generate` non automatizzato | PARTIAL — `prisma-verify.sh` creato (B2.1); pre-commit hook (B2.2) ancora pending                                                     |
| RF-DB-04     | RLS policies non gestite da Prisma                      | DESIGN documented (ADR-0008/0010); coverage script ready (`rls-coverage.sql`); live verification deferred a B12                       |
| RF-ST-01     | NextAuth v5 BETA in production                          | ✅ CLOSED — v4.24.14 (vedi ADR-0009)                                                                                                  |
| RF-ST-02     | TypeScript 6 bleeding-edge                              | ✅ ACCEPTED — retained con motivazione (ADR-0009)                                                                                     |
| RF-ST-03     | Tailwind 4 / Storybook 9 / Vite 7                       | ✅ DOCUMENTED stable (ADR-0009)                                                                                                       |
| RF-GO-01     | Solo 4 ADR                                              | ✅ MIGLIORATO — 9 ADR attivi (target ≥ 12 → 3 mancanti: 0011 test cov B3, 0012 security B4, 0013 obs B5, 0014 design B7, 0016 CI B10) |
| RF-GO-02     | No GitHub remote                                        | ✅ CLOSED — `heuresys/heuresys-evo` private creato + push attivo                                                                      |
| RF-GO-03     | No CI/CD                                                | 🟡 PARTIAL — ci/build/security workflows + dependabot pushati; storybook + branch protection pending                                  |
| RF-GO-04     | No commitlint, no husky                                 | ✅ CLOSED — husky 9 + lint-staged 15 + commitlint 19 (RTGB signature accepted)                                                        |
| RF-TQ-01     | ESLint disabilitato 3 workspace                         | ⏸ PENDING (B3+B4 area)                                                                                                                |
| RF-TQ-02     | services/app no test runner                             | ⏸ PENDING (vitest config exists, jsdom setup deferred B3)                                                                             |
| RF-TQ-03     | Coverage ≈ 0%                                           | ⏸ PENDING (B3)                                                                                                                        |
| RF-TQ-04     | services/enrichment, playground placeholder             | ✅ CLOSED — playground archived, marketing archived per criterio quantitativo (3 < 5), enrichment status banner; ADR-0015             |
| RF-SE-01..05 | Security hardening                                      | ⏸ PENDING (B4)                                                                                                                        |
| RF-OB-01..04 | Observability                                           | ⏸ PENDING (B5)                                                                                                                        |
| RF-UI-01..12 | UI / design system                                      | ⏸ PENDING (B7 = 8gg di lavoro stimati)                                                                                                |

## Quantitative metrics

- ADR count pre-B0: 4 (0001-0004)
- ADR count post-B10 (questa sessione): **9 attivi** (0001-0010 + 0015, 0010 incluso, 0011-0014/16 missing)
- Commits RTGB: 11
- Tag pushati: `rtgb/init`, `rtgb/phase0/done`, `rtgb/phase1/done`
- Files added/modified questa sessione: ~40 (esclusi `node_modules` e `package-lock.json`)
- Test status: 12/12 passing (services/app `authorize.test.ts`)
- Typecheck: 0 errors (npm run typecheck workspaces)

## Resume pointers per sessione successiva

`./scripts/hardening/next.sh` punta a `B2.2 husky pre-commit hook prisma-verify`.

**Ordine consigliato per la prossima sessione**:

1. **B6.11 + B6.12** (~30min): README refresh + onboarding.md — facili win di documentation, non bloccano nulla.
2. **B2.2 + B2.6 + B2.7** (~30min): prisma pre-commit hook + test fixtures + db:reset:test script.
3. **B3** (heavy, ~3-4h compressed): vitest workspace config + jsdom + Playwright + coverage thresholds + ADR-0011. Sblocca B7 e B12.
4. **B4** (heavy, ~3-4h): helmet hardened + CSRF middleware + rate-limit + CSP report-only + Zod boundary + ADR-0012.
5. **B5** (~2h): Pino structured + /health + /metrics + ADR-0013.
6. **B7 + B8** (multi-session, ~8-10h): design system espansione + storybook stories. Il blocco più pesante. Considerare di delegare a subagent paralleli per categoria di componente (primitives/patterns/viz/motion).
7. **B11**: docs final + DX polish.
8. **B12**: final smoke + closure-report.md + tag `rtgb/v1.0-evo-hardened`.

## Esecuzione comandi resume

```bash
cd /home/ubuntu/heuresys-evo
./scripts/hardening/status.sh    # vedi stato corrente
./scripts/hardening/next.sh      # vedi task corrente
./scripts/hardening/done.sh      # marca task completato + commit auto
```

Lo state è in `.rtg-state-evo/state.json`. La dashboard HTML viene rigenerata a ogni `status.sh`.

## Decisioni autonomy applicate

Per direttiva «carta bianca tecnica» (§1.1 roadmap):

1. **NextAuth v4 downgrade applicato per intero** nonostante l'app router server-action `signIn` non sia natively supportato. Workaround: client islands `login-form.tsx` + `sign-out-button.tsx`. ADR-0009 documenta il trade-off.
2. **Cookie name `authjs.session-token` forzato in v4** per cross-service compat con `@auth/express` v5 (vedi ADR-0007).
3. **`services/marketing` archiviato** strict per criterio quantitativo (3 < 5 file in src/) anche se la dir era recoverable; ADR-0015 normalizza la policy.
4. **`@auth/prisma-adapter@^2` retained dormant** invece di downgrade a v1: l'adapter non è wired (JWT strategy only), quindi nessun runtime impact.

## File chiave

- `/home/ubuntu/heuresys-evo/ROAD_TO_GLORY_EVO_HARDENING.md` (legacy `.com.evo`) — SoT roadmap
- `/home/ubuntu/heuresys-evo/.rtg-state-evo/state.json` — state machine
- `/home/ubuntu/heuresys-evo/scripts/hardening/*.sh` — automation L3
- `/home/ubuntu/heuresys-evo/docs/decisions/*` — 9 ADR attivi
- `/home/ubuntu/heuresys-evo/docs/hardening/README.md` — entry point cantiere B
- `/home/ubuntu/heuresys-evo/docs/guides/prisma-workflow.md` — workflow DB

## Stato finale

Lavoro su 3 phase complete (B0 + B1 + B9), 3 phase parzialmente avanzate (B2 + B6 + B10), e 7 phase pending. Il setup automation (B0) + governance (B6 partial) consente alla prossima sessione di riprendere senza ricostruzione contesto: basta eseguire `./scripts/hardening/next.sh` e seguire l'ordine consigliato sopra.

L'obiettivo «zero debiti» della Definition of Done (§1.2) richiede 7 phase pending. Stima residua: 25-35 dev-day in modalità autonoma compressa, di cui B7 (design system) è 40-50% del residuo.
