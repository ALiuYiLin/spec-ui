import { Result } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'result-info', state: 'base', render: () => <Result status="info" title="标题" style={{ width: 240 }} /> },
]
