# AUDIT GRID — Production Dashboards Forensic Review

> **Date started**: 2026-05-11 06:45 GMT+2  
> **Auditor**: Claude Code (live e2e via Chrome MCP, dev mode `http://localhost:3200`)  
> **Reference**: `C:\Users\enzospenuso\.claude\plans\cheeky-puzzling-clarke.md`

---

## Audit scope

### Routes accessibili (via login per ruolo)

| #   | Ruolo        | Username                          | Default `/dashboard` lands on |
| --- | ------------ | --------------------------------- | ----------------------------- |
| 1   | SUPERUSER    | `sysadmin`                        | `cross_tenant_overview_v2`    |
| 2   | TENANT_OWNER | `federica.marchetti@rtl-bank.org` | `tenant_owner_overview_v2`    |
| 3   | IT_ADMIN     | `marco.desantis@rtl-bank.org`     | `org_systems_v2`              |
| 4   | HR_DIRECTOR  | `valentina.conti@rtl-bank.org`    | `hr_director_overview_v2`     |
| 5   | HR_MANAGER   | `maria.colombo@rtl-bank.org`      | `skills_heatmap_v2`           |
| 6   | DEPT_HEAD    | `paolo.caputo@rtl-bank.org`       | `capability_graph_v2`         |
| 7   | LINE_MANAGER | `giuseppe.ferri@rtl-bank.org`     | `employee_journey_v2`         |
| 8   | EMPLOYEE     | `francesca.gallo@rtl-bank.org`    | `employee_journey_v2`         |

### Process dashboards (sidebar secondary, HR_DIRECTOR + HR_MANAGER)

- `process_recruiting_funnel` (priority 10)
- `process_onboarding_flow` (priority 20)
- `process_performance_cycle` (priority 30)
- `process_learning_paths` (priority 40)

### Direct route `/dashboard/[code]` — BLOCKED

`/dashboard/[code]/page.tsx:38-43` chiama `loadDashboardPreset(code, { requirePublished: true })` → tutti i 7 `_v2` hanno `is_published=false` → 404 universale. **Fix scope Phase 1**: SQL `UPDATE dashboard_presets SET is_published=true WHERE code LIKE '%_v2'` per consentire impersonation/preview SUPERUSER.

---

## 12 criteri binari per cell

| #   | Criterion               | Spec                                                                                                                 |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| C1  | Visual parity vs mockup | Confronto screenshot con `.ux-design/06-mockups/dashboards/<canonical>.html`                                         |
| C2  | No duplicate headers    | Nessun titolo widget appare 2 volte (LAYOUT + widget)                                                                |
| C3  | No demo names           | Zero hit per `Maria Rossi\|Luca Bianchi\|Stefania Bianchi\|Gabriele Amato\|sysadmin\|Lorem\|TODO` in `get_page_text` |
| C4  | Number format it-IT     | Thousands `.`, decimal `,`, `%` postfix                                                                              |
| C5  | Font triad              | Exo 2 (wordmark), Inter (body), JetBrains Mono (data labels uppercase)                                               |
| C6  | Gradient on `.bar-fill` | `linear-gradient(135deg, brand-blue, brand-purple)` su barre                                                         |
| C7  | Glow on wordmark        | `filter: drop-shadow(var(--glow))`                                                                                   |
| C8  | Accent on `<em>`        | `color: var(--accent)` su h1/h2 em + key data                                                                        |
| C9  | Live data binding       | Ogni nodo DOM numerico correla a network request (`data-source-id`)                                                  |
| C10 | API 2xx                 | `read_network_requests` → tutti i dashboard API rispondono 200/304                                                   |
| C11 | Zero console errors     | `read_console_messages` con `onlyErrors:true` → 0 (escluso HMR dev-only)                                             |
| C12 | Zero asset 404          | Nessuna richiesta network in 4xx (font, image, CSS, JS)                                                              |

---

## Grid baseline (Phase 0)

> **Legend**: ✅ PASS · ❌ FAIL · ⚠️ PARTIAL · — N/A (not accessible without is_published fix)

### Default `/dashboard` per ruolo (8 cells)

| Ruolo        | Preset                   | C1  | C2  | C3  | C4  | C5  | C6  | C7  | C8  | C9  | C10 | C11 | C12 | Screenshot                  |
| ------------ | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------------------- |
| SUPERUSER    | cross_tenant_overview_v2 | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `superuser__default.png`    |
| TENANT_OWNER | tenant_owner_overview_v2 | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `tenant_owner__default.png` |
| IT_ADMIN     | org_systems_v2           | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `it_admin__default.png`     |
| HR_DIRECTOR  | hr_director_overview_v2  | ❌  | ❌  | ❌  | ?   | ?   | ?   | ?   | ?   | ❌  | ?   | ?   | ?   | `hr_director__default.png`  |
| HR_MANAGER   | skills_heatmap_v2        | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_manager__default.png`   |
| DEPT_HEAD    | capability_graph_v2      | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `dept_head__default.png`    |
| LINE_MANAGER | employee_journey_v2      | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `line_manager__default.png` |
| EMPLOYEE     | employee_journey_v2      | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `employee__default.png`     |

### Process dashboards (HR_DIRECTOR + HR_MANAGER, 8 cells)

| Ruolo       | Preset                    | C1  | C2  | C3  | C4  | C5  | C6  | C7  | C8  | C9  | C10 | C11 | C12 | Screenshot                     |
| ----------- | ------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ |
| HR_DIRECTOR | process_recruiting_funnel | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_director__recruiting.png`  |
| HR_DIRECTOR | process_onboarding_flow   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_director__onboarding.png`  |
| HR_DIRECTOR | process_performance_cycle | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_director__performance.png` |
| HR_DIRECTOR | process_learning_paths    | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_director__learning.png`    |
| HR_MANAGER  | process_recruiting_funnel | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_manager__recruiting.png`   |
| HR_MANAGER  | process_onboarding_flow   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_manager__onboarding.png`   |
| HR_MANAGER  | process_performance_cycle | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_manager__performance.png`  |
| HR_MANAGER  | process_learning_paths    | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | ?   | `hr_manager__learning.png`     |

### Cross-role impersonation (88 cells — DEFERRED to Phase 1)

Bloccato fino a fix `is_published=true` su tutti i 7 `_v2` preset. Una volta sbloccato, SUPERUSER sysadmin può navigare a `/dashboard/[code]` per ognuno dei 11 preset.

---

## Findings consolidati (pre-Phase 1, già evidence)

### F-001 · `hr_director_overview_v2` · RBAC matrix duplicato (Critical)

- **Evidence**: screenshot `.ux-design/audit/screenshots/initial-hr-director-v2.png` (catturato pre-audit, 06:23)
- **Repro**: login HR_DIRECTOR → `/dashboard` → vedere section "RBAC matrix"
- **Symptom**: `<h2>RBAC matrix</h2>` appare 2 volte consecutive nel DOM (LAYOUT_REGISTRY card title + widget interno)
- **Root cause**: `services/app/src/lib/dashboard-engine/registry.tsx:214-248` (RbacMatrix widget renderizza proprio header) + `LAYOUT_REGISTRY` (in `services/app/src/components/widgets/brand/BrandLayoutContainers`) inietta card title
- **Fix Phase 1**: rimuovere `<h2>` interni dai 19 widget in `registry.tsx` — single source of truth = LAYOUT_REGISTRY

### F-002 · `hr_director_overview_v2` · Activity feed duplicato (Critical)

- Identical pattern di F-001, widget `ActivityFeed` `registry.tsx:250-267`

### F-003 · `hr_director_overview_v2` · Hardcoded names (Critical)

- **Evidence**: screenshot mostra "HR Director", "system", "Maria Rossi", "Luca Bianchi" come `Activity feed` items
- **Root cause**: `registry.tsx:257-262` — demo fallback items array
- **Fix Phase 2**: replace demo with `useWidgetData()` querying `audit_logs` reali

### F-004 · `/dashboard/[code]` route → 404 universale (High)

- **Evidence**: navigate `http://localhost:3200/dashboard/hr_director_overview_v2` → 404
- **Root cause**: tutti i 7 `_v2` preset hanno `is_published=false` (verificato via psql)
- **Fix Phase 1**: SQL `UPDATE dashboard_presets SET is_published=true WHERE code ~ '_v2$'` (7 rows)

### F-005 · Mock data sistematico in registry.tsx (Critical, 19 widget)

- 19/19 widget hanno demo fallback hardcoded → ogni preset `_v2` mostra dati cablati anziché live
- Lista completa: vedi plan file `cheeky-puzzling-clarke.md` § "Mock/hardcoded findings"
- **Fix Phase 2**: sweep complete + `useWidgetData()` adoption

### F-006 · KPI values from seed static (Medium)

- `phase15g6_full_preset_layouts.sql` ha `data_source.type='static'` con `.value` cablato (es. HEADCOUNT 270, REVIEW Q4 86%, GOALS 1248, SUCCESSION 42 visibili in screenshot)
- Non è LIVE data binding, è demo seed numerico
- **Fix Phase 2**: cambiare seed a `data_source.type='api'` + route handler corrispondente

---

## Status

- ✅ Audit harness setup
- ✅ Mockup canonical enumeration (11)
- ✅ Test users matrix (8)
- ✅ Diagnosi `/dashboard/[code]` 404 (`is_published=false`)
- ✅ Diagnosi role_default_dashboards (8 ruoli + 8 process priority assignments)
- 🟡 Cell capture in progress — 1 di 16 catturato (hr_director default, baseline pre-fix)
- ⏳ Score 12 criteri × 16 cells
- ⏳ Baseline report + user sign-off

**Next**: capture restanti 15 cells via 8 login + sidebar navigation.
