import { Teleport, defineComponent, h, ref, watchEffect } from 'vue'
import type { PropType, VNode } from 'vue'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export const Tooltip = defineComponent({
  name: 'SmTooltip',
  props: {
    title: { type: String, default: '' },
    open: { type: Boolean, default: undefined },
    side: { type: String as PropType<TooltipSide>, default: 'top' },
    disabled: { type: Boolean, default: false },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    const inner = ref(false)
    const triggerEl = ref<HTMLSpanElement | null>(null)
    const pos = ref<Record<string, string | number> | undefined>(undefined)
    const id = `sm-tooltip-${Math.random().toString(36).slice(2, 9)}`

    const isOpen = () => (props.open ?? inner.value) && !props.disabled

    // 浮层脱离文档流，位置只能实测后写几何内联样式
    watchEffect(() => {
      if (!isOpen()) return
      const el = triggerEl.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = rect.left + window.scrollX
      const y = rect.top + window.scrollY
      if (props.side === 'top') {
        pos.value = { left: x + rect.width / 2 + 'px', top: y - 8 + 'px', transform: 'translate(-50%, -100%)' }
      } else if (props.side === 'bottom') {
        pos.value = { left: x + rect.width / 2 + 'px', top: y + rect.height + 8 + 'px', transform: 'translate(-50%, 0)' }
      } else if (props.side === 'left') {
        pos.value = { left: x - 8 + 'px', top: y + rect.height / 2 + 'px', transform: 'translate(-100%, -50%)' }
      } else {
        pos.value = { left: x + rect.width + 8 + 'px', top: y + rect.height / 2 + 'px', transform: 'translate(0, -50%)' }
      }
    })

    // 返回数组：Vue 会把多根节点渲染成 fragment，不额外套包裹元素
    return () => {
      const open = isOpen()
      const children = props.content ?? (slots.default ? slots.default() : null)

      return [
        h(
          'span',
          {
            ref: triggerEl,
            class: 'sm-tooltip__trigger',
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
                  class: 'sm-tooltip',
                  role: 'tooltip',
                  id,
                  'data-state': 'open',
                  'data-side': props.side,
                  style: pos.value,
                },
                [
                  h('div', { class: 'sm-tooltip__inner' }, [props.title]),
                  h('div', { class: 'sm-tooltip__arrow', 'aria-hidden': 'true' }),
                ],
              ),
            ])
          : null,
      ]
    }
  },
})
