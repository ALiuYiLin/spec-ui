import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type ResultStatus = 'success' | 'info' | 'warning' | 'error'

export const Result = defineComponent({
  name: 'SmResult',
  props: {
    status: { type: String as PropType<ResultStatus>, default: 'info' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('div', { class: 'sm-result', 'data-status': props.status }, [
        h('div', { class: 'sm-result__icon', 'aria-hidden': 'true' }),
        h('div', { class: 'sm-result__title' }, [props.title]),
        props.subtitle ? h('div', { class: 'sm-result__subtitle' }, [props.subtitle]) : null,
      ])
  },
})
