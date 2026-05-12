# S47 Long-window baseline bench (post-S46 stable)

> Run: 2026-05-12 04:27 · 30s × 20 conn · prod build · post S46 fixes

| Route                  | Avg ms  | P50  | P95  | P99  | Max  | Req/sec | Errors |
| ---------------------- | ------- | ---- | ---- | ---- | ---- | ------- | ------ |
| /login                 | 14.18   | 13   | 27   | 34   | 62   | 1363.67 | 0      |
| /dashboard (G6)        | 985.6   | 972  | 1238 | 1290 | 1463 | 20.14   | 0      |
| /hr_director_overview  | 671.26  | 669  | 742  | 823  | 962  | 29.6    | 0      |
| /tenant_owner_overview | 733.46  | 733  | 812  | 869  | 922  | 27.04   | 0      |
| /employee_journey      | 787.11  | 746  | 1606 | 1955 | 2382 | 25.1    | 0      |
| /capability_graph      | 747.98  | 741  | 909  | 952  | 981  | 26.44   | 0      |
| /skills_heatmap        | 718.06  | 703  | 929  | 1386 | 1488 | 27.6    | 0      |
| /org_systems           | 1445.17 | 1403 | 2234 | 2399 | 2639 | 13.57   | 0      |
| /cross_tenant_overview | 719.94  | 718  | 791  | 856  | 970  | 27.47   | 0      |
