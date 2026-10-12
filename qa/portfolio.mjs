// Portfolio capture: real screenshots of the production build + a cover/OG image composed from them.
// Usage: npm run build && npx vite preview --port 4173 & node qa/portfolio.mjs [baseUrl]
import { chromium } from '@playwright/test'
import { mkdirSync, readFileSync } from 'node:fs'

const base = process.argv[2] ?? 'http://localhost:4173'
const out = 'portfolio/screenshots'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })

async function ctx(width, height, dpr = 2) {
  // Reduced motion renders every animation in its final, settled state.
  const c = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' })
  const page = await c.newPage()
  return { c, page }
}
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)
}
async function shot(page, path, name, { full = false, before } = {}) {
  await page.goto(base + path, { waitUntil: 'networkidle' })
  if (full) await settle(page)
  if (before) await before(page)
  await page.waitForTimeout(450)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full })
  console.log('✓', name)
}

// Desktop
{
  const { c, page } = await ctx(1440, 900)
  await shot(page, '/', '01-desktop-hero')
  await shot(page, '/app/overview', '03-desktop-dashboard-overview')
  await shot(page, '/app/projects?p=orbit', '04-desktop-dashboard-projects')
  await shot(page, '/app/tasks', '05-desktop-dashboard-tasks-board')
  await shot(page, '/app/automations?flow=a1', '06-desktop-dashboard-automation-flow')
  await shot(page, '/app/analytics', '07-desktop-dashboard-analytics')
  await shot(page, '/app/assistant', '08-desktop-dashboard-assistant', {
    before: async (p) => {
      await p.getByRole('button', { name: 'Where can automation save us time?' }).click()
      await p.waitForTimeout(300)
    },
  })
  await shot(page, '/app/overview?tour=1', '09-desktop-guided-tour')
  await shot(page, '/app/overview', '10-desktop-command-palette', {
    before: async (p) => {
      await p.keyboard.press('ControlOrMeta+k')
      await p.keyboard.type('or')
    },
  })
  await c.close()
}
{
  const { c, page } = await ctx(1440, 900, 1)
  await shot(page, '/', '02-desktop-home-full', { full: true })
  await c.close()
}
// Tablet
{
  const { c, page } = await ctx(820, 1180)
  await shot(page, '/app/projects', '11-tablet-dashboard-projects')
  await c.close()
}
// Mobile
{
  const { c, page } = await ctx(390, 844, 3)
  await shot(page, '/', '12-mobile-hero')
  await shot(page, '/app/overview', '14-mobile-dashboard-overview')
  await shot(page, '/app/tasks', '15-mobile-dashboard-tasks')
  await shot(page, '/app/overview', '16-mobile-navigation', {
    before: async (p) => {
      await p.getByRole('button', { name: 'Open navigation' }).click()
    },
  })
  await c.close()
}
{
  const { c, page } = await ctx(390, 844, 2)
  await shot(page, '/', '13-mobile-home-full', { full: true })
  await c.close()
}

// Cover + OG image composed from the real screenshots above.
const img = (n) => `data:image/png;base64,${readFileSync(`${out}/${n}.png`).toString('base64')}`
const mark = readFileSync('public/favicon.svg', 'utf8')
const fonts = ['node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2', 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'].map(
  (f) => `data:font/woff2;base64,${readFileSync(f).toString('base64')}`,
)
function fibers(scale, ox, oy, opacity) {
  // Same ribbon-"N" geometry as the hero motif (src/marketing/HeroFlow.tsx).
  return [-24, -12, 0, 12, 24]
    .map((o, i) => {
      const L = 250 + o
      const R = 1190 + o
      const d = `M${L} 960 L${L} 250 C${L} 185 ${L + 20} 165 ${L + 70} 190 L${R - 70} 600 C${R - 20} 625 ${R} 610 ${R} 560 L${R} 96`
      return `<path d="${d}" stroke="url(#fs)" stroke-width="${(i === 2 ? 1.4 : 1.1) / scale}" stroke-opacity="${i === 2 ? opacity : opacity * 0.45}" fill="none" stroke-linecap="round"/>`
    })
    .join('')
    .replace(/^/, `<g transform="translate(${ox} ${oy}) scale(${scale})">`) + '</g>'
}
function compose(w, h, variant) {
  const big = variant === 'cover'
  const css = `
  @font-face{font-family:SG;src:url(${fonts[0]}) format('woff2');font-weight:300 700}
  @font-face{font-family:IN;src:url(${fonts[1]}) format('woff2');font-weight:100 900}
  *{box-sizing:border-box;margin:0}
  body{width:${w}px;height:${h}px;overflow:hidden;background:#0a0f1e;font-family:IN,sans-serif;color:#e8ecf4;position:relative}
  .abs{position:absolute}
  .grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(31,40,64,.5) 1px,transparent 1px),linear-gradient(to bottom,rgba(31,40,64,.5) 1px,transparent 1px);background-size:64px 64px;-webkit-mask-image:radial-gradient(ellipse 70% 60% at 25% 15%,#000,transparent)}
  .brand{display:flex;align-items:center;gap:18px}
  .brand svg{width:${big ? 72 : 52}px;height:${big ? 72 : 52}px}
  .word{font-family:SG;font-weight:600;font-size:${big ? 46 : 34}px;letter-spacing:-.045em}
  h1{font-family:SG;font-weight:600;letter-spacing:-.045em;line-height:1}
  .grad{background:linear-gradient(100deg,#e8ecf4 10%,#60a5fa 55%,#a78bfa);-webkit-background-clip:text;color:transparent}
  .tag{font-family:ui-monospace,Menlo,monospace;color:#94a3b8;letter-spacing:.12em;text-transform:uppercase}
  .shot{border-radius:${big ? 18 : 12}px;overflow:hidden;border:1px solid #2c3753;box-shadow:0 0 0 1px rgba(255,255,255,.03),0 60px 140px -40px rgba(0,0,0,.95)}
  .shot img{display:block;width:100%}
  .phone{border-radius:${big ? 54 : 40}px;padding:${big ? 9 : 7}px;background:linear-gradient(160deg,#2c3753,#141b2d 40%,#0b1020);box-shadow:0 0 0 1px rgba(255,255,255,.06),0 50px 120px -30px rgba(0,0,0,.95)}
  .phone img{display:block;width:100%;border-radius:${big ? 46 : 34}px}
  .glow{position:absolute;border-radius:50%;filter:blur(110px)}
  body::after{content:'';position:absolute;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}`
  const defs = `<defs><linearGradient id="fs" x1="250" y1="0" x2="1190" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#3B82F6"/><stop offset=".55" stop-color="#885CF6"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>`
  if (big) {
    return `<!doctype html><html><head><style>${css}</style></head><body>
    <div class="grid"></div>
    <div class="glow" style="left:620px;top:520px;width:900px;height:520px;background:rgba(59,130,246,.22)"></div>
    <div class="glow" style="left:1000px;top:380px;width:600px;height:600px;background:rgba(136,92,246,.26)"></div>
    <svg class="abs" style="left:0;top:0;-webkit-mask-image:radial-gradient(ellipse 760px 230px at 640px 320px,transparent 80%,#000 100%)" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${fibers(1.05, 40, -40, 0.7)}</svg>
    <div class="abs brand" style="left:96px;top:84px">${mark}<span class="word">nexa</span></div>
    <h1 class="abs" style="left:92px;top:196px;font-size:108px;width:1400px">Smarter workflows,<br><span class="grad">beautifully connected.</span></h1>
    <p class="abs tag" style="left:98px;top:440px;font-size:21px">SaaS concept · brand · UI/UX · React dashboard</p>
    <div class="abs shot" style="left:96px;top:530px;width:1240px">${`<img src="${img('03-desktop-dashboard-overview')}">`}</div>
    <div class="abs phone" style="left:1196px;top:430px;width:318px">${`<img src="${img('14-mobile-dashboard-overview')}">`}</div>
    </body></html>`
  }
  return `<!doctype html><html><head><style>${css}</style></head><body>
  <div class="grid"></div>
  <div class="glow" style="left:560px;top:180px;width:640px;height:460px;background:rgba(136,92,246,.26)"></div>
  <svg class="abs" style="left:0;top:0;-webkit-mask-image:radial-gradient(ellipse 330px 170px at 300px 230px,transparent 80%,#000 100%)" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${fibers(0.62, -60, -30, 0.7)}</svg>
  <div class="abs brand" style="left:64px;top:58px">${mark}<span class="word">nexa</span></div>
  <h1 class="abs" style="left:62px;top:150px;font-size:60px;width:520px">Smarter workflows,<br><span class="grad">beautifully connected.</span></h1>
  <p class="abs tag" style="left:66px;top:392px;font-size:15px;line-height:1.8">SaaS concept · interactive demo<br>Brand · UI/UX · React</p>
  <div class="abs shot" style="left:600px;top:92px;width:780px">${`<img src="${img('03-desktop-dashboard-overview')}">`}</div>
  </body></html>`
}
for (const [variant, w, h, path] of [
  ['cover', 1600, 1200, 'portfolio/cover.png'],
  ['og', 1200, 630, 'public/og-image.png'],
]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage()
  await page.setContent(compose(w, h, variant), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path })
  console.log('✓', path)
}
await browser.close()
