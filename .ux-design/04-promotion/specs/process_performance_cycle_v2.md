# Spec — process_performance_cycle_v2

> Audience: HR_DIRECTOR + HR_MANAGER + DEPT_HEAD.
> Stato pre-Phase 1: 3 elements sparse. Cycle 2 Phase 1 ricostruisce con 10 elements widget-rich.

## Framework C1-C10

| #   | Domanda      | Risposta                                                                                                |
| --- | ------------ | ------------------------------------------------------------------------------------------------------- | -------- | ------------ |
| C1  | Mestiere     | governance review cycle (GOKMER sub-cycle: Goal-KPI-Measurement-Evaluation-Review)                      |
| C2  | Decisioni    | "cycle progress%?" · "manager calibrators in ritardo?" · "rating outlier da calibrare?"                 |
| C3  | Dati         | cycle status · participants completion · average rating · outlier count · calibration board             |
| C4  | Aggregazione | hero=cycle aggregate · body=participants kanban (4 stage) + calibration · drill=review detail           |
| C5  | Viz hero     | 4 KpiRing (Cycle progress% · Avg rating · Variance flag · Calibration completion%)                      |
| C6  | Drill        | review card click → review detail panel (rating + comments + 360 + dev plan)                            |
| C7  | Viste        | tab `Kanban                                                                                             | Timeline | Calibration` |
| C8  | Header       | `DASHBOARD · PROCESSES · PERFORMANCE CYCLE Q1 2026` + cycle countdown deadline                          |
| C9  | Azioni       | Send reminder · Open calibration board · Export report                                                  |
| C10 | Storia       | "Cycle Q1 2026: 38% completion, 3 dept ritardo (Compliance · IT · Operations), 12 outlier da calibrare" |

## Layout canonical (10 elements)

```
position=1 LayoutKpiRing (parent=NULL, span 12) ──── hero strip
  ├─ KpiRing Cycle progress% (col 1, span 3)
  ├─ KpiRing Avg rating (col 4, span 3)
  ├─ KpiRing Variance flag (col 7, span 3)
  └─ KpiRing Calibration completion% (col 10, span 3)

position=2 LayoutMainSplit (parent=NULL, span 12) ── body principal
  ├─ LayoutPanel "Review status kanban" (col 1, span 8)
  │   └─ Histogram (4 stage: Pending / In progress / Submitted / Approved counts)
  └─ LayoutPanel "Recent reviews activity" (col 9, span 4)
      └─ ActivityFeed (filter category=performance)

position=3 CapabilityRadar (parent=NULL, span 12) ── aggregate skill coverage da review data
```

## Data sources (live, P11)

| Element                         | Source                                                                    | Schema dep                  |
| ------------------------------- | ------------------------------------------------------------------------- | --------------------------- |
| KpiRing Cycle progress%         | SQL `count completed / total participants WHERE cycle_id=active`          | `review_cycle_participants` |
| KpiRing Avg rating              | SQL `AVG(overall_rating) WHERE cycle_id=active`                           | `performance_reviews`       |
| KpiRing Variance flag           | SQL `STDDEV(overall_rating) WHERE cycle_id=active` (alert if > threshold) |                             |
| KpiRing Calibration completion% | SQL `count WHERE calibrated_at IS NOT NULL / total`                       |                             |
| Histogram                       | SQL `GROUP BY status count participants`                                  |                             |
| ActivityFeed                    | SQL `audit_logs WHERE category='performance' OR resource_type='review'`   |                             |
| CapabilityRadar                 | SQL aggregate skill ratings da review_responses                           |                             |

## Title

`name_it`: `Performance||cycle`
`name_en`: `Performance||cycle`
