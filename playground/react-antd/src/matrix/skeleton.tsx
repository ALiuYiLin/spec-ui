import { Skeleton } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  { id: 'skeleton-basic', state: 'base', render: () => <Skeleton style={{ width: 200 }} active={false} /> },
]
