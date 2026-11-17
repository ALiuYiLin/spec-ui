import type { VueCase } from '../types'
import { h } from 'vue'
import { Alert } from '@specmark/vue'

/*** Alert */
export const alertRenders: Record<string, VueCase> = {
  'ref-alert-info': { component: 'Alert', render: () => h('div', { style: { width: '256px' } }, h(Alert, { type: 'info', message: '提示信息' })) },
  'ref-alert-success': { component: 'Alert', render: () => h('div', { style: { width: '256px' } }, h(Alert, { type: 'success', message: '成功提示' })) },
  'ref-alert-warning': { component: 'Alert', render: () => h('div', { style: { width: '256px' } }, h(Alert, { type: 'warning', message: '警告提示' })) },
  'ref-alert-error': { component: 'Alert', render: () => h('div', { style: { width: '256px' } }, h(Alert, { type: 'error', message: '错误提示' })) },
}
