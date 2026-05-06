# heuresys-evo — Current State

> Updated: 2026-05-06 (Phase 13.0 Pack 2 CHIUSO · 4/8 ported + 4/8 Rejected)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 13.0 Pack 2 (ESCO + Skill taxonomy) **CHIUSO**: 4/8 endpoint ported a evo (`/nace` · `/skills` · `/skill-assessments` · `/esco` extend 7/14 handler) · 4/8 SKIPPED Rejected per pattern "thin route + heavy service" (`/skill-analytics` · `/onet` · `/skill-taxonomy` · `/ontology`). 75 test nuovi · suite api-gateway 280/280 verde (era 205 baseline post Pack 1). Allowlist Prisma 16 → 25 model (+9). Ship: 4 commit Pack 2 (`b635703` · `f1a0b67` · `383b5b5` · `cc81e82`). Razionale skip coerente: ogni pack rifiutato è thin wrapper su 600-2000+ LOC service class con dipendenze esterne (CTE recursive, O*NET data files, seed realistici, OpenAI key) che richiedono session dedicata.

## Top priorities (next session)

1. **Pack 2 promotion** (~ad-hoc): smoke test live + acceptance Enzo per portare 4 entry Pack 2 (`/nace` · `/skills` · `/skill-assessments` · `/esco` extend) da `Test Stage` → `PreOp Stage` → `Promoted`. Vedi [`legacy-import-registry.md`](legacy-import-registry.md) § Promotion checklist.
2. **Pack 1 promotion** (~ad-hoc): smoke test 6 entry Pack 1 (`/roles` · `/tenants` · `/users` · `/employees` extend · `/org-units` · `/workforce-planning`).
3. **Pack 2 reopened-deferred** (~10+ FTE-day combined): se prio business cambia, riapri Rejected:
   - `/skill-analytics` quando dashboard analytics FE serve dati reali
   - `/skill-taxonomy` quando admin taxonomy UI richiede classification CRUD
   - `/onet` solo se serve seed pipeline standalone (vs static dump)
   - `/ontology` BLOCK 11+ con OpenAI integration in api-gateway
4. **Pack 1c deferred** (~3 FTE-day): handler skip da Pack 1 (analytics-stats · manager-chain · workforce simulation · applyFieldPolicy · cachedForTenant · auditedTransaction P4 greenfield · seed RBP areas SECURITY+PLATFORM).

## Open questions

- Nessuna blocking. Continuation autonomous-resumable.

## Environment dev (ad fine sessione)

| Servizio | Porta LAN | Status |
|---|---|---|
| API Gateway | `192.168.1.8:8200` | running (Pack 1: 6 endpoint · Pack 2: 4 endpoint nuovi · /esco esteso 7 handler) |
| Next.js | `192.168.1.8:3200` | running |
| Storybook | `192.168.1.8:6006` | running |
| Enrichment workers | n/a | running (Redis VM auth fix) |
| Tunnel SSH | `5432` + `6380→VM:6379` | active |

**Side-effects locali gitignored** (cross-machine to replicate manualmente): tunnel-vm.ps1 forward fix · `services/api-gateway/.env AUTH_TRUST_HOST=true` · `services/enrichment/.env REDIS_URL` con auth.

## Verification

```bash
git status -sb                             # clean? in sync?
git log --oneline -15                      # ultimi commit Phase 13.0 Pack 2
npm run typecheck --workspaces             # gate verde (5/5 workspace)
npm test --workspace=services/api-gateway  # 280/280 verde post Pack 2
cat .handoff/legacy-import-registry.csv | wc -l  # registry SoT (66 rows)
scripts/dev-local/tunnel-vm.ps1 -Status    # tunnel up?
```

## Riferimenti

- **Plan Phase 13**: `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- **Mining log**: [`legacy-mining-log.md`](legacy-mining-log.md)
- **Import registry CSV (SoT)**: [`legacy-import-registry.csv`](legacy-import-registry.csv)
- **Import registry workflow**: [`legacy-import-registry.md`](legacy-import-registry.md)
- **Memoria globale regola import**: `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md`
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Legacy import workflow
