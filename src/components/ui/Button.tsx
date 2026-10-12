import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '../Link.tsx'
import { buttonClass, type Size, type Variant } from './buttonClass.ts'

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }

export function Button({ variant, size, className, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClass(variant, size, className)} {...rest} />
}

export function ButtonLink({ to, variant, size, className, children, ...rest }: Common & { to: string; 'data-tour'?: string }) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  )
}
