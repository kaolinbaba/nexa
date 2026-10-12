# Technology list

**Runtime (6 dependencies)**
- React 19 (`react`, `react-dom`)
- Motion (`motion`): scroll reveals and reduced-motion detection
- Lucide (`lucide-react`): SVG icon set
- Fontsource variable fonts: Inter (UI) and Space Grotesk (display), self-hosted

**Build & language**
- TypeScript 6 (strict)
- Vite 8
- Tailwind CSS v4 (design tokens in `@theme`)

**Built in-house (no library)**
- History-API router (`src/lib/router.ts`)
- Responsive, keyboard-inspectable SVG area chart (`src/components/charts/AreaChart.tsx`)
- Demo store: `useReducer` + `localStorage` persistence (`src/app/store.ts`)
- Logo and app icon (hand-written SVG)

**Quality tooling**
- ESLint 9 with typescript-eslint, react-hooks and jsx-a11y
- Playwright (desktop / tablet / mobile) with axe-core WCAG 2.2 AA audits
- Lighthouse budgets (mobile + desktop), linkinator broken-link check, security check
- Google Stitch (MCP): early design exploration only

**Not used, by design:** backend, database, authentication, payments, paid APIs, analytics trackers.
