import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { fmt, project, smoothPath } from '../../lib/chart.ts'

export type Series = { key: string; label: string; color: string; dashed?: boolean; fill?: boolean }

/**
 * Responsive SVG area/line chart with pointer + keyboard inspection (←/→ when focused).
 * The SVG is labelled with a text summary; callers can render a data table for full access.
 */
export function AreaChart<T extends { label: string }>({
  data,
  series,
  height = 240,
  summary,
}: {
  data: T[]
  series: (Series & { key: keyof T & string })[]
  height?: number
  summary: string
}) {
  const uid = useId().replace(/:/g, '')
  const [W, setW] = useState(800)
  const H = height
  const PAD_B = 28
  const plotH = H - PAD_B
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  // Draw at the real pixel width so strokes and labels are never stretched.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const max = useMemo(() => Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key])))) * 1.12, [data, series])
  const paths = useMemo(
    () =>
      series.map((s) => {
        const pts = project(data.map((d) => Number(d[s.key])), W, plotH, max, 6)
        const line = smoothPath(pts)
        return { s, pts, line, area: `${line} L${pts.at(-1)![0]},${plotH} L${pts[0][0]},${plotH} Z` }
      }),
    [data, series, max, plotH, W],
  )

  const idxFromPointer = (e: PointerEvent<SVGSVGElement>) => {
    const r = ref.current!.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const step = (W - 12) / Math.max(1, data.length - 1)
    return Math.min(data.length - 1, Math.max(0, Math.round((x - 6) / step)))
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    setHover((h) => {
      const cur = h ?? (e.key === 'ArrowRight' ? -1 : data.length)
      return Math.min(data.length - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1)))
    })
  }

  const step = Math.max(1, Math.ceil((data.length - 1) / Math.max(1, Math.floor(W / 96) - 1)))
  const labelIdx = new Set<number>()
  for (let i = 0; i < data.length; i += step) labelIdx.add(i)
  // Always end on the latest point; drop the previous label if it would collide.
  if (!labelIdx.has(data.length - 1)) {
    if (data.length - 1 - (Math.floor((data.length - 1) / step) * step) < step * 0.6) labelIdx.delete(Math.floor((data.length - 1) / step) * step)
    labelIdx.add(data.length - 1)
  }
  const hp = hover !== null ? paths[0].pts[hover] : null

  return (
    <div ref={wrap} className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="block w-full touch-pan-y overflow-visible rounded-md"
        role="img"
        aria-label={summary}
        tabIndex={0}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
        onPointerMove={(e) => setHover(idxFromPointer(e))}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="1" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={6 + (plotH - 6) * g} y2={6 + (plotH - 6) * g} stroke="var(--color-line)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1="0" x2={W} y1={plotH} y2={plotH} stroke="var(--color-line-strong)" vectorEffect="non-scaling-stroke" />
        {paths.map(({ s, line, area }) => (
          <g key={s.key}>
            {s.fill && <path d={area} fill={`url(#${uid}-${s.key})`} />}
            <path d={line} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? '5 4' : undefined} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </g>
        ))}
        {data.map((d, i) =>
          labelIdx.has(i) ? (
            <text key={i} x={paths[0].pts[i][0]} y={H - 6} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} className="fill-faint" style={{ fontSize: 12 }} aria-hidden="true">
              {d.label}
            </text>
          ) : null,
        )}
        {hp && (
          <g aria-hidden="true">
            <line x1={hp[0]} x2={hp[0]} y1="0" y2={plotH} stroke="var(--color-line-strong)" vectorEffect="non-scaling-stroke" />
            {paths.map(({ s, pts }) => (
              <circle key={s.key} cx={pts[hover!][0]} cy={pts[hover!][1]} r="4.5" fill="var(--color-bg)" stroke={s.color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && hp && (
        <div
          className="pointer-events-none absolute top-1 z-10 min-w-36 -translate-x-1/2 rounded-lg border border-line-strong bg-surface/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          style={{ left: `clamp(4.5rem, ${(hp[0] / W) * 100}%, calc(100% - 4.5rem))` }}
          aria-live="polite"
        >
          <div className="mb-1 font-medium text-text">{data[hover].label}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4 text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-mono text-text">{fmt.format(Number(data[hover][s.key]))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
