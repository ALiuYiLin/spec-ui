import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export const Card = defineComponent({
  name: 'SmCard',
  props: {
    title: { type: String, default: '' },
    extra: { type: Object as PropType<VNode | null>, default: null },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    return () => {
      const body = props.content ?? (slots.default ? slots.default() : null)
      const hasHeader = props.title !== '' || props.extra !== null

      return h('div', { class: 'sm-card' }, [
        hasHeader
          ? h('div', { class: 'sm-card__header' }, [
              props.title ? h('div', { class: 'sm-card__title' }, [props.title]) : null,
              props.extra,
            ])
          : null,
        h('div', { class: 'sm-card__body' }, body ? (Array.isArray(body) ? body : [body]) : []),
      ])
    }
  },
})
