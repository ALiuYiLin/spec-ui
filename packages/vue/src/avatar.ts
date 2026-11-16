import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export type AvatarShape = 'circle' | 'square'
export type AvatarSize = 'sm' | 'md' | 'lg'

export const Avatar = defineComponent({
  name: 'SmAvatar',
  props: {
    shape: { type: String as PropType<AvatarShape>, default: 'circle' },
    size: { type: String as PropType<AvatarSize>, default: 'md' },
    label: { type: String, default: undefined },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props, { slots }) {
    return () => {
      const content = props.content ?? (slots.default ? slots.default() : null)
      return h(
        'span',
        {
          class: 'sm-avatar',
          'data-shape': props.shape,
          'data-size': props.size,
          role: 'img',
          'aria-label': props.label,
        },
        content ? (Array.isArray(content) ? content : [content]) : [],
      )
    }
  },
})
