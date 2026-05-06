# heuresys-evo — Current State

> Updated: 2026-05-06 (Phase 13 bootstrap autonomous · environment up · ready for Pack 1 HR core)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**Sessione precedente**: brand L27/L28 + Phase 10 login + plan Phase 13 approvato. **Sessione corrente**: bootstrap Phase 13 autonomous mode. Environment dev up: tunnel SSH `5432→5432` Postgres + `6380→6379` Redis VM (fix mismatch script), 4 servizi running (api-gateway 8200, app 3200, storybook 6006, enrichment workers), tutti LAN-visible su `192.168.1.8`. Typecheck workspaces verde. BRAND-STATE Phase 13 → `🟡 In progress · 13.0 starting`. Mining log scaffolded.

## ⚡ Active workstream — Phase 13 dashboard data-driven (AUTONOMOUS)

**Plan file**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` (CRITICO: leggere PRIMA di tutto next session).

**Mining log**: [`legacy-mining-log.md`](legacy-mining-log.md) — append-only audit trail per 8 pack legacy.

**Sotto-phase corrente**: 13.0 starting (Pack 1 HR core ⏳ pending).

## Top priorities

1. **Phase 13.0 Pack 1 HR core** (~2 FTE-day): forensic mining `/employees · /tenants · /users · /roles · /org-units · /workforce` da `D:\enzospenuso\Documents\GitHub\heuresys.com.evo`. Audit + schema parity + adapt + test + commit batch. Ref: plan § Phase 13.0.
2. **Phase 13.0 Pack 2-8** (~12-14 FTE-day): ESCO/Career/Performance/Recruiting/Learning/Onboarding/RBP. Sequenziale dopo pack 1.
3. **Phase 13.A→13.E** (~27-35 FTE-day): atomic UI · schema · engine · PROCESS mockup · hardening. Dopo 13.0.

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
