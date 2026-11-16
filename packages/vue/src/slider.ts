import { defineComponent, h, ref } from 'vue'
import type { PropType } from 'vue'

export type SliderOrientation = 'horizontal' | 'vertical'

export const Slider = defineComponent({
  name: 'SmSlider',
  props: {
    modelValue: { type: Number, default: undefined },
    defaultValue: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
    orientation: { type: String as PropType<SliderOrientation>, default: 'horizontal' },
    ariaLabel: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const inner = ref(props.defaultValue)
    const current = () => (props.modelValue !== undefined ? props.modelValue : inner.value)
    const percent = () => (props.max === props.min ? 0 : ((current() - props.min) / (props.max - props.min)) * 100)

    const setValue = (next: number) => {
      const clamped = Math.min(props.max, Math.max(props.min, next))
      if (props.modelValue === undefined) inner.value = clamped
      emit('update:modelValue', clamped)
      emit('change', clamped)
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (props.disabled) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault()
          setValue(current() + props.step)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault()
          setValue(current() - props.step)
          break
        case 'Home':
          e.preventDefault()
          setValue(props.min)
          break
        case 'End':
          e.preventDefault()
          setValue(props.max)
          break
        default:
          break
      }
    }

    return () => {
      const horizontal = props.orientation === 'horizontal'
      return h(
        'div',
        {
          class: 'sm-slider',
          'data-orientation': props.orientation,
          ...(props.disabled ? { 'data-disabled': 'true' } : {}),
        },
        [
          h('div', { class: 'sm-slider__rail', 'aria-hidden': 'true' }),
          h('div', {
            class: 'sm-slider__track',
            'aria-hidden': 'true',
            style: horizontal ? { width: `${percent()}%` } : { height: `${percent()}%` },
          }),
          h('div', {
            class: 'sm-slider__handle',
            role: 'slider',
            tabindex: props.disabled ? -1 : 0,
            'aria-valuenow': current(),
            'aria-valuemin': props.min,
            'aria-valuemax': props.max,
            'aria-orientation': props.orientation,
            'aria-label': props.ariaLabel,
            'aria-disabled': props.disabled ? 'true' : undefined,
            style: horizontal ? { left: `${percent()}%` } : { bottom: `${percent()}%` },
            onKeydown,
          }),
        ],
      )
    }
  },
})
