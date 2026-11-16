import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'

export type InputNumberSize = 'sm' | 'md' | 'lg'
export type InputNumberStatus = 'default' | 'error' | 'warning'

export type InputNumberProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> & {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  size?: InputNumberSize
  status?: InputNumberStatus
  onChange?: (value: number) => void
}

export function InputNumber({
  value,
  defaultValue,
  min,
  max,
  step = 1,
  size = 'md',
  status = 'default',
  disabled,
  readOnly,
  onChange,
  ...rest
}: InputNumberProps) {
  const [inner, setInner] = useState<string>(defaultValue !== undefined ? String(defaultValue) : '')
  const current = value !== undefined ? String(value) : inner

  const commit = (next: number) => {
    const clamped = Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, next))
    if (value === undefined) setInner(String(clamped))
    onChange?.(clamped)
  }

  const nudge = (dir: 1 | -1) => {
    if (disabled || readOnly) return
    const base = Number(current)
    commit((Number.isFinite(base) ? base : 0) + dir * step)
  }

  return (
    <div
      className="sm-input-number"
      data-size={size}
      data-status={status}
      {...(disabled ? { 'data-disabled': 'true' } : null)}
      {...(readOnly ? { 'data-readonly': 'true' } : null)}
    >
      <div
        className="sm-input-number__wrap"
        role="spinbutton"
        aria-valuenow={Number.isFinite(Number(current)) && current !== '' ? Number(current) : undefined}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        <input
          {...rest}
          className="sm-input-number__input"
          type="text"
          inputMode="decimal"
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={status === 'error' ? true : undefined}
          onChange={(e) => {
            if (value === undefined) setInner(e.target.value)
            const next = Number(e.target.value)
            if (Number.isFinite(next)) onChange?.(next)
          }}
        />
      </div>
      {!disabled && !readOnly ? (
        <div className="sm-input-number__handler">
          <span
            className="sm-input-number__handler-up"
            role="button"
            aria-label="增加"
            onMouseDown={(e) => {
              e.preventDefault()
              nudge(1)
            }}
          />
          <span
            className="sm-input-number__handler-down"
            role="button"
            aria-label="减少"
            onMouseDown={(e) => {
              e.preventDefault()
              nudge(-1)
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
