# Cutover Strategy — Heuresys Evo

**Status**: Active (2026-05-02)
**Scope**: transizione legacy `heuresys.com.evo` → evo `heuresys-evo`. Non si applica a green-field tenant nuovi (vanno direttamente a evo).
**Audience**: tech lead, ops, owner aree funzionali.

## Cambio paradigma rispetto al legacy plan

Il piano cutover originale (legacy `docs/90-archive/cutover-event-paradigm/`) prevedeva un **cutover-event globale**: data X, traffico tutto su evo, legacy congelato. Per l'evo si **scarta** quel modello a favore di **phased per area funzionale**, perché:

- 33 aree funzionali con accoppiamento variabile: portarne tutte in un colpo è rischio sistemico.
- DBMS condiviso (stesso PostgreSQL): legacy ed evo coesistono sullo stesso schema, eliminando il problema "data sync".
- RBP + 47 PET mapping permettono deploy granulare per `area_code`.
- Rollback area-by-area è sostenibile; rollback globale è una crisi.

## Pattern: dual-write + traffic shadowing per area Tier 1

Tier list definita in `docs/10-strategy/migration-strategy-pet-driven.md`. Ogni area Tier 1 (alto valore + basso rischio) attraversa 4 step:

| Step | Stato        | Write path   | Read path                                 | Validation                                    |
| ---- | ------------ | ------------ | ----------------------------------------- | --------------------------------------------- |
| 0    | Baseline     | legacy       | legacy                                    | n/a                                           |
| 1    | Dual-write   | legacy + evo | legacy                                    | diff async report                             |
| 2    | Shadow read  | legacy + evo | legacy (primary) + evo (shadow, scartato) | 99.5% parity richiesta per ≥7gg               |
| 3    | Cutover read | legacy + evo | evo                                       | legacy in standby, monitoring                 |
| 4    | Decommission | evo          | evo                                       | endpoint legacy spento dopo 30gg di stabilità |

## Esempio: area `employees/`

### Step 1 — Dual-write (settimana 1-2)

API gateway evo `/api/v1/employees` riceve la write, scrive su `public.employees` (schema condiviso) e in parallelo emette evento Kafka/BullMQ `employee.dual_write_validated`. Il legacy continua a ricevere writes via il suo `/api/employees` non modificato. Confronto async via job che legge ultimi 1000 record da entrambi i path e produce diff report (chi scrive cosa, latency, errori).

```typescript
// services/api-gateway/src/employees/employees.controller.ts
@Post()
@RequirePermission('EMPLOYEES', 'CREATE')
async create(@Body() dto: CreateEmployeeDto, @CurrentTenant() tenantId: string) {
  const created = await this.employeesService.create(dto, tenantId);
  await this.eventBus.emit('employee.dual_write_validated', {
    id: created.id, source: 'evo', tenant_id: tenantId, dto,
  });
  return created;
}
```

### Step 2 — Shadow read (settimana 3)

Frontend continua a leggere da legacy. Reverse proxy (Caddy/Nginx) duplica le GET requests al gateway evo (tee). Risposta evo scartata, ma comparata async con legacy via `correlation_id`. Metriche:

- `evo_response_match_rate` (target ≥99.5%)
- `evo_latency_p95_ms` (target ≤ legacy_p95 × 1.2)
- `evo_5xx_rate` (target ≤0.1%)

Trigger blocco cutover se metriche non rispettate per 7gg consecutivi.

### Step 3 — Cutover read (settimana 4)

Reverse proxy switcha read: GET `/employees` → evo gateway. Legacy resta in dual-write (writes ancora vanno a entrambi) per 7gg di stabilità in produzione. Frontend non sa nulla del cambio (URL invariato).

### Step 4 — Decommission (settimana 5+)

Dopo 7gg di stabilità + 30gg senza incidenti:

1. Frontend e mobile aggiornati a chiamare direttamente evo (rimuove dipendenza reverse proxy per area).
2. Endpoint legacy `/api/employees/*` ritorna 410 Gone con header `X-Migrated-To: /api/v1/employees`.
3. Codice legacy area employees taggato `@deprecated`, rimosso dopo audit zero-callers (logs).

## Read-after-write consistency durante phased

Problema: durante step 2-3, una POST scrive su entrambi i sistemi ma il GET successivo va all'uno o all'altro. Soluzione:

- **Step 1-2**: GET sempre legacy → consistency garantita (legacy è SoT).
- **Step 3**: GET evo. Per il request immediatamente successivo a una write con stesso `correlation_id`, gateway evo verifica che `created_at >= request.start_time - 100ms` su evo; se non trovato, fallback a legacy con header `X-Fallback-Source: legacy-rad`. Metric `rad_fallback_count` monitorata.

## Rollback area-by-area

Mai global revert. Per area in step N:

- Step 1 → 0: disattivare dual-write evo (feature flag `EVO_DUAL_WRITE_<AREA>=false`). Nessun dato perso (legacy ha tutto).
- Step 2 → 1: disattivare shadow read (rimuovere tee proxy rule). Nessun impatto utente.
- Step 3 → 2: switch reverse proxy back a legacy read. Verificare che dual-write sia ancora attivo (deve esserlo). Impatto: 1-5 min downtime breve (proxy reload).
- Step 4 → 3: ripristinare endpoint legacy (revert tag deprecated, redeploy legacy se decommissionato). Caso peggiore: 1-3h se richiede redeploy.

Ogni rollback richiede `incident_report.md` + RCA in `docs/90-archive/cutover-event-paradigm/incidents/`.

## Edge cases

- **Aree con write multi-tabella**: `tenant_onboarding` tocca 12 tabelle in transazione. Dual-write deve ricreare l'intera tx evo: gestito da service `OnboardingMigrationBridge` che incapsula la logica.
- **Aree con job async**: `enrichment` worker scrive in tabelle ESCO/KG. Dual-write non applicabile (job idempotenti). Strategia: feature flag per worker (legacy vs evo) con switch atomico.
- **Schema drift**: durante phased entrambi i sistemi mutano lo schema condiviso. **Vincolo**: solo migrations additive (mai DROP COLUMN, mai RENAME) durante step 1-3. Schema cleanup post-decommission.
- **Cache desync**: il legacy ha cache Redis dedicata; evo ha la sua. Dual-write deve invalidare entrambe (se differenti namespace) o condividere prefix.

## Riferimenti

- `docs/10-strategy/migration-strategy-pet-driven.md` — Tier list aree + criteri ranking
- `docs/_meta/migration-doc-audit.md` — audit doc legacy
- `api-versioning-strategy.md` — proxy `/api/v1` evo → legacy per aree non ancora portate
