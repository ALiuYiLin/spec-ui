import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export const Alert = defineComponent({
  name: 'SmAlert',
  props: {
    type: { type: String as PropType<AlertType>, default: 'info' },
    message: { type: String, default: '' },
    description: { type: String, default: '' },
    closable: { type: Boolean, default: false },
  },
  emits: ['close'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'sm-alert', 'data-type': props.type, role: 'alert' }, [
        h('div', { class: 'sm-alert__message' }, [props.message]),
        props.description ? h('div', { class: 'sm-alert__description' }, [props.description]) : null,
        props.closable
          ? h('button', {
              type: 'button',
              class: 'sm-alert__close',
              'aria-label': '关闭',
              onClick: () => emit('close'),
            })
          : null,
      ])
  },
})
