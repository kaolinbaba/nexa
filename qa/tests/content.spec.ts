import { expect, test } from '@playwright/test'
import { PATHS } from './helpers.ts'

// Missing content, placeholder text, SEO basics, image hygiene, link safety.
const PLACEHOLDER = /lorem ipsum|dolor sit amet|\bTODO\b|\bFIXME\b|\bTBD\b|placeholder text|your (company|name) here|example\.com|\[insert/i

for (const path of PATHS) {
  test(`content: ${path} has no placeholders and complete metadata`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'content checks are viewport-independent')
    await page.goto(path, { waitUntil: 'networkidle' })
    const meta = await page.evaluate(() => ({
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '',
      lang: document.documentElement.lang,
      viewport: !!document.querySelector('meta[name="viewport"]'),
      text: document.body.innerText,
      emptyLinks: Array.from(document.querySelectorAll('a')).filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').map((a) => a.outerHTML.slice(0, 80)),
      unsafeBlank: Array.from(document.querySelectorAll('a[target="_blank"]')).filter((a) => !/noopener|noreferrer/.test(a.getAttribute('rel') ?? '')).map((a) => a.getAttribute('href')),
    }))
    expect(meta.title.length, '<title> present').toBeGreaterThan(0)
    expect(meta.title.length, '<title> ≤ 60 chars').toBeLessThanOrEqual(60)
    expect(meta.description.length, 'meta description present').toBeGreaterThan(0)
    expect(meta.lang, '<html lang>').not.toBe('')
    expect(meta.viewport, 'meta viewport').toBe(true)
    expect(meta.text.match(PLACEHOLDER)?.[0] ?? null, 'placeholder text found').toBeNull()
    expect(meta.emptyLinks, 'links without real href').toEqual([])
    expect(meta.unsafeBlank, 'target=_blank without rel=noopener').toEqual([])
  })

  test(`images: ${path} are sized, described and optimized`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    const issues = await page.evaluate(async () => {
      const out: string[] = []
      for (const img of Array.from(document.images)) {
        const src = img.currentSrc || img.src
        if (!img.hasAttribute('alt')) out.push(`missing alt: ${src}`)
        if (!img.getAttribute('width') || !img.getAttribute('height')) {
          if (!getComputedStyle(img).aspectRatio || getComputedStyle(img).aspectRatio === 'auto') out.push(`no width/height or aspect-ratio (CLS risk): ${src}`)
        }
        const rendered = img.getBoundingClientRect().width * devicePixelRatio
        if (img.naturalWidth && rendered && img.naturalWidth > rendered * 2.5) out.push(`oversized ${img.naturalWidth}px for ${Math.round(rendered)}px slot: ${src}`)
        if (/\.(png|jpe?g)(\?|$)/i.test(src) && img.naturalWidth > 600) out.push(`large raster not in AVIF/WebP: ${src}`)
      }
      for (const entry of performance.getEntriesByType('resource') as PerformanceResourceTiming[]) {
        if (entry.initiatorType === 'img' && entry.encodedBodySize > 400_000) out.push(`image > 400 KB (${Math.round(entry.encodedBodySize / 1024)} KB): ${entry.name}`)
      }
      return out
    })
    expect(issues).toEqual([])
  })
}
