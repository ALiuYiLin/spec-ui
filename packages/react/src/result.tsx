import type { ReactNode } from 'react'

export type ResultStatus = 'success' | 'info' | 'warning' | 'error'

export type ResultProps = {
  status?: ResultStatus
  title: ReactNode
  subtitle?: ReactNode
}

export function Result({ status = 'info', title, subtitle }: ResultProps) {
  return (
    <div className="sm-result" data-status={status}>
      <div className="sm-result__icon" aria-hidden="true" />
      <div className="sm-result__title">{title}</div>
      {subtitle != null ? <div className="sm-result__subtitle">{subtitle}</div> : null}
    </div>
  )
}
