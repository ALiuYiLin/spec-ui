import type { ReactNode } from 'react'

export type EmptyProps = {
  description?: ReactNode
}

export function Empty({ description = '暂无数据' }: EmptyProps) {
  return (
    <div className="sm-empty">
      <div className="sm-empty__image" aria-hidden="true" />
      <div className="sm-empty__description">{description}</div>
    </div>
  )
}
