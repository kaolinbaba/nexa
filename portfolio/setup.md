# Setup

Requirements: Node.js ≥ 22, Google Chrome (used by Playwright and Lighthouse).

```bash
cd sites/nexa
npm ci                 # install exact dependency versions
npm run dev            # dev server → http://localhost:5173
```

Routes:
- `/`: marketing site
- `/app/overview`: dashboard (also `/app/projects`, `/tasks`, `/automations`, `/analytics`, `/integrations`, `/assistant`)
- `/app/overview?tour=1`: guided tour (what "Explore Live Demo" opens)

## Quality checks
```bash
npm run typecheck      # TypeScript
npm run lint           # ESLint (0 warnings allowed)
npm run build          # production build → dist/
npm run qa:fast        # types + lint + build + security + Playwright + links
npm run qa             # everything above + Lighthouse budgets
```
Reports go to `qa-reports/` (`playwright/index.html`, `lighthouse/*.html`, `summary.json`).

## Regenerate portfolio images
```bash
npm run build
npx vite preview --port 4173 --strictPort &
node qa/portfolio.mjs http://localhost:4173   # → portfolio/screenshots, portfolio/cover.png, public/og-image.png
```

## Demo data
All data lives in `src/app/data.ts` (fictional). Visitor changes are saved in `localStorage`
under `nexa-demo-v2`. Use **Reset demo data** in the sidebar to restore the seed.

## Deployment
Not deployed. It is a static SPA: any static host works, as long as unknown paths fall back to
`index.html` so `/app/*` deep links load.
