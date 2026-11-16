import { useState } from 'react'

export type SliderOrientation = 'horizontal' | 'vertical'

export type SliderProps = {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: SliderOrientation
  onChange?: (value: number) => void
  'aria-label'?: string
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  orientation = 'horizontal',
  onChange,
  'aria-label': ariaLabel,
}: SliderProps) {
  const [inner, setInner] = useState(defaultValue)
  const current = value !== undefined ? value : inner
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100

  const setValue = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))
    if (value === undefined) setInner(clamped)
    onChange?.(clamped)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        setValue(current + step)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        setValue(current - step)
        break
      case 'Home':
        e.preventDefault()
        setValue(min)
        break
      case 'End':
        e.preventDefault()
        setValue(max)
        break
      default:
        break
    }
  }

  return (
    <div
      className="sm-slider"
      data-orientation={orientation}
      {...(disabled ? { 'data-disabled': 'true' } : null)}
    >
      <div className="sm-slider__rail" aria-hidden="true" />
      <div
        className="sm-slider__track"
        aria-hidden="true"
        style={orientation === 'horizontal' ? { width: `${percent}%` } : { height: `${percent}%` }}
      />
      <div
        className="sm-slider__handle"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-orientation={orientation}
        aria-label={ariaLabel}
        aria-disabled={disabled ? true : undefined}
        style={orientation === 'horizontal' ? { left: `${percent}%` } : { bottom: `${percent}%` }}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
