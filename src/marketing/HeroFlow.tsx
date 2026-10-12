import { Bell, FileText, Sparkles } from 'lucide-react'

/**
 * Signature hero motif: the Nexa ribbon "N" drawn at architectural scale as a bundle of fine
 * fibers. It rises out of the product preview (left), arcs behind the headline, dives back into
 * the product and leaves upward on the right: work in → Nexa → results out.
 *
 * Drawn on a fixed 1440×900 stage, centered over the hero, so geometry and the CSS
 * `offset-path` pulses stay perfectly aligned. Decorative only (aria-hidden), lg+ only.
 */
const W = 1440
const FIBERS = [-24, -12, 0, 12, 24]

function fiber(o: number) {
  const L = 250 + o
  const R = 1190 + o
  return `M${L} 960 L${L} 250 C${L} 185 ${L + 20} 165 ${L + 70} 190 L${R - 70} 600 C${R - 20} 625 ${R} 610 ${R} 560 L${R} 96`
}

const PULSES = [
  { o: 0, delay: '0s', dur: '9s', color: 'var(--color-cyan)' },
  { o: -24, delay: '-3.2s', dur: '11s', color: 'var(--color-violet-text)' },
  { o: 12, delay: '-6.5s', dur: '10s', color: 'var(--color-brand-text)' },
]

export function HeroFlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[900px] overflow-hidden lg:block">
      <div
        className="hero-flow-stage absolute left-1/2 top-0 h-[900px] -translate-x-1/2"
        style={{ width: W }}
      >
        <svg width={W} height="900" viewBox={`0 0 ${W} 900`} fill="none" className="absolute inset-0">
          <defs>
            <linearGradient id="hf-stroke" x1="250" y1="0" x2="1190" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.55" stopColor="#885CF6" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          {FIBERS.map((o, i) => (
            <path key={o} d={fiber(o)} stroke="url(#hf-stroke)" strokeWidth={i === 2 ? 1.25 : 1} strokeOpacity={i === 2 ? 0.75 : 0.32} strokeLinecap="round" />
          ))}
          {/* nodes where the ribbon turns */}
          {[
            [250, 470],
            [1190, 470],
            [1190, 96],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="9" fill="var(--color-bg)" stroke="url(#hf-stroke)" strokeOpacity="0.6" />
              <circle cx={x} cy={y} r="3" fill={x < 700 ? '#60A5FA' : '#22D3EE'} />
            </g>
          ))}
        </svg>

        {/* light pulses travelling the ribbon (offset-path follows the same geometry) */}
        {PULSES.map((p) => (
          <span
            key={p.o}
            className="hero-pulse absolute left-0 top-0 size-2 rounded-full motion-reduce:hidden"
            style={{
              offsetPath: `path("${fiber(p.o)}")`,
              background: p.color,
              boxShadow: `0 0 14px 4px ${p.color}`,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}

        {/* event chips: input on the left, output on the right (xl only, in the page margins) */}
        <div className="absolute hidden xl:flex" style={{ left: 64, top: 330 }}>
          <Chip icon={<FileText className="size-3.5" />} tone="text-brand-text" title="Brief received" meta="intake · 09:12" />
        </div>
        <div className="absolute hidden xl:flex" style={{ left: 1236, top: 186 }}>
          <Chip icon={<Sparkles className="size-3.5" />} tone="text-violet-text" title="Kickoff ready" meta="12 tasks · 0.8s" />
        </div>
        <div className="absolute hidden xl:flex" style={{ left: 1236, top: 414 }}>
          <Chip icon={<Bell className="size-3.5" />} tone="text-cyan" title="Team notified" meta="#studio" />
        </div>
      </div>
    </div>
  )
}

function Chip({ icon, title, meta, tone }: { icon: React.ReactNode; title: string; meta: string; tone: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface/85 py-2 pl-2 pr-3.5 shadow-[0_12px_30px_-12px_rgb(0_0_0/0.8)] backdrop-blur">
      <span className={`grid size-7 place-items-center rounded-lg bg-white/[0.05] ${tone}`}>{icon}</span>
      <span>
        <span className="block text-[13px] font-medium text-text">{title}</span>
        <span className="block font-mono text-xs text-faint">{meta}</span>
      </span>
    </div>
  )
}
