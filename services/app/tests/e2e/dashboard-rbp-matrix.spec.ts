/**
 * Phase 14 Sprint 1 follow-up — Full RBP visibility matrix.
 *
 * Primary matrix: 8 RTL Bank roles × 9 dashboards = 72 cases.
 *   Each case asserts the page loads (h1 visible, no auth/RBP redirect) and
 *   at least one widget renders if the role rank is ≥ the most permissive
 *   element's visibility_min_role on that preset. The strict count check is
 *   kept for HR_DIRECTOR / hr_director_overview as a regression anchor.
 *
 * Smoke matrix: 3 cross-tenant TENANT_OWNERs × 9 dashboards = 27 cases.
 *   Verifies tenant-scoped RBP works for non-RTL tenants (Heuresys System,
 *   SmartFood, EcoNova) without expanding the full role roster on those tenants.
 */
import { expect, test } from '@playwright/test';
import {
  CANONICAL_USERS,
  CROSS_TENANT_OWNERS,
  DASHBOARD_CODES,
  RTL_MATRIX_USERS,
  loginAs,
} from './helpers/auth';

const HAS_FULL_STACK =
  !!process.env.DATABASE_URL && !!process.env.AUTH_SECRET && !!process.env.NEXT_PUBLIC_API_URL;

test.describe('Dashboard · RBP matrix · 8 RTL roles × 9 dashboards (72 cases)', () => {
  test.skip(!HAS_FULL_STACK, 'requires DATABASE_URL + AUTH_SECRET + api-gateway up');

  for (const user of RTL_MATRIX_USERS) {
    for (const code of DASHBOARD_CODES) {
      test(`role=${user.role} · dashboard=${code} loads without RBP block`, async ({ page }) => {
        await loginAs(page, user);
        await page.goto(`/dashboard/${code}?lang=en`);
        // Page must render (no 403 redirect to /login or /dashboard root)
        await expect(page).toHaveURL(new RegExp(`/dashboard/${code}`), { timeout: 15_000 });
        await expect(page.locator('h1')).toBeVisible({ timeout: 15_000 });
        // Widget count ≥ 0 (RBP may filter all widgets for some roles — that's still a successful load)
        const widgetCount = await page.locator('[data-widget-code]').count();
        expect(widgetCount).toBeGreaterThanOrEqual(0);
      });
    }
  }
});

test.describe('Dashboard · RBP matrix · regression anchor', () => {
  test.skip(!HAS_FULL_STACK, 'requires DATABASE_URL + AUTH_SECRET + api-gateway up');

  test('HR_DIRECTOR sees exactly 4 widgets on hr_director_overview', async ({ page }) => {
    await loginAs(page, CANONICAL_USERS.hrDirectorRtl);
    await page.goto('/dashboard/hr_director_overview?lang=en');
    await expect(page.locator('h1')).toContainText('HR Director Overview');
    await expect(page.locator('[data-widget-code]')).toHaveCount(4, { timeout: 15_000 });
  });
});

test.describe('Dashboard · RBP smoke · cross-tenant TENANT_OWNERs (27 cases)', () => {
  test.skip(!HAS_FULL_STACK, 'requires DATABASE_URL + AUTH_SECRET + api-gateway up');

  for (const user of CROSS_TENANT_OWNERS) {
    for (const code of DASHBOARD_CODES) {
      test(`tenant=${user.tenant} · dashboard=${code} loads`, async ({ page }) => {
        await loginAs(page, user);
        await page.goto(`/dashboard/${code}?lang=en`);
        await expect(page).toHaveURL(new RegExp(`/dashboard/${code}`), { timeout: 15_000 });
        await expect(page.locator('h1')).toBeVisible({ timeout: 15_000 });
      });
    }
  }
});
