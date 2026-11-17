import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'

export type InputNumberSize = 'sm' | 'md' | 'lg'
export type InputNumberStatus = 'default' | 'error' | 'warning'

export const InputNumber = defineComponent({
  name: 'SmInputNumber',
  props: {
    modelValue: { type: Number, default: undefined },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    step: { type: Number, default: 1 },
    size: { type: String as PropType<InputNumberSize>, default: 'md' },
    status: { type: String as PropType<InputNumberStatus>, default: 'default' },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    ariaLabel: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const inner = ref('')

    const current = () => (props.modelValue !== undefined ? String(props.modelValue) : inner.value)

    const commit = (next: number) => {
      const lo = props.min ?? Number.NEGATIVE_INFINITY
      const hi = props.max ?? Number.POSITIVE_INFINITY
      const clamped = Math.min(hi, Math.max(lo, next))
      if (props.modelValue === undefined) inner.value = String(clamped)
      emit('update:modelValue', clamped)
      emit('change', clamped)
    }

    const nudge = (dir: 1 | -1) => {
      if (props.disabled || props.readOnly) return
      const base = Number(current())
      commit((Number.isFinite(base) ? base : 0) + dir * props.step)
    }

    return () => {
      const value = current()
      const numeric = value !== '' && Number.isFinite(Number(value)) ? Number(value) : undefined

      return h(
        'div',
        {
          class: 'sm-input-number',
          'data-size': props.size,
          'data-status': props.status,
          ...(props.disabled ? { 'data-disabled': 'true' } : {}),
          ...(props.readOnly ? { 'data-readonly': 'true' } : {}),
        },
        [
          props.disabled || props.readOnly
            ? null
            : h('div', { class: 'sm-input-number__handler' }, [
                h('span', {
                  class: 'sm-input-number__handler-up',
                  role: 'button',
                  'aria-label': '增加',
                  onMousedown: (e: Event) => {
                    e.preventDefault()
                    nudge(1)
                  },
                }),
                h('span', {
                  class: 'sm-input-number__handler-down',
                  role: 'button',
                  'aria-label': '减少',
                  onMousedown: (e: Event) => {
                    e.preventDefault()
                    nudge(-1)
                  },
                }),
              ]),
          h(
            'div',
            {
              class: 'sm-input-number__wrap',
              role: 'spinbutton',
              'aria-valuenow': numeric,
              'aria-valuemin': props.min,
              'aria-valuemax': props.max,
            },
            [
              h('input', {
                class: 'sm-input-number__input',
                type: 'text',
                inputmode: 'decimal',
                value,
                disabled: props.disabled,
                readonly: props.readOnly,
                'aria-label': props.ariaLabel,
                'aria-invalid': props.status === 'error' ? 'true' : undefined,
                onInput: (e: Event) => {
                  const next = (e.target as HTMLInputElement).value
                  if (props.modelValue === undefined) inner.value = next
                  const parsed = Number(next)
                  if (Number.isFinite(parsed)) emit('update:modelValue', parsed)
                },
              }),
            ],
          ),
        ],
      )
    }
  },
})
