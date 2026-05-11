-- Phase 17a — User palette preference (Phase 15.I L60+ runtime palette switching)
--
-- Adds 2 nullable columns to users for per-user dashboard palette/theme override:
--   - palette_preference_id: one of 17 PaletteId values (TS union in lib/theme-framework/palettes.ts)
--   - theme_preference: 'dark' | 'light'
--
-- NULL = inherit project default (active-palette.json read by root layout).
--
-- CHECK constraints enforce DB-level whitelist (defense in depth: app validates,
-- DB also rejects). Applies to ~265 active users (all start NULL = no behavior change).
--
-- Scope: only /dashboard/* routes apply the user preference, via DashboardPaletteApplier
-- client effect. Other routes fall back to project default.
--
-- Migration is additive nullable: zero impact on existing rows, safe to deploy live.

BEGIN;

ALTER TABLE users
  ADD COLUMN palette_preference_id VARCHAR(32),
  ADD COLUMN theme_preference VARCHAR(8);

ALTER TABLE users
  ADD CONSTRAINT users_palette_preference_id_check
  CHECK (palette_preference_id IS NULL OR palette_preference_id IN (
    'legacy',
    'alpha',
    'beta',
    'gamma',
    'delta',
    'epsilon',
    'zeta',
    'eta',
    'theta',
    'iota',
    'kappa',
    'lambda',
    'mu-architect',
    'mu-art-director',
    'mu-pragmatic',
    'mu-synthesis',
    'mu-data-dense'
  ));

ALTER TABLE users
  ADD CONSTRAINT users_theme_preference_check
  CHECK (theme_preference IS NULL OR theme_preference IN ('dark', 'light'));

COMMENT ON COLUMN users.palette_preference_id IS
  'User dashboard palette override (PaletteId enum). NULL = inherit project default. Applies to /dashboard/* routes only via DashboardPaletteApplier.';
COMMENT ON COLUMN users.theme_preference IS
  'User dashboard theme override (dark | light). NULL = inherit project default. Coupled with palette_preference_id.';

COMMIT;

-- Rollback:
--   ALTER TABLE users DROP CONSTRAINT users_theme_preference_check;
--   ALTER TABLE users DROP CONSTRAINT users_palette_preference_id_check;
--   ALTER TABLE users DROP COLUMN theme_preference;
--   ALTER TABLE users DROP COLUMN palette_preference_id;
