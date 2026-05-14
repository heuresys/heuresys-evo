# DECISIONS-LOG-v2 — Cycle 2 (append-only)

> Append-only log decisioni cycle 2 post-S62 reset 2026-05-13. Cycle 1 (L1-L87) archiviato in `../.ux-design-archive-2026-05-13/DECISIONS-LOG.md`, NON ereditato automaticamente.
> Migration scorecard: `04-promotion/decision-migration-audit.md`.
> Format entry: `## L-NN (YYYY-MM-DD) — <titolo>` + body.

---

## L1 (2026-05-13) — Brand & design system reset cycle 2

**Decisione**: avviato cycle 2 del workstream brand identity & design system di heuresys-evo. Cycle 1 (S22→S61, 87 decisioni L1-L87, 1027 file) archiviato come immutabile in `../.ux-design-archive-2026-05-13/`. Production CSS layer consolidato in 1 SoT canonical `services/app/src/styles/tokens.css`. Promotion process v2 (`/studio2:*`) sostituisce v1 (`/studio:*` frozen DEPRECATED).

**Razionale**: stratificazione 10 giorni operativi senza pruning ha generato 4 SoT parallele non sincronizzate (mockup HTML ↔ catalog DB ↔ tokens JSON ↔ CSS attivo) e 57 variabili CSS duplicate. Sistema risultava "fermo" ma con artefatti residui che mascheravano la realtà operativa.

**Charter**: ADR-0032 `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`.

**Plan**: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`.

**Safety**: git tag `pre-reset-s62` + branch `backup/pre-reset-s62` per rollback completo se necessario.

**Phase corrente cycle 2**: 1 (assessment iniziale, nessuna canonical decision ancora firmata).

---

## L2 (2026-05-13) — Logo wordmark "heuresys" — regole permanenti (consolidamento MIGRATE)

**Decisione**: 8 lettere identiche "h-e-u-r-e-s-y-s" tutte lowercase (`h` minuscola obbligatoria). Font Exo 2 weight 700. La lettera "y" usa colore accent `var(--accent)`. Body lettera usa `var(--brand-blue)` ("logo originale") o `var(--logo-body, var(--ink))` ("logo relativo" per surface tematizzate). NON italic mai (regola visiva specifica per sans-serif). Embed obbligatorio in tutte le ricorrenze "heuresys" header/footer/modal. **Eccezione plain text**: indirizzi · link · domini possono usare "heuresys" testuale lowercase senza wrapping.

**Componente**: `packages/ui/src/components/wordmark.tsx` (cycle 1, invariato post-reset). 3 varianti: `default` (var(--ink)), `brand` (var(--brand-blue)), `relative` (var(--logo-body, --ink)).

**Migrata da archive**: L16 (y-accent standard) + L18 (no italic per sans-serif) + L25 (regole permanenti) + L27 (logo originale 2 colori) + L28 (logo relativo convenzione `.wordmark-relative`).

## L3 (2026-05-13) — Baseline palette μ-architect-legacy preservata in `tokens.css`

**Decisione**: la palette `μ-architect-legacy` (Set 5 cycle 1, L19 archive) viene preservata come baseline canonical cycle 2 in `services/app/src/styles/tokens.css` (consolidato Phase 5 S62). Caratteristiche: dark navy primary + brand blue + purple accent + gradient blue→purple. È la palette currently live in produzione e non viene cambiata dal reset.

**NON migrate**: le altre 16 palette runtime switchable cycle 1 (α-θ + ι-λ + μ-architect / art-director / pragmatic / synthesis / data-dense). Eliminata `palette-variants.css`. Reintroduzione palette switching futura sarà decisione esplicita firmata in `01-canonical/`.

**Migrata da archive**: L19 (μ-architect-legacy applicata) + parziale L20 (Set 5 baseline overlay).

## L4 (2026-05-13) — Motion language preserved in `motion.css`

**Decisione**: il motion language cycle 1 (`services/app/src/styles/motion.css`, 127 LOC) viene preservato invariato. Include 4 ease curves + 6 duration tokens + 7 utility classes. Allineato ai 5 prototipi animati archive `04-motion-language/` (wordmark-glow, gradient-transitions, kg-topology-hover, sparkline-animate, scroll-reveals) consultabili come reference.

**Migrata da archive**: L24 (Phase 8 motion language complete + motion-final.md SoT).

## L5 (2026-05-13) — Tokens format canonical W3C DTCG

**Decisione**: il formato canonical per design tokens cycle 2 è **W3C DTCG (Design Token Community Group)** specification. File SoT: `.ux-design/02-tokens/tokens.json` (popolato Phase 5 S62 con baseline μ-architect-legacy). Il file `services/app/src/styles/tokens.css` (production) è la materializzazione CSS dei tokens DTCG.

**Sync rule**: token cambia in `tokens.json` → re-genera (manualmente o via build script futuro) `tokens.css`. Per ora la sync è manuale (sprint future può aggiungere build step).

**Migrata da archive**: L36 (Phase 11 — Theme variants JSON W3C DTCG format) — formato preservato, il contenuto specifico (tokens-dark.json + tokens-light.json + tokens-motion.json) archived.

---

## L6 (2026-05-14) — Mock UX personas cycle 1 purged (DDL/seed cleanup)

**Decisione**: completata pulizia mock UX persona labels da cycle 1 (`Maria CHRO`, `Maria Bianchi`, `Davide IT`, `Andrea EMP`, `Stefania LM`, `Marco Rossi`) da 5 file LIVE + 13 file archive + 7 row dashboard*presets DBMS legacy. Allineamento al pattern canonical `Audience: <ROLE>` già applicato in `phase18g` per i preset `_v2` e `process*\*`.

**Commit DDL**: `24bb5c4`.

**Migration files touched** (header comment / seed string only, no schema change):

- `db/migrations/phase18g_audience_persona_label.sql` — header comment storico riformulato (rimossi nomi mock dall'esempio storico)
- `db/seeds/phase13_dashboard_presets.sql` — 5 `persona_label` literal sostituiti con `Audience: <ROLE>` pattern

**DBMS UPDATE applicato direttamente** (no formal migration file): idempotent UPDATE su 7 row `dashboard_presets` legacy non-`_v2` (cross_tenant_overview · tenant_owner_overview · employee_journey · hr_director_overview · capability_graph · skills_heatmap · org_systems). Re-seed via `phase13` sopravvive perché `ON CONFLICT (code) DO UPDATE` aggiorna `persona_label` con nuovo valore canonical.

**Verification**: 0 mock residue cross-filesystem + cross-DBMS (dashboard_presets · dashboard_elements · audit_logs · recruiting_candidates).

**Cross-check coerenza DBMS**: users (265) ↔ employees (264) ↔ tenants (4) ↔ rbp_roles (8) 100% coerente. Username pattern `<first>.<last>@<tenant.domain>` (post L50 archive strip-space-apostrophe lowercase): 100% match per 264 employee-linked users + 1 SUPERUSER `sysadmin` platform.

**Memoria globale**: nuovo file `~/.claude/projects/D--evo-heuresys-com/memory/feedback_canonical_user_format.md` codifica regola format username + password unica (`Heuresys2026!`) come SoT `tests/.test-env`. Bias da disinnescare: MAI inventare format `<role>.<tenant>@` o password alternative.

**Trigger**: utente Enzo ha richiesto purga totale "Maria CHRO definitivamente dal progetto, dalla memoria, da qualunque oggetto" + check correttezza users/employees/altri riferimenti attivi.

---

## L7 (2026-05-14) — phase18u RLS null-safe rewrite (315 policies hotfix)

**Decisione**: applicata migration `phase18u_rls_null_safe_policies` che riscrive **289 policies RLS** da cast unsafe `(current_setting('app.current_tenant_id'::text[, true]))::uuid` a function call `current_tenant_id()` null-safe.

**Causa del bug** (latente da S60 commit `0985a1a` 2026-05-13):

- S60 hardening rese `heuresys` Postgres role `NOBYPASSRLS` (revocando BYPASSRLS).
- Prima di S60, le 291 policies RLS unsafe NON venivano valutate (BYPASSRLS).
- Dopo S60, ogni query Prisma le valuta. Il pattern unsafe fa cast diretto `::uuid` su `current_setting(name, true)`:
  - GUC mai toccata in session → ritorna NULL → cast NULL::uuid → NULL → policy FALSE silently (no error, ma 0 rows)
  - GUC toccata poi RESET, o residuo connection pool empty → ritorna `""` → cast `''::uuid` → **ERROR 22P02 "invalid input syntax for type uuid"**

**Trigger riproduzione**: HR_DIRECTOR (Valentina Conti, RTL Bank) navigando `/dashboard` in dev locale Windows post-S62. Il dev Next.js dev pool ricicla connection con GUC residua dopo precedenti query SUPERUSER. Prima volta osservata 2026-05-14 01:55 GMT+2 nella sessione S62 di pulizia mock UX personas. In prod l'errore era latente: nessuno aveva navigato come HR_DIRECTOR end-to-end con un fresh connection pool entry.

**Migration applicata**:

- Backup pre-migration: `/var/backups/heuresys-evo/heuresys_platform-pre-phase18u-20260514T001959Z.dump` (409 MB)
- File: `db/migrations/phase18u_rls_null_safe_policies.sql`
- Risultato: 289 policies riscritte · 0 residue unsafe (verification post-migration PASS)
- Pattern preservato per policies con NULLIF wrapping (già null-safe, ~26 policies in `enrichment_*`, ecc.)

**Verifica end-to-end post-fix**: `/dashboard` HR_DIRECTOR carica regolarmente (Talent & capability view, 4 KPI ring, RBAC matrix, succession spotlight). Codice `services/app/src/app/(app)/dashboard/page.tsx` invariato (zero patch app-side richiesto). Fix è puramente DBMS-side dove appartiene.

**Reference**:

- DDL commit: `<TBD post-commit>`
- Backup chain: `/var/backups/heuresys-evo/heuresys_platform-pre-phase18u-20260514T001959Z.dump`
- S60 hardening reference: archive `DECISIONS-LOG.md` L87 + commit `0985a1a`
- `current_tenant_id()` function definition: `db/migrations/*` (pre-S35, stable null-safe via `NULLIF(...) ::UUID + EXCEPTION WHEN OTHERS → NULL`)

---

## L8 (2026-05-14) — Phase 0 cycle 2 — Investor-ready rebuild charter + foundations shipped

**Decisione**: avviata esecuzione del plan canonical S63+ "Investor-Ready UI Rebuild" (`~/.claude/plans/c-stata-una-continua-indexed-cocke.md`) — 261 task atomici in 8 phase, ~96-128h cumulativi, ricostruzione 17 voci sidebar × 8 ruoli come cockpit di volo professionale (non scaffold tecnico, non SQL dump).

**Phase 0 chiusa**: foundations + design contract codificati in `01-canonical/` + 4 fix infrastrutturali base shipped.

**Canonical Phase 0 (9 file `.ux-design/01-canonical/*.md`)**:

- `trend-research-2026.md` — 20 pattern dashboard analytics enterprise B2B SaaS 2025-2026 (via WebSearch + sources)
- `inspirations-extracted.md` — 7 reference site DESIGN.md (Linear · Vercel · PostHog · Stripe · ClickHouse · Notion · Airtable)
- `moodboard.md` — direzione canonica **"Calm Cockpit Decisionale"** (Linear-meets-Stripe-meets-Visier)
- `layout-pattern.md` — 10 leggi cockpit + 5 primitives convergenti + 40-30-20-10 space rule + anatomia preset `_v2`
- `role-data-matrix.md` — matrice 23 route × 8 ruoli + scope semantics + cellule investor-critical
- `widget-vocabulary.md` — mapping tipologia → widget (numerico / trend / gerarchia / comparazione / flow / relazioni / distribuzione / lista / drill)
- `i18n-policy.md` — zero hardcoded mix IT/EN + `pickBilingual` + `UI` constants + cascata fallback
- `header-footer-anatomy.md` — DOM canonical `ws-header` + `app-footer` + topbar globale + sidebar
- `anti-patterns.md` — 10 categorie banditi cross-route (debug leak · scaffold · mock personas · layout · P11 · i18n · perf · security · brand identity · accessibility)

**Code fixes Phase 0 shipped**:

- `services/app/src/app/(app)/dashboard/[code]/page.tsx` — H1 multi-word accent `||` parser fix (T0.7, replica logica già presente in `dashboard/page.tsx`) + `ws-footer` SOURCE/TENANT/ROLE debug row gated behind `NEXT_PUBLIC_SHOW_DEV_FOOTER` flag (T0.8)
- `services/app/src/app/(app)/_components/BrandShell.tsx` — ENV/TENANT/ROLE/BUILD chip nel ft-dynamic footer gated dietro stesso flag. CYCLE + REVIEWS metric preserved sempre visibili (P6 W#7-bis brand metric live intenzionale)
- `services/app/src/lib/data/_role-shaper.ts` (NEW) — role-aware Prisma `where` clause shaper: 8 ruoli × 5 entity types (employees · reviews · goals · learning · compensation) → ScopeLevel `platform | tenant | team | dept | reports | self` + Prisma `where` fragment. **42 unit tests PASS** (`__tests__/_role-shaper.test.ts`)
- `services/app/src/lib/dashboard-engine/adapters/_base-adapter.ts` (NEW) — typed `WidgetAdapter<TConfig, TData>` interface con fetch/transform/validate per nuovi widget brand Phase 3. Legacy single-file `adapters.ts` invariato.

**Verifications Phase 0**:

- `npx tsc --noEmit` services/app → exit 0 (PASS)
- `vitest run _role-shaper.test.ts` → 42/42 PASS (30s)
- BrandShell + dashboard pages preservano P6 W#1+W#2+W#6+W#7-bis brand metric live (no regression)

**Direzione visuale emergente** (sintesi research):
"Calm Cockpit Decisionale" = dark mode μ-architect-legacy preserved + sidebar persistent 240-260px + Cmd+K (futuro) + 40-30-20-10 + KPI hero + sparkline + AI insight narrative IT + drilldown via slide-over (no full-page nav) + monospace tabular numerals banking-grade + status pills semantic 6 token + skeleton structure-aware + forecast confidence band. Tone RTL Bank K.64.19 — sobrio, dato-centrico, decisionale.

**Decisioni autonomous prese (plan §6 authority)**:

- T0.8 scope: CYCLE + REVIEWS metric preserved sempre (P6 W#7-bis è feature brand intenzionale, non leak). Solo ENV/TENANT/ROLE/BUILD gated dietro `NEXT_PUBLIC_SHOW_DEV_FOOTER`.
- T0.9 scope: 5 entity kinds (employees · reviews · goals · learning · compensation), prima passata. Estensione (audit · rbac · workforce-analytics) deferita a Phase 2 query modules.
- T0.10 scope: directory `adapters/` con `_base-adapter.ts` framework, single-file legacy `adapters.ts` preservato (zero risk regression sui 14 adapter live).

**Reference**:

- Plan canonical: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- Sub-agent T0.2-T0.3: 30 tool uses, 113k tokens, 7m duration. WebFetch login-gated/marketing-only flagged per Vercel/PostHog/Notion (mitigation: industry knowledge + Mobbin reference).
- DDL commit: nessuno (Phase 0 = no schema change)

**Phase successive**:

- Phase 1 (~14-18h, 42 task): fix 6 preset `_v2` rotti (`hr_director_overview_v2`, `capability_graph_v2`, 4 process\_\*)
- Phase 2 (~18-24h, 40 task): data layer 8 query modules role-aware
- Phase 3 (~16-20h, 96 task): 12 widget brand expansion Storybook TDD-first
- Phase 4 (~16-20h, 48 task): 8 nuovi preset + element seed
- Phase 5-7 (~20-30h cumulativi): sidebar migration + i18n polish + verification + investor demo + deploy

**Plan execution mode**: autonomous fino a 80% del context window 1M (~800k token), come da direttiva utente. Stop solo per blocker irrecuperabile o token threshold raggiunto.

---

## L9 (2026-05-14) — Phase 1 cycle 2 — 4 process\_\*\_v2 reseed shipped (scope ridotto)

**Decisione**: chiusa Phase 1 del plan canonical S63+ con **scope ridotto** rispetto al plan originale. Re-seed di **4 process\_\*\_v2** (sparse, 3 elements ciascuno) con 11 elements widget-rich. **NON re-seedati** `hr_director_overview_v2` e `capability_graph_v2`: erano già OK con 11 elements + SQL data_source live cross-tenant (audit pre-flight confermava nessun problema strutturale, solo l'apparente disallineamento hierarchy che era in realtà falsa lettura del JOIN).

**Razionale scope ridotto** (decisione autonoma plan §6):

- Risk-aware: zero regression risk sui 2 preset full che già funzionano in produzione (HR_DIRECTOR + DEPT_HEAD landing dashboard)
- Effort-aware: 4 preset sparse erano il problema concreto (3 elements vs 11 attesi)
- Plan §6 autorizza scope decisions

**Spec atomic scritti** (6 file `.ux-design/04-promotion/specs/<code>.md`):

- `hr_director_overview_v2.md` — framework C1-C10 documentato (reference, no re-seed in Phase 1)
- `capability_graph_v2.md` — framework C1-C10 documentato (reference, no re-seed in Phase 1)
- `process_recruiting_funnel_v2.md` — spec + SQL queries documented
- `process_onboarding_flow_v2.md` — spec + SQL queries documented
- `process_performance_cycle_v2.md` — spec + SQL queries documented
- `process_learning_paths_v2.md` — spec + SQL queries documented

**Migration applicata**: `db/seeds/phase19a_four_process_v2_reseed.sql` (idempotent transaction). Stage 1 attempt fallito su verification count (44 vs 40 stima errata mia); corretto a 44 e ri-applicato con successo.

**Updates DBMS**:

- `dashboard_presets.name_it`/`name_en` UPDATE × 4: aggiunto `||` separator per multi-word accent (T0.7 P6 W#1 compatibility): "Recruiting||funnel", "Onboarding||flow", "Performance||cycle", "Learning||paths"
- `dashboard_elements` DELETE 12 vecchi + INSERT 44 nuovi (11 per preset × 4 preset)

**Layout canonical applicato** (per ognuno dei 4):

```
position=1 LayoutKpiRing (span 12) ─── hero strip
  ├─ 4 KpiRing children (col 1-3, 4-3, 7-3, 10-3)
position=2 LayoutMainSplit (span 12) ─ body principal
  ├─ LayoutPanel (col 1-8) ── Histogram (body topic)
  └─ LayoutPanel (col 9-4) ── ActivityFeed o IntegrationHealthPill
position=3 widget secondary (span 12) — SkillHeatmap / ActivityFeed / CapabilityRadar
```

**SQL data_source queries**: tutte live con `current_tenant_id()` null-safe function (post-phase18u RLS fix L7). Tabelle target verificate pre-stesura: `recruiting_requisitions` · `recruiting_candidates` · `onboarding_tasks` (no tenant_id → JOIN via `onboarding_instances.tenant_id`) · `onboarding_documents` (idem) · `onboarding_instances` (tenant_id ✓) · `review_cycle_participants` · `performance_reviews` (calibrated_at + overall_rating) · `learning_paths` (is_active) · `learning_path_enrollments` · `certifications`.

**P11 compliance**: 3 widget di chiusura usano `{"type":"static","value":{"unavailable":true}}` esplicito quando lo schema non offre il dato (SkillHeatmap recruiting · IntegrationHealthPill onboarding · CapabilityRadar performance · SkillHeatmap learning). Triggera `<DataNotAvailable />` invece di valori fittizi.

**Verification VM live**:

```
process_learning_paths_v2    | Learning||paths    | 11 elements
process_onboarding_flow_v2   | Onboarding||flow   | 11 elements
process_performance_cycle_v2 | Performance||cycle | 11 elements
process_recruiting_funnel_v2 | Recruiting||funnel | 11 elements
```

**Plan execution context**: questa sessione autonomous con direttiva "fermati solo @ 80% del context window 1M (800k token)". Token usage @ Phase 1 closure ≈ 220k (22%). Phase 2 + 3 possono partire in questa stessa sessione.

**Phase successive**:

- Phase 2 (~18-24h, 40 task): 8 query modules role-aware in `services/app/src/lib/data/` (employees · reviews · goals · learning · compensation · workforce-analytics · audit · rbac)
- Phase 3 (~16-20h, 96 task): 12 widget brand expansion Storybook TDD-first
- Phase 4 (~16-20h, 48 task): 8 nuovi preset \_v2 + element seed

---

<!-- Entry successive L10-LN: append qui. Decisioni MIGRATE da cycle 1 archive devono citare predecessore archive L-XX in body. -->
