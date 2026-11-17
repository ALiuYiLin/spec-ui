import type { RefCase } from '../types'
import { Alert } from '@specmark/react'

/*** Alert */
export const alertCases: RefCase[] = [
{
    id: 'ref-alert-info',
    component: 'Alert',
    render: () => (
      <div style={{ width: 256 }}>
        <Alert type="info" message="提示信息" />
      </div>
    ),
    assert: [
      { k: 'data', key: 'type', value: 'info' },
      { k: 'attr', on: 'root', key: 'role', value: 'alert' },
      { k: 'part', name: 'message' },
      { k: 'absent', name: 'close' },
    ],
  },
  {
    id: 'ref-alert-success',
    component: 'Alert',
    render: () => (
      <div style={{ width: 256 }}>
        <Alert type="success" message="成功提示" />
      </div>
    ),
    assert: [],
  },
  {
    id: 'ref-alert-warning',
    component: 'Alert',
    render: () => (
      <div style={{ width: 256 }}>
        <Alert type="warning" message="警告提示" />
      </div>
    ),
    assert: [],
  },
  {
    id: 'ref-alert-error',
    component: 'Alert',
    render: () => (
      <div style={{ width: 256 }}>
        <Alert type="error" message="错误提示" />
      </div>
    ),
    assert: [],
  },
  {
    id: 'ref-alert-closable',
    component: 'Alert',
    render: () => (
      <div style={{ width: 256 }}>
        <Alert type="info" message="提示信息" closable />
      </div>
    ),
    assert: [{ k: 'part', name: 'close' }],
  },
]
