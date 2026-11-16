import type { ReactNode } from 'react'

export type TimelineTone = 'default' | 'success' | 'warning' | 'danger'

export type TimelineItem = { content: ReactNode; tone?: TimelineTone }

export type TimelineProps = {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="sm-timeline">
      {items.map((item, index) => (
        <div className="sm-timeline__item" data-tone={item.tone ?? 'default'} key={index}>
          <span className="sm-timeline__dot" aria-hidden="true" />
          <div className="sm-timeline__content">{item.content}</div>
        </div>
      ))}
    </div>
  )
}
