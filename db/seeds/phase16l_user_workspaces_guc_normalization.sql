-- Phase 16.L · S24 · L58 — GUC drift workspaces normalization (Opzione A: single-GUC)
-- =============================================================================
-- BEFORE: user_workspaces + workspace_widgets RLS policies referenced 3 distinct
--         GUCs (app.user_id, app.role, app.tenant_id) that withTenant() never
--         sets. current_setting() returns NULL → comparisons fail-closed →
--         RLS silently denies all rows on these 2 tables.
--
-- AFTER:  Both policies normalized to read app.current_tenant_id (the only GUC
--         the app sets, via withTenant()). Aligns with the other 290 policies.
--
-- Trade-off accepted: granular per-user / per-role enforcement moves to the
-- application layer (already enforced via $queryRawUnsafe parametric filters in
-- services/api-gateway/src/routes/workspace.ts). Defense-in-depth preserved.
--
-- Refs:
--   - docs/_audit/2026-05-09-forensic-db-audit.md § 2.5 (GUC drift workspaces)
--   - .ux-design/DECISIONS-LOG.md L58 (S24 final closure)
--   - ADR roadmap S24
-- =============================================================================

BEGIN;

-- 1. user_workspaces ----------------------------------------------------------

DROP POLICY IF EXISTS user_workspaces_isolation ON public.user_workspaces;

CREATE POLICY user_workspaces_isolation ON public.user_workspaces
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 2. workspace_widgets (subquery on parent table) -----------------------------

DROP POLICY IF EXISTS workspace_widgets_isolation ON public.workspace_widgets;

CREATE POLICY workspace_widgets_isolation ON public.workspace_widgets
  USING (
    workspace_id IN (
      SELECT id FROM public.user_workspaces
      WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.user_workspaces
      WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    )
  );

-- 3. Post-apply assertion -----------------------------------------------------

DO $$
DECLARE
  v_count INT;
  v_old_guc INT;
BEGIN
  -- Expected: 2 isolation policies on these 2 tables
  SELECT COUNT(*) INTO v_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('user_workspaces', 'workspace_widgets')
    AND policyname LIKE '%_isolation';
  IF v_count != 2 THEN
    RAISE EXCEPTION 'phase16l: expected 2 isolation policies on workspaces, got %', v_count;
  END IF;

  -- Expected: 0 policies still referencing the legacy GUC names on these tables
  SELECT COUNT(*) INTO v_old_guc
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('user_workspaces', 'workspace_widgets')
    AND (qual ~ 'app\.user_id' OR qual ~ 'app\.role' OR qual ~ 'app\.tenant_id\s*''');
  IF v_old_guc != 0 THEN
    RAISE EXCEPTION 'phase16l: % policies still reference legacy GUCs', v_old_guc;
  END IF;

  RAISE NOTICE 'phase16l: 2 policies normalized, 0 legacy GUC references remain.';
END $$;

COMMIT;
