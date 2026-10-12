// GitHub Pages has no SPA rewrites. After `vite build`, give every known route a real
// index.html (so direct visits / refreshes return 200) and add 404.html as a catch-all.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'

const routes = ['app', 'app/overview', 'app/projects', 'app/tasks', 'app/automations', 'app/analytics', 'app/integrations', 'app/assistant']
for (const r of routes) {
  mkdirSync(`dist/${r}`, { recursive: true })
  copyFileSync('dist/index.html', `dist/${r}/index.html`)
}
copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')
console.log(`Pages fallback: ${routes.length} route copies + 404.html`)
