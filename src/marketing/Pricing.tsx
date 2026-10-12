import { Check } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '../components/motion/Reveal.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { Tabs } from '../components/ui/primitives.tsx'
import { Container, SectionHeader } from './Section.tsx'

type Billing = 'monthly' | 'annual'
const plans = [
  {
    name: 'Starter',
    blurb: 'For small teams getting organized.',
    monthly: 0,
    annual: 0,
    unit: 'free forever',
    features: ['Up to 3 active projects', 'Board & list views', '5 automations', '7-day analytics'],
  },
  {
    name: 'Team',
    blurb: 'For agencies and growing teams.',
    monthly: 14,
    annual: 11,
    unit: 'per seat / month',
    featured: true,
    features: ['Unlimited projects', '50 automations with test runs', 'AI assistant', 'All connectors', '12-month analytics'],
  },
  {
    name: 'Scale',
    blurb: 'For multi-team operations.',
    monthly: 28,
    annual: 22,
    unit: 'per seat / month',
    features: ['Everything in Team', 'Unlimited automations', 'Workload planning', 'Advanced permissions', 'Activity audit export'],
  },
]

export function Pricing() {
  const [billing, setBilling] = useState<Billing>('annual')
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 py-18 lg:py-22">
      <Container>
        <SectionHeader id="pricing-title" eyebrow="Pricing" align="center" title="Simple plans that grow with your team." lead="Illustrative pricing for a concept product. Nothing here is for sale, and every plan opens the same live demo." />
        <Reveal className="mt-10 flex justify-center">
          <Tabs
            idBase="billing"
            label="Billing period"
            variant="segmented"
            value={billing}
            onChange={setBilling}
            items={[
              { id: 'monthly', label: 'Monthly' },
              { id: 'annual', label: 'Annual · save ~20%' },
            ]}
          />
        </Reveal>
        <div id="billing-panel" role="tabpanel" aria-labelledby={`billing-tab-${billing}`} className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => {
            const price = billing === 'annual' ? p.annual : p.monthly
            return (
              <Reveal
                key={p.name}
                delay={i * 0.05}
                className={`relative flex flex-col rounded-[var(--radius-panel)] p-7 ${
                  p.featured ? 'border border-brand/40 bg-linear-to-b from-brand/[0.09] to-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]' : 'panel'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{p.name}</h3>
                  {p.featured && <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-text">Recommended</span>}
                </div>
                <p className="mt-2 text-sm text-muted">{p.blurb}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold tracking-[-0.04em]">${price}</span>
                  <span className="text-sm text-faint">{p.unit}</span>
                </p>
                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`mt-0.5 size-4 shrink-0 ${p.featured ? 'text-brand-text' : 'text-cyan'}`} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/app/overview" variant={p.featured ? 'primary' : 'secondary'} className="mt-8 w-full">
                  Try {p.name} in the demo
                </ButtonLink>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
