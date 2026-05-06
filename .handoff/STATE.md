# heuresys-evo — Current State

> Updated: 2026-05-06 (Phase 13.0 Pack 1 CHIUSO · 6 endpoint legacy ported · 205/205 test verde · ready for Pack 2 ESCO)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**Sessione precedente**: brand L27/L28 + Phase 10 login + plan Phase 13 approvato. **Sessione corrente**: bootstrap Phase 13 autonomous mode. Environment dev up: tunnel SSH `5432→5432` Postgres + `6380→6379` Redis VM (fix mismatch script), 4 servizi running (api-gateway 8200, app 3200, storybook 6006, enrichment workers), tutti LAN-visible su `192.168.1.8`. Typecheck workspaces verde. BRAND-STATE Phase 13 → `🟡 In progress · 13.0 starting`. Mining log scaffolded.

## ⚡ Active workstream — Phase 13 dashboard data-driven (AUTONOMOUS)

**Plan file**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` (CRITICO: leggere PRIMA di tutto next session).

**Mining log**: [`legacy-mining-log.md`](legacy-mining-log.md) — append-only audit trail per 8 pack legacy.

**Sotto-phase corrente**: 13.0 in progress · Pack 1 (1a + 1b) **COMPLETAMENTE CHIUSO** · Pack 2-8 next.

**Pack 1a (light · 3/3 done)**: /roles ✅ · /tenants ✅ · /users ✅
**Pack 1b (heavy · 3/3 done)**: /employees extend ✅ · /org-units ✅ · /workforce-planning ✅

**Pack 1 deliverable cumulativo**:
- 6 endpoint legacy ported (raw SQL pool → Prisma + zod + RBP)
- ~112 test nuovi · suite api-gateway intera **205/205 verde**
- 4 helper cross-cutting (escapeILIKE, safeParseInt+isUUID+buildMeta, validatePassword+generateSecurePassword, requirePermission lazy)
- Prisma allowlist expanded 9 → 16 model
- 6 commit shipped: `e10cb43` /roles · `f54bf7d` /tenants · `3fc2117` /users · `c0099d1` /employees · `5ef872a` /org-units · `53a181a` /workforce

## Top priorities (next session)

1. **Pack 2 ESCO + Skill taxonomy** (~3-5 FTE-day stima): 8 endpoint legacy `/esco · /skills · /skill-taxonomy · /ontology · /onet · /nace · /skill-analytics · /skill-assessments` (~6000 LOC totali). **Ordine consigliato**: `/nace` (182 LOC quick win) → `/skill-analytics` (289 LOC) → `/skills` (433) → `/skill-assessments` (529) → `/onet` (623) → `/skill-taxonomy` (798) → `/esco` extend (877 LOC, evo ha già `/occupations/search`) → `/ontology` (2260 LOC, biggest, da spezzare). **Allowlist Prisma**: probabile expand con `esco_skills`, `esco_occupations`, `nace_codes`, ecc. — verificare prima del Pack 2.
2. **Pack 3 Career intelligence** (~2 FTE-day): /career-paths · /career-intelligence · /gap-analysis · /talent-intelligence · /succession.
3. **Pack 4 Performance** (~2 FTE-day): /performance-reviews extend · /360-reviews · /calibration-sessions · /merit-cycles · /okrs · /goals.
4. **Pack 5-8** (~5 FTE-day totali): Recruiting · Learning · Onboarding/Time-off · RBP/Audit/Org-systems.
5. **Pack 1c (deferred from Pack 1)**: /employees analytics-stats + manager-chain + direct-reports + applyFieldPolicy · /org-units /:id/path + /:id/move (recursive CTE) · /workforce simulation/aggregation 8 handler · audit P4 helper greenfield · seed RBP areas SECURITY+PLATFORM.
6. **Phase 13.A→13.E** (~27-35 FTE-day): atomic UI · schema · engine · PROCESS mockup · hardening. Dopo 13.0.

## Resume protocol (next session — autonomous)

1. Read `.handoff/STATE.md` (questo file) + `.handoff/legacy-mining-log.md` § Pack 1a · /roles (per pattern adapt) + plan file
2. `git status -sb` (clean? sync?)
3. Verify env: `scripts/dev-local/tunnel-vm.ps1 -Status` (tunnel attivo?) + `npm run typecheck --workspaces --if-present` verde
4. Continue Pack 1a /tenants seguendo decision matrix in plan § Autonomous execution mode

## Environment dev (verificato 2026-05-06 04:59 GMT+2)

| Servizio | Bind | Porta | LAN | Status |
|---|---|---|---|---|
| API Gateway | `::` dual-stack | 8200 | `http://192.168.1.8:8200/health` 200 | ✅ |
| Next.js app | `0.0.0.0` | 3200 | `http://192.168.1.8:3200` 200 | ✅ |
| Storybook | `0.0.0.0` | 6006 | `http://192.168.1.8:6006` 200 | ✅ |
| Enrichment workers | n/a (BullMQ) | — | n/a | ✅ Redis VM connected |
| Tunnel Postgres | `127.0.0.1` only | 5432 | loopback | ✅ |
| Tunnel Redis | `127.0.0.1` only | 6380 → VM 6379 | loopback | ✅ |

**Nota fix tunnel**: `scripts/dev-local/tunnel-vm.ps1` aveva forward `6380:localhost:6380` ma VM Redis (Docker `heuresys_evo_redis`) ascolta su 6379. Corretto a `6380:localhost:6379`.

## Open questions

- Nessuna blocking. Procedo Pack 1 HR core in autonomia (mode da plan § "Autonomous execution").

## Stack snapshot

API Gateway Express 5 (8200) · Frontend Next.js 16 + React 19 + Tailwind 4 (3200) · Workers BullMQ + Redis (6380) · ORM Prisma 5.22 (566 model · `rbp_dashboards` linea 11132 · `widget_catalog` linea 14362) · DB PostgreSQL 16 bare-metal (5432) · Auth NextAuth v4 · Test Vitest 4 (250 verdi). `.ux-design/`: 51 mockup HTML L27-compliant (5 dashboard + 5 motion + 4 login + 1 + Aurora/Split/Playful/Playful-v2 + 32 direction archive + index/typography/icon). `08-promotion/promotion-candidates.md` registro live. **Plan Phase 13 approvato**: 41-51 FTE-day · 6 sotto-phase · 25 gates · 9 dashboard preset target (5 esistenti TALENT/ENT + 4 PROCESS Tier 1).

## Verification

```bash
git status -sb              # working tree clean
git log --oneline -12       # recent: 7eceb98 promotion-candidates, 3fe586d playful-v2, 335a02d L27 retro-update
cat C:/Users/enzospenuso/.claude/plans/credo-che-se-tu-jazzy-key.md | head -50  # plan Phase 13 ref
ls .ux-design/08-promotion/                                 # promotion-candidates.md
ls .ux-design/06-mockups/auth/                              # 5 login + storybook stories
```

## Riferimenti

- **Plan Phase 13 (CRITICO)**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md`
- **Operating baseline**: [`../docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Brand workstream + § Studio workstream
- **BRAND-STATE**: [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md) § Phase 13 In progress
- **DECISIONS-LOG**: [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md) § L27 + L28
- **Promotion candidates**: [`../.ux-design/08-promotion/promotion-candidates.md`](../.ux-design/08-promotion/promotion-candidates.md)
- **Mining log (TBD)**: `../.handoff/legacy-mining-log.md` (da creare in bootstrap Phase 13.0)
