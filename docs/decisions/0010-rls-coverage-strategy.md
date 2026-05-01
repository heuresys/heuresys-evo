# ADR-0010: RLS coverage strategy + targets

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B2

## Context

ADR-0008 stabilisce il pattern RLS multi-tenant. Serve un meccanismo di **coverage measurement** che risponda automaticamente alla domanda «ogni tabella tenant-aware ha RLS + FORCE + policy corretta?».

Senza tale gate, è facile aggiungere una nuova migration che dimentica `ENABLE ROW LEVEL SECURITY` o crea una policy senza `FORCE` (consentendo al role owner di bypassare). Il legacy ha pagato questo errore in passato con audit forense ad-hoc.

## Decision

**RLS coverage script** automatizzato in `db/scripts/rls-coverage.sql` (creato in B2.3):

1. **Tabelle in scope**: tutte quelle con colonna `tenant_id UUID`. Esclusioni esplicite via lista whitelist (es. tabelle reference cross-tenant come `industry_classifications`).
2. **Check RLS + FORCE**: query a `pg_class.relrowsecurity = true` E `pg_class.relforcerowsecurity = true` per tabella in scope.
3. **Check policy presence**: query a `pg_policies` per ogni tabella; deve esistere almeno una policy con check su `current_setting('app.current_tenant_id')`.
4. **Output**: tabella con colonne `table_name`, `has_tenant_id`, `rls_enabled`, `force_rls`, `policy_count`, `pass`.

**Targets**:

- **B2 closure (post-B2.3)**: script funzionante; baseline coverage misurato.
- **B12 closure**: pass rate ≥ 100% per le tabelle che il greenfield evo ha effettivamente create. Tabelle ancora non importate da legacy (vedi Phase 4 RTG legacy) sono out-of-scope finché non vengono porting-ate.
- **Long-term**: integrare nel CI come pre-merge gate (B10).

**Pass criteria per tabella**:

- `has_tenant_id` = true → check applicabile
- `rls_enabled` = true
- `force_rls` = true
- `policy_count` ≥ 1
- Almeno una policy con `qual ILIKE '%current_setting%app.current_tenant_id%'`

## Alternatives considered

- **Manual audit trimestrale**: rejected — il pattern legacy è stato audit-driven e ha accumulato debt. Automation è la sola via sostenibile.
- **Test integrazione che simula query cross-tenant**: utile come complemento (B3) ma non sostitutivo — il check schema-level è più rapido e meno fragile.
- **Linter custom su schema.prisma**: rejected — Prisma `@@map` e RLS comments `///` non sono autoritativi; la fonte di verità è il DB live.

## Consequences

Positive:

- Visibilità immediata su gap RLS coverage (`db/scripts/rls-coverage.sql` runnable on demand).
- Predica baseline misurabile per la closure B12.
- Zero cost runtime (script ad-hoc, non hot path).

Negative:

- Lo script richiede una connessione live al DB target. Non è eseguibile in pure-static analysis.
- Whitelist tabelle reference cross-tenant deve essere mantenuta manualmente; rischio di drift mitigato da review code-review obbligatoria per ogni edit della whitelist.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §7 Phase B2
- ADR-0008 RLS pattern
- Postgres docs: pg_policies system view
