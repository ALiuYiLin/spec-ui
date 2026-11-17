import type { VueCase } from '../types'
import { h } from 'vue'
import { Statistic } from '@specmark/vue'

/*** Statistic */
export const statisticRenders: Record<string, VueCase> = {
  'ref-statistic-basic': { component: 'Statistic', render: () => h(Statistic, { title: '标题', value: 1234 }) },
}
