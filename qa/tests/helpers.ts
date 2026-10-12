import type { Page, TestInfo } from '@playwright/test'

/** Pages to audit: the marketing page + every dashboard section (override with QA_PATHS). */
export const ROUTES = '/,/app/overview,/app/projects,/app/tasks,/app/automations,/app/analytics,/app/integrations,/app/assistant'
export const PATHS = (process.env.QA_PATHS ?? ROUTES).split(',').map((p) => p.trim()).filter(Boolean)

export function slug(path: string) {
  return path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-')
}

/** Scroll through the page so lazy content and whileInView animations settle. */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
}

export function shotPath(testInfo: TestInfo, name: string) {
  return `qa-reports/screenshots/${testInfo.project.name}/${name}.png`
}
