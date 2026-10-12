// Basic security checks for a static front-end build.
// 1) npm audit (production deps, high+)  2) secrets in dist/ and src/  3) source maps shipped
// 4) inline event handlers / javascript: URLs / http:// mixed content in dist HTML
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const problems = []
const walk = (dir) => (existsSync(dir) ? readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p] }) : [])

// 1. Dependency vulnerabilities
try {
  execSync('npm audit --omit=dev --audit-level=high', { stdio: 'pipe' })
} catch (e) {
  problems.push(`npm audit: high/critical vulnerabilities in production deps\n${e.stdout?.toString().split('\n').slice(-6).join('\n')}`)
}

// 2. Secret patterns (never print the match itself)
const SECRET_PATTERNS = [
  ['Google API key', /AIza[0-9A-Za-z_-]{35}/],
  ['Stitch/Google AQ key', /\bAQ\.[0-9A-Za-z_-]{30,}/],
  ['OpenAI/Anthropic-style key', /\bsk-(ant-)?[A-Za-z0-9_-]{20,}/],
  ['fal key', /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:[0-9a-f]{32}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{36,}/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['Private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
]
for (const file of [...walk('dist'), ...walk('src')]) {
  if (/\.(woff2?|png|jpe?g|webp|avif|gif|ico)$/i.test(file)) continue
  const text = readFileSync(file, 'utf8')
  for (const [label, re] of SECRET_PATTERNS) if (re.test(text)) problems.push(`possible ${label} in ${file}`)
}
for (const f of readdirSync('.')) if (/^\.env(\..+)?$/.test(f) && f !== '.env.example') {
  try { execSync(`git check-ignore -q ${f}`) } catch { problems.push(`${f} exists and is NOT git-ignored`) }
}

// 3. Source maps
const maps = walk('dist').filter((f) => f.endsWith('.map'))
if (maps.length) problems.push(`source maps shipped in dist: ${maps.length} files`)

// 4. Risky HTML patterns
for (const file of walk('dist').filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8')
  if (/\son[a-z]+\s*=\s*["']/i.test(html)) problems.push(`inline event handler in ${file}`)
  if (/href\s*=\s*["']javascript:/i.test(html)) problems.push(`javascript: URL in ${file}`)
  if (/(src|href)\s*=\s*["']http:\/\//i.test(html)) problems.push(`insecure http:// resource in ${file}`)
}
if (!existsSync('dist')) problems.push('dist/ not found — run the build first')

if (problems.length) {
  console.error('✗ Security checks failed:\n- ' + problems.join('\n- '))
  process.exit(1)
}
console.log('✓ Security checks passed (npm audit, secrets scan, source maps, risky HTML)')
