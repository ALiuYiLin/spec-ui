import type { VueCase } from '../types'
import { h } from 'vue'
import { Switch } from '@specmark/vue'

/*** Switch */
export const switchRenders: Record<string, VueCase> = {
  'ref-switch-off': { component: 'Switch', render: () => h(Switch) },
  'ref-switch-on': { component: 'Switch', render: () => h(Switch, { modelValue: true }) },
  'ref-switch-disabled': { component: 'Switch', render: () => h(Switch, { disabled: true }) },
  'ref-switch-focus': {
    component: 'Switch',
    actions: [{ type: 'focus', selector: '.sm-switch' }],
    render: () => h(Switch),
  },
  'ref-switch-small': { component: 'Switch', render: () => h(Switch, { size: 'sm' }) },

}
