// Master QA runner: one command, every essential check, one summary.
//   npm run qa                    full suite
//   npm run qa:fast               skip Lighthouse
//   QA_PATHS="/,/about" npm run qa  audit several routes
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const skipLighthouse = process.argv.includes('--skip-lighthouse')
const PORT = 4173
const BASE = `http://localhost:${PORT}`
const results = []

function run(name, cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const started = Date.now()
    console.log(`\n▶ ${name}: ${cmd} ${args.join(' ')}`)
    const child = spawn(cmd, args, { stdio: 'inherit', shell: false, ...opts })
    child.on('close', (code) => {
      results.push({ check: name, status: code === 0 ? 'PASS' : 'FAIL', seconds: ((Date.now() - started) / 1000).toFixed(1) })
      resolve(code === 0)
    })
  })
}

async function waitFor(url, ms = 30_000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return true } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

const buildOk =
  (await run('TypeScript', 'npx', ['tsc', '-b'])) &
  (await run('ESLint', 'npx', ['eslint', '.', '--max-warnings=0'])) &
  (await run('Production build', 'npx', ['vite', 'build']))

if (buildOk) {
  await run('Security', 'node', ['qa/security.mjs'])
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true })
  try {
    if (!(await waitFor(BASE))) throw new Error('preview server did not start')
    process.env.QA_BASE_URL = BASE
    await run('Playwright (smoke, layout, a11y, content, images, motion)', 'npx', ['playwright', 'test'])
    const paths = (process.env.QA_PATHS ?? '/').split(',').map((p) => new URL(p.trim(), BASE).href)
    await run('Broken links', 'npx', ['linkinator', ...paths, '--recurse', '--skip', '^(?!http://localhost)', '--timeout', '10000'])
    if (!skipLighthouse) await run('Lighthouse', 'node', ['qa/lighthouse.mjs', BASE])
  } finally {
    try { process.kill(-server.pid) } catch { /* already exited */ }
  }
} else {
  results.push({ check: 'Remaining checks', status: 'SKIPPED (build stage failed)', seconds: '-' })
}

mkdirSync('qa-reports', { recursive: true })
writeFileSync('qa-reports/summary.json', JSON.stringify({ at: new Date().toISOString(), results }, null, 2))
console.log('\n══════════ QA SUMMARY ══════════')
console.table(results)
console.log('Reports: qa-reports/ (playwright/index.html, lighthouse/*.html, screenshots/)')
const failed = results.some((r) => r.status !== 'PASS')
console.log(failed ? '✗ QA FAILED' : '✓ QA PASSED')
process.exit(failed ? 1 : 0)
