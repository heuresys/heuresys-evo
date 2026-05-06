# heuresys-evo — Current State

> Updated: 2026-05-06 · Phase 13 fully closed · smoke test live OK · Pack 1-8 promoted · Phase 14 scope drafted

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 13 (6 sotto-phase) eseguita end-to-end in autonomous: 8 atomic component TIER 17 + schema migration 0002 + engine renderer + 4 mockup PROCESS + doc canonical. Smoke test live verde (9/9 dashboard via `/dashboard/<code>` con HR_DIRECTOR + SUPERUSER · RBP + perspective filter validati). 30 endpoint Pack 1-8 Promoted nel registry CSV. Phase 14 scope draft pronto per decision.

## Top priorities (next session — FRESH per Phase 14)

1. **Phase 14 bundle decision** (~30min): leggere [`docs/70-planning/phase14-scope.md`](../docs/70-planning/phase14-scope.md), scegliere bundle (default R: A+D+H+F · ~25-32 FTE-day), generare nuovo plan in `~/.claude/plans/`.
2. **Phase 14 execution** (~25-50 FTE-day): autonomous mode stile Phase 13 con bundle scelto.
3. **Mockup PROCESS expansion B** (~4-6 FTE-day, optional): solo se headroom; V1 mockup sono ~150 LOC placeholder.

## Open questions

- D14: bundle Phase 14 (R/M/C/U/F o ad-hoc)? Default R raccomandato.

## Stack snapshot

| Layer       | Tech                                                              |
| ----------- | ----------------------------------------------------------------- |
| API Gateway | Express 5 · 8200 · 30 endpoint Pack 1-8 mounted                   |
| Frontend    | Next.js 16 · 3200 · `/dashboard/[code]` data-driven engine        |
| UI Library  | `packages/ui` Cantiere B · TIER 17 atomic dashboard (8 component) |
| DB          | Postgres 16 bare-metal · migration 0002 + 9 preset + 30 element   |
| Test        | Vitest · ~565 verde · packages/ui 85 · services/app 34            |

## Background processes attivi

- api-gateway:8200 (npm run dev · bg `b6ebkc8jc`) · Next.js:3200 (bg `bvwor3v7i`)
- Tunnel SSH PID 6428 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop)
- Storybook:6006 + Enrichment workers running

## Verification

```bash
git status -sb && git log --oneline -5
npm run typecheck --workspaces --if-present     # 5/5 verde
npm test --workspace=packages/ui                # 85/85 verde
npm test --workspace=services/app               # 34/34 verde
curl -sI http://localhost:3200/dashboard/hr_director_overview  # post-login session
```

## Riferimenti

- Plan Phase 13 (executed): `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- Phase 14 scope: [`docs/70-planning/phase14-scope.md`](../docs/70-planning/phase14-scope.md)
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md)
- DECISIONS-LOG: L29 (13.A) · L30 (13.B) · L31 (13.C/D/E)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv) (30 Promoted · 57 Test Stage · 36 Rejected)
