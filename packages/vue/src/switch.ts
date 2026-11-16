import { defineComponent, h, ref } from 'vue'
import type { PropType, VNode } from 'vue'

export type SwitchSize = 'sm' | 'md'

export const Switch = defineComponent({
  name: 'SmSwitch',
  props: {
    modelValue: { type: Boolean, default: undefined },
    size: { type: String as PropType<SwitchSize>, default: 'md' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    label: { type: String, default: '' },
    content: { type: Object as PropType<VNode | null>, default: null },
    ariaLabel: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const inner = ref(false)
    const isOn = () => (props.modelValue !== undefined ? props.modelValue : inner.value)

    const toggle = () => {
      if (props.disabled || props.loading) return
      const next = !isOn()
      if (props.modelValue === undefined) inner.value = next
      emit('update:modelValue', next)
      emit('change', next)
    }

    return () => {
      const on = isOn()
      const text = props.content ?? (props.label || (slots.default ? slots.default() : null))

      return h(
        'button',
        {
          type: 'button',
          role: 'switch',
          'aria-checked': on ? 'true' : 'false',
          'aria-busy': props.loading ? 'true' : undefined,
          'aria-label': props.ariaLabel,
          class: 'sm-switch',
          'data-state': on ? 'on' : 'off',
          'data-size': props.size,
          ...(props.disabled ? { 'data-disabled': 'true', disabled: true } : {}),
          ...(props.loading ? { 'data-loading': 'true' } : {}),
          onClick: toggle,
        },
        [
          h('span', { class: 'sm-switch__handle', 'aria-hidden': 'true' }),
          text != null ? h('span', { class: 'sm-switch__inner' }, Array.isArray(text) ? text : [text]) : null,
        ],
      )
    }
  },
})
