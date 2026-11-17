import type { RefCase } from '../types'
import { Result } from '@specmark/react'

/*** Result */
export const resultCases: RefCase[] = [
{
    id: 'ref-result-info',
    component: 'Result',
    render: () => (
      <div style={{ width: 256 }}>
        <Result status="info" title="标题" />
      </div>
    ),
    assert: [
      { k: 'data', key: 'status', value: 'info' },
      { k: 'part', name: 'icon' },
      { k: 'part', name: 'title' },
      { k: 'absent', name: 'subtitle' },
      { k: 'order', before: 'icon', after: 'title' },
    ],
  },
  {
    id: 'ref-result-success',
    component: 'Result',
    render: () => (
      <div style={{ width: 256 }}>
        <Result status="success" title="成功" subtitle="副标题" />
      </div>
    ),
    assert: [],
  },
  {
    id: 'ref-result-error',
    component: 'Result',
    render: () => (
      <div style={{ width: 256 }}>
        <Result status="error" title="失败" subtitle="副标题" />
      </div>
    ),
    assert: [],
  },
]
