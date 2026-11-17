import type { RefCase } from '../types'
import { Modal } from '@specmark/react'

/*** Modal */
export const modalCases: RefCase[] = [
{
    id: 'ref-modal-basic',
    component: 'Modal',
    render: () => (
      <Modal open title="标题" footer={<button type="button">确定</button>}>
        内容文字
      </Modal>
    ),
    assert: [
      { k: 'data', key: 'state', value: 'open' },
      { k: 'part', name: 'mask' },
      { k: 'part', name: 'dialog' },
      { k: 'part', name: 'header' },
      { k: 'part', name: 'title' },
      { k: 'part', name: 'body' },
      { k: 'attr', on: 'dialog', key: 'role', value: 'dialog' },
      { k: 'attr', on: 'dialog', key: 'aria-modal', value: 'true' },
      { k: 'order', before: 'mask', after: 'dialog' },
      { k: 'childOf', on: 'title', of: 'header' },
    ],
  },
]
