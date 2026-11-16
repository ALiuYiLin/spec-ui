import type { ReactNode } from 'react'

export type AvatarShape = 'circle' | 'square'
export type AvatarSize = 'sm' | 'md' | 'lg'

export type AvatarProps = {
  shape?: AvatarShape
  size?: AvatarSize
  label?: string
  children?: ReactNode
}

export function Avatar({ shape = 'circle', size = 'md', label, children }: AvatarProps) {
  return (
    <span className="sm-avatar" data-shape={shape} data-size={size} role="img" aria-label={label}>
      {children}
    </span>
  )
}
