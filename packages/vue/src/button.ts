import { defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'
import { SpinnerIcon } from './icons'
import { normalizeLabel } from './text'

export type ButtonVariant = 'default' | 'primary' | 'dashed' | 'text' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonShape = 'default' | 'round' | 'circle'
export type ButtonType = 'button' | 'submit' | 'reset'

export const Button = defineComponent({
  name: 'SmButton',
  props: {
    variant: { type: String as PropType<ButtonVariant>, default: 'default' },
    size: { type: String as PropType<ButtonSize>, default: 'md' },
    shape: { type: String as PropType<ButtonShape>, default: 'default' },
    danger: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    htmlType: { type: String as PropType<ButtonType>, default: 'button' },
    label: { type: String, default: '' },
    icon: { type: Object as PropType<VNode | null>, default: null },
    ariaLabel: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () => {
      const showSpinner = Boolean(props.loading)
      const showIcon = props.icon != null && !showSpinner
      const text = props.label ? normalizeLabel(props.label, showIcon, props.variant) : ''
      const content = text ? [text] : slots.default ? slots.default() : []

      return h(
        'button',
        {
          type: props.htmlType,
          class: 'sm-btn',
          'data-variant': props.variant,
          'data-size': props.size,
          'data-shape': props.shape,
          ...(props.danger ? { 'data-danger': 'true' } : {}),
          ...(props.block ? { 'data-block': 'true' } : {}),
          ...(showSpinner ? { 'data-loading': 'true', 'aria-busy': 'true' } : {}),
          ...(props.disabled ? { 'data-disabled': 'true', disabled: true } : {}),
          ...(props.ariaLabel ? { 'aria-label': props.ariaLabel } : {}),
        },
        [
          showSpinner ? h('span', { class: 'sm-btn__spinner', 'aria-hidden': 'true' }, [h(SpinnerIcon)]) : null,
          showIcon ? h('span', { class: 'sm-btn__icon', 'aria-hidden': 'true' }, [props.icon]) : null,
          h('span', { class: 'sm-btn__label' }, content),
        ],
      )
    }
  },
})
