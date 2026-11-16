import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export type TooltipProps = {
  title: ReactNode
  open?: boolean
  side?: TooltipSide
  disabled?: boolean
  children?: ReactNode
}

export function Tooltip({ title, open, side = 'top', disabled, children }: TooltipProps) {
  const [inner, setInner] = useState(false)
  const isOpen = (open ?? inner) && !disabled
  const id = `sm-tooltip-${useId().replace(/:/g, '')}`
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<CSSProperties | undefined>(undefined)

  // 浮层脱离文档流，位置只能实测后写几何内联样式
  useLayoutEffect(() => {
    if (!isOpen) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY
    if (side === 'top') {
      setPos({ left: x + rect.width / 2, top: y - 8, transform: 'translate(-50%, -100%)' })
    } else if (side === 'bottom') {
      setPos({ left: x + rect.width / 2, top: y + rect.height + 8, transform: 'translate(-50%, 0)' })
    } else if (side === 'left') {
      setPos({ left: x - 8, top: y + rect.height / 2, transform: 'translate(-100%, -50%)' })
    } else {
      setPos({ left: x + rect.width + 8, top: y + rect.height / 2, transform: 'translate(0, -50%)' })
    }
  }, [isOpen, side])

  return (
    <>
      <span
        ref={triggerRef}
        className="sm-tooltip__trigger"
        aria-describedby={isOpen ? id : undefined}
        onMouseEnter={() => setInner(true)}
        onMouseLeave={() => setInner(false)}
        onFocus={() => setInner(true)}
        onBlur={() => setInner(false)}
      >
        {children}
      </span>
      {isOpen
        ? createPortal(
            <div className="sm-tooltip" role="tooltip" id={id} data-state="open" data-side={side} style={pos}>
              <div className="sm-tooltip__inner">{title}</div>
              <div className="sm-tooltip__arrow" aria-hidden="true" />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
