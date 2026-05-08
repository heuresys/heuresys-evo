/**
 * WCAG 2.2 AAA full-coverage audit — 8 representative views.
 *
 * Coverage strategy: public + dashboard data-heavy + list + self + admin form +
 * specialty. AAA tag-set includes color-contrast-enhanced, focus-order, ARIA
 * semantics, landmarks, headings hierarchy.
 *
 * Initial baseline: track `expect.soft` per-view to surface ALL issues in one
 * run, then tighten to hard `expect` once round-1 fixes land. The CI gate
 * (a11y.yml) enforces zero critical/serious violations.
 *
 * Manual NVDA/VoiceOver pass: see docs/40-operations/a11y-manual-checklist.md.
 */
import { expect, test } from '@playwright/test';
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
];

test.describe('WCAG 2.2 AAA · 8 representative views', () => {
  for (const view of VIEWS) {
    test(`${view.label} → 0 critical/serious violations`, async ({ page }) => {
      if (view.user) await loginAs(page, view.user);
      await page.goto(view.path, { waitUntil: 'networkidle' });
      if (view.waitForSelector) {
        await page.waitForSelector(view.waitForSelector, { timeout: 15_000 });
      }

      const results = await auditWcagAAA(page);
      const crit = critical(results.violations);

      if (crit.length > 0) {
        console.log(`\n=== ${view.label} ===\n${summarizeViolations(crit)}`);
      }

      expect(crit.length, `Critical/serious AAA violations on ${view.label}`).toBe(0);
    });
  }
});
