import type { VueCase } from '../types'
import { h } from 'vue'
import { Dropdown } from '@specmark/vue'

/*** Dropdown */
export const dropdownRenders: Record<string, VueCase> = {
  'ref-dropdown-basic': {
    component: 'Dropdown',
    render: () =>
      h(
        Dropdown,
        {
          open: true,
          items: [
            { key: '1', label: '选项一' },
            { key: '2', label: '选项二' },
          ],
        },
        { default: () => h('button', { type: 'button' }, '更多') },
      ),
  },
}
