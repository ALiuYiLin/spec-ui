import type { VueCase } from '../types'
import { h } from 'vue'
import { Result } from '@specmark/vue'

/*** Result */
export const resultRenders: Record<string, VueCase> = {
  'ref-result-info': { component: 'Result', render: () => h('div', { style: { width: '256px' } }, h(Result, { status: 'info', title: '标题' })) },
  'ref-result-success': { component: 'Result', render: () => h('div', { style: { width: '256px' } }, h(Result, { status: 'success', title: '成功', subtitle: '副标题' })) },
  'ref-result-error': { component: 'Result', render: () => h('div', { style: { width: '256px' } }, h(Result, { status: 'error', title: '失败', subtitle: '副标题' })) },
}
