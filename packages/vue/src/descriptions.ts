import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type DescriptionsItem = { label: string; content: string }

export const Descriptions = defineComponent({
  name: 'SmDescriptions',
  props: {
    items: { type: Array as PropType<DescriptionsItem[]>, default: () => [] },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'sm-descriptions' },
        props.items.map((item, index) =>
          h('div', { class: 'sm-descriptions__item', key: index }, [
            h('div', { class: 'sm-descriptions__label' }, [item.label]),
            h('div', { class: 'sm-descriptions__content' }, [item.content]),
          ]),
        ),
      )
  },
})
