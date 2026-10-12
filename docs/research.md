# Nexa — research

References named in the brief, used for **quality bar only, not imitation**. Notes are based on the
public marketing sites as generally known; they were not re-crawled in this session.

| Reference | What we take | What we avoid |
|---|---|---|
| linear.app | Dark, near-monochrome UI with one accent; product screenshot as hero proof; very tight headline tracking; quiet borders instead of shadows | Copying layouts or gradients |
| vercel.com | Restraint; grid-aligned sections; monospace for technical detail; crisp 1px hairlines | Pure black/white palette (ours is midnight navy) |
| raycast.com | Keyboard-first product feel; command-palette motif; tactile, small micro-interactions | Heavy 3D/glow hero |
| stripe.com | Clear narrative sections; product UI fragments embedded inside copy; motion that explains | Rainbow gradients |

## ui-ux-pro-max findings (`--design-system`, query "B2B SaaS AI workflow automation dark premium")
- Pattern **Hero + Features + CTA**, CTA in hero and at bottom → adopted (+ sticky nav CTA).
- Style **Glassmorphism** (backdrop blur, 1px translucent borders, z-depth) → adopted *sparingly*
  (nav, floating preview frame, dialogs only).
- Palette suggestion (light mode, orange CTA) → **rejected**: the brief mandates a dark midnight system.
- Font suggestion Plus Jakarta Sans → **rejected** to avoid a new dependency; Inter Variable (UI) +
  Space Grotesk Variable (display) are already in the starter and fit "precise, technical".
- Motion: stagger lists 300–450 ms; avoid overshoot easing on data UI → adopted.
- Checklist: SVG icons (Lucide), visible focus, reduced motion, 375/768/1024/1440 → adopted.

## Content inventory
- Brand: logomark (ribbon N), wordmark, favicon/app icon, OG image.
- Copy: all original; every section written for this concept.
- Data: fictional workspace "Atlas & Pine" (a fictional design agency), 6 projects, ~24 tasks, 6 automations,
  analytics series, 8 concept connectors, assistant conversation script.
- Imagery: no photos needed — UI is the hero. All visuals are code/SVG.
