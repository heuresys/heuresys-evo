# heuresys-evo — Current State

> Updated: 2026-05-09T20:55Z · S22 closed — L48-L53 shipped (theme/palette + canonical consistency + DBMS forensic audit)

## Last session brief (S22)

10 commit pushed (`11df303` L48 → `1b58191` docs sync). Theme/palette framework v1 portato in `/brand-studio` (L48-L49). DBMS canonical consistency alignment: `tenants.domain` SoT, `users.username = employees.email`, 5 orphan + 3 retired soft-deleted (L50-L51). `users.tenant_id` resta derivata (L52). Forensic DB audit baseline: 22 issues prioritizzati per S23 in `docs/_audit/2026-05-09-forensic-db-audit.md` (L53). 848/848 test verdi. Login canonical 8 verificato end-to-end.

## Top priorities (S23 — driven by L53 audit)

1. **`[CRITICAL]`** ADD COLUMN `tenant_id` + RLS a ~30 tabelle employee/payroll/whistleblowing senza tenant_id (~4-6 FTE-day · ref `docs/_audit/2026-05-09-forensic-db-audit.md` § 2.3)
2. **`[CRITICAL]`** Fix 13 RLS policies GUC typo `app.current_tenant` → `app.current_tenant_id` (~1 FTE-hour · ref audit § 2.4)
3. **`[HIGH]`** P4 audit gap: writes bypassano `auditedTransaction()` (6 logs in 30d, 4/5 NULL actor) (~1-2 FTE-day · ref audit § 8.4)

## Open questions

- Strategia tenant_id backfill ~30 tabelle: migration unica monolitica o batch per dominio (compensation/career/recruiting/learning/whistleblowing)?
- Audit logs sparse: feature flag temporaneo dev o `auditedTransaction()` mancante systematicamente?

## Stack snapshot (changed in S22)

- DBMS: 264 active employees · 265 active users (1 platform sysadmin) · 4 tenants con `domain` populated · 18 dashboard_presets · 115 elements · 16 role_default_dashboards · 8 canonical demo users
- NEW `services/app/src/{styles,lib,app/brand-studio}/theme-framework/` (production framework runtime)
- NEW `tests/parse-test-env.mjs` (DRY parser SoT-bridge)
- NEW `db/seeds/phase15h_*.sql` + `phase15i_canonical_consistency_alignment.sql` (applied bare-metal)
- NEW `docs/_audit/2026-05-09-forensic-db-audit.md` (audit baseline)
- UPDATED globale: CLAUDE.md (S22 close section + S23 priorities) · BRAND-STATE.md (Phase 15.E) · DECISIONS-LOG.md (L48-L53)

## Verification

```bash
git log --oneline -3      # 1b58191 docs sync · c5150c4 audit · 074fe7d purge
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"
cd services/app && npx tsc --noEmit && npm test --silent  # 214/214
```

Riferimenti chiave: `docs/_audit/2026-05-09-forensic-db-audit.md` · `.ux-design/DECISIONS-LOG.md` § L48-L53 · `tests/.test-env` SoT
