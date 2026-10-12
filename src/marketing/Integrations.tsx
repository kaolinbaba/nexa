import { Info } from 'lucide-react'
import { connectors } from '../app/data.ts'
import { LogoMark } from '../components/brand/Logo.tsx'
import { ConnectorGlyph } from '../components/ConnectorGlyph.tsx'
import { Reveal } from '../components/motion/Reveal.tsx'
import { Container, SectionHeader } from './Section.tsx'

export function Integrations() {
  const left = connectors.slice(0, 6)
  const right = connectors.slice(6, 12)
  return (
    <section id="integrations" aria-labelledby="integrations-title" className="scroll-mt-20 py-18 lg:py-22">
      <Container>
        <SectionHeader
          id="integrations-title"
          eyebrow="Integrations"
          align="center"
          title="Connects to the tools your team already uses."
          lead="Chat, email, code, design files, CRM, payments and more feed into one timeline. Webhooks and an API cover everything else."
        />

        <Reveal delay={0.05} className="relative mx-auto mt-14 max-w-5xl">
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10">
            {/* Connection rails: hairlines through the hub with a slow light pulse (transform only). */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
              {['16.66%', '50%', '83.33%'].map((top, i) => (
                <div key={top} className="absolute inset-x-0 h-px overflow-hidden" style={{ top }}>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-line-strong to-transparent" />
                  <div className="rail-pulse absolute inset-y-0 left-0 w-full motion-reduce:hidden" style={{ animationDelay: `${i * 1.3}s` }}>
                    <div className="h-px w-28 bg-linear-to-r from-transparent via-cyan to-transparent" />
                  </div>
                </div>
              ))}
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {left.map((c) => (
                <Chip key={c.id} {...c} />
              ))}
            </ul>

            <div className="relative mx-auto grid size-36 place-items-center" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border border-line-strong" />
              <div className="absolute inset-4 rounded-full border border-line" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-violet)_28%,transparent),transparent)]" />
              <div className="relative grid size-20 place-items-center rounded-[22px] border border-line-strong bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
                <LogoMark size={44} />
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              {right.map((c) => (
                <Chip key={c.id} {...c} />
              ))}
            </ul>
          </div>
          <p className="mx-auto mt-10 flex max-w-xl items-start justify-center gap-2 text-center text-sm text-faint">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Connectors are shown as generic categories. Nexa is a design concept and does not connect to any third-party service.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

function Chip({ name, category, glyph }: { name: string; category: string; glyph: Parameters<typeof ConnectorGlyph>[0]['glyph'] }) {
  return (
    <li className="panel flex items-center gap-3 px-3.5 py-3 transition-colors hover:border-line-strong">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-bg-deep text-brand-text">
        <ConnectorGlyph glyph={glyph} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{name}</span>
        <span className="block truncate text-xs text-faint">{category}</span>
      </span>
    </li>
  )
}
