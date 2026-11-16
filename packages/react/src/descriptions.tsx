import type { ReactNode } from 'react'

export type DescriptionsItem = { label: ReactNode; content: ReactNode }

export type DescriptionsProps = {
  items: DescriptionsItem[]
}

export function Descriptions({ items }: DescriptionsProps) {
  return (
    <div className="sm-descriptions">
      {items.map((item, index) => (
        <div className="sm-descriptions__item" key={index}>
          <div className="sm-descriptions__label">{item.label}</div>
          <div className="sm-descriptions__content">{item.content}</div>
        </div>
      ))}
    </div>
  )
}
