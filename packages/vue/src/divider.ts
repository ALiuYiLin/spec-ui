import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export const Divider = defineComponent({
  name: 'SmDivider',
  props: {
    orientation: { type: String as PropType<DividerOrientation>, default: 'horizontal' },
    variant: { type: String as PropType<DividerVariant>, default: 'solid' },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    return () => {
      const raw = props.content ?? (slots.default ? slots.default() : null)
      const text = raw == null ? [] : Array.isArray(raw) ? raw : [raw]
      return h(
        'div',
        {
          class: 'sm-divider',
          'data-orientation': props.orientation,
          'data-variant': props.variant,
          ...(props.orientation === 'vertical' ? { 'aria-orientation': 'vertical' } : {}),
        },
        text.length !== 0 ? [h('span', { class: 'sm-divider__text' }, text)] : [],
      )
    }
  },
})
