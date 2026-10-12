// Report elements wider than the viewport. Usage: node qa/overflow.mjs <url> <width>
import { chromium } from '@playwright/test'
const [url, w = '820'] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: +w, height: 1000 } })
await p.goto(url, { waitUntil: 'networkidle' })
console.log(await p.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const out = [`scrollWidth=${document.documentElement.scrollWidth} vw=${vw}`]
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.right > vw + 1) out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 70)} w=${Math.round(r.width)} right=${Math.round(r.right)}`)
  }
  return out.slice(0, 12).join('\n')
}))
await b.close()
