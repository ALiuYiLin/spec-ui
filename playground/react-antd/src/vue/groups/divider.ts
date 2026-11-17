import type { VueCase } from '../types'
import { h } from 'vue'
import { Divider } from '@specmark/vue'

/*** Divider */
export const dividerRenders: Record<string, VueCase> = {
  'ref-divider-basic': { component: 'Divider', render: () => h(Divider) },
  'ref-divider-text': { component: 'Divider', render: () => h(Divider, null, { default: () => '文本' }) },
}
