import type { ReactNode } from 'react'

export type StatisticProps = {
  title?: ReactNode
  value: number | string
  precision?: number
}

export function Statistic({ title, value, precision }: StatisticProps) {
  const text =
    precision !== undefined && typeof value === 'number' ? value.toFixed(precision) : String(value)

  return (
    <div className="sm-statistic">
      {title != null ? <div className="sm-statistic__title">{title}</div> : null}
      <div className="sm-statistic__value">{text}</div>
    </div>
  )
}
