import { ArrowRight } from 'lucide-react'
import { Logo, LogoMark } from '../components/brand/Logo.tsx'
import { Link } from '../components/Link.tsx'
import { Reveal } from '../components/motion/Reveal.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'
import { Container } from './Section.tsx'

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 pt-10 lg:pb-24 lg:pt-12">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[28px] border border-line-strong bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[720px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-violet)_35%,transparent),transparent)]" />
          <div className="relative">
            <LogoMark size={52} className="mx-auto" />
            <h2 id="cta-title" className="mx-auto mt-7 max-w-[18ch] font-display text-[clamp(2.1rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              See what your Monday looks like with Nexa.
            </h2>
            <p className="mx-auto mt-5 max-w-[50ch] text-lg leading-relaxed text-muted">
              Move tasks, switch on automations and ask the assistant, all in a live demo with sample data. No account needed.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink to="/app/overview?tour=1" className="w-full sm:w-auto">
                Explore Live Demo <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/app/overview" variant="secondary" className="w-full sm:w-auto">
                View Dashboard
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

const cols = [
  { title: 'Product', links: [['Features', '#features'], ['Automations', '#automation'], ['Analytics', '#analytics'], ['Integrations', '#integrations'], ['Pricing', '#pricing']] },
  { title: 'Live demo', links: [['Guided tour', '/app/overview?tour=1'], ['Projects', '/app/projects'], ['Tasks', '/app/tasks'], ['AI assistant', '/app/assistant']] },
  { title: 'This concept', links: [['How it works', '#walkthrough'], ['Dashboard', '/app/overview'], ['Analytics demo', '/app/analytics']] },
]

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Smarter workflows, beautifully connected.</p>
          <p className="mt-6 max-w-sm text-xs leading-relaxed text-faint">
            Nexa is an independent portfolio concept, not a real company or commercial product. All names, data and pricing are fictional.
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-medium">{c.title}</h2>
            <ul className="mt-4 space-y-1">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-text">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="flex flex-col gap-2 border-t border-line py-6 text-xs text-faint sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Nexa concept · Portfolio project</span>
        <span className="font-mono">Designed &amp; built with React, TypeScript and Tailwind CSS</span>
      </Container>
    </footer>
  )
}
