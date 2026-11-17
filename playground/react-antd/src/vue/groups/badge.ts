import type { VueCase } from '../types'
import { h } from 'vue'
import { Badge } from '@specmark/vue'

/*** Badge */
export const badgeRenders: Record<string, VueCase> = {
  'ref-badge-basic': {
    component: 'Badge',
    render: () =>
      h(Badge, { count: 5 }, { default: () => h('span', { style: 'display:inline-block;width:40px;height:40px' }) }),
  },
}
