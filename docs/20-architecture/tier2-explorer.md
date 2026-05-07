# Tier 2 explorer — foundation (Phase 14 Sprint 3.G)

## Goals

Tier 2 surfaces are read-only navigators over the Heuresys ontological data
layer — distinct from the operational dashboards (Tier 1) which display
roll-ups for HR practitioners.

This sprint ships the **foundation** — three thin pages backed by three
atomic UI components — so subsequent sprints can layer search, filter,
saved-views, and graph visualisations without touching the route or
component contracts.

## Routes (V1)

| Route            | Purpose                                             | Data source                                      |
| ---------------- | --------------------------------------------------- | ------------------------------------------------ |
| `/explorer/esco` | ESCO occupation tree (lazy expand)                  | `esco_occupations` (3,040 rows, parent_uri tree) |
| `/explorer/sap`  | SAP migration jobs + delta sync log (tenant-scoped) | `sap_migration_jobs`, `sap_delta_sync_log`       |
| `/explorer/kg`   | Occupation-centred 1-hop knowledge graph            | `esco_occupations` + `esco_occupation_skills`    |

## Atomics (`packages/ui`)

| Component           | Renderer                                  | Future upgrade                     |
| ------------------- | ----------------------------------------- | ---------------------------------- |
| `ESCOTreeNavigator` | Recursive `<ul>` with `onExpand` callback | Virtualise for >10k visible nodes  |
| `KGGraphCanvas`     | Tabular adjacency list (foundation)       | Cytoscape via dynamic ssr:false    |
| `SAPSyncPanel`      | Status badges + jobs table + delta KPIs   | Live update via SSE on sync events |

## Endpoints (`/api/explorer/*`)

| Endpoint                                  | Method | Auth    | Body / Query          | Returns                     |
| ----------------------------------------- | ------ | ------- | --------------------- | --------------------------- |
| `/api/explorer/esco/tree?parent=<uri>`    | GET    | session | parent occupation URI | `{ nodes: ESCOTreeNode[] }` |
| `/api/explorer/sap/status`                | GET    | session | (tenant from session) | `{ jobs, delta, lastJob }`  |
| `/api/explorer/kg/expand?occupationId=<>` | GET    | session | ESCO occupation UUID  | `{ centre, skills }`        |

## What this foundation does NOT include

The original 9-13-mockup Tier 2 brief covers eight more surfaces (saved
views, advanced filter rail, ESCO ↔ ISCO crosswalk, SAP infotype mapping
matrix, skill-cluster heatmap explorer, certification-gap explorer,
career-path simulator, role library). These are intentionally deferred
so the foundation can ship independently and the team can evaluate the
chosen UI vocabulary (atomic + lazy expand + Prisma-direct) before
locking the rest in.

## Acceptance criteria (V1)

- [x] `/explorer/esco` renders a tree, lazy-expands children via API
- [x] `/explorer/sap` renders the SAPSyncPanel atomic for the caller's tenant
- [x] `/explorer/kg` renders 1-hop neighborhood from `esco_occupation_skills`
- [x] Three corresponding API routes return JSON
- [x] All three pages require an authenticated session

## Follow-up

- Cytoscape upgrade for `KGGraphCanvas` (preserve KGNode/KGEdge contract)
- Saved views (per-user, persisted in `user_preferences`)
- Search bar with debounced query against `esco_occupations.preferred_label_*`
- Tenant-scoped RBP gate (`requirePermission('TIER2_EXPLORER', 'read')`) once
  the helper is extracted from services/api-gateway into a shared module
- Storybook stories for the three atomics
