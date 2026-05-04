# PET-Driven Migration Roadmap — evo

Vision PET (Process / Enterprise / Talent) come fil rouge della migrazione legacy → evo. Le 47 mappature `rbp_area_perspectives` (PRIMARY+SECONDARY) guidano l'ordine di porting per costruire **una storia coerente** sin dal Tier 1.

Riferimenti normativi: `docs/10-strategy/migration-strategy-pet-driven.md` §3, `docs/90-archive/migration-bootstrap/dbms-cookbook.md` §4.

## Tier 1 — Cross-cutting + Abilitatori (~30-40 pagine, 80-120 endpoint)

Aree `PRIMARY` per ciascuna prospettiva. Abilitano evo come prodotto navigabile end-to-end (un employee può loggarsi, vedere il suo workspace, fare self-service; un HR può vedere talent intelligence; un manager può fare goal setting).

### TALENT-PRIMARY (11 aree)

| Area code                | Pages | Endpoints | Depends on                       |
| ------------------------ | ----- | --------- | -------------------------------- |
| `CORE_HR`                | 6     | 14        | — (root)                         |
| `SELF_SERVICE`           | 4     | 8         | CORE_HR                          |
| `RECRUITMENT`            | 5     | 12        | CORE_HR                          |
| `PERFORMANCE`            | 4     | 11        | CORE_HR                          |
| `LEARNING`               | 5     | 10        | CORE_HR                          |
| `CAREER`                 | 3     | 9         | CORE_HR + LEARNING + PERFORMANCE |
| `COMPENSATION`           | 3     | 7         | CORE_HR + PERFORMANCE            |
| `ENGAGEMENT`             | 2     | 6         | CORE_HR                          |
| `TEAMS`                  | 3     | 8         | CORE_HR                          |
| `TALENT`                 | 4     | 10        | CORE_HR + PERFORMANCE + CAREER   |
| `WORKFORCE_INTELLIGENCE` | 3     | 9         | CORE_HR + TALENT + COMPENSATION  |

### ENTERPRISE-PRIMARY (9 aree — query autoritativa)

```sql
SELECT fa.code, fa.name
FROM rbp_area_perspectives ap
JOIN rbp_functional_areas fa ON fa.id = ap.functional_area_id
WHERE ap.perspective_code = 'ENTERPRISE' AND ap.relevance = 'PRIMARY'
ORDER BY fa.code;
```

Aree attese (snapshot 2026-04-06): `ANALYTICS`, `GOVERNANCE`, `IT_INTEGRATION`, `ORG_DESIGN`, `PLATFORM_ADMIN`, `PLATFORM_NAVIGATOR`, `RBP_ADMIN`, `TENANT_ADMIN`, `WORKSPACE`. **Validare con la query sopra** al momento di avviare il Tier 1 (lo snapshot può differire).

| Area code            | Pages | Endpoints | Depends on                       |
| -------------------- | ----- | --------- | -------------------------------- |
| `TENANT_ADMIN`       | 4     | 10        | — (root)                         |
| `PLATFORM_ADMIN`     | 5     | 12        | — (root, scope=PLATFORM)         |
| `RBP_ADMIN`          | 6     | 16        | TENANT_ADMIN                     |
| `IT_INTEGRATION`     | 3     | 8         | TENANT_ADMIN                     |
| `ORG_DESIGN`         | 4     | 9         | CORE_HR + TENANT_ADMIN           |
| `ANALYTICS`          | 3     | 7         | CORE_HR + WORKFORCE_INTELLIGENCE |
| `GOVERNANCE`         | 3     | 6         | RBP_ADMIN                        |
| `PLATFORM_NAVIGATOR` | 2     | 4         | PLATFORM_ADMIN                   |
| `WORKSPACE`          | 3     | 8         | CORE_HR (per widget catalog)     |

### PROCESS-PRIMARY (5 aree)

| Area code        | Pages | Endpoints | Depends on           |
| ---------------- | ----- | --------- | -------------------- |
| `PROCESS_DESIGN` | 4     | 11        | ORG_DESIGN           |
| `WORKFLOW`       | 3     | 9         | PROCESS_DESIGN       |
| `BLUEPRINT`      | 3     | 8         | PROCESS_DESIGN       |
| `AUTOMATION`     | 3     | 7         | WORKFLOW + BLUEPRINT |
| `BPMN_RUNTIME`   | 2     | 6         | WORKFLOW             |

## Tier 2 — Data sources lenti + SECONDARY mappings (~15-20 pagine)

Aree con relazioni `SECONDARY` (cross-perspective enrichment), oltre ad aree con dipendenze esterne lente (ESCO sync, NACE crosswalk, Firecrawl enrichment async).

| Area code             | Perspective          | Pages | Endpoints | Depends on             |
| --------------------- | -------------------- | ----- | --------- | ---------------------- |
| `EMPLOYEE_ASSESSMENT` | TALENT-SECONDARY     | 3     | 8         | PERFORMANCE + LEARNING |
| `SUCCESSION`          | TALENT-SECONDARY     | 2     | 6         | TALENT + CAREER        |
| `SKILL_GRAPH`         | TALENT-SECONDARY     | 2     | 5         | ESCO sync (lento)      |
| `INDUSTRY_TAXONOMY`   | ENTERPRISE-SECONDARY | 2     | 4         | NACE crosswalk         |
| `ENRICHMENT_JOBS`     | ENTERPRISE-SECONDARY | 3     | 7         | Firecrawl async        |
| `BENCHMARK`           | ENTERPRISE-SECONDARY | 2     | 5         | INDUSTRY_TAXONOMY      |
| `AUDIT_LOG`           | ENTERPRISE-SECONDARY | 2     | 4         | RBP_ADMIN              |
| `PROCESS_KPI`         | PROCESS-SECONDARY    | 2     | 5         | WORKFLOW + ANALYTICS   |

## Tier 3 — Tooling + Admin granulare (~10-15 pagine)

Aree non-mappate in `rbp_area_perspectives` o admin granulare a basso valore strategico iniziale.

- `EMBEDDINGS_ADMIN`, `CACHE_ADMIN`, `JOB_QUEUE_ADMIN`, `FEATURE_FLAGS`, `LOCALIZATION_ADMIN`, `BACKUP_ADMIN`, `DEV_TOOLS`
- Pages: 1-2 ciascuna, endpoints: 3-5 ciascuna
- Spostabili a post-GA (release minor)

## Roadmap consolidata — priority order

| priority_order | area_code                | perspective        | depends_on                       | estimated_effort_days |
| -------------- | ------------------------ | ------------------ | -------------------------------- | --------------------- |
| 1              | `CORE_HR`                | TALENT-PRIMARY     | —                                | 8                     |
| 2              | `TENANT_ADMIN`           | ENTERPRISE-PRIMARY | —                                | 5                     |
| 3              | `PLATFORM_ADMIN`         | ENTERPRISE-PRIMARY | —                                | 6                     |
| 4              | `RBP_ADMIN`              | ENTERPRISE-PRIMARY | TENANT_ADMIN                     | 7                     |
| 5              | `SELF_SERVICE`           | TALENT-PRIMARY     | CORE_HR                          | 4                     |
| 6              | `WORKSPACE`              | ENTERPRISE-PRIMARY | CORE_HR                          | 5                     |
| 7              | `RECRUITMENT`            | TALENT-PRIMARY     | CORE_HR                          | 6                     |
| 8              | `PERFORMANCE`            | TALENT-PRIMARY     | CORE_HR                          | 6                     |
| 9              | `LEARNING`               | TALENT-PRIMARY     | CORE_HR                          | 6                     |
| 10             | `CAREER`                 | TALENT-PRIMARY     | CORE_HR + LEARNING + PERFORMANCE | 5                     |
| 11             | `COMPENSATION`           | TALENT-PRIMARY     | CORE_HR + PERFORMANCE            | 4                     |
| 12             | `ENGAGEMENT`             | TALENT-PRIMARY     | CORE_HR                          | 3                     |
| 13             | `TEAMS`                  | TALENT-PRIMARY     | CORE_HR                          | 4                     |
| 14             | `ORG_DESIGN`             | ENTERPRISE-PRIMARY | CORE_HR + TENANT_ADMIN           | 5                     |
| 15             | `IT_INTEGRATION`         | ENTERPRISE-PRIMARY | TENANT_ADMIN                     | 4                     |
| 16             | `TALENT`                 | TALENT-PRIMARY     | CORE_HR + PERFORMANCE + CAREER   | 6                     |
| 17             | `WORKFORCE_INTELLIGENCE` | TALENT-PRIMARY     | CORE_HR + TALENT + COMPENSATION  | 5                     |
| 18             | `ANALYTICS`              | ENTERPRISE-PRIMARY | CORE_HR + WORKFORCE_INTELLIGENCE | 4                     |
| 19             | `GOVERNANCE`             | ENTERPRISE-PRIMARY | RBP_ADMIN                        | 3                     |
| 20             | `PLATFORM_NAVIGATOR`     | ENTERPRISE-PRIMARY | PLATFORM_ADMIN                   | 2                     |
| 21             | `PROCESS_DESIGN`         | PROCESS-PRIMARY    | ORG_DESIGN                       | 5                     |
| 22             | `WORKFLOW`               | PROCESS-PRIMARY    | PROCESS_DESIGN                   | 5                     |
| 23             | `BLUEPRINT`              | PROCESS-PRIMARY    | PROCESS_DESIGN                   | 4                     |
| 24             | `AUTOMATION`             | PROCESS-PRIMARY    | WORKFLOW + BLUEPRINT             | 4                     |
| 25             | `BPMN_RUNTIME`           | PROCESS-PRIMARY    | WORKFLOW                         | 4                     |

**Totale Tier 1**: ~120 giorni FTE. **Tier 2**: +35-45 giorni. **Tier 3**: +15-20 giorni post-GA.

## Sequenza esecutiva

1. **Sprint 0-1** (priority 1-4): root abilitatori (CORE_HR, TENANT_ADMIN, PLATFORM_ADMIN, RBP_ADMIN). Senza questi non si naviga.
2. **Sprint 2-3** (priority 5-13): TALENT story end-to-end (login → workspace → self-service → recruitment/performance/learning).
3. **Sprint 4** (priority 14-20): ENTERPRISE-PRIMARY restanti (org design, analytics, governance) per chiudere il quadrante Enterprise.
4. **Sprint 5** (priority 21-25): PROCESS layer su top di ORG_DESIGN consolidato.
5. **Sprint 6+**: Tier 2 (SECONDARY + data sources lenti) → Tier 3 (admin granulare) → GA.

## Validazione dipendenze

Ogni area Tier 1 prima di entrare in sprint: query `SELECT depends_on_area_code FROM rbp_area_dependencies WHERE area_code='<X>'` (tabella da introdurre — TODO infra) per verificare che le dipendenze elencate sopra siano coerenti con il grafo runtime. Disallineamenti tra roadmap statica e DB → bloccare lo sprint planning fino a riconciliazione.
