import { Statistic } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'statistic-basic', state: 'base', render: () => <Statistic title="标题" value={1234} /> },
]
