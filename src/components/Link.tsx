import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate, withBase } from '../lib/router.ts'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

/** In-app link: real `href` (works without JS, new tab, crawlers) + client-side navigation. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (to.startsWith('#')) return // same-page anchors: let the browser scroll
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={withBase(to)} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
