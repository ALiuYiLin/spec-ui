import { Teleport, defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'

export const Modal = defineComponent({
  name: 'SmModal',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    closable: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    body: { type: Object as PropType<VNode | null>, default: null },
    footer: { type: Object as PropType<VNode | null>, default: null },
  },
  emits: ['close'],
  setup(props, { emit, slots }) {
    return () => {
      if (!props.open) return null

      const content = props.body ?? (slots.default ? slots.default() : null)
      const footerNode = props.footer ?? (slots.footer ? slots.footer() : null)

      return h(Teleport, { to: 'body' }, [
        h('div', { class: 'sm-modal', 'data-state': 'open' }, [
          h('div', { class: 'sm-modal__mask', 'aria-hidden': 'true' }),
          h(
            'div',
            {
              class: 'sm-modal__dialog',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': props.title || undefined,
            },
            [
              props.closable
                ? h('button', {
                    type: 'button',
                    class: 'sm-modal__close',
                    'aria-label': '关闭',
                    onClick: () => emit('close'),
                  })
                : null,
              h('div', { class: 'sm-modal__header' }, [
                props.title ? h('div', { class: 'sm-modal__title' }, [props.title]) : null,
              ]),
              h(
                'div',
                { class: 'sm-modal__body' },
                content ? (Array.isArray(content) ? content : [content]) : [],
              ),
              props.showFooter
                ? h(
                    'div',
                    { class: 'sm-modal__footer' },
                    footerNode ? (Array.isArray(footerNode) ? footerNode : [footerNode]) : [],
                  )
                : null,
            ],
          ),
        ]),
      ])
    }
  },
})
