-- Phase 18l (S35.6 cleanup) — strip mock identities da static seed data dashboard_elements
--
-- Context: phase14b_dashboard_composite_static.sql (2026-05-07) ha seedato static demo data
-- contenente le canonical "mock identities" bandite (Maria Rossi · Luca Bianchi · Stefania Bianchi · Gabriele Amato).
-- registry.tsx fallback è stato già stripped (commit S36 in-progress).
-- Questa migration aggiorna le row dashboard_elements DB-side per coerenza visiva con il refactor frontend.
--
-- Lexicon: nessuna — è cleanup tech-debt cross-cutting.
-- Idempotent: UPDATE solo se valore corrisponde al pattern stale.
-- Rollback: phase18l_DOWN.sql NON ripristina (è cleanup unidirezionale).

BEGIN;

-- 1. SuccessionCard hr_director_overview: Stefania Bianchi → "Senior risk analyst"
UPDATE dashboard_elements de
SET config_overrides = jsonb_set(
  de.config_overrides,
  '{data_source,value,0,candidateName}',
  '"Senior risk analyst"'::jsonb,
  false
)
FROM dashboard_presets dp
WHERE dp.id=de.dashboard_preset_id
  AND dp.code='hr_director_overview'
  AND de.widget_code='SuccessionCard'
  AND de.config_overrides->'data_source'->'value'->0->>'candidateName' = 'Stefania Bianchi';

-- 2. Generic sweep su tutti i config_overrides che contengono ancora le mock identities
-- Pattern: replace JSON string value via regex_replace su jsonb cast
UPDATE dashboard_elements
SET config_overrides = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        config_overrides::text,
        '"Maria Rossi"', '"Manager"'
      ),
      '"Luca Bianchi"', '"HR Operations"'
    ),
    '"Stefania Bianchi"', '"Senior risk analyst"'
  ),
  '"Gabriele Amato"', '"Lead analyst"'
)::jsonb,
  updated_at = now()
WHERE config_overrides::text ~ '(Maria Rossi|Luca Bianchi|Stefania Bianchi|Gabriele Amato)';

INSERT INTO schema_migrations (version, applied_at)
VALUES ('phase18l_strip_mock_identities', now())
ON CONFLICT (version) DO NOTHING;

DO $$
DECLARE v_remaining INT;
BEGIN
  SELECT COUNT(*) INTO v_remaining FROM dashboard_elements
  WHERE config_overrides::text ~ '(Maria Rossi|Luca Bianchi|Stefania Bianchi|Gabriele Amato)';
  RAISE NOTICE 'phase18l: dashboard_elements remaining mock identities = % (target 0)', v_remaining;
  IF v_remaining > 0 THEN
    RAISE WARNING 'mock identities still present in dashboard_elements';
  END IF;
END$$;

COMMIT;
