export type SkeletonProps = {
  title?: boolean
  rows?: number
  active?: boolean
}

export function Skeleton({ title = true, rows = 2, active }: SkeletonProps) {
  return (
    <div className="sm-skeleton" aria-busy="true" {...(active ? { 'data-active': 'true' } : null)}>
      <div className="sm-skeleton__content">
      {title ? <div className="sm-skeleton__title" /> : null}
      <div className="sm-skeleton__paragraph">
        {Array.from({ length: rows }, (_, index) => (
          <div className="sm-skeleton__item" key={index} />
        ))}
      </div>
      </div>
    </div>
  )
}
