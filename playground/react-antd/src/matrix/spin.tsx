import { Spin } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'spin-basic', state: 'base', render: () => <Spin /> },
  { id: 'spin-sm', state: 'base', render: () => <Spin size="small" /> },
  { id: 'spin-lg', state: 'base', render: () => <Spin size="large" /> },
]
