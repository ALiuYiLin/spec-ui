import type { ReactNode } from 'react'

export type CardProps = {
  title?: ReactNode
  extra?: ReactNode
  children?: ReactNode
}

export function Card({ title, extra, children }: CardProps) {
  const hasHeader = title != null || extra != null

  return (
    <div className="sm-card">
      {hasHeader ? (
        <div className="sm-card__header">
          {title != null ? <div className="sm-card__title">{title}</div> : null}
          {extra}
        </div>
      ) : null}
      <div className="sm-card__body">{children}</div>
    </div>
  )
}
