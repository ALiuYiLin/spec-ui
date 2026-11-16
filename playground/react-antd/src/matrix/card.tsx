import { Card } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'card-basic',
    state: 'base',
    render: () => (
      <Card title="标题" style={{ width: 240 }}>
        内容
      </Card>
    ),
  },
]
