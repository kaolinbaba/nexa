// GitHub Pages has no SPA rewrites. After `vite build`, give every known route a real HTML file
// (Pages serves /nexa/app/tasks from app/tasks.html with a 200 and no trailing-slash redirect),
// and add 404.html as a catch-all for anything else.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'

const sections = ['overview', 'projects', 'tasks', 'automations', 'analytics', 'integrations', 'assistant']
mkdirSync('dist/app', { recursive: true })
copyFileSync('dist/index.html', 'dist/app.html')
for (const s of sections) copyFileSync('dist/index.html', `dist/app/${s}.html`)
copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')
console.log(`Pages fallback: ${sections.length + 1} route files + 404.html`)
