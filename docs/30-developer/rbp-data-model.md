---
type: concept
title: RBP Data Model (18 tabelle)
aliases:
  - RBP data model
  - rbp_* tables
  - RBP schema
created: 2026-04-24
updated: 2026-04-24
sources:
  - raw/md/data-model.md
tags:
  - product
  - rbp
  - data-model
status: draft
facet: principle
authority: authoritative
scope: platform-wide
temporal-status: current
layer: data
---

> **⚠️ Imported from external Heuresys wiki** — S10 (2026-05-04). Wikilinks `[[X]]` Obsidian-style preserved (resolution deferred to S11). Original frontmatter above maintained for reference. See footer for source path.

# RBP Data Model

## Overview

18 tabelle `rbp_*` che implementano il framework [[rbp]] data-driven di [[heuresys-hrms]].

## Inventario

|   # | Tabella                     | Scope             |                   Righe typ |
| --: | --------------------------- | ----------------- | --------------------------: |
|   1 | `rbp_roles`                 | global            |                           8 |
|   2 | `rbp_functional_areas`      | global            |  34 (era 33 pre-2026-04-22) |
|   3 | `rbp_role_permissions`      | global            |                        ~160 |
|   4 | `rbp_scope_rules`           | global            |                         ~40 |
|   5 | `rbp_data_classifications`  | global            |                          ~5 |
|   6 | `rbp_field_policies`        | global            |                         ~30 |
|   7 | `rbp_field_classifications` | tenant+platform   |                         ~50 |
|   8 | `rbp_perspectives`          | global            |                     3 (PET) |
|   9 | `rbp_area_perspectives`     | global            |                          47 |
|  10 | `rbp_dashboards`            | global            |                          11 |
|  11 | `rbp_role_dashboards`       | global            |                         ~15 |
|  12 | `rbp_dashboard_nav_items`   | global            |                         186 |
|  13 | `rbp_pages`                 | global            | 99-170 (snapshot variabile) |
|  14 | `rbp_sections`              | tenant+platform   |                         ~15 |
|  15 | `rbp_section_translations`  | tenant+platform   |                         ~30 |
|  16 | `rbp_teams`                 | **tenant-scoped** |                    variable |
|  17 | `rbp_team_members`          | via tenant        |                    variable |
|  18 | `rbp_team_leaders`          | via tenant        |                    variable |

## 10 invarianti DB-enforced

1. `rbp_roles.hierarchy_level` unique
2. `rbp_role_permissions.{role, area}` unique (deny-by-default implicito se missing row)
3. `rbp_role_permissions.scope_type` ∈ 6 valori (`PLATFORM/TENANT/DEPARTMENT/HIERARCHY/SELF/TEAM`)
4. `rbp_field_policies.action` ∈ {SHOW, MASK, HIDE}
5. `rbp_role_dashboards` max 1 default per ruolo (partial unique index `WHERE is_default=TRUE`)
6. `rbp_pages` status REDIRECT → `redirect_to` NOT NULL
7. `rbp_dashboard_nav_items` target XOR per `item_type` (composite check)
8. `rbp_sections.{tenant_id, code}` unique
9. `rbp_teams.{tenant_id, code}` unique
10. Inheritance chain `rbp_roles.inherits_from` aciclica (**app-level only**, no DB enforcement)

## Gap semantico data classifications

Due set distinti non allineati 1:1:

- `rbp_data_classifications.code`: **PII, FINANCIAL, HEALTH, PUBLIC, INTERNAL**
- `rbp_field_classifications.classification`: **PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED, SENSITIVE**

Prima = tipo semantico (PII), secondo = sensitivity bucket. Collegamento applicativo, mapping non esplicito. **Debt M2 Governance** (vedi [[field-policy]]).

## RLS coverage RBP

- `rbp_field_classifications` ✅ RLS (tenant_id NULL OR current_tenant_id)
- `rbp_sections`, `rbp_section_translations` ❌ (app-layer enforcement)
- `rbp_teams`, `rbp_team_members`, `rbp_team_leaders` ❌ (tenant-scoped senza policy, gap rischio Q3 2026 sprint)
- Altre 12 platform-global = N/A

## Relazioni

- Framework: [[rbp]]
- Service layer: [[rbp-cache-service]] (carica queste tabelle)
- Policies: [[scope-rules]], [[field-policy]]

## Sources

- [[source-subsystem-heuresys-evo]] (rbp/data-model, 521 righe — file più grande del batch)
- [[source-adr-005-rbac-model]]

---

## Source attribution

- **Imported from**: external Heuresys wiki — `C:\Users\enzospenuso\wiki-space\heuresys-wiki\wiki\concepts\rbp-data-model.md`
- **Imported at**: 2026-05-04 (S10)
- **Wikilink status**: `[[X]]` Obsidian-style preserved as-is. Resolution to markdown links `[X](path)` deferred to S11 (task: map wiki paths → evo repo paths)
- **Frontmatter status**: original Obsidian frontmatter preserved at top of file. Cleanup deferred to S11 if needed
- **Re-import policy**: this file is a snapshot at import time. To refresh, re-run wiki import workflow against the source path above
