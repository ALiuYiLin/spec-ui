import { Progress } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'progress-basic', state: 'base', render: () => <Progress percent={40} style={{ width: 200 }} /> },
]
