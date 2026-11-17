import type { VueCase } from '../types'
import { h } from 'vue'
import { Spin } from '@specmark/vue'

/*** Spin */
export const spinRenders: Record<string, VueCase> = {
  'ref-spin-basic': { component: 'Spin', render: () => h(Spin) },
  'ref-spin-sm': { component: 'Spin', render: () => h(Spin, { size: 'sm' }) },
  'ref-spin-lg': { component: 'Spin', render: () => h(Spin, { size: 'lg' }) },
}
