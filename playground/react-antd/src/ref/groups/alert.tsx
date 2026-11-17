import type { RefCase } from '../types'
import { Alert } from '@specmark/react'

/*** Alert */
export const alertCases: RefCase[] = [
{
    id: 'ref-alert-info',
    component: 'Alert',
    render: () => <Alert type="info" message="提示信息" />,
    assert: [
      { k: 'data', key: 'type', value: 'info' },
      { k: 'attr', on: 'root', key: 'role', value: 'alert' },
      { k: 'part', name: 'message' },
      { k: 'absent', name: 'close' },
    ],
  },
]
