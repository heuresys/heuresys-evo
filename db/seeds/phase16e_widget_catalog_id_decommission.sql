-- Phase 16.E · L54 · S24 — widget_catalog_id FK decommission
--
-- Closes audit issue #5 (HIGH): dashboard_elements.widget_catalog_id è
-- NULL su 100% dei 115 elementi. Backfill IMPOSSIBILE perché widget_code
-- (17 distinct) usa una naming convention diversa da widget_catalog.code
-- (0/17 match verificato).
--
-- Strategy: drop FK constraint, mantieni colonna Int? unconstrained.
-- Mantieni colonna per backward compat con test fixtures + DashboardElement
-- type interface (services/app/src/lib/dashboard-engine/resolver.ts:41).
-- I 115 row mantengono widget_catalog_id NULL (semantically: "use
-- widget_code as renderer key").
--
-- Idempotente.

\set ON_ERROR_STOP on
BEGIN;

-- ============================================================
-- 1) Drop FK constraint
-- ============================================================
ALTER TABLE dashboard_elements
  DROP CONSTRAINT IF EXISTS dashboard_elements_widget_catalog_id_fkey;

-- ============================================================
-- 2) Verification
-- ============================================================
DO $$
DECLARE
  fk_remaining int;
  col_present int;
  null_count int;
BEGIN
  -- Assert: FK rimosso
  SELECT count(*) INTO fk_remaining
  FROM pg_constraint
  WHERE conrelid = 'dashboard_elements'::regclass
    AND contype = 'f'
    AND conname = 'dashboard_elements_widget_catalog_id_fkey';
  IF fk_remaining <> 0 THEN
    RAISE EXCEPTION 'phase16e assert FAIL: FK still present';
  END IF;

  -- Assert: colonna ancora presente (backward compat)
  SELECT count(*) INTO col_present
  FROM information_schema.columns
  WHERE table_name = 'dashboard_elements' AND column_name = 'widget_catalog_id';
  IF col_present <> 1 THEN
    RAISE EXCEPTION 'phase16e assert FAIL: column widget_catalog_id missing (expected to remain)';
  END IF;

  -- Assert: rows invariati
  SELECT count(*) INTO null_count
  FROM dashboard_elements WHERE widget_catalog_id IS NULL;
  RAISE NOTICE 'phase16e OK: FK dropped · column retained · % rows with widget_catalog_id NULL', null_count;
END $$;

COMMIT;
