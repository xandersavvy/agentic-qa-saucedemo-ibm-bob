import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment-specific config
const env = process.env.TEST_ENV ?? 'staging';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, '.env'), override: false });

const config = {
  baseURL:   process.env.BASE_URL    ?? 'https://www.saucedemo.com',
  headless:  process.env.HEADLESS    !== 'false',
  timeout:   Number(process.env.TIMEOUT ?? 30_000),
  retries:   Number(process.env.RETRIES  ?? 1),
  workers:   Number(process.env.WORKERS  ?? 2),
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : config.retries,
  workers: process.env.CI ? 1 : config.workers,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
  ],
  use: {
    baseURL: config.baseURL,
    headless: config.headless,
    actionTimeout: config.timeout,
    navigationTimeout: config.timeout,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  outputDir: 'test-results',
});
