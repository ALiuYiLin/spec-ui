import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon, DownIcon } from './icons'

export type SelectOption = { value: string; label: ReactNode; disabled?: boolean }
export type SelectStatus = 'default' | 'error' | 'warning'
export type SelectVariant = 'outlined' | 'filled' | 'borderless'
export type SelectSize = 'sm' | 'md' | 'lg'

export type SelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  status?: SelectStatus
  variant?: SelectVariant
  size?: SelectSize
  showArrow?: boolean
  style?: CSSProperties
  'aria-label'?: string
}

let seq = 0

export function Select({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  open: openProp,
  onOpenChange,
  placeholder = '请选择',
  disabled,
  allowClear,
  status = 'default',
  variant = 'outlined',
  size = 'md',
  showArrow = true,
  style,
  'aria-label': ariaLabel,
}: SelectProps) {
  const idRef = useRef<string | null>(null)
  if (idRef.current === null) idRef.current = `sm-select-${++seq}`
  const listId = `${idRef.current}-list`

  const [openState, setOpenState] = useState(false)
  const open = openProp !== undefined ? openProp : openState

  const [valueState, setValueState] = useState<string | undefined>(defaultValue)
  const value = valueProp !== undefined ? valueProp : valueState

  const [highlighted, setHighlighted] = useState<number | null>(null)
  const [popupStyle, setPopupStyle] = useState<CSSProperties | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // 浮层脱离根子树后既拿不到宽度也拿不到位置，必须实测后写到浮层上。
  // 这是协议允许的 portal 几何内联样式（见 spec 的 portal 字段）。
  useLayoutEffect(() => {
    if (!open) return
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPopupStyle({
      width: rect.width,
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY + 4,
    })
  }, [open])

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  // 打开时把游标放到当前选中项，没有就放到第一个可用项
  useEffect(() => {
    if (!open) {
      setHighlighted(null)
      return
    }
    const sel = options.findIndex((o) => o.value === value && !o.disabled)
    if (sel >= 0) {
      setHighlighted(sel)
      return
    }
    const first = options.findIndex((o) => !o.disabled)
    setHighlighted(first >= 0 ? first : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const move = (dir: 1 | -1) => {
    if (!options.length) return
    let i = highlighted
    for (let n = 0; n < options.length; n += 1) {
      i = i === null ? (dir === 1 ? 0 : options.length - 1) : (i + dir + options.length) % options.length
      if (!options[i].disabled) {
        setHighlighted(i)
        return
      }
    }
  }

  const commit = (index: number) => {
    const opt = options[index]
    if (!opt || opt.disabled) return
    if (valueProp === undefined) setValueState(opt.value)
    onChange?.(opt.value)
    setOpen(false)
    inputRef.current?.focus()
  }

  const clear = () => {
    if (valueProp === undefined) setValueState(undefined)
    onChange?.('')
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) setOpen(true)
        else move(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) setOpen(true)
        else move(-1)
        break
      case 'Enter':
        e.preventDefault()
        if (open && highlighted !== null) commit(highlighted)
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          setOpen(false)
        }
        break
      case 'Delete':
      case 'Backspace':
        if (allowClear && !open) {
          e.preventDefault()
          clear()
        }
        break
      default:
        break
    }
  }

  return (
    <div
      ref={rootRef}
      className="sm-select"
      style={style}
      data-variant={variant}
      data-size={size}
      data-status={status}
      data-state={open ? 'open' : 'closed'}
      {...(disabled ? { 'data-disabled': 'true' } : null)}
      onClick={() => {
        if (!disabled) setOpen(!open)
      }}
    >
      <div className="sm-select__control">
        <span className="sm-select__search">
          <input
            ref={inputRef}
            className="sm-select__input"
            role="combobox"
            type="text"
            autoComplete="off"
            readOnly
            disabled={disabled}
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open && highlighted !== null ? `${listId}-opt-${highlighted}` : undefined}
            aria-autocomplete="list"
            onKeyDown={onKeyDown}
          />
        </span>
        {selectedOption ? (
          <span
            className="sm-select__value"
            title={typeof selectedOption.label === 'string' ? selectedOption.label : undefined}
          >
            {selectedOption.label}
          </span>
        ) : (
          <span className="sm-select__placeholder">{placeholder}</span>
        )}
      </div>

      {allowClear && selectedOption && !disabled ? (
        <span
          className="sm-select__clear"
          aria-hidden="true"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            clear()
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseIcon />
        </span>
      ) : null}

      {showArrow ? (
        <span className="sm-select__arrow" aria-hidden="true">
          <DownIcon />
        </span>
      ) : null}

      {open
        ? createPortal(
            <div
              className="sm-select__dropdown"
              data-state={open ? 'open' : 'closed'}
              style={popupStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sm-select__listbox" role="listbox" id={listId}>
                {options.length === 0 ? <div className="sm-select__empty">暂无数据</div> : null}
                {options.map((o, i) => (
                  <div
                    key={o.value}
                    className="sm-select__option"
                    role="option"
                    id={`${listId}-opt-${i}`}
                    aria-selected={o.value === value}
                    data-selected={o.value === value ? 'true' : undefined}
                    data-highlighted={highlighted === i ? 'true' : undefined}
                    {...(o.disabled ? { 'data-disabled': 'true', 'aria-disabled': 'true' } : null)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      commit(i)
                    }}
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
