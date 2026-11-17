import type { VueCase } from '../types'
import { h } from 'vue'
import { Descriptions } from '@specmark/vue'

/*** Descriptions */
export const descriptionsRenders: Record<string, VueCase> = {
  'ref-descriptions-basic': {
    component: 'Descriptions',
    render: () => h(Descriptions, { items: [{ label: '标签', content: '内容' }] }),
  },
}
