import { Space } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'space-basic',
    state: 'base',
    render: () => (
      <Space>
        <span>一</span>
        <span>二</span>
      </Space>
    ),
  },
]
