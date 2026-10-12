// Smoke-test a deployed copy (GitHub Pages or the local mock) in real Chrome.
// Usage: node qa/pages-smoke.mjs https://kaolinbaba.github.io/nexa/
import { chromium } from '@playwright/test'

const base = (process.argv[2] ?? 'http://localhost:4180/nexa/').replace(/\/?$/, '/')
const results = []
const check = (name, ok, detail = '') => results.push({ check: name, result: ok ? 'PASS' : 'FAIL', detail })

const browser = await chromium.launch({ channel: 'chrome' })
const errors = []
const failed = []
async function page(viewport) {
  const ctx = await browser.newContext({ viewport })
  const p = await ctx.newPage()
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  p.on('pageerror', (e) => errors.push(e.message))
  p.on('response', (r) => r.status() >= 400 && !r.url().includes('/app/bogus') && failed.push(`${r.status()} ${r.url()}`))
  return p
}

const p = await page({ width: 1440, height: 900 })
const res = await p.goto(base, { waitUntil: 'networkidle' })
check('Landing page 200', res.status() === 200, String(res.status()))
check('Hero headline renders', (await p.locator('h1').innerText()).includes('Smarter workflows'))
const styled = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
check('Stylesheet applied (midnight background)', styled === 'rgb(10, 15, 30)', styled)
const fonts = await p.evaluate(async () => {
  await document.fonts.ready
  return ['Inter Variable', 'Space Grotesk Variable'].map((f) => document.fonts.check(`16px "${f}"`))
})
check('Web fonts loaded (Inter, Space Grotesk)', fonts.every(Boolean), JSON.stringify(fonts))
const icon = await p.evaluate(() => fetch(document.querySelector('link[rel=icon]').href).then((r) => r.status))
check('Favicon loads', icon === 200, String(icon))

await p.getByRole('link', { name: /Explore Live Demo/ }).first().click()
await p.waitForURL(/\/nexa\/app\/overview\?tour=1/)
const tour = p.getByRole('region', { name: 'Welcome to the Nexa demo' })
await tour.waitFor({ timeout: 8000 }).catch(() => {})
check('"Explore Live Demo" opens guided tour', await tour.isVisible())
await p.getByRole('button', { name: 'Next' }).click()
await p.waitForURL(/\/nexa\/app\/projects\?tour=2/)
check('Tour "Next" navigates to Projects', await p.getByRole('heading', { level: 1, name: 'Projects' }).isVisible())

await p.goto(base, { waitUntil: 'networkidle' })
await p.getByRole('link', { name: 'View Dashboard' }).first().click()
await p.waitForURL(/\/nexa\/app\/overview$/)
check('"View Dashboard" opens dashboard', (await p.locator('h1').innerText()).includes('Maya'))

await p.getByRole('navigation', { name: 'Dashboard' }).getByRole('link', { name: 'Tasks' }).click()
await p.waitForURL(/\/nexa\/app\/tasks/)
check('Sidebar navigation works', await p.getByRole('heading', { level: 1, name: 'Tasks' }).isVisible())
const r2 = await p.reload({ waitUntil: 'networkidle' })
check('Refresh on /app/tasks', r2.status() === 200 && (await p.getByRole('heading', { level: 1, name: 'Tasks' }).isVisible()), String(r2.status()))
const r3 = await p.goto(base + 'app/analytics', { waitUntil: 'networkidle' })
check('Direct visit /app/analytics', r3.status() === 200 && (await p.getByRole('heading', { level: 1, name: 'Analytics' }).isVisible()), String(r3.status()))
await p.getByRole('tab', { name: '7 days' }).click()
check('Analytics period switch', await p.getByRole('heading', { name: 'Throughput · 7 days' }).isVisible())
// The fallback document itself is served with HTTP 404 (by design); ignore that one console line.
const before = errors.length
await p.goto(base + 'app/bogus', { waitUntil: 'networkidle' })
await p.waitForURL(/\/nexa\/app\/overview/)
errors.splice(before).filter((e) => !/status of 404/.test(e)).forEach((e) => errors.push(e))
check('Unknown route falls back to dashboard', true)
await p.getByRole('link', { name: 'Back to website' }).click()
await p.waitForURL((u) => u.pathname === new URL(base).pathname)
check('"Back to website" returns to landing', true)

const m = await page({ width: 390, height: 844 })
await m.goto(base, { waitUntil: 'networkidle' })
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
check('Mobile landing: no horizontal overflow', overflow <= 1, `${overflow}px`)
await m.goto(base + 'app/overview', { waitUntil: 'networkidle' })
await m.getByRole('button', { name: 'Open navigation' }).click()
await m.getByRole('dialog', { name: 'Navigation' }).getByRole('link', { name: 'Automations' }).click()
await m.waitForURL(/\/nexa\/app\/automations/)
check('Mobile drawer navigation', await m.getByRole('heading', { level: 1, name: 'Automations' }).isVisible())

check('No console errors', errors.length === 0, errors.slice(0, 3).join(' | '))
check('No failed requests', failed.length === 0, failed.slice(0, 3).join(' | '))
await browser.close()
console.table(results)
const bad = results.filter((r) => r.result === 'FAIL').length
console.log(bad ? `✗ ${bad} checks failed` : `✓ all ${results.length} checks passed`)
process.exit(bad ? 1 : 0)
