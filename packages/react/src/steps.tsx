export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export type StepsItem = { title: string }

export type StepsProps = {
  items: StepsItem[]
  current?: number
  direction?: 'horizontal' | 'vertical'
}

export function Steps({ items, current = 0, direction = 'horizontal' }: StepsProps) {
  const statusOf = (index: number): StepStatus => {
    if (index < current) return 'finish'
    if (index === current) return 'process'
    return 'wait'
  }

  return (
    <div className="sm-steps" data-direction={direction}>
      {items.map((item, index) => {
        const status = statusOf(index)
        return (
          <div
            className="sm-steps__item"
            data-status={status}
            key={index}
            {...(status === 'process' ? { 'aria-current': 'step' } : null)}
          >
            <div className="sm-steps__title">{item.title}</div>
          </div>
        )
      })}
    </div>
  )
}
