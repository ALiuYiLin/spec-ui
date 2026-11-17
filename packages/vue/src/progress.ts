import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type ProgressStatus = 'normal' | 'success' | 'exception'

export const Progress = defineComponent({
  name: 'SmProgress',
  props: {
    percent: { type: Number, default: 0 },
    status: { type: String as PropType<ProgressStatus>, default: 'normal' },
    showInfo: { type: Boolean, default: true },
  },
  setup(props) {
    return () => {
      const value = Math.max(0, Math.min(100, props.percent))
      return h(
        'div',
        {
          class: 'sm-progress',
          'data-status': props.status,
          role: 'progressbar',
          'aria-valuenow': value,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
        },
        [
          h('div', { class: 'sm-progress__rail', 'aria-hidden': 'true' }, [
            h('div', { class: 'sm-progress__bar', 'aria-hidden': 'true', style: { width: `${value}%` } }),
          ]),
          props.showInfo ? h('span', { class: 'sm-progress__text' }, `${value}%`) : null,
        ],
      )
    }
  },
})
