# Spec — process_recruiting_funnel_v2

> Audience: HR_DIRECTOR + HR_MANAGER.
> Stato pre-Phase 1: 3 elements sparse. Cycle 2 Phase 1 ricostruisce con 10 elements widget-rich.

## Framework C1-C10

| #   | Domanda      | Risposta                                                                                               |
| --- | ------------ | ------------------------------------------------------------------------------------------------------ | ---- | --------- |
| C1  | Mestiere     | HR governance pipeline recruiting (H2R sub-cycle)                                                      |
| C2  | Decisioni    | "funnel velocity sufficient?" · "bottleneck stage?" · "fill rate vs target?"                           |
| C3  | Dati         | open requisitions · candidates per stage · time-in-stage · offer acceptance · cost-per-hire            |
| C4  | Aggregazione | hero=funnel aggregate · body=stage detail · drill=requisition record                                   |
| C5  | Viz hero     | 4 KpiRing (Open requisitions · Candidates active · Avg time-to-hire days · Offer acceptance%)          |
| C6  | Drill        | stage click → candidates list → candidate detail slide-over                                            |
| C7  | Viste        | tab `Funnel                                                                                            | List | Velocity` |
| C8  | Header       | `DASHBOARD · PROCESSES · RECRUITING FUNNEL` + filter (dept · role · status) + New requisition CTA      |
| C9  | Azioni       | New requisition · Export CSV · Filter by stage                                                         |
| C10 | Storia       | "Funnel recruiting Q1: 24 candidate attivi, time-to-hire 38d (target 30d), 4 offer in attesa di firma" |

## Layout canonical (10 elements)

```
position=1 LayoutKpiRing (parent=NULL, span 12) ──── hero strip
  ├─ KpiRing Open requisitions (col 1, span 3)
  ├─ KpiRing Candidates active (col 4, span 3)
  ├─ KpiRing Avg time-to-hire (col 7, span 3)
  └─ KpiRing Offer acceptance% (col 10, span 3)

position=2 LayoutMainSplit (parent=NULL, span 12) ── body principal
  ├─ LayoutPanel "Funnel by stage" (col 1, span 8)
  │   └─ Histogram (recruiting stage distribution)
  └─ LayoutPanel "Activity recruiting" (col 9, span 4)
      └─ ActivityFeed (filtered category=recruiting)

position=3 SkillHeatmap (parent=NULL, span 12) ── candidate skill gaps vs requisition
```

## Data sources (live, P11)

| Element                   | Source                                                                                                            | Schema dep              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------- |
| KpiRing Open requisitions | SQL `count recruiting_jobs WHERE status='open'`                                                                   | `recruiting_jobs`       |
| KpiRing Candidates active | SQL `count recruiting_candidates WHERE status NOT IN ('hired', 'rejected', 'withdrawn')`                          | `recruiting_candidates` |
| KpiRing Avg time-to-hire  | SQL `AVG(EXTRACT(DAY FROM (hired_at - applied_at)))`                                                              |                         |
| KpiRing Offer acceptance% | SQL `count WHERE status='offer_accepted' / count WHERE status IN ('offered', 'offer_accepted', 'offer_rejected')` |                         |
| Histogram                 | SQL `GROUP BY stage count candidates`                                                                             |                         |
| ActivityFeed              | SQL `audit_logs WHERE category='recruiting' ORDER BY DESC LIMIT 10`                                               |                         |
| SkillHeatmap              | SQL pivot candidates × required skills × match level                                                              |                         |

P11: se `recruiting_jobs` / `recruiting_candidates` non popolati per tenant → `<DataNotAvailable />` per KPI relevant.

## Title

`name_it`: `Recruiting||funnel`
`name_en`: `Recruiting||funnel`
