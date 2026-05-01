-- =============================================================================
-- Migration 0001: Baseline (squash from v1)
-- =============================================================================
-- This is a placeholder migration documenting that the schema was bootstrapped
-- from a pg_dump baseline (db/baseline/000_baseline_schema_v1_2026-04-27.sql),
-- representing the full state of the heuresys.com.evo v1 database as of
-- 2026-04-27.
--
-- Decision rationale: see docs/decisions/0001-postgresql-bare-metal.md and the
-- baseline-squash strategy adopted for the .evo rebuild.
--
-- The v1 database had 201 incremental migrations applied (max version 220). They are NOT replayed in .evo
-- because:
--   - The pg_dump baseline materializes the full final schema directly
--   - Re-running 213 migrations is slow and adds no value when state is known
--   - The v1 migrations remain available in the v1 repo for audit
--   - Source of truth for "what's in the schema" is the baseline + new migrations
--
-- Future migrations (0002_*, 0003_*, ...) are applied incrementally on top of
-- this baseline using scripts/migrate.sh.
--
-- This file is INTENTIONALLY a no-op safety check. The real schema is loaded by
-- db/scripts/restore-baseline.sh from backups/from-vm/platform_db.dump.
-- =============================================================================

DO $$
BEGIN
  -- Assert pgvector extension is installed
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    RAISE EXCEPTION 'pgvector extension not found. Install postgresql-16-pgvector and CREATE EXTENSION vector.';
  END IF;

  -- Assert schema_migrations table exists (created by the dump or by mark-baseline-applied.sh)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'schema_migrations'
  ) THEN
    RAISE EXCEPTION 'schema_migrations table not found. Run db/scripts/restore-baseline.sh first.';
  END IF;

  RAISE NOTICE 'Baseline 0001 verified: pgvector and schema_migrations both present.';
END
$$;
