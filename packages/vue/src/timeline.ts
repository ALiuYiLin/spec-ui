import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type TimelineTone = 'default' | 'success' | 'warning' | 'danger'

export type TimelineItem = { content: string; tone?: TimelineTone }

export const Timeline = defineComponent({
  name: 'SmTimeline',
  props: {
    items: { type: Array as PropType<TimelineItem[]>, default: () => [] },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'sm-timeline' },
        props.items.map((item, index) =>
          h(
            'div',
            { class: 'sm-timeline__item', 'data-tone': item.tone ?? 'default', key: index },
            [
              h('span', { class: 'sm-timeline__dot', 'aria-hidden': 'true' }),
              h('div', { class: 'sm-timeline__content' }, [item.content]),
            ],
          ),
        ),
      )
  },
})
