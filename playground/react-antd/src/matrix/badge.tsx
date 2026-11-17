import { Badge } from 'antd'
import type { CaseDef } from './types'

const box = { display: 'inline-block', width: 40, height: 40, background: '#ddd' } as const

export const cases: CaseDef[] = [
  {
    id: 'badge-basic',
    state: 'base',
    render: () => (
      <Badge count={5}>
        <span style={box} />
      </Badge>
    ),
  },
  { id: 'badge-dot', state: 'base', render: () => <Badge dot><span style={{ display: 'inline-block', width: 40, height: 40, background: '#ddd' }} /></Badge> },
  { id: 'badge-status', state: 'base', render: () => <Badge status="success" text="成功" /> },
]
