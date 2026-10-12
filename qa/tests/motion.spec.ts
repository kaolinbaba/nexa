import { expect, test } from '@playwright/test'
import { PATHS, settle } from './helpers.ts'

// Animation performance & reduced-motion compliance.
const CHEAP = new Set(['transform', 'opacity', 'filter', 'clip-path', 'translate', 'scale', 'rotate', 'offset', 'offsetDistance', 'computedOffset', 'easing', 'composite'])

for (const path of PATHS) {
  test(`motion: ${path} animates compositor-friendly properties only`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'run once')
    await page.goto(path, { waitUntil: 'networkidle' })
    await settle(page)
    const expensive = await page.evaluate((cheap) => {
      const out: string[] = []
      for (const a of document.getAnimations()) {
        const effect = a.effect as KeyframeEffect | null
        for (const frame of effect?.getKeyframes() ?? []) {
          for (const prop of Object.keys(frame)) if (!cheap.includes(prop)) out.push(prop)
        }
      }
      return [...new Set(out)]
    }, [...CHEAP])
    expect(expensive, 'animated layout/paint properties (prefer transform/opacity)').toEqual([])
  })

  test(`motion: ${path} respects prefers-reduced-motion`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'run once')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path, { waitUntil: 'networkidle' })
    await settle(page)
    const running = await page.evaluate(() =>
      document.getAnimations().filter((a) => a.playState === 'running' && (a.effect?.getComputedTiming().iterations ?? 1) === Infinity).length,
    )
    expect(running, 'infinite animations running under reduced motion').toBe(0)
  })

  test(`motion: ${path} main thread stays responsive while scrolling`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'run once')
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.evaluate(() => {
      ;(window as unknown as { __long: number[] }).__long = []
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) (window as unknown as { __long: number[] }).__long.push(e.duration)
      }).observe({ type: 'longtask', buffered: true })
    })
    await settle(page)
    const longTasks = await page.evaluate(() => (window as unknown as { __long: number[] }).__long.filter((d) => d > 100))
    expect(longTasks, 'long tasks > 100ms during scroll').toEqual([])
  })
}
