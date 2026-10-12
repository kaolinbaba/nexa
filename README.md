# Nexa: premium SaaS concept

> Independent portfolio concept, not a real product or client work. All data is fictional.

**Live demo: https://kaolinbaba.github.io/nexa/**

A brand, marketing site and fully interactive dashboard demo for a fictional AI operations platform.
*Smarter workflows, beautifully connected.*

```bash
npm ci && npm run dev        # http://localhost:5173
npm run qa                   # full QA (types, lint, build, Playwright, a11y, links, Lighthouse)
npm run build:pages          # GitHub Pages build (base /nexa/ + route fallbacks); deployed by .github/workflows/deploy.yml
```

- Marketing site: `/` · Dashboard: `/app/overview` · Guided tour: `/app/overview?tour=1`
- Design system: [`DESIGN.md`](DESIGN.md) · Direction: [`docs/direction.md`](docs/direction.md)
- Portfolio package: [`portfolio/`](portfolio/) (screenshots, cover, case study, Upwork copy, setup)
- Workflow status: [`docs/STATUS.md`](docs/STATUS.md)

Stack: React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Lucide. No backend; demo state lives in `localStorage`.
