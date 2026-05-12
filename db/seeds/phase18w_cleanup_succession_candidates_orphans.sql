-- ============================================================================
-- phase18w — Cleanup orphan succession_candidates.critical_role_id (CF#4 L75)
-- ============================================================================
-- Discovery in S54 W#3 (L73): 86 succession_candidates rows globally hanno
-- `critical_role_id` puntante a succession_plans inesistenti (orphan FK).
-- Distribuzione: 100% in singolo tenant (RTL Bank) seed CASCADIA-era.
--
-- Cause: nessuna FOREIGN KEY constraint definita su critical_role_id quindi
-- nessun enforcement DB-level. Seed test data ha referenced UUID non più
-- presenti dopo cleanup precedenti.
--
-- Fix:
--   STEP 1: nullificare i 86 orphan critical_role_id (preserve row, lose link)
--   STEP 2: aggiungere FOREIGN KEY con ON DELETE SET NULL per future-proofing
--
-- Idempotent: il check NOT EXISTS preserva idempotenza UPDATE; FK ADD è
-- IF NOT EXISTS via DO block.
--
-- Non-RLS-scoped: cleanup migration script-level, applicato cross-tenant.
--
-- Refs: DECISIONS-LOG L75 · S54 carry-forward CF#4 · L73 root cause
-- ============================================================================

BEGIN;

-- STEP 1: nullify orphan critical_role_id
-- (atteso ~86 rows aggiornate, idempotent: se già nullified, 0 rows updated)
UPDATE succession_candidates sc
SET critical_role_id = NULL,
    updated_at = NOW()
WHERE critical_role_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM succession_plans WHERE id = sc.critical_role_id
  );

-- Verifica orphan dopo cleanup (deve essere 0)
SELECT COUNT(*) AS residual_orphans
FROM succession_candidates sc
WHERE sc.critical_role_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM succession_plans WHERE id = sc.critical_role_id);

-- STEP 2: aggiungi FOREIGN KEY ON DELETE SET NULL (future-proofing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'succession_candidates_critical_role_id_fkey'
  ) THEN
    ALTER TABLE succession_candidates
    ADD CONSTRAINT succession_candidates_critical_role_id_fkey
    FOREIGN KEY (critical_role_id)
    REFERENCES succession_plans(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

    RAISE NOTICE 'phase18w: FK constraint added on succession_candidates.critical_role_id';
  ELSE
    RAISE NOTICE 'phase18w: FK constraint already exists, skipping ADD';
  END IF;
END $$;

-- Verifica FK creata
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'succession_candidates_critical_role_id_fkey';

COMMIT;
