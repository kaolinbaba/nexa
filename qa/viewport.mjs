// Viewport screenshot at a scroll offset. Usage: node qa/viewport.mjs <url> <out.png> <w> <h> [scrollY] [motion=reduce|no-preference] [waitMs]
import { chromium } from '@playwright/test'
const [url, out, w = '1440', h = '900', y = '0', motion = 'reduce', wait = '600'] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: motion, deviceScaleFactor: +w < 500 ? 2 : 1 })
await p.goto(url, { waitUntil: 'networkidle' })
if (+y) { await p.evaluate((yy) => window.scrollTo(0, yy), +y); }
await p.waitForTimeout(+wait)
await p.screenshot({ path: out })
await b.close()
