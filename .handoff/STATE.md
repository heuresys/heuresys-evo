# heuresys-evo — Current State

> Updated: 2026-05-06 (post sessione brand L27/L28 + Phase 10 login + promotion-candidates + plan Phase 13 dashboard data-driven approvato)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**Sessione lunga: brand L27/L28 + Phase 10 login + plan Phase 13 dashboard data-driven approvato**. Definite 2 convenzioni richiamabili logo: **L27 "logo originale"** (body `var(--brand-blue)` fisso + y `var(--accent)` fisso) + **L28 "logo relativo"** (body `var(--logo-body, var(--ink))` derivato da tema CSS attivo). Eccezione plain text per indirizzi/link/domini documentata in `02-aesthetic/logo-standard.md`. Retro-update L27 cross-mockup applicato a 51 file (Phase 9 dashboards + Phase 8 motion + typography + icon libraries + 32 direction explorations via sed bulk). Phase 10 login surface 1/5 generato: 5 candidati (base · aurora · split · playful · playful-v2). Creato registro promozione `.ux-design/08-promotion/promotion-candidates.md` con matrice osservatore × layer × rank. **Plan Phase 13 approvato** con autonomous execution mode (41-51 FTE-day · 6 sotto-phase 13.0→13.E · 25 gates · self-monitoring). Commit pushati: `054aeccb → 335a02d → 3fe586d → 7eceb98` (8 commit · 2k+ insertions).

## ⚡ Active workstream — Phase 13 dashboard data-driven (AUTONOMOUS)

**Plan file**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` (CRITICO: leggere PRIMA di tutto next session).

In nuova sessione: **leggere plan file + iniziare bootstrap autonomo**. NO interazione utente richiesta. Decisioni pre-computed in plan § Decision matrix. Self-monitoring via 5 file di stato (STATE.md · legacy-mining-log.md · BRAND-STATE.md · promotion-candidates.md · DECISIONS-LOG.md).

## Top priorities

1. **Phase 13 bootstrap autonomo** (~30 min): leggere plan + scaffold `.handoff/legacy-mining-log.md` + update BRAND-STATE Phase 13 status `🟡 In progress · 13.0 starting` + commit bootstrap. Ref: plan § "Execution checklist" → Bootstrap.
2. **Phase 13.0 Pack 1 HR core** (~2 FTE-day): forensic mining `/employees · /tenants · /users · /roles · /org-units · /workforce` da `D:\enzospenuso\Documents\GitHub\heuresys.com.evo`. Audit + schema parity + adapt + test + commit batch. Ref: plan § Phase 13.0.
3. **Phase 13.0 Pack 2-8** (~12-14 FTE-day): ESCO/Career/Performance/Recruiting/Learning/Onboarding/RBP. Sequenziale dopo pack 1.

## Open questions

- Tunnel SSH a `oracle-vm-default` deve essere up prima di iniziare Phase 13.0 pack 1 (per integration test contro DB evo bare-metal). Verifica con `scripts/dev-local/tunnel-vm.ps1` o equivalente.
- Pre-flight check: `npm run typecheck --workspaces --if-present` deve essere verde prima di iniziare. Se rosso, fix in commit bootstrap.

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
