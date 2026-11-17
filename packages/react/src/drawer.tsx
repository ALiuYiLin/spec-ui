import type { ReactNode } from 'react'
import { CloseIcon } from './icons'
import { createPortal } from 'react-dom'

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom'

export type DrawerProps = {
  open?: boolean
  title?: ReactNode
  side?: DrawerSide
  width?: number | string
  height?: number | string
  closable?: boolean
  onClose?: () => void
  children?: ReactNode
}

export function Drawer({
  open,
  title,
  side = 'right',
  width = 378,
  height = 378,
  closable = true,
  onClose,
  children,
}: DrawerProps) {
  if (!open) return null

  const vertical = side === 'top' || side === 'bottom'
  const geometry = vertical ? { height, width: '100%' } : { width, height: '100%' }

  return createPortal(
    <div className="sm-drawer" data-state="open" data-side={side}>
      <div className="sm-drawer__mask" aria-hidden="true" />
      <div
        className="sm-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        style={geometry}
      >
        {/* HANDLER_IN_HEADER */}
        <div className="sm-drawer__header">
          {closable ? (
            <button type="button" className="sm-drawer__close" aria-label="关闭" onClick={onClose}>
              <CloseIcon />
            </button>
          ) : null}
          {title != null ? <div className="sm-drawer__title">{title}</div> : null}
        </div>
        <div className="sm-drawer__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
