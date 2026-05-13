# heuresys-evo — Current State

> Updated: 2026-05-13T02:05Z · S55+3 closed · CASCADIA Stage 0+1 SHIPPED · HEAD `96955be`

## Last session brief

S55+3 ha shippato **CASCADIA Stage 1 completa (1a + 1b)**. RTL Bank pilot consolidamento: +945 records totali.

11 commit S55+ shipped totali (S55 baseline + S55+1 Stage 0 + S55+2 Stage 1a + S55+3 Stage 1b):

- `4964dba` `7cf611f` `1c94acb` `dd0ede9` (Open Q + WCAG + bundle audit)
- `b696150` `9dc2913` `5f36d17` (handoff S55, S55+1, S55+2)
- `946af24` **L78 CASCADIA Stage 0** tooling
- `f7ed98c` **L79 CASCADIA Stage 1a** TALPIPE +18 succession
- `2fd6dd1` `a257ddf` `96955be` **L80 CASCADIA Stage 1b** 3-script statistical +927 records

**Cumulative Stage 1 RTL Bank totals**:

| Sigla | Tabella | Pre | Post | Delta |
|---|---|---:|---:|---:|
| TALPIPE | succession_candidates | 98 | 116 | +18 |
| PULSAR | engagement_survey_responses | 659 | 862 | +203 |
| SKILGRO | skill_gap_analyses | 66 | 270 | +204 |
| GOKMER | goal_check_ins | 480 | 1000 | +520 |
| **TOTAL** | | | | **+945** |

**Verify-area cross-tenant**: career_succession 🟢 · engagement 🟢 · checkins 🟢 · learning_recommendations 🟢.

## Cumulative CASCADIA progress (Stage map 7 stages)

| Stage | Status | Effort | Records |
|---|---|---|---|
| 0 — Foundation tooling | ✅ shipped L78 | ~1.5h | 0 |
| 1a — RTL TALPIPE succession | ✅ shipped L79 | ~1h | +18 |
| 1b — RTL SKILGRO+PULSAR+GOKMER | ✅ shipped L80 | ~0.5h | +927 |
| 2 — Cross-tenant priority sweep | ⏳ pending | ~10-12h | TBD |
| 3 — DGOV+workforce+analytics | ⏳ pending | ~3h | TBD |
| 4 — PROGOV+EPRA | ⏳ pending | ~3-4h | TBD |
| 5 — Dashboard binding+mat views | ⏳ pending | ~4h | TBD |
| 6 — Verification+ADR closure | ⏳ pending | ~3h | TBD |

**Stage 0+1 shipped**: 3/7 stage chiusi · ~3h effective spent · 945 records RTL Bank.

## Top priorities (S56+)

1. **Stage 2 — Cross-tenant priority-first sweep** (~10-12h, 2-3 sessioni):
   - 2a Profile research refresh SmartFood/EcoNova/Heuresys via Claude WebSearch/WebFetch
   - 2b H2R-Onboarding sweep (onboarding_instances da 4 RTL → 10-15 per tenant)
   - 2c GOKMER reviews/cycles SmartFood+EcoNova+Heuresys (~120 reviews)
   - 2d TALPIPE succession non-RTL (SmartFood +10 + EcoNova +6)
   - 2e SKILGRO enrollments+recommendations non-RTL
   - 2f SMERTO bonus + recruiting funnel non-RTL
   - 2g ESKAP EcoNova KG repair (HAS_OCCUPATION 2 → 26)
2. **Stage 3-4** (DGOV+PROGOV+EPRA): users.employee_id FK + workforce_plan_scenarios cross-tenant + workflow_steps + turnover_risk_scores
3. **Stage 5** dashboard binding sweep + mat views refresh
4. **Stage 6** verification finale + ADR-0028 → accepted-implemented

## Open questions

- Pattern Stage 2c: GOKMER non-RTL può adottare lo stesso statistical pattern Stage 1b? (probabilmente sì — reviews shape uniforme cross-tenant)
- Schema drift mitigation per Stage 2+: implementare preflight `\\d <table>` introspect in run-stage.mjs prima di INSERT? Considerare aggiunta a Stage 2a.

## Stack snapshot (post-S55+3)

- 11 commit S55+ shipped (`4964dba` → `96955be`)
- CASCADIA Stage 0+1 complete (3/7 stage)
- Pattern di lavoro emerso:
  - Single-record semantic complex (TALPIPE succession): Claude reasoning + JSON cached
  - Mass-statistical records (engagement/checkins/gap_analyses): `lib/distributions.mjs` deterministic + template pools
  - Schema drift inevitabile su DBMS legacy: in-flight column rename fix pattern stabilizzato
- 4 industry profile JSON zod-validated (RTL Bank/SmartFood/EcoNova/Heuresys)
- RTL Bank coverage: succession 10/10 plans @ 3 candidates · engagement 862 responses · 270 skill_gap_analyses · 1000 goal_check_ins
- DECISIONS-LOG L1→L80
- Backup history: 2 stage backups pre-S35.3.1 + pre-S35.3.2

## Verification

```bash
# RTL Bank Stage 1 closure smoke (read-only)
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"
  SELECT 'succession_candidates' as t, count(*) FROM succession_candidates WHERE tenant_id='0c54b84a-db6e-4da4-bc91-af5d480d524e'
  UNION ALL SELECT 'engagement_responses', count(*) FROM engagement_survey_responses WHERE tenant_id='0c54b84a-db6e-4da4-bc91-af5d480d524e'
  UNION ALL SELECT 'skill_gap_analyses', count(*) FROM skill_gap_analyses WHERE tenant_id='0c54b84a-db6e-4da4-bc91-af5d480d524e'
  UNION ALL SELECT 'goal_check_ins', count(*) FROM goal_check_ins WHERE tenant_id='0c54b84a-db6e-4da4-bc91-af5d480d524e';\""
# atteso: 116 / 862 / 270 / 1000

# verify-area cross-area
ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && export \$(grep -E '^DATABASE_URL=' services/app/.env | head -1) && node scripts/seed-generator/cascadia/verify-area.mjs --all 2>&1 | tail -10"
```

Riferimenti: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` · `.ux-design/DECISIONS-LOG.md` L78+L79+L80 · scripts `scripts/seed-generator/{talpipe,pulsar,gokmer,skilgro}/`.
