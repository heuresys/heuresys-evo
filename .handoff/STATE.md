# heuresys-evo — Current State

> Updated: 2026-05-13T01:55Z · S55+2 closed · CASCADIA Stage 0+1a shipped · HEAD `f7ed98c`

## Last session brief

S55+2 ha shippato **CASCADIA Stage 1a TALPIPE** (RTL Bank succession extension +18 candidates). Discovery: RTL Bank ha già 98 candidates con 12 valid (4 plan vuoti + 6 con 2 candidates). Decisione closure: 18 nuovi candidates (12 per 4 plan vuoti + 6 boost). 100% selezione employee-grounded via Claude reasoning + ESCO occupation affinity + performance review rating.

7 commit S55+ shipped totali:

- `4964dba` `7cf611f` `1c94acb` `dd0ede9` (Open Q + WCAG AAA + bundle audit)
- `b696150` (S55 handoff)
- `946af24` **L78 CASCADIA Stage 0** (tooling foundation)
- `9dc2913` (S55+1 handoff)
- `f7ed98c` **L79 CASCADIA Stage 1a** (TALPIPE +18 succession candidates)

**Stage 1a results**:

- 18/18 INSERT success post-zod validation + FK preflight + dedupe check
- Coverage: TUTTI i 10 plan RTL Bank ora hanno 3 candidates esatti (precedentemente 4 plan vuoti + 6 con 2)
- Total RTL Bank candidates: 98 → 116
- `verify-area --area=career_succession` → 🟢 GREEN (all 4 tenant ≥3 threshold)
- Backup `heuresys_platform-pre-S35.3.1-20260513T014931Z.dump` (405MB)

**Cumulative CASCADIA progress** (Stage map 7 stages):

| Stage | Status | Effort speso |
|---|---|---|
| 0 — Foundation tooling | ✅ shipped L78 | ~1.5h |
| 1a — RTL TALPIPE succession | ✅ shipped L79 | ~1h |
| 1b — RTL SKILGRO+PULSAR+GOKMER check-ins | ⏳ pending | ~4h stima |
| 2 — Cross-tenant priority sweep | ⏳ pending | ~10-12h stima |
| 3 — DGOV+workforce+analytics | ⏳ pending | ~3h stima |
| 4 — PROGOV+EPRA | ⏳ pending | ~3-4h stima |
| 5 — Dashboard binding+mat views | ⏳ pending | ~4h stima |
| 6 — Verification+ADR closure | ⏳ pending | ~3h stima |

**Stage 1+ shipped**: 2/7 stage · ~2.5h effective spent.

## Top priorities (S56+)

1. **Stage 1b — RTL Bank SKILGRO + PULSAR + GOKMER check-ins** (~4h):
   - `skilgro/31_recommendations.mjs` → learning_recommendations ~270 (Claude reasoning template)
   - `skilgro/32_skill_gap_analyses.mjs` → skill_gap_analyses ~270 (ESCO-grounded gap calc)
   - `pulsar/41_engagement_responses.mjs` → engagement_survey_responses ~970 (Gaussian distributions, no LLM)
   - `gokmer/22_check_ins.mjs` → check_ins ~540 + goal_check_ins ~1100 (template + reasoning hybrid)
2. **Stage 2 — Cross-tenant priority sweep** (~10-12h, 2-3 sessioni)
3. Stage 3-6 (vedi plan `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md`)

## Open questions

- Backup retention policy: post-Stage backup ~400MB ciascuno × 7 stage = 2.8GB. Pulizia automatica post-verification?
- Stage 1b mass-generation: 270+270+540+1100 = 2180 LLM-driven records → considerare batch parallel multi-claude o pre-generation single batch via reasoning + distributions.mjs hybrid

## Stack snapshot (post-S55+2)

- 7 commit S55+ shipped
- CASCADIA Stage 0+1a complete: lib helpers + orchestrator + verify functional + 1 stage shipped real
- Research engine: Claude native primary confermato funzionale (Stage 1a)
- 4 industry profile JSON validati zod
- RTL Bank succession coverage: 10/10 plans @ 3 candidates each
- DECISIONS-LOG L1→L79
- Backup history: 1 stage backup pre-S35.3.1

## Memory updates

- Nessuna nuova memoria globale (Stage 1a confirma pattern Claude native primary già codificato in `feedback_seed_via_openai.md`)

## Verification

```bash
# Stage 1a smoke (read-only)
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"
  SELECT sp.position_name, COUNT(sc.id) as candidates
    FROM succession_plans sp LEFT JOIN succession_candidates sc ON sc.critical_role_id=sp.id
   WHERE sp.tenant_id='0c54b84a-db6e-4da4-bc91-af5d480d524e'
   GROUP BY sp.id, sp.position_name ORDER BY 2 DESC;\""
# atteso: ogni position_name conta=3

# verify-area
ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && export \$(grep -E '^DATABASE_URL=' services/app/.env | head -1) && node scripts/seed-generator/cascadia/verify-area.mjs --area=career_succession"
# atteso: 🟢 GREEN
```

Riferimenti: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` · `.ux-design/DECISIONS-LOG.md` L78+L79 · `scripts/seed-generator/talpipe/23_succession_extension.mjs` · `db/seeds/realistic/_research_cache/rtl_bank_succession_candidates_generated.json`.
