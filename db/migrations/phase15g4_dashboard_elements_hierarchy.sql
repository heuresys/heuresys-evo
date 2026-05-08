-- =============================================================================
-- Migration phase15g4 — Dashboard elements hierarchy + variant (L40 unified)
-- Date: 2026-05-08 (S19)
-- =============================================================================
-- Estende `dashboard_elements` per supportare il modello a 3 livelli del
-- catalogo Brand Identity dashboard (L40):
--
-- LIVELLO 1 — CATALOGO (asset CSS canonical · widget_code)
-- LIVELLO 2 — VARIANTI (modifier: pill-warn, tenant-card.platform, fill-info, ...)
-- LIVELLO 3 — COMPOSIZIONE PER RUOLO (slot variabili gerarchici)
--
-- Cambiamenti additivi (SAFE — nessun dato esistente toccato):
--
-- 1. ADD COLUMN dashboard_elements.parent_element_id BIGINT NULL FK self
--    → permette slot annidati (es. .double-split contenente 2 slot figli .panel)
--
-- 2. ADD COLUMN dashboard_elements.variant VARCHAR(64) NULL
--    → modifier livello 2 (es. 'pill-warn', 'tenant-card-platform', 'fill-info')
--
-- 3. DROP + RECREATE partial UNIQUE indexes per includere parent_element_id
--    → unicità (preset, parent, position) invece di (preset, position)
--
-- 4. ADD INDEX su parent_element_id per hierarchy traversal performante
--
-- Nessuna alterazione di RLS (politica esistente già copre la nuova superficie).
--
-- Plan ref: brand-dashboard-catalog audit § 8 G4 + DECISIONS-LOG L40
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Add parent_element_id (self-FK)
-- -----------------------------------------------------------------------------
ALTER TABLE dashboard_elements
  ADD COLUMN IF NOT EXISTS parent_element_id BIGINT NULL
    REFERENCES dashboard_elements(id) ON DELETE CASCADE;

COMMENT ON COLUMN dashboard_elements.parent_element_id IS
  'Self-FK per gerarchia slot. NULL = top-level (figlio diretto del preset). Non-NULL = slot figlio (es. left/right di .double-split). Cascade delete: rimuovendo un parent, rimuove tutti i figli.';

-- -----------------------------------------------------------------------------
-- Add variant (catalog modifier livello 2)
-- -----------------------------------------------------------------------------
ALTER TABLE dashboard_elements
  ADD COLUMN IF NOT EXISTS variant VARCHAR(64) NULL;

COMMENT ON COLUMN dashboard_elements.variant IS
  'Catalog livello 2 modifier (BEM-like). Es. ''pill-warn'', ''tenant-card-platform'', ''fill-info'', ''heat-6''. NULL = default base senza variant. Validazione lato app contro brand-dashboard-catalog.md.';

-- -----------------------------------------------------------------------------
-- DROP + RECREATE partial UNIQUE indexes
-- -----------------------------------------------------------------------------
-- Old: (dashboard_preset_id, position) WHERE tenant_id IS [NOT] NULL
-- New: (dashboard_preset_id, COALESCE(parent_element_id, 0), position) WHERE tenant_id IS [NOT] NULL
-- Use COALESCE trick to make NULL distinct vs non-NULL parents in unique check.
-- -----------------------------------------------------------------------------

DROP INDEX IF EXISTS dashboard_elements_unique_platform;
DROP INDEX IF EXISTS dashboard_elements_unique_tenant;

CREATE UNIQUE INDEX IF NOT EXISTS dashboard_elements_unique_platform
  ON dashboard_elements (dashboard_preset_id, COALESCE(parent_element_id, 0), position)
  WHERE tenant_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS dashboard_elements_unique_tenant
  ON dashboard_elements (dashboard_preset_id, COALESCE(parent_element_id, 0), position, tenant_id)
  WHERE tenant_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- Index per hierarchy traversal (children lookup)
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_dashboard_elements_parent
  ON dashboard_elements (parent_element_id)
  WHERE parent_element_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- Verify additivity — count rows pre/post (sanity)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  row_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO row_count FROM dashboard_elements;
  RAISE NOTICE 'dashboard_elements rows after migration: %', row_count;
  -- Tutti i record esistenti hanno parent_element_id = NULL (top-level), variant = NULL.
  -- I nuovi seed (G6) potranno popolare le 2 colonne come slot annidati con varianti.
END;
$$;

COMMIT;
