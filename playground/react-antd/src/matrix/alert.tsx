import { Alert } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'alert-info',
    state: 'base',
    render: () => <Alert type="info" message="提示信息" showIcon={false} />,
  },
]
