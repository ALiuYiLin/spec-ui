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
]
