# Nexa — Stitch exploration (Stage 5)

- **Project:** `projects/5747508846321278835` (title `nexa`, private)
- **Status:** generation **works**. The `generate_screen_from_text` call timed out on the client side
  (documented behaviour), but the server finished the job: the project received an auto-generated
  design system ("Obsidian Precision") and a screen thumbnail.
- **Quirk:** `list_screens` returned `{}` even after the project thumbnail existed, so screen-level
  HTML export could not be fetched through the API. The project thumbnail **did** download (HTTP 200,
  no sign-in redirect) → `docs/stitch/hero-thumb.png`. This ran no further; nonessential (see brief §6).

## Prompt (desktop, 1 call)
> Desktop marketing landing page hero + first sections for "Nexa"… dark theme only: midnight navy #0A0F1E,
> graphite surfaces, off-white text #E8ECF4, slate #94A3B8; accents blue #3B82F6, violet #885CF6,
> cyan #22D3EE used sparingly… quality bar like Linear / Vercel / Raycast / Stripe… slim sticky nav,
> centered hero with eyebrow pill, CTA "Explore Live Demo" + ghost "View Dashboard", wide framed product
> preview on soft atmospheric light with fine grain, 3-column feature row. No bright white panels,
> heavy glow, stock photos or customer logos.

## What we adopted
| From Stitch | Decision |
|---|---|
| Centered hero → framed console-style product preview directly underneath | **Adopted**: matches direction A ("product is the hero") |
| Horizontal pipeline of workflow nodes inside the preview | **Adopted**: becomes the animated "automation run" in the hero preview and the Workflow section |
| Mono telemetry chips (`label-code` 12px JetBrains Mono) for metadata | **Adopted** with the system mono stack (no new font dependency) |
| Feature cards that embed a mini UI fragment (terminal, table, list) | **Adopted** for the bento features |
| Hairline `rgba(255,255,255,.08)` borders, top-edge glint, 8–12% radial backlight | **Adopted**: matches our tokens (`--color-line`, `.panel` inset highlight) |
| Geist headline font | **Rejected**: new dependency; Space Grotesk (already bundled) fills the role |
| 4px base radius | **Adjusted**: 8px controls / 12–16px panels so it feels a little warmer for agencies and creative teams |
| Dev-tool copy (latency in ms, cost per run) | **Rejected**: Nexa's audience is agencies and SMB teams; we talk about hours saved and projects |
| Secondary text `#64748B` for metadata | **Rejected**: 3.9:1 on the canvas fails AA; we use `--color-faint` #8190A8 (5.8:1) |
