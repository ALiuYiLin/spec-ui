import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type SpinSize = 'sm' | 'md' | 'lg'

export const Spin = defineComponent({
  name: 'SmSpin',
  props: {
    size: { type: String as PropType<SpinSize>, default: 'md' },
    tip: { type: String, default: '' },
    label: { type: String, default: '加载中' },
  },
  setup(props) {
    return () =>
      h('div', { class: 'sm-spin', 'data-size': props.size, role: 'status', 'aria-label': props.label }, [
        h('span', { class: 'sm-spin__dot', 'aria-hidden': 'true' }),
        props.tip ? h('div', { class: 'sm-spin__tip' }, [props.tip]) : null,
      ])
  },
})
