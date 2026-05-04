# DBMS evo — Cookbook query reali

> **Status S11**: il contenuto resta operativo (query funzionali) ma il file sarà spostato in `docs/40-operations/db-management-evo.md` (merge) o in `docs/90-archive/migration-bootstrap/` (snapshot) come parte della doc consolidation S11. Decisione finale in PR #B3.

**Status**: ATTIVO (verificato 2026-05-02)
**DB target**: PostgreSQL 16 bare-metal su VM `oracle-vm-default`, porta 5432, DB `heuresys_platform`, owner `heuresys`
**Stato dati**: popolato (4 tenants, 274 users, 270 employees, ESCO 14k skills, RBP completo, 47 PET mapping)

---

## 1. Setup connessione

### 1.1 Da CLI (peer auth, no password)

```bash
sudo -nu postgres psql -d heuresys_platform
```

### 1.2 Da app evo (NestJS + Prisma)

`DATABASE_URL` per sviluppo locale evo:

```
postgresql://heuresys:<password>@127.0.0.1:5432/heuresys_platform?schema=public
```

Password attuale: vedi `.env` di un'app evo deployata (es. `services/api-gateway/.env` su VM via container env).

### 1.3 Bypass RLS per query analitiche

Per query cross-tenant senza setting `current_tenant_id()`:

```sql
SET row_security = off;
-- query qui
```

L'utente `heuresys` ha permessi per disabilitare RLS in sessione corrente.

---

## 2. Stato dati — counts critici (verificato 2026-05-02)

| Tabella                  | Count   | Lente      |
| ------------------------ | ------- | ---------- |
| tenants                  | 4       | E          |
| users                    | 274     | T+E        |
| employees                | 270     | T          |
| canonical_demo_users     | 8       | (seed)     |
| rbp_roles                | 8       | (seed)     |
| rbp_role_permissions     | 179     | (seed)     |
| rbp_perspectives         | 3       | (seed PET) |
| rbp_area_perspectives    | 47      | (seed PET) |
| rbp_functional_areas     | 34      | (seed)     |
| rbp_pages                | 170     | (seed)     |
| rbp_dashboards           | 11      | (seed)     |
| platform_pages           | 154     | (seed)     |
| esco_skills              | 14.011  | T          |
| esco_occupations         | 3.040   | T          |
| esco_occupation_skills   | 126.051 | T          |
| industry_classifications | 3.276   | E          |
| audit_logs               | 334     | P          |
| performance_reviews      | 292     | T+P        |
| org_units                | 76      | E          |
| locations                | 34      | E          |
| cost_centers             | 30      | E          |
| goals                    | 1.068   | T+P        |
| courses                  | 127     | T          |
| leave_requests           | 0 ∅     | T          |
| leave_balances           | 0 ∅     | T          |

Solo `leave_*` sono vuote (feature non ancora popolata di workflow data). Tutto il resto è ricco.

---

## 3. Cookbook query — 3 lenti PET

### 3.1 Lente TALENT — top occupations per skill richness

```sql
SELECT
  o.preferred_label_en AS occupation,
  count(eos.skill_id) AS n_skills,
  count(*) FILTER (WHERE eos.relation_type = 'essential') AS essential,
  count(*) FILTER (WHERE eos.relation_type = 'optional')  AS optional
FROM esco_occupations o
JOIN esco_occupation_skills eos ON eos.occupation_id = o.id
GROUP BY o.preferred_label_en
ORDER BY n_skills DESC
LIMIT 10;
```

**Output 2026-05-02** (top 5):

| occupation                                  | n_skills | essential | optional |
| ------------------------------------------- | -------- | --------- | -------- |
| specialised doctor                          | 178      | 62        | 116      |
| computer numerical control machine operator | 158      | 19        | 139      |
| computer science lecturer                   | 140      | 71        | 69       |
| food technologist                           | 139      | 73        | 66       |
| powertrain engineer                         | 137      | 81        | 56       |

### 3.2 Lente ENTERPRISE — multi-tenant headcount + struttura

```sql
SELECT
  t.code AS tenant,
  count(DISTINCT e.id)   AS employees,
  count(DISTINCT ou.id)  AS org_units,
  count(DISTINCT loc.id) AS locations,
  count(DISTINCT cc.id)  AS cost_centers
FROM tenants t
LEFT JOIN employees    e   ON e.tenant_id   = t.id
LEFT JOIN org_units    ou  ON ou.tenant_id  = t.id
LEFT JOIN locations    loc ON loc.tenant_id = t.id
LEFT JOIN cost_centers cc  ON cc.tenant_id  = t.id
GROUP BY t.code
ORDER BY employees DESC;
```

**Output 2026-05-02**:

| tenant    | employees | org_units | locations | cost_centers |
| --------- | --------- | --------- | --------- | ------------ |
| rtl-bank  | 158       | 32        | 15        | 13           |
| smartfood | 82        | 25        | 11        | 10           |
| econova   | 26        | 11        | 5         | 4            |
| heuresys  | 4         | 8         | 3         | 3            |

### 3.3 Lente PROCESS — top azioni audit

```sql
SELECT
  action,
  count(*) AS n,
  max(created_at) AS last_event
FROM audit_logs
GROUP BY action
ORDER BY n DESC
LIMIT 5;
```

**Output 2026-05-02**:

| action        | n   | last_event       |
| ------------- | --- | ---------------- |
| CREATE        | 73  | 2026-03-22 17:06 |
| UPDATE        | 54  | 2026-03-22 17:06 |
| EXPORT        | 34  | 2026-04-04 19:36 |
| CONFIG_CHANGE | 34  | 2026-04-21 02:27 |
| LOGOUT        | 33  | 2026-03-22 17:06 |

---

## 4. Cross-cutting PET — il modello centrale

### 4.1 47 mapping aree-prospettive

```sql
SELECT
  p.code AS perspective,
  count(*) FILTER (WHERE ap.relevance = 'PRIMARY')   AS primary_areas,
  count(*) FILTER (WHERE ap.relevance = 'SECONDARY') AS secondary_areas,
  count(*) AS total
FROM rbp_perspectives p
LEFT JOIN rbp_area_perspectives ap ON ap.perspective_code = p.code
GROUP BY p.code
ORDER BY p.code;
```

**Output**:

| perspective | primary_areas | secondary_areas | total |
| ----------- | ------------- | --------------- | ----- |
| ENTERPRISE  | 9             | 8               | 17    |
| PROCESS     | 5             | 7               | 12    |
| TALENT      | 11            | 7               | 18    |

### 4.2 Aree TALENT PRIMARY (la lista che smentisce "zavorra HR")

```sql
SELECT fa.code, fa.name
FROM rbp_area_perspectives ap
JOIN rbp_functional_areas fa ON fa.id = ap.functional_area_id
WHERE ap.perspective_code = 'TALENT' AND ap.relevance = 'PRIMARY'
ORDER BY fa.code;
```

**Output**: CAREER, COMPENSATION, CORE_HR, ENGAGEMENT, LEARNING, PERFORMANCE, RECRUITMENT, SELF_SERVICE, TALENT, TEAMS, WORKFORCE_INTELLIGENCE.

→ **Compensation, Engagement, Learning, Recruitment, Performance** sono tutti PRIMARY per Talent. Confermano che NON sono "zavorra HRMS classico", sono fonti dati core della lente Talent.

### 4.3 Aree ENTERPRISE PRIMARY

```sql
SELECT fa.code, fa.name FROM rbp_area_perspectives ap
JOIN rbp_functional_areas fa ON fa.id = ap.functional_area_id
WHERE ap.perspective_code = 'ENTERPRISE' AND ap.relevance = 'PRIMARY'
ORDER BY fa.code;
```

### 4.4 Aree PROCESS PRIMARY

```sql
SELECT fa.code, fa.name FROM rbp_area_perspectives ap
JOIN rbp_functional_areas fa ON fa.id = ap.functional_area_id
WHERE ap.perspective_code = 'PROCESS' AND ap.relevance = 'PRIMARY'
ORDER BY fa.code;
```

---

## 5. Login canonico — utenti pronti per test

```sql
SELECT u.username, u.role, t.code AS tenant
FROM users u
LEFT JOIN employees e ON e.id = u.employee_id
LEFT JOIN tenants t ON t.id = e.tenant_id
WHERE u.role IN ('SUPERUSER','TENANT_OWNER')
ORDER BY u.role, u.username;
```

**Utenti canonici disponibili**:

| username        | role         | tenant                 |
| --------------- | ------------ | ---------------------- |
| evo.dev         | SUPERUSER    | (no tenant — platform) |
| sysadmin        | SUPERUSER    | (no tenant — platform) |
| admin           | TENANT_OWNER | heuresys               |
| econova-admin   | TENANT_OWNER | econova                |
| rtl-admin       | TENANT_OWNER | rtl-bank               |
| smartfood-admin | TENANT_OWNER | smartfood              |

Password canonica: `Heuresys2026!` (vedi `reference_demo_credentials.md` in memory).

---

## 6. Esempi avanzati per app evo

### 6.1 Skill profile completo employee (TALENT view)

```sql
SELECT
  e.first_name || ' ' || e.last_name AS employee,
  t.code AS tenant,
  count(DISTINCT esa.id) AS skill_assessments,
  count(DISTINCT eo.id) AS occupation_links
FROM employees e
JOIN tenants t ON t.id = e.tenant_id
LEFT JOIN employee_skill_assessments esa ON esa.employee_id = e.id
LEFT JOIN employee_occupations eo ON eo.employee_id = e.id
GROUP BY e.id, e.first_name, e.last_name, t.code
HAVING count(DISTINCT esa.id) > 0
ORDER BY skill_assessments DESC
LIMIT 10;
```

### 6.2 ESCO career bridging (gap analysis)

```sql
-- Skills richiesti da target_occupation NON posseduti da employee
WITH employee_skills AS (
  SELECT skill_id FROM employee_skills WHERE employee_id = '<EMPLOYEE_UUID>'
),
target_skills AS (
  SELECT skill_id, relation_type
  FROM esco_occupation_skills
  WHERE occupation_id = '<TARGET_OCCUPATION_UUID>'
)
SELECT s.preferred_label_en, ts.relation_type
FROM target_skills ts
JOIN esco_skills s ON s.id = ts.skill_id
WHERE ts.skill_id NOT IN (SELECT skill_id FROM employee_skills)
ORDER BY ts.relation_type, s.preferred_label_en;
```

### 6.3 RLS isolation test (sicurezza multi-tenant)

```sql
-- Imposta tenant come econova-admin
SET row_security = on;
SELECT set_config('app.current_tenant_id', 'fb1e866c-e90a-4e25-a146-f68d660a0be8', false);
SET ROLE heuresys;

SELECT count(*) FROM employees;  -- deve dare 26 (econova)

-- Cambia tenant
SELECT set_config('app.current_tenant_id', '0c54b84a-db6e-4da4-bc91-af5d480d524e', false);
SELECT count(*) FROM employees;  -- deve dare 158 (rtl-bank)

RESET ROLE;
SET row_security = off;
```

### 6.4 Industry classification + ESCO crosswalk (Enterprise lens)

```sql
SELECT
  ic.code AS nace_code,
  ic.label_en AS industry,
  count(DISTINCT oic.occupation_id) AS linked_occupations
FROM industry_classifications ic
JOIN occupation_industry_classifications oic ON oic.industry_classification_id = ic.id
WHERE ic.level = 4
GROUP BY ic.code, ic.label_en
ORDER BY linked_occupations DESC
LIMIT 10;
```

---

## 7. Tabelle vuote (per memoria)

Solo `leave_requests` e `leave_balances` sono `0`. Da popolare quando si attiva il workflow leaves (Tier 1+ port di `talent/leaves` page e relativo POST endpoint).

---

## 8. Nota su accesso da Prisma Studio

Per esplorare via UI:

```bash
cd /home/ubuntu/heuresys-evo/services/app
DATABASE_URL='postgresql://heuresys:<password>@127.0.0.1:5432/heuresys_platform?schema=public' npx prisma studio
```

Prisma Studio mostra solo i 6 modelli definiti in `schema.prisma` (NextAuth + core). Per le altre 560 tabelle usare `psql` direttamente o introspect Prisma:

```bash
npx prisma db pull --schema=prisma/schema.prisma
```

(WARNING: questo OVERWRITE schema.prisma con tutte le 566 tabelle — fai prima backup).

---

## 9. Riferimenti

- `docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md` — strategia migrazione PET
- `docs/migration/dbms-bootstrap-strategy.md` — analisi schema completa
- `~/.claude/projects/.../memory/reference_demo_credentials.md` — credenziali canoniche
