import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PATHS, settle } from './helpers.ts'

// axe-core WCAG 2.2 AA audit. Fails on serious/critical; logs moderate/minor.
for (const path of PATHS) {
  test(`a11y: ${path} has no serious WCAG violations`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    await settle(page)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze()
    await testInfo.attach('axe-results.json', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' })
    const blocking = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.impact} ${v.id}: ${v.help} (${v.nodes.length} nodes) → ${v.nodes[0]?.target.join(' ')}`)
    const minor = results.violations.filter((v) => !(v.impact === 'serious' || v.impact === 'critical'))
    if (minor.length) console.warn(`[a11y] ${path} non-blocking:`, minor.map((v) => `${v.impact} ${v.id}`).join(', '))
    expect(blocking).toEqual([])
  })

  test(`a11y: ${path} is keyboard navigable`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'keyboard check runs once on desktop')
    await page.goto(path, { waitUntil: 'networkidle' })
    const focusable = await page.locator('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])').count()
    const visited = new Set<string>()
    for (let i = 0; i < Math.min(focusable, 40); i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const s = getComputedStyle(el)
        const visible = s.outlineStyle !== 'none' || s.boxShadow !== 'none'
        return { key: el.outerHTML.slice(0, 80), visible }
      })
      if (!info) continue
      expect(info.visible, `focus indicator visible on ${info.key}`).toBe(true)
      visited.add(info.key)
    }
    expect(visited.size, 'keyboard reaches interactive elements').toBeGreaterThan(0)
  })
}
