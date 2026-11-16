import { Timeline } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'timeline-basic',
    state: 'base',
    render: () => <Timeline style={{ width: 200 }} items={[{ children: '事件一' }, { children: '事件二' }]} />,
  },
]
