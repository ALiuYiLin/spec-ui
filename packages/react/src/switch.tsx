import { useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type SwitchSize = 'sm' | 'md'

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'value'> & {
  checked?: boolean
  defaultChecked?: boolean
  size?: SwitchSize
  loading?: boolean
  onChange?: (checked: boolean) => void
  children?: ReactNode
}

export function Switch({
  checked,
  defaultChecked,
  disabled,
  loading,
  size = 'md',
  onChange,
  onClick,
  children,
  ...rest
}: SwitchProps) {
  const [inner, setInner] = useState(Boolean(defaultChecked))
  const isOn = checked !== undefined ? checked : inner

  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={isOn}
      {...(loading ? { 'aria-busy': 'true' } : null)}
      className="sm-switch"
      data-state={isOn ? 'on' : 'off'}
      data-size={size}
      {...(disabled ? { 'data-disabled': 'true', disabled: true } : null)}
      {...(loading ? { 'data-loading': 'true' } : null)}
      onClick={(e) => {
        onClick?.(e)
        if (disabled || loading) return
        const next = !isOn
        if (checked === undefined) setInner(next)
        onChange?.(next)
      }}
    >
      <span className="sm-switch__handle" aria-hidden="true" />
      {children != null ? <span className="sm-switch__inner">{children}</span> : null}
    </button>
  )
}
