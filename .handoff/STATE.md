# heuresys-evo — Current State

> Updated: 2026-05-10T01:25Z · S23-quater closed — L54+L55+L56+L57 forensic audit FINAL closure 77%

## Last session brief (S23 + S23-bis + S23-tris + S23-quater)

4 commit consecutivi su forensic DB audit L53. **17/22 issues CLOSED (77%)**, 1 partial (#3 P4 sweep), 3 deliberate out-of-scope architectural, 1 audit miscount confirmed. Total session ~17h focus.

- **S23** (`929aa1e`): phase16a/b/c migrations + auditedTransaction helper
- **S23-bis** (`05e603b`): 3 deferred (#5 widget_catalog · #7 rbac_role · #6 P3 miscount)
- **S23-tris** (`8129451`): batch 24 tables tenant_id+RLS via phase16f/g + drop broken triggers + $queryRawUnsafe parametrize
- **S23-quater** (this commit): residual sweep — orphan cleanup phase16i/j + bcrypt rotation + enrichment consent + mat views helper + lint rule

## Top priorities (S24 — driven by L57 carry-forward, ~3-5 FTE-day)

1. **`[HIGH]`** #3 P4 sweep extended: applicare `auditedTransaction()` ai write paths Prisma rimanenti + mirror helper in `services/api-gateway/src/lib/audit/`. ~1-2 FTE-day.
2. **`[MEDIUM]`** § 2.5 GUC drift `user_workspaces`/`workspace_widgets` refactor multi-clausola RLS. ~1-2 FTE-day.
3. **`[MEDIUM]`** § 1.5 310 FK senza ON DELETE explicit: review puntuale per ogni FK. ~1 FTE-day.

## Open questions

- pg_cron extension setup (audit § 1.8): preferenza `apt-get install postgresql-16-cron` su VM o fallback systemd timer chiamando `psql -c "SELECT public.refresh_all_mat_views()"` via cron classico? Helper già ready.
- P4 sweep: applicare `auditedTransaction()` come hard-fail (throw on missing actor) o soft-fail con structured logging per write paths legacy? Helper già supporta entrambi via `auditEvent()` fallback.
- §2.5 GUC drift workspaces: refactor RLS multi-clausola può rompere `/me/workspace` feature corrente. Pre-flight: quante ore di QA Playwright sono necessarie?

## Stack snapshot (changed in S23+S23-bis+S23-tris+S23-quater)

- DBMS: 312 tabelle tenant_id NOT NULL (era 291) · 104 Platform-default · 367 RLS policies (era 330) · 0 GUC typo · 0 broken triggers · FK fk_users_role + 8 canonical rbac_role enum · widget_catalog FK dropped · refresh_all_mat_views() function ready
- 35 tabelle precedentemente unprotected ora hanno tenant_id+RLS (combo S23 pilot + S23-tris batch + S23-quater residue + Platform-default)
- 11 SQL migrations bare-metal: phase16a-k
- Code: services/app/src/lib/audit/auditedTransaction.ts (P4 helper) + 2 brand-studio actions instrumented · services/app/src/lib/authorize.ts (bcrypt rotation rehash) · services/enrichment (consent enforcement) · scripts/hardening/lint-tenant-id.sh + npm aliases · withTenant() set_config() parametrized
- Prisma schema sync: rbac_role 8 canonical + widget_catalog @relation removed (services/{app,api-gateway}/prisma/)
- Tests: 683 verdi vitest core (219 app + 457 api-gateway + 7 enrichment) + 95 ui + 82 shared = 860 totali · login canonical 8/8 PASS
- Docs: CLAUDE.md S23-quater · DECISIONS-LOG L54+L55+L56+L57 · audit md S23-tris closures · db/README.md SAP+migrations advisory

## Verification

```bash
git log --oneline -5
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"
  SELECT 'tenant_protected=' || count(*) FROM information_schema.columns WHERE column_name='tenant_id' AND is_nullable='NO';  -- expected 312
  SELECT 'rls_policies=' || count(*) FROM pg_policies WHERE schemaname='public';  -- expected 367
  SELECT 'mat_views_helper=' || count(*) FROM pg_proc WHERE proname='refresh_all_mat_views';  -- expected 1
\""
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"
cd D:/evo.heuresys.com && npm run lint:tenant-id  # Expected: exit 0
cd services/app && npx tsc --noEmit && npm test --silent
cd D:/evo.heuresys.com && npm test --workspace=services/api-gateway --silent
cd D:/evo.heuresys.com && npm test --workspace=services/enrichment --silent
```

Riferimenti chiave: `docs/_audit/2026-05-09-forensic-db-audit.md` § "S23-tris additional closures" · `.ux-design/DECISIONS-LOG.md` § L54+L55+L56+L57 · `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
