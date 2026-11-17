import type { ReactNode } from 'react'
import { CloseIcon } from './icons'
import { createPortal } from 'react-dom'

export type ModalProps = {
  open?: boolean
  title?: ReactNode
  footer?: ReactNode | null
  closable?: boolean
  onClose?: () => void
  children?: ReactNode
}

export function Modal({ open, title, footer, closable = true, onClose, children }: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="sm-modal" data-state="open">
      <div className="sm-modal__mask" aria-hidden="true" />
      <div className="sm-modal__dialog" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        {closable ? (
          <button type="button" className="sm-modal__close" aria-label="关闭" onClick={onClose}>
        <CloseIcon />
      </button>
        ) : null}
        <div className="sm-modal__header">{title != null ? <div className="sm-modal__title">{title}</div> : null}</div>
        <div className="sm-modal__body">{children}</div>
        {footer !== null ? <div className="sm-modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
