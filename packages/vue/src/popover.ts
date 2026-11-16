import { Teleport, defineComponent, h, ref, watchEffect } from 'vue'
import type { PropType, VNode } from 'vue'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'
export type PopoverAlign = 'start' | 'center' | 'end'

export const Popover = defineComponent({
  name: 'SmPopover',
  props: {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    open: { type: Boolean, default: undefined },
    side: { type: String as PropType<PopoverSide>, default: 'top' },
    align: { type: String as PropType<PopoverAlign>, default: 'center' },
    disabled: { type: Boolean, default: false },
    body: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    const inner = ref(false)
    const triggerEl = ref<HTMLSpanElement | null>(null)
    const pos = ref<Record<string, string | number> | undefined>(undefined)
    const id = `sm-popover-${Math.random().toString(36).slice(2, 9)}`

    const isOpen = () => (props.open ?? inner.value) && !props.disabled

    watchEffect(() => {
      if (!isOpen()) return
      const el = triggerEl.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = rect.left + window.scrollX
      const y = rect.top + window.scrollY
      const anchor = props.align === 'start' ? 0 : props.align === 'end' ? 1 : 0.5
      if (props.side === 'top' || props.side === 'bottom') {
        pos.value = {
          left: x + rect.width * anchor + 'px',
          top: (props.side === 'top' ? y - 8 : y + rect.height + 8) + 'px',
          transform: props.side === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
        }
      } else {
        pos.value = {
          left: (props.side === 'left' ? x - 8 : x + rect.width + 8) + 'px',
          top: y + rect.height * anchor + 'px',
          transform: props.side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
        }
      }
    })

    return () => {
      const open = isOpen()
      const children = props.body ?? (slots.default ? slots.default() : null)
      const contentNode = slots.content ? slots.content() : props.content

      return [
        h(
          'span',
          {
            ref: triggerEl,
            class: 'sm-popover__trigger',
            'aria-describedby': open ? id : undefined,
            onMouseenter: () => {
              inner.value = true
            },
            onMouseleave: () => {
              inner.value = false
            },
            onFocus: () => {
              inner.value = true
            },
            onBlur: () => {
              inner.value = false
            },
          },
          children ? (Array.isArray(children) ? children : [children]) : [],
        ),
        open
          ? h(Teleport, { to: 'body' }, [
              h(
                'div',
                {
                  class: 'sm-popover',
                  id,
                  'data-state': 'open',
                  'data-side': props.side,
                  'data-align': props.align,
                  style: pos.value,
                },
                [
                  h('div', { class: 'sm-popover__inner' }, [
                    props.title ? h('div', { class: 'sm-popover__title' }, [props.title]) : null,
                    h('div', { class: 'sm-popover__content' }, contentNode ? (Array.isArray(contentNode) ? contentNode : [contentNode]) : []),
                  ]),
                  h('div', { class: 'sm-popover__arrow', 'aria-hidden': 'true' }),
                ],
              ),
            ])
          : null,
      ]
    }
  },
})
