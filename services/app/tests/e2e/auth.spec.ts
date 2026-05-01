import { test, expect } from '@playwright/test';

/**
 * Auth flow E2E (B3.10).
 *
 * Requires:
 *  - DATABASE_URL pointing to a seed-ready DB
 *  - api-gateway running on NEXT_PUBLIC_API_URL
 *  - AUTH_SECRET shared with api-gateway
 *  - Seed user `evo.dev / admin123` (DEFAULT_SUPERUSER_TENANT_ID set)
 *
 * Skipped automatically if those preconditions are missing — the spec
 * still smoke-checks that /login renders.
 */
const HAS_FULL_STACK =
  !!process.env.DATABASE_URL && !!process.env.AUTH_SECRET && !!process.env.NEXT_PUBLIC_API_URL;

test.describe('Auth flow', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign in');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('protected route redirects to /login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login(\?.*)?$/);
    expect(page.url()).toMatch(/\/login/);
  });

  test('successful credentials sign-in redirects to /dashboard', async ({ page }) => {
    test.skip(!HAS_FULL_STACK, 'requires DATABASE_URL + AUTH_SECRET + api-gateway up');
    await page.goto('/login');
    await page.fill('input[name="username"]', 'evo.dev');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard$/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('invalid credentials show error', async ({ page }) => {
    test.skip(!HAS_FULL_STACK, 'requires full stack');
    await page.goto('/login');
    await page.fill('input[name="username"]', 'evo.dev');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Sign-in failed')).toBeVisible({ timeout: 5000 });
  });
});
