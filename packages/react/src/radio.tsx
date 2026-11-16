import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> & {
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  children?: ReactNode
}

export function Radio({ checked, defaultChecked, disabled, onChange, children, ...rest }: RadioProps) {
  const [inner, setInner] = useState(Boolean(defaultChecked))
  const isChecked = checked !== undefined ? checked : inner

  return (
    <label
      className="sm-radio"
      data-state={isChecked ? 'checked' : 'unchecked'}
      {...(disabled ? { 'data-disabled': 'true' } : null)}
    >
      <span className="sm-radio__control">
        <input
          {...rest}
          className="sm-radio__input"
          type="radio"
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => {
            if (checked === undefined) setInner(e.target.checked)
            onChange?.(e.target.checked)
          }}
        />
        <span className="sm-radio__box" aria-hidden="true" />
      </span>
      {children != null ? <span className="sm-radio__label">{children}</span> : null}
    </label>
  )
}
