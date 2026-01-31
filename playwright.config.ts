import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3006;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  timeout: 30000,
  use: {
    // Base URL without path - tests use relative paths from here
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    // In CI, build already ran separately - just serve. Locally, build first.
    command: process.env.CI
      ? 'npm run serve:e2e'
      : 'npm run build && npm run serve:e2e',
    url: `http://localhost:${PORT}/website-portfolio/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
