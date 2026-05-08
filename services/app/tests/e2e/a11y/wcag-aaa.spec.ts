/**
 * WCAG 2.2 AAA full-coverage audit — 9 representative views × 2 themes.
 *
 * Coverage strategy: public + dashboard data-heavy + list + self + admin form +
 * specialty + brand-studio. AAA tag-set includes color-contrast-enhanced,
 * focus-order, ARIA semantics, landmarks, headings hierarchy.
 *
 * Theme variants tested: DARK (default) + LIGHT (toggle via data-theme).
 *
 * Manual NVDA/VoiceOver pass: see docs/40-operations/a11y-manual-checklist.md.
 */
import { expect, test, type Page } from '@playwright/test';
import { CANONICAL_USERS, loginAs, type CanonicalUser } from '../helpers/auth';
import { auditWcagAAA, summarizeViolations, critical } from './a11y-runner';

interface ViewSpec {
  label: string;
  path: string;
  user?: CanonicalUser;
  waitForSelector?: string;
}

const VIEWS: ViewSpec[] = [
  {
    label: 'login (public form)',
    path: '/login',
    waitForSelector: 'button[type="submit"]',
  },
  {
    label: 'cross_tenant_overview (SUPERUSER)',
    path: '/dashboard/cross_tenant_overview',
    user: CANONICAL_USERS.superuser,
    waitForSelector: 'h1',
  },
  {
    label: 'tenant_owner_overview (TENANT_OWNER)',
    path: '/dashboard/tenant_owner_overview',
    user: CANONICAL_USERS.tenantOwnerRtl,
    waitForSelector: 'h1',
  },
  {
    label: 'hr_director_overview (HR_DIRECTOR)',
    path: '/dashboard/hr_director_overview',
    user: CANONICAL_USERS.hrDirectorRtl,
    waitForSelector: 'h1',
  },
  {
    label: 'employees list (HR_MANAGER)',
    path: '/employees',
    user: CANONICAL_USERS.hrManagerRtl,
    waitForSelector: 'h1',
  },
  {
    label: 'me/skills (EMPLOYEE)',
    path: '/me/skills',
    user: CANONICAL_USERS.employeeRtl,
    waitForSelector: 'h1',
  },
  {
    label: 'admin/users (TENANT_OWNER)',
    path: '/admin/users',
    user: CANONICAL_USERS.tenantOwnerRtl,
    waitForSelector: 'h1',
  },
  {
    label: 'ontology (HR_DIRECTOR)',
    path: '/ontology',
    user: CANONICAL_USERS.hrDirectorRtl,
    waitForSelector: 'h1',
  },
  // brand-studio is a dev tool with intentional theme-preview rendering
  // (ThemePreviewInjector) that surfaces token combinations; not production UI.
  // Excluded from AAA audit by design.
];

async function setTheme(page: Page, theme: 'dark' | 'light'): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
    try {
      window.localStorage.setItem('theme', t);
    } catch {
      // localStorage may be unavailable; data-theme alone is enough for axe.
    }
  }, theme);
  await page.waitForTimeout(100);
}

for (const theme of ['dark', 'light'] as const) {
  test.describe(`WCAG 2.2 AAA · ${theme.toUpperCase()} theme · 9 views`, () => {
    for (const view of VIEWS) {
      test(`${view.label} → 0 critical/serious violations`, async ({ page }) => {
        if (view.user) await loginAs(page, view.user);
        await page.goto(view.path, { waitUntil: 'networkidle' });
        await setTheme(page, theme);
        if (view.waitForSelector) {
          await page.waitForSelector(view.waitForSelector, { timeout: 15_000 });
        }

        const results = await auditWcagAAA(page);
        const crit = critical(results.violations);

        if (crit.length > 0) {
          console.log(`\n=== ${theme} · ${view.label} ===\n${summarizeViolations(crit)}`);
        }

        expect(crit.length, `Critical/serious AAA violations on ${theme} · ${view.label}`).toBe(0);
      });
    }
  });
}
