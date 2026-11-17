import type { VueCase } from '../types'
import { h } from 'vue'
import { Steps } from '@specmark/vue'

/*** Steps */
export const stepsRenders: Record<string, VueCase> = {
  'ref-steps-basic': {
    component: 'Steps',
    render: () => h(Steps, { current: 1, items: [{ title: '第一步' }, { title: '第二步' }] }),
  },
}
