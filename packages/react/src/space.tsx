import { Children } from 'react'
import type { ReactNode } from 'react'

export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceSize = 'sm' | 'md' | 'lg'

export type SpaceProps = {
  direction?: SpaceDirection
  size?: SpaceSize
  children?: ReactNode
}

export function Space({ direction = 'horizontal', size = 'md', children }: SpaceProps) {
  const items = Children.toArray(children)

  return (
    <div className="sm-space" data-direction={direction} data-size={size}>
      {items.map((child, index) => (
        <div className="sm-space__item" key={index}>
          {child}
        </div>
      ))}
    </div>
  )
}
