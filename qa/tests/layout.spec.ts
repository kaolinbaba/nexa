import { expect, test } from '@playwright/test'
import { PATHS, settle } from './helpers.ts'

// Responsive layout, typography and spacing heuristics.
for (const path of PATHS) {
  test(`layout: ${path} has no horizontal overflow`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    await settle(page)
    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const offenders: string[] = []
      for (const el of Array.from(document.querySelectorAll('body *'))) {
        const r = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        if (style.position === 'fixed' || r.width === 0) continue
        if (r.right > vw + 1 || r.left < -1) {
          // Ignore elements clipped by an overflow-hidden ancestor.
          let clipped = false
          for (let p = el.parentElement; p; p = p.parentElement) {
            const o = getComputedStyle(p).overflowX
            if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break }
          }
          if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${(el.className?.toString() ?? '').slice(0, 40)} right=${Math.round(r.right)} vw=${vw}`)
        }
      }
      return { scrollWidth: document.documentElement.scrollWidth, vw, offenders: offenders.slice(0, 10) }
    })
    expect(overflow.offenders, 'elements overflowing the viewport').toEqual([])
    expect(overflow.scrollWidth, 'document scrollWidth').toBeLessThanOrEqual(overflow.vw + 1)
  })

  test(`typography: ${path} text is legible`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    const issues = await page.evaluate(() => {
      const out: string[] = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      const seen = new Set<Element>()
      while (walker.nextNode()) {
        const el = walker.currentNode.parentElement
        if (!el || seen.has(el) || !walker.currentNode.textContent?.trim()) continue
        seen.add(el)
        const s = getComputedStyle(el)
        if (s.visibility === 'hidden' || s.display === 'none' || el.closest('[aria-hidden="true"], .sr-only')) continue
        const size = parseFloat(s.fontSize)
        const lh = s.lineHeight === 'normal' ? size * 1.2 : parseFloat(s.lineHeight)
        const text = walker.currentNode.textContent.trim().slice(0, 30)
        if (size < 12) out.push(`font-size ${size}px < 12px: "${text}"`)
        // Body copy (>= 60 chars) needs comfortable line-height.
        if (walker.currentNode.textContent.trim().length >= 60 && lh / size < 1.3) out.push(`line-height ${(lh / size).toFixed(2)} < 1.3: "${text}"`)
      }
      const h1s = document.querySelectorAll('h1').length
      if (h1s !== 1) out.push(`expected exactly one <h1>, found ${h1s}`)
      // Heading levels must not skip (h2 -> h4).
      let prev = 0
      for (const h of Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))) {
        const lvl = Number(h.tagName[1])
        if (prev && lvl > prev + 1) out.push(`heading level skips from h${prev} to h${lvl}: "${h.textContent?.trim().slice(0, 30)}"`)
        prev = lvl
      }
      return out
    })
    expect(issues).toEqual([])
  })

  test(`spacing: ${path} tap targets are large enough`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'tap targets matter on touch viewports')
    await page.goto(path, { waitUntil: 'networkidle' })
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('a[href], button, [role="button"], input, select, textarea'))
        .filter((el) => {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || el.closest('.sr-only') || el.classList.contains('sr-only')) return false
          // Inline text links inside paragraphs are exempt (WCAG 2.5.8 exception).
          if (el.tagName === 'A' && el.closest('p')) return false
          return r.width < 24 || r.height < 24
        })
        .map((el) => `${el.tagName.toLowerCase()} "${el.textContent?.trim().slice(0, 20)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`),
    )
    expect(small, 'interactive elements smaller than 24x24 (WCAG 2.5.8)').toEqual([])
  })
}
