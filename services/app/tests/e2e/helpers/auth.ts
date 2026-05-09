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

export interface CanonicalUser {
  username: string;
  password: string;
  role: string;
  tenant: string;
}

const PASSWORD = 'Heuresys2026!';

export const CANONICAL_USERS = {
  // 8 canonical demo users — restricted to tests/.test-env matrix (post-S22).
  superuser: {
    username: 'sysadmin',
    password: PASSWORD,
    role: 'SUPERUSER',
    tenant: 'platform',
  } satisfies CanonicalUser,
  tenantOwnerRtl: {
    username: 'rtl-bank.federica.marchetti',
    password: PASSWORD,
    role: 'TENANT_OWNER',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  itAdminRtl: {
    username: 'rtl-bank.marco.desantis',
    password: PASSWORD,
    role: 'IT_ADMIN',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  hrDirectorRtl: {
    username: 'rtl-bank.valentina.conti',
    password: PASSWORD,
    role: 'HR_DIRECTOR',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  hrManagerRtl: {
    username: 'rtl-bank.maria.colombo',
    password: PASSWORD,
    role: 'HR_MANAGER',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  deptHeadRtl: {
    username: 'rtl-bank.paolo.caputo',
    password: PASSWORD,
    role: 'DEPT_HEAD',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  lineManagerRtl: {
    username: 'rtl-bank.giuseppe.ferri',
    password: PASSWORD,
    role: 'LINE_MANAGER',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  employeeRtl: {
    username: 'rtl-bank.francesca.gallo',
    password: PASSWORD,
    role: 'EMPLOYEE',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
};

/** Full canonical RBP matrix (8 users × 9 dashboards = 72 cases). */
export const RTL_MATRIX_USERS: CanonicalUser[] = [
  CANONICAL_USERS.superuser,
  CANONICAL_USERS.tenantOwnerRtl,
  CANONICAL_USERS.itAdminRtl,
  CANONICAL_USERS.hrDirectorRtl,
  CANONICAL_USERS.hrManagerRtl,
  CANONICAL_USERS.deptHeadRtl,
  CANONICAL_USERS.lineManagerRtl,
  CANONICAL_USERS.employeeRtl,
];

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
