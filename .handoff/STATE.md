# heuresys-evo — Current State

> Updated: 2026-05-13T02:32Z · S55+6 closed · **CASCADIA CHIUSA** · HEAD `898d29b`

## Last session brief

S55+6 chiude **CASCADIA pipeline closure full** dopo 6 sessioni autonomous (S55+1 → S55+6). Discovery decisivo: Stage 4 EPRA era già completamente saturato (267+267 records cross-tenant). Real residue chiuso: EcoNova onboarding_templates seeding (sblocca 2b per EcoNova) + verify-area schema fixes (3 col rename → 0 red residual).

**Cumulative S55+ commits** (20 totali · finale `898d29b`):

- 5 baseline (Open Q + WCAG + bundle)
- 5 handoffs (S55, +1, +2, +3, +4, +5, +6)
- 10 CASCADIA stages + fixes (L78-L83)

## CASCADIA shipped totals

| Stage | Records | Verify | Note |
|---|---:|---|---|
| 0 Foundation | 0 | n/a | tooling+orchestrator+zod L78 |
| 1a TALPIPE RTL | +18 | 🟢 career_succession | L79 |
| 1b RTL stat sweep | +927 | 🟢 engagement/checkins/skill_gap | L80 |
| 2b H2R onboarding cross-tenant | +24 inst +114 tasks | 🟢 onboarding | L81 |
| 2f bonus + 3 workforce + 2f recruiting | +25 | 🟢 analytics+recruiting | L82 |
| 2a-bridge EcoNova templates +2b EcoNova | +5 + 5 inst +22 tasks | 🟢 | L83 |
| 4 EPRA | 0 | 🟢 (already 267+267 saturated) | discovery L83 |
| **GRAND TOTAL** | **+1141 records + 136 tasks** | | |

## verify-area --all FINAL

**🟢 24/26 · 🟡 2/26 · 🔴 0/26**

- 🟡 compensation: salary_bands EcoNova=0 + Heuresys=0 (cosmetic)
- 🟡 compensation_planning: salary_band_assignments EcoNova=0 + Heuresys=0 (cosmetic)

## Stages residue (S57+ opzionali)

1. **Stage 5 — Dashboard binding sweep** (~4h, UX-impactful): rimuovi demo fallback in `services/app/src/app/(app)/dashboard/registry.tsx` (SuccessionCard, KgMiniGraph, SkillHeatmap, CapabilityRadar). DB live data ora disponibile.
2. **salary_bands EcoNova+Heuresys** (~30min, cosmetic): chiude i 2 yellow restanti.
3. **Lighthouse perf re-run cross-tenant** + **axe AAA 4-tenant × 12 surface smoke** (~2h, verification).

## Open questions

- Stage 5 sweep priority: con database ora popolato, demo fallback in registry.tsx mostrano dati hardcoded vs real DB data. Bassa criticità (le route caricano OK) ma UX migliorabile.

## Memory updates

- ✅ Renamed: `feedback_seed_via_openai.md` → `feedback_seed_via_ai.md` (content aggiornato post-CASCADIA shipped)
- MEMORY.md index updated

## Stack snapshot (post-S55+6)

- 20 commit S55+ shipped (`4964dba` → `898d29b`)
- CASCADIA: 7 stage shipped + 4 stage discovered-saturated + 3 stage opzionali residue
- 1141 records + 136 tasks inseriti via CASCADIA pipeline cross-tenant
- 4 industry profile JSON zod-validated, RTL/SmartFood/EcoNova/Heuresys all coverage uniforme
- Pattern formalizzati & riusabili (vedi L83 conclusione):
  - Semantic complex → Claude reasoning + JSON cached
  - Mass-statistical → distributions.mjs deterministic + template pools
  - Cross-tenant variance → TARGETS map + skip preconditions
  - Schema drift → in-flight column rename + dynamic introspect
  - Discovery-driven targeting (audit BEFORE script writing)
  - FK preflight + idempotency app-side
- DECISIONS-LOG L1→L83
- 4 stage backups (pre-S35.3.1, 3.2, 4.2, 4.3 + 1 anchor pre-S35-cascadia baseline historic)

## Verification

```bash
# Full cross-tenant audit
ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && export \$(grep -E '^DATABASE_URL=' services/app/.env | head -1) && node scripts/seed-generator/cascadia/verify-area.mjs --all 2>&1 | tail -5"
# atteso: 🟢 24 · 🟡 2 · 🔴 0

# CASCADIA records census
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"
  WITH t AS (SELECT id, code FROM tenants)
  SELECT 'succession' as cat, t.code, count(*) FROM t JOIN succession_candidates sc ON sc.tenant_id=t.id GROUP BY t.code
  UNION ALL SELECT 'onboarding', t.code, count(*) FROM t JOIN onboarding_instances oi ON oi.tenant_id=t.id GROUP BY t.code
  UNION ALL SELECT 'workforce_scen', t.code, count(*) FROM t JOIN workforce_plan_scenarios wps ON wps.tenant_id=t.id GROUP BY t.code
  UNION ALL SELECT 'bonus', t.code, count(*) FROM t JOIN bonus_plans bp ON bp.tenant_id=t.id GROUP BY t.code
  ORDER BY 1, 2;\""
```

Riferimenti: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` · `.ux-design/DECISIONS-LOG.md` L78-L83 · scripts `scripts/seed-generator/{talpipe,pulsar,gokmer,skilgro,h2r,smerto}/` · `docs/50-reference/decisions/0028-cascadia-universe-seeding.md`.
