# Spec — hr_director_overview_v2

> Audience: HR_DIRECTOR · Investor-critical (priorità massima).
> Stato pre-Phase 1: 11 elements presenti ma hierarchy disallineata (RbacMatrix + ActivityFeed children di LayoutKpiRing che dovrebbe avere solo 4 KpiRing). Cycle 2 Phase 1 ricostruisce con 11 elements widget-rich + hierarchy clean.

## Framework C1-C10

| #   | Domanda                | Risposta                                                                                                      |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------ |
| C1  | Mestiere del ruolo     | Strategic capability orchestrator + risk owner talent                                                         |
| C2  | Decisioni mattina tipo | "ho lacune critiche?" · "qualcuno rallenta cycle?" · "succession ready per ruoli a rischio?"                  |
| C3  | Dati sotto controllo   | Headcount · review completion · goals on-track · succession ready · RBAC matrix · activity feed live          |
| C4  | Livello aggregazione   | hero=aggregate (4 KPI) · body=detail (succession card top-3 · RBAC matrix) · drill=record (employee profile)  |
| C5  | Viz hero               | 4 KpiRing (Headcount · Review completion · Goals on-track% · Succession ready) con threshold tone + sparkline |
| C6  | Generale→particolare   | KPI click → trend 12m → drilldown lista detail slide-over                                                     |
| C7  | Viste dinamiche        | tab `Strategic                                                                                                | Tactical | Operational` (3 livelli aggregazione) — futuro Phase 4 |
| C8  | Header/footer          | breadcrumb `DASHBOARD · TALENT · AUDIENCE: HR_DIRECTOR` + scope chip + Export PDF + CTA "Apri review cycle →" |
| C9  | Azioni rapide          | Export PDF · Apri review cycle · drill su singola KPI                                                         |
| C10 | Storia                 | "Talent & capability — al colpo d'occhio: Q1 in chiusura, 38% completion, focus su 3 dept in ritardo"         |

## Layout canonical (11 elements)

```
position=1 LayoutKpiRing (parent=NULL, span 12) ──── hero strip
  ├─ KpiRing Headcount (col 1, span 3)
  ├─ KpiRing Review completion (col 4, span 3)
  ├─ KpiRing Goals on-track% (col 7, span 3)
  └─ KpiRing Succession ready (col 10, span 3)

position=2 LayoutMainSplit (parent=NULL, span 12) ── body principal
  ├─ LayoutPanel "RBAC matrix" (col 1, span 8)
  │   └─ RbacMatrix
  └─ LayoutPanel "Activity feed" (col 9, span 4)
      └─ ActivityFeed

position=3 SuccessionCard (parent=NULL, span 12) ── secondary
```

## Data sources (live, P11)

| Element                   | Source                                                                       | Note                                             |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| KpiRing Headcount         | SQL `employees count WHERE tenant + deleted_at IS NULL`                      | trend 12m via mat view                           |
| KpiRing Review completion | SQL aggregate `review_cycle_participants completed/total %` per active cycle |                                                  |
| KpiRing Goals on-track%   | SQL aggregate `goals WHERE status='on_track' / total %`                      |                                                  |
| KpiRing Succession ready  | SQL count `succession_candidates WHERE readiness='ready_now'`                |                                                  |
| RbacMatrix                | static (config_overrides JSON) cross-cutting role × area                     | post-Phase 1: query da rbp_role_area_permissions |
| ActivityFeed              | SQL `audit_logs ORDER BY at DESC LIMIT 10 + filter relevant`                 |                                                  |
| SuccessionCard            | SQL top-3 succession_candidates JOIN employees + readiness_gauge             |                                                  |

## Title (header h1)

`name_it`: `Talent & capability||al colpo d'occhio` (multi-word accent split T0.7)
`name_en`: `Talent & capability||at a glance`
