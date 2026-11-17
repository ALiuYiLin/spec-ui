import type { ReactNode } from 'react'
import { CloseIcon } from './icons'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export type AlertProps = {
  type?: AlertType
  message: ReactNode
  description?: ReactNode
  closable?: boolean
  onClose?: () => void
}

export function Alert({ type = 'info', message, description, closable, onClose }: AlertProps) {
  return (
    <div className="sm-alert" data-type={type} role="alert">
      <div className="sm-alert__content">
        <div className="sm-alert__message">{message}</div>
        {description != null ? <div className="sm-alert__description">{description}</div> : null}
      </div>
      {closable ? (
        <button type="button" className="sm-alert__close" aria-label="关闭" onClick={onClose}>
        <CloseIcon />
      </button>
      ) : null}
    </div>
  )
}
