import { Teleport, defineComponent, h } from 'vue'
import { CloseIcon } from './icons'
import type { PropType, VNode } from 'vue'

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom'

export const Drawer = defineComponent({
  name: 'SmDrawer',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    side: { type: String as PropType<DrawerSide>, default: 'right' },
    width: { type: [Number, String], default: 378 },
    height: { type: [Number, String], default: 378 },
    closable: { type: Boolean, default: true },
    body: { type: Object as PropType<VNode | null>, default: null },
  },
  emits: ['close'],
  setup(props, { emit, slots }) {
    return () => {
      if (!props.open) return null

      const vertical = props.side === 'top' || props.side === 'bottom'
      const geometry = vertical
        ? { height: typeof props.height === 'number' ? `${props.height}px` : props.height, width: '100%' }
        : { width: typeof props.width === 'number' ? `${props.width}px` : props.width, height: '100%' }

      const content = props.body ?? (slots.default ? slots.default() : null)

      return h(Teleport, { to: 'body' }, [
        h('div', { class: 'sm-drawer', 'data-state': 'open', 'data-side': props.side }, [
          h('div', { class: 'sm-drawer__mask', 'aria-hidden': 'true' }),
          h(
            'div',
            {
              class: 'sm-drawer__panel',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': props.title || undefined,
              style: geometry,
            },
            [
              h('div', { class: 'sm-drawer__header' }, [
                props.closable
                  ? h('button', {
                      type: 'button',
                      class: 'sm-drawer__close',
                      'aria-label': '关闭',
                      onClick: () => emit('close'),
                    }, [h(CloseIcon)])
                  : null,
                props.title ? h('div', { class: 'sm-drawer__title' }, [props.title]) : null,
              ]),
              h('div', { class: 'sm-drawer__body' }, content ? (Array.isArray(content) ? content : [content]) : []),
            ],
          ),
        ]),
      ])
    }
  },
})
