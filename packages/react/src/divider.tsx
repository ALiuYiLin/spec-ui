import type { ReactNode } from 'react'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export type DividerProps = {
  orientation?: DividerOrientation
  variant?: DividerVariant
  children?: ReactNode
}

export function Divider({ orientation = 'horizontal', variant = 'solid', children }: DividerProps) {
  const vertical = orientation === 'vertical'

  return (
    <div
      className="sm-divider"
      data-orientation={orientation}
      data-variant={variant}
      {...(vertical ? { 'aria-orientation': 'vertical' } : null)}
    >
      {children != null ? <span className="sm-divider__text">{children}</span> : null}
    </div>
  )
}
