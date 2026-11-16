import { Steps } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'steps-basic',
    state: 'base',
    render: () => (
      <Steps
        current={1}
        style={{ width: 240 }}
        items={[{ title: '第一步' }, { title: '第二步' }]}
      />
    ),
  },
]
