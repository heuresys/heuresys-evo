# S46 Post-optimization perf bench

> Run: 2026-05-12 04:06 · 10s · 10 conn · prod build · post data-fetcher cache + mv_rbac_matrix repoint + composite idx

| Route                  | Avg ms | P50 | P95  | P99  | Max  | Req/sec |
| ---------------------- | ------ | --- | ---- | ---- | ---- | ------- |
| /login                 | 10.63  | 9   | 27   | 36   | 70   | 898.1   |
| /dashboard (G6)        | 517.57 | 496 | 899  | 908  | 922  | 18.9    |
| /hr_director_overview  | 353.47 | 334 | 648  | 692  | 732  | 28      |
| /tenant_owner_overview | 376.06 | 373 | 468  | 499  | 523  | 26.3    |
| /employee_journey      | 388.85 | 370 | 740  | 787  | 910  | 25.2    |
| /capability_graph      | 373.13 | 369 | 451  | 475  | 542  | 26.1    |
| /skills_heatmap        | 371.44 | 355 | 599  | 747  | 889  | 26.5    |
| /org_systems           | 733.78 | 704 | 1193 | 1244 | 1323 | 13.2    |
| /cross_tenant_overview | 368.12 | 366 | 447  | 476  | 483  | 26.8    |
