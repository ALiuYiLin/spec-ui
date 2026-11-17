import type { VueCase } from '../types'
import { h } from 'vue'
import { Statistic } from '@specmark/vue'

/*** Statistic */
export const statisticRenders: Record<string, VueCase> = {
  'ref-statistic-basic': { component: 'Statistic', render: () => h('div', { style: { width: '256px' } }, h(Statistic, { title: '标题', value: 1234 })) },
  'ref-statistic-precision': { component: 'Statistic', render: () => h('div', { style: { width: '256px' } }, h(Statistic, { title: '金额', value: 1234.5, precision: 2 })) },
}
