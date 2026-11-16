import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export type StepsItem = { title: string }

export const Steps = defineComponent({
  name: 'SmSteps',
  props: {
    items: { type: Array as PropType<StepsItem[]>, default: () => [] },
    current: { type: Number, default: 0 },
    direction: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'sm-steps', 'data-direction': props.direction },
        props.items.map((item, index) => {
          const status: StepStatus = index < props.current ? 'finish' : index === props.current ? 'process' : 'wait'
          return h(
            'div',
            {
              class: 'sm-steps__item',
              'data-status': status,
              key: index,
              ...(status === 'process' ? { 'aria-current': 'step' } : {}),
            },
            [h('div', { class: 'sm-steps__title' }, [item.title])],
          )
        }),
      )
  },
})
