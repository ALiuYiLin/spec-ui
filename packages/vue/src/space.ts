import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceSize = 'sm' | 'md' | 'lg'

export const Space = defineComponent({
  name: 'SmSpace',
  props: {
    direction: { type: String as PropType<SpaceDirection>, default: 'horizontal' },
    size: { type: String as PropType<SpaceSize>, default: 'md' },
    content: { type: Array as PropType<VNode[]>, default: () => [] },
  },
  setup(props, { slots }) {
    return () => {
      const children = props.content.length ? props.content : slots.default ? slots.default() : []
      return h(
        'div',
        { class: 'sm-space', 'data-direction': props.direction, 'data-size': props.size },
        children.map((child, index) => h('div', { class: 'sm-space__item', key: index }, [child])),
      )
    }
  },
})
