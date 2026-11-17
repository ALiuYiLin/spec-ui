import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { SpinnerIcon } from './icons'
import { normalizeLabel } from './text'

export type ButtonVariant = 'default' | 'solid' | 'dashed' | 'text' | 'link'
export type ButtonTone = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonShape = 'default' | 'round' | 'circle'
export type ButtonType = 'button' | 'submit' | 'reset'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  tone?: ButtonTone
  block?: boolean
  loading?: boolean
  icon?: ReactNode
  htmlType?: ButtonType
}

export function Button({
  variant = 'default',
  size = 'md',
  shape = 'default',
  tone = 'default',
  block,
  loading,
  icon,
  htmlType = 'button',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const showSpinner = Boolean(loading)
  // 协议：icon 与 spinner 互斥，loading 时 icon 不渲染
  const showIcon = icon != null && !showSpinner
  const label = typeof children === 'string' ? normalizeLabel(children, icon != null, variant) : children

  return (
    <button
      {...rest}
      type={htmlType}
      className="sm-btn"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-tone={tone}
      {...(block ? { 'data-block': 'true' } : null)}
      {...(showSpinner ? { 'data-loading': 'true', 'aria-busy': 'true' } : null)}
      {...(disabled ? { 'data-disabled': 'true', disabled: true } : null)}
    >
      {showSpinner ? (
        <span className="sm-btn__spinner" aria-hidden="true">
          <SpinnerIcon />
        </span>
      ) : null}
      {showIcon ? (
        <span className="sm-btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="sm-btn__label">{label}</span>
    </button>
  )
}
