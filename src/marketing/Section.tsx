import type { ReactNode } from 'react'
import { Reveal } from '../components/motion/Reveal.tsx'

export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
  accent = 'brand',
}: {
  id: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  accent?: 'brand' | 'violet' | 'cyan'
}) {
  const dot = { brand: 'bg-brand', violet: 'bg-violet', cyan: 'bg-cyan' }[accent]
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`eyebrow flex items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
        <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
        {title}
      </h2>
      {lead && <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">{lead}</p>}
    </Reveal>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1200px] px-4 sm:px-6 ${className}`}>{children}</div>
}
