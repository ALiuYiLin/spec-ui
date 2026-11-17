import type { VueCase } from '../types'
import { h } from 'vue'
import { Tooltip } from '@specmark/vue'

/*** Tooltip */
export const tooltipRenders: Record<string, VueCase> = {
  'ref-tooltip-top': {
    component: 'Tooltip',
    render: () => h(Tooltip, { title: '提示文字', open: true, side: 'top' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },
  'ref-tooltip-bottom': {
    component: 'Tooltip',
    render: () => h(Tooltip, { title: '提示文字', open: true, side: 'bottom' }, { default: () => h('button', { type: 'button' }, '悬停') }),
  },
}
