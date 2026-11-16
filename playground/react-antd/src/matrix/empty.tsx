import { Empty } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [{ id: 'empty-basic', state: 'base', render: () => <Empty /> }]
