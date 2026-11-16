import { defineComponent, h, ref } from 'vue'
import type { PropType, VNode } from 'vue'

export const Radio = defineComponent({
  name: 'SmRadio',
  props: {
    modelValue: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    label: { type: String, default: '' },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const inner = ref(false)
    const isChecked = () => (props.modelValue !== undefined ? props.modelValue : inner.value)

    return () => {
      const checked = isChecked()
      const text = props.content ?? (props.label || (slots.default ? slots.default() : null))

      return h(
        'label',
        {
          class: 'sm-radio',
          'data-state': checked ? 'checked' : 'unchecked',
          ...(props.disabled ? { 'data-disabled': 'true' } : {}),
        },
        [
          h('span', { class: 'sm-radio__control' }, [
            h('input', {
              class: 'sm-radio__input',
              type: 'radio',
              name: props.name,
              checked,
              disabled: props.disabled,
              onChange: (e: Event) => {
                const next = (e.target as HTMLInputElement).checked
                if (props.modelValue === undefined) inner.value = next
                emit('update:modelValue', next)
                emit('change', next)
              },
            }),
            h('span', { class: 'sm-radio__box', 'aria-hidden': 'true' }),
          ]),
          text != null ? h('span', { class: 'sm-radio__label' }, Array.isArray(text) ? text : [text]) : null,
        ],
      )
    }
  },
})
