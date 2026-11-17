import type { VueCase } from '../types'
import { h } from 'vue'
import { Checkbox } from '@specmark/vue'

/*** Checkbox */
export const checkboxRenders: Record<string, VueCase> = {
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
  'ref-checkbox-disabled-checked': { component: 'Checkbox', render: () => h(Checkbox, { label: '选项', disabled: true, modelValue: true }) },
}
