import type { VueCase } from '../types'
import { h } from 'vue'
import { Empty } from '@specmark/vue'

/*** Empty */
export const emptyRenders: Record<string, VueCase> = {
  'ref-empty-basic': { component: 'Empty', render: () => h(Empty) },

}
