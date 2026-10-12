import { useId } from 'react'

/**
 * Nexa ribbon "N" (v2). Three strokes of identical width (7u) and identical round terminals on a
 * 40-unit grid, centred at (20, 20). The ribbon weaves: the diagonal folds OVER the left stroke and
 * tucks UNDER the right one; shading appears only where the ribbon passes beneath. The colour
 * travels blue → violet → cyan along the ribbon's path.
 */
const MARK = {
  L: 11.25,
  R: 28.75,
  T: 11.25,
  B: 28.75,
  W: 7,
}

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  const { L, R, T, B, W } = MARK
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1={B} x2="0" y2={T} gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id={`${id}d`} x1={L} y1={T} x2={R} y2={B} gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#885CF6" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1={B} x2="0" y2={T} gradientUnits="userSpaceOnUse">
          <stop stopColor="#885CF6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        {/* shade on the left stroke just below the fold */}
        <linearGradient id={`${id}ls`} x1="0" y1={T + 2} x2="0" y2={T + 11} gradientUnits="userSpaceOnUse">
          <stop stopColor="#050816" stopOpacity="0.55" />
          <stop offset="1" stopColor="#050816" stopOpacity="0" />
        </linearGradient>
        {/* shade on the diagonal where it tucks under the right stroke */}
        <linearGradient id={`${id}ds`} x1={L} y1={T} x2={R} y2={B} gradientUnits="userSpaceOnUse">
          <stop offset="0.62" stopColor="#050816" stopOpacity="0" />
          <stop offset="1" stopColor="#050816" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g strokeWidth={W} strokeLinecap="round">
        <path d={`M${L} ${B}V${T}`} stroke={`url(#${id}l)`} />
        <path d={`M${L} ${B}V${T}`} stroke={`url(#${id}ls)`} />
        <path d={`M${L} ${T}L${R} ${B}`} stroke={`url(#${id}d)`} />
        <path d={`M${L} ${T}L${R} ${B}`} stroke={`url(#${id}ds)`} />
        <path d={`M${R} ${B}V${T}`} stroke={`url(#${id}r)`} />
      </g>
    </svg>
  )
}

export function Logo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display text-[1.2rem] font-semibold tracking-[-0.045em] text-text">nexa</span>
    </span>
  )
}
