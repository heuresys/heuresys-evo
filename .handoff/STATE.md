# heuresys-evo — Current State

> Updated: 2026-05-13T16:00Z · S58 closed · **Constraint P11 codificato + Pilot legacy + Finding G6** · HEAD `8bf368f`

## Last session brief

S58 codifica il constraint **NO-MOCK / SOLO DATI LIVE da DBMS** come P11 sopraordinato. Audit Phase A + Foundation + Pilot legacy refactor completati. **Finding critico**: il view legacy `TenantOwnerOverviewView.tsx` refactored è **path orfano** — la prod usa G6 renderer (`_v2`) per tutti gli utenti canonical. Le **vere fonti di KPI hardcoded** in produzione vivono nel G6 widget engine, non identificate da Phase A inventory.

## Sessione S58 cumulative

| Item | Commit |
|---|---|
| salary_bands closure EcoNova + Heuresys (CASCADIA seeding) | `e5cd4df` |
| salary_band_assignments closure EcoNova + Heuresys (CASCADIA seeding) | `8c3ed98` |
| toggle-tenant-owners-tmp.mjs (LH cross-tenant tooling) | `c7fc627` |
| Lighthouse cross-tenant audit report (4 tenant × TENANT_OWNER) | `74159bd` |
| axe WCAG AAA audit report (12 surface RTL Bank) | `213dcfd` |
| **Constraint P11 + DataNotAvailable + Pilot legacy** | **`8bf368f`** |

## Constraint P11 — files committati

- `CLAUDE.md` (root): §REGOLA NON NEGOZIABILE + P11 in tabella P1-P11
- `.claude/CLAUDE.md`: CARD-4 + R18 + direttiva fondante aggiornata
- `.claude/skills/studio/references/promote-flow.md`: Gate D.2 NO-FIXTURE (PROMOTE_E309_FIXTURE)
- `.ux-design/BRAND-STATE.md` + `SESSION-RESUME.md` + `08-promotion/v1.0-checklist.md`: disclaimer P11
- `docs/_audit/2026-05-13-no-mock-inventory.md`: baseline inventory
- NEW `services/app/src/components/data/DataNotAvailable.tsx` + CSS (variant inline/block/tile, AA-compliant)
- NEW `services/app/src/lib/data/tenant-owner-queries.ts`: 4 queries Prisma live (KPI/dept/succession/comp)
- REFACTOR `services/app/src/app/(app)/dashboard/_views/TenantOwnerOverviewView.tsx`: rimossi ~48 hardcoded fixtures

## 🚨 Finding critico — Pilot orphan path

`/dashboard` per utenti canonical (federica.marchetti TENANT_OWNER) renderizza via **G6 engine** (`tenant_owner_overview_v2`) tramite `loadG6Elements()` + `DashboardRenderer` (path: `services/app/src/app/(app)/dashboard/page.tsx:112+`). Il view legacy `TenantOwnerOverviewView.tsx` è chiamato SOLO se `presetCode` NON finisce in `_v2` (mai per utenti reali post-S20).

**Conseguenza**: smoke e2e cross-tenant ha confermato che i KPI hardcoded visibili in `/dashboard` (HEADCOUNT 86 · REV/FTE 142 · RETENTION 94% · PERFORMANCE 82% · AVG SALARY 68k · BONUS POOL 420k · EQUITY 1.2M · TOTAL TC 7.4M · ecc.) sono **costanti identiche cross-tenant** = NON provengono dal view legacy refactored ma da:

- `prefetchElements()` data adapter via `services/app/src/lib/dashboard-engine/prefetch.ts`
- `services/app/src/components/widgets/brand/*` G6 widget components
- `dashboard_elements.config_overrides` JSON seed

**Phase A inventory incompleto**: l'Explore agent ha categorizzato "app pages 100% compliant" perché nei `.tsx` files non c'erano numeri letterali — ma i numeri vivono nel **runtime widget adapter** + seed JSON, layer non scansionato.

## Stato refactor pilot

- ✅ Pattern **codificato e funzionante**: queries live in `lib/data/*.ts` + `<DataNotAvailable />` + render conditional. Riutilizzabile per qualsiasi futura surface.
- ✅ Typecheck PASS · build PASS · service restart OK
- ⚠️ Path orfano: il file refactored non è eseguito in prod. Resta come **reference implementation** del pattern P11.

## Carry-forward S59+ (priorità rivista)

### S59 — Re-inventory **G6 dashboard engine** (HIGH PRIORITY, riapertura Phase A)

Layer non scansionato in Phase A. Catalogare:

- `services/app/src/lib/dashboard-engine/prefetch.ts` — data fetching widget per widget
- `services/app/src/components/widgets/brand/*.tsx` (~19 widget secondo registry.tsx)
- `services/app/src/lib/dashboard-engine/registry.tsx` — widget code → adapter map (post-S57 dichiarato compliant, da riverificare nel rendering live)
- `dashboard_elements.config_overrides` JSON in DB (è seed o runtime?)

Per ogni widget verificare:
1. Source data: query Prisma live · static adapter · config_overrides JSON
2. Fallback path: hardcoded values · DataNotAvailable · empty array
3. Variance cross-tenant: stessi numeri per tutti? (= hardcoded) o variabili (= live)

Effort stimato: 3-4h (re-inventory thorough on the right layer).

### S60+ — Bonifica widget G6 secondo priorità inventory rivista

Stimata 10-20h sulla base di S59 findings.

### S61+ — Bonifica view legacy residui (`HrDirectorOverviewView`, `CapabilityGraphView`, ecc.)

Pattern già codificato dal pilot. Effort solo se decidiamo di mantenere il fallback path attivo (alternativa: rimuovere fallback + canonicalizzare G6).

### Investigare side-finding S58 #3 (P1 violation)

Cross-tenant data leak su `/compensation` + `/employees` per TENANT_OWNER. RTL Bank vede bonus_plans EcoNova/Heuresys + employees SmartFood/EcoNova mescolati. Possibile bypass RLS o query senza `WHERE tenant_id`. **P1 priority**.

## Verifica handoff

```bash
# Constraint P11 enforced
grep -n "P11" CLAUDE.md
grep -n "REGOLA NON NEGOZIABILE" CLAUDE.md
grep -n "CARD-4" .claude/CLAUDE.md
grep -n "Gate D.2" .claude/skills/studio/references/promote-flow.md
grep -n "CONSTRAINT P11" .ux-design/BRAND-STATE.md

# Component shared esiste
ls services/app/src/components/data/DataNotAvailable.tsx
ls services/app/src/lib/data/tenant-owner-queries.ts

# Typecheck verde
cd services/app && npx tsc --noEmit

# Inventory baseline
ls docs/_audit/2026-05-13-no-mock-inventory.md

# Live deploy attivo
ssh oracle-vm-default "sudo systemctl status heuresys-app --no-pager | head -8"
```

## Reference plan

`~/.claude/plans/i-dati-attuali-che-gentle-church.md` — approved 2026-05-13.

## Note operative

- I commit `e5cd4df` + `8c3ed98` (CASCADIA seeding) restano legittimi (popolano DBMS, post-INSERT è dato live)
- `toggle-tenant-owners-tmp.mjs --off` eseguito post-LH audit
- Sessione lunga (~5h reali) — passaggi salient: 1) richiesta constraint utente → 2) confusione su scope CASCADIA risolta → 3) plan approvato → 4) implementazione + finding orphan path → 5) handoff onesto
