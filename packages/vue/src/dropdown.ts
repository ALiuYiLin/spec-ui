import { Teleport, defineComponent, h, ref, watchEffect } from 'vue'
import type { PropType, VNode } from 'vue'

export type DropdownItem = { key: string; label: string; disabled?: boolean }

export const Dropdown = defineComponent({
  name: 'SmDropdown',
  props: {
    items: { type: Array as PropType<DropdownItem[]>, default: () => [] },
    open: { type: Boolean, default: undefined },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  emits: ['select', 'update:open'],
  setup(props, { emit, slots }) {
    const inner = ref(false)
    const triggerEl = ref<HTMLSpanElement | null>(null)
    const pos = ref<Record<string, string | number> | undefined>(undefined)

    const isOpen = () => props.open ?? inner.value

    watchEffect(() => {
      if (!isOpen()) return
      const el = triggerEl.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      pos.value = {
        left: rect.left + window.scrollX + 'px',
        top: rect.bottom + window.scrollY + 4 + 'px',
      }
    })

    const toggle = () => {
      if (props.open === undefined) inner.value = !inner.value
      emit('update:open', !isOpen())
    }

    return () => {
      const open = isOpen()
      const children = props.content ?? (slots.default ? slots.default() : null)

      return [
        h(
          'span',
          {
            ref: triggerEl,
            class: 'sm-dropdown__trigger',
            'aria-haspopup': 'menu',
            'aria-expanded': open ? 'true' : 'false',
            onClick: toggle,
          },
          children ? (Array.isArray(children) ? children : [children]) : [],
        ),
        open
          ? h(Teleport, { to: 'body' }, [
              h('div', { class: 'sm-dropdown', 'data-state': 'open', style: pos.value }, [
                h(
                  'div',
                  { class: 'sm-dropdown__menu', role: 'menu' },
                  props.items.map((item) =>
                    h(
                      'div',
                      {
                        key: item.key,
                        class: 'sm-dropdown__item',
                        role: 'menuitem',
                        'data-disabled': item.disabled ? 'true' : undefined,
                        'aria-disabled': item.disabled ? 'true' : undefined,
                        onClick: () => {
                          if (item.disabled) return
                          emit('select', item.key)
                          if (props.open === undefined) inner.value = false
                        },
                      },
                      [item.label],
                    ),
                  ),
                ),
              ]),
            ])
          : null,
      ]
    }
  },
})
