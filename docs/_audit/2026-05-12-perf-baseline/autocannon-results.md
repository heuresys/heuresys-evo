# Production perf bench — autocannon

> Run: 2026-05-12 03:50 GMT+2 · 30s · 10 connections · production build (Next.js 16.2.4)

| Route                            | Avg ms | P50 | P95  | P99  | Max  | Req/sec | Errors |
| -------------------------------- | ------ | --- | ---- | ---- | ---- | ------- | ------ |
| /login (public)                  | 11.9   | 9   | 28   | 40   | 65   | 808     | 0      |
| /dashboard (G6)                  | 492.26 | 475 | 888  | 889  | 893  | 19.61   | 0      |
| /dashboard/hr_director_overview  | 381.79 | 339 | 1062 | 1394 | 1552 | 25.6    | 0      |
| /dashboard/tenant_owner_overview | 414.17 | 369 | 1052 | 1303 | 1524 | 23.7    | 0      |
| /dashboard/employee_journey      | 406.91 | 374 | 879  | 1103 | 1264 | 24.2    | 0      |
| /dashboard/capability_graph      | 378.91 | 364 | 635  | 780  | 908  | 25.9    | 0      |
| /dashboard/skills_heatmap        | 377.74 | 351 | 803  | 1091 | 1215 | 26.2    | 0      |
| /dashboard/org_systems           | 729.33 | 694 | 1193 | 1238 | 1379 | 13.2    | 0      |
| /dashboard/cross_tenant_overview | 357.72 | 356 | 439  | 445  | 449  | 27.4    | 0      |
