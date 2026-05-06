# heuresys-evo — Current State

> Updated: 2026-05-06 (Phase 13.0 Pack 1 CHIUSO + legacy import registry shipped)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 13.0 Pack 1 (HR core) **CHIUSO COMPLESSIVO**: 6 endpoint legacy ported a evo (roles · tenants · users · employees-extend · org-units · workforce-planning) · ~112 test nuovi · suite api-gateway 205/205 verde · 4 helper cross-cutting · Prisma allowlist 9→16 model. Ship: 9 commit Phase 13 (`5ba982f → ab21c23`). Creato **legacy import registry** strutturato (`.handoff/legacy-import-registry.csv` + `.md`) con stage workflow `Test Stage → PreOp Stage → Promoted/Rejected` e vincolo "estirpazione clean" — regola cross-progetto salvata in memoria globale.

## Top priorities (next session)

1. **Pack 2 ESCO + Skill taxonomy** (~3-5 FTE-day): 8 endpoint legacy `/nace · /skill-analytics · /skills · /skill-assessments · /onet · /skill-taxonomy · /esco extend · /ontology` (~6000 LOC totali). Ordine consigliato: quick win `/nace` (182 LOC) → progressivo verso `/ontology` (2260 LOC). Probabile expand allowlist Prisma (esco_skills, esco_occupations, ecc.). Plan ref: `~/.claude/plans/credo-che-se-tu-jazzy-key.md` § Phase 13.0 Pack 2.
2. **Pack 1 promotion** (~ad-hoc): smoke test live + acceptance Enzo per portare entry da `Test Stage` → `PreOp Stage` → `Promoted`. Vedi [`legacy-import-registry.md`](legacy-import-registry.md) § Promotion checklist.
3. **Pack 1c deferred** (~3 FTE-day): handler skip da Pack 1 (analytics-stats · manager-chain · workforce simulation · applyFieldPolicy · cachedForTenant · auditedTransaction P4 greenfield · seed RBP areas SECURITY+PLATFORM). Stage attuale: tutti `Rejected` nel registry — riapri se servono.

## Open questions

- Nessuna blocking. Continuation autonomous-resumable.

## Environment dev (ad fine sessione)

| Servizio | Porta LAN | Status |
|---|---|---|
| API Gateway | `192.168.1.8:8200` | running (con 6 nuovi endpoint Pack 1) |
| Next.js | `192.168.1.8:3200` | running |
| Storybook | `192.168.1.8:6006` | running |
| Enrichment workers | n/a | running (Redis VM auth fix) |
| Tunnel SSH | `5432` + `6380→VM:6379` | active |

**Side-effects locali gitignored** (cross-machine to replicate manualmente): tunnel-vm.ps1 forward fix · `services/api-gateway/.env AUTH_TRUST_HOST=true` · `services/enrichment/.env REDIS_URL` con auth.

## Verification

```bash
git status -sb                             # clean? in sync?
git log --oneline -12                      # ultimi commit Phase 13.0 Pack 1
npm run typecheck --workspaces             # gate verde
npm test --workspace=services/api-gateway  # 205/205 verde
cat .handoff/legacy-import-registry.csv | head -3  # registry SoT
scripts/dev-local/tunnel-vm.ps1 -Status    # tunnel up?
```

## Riferimenti

- **Plan Phase 13**: `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- **Mining log**: [`legacy-mining-log.md`](legacy-mining-log.md)
- **Import registry CSV (SoT)**: [`legacy-import-registry.csv`](legacy-import-registry.csv)
- **Import registry workflow**: [`legacy-import-registry.md`](legacy-import-registry.md)
- **Memoria globale regola import**: `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md`
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Legacy import workflow
