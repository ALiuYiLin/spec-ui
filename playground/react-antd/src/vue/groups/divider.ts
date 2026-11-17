import type { VueCase } from '../types'
import { h } from 'vue'
import { Divider } from '@specmark/vue'

/*** Divider */
export const dividerRenders: Record<string, VueCase> = {
  'ref-divider-basic': { component: 'Divider', render: () => h(Divider) },
  'ref-divider-text': {
    component: 'Divider',
    // 与 antd 用例同样的容器宽度：divider 的宽度由父容器决定
    render: () => h('div', { style: { width: '256px' } }, h(Divider, null, { default: () => '文本' })),
  },
}
