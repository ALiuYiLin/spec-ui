import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export type PopoverProps = {
  title?: ReactNode
  content: ReactNode
  open?: boolean
  side?: PopoverSide
  align?: PopoverAlign
  disabled?: boolean
  children?: ReactNode
}

export function Popover({
  title,
  content,
  open,
  side = 'top',
  align = 'center',
  disabled,
  children,
}: PopoverProps) {
  const [inner, setInner] = useState(false)
  const isOpen = (open ?? inner) && !disabled
  const id = `sm-popover-${useId().replace(/:/g, '')}`
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<CSSProperties | undefined>(undefined)

  useLayoutEffect(() => {
    if (!isOpen) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY
    const anchor = align === 'start' ? 0 : align === 'end' ? 1 : 0.5
    if (side === 'top' || side === 'bottom') {
      const left = x + rect.width * anchor
      setPos({
        left,
        top: side === 'top' ? y - 8 : y + rect.height + 8,
        transform: side === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
      })
    } else {
      const top = y + rect.height * anchor
      setPos({
        left: side === 'left' ? x - 8 : x + rect.width + 8,
        top,
        transform: side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
      })
    }
  }, [isOpen, side, align])

  return (
    <>
      <span
        ref={triggerRef}
        className="sm-popover__trigger"
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
            <div className="sm-popover" id={id} data-state="open" data-side={side} data-align={align} style={pos}>
              <div className="sm-popover__inner">
                {title != null ? <div className="sm-popover__title">{title}</div> : null}
                <div className="sm-popover__content">{content}</div>
              </div>
              <div className="sm-popover__arrow" aria-hidden="true" />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
