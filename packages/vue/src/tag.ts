import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export type TagTone = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export const Tag = defineComponent({
  name: 'SmTag',
  props: {
    tone: { type: String as PropType<TagTone>, default: 'default' },
    closable: { type: Boolean, default: false },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  emits: ['close'],
  setup(props, { emit, slots }) {
    return () => {
      const label = props.content ?? (slots.default ? slots.default() : null)
      return h('span', { class: 'sm-tag', 'data-tone': props.tone }, [
        label ? (Array.isArray(label) ? label : [label]) : [],
        props.closable
          ? h('button', {
              type: 'button',
              class: 'sm-tag__close',
              'aria-label': '移除',
              onClick: () => emit('close'),
            })
          : null,
      ])
    }
  },
})
