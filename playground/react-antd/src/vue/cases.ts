import { h } from 'vue'
import type { VNodeChild } from 'vue'
import { Button, Checkbox, Input, Select } from '@specmark/vue'

export type VueAction =
  | { type: 'focus'; selector: string }
  | { type: 'press'; key: string }
  | { type: 'click'; selector: string }

export type VueCase = {
  id: string
  component: 'Button' | 'Select' | 'Input' | 'Checkbox'
  actions?: VueAction[]
  /** 断言刻意留空：Vue 实现靠通用规则 + L3 计算样式比对来判，
   *  逐用例断言只在 React 参考实现里写一份，避免两套实现各维护一遍。 */
  assert: never[]
}

const OPTIONS = [
  { value: 'a', label: '选项 A' },
  { value: 'b', label: '选项 B' },
  { value: 'c', label: '选项 C' },
]
const icon = () =>
  h(
    'svg',
    { viewBox: '0 0 16 16', width: '1em', height: '1em', fill: 'none', stroke: 'currentColor', 'aria-hidden': 'true' },
    [h('circle', { cx: 8, cy: 8, r: 6 })],
  )

/** id 与 React 用例一一对应，这样 L3 的 pair 表可以原样复用 */
export const renders: Record<string, { component: VueCase['component']; actions?: VueAction[]; render: () => VNodeChild }> = {
  'ref-button-default': { component: 'Button', render: () => h(Button, { label: '默认' }) },
  'ref-button-primary': { component: 'Button', render: () => h(Button, { variant: 'primary', label: '提交' }) },
  'ref-button-size-lg': { component: 'Button', render: () => h(Button, { variant: 'primary', size: 'lg', label: '大' }) },
  'ref-button-circle': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', shape: 'circle', icon: h(icon), ariaLabel: '搜索' }),
  },
  'ref-button-icon': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', icon: h(icon), label: '搜索' }),
  },
  'ref-button-loading': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', loading: true, label: '提交' }),
  },
  'ref-button-loading-icon': {
    component: 'Button',
    render: () => h(Button, { loading: true, icon: h(icon), label: '提交' }),
  },
  'ref-button-disabled': {
    component: 'Button',
    render: () => h(Button, { variant: 'primary', disabled: true, label: '提交' }),
  },
  'ref-button-danger-block': { component: 'Button', render: () => h(Button, { danger: true, block: true, label: '删除' }) },
  'ref-button-text': { component: 'Button', render: () => h(Button, { variant: 'text', label: '文本' }) },
  'ref-button-autospace': { component: 'Button', render: () => h(Button, { label: '提交' }) },
  'ref-button-autospace-skip-with-icon': {
    component: 'Button',
    render: () => h(Button, { icon: h(icon), label: '提交' }),
  },

  'ref-select-closed': { component: 'Select', render: () => h(Select, { options: OPTIONS }) },
  'ref-select-filled': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, modelValue: 'b' }),
  },
  'ref-select-clear': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, modelValue: 'b', allowClear: true }),
  },
  'ref-select-no-clear-without-value': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, allowClear: true }),
  },
  'ref-select-open': { component: 'Select', render: () => h(Select, { options: OPTIONS, open: true }) },
  'ref-select-open-selected': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, open: true, modelValue: 'b' }),
  },
  'ref-select-open-highlighted': {
    component: 'Select',
    actions: [
      { type: 'focus', selector: '.sm-select__input' },
      { type: 'press', key: 'ArrowDown' },
    ],
    render: () => h(Select, { options: OPTIONS }),
  },
  'ref-select-open-empty': {
    component: 'Select',
    render: () => h(Select, { options: [], open: true }),
  },
  'ref-select-focused': {
    component: 'Select',
    actions: [{ type: 'focus', selector: '.sm-select__input' }],
    render: () => h(Select, { options: OPTIONS }),
  },
  'ref-select-disabled': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, disabled: true, modelValue: 'b' }),
  },
  'ref-select-status-error': {
    component: 'Select',
    render: () => h(Select, { options: OPTIONS, status: 'error', modelValue: 'b' }),
  },
  'ref-select-size-sm': { component: 'Select', render: () => h(Select, { options: OPTIONS, size: 'sm' }) },

  'ref-input-basic': { component: 'Input', render: () => h(Input, { placeholder: '请输入' }) },
  'ref-input-value': { component: 'Input', render: () => h(Input, { modelValue: '内容' }) },
  'ref-input-disabled': { component: 'Input', render: () => h(Input, { disabled: true, modelValue: '内容' }) },
  'ref-input-readonly': { component: 'Input', render: () => h(Input, { readOnly: true, modelValue: '内容' }) },
  'ref-input-error': { component: 'Input', render: () => h(Input, { status: 'error', modelValue: '内容' }) },
  'ref-input-sm': { component: 'Input', render: () => h(Input, { size: 'sm', placeholder: '请输入' }) },
  'ref-input-lg': { component: 'Input', render: () => h(Input, { size: 'lg', placeholder: '请输入' }) },
  'ref-input-focus': {
    component: 'Input',
    actions: [{ type: 'focus', selector: '.sm-input' }],
    render: () => h(Input, { placeholder: '请输入' }),
  },
  'ref-input-prefix': {
    component: 'Input',
    render: () => h(Input, { prefix: h('span', null, '￥'), placeholder: '请输入' }),
  },
  'ref-input-clear': {
    component: 'Input',
    render: () => h(Input, { allowClear: true, modelValue: '内容' }),
  },

  'ref-checkbox-unchecked': { component: 'Checkbox', render: () => h(Checkbox, { label: '同意' }) },
  'ref-checkbox-checked': { component: 'Checkbox', render: () => h(Checkbox, { modelValue: true, label: '同意' }) },
  'ref-checkbox-indeterminate': { component: 'Checkbox', render: () => h(Checkbox, { indeterminate: true, label: '同意' }) },
  'ref-checkbox-disabled': { component: 'Checkbox', render: () => h(Checkbox, { disabled: true, label: '同意' }) },
  'ref-checkbox-nolabel': { component: 'Checkbox', render: () => h(Checkbox) },
  'ref-checkbox-focus': {
    component: 'Checkbox',
    actions: [{ type: 'focus', selector: '.sm-checkbox__input' }],
    render: () => h(Checkbox, { label: '同意' }),
  },
}

export const caseIds = Object.keys(renders)
