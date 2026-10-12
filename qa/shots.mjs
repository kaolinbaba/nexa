// Capture screenshots of key routes at desktop / tablet / mobile.
// Usage: node qa/shots.mjs [baseUrl] [outDir] [--full] [--routes=/,/app/overview]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const args = process.argv.slice(2)
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:4173'
const out = args.find((a) => !a.startsWith('http') && !a.startsWith('--')) ?? 'qa-reports/shots'
const full = args.includes('--full')
const routesArg = args.find((a) => a.startsWith('--routes='))
const routes = routesArg
  ? routesArg.slice(9).split(',')
  : ['/', '/app/overview', '/app/projects', '/app/tasks', '/app/automations', '/app/analytics', '/app/integrations', '/app/assistant']
const viewports = [
  { name: 'desktop', width: 1440, height: 900, dpr: 1 },
  { name: 'tablet', width: 820, height: 1180, dpr: 1 },
  { name: 'mobile', width: 390, height: 844, dpr: 2 },
]

mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const errors = []
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${vp.name}] ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`[${vp.name}] ${e.message}`))
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: 'networkidle' })
    if (full) {
      // Scroll through so whileInView reveals settle.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y)
          await new Promise((res) => setTimeout(res, 60))
        }
        window.scrollTo(0, 0)
      })
    }
    await page.waitForTimeout(500)
    const name = r === '/' ? 'home' : r.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-')
    await page.screenshot({ path: `${out}/${vp.name}-${name}.png`, fullPage: full })
  }
  await ctx.close()
}
await browser.close()
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors')
