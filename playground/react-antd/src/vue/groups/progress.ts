import type { VueCase } from '../types'
import { h } from 'vue'
import { Progress } from '@specmark/vue'

/*** Progress */
export const progressRenders: Record<string, VueCase> = {
  'ref-progress-basic': { component: 'Progress', render: () => h(Progress, { percent: 40 }) },
}
