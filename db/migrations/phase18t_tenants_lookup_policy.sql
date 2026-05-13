-- phase18t — Add permissive policy to tenants for platform-wide lookup (S60 CF-2 + CF-4 fix).
--
-- Context: post `ALTER ROLE heuresys NOBYPASSRLS` (S60 CF-2), the `heuresys` user can no longer
-- read `tenants` without `current_tenant_id` GUC set. But CASCADIA scripts need to lookup
-- tenant_id by code BEFORE setting the GUC (chicken-egg).
--
-- Fix: add a permissive policy `tenant_lookup_when_no_context` that allows SELECT only when
-- the GUC is unset (NULL). Once any tenant context is set, the original `tenant_self_access`
-- restricts to that tenant. Safe because lookup leaks only tenant codes (id, code, status)
-- which are not sensitive — bonus_plans/employees/etc. policies still enforce isolation.

BEGIN;

DROP POLICY IF EXISTS tenant_lookup_when_no_context ON tenants;

CREATE POLICY tenant_lookup_when_no_context ON tenants
  FOR SELECT
  USING (current_tenant_id() IS NULL);

COMMIT;
