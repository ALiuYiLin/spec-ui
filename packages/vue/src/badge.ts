import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export type BadgeStatus = 'default' | 'success' | 'warning' | 'error'

export const Badge = defineComponent({
  name: 'SmBadge',
  props: {
    count: { type: Number, default: undefined },
    overflowCount: { type: Number, default: 99 },
    dot: { type: Boolean, default: false },
    status: { type: String as PropType<BadgeStatus>, default: undefined },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    return () => {
      const inner = props.content ?? (slots.default ? slots.default() : null)
      const show = props.dot || props.count !== undefined
      const text = props.dot ? '' : String(props.count !== undefined && props.count > props.overflowCount ? `${props.overflowCount}+` : props.count)

      return h(
        'span',
        {
          class: 'sm-badge',
          ...(props.dot ? { 'data-dot': 'true' } : {}),
          ...(props.status ? { 'data-status': props.status } : {}),
        },
        [
          inner ? (Array.isArray(inner) ? inner : [inner]) : [],
          show ? h('sup', { class: 'sm-badge__count' }, [text]) : null,
        ],
      )
    }
  },
})
