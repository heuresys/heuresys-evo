# Spec — process_learning_paths_v2

> Audience: HR_DIRECTOR + HR_MANAGER + DEPT_HEAD + LINE_MANAGER.
> Stato pre-Phase 1: 3 elements sparse. Cycle 2 Phase 1 ricostruisce con 10 elements widget-rich.

## Framework C1-C10

| #   | Domanda      | Risposta                                                                                  |
| --- | ------------ | ----------------------------------------------------------------------------------------- | --------------- | --------------- |
| C1  | Mestiere     | governance upskilling (SKILGRO sub-cycle: gap → recommend → cert → reassess)              |
| C2  | Decisioni    | "skill gap copertura training?" · "completion rate mandatory?" · "cert in scadenza?"      |
| C3  | Dati         | active paths · enrollments · completion rate · cert expiring · skill coverage da training |
| C4  | Aggregazione | hero=path aggregate · body=path grid · drill=path detail + enrolled employees             |
| C5  | Viz hero     | 4 KpiRing (Active paths · Total enrollments · Completion rate% · Cert expiring 30d)       |
| C6  | Drill        | path click → enrolled employees + completion histogram + cert status                      |
| C7  | Viste        | tab `Path grid                                                                            | Enrollment list | Skill coverage` |
| C8  | Header       | `DASHBOARD · PROCESSES · LEARNING PATHS` + category filter + New enrollment CTA           |
| C9  | Azioni       | New enrollment · Export learning report · Filter by mandatory                             |
| C10 | Storia       | "12 paths attivi · 87 iscrizioni · 65% completion · 4 cert in scadenza prossimi 30d"      |

## Layout canonical (10 elements)

```
position=1 LayoutKpiRing (parent=NULL, span 12) ──── hero strip
  ├─ KpiRing Active paths (col 1, span 3)
  ├─ KpiRing Total enrollments (col 4, span 3)
  ├─ KpiRing Completion rate% (col 7, span 3)
  └─ KpiRing Cert expiring 30d (col 10, span 3)

position=2 LayoutMainSplit (parent=NULL, span 12) ── body principal
  ├─ LayoutPanel "Skill coverage da training" (col 1, span 8)
  │   └─ SkillHeatmap (skill × dept × proficiency-from-training)
  └─ LayoutPanel "Learning activity" (col 9, span 4)
      └─ ActivityFeed (filter category=learning)

position=3 CareerArc (parent=NULL, span 12) ── milestone career-driven learning path
```

## Data sources (live, P11)

| Element                   | Source                                                                                   | Schema dep             |
| ------------------------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| KpiRing Active paths      | SQL `count learning_paths WHERE is_active=true`                                          | `learning_paths`       |
| KpiRing Total enrollments | SQL `count learning_enrollments WHERE status NOT IN ('completed', 'cancelled')`          | `learning_enrollments` |
| KpiRing Completion rate%  | SQL `% completed / total enrollments`                                                    |                        |
| KpiRing Cert expiring 30d | SQL `count certifications WHERE expires_at BETWEEN NOW() AND NOW() + INTERVAL '30 days'` | `certifications`       |
| SkillHeatmap              | SQL pivot skill × dept × employees_with_completed_training                               |                        |
| ActivityFeed              | SQL `audit_logs WHERE category='learning' OR resource_type='learning_path'`              |                        |
| CareerArc                 | SQL milestone career data + learning path enrolled                                       | derived                |

P11: tabella `certifications` non garantita (verify Phase 2). Default `<DataNotAvailable />` per Cert KPI.

## Title

`name_it`: `Learning||paths`
`name_en`: `Learning||paths`
