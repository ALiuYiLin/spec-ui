import type { ReactNode } from 'react'

export type BadgeStatus = 'default' | 'success' | 'warning' | 'error'

export type BadgeProps = {
  count?: number
  overflowCount?: number
  dot?: boolean
  status?: BadgeStatus
  children?: ReactNode
}

export function Badge({ count, overflowCount = 99, dot, status, children }: BadgeProps) {
  const show = dot === true || (count !== undefined && count !== null)
  const text = dot ? '' : String(count !== undefined && count > overflowCount ? `${overflowCount}+` : count)

  return (
    <span
      className="sm-badge"
      {...(dot ? { 'data-dot': 'true' } : null)}
      {...(status ? { 'data-status': status } : null)}
    >
      {children}
      {show ? <sup className="sm-badge__count">{text}</sup> : null}
    </span>
  )
}
