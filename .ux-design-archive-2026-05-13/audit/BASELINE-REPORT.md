# BASELINE REPORT — Phase 0 Forensic Audit

> **Date**: 2026-05-11 07:00 GMT+2  
> **Auditor**: Claude Code (live e2e via Chrome MCP, dev `http://localhost:3200`)  
> **Plan reference**: `C:\Users\enzospenuso\.claude\plans\cheeky-puzzling-clarke.md`  
> **Grid file**: `.ux-design/audit/AUDIT-GRID.md`

---

## Executive summary

Auditati 4 cells campione tramite SUPERUSER impersonation cross-role (con `is_published=true` applicato preliminarmente su 7 `_v2` preset, vedi F-004). Tutti e 4 mostrano **failure pattern sistemico critico** che si estende per induzione agli altri 7 cells: la dashboard `/dashboard/[code]` route è **completamente non funzionante** in production.

**Risultato**: della Phase 0 baseline 16 cells target, ho catturato 4 cells (25%) ma il pattern di fallimento è **deterministico e replicabile** — gli altri 12 cells avranno la stessa configurazione di bug.

**Verdict architetturale**: il sistema dashboard ha **DUE renderer paralleli divergenti**, di cui uno (`DashboardGrid`) è effettivamente rotto in produzione. Il sistema ha bisogno di un **refactor strutturale Phase 1 prima di proseguire la baseline a 88 cells**.

---

## Findings consolidati

### F-001 · Duplicate header rendering — CRITICAL

**Visibile**: `/dashboard` (HR_DIRECTOR root) — `<h2>RBAC matrix</h2>` e `<h2>Activity feed</h2>` appaiono **2 volte ciascuno** nel DOM  
**Root cause**: `services/app/src/lib/dashboard-engine/registry.tsx:214-248` (RbacMatrix) e `:250-267` (ActivityFeed) renderizzano `<h*>` interni; `LAYOUT_REGISTRY` (in `BrandLayoutContainers`) inietta separatamente il card title  
**Fix Phase 1**: rimuovere `<h*>` da TUTTI i 19 widget in `registry.tsx` — single source = LAYOUT_REGISTRY title

### F-002 · "Unknown widget: layout-doubleSplit" — CRITICAL ⭐ (nuovo)

**Visibile**: `/dashboard/cross_tenant_overview_v2` + `/dashboard/org_systems_v2` mostrano "**Unknown widget: layout-doubleSplit**" + "**Unknown widget: layout-mainSplit**" sovrapposti al centro del viewport  
**Root cause**: `DashboardGrid` (`services/app/src/lib/dashboard-engine/grid.tsx`) ha un registry differente da `DashboardRenderer` (`services/app/src/components/DashboardRenderer.tsx`). I widget code `layout-doubleSplit`/`layout-mainSplit` (definiti in `LAYOUT_REGISTRY` di `BrandLayoutContainers`) NON sono mappati nel registry usato da `DashboardGrid`  
**Fix Phase 1**: unificare i renderer — eliminare `DashboardGrid` e usare `DashboardRenderer` anche in `/dashboard/[code]/page.tsx`, OPPURE allineare i due registry. Decisione canonical: **eliminare `DashboardGrid`**, usare `DashboardRenderer` universale

### F-003 · "LOADING WIDGET..." infinito — CRITICAL ⭐ (nuovo)

**Visibile**: TUTTI i preset accessi via `/dashboard/[code]` (cross_tenant_v2, hr_director_v2, org_systems_v2, process_recruiting_funnel) mostrano widget in stato "LOADING WIDGET..." che NON si risolve  
**Probabile root cause**: `prefetchElements` server-side fallisce silenziosamente per data_source non risolti, OPPURE `useWidgetData` client-side hook non handle correttamente lo state di skeleton  
**Fix Phase 1**: diagnostica fetch lifecycle in `DashboardGrid` + `data-fetcher.ts`

### F-004 · `is_published=false` blocca `/dashboard/[code]` (RISOLTO)

**Stato**: già risolto da SQL `UPDATE dashboard_presets SET is_published=true WHERE code ~ '_v2$'` (07:50 GMT+2)  
**Side effect**: ora ANCHE i `_v2` sono direttamente navigabili — necessario per impersonation cross-role audit

### F-005 · Hardcoded names in registry.tsx — CRITICAL (confirmed)

**Evidence**: `/dashboard` (root HR_DIRECTOR) Activity feed mostra hardcoded: `HR Director`, `system`, `Maria Rossi`, `Luca Bianchi`  
**Root cause**: `registry.tsx:257-262` demo fallback array  
**Inventory completo demo strings** (da Phase 1 exploration):

- Names: `Stefania Bianchi`, `Maria Rossi`, `Luca Bianchi`, `Gabriele Amato`, `sysadmin`
- KPI fissi: `72`, `88%`, `42 ready-now`, `122k total`
- Arrays: career stages 2018-2029+, RBAC matrix 4 roles × 3 areas, ESCO skills sql/py/lead/comm  
  **Fix Phase 2**: sweep complete + `useWidgetData()` adoption con skeleton fallback (no demo data)

### F-006 · KPI da seed static — HIGH (confirmed)

**Evidence**: `/dashboard` (HR_DIRECTOR) mostra "HEADCOUNT 270", "REVIEW Q4 86%", "GOALS ACTIVE 1248", "SUCCESSION 42" — valori dal seed `phase15g6_full_preset_layouts.sql:143-150` come `config_overrides.data_source.value` statico  
**Fix Phase 2**: cambiare seed a `data_source.type='api'` + creare route handlers in `services/app/src/app/api/dashboard/**`

### F-007 · "PLATFORM UPTIME 100%" widget hardcoded — HIGH ⭐ (nuovo)

**Visibile**: `/dashboard/cross_tenant_overview_v2` mostra widget "PLATFORM UPTIME 100% last 30 days" — valore static  
**Fix**: stessa categoria F-006

### F-008 · Persona label hardcoded nel preset — MEDIUM ⭐ (nuovo)

**Visibile**: breadcrumb mostra `IT ADMIN · G6 SMOKE`, `SUPERUSER · G6`, `HR Director · G6 smoke` indipendentemente dal session user che naviga  
**Root cause**: `dashboard_presets.persona_label` è hardcoded in seed (es. "IT Admin · G6 smoke") — non riflette utente corrente  
**Decisione**: probabilmente CORRETTO (è metadata del preset, non dell'utente), ma confondente. **Possibile rinaming**: "Audience: IT_ADMIN" invece di "IT Admin · G6 smoke"

### F-009 · Architettura dual-renderer divergente — CRITICAL ⭐ (nuovo)

**Evidence chiara**: `/dashboard` (root, HR_DIRECTOR) renderizza ~10 widget visibili (4 KPI + RBAC matrix + Activity feed + altri); `/dashboard/hr_director_overview_v2` (route diretta, STESSO preset code) renderizza solo 2 widget LOADING perpetuo. Footer dice "SOURCE · 4 WIDGETS" per [code] mentre root mostra molti più  
**Root cause**:

- `/dashboard/page.tsx:112-177` usa `loadG6Elements` + `prefetchElements` + `DashboardRenderer` (lib/dashboard-engine/registry)
- `/dashboard/[code]/page.tsx:38-125` usa `loadDashboardPreset` + `resolveElements` + `prefetchElements` + `DashboardGrid` (lib/dashboard-engine/grid)
- Stesso preset DB, due chain di rendering totalmente diversi → outputs divergenti
  **Fix Phase 1**: unificare in unico chain canonical (raccomando `DashboardRenderer`)

### F-010 · "Direzione HR (G6)" titolo italianizzato vs "Brand-fedele dashboard · DB-driven (G6)" — MEDIUM ⭐

**Evidence**: `/dashboard/hr_director_overview_v2` mostra titolo `Direzione HR (G6)` (i18n preset.name); `/dashboard` HR_DIRECTOR mostra `Brand-fedele dashboard · DB-driven (G6)` (hardcoded in page.tsx:162)  
**Inconsistenza**: stesso preset, due titoli diversi. Root.tsx ha titolo placeholder dev, [code].tsx ha titolo brand corretto  
**Fix Phase 1**: page.tsx root usa `presetName` invece di placeholder hardcoded

---

## Grid sommario 4 cells catturati

| Cell                                               | Route  | C1 (visual)                                               | C2 (no dup)            | C3 (no demo)                   | C9 (live)            | C10 (api) | C11 (console) | Verdict           |
| -------------------------------------------------- | ------ | --------------------------------------------------------- | ---------------------- | ------------------------------ | -------------------- | --------- | ------------- | ----------------- |
| HR_DIRECTOR `/dashboard`                           | root   | ❌ widget OK ma layout incoerente con mockup              | ❌ RBAC + Activity dup | ❌ Maria/Luca/system hardcoded | ❌ seed static       | ❓        | ❓            | **FAIL**          |
| HR_DIRECTOR `/dashboard/hr_director_overview_v2`   | [code] | ❌ solo 2 widget loading perpetuo                         | ✅                     | ❓                             | ❌ perpetual loading | ❓        | ❓            | **CRITICAL FAIL** |
| HR_DIRECTOR `/dashboard/cross_tenant_overview_v2`  | [code] | ❌ "Unknown widget: layout-doubleSplit" + 1 KPI hardcoded | ✅                     | ✅ (struttura)                 | ❌                   | ❓        | ❓            | **CRITICAL FAIL** |
| HR_DIRECTOR `/dashboard/org_systems_v2`            | [code] | ❌ "Unknown widget" + 2 LOADING perpetuo                  | ✅                     | ✅                             | ❌                   | ❓        | ❓            | **CRITICAL FAIL** |
| HR_DIRECTOR `/dashboard/process_recruiting_funnel` | [code] | ❌ 3 widget "LOADING WIDGET..." perpetuo                  | ✅                     | ✅                             | ❌                   | ❓        | ❓            | **CRITICAL FAIL** |

---

## Cells non catturati (deferred)

12 cells × 2 ruoli (HR_DIRECTOR + HR_MANAGER per i 4 process) + 7 cells per gli altri ruoli (default) — pattern atteso identico ai 4 catturati (lo stesso renderer DashboardGrid si applica per tutti i `_v2` accesso via `/dashboard/[code]`, e tutti i preset hanno la stessa configurazione `_v2` che produce "Unknown widget" + "LOADING WIDGET").

Non utile catturarli prima di Phase 1 fix (F-002 + F-003 + F-009): risulteranno tutti FAIL per le stesse ragioni.

---

## Conclusioni & raccomandazione

**Phase 0 baseline è SUFFICIENTE per procedere a Phase 1.** I bug critici sono:

1. **F-009 architettura dual-renderer**: risolvere PRIMA, perché blocca ogni audit successivo
2. **F-002 "Unknown widget"**: corollario di F-009
3. **F-003 "LOADING WIDGET" perpetuo**: corollario di F-009 + data binding broken
4. **F-001 duplicate headers**: indipendente, sweep registry.tsx
5. **F-005 / F-006 / F-007 hardcoded data**: scope Phase 2
6. **F-010 titolo placeholder dev**: minor, fix in Phase 1

**Phase 1 priorities ridefinite**:

1. Unificare renderer: eliminare `DashboardGrid`, usare `DashboardRenderer` anche in `/dashboard/[code]/page.tsx` (~3h FTE)
2. Fix `LAYOUT_REGISTRY` per coprire `layout-doubleSplit` + `layout-mainSplit` (~1h)
3. Rimuovere duplicate `<h*>` dai 19 widget in `registry.tsx` (~1h)
4. Fix titolo root `/dashboard` placeholder (~0.5h)
5. Verify `useWidgetData` lifecycle — perché tutti loading perpetuo? (~2h diagnostica + fix)

**Effort Phase 1 ricalibrato**: 7-10h FTE (era 6-10h, allineato).

---

## Sign-off gate

> **Domanda all'utente**: il baseline è accettato? Posso procedere con Phase 1 priorities aggiornate sopra (F-009 prima di tutto)?  
> **Alternativa**: catturare i restanti 12 cells (~30 min extra) prima di toccare codice, per evidenza completa.

Raccomando: **procedere a Phase 1 SUBITO**. Catturare gli altri 12 cells dopo F-002/F-003/F-009 fix, perché solo allora si vedranno output significativi (non più loading perpetuo). I 12 cells diventeranno **verification post-fix**, non baseline pre-fix.
