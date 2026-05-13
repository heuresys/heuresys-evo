# heuresys-evo — Current State

> Updated: 2026-05-13T02:15Z · S55+4 closed · CASCADIA Stage 0+1+2b SHIPPED · HEAD `a8cd470`

## Last session brief

S55+4 ha shippato **CASCADIA Stage 2b — H2R-Onboarding cross-tenant sweep** in autonomous mode. Continuazione plan `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md`.

**Cumulative S55+ commits** (13 totali):

- Pre-CASCADIA (S55-baseline): 5 commits Open Q + WCAG + bundle audit + handoffs
- **L78 Stage 0** (`946af24`): foundation tooling
- **L79 Stage 1a** (`f7ed98c`): RTL TALPIPE +18 succession
- **L80 Stage 1b** (`2fd6dd1`+`a257ddf`+`96955be`): RTL stat sweep +927
- **L81 Stage 2b** (`70b5f44`+`a8cd470`): cross-tenant onboarding +24 instances +114 tasks

## Cumulative CASCADIA progress

| Stage | Status | Effort | Records |
|---|---|---|---|
| 0 — Foundation tooling | ✅ L78 | ~1.5h | 0 |
| 1a — RTL TALPIPE | ✅ L79 | ~1h | +18 |
| 1b — RTL stat sweep | ✅ L80 | ~0.5h | +927 |
| 2a — Profile refresh non-RTL | ⏳ pending | ~2h | — |
| 2b — Onboarding cross-tenant | ✅ L81 | ~0.5h | +24 inst +114 tasks |
| 2c — GOKMER reviews non-RTL | ⏳ pending | ~2h | — |
| 2d — TALPIPE non-RTL succession | ⏳ pending | ~3h | — |
| 2e — SKILGRO enrollments | ⏳ pending | ~2h | — |
| 2f — SMERTO+recruiting | ⏳ pending | ~2h | — |
| 2g — ESKAP EcoNova KG repair | ⏳ pending | ~1h | — |
| 3 — DGOV+workforce | ⏳ pending | ~3h | — |
| 4 — PROGOV+EPRA | ⏳ pending | ~3-4h | — |
| 5 — Dashboard binding | ⏳ pending | ~4h | — |
| 6 — Verification | ⏳ pending | ~3h | — |

**Shipped**: 4/14 sub-stage · ~3.5h effective · 1083 records totali (945 RTL + 24 inst + 114 tasks = 1083).

## Top priorities (S56+)

1. **Stage 2c — GOKMER reviews non-RTL** (~2h, apply Stage 1b statistical pattern). Target: SmartFood ~80 review_cycle_participants + EcoNova ~40 + Heuresys 1 demo.
2. **Stage 2d — TALPIPE succession non-RTL** (~3h, Claude reasoning grounded). Target: SmartFood +10 + EcoNova +6 candidates con 9-box placement.
3. **Stage 2g — ESKAP EcoNova KG repair** (~1h, semantic mapping job_template → ESCO occupation). Target: HAS_OCCUPATION edges 2 → 26.
4. **Stage 2a — Profile refresh non-RTL** (~2h, Claude WebSearch). Necessario PRIMA di EcoNova onboarding_templates + altri seeding semantici.
5. **Stage 2e-2f** SKILGRO + SMERTO + recruiting cross-tenant (~4h)
6. **Stage 3-6** finale (~13-14h)

## Open questions

- Stage 2a sequencing: profile refresh OK PRIMA o DOPO stage 2c-2f? Probabilmente PRIMA — i profili guida i target counts per Stage 2c+. Ma stage 1b ha funzionato con statistical-only, quindi 2c/2d/2e possono procedere senza profile refresh.
- EcoNova templates: serve dedicato sub-stage (forse h2r/44_onboarding_templates.mjs prima di 45_onboarding)?

## Stack snapshot (post-S55+4)

- 13 commit S55+ shipped (`4964dba` → `a8cd470`)
- CASCADIA Stage 0+1 complete + Stage 2b shipped (4/14 sub-stage)
- Pattern di lavoro emerso (formalizzato L80+L81):
  - **Semantic complex** (TALPIPE): Claude reasoning + JSON cached
  - **Mass-statistical** (engagement/checkins/gap/onboarding): `lib/distributions.mjs` deterministic + template pools
  - **Cross-tenant variance**: TARGETS map per-tenant + skip se prerequisiti mancano (es. templates)
  - **Schema drift**: in-flight column rename, batch fix one-time
  - **Tenant code**: standardizzato DB-native (heuresys, smartfood, econova, rtl-bank)
- 4 industry profile JSON zod-validated
- RTL Bank: succession 116 · engagement 862 · skill_gap 270 · goal_check_ins 1000 · onboarding 15 (+56 tasks)
- SmartFood: onboarding 12 (+54 tasks)
- Heuresys: onboarding 1 (+4 tasks)
- DECISIONS-LOG L1→L81
- Backup history: 3 stage backups (pre-S35.3.1, pre-S35.3.2, pre-S35.4.2)

## Verification

```bash
# Full cross-area smoke
ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && export \$(grep -E '^DATABASE_URL=' services/app/.env | head -1) && node scripts/seed-generator/cascadia/verify-area.mjs --all 2>&1 | tail -20"

# Cumulative count check
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"
  SELECT 'onboarding_instances' as t, count(*), 'tenants_used'::text as note FROM onboarding_instances
   GROUP BY note UNION ALL
  SELECT 'succession_candidates', count(*), 'rtl-bank target 116' FROM succession_candidates WHERE tenant_id='0c54b84a-db6e-4da4-bc91-af5d480d524e';\""
```

Riferimenti: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` · `.ux-design/DECISIONS-LOG.md` L78-L81 · scripts in `scripts/seed-generator/{talpipe,pulsar,gokmer,skilgro,h2r}/`.
