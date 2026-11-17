import type { VueCase } from '../types'
import { h } from 'vue'
import { Card } from '@specmark/vue'

/*** Card */
export const cardRenders: Record<string, VueCase> = {
  'ref-card-basic': {
    component: 'Card',
    render: () =>
      h(Card, { title: '标题', extra: h('span', null, '更多') }, { default: () => '内容' }),
  },
}
