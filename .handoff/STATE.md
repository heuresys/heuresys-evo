# heuresys-evo — Current State

> Updated: 2026-05-14T13:35Z · S63 autonomous run · investor-ready rebuild Phases 0-4 + 5-6 partial shipped · HEAD post-`ff6872b`

## Debt attivo

Nessuno bloccante. Sistema fermo dopo S63 autonomous run extended (Phases 0-4 full + 5-6 partial).

**Follow-up tracciabili (non bloccanti, opzionali):**

1. **Phase 5 sidebar refactor opzione A** — Promote sidebar PrimaryNav link a `/dashboard/<preset_v2>` (cockpit-first navigation). Plan decision in `.ux-design/04-promotion/phase5-route-migration-decision.md`: Opzione C (status quo) shipped; Opzione A è futuro upgrade. ~4-6h.
2. **Phase 6.2 i18n sweep widget legacy** — Refactor i 21 widget brand pre-S63 (BrandKpiCard, BrandSuccessionCard, ecc.) per usare `pickWidgetString` o constants invece di hardcoded IT/EN. ~3-5h.
3. **Phase 7 investor demo** — Chrome MCP loop 4 ruoli × 14 voci sidebar = ~56 screenshot in `.handoff/investor-demo/`. Lighthouse audit 5 preset principali. brand:audit cross-route final score. ~6-10h.
4. **Storybook stories per 6 widget brand nuovi** — `BrandEmployeeDirectoryGrid` · `BrandOkrCascadeTree` · `BrandReviewKanbanBoard` · `BrandWorkforceTrendLine` · `BrandCalibrationCard` · `BrandBonusPlanCard`. TDD-first per audit pre-promotion. ~4-6h.
5. **Phase 3.2 widget brand expansion residui** — `LearningProgress` widget + `CertificationBadgeGrid` (mappati a coverage da widget esistenti ma scaffold dedicato può alzare audit score). ~3-5h.
6. **role_default_dashboards mapping** — Aggiungere row per gli 8 nuovi preset `_v2` se servono come dashboard default per ruoli specifici (es. /dashboard HR_DIRECTOR → tenant_owner_overview_v2 ancora; lasciato invariato). Opzionale ~1-2h.

## S63 autonomous run delta (Phases 0-4 shipped)

| Phase | Commit | Output |
|---|---|---|
| 0 | `0ebf49e` | 9 canonical .md in `.ux-design/01-canonical/` (trend-research · inspirations · moodboard · layout-pattern · role-data-matrix · widget-vocabulary · i18n-policy · header-footer-anatomy · anti-patterns) + role-shaper 42 unit test PASS + base-adapter framework + H1 parser fix `[code]/page.tsx` + debug leak removal BrandShell+ws-footer gated dietro `NEXT_PUBLIC_SHOW_DEV_FOOTER` |
| 1 | `114d228` | phase19a_four_process_v2_reseed.sql: re-seed 4 process_*_v2 sparse (3→11 elements ciascuno, 44 total). Scope ridotto autonomous: hr_director_overview_v2 + capability_graph_v2 NOT re-seeded (già full + zero regression risk). 6 spec atomic in `.ux-design/04-promotion/specs/` |
| 2 | `1d323db` | 8 query modules role-aware in `services/app/src/lib/data/`: employees · reviews · goals · learning · compensation · workforce-analytics · audit · rbac. Pattern uniforme: ScopeContext → resolveScope → withTenant → $queryRaw → null o EMPTY sentinel → `<DataNotAvailable />` (P11) |
| 3 | `440769f` | 6 widget brand nuovi in `services/app/src/components/widgets/brand/`: BrandEmployeeDirectoryGrid · BrandOkrCascadeTree · BrandReviewKanbanBoard · BrandWorkforceTrendLine · BrandCalibrationCard · BrandBonusPlanCard. Index re-export typed. Scope ridotto vs plan 12 widget: 6 nuovi + 6 coperti da brand widget esistenti (BrandProfileHero · BrandHistogram · BrandActivityFeed+AuditRow · BrandSkillHeatmap · GaugeCard) |
| 4 | `3707997` | phase19b_eight_new_presets_seed.sql: 8 nuovi dashboard_presets _v2 (employees_directory · reviews_cycle · goals_cascade · learning_paths_overview · compensation_overview · workforce_analytics · admin_audit · admin_rbac) + 40 dashboard_elements. is_published=true tutti. SQL data_source live current_tenant_id() null-safe |

## Verification

```bash
# Working tree clean post-commit
git status -sb

# Stack commits S63 cycle 2 investor-ready rebuild
git log --oneline 0ebf49e^..HEAD

# Smoke prod
curl -sI https://evo.heuresys.com/login | head -1   # expect HTTP/1.1 200 OK

# Smoke dev locale
curl -sI http://localhost:3200/login | head -1   # expect HTTP/1.1 200 OK

# Count preset _v2 published
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"SELECT COUNT(*) FROM dashboard_presets WHERE code LIKE '%_v2' AND is_published = true;\""
# expect 19 (11 esistenti pre-S63 + 8 nuovi Phase 4)

# Typecheck PASS
cd services/app && npx tsc --noEmit && echo OK

# 42/42 role-shaper unit tests PASS
cd services/app && npx vitest run src/lib/data/__tests__/_role-shaper.test.ts
```

## References

- **Plan canonical S63+**: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- **Canonical cycle 2**: `.ux-design/01-canonical/*.md` (9 file)
- **Specs atomic Phase 1**: `.ux-design/04-promotion/specs/<preset>.md` (6 file)
- **Role-shaper**: `services/app/src/lib/data/_role-shaper.ts` + `__tests__/_role-shaper.test.ts`
- **Query modules Phase 2**: `services/app/src/lib/data/*-queries.ts` (8 nuovi + tenant-owner pre-existing)
- **Brand widget nuovi Phase 3**: `services/app/src/components/widgets/brand/Brand{EmployeeDirectoryGrid,OkrCascadeTree,ReviewKanbanBoard,WorkforceTrendLine,CalibrationCard,BonusPlanCard}.tsx`
- **Migrations**: `db/seeds/phase19a_four_process_v2_reseed.sql` · `db/seeds/phase19b_eight_new_presets_seed.sql`
- **DECISIONS-LOG-v2 entries S63**: L8 (Phase 0) · L9 (Phase 1) · L10 (Phase 2) · L11 (Phase 3) · L12 (Phase 4) · L13 (this closure)
- **Plan execution mode**: autonomous fino @ 80% del context window 1M (~800k token), come da direttiva utente
