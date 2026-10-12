/** Smooth SVG path through points (Catmull-Rom → cubic Bézier, tension 0.5). */
export function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

/** Map a numeric series into chart coordinates. */
export function project(values: number[], w: number, h: number, max: number, pad = 4): [number, number][] {
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0
  return values.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)])
}

export const fmt = new Intl.NumberFormat('en-US')
