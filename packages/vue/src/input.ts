import { computed, defineComponent, h, ref } from 'vue'
import type { PropType, VNode } from 'vue'
import { CloseIcon } from './icons'

export type InputVariant = 'outlined' | 'filled' | 'borderless'
export type InputSize = 'sm' | 'md' | 'lg'
export type InputStatus = 'default' | 'error' | 'warning'

export const Input = defineComponent({
  name: 'SmInput',
  props: {
    variant: { type: String as PropType<InputVariant>, default: 'outlined' },
    size: { type: String as PropType<InputSize>, default: 'md' },
    status: { type: String as PropType<InputStatus>, default: 'default' },
    allowClear: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    placeholder: { type: String, default: undefined },
    modelValue: { type: String, default: undefined },
    prefix: { type: Object as PropType<VNode | null>, default: null },
    suffix: { type: Object as PropType<VNode | null>, default: null },
    ariaLabel: { type: String, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const inner = ref('')
    const current = computed(() => (props.modelValue !== undefined ? props.modelValue : inner.value))
    const hasValue = computed(() => String(current.value ?? '').length > 0)
    // 前缀/后缀既可以传 VNode prop，也可以用同名插槽
    const prefixNode = computed(() => props.prefix ?? (slots.prefix ? slots.prefix() : null))
    const suffixNode = computed(() => props.suffix ?? (slots.suffix ? slots.suffix() : null))
    const withAffix = computed(() => Boolean(prefixNode.value || suffixNode.value || props.allowClear))

    const setValue = (value: string) => {
      if (props.modelValue === undefined) inner.value = value
      emit('update:modelValue', value)
    }

    const dataProps = () => ({
      'data-variant': props.variant,
      'data-size': props.size,
      'data-status': props.status,
      ...(props.disabled ? { 'data-disabled': 'true' } : {}),
      ...(props.readOnly ? { 'data-readonly': 'true' } : {}),
    })

    return () => {
      const field = h('input', {
        class: withAffix.value ? 'sm-input__field' : 'sm-input',
        ...(withAffix.value ? {} : dataProps()),
        value: current.value,
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readOnly,
        'aria-label': props.ariaLabel,
        'aria-invalid': props.status === 'error' ? 'true' : undefined,
        onInput: (e: Event) => setValue((e.target as HTMLInputElement).value),
      })

      if (!withAffix.value) return field

      return h('span', { class: 'sm-input', ...dataProps() }, [
        prefixNode.value ? h('span', { class: 'sm-input__prefix' }, prefixNode.value) : null,
        field,
        props.allowClear && hasValue.value && !props.disabled && !props.readOnly
          ? h(
              'span',
              {
                class: 'sm-input__clear',
                'aria-hidden': 'true',
                onMousedown: (e: MouseEvent) => {
                  e.preventDefault()
                  setValue('')
                },
              },
              [h(CloseIcon)],
            )
          : null,
        suffixNode.value && !(props.allowClear && hasValue.value)
          ? h('span', { class: 'sm-input__suffix' }, suffixNode.value)
          : null,
      ])
    }
  },
})
