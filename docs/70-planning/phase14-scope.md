# Phase 14 — Scope decision draft

**Status**: Draft (2026-05-06 · post Phase 13 closure · pending Enzo decision)
**Origin**: Phase 13 close left explicit deferred items + future evolutions documented in `dashboard-engine-pattern.md` § future-evolutions
**Estimate range**: 30-60 FTE-day depending on selection mix (vs. 41-51 Phase 13 actually shipped)

## Context

Phase 13 ha shippato il primo MVP funzionante delle 9 dashboard Tier 1 data-driven. L'engine renderer + page route + atomic component sono live. Ciò che è stato esplicitamente deferred a Phase 14+ (per direttiva SEMPLICITÀ + ROBUSTEZZA · MVP first):

- Live data binding (V1 = demo data hardcoded nei widget)
- Editor utente drag-resize (V1 = layout statico letto da DB)
- Mockup PROCESS espansi (V1 = MVP placeholder ~150 LOC vs ~750 LOC dei 5 esistenti)
- E2E Playwright + golden image diff
- Audit log P4 mutations preset/element
- /ontology reopen (BLOCK 11+ OpenAI integration)
- ESCO/SAP/Knowledge Graph explorer dedicato (Tier 2)

Phase 14 va perimetrata: NON è un blocco unico, ma 6+ tracce indipendenti di valore differente.

## Opzioni disponibili (priorità e effort)

| #   | Traccia                                   | Effort  | Valore utente         | Dipendenze         | Rischio         |
| --- | ----------------------------------------- | ------- | --------------------- | ------------------ | --------------- |
| A   | Live data binding (data-fetcher real)     | 8-12 d  | ⭐⭐⭐⭐⭐ (alto)     | nessuna            | medio (DB perf) |
| B   | Mockup PROCESS expansion a parità Phase 9 | 4-6 d   | ⭐⭐ (visivo)         | nessuna            | basso           |
| C   | Drag-resize editor utente (workspace)     | 12-18 d | ⭐⭐⭐ (UX)           | A consigliata      | alto (UX)       |
| D   | E2E Playwright + golden image             | 5-8 d   | ⭐⭐⭐⭐ (regression) | infra Playwright   | basso           |
| E   | Audit log P4 mutations                    | 3-5 d   | ⭐⭐⭐ (compliance)   | C necessaria       | basso           |
| F   | /ontology reopen + OpenAI advisor         | 8-12 d  | ⭐⭐⭐⭐⭐ (USP)      | OpenAI integration | alto (cost)     |
| G   | ESCO/SAP/KG explorer dedicato (Tier 2)    | 18-25 d | ⭐⭐⭐⭐ (Tier 2)     | A + F              | medio           |
| H   | i18n switch IT/EN runtime                 | 2-3 d   | ⭐⭐ (locale)         | nessuna            | basso           |

## Dettaglio tracce

### A · Live data binding

**Scope**: implementare `data-fetcher` in `dashboard-engine` che dispatcha per `widget_catalog.data_source_type` (sql / graph / api / static) + cache TTL. Widget reciono `data` props invece di hardcode.

**Subtask** (~8-12 FTE-day):

- `dashboard-engine/data-fetcher.ts` con dispatch per source type
- Estendere widget atomic component contract: aggiungere `data` prop opzionale (V2)
- Per ogni preset, definire `data_source_config` JSONB nei `dashboard_elements` (popolato da seed update)
- SWR client-side caching basato su `widget_catalog.swr_seconds` + `cache_ttl_seconds`
- Performance target P95 ≤500ms server-side

**Razionale**: senza live data, le dashboard sono showcase visivo. Phase 14.A trasforma il prodotto da MVP visivo a strumento operativo reale.

**Pre-requisite**: nessuna (backend Phase 13.0 ha già 30+9 endpoint pronti)

### B · Mockup PROCESS expansion

**Scope**: portare i 4 mockup PROCESS HTML (~150 LOC ciascuno V1) a parità con i 5 esistenti TALENT/ENTERPRISE (~750 LOC ciascuno). Aggiungere panel/widget che il design language richiede (mockup ricchi come hr-director-overview).

**Subtask** (~4-6 FTE-day):

- 4 mockup HTML estesi (~600 LOC delta ciascuno)
- Aggiornare `dashboard_elements` seed con widget binding maggiore (3 → 5-8 elementi)
- Verifica visuale Storybook + render via /dashboard/code

**Razionale**: i mockup PROCESS V1 sono MVP placeholder. Per acceptance designer + investor pitch, espansione a parità è opportuna.

### C · Drag-resize editor utente (workspace runtime)

**Scope**: attivare `dashboards` + `dashboard_widgets` (UUID, esistenti, 20+160 row) come user workspace runtime con grid drag-resize. Plan dice "out-of-scope V1".

**Subtask** (~12-18 FTE-day):

- React Grid Layout (o equivalent) per drag-resize
- API gateway endpoint POST/PUT `/dashboards` e `/dashboard-widgets`
- Auth flow per ownership (P3 owner-or-shared check)
- UI per "Save layout" + "Share with role"

**Pre-requisite**: A consigliata (drag-resize senza data live è demo)

### D · E2E Playwright + golden image diff

**Scope**: setup Playwright + 9 dashboard × 8 ruoli = 72 combinazione test. Pixel diff <5% tolerance + console errors = 0 + axe-core ≥95.

**Subtask** (~5-8 FTE-day):

- Setup Playwright + baseline screenshot
- Test fixture per 8 ruoli canonical_demo_users
- Pixel diff tooling (pixelmatch o equivalent)
- CI integration

**Razionale**: Phase 13 ha 18 vitest unit test sul resolver, ma 0 E2E. Senza E2E, regression UI rischiose dopo refactor.

### E · Audit log P4 mutations

**Scope**: estendere `auditedTransaction()` ai mutations su `dashboard_presets` + `dashboard_elements`. Critico solo se C attivata.

**Subtask** (~3-5 FTE-day):

- Wrapper Prisma write su 2 tabelle
- Audit log entry standard P4 schema
- Test compliance

### F · /ontology reopen + OpenAI advisor

**Scope**: chiudere il blocker /ontology (BLOCK 11+) introducendo OpenAI integration in api-gateway. Sblocca semantic search + AI advisor su capability graph.

**Subtask** (~8-12 FTE-day):

- OpenAI API integration (env config + cost monitoring)
- /ontology endpoint riapertura (porting da legacy)
- AI advisor panel widget (nuovo atomic component)
- Cost monitor dashboard

**Razionale**: USP differenziante. Nei mockup capability_graph c'è già il visual, manca il backend semantic.

### G · ESCO/SAP/KG explorer dedicato (Tier 2)

**Scope**: Tier 2 dashboard portfolio — espansione da 9 a 18-22 dashboard. Specificamente: ESCO/NACE/O\*NET admin UI + SAP integration UI + Knowledge Graph standalone explorer.

**Subtask** (~18-25 FTE-day):

- 9-13 nuovi mockup HTML
- 9-13 nuovi `dashboard_presets` seed
- Atomic component nuovi (es. ESCOTreeNavigator, SAPSyncPanel)
- Eventually expand /esco /nace /onet endpoint

**Pre-requisite**: A + F consigliate (data live + OpenAI per max valore)

### H · i18n switch IT/EN runtime

**Scope**: attivare `name_it`/`name_en` + `description_it`/`description_en` (già seedati Phase 13.B) via switch runtime IT↔EN. Atomic component reciono prop `locale`.

**Subtask** (~2-3 FTE-day):

- LocaleProvider + `useLocale()` hook
- Page route param `?lang=it|en` o user preference
- Update widget atomic per `locale` prop

**Razionale**: dataset già bilingue, switch banale. Quick win.

## Raccomandazione

**Bundle suggerito Phase 14 (~25-32 FTE-day, 1 sprint focused)**:

1. **A · Live data binding** (8-12 d) — sblocca trasformazione MVP→prodotto operativo
2. **D · E2E Playwright** (5-8 d) — copre regression risk dopo A
3. **H · i18n IT/EN** (2-3 d) — quick win, dataset già pronto
4. **F · /ontology + OpenAI** (8-12 d) — USP differenziante, lato AI

**Rinviato a Phase 15+**:

- B (estetico, low ROI per la roadmap business)
- C (UX nice-to-have, ma stack complesso · richiede A prima)
- E (compliance solo se C attivata)
- G (Tier 2 = espansione orizzontale, non blocking V2)

**Razionale del bundle**: A+D+H+F = "MVP 13 → V2 operativo + sicuro + bilingue + AI-augmented" senza overcommit. C (drag-resize) e G (Tier 2) sono evoluzioni Phase 15+ una volta che V2 è stabile in produzione.

## Decisione richiesta a Enzo

Quale combinazione attivare in Phase 14?

| Bundle              | Tracce           | Effort  | Outcome                                |
| ------------------- | ---------------- | ------- | -------------------------------------- |
| **R · Recommended** | A + D + H + F    | 25-32 d | V2 operativo · AI · bilingue · regress |
| **M · Minimal**     | A + H            | 10-15 d | Live data + bilingue, niente altro     |
| **C · Compliance**  | A + D + E (no C) | 16-25 d | Live data + regression + audit pronto  |
| **U · UX-heavy**    | A + C + E        | 23-35 d | Live data + editor utente + audit      |
| **F · Full**        | tutte (A-H)      | 50-79 d | Tier 2 + tutto, multi-sprint           |

**Default proposto**: R (Recommended) — bilanciato tra valore prodotto e effort gestibile in 1 sprint focused.

## Riferimenti

- Plan Phase 13 (executed): `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- Engine pattern doc: `docs/20-architecture/dashboard-engine-pattern.md` § future-evolutions
- DECISIONS-LOG: L29 (13.A) · L30 (13.B) · L31 (13.C/D/E)
- Pack 1-8 promotion: `.handoff/legacy-import-registry.csv` (30 endpoint Promoted post smoke test)
- Out-of-scope Phase 13 elenco originale: plan § "Out-of-scope Phase 13"
