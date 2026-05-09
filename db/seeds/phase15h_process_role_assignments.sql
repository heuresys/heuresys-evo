-- Phase 15.H — Process dashboards autonomous role mapping (S22 · L49)
-- ========================================================================
-- Estende role_default_dashboards per consentire N preset per ruolo via
-- priority. I 4 process_*_v1 (Phase 15.A) sono assegnati a HR_DIRECTOR e
-- HR_MANAGER come secondary dashboards (priority>0; primary @ priority=0
-- resta invariato → resolvePresetCodeForRole continua a tornare il primary).
--
-- Concetto "autonomous role": i 4 process sono URL-addressable + visibili
-- nella sidebar di HR_DIRECTOR/HR_MANAGER. In futuro potranno essere
-- associati ad altri ruoli (RECRUITER/ONBOARDING_SPECIALIST/...) aggiungendo
-- nuove rows con priority=0 per quei ruoli, senza schema change.
--
-- Idempotent: DROP+CREATE indici, INSERT ON CONFLICT DO NOTHING.

-- ============================================================
-- INDEX RESHAPE — permettere N preset per ruolo
-- ============================================================
DROP INDEX IF EXISTS uniq_role_default_platform;
DROP INDEX IF EXISTS uniq_role_default_tenant;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_role_default_platform
  ON role_default_dashboards (role, preset_code)
  WHERE tenant_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_role_default_tenant
  ON role_default_dashboards (role, preset_code, tenant_id)
  WHERE tenant_id IS NOT NULL;

-- ============================================================
-- SEED — 4 process × 2 HR roles = 8 entries
-- priority=10..40 (gap di 10 dai primary @ 0 → spazio per future inserzioni)
-- ============================================================
INSERT INTO role_default_dashboards (role, preset_code, tenant_id, priority) VALUES
  ('HR_DIRECTOR', 'process_recruiting_funnel',  NULL, 10),
  ('HR_DIRECTOR', 'process_onboarding_flow',    NULL, 20),
  ('HR_DIRECTOR', 'process_performance_cycle',  NULL, 30),
  ('HR_DIRECTOR', 'process_learning_paths',     NULL, 40),
  ('HR_MANAGER',  'process_recruiting_funnel',  NULL, 10),
  ('HR_MANAGER',  'process_onboarding_flow',    NULL, 20),
  ('HR_MANAGER',  'process_performance_cycle',  NULL, 30),
  ('HR_MANAGER',  'process_learning_paths',     NULL, 40)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Expected: 16 rows total (8 primary @ priority=0 + 8 process @ priority=10..40)
SELECT role, preset_code, priority, tenant_id
FROM role_default_dashboards
ORDER BY role, priority, preset_code;
