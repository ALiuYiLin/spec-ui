import type { VueCase } from '../types'
import { h } from 'vue'
import { Input } from '@specmark/vue'

/*** Input */
export const inputRenders: Record<string, VueCase> = {
  'ref-input-warning': { component: 'Input', render: () => h(Input, { status: 'warning', modelValue: '内容' }) },
  'ref-input-filled': { component: 'Input', render: () => h(Input, { variant: 'filled', placeholder: '请输入' }) },
  'ref-input-borderless': { component: 'Input', render: () => h(Input, { variant: 'borderless', placeholder: '请输入' }) },
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
  'ref-input-suffix': {
    component: 'Input',
    render: () => h(Input, { modelValue: '内容', suffix: h('span', '元') }),
  },
  'ref-input-clear': {
    component: 'Input',
    render: () => h(Input, { allowClear: true, modelValue: '内容' }),
  },
}
