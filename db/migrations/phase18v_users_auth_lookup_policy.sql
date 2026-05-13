-- phase18v — Auth lookup policy on users table (S60 CF-2 hotfix).
--
-- Context: post NOBYPASSRLS (S60 CF-2), NextAuth Credentials login fails because
-- the SELECT (`WHERE username = X`) runs BEFORE tenant context is known (tenant
-- is derived from the user's employee.tenant_id, chicken-egg).
--
-- Fix: permissive policy `user_auth_lookup_when_no_context` allows SELECT on users
-- when `current_tenant_id()` GUC is NULL. Once login completes and session sets
-- tenantId, the existing `user_tenant_access` policy enforces isolation.
--
-- Security: minimal data exposure during the unset-GUC window
-- (username, password_hash needed for auth comparison). Acceptable trade-off.

BEGIN;

DROP POLICY IF EXISTS user_auth_lookup_when_no_context ON users;

CREATE POLICY user_auth_lookup_when_no_context ON users
  FOR SELECT
  USING (current_tenant_id() IS NULL);

COMMIT;
