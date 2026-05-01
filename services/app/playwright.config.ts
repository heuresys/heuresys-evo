import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for services/app E2E.
 *
 * Run: npx playwright test
 * Run with browser: npx playwright test --headed
 * Show report: npx playwright show-report
 */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: '../../.rtg-state-evo/playwright/results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../../.rtg-state-evo/playwright/report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Add firefox/webkit when stable across CI matrix.
  ],
  webServer: process.env.PLAYWRIGHT_NO_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3200',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
