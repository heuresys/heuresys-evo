# heuresys-evo — Current State

> Updated: 2026-05-13T02:25Z · S55+5 closed · CASCADIA Stage 0+1+2b+2f+3-partial SHIPPED · HEAD `30936e9`

## Last session brief

S55+5 (carry-forward batch closure) ha shippato **bonus_plans + workforce_plan_scenarios + recruiting_candidates** cross-tenant. Discovery anche che reviews/course_enrollments/kg_edges/succession_plans non-RTL erano già saturati. Real gap residue era piccolo (~25 records totali).

**Cumulative S55+ commits** (16 totali):

- Pre-CASCADIA (5 baseline): Open Q + WCAG + bundle audit
- Handoffs (4): S55, S55+1, S55+2, S55+3, S55+4, S55+5
- CASCADIA stages (7):
  - `946af24` **L78 Stage 0** tooling
  - `f7ed98c` **L79 Stage 1a** TALPIPE +18
  - `2fd6dd1`+`a257ddf`+`96955be` **L80 Stage 1b** stat sweep +927
  - `70b5f44`+`a8cd470` **L81 Stage 2b** onboarding +24 inst +114 tasks
  - `fad4e59`+`a499049`+`30936e9` **L82 Stage 2f+3** carry-forward +25

## Cumulative CASCADIA progress

| Stage | Status | Records | Verify |
|---|---|---:|---|
| 0 — Foundation tooling | ✅ L78 | 0 | n/a |
| 1a — RTL TALPIPE | ✅ L79 | +18 | 🟢 career_succession |
| 1b — RTL stat sweep | ✅ L80 | +927 | 🟢 engagement/checkins/skill_gap |
| 2b — Onboarding cross-tenant | ✅ L81 | +24 inst +114 tasks | 🟢 onboarding |
| 2f bonus_plans | ✅ L82 | +4 | 🟢 (no verify-area entry) |
| 3 workforce_scenarios | ✅ L82 | +11 | 🟢 analytics |
| 2f recruiting non-RTL | ✅ L82 | +10 | 🟢 recruiting |
| 2c — GOKMER reviews non-RTL | ❌ skip | (already saturate) | 🟢 |
| 2d — TALPIPE non-RTL succession | ❌ skip | (already saturate) | 🟢 |
| 2e — SKILGRO enrollments non-RTL | ❌ skip | (already saturate) | 🟢 |
| 2g — ESKAP EcoNova KG | ❌ skip | (already saturate 26/26) | 🟢 |
| 2a — Profile refresh | ⏳ optional | — | (zod schema handles drift) |
| 4 — PROGOV+EPRA | ⏳ pending | TBD | — |
| 5 — Dashboard binding sweep | ⏳ pending | TBD | — |
| 6 — Verification + ADR closure | ⏳ pending | TBD | — |

**Stages shipped**: 7/14 sub-stage real · 4 sub-stage discovered as already-complete · 3 stage finali pending (4, 5, 6).

**GRAND TOTAL records inseriti CASCADIA S55+**: **1108 records + 114 tasks**.

## verify-area --all summary

- 🟢 20/25 areas GREEN
- 🟡 2/25 (compensation_planning Eco+Heu cosmetic, italian_labor partial)
- 🔴 3/25 (verify-area script issues — wrong column names per dashboard_presets/elements + italian_labor table name)

## Top priorities (S56+)

1. **Stage 5 — Dashboard binding sweep** (~4h, UX-impactful): sweep `services/app/src/app/(app)/dashboard/registry.tsx` per rimuovere demo fallback su widget (SuccessionCard, KgMiniGraph, SkillHeatmap, CapabilityRadar). Source DB live data ora disponibile post-Stage 1+2.
2. **Stage 6 — Verification finale** (~3h): re-execute verify-area --all, fix verify-area schema issues (dashboard_presets/elements column names), full axe AAA cross-tenant smoke, Lighthouse re-run, ADR-0028 → accepted-implemented, memory rename `feedback_seed_via_openai.md` → `feedback_seed_via_ai.md`.
3. **Stage 4 — PROGOV+EPRA** (~3-4h, secondary): workflow_steps + approval_chains + turnover_risk_scores. Widget secondari, non blocking.
4. **EcoNova onboarding_templates** (~30min): standalone fix to unblock h2r/45_onboarding for EcoNova.

## Open questions

- Stage 4 priority real? PROGOV/EPRA backing widget secondari — può essere deferred S57.
- verify-area refinement: fix wrong columns `dashboard_presets`/`dashboard_elements` + table `holiday_calendars_it` → real name probably `it_holidays` o simile. Quick fix in S56.

## Stack snapshot (post-S55+5)

- 16 commit S55+ shipped (`4964dba` → `30936e9`)
- CASCADIA: 7/14 stage shipped + 4 stage discovered-complete · 3 stage pending (4, 5, 6)
- 1108 records + 114 tasks inseriti totali via CASCADIA pipeline
- 4 industry profile JSON zod-validated
- Pattern stabili formalizzati:
  - Semantic complex → Claude reasoning + JSON cached
  - Mass-statistical → distributions.mjs + template pools
  - Cross-tenant variance → TARGETS per-tenant map + skip se preconditions assenti
  - Schema drift → in-flight column rename fix + dynamic schema introspect
  - Discovery-driven targeting → count BEFORE script (avoid over-engineering)
- DECISIONS-LOG L1→L82
- Backup history: 4 stage backups (pre-S35.3.1, 3.2, 4.2, 4.3)

## Verification

```bash
# Quick state check
ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && export \$(grep -E '^DATABASE_URL=' services/app/.env | head -1) && node scripts/seed-generator/cascadia/verify-area.mjs --all 2>&1 | tail -5"
# atteso: 🟢 20 · 🟡 2 · 🔴 3 (verify-area script issues, non data issues)

# Cumulative count check
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"
  SELECT 'bonus_plans' as t, code, count(*) FROM tenants JOIN bonus_plans ON bonus_plans.tenant_id=tenants.id GROUP BY code
  UNION ALL SELECT 'workforce_plan_scenarios', code, count(*) FROM tenants JOIN workforce_plan_scenarios ON workforce_plan_scenarios.tenant_id=tenants.id GROUP BY code
  UNION ALL SELECT 'recruiting_candidates', code, count(*) FROM tenants JOIN recruiting_candidates ON recruiting_candidates.tenant_id=tenants.id GROUP BY code
  ORDER BY 1, 2;\""
```

Riferimenti: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` · `.ux-design/DECISIONS-LOG.md` L78-L82 · scripts `scripts/seed-generator/{talpipe,pulsar,gokmer,skilgro,h2r,smerto}/`.
