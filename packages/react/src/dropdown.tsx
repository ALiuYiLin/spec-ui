import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type DropdownItem = { key: string; label: ReactNode; disabled?: boolean }

export type DropdownProps = {
  items: DropdownItem[]
  open?: boolean
  onSelect?: (key: string) => void
  children?: ReactNode
}

export function Dropdown({ items, open, onSelect, children }: DropdownProps) {
  const [inner, setInner] = useState(false)
  const isOpen = open ?? inner
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<CSSProperties | undefined>(undefined)

  useLayoutEffect(() => {
    if (!isOpen) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ left: rect.left + window.scrollX, top: rect.bottom + window.scrollY + 4 })
  }, [isOpen])

  return (
    <>
      <span
        ref={triggerRef}
        className="sm-dropdown__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setInner(!isOpen)}
      >
        {children}
      </span>
      {isOpen
        ? createPortal(
            <div className="sm-dropdown" data-state="open" style={pos}>
              <div className="sm-dropdown__menu" role="menu">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="sm-dropdown__item"
                    role="menuitem"
                    data-disabled={item.disabled ? 'true' : undefined}
                    aria-disabled={item.disabled ? true : undefined}
                    onClick={() => {
                      if (item.disabled) return
                      onSelect?.(item.key)
                      setInner(false)
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
