import { useEffect, useRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> & {
  defaultChecked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  children?: ReactNode
}

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate,
  disabled,
  onChange,
  children,
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inner, setInner] = useState(Boolean(defaultChecked))
  const isChecked = checked !== undefined ? checked : inner

  // indeterminate 只能通过 JS 属性设置，attribute 上不存在
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate)
  }, [indeterminate])

  const state = indeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'

  return (
    <label className="sm-checkbox" data-state={state} {...(disabled ? { 'data-disabled': 'true' } : null)}>
      <span className="sm-checkbox__control">
        <input
          {...rest}
          ref={inputRef}
          className="sm-checkbox__input"
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={(e) => {
            if (checked === undefined) setInner(e.target.checked)
            onChange?.(e.target.checked)
          }}
        />
        <span className="sm-checkbox__box" aria-hidden="true" />
      </span>
      {children != null ? <span className="sm-checkbox__label">{children}</span> : null}
    </label>
  )
}
