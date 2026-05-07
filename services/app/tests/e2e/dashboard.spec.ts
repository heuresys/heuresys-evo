/**
 * Phase 14.D — Dashboard E2E (PoC: HR_DIRECTOR · hr_director_overview).
 *
 * Validates the full Phase 14.A pipeline rendered in a real browser:
 *   - Auth flow lands user on dashboard route
 *   - Engine renders 4 visible widgets for HR_DIRECTOR
 *   - KpiRing shows the live "Active employees" label (proves data-fetcher
 *     pipeline ran and adapter applied)
 *   - i18n: switching ?lang=it ↔ ?lang=en flips header copy
 *
 * Sprint 1 follow-up will expand to the full 9 dashboard × 8 ruoli matrix
 * with golden screenshot diff and axe-core ≥95.
 */
import { expect, test } from '@playwright/test';
import { CANONICAL_USERS, loginAs } from './helpers/auth';

const HAS_FULL_STACK =
  !!process.env.DATABASE_URL && !!process.env.AUTH_SECRET && !!process.env.NEXT_PUBLIC_API_URL;

test.describe('Dashboard · hr_director_overview · HR_DIRECTOR', () => {
  test.skip(!HAS_FULL_STACK, 'requires DATABASE_URL + AUTH_SECRET + api-gateway up');

  test('renders 4 visible widgets after RBP filter', async ({ page }) => {
    await loginAs(page, CANONICAL_USERS.hrDirectorRtl);
    await page.goto('/dashboard/hr_director_overview?lang=en');
    await expect(page.locator('h1')).toContainText('HR Director Overview');
    // 4 widgets in seed: KpiRing, SuccessionCard, SkillHeatmap, IntegrationHealthPill
    const widgetTiles = page.locator('[data-widget-code]');
    await expect(widgetTiles).toHaveCount(4, { timeout: 15_000 });
  });

  test('KpiRing shows live "Active employees" label (data-fetcher pipeline ok)', async ({
    page,
  }) => {
    await loginAs(page, CANONICAL_USERS.hrDirectorRtl);
    await page.goto('/dashboard/hr_director_overview?lang=en');
    const kpiTile = page.locator('[data-widget-code="KpiRing"][data-position="1"]');
    await expect(kpiTile).toBeVisible();
    await expect(kpiTile).toContainText('Active employees', { timeout: 10_000 });
    await expect(kpiTile).toContainText('tenant-scoped');
  });

  test('?lang=it ↔ ?lang=en flips header copy', async ({ page }) => {
    await loginAs(page, CANONICAL_USERS.hrDirectorRtl);
    await page.goto('/dashboard/hr_director_overview?lang=it');
    await expect(page.locator('h1')).toContainText('Vista Direzione HR');
    await page.goto('/dashboard/hr_director_overview?lang=en');
    await expect(page.locator('h1')).toContainText('HR Director Overview');
  });
});
