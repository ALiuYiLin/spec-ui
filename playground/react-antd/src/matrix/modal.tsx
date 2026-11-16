import { Modal } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'modal-basic',
    state: 'open',
    portal: false,
    render: () => (
      <Modal open title="标题" onCancel={() => undefined} getContainer={false}>
        内容文字
      </Modal>
    ),
  },
]
