# Spec — process_onboarding_flow_v2

> Audience: HR_DIRECTOR + HR_MANAGER.
> Stato pre-Phase 1: 3 elements sparse. Cycle 2 Phase 1 ricostruisce con 10 elements widget-rich.

## Framework C1-C10

| #   | Domanda      | Risposta                                                                                        |
| --- | ------------ | ----------------------------------------------------------------------------------------------- | --------- | --------- |
| C1  | Mestiere     | HR governance onboarding new hires (H2R sub-cycle post-recruiting)                              |
| C2  | Decisioni    | "new hires in onboarding stato?" · "first-90d retention?" · "documentation completion?"         |
| C3  | Dati         | new hires count · onboarding tasks status · documentation completion · day-1/30/60/90 milestone |
| C4  | Aggregazione | hero=cohort aggregate · body=task list · drill=employee onboarding card                         |
| C5  | Viz hero     | 4 KpiRing (New hires 90d · Onboarding tasks open · Docs completion% · Avg day-to-productive)    |
| C6  | Drill        | new hire click → onboarding checklist → task detail                                             |
| C7  | Viste        | tab `Cohort                                                                                     | Checklist | Timeline` |
| C8  | Header       | `DASHBOARD · PROCESSES · ONBOARDING FLOW` + cohort filter + Add new hire                        |
| C9  | Azioni       | Add new hire · Send reminder · Export onboarding report                                         |
| C10 | Storia       | "Onboarding Q1: 8 new hires, 92% docs ok, 1 ritardo critico su safety training"                 |

## Layout canonical (10 elements)

```
position=1 LayoutKpiRing (parent=NULL, span 12) ──── hero strip
  ├─ KpiRing New hires 90d (col 1, span 3)
  ├─ KpiRing Onboarding tasks open (col 4, span 3)
  ├─ KpiRing Docs completion% (col 7, span 3)
  └─ KpiRing Avg day-to-productive (col 10, span 3)

position=2 LayoutMainSplit (parent=NULL, span 12) ── body principal
  ├─ LayoutPanel "Onboarding cohort timeline" (col 1, span 8)
  │   └─ CareerArc (timeline visualization milestone)
  └─ LayoutPanel "Integration health new hires" (col 9, span 4)
      └─ IntegrationHealthPill

position=3 ActivityFeed (parent=NULL, span 12) ── secondary
```

## Data sources (live, P11)

| Element                       | Source                                                             | Schema dep                                    |
| ----------------------------- | ------------------------------------------------------------------ | --------------------------------------------- |
| KpiRing New hires 90d         | SQL `count employees WHERE hired_at > NOW() - INTERVAL '90 days'`  | `employees.hired_at`                          |
| KpiRing Onboarding tasks open | SQL `count onboarding_tasks WHERE status='open'` (if table exists) | `onboarding_tasks` (P11 unavailable se manca) |
| KpiRing Docs completion%      | SQL `% completed / total documents required`                       | derived                                       |
| KpiRing Avg day-to-productive | SQL `AVG(days_to_first_review_positive)`                           | derived                                       |
| CareerArc                     | SQL milestone sequence per new hire                                | `employees + onboarding_milestones`           |
| IntegrationHealthPill         | SQL `count successful sync new hires HRIS`                         | `audit_logs`                                  |
| ActivityFeed                  | SQL `audit_logs WHERE category='onboarding'`                       |                                               |

P11: tabelle `onboarding_tasks` / `onboarding_milestones` non garantite (verify Phase 2). Default `<DataNotAvailable />`.

## Title

`name_it`: `Onboarding||flow`
`name_en`: `Onboarding||flow`
