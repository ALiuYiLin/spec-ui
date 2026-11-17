import type { VueCase } from '../types'
import { h } from 'vue'
import { Alert } from '@specmark/vue'

/*** Alert */
export const alertRenders: Record<string, VueCase> = {
  'ref-alert-info': { component: 'Alert', render: () => h(Alert, { type: 'info', message: '提示信息' }) },
}
