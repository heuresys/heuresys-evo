# Feature Parity Tracking — Legacy → evo

> Tracker manuale dello stato di porting delle 33 functional areas + 47 PET mapping dal legacy `heuresys.com.evo` (Express+Next.js mix) verso evo (NestJS + Next.js 16).
> **Aggiornamento**: ad ogni PET-driven migration step (vedi `docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md`) — l'autore della PR aggiorna la riga corrispondente.

## Schema colonne

| Campo                 | Valori                                                           | Note                                                                                        |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `area_code`           | `CORE_HR`, `TALENT`, ...                                         | Codice univoco da `rbp_functional_areas.code`                                               |
| `perspective_primary` | `P` / `E` / `T`                                                  | Process / Enterprise / Talent (PET)                                                         |
| `legacy_status`       | `full` / `partial` / `stub`                                      | Stato in legacy (baseline 2026-04-30)                                                       |
| `evo_status`          | `legacy-only` / `evo-partial` / `evo-complete` / `cutover-ready` | Stato in evo                                                                                |
| `tier`                | `1` / `2` / `3`                                                  | Priorità migration: 1=core (employees, auth, RBP), 2=talent/perf, 3=advanced (AI, semantic) |
| `pages_total`         | int                                                              | Pagine UI legacy in scope                                                                   |
| `endpoints_total`     | int                                                              | Route API legacy in scope                                                                   |
| `pages_ported`        | int                                                              | Pagine già su Next.js 16 evo                                                                |
| `endpoints_ported`    | int                                                              | Route già su NestJS api-gateway evo                                                         |
| `blockers`            | testo                                                            | Bloccanti aperti (Prisma model mancante, dep esterna, ecc.)                                 |

## Definizioni transizione

- `legacy-only` → nessun porting iniziato
- `evo-partial` → ≥1 pagina o endpoint porting, ma `pages_ported < pages_total` o `endpoints_ported < endpoints_total`
- `evo-complete` → 100% porting, ma legacy ancora attivo (parallelo)
- `cutover-ready` → smoke test E2E pass su evo, blockers vuoto, traffico legacy può essere ruotato

## Stato corrente (baseline 2026-05-01)

| area_code            | persp | legacy_status | evo_status  | tier | pages_total | endpoints_total | pages_ported | endpoints_ported | blockers                                         |
| -------------------- | ----- | ------------- | ----------- | ---- | ----------- | --------------- | ------------ | ---------------- | ------------------------------------------------ |
| CORE_HR              | T     | full          | evo-partial | 1    | 14          | 28              | 1            | 0                | NestJS EmployeeModule WIP                        |
| AUTH                 | E     | full          | evo-partial | 1    | 2           | 6               | 2            | 0                | NextAuth credentials OK; JWT provider BE pending |
| RBP_GOVERNANCE       | E     | full          | legacy-only | 1    | 8           | 16              | 0            | 0                | RBPCacheService da portare in NestJS             |
| TALENT               | T     | full          | legacy-only | 2    | 9           | 21              | 0            | 0                | dipende ESCO embeddings + KG service             |
| ESCO                 | T     | full          | legacy-only | 2    | 4           | 12              | 0            | 0                | pgvector setup evo + 14k skills import           |
| PERFORMANCE          | T     | full          | legacy-only | 2    | 6           | 14              | 0            | 0                | dipende CORE_HR cutover                          |
| COMPENSATION         | T     | full          | legacy-only | 2    | 5           | 11              | 0            | 0                | tabelle CCNL multi-tenant                        |
| LEARNING             | T     | partial       | legacy-only | 2    | 4           | 9               | 0            | 0                | bridge ESCO skills ↔ corsi                       |
| ANALYTICS_HR         | T     | full          | legacy-only | 2    | 7           | 18              | 0            | 0                | rebuild widget engine evo                        |
| ANALYTICS_PROCESS    | P     | full          | legacy-only | 2    | 5           | 11              | 0            | 0                | —                                                |
| ANALYTICS_ENTERPRISE | E     | partial       | legacy-only | 3    | 4           | 8               | 0            | 0                | —                                                |
| PLATFORM_NAVIGATOR   | E     | full          | legacy-only | 1    | 1           | 3               | 0            | 0                | nav DBMS-driven, P9 enforce                      |
| PERSPECTIVES         | E     | full          | legacy-only | 1    | 3           | 6               | 0            | 0                | rbp_perspectives + 47 mapping seed               |
| WORKSPACE            | E     | full          | legacy-only | 1    | 2           | 9               | 1            | 0                | dashboard widget engine v2                       |
| ...                  | ...   | ...           | ...         | ...  | ...         | ...             | ...          | ...              | ...                                              |

> Tabella completa (33 righe) generata da query SQL — vedi sezione successiva. Riga 14+ omesse per brevità.

## Comando regen tabella

```sql
-- File: scripts/sql/feature-parity-snapshot.sql
-- Esegue su DB legacy. Output da incollare/diffare in questo doc.
SELECT
  fa.code AS area_code,
  CASE pt.code WHEN 'PROCESS' THEN 'P' WHEN 'ENTERPRISE' THEN 'E' WHEN 'TALENT' THEN 'T' END AS persp,
  'full' AS legacy_status,
  COALESCE(t.evo_status, 'legacy-only') AS evo_status,
  COALESCE(t.tier, 3) AS tier,
  (SELECT COUNT(*) FROM rbp_pages p WHERE p.area_id = fa.id) AS pages_total,
  (SELECT COUNT(*) FROM rbp_endpoints e WHERE e.area_id = fa.id) AS endpoints_total,
  COALESCE(t.pages_ported, 0) AS pages_ported,
  COALESCE(t.endpoints_ported, 0) AS endpoints_ported,
  COALESCE(t.blockers, '') AS blockers
FROM rbp_functional_areas fa
LEFT JOIN rbp_area_perspectives ap ON ap.area_id = fa.id AND ap.relation = 'PRIMARY'
LEFT JOIN rbp_perspectives pt ON pt.id = ap.perspective_id
LEFT JOIN evo_parity_tracker t ON t.area_code = fa.code
ORDER BY tier ASC, fa.code ASC;
```

Esecuzione:

```bash
psql -h <legacy-host> -d heuresys_v1 -f scripts/sql/feature-parity-snapshot.sql \
  | scripts/sql-to-md-table.sh \
  > /tmp/parity-fresh.md

# Diff manuale contro questo file, aggiorna riga per riga
diff <(sed -n '/^| area_code/,/^$/p' docs/30-developer/feature-parity-tracking.md) /tmp/parity-fresh.md
```

`evo_parity_tracker` è una tabella locale a `services/app/prisma/schema.prisma` (model `EvoParityTracker`) che contiene SOLO i campi mutabili nel tempo (`evo_status`, `tier`, `pages_ported`, `endpoints_ported`, `blockers`). Il resto è derivato dalla source of truth RBP.

## Definition of Done per `cutover-ready`

Una riga può passare a `cutover-ready` solo se:

- `pages_ported == pages_total` AND `endpoints_ported == endpoints_total`
- E2E test (Playwright) green per tutte le pagine in scope
- `blockers` vuoto
- DB migration evo applicata
- Audit log P4 attivo sugli endpoint nuovi
- RLS policy P5 verificata su tabelle scope

Owner: chi apre la PR di cutover firma checklist sopra in description.
