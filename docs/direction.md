# Nexa — design direction

Per the brief, Claude chose the direction itself (no approval round). Three candidates were considered:

| # | Direction | Verdict |
|---|---|---|
| A | **"Night Shift Console"**: midnight canvas, graphite planes, hairline borders, one blue accent, violet/cyan only as light sources. Product UI is the hero. Mono details for data. | **Chosen.** Fits calm, precise and trustworthy; shows real UI skill rather than decoration. |
| B | "Aurora Glass": heavy glassmorphism, large gradient blobs, frosted cards everywhere | Rejected: too much glow and gradient, and readability suffers |
| C | "Blueprint Grid": technical drawing lines, schematic diagrams, cyan-dominant | Rejected: feels like a dev tool, colder than the brand (agencies and creative teams) |

## Direction A — principles
1. **The product is the hero.** The hero shows a live, animated miniature of the real dashboard.
   Every marketing section previews a real part of `/app`.
2. **Light, not glow.** Violet and cyan show up as soft, out-of-focus light behind surfaces (radial
   gradients at ≤ 22% opacity), never as neon outlines.
3. **Hairlines over shadows.** 1px borders (`--color-line`) separate planes, with a faint inner top
   highlight on elevated surfaces.
4. **One accent at a time.** Blue = action/primary. Violet = AI/automation. Cyan = live data/success.
   Each section uses one accent, with the others in support.
5. **Grain.** A fixed 3% SVG-noise layer adds texture and stops gradient banding.
6. **Motion explains.** Workflow nodes run in sequence, the chart draws in, tasks move between columns.
   Everything else stays still. Reduced motion shows the final state.

## Layout
- Marketing: 1200px content max, 12-column feel, generous vertical rhythm (96–160px between sections on desktop).
- Section order: Nav → Hero (+ live preview) → Capability strip → Features (bento) → Workflow automation
  (interactive run) → Analytics preview → Integrations → Walkthrough (tabbed, 4 steps) → Pricing
  (illustrative) → Final CTA → Footer.
- App: 248px sidebar (collapses to a drawer below 1024px; bottom tab bar under 640px), 56px top bar
  with a search/command hint and a demo badge. Content max 1280px.

## Mobile wireframe (marketing, 390px)
```
[N Nexa]                 [≡]
Eyebrow pill
Smarter workflows,
beautifully connected.
Subcopy (3 lines)
[ Explore Live Demo  → ]
[ View Dashboard       ]
┌ live preview (cropped, scales) ┐
Capabilities (2×3 grid)
Features (stacked cards)
Workflow run (vertical node list)
Analytics card
Integrations (2-col chips)
Walkthrough (tabs scroll-x → panel)
Pricing (stacked, toggle)
CTA · Footer (accordion-free, 2 cols)
```

## Mobile wireframe (app, 390px)
```
[N] Overview        [⌕][☰]
Demo data banner
KPI cards (2×2)
Chart card (period tabs)
Activity list
────────────────────────────
[Home][Projects][Tasks][Flows][More]
```

## Contrast check (AA)
| Pair | Ratio | Use |
|---|---|---|
| #E8ECF4 on #0A0F1E | ~16:1 | body text |
| #94A3B8 on #0A0F1E | ~7.4:1 | secondary text |
| #94A3B8 on #141B2D | ~6.5:1 | secondary text on cards |
| #FFFFFF on #2563EB | 5.2:1 | primary button (brand-strong fill) |
| #60A5FA on #0A0F1E | ~7.6:1 | blue text links |
| #A78BFA on #0A0F1E | ~6.9:1 | violet text (AI labels) |
| #22D3EE on #0A0F1E | ~10:1 | cyan text |
Brand #3B82F6 with white text is only 3.7:1, so filled buttons use #2563EB (`--color-brand-strong`).
Brand violet #885CF6 is used for decoration and fills, never for small text.
