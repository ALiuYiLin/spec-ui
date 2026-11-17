import type { VueCase } from '../types'
import { h } from 'vue'
import { Card } from '@specmark/vue'

/*** Card */
export const cardRenders: Record<string, VueCase> = {
  'ref-card-basic': {
    component: 'Card',
    // 与 antd 用例一致：240 宽、只有标题
    render: () =>
      h('div', { style: { width: '240px' } }, h(Card, { title: '标题' }, { default: () => '内容' })),
  },
}
