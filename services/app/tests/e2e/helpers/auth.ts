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
  tenantOwnerRtl: {
    username: 'rtl-bank.federica.marchetti',
    password: 'Heuresys2026!',
    role: 'TENANT_OWNER',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  itAdminRtl: {
    username: 'rtl-bank.marco.desantis',
    password: 'Heuresys2026!',
    role: 'IT_ADMIN',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  hrDirectorRtl: {
    username: 'rtl-bank.valentina.conti',
    password: 'Heuresys2026!',
    role: 'HR_DIRECTOR',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  hrManagerRtl: {
    username: 'rtl-bank.maria.colombo',
    password: 'Heuresys2026!',
    role: 'HR_MANAGER',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  lineManagerRtl: {
    username: 'rtl-bank.giuseppe.ferri',
    password: 'Heuresys2026!',
    role: 'LINE_MANAGER',
    tenant: 'RTL Bank',
  } satisfies CanonicalUser,
  // DEPT_HEAD (rtl-bank.alice.esposito) + EMPLOYEE (rtl-bank.alberto.colombo)
  // were seeded by an older smart_seed pass with bcrypt $2a$ hash and a
  // different password — they do not accept Heuresys2026!. Re-seeding to align
  // the demo user roster on a single password is a Sprint 1 follow-up.
  // Likewise SUPERUSER (platform-wide) + tenant variants for SmartFood/EcoNova
  // are deferred — full 72-fixture matrix lives downstream.
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
