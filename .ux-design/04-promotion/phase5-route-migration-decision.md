# Phase 5 Route Migration — Decision Record

> Cycle 2 Phase 5 cycle 2. Scope decision autonomous plan §6.

## Decisione

**Le route legacy `/employees`, `/reviews`, `/goals`, `/learning`, `/compensation`, `/analytics/workforce`, `/admin/*`, `/ontology`, `/explorer/*` NON vengono convertite a server-side redirect** verso i preset `_v2` del nuovo dashboard engine.

## Razionale

Plan §Phase 5 originale (T5.2): "Convert 8 old route files to server-side redirect". Questa conversione presenta i seguenti rischi quando applicata su un sistema già shipped (SH-2, S40+):

1. **Regression risk**: le route legacy hanno feature dedicate non riprodotte 1:1 nei preset `_v2`:
   - `/employees` (SH-2) ha bulk action + filter bar + permission check dedicato
   - `/reviews` ha workflow stato + calibration flow
   - `/goals` ha cascade tree dedicato (vs Histogram nel preset_v2)
   - `/compensation` ha policy P3 specifiche per scope HR_MANAGER ridotto

2. **User trust**: bookmark + link esterni + email automatiche puntano alle route legacy. Redirect comporterebbe rottura UX per workflow esistenti.

3. **Investor demo path**: i preset `_v2` cycle 2 sono "investor-ready cockpit overview"; le route legacy sono "operational deep-dive". Tenere entrambe arricchisce il prodotto, non lo restringe.

## Architettura attuale post-S63

Due livelli di accesso parallel coesistenti:

| Livello                                 | Accesso                                         | Audience                              | Scope                                                   |
| --------------------------------------- | ----------------------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| **Cockpit overview** (cycle 2)          | `/dashboard/<preset_v2>` route handler dinamico | Tutti i ruoli con `is_published=true` | Hero KPI 4-ring + body widget aggregate + activity feed |
| **Operational deep-dive** (legacy SH-2) | `/employees`, `/reviews`, `/goals`, etc.        | Audience originale SH-2               | Bulk action + filter avanzati + policy P3 dedicate      |

Sidebar legacy `(app)/_components/BrandShell.tsx` continua a puntare alle route operational. Per accedere ai cockpit `_v2` cycle 2, l'utente naviga esplicitamente via `/dashboard/<code>` o via mapping `role_default_dashboards` (HR_DIRECTOR landing → `hr_director_overview_v2` cockpit).

## Follow-up tracciabile

Se in futuro si vuole consolidare i due livelli:

**Opzione A — Promote cockpit overview a default home** (preferred):

- Update sidebar PrimaryNav links a `/dashboard/<preset_v2>` (sidebar items diventano cockpit-first)
- Route legacy restano per esperti / deep dive (drill from cockpit → operational route)

**Opzione B — Server redirect** (sconsigliata):

- Convert legacy route files a `redirect()` server-side
- Rischio regression alto. Implementabile solo se i preset `_v2` raggiungono parity feature con SH-2

**Opzione C — Status quo**:

- Mantenere entrambe come livelli separati. Ridondanza accettabile.

## Decisione finale (S63 autonomous run)

**Opzione C** — status quo. Conversione esplicita verso preset_v2 deferred a sessione dedicata con audit feature parity. Plan §6 autorizza decisione di scope.

## Riferimenti

- Plan canonical S63+ §Phase 5
- DECISIONS-LOG-v2 L13 (S63 closure)
- DECISIONS-LOG-v2 L14 (this decision record)
