import { Divider } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'divider-basic', state: 'base', render: () => <Divider style={{ width: 200 }} /> },
  { id: 'divider-text', state: 'base', render: () => <Divider style={{ width: 200 }}>文本</Divider> },
]
