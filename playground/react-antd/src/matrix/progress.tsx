import { Progress } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'progress-basic', state: 'base', render: () => <Progress percent={40} style={{ width: 200 }} /> },
  { id: 'progress-success', state: 'base', render: () => <Progress percent={100} status="success" /> },
  { id: 'progress-exception', state: 'base', render: () => <Progress percent={70} status="exception" /> },
]
