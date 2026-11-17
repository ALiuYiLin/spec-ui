import type { VueCase } from '../types'
import { h } from 'vue'
import { Space } from '@specmark/vue'

/*** Space */
export const spaceRenders: Record<string, VueCase> = {
  'ref-space-basic': {
    component: 'Space',
    render: () => h(Space, null, { default: () => [h('span', null, '一'), h('span', null, '二')] }),
  },
}
