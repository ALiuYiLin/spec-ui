import { useState } from 'react'
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import { CloseIcon } from './icons'

export type InputVariant = 'outlined' | 'filled' | 'borderless'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputStatus = 'default' | 'error' | 'warning'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  variant?: InputVariant
  size?: InputSize
  status?: InputStatus
  allowClear?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  style?: CSSProperties
}

export function Input({
  variant = 'outlined',
  size = 'md',
  status = 'default',
  allowClear,
  prefix,
  suffix,
  disabled,
  readOnly,
  value,
  defaultValue,
  onChange,
  style,
  ...rest
}: InputProps) {
  const [inner, setInner] = useState<string>(typeof defaultValue === 'string' ? defaultValue : '')
  const current = value !== undefined ? value : inner
  const hasValue = String(current ?? '').length > 0
  const withAffix = Boolean(prefix || suffix || allowClear)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(e.target.value)
    onChange?.(e)
  }

  const handleClear = () => {
    if (value === undefined) setInner('')
    // 原生 onChange 需要事件对象；这里构造一个最小 shape，供受控方读取新值
    onChange?.({ target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  const dataProps = {
    'data-variant': variant,
    'data-size': size,
    'data-status': status,
    ...(disabled ? { 'data-disabled': 'true' } : null),
    ...(readOnly ? { 'data-readonly': 'true' } : null),
  }

  const field = (
    <input
      {...rest}
      className={withAffix ? 'sm-input__field' : 'sm-input'}
      {...(withAffix ? null : dataProps)}
      value={current}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={status === 'error' ? true : undefined}
    />
  )

  // 形态一：无前后缀，根就是原生 input（与参考实现的盒子模型一致）
  if (!withAffix) return field

  // 形态二：有前后缀/清除，根是包裹元素，原生 input 退为 __field
  return (
    <span className="sm-input" style={style} {...dataProps}>
      {prefix ? <span className="sm-input__prefix">{prefix}</span> : null}
      {field}
      {allowClear && hasValue && !disabled && !readOnly ? (
        <span
          className="sm-input__clear"
          aria-hidden="true"
          onMouseDown={(e) => {
            e.preventDefault()
            handleClear()
          }}
        >
          <CloseIcon />
        </span>
      ) : null}
      {suffix && !(allowClear && hasValue) ? <span className="sm-input__suffix">{suffix}</span> : null}
    </span>
  )
}
