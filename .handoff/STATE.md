# heuresys-evo — Current State

> Updated: 2026-05-12T03:05Z · S42 fixture purge 3 views + process_*_v2 secondary nav

## Last session brief

S42: tre fixture residue eliminate da `/dashboard` views — EmployeeJourney skill-trend (5 series × 5 quarter da `employee_skill_history`) + capability radar (5 axes OPOURSKA da `employee_skill_assessments`), CapabilityGraph ESCO sync stats (last/drift/next da `integration_sync_logs`), CrossTenant 12-month workforce trend (cumulative headcount per tenant on-the-fly). Migration **phase18p** clona 4 `process_*` preset in `process_*_v2` (4 preset + 12 elements + 8 role_default_dashboards re-pointed) → HR_DIRECTOR + HR_MANAGER secondary nav ora utilizza G6 brand-fedele renderer.

## Top priorities

1. **W5 Chrome MCP visual walkthrough** (~1-2h) — dev server + 88-cell screenshot baseline. Sessione live coordinata.
2. **§ 1.2 employees vertical-split Phase 2** (~15-25h, separate scope) — DROP COLUMN ×77 + 65 view dependency refactoring. Backup pre-attempt esistente.
3. **WCAG 2.2 AAA audit + production perf bench** (~6-7h combinato) — axe-core CI + autocannon 8 viste P95 ≤ 500ms.
4. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — 8 categorie asset, ref `.ux-design/08-promotion/v1.0-checklist.md`.

## Open questions

- **monthly_employee_snapshot mat view**: il workforce-trend SQL gira on-the-fly. Promozione a mat view (refresh giornaliero) quando il dataset cresce?
- **integration "ESCO" naming**: nessuna `integrations.provider` chiamata ESCO. Lo "ESCO sync stats" usa il più recente sync di QUALSIASI integration. Quando seedare un'integration ESCO dedicata?

## Stack snapshot (post-S42)

- 7/7 dashboard view data-bound (HrDirector + TenantOwner + EmployeeJourney + CapabilityGraph + SkillsHeatmap + OrgSystems + CrossTenant)
- **Fixture residue azzerate**: nessuna view rimane "synthetic-only". Tutte hanno helper Prisma + fallback brand-fedele se DB vuoto.
- 4/4 widget kinds api-bound (post-phase18o): ProfileHero 1, KgMiniGraph 3, CapabilityRadar 5, BridgeCard 1
- 4 `process_*_v2` preset attivi + 12 elements + 8 `role_default_dashboards` re-pointed (post-phase18p)
- 5 data fetcher helper estesi: employee-journey (+skillTrend +radar), capability-graph (+escoSync), cross-tenant (+workforceTrend)
- typecheck (services/app + api-gateway) + lint:tenant-id + lint:mock-identities PASS

## Verification

```bash
npx tsc --noEmit -p services/app/tsconfig.json && npx tsc --noEmit -p services/api-gateway/tsconfig.json
npm run lint:mock-identities && npm run lint:tenant-id

ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT 'presets_v2', COUNT(*) FROM dashboard_presets WHERE code LIKE 'process_%_v2'
UNION ALL SELECT 'elements_v2', COUNT(*) FROM dashboard_elements e JOIN dashboard_presets p ON p.id=e.dashboard_preset_id WHERE p.code LIKE 'process_%_v2'
UNION ALL SELECT 'rdd_v2', COUNT(*) FROM role_default_dashboards WHERE preset_code LIKE 'process_%_v2'\""
# Expected: presets_v2=4 · elements_v2=12 · rdd_v2=8
```

Riferimenti: ADR-0028/29/30 · `db/migrations/phase18{m,n,o,p}*.sql` · `docs/_meta/lexicon.md` (OPOURSKA · ESKAP · TALPIPE · PROCESS)
