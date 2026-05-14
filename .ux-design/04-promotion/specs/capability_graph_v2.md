# Spec — capability_graph_v2

> Audience: DEPT_HEAD (primary) + HR_DIRECTOR / TENANT_OWNER / IT_ADMIN / HR_MANAGER (secondary).
> Stato pre-Phase 1: 11 elements presenti ma hierarchy disallineata simile a hr_director_overview. Cycle 2 Phase 1 ricostruisce con 11 elements clean.

## Framework C1-C10

| #   | Domanda         | Risposta                                                                                                    |
| --- | --------------- | ----------------------------------------------------------------------------------------------------------- | ------- | --------------------------- |
| C1  | Mestiere        | DEPT_HEAD = manager dipartimento, capability ownership dept-level                                           |
| C2  | Decisioni       | "capability gap del mio dept?" · "rete di skill relations?" · "succession risk dei ruoli critici dept?"     |
| C3  | Dati            | dept headcount · skill coverage · skill graph topology · capability radar · KG mini-graph · succession dept |
| C4  | Aggregazione    | hero=dept aggregate (4 KPI) · body=topology (graph) · drill=skill node detail                               |
| C5  | Viz hero        | 4 KpiRing (Dept headcount · Skill coverage% · Performance avg · Critical role gap)                          |
| C6  | Drill           | skill node click → list employees with skill + proficiency levels                                           |
| C7  | Viste dinamiche | tab `Graph                                                                                                  | Heatmap | Radar` (3 viste capability) |
| C8  | Header          | breadcrumb `DASHBOARD · CAPABILITY · AUDIENCE: DEPT_HEAD` + dept filter + Export                            |
| C9  | Azioni          | Export PDF · drill skill node · view ESCO mapping                                                           |
| C10 | Storia          | "Capability del dipartimento — gap critico 3 skill, coverage 73%, 2 ruoli senza succession"                 |

## Layout canonical (11 elements)

```
position=1 LayoutKpiRing (parent=NULL, span 12) ──── hero strip
  ├─ KpiRing Dept headcount (col 1, span 3)
  ├─ KpiRing Skill coverage% (col 4, span 3)
  ├─ KpiRing Performance avg (col 7, span 3)
  └─ KpiRing Critical role gap (col 10, span 3)

position=2 LayoutDoubleSplit (parent=NULL, span 12) ── body principal
  ├─ LayoutPanel "KG mini-graph" (col 1, span 8)
  │   └─ KgMiniGraph
  └─ LayoutPanel "Capability radar" (col 9, span 4)
      └─ CapabilityRadar

position=3 SkillHeatmap (parent=NULL, span 12) ── secondary
```

## Data sources (live, P11)

| Element                   | Source                                                                      |
| ------------------------- | --------------------------------------------------------------------------- |
| KpiRing Dept headcount    | SQL `employees count WHERE org_unit_id=dept`                                |
| KpiRing Skill coverage%   | SQL aggregate skill_assessments coverage per dept                           |
| KpiRing Performance avg   | SQL `AVG(performance_reviews.overall_rating) WHERE org_unit_id=dept`        |
| KpiRing Critical role gap | SQL count `roles WHERE criticality='critical' AND no succession ready`      |
| KgMiniGraph               | SQL graph 1-hop seed dept primary occupation → related occupations + skills |
| CapabilityRadar           | SQL aggregate skill proficiency per category for dept                       |
| SkillHeatmap              | SQL pivot skill × employees in dept                                         |

## Title

`name_it`: `Capability||graph`
`name_en`: `Capability||graph`
