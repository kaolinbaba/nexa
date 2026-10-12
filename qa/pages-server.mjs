// Mimics GitHub Pages for local testing: serves dist/ under /nexa/, dir → index.html,
// missing → 404.html (status 404). No SPA rewrites. Usage: node qa/pages-server.mjs [port]
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
const port = Number(process.argv[2] ?? 4180)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain' }
createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  if (!url.pathname.startsWith('/nexa/') && url.pathname !== '/nexa') { res.writeHead(404); return res.end('not found') }
  let file = join('dist', decodeURIComponent(url.pathname.replace(/^\/nexa/, '')))
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  let status = 200
  if (!existsSync(file)) { file = 'dist/404.html'; status = 404 }
  res.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
}).listen(port, () => console.log(`Pages mock on http://localhost:${port}/nexa/`))
