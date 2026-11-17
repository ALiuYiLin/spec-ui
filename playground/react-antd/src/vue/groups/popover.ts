import type { VueCase } from '../types'
import { h } from 'vue'
import { Popover } from '@specmark/vue'

/*** Popover */
export const popoverRenders: Record<string, VueCase> = {
  'ref-popover-basic': {
    component: 'Popover',
    render: () => h(Popover, { title: '标题', content: '内容文字', open: true, side: 'top' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },
  'ref-popover-notitle': {
    component: 'Popover',
    render: () => h(Popover, { content: '只有内容', open: true, side: 'top' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },
}
