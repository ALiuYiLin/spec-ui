import type { VueCase } from '../types'
import { h } from 'vue'
import { Progress } from '@specmark/vue'

/*** Progress */
export const progressRenders: Record<string, VueCase> = {
  'ref-progress-basic': { component: 'Progress', render: () => h('div', { style: { width: '256px' } }, h(Progress, { percent: 40 })) },
  'ref-progress-success': { component: 'Progress', render: () => h('div', { style: { width: '256px' } }, h(Progress, { percent: 100, status: 'success' })) },
  'ref-progress-exception': { component: 'Progress', render: () => h('div', { style: { width: '256px' } }, h(Progress, { percent: 70, status: 'exception' })) },
}
