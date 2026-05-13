# heuresys-evo — Current State

> Updated: 2026-05-13T01:42Z · S55+1 closed · CASCADIA Stage 0 shipped · HEAD `946af24`

## Last session brief

S55+1 ha completato **CASCADIA Stage 0 (tooling foundation)** secondo plan approvato `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md`. Decisione architetturale chiave: **Claude main loop = research engine primary** (WebFetch + WebSearch + reasoning Opus 4.7), OpenAI gpt-4o-mini fallback opzionale. Cost CASCADIA full closure stimato $0 (Claude native) vs ~$2.50 (OpenAI mix).

5 commit S55+ shipped total:

- `4964dba` deps lock `@next/bundle-analyzer`
- `7cf611f` Open Q1+Q2 workforce KPI fix + Turbopack-native analyzer
- `1c94acb` L76 WCAG AAA 15-palette batch
- `dd0ede9` L77 bundle perf audit
- `b696150` S55 handoff
- `946af24` **L78 CASCADIA Stage 0 tooling foundation** (8 files, 945 insertions)

**Stage 0 deliverables** (`scripts/seed-generator/`):

- `cascadia/run-stage.mjs` — orchestrator universal `--stage <sigla>/<NN> --tenant <slug> --dry-run --engine claude-native|openai-mini`
- `cascadia/verify-area.mjs` — 25-area SQL verification per-tenant + classification 🟢/🟡/🔴
- `cascadia/research-bridge.md` — workflow Claude-native + fallback rules
- `indoor/00_research.mjs` — template stage script Claude-native pattern
- `lib/zod-schemas.mjs` — IndustryProfileSchema + 5 record schemas + dual-key drift handling
- `lib/dry-run.mjs` — wrapper intercept INSERT/UPDATE
- `lib/industry-research.mjs` — riscritto Claude-native primary
- `lib/openai-wrapper.mjs` — semplificato fallback con live API + cost cap

**Acceptance Stage 0 PASS**: 4/4 tenant profile validati zod · orchestrator dry-run 4/4 OK · tenant code↔file stem mapping functional.

## Top priorities (S56+)

> Stage map autonomous mode (vedi `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md`)

1. **Stage 1 — RTL Bank pilot consolidamento** (~6-8h, 1-2 sessioni)
   - Sub-stage 1a TALPIPE: succession_candidates 15→40 + internal_mobility ~20 + mentorships ~12 (Claude reasoning per ≥70% skill coverage gate)
   - Sub-stage 1b SKILGRO+PULSAR+GOKMER: learning_recommendations ~270 + skill_gap_analyses ~270 + engagement_responses ~970 + check_ins ~540 + goal_check_ins ~1100
   - Backup pre-stage + verify-area post-INSERT
2. **Stage 2 — Cross-tenant priority-first sweep** (~10-12h, 2-3 sessioni)
   - Profile refresh SmartFood/EcoNova/Heuresys via Claude WebFetch/WebSearch
   - H2R-Onboarding sweep + GOKMER reviews + TALPIPE succession non-RTL + SKILGRO enrollments + SMERTO bonus + recruiting + ESKAP EcoNova KG repair
3. **Stage 3-4 — DGOV+PROGOV+EPRA sweep** (~6-7h, 2 sessioni)
4. **Stage 5 — Dashboard binding sweep + mat views** (~4h, 1 sessione)
5. **Stage 6 — Verification finale + ADR-0028 closure** (~3h, 1 sessione)

**Effort cumulativo**: 29-34h residue · 7-9 sessioni stimate.

## Open questions

- Schema drift profile JSON tra tenant (RTL `title`/`name`/`ccnl_reference_code` vs altri `title_it`/`name_it`/`ccnl_code`) — Zod schema gestisce entrambi via union+refine. Harmonization opzionale in Stage 2a profile refresh.
- Sindacati FK linkage SmartFood/EcoNova/Heuresys — ITLAB shipped solo 4 anchor CCNL (CRED_2024, ALIMENTARI, ELETTRICI, COMM_2024). Verifica Stage 2c pre-INSERT.

## Stack snapshot (post-S55+1)

- 6 commit S55+ shipped (`4964dba` → `946af24`)
- CASCADIA infrastruttura 95%→100%: lib helpers + zod + orchestrator + verify pronti
- Research engine: Claude native primary, OpenAI fallback gpt-4o-mini con cost cap $5/day
- 4 industry profile JSON validati: RTL Bank (22 roles K.64.19) · SmartFood (28 roles C.10) · EcoNova (14 roles D.35) · Heuresys (5 roles J.62)
- DECISIONS-LOG L1→L78, 0 orphans
- Nuovi files: `scripts/seed-generator/cascadia/*` + `scripts/seed-generator/indoor/00_research.mjs` + 2 nuovi lib helper

## Memory updates

- `feedback_seed_via_openai.md` (esistente) → da rinominare `feedback_seed_via_ai.md` in Stage 6 verification handoff (Claude native è il path primary, non OpenAI)

## Verification

```bash
# Smoke Stage 0 acceptance:
LOCAL=$(git rev-parse HEAD); VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
node scripts/seed-generator/cascadia/run-stage.mjs --tenant=rtl-bank --stage=indoor/00_research --dry-run --engine=claude-native
# atteso: "research delegated to Claude main loop" + exit 0

# Validate zod su 4 profile:
node --experimental-vm-modules -e "import('./scripts/seed-generator/lib/zod-schemas.mjs').then(async (m)=>{const fs=await import('node:fs/promises');for(const t of ['rtl_bank','smartfood','econova','heuresys']){const raw=JSON.parse(await fs.readFile('db/seeds/realistic/_research_cache/'+t+'_industry_profile.json','utf-8'));const r=m.validateIndustryProfile(raw);console.log(t, r.ok?'OK':'FAIL')}});"

# Verify-area smoke (requires DATABASE_URL):
DATABASE_URL=postgresql://... node scripts/seed-generator/cascadia/verify-area.mjs --area=career_succession
```

Riferimenti: `~/.claude/plans/l-obiettivo-di-completare-soft-wind.md` · `.ux-design/DECISIONS-LOG.md` L78 · `scripts/seed-generator/cascadia/research-bridge.md` · `scripts/seed-generator/lib/zod-schemas.mjs`.
