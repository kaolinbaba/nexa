// Screenshot each <section>/<header>/<footer> of a route separately (for visual review).
// Usage: node qa/sections.mjs <url> <outDir> <width> <height>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
const [url, out = 'qa-reports/sections', w = '1440', h = '900'] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: 'reduce' })
await p.goto(url, { waitUntil: 'networkidle' })
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)) } scrollTo(0, 0) })
await p.waitForTimeout(400)
const els = await p.$$('body > #root > header, main > section, body > #root > footer')
let i = 0
for (const el of els) await el.screenshot({ path: `${out}/${String(i++).padStart(2, '0')}.png` })
await b.close()
console.log(`${i} sections`)
