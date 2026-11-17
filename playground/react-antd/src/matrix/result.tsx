import { Result } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'result-info', state: 'base', render: () => <Result status="info" title="标题" style={{ width: 240 }} /> },
  { id: 'result-success', state: 'base', render: () => <Result status="success" title="成功" subTitle="副标题" /> },
  { id: 'result-error', state: 'base', render: () => <Result status="error" title="失败" subTitle="副标题" /> },
]
