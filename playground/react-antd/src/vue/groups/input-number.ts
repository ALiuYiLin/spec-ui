import type { VueCase } from '../types'
import { h } from 'vue'
import { InputNumber } from '@specmark/vue'

/*** InputNumber */
export const inputNumberRenders: Record<string, VueCase> = {
  'ref-input-number-basic': { component: 'InputNumber', render: () => h(InputNumber, { modelValue: 5 }) },
  'ref-input-number-disabled': { component: 'InputNumber', render: () => h(InputNumber, { disabled: true, modelValue: 5 }) },
  'ref-input-number-focus': {
    component: 'InputNumber',
    actions: [{ type: 'focus', selector: '.sm-input-number__input' }],
    render: () => h(InputNumber, { modelValue: 5 }),
  },
  'ref-input-number-error': { component: 'InputNumber', render: () => h(InputNumber, { status: 'error', modelValue: 5 }) },

}
