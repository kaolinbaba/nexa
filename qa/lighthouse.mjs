// Lighthouse audit (mobile + desktop) with score budgets.
// Usage: node qa/lighthouse.mjs [baseUrl]   (default: http://localhost:4173, must be running)
import { mkdirSync, writeFileSync } from 'node:fs'
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'

const baseUrl = process.argv[2] ?? process.env.QA_BASE_URL ?? 'http://localhost:4173'
// Marketing page + dashboard entry (the demo's main surfaces).
const paths = (process.env.QA_PATHS ?? '/,/app/overview').split(',').map((p) => p.trim()).filter(Boolean)
const BUDGET = {
  mobile: { performance: 0.85, accessibility: 0.95, 'best-practices': 0.95, seo: 0.9 },
  desktop: { performance: 0.95, accessibility: 0.95, 'best-practices': 0.95, seo: 0.9 },
}

mkdirSync('qa-reports/lighthouse', { recursive: true })
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] })
let failed = false
const rows = []
try {
  for (const path of paths) {
    for (const form of ['mobile', 'desktop']) {
      const url = new URL(path, baseUrl).href
      const result = await lighthouse(url, { port: chrome.port, output: 'html', logLevel: 'error' }, form === 'desktop' ? desktopConfig : undefined)
      const name = `${path === '/' ? 'home' : path.replace(/\W+/g, '-')}-${form}`
      writeFileSync(`qa-reports/lighthouse/${name}.html`, result.report)
      const { categories, audits } = result.lhr
      const row = { page: path, form }
      for (const [key, min] of Object.entries(BUDGET[form])) {
        const score = categories[key].score ?? 0
        row[key] = Math.round(score * 100)
        if (score < min) failed = true
      }
      row.LCP = audits['largest-contentful-paint'].displayValue
      row.CLS = audits['cumulative-layout-shift'].displayValue
      row.TBT = audits['total-blocking-time'].displayValue
      rows.push(row)
    }
  }
} finally {
  await chrome.kill()
}
console.table(rows)
console.log(`Budgets: ${JSON.stringify(BUDGET)}`)
console.log(failed ? '✗ Lighthouse budget FAILED' : '✓ Lighthouse budgets met')
process.exit(failed ? 1 : 0)
