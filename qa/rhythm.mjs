// Print each landing section's height and the empty gap between visible content blocks.
// Usage: node qa/rhythm.mjs <url> <width>
import { chromium } from '@playwright/test'
const [url = 'http://localhost:5173/', w = '1440'] = process.argv.slice(2)
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: +w, height: 900 }, reducedMotion: 'reduce' })
await p.goto(url, { waitUntil: 'networkidle' })
console.log(await p.evaluate(() => {
  const rows = []
  let prevBottom = null
  for (const s of document.querySelectorAll('main > section, body footer')) {
    const r = s.getBoundingClientRect()
    // first/last visible content inside the section (ignore decorative absolute layers)
    const kids = [...s.querySelectorAll('h1,h2,h3,p,ul,figure,.panel,button,a')].filter((e) => getComputedStyle(e).position !== 'absolute' && e.getBoundingClientRect().height > 0)
    const top = Math.min(...kids.map((k) => k.getBoundingClientRect().top)) + scrollY
    const bottom = Math.max(...kids.map((k) => k.getBoundingClientRect().bottom)) + scrollY
    const label = (s.getAttribute('aria-labelledby') || s.id || s.tagName).padEnd(20)
    rows.push(`${label} h=${Math.round(r.height)}  contentGapAbove=${prevBottom === null ? '-' : Math.round(top - prevBottom)}`)
    prevBottom = bottom
  }
  return rows.join('\n')
}))
await b.close()
