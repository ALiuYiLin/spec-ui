export type ProgressStatus = 'normal' | 'success' | 'exception'

export type ProgressProps = {
  percent?: number
  status?: ProgressStatus
  showInfo?: boolean
}

export function Progress({ percent = 0, status = 'normal', showInfo = true }: ProgressProps) {
  const value = Math.max(0, Math.min(100, percent))

  return (
    <div
      className="sm-progress"
      data-status={status}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="sm-progress__rail" aria-hidden="true">
        <div className="sm-progress__bar" aria-hidden="true" style={{ width: `${value}%` }} />
      </div>
      {showInfo ? <span className="sm-progress__text">{value}%</span> : null}
    </div>
  )
}
