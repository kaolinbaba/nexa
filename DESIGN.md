# Nexa — design system

Direction: **"Night Shift Console"** (see `docs/direction.md`). Tokens live in `src/index.css` (`@theme`).

## Color
| Token | Value | Role |
|---|---|---|
| `bg` | #0A0F1E | Midnight navy canvas |
| `bg-deep` | #070B16 | Insets, code blocks |
| `surface` / `surface-2` / `surface-3` | #0F1526 / #141B2D / #1A2236 | Graphite planes (sidebar / cards / hover) |
| `line` / `line-strong` | #1F2840 / #2C3753 | Hairlines |
| `text` | #E8ECF4 | Primary text |
| `muted` | #94A3B8 | Secondary text (7.4:1) |
| `faint` | #8190A8 | Tertiary / metadata (5.8:1) |
| `brand` | #3B82F6 | Accent, focus, charts |
| `brand-strong` | #2563EB | Filled primary buttons (white text 5.2:1) |
| `brand-text` | #60A5FA | Blue text and links |
| `violet` / `violet-text` | #885CF6 / #A78BFA | AI & automation accent (fill / text) |
| `cyan` | #22D3EE | Live data, success pings |
| `success` / `warning` / `danger` | #34D399 / #FBBF24 / #F87171 | Status (always paired with a text label) |

Rules: one accent per section; violet/cyan as **light** (radial ≤22% opacity), never neon outlines;
no white panels; status is never shown by color alone.

## Type
- Display: **Space Grotesk Variable**, 600, tracking −0.03em to −0.04em. Hero clamp(2.6rem, 6vw, 4.75rem).
- UI/body: **Inter Variable** 400/500, 15–18px body, line-height 1.6.
- Mono: system mono stack for metadata, numbers, kbd hints (`.eyebrow`, `font-mono`).
- Minimum rendered size 12px. Headings use `text-wrap: balance`.

## Shape, depth, texture
- Radius: 8px controls · 12px small cards · 16px panels (`--radius-card`) · 20px hero frames.
- Depth = hairline borders + `inset 0 1px 0 rgb(255 255 255 / .04)` top glint (`.panel`). Shadows only
  on floating layers (dialogs, menus).
- Glass (`.glass`) is only for the sticky nav, the floating preview frame and dialogs.
- Grain: fixed SVG noise at 3.5% (`body::after`).

## Motion
- Easing `--ease-out-expo` for entrances, `--ease-standard` for state changes.
- Durations: 150–200ms hover/press · 300–450ms reveals · stagger 60ms.
- Only `transform` / `opacity` animate. Reduced motion shows the final state with no loops.
- Explanatory motion only: automation run sequence, chart draw, task moves, AI typing.

## Components
Button (primary / secondary / ghost; sizes md 44px, sm 36px), Badge (status / priority), Avatar
(initials, hue from the person), Panel, Tabs (roving tabindex, ARIA tabs), Segmented control (period),
Switch (role="switch"), Dialog (native `<dialog>`), Logo (ribbon N mark + wordmark), Sparkline/Area/Bar
charts (SVG, with accessible table fallback).

## Logo (v2, refined 2026-10-13)
Ribbon "N" on a 40-unit grid: three strokes with **identical width (7u) and identical round terminals**,
centred at (20,20). The ribbon weaves: the diagonal folds **over** the left stroke and tucks **under**
the right one, and shading appears only where the ribbon passes beneath. The colour travels
blue → violet → cyan along its path. There's no gloss or bevel. Used as the app icon (`public/favicon.svg`,
`public/app-icon.svg`) and in the lockup with the "nexa" wordmark (Space Grotesk 600, −0.045em).

## Signature motif
The same ribbon-N drawn at architectural scale as five fine fibers (`src/marketing/HeroFlow.tsx`).
It rises from the product, arcs behind the headline (masked for legibility), dives back into the
product and exits as output. Light pulses ride it via CSS `offset-path` and are hidden under
reduced motion. It is reused on the portfolio cover and the OG image.
