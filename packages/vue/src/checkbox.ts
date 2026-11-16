import { computed, defineComponent, h, ref, watchEffect } from 'vue'
import type { PropType, VNode } from 'vue'

export const Checkbox = defineComponent({
  name: 'SmCheckbox',
  props: {
    modelValue: { type: Boolean, default: undefined },
    indeterminate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
    content: { type: Object as PropType<VNode | null>, default: null },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const inner = ref(false)
    const inputEl = ref<HTMLInputElement | null>(null)
    const isChecked = computed(() => (props.modelValue !== undefined ? props.modelValue : inner.value))

    // indeterminate 只能通过 JS 属性设置
    watchEffect(() => {
      if (inputEl.value) inputEl.value.indeterminate = Boolean(props.indeterminate)
    })

    return () => {
      const state = props.indeterminate ? 'indeterminate' : isChecked.value ? 'checked' : 'unchecked'
      const text = props.content ?? (props.label || (slots.default ? slots.default() : null))

      return h(
        'label',
        { class: 'sm-checkbox', 'data-state': state, ...(props.disabled ? { 'data-disabled': 'true' } : {}) },
        [
          h('span', { class: 'sm-checkbox__control' }, [
            h('input', {
              ref: inputEl,
              class: 'sm-checkbox__input',
              type: 'checkbox',
              checked: isChecked.value,
              disabled: props.disabled,
              onChange: (e: Event) => {
                const next = (e.target as HTMLInputElement).checked
                if (props.modelValue === undefined) inner.value = next
                emit('update:modelValue', next)
              },
            }),
            h('span', { class: 'sm-checkbox__box', 'aria-hidden': 'true' }),
          ]),
          text != null ? h('span', { class: 'sm-checkbox__label' }, Array.isArray(text) ? text : [text]) : null,
        ],
      )
    }
  },
})
