# Nexa — brief

**Project type:** Independent portfolio concept (not client work, not a real product).
**Owner:** Studio portfolio (Upwork showcase).

## Product (fictional)
Nexa is a premium B2B SaaS platform that combines AI workflow automation, team productivity,
project & task management, business analytics, integrations and AI-assisted operations.

**Value proposition:** "Smarter workflows, beautifully connected."

## Audience
Founders, startups, digital agencies, creative teams, marketing departments and SMBs that want
to manage work and automate repetitive processes from one platform.

## Primary goal
Get visitors into the working demo. Success = a visitor reaches the interactive dashboard.

| Priority | Action | CTA |
|---|---|---|
| 1 | Explore the interactive product demo | **Explore Live Demo** → `/app/overview?tour=1` (guided tour) |
| 2 | Open the SaaS dashboard | **View Dashboard** → `/app/overview` |
| 3 | Discover features & capabilities | in-page sections |

## Deliverables
1. Marketing site: nav, cinematic hero, animated product preview, features, workflow automation
   explainer, analytics preview, integrations, product walkthrough, illustrative pricing, final CTA, footer.
2. Interactive dashboard: Overview, Projects, Tasks, Automations, Analytics, Integrations, AI Assistant
   preview — with working navigation, tabs, filters, project selection, task status changes,
   automation toggles, analytics period selection, dialogs, responsive mobile navigation.
3. Portfolio package in `portfolio/`.

## Constraints
- Dark brand: midnight navy #0A0F1E, brand blue #3B82F6, electric violet #885CF6, cyan #22D3EE,
  graphite surfaces, off-white text, slate secondary text. Fine grain, soft light, restrained gradients.
- Avoid: white panels, template-looking dashboards, excessive glow/gradients, random 3D,
  unnecessary animation, fake/non-functional controls.
- No backend, auth, billing, paid APIs, database or deployment. Demo state may persist in localStorage.
- **No fabricated proof:** no real customers, logos, testimonials, metrics, certifications or history.
  All data in the dashboard is labeled as demo data. Integrations are shown as "concept connectors",
  not working production integrations. Third-party brand logos are **not** used — integrations use
  generic category glyphs + names (text) to avoid implying partnerships.

## Assumptions
- ASSUMPTION: English only, single-page marketing site + client-side routed app (`/`, `/app/*`).
- ASSUMPTION: Pricing is illustrative and labeled as such; plans are not purchasable.
- ASSUMPTION: Integration names (e.g. "Slack", "GitHub") may appear as plain text in demo data as
  *concept* connectors; no logos, no claims of official partnership.
