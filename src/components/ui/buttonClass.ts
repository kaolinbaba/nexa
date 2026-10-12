export type Variant = 'primary' | 'secondary' | 'ghost'
export type Size = 'md' | 'sm'

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-standard)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer'
const sizes: Record<Size, string> = { md: 'min-h-11 px-5 text-[0.95rem]', sm: 'min-h-9 px-3.5 text-sm' }
const variants: Record<Variant, string> = {
  primary:
    'bg-brand-strong text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_24px_-12px_rgb(37_99_235/0.8)] hover:bg-brand-deep border border-white/10',
  secondary: 'border border-line-strong bg-white/[0.03] text-text hover:border-faint/60 hover:bg-white/[0.06]',
  ghost: 'text-muted hover:bg-white/[0.05] hover:text-text',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`
}
