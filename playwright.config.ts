import { defineConfig, devices } from '@playwright/test'

/**
 * Visual QA config. Tests run against the PRODUCTION build (vite preview),
 * using the locally installed Google Chrome (no extra browser download).
 * Override the target with QA_BASE_URL to test any running site.
 */
const PORT = 4173
const baseURL = process.env.QA_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './qa/tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'qa-reports/playwright' }], ['json', { outputFile: 'qa-reports/playwright.json' }]],
  use: {
    baseURL,
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: process.env.QA_BASE_URL
    ? undefined
    : {
        command: `npm run preview`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
})
