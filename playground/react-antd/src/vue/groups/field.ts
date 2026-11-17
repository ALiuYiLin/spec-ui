import type { VueCase } from '../types'
import { h } from 'vue'
import { Field, Input } from '@specmark/vue'

/*** Field */
export const fieldRenders: Record<string, VueCase> = {
  'ref-field-basic': {
    component: 'Field',
    render: () => h(Field, { label: '用户名' }, { default: () => h(Input, { placeholder: '请输入' }) }),
  },
  'ref-field-required': {
    component: 'Field',
    render: () => h(Field, { label: '用户名', required: true }, { default: () => h(Input, { placeholder: '请输入' }) }),
  },
  'ref-field-error': {
    component: 'Field',
    render: () =>
      h(Field, { label: '用户名', status: 'error', error: '请填写用户名' }, {
        default: () => h(Input, { placeholder: '请输入' }),
      }),
  },
}
