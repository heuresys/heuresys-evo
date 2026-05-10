# heuresys-evo — Current State

> Updated: 2026-05-10T06:55Z · S26 closed · CLAUDE.md split + 3 priorities reality-check (2 already shipped, 1 deferred S27+ via L60)

## Last session brief (S25 docs cleanup + S26 reality check)

**S25 (5:30-5:50Z)** — 4 commit pushed `b6ca4fc` → `1d7ccab` → `0f96844` → `73ba905`. R20+CARD-4 governance codified · /handoff skill v2.0 alignment · STATE.md updated.

**S26 (5:55-6:55Z)** — 4 commit pushed `60991d7` → `9e1537f` → (current commit pending) → ...

- **CLAUDE.md split** (`60991d7`): root da 424→256 righe (-50%), cronologia sprint estratta in `docs/_meta/sprint-history.md` (append-only)
- **/handoff skill alignment** (`9e1537f`): pointer aggiornato a nuove sezioni `## Sistema corrente / Roadmap / Carry-forward`
- **3 priorities reality check evidence-based**:
  - `[INFRA]` JWT cross-service fix → ✅ **già shipped** commit `9f7a283` (jose+HKDF, 11/11 test green). Doc obsoleta in CLAUDE.md/STATE.md, ora corretta
  - `[ARCH]` /dashboard refactor DB-driven → ✅ **già shipped** commit `35ba6bb` (G6 Adoption) + `d59ae3e` (Phase 15.A). 7 preset `*_v2` popolati, 8 ruoli mappati, switch su `loadG6Elements` + `DashboardRenderer`. Residuo minore non-blocking: 4 process_* secondary nav non `_v2` (~2-3h)
  - `[ARCH-S26]` Phase 2 vertical-split → 🟡 **DEFERRED S27+ (L60)** — apply attempt fallito al DROP COLUMN per **65 view + 4 mat view dipendenti** non documentate nel plan canonical. Transaction rollback OK. SQL DRAFT preservato in `db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql`. Effort revised 15-25h FTE (vs 9-14h stima originale)

865 test verdi · login canonical 8/8 PASS · typecheck PASS · DB integro (no changes applicate questa sessione).

## Top priorities (S27+)

1. **`[ARCH-S27]` § 1.2 vertical-split Phase 2 + view audit** (~15-25h FTE dedicati) — sequenza: (a) audit 65 view dipendenti via `pg_depend` (purpose · usage · droppable), (b) salva definitions via `pg_get_viewdef`, (c) DROP CASCADE, (d) apply `phase16o_employees_to_view.DRAFT-DEFERRED.sql`, (e) ricreare 65 view refactorate per puntare a nuova VIEW `employees`, (f) verify mat view refresh + 12 hot view shape integrity. Backup pre-attempt: `heuresys_platform-pre-phase16o-20260510T044105Z.dump` 380MB sha256 `dba5a08b…`
2. **`[ARCH]` 4 process_* secondary nav `_v2`** (~2-3h, non-blocking) — preset `process_recruiting_funnel`/`process_onboarding_flow`/`process_performance_cycle`/`process_learning_paths` cablati in `role_default_dashboards` per HR_DIRECTOR+HR_MANAGER ma mancano suffix `_v2` + elements seedati. Refactor incrementale per uniformità con _v2 architecture
3. **`[INFRA]` pg_cron migration future** (~1-2h, opzionale) — se installato pg_cron, sostituire systemd timer con `cron.schedule()` row + disable unit
4. **`[BRAND]` Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — pre-flight checks per 8 categorie asset · ref `.ux-design/08-promotion/v1.0-checklist.md`

## Open questions

- nessuna

## Stack snapshot (changed this session)

- DBMS: **invariato** (transaction Phase 2 rollback). 312 tenant_id NOT NULL · 367 RLS policies · 0 FK NO ACTION default · 5 mat views systemd timer · 270 employees · satellites Phase 1 in sync via trigger · view employees_full presente
- Code: **invariato** (no edits applicati questa sessione su services/*)
- Docs: MOD `CLAUDE.md` (-50% size, split in sprint-history.md) · NEW `docs/_meta/sprint-history.md` (archive append-only) · MOD `.gitignore` (`*.bak-*`) · MOD `.claude/skills/handoff/SKILL.md` (v2.1 align nuove sezioni) · NEW `db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql` (Phase 2 reference S27+) · NEW DECISIONS-LOG L60 (Phase 2 defer evidence-based)
- Memory: MOD `~/.claude/projects/D--evo-heuresys-com/memory/feedback_session_start_protocol.md` (workflow post-S25 corretto)
- Tests: **invariato** 865 verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared)

## Verification

```bash
git log --oneline -10
ls db/seeds/phase16o*  # expected: phase16o_employees_to_view.DRAFT-DEFERRED.sql (NOT applied)
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"SELECT count(*) FROM employees;\""  # expected 270
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"SELECT count(*) FROM pg_trigger WHERE tgname='trg_sync_employees_to_satellites';\""  # expected 1 (Phase 1 trigger ancora attivo)
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"SELECT count(DISTINCT n.nspname || '.' || c.relname) FROM pg_depend d JOIN pg_rewrite r ON r.oid = d.objid JOIN pg_class c ON c.oid = r.ev_class JOIN pg_namespace n ON n.oid = c.relnamespace WHERE d.classid = 'pg_rewrite'::regclass AND d.refobjid = 'public.employees'::regclass AND c.relkind IN ('v','m') AND c.relname != 'employees';\""  # expected 65 (view audit baseline per S27+)
wc -l CLAUDE.md  # expected ~256 (post-split, era 424)
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` § **L60** (Phase 2 defer evidence-based) · `docs/_meta/sprint-history.md` § S26 entry · `~/.claude/plans/parti-dall-inizio-e-esegui-peppy-dream.md` § Phase 2 (plan canonical, da estendere con view audit per S27+).
