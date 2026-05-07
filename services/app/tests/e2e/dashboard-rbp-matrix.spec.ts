/**
 * Phase 14.D follow-up — RBP visibility matrix on hr_director_overview.
 *
 * Same dashboard, 7 different RTL Bank roles. Each role lands on the page
 * (auth + tenant gate ok) and sees a count of widgets consistent with the
 * preset's RBP rules: hr_director_overview elements have visibility_min_role=6
 * (EMPLOYEE) so all 7 roles see all 4 widgets. Other dashboards may diverge.
 *
 * Sprint 1 follow-up will expand to all 9 dashboards; this file is the
 * scaffold proving the matrix infrastructure works.
 */
import { expect, test } from '@playwright/test';
import { CANONICAL_USERS, loginAs } from './helpers/auth';

const HAS_FULL_STACK =
  !!process.env.DATABASE_URL && !!process.env.AUTH_SECRET && !!process.env.NEXT_PUBLIC_API_URL;

const ROLES = Object.values(CANONICAL_USERS);

test.describe('Dashboard · RBP matrix · hr_director_overview', () => {
  test.skip(!HAS_FULL_STACK, 'requires DATABASE_URL + AUTH_SECRET + api-gateway up');

  for (const user of ROLES) {
    test(`role=${user.role} sees 4 widgets (visibility_min_role=6 for all elements)`, async ({
      page,
    }) => {
      await loginAs(page, user);
      await page.goto('/dashboard/hr_director_overview?lang=en');
      await expect(page.locator('h1')).toContainText('HR Director Overview');
      await expect(page.locator('[data-widget-code]')).toHaveCount(4, { timeout: 15_000 });
    });
  }
});
