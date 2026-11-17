import type { ReactNode } from 'react'
import { CloseIcon } from './icons'

export type TagTone = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type TagProps = {
  tone?: TagTone
  closable?: boolean
  onClose?: () => void
  children?: ReactNode
}

export function Tag({ tone = 'default', closable, onClose, children }: TagProps) {
  return (
    <span className="sm-tag" data-tone={tone}>
      {children}
      {closable ? (
        <button type="button" className="sm-tag__close" aria-label="移除" onClick={onClose}>
        <CloseIcon />
      </button>
      ) : null}
    </span>
  )
}
