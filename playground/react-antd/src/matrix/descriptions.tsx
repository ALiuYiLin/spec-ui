import { Descriptions } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'descriptions-basic',
    state: 'base',
    render: () => (
      <Descriptions
        column={1}
        style={{ width: 240 }}
        items={[{ key: '1', label: '标签', children: '内容' }]}
      />
    ),
  },
]
