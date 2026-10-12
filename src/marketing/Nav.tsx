import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '../components/brand/Logo.tsx'
import { Link } from '../components/Link.tsx'
import { ButtonLink } from '../components/ui/Button.tsx'

const links = [
  { href: '#features', label: 'Product' },
  { href: '#automation', label: 'Automations' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#pricing', label: 'Pricing' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'glass border-x-0 border-t-0' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" aria-label="Nexa home" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-10 items-center rounded-md px-3 text-sm text-muted transition-colors hover:text-text">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink to="/app/overview" variant="ghost" size="sm">
            View Dashboard
          </ButtonLink>
          <ButtonLink to="/app/overview?tour=1" size="sm">
            Explore Live Demo
          </ButtonLink>
        </div>

        <button
          type="button"
          className="grid size-11 cursor-pointer place-items-center rounded-lg text-muted hover:bg-white/5 hover:text-text lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-line lg:hidden">
        <nav aria-label="Mobile" className="mx-auto max-w-[1200px] px-4 pb-5 pt-2 sm:px-6">
          <ul className="grid gap-0.5">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-lg px-3 text-[0.95rem] text-muted hover:bg-white/5 hover:text-text">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ButtonLink to="/app/overview?tour=1">Explore Live Demo</ButtonLink>
            <ButtonLink to="/app/overview" variant="secondary">
              View Dashboard
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
