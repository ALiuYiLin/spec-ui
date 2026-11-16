import type { ReactNode } from 'react'

export type SpinSize = 'sm' | 'md' | 'lg'

export type SpinProps = {
  size?: SpinSize
  tip?: ReactNode
  label?: string
}

export function Spin({ size = 'md', tip, label = '加载中' }: SpinProps) {
  return (
    <div className="sm-spin" data-size={size} role="status" aria-label={label}>
      <span className="sm-spin__dot" aria-hidden="true" />
      {tip != null ? <div className="sm-spin__tip">{tip}</div> : null}
    </div>
  )
}
