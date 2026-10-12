import { useSyncExternalStore } from 'react'

/**
 * Minimal History-API router (no dependency). Two surfaces: the marketing page at `/`
 * and the demo app at `/app/<section>`.
 *
 * App code always uses base-less paths ("/app/tasks"). The deploy base (Vite `base`, e.g.
 * "/nexa/" on GitHub Pages) is added when writing URLs and stripped when reading them.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '') // "" locally, "/nexa" on Pages

/** "/app/tasks" → "/nexa/app/tasks" (hash-only links are left alone). */
export function withBase(to: string) {
  if (!BASE || to.startsWith('#') || /^[a-z]+:/i.test(to)) return to
  return to === '/' ? `${BASE}/` : `${BASE}${to}`
}

function stripBase(pathname: string) {
  if (BASE && pathname.startsWith(BASE)) return pathname.slice(BASE.length) || '/'
  return pathname
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

if (typeof window !== 'undefined') window.addEventListener('popstate', emit)

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

const getHref = () => stripBase(window.location.pathname) + window.location.search

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getHref, () => '/')
  const url = new URL(href, 'http://local')
  return { pathname: url.pathname, search: url.searchParams }
}

export function navigate(to: string, { replace = false } = {}) {
  if (to === getHref()) return
  const [path, hash] = to.split('#')
  const before = getHref().split('?')[0]
  if (replace) history.replaceState(null, '', withBase(to))
  else history.pushState(null, '', withBase(to))
  emit()
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
  else if (path.split('?')[0] !== before || !replace) window.scrollTo({ top: 0 })
}

/** Update one query param in place (keeps others, e.g. an active `?tour=`). */
export function setParam(key: string, value: string | null) {
  const url = new URL(window.location.href)
  if (value === null) url.searchParams.delete(key)
  else url.searchParams.set(key, value)
  navigate(stripBase(url.pathname) + url.search, { replace: true })
}
