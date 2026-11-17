import type { VueCase } from '../types'
import { h } from 'vue'
import { Modal } from '@specmark/vue'

/*** Modal */
export const modalRenders: Record<string, VueCase> = {
  'ref-modal-basic': {
    component: 'Modal',
    render: () =>
      h(Modal, { open: true, title: '标题', footer: h('button', { type: 'button' }, '确定') }, {
        default: () => '内容文字',
      }),
  },
}
