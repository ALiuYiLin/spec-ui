import { defineComponent, h } from 'vue'

export const Skeleton = defineComponent({
  name: 'SmSkeleton',
  props: {
    title: { type: Boolean, default: true },
    rows: { type: Number, default: 2 },
    active: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'sm-skeleton', 'aria-busy': 'true', ...(props.active ? { 'data-active': 'true' } : {}) },
        [
          props.title ? h('div', { class: 'sm-skeleton__title' }) : null,
          h(
            'div',
            { class: 'sm-skeleton__paragraph' },
            Array.from({ length: props.rows }, (_, index) => h('div', { class: 'sm-skeleton__item', key: index })),
          ),
        ],
      )
  },
})
