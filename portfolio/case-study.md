# Nexa: case study

> **Independent concept project.** Nexa is a fictional product I designed and built as a portfolio
> piece. It is not client work. All company names, people, numbers and pricing are invented demo data.

## The brief
Design and build a premium B2B SaaS brand and frontend for an AI operations platform that combines
workflow automation, projects and tasks, analytics and integrations. The audience is founders,
agencies, creative teams and SMBs. The site needed to get visitors into a **working** product demo,
with no sign-up, backend or fake controls.

**Value proposition:** *Smarter workflows, beautifully connected.*

## Direction: "Night Shift Console"
I explored three directions: heavy glassmorphism, a technical blueprint style, and a calm "console"
look. I chose the console direction because it puts the product UI front and center instead of
decorating around it.

- **Midnight canvas, graphite planes, hairlines instead of shadows.** Depth comes from 1px borders
  and a faint top highlight, not from glow.
- **One accent at a time.** Blue means action, violet means AI and automation, cyan means live data.
  Violet and cyan only appear as soft light behind surfaces.
- **Fine grain** over everything to stop gradient banding and add texture.
- **Motion that explains.** Automation runs step by step, charts draw in, tasks move. Everything else
  stays still, and reduced-motion users see the final state.

Google Stitch was used for one early exploration pass. Its generated hero (a centered headline over
a framed console preview, pipeline nodes, mono telemetry chips) confirmed the layout. I kept the
token values my own and rejected its low-contrast metadata grey, which failed WCAG AA.

## Brand identity
A ribbon-style **N** built from three strokes of identical width and identical round terminals on a
40-unit grid. The ribbon genuinely weaves: the diagonal folds over the left stroke and tucks under
the right, and the colour travels blue → violet → cyan along it. It stays crisp from a 16px favicon to an
app icon.

**Signature motif:** the same N, drawn at architectural scale as a bundle of fine fibers, frames the
hero. Work flows out of the product, arcs behind the headline and returns as results, with small
event chips ("Brief received" → "Kickoff ready" → "Team notified") and light pulses travelling the
path. It's pure SVG/CSS with no 3D library, and it's switched off for reduced-motion users.

## What I built
**Marketing site.** Sticky glass navigation, a hero with a live animated product miniature, a bento
feature grid, an interactive "Run sample flow" automation demo, an analytics preview with a working
period switcher and an inspectable chart, an integrations hub, a tabbed four-step walkthrough,
illustrative pricing with a billing toggle, a final CTA and a footer.

**Interactive dashboard.** Seven sections: Overview, Projects, Tasks, Automations, Analytics,
Integrations and the AI Assistant. Every control works:
- Guided tour (the "Explore Live Demo" CTA) that moves across sections and highlights each feature
- Task status changes, filters, search, board/list views and a validated new-task form
- Moving a task to *Review* fires the "notify approver" automation (simulated) and logs it to Activity
- Automation toggles plus a step-by-step simulated test run in a dialog
- Analytics periods (7d / 30d / 90d / 12m), a keyboard-inspectable chart and a data-table fallback
- A rule-based assistant that answers from the live demo state and can take actions, such as enabling a suggested flow
- A ⌘K command palette, a mobile drawer and a bottom tab bar
- Demo state saved to `localStorage`, with a one-click reset. Everything is clearly labeled as simulated.

## Engineering
- React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 design tokens (`@theme`)
- Six runtime dependencies. A tiny custom History-API router, no router library. SVG charts drawn
  at their real pixel width, no chart library. The dashboard is code-split from the marketing page.
- Accessible patterns: ARIA tabs with roving focus, native `<dialog>` for modals, `role="switch"`
  toggles, a combobox/listbox command palette, live regions for toasts and the assistant, and a skip link

## Quality
| Check | Result |
|---|---|
| TypeScript strict, ESLint (incl. jsx-a11y) | 0 errors, 0 warnings |
| Playwright: smoke, layout, typography, tap targets, motion, axe WCAG 2.2 AA, keyboard, 13 interaction flows, across desktop / tablet / mobile | 202 passed, 0 failed |
| Lighthouse, marketing page | Mobile 97 / 100 / 100 / 100 · Desktop 100 / 100 / 100 / 100 |
| Lighthouse, dashboard | Mobile 98 / 100 / 100 / 100 · Desktop 100 / 100 / 100 / 100 |
| CLS | 0 on all audited pages |

*(Lighthouse order: Performance / Accessibility / Best practices / SEO. Local production build, October 2026.)*

## What I'd do next
A real backend and authentication, collaborative presence on boards, a visual flow builder canvas,
and an LLM-backed assistant behind the same interface.
