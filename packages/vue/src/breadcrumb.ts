import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'

export type BreadcrumbItem = { title: string }

export const Breadcrumb = defineComponent({
  name: 'SmBreadcrumb',
  props: {
    items: { type: Array as PropType<BreadcrumbItem[]>, default: () => [] },
    label: { type: String, default: '面包屑' },
  },
  setup(props) {
    return () =>
      h(
        'nav',
        { class: 'sm-breadcrumb', 'aria-label': props.label },
        [
          h(
            'ol',
            { class: 'sm-breadcrumb__list' },
            props.items.flatMap((item, index) => {
              const nodes = [
                h('li', { class: 'sm-breadcrumb__item', key: `i${index}` }, [
                  h('span', { class: 'sm-breadcrumb__link' }, [item.title]),
                ]),
              ]
              if (index < props.items.length - 1) {
                nodes.push(
                  h('li', { class: 'sm-breadcrumb__separator', 'aria-hidden': 'true', key: `s${index}` }, ['/']),
                )
              }
              return nodes
            }),
          ),
        ],
      )
  },
})
