import { defineComponent, h } from 'vue'

export const Empty = defineComponent({
  name: 'SmEmpty',
  props: {
    description: { type: String, default: '暂无数据' },
  },
  setup(props) {
    return () =>
      h('div', { class: 'sm-empty' }, [
        h('div', { class: 'sm-empty__image', 'aria-hidden': 'true' }),
        h('div', { class: 'sm-empty__description' }, [props.description]),
      ])
  },
})
