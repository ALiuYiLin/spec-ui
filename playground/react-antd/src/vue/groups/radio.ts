import type { VueCase } from '../types'
import { h } from 'vue'
import { Radio } from '@specmark/vue'

/*** Radio */
export const radioRenders: Record<string, VueCase> = {
  'ref-radio-unchecked': { component: 'Radio', render: () => h(Radio, { label: '同意' }) },
  'ref-radio-checked': { component: 'Radio', render: () => h(Radio, { modelValue: true, label: '同意' }) },
  'ref-radio-disabled': { component: 'Radio', render: () => h(Radio, { disabled: true, label: '同意' }) },
  'ref-radio-focus': {
    component: 'Radio',
    actions: [{ type: 'focus', selector: '.sm-radio__input' }],
    render: () => h(Radio, { label: '同意' }),
  },
  'ref-radio-disabled-checked': { component: 'Radio', render: () => h(Radio, { label: '选项', disabled: true, modelValue: true }) },
}
