# heuresys-evo — Current State

> Updated: 2026-05-13T19:00Z · S60 closed · **ZERO CARRY-FORWARD** · HEAD `594349f`

## Last session brief

S58→S59→S60 cumulative: constraint P11 NO-MOCK codificato (sopraordinato P1-P10), G6 dashboard engine 100% live cross-tenant verified, P1 leak fix, RLS hardening (heuresys NOBYPASSRLS), schema extension (REV/FTE + EQUITY + TOTAL TC), legacy view cleanup, full doc sync (ADR-0031 + sprint-history + security-baseline + L85+L86+L87).

## Top priorities (next session)

Nessuna priorità urgente. Possibili direzioni:

1. **Backup OCI bucket schedule** — automate `pg_dump heuresys_platform` upload settimanale (~2h, vedi ADR-0004)
2. **Bundle perf audit `/login` LCP 12.5s** carry-forward S53 (12-20h bundle analyzer + code splitting)
3. **Brand v1.0 promotion** carry-forward (~16-25h, ref `.ux-design/08-promotion/v1.0-checklist.md`)

## Open questions

Nessuna.

## Stack snapshot delta (S58-S60)

- **DBMS**: 314+ tabelle (2 new: tenant_revenue_periods, equity_grants) · 370+ RLS policies attive · heuresys user **NOBYPASSRLS**
- **Migration shipped**: phase18p/q/r/s/t/u/v (7 DDL)
- **G6 preset _v2**: 7/7 al 100% live (zero hardcoded fixture)
- **Commits S58-S60**: 16 totali (`e5cd4df` → `594349f`)
- **ADR**: 0031 (P11 + RLS hardening) — accepted-implemented

## Verifica

```bash
# G6 preset live (no static)
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT dp.code, COUNT(*) FILTER (WHERE de.config_overrides->'\''data_source'\''->>'\''type'\'' = '\''sql'\'') AS sql_n FROM dashboard_elements de JOIN dashboard_presets dp ON dp.id=de.dashboard_preset_id WHERE dp.code LIKE '\''%_v2'\'' GROUP BY dp.code;"'

# Cross-tenant variance
ssh oracle-vm-default 'node scripts/perf/test-tenant-owner-v2-variance.mjs'

# Production health
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://evo.heuresys.com/login

# Typecheck
cd services/app && npx tsc --noEmit
```

## References

- `docs/_meta/sprint-history.md` § S58 → S60 close
- `docs/50-reference/decisions/0031-p11-no-mock-rls-hardening.md` — ADR
- `.ux-design/DECISIONS-LOG.md` L85+L86+L87
