/**
 * Phase 14.D — E2E auth helper.
 *
 * Performs a NextAuth Credentials login through the public form (so the test
 * exercises the same path as a real user) and returns the resulting Page
 * already authenticated. Use the canonical demo users:
 *   rtl-bank.valentina.conti / Heuresys2026!  → HR_DIRECTOR / RTL Bank tenant
 *   (see .handoff/PROJECT-STATE for the full role roster.)
 */
import type { Page } from '@playwright/test';

export interface CanonicalUser {
  username: string;
  password: string;
  role: string;
  tenant: string;
}

export const CANONICAL_USERS = {
  hrDirectorRtl: {
    username: 'rtl-bank.valentina.conti',
    password: 'Heuresys2026!',
    role: 'HR_DIRECTOR',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  // Sprint 1 follow-up will add the remaining 7 ruoli × 2 tenant for the full
  // 72-fixture matrix.
};

export async function loginAs(page: Page, user: CanonicalUser): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="password"]', user.password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 }),
    page.click('button[type="submit"]'),
  ]);
}
