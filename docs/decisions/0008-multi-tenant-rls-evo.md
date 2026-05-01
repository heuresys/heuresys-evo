# ADR-0008: Multi-tenant RLS pattern (Prisma + Postgres SET app.current_tenant_id)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B6
**Related**: ADR-0010 (RLS coverage strategy, scritto in B2.5)

## Context

L'evo eredita dal legacy `.com.evo` un design multi-tenant con Postgres Row-Level Security (RLS). Il pattern legacy: ogni tabella tenant-aware ha una policy RLS che filtra `WHERE tenant_id = current_setting('app.current_tenant_id')::uuid`. La sessione applicativa imposta `SET app.current_tenant_id = '<uuid>'` all'inizio di ogni transazione, e il database forza il filtro automaticamente.

Forces nel greenfield:

- **Defense in depth**: filtraggio in DB è autoritativo. Anche se il livello applicativo dimentica un `WHERE tenant_id = ?`, il DB blocca la query.
- **Prisma compat**: Prisma usa connection pooling, e ogni query può essere su una connessione diversa. Il `SET` deve avvenire all'inizio di ogni connessione checkout, non globalmente.
- **JWT-derived tenant**: il `tenantId` arriva dal JWT (vedi ADR-0007). Va estratto in middleware e applicato come `SET` prima della query.
- **Service principal vs user principal**: alcune query system (es. seed, migrations) devono bypassare RLS. Postgres role `BYPASSRLS` è la via canonica.

## Decision

**Pattern RLS-per-transaction con Prisma extension hook**:

1. **Schema convention**: ogni tabella tenant-aware ha colonna `tenant_id UUID NOT NULL` + policy `USING (tenant_id = current_setting('app.current_tenant_id')::uuid)` + `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY` (per evitare bypass implicito da owner).
2. **App principal**: Prisma client extension che esegue `SET app.current_tenant_id = $1` come prima statement di ogni transazione. Tenant id estratto dal JWT in middleware Express (api-gateway) o nel server component (app). Mai usare client app come bypass.
3. **System principal**: ruolo Postgres `heuresys_app_admin` con `BYPASSRLS` riservato per:
   - Migration runs (`db/scripts/migrate.sh`)
   - Seed scripts
   - Backup/restore
   - Diagnostic queries (con autorizzazione esplicita)

   App di runtime usa `heuresys_app_user` (no BYPASSRLS).

4. **Validation gate**: `db/scripts/rls-coverage.sql` (sarà aggiunto in B2.3) enumera tutte le tabelle tenant-aware e verifica:
   - `tenant_id` colonna presente
   - RLS abilitato
   - FORCE RLS attivo (no owner bypass)
   - Policy presente con check su `current_setting('app.current_tenant_id')`

## Alternatives considered

- **Filtraggio solo applicativo (no RLS)**: rejected — perde defense-in-depth. Un bug in una WHERE clause espone dati cross-tenant.
- **Schema-per-tenant**: rejected per la scala target (10-100 tenant). Ogni schema duplica DDL, migrations diventano N×, e cross-tenant analytics richiedono UNION ALL su N schema.
- **Connection-per-tenant pooling**: rejected — rompe il connection pool e non scala oltre un piccolo numero di tenant.
- **Postgres SET ROLE per ogni request**: rejected — `SET ROLE` non è transaction-scoped come `SET app.*` setting; più complesso da contenere.

## Consequences

Positive:

- Defense-in-depth garantita: anche un bug applicativo non causa cross-tenant leak.
- Pattern collaudato sul legacy (303 tabelle RLS-protected).
- Compatibile con Prisma + connection pool.

Negative:

- Performance overhead: `SET app.current_tenant_id` per transazione (~0.05ms — trascurabile).
- Test setup richiede injection di tenant_id nei fixture; semplificabile via helper.
- Migration files devono usare il role `BYPASSRLS` (`heuresys_app_admin`), non quello applicativo.
- Le query Prisma dirette (script ad-hoc, REPL) devono ricordarsi di settare il tenant — se non lo fanno e usano il role applicativo, vedono 0 righe (failsafe corretto, ma sorprendente in fase debug).

## Migration path da legacy

Il legacy ha già 303 tabelle con FORCE RLS attivo (vedi `AUDIT_FORENSIC_20260420.md` legacy). Quando la Phase 4 RTG porterà i modelli da legacy a evo (out of scope Cantiere B), le policy verranno copiate 1:1 via `db pull → prune → generate`.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §11 Phase B6
- ADR-0010 RLS coverage strategy (in arrivo Phase B2.5)
- Postgres docs: Row Security Policies — https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Prisma extension client: https://www.prisma.io/docs/orm/prisma-client/client-extensions
