# S45 Post-optimization perf bench

> Run: 2026-05-12 03:54 · 10s · 10 connections · prod build · unstable_cache+mat_view applied

| Route                            | Avg ms | P50 | P95  | P99  | Max  | Req/sec |
| -------------------------------- | ------ | --- | ---- | ---- | ---- | ------- |
| /login (public)                  | 11.98  | 11  | 21   | 24   | 37   | 801.1   |
| /dashboard (G6)                  | 496.16 | 477 | 844  | 900  | 907  | 19.61   |
| /dashboard/hr_director_overview  | 343.27 | 340 | 453  | 529  | 531  | 28.7    |
| /dashboard/tenant_owner_overview | 367.89 | 367 | 459  | 547  | 550  | 26.9    |
| /dashboard/employee_journey      | 402.72 | 379 | 824  | 937  | 1024 | 24.2    |
| /dashboard/capability_graph      | 371.3  | 365 | 475  | 481  | 551  | 26.7    |
| /dashboard/skills_heatmap        | 360.38 | 345 | 627  | 865  | 898  | 27.5    |
| /dashboard/org_systems           | 715.69 | 671 | 1185 | 1289 | 1356 | 13.6    |
| /dashboard/cross_tenant_overview | 361.24 | 355 | 451  | 512  | 514  | 27.3    |
