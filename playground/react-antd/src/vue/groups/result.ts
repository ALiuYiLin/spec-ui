import type { VueCase } from '../types'
import { h } from 'vue'
import { Result } from '@specmark/vue'

/*** Result */
export const resultRenders: Record<string, VueCase> = {
  'ref-result-info': { component: 'Result', render: () => h(Result, { status: 'info', title: '标题' }) },
}
