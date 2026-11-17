import type { VueCase } from '../types'
import { h } from 'vue'
import { Spin } from '@specmark/vue'

/*** Spin */
export const spinRenders: Record<string, VueCase> = {
  'ref-spin-basic': { component: 'Spin', render: () => h(Spin) },
}
