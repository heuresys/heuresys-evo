# ADR-0023 — Promote bare-metal `heuresys_platform` to SoT

- Status: accepted
- Date: 2026-05-07
- Supersedes: —
- Phase: 14 (post Sprint 1+2.E+2.F+3.C+3.G(foundation) shipped)

## Context

Fino a 2026-05-07 il repository evo aveva due database `heuresys_platform`:

- **Docker legacy** (`heuresys_evo_platform_db` container, postgres 16.11 pgvector, sulla VM oracle-vm-default 127.0.0.1:5433): popolato dai seed legacy + import storico, usato dall'app legacy heuresys.com.evo. Conteneva 477k+ righe reali distribuite su 506 tabelle popolate.
- **Bare-metal** (postgres 16.13 systemd, sulla VM 5432): popolato iterativamente dai seed evo (smart_seed_rtl_bank, prototype_banking, governance_data, phase13/14a/b) + dashboard schema additive (phase13_dashboard_engine, phase14a/b/c). 568 tabelle totali, ~158+82+26+4 employees in 4 tenant.

Problemi identificati durante test di Phase 14:

1. **Dati bare-metal incompleti**: solo employees (270 totali), poche performance review, nessun succession plan, employee_skills sparsi. La maggior parte dei "live SQL" widget cadeva sul demo fallback hardcoded.
2. **Posture ambigua**: docker e bare-metal coesistevano, source-of-truth non chiara, rischio drift.
3. **Cosa l'app evo doveva mostrare**: dashboard live alimentate da dati reali per validare il modello brand `mu-architect-legacy`. L'evo usava bare-metal come connessione default, ma il dato era spurio.

L'utente ha richiesto: "voglio i dati reali che ci sono nel DBMS docker trasportati in bare metal e tutti verificati. Task fondamentale e su cui non voglio più ritornare."

## Decision

**Migrare bit-by-bit i dati dal docker legacy al bare-metal evo, certificare con verifica forense granulare, promuovere il bare-metal a unica Source of Truth (SoT).**

Approccio:

1. Pre-migration backup bare-metal (safety net)
2. `pg_dump` plain SQL del docker (formato custom incompatibile con minor version diff)
3. Drop + recreate bare-metal `heuresys_platform`
4. Pre-install extensions (vector, ltree, pg_trgm, pgcrypto, uuid-ossp) come postgres superuser
5. Strip `\restrict`/`\unrestrict` directives (psql 16.13 vs dump 16.11)
6. Restore as postgres superuser (heuresys non ha privilegi CREATE EXTENSION)
7. `GRANT ALL ON ALL TABLES TO heuresys` + ALTER DEFAULT PRIVILEGES
8. Fix 2 IVFFLAT indexes con `SET maintenance_work_mem = '256MB'`
9. Re-apply additive evo-specific (dashboard schema + canonical users + composite SQL bindings)
10. Forensic verification: count diff per tabella + MD5 hash + schema DDL diff

## Rationale

Tre opzioni considerate:

| Opzione                                                           | Pro                                           | Con                                                                        |
| ----------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| **A** Selective table-by-table COPY (preserva schema bare-metal)  | Granulare, no schema drop                     | Schema potrebbe divergere, rischi N×M conflict                             |
| **B** Drop + restore full from docker (con re-apply additive evo) | Schema 100% match docker, forensic verifiable | Devo gestire le additive evo manualmente post-restore                      |
| **C** Mantenere docker come SoT operativo, sviluppare app legacy  | Evita migration                               | Direzione progetto è greenfield rewrite, sviluppare in legacy non ha senso |

**Opzione B scelta** — è quella che produce un risultato verificabile bit-by-bit (forensic identity) e preserva la posture greenfield rewrite di evo. Le additive evo-specific sono ben isolate (4 tabelle: dashboard_presets, dashboard_elements, tenant_schema_version, canonical_demo_users) e ben modeled in migration files committed. Re-applicarle è deterministic.

## Consequences

### Positive

- **Forensic certified SoT**: 506/506 tabelle popolate, 477774 rows, schema DDL diff 0, MD5 17/18 bit-identical (1 MV con count match + ordering diff post-REFRESH, atteso)
- **Primo backup baseline restorable**: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` (sha256 `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a`)
- **Posture chiara**: "DBMS" ≡ "DBMS bare-metal" ≡ "SoT" — non serve più qualificare
- **Composite SQL coverage 30/30**: zero widget con `data_source.type = null`, niente più demo fallback "Stefania Bianchi" hardcoded — la SuccessionCard ora pull live da `employees ORDER BY performance_rating` mostrando employee REALI come Gabriele Amato

### Negative / debt

- **Docker legacy resta running** sulla VM ma NON è più riferimento per evo development. Da decidere quando spegnerlo definitivamente (probably post Phase 15+).
- **Backup chain non ancora automatizzato**: il primo backup è stato manuale; la cron + restore drill saranno fresh session backup-track (parallel a Phase 14.SH).
- **Composite widgets static-via-SELECT**: phase14c+d hanno bound 8 widget composite a SQL ma con SELECT statiche preserving shape (non semantic real aggregation). FASE 3.6 di Phase 14.SH risolverà replace.
- **Postgres minor version diff** (16.11 docker vs 16.13 bare-metal) gestita lato dump (plain SQL + sed `\restrict` directives). Future docker upgrade si allineerà.

## Verification

```bash
# Forensic count + schema diff (immutato)
ssh oracle-vm-default "bash /tmp/forensic-verify.sh"
# Output atteso:
#   tables match 506/506
#   total rows 477774/477774
#   schema-DDL diff: 0 lines

# MD5 bit-by-bit per top-18 popolate (immutato)
ssh oracle-vm-default "bash /tmp/md5-verify.sh"
# Output atteso: 17/18 ✓ + 1 mv_occupation_similarity count match (hash diff per ordering only)

# Backup restorable
ssh oracle-vm-default "ls -la /var/backups/heuresys-evo/"
# Output atteso: heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump + .sha256
ssh oracle-vm-default "sha256sum -c /var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump.sha256"
# Output atteso: OK

# Restore listing OK
ssh oracle-vm-default "sudo -u postgres pg_restore -l /var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump | head -5"
# Output atteso: 7880 TOC entries listed

# Live data sanity
sudo -u postgres psql -d heuresys_platform -c "SELECT count(*) FROM employees"
# Output: 270 (tenant breakdown: rtl-bank 158 + smartfood 82 + econova 26 + heuresys 4)

# Vitest + Playwright invariati
npm test --workspace=services/app -- --run                    # 153/153
npx playwright test --project=chromium --workers=2            # 100/100 RBP matrix
```

## Open follow-up

- ADR-0024 Phase 14.SH plan (brand-driven role-based shell) referenced for next sprint
- Backup chain automation in `docs/40-operations/dbms-backup-restore.md`
- Composite real aggregations in FASE 3.6 phase14e migration
- Eventual docker legacy decommissioning post Phase 14.SH closure

## References

- Migration assets: `db/migrations/phase14c_dashboard_composite_sql_binding.sql` + `db/migrations/phase14d_dashboard_full_binding_coverage.sql`
- Apply canonical users: `scripts/db/apply-canonical-users.mjs`
- Migration log: `oracle-vm-default:/tmp/migration-2026-05-07/restore.log`
- STATE.md (current state at promotion): `.handoff/STATE.md`
- ADR-0020 Tenant Ontology Versioning (related)
- ADR-0022 OpenAI advisor integration (related)
