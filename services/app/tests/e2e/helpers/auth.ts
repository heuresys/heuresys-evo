/**
 * Phase 14.D — E2E auth helper.
 *
 * Performs a NextAuth Credentials login through the public form (so the test
 * exercises the same path as a real user) and returns the resulting Page
 * already authenticated.
 *
 * SoT: tests/.test-env (8 entries: 1 SUPERUSER + 7 RTL Bank roles). Post-S22
 * cleanup the test environment is restricted to that matrix; the previous
 * cross-tenant TENANT_OWNER smoke set (admin / smartfood-admin / econova-admin)
 * has been retired and those accounts are soft-deactivated by
 * scripts/db/apply-canonical-users.mjs together with the legacy $2a$
 * duplicates (alice.esposito, alberto.colombo).
 *
 * All canonical demo users share the unified password `Heuresys2026!`.
 */
import type { Page } from '@playwright/test';
import { getCanonicalUsersByRole, parseTestEnv } from '../../../../../tests/parse-test-env.mjs';

export interface CanonicalUser {
  username: string;
  password: string;
  role: string;
  tenant: string;
}

// SoT: tests/.test-env (post-L51). Tutti gli username/password sono letti da
// quel file via parser; nessuna duplicazione qui.
const BY_ROLE = getCanonicalUsersByRole();

function fromRole(role: string, tenantOverride?: string): CanonicalUser {
  const u = BY_ROLE[role];
  if (!u) throw new Error(`tests/.test-env missing canonical user for role ${role}`);
  return {
    username: u.username,
    password: u.password,
    role: u.role,
    tenant: tenantOverride ?? u.tenant,
  };
}

export const CANONICAL_USERS = {
  superuser: fromRole('SUPERUSER', 'platform'),
  tenantOwnerRtl: fromRole('TENANT_OWNER'),
  itAdminRtl: fromRole('IT_ADMIN'),
  hrDirectorRtl: fromRole('HR_DIRECTOR'),
  hrManagerRtl: fromRole('HR_MANAGER'),
  deptHeadRtl: fromRole('DEPT_HEAD'),
  lineManagerRtl: fromRole('LINE_MANAGER'),
  employeeRtl: fromRole('EMPLOYEE'),
} as const;

/** Full canonical RBP matrix (driven by .test-env). */
export const RTL_MATRIX_USERS: CanonicalUser[] = parseTestEnv().map((u) => ({
  username: u.username,
  password: u.password,
  role: u.role,
  tenant: u.role === 'SUPERUSER' ? 'platform' : u.tenant,
}));

/** All 9 published dashboard preset codes (Phase 13). */
export const DASHBOARD_CODES = [
  'hr_director_overview',
  'capability_graph',
  'skills_heatmap',
  'employee_journey',
  'org_systems',
  'process_recruiting_funnel',
  'process_onboarding_flow',
  'process_performance_cycle',
  'process_learning_paths',
] as const;

export async function loginAs(page: Page, user: CanonicalUser): Promise<void> {
  await page.goto('/login', { waitUntil: 'networkidle' });
  // Hydration: ensure NextAuth signIn handler is wired before clicking, otherwise
  // the form falls back to native HTML GET (no auth, query string in URL).
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('button[type="submit"]');
      return btn instanceof HTMLButtonElement && !btn.disabled;
    },
    { timeout: 15_000 }
  );
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 });
}
