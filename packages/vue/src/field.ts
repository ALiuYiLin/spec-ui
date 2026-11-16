import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export type FieldStatus = 'default' | 'error' | 'warning'

export const Field = defineComponent({
  name: 'SmField',
  props: {
    label: { type: String, default: '' },
    required: { type: Boolean, default: false },
    status: { type: String as PropType<FieldStatus>, default: 'default' },
    error: { type: String, default: '' },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    return () => {
      const control = props.content ?? (slots.default ? slots.default() : null)

      return h(
        'div',
        {
          class: 'sm-field',
          'data-status': props.status,
          ...(props.required ? { 'data-required': 'true' } : {}),
        },
        [
          props.label ? h('label', { class: 'sm-field__label' }, [props.label]) : null,
          h('div', { class: 'sm-field__control' }, control ? (Array.isArray(control) ? control : [control]) : []),
          props.error ? h('div', { class: 'sm-field__error', role: 'alert' }, [props.error]) : null,
        ],
      )
    }
  },
})
