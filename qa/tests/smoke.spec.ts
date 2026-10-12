import { expect, test } from '@playwright/test'
import { PATHS, settle, shotPath, slug } from './helpers.ts'

// Console errors, uncaught exceptions, failed network requests, full-page screenshots.
for (const path of PATHS) {
  test(`smoke: ${path} loads cleanly`, async ({ page }, testInfo) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    const failedRequests: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => pageErrors.push(err.message))
    page.on('requestfailed', (req) => failedRequests.push(`${req.failure()?.errorText} ${req.url()}`))
    page.on('response', (res) => {
      if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`)
    })

    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response?.status(), 'document status').toBeLessThan(400)
    await settle(page)
    await page.screenshot({ path: shotPath(testInfo, slug(path)), fullPage: true })

    expect(pageErrors, 'uncaught exceptions').toEqual([])
    expect(consoleErrors, 'console errors').toEqual([])
    expect(failedRequests, 'failed / 4xx-5xx requests').toEqual([])
  })
}
