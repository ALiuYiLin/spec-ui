import { Alert } from 'antd'
import type { CaseDef } from './types'

export const cases: CaseDef[] = [
  {
    id: 'alert-info',
    state: 'base',
    render: () => <Alert type="info" message="提示信息" showIcon={false} />,
  },
  { id: 'alert-success', state: 'base', render: () => <Alert type="success" message="成功提示" /> },
  { id: 'alert-warning', state: 'base', render: () => <Alert type="warning" message="警告提示" /> },
  { id: 'alert-error', state: 'base', render: () => <Alert type="error" message="错误提示" /> },
]
