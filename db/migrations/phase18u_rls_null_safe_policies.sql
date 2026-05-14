-- Phase 18u (S62 hotfix) — Rewrite 315 RLS policies to use null-safe current_tenant_id()
--
-- Context: S60 NOBYPASSRLS hardening (commit 0985a1a) revoked BYPASSRLS from the
-- `heuresys` Postgres role used by services/app + services/api-gateway. Once
-- BYPASSRLS was removed, RLS policies got actually evaluated on every query.
--
-- Bug: 315 RLS policies (293 unique tables) use the pattern
--     (current_setting('app.current_tenant_id'[::text][, true]))::uuid
-- in either USING or WITH CHECK clauses. This cast is unsafe:
--   - GUC never touched in session         → current_setting returns NULL    → NULL::uuid = NULL → policy = FALSE silently (no error, but also no rows)
--   - GUC touched then RESET/empty         → current_setting returns ''      → ''::uuid → ERROR 22P02 invalid input syntax for type uuid: ""
--   - GUC connection-pool residue post-tx  → similar empty string trigger    → ERROR 22P02
--
-- Repro confirmed S62 (2026-05-14): HR_DIRECTOR /dashboard load on dev locale fails with
-- `prisma.dashboard_elements.findMany ... invalid input syntax for type uuid: ""`.
-- In prod the bug is latent because connection pool tends to be exercised by
-- SUPERUSER sysadmin queries that always set_config(uuid). HR_DIRECTOR was
-- never tested end-to-end in prod with a fresh connection pool entry.
--
-- Fix: rewrite all unsafe patterns to use the existing null-safe function
-- `current_tenant_id()` (defined in DB, returns NULLIF(...,'')::uuid + EXCEPTION
-- WHEN OTHERS → NULL). Function already used by some policies (~24/315).
--
-- Idempotent: re-running this migration is a no-op (regexp_replace pattern
-- matches only the unsafe cast). Rollback: replace `current_tenant_id()` with
-- the explicit cast again — but DO NOT rollback unless BYPASSRLS is restored.
--
-- Verification post-apply: COUNT(*) of policies with unsafe pattern → 0.

BEGIN;

DO $$
DECLARE
  r RECORD;
  new_qual TEXT;
  new_check TEXT;
  rewritten INTEGER := 0;
BEGIN
  FOR r IN
    SELECT
      n.nspname,
      c.relname,
      p.polname,
      p.polcmd,
      pg_get_expr(p.polqual, p.polrelid) AS qual,
      pg_get_expr(p.polwithcheck, p.polrelid) AS withcheck
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE
      n.nspname = 'public'
      AND (
        pg_get_expr(p.polqual, p.polrelid) LIKE '%current_setting%app.current_tenant_id%'
        OR pg_get_expr(p.polwithcheck, p.polrelid) LIKE '%current_setting%app.current_tenant_id%'
      )
  LOOP
    -- Rewrite USING clause (polqual)
    new_qual := regexp_replace(
      COALESCE(r.qual, ''),
      '\(current_setting\(''app\.current_tenant_id''(::text)?(,\s*true)?\)\)::uuid',
      'current_tenant_id()',
      'g'
    );
    -- Rewrite WITH CHECK clause (polwithcheck)
    new_check := regexp_replace(
      COALESCE(r.withcheck, ''),
      '\(current_setting\(''app\.current_tenant_id''(::text)?(,\s*true)?\)\)::uuid',
      'current_tenant_id()',
      'g'
    );

    -- Only ALTER if something actually changed
    IF (new_qual <> COALESCE(r.qual, '') OR new_check <> COALESCE(r.withcheck, '')) THEN
      IF r.withcheck IS NOT NULL AND r.qual IS NOT NULL THEN
        EXECUTE format(
          'ALTER POLICY %I ON %I.%I USING (%s) WITH CHECK (%s)',
          r.polname, r.nspname, r.relname, new_qual, new_check
        );
      ELSIF r.qual IS NOT NULL THEN
        EXECUTE format(
          'ALTER POLICY %I ON %I.%I USING (%s)',
          r.polname, r.nspname, r.relname, new_qual
        );
      ELSIF r.withcheck IS NOT NULL THEN
        EXECUTE format(
          'ALTER POLICY %I ON %I.%I WITH CHECK (%s)',
          r.polname, r.nspname, r.relname, new_check
        );
      END IF;
      rewritten := rewritten + 1;
    END IF;
  END LOOP;
  RAISE NOTICE 'phase18u: rewrote % RLS policies to use current_tenant_id() function', rewritten;
END $$;

-- Verification: no residual UNSAFE patterns (direct cast `(current_setting(...))::uuid`
-- without NULLIF protection). Patterns wrapped in NULLIF(...,'') are already safe
-- and should NOT trigger the failure check.
DO $$
DECLARE v_residual INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_residual FROM pg_policy
  WHERE
    (pg_get_expr(polqual, polrelid) ~ '\(current_setting\(''app\.current_tenant_id''[^)]*\)\)::uuid'
     AND pg_get_expr(polqual, polrelid) !~ 'NULLIF\(current_setting\(''app\.current_tenant_id''')
    OR
    (pg_get_expr(polwithcheck, polrelid) ~ '\(current_setting\(''app\.current_tenant_id''[^)]*\)\)::uuid'
     AND pg_get_expr(polwithcheck, polrelid) !~ 'NULLIF\(current_setting\(''app\.current_tenant_id''');
  IF v_residual > 0 THEN
    RAISE EXCEPTION 'phase18u verification failed: % policies still have UNSAFE direct cast', v_residual;
  END IF;
  RAISE NOTICE 'phase18u: 0 residual UNSAFE direct-cast policies (target met)';
END $$;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18u_rls_null_safe_policies', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;
