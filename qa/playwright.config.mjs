import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.QA_PORT || 4173);
const BASE = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;
// WebKit binary is optional (`npx playwright install webkit`); project is added only when present or forced.
const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(process.env.HOME || '', '.cache/ms-playwright');
const hasWebkit = process.env.QA_WEBKIT === '1' || (fs.existsSync(pw) && fs.readdirSync(pw).some((d) => d.startsWith('webkit')));

const mobile375 = { viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['json', { outputFile: 'results/playwright-report.json' }], ['html', { outputFolder: 'results/html', open: 'never' }]],
  use: { baseURL: BASE, serviceWorkers: 'block', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: process.env.BASE_URL ? undefined : { command: 'node scripts/serve.mjs', port: PORT, reuseExistingServer: true, timeout: 20_000 },
  projects: [
    // Fast subset (< 2 min): only tests tagged @smoke, one browser, desktop viewport.
    { name: 'smoke', grep: /@smoke/, use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-desktop', grepInvert: /@nodesktop/, use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile375', grepInvert: /@nomobile/, use: { ...devices['Desktop Chrome'], ...mobile375 } },
    ...(hasWebkit ? [
      { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
      { name: 'webkit-mobile375', use: { ...devices['Desktop Safari'], ...mobile375 } },
    ] : []),
  ],
});
